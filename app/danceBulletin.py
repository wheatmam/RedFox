# all the imports
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from contextlib import closing
import pymongo
import json
import httplib
from httplib import HTTPSConnection
from base64 import b64encode

app= Flask(__name__, static_url_path='/static')
client = pymongo.MongoClient()

db = client.twinkle
coll = client.twinkle.bulletin

@app.route("/")
def home():
	bulletins = db.bulletins.find()
	print bulletins
	return render_template('test.html')
	
@app.route("/search")
def search():
	return render_template('search.html')
	
def getBadges(username):
	url = "/api/v1/organizations/89bc5cca-9447-481c-9b94-aa353df73dfe/badges"
	c = HTTPSConnection("sandbox.youracclaim.com")
	userAndPass = b64encode(b"pU_yJrMRHHpQlWC9q6Sj:").decode("ascii")
	headers = { 'Authorization' : 'Basic ' + userAndPass }
	c.request("GET", url, '', headers)
	res = c.getresponse()
	data = res.read()
	return data
	
def issueBadges(username):
	url = "/api/v1/organizations/89bc5cca-9447-481c-9b94-aa353df73dfe/badges"
	c = HTTPSConnection("sandbox.youracclaim.com")
	userAndPass = b64encode(b"pU_yJrMRHHpQlWC9q6Sj:").decode("ascii")
	headers = { 'Authorization' : 'Basic ' + userAndPass, "Content-Type" : "application/json"}
	body = {
  		"recipient_email": username,
  		"badge_template_id": "a2c8eb30-8bc3-4e51-a2ac-2081e85d0f0d",
  		"issued_at": "2014-04-01 09:41:00 -0500",
  		"issued_to_first_name": "Earner First Name",
  		"issued_to_last_name": "Earner Last Name",
	}
	c.request("POST", url, json.dumps(body), headers)
	res = c.getresponse()
	data = res.read()
	return data
	
	
@app.route('/<username>/')
def show_user_profile(username):
    #show the user profile for that user
    #print list(coll.find({"boardname"}))
    issueBadges("michael.wheatman+uhack@gmail.com")
    print getBadges("placeholder")
    return render_template('userPage.html')
	
@app.route('/hello/')
def hello():
    return 'Users: %' % users
    
@app.route('/uploadNewBoard', methods=['POST'])
def uploadBulletin():
    info = json.loads(request.stream.read())
    coll.save(info)
    return json.dumps(info['boardname'])
    
import os
@app.route('/static/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(os.path.join('static', path))       
        
if __name__ == "__main__":
	app.debug = True
	app.run()