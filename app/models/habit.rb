class Habit < ActiveRecord::Base

  belongs_to :user
  belongs_to :profile

  def calc_vehicle_gasoline(miles, mileage)
    miles.to_f * 250 / mileage.to_f * 8.887 / 1000
  end

  def calc_vehicle_diesel(miles, mileage)
    miles.to_f * 250 / mileage.to_f * 10.18/ 1000
  end

  def calc_public_transport(miles,mode)
    miles.to_f * mode.to_f * 300 / 1000 / 1000 
  end

  def calc_air(miles)
    miles.to_f * 200 / 1000 / 1000
  end

  def calc_electricity_watts(watts)
    watts.to_f * 0.000689551
  end

  def calc_electricity_cost(cost)
    electricity = Unirest.get("http://api.eia.gov/series/?api_key=0632EE78BEB53994A3CE648E3642C15C&series_id=ELEC.PRICE.#{current_user.state}-COM.A").body["series"][0]["data"][0][1]
    cost.to_f / (electricity/ 100) * 0.000689551
  end

  def cacl_ng_therms(therms)
    value =therms.to_f * 0.0053
  end

  def calc_ng_cost(cost)
    cost.to_f / (9.50/100) * 0.0053  # need value
  end

  def calc_ng_volume(volume)
    natural_gas = Unirest.get("http://api.eia.gov/series/?api_key=0632EE78BEB53994A3CE648E3642C15C&series_id=NG.N3020#{current_user.state}3.A").body["series"][0]["data"][0][1]
    volume.to_f / natural_gas * 0.0053 
  end

  def calc_heat_gallons(gallons)
    gallons.to_f * 10.16 / 1000
  end

  def calc_heat_cost(cost)
    cost.to_f / 4.02 * 10.16 / 1000 
  end

  def calc_propane_gallons(gallons)
    gallons.to_f * 5.76 / 1000
  end

  def calc_propane_cost(cost)
    cost.to_f / 2.47 * 5.76 / 1000 
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
  

end
