'''
Module: retrossete_db_init.py
Creation Date: February 11th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module initialize the retrossette_db with the required tables

Inputs:
    SQL Queries that will create the database

Outputs:
    None

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
#########################################################################64######
def init_db():
    """
    Function: Initialize the Database

    Description: This function defines the schema for the database, creating
                 the relations and all attributes
    """

    # Only do the following if the connection can be successfully
    # opened
    if retrossette_db_intf.try_open_connection():
        # Create the user table
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "user"
                (
                user_id INT PRIMARY KEY,
                user_auth_code TEXT NOT NULL,
                api_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL
                );
            """,
            False
        )

        # Create the song table
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "song"
                (
                song_id INT PRIMARY KEY,
                song_type INT NOT NULL
                );
            """,
            False
        )

        # Create the playlist table
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "playlist"
                (
                playlist_id INT PRIMARY KEY,
                playlist_name TEXT NOT NULL
                );
            """,
            False
        )
        
        # Create the genre table
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "genre"
                (
                genre_id INT PRIMARY KEY,
                genre_type TEXT NOT NULL
                );
            """,
            False
        )

        # Create the owns relationship table
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "owns"
                (
                user_id INT NOT NULL,
                playlist_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
                FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE
                );
            """,
            False
        )

        # Create the listens_to relationship table
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
            """,
            False
        )

        # Create the houses relationship table
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
            """,
            False
        )

        # Create the groups relationship table
        retrossette_db_intf.execute_query(
            """
            CREATE TABLE IF NOT EXISTS "groups"
                (
                playlist_id INT NOT NULL,
                genre_id INT NOT NULL,
                FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE,
                FOREIGN KEY (genre_id) REFERENCES genre(genre_id) ON DELETE CASCADE
                );
            """,
            False
        )

def delete_all_tables():
    """
    Function: Delete All Tables

    Description: This function deletes all the tables in the databse.
                 This function will NEVER be used in productin code
    """
    # If a connection can be succesfully opened, for table in the table
    # remove it
    if retrossette_db_intf.try_open_connection():
        for table in [ "owns", "listens_to", "houses", "groups", "user", "song", "playlist", "genre" ]:
            retrossette_db_intf.execute_query(
                    f"""
                    DROP TABLE IF EXISTS "{table}" CASCADE;
                    """,
                    False
                )