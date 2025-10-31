# config/routes.rb
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # 認証の互換ルート（/api/auth/** を提供）
  namespace :api, defaults: { format: :json } do
    mount_devise_token_auth_for 'User', at: 'auth', as: 'api_user_auth'

    # 業務APIは /api/** 配下に統一
    namespace :v1 do
      resources :ingredients, only: [:index]
    end
    resources :posts, only: [:index]
    resources :recipes, only: [:index, :show, :create] do
      collection { get :search }
    end
    resources :favorites,  only: [:index, :create, :destroy]
    resources :categories, only: [:index]
    resources :ingredients, only: [:index]
    resources :tags,       only: [:index]
  end

  # 認証の“正式”ルート（/auth/**）
  scope defaults: { format: :json } do
    mount_devise_token_auth_for 'User', at: 'auth', as: 'user_auth_compat'
  end

  root to: proc { [200, {}, ['Rails API is running']] }
end
