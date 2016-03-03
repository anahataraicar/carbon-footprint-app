class FootprintsController < ApplicationController
  
  def index        
  end

  def new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]

    # creates habits for each partial, but without values (to check if done later)
    @partials.each do |partial|
      habit = Habit.create({  user_id: current_user.id, 
                              footprint_type: params[:type]
                              #value:  what should I set the value??
                              })
    end

  end

  def create

    current_user.update({ state: params[:state]}) if params[:type] == "state"
    habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

    habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
   
    if current_user.is_done?
      current_user.create_profile
      flash[:success] = "Your footprint has been successfully calculated!"
      redirect_to "/footprints/#{current_user.id}"
    else
      redirect_to "/footprints/new"
    end
  end

  def show
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

  def edit
    @habit = Habit.new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  end


  def update
    if params[:type] == "state"
      current_user.update({ state: params[:state]}) 
    else 
      @habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

      @habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 

      current_user.update_profile 
      flash[:success] = "Your profile has been successfully updated"
    end
    # byebug
    redirect_to "/footprints/#{current_user.id}"

  end
end
