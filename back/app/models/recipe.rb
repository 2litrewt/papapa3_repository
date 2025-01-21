class Recipe < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
  has_many :recipe_tags, dependent: :destroy
  has_many :tags, through: :recipe_tags
  has_many :steps, -> { order(:step_number) }, dependent: :destroy

  scope :with_nutrition_value, -> {
    select('recipes.*, (SELECT SUM((ingredients.protein + ingredients.carbohydrate + ingredients.fat) * recipe_ingredients.quantity)
            FROM recipe_ingredients
            JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
            WHERE recipe_ingredients.recipe_id = recipes.id) AS nutrition_value')
  }

  validates :title, presence: true
  validates :description, presence: true
  validates :cooking_time, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :image, presence: true
end
