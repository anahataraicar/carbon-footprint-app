class FootprintsController < ApplicationController
  
  def index

  end


  def download_pdf
    pdf = Prawn::Document.new
    require "open-uri"

    
    pdf.text "hello world"
    send_data pdf.render, type: "application/pdf", 
                          disposition: "inline",
                          filename: "my_carbon_footprint.pdf"
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

    if current_user.has_a_profile?
      @total = current_user.profiles.last.total_value
      @cars = (@total * 0.211).round(1)
      @waste = (@total * 0.358).round(1)
      @oil = (@total * 2.3).to_i
      @homes = (@total * 0.091).round(2)
      @trees = (@total * 25.6).to_i
      @acres = (@total * 0.82).round(2)
      @turbines = (@total * 0.0003).round(4)

      @cars_counter = @cars.ceil 
      @waste_counter = @waste.ceil
      @acres_counter = @acres.ceil
      @homes_counter = @homes.ceil
      @turbines_counter = @turbines.ceil 
      @trees_counter = (@trees * 0.70 ).ceil
    end

    

  
  end


  def update
  end

end






