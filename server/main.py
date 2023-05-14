import re
from typing import List

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
from mail import send_welcome_mail
from note import Note, get_note_by_id, get_user_notes, delete_note
from user import get_user_by_email, User, get_user_by_id

connect(host=os.environ['MONGO_CONN_STR'])
app = Flask(__name__)
CORS(app)


def m_to_d(obj: Document):
    d = obj.to_mongo().to_dict()
    d['_id'] = str(obj.id)
    d['id'] = str(obj.id)
    return d


def get_hashtags(notes: List[Note]):
    hashtags = []
    for note in notes:
        hashtags += re.findall(r"\B(#[a-zA-Z_]+\b)(?!;)", note.text)
    return list(set(hashtags))


def hashtag_in_note(note: Note, hashtag: str):
    return hashtag in note.text


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
                send_welcome_mail(user.email)
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
        if request.json.get('slate_value'):
            note.slate_value = request.json['slate_value']
    note.save()
    return m_to_d(note), 200


@app.route('/note')
@login_required
def handle_get_note(user: User):
    note = get_note_by_id(request.args['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    return m_to_d(note)


@app.route('/notes')
@login_required
def handle_get_notes(user: User):
    notes = get_user_notes(str(user.id))
    if request.args.get('hashtag'):
        notes = [n for n in notes if hashtag_in_note(n, '#'+request.args['hashtag'])]
    return [m_to_d(n) for n in notes]


@app.route('/delete-note', methods=['DELETE'])
@login_required
def handle_delete_note(user: User):
    note = get_note_by_id(request.json['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    delete_note(str(note.id))
    return m_to_d(note)


@app.route('/note/visibility', methods=['POST'])
@login_required
def handle_update_note_visibility(user: User):
    note = get_note_by_id(request.json['note_id'])
    if note.user_id != str(user.id):
        return '', 401
    visibility = request.json['visibility']
    assert visibility in ['public', 'private']
    note.visibility = visibility
    note.save()
    return m_to_d(note)


@app.route('/public/note')
def handle_get_public_note():
    note = get_note_by_id(request.args['note_id'])
    if note.visibility != 'public':
        return '', 401
    user = get_user_by_id(note.user_id)
    return {
        'note': m_to_d(note),
        'user': {
            'email': user.email
        }
    }


@app.route('/user-home')
@login_required
def handle_get_user_home(user: User):
    notes = get_user_notes(str(user.id))
    return {
        'notes': [m_to_d(n) for n in notes],
        'hashtags': get_hashtags(notes)
    }
