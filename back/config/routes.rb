# config/routes.rb
Rails.application.routes.draw do
  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check

  # API エンドポイント
  namespace :api, defaults: { format: :json } do
    # 認証（/api/auth/**）
    mount_devise_token_auth_for 'User', at: 'auth'

    # バージョン付き（現状維持）
    namespace :v1 do
      resources :ingredients, only: [:index]
    end

    resources :posts, only: [:index]

    # recipes：REST標準 + /api/recipes/search
    resources :recipes, only: [:index, :show, :create] do
      collection do
        get :search
      end
    end

    resources :favorites,  only: [:index, :create, :destroy]
    resources :categories, only: [:index]
    resources :ingredients, only: [:index]
    resources :tags,       only: [:index]
  end

  # ルート
  root to: proc { [200, {}, ['Rails API is running']] }

  # （任意）フロント直アクセス用の別名ルートは混乱を招きがちなので一旦無効化
  # resources :recipes, only: [:index, :create], controller: 'api/recipes'
  # resources :posts,   only: [:index]
end
