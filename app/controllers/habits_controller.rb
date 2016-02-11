class HabitsController < ApplicationController

  def index

  end

  def new
    @partials = ["vehicle", "public_transportation", "air_travel"]
    counter = params[:counter]

    if params[:counter] 
      if params[:counter] = 2
        mileage = params[:mileage].to_f
        miles = params[:car_miles].to_f
        value = miles * 250 / mileage * 8.887 / 1000
        habit = Habit.create({ footprint_type: "vehicle",
                               value: value})
      elsif params[:counter] = 3
        emission_factor = params[:mode]
        miles = params[:public_miles]
        value = miles * 250 * emission_factor / 1000 / 1000

       
      end

      render :partial => "#{@partials[counter.to_i]}"
    else
      render :partial => "#{@partials[0]}"
    end

  end

  def create
    
    redirect_to "/habits/new"

  end

end
