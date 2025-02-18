###############################################################################
# IMPORTS
###############################################################################
import psycopg2
import pathlib
import os

###############################################################################
# VARIABLES
###############################################################################
_DB_NAME : str = None
_DB_USER : str = None
_DB_PASSWORD : str = None
_DB_HOST : str = None
_DB_PORT : int = None
_DB_CONNECTION = None

###############################################################################
# PROCEDURES
###############################################################################
def _intf_init() -> None:
    global _DB_NAME
    global _DB_USER
    global _DB_PASSWORD
    global _DB_HOST
    global _DB_PORT

    _DB_NAME = os.getenv( "PGDATABASE" )
    _DB_USER = os.getenv( "PGUSER" )
    _DB_PASSWORD = os.getenv( "PGPASSWORD" )
    _DB_HOST = os.getenv( "PGHOST" )
    _DB_PORT = int( os.getenv( "PGPORT" ) )

def try_open_connection() -> bool:
    global _DB_NAME
    global _DB_USER
    global _DB_PASSWORD
    global _DB_HOST
    global _DB_PORT
    global _DB_CONNECTION

    if( not all( [ _DB_NAME,_DB_USER, _DB_PASSWORD, _DB_HOST, _DB_PORT ] ) ):
        _intf_init()

    try:
        if not _DB_CONNECTION:
            _DB_CONNECTION = psycopg2.connect( user=_DB_USER, 
                                            password=_DB_PASSWORD, 
                                            host=_DB_HOST, 
                                            database=_DB_NAME, 
                                            port=_DB_PORT )
    except Exception as e:
        print( e )

    return _DB_CONNECTION != None

def execute_query( query_string : str ):
    global _DB_CONNECTION
    cursor = _DB_CONNECTION.cursor()
    cursor.execute( query_string )
    _DB_CONNECTION.commit()
    cursor.close()

def close_connection() -> None:
    _DB_CONNECTION.close()
