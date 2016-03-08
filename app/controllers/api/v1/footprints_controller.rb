class Api::V1::FootprintsController < ApplicationController

  def index
    profiles = Profile.order(:total_value).first(3)

    names = []
    travel = []
    housing = []
    food = []

    profiles.each do |profile|
      names << profile.user.first_name
      travel << profile.user.sum_travel
      housing << profile.user.sum_housing
      food << profile.user.sum_food
    end
  
    @profiles = [[names], [travel], [housing], [food]]

  end

  def show
    @habits = Habit.where("user_id = ?", current_user.id)
  end

  


end
