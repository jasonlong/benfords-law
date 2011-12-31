count = 0
sum = 0
min = nil
max = nil
file = File.new("raw-russian-data.csv", "r")
outfile = File.new("2011-united-russia-votecounts.json","w")
digits = {}
(0..9).each do |d|
  digits[d] = 0
end

while (line = file.gets)
  count += 1
  a = line.split(";")
  val = a[11].to_i
  min = val if min == nil || val < min
  max = val if max == nil || val > max
  digits[val.to_s[0,1].to_i] += 1
  sum += val
end
file.close
(digits.to_a.sort).each do |d|
  outfile.puts "    \""+d[0].to_s+"\": "+((100.00*d[1]/count)).to_s[0,4]+","
  puts "    \""+d[0].to_s+"\": "+((100.00*d[1]/count)).to_s[0,4]+","
end

puts "###################"
puts "count: "+count.to_s
puts "sum: "+sum.to_s
puts "min: "+min.to_s
puts "max: "+max.to_s
