class ChangeIngredientsToJsonbInRecipes < ActiveRecord::Migration[7.1]
  def change
    change_column :recipes, :ingredients, :jsonb, using: 'ingredients::jsonb'
  end
end
