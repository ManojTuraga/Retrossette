'''
Title: User Authorization
Author: Ceres Botkin
Description: Script to get API token for the user for API requets and also
to authenticate user. The server must first ask spotify to authenticate user.
This then returns a user code which can be exchanged with the Spotify server 
for a user api token. Although this code can be used to access both public
and private data, it's better for the server to access public data.
See server_auth.py for more details.

Scope should be updated if we need more permissions. In order to work
properly make sure your spotify account is approved properly in the 
dev dashboard. Contact me if you need any help

API token must be included in header in all future Spotify API requests
'''
# Package Requirements
import os
import dotenv
import requests
import json
import base64

from modules.api.status_code import StatusCode

# Constant Variable Decls
spotify_api_auth_url = 'https://accounts.spotify.com/authorize?'
spotify_api_token_url = 'https://accounts.spotify.com/api/token'
spotify_content_type = 'application/x-www-form-urlencoded'
spotify_auth_response_type = 'code'
redirect_uri = os.getenv( "SERVER_URL" ) + "/return_from_login"
scope = ' '.join(['user-read-email', 'user-read-private', 'streaming']) # Add more permissions if needed
show_dialog = 'false' # Determines if user needs to re-authenticate each time
                      # For production should be false. Only true for debugging
# TODO: Implement state for added security 

# Get Credentials
client_id = os.environ.get("SPOTIFY_CLIENT_ID")
client_secret = os.environ.get("SPOTIFY_CLIENT_SECRET")
server_auth_code = 'Basic ' + base64.b64encode((client_id + ':' + client_secret).encode('ascii')).decode('ascii')

# Prepare a request url to spotify to get user approval code
# NOTE: This code is NOT the api token for the user. Rather
# this code is exchanged for an api token
# Returns url for redirection of spotify request
def request_spotify_user_authentication():
    # Construct GET request for user authentication
    user_auth_req = requests.Request('GET', spotify_api_auth_url,
                                     params={ 'response_type' : spotify_auth_response_type,
                                              'client_id' : client_id,
                                              'scope' : scope,
                                              'redirect_uri' : redirect_uri,
                                              'show_dialog' : show_dialog }).prepare()

    '''
    # Check to make sure no error in request
    status_code = StatusCode(user_auth_req.status_code)
    if (status_code.is_error()):
        status_code.print_error()
        return None
    '''

    # Check to see if user accepted auth. request
    #print( user_auth_req.__dict__ )
    return user_auth_req.url


# Exchange a user code for an API token
# If error returns None and prints error
# If success return a dictionary of the form
# { access_token : API_TOKEN, token_type : Bearer, expires_in : 3600,
#   refresh_token : REFRESH_TOKEN, scope : SCOPE }
def request_spotify_user_api_token(code):
    # Construct POST request to get user api token
    user_api_req = requests.request('POST', spotify_api_token_url,
                                    headers={ 'authorization' : server_auth_code, 
                                              'content-type' : spotify_content_type },
                                    data={ 'grant_type' : 'authorization_code',
                                           'code' : code,
                                           'redirect_uri' : redirect_uri })

    # Check response code
    status_code = StatusCode(user_api_req.status_code)
    if (status_code.is_error()):
        status_code.print_error()
        return None
    else:
        return json.loads(user_api_req.text)

# Exchange a refresh token for API token
def refresh_spotify_user_api_token(refresh_token):
    # Construct POST request for user API token
    user_api_req = requests.request('POST', spotify_api_token_url,
                                    headers={ 'authorization' : server_auth_code, 
                                              'content-type' : spotify_content_type },
                                    data={ 'grant_type' : 'refresh_token',
                                           'refresh_token' : refresh_token })
    
    # Check response code
    status_code = StatusCode(user_api_req.status_code)
    if (status_code.is_error()):
        status_code.print_error()
        return None
    else:
        return json.loads(user_api_req.text)
