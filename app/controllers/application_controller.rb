class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :calculate_gon


  def calculate_gon
    if current_user 
      # @user_profile = current_user.profiles.last
      # user_habits = current_user.habits
      # gon.saved_gas = current_user.save_gas
    end
  end
  
end
