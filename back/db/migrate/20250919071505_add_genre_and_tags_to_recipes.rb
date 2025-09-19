class AddGenreAndTagsToRecipes < ActiveRecord::Migration[7.1]
  def change
    # 配列として使うので jsonb（JSONの専用型）
    add_column :recipes, :genre, :jsonb, null: false, default: []
    add_column :recipes, :tags,  :jsonb, null: false, default: []

    # 検索のためのインデックス（index＝索引）
    add_index :recipes, :genre, using: :gin
    add_index :recipes, :tags,  using: :gin
  end
end
