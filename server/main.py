import os

import jwt
from flask import Flask, request, make_response
from flask_cors import CORS

from cal import get_event
from chatgpt import get_suggestions

app = Flask(__name__)
CORS(app)


@app.route('/health')
def hello_world():
    return 'alive'


@app.route('/suggestions')
def handle_get_suggestions():
    topics = [t for t in request.args.get('topics', '').split(',') if len(t) > 0]
    if len(topics) == 0:
        return []
    return get_suggestions(topics)


@app.route('/event')
def handle_get_event():
    response = make_response(get_event(start_hour=21).decode())
    response.headers['Content-Type'] = 'text/calendar; charset=utf-8'
    return response


@app.route('/test')
def handle_test():
    token = request.headers.get('authorization')
    print(
        jwt.decode(
            jwt=token,
            key=os.environ['SUPABASE_PRIVATE_KEY'],
            algorithms=['HS256'],
            audience='authenticated'
        )
    )
    return 'success'
