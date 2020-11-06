
# Atlan Backend Internship Task -
## How to run:
● Make sure docker is installed
```
    docker-compose up --build
```
PORT EXPOESED : 80

## Data Model:
● **userModel** a simple model to store user objects:
    ● username
    ● password( bcrypt hashed )

## API Endpoints :-
**1. POST /auth/signup:** This route is for signing up users(or logging in if user already exist) which will be taking an email and password to create/login the user.

**send:**

```JSON
{
    "username" : "xritzx",
    "password": "helloatlan"
}
```

**recieve**

```JSON
{
    "message" : "User logged /created",
    "username" : "xritzx",
    "token" : "JWT_TOKEN"
}
```
`Note: Setting the Authorization header is crucial since it verifies user through a middleware function, every operation needs a user to map the processes`

**2a. POST /upload/:** This route takes in the file to be uploaded and starts saving it into the server
**Add headers** 

`Authorization : Bearer jfabjafaf39tnglagg_#1h1rjafTHE_RECIEVED_AUTH_TOKENasfkj3t01h301tbgp12`

**send:**

    `form-data:`
    `KEY(file/text):VALUE(file.format)`
    
**recieve**

```JSON
{
    "Message on COMPLETION/ABORTION/ERROR"
}
```

**2b. POST /upload/stop:** Call to this route stops the ongoing upload process by the user identified by the Auth Token
**Add headers** 

`Authorization : Bearer jfabjafaf39tnglagg_#1h1rjafTHE_RECIEVED_AUTH_TOKENasfkj3t01h301tbgp12`

**send:**

    `nothing needs to be sent`
    
**recieve**

```JSON
{
    "Message on TERMINATION/ERROR"
}
```

**3a. POST /export/:** This route takes in the filename to be downloaded and starts `piping` it into the `Response` object
**Add headers** 

`Authorization : Bearer jfabjafaf39tnglagg_#1h1rjafTHE_RECIEVED_AUTH_TOKENasfkj3t01h301tbgp12`

**send:**

```JSON
{
    "filename": "sample.csv"
}
```

**recieve**

```JSON
{
    "Message on COMPLETION/ABORTION/ERROR"
}
```

**3b. POST /export/stop:** Call to this route stops the ongoing export process by the user identified by the Auth Token

**Add headers** 

`Authorization : Bearer jfabjafaf39tnglagg_#1h1rjafTHE_RECIEVED_AUTH_TOKENasfkj3t01h301tbgp12`

**send:**

    `nothing needs to be sent`
    
**recieve**

```JSON
{
    "Message on export TERMINATION/ERROR"
}
```

## PROCESS FLOW :-

### Authenticate :
    - Authenticate using a dummy user credentions and create a user
    use the recieved JWT Token for any other API Calls

### 1). File Uploads/Export :
    - User can create an upload request by using the apt. API endpoint and the upload process starts.
    - A jobQueue is maintain in-memory as KV Store where username acts as the key(since only one conncurrent process is allowed)
         and the process Object as Value.
    - This process can listen for multiple events one of such event is `abort` which can be triggered by the API `2b` 
    - If the upload process is requested to be terminated an `abort` event is emitted by the API (2b),
         which triggers the `abort` event on the reference Object stored with `user` as Key.
    - In case of an Upload Task when finished the file is moved to a directory named Uploads.
        In case of the export job the exported file will end up in the response Object.
