'''
Title: Public Spotify API Requests
Author: Ceres Botkin
Description: Basic functions to request PUBLIC spotify data. Uses client API as
opposed to user API. Reccomended to access public information 
'''
# Package Requirements
import time
import requests
import json

from server_auth import request_spotify_client_api_token
from status_code import StatusCode

# Constant Variable Decl
spotify_url_header = 'https://api.spotify.com/v1/'

# Variables to store API token details
client_api_token = None
client_token_expire_time = 0

# Checks to see if there is a valid client auth token. If not, request one
def get_client_api_token():
    global client_api_token, client_token_expire_time
    # Get current time
    curr_time = int(time.time())
    
    # Get request api token if none exists or if expired
    if ((client_token_expire_time == None) or
        (curr_time >= client_token_expire_time)):
        # Request client api token
        api_dict = request_spotify_client_api_token()

        # Update global variables
        client_api_token = api_dict['access_token']
        client_token_expire_time = curr_time + api_dict['expires_in'] - 60

    # Return API token
    return client_api_token


# Get artist data. Returns artist dictionary
def get_artist(uri):
    req = requests.request('GET', spotify_url_header + 'artists/' + uri,
                           headers={ 'Authorization' : 'Bearer ' + get_client_api_token() })

    # Check response code
    status_code = StatusCode(req.status_code)
    if (status_code.is_error()):
        status_code.print_error()
        return None
    else:
        return json.loads(req.text)

    
# Get track data. Returns track dictionary
def get_track(uri):
    req = requests.request('GET', spotify_url_header + 'tracks/' + uri,
                           headers={ 'Authorization' : 'Bearer ' + get_client_api_token() })

    # Check response code
    status_code = StatusCode(req.status_code)
    if (status_code.is_error()):
        status_code.print_error()
        return None
    else:
        return json.loads(req.text)
