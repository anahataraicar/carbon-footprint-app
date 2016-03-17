@profiles.each do |profile|
  json.array! profile
end

@bubble_data.each do |data|
  json.array! data
end
