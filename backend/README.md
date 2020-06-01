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
POST /api/user/<id>/diagnoses/
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
GET /api/users/<id>/diagnosis/<id>/
Authorization: Token <authtoken>
```

#### Responses
##### Successful response:
```json
200 OK
{
    "id": <number>,
    "user": <user id>,
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
