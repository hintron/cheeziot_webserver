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

# TODO: Only retrieve records with image data
# Assume that all records have an image, for now



# Get a hardcoded entry
# entry = client[database][collection].find_one({"_id": ObjectId("58a61687870a765994850d5a")})

# Sort from newest to oldest based on the kaa timestamp, and return the newest record
entry = client[database][collection].find().sort("header.timestamp", pymongo.DESCENDING).limit(1)[0]

# Get the most recent image record according to _id
# The _id field will contain an implicit timestamp in it
# See http://stackoverflow.com/questions/4421207/mongodb-how-to-get-the-last-n-records
# entry = client[database][collection].find().sort("_id", pymongo.DESCENDING).limit(1)[0]

# TODO: How to use find_one() instead of find().limit(1)? They aren't really interchangeable


# # Other tests
# cursor = client[database][collection].find().sort("_id", pymongo.DESCENDING)
# cursor = client[database][collection].find()
# print cursor[0].get("_id")


print "-----------------------"

print entry.get("_id")

# for doc in cursor:
#     print doc.get("_id")


raw_image_data = entry.get("event").get("image_data")
# print "raw_image_data length", len(raw_image_data)
# print type(decodestring(raw_image_data[0]))
f = file("public/images/test_out.bmp", "wb")
for i in raw_image_data:
	f.write(decodestring(i))

