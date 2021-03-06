class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_up_gon_user

  def set_up_gon_user
    if current_user 
      gon.user_id = current_user.id
    end
  end

 
  
end
