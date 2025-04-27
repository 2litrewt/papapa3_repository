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
  { name: "豆腐", protein: 8, carbohydrate: 2, fat: 4 },
  # ★追加分（12種）
  { name: "タコ", protein: 16, carbohydrate: 0, fat: 1 },
  { name: "豚肉", protein: 20, carbohydrate: 0, fat: 15 },
  { name: "サーモン", protein: 23, carbohydrate: 0, fat: 13 },
  { name: "エビ", protein: 21, carbohydrate: 0, fat: 1 },
  { name: "そば粉", protein: 13, carbohydrate: 57, fat: 3 },
  { name: "水", protein: 0, carbohydrate: 0, fat: 0 },
  { name: "砂糖", protein: 0, carbohydrate: 100, fat: 0 },
  { name: "抹茶パウダー", protein: 20, carbohydrate: 30, fat: 5 },
  { name: "トマト", protein: 1, carbohydrate: 5, fat: 0 },
  { name: "きゅうり", protein: 1, carbohydrate: 4, fat: 0 },
  { name: "米", protein: 7, carbohydrate: 77, fat: 1 },
  { name: "なす", protein: 1, carbohydrate: 5, fat: 0 },
  { name: "ねぎ", protein: 1, carbohydrate: 7, fat: 0 },
  { name: "じゃがいも", protein: 2, carbohydrate: 17, fat: 0 },
  { name: "塩", protein: 0, carbohydrate: 0, fat: 0 },
  { name: "味噌", protein: 12, carbohydrate: 26, fat: 6 },
  { name: "牛乳", protein: 8, carbohydrate: 5, fat: 8 }
]

ingredients = ingredients_data.map { |data| Ingredient.find_or_create_by!(data) }

# 画像名・レシピ内容一覧
recipes_data = [
  { title: "たこ焼き", category: "焼き物", image: "takoyaki.jpg", ingredients: { "小麦粉" => 100, "卵" => 50, "キャベツ" => 50, "タコ" => 50 }, steps: ["生地を作る", "具材を加える", "たこ焼き器で焼く"] },
  { title: "オムライス", category: "ご飯", image: "omurice.jpg", ingredients: { "米" => 150, "鶏肉" => 100, "卵" => 100 }, steps: ["ケチャップライスを作る", "卵で包む", "盛り付ける"] },
  { title: "カツカレー", category: "ご飯", image: "katsu_curry.jpg", ingredients: { "米" => 200, "豚肉" => 150, "小麦粉" => 30 }, steps: ["豚肉を揚げる", "カレーを作る", "盛り付ける"] },
  { title: "茶碗蒸し", category: "煮物", image: "chawanmushi.jpg", ingredients: { "卵" => 100, "牛乳" => 50, "鶏肉" => 50 }, steps: ["卵液を作る", "具材を入れる", "蒸す"] },
  { title: "寿司", category: "ご飯", image: "sushi.jpg", ingredients: { "米" => 200, "サーモン" => 50, "エビ" => 50 }, steps: ["酢飯を作る", "ネタを切る", "握る"] },
  { title: "餃子", category: "焼き物", image: "gyoza.jpg", ingredients: { "豚肉" => 100, "キャベツ" => 50, "小麦粉" => 30 }, steps: ["具を作る", "包む", "焼く"] },
  { title: "そば", category: "麺", image: "soba.jpg", ingredients: { "そば粉" => 100, "小麦粉" => 30, "水" => 50 }, steps: ["生地を作る", "切る", "茹でる"] },
  { title: "卵焼き", category: "焼き物", image: "tamagoyaki.jpg", ingredients: { "卵" => 150, "牛乳" => 30, "砂糖" => 10 }, steps: ["卵液を作る", "焼く", "巻く"] },
  { title: "うどん", category: "麺", image: "udon.jpg", ingredients: { "小麦粉" => 150, "水" => 70, "塩" => 5 }, steps: ["生地をこねる", "切る", "茹でる"] },
  { title: "とんかつ", category: "揚げ物", image: "tonkatsu.jpg", ingredients: { "豚肉" => 150, "小麦粉" => 30, "パン粉" => 50 }, steps: ["衣を付ける", "揚げる", "盛り付ける"] },
  { title: "親子丼", category: "ご飯", image: "oyakodon.jpg", ingredients: { "鶏肉" => 100, "卵" => 100, "米" => 150 }, steps: ["鶏肉を炒める", "卵を加える", "ご飯に乗せる"] },
  { title: "肉じゃが", category: "煮物", image: "nikujaga.jpg", ingredients: { "牛ひき肉" => 100, "じゃがいも" => 150, "玉ねぎ" => 100 }, steps: ["肉を炒める", "野菜を煮る", "味を整える"] },
  { title: "抹茶パフェ", category: "デザート", image: "matcha_parfait.jpg", ingredients: { "牛乳" => 100, "砂糖" => 20, "抹茶パウダー" => 5 }, steps: ["材料を混ぜる", "冷やす", "盛り付ける"] },
  { title: "サラダ", category: "サラダ", image: "salad.jpg", ingredients: { "キャベツ" => 50, "トマト" => 30, "きゅうり" => 30 }, steps: ["野菜を切る", "和える", "盛り付ける"] },
  { title: "天ぷら", category: "揚げ物", image: "tempura.jpg", ingredients: { "小麦粉" => 100, "エビ" => 50, "なす" => 30 }, steps: ["衣を作る", "具材を揚げる", "盛り付ける"] },
  { title: "ラーメン", category: "麺", image: "ramen.jpg", ingredients: { "小麦粉" => 150, "鶏肉" => 50, "玉ねぎ" => 30 }, steps: ["麺を茹でる", "スープを作る", "盛り付ける"] },
  { title: "味噌汁", category: "スープ", image: "miso_soup.jpg", ingredients: { "豆腐" => 50, "ねぎ" => 20, "味噌" => 30 }, steps: ["具材を煮る", "味噌を溶かす", "盛り付ける"] },
  { title: "カレーライス", category: "ご飯", image: "curry_rice.jpg", ingredients: { "米" => 200, "玉ねぎ" => 50, "牛ひき肉" => 100 }, steps: ["肉と玉ねぎを炒める", "煮込む", "盛り付ける"] },
  { title: "ハンバーグ", category: "焼き物", image: "hamburg.jpg", ingredients: { "牛ひき肉" => 150, "玉ねぎ" => 50, "パン粉" => 30 }, steps: ["材料を混ぜる", "焼く", "ソースをかける"] }
]

recipes_data.each do |data|
  puts "Creating recipe: #{data[:title]}"  

  recipe = Recipe.create!(
    title: data[:title],
    description: "#{data[:title]}の美味しいレシピです。",
    cooking_time: rand(10..60),
    price: rand(200..1000),
    user: user,
    category: categories.find { |c| c.name == data[:category] }
    # image カラムへの保存がある場合、ここに image: data[:image] を追加
  )

  data[:ingredients].each do |ingredient_name, quantity|
    ingredient = Ingredient.find_by(name: ingredient_name)
    if ingredient.nil?
      puts "⚠️ Ingredient not found: #{ingredient_name}"  # ★追加：デバッグ出力
    end
    RecipeIngredient.create!(recipe: recipe, ingredient: ingredient, quantity: quantity)
  end

  data[:steps].each.with_index(1) do |instruction, index|
    Step.create!(recipe: recipe, step_number: index, instruction: instruction)
  end
end

puts "シードデータの作成が完了しました！"
