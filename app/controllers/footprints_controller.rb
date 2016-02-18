class FootprintsController < ApplicationController
  def index
  end

  def new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  end

  def create

    current_user.update({ state: params[:state]}) if params[:type] == "state"

    habit = Habit.new
    value = habit.calculate_habit( params[:type], {car_miles: params[:car_miles], mileage: params[:mileage], fuel_type: params[:fuel_type], public_miles: params[:public_miles], mode: params[:mode], air_miles: params[:air_miles], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
    habit = Habit.create({  user_id: current_user.id, value: value, footprint_type: params[:type] })
   
    # current_user.create_profile 
    redirect_to "/footprints/new"
  end

  def show
    @user_habits = current_user.habits
    @user_profile = current_user.profiles.last
    @ordered_profiles = Profile.order(:total_value)

  end

  def edit
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  end


  def update
    current_user.update({ state: params[:state]}) if params[:type] == "state"

    habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

    value = habit.calculate_habit( params[:type], {car_miles: params[:car_miles], mileage: params[:mileage], fuel_type: params[:fuel_type], public_miles: params[:public_transportation], mode: params[:mode], air_miles: params[:air_miles], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
    
    habit.update( value: value )
    current_user.save_profile 
    redirect_to "/footprints/#{current_user.id}"
  end
end
