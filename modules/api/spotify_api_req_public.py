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

from modules.api.server_auth import request_spotify_client_api_token
from modules.api.status_code import StatusCode

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


# Query tracks. Query can be searched by name, artist, album, International Standard
# Recording Code (ISRC), genre, and year. Returns a maximum of limit tracks
# Returns a dictionary with results of search query. The value of the 'items'
# key returns a list of limit or less number of track dictionaries
def query_tracks(track_name=None, *, artist=None, album=None, isrc=None, genre=None,
                 year=None, limit=20):
    # Check to make sure query is not empty
    if ((track_name == None) and (artist == None) and (album == None) and
        (isrc == None) and (genre == None) and (year == None)):
        print("ERROR: Empty Query")
        return None

    # Make Query request string
    q = ''

    if (track_name != None):
        q += 'track:' + track_name
    if (artist != None):
        q += 'artist:' + artist
    if (album != None):
        q += 'album:' + album
    if (isrc != None):
        q += 'isrc:' + isrc
    if (genre != None):
        q += 'genre:' + genre
    if (year != None):
        q += 'year:' + year

    # TODO: Add market
    req = requests.request('GET', spotify_url_header + 'search',
                           headers={ 'Authorization' : 'Bearer ' + get_client_api_token() }, 
                           params={ 'q' : q,
                                    'type' : 'track',
                                    'limit' : str(limit) })
                                    #'include_extermal' : 'audio'

    # Check response code
    status_code = StatusCode(req.status_code)
    if (status_code.is_error()):
        status_code.print_error()
        return None
    else:
        return json.loads(req.text)['tracks']
