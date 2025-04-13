class Recipe < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
  has_many :recipe_tags, dependent: :destroy
  has_many :tags, through: :recipe_tags
  has_many :steps, -> { order(:step_number) }, dependent: :destroy
  has_one_attached :image

  scope :with_nutrition_value, -> {
    select('recipes.*, (SELECT SUM((ingredients.protein + ingredients.carbohydrate + ingredients.fat) * recipe_ingredients.quantity)
            FROM recipe_ingredients
            JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
            WHERE recipe_ingredients.recipe_id = recipes.id) AS nutrition_value')
  }

  accepts_nested_attributes_for :steps

  def as_json(options = {})
  Rails.logger.info "as_json called with options: #{options.inspect}"

  data = ingredients_with_quantity
  Rails.logger.info "ingredients_with_quantity: #{data.inspect}"

  result = serializable_hash(except: [:ingredients, :recipe_ingredients, :image])
  .merge(ingredients: data, 
        image_url: image_url,
        steps: steps.map { |step| { step_number: step.step_number, instruction: step.instruction } } 
        )
        #ingredientと同様リファクタリングできる

  Rails.logger.info "as_json result: #{result.inspect}"
  result
end


  def image_url
    if image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(
        image,
        host: ENV.fetch("BACKEND_HOST", "http://localhost:3000")
      )
      Rails.logger.info "[DEBUG] image_url: #{url}"
    url
    else
      nil
    end
  end


  validates :title, presence: true
  validates :description, presence: true
  validates :cooking_time, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  private

  def ingredients_with_quantity
    data = recipe_ingredients.includes(:ingredient).map do |ri|
      {
        id: ri.ingredient.id,
        name: ri.ingredient.name,
        protein: ri.ingredient.protein,
        carbohydrate: ri.ingredient.carbohydrate,
        fat: ri.ingredient.fat,
        quantity: ri.quantity  # ここで quantity を追加
      }
    end

    Rails.logger.info "ingredients_with_quantity: #{data.inspect}"  # ログでデバッグ
  data

  end
end
