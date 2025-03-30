'''
Module: init.py
Creation Date: February 12th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This is the Initialization Script that will run before the web application
    is inistantiated. Anything that is required for the app to run before the
    app actually runs can be placed here

Inputs:
    None

Outputs:
    None
'''
# Import the Pathlib library
import pathlib

# From the dotenv library import load_dotenv
from dotenv import load_dotenv

# Try to get the path to the environment file. If it
# exists, then pull the environment variables defined
# in there
_ENV_FILE : pathlib.Path = pathlib.Path( "retrossette_env.env" )
if( _ENV_FILE.exists() ):
    load_dotenv( dotenv_path = _ENV_FILE.resolve() )

# Import the retrossette database init module and
# call the function to initialize the database
from modules.db import retrossette_db_init
#retrossette_db_init.delete_all_tables()
retrossette_db_init.init_db()