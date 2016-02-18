class Habit < ActiveRecord::Base

  belongs_to :user
  belongs_to :profile

  def calculate_habit(footprint_type, hash)
    if footprint_type == "vehicle"
      hash[:car_miles].to_f / hash[:mileage].to_f * hash[:fuel_type].to_f / 1000
    elsif footprint_type == "public_transportation"
      hash[:public_miles].to_f * hash[:mode].to_f / 1000 / 1000 
    elsif footprint_type == "air_travel"
      hash[:air_miles].to_f * 200 / 1000 / 1000
    elsif footprint_type == "electricity"
      hash[:input].to_f * 0.000689551 / hash[:input_type].to_f
    elsif footprint_type == "natural_gas"
      hash[:input].to_f * 0.0053 / hash[:input_type].to_f
    elsif footprint_type == "heating"
      hash[:input].to_f * 10.16 / hash[:input_type].to_f / 1000
    elsif footprint_type == "propane"
      hash[:input].to_f * 5.76 / hash[:input_type].to_f / 1000    
    elsif footprint_type == "home"
      hash[:sqft].to_f * 0.93 / 1000
    elsif footprint_type == "meat"
      hash[:factor].to_f * 523 * 4.52 / 1000 / 1000 * 365
    elsif footprint_type == "dairy"
      hash[:factor].to_f * 286 * 4.66 / 1000 / 1000 * 365
    elsif footprint_type == "grains"
      hash[:factor].to_f * 669 * 1.47 / 1000 / 1000 * 365
    elsif footprint_type == "fruit"
      hash[:factor].to_f * 271 * 3.03 / 1000 / 1000 * 365
    elsif footprint_type == "other"
      hash[:factor].to_f * 736 * 3.73 / 1000 / 1000 * 365
    end
  end

  def save_user_input(input_type, hash)
    if footprint_type == "vehicle"
      user_input[0] = hash["car_miles"].to_f 
      user_input[1]= hash["mileage"].to_f 
      user_input[2] = hash["fuel"].to_f 
    elsif footprint_type == "public_transportation"
      hash["public_miles"].to_f * hash["mode"].to_f / 1000 / 1000 
    elsif footprint_type == "air_travel"
      hash["air_miles"].to_f * 200 / 1000 / 1000
    elsif footprint_type == "electricity"
      hash["input"].to_f * 0.000689551 / hash["input_type"].to_f
    elsif footprint_type == "natural_gas"
      hash["input"].to_f * 0.0053 / hash["input_type"].to_f
    elsif footprint_type == "heating"
      hash["input"].to_f * 10.16 / hash["input_type"].to_f / 1000
    elsif footprint_type == "propane"
      hash["input"].to_f * 5.76 / hash["input_type"].to_f / 1000
    elsif footprint_type == "home"
      hash["sqft"].to_f * 0.93 / 1000
    elsif footprint_type == "meat"
      hash["factor"].to_f * 523 * 4.52 / 1000 / 1000 * 365
    elsif footprint_type == "dairy"
      hash["factor"].to_f * 286 * 4.66 / 1000 / 1000 * 365
    elsif footprint_type == "grains"
      hash["factor"].to_f * 669 * 1.47 / 1000 / 1000 * 365
    elsif footprint_type == "fruit"
      hash["factor"].to_f * 271 * 3.03 / 1000 / 1000 * 365
    elsif footprint_type == "other"
      hash["factor"].to_f * 736 * 3.73 / 1000 / 1000 * 365
    end
  end

end


