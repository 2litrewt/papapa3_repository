module Api
  class RecipesController < ApplicationController

    # JSON形式でレスポンスを返すための設定
    before_action :set_recipe, only: [:show]

    # GET /api/recipes
    def index
      keyword = params[:keyword]
      cooking_time = params[:cooking_time] # 調理時間
      price_range = params[:price_range]  # 価格帯
      nutrition_type = params[:nutrition_type] # 栄養タイプ
      sort_by = params[:sortBy] || 'created_at' # ソート項目
      order = params[:order] || 'asc'          # 昇降順
    
      # ベースクエリ
      recipes = Recipe.includes(:ingredients)
    
      # キーワード検索
      if keyword.present?
        recipes = recipes.where('title ILIKE ? OR description ILIKE ?', "%#{keyword}%", "%#{keyword}%")
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
    
      # 栄養タイプの条件
      if nutrition_type.present?
        case nutrition_type
        when 'low_calorie'
          recipes = recipes.where('total_nutrition_calories <= ?', 300)
        when 'high_protein'
          recipes = recipes.where('total_nutrition_protein >= ?', 20)
        when 'low_carb'
          recipes = recipes.where('total_nutrition_carbohydrate <= ?', 50)
        when 'low_fat'
          recipes = recipes.where('total_nutrition_fat <= ?', 10)
        end
      end
    
      # ソート処理
      if %w[price cooking_time created_at].include?(sort_by) && %w[asc desc].include?(order)
        recipes = recipes.order("#{sort_by} #{order}")
      end
    
      # レスポンス
      render json: recipes
    end
    
    
    def show
      recipe = Recipe.includes(:ingredients, :category, :user, :steps).find_by(id: params[:id])
    
      if recipe
        total_protein = recipe.ingredients.sum { |ingredient| ingredient.protein }
        total_carbohydrate = recipe.ingredients.sum { |ingredient| ingredient.carbohydrate }
        total_fat = recipe.ingredients.sum { |ingredient| ingredient.fat }
    
        render json: recipe.as_json(only: [:id, :title, :description, :cooking_time, :price]).merge({
          category_name: recipe.category&.name,
          user_name: recipe.user&.name,
          total_nutrition: {
            protein: total_protein,
            carbohydrate: total_carbohydrate,
            fat: total_fat
          },
          ingredients: recipe.ingredients.pluck(:name),
          steps: recipe.steps.map { |step| { step_number: step.step_number, instruction: step.instruction } }
        })
      else
        render json: { error: 'Recipe not found' }, status: :not_found
      end
    end
    
    # GET /api/recipes/search
    def search
      keyword = params[:keyword]
      price = params[:price]
      cooking_time = params[:cooking_time]
      nutrition_value = params[:nutrition_value].to_i

      # ベースクエリ
      recipes = Recipe.includes(:ingredients, :recipe_ingredients)

      recipes = recipes.where("title LIKE ?", "%#{keyword}%") if keyword.present?
      recipes = recipes.where(price: price_range(price)) if price.present?
      recipes = recipes.where("cooking_time <= ?", cooking_time.to_i) if cooking_time.present?
    
      if nutrition_value.positive?
        recipes = recipes.select do |recipe|
          # 栄養価を計算
          total_nutrition = recipe.ingredients.sum do |ingredient|
            recipe_ingredient = recipe.recipe_ingredients.find_by(ingredient_id: ingredient.id)
            next 0 unless recipe_ingredient
    
            (ingredient.protein + ingredient.carbohydrate + ingredient.fat) * recipe_ingredient.quantity
          end
    
          # 条件に合致するかチェック
          total_nutrition > nutrition_value
        end
      end
    
      # 結果を返す
      if recipes.any?
        render json: recipes, status: :ok
      else
        render json: { error: "Recipe not found" }, status: :not_found
      end
    end

    private

    def price_range(price)
      case price
      when "low"
        0..500
      when "medium"
        501..1000
      when "high"
        1001..Float::INFINITY
      else
        nil
      end
    end

    def set_recipe
      @recipe = Recipe.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Recipe not found' }, status: :not_found
    end
  end
end
