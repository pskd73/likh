import env
import os
from datetime import datetime
from functools import wraps

import jwt
from flask import Flask, request, make_response
from flask_cors import CORS
from jwt import DecodeError
from mongoengine import connect, Document

from cal import get_event
from chatgpt import get_suggestions
from constant import SAMPLE_TEXT
from date import to_millis
from note import Note, get_note_by_id, get_user_notes, delete_note
from user import get_user_by_email, User


connect(host=os.environ['MONGO_CONN_STR'])
app = Flask(__name__)
CORS(app)


def m_to_d(obj: Document):
    d = obj.to_mongo().to_dict()
    d['_id'] = str(obj.id)
    d['id'] = str(obj.id)
    return d


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('authorization').split(' ')[1]
        try:
            decoded = jwt.decode(
                jwt=token,
                key=os.environ['SUPABASE_PRIVATE_KEY'],
                algorithms=['HS256'],
                audience='authenticated'
            )
            user = get_user_by_email(decoded['email'])
            if user is None:
                user = User(email=decoded['email'], created_at=to_millis(datetime.now()))
                user.save()

                note = Note(
                    user_id=str(user.id),
                    title='Sample note',
                    text=SAMPLE_TEXT,
                    created_at=to_millis(datetime.now())
                )
                note.save()
        except DecodeError:
            return '', 401
        return f(user, *args, **kwargs)
    return decorated_function


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


@app.route('/note', methods=['POST'])
@login_required
def handle_new_note(user: User):
    title = request.json['title']
    text = request.json['text']
    note_id = request.json.get('id')
    if not note_id:
        note = Note(
            user_id=str(user.id),
            created_at=to_millis(datetime.now()),
            title=title,
            text=text
        )
    else:
        note = get_note_by_id(note_id)
        note.title = title
        note.text = text
    note.save()
    return m_to_d(note), 200


@app.route('/notes')
@login_required
def handle_get_note(user: User):
    return [m_to_d(n) for n in get_user_notes(str(user.id))], 200


@app.route('/delete-note', methods=['DELETE'])
@login_required
def handle_delete_note(user: User):
    note = get_note_by_id(request.json['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    delete_note(note.id)
    return ''
