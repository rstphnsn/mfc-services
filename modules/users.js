var jwt = require('jsonwebtoken'),
    fs = require('fs'),
    secretJSON = '';

try {
    secretJSON = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
} catch (error) {
    console.error(error);
}

var makeToken = function (username) {
    return jwt.sign({'user': {'username': username}}, secretJSON.secret);
};

exports.login = function (request, response) {
    var body = request.body,
        token;
    if (body.username === secretJSON.user.username && body.password === secretJSON.user.password) {
        token = makeToken(secretJSON.user.username);
        response.status(200).send({
            'token': token,
            'user': {
                'username': body.username
            }
        });
    } else {
        response.status(401).send('Unauthorized');
    }
};

exports.me = function (request, response) {
    response.status(200).send({
        'user': {
            'username': secretJSON.user.username
        }
    });
};
