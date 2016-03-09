class Api::V1::FootprintsController < ApplicationController

  def index
    profiles = []
    profiles << Profile.find_by(user_id: current_user.id)

    other_profiles = Profile.last(2)

    other_profiles.each do |profile|
      profiles << profile
    end


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
