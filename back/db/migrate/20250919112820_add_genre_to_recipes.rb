class AddGenreToRecipes < ActiveRecord::Migration[7.1]
  def up
    # （column_exists?＝カラムがあるか確認, index_exists?＝索引があるか確認）
    unless column_exists?(:recipes, :genre)
      add_column :recipes, :genre, :jsonb, null: false, default: []
    end

    # PostgreSQL の場合のみ GIN index を張る（SQLite では自動的に無視される or 外す）
    if connection.adapter_name.downcase.include?("postgres")
      add_index :recipes, :genre, using: :gin unless index_exists?(:recipes, :genre)
    end
  end

  def down
    if connection.adapter_name.downcase.include?("postgres")
      remove_index :recipes, :genre if index_exists?(:recipes, :genre)
    end
    remove_column :recipes, :genre if column_exists?(:recipes, :genre)
  end
end
