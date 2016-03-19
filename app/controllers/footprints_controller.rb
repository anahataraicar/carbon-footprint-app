class FootprintsController < ApplicationController
  
  def index

  end

  def show
    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]
  end


end






