module Api
  class RecipesController < ApplicationController

    # JSON形式でレスポンスを返すための設定
    before_action :set_recipe, only: [:show]

    # GET /api/recipes
    def index
      if params[:keyword].present?
        # 検索ワードでタイトルまたは説明を絞り込み
        @recipes = Recipe.includes(:category, :user, :ingredients, :tags)
                         .where('title ILIKE ? OR description ILIKE ?', "%#{params[:keyword]}%", "%#{params[:keyword]}%")
      else
        # 全てのレシピを返す
        @recipes = Recipe.includes(:category, :user, :ingredients, :tags).all
      end
  
      render json: @recipes
    end

    # GET /api/recipes/:id
    def show
      render json: @recipe, serializer: RecipeSerializer
    end

    # GET /api/recipes/search
    def search
      keyword = params[:keyword]
      price = params[:price]
      cooking_time = params[:cooking_time]
    
      recipes = Recipe.all
      recipes = recipes.where("title LIKE ?", "%#{keyword}%") if keyword.present?
      recipes = recipes.where(price: price_range(price)) if price.present?
      recipes = recipes.where("cooking_time <= ?", cooking_time.to_i) if cooking_time.present?
    
      if recipes.exists?
        render json: recipes
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
