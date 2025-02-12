from flask import Flask
import modules.db.db_init as db_init
app = Flask( __name__ )

@app.route("/")
def index():
    db_init.host
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/logo192.png"/><link rel="manifest" href="/manifest.json"/><title>React App</title><script defer="defer" src="/static/js/main.a0b67b7d.js"></script><link href="/static/css/main.f855e6bc.css" rel="stylesheet"></head><body><noscript>You need to enable {db_init.host} to run this app.</noscript><div id="root"></div></body></html>'
if __name__ == "__main__":
    app.run()