class HabitsController < ApplicationController

  def index

  end

  def new
    @partials = ["state", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]
  end

  def create

    question = params[:type]

    if question == "state"
      current_user.update({ state: params[:state]})
    end

    habit = Habit.new
    # ({ user_id: current_user.id })
   
    if question == "vehicle"
      if params[:fuel_type] == "gasoline"
        value = habit.calc_vehicle_gasoline(params[:car_miles], params[:mileage])
      elsif params[:fuel_type] == "diesel"
        value = habit.calc_vehicle_diesel(params[:car_miles], params[:mileage])
      end
    elsif question == "public_transportation"
      value = habit.calc_public_transport(params[:public_miles], params[:mode])
    elsif question == "air_travel"
      value = habit.calc_air(params[:air_miles])
    elsif question == "electricity"
      if params[:input_type] == "watts"
        value = habit.calc_electrcity_watts(params[:electricity_input])
      elsif params[:input_type] == "yearly_cost"
        value = habit.calc_electricity_cost(params[:electricity_input])
      end
    elsif question == "natural_gas"
      if params[:input_type] == "therms"
        value = habit.calc_ng_therms(params[:natural_gas_input])
      elsif params[:input_type] == "yearly_cost"
        value = habit.calc_ng_cost(params[:natural_gas_input].to_f)
      elsif params[:input_type] == "cubic_feet"
        value = habit.calc_ng_volume(params[:natural_gas_input])
      end
    elsif question == "heating"
      if params[:input_type] == "gallons"
        value = habit.calc_heat_gallons(params[:heating_input])
      elsif params[:input_type] == "yearly_cost"
       value = habit.calc_heat_cost(params[:heating_input])
      end
    elsif question == "propane"
      if params[:input_type] == "gallons"
        value = habit.calc_propane_gallons(params[:heating_input])
      elsif params[:input_type] == "yearly_cost"
        value = habit.calc_propane_cost(params[:heating_input])
      end
    elsif question == "home"
      value = habit.calc_home(params[:sqft])
    elsif question == "meat" 
      value = habit.calc_meat(params[:factor])
    elsif question == "dairy"
      value = habit.calc_dairy(params[:factor])
    elsif question = "grains"
      value = habit.calc_grains(params[:factor])
    elsif question == "fruit"
      value = habit.calc_fruit(params[:factor])
    elsif question == "other"
      value = habit.calc_other(params[:factor])
    end

    habit.update({ value: value,
                   footprint_type: params[:type] })
    habit.save

    redirect_to "/habits/new"
  end

  def show
    @user_habits = current_user.habits
    @total_footprint = @user_habits.sum(:value)
    @link = @user_habits.first
  end

end

