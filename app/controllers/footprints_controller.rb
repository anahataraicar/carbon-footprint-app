class FootprintsController < ApplicationController
  def index
  end

  def slider
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
   
    if current_user.is_done?
      current_user.create_profile
      flash[:success] = "Your footprint has been successfully calculated!"
      redirect_to "/footprints/#{current_user.id}"
    else
      redirect_to "/footprints/new"
    end
  end

  def show
    @user_habits = current_user.habits
    @user_profile = current_user.profiles.last
    @ordered_profiles = Profile.order(:total_value)
    
    gon.saved_gas = current_user.save_gas

    gon.habits = Hash.new
    @user_habits.each do |habit|
      gon.habits[habit.footprint_type] = habit.value.to_f
    end

    gon.profiles = Hash.new
    @ordered_profiles.each do |profile|
      gon.profiles[profile.user.first_name] = profile.total_value
    end

    # @profiles = Hash.new
    # @ordered_profiles.each do |profile|
    #   @profiles[profile.user.first_name] = profile.total_value
    # end



  end

  def edit
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
    redirect_to "/footprints/#{current_user.id}"

  end
end
