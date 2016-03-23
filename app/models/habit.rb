class Habit < ActiveRecord::Base

  belongs_to :user
  belongs_to :profile

  validates :input1, presence: true, on: :update
  validates :input2, presence: true, if: :has_two_inputs?, on: :update 
  validates :input3, presence: true, if: :has_three_inputs?, on: :update
  
  validates :value, numericality: true, on: :update
  
  validates :input1, numericality: true, on: :update
  validates :input2, numericality: true, if: :has_two_inputs?, on: :update
  validates :input3, numericality: true, if: :has_three_inputs?, on: :update


  def has_two_inputs?
    footprint_type == "public_transportation" || footprint_type == "electricity" || footprint_type == "natural_gas" || footprint_type == "heating" || footprint_type == "propane" ? true : false 
  end

  def has_three_inputs?
    footprint_type == "vehicle" ? true : false
  end

  def calculate_habit(footprint_type, hash)
    if footprint_type == "vehicle"
      if hash[:mileage] == "0"
        value = 0
      else 
        value = hash[:miles].to_f / hash[:mileage].to_f * hash[:fuel_type].to_f / 1000
      end
      input1 = hash[:miles]
      input2 = hash[:mileage]
      input3 = hash[:fuel_type]
    elsif footprint_type == "public_transportation"
      value = hash[:miles].to_f * hash[:mode].to_f / 1000 / 1000 
      input1 = hash[:miles]
      input2 = hash[:mode]
    elsif footprint_type == "air_travel"
      value = hash[:miles].to_f * 200 / 1000 / 1000
      input1 = hash[:miles]
    elsif footprint_type == "electricity"
      value = hash[:input].to_f * 0.000419551 / hash[:input_type].to_f
      input1 = hash[:input]
      input2 = hash[:input_type]
    elsif footprint_type == "natural_gas" 
      value = hash[:input].to_f * 0.0050 / hash[:input_type].to_f
      input1 = hash[:input]
      input2 = hash[:input_type]
    elsif footprint_type == "heating" # changed heating 8.51
      value = hash[:input].to_f * 8.51 / hash[:input_type].to_f / 1000
      input1 = hash[:input]
      input2 = hash[:input_type]
    elsif footprint_type == "propane"
      value = hash[:input].to_f * 5.76 / hash[:input_type].to_f / 1000   
      input1 = hash[:input]
      input2 = hash[:input_type] 
    elsif footprint_type == "home"
      value = hash[:sqft].to_f * 0.93 / 1000
      input1 = hash[:sqft]
    elsif footprint_type == "meat"
      value = hash[:factor].to_f * 523 * 4.92 / 1000 / 1000 * 365
      input1 = hash[:factor]
    elsif footprint_type == "dairy"
      value = hash[:factor].to_f * 286 * 4.86 / 1000 / 1000 * 365
      input1 = hash[:factor]
    elsif footprint_type == "grains"
      value = hash[:factor].to_f * 669 * 3.47 / 1000 / 1000 * 365
      input1 = hash[:factor]
    elsif footprint_type == "fruit"
      value = hash[:factor].to_f * 271 * 3.03 / 1000 / 1000 * 365
      input1 = hash[:factor]
    elsif footprint_type == "other"
      value = hash[:factor].to_f * 736 * 4.73 / 1000 / 1000 * 365
      input1 = hash[:factor]
    end
  
    update({ value: value,
             input1: input1,
             input2: input2 || nil , 
             input3: input3 || nil })
  end

end


