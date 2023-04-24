from flask import Flask

app = Flask(__name__)


@app.route("/health")
def hello_world():
    return 'alive'


@app.route("/suggestions")
def hello_world():
    return 'working'
