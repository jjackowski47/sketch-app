from flask import Flask, jsonify
from flask_cors import CORS

# Change to False for development purpouses
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)

CORS(app, resources={r'/*': {'origins': '*'}})


@app.route('/test')
def index():
    return jsonify(test_api_response='Flask api working correctly!')
