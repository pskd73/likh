from typing import Optional

from mongoengine import Document, StringField, IntField, DoesNotExist, EmbeddedDocument, EmbeddedDocumentField


class Setting(EmbeddedDocument):
    write_font = StringField()
    blog_font = StringField()


class User(Document):
    email = StringField(required=True, unique=True)
    created_at = IntField(required=True)
    first_name = StringField()
    last_name = StringField()
    username = StringField()
    setting = EmbeddedDocumentField(Setting)

    meta = {
        'collection': 'users'
    }

    def get_public_dict(self):
        return {
            'email': self.email,
            'username': self.username,
            'setting': {
                'blog_font': self.setting.blog_font if self.setting else 'CourierPrime'
            }
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


def get_blog_users():
    return User.objects(username__exists=True)
