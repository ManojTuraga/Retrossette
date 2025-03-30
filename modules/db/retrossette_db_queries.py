'''
Module: retrossette_db_queries.py
Creation Date: February 24th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module provides a set of operations to interface with
    the database under the context of the retrossette application

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

###############################################################################
# PROCEDURES
###############################################################################
def get_user_profile_information( user_uri ):
    """
    Function: Get User Profile Information

    Description: This function will get the profile name and the profile image for a
                 user that is stored in the database
    """
    result = retrossette_db_intf.execute_query(
        f"""
        SELECT user_display_name, user_profile_image from "user" where user_uri='{ user_uri }'; 
        """, 
        has_return=True
    )
    try:
        return { "profile_name" : result[ 0 ][ 0 ], "profile_image" : result[ 0 ][ 1 ] }
    
    except:
        return { "profile_name" : "", "profile_image" : None }


def get_genres():
    """
    Function: Get Genres from Database

    Description: This function queries the database for all the genres that
                 are configured in the database. All of the genres are sourced
                 from the genres.json file
    """
    # Get all the information regarding genres from the genre table
    result = retrossette_db_intf.execute_query(
        """
        SELECT * from genre; 
        """, 
        has_return=True
    )

    # Convert the result from a list of tuples into a list of
    # of dictionaries. This is because we will be return
    # the result of this function
    result = [ { "name" : n, "id" : i, "description" : des } for i, n, des in result ]
    
    return result

def get_rating( user_uri, playlist_id ):
    result = retrossette_db_intf.execute_query(
        """
        SELECT rates_stars, rates_comment from rates where user_uri=%s AND playlist_id=%s; 
        """, 
        vars=( user_uri, playlist_id ),
        has_return=True
    )

    if len( result ) > 0:
        return { "stars" : result[ 0 ][ 0 ], "comment" : result[ 0 ][ 1 ] }
    
    return {}


def get_themes():
    """
    Function: Get Themes from Database

    Description: This function queries the database for all the themes that
                 are configured in the database. All of the themes are sourced
                 from the themes.json file
    """
    # Get all the information regarding themes from the theme table
    result = retrossette_db_intf.execute_query(
        """
        SELECT * from theme; 
        """, 
        has_return=True
    )

    # Convert the result from a list of tuples into a list of
    # of dictionaries. This is because we will be return
    # the result of this function
    result = [ { "name" : n, "id" : i, "primary_color_1" : pc1, "primary_color_2" : pc2, 
                "secondary_color_1" : sc1, "secondary_color_2" : sc2, "primary_font" : pf, "secondary_font" : sf  } 
                for i, n, pc1, pc2, sc1, sc2, pf, sf in result ]
    
    return result

def get_playlists( user_uri ):
    """
    Function: Get Playlists from Database

    Description: This function quries the database for all the playlists
                 that are currently created. We have the ability to pass
                 in user uri into the function that would eventually see
                 what playlist was created per user but that is not being
                 used at the moment
    """
    # From the playlist table in the database, select the
    # playlist ID and the name of the playlist
    result = retrossette_db_intf.execute_query(
        """
        SELECT playlist_id, playlist_name from playlist; 
        """, 
        has_return=True
    )
    # The return of the query is a tuple where the first index
    # is the playlist ID and the second index is the name of the
    # playlist. To make this JSONable, convert it into a dictionary
    result = [ { "name" : n, "id" : i } for i, n in result ]
    return result

def get_songs_in_playlist( playlist_id ):
    """
    Function: Get Songs in Playlist

    Description: Given a playlist ID, this function queries the database for
                 all the songs that are in the playlist. We store the track_number
                 and query sorted by that because we want to play the songs in the
                 order that they are stored
    """
    # From the houses relationship table, select every song id that corresponds
    # to a given playlist id and order it by the track number
    result = retrossette_db_intf.execute_query(
        """
        SELECT song_id FROM houses WHERE playlist_id=%s ORDER BY track_number; 
        """, 
        vars=( playlist_id, ),
        has_return=True
    )
    # The result of this query is a tuple with the first element as the
    # song id. Convert this into a list so it is JSONable
    result = [ id[ 0 ] for id in result ]
    return result

def user_in_db( user_uri ):
    """
    Function: Check if User is in Database

    Description: This function checks if a user is in the database. The
                 reason why we store the user in the database is that we
                 need to preserve the integrity of the relational model.
                 We also believe it's more efficent to query spotify as
                 little as possible
    """
    # This query will return 1 if it finds a matching user
    # in the database
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

    # The result of this query is a list with a single query with
    # the first element as the boolean value we need
    return result[ 0 ][ 0 ]

def song_in_db( song_id ):
    """
    Function: Check if Song is in Database

    Description: This function checks if a song is in the database. We
                 want to store the song in the database to preserve the
                 integrity of the relational model. This function will
                 only be used when adding a new song. We don't want to
                 add a song if it already exists.
    """
    # Following the logic from the user in table check,
    # return 1 if a song_id can be found in the song table.
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

    # Parse only the value that the we need from the return
    return result[ 0 ][ 0 ]

def update_rating( user_uri, playlist_id, stars, comment ):
    """
    Function: Update Playlist Rating

    Description: This function updates the rating and comment for a playlist given its assocation
                 to a user
    """
    # Determine if the user had already made a comment to this playlist
    result = retrossette_db_intf.execute_query(
                f"""
                SELECT 1 FROM rates WHERE user_uri='{ user_uri }' AND playlist_id=%s;
                """,
                vars=( playlist_id, ),
                has_return=True
            )

    # If there is already an entry, simply edit the entry to reflect the new rating and
    # comment
    if len( result ) > 0:
        retrossette_db_intf.execute_query(
                f"""
                UPDATE rates SET rates_stars=%s, rates_comment=%s WHERE user_uri='{ user_uri }' AND playlist_id=%s;
                """,
                vars=( stars, comment, playlist_id ),
                has_return=False
            )
        
    else:
        # If there is no entry associated for this user, add a row in the table
        retrossette_db_intf.execute_query(
                """
                INSERT INTO rates (user_uri, playlist_id, rates_stars, rates_comment) VALUES (%s, %s, %s, %s);
                """,
                vars=( user_uri, playlist_id, stars, comment ),
                has_return=False
            )

def update_theme( user_uri, theme_id ):
    """
    Function: Update User Theme

    Description: This function updates the theme for a particular user
    """
    # Since users that are logged in are the only ones that really can
    # interact with the application, no need to check for users
    # already existing or not
    retrossette_db_intf.execute_query(
            f"""
            UPDATE customizes SET theme_id=%s WHERE user_uri='{ user_uri }';
            """,
            vars=( theme_id, ),
            has_return=False
        )

def add_user( user_uri, user_display_name, user_email, user_profile_image=None ):
    """
    Function: Add User to the database

    Description: This function inserts a new user into the database. The function
                 stores the user's spotify URI, display name, email and profile image.
                 The reason why we store this information is to preserve the integrity
                 of the relational model.
    """
    # If the user is not in the database, add the new user into it along with
    # any meta information that will be displayed on the website
    if not user_in_db( user_uri ):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "user" (user_uri, user_display_name, user_email, user_profile_image)
            VALUES (%s, %s, %s, %s);
            """,
            vars=( user_uri, user_display_name, user_email, user_profile_image ),
            has_return=False
        )

        # Along with adding the user, keep track of the theme that they
        # selected. By default, we will pick the first theme
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "customizes" (user_uri, theme_id)
            VALUES (%s, %s);
            """,
            vars=( user_uri, 1 ),
            has_return=False
        )

def add_playlist( user_uri, playlist ):
    """
    Function: Add Playlist to the database

    Description: This function stores a newly created playlist into the database.
                 We don't need to specify a key because we are using the automatic
                 increment provided by postgresql. For every song that is in the
                 playlist, this functions also stores the songs that are in the
                 playlist if it does not already exist in the database
    """
    # Add the playlist name into the database. This table just maps
    # the id to the name of the playlist
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

    # In the owns table, map the user_uri to the playlist_id.
    # This table will show all the playlists that were created
    # by a specified user
    retrossette_db_intf.execute_query(
        """
        INSERT INTO owns (user_uri, playlist_id)
        VALUES (%s, %s)
        """,
        vars=( user_uri, result[ 0 ][ 0 ] ),
        has_return=False
    )

    # For every song that is in the playlist, if the song
    # has not already been stored, store the name, duration,
    # and song type. The song type will eventually be used
    # to distinguish songs hosted on spotfiy and songs that
    # were uploaded by a user.
    for index, song in enumerate( playlist[ "songs" ] ):
        if not song_in_db( song[ "uri" ] ):
            # Add the song into the song table to preserve the integrity of the
            # relational model
            retrossette_db_intf.execute_query(
                """
                INSERT INTO song (song_id, song_name, duration_ms, song_type)
                VALUES (%s, %s, %s, %s)
                """,
                vars=( song[ "uri" ], song[ "name" ], song[ "duration_ms" ], 0 ),
                has_return=False
            )

        # Map the song to the playlist to show what songs are in a specified
        # playlist
        retrossette_db_intf.execute_query(
            """
            INSERT INTO houses (playlist_id, song_id, track_number)
            VALUES (%s, %s, %s)
            """,
            vars=( result[ 0 ][ 0 ], song[ "uri" ], index ),
            has_return=False
        )

    # Every playlist is required to be associated with at least
    # one genre. The sum of all genres should be equal to 100,
    # indicating the association that each playlist has with
    # a genre
    for genre, association in playlist[ "genres" ]:
        # The response actually associates a playlist
        # with its genre name instead of ID, so first
        # fetch the ID
        genre_id = retrossette_db_intf.execute_query(
            """
            SELECT genre_id from genre where genre_name=%s;
            """,
            vars=( genre, ),
            has_return=True
        )[ 0 ][ 0 ]

        # Associate the playlist with the genre id using the
        # association from the response
        retrossette_db_intf.execute_query(
            """
            INSERT INTO groups (playlist_id, genre_id, association)
            VALUES (%s, %s, %s)
            """,
            vars=( result[ 0 ][ 0 ], genre_id, association ),
            has_return=False
        )