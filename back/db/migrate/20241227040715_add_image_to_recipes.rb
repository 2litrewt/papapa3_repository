class AddImageToRecipes < ActiveRecord::Migration[7.1]
  def change
    add_column :recipes, :image, :string
  end
end
