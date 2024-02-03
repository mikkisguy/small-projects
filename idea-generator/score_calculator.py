dev_time = input("Enter the dev time: ")
extra_time = input("Enter the additional time: ")
success = input("Was it successful (y/n): ")

success_modifier = 10
minus_points = round(int(extra_time) / int(dev_time) * 100)
calculate_points = 100 - minus_points

if success == "y":
  calculate_points += success_modifier
else:
  calculate_points -= success_modifier

if calculate_points > 100:
  calculate_points = 100

if calculate_points < 0:
  calculate_points = 0

def get_success_text():
  if success == "y":
    return f"Success bonus: +{success_modifier}"
  else:
    return f"Fail penalty: -{success_modifier}"

print()
print("Time penalty: -" + str(minus_points))
print(get_success_text())
print("Overall score: " + str(calculate_points) + " / 100")
