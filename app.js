var express = require('express'),
    expressJwt = require('express-jwt'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    compression = require('compression'),
    users = require('./modules/users'),
    bookings = require('./modules/bookings'),
    secretJSON = '',
    app = express(),
    domains = process.env.DOMAINS  || '*',
    allowCrossDomain = function (req, res, next) {
        if (req.headers.origin) {
            if (domains === '*') {
                res.header('Access-Control-Allow-Origin', '*');
            } else {
                if (domains.indexOf(req.headers.origin) !== -1) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                } else {
                    res.header("Access-Control-Allow-Origin", 'null');
                }
            }
        }
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    },
    version = 'v1';

try {
    secretJSON = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
} catch (error) {
    console.error(error);
}

app.use(allowCrossDomain);
app.use(compression());
app.use(bodyParser.json());


//Authorization
app.use(expressJwt({secret: secretJSON.secret}).unless({path:['/api/' + version + '/login', '/api/' + version + '/about']}));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({'code':401, 'message': 'Invalid token'});
    }
});

app.post('/api/' + version + '/login', users.login);
app.get('/api/' + version + '/me', users.me);

app.get('/api/' + version + '/bookings', bookings.findAll);

app.get('/api/' + version + '/cottages/:cottage/bookings', bookings.findByCottage);
app.get('/api/' + version + '/cottages/:cottage/bookings/:start', bookings.findByCottageAndStart);
app.get('/api/' + version + '/cottages/:cottage/bookings/:start/:end', bookings.findByCottageAndStartAndEnd);

app.get('/api/' + version + '/bookings/:id', bookings.findById);
app.post('/api/' + version + '/bookings', bookings.addBooking);
app.put('/api/' + version + '/bookings/:id', bookings.updateBooking);
app.delete('/api/' + version + '/bookings/:id', bookings.deleteBooking);
app.get('/api/' + version + '/about', function (req, res) {
    res.status(200).send({'success': {'statusCode': 200, 'message': 'API is up and running'}});
});

app.listen(process.env.PORT || 3001);
console.log('Listening on port 3001...');