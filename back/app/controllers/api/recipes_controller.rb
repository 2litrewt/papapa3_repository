module Api
  class RecipesController < ApplicationController

    # JSON形式でレスポンスを返すための設定
    before_action :set_recipe, only: [:show]

    # GET /api/recipes
    def index
      keyword = params[:keyword]
      sort_by = params[:sortBy] || 'created_at' # デフォルトのソート項目
      order = params[:order] || 'asc'          # デフォルトのソート順
    
      # ベースクエリ
      recipes = Recipe.includes(:category, :user, :ingredients, :tags)
    
      # キーワード検索
      recipes = recipes.where('title ILIKE ? OR description ILIKE ?', "%#{keyword}%", "%#{keyword}%") if keyword.present?
    
      # ソート処理
      if %w[price cooking_time created_at].include?(sort_by) && %w[asc desc].include?(order)
        recipes = recipes.order("#{sort_by} #{order}")
      end
    
      render json: recipes
    end

    def show
      recipe = Recipe.includes(:ingredients, :tags).find_by(id: params[:id])
      
      if recipe
        render json: {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          cooking_time: recipe.cooking_time,
          price: recipe.price,
          category_id: recipe.category_id,
          category_name: recipe.category.name, # カテゴリ名を追加（オプション）
          image_url: recipe.image, # 必要に応じてURL形式に加工
          user_id: recipe.user_id,
          user_name: recipe.user.name, # ユーザー名を追加（オプション）
          created_at: recipe.created_at,
          updated_at: recipe.updated_at,
          ingredients: recipe.ingredients.pluck(:name), # 材料名のリストを取得
          tags: recipe.tags.pluck(:name), # タグ名のリストを取得
          steps: recipe.steps.map { |step| { step_number: step.step_number, instruction: step.instruction } }
        }, status: :ok
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
