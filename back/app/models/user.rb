class User < ApplicationRecord
  # パスワードのセキュリティ
  has_secure_password

  # アソシエーション
  has_many :recipes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :liked_recipes, through: :likes, source: :recipe
  has_many :follower_relationships, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :followers, through: :follower_relationships, source: :follower
  has_many :following_relationships, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :followings, through: :following_relationships, source: :followed

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  
end
