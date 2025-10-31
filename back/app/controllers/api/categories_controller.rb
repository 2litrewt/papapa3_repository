# back/app/controllers/api/categories_controller.rb
module Api
  class CategoriesController < ApplicationController
    skip_before_action :authenticate_user!,     only: :index, raise: false
    skip_before_action :authenticate_api_api_user_auth!, only: :index, raise: false

    def index
      render json: Category.order(:id).select(:id, :name)
    end
  end
end
