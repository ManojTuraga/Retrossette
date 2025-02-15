###############################################################################
# IMPORTS
###############################################################################
import pathlib
import psycopg2
import sys

from importlib.util import spec_from_file_location, module_from_spec

_RETROSSETTE_DB_INTF_PATH : pathlib.Path = pathlib.Path( sys.argv[ 0 ] ).parent / "retrossette_db_intf.py"

retrossette_db_intf_spec = spec_from_file_location( "retrossette_db_intf",
                                                    _RETROSSETTE_DB_INTF_PATH.resolve() )
retrossette_db_intf = module_from_spec( retrossette_db_intf_spec )
sys.modules[ "retrossette_db_intf" ] = retrossette_db_intf
retrossette_db_intf_spec.loader.exec_module( retrossette_db_intf )

###############################################################################
# PROCEDURES
###############################################################################
def init_db():
    if retrossette_db_intf.try_open_connection():
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "user"
                (
                user_id INT PRIMARY KEY,
                user_auth_code TEXT NOT NULL,
                api_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "song"
                (
                song_id INT PRIMARY KEY,
                song_type INT NOT NULL
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "playlist"
                (
                playlist_id INT PRIMARY KEY
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "genre"
                (
                playlist_id INT PRIMARY KEY
                );
            """
        )


def delete_tables():
    if retrossette_db_intf.try_open_connection():
        retrossette_db_intf.execute_query(
                """
                DROP TABLE IF EXISTS "user";
                """
            )

delete_tables()
init_db()