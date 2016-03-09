class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_many :habits
  has_many :profiles
  belongs_to :company

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable


  def sum_travel
    sum = 0
    ["vehicle", "public_transportation", "air_travel"].each do |footprint_type|
      sum += habits.find_by(footprint_type: footprint_type).value.to_f
    end
    sum.round(2)
  end

  def sum_housing
    sum = 0;
    ["electricity", "natural_gas", "heating", "propane", "home"].each do |footprint_type|
      sum += habits.find_by(footprint_type: footprint_type).value.to_f
    end
    sum.round(2)
  end

  def sum_food
    sum = 0
    ["meat", "dairy", "grains", "fruit", "other"].each do |footprint_type|
      sum += habits.find_by(footprint_type: footprint_type).value.to_f
    end
    sum.round(2)
  end


  def save_gas
    habit = Habit.where("user_id = ? AND footprint_type = ?", id, "vehicle").last
    miles = habit.input1
    mileage = habit.input2
    (((miles/(mileage-5)) - (miles/mileage)) * 8.887 / 1000).round(2)
  end

  def is_done? ## probably wont need this anymore 
    return true 
    habits.each { |habit| return false if habit.value == 0}
  end


  def create_profile
    total_footprint = habits.sum(:value)
    Profile.create ({ user_id: id, total_value: total_footprint })
  end

  def update_profile
    total_footprint = habits.sum(:value)
    profile = Profile.find_by(user_id: id)
    profile.update(total_value: total_footprint)
  end


end
