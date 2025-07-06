class CreateFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :recipe_id
      t.string :recipe_title
      t.string :recipe_image_url

      t.timestamps
    end
  end
end
