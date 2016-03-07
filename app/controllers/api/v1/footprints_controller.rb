class Api::V1::FootprintsController < ApplicationController

  def index
    @habits = Habit.where("user_id = ?", current_user.id);
  end

end
