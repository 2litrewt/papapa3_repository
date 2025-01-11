module Api
  class PostsController < ApplicationController
    def index
      if params[:keyword].present?
        keyword = params[:keyword]
        # title または description に keyword が含まれるレコードを検索
        @posts = Post.where("title ILIKE ? OR description ILIKE ?", "%#{keyword}%", "%#{keyword}%")
      else
        # keyword がない場合は全ての投稿を返す
        @posts = Post.all
      end

      render json: @posts
    end
  end
end
