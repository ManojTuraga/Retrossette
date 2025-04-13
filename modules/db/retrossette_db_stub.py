'''
Module: retrossette_db_stub.py
Creation Date: April 7th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module provides a way to create fake data in the context
    of the retrossette application. 

    Note, this data cannot be used in the context of the spotify
    player

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
# Import the sys and pathlib path to assist with relative imports
import sys
import pathlib

# Import the random and faker libraries to be used to generate fake data
import random
from faker import Faker

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
# VARIABLES
###############################################################################
fake = Faker()

###############################################################################
# Procedures
###############################################################################
def populate_users(n=10):
    """
    Function: Populate Users

    Description: This function populates the databases with random user values
    """
    # For every random user, insert a random uri, random name, random email, and random
    # profile image
    for _ in range(n):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "user" (user_uri, user_display_name, user_email, user_profile_image)
            VALUES (%s, %s, %s, %s);
            """,
            vars=(fake.uuid4(), fake.name(), fake.email(), fake.image_url()),
            has_return=False
        )

def populate_playlists(n=10):
    """
    Function: Populate Playlists

    Description: This function populates the databases with random playlist values
    """
    # For every random playlist, associate the playlist with a fake sentence
    for _ in range(n):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "playlist" (playlist_name)
            VALUES (%s);
            """,
            vars=(fake.sentence(nb_words=3),),
            has_return=False
        )

def populate_songs(n=10):
    """
    Function: Populate Songs

    Description: This function populates the databases with random song values
    """
    # For every song that we want to fake, create a fake id, fake title, fake length, and
    # fake song type
    for _ in range(n):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "song" (song_id, song_name, duration_ms, song_type)
            VALUES (%s, %s, %s, %s);
            """,
            vars=(fake.uuid4(), fake.sentence(nb_words=3), random.randint(180000, 300000), random.randint(1, 5)),
            has_return=False
        )

def populate_groups():
    """
    Function: Populate Groups

    Description: This function populates the databases with links between playlists
                 and the genres that they are associated with
    """
    # Get every fake playlist that exists
    playlists = retrossette_db_intf.execute_query("SELECT playlist_id FROM playlist;", has_return=True)
    
    # Get every genre that exists
    genres = retrossette_db_intf.execute_query("SELECT genre_id FROM genre;", has_return=True)

    # For every playlist that exists in our database, do the following
    for playlist in playlists:
        playlist_id = playlist[0]

        # Choose at random between 2 to 5 genres that we will associate with
        selected_genres = random.sample(genres, min(len(genres), random.randint(2, 5)))

        # The sum of all associations must be 100 so this is our starting point
        remaining_association = 100

        # For every genre that we selected, do the following
        for i, genre in enumerate(selected_genres):
            genre_id = genre[0]

            # Randomly determine the association for this genre when applicable
            if i == len(selected_genres) - 1:
                association_value = remaining_association
            else:
                association_value = random.randint(1, remaining_association - (len(selected_genres) - i - 1))
            
            # Update the remaining association
            remaining_association -= association_value

            # Add the association to the database
            retrossette_db_intf.execute_query(
                """
                INSERT INTO "groups" (playlist_id, genre_id, association)
                VALUES (%s, %s, %s);
                """,
                vars=(playlist_id, genre_id, association_value),
                has_return=False
            )
            
def populate_relationships():
    """
    Function: Populate Relationships

    Description: This function populates fake relationships between all the entities 
                 that exist within the database
    """
    # Get every fake user that is in the database
    users = retrossette_db_intf.execute_query("SELECT user_uri FROM \"user\";", has_return=True)
    
    # Get every fake playlist that is in the database
    playlists = retrossette_db_intf.execute_query("SELECT playlist_id FROM playlist;", has_return=True)
    
    # Get every fake theme that is in the database
    themes = retrossette_db_intf.execute_query("SELECT theme_id FROM theme;", has_return=True)
    
    # Get every fake song that is in the database
    songs = retrossette_db_intf.execute_query("SELECT song_id FROM song;", has_return=True)
    #genres = retrossette_db_intf.execute_query("SELECT genre_id FROM genre;", has_return=True)

    # For every fake user, do the following
    for user in users:
        # Create a fake set of playlists that the user owns
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "owns" (user_uri, playlist_id)
            VALUES (%s, %s);
            """,
            vars=(user[0], random.choice(playlists)[0]),
            has_return=False
        )

        # Create a fake association to a theme
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "customizes" (user_uri, theme_id)
            VALUES (%s, %s);
            """,
            vars=(user[0], random.choice(themes)[0]),
            has_return=False
        )

        # Generate fake data to all the playlists that the user listened to
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "listens_to" (user_uri, playlist_id, num_of_listens)
            VALUES (%s, %s, %s);
            """,
            vars=(user[0], random.choice(playlists)[0], random.randint(1, 100)),
            has_return=False
        )

        # Generate fake ratings for all the playlists that exist
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "rates" (user_uri, playlist_id, rates_stars, rates_comment)
            VALUES (%s, %s, %s, %s);
            """,
            vars=(user[0], random.choice(playlists)[0], random.randint(0, 5), fake.sentence()),
            has_return=False
        )

    # For every fake playlist, do the following
    for playlist in playlists:
        # Generate fake links between playlists and their songs
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "houses" (playlist_id, song_id, track_number)
            VALUES (%s, %s, %s);
            """,
            vars=(playlist[0], random.choice(songs)[0], random.randint(1, 15)),
            has_return=False
        )

    populate_groups()

# The following is the parent stub function that can be
# called to stub out the database
def stub():
    populate_users()
    populate_playlists()
    populate_songs()
    populate_relationships()