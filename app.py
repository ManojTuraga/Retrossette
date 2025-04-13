'''
Module: app.py
Creation Date: February 12th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Connor Forristal, Harry Ahrenholtz, Ceres Botkin
              Andy Trinh

Description:
    This is the main module for the retrossette application. This module will
    handle both API requests from the react application as well as interaface
    with the retrossette database to fetch/update globals state data.
    
    This application also connects to a built react client located at
    retrossette-app/build. This application can be build locally by navigating
    to the directory and running 

Inputs:
    Unknown

Outputs:
    Unknown

Preconditions:
    Environment variables must exist for the following values
        SPOTIFY_CLIENT_ID
        SPOTIFY_CLIENT_SECRET
        PGHOST
        PGUSER
        PGPORT
        PGDATABASE
        PGPASSWORD
    
Postconditions:
    Unknown

Error Conditions:
    None

Side Effects:
    Interactions on the server may lead to changes in database state

Invariants:
    There will only be on instance of the server running at all times

Known Faults
    None
    
Sources: Flask Documentation, React Documentation, Socketio Documentation
'''
###############################################################################
# IMPORTS
###############################################################################

# Run the init module before starting the application.
# This will populate all environment variables
import init

# Import the pathlib library to elegantly handle filepaths
import pathlib
import os

# From the flask module import the Flask app, the send
# from directory function, and the redirect function.
from flask import Flask, send_from_directory, redirect, request, session
from flask_session import Session

# From the flask Socket IO appliction import the SocketIO
# App
from flask_socketio import SocketIO
from flask_cors import CORS

# From the retrossette modules, import the user
# authentication, the server authentication, and
# the database interface
from modules.api import user_auth
from modules.api.spotify_api_req_private import UserSpotifyAPIWrapper
from modules.api.spotify_api_req_public import query_tracks
from modules.db import retrossette_db_queries

# From the datetime import the time delta function. This code
# will be used for figuring out when to delete the cache
from datetime import timedelta

###############################################################################
# VARIABLES
###############################################################################

# Initialize the Flask app and have it point to the retrossette build
# directory
app = Flask( __name__, 
             root_path=str( pathlib.Path( "retrossette-app/build" ).resolve() ) )

# Get the secret key from the environment variables
app.secret_key = os.getenv( "SECRET_KEY" )

# Change the default Cache setting to filesytem and ensure
# that the cache is reset every 25 hours
app.config[ "SESSION_TYPE" ] = "filesystem"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta( hours=24 )
Session( app )

# Hook the application up with Socketio so thaw we get both flask api
# calls and socketio api calls.
socketio = SocketIO( app, 
                     manage_session=False )

###############################################################################
# API ENDPOINTS
###############################################################################
# Get API token
@socketio.on( "/api/get_api_token" )
def api_get_get_api_token( data ):
    """
    Function: Get API Token

    Description: This function is an API endpoint to get a user's API Code
                 from their specific User API Wrapper Object
    """
    print( session[ "UserAPIWrapper" ].get_api_token() )
    return { "message" : session[ "UserAPIWrapper" ].get_api_token() }

# Search for song
@socketio.on( "/api/search_for_song" )
def api_search_for_song( data ):
    """
    Function: Search for Song

    Description: This function is the api wrapper to search for a song on
                 spotify.
    """
    return dict( query_tracks( data[ "message" ] ) ) 

# Get user profile information
@socketio.on( "/api/get_profile_information" )
def api_get_profile_information( data ):
        return { "message" : retrossette_db_queries.get_user_profile_information( session[ "UserURI" ] ) }

# Get playlists for user
@socketio.on( "/api/get_playlists" )
def api_get_playlists( data ):
    """
    Function: Get Stored Playlists

    Description: This functions is a database call wrapper that fetches all the
                 playlists that are currently in the database
    """
    return { "message" : retrossette_db_queries.get_playlists( session[ "UserURI" ] ) }

# Handle playlist submission
@socketio.on( "/api/submit_playlist" )
def api_submit_playlist( data ):
    """
    Function: Submit Playlist selection

    Description: This functions is a database call wrapper that parsers the api
                 request and stores the playlist in the database
    """
    print( data[ "message" ] )
    retrossette_db_queries.add_playlist( session[ "UserURI" ], data[ "message" ] )
    return { "status" : "success", "post_submit_url" : "/ViewPlaylists" }

# Get every song that is in a playlist
@socketio.on( "/api/get_songs_from_playlist" )
def api_get_songs_from_playlist( data ):
    songs = retrossette_db_queries.get_songs_in_playlist( session[ "UserURI" ], data[ "message" ] )

    if len( songs ) == 0:
        return { "status" : "error" } 

    return { "status" : "success", 
             "message" : { "songs" : songs } | ( retrossette_db_queries.get_rating( session[ "UserURI" ], data[ "message" ] ) ) }

# Update the rating for a playlist
@socketio.on( "/api/update_rating_for_playlist" )
def api_update_rating_for_playlist( data ):
    retrossette_db_queries.update_rating( session[ "UserURI" ], data[ "message" ][ "playlist_id" ], data[ "message" ][ "stars" ], data[ "message" ][ "comment" ] )

# Get all the themes that are possible
@socketio.on( "/api/get_themes" )
def api_get_themes( data ):
    return { "status" : "success", "message" : retrossette_db_queries.get_themes() }

# Get all the genres that are supported
@socketio.on( "/api/get_all_genres" )
def api_get_all_genres( data ):
    return { "status" : "success", "message" : retrossette_db_queries.get_genres() }

# Update the theme that the user selected
@socketio.on( "/api/update_theme" )
def api_update_theme( data ):
    retrossette_db_queries.update_theme( session[ "UserURI" ], data[ "message" ] )

# Temporary endpoint to allow the user to fetch a recommended
# playlist based on their listening patterns
@socketio.on( "/api/get_recommendation" )
def api_get_recommendation( data ):
    retrossette_db_queries.get_playlist_recommendation( session[ "UserURI" ] )

# This is an API endpoint to just get any playlist based on the associated
# genre
@socketio.on( "/api/get_cassette_by_genre" )
def api_get_cassette_by_genre( data ):
    return { "status" : "success", "message" : retrossette_db_queries.get_cassettes_in_genre( data[ "id" ] ) }
        
###############################################################################
# CLIENT ROUTES
###############################################################################
@app.route( '/api/login', methods=[ "GET" ] )
def api_login():
    """
    Function: API Login

    Description: This function is the api endpoint to trigger a login into
                 the system. This process eventually allow the system to 
                 have a valid API token to access spotify. Note that this is
                 not a real API endpoint because it is more reasonable to have
                 Flask handle the redirection
    """
    return redirect( user_auth.request_spotify_user_authentication() )

@app.route( '/api/return_from_login', methods=[ "GET" ] )
def api_return_from_login():
    """
    Function: API Return from Login

    Description: This is the page is that the app is redirected to after a successful
                 login. The reason that this is not an API endpoint is because the page
                 needs to be an actual page. Hence, this is a "fake" endpoint
    """
    # Check to see if error
    if ('error' in request.args.keys()):
        app.logger.error(f'Error: {request.args["error"]}')
    else:
        # If there is no error, store the user in the database and store
        # all user related information in cache
        code = request.args['code']
        session[ "UserAPIWrapper" ] = UserSpotifyAPIWrapper( code )
        user_profile = session[ "UserAPIWrapper" ].get_user_profile()
        session[ "UserURI" ] = user_profile[ "uri" ]
        
        # If the user as a profile image, then get the URL that references
        # it, otherwise set the image to None
        if len( user_profile[ "images" ] ) > 0:
            image = user_profile[ "images" ][ 0 ][ "url" ]

        else:
            image = None 

        retrossette_db_queries.add_user( user_uri=user_profile[ "uri" ], 
                                         user_display_name=user_profile[ "display_name" ],
                                         user_email=user_profile[ "email" ],
                                         user_profile_image=image )
        
        retrossette_db_queries.update_theme( user_profile[ "uri" ], 2 )

    if "ReturnPath" in session.keys():
        # Redirect back to the inital page if there is something in
        # cache
        return redirect( session.pop( "ReturnPath" ) )
    
    else:
        # Redirect back to home
        return redirect( "/" )

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index( path ):
    """
    Function: Index

    Description: This function handles client side routing from the react app.
                 Flask is a server side rendering application while react is
                 a client side rendering application. To respect the routes
                 in react, we will only return a file if it exists. Otherwise
                 we defer to the routing specified in the react app
    """
    if "UserURI" not in session.keys() or not retrossette_db_queries.user_in_db( session[ "UserURI" ] ):
        session[ "ReturnPath" ] = path
        return redirect( user_auth.request_spotify_user_authentication() )

    # If the path is not the empty string and there is a real
    # file for said path, return the file
    if path != "" and pathlib.Path( path ).exists():
        return send_from_directory( app.root_path, 
                                    path )

    # If the path does not physically exist, let react handle
    # that path by returning the base file
    return send_from_directory( app.root_path, 
                                "index.html" )

if __name__ == "__main__":
    socketio.run( app, 
                  debug=True, 
                  host='0.0.0.0' )
