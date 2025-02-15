from flask import Flask, send_from_directory
import pathlib

app = Flask( __name__, root_path=str( pathlib.Path( "retrossette-app/build" ).resolve() ) )

@app.route( '/api' )
def api():
    return "hello"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index( path ):
    if path != "" and pathlib.Path( path ).exists():
        return send_from_directory( app.root_path, path )
    
    return send_from_directory( app.root_path, "index.html" )

if __name__ == "__main__":
    app.run()