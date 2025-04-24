module Api
  class RecipesController < ApplicationController

    include Rails.application.routes.url_helpers

    def index
      keyword = params[:keyword]
      cooking_time = params[:cooking_time] # 調理時間
      price_range = params[:price_range]  # 価格帯
      nutrition_type = params[:nutrition_type] # 栄養タイプ
      sort_by = params[:sortBy] || 'created_at' # ソート項目
      order = params[:order] || 'asc' # 
      
      host = Rails.env.production? ? "https://back-main.fly.dev" : "http://localhost:3000"

      # ベースクエリ
      recipes = Recipe.includes(:ingredients, :category, :user)


 # キーワード検索
 if keyword.present?
  recipes = recipes.where('title ILIKE ? OR description ILIKE ?', "%#{keyword}%", "%#{keyword}%")
end

# 価格帯の条件
if price_range.present?
  case price_range
  when 'low'
    recipes = recipes.where('price <= ?', 500)
  when 'medium'
    recipes = recipes.where('price > ? AND price <= ?', 500, 1000)
  when 'high'
    recipes = recipes.where('price > ?', 1000)
  end
end

# 調理時間の条件
if cooking_time.present?
  case cooking_time
  when 'short'
    recipes = recipes.where('cooking_time <= ?', 30)
  when 'medium'
    recipes = recipes.where('cooking_time > ? AND cooking_time <= ?', 30, 60)
  when 'long'
    recipes = recipes.where('cooking_time > ?', 60)
  end
end

# 栄養タイプの条件（Ruby側で並び替え）
if nutrition_type.present?
  recipes = recipes.sort_by do |recipe|
    total_protein = recipe.ingredients.sum(&:protein).to_f
    total_carbohydrate = recipe.ingredients.sum(&:carbohydrate).to_f
    total_fat = recipe.ingredients.sum(&:fat).to_f

    Rails.logger.info "Recipe ID: #{recipe.id}, Protein: #{total_protein}, Carbohydrate: #{total_carbohydrate}, Fat: #{total_fat}"

    case nutrition_type
    when 'high_protein'
      -total_protein # 多い順（降順）
    when 'low_carb'
      total_carbohydrate # 少ない順（昇順）
    when 'low_fat'
      total_fat # 少ない順（昇順）
    else
      0
    end
  end
end

# 最終的な並び替えを適用
if recipes.is_a?(ActiveRecord::Relation)
  order_conditions = []
  order_conditions << "price #{order.upcase}" if price_range.present?
  order_conditions << "cooking_time #{order.upcase}" if cooking_time.present?

  # ActiveRecord::Relation に適用
  recipes = recipes.order(order_conditions.join(", ")) unless order_conditions.empty?
else
  # recipes が Array の場合、sort_by で並び替え
  recipes = recipes.sort_by do |recipe|
    [
      price_range.present? ? recipe.price : 0,
      cooking_time.present? ? recipe.cooking_time : 0
    ]
  end
  recipes.reverse! if order == 'desc'
end

  #表示部分
  render json: recipes.map { |recipe|
    recipe.as_json(
      only: [:id, :title, :description, :cooking_time, :price], 
      include: {
        category: { only: [:id, :name] },
        tags: { only: [:id, :name] },
        ingredients: { only: [:name, :protein, :carbohydrate, :fat] },
        user: { only: [:id, :name, :profile_image] }
      } 
    ).merge(
      image_url: recipe.image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(recipe.image, host: host) : nil
    )
  }
end


    def show
      recipe = Recipe.includes(:ingredients, :category, :user, :steps).find_by(id: params[:id])
    
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
          ingredients: recipe.ingredients.pluck(:name)
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
    end

    private

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
