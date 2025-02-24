'''
Title: Private Spotify API Requests
Author: Ceres Botkin
Description: Basic functions to request PRIVATE spotify data. Uses user API
token to access spotify API. Reccommended to access private information and 
used with Spotify player 
'''
# Package Requirements
import time
import requests
import json

from modules.api.user_auth import request_spotify_user_authentication
from modules.api.user_auth import request_spotify_user_api_token
from modules.api.user_auth import refresh_spotify_user_api_token
from modules.api.status_code import StatusCode

# Constant variable decls
spotify_url_header = 'https://api.spotify.com/v1/'

# Class which represents user. Holds information surrounding
# API token. Code parameter is what is returned from spotify
# after call to request_spotify_user_authentication
class UserSpotifyAPIWrapper() :
    def __init__(self, code):
        api_dict = request_spotify_user_api_token(code)

        self._api_token = api_dict['access_token'] # Use getter for this value
        self._token_expire_time = int(time.time()) + api_dict['expires_in'] - 60
        self._refresh_token = api_dict['refresh_token']

    # Get a new API token with refresh token
    def refresh_token(self):
        api_dict = refresh_spotify_user_api_token(self._refresh_token)

        self._api_token = api_dict['access_token']
        self._token_expire_time = int(time.time()) + api_dict['expires_in'] - 60

        if ('refresh_token' in api_dict):
            self._refresh_token = api_dict['refresh_token']

    # Check to see if current API token is valid and get new one if not
    # Returns newest API token
    def get_api_token(self):
        # Get current time
        curr_time = int(time.time())

        # Get request API token if invalid
        if (curr_time >= self._token_expire_time):
            # Refresh API Token
            self.refresh_token()

        return self._api_token

    # Get user profile. Return a dictionary of profile 
    def get_user_profile(self):
        req = requests.request('GET', spotify_url_header + 'me',
                               headers={ 'Authorization' : 'Bearer ' + self._api_token })

        # Check response code
        status_code = StatusCode(req.status_code)
        if (status_code.is_error()):
            status_code.print_error()
            return None
        else:
            return json.loads(req.text)
