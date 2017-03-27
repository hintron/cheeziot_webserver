import pymongo
import os
import datetime
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
# For sorting nested fields, see http://stackoverflow.com/questions/12031507/mongodb-sorting-by-nested-object-value
entry = client[database][collection].find().sort("header.timestamp", pymongo.DESCENDING).limit(1)[0]

# Get the most recent image record according to _id
# The _id field will contain an implicit timestamp in it
# See http://stackoverflow.com/questions/4421207/mongodb-how-to-get-the-last-n-records
# entry = client[database][collection].find().sort("_id", pymongo.DESCENDING).limit(1)[0]

# NOTE: find_one() and find().limit(1) aren't perfectly interchangeable
# See http://dba.stackexchange.com/questions/7573/difference-between-mongodbs-find-and-findone-calls

# # Other tests
# cursor = client[database][collection].find().sort("_id", pymongo.DESCENDING)
# cursor = client[database][collection].find()
# print cursor[0].get("_id")


print "-----------------------"

print entry.get("_id")
name = entry.get("event").get("person_name").rstrip()

if os.path.isfile("public/faces.html"):
	os.remove("public/faces.html")

#construct the faces.html page to be served to a client.
last_seen = open("public/faces.html", "w")
last_seen.write("<!doctype html>\n")
last_seen.write("  <head>\n")
last_seen.write("    <title>Faces of the Clyde</title>\n")
last_seen.write("  </head>\n")
last_seen.write("  <body>\n")
last_seen.write("    <img src=\"images/faces.png\">\n")
last_seen.write("    <div>\n")
last_seen.write("      <img src=\"images/test_out.bmp\" width=\"200\" height=\"200\">\n")
name_string =   "      <font size = \"6\" face=\"Courier New\">" + name + "</b>\n"
last_seen.write("    </div>\n")
last_seen.write("    <div>\n")
last_seen.write(name_string)
last_seen.write("    </div>\n")
last_seen.write("  </body>\n")
last_seen.write("</html>\n")
last_seen.close()


raw_image_data = entry.get("event").get("image_data")

#if test_out.bmp already exists, delete it
if os.path.isfile("public/images/test_out.bmp"):
	os.remove("public/images/test_out.bmp")

f = file("public/images/test_out.bmp", "wb")
for i in raw_image_data:
	f.write(decodestring(i))

