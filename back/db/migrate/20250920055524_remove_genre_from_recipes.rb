class RemoveGenreFromRecipes < ActiveRecord::Migration[7.1]
  def up
    remove_index  :recipes, :genre if index_exists?(:recipes, :genre)
    remove_column :recipes, :genre if column_exists?(:recipes, :genre)
  end
  def down
    add_column :recipes, :genre, :jsonb, null: false, default: [] unless column_exists?(:recipes, :genre)
    add_index  :recipes, :genre, using: :gin unless index_exists?(:recipes, :genre)
  end
end