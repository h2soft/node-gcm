var util = require('util');
var https = require('https');
var emitter = require('events').EventEmitter;
var retry = require('retry');

function GCM(apiKey) {
    if (apiKey) {
        this.apiKey = apiKey;
    } else {
        throw Error('No apiKey is given.');
    }
    this.gcmOptions = {
        host: 'android.googleapis.com',
        port: 443,
        path: '/gcm/send',
        method: 'POST',
        headers: {}
    };
}

util.inherits(GCM, emitter);

exports.GCM = GCM;

GCM.prototype.send = function(packet, cb) {
    var self = this;
    if (cb) this.once('sent', cb);

    var operation = retry.operation();

    operation.attempt(function(currentAttempt) {
        var postData = JSON.stringify(packet);
        var headers = {
            'Host': self.gcmOptions.host,
            'Authorization': 'key=' + self.apiKey,
            'Content-Type': 'application/json',
            'Content-length': postData.length
        };
        self.gcmOptions.headers = headers;
        if (self.keepAlive)
            headers.Connection = 'keep-alive';

        var request = https.request(self.gcmOptions, function(res) {
            var data = '';

            if (res.statusCode >= 501 && res.statusCode < 600) {
                // If the server is temporary unavailable, the C2DM spec requires that we implement exponential backoff
                // and respect any Retry-After header
                if (res.headers['retry-after']) {
                    var retrySeconds = res.headers['retry-after'] * 1; // force number
                    if (isNaN(retrySeconds)) {
                        // The Retry-After header is a HTTP-date, try to parse it
                        retrySeconds = new Date(res.headers['retry-after']).getTime() - new Date().getTime();
                    }
                    if (!isNaN(retrySeconds) && retrySeconds > 0) {
                        operation._timeouts['minTimeout'] = retrySeconds;
                    }
                }
                if (!operation.retry('TemporaryUnavailable')) {
                    self.emit('sent', operation.mainError(), null);
                }
                // Ignore all subsequent events for this request
                return;
            }

            function respond() {
                var error = null;

                if(res.statusCode >= 200 && res.statusCode < 300) {
                    //Success
                    self.emit('sent', null, JSON.parse(data))
                } else {
                    //Error

                    if (data == "DeviceMessageRateExceeded" || data == "DEVICE_MESSAGE_RATE_EXCEEDED") {
                        if (operation.retry(data)) {
                            return;
                        }
                    }

                    self.emit('sent', data, null)
                }
            }

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', respond);
            res.on('close', respond);
        });
        request.on('error', function(error) {
            self.emit('sent', error, null);
        });
        request.end(postData);
    });
};
