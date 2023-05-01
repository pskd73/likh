from mongoengine import Document, StringField, IntField


class Note(Document):
    user_id = StringField(required=True)
    created_at = IntField(requests=True)
    title = StringField()
    text = StringField()


def get_note_by_id(note_id: str) -> Note:
    return Note.objects.get(id=note_id)
