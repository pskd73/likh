from unittest import TestCase

from note import get_note_title, Note


class TestNote(TestCase):
    def test_get_title(self):
        self.assertEqual(get_note_title(Note(title='A sample title')), 'A sample title')
        self.assertEqual(get_note_title(Note(title='A sample title', text='Sample text')), 'A sample title')
        self.assertEqual(get_note_title(Note(title=None, text='Sample text')), 'Sample text')
        text = '''First day of intense studying, and I'm already feeling the weight of it all. I can't help but regret not starting earlier. The sheer amount of material to cover is daunting, and it's hard to believe I can do it justice in just one week. Nevertheless, I must give it my all. I've created a study schedule, broken down the subjects into manageable chunks, and set specific goals for each day. It's going to be a challenging journey, but I'm determined to make the most of this final week. Wish me luck!'''
        self.assertEqual(get_note_title(Note(title=None, text=text)), '''First day of intense studying, and I'm already feeling the weight of it all. I can't help but regret...''')

        self.assertEqual(get_note_title(Note(title=None, text='# Title')), 'Title')
        self.assertEqual(get_note_title(Note(title=None, text='## Title')), 'Title')
        self.assertEqual(get_note_title(Note(title=None, text='### Title')), 'Title')
        self.assertEqual(get_note_title(Note(title=None, text='####### Title')), '# Title')
        self.assertEqual(get_note_title(Note(title=None, text='# Title\nAnother line')), 'Title')
        self.assertEqual(get_note_title(Note(title=None, text='#somehashtag Title')), 'Title')
        self.assertEqual(get_note_title(Note(title=None, text='__First__ day has been good')), 'First day has been good')
        self.assertEqual(get_note_title(Note(title=None, text='#hashtag\n\n__Title__')),
                         'Title')

