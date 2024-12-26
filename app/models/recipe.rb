class Recipe < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients
  has_many :recipe_tags, dependent: :destroy
  has_many :tags, through: :recipe_tags
  has_many :bookmarks, dependent: :destroy
  has_many :likes, dependent: :destroy

  validates :title, :description, :cooking_time, :price, presence: true
end
