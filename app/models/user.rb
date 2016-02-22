class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_many :habits
  has_many :profiles
  belongs_to :company

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  
  def sum_travel
    habit1 = Habit.where("user_id = ? AND footprint_type = ?", id, "vehicle").last.value
    habit2 = Habit.where("user_id = ? AND footprint_type = ?", id, "public_transportation").last.value
    habit3 = Habit.where("user_id = ? AND footprint_type = ?", id, "air_travel").last.value
    habit1 + habit2 + habit3
  end

  def sum_energy
    habit1 = Habit.where("user_id = ? AND footprint_type = ?", id, "electricity").last.value
    habit2 = Habit.where("user_id = ? AND footprint_type = ?", id, "natural_gas").last.value
    habit3 = Habit.where("user_id = ? AND footprint_type = ?", id, "heating").last.value
    habit4 = Habit.where("user_id = ? AND footprint_type = ?", id, "propane").last.value
    habit5 = Habit.where("user_id = ? AND footprint_type = ?", id, "home").last.value
    habit1 + habit2 + habit3 + habit4 + habit5
  end

  def sum_food
    habit1 = Habit.where("user_id = ? AND footprint_type = ?", id, "meat").last.value
    habit2 = Habit.where("user_id = ? AND footprint_type = ?", id, "dairy").last.value
    habit3 = Habit.where("user_id = ? AND footprint_type = ?", id, "grains").last.value
    habit4 = Habit.where("user_id = ? AND footprint_type = ?", id, "fruit").last.value
    habit5 = Habit.where("user_id = ? AND footprint_type = ?", id, "other").last.value
    habit1 + habit2 + habit3 + habit4 + habit5
  end


  def save_gas
    habit = Habit.where("user_id = ? AND footprint_type = ?", id, "vehicle").last
    miles = habit.input1
    mileage = habit.input2
    (((miles/(mileage-5)) - (miles/mileage)) * 8.887 / 1000).round(2)
  end

  def is_done?
    return true
    habits.each { |habit| return false if !habit.value}
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
