import psycopg2
import pathlib
import os
from dotenv import load_dotenv

env_file = pathlib.Path( "retrossette_env.env" )

if( env_file.exists() ):
    load_dotenv( dotenv_path=env_file.resolve() )

dbname = os.getenv( "PGDATABASE" )
user = os.getenv( "PGUSER" )
password = os.getenv( "PGPASSWORD" )
host = os.getenv( "PGHOST" )
port = os.getenv( "PGPORT" )

print( dbname )

try:
    cnx = psycopg2.connect(user=user, password=password, host=host, database=dbname)
    print( "connection successful" )
except Exception as e:
    print( f"Failed: {e}" )

if cnx:
    cnx.close()