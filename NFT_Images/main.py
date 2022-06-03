import json

# for i in range(0,24):
#   data = {
#     "name": "Beta Membership V1",
#     "description": "This NFT represent the membership of Beta Fellowship community. Each NFT holder will be able to access to the utilities of Beta Fellowship community, include but not limited to education contents, speaker's series with Beta Mentors.",
#     "image": "ipfs://QmedJJ3U5tCN79Fr6hxBtjJ5WzzSspZnCnSHypn5MvTAeB/{}.png".format(i),
#     "edition": i
#   }
#   with open('./json/{}.json'.format(i), 'w') as f:
#     print(i)
#     json.dump(data, f, indent=2)
jsonArray = []
for i in range(0,24):
  f = open ('./json/{}.json'.format(i), "r")
  data = json.loads(f.read())
  jsonArray.append(data)

with open('./json/_metadata.json', 'w') as f2:
  json.dump(jsonArray, f2, indent=2)