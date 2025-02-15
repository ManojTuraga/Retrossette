###############################################################################
# IMPORTS
###############################################################################
import pathlib
import psycopg2
import sys

from importlib.util import spec_from_file_location, module_from_spec

_RETROSSETTE_DB_INTF_PATH : pathlib.Path = pathlib.Path( __file__ ).parent / "retrossette_db_intf.py"

retrossette_db_intf_spec = spec_from_file_location( "retrossette_db_intf",
                                                    _RETROSSETTE_DB_INTF_PATH.resolve() )
retrossette_db_intf = module_from_spec( retrossette_db_intf_spec )
sys.modules[ "retrossette_db_intf" ] = retrossette_db_intf
retrossette_db_intf_spec.loader.exec_module( retrossette_db_intf )

###############################################################################
# PROCEDURES
#########################################################################64######
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
                genre_id INT PRIMARY KEY,
                genre_type TEXT NOT NULL
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "owns"
                (
                user_id INT NOT NULL,
                playlist_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
                FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "listens_to"
                (
                user_id INT NOT NULL,
                playlist_id INT NOT NULL,
                num_of_listens INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
                FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "houses"
                (
                playlist_id INT NOT NULL,
                song_id INT NOT NULL,
                track_number INT NOT NULL,
                FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE,
                FOREIGN KEY (song_id) REFERENCES song(song_id) ON DELETE CASCADE
                );
            """
        )

        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "groups"
                (
                playlist_id INT NOT NULL,
                genre_id INT NOT NULL,
                FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE,
                FOREIGN KEY (genre_id) REFERENCES genre(genre_id) ON DELETE CASCADE
                );
            """
        )

def delete_all_tables():
    if retrossette_db_intf.try_open_connection():
        for table in [ "owns", "listens_to", "houses", "groups", "user", "song", "playlist", "genre" ]:
            retrossette_db_intf.execute_query(
                    f"""
                    DROP TABLE IF EXISTS "{table}" CASCADE;
                    """
                )

delete_all_tables()
init_db()