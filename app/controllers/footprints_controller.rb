class FootprintsController < ApplicationController
  
  def index
  end

  def new
  end

  def create

  end

  def show
    if current_user.has_a_profile?
      @total = current_user.profiles.last.total_value
      @gasoline = (@total * 113).to_i
      @coal = (@total * 1074).to_i
      @miles = (@total * 2381).to_i
      @waste = (@total * 0.358).round(1)
      @trees = (@total * 25.6).to_i
      @acres = (@total * 0.82).round(2)
      @turbines = (@total * 0.0003).round(4)
    end
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






