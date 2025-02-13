Rails.application.routes.draw do
  # ヘルスチェック用エンドポイント
  get "up" => "rails/health#show", as: :rails_health_check

  # API エンドポイント
  namespace :api do
    resources :posts, only: [:index] 
    resources :recipes, only: [:index, :show, :search] do
      collection do
        get 'search', to: 'recipes#search'
      end
    end    
    resources :categories, only: [:index]
    resources :ingredients, only: [:index]
    resources :tags, only: [:index]
  end

  # フロントエンドが直接アクセスする場合のパスも設定
  resources :recipes, only: [:index], controller: 'api/recipes'
  resources :posts, only: [:index]

  # **ここを追加**
  root to: proc { [200, {}, ['Rails API is running']] }
end
