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

    return[ 0 ][ 0 ]

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
    pass