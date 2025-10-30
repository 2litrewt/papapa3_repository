module Api
  class RecipesController < ApplicationController

    skip_before_action :authenticate_api_user!, only: [:index, :show], raise: false

    def index
      keyword = params[:keyword]
      cooking_time = params[:cooking_time]
      price_range = params[:price_range]
      nutrition_type = params[:nutrition_type]
      sort_by = params[:sortBy] || 'created_at'
      order = params[:order] || 'asc'
    
      host = Rails.env.production? ? "https://back-main.fly.dev" : "http://localhost:3000"
    
      # ベースクエリ
recipes = Recipe.includes(:ingredients, :category, :user, :tags)

# カテゴリで絞り込み（name一致）
if params[:category].present?
  recipes = recipes.joins(:category).where(categories: { name: params[:category] })
end

# タグで絞り込み（id か name の“来た方だけ”使う）
if params[:tag].present?
  recipes = recipes.joins(:tags).where('tags.name = ?', params[:tag].to_s.strip).distinct
end
   
      
    
      # 以降は既存の条件（keyword, price_range, cooking_time など）
      if keyword.present?
        recipes = recipes.where('title ILIKE ? OR description ILIKE ?', "%#{keyword}%", "%#{keyword}%")
      end
    
      # ...（残りの条件はそのまま）
    
      render json: recipes.map { |recipe|
  recipe.as_json(
    only: [:id, :title, :description, :cooking_time, :price],
    include: {
      category:   { only: [:id, :name] },
      tags:       { only: [:id, :name] },
      ingredients:{ only: [:name, :protein, :carbohydrate, :fat] },
      user:       { only: [:id, :name, :profile_image] }
    }
  ).merge(
    image_url: (recipe.image.attached? ?
      Rails.application.routes.url_helpers.rails_blob_url(
        recipe.image,
        host: host
      ) : nil),

    # ★ 追加：表示用にフラット化（フロントがそのまま使える形）
    category: recipe.category&.name,
    tags:     recipe.tags.map(&:name)   # ← pluck(:name) だと別クエリになるので map(&:name) 推奨
  )
}

    end
    
    def show
      recipe = Recipe.includes(:recipe_ingredients, :ingredients, :category, :user, :steps).find_by(id: params[:id])

      unless recipe
        render json: { error: 'Recipe not found' }, status: :not_found
        return
      end

      fav = current_api_user&.favorites&.find_by(recipe_id: recipe.id)

    
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
          category:      recipe.category&.name,
          tags:          (recipe.association(:tags).loaded? ? recipe.tags.map(&:name) : recipe.tags.pluck(:name)),
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
      Rails.logger.info "[Recipes#create] params: #{params.to_unsafe_h.slice('recipe','image')}"

      # 1) ネスト属性込みで初期化（:image は後で attach）
      @recipe = Recipe.new(recipe_params)

      # 2) steps_attributes が JSON文字列で来る場合 ⇒ パースして上書き
      raw_steps = params.dig(:recipe, :steps_attributes)
      if raw_steps.is_a?(String)
        begin
          parsed = JSON.parse(raw_steps)
          # [{step_number: 1, instruction: "..."}, ...] 形式を想定
          @recipe.assign_attributes(steps_attributes: parsed)
        rescue JSON::ParserError => e
          Rails.logger.error "Invalid JSON for steps_attributes: #{e.message}"
          return render json: { errors: ['手順の形式が不正です（JSON）'] }, status: :unprocessable_entity
        end
      end

      # 3) 画像は recipe の外で image パラメータとして来る ⇒ attach
      if params[:image].present?
        @recipe.image.attach(params[:image])
      end

      # 4) タグ名の配列 recipe[tag_names] を受け取り、Tag を紐付け
      tag_names = Array(params.dig(:recipe, :tag_names)).map(&:to_s).map(&:strip).reject(&:blank?)
      if tag_names.present?
        @recipe.tags = tag_names.uniq.map { |name| Tag.find_or_create_by!(name:) }
      end

      if @recipe.save
        host = Rails.env.production? ? "https://back-main.fly.dev" : "http://localhost:3000"
        render json: {
          id:           @recipe.id,
          title:        @recipe.title,
          description:  @recipe.description,
          cooking_time: @recipe.cooking_time,
          price:        @recipe.price,
          category:     @recipe.category&.name,
          tags:         @recipe.tags.pluck(:name),
          image_url:    (@recipe.image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(@recipe.image, host:) : nil),
          steps:        @recipe.steps.order(:step_number).map { |s| { step_number: s.step_number, instruction: s.instruction } },
          ingredients:  @recipe.recipe_ingredients.includes(:ingredient).map { |ri|
                          {
                            id:            ri.ingredient_id,
                            name:          ri.ingredient.name,
                            protein:       ri.ingredient.protein,
                            carbohydrate:  ri.ingredient.carbohydrate,
                            fat:           ri.ingredient.fat,
                            quantity:      ri.quantity
                          }
                        }
        }, status: :created
      else
        # 422で返す（500にしない）
        Rails.logger.error "Recipe save failed: #{@recipe.errors.full_messages}"
        render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
      end
    end

  
    private
  
    # ★ ネスト属性＆基本項目を許可
    def recipe_params
      params.require(:recipe).permit(
        :title, :description, :user_id, :category_id, :cooking_time, :price,
        # :image は multipart 直下の image を使うためここでは許可しない（attachで処理）
        recipe_ingredients_attributes: [:ingredient_id, :quantity],
        steps_attributes: [:step_number, :instruction]
      )
    end

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
