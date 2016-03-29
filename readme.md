# MFC SERVICES

## Developer setup & dependencies

Install Node and MongoDB using Homebrew

`brew update`

`brew install node`

`brew install mongodb`

More info on installing MongoDB can be found here: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

## Getting up and running

### Clone the repo

`$ git clone https://github.com/rstphnsn/mfc-services.git mfc-services`

`cd mfc-services`

### Configure the API

To run the app you will need to create a `secret.json` in the root of the site

```
{
    "secret": "secretstring",
    "user": {
        "username": "admin",
        "password": "admin"
    }
}
```

`secret` - Value used for hashing tokens
`user` - Services username and password

Update the values as required for each installation.


### Install the app

`npm install`

Make sure Mongo is up and running locally

`mongod`

`npm start`

The services will start running on locahost:3001

At first run your database will be empty. You can use the services to add bookings.


### Deployment

To run the services using an externally hosted Mongo database provide DB_URL process envirenment variable in the start up command.

Example Procfile:

`web: DB_URL=mongodb://<dbuser:username>:<dbuser:password>@ds021979.mlab.com:<db:port>/mfc node app.js`

