class FootprintsController < ApplicationController
  
  def index

  end

  def new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]

    # creates habits for each partial, but without values (to check if done later)
    @partials.each do |partial|
      habit = Habit.create({  user_id: current_user.id, 
                              footprint_type: params[:type]
                              #value:  what should I set the value?? 0 maybe
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
      # flash[:success] = "Your profile has been successfully updated"
    end
    # byebug
    # redirect_to "/footprints/#{current_user.id}"
    head :ok
  end
end
