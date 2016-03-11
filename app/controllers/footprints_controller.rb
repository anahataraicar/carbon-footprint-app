class FootprintsController < ApplicationController
  
  def index
  end

  def new
  end

  def create

  end

  def show
  end

  def edit
    if current_user
      @user_profile = current_user.profiles.last
    end
    
    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]

    # if current_user.is_done?
      gon.saved_gas = current_user.save_gas
    # end
    
    puts "****************************************"
    puts "***************************"
    x = current_user.is_done?
    puts x
    puts "***************************"
    puts "***********************************"

  end


  def update
  end

end






