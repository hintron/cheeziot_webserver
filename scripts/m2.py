import pymongo
from base64 import decodestring

from bson.objectid import ObjectId

from pymongo import MongoClient

config_file = open("config", 'r')

collection = ''
database = ''

#Parse the configuration (config) file
for line in config_file:
	field,val = line.split("=")
	if(field == "COLLECTION"):
		collection = val.rstrip()
	elif(field == "DATABASE"):
		database = val.rstrip()

print collection
print database


client = MongoClient('localhost', 27017)

#Get latest entry in MongoDB
entry = client[database][collection].find_one({"_id": ObjectId("58a61687870a765994850d5a")})
# entry = client[database][collection].find({}).sort("{$natural:-1}").limit(1)

#Only retrieve records with image data
# entry = client[database][collection].find({}).sort('timestamp',pymongo.ASCENDING)


# print "-----------------------"

# id = ' '

# for doc in entry:
# 	print doc.get("_id")

# print id

# entry = client[database][collection].find_one({"_id": ObjectId(id)})

raw_image_data = entry.get("event").get("image_data")

print "raw_image_data length", len(raw_image_data)

print type(decodestring(raw_image_data[0]))
f = file("public/images/test_out.bmp", "wb")
for i in raw_image_data:
	f.write(decodestring(i))

