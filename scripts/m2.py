import pymongo
from base64 import decodestring

from bson.objectid import ObjectId
from PIL import Image
import io 


from pymongo import MongoClient


client = MongoClient()

client = MongoClient('localhost', 27017)

db = client.kaa

#collection = db.logs_99957758195164324594

entry = db.logs_99957758195164324594.find_one({"_id": ObjectId("58a61687870a765994850d5a")})

raw_image_data = entry.get("event").get("image_data")

print "raw_image_data length", len(raw_image_data)

print type(decodestring(raw_image_data[0]))
f = file("public/images/test_out.bmp", "wb")
for i in raw_image_data:
	f.write(decodestring(i))

