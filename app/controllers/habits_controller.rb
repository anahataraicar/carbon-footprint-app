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

    # index = 0
    # types = ["vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  
    # values.each do |value|
    #   Habit.create({  user_id: current_user.id,
    #                   value: value,
    #                   footprint_type: types[index] })
    #   index += 1
    # end

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

    current_user.update({ state: params[:state]})
    habit = Habit.new
    
    habit.calc_vehicle(params[:car_miles], params[:mileage], params[:gas_type])
    habit.calc_public_transportation(params[:public_miles], params[:mode])
    habit.calc_air_travel(params[:air_miles])
    habit.calc_electricity(params[:input_type], params[:input])
    habit.calc_natural_gas(params[:input_type], params[:input])
    habit.calc_heating(params[:input_type], params[:input])
    habit.calc_propane(params[:input_type], params[:input])
    habit.calc_home(params[:sqft])
    habit.calc_meat(params[:factor])
    habit.calc_dairy(params[:factor])
    habit.calc_grains(params[:factor])
    habit.calc_fruit(params[:factor])
    habit.calc_other(params[:factor])

    index = 0
    types = ["vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  
    values.each do |value|
      habit = Habit.find_by(footprint_type: types[index])
      habit.update( value: value )
      index += 1
    end

    redirect_to "/habits/#{current_user.id}"
   
  end

end

