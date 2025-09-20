module Api
  class RecipesController < ApplicationController

    skip_before_action :authenticate_user!,     only: [:index, :show], raise: false
    skip_before_action :authenticate_api_user!, only: [:index, :show], raise: false


    def index
      keyword        = params[:keyword]
      cooking_time   = params[:cooking_time]     # （調理時間）
      price_range    = params[:price_range]      # （価格帯）
      nutrition_type = params[:nutrition_type]   # （栄養タイプ）
      sort_by        = params[:sortBy] || 'created_at'
      order          = params[:order]  || 'asc'
    
      # 画像URL用のホスト（host＝ドメイン）
      host = Rails.env.production? ? "https://back-main.fly.dev" : "http://localhost:3000"
    
      # ベースクエリ：関連の事前読込（includes＝関連をまとめて取る最適化）
      recipes = Recipe
        .includes(:ingredients, :category, :user, :tags)  # ← :tags も追加
        .references(:category)                             # （orderやwhereでcategoryを使う場合の保険）
    
      # --- 絞り込み（DB側） ---
    
      # キーワード検索（ILIKE＝大文字小文字を区別しない部分一致）
      if keyword.present?
        like = "%#{keyword}%"
        recipes = recipes.where('recipes.title ILIKE ? OR recipes.description ILIKE ?', like, like)
      end
    
      # 価格帯
      if price_range.present?
        case price_range
        when 'low'    then recipes = recipes.where('recipes.price <= ?', 500)
        when 'medium' then recipes = recipes.where('recipes.price > ? AND recipes.price <= ?', 500, 1000)
        when 'high'   then recipes = recipes.where('recipes.price > ?', 1000)
        end
      end
    
      # 調理時間
      if cooking_time.present?
        case cooking_time
        when 'short'  then recipes = recipes.where('recipes.cooking_time <= ?', 30)
        when 'medium' then recipes = recipes.where('recipes.cooking_time > ? AND recipes.cooking_time <= ?', 30, 60)
        when 'long'   then recipes = recipes.where('recipes.cooking_time > ?', 60)
        end
      end
    
      # タグで絞る（tags は関連：joins＝結合、where＝条件）
      if params[:tag].present?
        recipes = recipes.joins(:tags).where(tags: { name: params[:tag] })
      end
    
    
      # 栄養タイプ（Ruby側で並び替え）。DBの集計に移すのは後日でOK
      if nutrition_type.present?
        recipes = recipes.to_a.sort_by do |recipe|
          p_total = recipe.ingredients.sum(&:protein).to_f
          c_total = recipe.ingredients.sum(&:carbohydrate).to_f
          f_total = recipe.ingredients.sum(&:fat).to_f
    
          case nutrition_type
          when 'high_protein' then -p_total # 多い順
          when 'low_carb'     then  c_total # 少ない順
          when 'low_fat'      then  f_total # 少ない順
          else 0
          end
        end
      end
    
      # 並び替え（order＝昇順/降順）
      if recipes.is_a?(ActiveRecord::Relation)
        order_conditions = []
        order_conditions << "recipes.price #{order.upcase}"         if price_range.present?
        order_conditions << "recipes.cooking_time #{order.upcase}"  if cooking_time.present?
        recipes = recipes.order(order_conditions.join(", ")) unless order_conditions.empty?
      else
        # Array になっている（上の nutrition_type で sort_by 済み）場合の二次ソート
        recipes = recipes.sort_by do |recipe|
          [
            price_range.present?    ? recipe.price        : 0,
            cooking_time.present?   ? recipe.cooking_time : 0
          ]
        end
        recipes.reverse! if order == 'desc'
      end
    
      # --- 返却JSON（フロントが読みやすい形に整形） ---
      render json: Array(recipes).map { |r|
        {
          id:            r.id,
          title:         r.title,
          description:   r.description,
          cooking_time:  r.cooking_time,
          price:         r.price,
          # category は「名前」に寄せる（オブジェクトのままにしたいなら {id,name} に戻してOK）
          category:      r.category&.name,

          # ▼ tags は関連（association＝モデル間のつながり）から名前だけを配列で返す
          tags:         (r.association(:tags).loaded? ? r.tags.map(&:name) : r.tags.pluck(:name)),
          # 画像URL（ActiveStorageのURLヘルパ）
          image_url:     (r.image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(r.image, host: host) : nil),
          # 必要なら ingredients / user を追加（ここでは省略）
        }
      }
    end
    

    def show
      Current.user = current_user
      recipe = Recipe.includes(:recipe_ingredients, :ingredients, :category, :user, :steps).find_by(id: params[:id])

      fav = current_user&.favorites&.find_by(recipe_id: recipe.id)

    
      if recipe
        total_protein = recipe.ingredients.sum(&:protein)
        total_carbohydrate = recipe.ingredients.sum(&:carbohydrate)
        total_fat = recipe.ingredients.sum(&:fat)
    
        render json: {
          id: recipe.id,
          title: recipe.title, 
          description: recipe.description, 
          cooking_time: recipe.cooking_time, 
          steps: recipe.steps, 
          price: recipe.price, 
          image_url: recipe.image_url,
          category_name: recipe.category&.name,
          user_name: recipe.user&.name,
          total_nutrition: {
            protein: total_protein,
            carbohydrate: total_carbohydrate,
            fat: total_fat
          },
          ingredients: recipe.recipe_ingredients.map do |ri|
            {
              name: ri.ingredient.name,
              quantity: ri.quantity
            }
          end,
          is_favorite: fav.present?,
          favorite_id: fav&.id         
        }
      else
        render json: { error: 'Recipe not found' }, status: :not_found
      end
    end


    def create
      Rails.logger.debug "受け取った params: #{params.inspect}"  # 受け取ったパラメータの確認
    
      @recipe = Recipe.new(recipe_params.except(:ingredients, :steps_attributes)) # ingredients を除外して保存
    
      if params[:recipe][:steps_attributes].is_a?(String)
        begin
          params[:recipe][:steps_attributes] = JSON.parse(params[:recipe][:steps_attributes])
        rescue JSON::ParserError => e
          Rails.logger.error "JSON parse error in steps_attributes: #{e.message}"
          return render json: { error: "Invalid JSON format for steps_attributes" }, status: :unprocessable_entity
        end
      end

      @recipe.assign_attributes(recipe_params.slice(:steps_attributes))

      if @recipe.save
        @recipe.image.attach(params[:image]) if params[:image].present?
        Rails.logger.debug "✅ image attachedされた?: #{@recipe.image.attached?}"
        Rails.logger.debug "🔗 image_url: #{url_for(@recipe.image) if @recipe.image.attached?}"
        
        if params[:recipe][:ingredients].present?
          Rails.logger.debug "ingredients param: #{params[:recipe][:ingredients].inspect}" # ログで確認
    
          begin
            # JSON 形式で送られてくる場合を考慮
            ingredients = params[:recipe][:ingredients].is_a?(String) ? JSON.parse(params[:recipe][:ingredients]) : params[:recipe][:ingredients]
    
            ingredients.each do |ingredient|
              RecipeIngredient.create!(
                recipe: @recipe,
                ingredient_id: ingredient['ingredient_id'], # JSON の場合は String キー
                quantity: ingredient['quantity']
              )
            end
            
          rescue JSON::ParserError => e
            Rails.logger.error "JSON parse error in ingredients: #{e.message}"
            return render json: { error: "Invalid JSON format for ingredients" }, status: :unprocessable_entity
          rescue ActiveRecord::RecordInvalid => e
            Rails.logger.error "RecipeIngredient save failed: #{e.record.errors.full_messages}"
            return render json: { error: "Failed to save ingredients", details: e.record.errors.full_messages }, status: :unprocessable_entity
          end
        end
    
        render json: @recipe.serializable_hash(include: [:ingredients, :steps]).merge({
          image_url: @recipe.image.attached? ? url_for(@recipe.image) : nil
        })
            
      else
        Rails.logger.error "Recipe save failed: #{@recipe.errors.full_messages}"  # エラー内容をログに出力
        render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
      end

      skip_before_action :authenticate_user!,     only: [:index, :show], raise: false
    skip_before_action :authenticate_api_user!, only: [:index, :show], raise: false
    
    end

    private

    def is_favorite
      return false unless Current.user
      Current.user.favorites.exists?(recipe_id: self.id)
    end    

    def set_recipe
      @recipe = Recipe.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Recipe not found' }, status: :not_found
    end

    def recipe_params
      params.require(:recipe).permit(
        :title,
        :description,
        :cooking_time,
        :price,
        :user_id,
        :category_id,
        :image,  
        ingredients: [:ingredient_id, :quantity],  
        steps_attributes: [:step_number, :instruction],  # steps_attributesを許可
        recipe_ingredients_attributes: [:ingredient_id, :quantity]
      )

      
    end      
  end
end
