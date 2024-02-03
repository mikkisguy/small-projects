import random
import idea_crumbs

dev_time = random.choice(idea_crumbs.dev_times)
keywords_count = 3

def get_plan_time():
  random_percentage = random.randint(25, 51) # 25% - 50%
  return round((dev_time * random_percentage / 100))

print(f"Language: {random.choice(idea_crumbs.languages)}")
print(f"Plan time: {get_plan_time()} min")
print(f"Dev time: {dev_time} min")
print(f"Boring keywords: {random.sample(idea_crumbs.boring_keywords, keywords_count)}") # Takes unique values
print(f"Fun keywords: {random.sample(idea_crumbs.fun_keywords, keywords_count)}") # Takes unique values
