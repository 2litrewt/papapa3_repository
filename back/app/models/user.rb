class User < ApplicationRecord


  # アソシエーション
  has_many :recipes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :liked_recipes, through: :likes, source: :recipe
  has_many :follower_relationships, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :followers, through: :follower_relationships, source: :follower
  has_many :following_relationships, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :followings, through: :following_relationships, source: :followed
  has_many :favorites, dependent: :destroy
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  before_validation :ensure_uid
  
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable,
  :trackable # ←なければ追加

include DeviseTokenAuth::Concerns::User

private

def ensure_uid
  # Devise Token Auth などで provider='email' 前提なら email を uid に使う
  if provider == 'email'
    self.uid = email if uid.blank? && email.present?
  end
  # email が空などで依然 uid が空なら UUID で埋めて一意制約衝突を避ける
  self.uid = SecureRandom.uuid if uid.blank?
end

end
