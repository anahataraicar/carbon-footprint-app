@habits.each do |habit|
    json.set!(habit.footprint_type, habit.value.to_f)
end

json.set! :saved_gas, @gas 
json.set! :bike, @bike
json.set! :lightbulb, @lightbulb
json.set! :veg, @veg