import sys
import pathlib

import random
import pathlib

from faker import Faker

fake = Faker()

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

def populate_users(n=10):
    for _ in range(n):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "user" (user_uri, user_display_name, user_email, user_profile_image)
            VALUES (%s, %s, %s, %s);
            """,
            vars=(fake.uuid4(), fake.name(), fake.email(), fake.image_url()),
            has_return=False
        )

# Function to populate playlists
def populate_playlists(n=10):
    for _ in range(n):
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "playlist" (playlist_name)
            VALUES (%s);
            """,
            vars=(fake.sentence(nb_words=3),),
            has_return=False
        )

# Function to populate songs
def populate_songs(n=10):
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
    playlists = retrossette_db_intf.execute_query("SELECT playlist_id FROM playlist;", has_return=True)
    genres = retrossette_db_intf.execute_query("SELECT genre_id FROM genre;", has_return=True)

    for playlist in playlists:
        playlist_id = playlist[0]
        selected_genres = random.sample(genres, min(len(genres), random.randint(2, 5)))  # Select 2-5 genres

        remaining_association = 100
        for i, genre in enumerate(selected_genres):
            genre_id = genre[0]
            if i == len(selected_genres) - 1:
                association_value = remaining_association  # Assign remaining value to ensure sum = 100
            else:
                association_value = random.randint(1, remaining_association - (len(selected_genres) - i - 1))
            
            remaining_association -= association_value

            retrossette_db_intf.execute_query(
                """
                INSERT INTO "groups" (playlist_id, genre_id, association)
                VALUES (%s, %s, %s);
                """,
                vars=(playlist_id, genre_id, association_value),
                has_return=False
            )
            

# Function to populate relationships
def populate_relationships():
    users = retrossette_db_intf.execute_query("SELECT user_uri FROM \"user\";", has_return=True)
    playlists = retrossette_db_intf.execute_query("SELECT playlist_id FROM playlist;", has_return=True)
    themes = retrossette_db_intf.execute_query("SELECT theme_id FROM theme;", has_return=True)
    songs = retrossette_db_intf.execute_query("SELECT song_id FROM song;", has_return=True)
    genres = retrossette_db_intf.execute_query("SELECT genre_id FROM genre;", has_return=True)

    for user in users:
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "owns" (user_uri, playlist_id)
            VALUES (%s, %s);
            """,
            vars=(user[0], random.choice(playlists)[0]),
            has_return=False
        )

        retrossette_db_intf.execute_query(
            """
            INSERT INTO "customizes" (user_uri, theme_id)
            VALUES (%s, %s);
            """,
            vars=(user[0], random.choice(themes)[0]),
            has_return=False
        )

        retrossette_db_intf.execute_query(
            """
            INSERT INTO "listens_to" (user_uri, playlist_id, num_of_listens)
            VALUES (%s, %s, %s);
            """,
            vars=(user[0], random.choice(playlists)[0], random.randint(1, 100)),
            has_return=False
        )

        retrossette_db_intf.execute_query(
            """
            INSERT INTO "rates" (user_uri, playlist_id, rates_stars, rates_comment)
            VALUES (%s, %s, %s, %s);
            """,
            vars=(user[0], random.choice(playlists)[0], random.randint(0, 5), fake.sentence()),
            has_return=False
        )

    for playlist in playlists:
        retrossette_db_intf.execute_query(
            """
            INSERT INTO "houses" (playlist_id, song_id, track_number)
            VALUES (%s, %s, %s);
            """,
            vars=(playlist[0], random.choice(songs)[0], random.randint(1, 15)),
            has_return=False
        )

    populate_groups()

def stub():
    populate_users()
    populate_playlists()
    populate_songs()
    populate_relationships()