from flask import Flask, request
from flask_cors import CORS

from chatgpt import get_suggestions

app = Flask(__name__)
CORS(app)


@app.route("/health")
def hello_world():
    return 'alive'


@app.route("/suggestions")
def handle_get_suggestions():
    return get_suggestions(request.args.get('topics', '').split(','))
