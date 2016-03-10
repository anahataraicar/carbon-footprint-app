class FootprintsController < ApplicationController
  
  def index
  end

  def new
  end

  def create
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
    if current_user
      @user_profile = current_user.profiles.last
    end
    
    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]

    gon.saved_gas = current_user.save_gas
  end


  def update
  end

end






