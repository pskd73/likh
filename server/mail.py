import os
import resend
import env


RESEND_FROM_EMAIL = 'Retro Note <notify@notification.retronote.app>'
resend.api_key = os.environ['RESEND_API_KEY']


def send_welcome_mail(to_mail: str):
    with open('welcome-email.html', 'r') as f:
        send_email(to_mail, 'Welcome to Retro Note!', f.read())


def send_email(to: str, subject: str, html: str):
    res = resend.Emails.send({
        'from': RESEND_FROM_EMAIL,
        'to': to,
        'subject': subject,
        'html': html
    })


if __name__ == '__main__':
    send_welcome_mail('pramodkumar.damam73@gmail.com')