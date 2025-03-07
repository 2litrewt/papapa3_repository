 # db/seeds.rb

# ユーザーを作成（デモ用）
user = User.first || User.create!(name: "デモユーザー", email: "demo@example.com", password: "password")

# カテゴリを作成
categories = %w[ご飯 麺 煮物 焼き物 揚げ物 サラダ スープ デザート].map do |category|
  Category.find_or_create_by!(name: category)
end

# 材料を作成（ユニークなものだけ）
ingredients_data = [
  { name: "牛ひき肉", protein: 20, carbohydrate: 0, fat: 15 },
  { name: "玉ねぎ", protein: 1, carbohydrate: 10, fat: 0 },
  { name: "パン粉", protein: 2, carbohydrate: 15, fat: 1 },
  { name: "卵", protein: 6, carbohydrate: 1, fat: 5 },
  { name: "キャベツ", protein: 1, carbohydrate: 5, fat: 0 },
  { name: "小麦粉", protein: 3, carbohydrate: 50, fat: 1 },
  { name: "鶏肉", protein: 22, carbohydrate: 0, fat: 5 },
  { name: "豆腐", protein: 8, carbohydrate: 2, fat: 4 }
]
ingredients = ingredients_data.map { |data| Ingredient.find_or_create_by!(data) }

# 20件のレシピを作成
recipe_titles = [
  "ハンバーグ", "カレーライス", "ラーメン", "味噌汁", "天ぷら", "サラダ", "抹茶パフェ", "肉じゃが", "親子丼", "とんかつ", "うどん", "卵焼き", "そば", "餃子", "寿司", "茶碗蒸し", "カツカレー", "オムライス", "たこ焼き"
]

recipe_titles.each do |title|
  recipe = Recipe.create!(
    title: title,
    description: "#{title}の美味しいレシピです。",
    cooking_time: rand(10..60),
    price: rand(200..1000),
    image: "#{title.parameterize.underscore}.jpg", # レシピ名をファイル名に適用
    user: user,
    category: categories.sample
  )

  # ランダムな材料を紐づける
  selected_ingredients = ingredients.sample(3)
  selected_ingredients.each do |ingredient|
    RecipeIngredient.create!(recipe: recipe, ingredient: ingredient, quantity: rand(10..200))
  end

  # 調理手順を追加
  3.times do |step_number|
    Step.create!(
      recipe: recipe,
      step_number: step_number + 1,
      instruction: "手順#{step_number + 1}の説明"
    )
  end
end

puts "シードデータの作成が完了しました！"
