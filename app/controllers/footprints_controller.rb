class FootprintsController < ApplicationController
  
  def index
  
  end

  def new
    # @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]

    # # creates habits for each partial, but without values (to check if done later)

    # @partials[1..13].each do |partial|
    #   Habit.create({  user_id: current_user.id, 
    #                   footprint_type: partial,
    #                   value: 1 })
    # end

    # render :edit 

  end

  def create
    # current_user.update({ state: params[:state]}) if params[:type] == "state"
    # habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

    # habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 
   
    # if current_user.is_done?
    #   current_user.create_profile
    #   flash[:success] = "Your footprint has been successfully calculated!"
    #   redirect_to "/footprints/#{current_user.id}"
    # else
    #   redirect_to "/footprints/new"
    # end


    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]

    # creates habits for each partial, but without values (to check if done later)

    @partials[1..13].each do |partial|
      Habit.create({  user_id: current_user.id, 
                      footprint_type: partial,
                      value: 0 })
    end

    current_user.create_profile

    redirect_to "/footprints/#{current_user.id}/edit"

  end

  def show

  end

  def edit

    @user_profile = current_user.profiles.last
    @habit = Habit.new
    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]
  end


  def update
    

    if params[:type] == "intro"
      current_user.update({ first_name: params[:first_name],
                            last_name: params[:last_name],
                            state: params[:state] }) 
    else
        @habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, params[:type]).last

        if @habit.calculate_habit( params[:type], {miles: params[:miles], mileage: params[:mileage], fuel_type: params[:fuel_type], mode: params[:mode], input_type: params[:input_type], input: params[:input], sqft: params[:sqft], factor: params[:factor]}.reject { |key, value| !value }) 

          current_user.update_profile 
        else
          @habit.errors.messages 
          
        end

    end
    head :ok
  end

end






