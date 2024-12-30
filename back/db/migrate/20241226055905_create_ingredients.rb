class CreateIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :ingredients do |t|
      t.string :name
      t.float :protein
      t.float :carbohydrate
      t.float :fat

      t.timestamps
    end
  end
end
