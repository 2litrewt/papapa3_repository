# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include Devise::Controllers::Helpers

  private
  def set_current_user
    Current.user = current_api_api_user_auth
  end

end
