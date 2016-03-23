@habits.each do |habit|
    json.set!(habit.footprint_type, habit.value.to_f)
end

json.set! :done, @done
json.set! :saved_gas, @gas 
json.set! :bike, @bike
json.set! :lightbulb, @lightbulb
json.set! :veg, @veg
json.set! :total, @total
json.set! :average, @average
json.set! :travel, @travel
json.set! :housing, @home
json.set! :food, @food
json.set! :thermostat_down, @thermostat_down
json.set! :thermostat_up, @thermostat_up