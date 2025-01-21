class CreateSteps < ActiveRecord::Migration[6.1]
  def change
    create_table :steps do |t|
      t.references :recipe, null: false, foreign_key: true # レシピとの関連付け
      t.integer :step_number, null: false                  # 手順の順番
      t.text :instruction, null: false                    # 手順の説明

      t.timestamps
    end

    # 手順の順番にユニーク制約を追加（同じレシピ内で重複しないように）
    add_index :steps, [:recipe_id, :step_number], unique: true
  end
end
