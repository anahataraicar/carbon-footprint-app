class Api::V1::FootprintsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    profiles = []
    
    if current_user.is_done?
      profiles[0] = Profile.find_by(user_id: current_user.id)
    else
      profiles[0] = Profile.first
    end
 
    profiles[1] = Profile.find(2)
    profiles[2] = Profile.find(3)

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

  
  def update
    if params[:type] == "intro"
        if current_user.update({ first_name: params[:first_name],
                            last_name: params[:last_name],
                            state: params[:state] }) 
          head :ok
        else
          render json: { errors: "Please fill the highlighted fields" }, status: 422
        end

    else
        @habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

        if @habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 

          if current_user.has_a_profile?
            current_user.update_profile
          end

          head :ok
        else
          render json: { errors: "Please fill the highlighted fields"}, status: 422 
        end
    end

    

  end


end
