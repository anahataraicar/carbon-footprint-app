class FootprintsController < ApplicationController
  

  def index

  end

  def show
    @partials = ["intro", "vehicle", "public_transportation", "air_travel", "electricity", "natural_gas", "heating", "propane", "home", "food"]
    @show = true
  end

  def download_pdf
    pdf = Prawn::Document.new(:margin => [50, 50])
    pdf.fill_color "d24141"

    pdf.font 'Times-Roman'
    require "open-uri"
    profile = current_user.profiles.last
   
  
    pdf.text "MY CARBON FOOTPRINT", :color => "339933", align: :center, size: 43
    pdf.move_down 5
   
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
    pdf.move_down 5
    pdf.indent(50) do
      pdf.text "Footprint Breakdown:", size: 20, color: "74913b"
    end
    pdf.move_down 5

    pdf.table data, :row_colors => ["b2cb80", "74913b"], :cell_style => { border_color: "FFFFFF", :text_color => "FFFFFF", :size => 14, }, :column_widths => [145, 130] do |table|
      table.row(0).font_style = :bold
      table.rows(0..13).align = :center
    end
    pdf.font_size 14
    pdf.move_up 385


    user_count = Profile.all.count
    user_total_value = Profile.all.sum(:total_value)
    average = user_total_value / user_count
    total = Profile.find_by(user_id: current_user.id).total_value.to_f
    difference = total - average
    percent = (difference / average * 100).round(2)

    if percent > 0 
      string = "worse"
    else
      string = "better"
      percent = percent.abs
    end

    pdf.indent(305) do
       pdf.text "I create #{profile.total_value.to_s} MEGATONNES of carbon dioxide a year, which makes me #{percent.to_s}% #{string} than the average user!", :color => "88cc00", align: :center, size: 18
      pdf.move_down 10
      pdf.fill_color "617931"
      pdf.text "I can save...", size: 17
      pdf.move_down 10
      gas = current_user.calc_save_gas
      pdf.text "• #{gas} MT of CO2 by driving a more fuel efficient car"
      pdf.move_down 12
      bike = current_user.calc_bike
      pdf.text "• #{bike} MT of CO2 by riding my bike 20 miles a week,"
      pdf.move_down 10
      light = current_user.calc_lightbulb
      pdf.text "• #{light} MT of CO2 by replacing 5 regular lightbulbs with CFLs"
      pdf.move_down 10
      veg = current_user.calc_veg
      pdf.text "• #{veg} MT of CO2 by switching to a vegetarian diet"
      pdf.move_down 10
      pdf.text "• 0.25 MT of CO2 by turning up the thermostat in the summer"
      pdf.move_down 10
      pdf.text "• 0.52 MT of CO2 by turning down the thermostat in the winter"
    end

    pdf.move_down 30
    pdf.fill_color "339933"
    pdf.text "More tips to reduce my footprint!", size: 20
    pdf.move_down 8
    pdf.font_size 14
    pdf.text "• When possible, walk, carpool, or take public transportation"
    pdf.move_down 8
    pdf.text "• Use fuel efficient driving techniques by avoiding speeding and unnecessary acceleration"
    pdf.move_down 8
    pdf.text "• Purchase local food! This reduces the emissions of the vehicles that transport food from far away"
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






