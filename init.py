import pathlib
from dotenv import load_dotenv

_ENV_FILE : pathlib.Path = pathlib.Path( "retrossette_env.env" )
if( _ENV_FILE.exists() ):
    load_dotenv( dotenv_path = _ENV_FILE.resolve() )