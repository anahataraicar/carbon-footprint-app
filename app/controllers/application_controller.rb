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


  def calculate_gon
    # if current_user 
      # @user_profile = current_user.profiles.last
      # user_habits = current_user.habits
      # gon.saved_gas = current_user.save_gas
    # end
  end
  
end
