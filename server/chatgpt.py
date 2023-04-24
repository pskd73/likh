import json
import os
from json import JSONDecodeError
from typing import List

import openai


openai.api_key = os.environ['OPENAI_TOKEN']


def send_prompt(message: str):
    return openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'user', 'content': message}
        ]
    )


def parse_response_json(res: dict):
    content = res['choices'][0]['message']['content']
    try:
        return json.loads(content)
    except JSONDecodeError as e:
        print(content)
        raise e


def get_suggestions(topic_names: List[str]):
    prompt = '''
Act as an API that responds in JSON. Based on an input list of topics, generate a list of {} topics to write a short note on. For each topic in the output list, include a title of the note to write about and a topic that it belongs to.

Sample input: ["Python programming", "Philosophy", "Product development", "Social problems", "SaaS", "Build in public"]
Sample output: {}

Input: {}
Output:
'''.format(
        5,
        json.dumps([
            {
                "topic": "Python programming",
                "title": "An overview of the most useful libraries in Python for data analysis and visualization."
            },
            {
                "topic": "Philosophy",
                "title": "A discussion of the connection between philosophy and leadership."
            },
            {
                "topic": "Social problems",
                "title": "A study of the effects of poverty on mental health."
            }
        ]),
        ', '.join(topic_names)
    )
    res = send_prompt(prompt)
    return parse_response_json(res)
