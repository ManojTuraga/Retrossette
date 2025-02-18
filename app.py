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

import init
import pathlib
from flask import Flask, send_from_directory, redirect

from modules.api import user_auth
from modules.api import server_auth

from modules.db import retrossette_db_init

app = Flask( __name__, root_path=str( pathlib.Path( "retrossette-app/build" ).resolve() ) )

@app.route( '/api/login', methods=[ "GET" ] )
def api_login():
    return redirect( user_auth.request_spotify_user_authentication() )

@app.route( '/api/return_from_login', methods=[ "GET" ] )
def api_return_from_login():
    return redirect( "/about" )

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index( path ):
    if path != "" and pathlib.Path( path ).exists():
        return send_from_directory( app.root_path, path )
    
    return send_from_directory( app.root_path, "index.html" )

if __name__ == "__main__":
    app.run()