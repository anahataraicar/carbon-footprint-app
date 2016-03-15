class Api::V1::FootprintsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    profiles = []
    profiles[0] = Profile.find_by(user_id: current_user.id)
    counter = 2

    while counter > 0
      other_profile = Profile.all.sample
      user = other_profile.user
      if user.is_done?
        profiles << other_profile
        counter = counter - 1
      end
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
    if current_user.is_done?
      @gas = current_user.calc_save_gas.to_f 
      @bike = current_user.calc_bike.to_f
      @lightbulb = current_user.calc_lightbulb.to_f
      @veg = current_user.calc_veg.to_f
    else
      @gas = 0
      @bike = 0
      @lightbulb = 0
      @veg = 0
    end
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
