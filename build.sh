#!/bin/bash

cd retrossette-app;
npm run build;
cd ..;
python3 app.py;