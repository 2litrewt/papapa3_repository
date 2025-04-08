class AddDeviseTokenAuthToUsers < ActiveRecord::Migration[7.1]
  def change
    change_table(:users, bulk: true) do |t|
      ## Required for `devise_token_auth`
      t.string :provider, null: false, default: "email"
      t.string :uid, null: false, default: ""

      ## Tokens
      t.text :tokens

      ## Trackable（使用する場合）
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip
    end

    add_index :users, [:uid, :provider], unique: true
  end
end
