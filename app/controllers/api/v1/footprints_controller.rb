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

    
    profiles = []
    counter = 20
    while counter > 0
      other_profile = Profile.all.sample
      user = other_profile.user
      if user.is_done?
        profiles << other_profile
        counter = counter - 1
      end
    end

    totals = []
    state = []
    kwh = []
    meat = []

    profiles.each do |profile|
      state << profile.user.state
      totals << profile.user.sum_housing.to_f
      meat << profile.user.habits.find_by(footprint_type: "meat").value.to_f
      kwh << profile.user.habits.find_by(footprint_type: "electricity").value.to_f
    end

    @bubble_data = [[meat], [kwh], [totals], [state]]

  end

  def show
    @habits = Habit.where("user_id = ?", current_user.id)
    @total = Profile.find_by(user_id: current_user.id).total_value.to_f
    
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

    profiles = Profile.all
    user_count = profiles.count
    user_total_value = profiles.sum(:total_value)
    @average = user_total_value / user_count

    habits = Habit.where("footprint_type = ? OR footprint_type = ? OR footprint_type = ?", "vehicle", "public_transportation", "air_travel")
    @travel = habits.sum(:value).to_f
    habits = Habit.where("footprint_type = ? OR footprint_type = ? OR footprint_type = ? OR footprint_type = ?", "electricity", "natural_gas", "heating", "propane")
    @home = habits.sum(:value).to_f
    habits = Habit.where("footprint_type = ? OR footprint_type = ? OR footprint_type = ? OR footprint_type = ? OR footprint_type = ?", "meat", "dairy", "grains", "fruit", "other")
    @food = habits.sum(:value).to_f

  end

  
  def update
    if params[:type] == "intro"
        first_name = params[:first_name]
        last_name = params[:last_name]
        if first_name && last_name
          current_user.update({  first_name: first_name.capitalize,
                                  last_name: last_name.capitalize,
                                  state: params[:state] }) 
          head :ok
        else
          render json: { errors: "Please fill the highlighted fields" }, status: 422
        end

    else
        @habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

        if @habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
          # if current_user.has_a_profile?
            current_user.update_profile
          # end
          head :ok
        else
          render json: { errors: "Please fill the highlighted fields"}, status: 422 
        end
    end
  end


end
