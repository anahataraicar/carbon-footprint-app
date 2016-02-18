class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  has_many :habits
  has_many :profiles
  belongs_to :company

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def create_profile
    total_footprint = habits.sum(:value)
    Profile.create ({ user_id: id, total_value: total_footprint })
  end

  def save_profile
    total_footprint = habits.sum(:value)
    profile = Profile.find_by(user_id: id)
    profile.update(total_value: total_footprint)
  end


end
