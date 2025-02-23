# Import the pathlib and sys libraries inorder to dynamically
# import the database interface. This is due to python's wacky
# way of handling import paths. This makes it so that there
# are no issues with imports at different directory levels
import pathlib
import sys

# From the importlib module, import the spec_from_file_location
# and module from spec files
from importlib.util import spec_from_file_location, module_from_spec

# Determine the location of the database interface file
_RETROSSETTE_DB_INTF_PATH : pathlib.Path = pathlib.Path( __file__ ).parent / "retrossette_db_intf.py"

# From the file path, determine the spec for the file
retrossette_db_intf_spec = spec_from_file_location( "retrossette_db_intf",
                                                    _RETROSSETTE_DB_INTF_PATH.resolve() )

# Convert the spec into a module
retrossette_db_intf = module_from_spec( retrossette_db_intf_spec )

# Add the module the system modules and execute the module
sys.modules[ "retrossette_db_intf" ] = retrossette_db_intf
retrossette_db_intf_spec.loader.exec_module( retrossette_db_intf )

def get_playlists( user_uri ):
    result = retrossette_db_intf.execute_query(
        """
        SELECT playlist_id, playlist_name from playlist; 
        """, 
        has_return=True
    )
    result = [ { "name" : n, "id" : i } for i, n in result ]
    return result

def get_songs_in_playlist( playlist_id ):
    result = retrossette_db_intf.execute_query(
        """
        SELECT song_id FROM houses WHERE playlist_id=%s ORDER BY track_number; 
        """, 
        vars=( playlist_id, ),
        has_return=True
    )
    result = [ id[ 0 ] for id in result ]
    return result

def user_in_db( user_uri ):
    result = retrossette_db_intf.execute_query(
                f"""
                SELECT EXISTS(
                    SELECT 1
                    FROM "user"
                    WHERE user_uri='{user_uri}'
                );
                """,
                has_return = True
            )

    return result[ 0 ][ 0 ]

def song_in_db( song_id ):
    result = retrossette_db_intf.execute_query(
                f"""
                SELECT EXISTS(
                    SELECT 1
                    FROM "song"
                    WHERE song_id='{song_id}'
                );
                """,
                has_return = True
            )

    return result[ 0 ][ 0 ]

def add_user( user_uri, user_display_name, user_email, user_profile_image=None ):
    if not user_in_db( user_uri ):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "user" (user_uri, user_display_name, user_email, user_profile_image)
            VALUES (%s, %s, %s, %s);
            """,
            vars=( user_uri, user_display_name, user_email, user_profile_image ),
            has_return=False
        )

def add_playlist( user_uri, playlist ):
    result = retrossette_db_intf.execute_query(
                """
                INSERT INTO playlist (playlist_name)
                VALUES (%s)
                RETURNING playlist_id;
                """,
                vars=( playlist[ "name" ], ),
                has_return=True,
                force_commit=True
    )
    retrossette_db_intf.execute_query(
        """
        INSERT INTO owns (user_uri, playlist_id)
        VALUES (%s, %s)
        """,
        vars=( user_uri, result[ 0 ][ 0 ] ),
        has_return=False
    )

    for index, song in enumerate( playlist[ "songs" ] ):
        if not song_in_db( song[ "uri" ] ):
            retrossette_db_intf.execute_query(
                """
                INSERT INTO song (song_id, song_name, duration_ms, song_type)
                VALUES (%s, %s, %s, %s)
                """,
                vars=( song[ "uri" ], song[ "name" ], song[ "duration_ms" ], 0 ),
                has_return=False
            )

        retrossette_db_intf.execute_query(
            """
            INSERT INTO houses (playlist_id, song_id, track_number)
            VALUES (%s, %s, %s)
            """,
            vars=( result[ 0 ][ 0 ], song[ "uri" ], index ),
            has_return=False
        )