module Api
  class RecipesController < ApplicationController

    # JSON形式でレスポンスを返すための設定
    before_action :set_recipe, only: [:show]

    # GET /api/recipes
    def index
      @recipes = ::Recipe.includes(:category, :ingredients, :tags).all
      render json: @recipes, each_serializer: RecipeSerializer
    end

    # GET /api/recipes/:id
    def show
      render json: @recipe, serializer: RecipeSerializer
    end

    # GET /api/recipes/search
    def search
      # パラメータ取得
      keyword = params[:keyword]
      price = params[:price]
      cooking_time = params[:cooking_time]
      
      recipes = Recipe.all
      recipes = recipes.where("title LIKE ?", "%#{keyword}%") if keyword.present?
      recipes = recipes.where("title LIKE ?", "%#{keyword}%") if keyword.present?
      if price.present?
        range = price_range(price)
        Rails.logger.debug "Price range: #{range.inspect}" # デバッグ用出力
        recipes = recipes.where(price: range)
      end      
      recipes = recipes.where("cooking_time <= ?", cooking_time.to_i) if cooking_time.present?

      Rails.logger.debug "Generated SQL: #{recipes.to_sql}"

      if recipes.exists?
        render json: recipes
      else
        render json: { error: "Recipe not found" }, status: :not_found
      end
    end

    private

    def set_recipe
      @recipe = Recipe.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Recipe not found' }, status: :not_found
    end

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

  end
end
