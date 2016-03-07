class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :calculate_gon


  def calculate_gon
    if current_user 
      @user_profile = current_user.profiles.last
      user_habits = current_user.habits
      gon.saved_gas = current_user.save_gas

      gon.habits = Hash.new
      user_habits.each do |habit|
        gon.habits[habit.footprint_type] = habit.value.to_f
      end

      profiles = Profile.order(:total_value).first(3)

      gon.names = []
      gon.travel = []
      gon.housing = []
      gon.food = []

      profiles.each do |profile|
        gon.names << profile.user.first_name
        gon.travel << profile.user.sum_travel
        gon.housing << profile.user.sum_housing
        gon.food << profile.user.sum_food
      end
    end
  end
  
end
