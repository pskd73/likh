from mongoengine import Document


def m_to_d(obj: Document):
    d = obj.to_mongo().to_dict()
    d['_id'] = str(obj.id)
    d['id'] = str(obj.id)
    return d
