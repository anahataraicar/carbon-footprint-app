class FootprintsController < ApplicationController
  

  def index

  end

  def show
    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]
    @show = true
  end

  def download_pdf
    pdf = Prawn::Document.new(:margin => [60, 60])
    pdf.fill_color "d24141"

    pdf.font 'Courier'
    require "open-uri"
    profile = current_user.profiles.last
   
  
    pdf.text "My Carbon Footprint", :color => "339933", align: :center, size: 40
    pdf.move_down 5
    pdf.text "I create #{profile.total_value.to_s} megattones of carbon dioxide a year!", :color => "88cc00", align: :center, size: 18
    pdf.move_down 10
    pdf.font_size 12
    habits = current_user.habits
    pdf.fill_color "000000"
    labels = ["Vehicle", "Public Transportation", "Air Travel", "Electricity", "Natural Gas", "Heating Oil", "Propane", "Housing", "Meat", "Dairy", "Grains", "Fruit", "Other"]
    index = 0
    data = []
    habits.each do |habit|
      row = [labels[index], habit.value.to_s]
      data.push(row)
      index += 1
    end
    data.unshift(["Habit","MT CO2 produced"])
    # pdf.move_up 
    pdf.text "My footprint breakdown:", size: 16
    
    pdf.table data, :row_colors => ["f6f6f6", "d6e3d9"], :header => true do |table|
      table.row(0).font_style = :bold
      table.rows(0..13).align = :center
    end
    pdf.font_size 14
    pdf.move_up 320
    pdf.indent(300) do
      gas = current_user.calc_save_gas
      pdf.text "• By getting a more fuel efficient car, I can save #{gas} MT of CO2"
      pdf.move_down 10
      bike = current_user.calc_bike
      pdf.text "• By riding my bike 20 miles a week, I can save #{bike} MT of CO2"
      pdf.move_down 10
      light = current_user.calc_lightbulb
      pdf.text "• By replacing 5 regular lightbulbs with CFLs, I can save #{light} MT of CO2"
      pdf.move_down 10
      veg = current_user.calc_veg
      pdf.text "• By switching to a vegetarian diet, I can save #{veg} MT of CO2"
    end
    pdf.move_down 110
    pdf.fill_color "00cc00"
    pdf.text "More tips to reduce my footprint!", size: 20
    pdf.move_down 8
    pdf.font_size 12
    pdf.text "• When possible, walk, carpool, or take public transportation"
    pdf.move_down 8
    pdf.text "• Use fuel efficient driving techniques by avoiding speeding and unnecessary acceleration"
    pdf.move_down 8
    pdf.text "• Purchase local food! This reduces the emissions of the vehicles that transport food from far away"
    pdf.move_down 8
    pdf.text "• Reduce, reuse, and recycle"
    pdf.move_down 8
    pdf.text "• Reduce, reuse, and recycle"
    pdf.move_down 8
    pdf.text "• Insulate and seal your home to prevent air from entering and leaving"
    pdf.move_down 8
    pdf.text "• Lower your water usage by purchasing water efficient shower heads, toilets, faucets, dishwashers, and washing machines"


    send_data pdf.render, type: "application/pdf", 
                          disposition: "inline",
                        filename: "my_carbon_footprint.pdf"
  end


end






