module Api
  class FavoritesController < ApplicationController
    before_action :authenticate_api_user!

    def index
      favorites = current_api_user.favorites
      render json: favorites
    end

    def create
      favorite = current_api_user.favorites.new(favorite_params)
      if favorite.save
        render json: favorite, status: :created
      else
        render json: { errors: favorite.errors.full_messages }, status: :unprocessable_entity
      end

    rescue => e
      Rails.logger.error("🔥 予期せぬエラー: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { error: "Internal Server Error" }, status: :internal_server_error
    
    end

    def destroy
      favorite = current_api_user.favorites.find_by(id: params[:id])
      if favorite
        favorite.destroy
        head :no_content
      else
        render json: { error: "お気に入りが見つかりません" }, status: :not_found
      end
    end
    
    private

    def favorite_params
      params.require(:favorite).permit(:recipe_id, :recipe_title, :recipe_image_url)
    end
  end
end
