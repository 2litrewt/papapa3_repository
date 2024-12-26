module Api
  class RecipesController < ApplicationController


    # JSON形式でレスポンスを返すための設定
    before_action :set_recipe, only: [:show]

    # GET /api/recipes
    def index
      @recipes = Recipe.includes(:category, :ingredients, :tags).all
      render json: @recipes, each_serializer: RecipeSerializer
    end

    # GET /api/recipes/:id
    def show
      render json: @recipe, serializer: RecipeSerializer
    end

    private

    def set_recipe
      @recipe = Recipe.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Recipe not found' }, status: :not_found
    end
  end
end
