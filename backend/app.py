# -*- coding: utf-8 -*-

import os
import string
import flask
from flask import request
from flask_cors import CORS

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

import base64
from email.mime.text import MIMEText

# This variable specifies the name of a file that contains the OAuth 2.0
# information for this application, including its client_id and client_secret.
CLIENT_SECRETS_FILE = "client_secret.json"

# This OAuth 2.0 access scope allows for full read/write access to the
# authenticated user's account and requires requests to use an SSL connection.
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
API_SERVICE_NAME = 'drive'
API_VERSION = 'v2'

app = flask.Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return "Hello bitch"


# post token: access-token
@app.route('/test', methods=['POST'])
def test_api_request():
    data: string = request.get_json()
    token: string = data["token"]
    mailConfig = data["mail"]

    service = build('gmail', 'v1', credentials=Credentials(token))
    message = MIMEText(mailConfig['text'])
    for section in ['To', 'Subject']:
        if section.lower() in mailConfig:
            message[section] = mailConfig[section.lower()]
    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    create_message = {
        'raw': encoded_message
    }

    send_message = service.users().messages().send(
        userId="me", body=create_message).execute()

    return {"success": True, "send_message": send_message}


if __name__ == '__main__':
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    # Specify a hostname and port that are set as a valid redirect URI
    # for your API project in the Google API Console.
    app.run('localhost', 5000, debug=True)
