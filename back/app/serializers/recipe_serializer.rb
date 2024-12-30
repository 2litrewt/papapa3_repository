class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :cooking_time, :price, :created_at, :updated_at

  belongs_to :user
  belongs_to :category
  has_many :ingredients, through: :recipe_ingredients
  has_many :tags

  class UserSerializer < ActiveModel::Serializer
    attributes :id, :name, :profile_image
  end

  class CategorySerializer < ActiveModel::Serializer
    attributes :id, :name
  end

  class IngredientSerializer < ActiveModel::Serializer
    attributes :id, :name, :protein, :carbohydrate, :fat

    has_many :recipe_ingredients

    class RecipeIngredientSerializer < ActiveModel::Serializer
      attributes :quantity
    end
  end

  class TagSerializer < ActiveModel::Serializer
    attributes :id, :name
  end
end
