'''
Module: retrossette_db_intf.py
Creation Date: February 11th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module provides a set of operations to interface with the the database.

Inputs:
    SQL Queries that that perform CRUD operations

Outputs:
    Query results (if it applies)

Preconditions:
    Environment variables must exist for the following values
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
    Queries will change database state

Invariants:
    There is only one database

Known Faults
    None
    
Sources: Postgresql Documentation, EECS 581 Team 42 Final Project
'''

###############################################################################
# IMPORTS
###############################################################################
import psycopg2
import os

###############################################################################
# VARIABLES
###############################################################################
# The following will store the parsed values from the environment
# variables
_DB_NAME : str = None
_DB_USER : str = None
_DB_PASSWORD : str = None
_DB_HOST : str = None
_DB_PORT : int = None

# This will maintain the connection to the database
_DB_CONNECTION = None

###############################################################################
# PROCEDURES
###############################################################################
def _intf_init() -> None:
    """
    Function: (Private) Initalize Interface

    Description: This function will fetch the required environment variables
                 and store them locally in the module's global variables
    """
    global _DB_NAME
    global _DB_USER
    global _DB_PASSWORD
    global _DB_HOST
    global _DB_PORT
    
    # Fetch the required environment variables to create a connection
    # to the database
    _DB_NAME = os.getenv( "PGDATABASE" )
    _DB_USER = os.getenv( "PGUSER" )
    _DB_PASSWORD = os.getenv( "PGPASSWORD" )
    _DB_HOST = os.getenv( "PGHOST" )
    _DB_PORT = int( os.getenv( "PGPORT" ) )

def try_open_connection() -> bool:
    """
    Function: Try To Open Connection To Database

    Description: This function attempts to connect to the database on the
                 enviroment variables provided. Will return true or false
                 based on the attempt
    """
    global _DB_NAME
    global _DB_USER
    global _DB_PASSWORD
    global _DB_HOST
    global _DB_PORT
    global _DB_CONNECTION

    # If any of the enviroment variables that are required
    # have not been fetched, initialize the variables first
    if( not all( [ _DB_NAME,_DB_USER, _DB_PASSWORD, _DB_HOST, _DB_PORT ] ) ):
        _intf_init()

    try:
        # If the connection has not been initialized yet,
        # attempt to connect to the database
        if not _DB_CONNECTION:
            _DB_CONNECTION = psycopg2.connect( user=_DB_USER, 
                                            password=_DB_PASSWORD, 
                                            host=_DB_HOST, 
                                            database=_DB_NAME, 
                                            port=_DB_PORT )
    except Exception as e:
        # If there is an error, print it out to standard console
        print( e )

    # Return whether the connection was successful or not
    return _DB_CONNECTION != None

def execute_query( query_string : str, vars = None, has_return = True ):
    """
    Function: Execute Query

    Description: This function will execute a query on the database based
                 on the string given
    """
    return_val = []
    if try_open_connection():
        # Create a cursor to the database 
        cursor = _DB_CONNECTION.cursor()

        # Execute the query on the database
        cursor.execute( query_string,
                    vars=vars )


        if not has_return:
            # Commit changes to the database if there are edits
            _DB_CONNECTION.commit()

        else:
            # Fetch all the relevant tuples from the query
            return_val = cursor.fetchall()

        cursor.close()
        close_connection()

    return return_val

def close_connection() -> None:
    """
    Function: Close Connection

    Description: This Function is a public facing wrapper to close the
                 database connection
    """
    global _DB_CONNECTION

    if _DB_CONNECTION:
        _DB_CONNECTION.close()
        _DB_CONNECTION = None
