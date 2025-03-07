class AddIngredientsToRecipes < ActiveRecord::Migration[7.1]
  def change
    add_column :recipes, :ingredients, :jsonb, default: [], null: false
  end
end
