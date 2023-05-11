import http.client
import json
import os


SIDEMAIL_API_KEY = os.environ['SIDEMAIL_API_KEY']


def send_welcome_mail(to_mail: str):
    connection = http.client.HTTPSConnection('api.sidemail.io')

    payload = {
        'fromName': 'Retro Note',
        'fromAddress': 'retronote@j9hjv.via.sidemail.net',
        'toAddress': to_mail,
        'templateName': 'Welcome',
        'templateProps': {
            'my_name': 'Pramod',
            'project_name': 'Retro Note'
        }
    }
    headers = {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + SIDEMAIL_API_KEY
    }

    connection.request('POST', '/v1/email/send', json.dumps(payload), headers)
    # response = connection.getresponse()
    # data = json.loads(response.read().decode("utf-8"))
