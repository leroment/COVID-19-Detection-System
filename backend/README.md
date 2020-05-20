# COVID-19 Detection System Backend

## Endpoints
All endpoints start with `/api`

### Login
Get authentication token for user.

##### Format
```json
POST /api/login
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
POST /api/register
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
