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
    
Sources: Flask Documentation, React Documentation
'''
###############################################################################
# IMPORTS
###############################################################################

# Run the init module before starting the application.
# This will populate all environment variables
import init

# Import the pathlib library to elegantly handle filepaths
import pathlib

# From the flask module import the Flask app, the send
# from directory function, and the redirect function.
from flask import Flask, send_from_directory, redirect

# From the retrossette modules, import the user
# authentication, the server authentication, and
# the database interface
from modules.api import user_auth
from modules.api import server_auth
from modules.db import retrossette_db_intf

###############################################################################
# VARIABLES
###############################################################################

# Initialize the Flask app and have it point to the retrossette build
# directory 
app = Flask( __name__, 
             root_path = str( pathlib.Path( "retrossette-app/build" ).resolve() ) )

###############################################################################
# API ROUTES
###############################################################################

# This is the api endpoint to trigger the user
# login on the spotify page
@app.route( '/api/login', methods=[ "GET" ] )
def api_login():
    """
    Function: API Login

    Description: This function is the api endpoint to trigger a login into
                 the system. This process eventually allow the system to 
                 have a valid API token to access spotify
    """
    return redirect( user_auth.request_spotify_user_authentication() )

# This is a temporary endpoint to prove a valid redirect
# after returning from spotify
@app.route( '/api/return_from_login', methods=[ "GET" ] )
def api_return_from_login():
    return redirect( "/about" )

###############################################################################
# CLIENT ROUTES
###############################################################################
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index( path ):
    """
    Fucntion: Index

    Description: This function handles client side routing from the react app.
                 Flask is a server side rendering application while react is
                 a client side rendering application. To respect the routes
                 in react, we will only return a file if it exists. Otherwise
                 we defer to the routing specified in the react app
    """
    # If the path is not the empty string and there is a real
    # file for said path, return the file
    if path != "" and pathlib.Path( path ).exists():
        return send_from_directory( app.root_path, path )
    
    # If the path does not physically exist, let react handle
    # that path by returning the base file
    return send_from_directory( app.root_path, "index.html" )

if __name__ == "__main__":
    app.run()