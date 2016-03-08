@habits.each do |habit|
    json.set!(habit.footprint_type, habit.value.to_f)
end

