from typing import Optional

from mongoengine import Document, StringField, IntField, DoesNotExist


class User(Document):
    email = StringField(required=True, unique=True)
    created_at = IntField(required=True)
    first_name = StringField()
    last_name = StringField()

    meta = {
        'collection': 'users'
    }


def get_user_by_email(email: str) -> Optional[User]:
    try:
        return User.objects.get(email=email)
    except DoesNotExist:
        return None
