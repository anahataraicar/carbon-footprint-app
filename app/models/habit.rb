class Habit < ActiveRecord::Base

  belongs_to :user
  belongs_to :profile

  def calc_vehicle(miles, mileage, fuel)
    # need to change 250 to 365
    miles.to_f * 250 / mileage.to_f * fuel.to_f / 1000
  end

  def calc_public_transportation(miles,mode)
    miles.to_f * mode.to_f * 300 / 1000 / 1000 
  end

  def calc_air_travel(miles)
    miles.to_f * 200 / 1000 / 1000
  end

  def calc_electricity(input_type, input)
    if input_type == "watts"
      input.to_f * 0.000689551
    else
      # electricity = Unirest.get("http://api.eia.gov/series/?api_key=0632EE78BEB53994A3CE648E3642C15C&series_id=ELEC.PRICE.#{current_user.state}-COM.A").body["series"][0]["data"][0][1]
      electricity = 10.15 # made up - need average
      input.to_f / (electricity/ 100) * 0.000689551
    end
  end
  
  def calc_natural_gas(input_type, input)
    if input_type == "therms"
      input.to_f * 0.0053
    elsif input_type == "yearly_cost"
      input.to_f / (9.50/100) * 0.0053  # need value
    else # volume
      # natural_gas = Unirest.get("http://api.eia.gov/series/?api_key=0632EE78BEB53994A3CE648E3642C15C&series_id=NG.N3020#{current_user.state}3.A").body["series"][0]["data"][0][1]
      natural_gas = 8.9 # need better value
      input.to_f / natural_gas * 0.0053 
    end
  end


  def calc_heating(cost_factor, input)
    input.to_f * 10.16 / cost_factor.to_f / 1000
  end

  def calc_propane(cost_factor, input)
    input.to_f * 5.76 / cost_factor.to_f / 1000
  end

  def calc_home(sqft)
    sqft.to_f * 0.93 / 1000
  end

  def calc_meat(factor)
    factor.to_f * 523 * 4.52 / 1000 / 1000 * 365
  end

  def calc_dairy(factor)
    factor.to_f * 286 * 4.66 / 1000 / 1000 * 365
  end

  def calc_grains(factor)
    factor.to_f * 669 * 1.47 / 1000 / 1000 * 365
  end

  def calc_fruit(factor)
    factor.to_f * 271 * 3.03 / 1000 / 1000 * 365
  end

  def calc_other(factor)
    factor.to_f * 736 * 3.73 / 1000 / 1000 * 365
  end

  def create_habit(value,footprint_type)
    Habit.create({ value: value,
                   footprint_type: footprint_type })
  end


end
