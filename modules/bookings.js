var mongo = require('mongodb'),
    errors = require('./errors'),
    MongoClient = require('mongodb').MongoClient,
    DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/mfc',
    db,
    DB_TABLE = 'bookings',
    ObjectID = mongo.ObjectID;

    console.log(process.env.DB_URL);

// Initialize connection once
MongoClient.connect(DB_URL, function (err, database) {
    if (!err) {
        db = database;
        console.log('Connected to MongoDB for ' + DB_TABLE);
        db.collection(DB_TABLE, {strict: true}, function (err, collection) {
            if (err) {
                console.log('The ' + DB_TABLE + ' collection doesn’t exist. Add some data.');
            }
        });
    }
    if (err) {
        throw new Error(err);
    }
});

exports.findAll = function (req, res) {
    console.log('Listing bookings');
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(500).send({'error': {'code': 500, 'message': err}});
        } else {
            collection.find().toArray(function (err, items) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                }
                res.send(items);
            });
        }
    });
};

exports.findByCottage = function (req, res) {
    var cottage = req.params.cottage;
    console.log('Retrieving bookings by cottage: ' + cottage);
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(400).send({'error': {'code': 400, 'message': err}});
        } else {
            collection.find({'cottage': cottage}).toArray(function (err, items) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                }
                res.send(items);
            });
        }
    });
};

exports.findByCottageAndStart = function (req, res) {
    var cottage = req.params.cottage;
    var start = parseInt(req.params.start, 10);
    console.log('Retrieving bookings by cottage: ' + cottage + ' and start: ' + start);
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(400).send({'error': {'code': 400, 'message': err}});
        } else {
            collection.find({'start': { '$gte': start }, 'cottage': cottage}).toArray(function (err, items) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                }
                res.send(items);
            });
        }
    });
};

exports.findByCottageAndStartAndEnd = function (req, res) {
    var cottage = req.params.cottage,
        start = parseInt(req.params.start, 10),
        end = parseInt(req.params.start, 10);
    console.log('Retrieving bookings by cottage: ' + cottage + ' and start: ' + start + ' and end: ' + end);
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(400).send({'error': {'code': 400, 'message': err}});
        } else {
            collection.find({'start': { '$gte': start }, 'end': { '$lt': end }, 'cottage': cottage}).toArray(function (err, items) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                }
                res.send(items);
            });
        }
    });
};

exports.findById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving booking by id: ' + id);
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(400).send({'error': {'code': 400, 'message': err}});
        } else {
            collection.findOne({'_id': new ObjectID(id)}, function (err, item) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                } else {
                    if (item) {
                        res.send(item);
                    } else {
                        console.log('Error: Not found');
                        res.status(404).send({'error': {'code': 404, 'message': 'Not found'}});
                    }
                }
            });
        }
    });
};

exports.addBooking = function (req, res) {
    var body = req.body;
    console.log('Adding booking: ' + JSON.stringify(body));
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(500).send({'error': {'code': 500, 'message': err}});
        } else {
            collection.insert(body, {safe: true}, function (err, result) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                } else {
                    console.log('Success: ' + JSON.stringify(result.ops[0]));
                    res.send(result.ops[0]);
                }
            });
        }
    });
};

exports.updateBooking = function (req, res) {
    var id = req.params.id,
        body = req.body;
    console.log('Updating booking: ' + id);
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(500).send({'error': {'code': 500, 'message': err}});
        } else {
            collection.findAndModify({'_id': new ObjectID(id)}, [], {$set: body}, {safe: true, new: true}, function (err, result) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                } else {
                    if (!result.value) {
                        console.log('Error: Not found');
                        res.status(404).send({'error': {'code': 404, 'message': 'Not found'}});
                    } else {
                        console.log('Success: ' + JSON.stringify(result.value));
                        res.send(result.value);
                    }
                }
            });
        }
    });
};

exports.deleteBooking = function (req, res) {
    var id = req.params.id;
    console.log('Deleting booking: ' + id);
    db.collection(DB_TABLE, function (err, collection) {
        if (err) {
            err = errors.formatError(err);
            console.log('Error: ' + err);
            res.status(500).send({'error': {'code': 500, 'message': err}});
        } else {
            collection.remove({'_id': new ObjectID(id)}, {safe: true}, function (err, result) {
                if (err) {
                    err = errors.formatError(err);
                    console.log('Error: ' + err);
                    res.status(500).send({'error': {'code': 500, 'message': err}});
                } else {
                    if (!result.result.n) {
                        console.log('Error: Not found');
                        res.status(404).send({'error': {'code': 404, 'message': 'Not found'}});
                    } else {
                        console.log('Success: ' + result.result.n + ' document(s) deleted');
                        res.send({});
                    }
                }
            });
        }
    });
};
