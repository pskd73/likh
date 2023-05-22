from typing import Optional

from mongoengine import Document, StringField, IntField, DoesNotExist


class User(Document):
    email = StringField(required=True, unique=True)
    created_at = IntField(required=True)
    first_name = StringField()
    last_name = StringField()
    username = StringField()

    meta = {
        'collection': 'users'
    }


def get_user_by_email(email: str) -> Optional[User]:
    try:
        return User.objects.get(email=email)
    except DoesNotExist:
        return None


def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        return User.objects.get(id=user_id)
    except DoesNotExist:
        return None


def get_user_by_username(username: str) -> Optional[User]:
    try:
        return User.objects.get(username=username)
    except DoesNotExist:
        return None
