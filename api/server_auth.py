'''
Title: Server Authorization
Author: Ceres Botkin
Description: Script to get API token for the server to interface with Spotify API.
The script asks for an API token using the server_spotify_credentials.env file
which contains the client ID and client secret and returns the result.

API token must be included in header in all future Spotify API requests
'''
# Package Requirements
import os
import dotenv
import requests
import json

from status_code import StatusCode

# Constant Variable Decls
spotify_api_token_url = 'https://accounts.spotify.com/api/token'
spotify_content_type = 'application/x-www-form-urlencoded'

# Get Credentials
dotenv.load_dotenv()
client_id = os.environ.get("SPOTIFY_CLIENT_ID")
client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")

# Send a request to spotify to get spotify client api token
# If error returns None and prints error
# If success returns a dictionary of the form
# { access_token : API_TOKEN, token_type : 'Bearer', expires_in : 3600 }
def request_spotify_client_api_token():
    # Construct POST request for retrieving API token
    client_auth_req = requests.request('POST', spotify_api_token_url,
                                       headers={ 'Content-Type' : spotify_content_type },
                                       data= { 'grant_type' : 'client_credentials',
                                               'client_id' : client_id,
                                               'client_secret' : client_secret })

    # Check response code
    status_code = StatusCode(client_auth_req.status_code)
    if (not status_code.is_error()):
        return json.loads(client_auth_req.text)
    else:
        status_code.print_error()
        return None
