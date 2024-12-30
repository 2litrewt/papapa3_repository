module Api
  class PostsController < ApplicationController
    def index
      posts = Post.all
      render json: posts
    end
 
    def index
      posts = Post.all
      render json: posts, each_serializer: PostSerializer
    end
  end

end
