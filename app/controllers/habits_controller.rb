class HabitsController < ApplicationController

  def index
  end

  def new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
    @user_habits = current_user.habits
  end

  def create

    current_user.update({ state: params[:state]})
    habit = Habit.new
    value = []
    values << habit.calc_vehicle(params[:car_miles], params[:mileage], params[:gas_type])
    values << habit.calc_public_transportation(params[:public_miles], params[:mode])
    values << habit.calc_air_travel(params[:air_miles])
    values << habit.calc_electricity(params[:input_type], params[:input])
    values << habit.calc_natural_gas(params[:input_type], params[:input])
    values << habit.calc_heating(params[:input_type], params[:input])
    values << habit.calc_propane(params[:input_type], params[:input])
    values << habit.calc_home(params[:sqft])
    values << habit.calc_meat(params[:factor])
    values << habit.calc_dairy(params[:factor])
    values << habit.calc_grains(params[:factor])
    values << habit.calc_fruit(params[:factor])
    values << habit.calc_other(params[:factor])

    index = 0
    partials = ["vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  
    values.each do |value|
      Habit.create({  user_id: current_user.id,
                      value: value,
                      footprint_type: partials[index] })
      index += 1
    end

    redirect_to "/habits/#{current_user.id}"
  end

  def show
    @user_habits = current_user.habits
    @total_footprint = @user_habits.sum(:value)
  end

  def edit
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  end


  def update

    type = params[:type]

    current_user.update({ state: params[:state]}) if type == "state"

    habit = Habit.new

    value = habit.calc_vehicle(params[:car_miles], params[:mileage], params[:fuel_type]) if type == "vehicle"
    value = habit.calc_public_transportation(params[:public_miles], params[:mode]) if type == "public_transportation"
    value = habit.calc_air_travel(params[:air_miles]) if type == "air_travel"
    value = habit.calc_electricity(params[:input_type], params[:input]) if type == "electricity" 
    value = habit.calc_natural_gas(params[:input_type], params[:input]) if type == "natural_gas"
    value = habit.calc_heating(params[:input_type], params[:input]) if type == "heating"
    value = habit.calc_propane(params[:input_type], params[:input]) if type == "propane"
    value = habit.calc_home(params[:sqft]) if type == "home"
    value = habit.calc_meat(params[:factor]) if type == "meat"
    value = habit.calc_dairy(params[:factor]) if type == "dairy"
    value = habit.calc_grains(params[:factor]) if type == "grains"
    value = habit.calc_fruit(params[:factor]) if type == "fruit"
    value = habit.calc_other(params[:factor]) if type == "other"

    habit = Habit.where("user_id = ? AND footprint_type = ?", current_user.id, type)
    habit.last.update( value: value )

    redirect_to "/habits/#{current_user.id}"
   
  end

end

