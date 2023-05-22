import re
from typing import List
from mongoengine import Document, StringField, IntField

from md import unmark
from mongo import m_to_d


class Note(Document):
    user_id = StringField(required=True)
    created_at = IntField(requests=True)
    title = StringField()
    text = StringField()
    slate_value = StringField()
    visibility = StringField(default='private')

    def to_dict(self):
        result = m_to_d(self)
        result['plain_text'] = unmark(self.text)
        result['plain_title'] = get_note_title(self)
        return result


def get_note_by_id(note_id: str) -> Note:
    return Note.objects.get(id=note_id)


def get_user_notes(user_id: str) -> List[Note]:
    return Note.objects(user_id=user_id)


def delete_note(note_id: str):
    Note.objects(id=note_id).delete()


def get_all_public_notes():
    return Note.objects(visibility='public').only('id', 'user_id', 'created_at', 'title', 'text')


def get_user_public_notes(user_id: str):
    return Note.objects(user_id=user_id, visibility='public')


def get_note_title(note: Note):
    if note.title:
        return note.title
    match = re.match(r'^#{1,3} (.*)(\n|$)', note.text)
    if match:
        return match.group(1)
    text = re.sub(r'\B(#[a-zA-Z_]+\b)(?!;)', '', note.text)
    text = unmark(text)
    text = text.strip()
    text = text.replace('\n', '. ')
    return text[:100] + ("..." if len(text) > 100 else '')
