from datetime import datetime

import pytz
from dateutil.relativedelta import relativedelta
from icalendar import Calendar, Event, vText, vRecur


def get_event(start_hour: int) -> bytes:
    start_dt = datetime.now().replace(hour=start_hour, minute=0, second=0, microsecond=0, tzinfo=pytz.utc)
    end_dt = start_dt + relativedelta(hours=1)

    cal = Calendar()

    cal.add('prodid', 'https://retronote.app')
    cal.add('version', '2.0')

    # Add subcomponents
    event = Event()
    event.add('name', 'Write on Retro Note')
    event.add('summary', 'Write on Retro Note')
    event.add('description', 'Build writing habits')
    event.add('dtstart', start_dt)
    event.add('dtend', end_dt)

    event['location'] = vText('On Retro Note')

    recur_rule = vRecur(freq='DAILY', interval=1, count=3)
    event.add('rrule', recur_rule)
    cal.add_component(event)
    return cal.to_ical()
