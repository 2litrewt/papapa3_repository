# エラーメッセージを英語に設定
I18n.locale = :en

# ユーザーの作成
begin
  user = User.create!(
    name: "山田太郎",
    email: "taro.yamada@example.com",
    password: "password",
    profile_image: "https://example.com/images/user1.jpg"
  )
rescue ActiveRecord::RecordInvalid => e
  puts "User creation failed: #{e.record.errors.full_messages.join(', ')}"
end

# カテゴリーの作成
begin
  category1 = Category.create!(name: "和食")
  category2 = Category.create!(name: "洋食")
rescue ActiveRecord::RecordInvalid => e
  puts "Category creation failed: #{e.record.errors.full_messages.join(', ')}"
end

# タグの作成
begin
  tag1 = Tag.create!(name: "簡単")
  tag2 = Tag.create!(name: "夕食")
  tag3 = Tag.create!(name: "ヘルシー")
rescue ActiveRecord::RecordInvalid => e
  puts "Tag creation failed: #{e.record.errors.full_messages.join(', ')}"
end

# 材料の作成
begin
  ingredient1 = Ingredient.create!(name: "パスタ", protein: 13.0, carbohydrate: 75.0, fat: 1.5)
  ingredient2 = Ingredient.create!(name: "トマトソース", protein: 2.0, carbohydrate: 10.0, fat: 5.0)
  ingredient3 = Ingredient.create!(name: "卵", protein: 6.0, carbohydrate: 1.0, fat: 5.0)
rescue ActiveRecord::RecordInvalid => e
  puts "Ingredient creation failed: #{e.record.errors.full_messages.join(', ')}"
end

# レシピの作成
begin
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
rescue ActiveRecord::RecordInvalid => e
  puts "Recipe creation failed: #{e.record.errors.full_messages.join(', ')}"
end

# レシピ材料の作成
begin
  RecipeIngredient.create!(recipe: recipe1, ingredient: ingredient1, quantity: 200.0)
  RecipeIngredient.create!(recipe: recipe1, ingredient: ingredient2, quantity: 150.0)
  RecipeIngredient.create!(recipe: recipe2, ingredient: ingredient3, quantity: 2.0)
rescue ActiveRecord::RecordInvalid => e
  puts "RecipeIngredient creation failed: #{e.record.errors.full_messages.join(', ')}"
end

# レシピタグの作成
begin
  RecipeTag.create!(recipe: recipe1, tag: tag1)
  RecipeTag.create!(recipe: recipe1, tag: tag2)
  RecipeTag.create!(recipe: recipe2, tag: tag1)
  RecipeTag.create!(recipe: recipe2, tag: tag3)
rescue ActiveRecord::RecordInvalid => e
  puts "RecipeTag creation failed: #{e.record.errors.full_messages.join(', ')}"
end
