class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable


  has_many :habits
  has_many :profiles
  belongs_to :company

  validates :first_name, :last_name, presence: true, on: :update

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable


  after_create :create_user_habits

  attr_reader :done


  def create_user_habits
    @partials = ["vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "meat", "dairy", "grains", "fruit", "other"]

    # creates habits for each partial, but without values (to check if done later)

    @partials[0..13].each do |partial|
      Habit.create({  user_id: id, 
                      footprint_type: partial,
                      value: 0 })
    end

    create_profile
    # redirect_to "/footprints/#{current_user.id}/edit"

  end
  

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

  def is_done? ## probably wont need this anymore 
    done = "yes"

    habits.each do |habit|
      if !(habit.value > 0.00)
        done = "no"
      end
    end

    if done == "no"
      return false
    else
      return true
    end
    
  end



  def save_gas
    habit = Habit.where("user_id = ? AND footprint_type = ?", id, "vehicle").last
    miles = habit.input1
    mileage = habit.input2
    (((miles/(mileage-5)) - (miles/mileage)) * 8.887 / 1000).round(2)
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

  def has_a_profile?
    profiles.last
  end


end
