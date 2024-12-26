# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# ユーザーの作成
user = User.create!(
  name: "山田太郎",
  email: "taro.yamada@example.com",
  password: "password",
  profile_image: "https://example.com/images/user1.jpg"
)

# カテゴリーの作成
category1 = Category.create!(name: "和食")
category2 = Category.create!(name: "洋食")

# タグの作成
tag1 = Tag.create!(name: "簡単")
tag2 = Tag.create!(name: "夕食")
tag3 = Tag.create!(name: "ヘルシー")

# 材料の作成
ingredient1 = Ingredient.create!(name: "パスタ", protein: 13.0, carbohydrate: 75.0, fat: 1.5)
ingredient2 = Ingredient.create!(name: "トマトソース", protein: 2.0, carbohydrate: 10.0, fat: 5.0)
ingredient3 = Ingredient.create!(name: "卵", protein: 6.0, carbohydrate: 1.0, fat: 5.0)

# レシピの作成
recipe1 = Recipe.create!(
  title: "簡単パスタ",
  description: "これは簡単に作れるパスタのレシピです。",
  cooking_time: 20,
  price: 500,
  user: user,
  category: category2,
  image: "https://example.com/images/pasta.jpg"
)

recipe2 = Recipe.create!(
  title: "和風オムレツ",
  description: "和風の味付けが特徴のオムレツです。",
  cooking_time: 15,
  price: 300,
  user: user,
  category: category1,
  image: "https://example.com/images/omelette.jpg"
)

# レシピ材料の作成
RecipeIngredient.create!(recipe: recipe1, ingredient: ingredient1, quantity: 200.0)
RecipeIngredient.create!(recipe: recipe1, ingredient: ingredient2, quantity: 150.0)
RecipeIngredient.create!(recipe: recipe2, ingredient: ingredient3, quantity: 2.0)

# レシピタグの作成
RecipeTag.create!(recipe: recipe1, tag: tag1)
RecipeTag.create!(recipe: recipe1, tag: tag2)
RecipeTag.create!(recipe: recipe2, tag: tag1)
RecipeTag.create!(recipe: recipe2, tag: tag3)
