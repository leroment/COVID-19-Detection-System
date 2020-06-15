# COVID-19 Detection System Backend

## Endpoints
All endpoints start with `/api`

### Login
Get authentication token for user.

##### Format
```json
POST /api/login/
{
    "email": "<user email>",
    "password": "<user password>"
}
```

#### Responses
##### Successful response:
```json
200 OK
{
    "token": "<auth token>",
    "user": {
        "url": "<REST url to get user details>",
        "email": "<email>",
        "is_staff": <true/false>,
        "first_name": "<first name>",
        "last_name": "<last name>",
    }
}
```

##### Invalid credentials
```json
400 Bad Request
{
    "error": "Invalid credentials"
}
```

### Register
Create a new user.

##### Format
```json
POST /api/register/
{
    "email": "<user email>",
    "first_name": "<user first name>",
    "last_name": "<user last name>",
    "password": "<user password>"
}
```

#### Responses
##### Successful response:
```json
201 Created
{
    "url": "<REST url to get user details>",
    "email": "<email>",
    "is_staff": <true/false>,
    "first_name": "<first name>",
    "last_name": "<last name>",
}
```

##### Email exists
```json
400 Bad Request
{
    "username":["A user with that username already exists."]
}
```

##### Invalid email
```json
400 Bad Request
{
    "email":["Enter a valid email address."]
}
```

### Create Diagnosis
Create a new Diagnosis for a user.

##### Format
```json
POST /api/users/<id>/diagnoses/
Authorization: Token <authtoken>
Content-Type: multipart/form-data

"audio": 'audio/wav' data
"xray": 'image/png' data
"data": {
    "temperature": <number>
}
```

**Example Body**
```
---------------------------acebdf13572468
Content-Disposition: form-data; name="audio"; filename="chirp.wav"
Content-Type: audio/wav

<DATA>
---------------------------acebdf13572468
Content-Disposition: form-data; name="xray"; filename="xray.png"
Content-Type: image/png

<DATA>
---------------------------acebdf13572468--
Content-Disposition: form-data; name="data";
Content-Type: image/png

{"temperature":11}
---------------------------acebdf13572468--
```

#### Responses
##### Successful response:
```json
201 Created
{
    "id": 2,
    "temperature_id": 2,
    "audio_id": 2,
    "xray_id": 2
}
```

##### Missing data
```json
400 Bad Request
{
    "temperature": "Temperature required",
    "audio": "Audio required"
}
```

##### Invalid data
```json
400 Bad Request
{
    "temperature": "Temperature must be a number",
    "audio": "Audio must be in WAV format",
    "xray": "Xray must be a PNG image"
}
```

##### Mismatch between user in URL and token
```json
403 Bad Request
{
    "detail":"Invalid user"
}
```

### Get User Diagnoses
Get list of user's diagnoses.

##### Format
```json
GET /api/users/<id>/diagnoses/
Authorization: Token <authtoken>
```

#### Responses
##### Successful response:
```json
200 OK
[
    {
        "id": <number>,
        "user": <user id>,
        "status": "<NEEDS_DATA | WAITING | PROCESSING | AWAITING_REVIEW | REVIEWED>",
        "health_officer": {
            "id": <health officer user id>,
            "first_name": "<name>",
            "last_name": "<name>",
        }
        "last_update": "2020-06-01T01:37:32.471454Z",
        "creation_date": "2020-06-01T01:37:32.471454Z",
        "temperaturereadings": [{
            "id": <number>,
            "reading": <number>
        }],
        "audiorecordings": [{
            "id": <number>,
        }],
        "xrayimages": [{
            "id": <number>,
        }],
        "result": {
            "diagnosis": <id>,
            "approved": <bool>,
            "confidence": <float 0-1>,
            "has_covid": <bool>,
            "creation_date": "2020-06-01T05:50:11.542754Z",
            "last_update":"2020-06-01T05:50:11.542754Z"
        }
    }
]
```

##### Mismatch between user in URL and token
```json
403 Bad Request
{
    "detail":"Invalid user"
}
```

### Get User Diagnosis
Get list of user's diagnosis.

##### Format
```json
GET /api/users/<id>/diagnoses/<id>/
Authorization: Token <authtoken>
```

#### Responses
##### Successful response:
```json
200 OK
{
    "id": <number>,
    "user": <user id>,
    "status": "<NEEDS_DATA | WAITING | PROCESSING | AWAITING_REVIEW | REVIEWED>",
    "health_officer": {
        "id": <health officer user id>,
        "first_name": "<name>",
        "last_name": "<name>",
    }
    "last_update": "2020-06-01T01:37:32.471454Z",
    "creation_date": "2020-06-01T01:37:32.471454Z",
    "temperaturereadings": [{
        "id": <number>,
        "reading": <number>
    }],
    "audiorecordings": [{
        "id": <number>,
    }],
    "xrayimages": [{
        "id": <number>,
    }],
    "result": {
        "diagnosis": <id>,
        "approved": <bool>,
        "confidence": <float 0-1>,
        "has_covid": <bool>,
        "creation_date": "2020-06-01T05:50:11.542754Z",
        "last_update":"2020-06-01T05:50:11.542754Z"
    }
}
```

##### Mismatch between user in URL and token
```json
403 Bad Request
{
    "detail":"Invalid user"
}
```

### Get Audio file
Get audio file

##### Format
```json
GET /api/audios/<id>
Authorization: Token <authtoken>
```

#### Responses
##### Successful response:
WAV data
```
200 OK
Content-Type: audio/wav
```

### Get Xray image
Get Xray image

##### Format
```json
GET /api/xrays/<id>
Authorization: Token <authtoken>
```

#### Responses
##### Successful response:
PNG image
```
200 OK
Content-Type: image/png
```


### Get Health Officer Diagnoses list
Get list of diagnoses awaiting approval by health officer.

##### Format
```json
GET /api/healthofficers/<id>/diagnoses/?status=AWAITING_REVIEW
Authorization: Token <authtoken>
```

Other statuses include:
```
NEEDS_DATA
WAITING
PROCESSING
AWAITING_REVIEW
REVIEWED
```

#### Responses
##### Successful response:
```json
200 OK
[
    {
        "id": <number>,
        "user": <user id>,
        "status": "<NEEDS_DATA | WAITING | PROCESSING | AWAITING_REVIEW | REVIEWED>",
        "health_officer": {
            "id": <health officer user id>,
            "first_name": "<name>",
            "last_name": "<name>",
        }
        "last_update": "2020-06-01T01:37:32.471454Z",
        "creation_date": "2020-06-01T01:37:32.471454Z",
        "temperaturereadings": [{
            "id": <number>,
            "reading": <number>
        }],
        "audiorecordings": [{
            "id": <number>,
        }],
        "xrayimages": [{
            "id": <number>,
        }],
        "result": {
            "diagnosis": <id>,
            "approved": <bool>,
            "confidence": <float 0-1>,
            "has_covid": <bool>,
            "creation_date": "2020-06-01T05:50:11.542754Z",
            "last_update":"2020-06-01T05:50:11.542754Z"
        }
    }
]
```

##### User making request is not a health officer
```json
403 Bad Request
{
    "detail":"Not a health officer"
}
```


### Health Officer Approve or Decline diagnosis result
Approve or decline a diagnosis result as a Health Officer

##### Format
```json
PUT /api/healthofficers/<id>/diagnoses/<id>/
Authorization: Token <authtoken>
```

#### Responses
##### Successful response:
```json
200 OK
[
    {
        "id": <number>,
        "user": <user id>,
        "status": "<NEEDS_DATA | WAITING | PROCESSING | AWAITING_REVIEW | REVIEWED>", // would be "REVIEWED"
        "health_officer": {
            "id": <health officer user id>,
            "first_name": "<name>",
            "last_name": "<name>",
        }
        "last_update": "2020-06-01T01:37:32.471454Z",
        "creation_date": "2020-06-01T01:37:32.471454Z",
        "temperaturereadings": [{
            "id": <number>,
            "reading": <number>
        }],
        "audiorecordings": [{
            "id": <number>,
        }],
        "xrayimages": [{
            "id": <number>,
        }],
        "result": {
            "diagnosis": <id>,
            "approved": <bool>, // would be true
            "confidence": <float 0-1>,
            "has_covid": <bool>,
            "creation_date": "2020-06-01T05:50:11.542754Z",
            "last_update":"2020-06-01T05:50:11.542754Z"
        }
    }
]
```

##### User making request is not a health officer
```json
403 Bad Request
{
    "detail":"Not a health officer"
}
```

##### Diagnosis is not awaiting review
```json
403 Bad Request
["Diagnosis not awaiting review"]
```



### Get statistics counts
Get counts of various interesting statistics.

##### Format
```json
GET /api/stats/
```

#### Responses
##### Successful response:
```json
200 OK
{
    "active_users": <integer>,
    "total_diagnoses": <integer>,
    "total_reviewed_diagnoses": <integer>,
    "total_infected": <integer>,
    "seconds_since_positive": <integer> or null if no positive diagnoses
}
```

*Description*
```json
active_users: count of users with a submitted diagnosis
total_diagnoses: count of diagnoses with any status
total_reviewed_diagnoses: count of diagnoses with REVIEWED status
total_infected: count of users with a positive COVID-19 diagnosis
seconds_since_positive: seconds since a positive diagnosis was submitted
```
