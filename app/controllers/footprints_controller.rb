class FootprintsController < ApplicationController
  def index
  end

  def new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]

    # creates habits for each partial, but without values (to check if done later)
    @partials.each do |partial|
      habit = Habit.create({  user_id: current_user.id, value: value, footprint_type: params[:type] })
    end

  end

  def create

    current_user.update({ state: params[:state]}) if params[:type] == "state"
    habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

    habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
    
    habit.update( value: value )
    
    # habit.save_user_input ?!?!?
   
    if current_user.is_done?
      current_user.create_profile
      redirect_to "/footprints/#{current_user.id}"
    else
      redirect_to "/footprints/new"
    end
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

    value = habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
    
    habit.update( value: value )
    current_user.update_profile 
    redirect_to "/footprints/#{current_user.id}"
  end
end
