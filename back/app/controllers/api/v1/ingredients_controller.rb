class Api::V1::IngredientsController < ApplicationController
  def index
    ingredients = Ingredient.all
    render json: ingredients.as_json(only: [:id, :name, :protein, :carbohydrate, :fat])
  end
end
