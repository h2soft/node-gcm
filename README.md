node-gcm
========
An interface for "Google Cloud Messaging for Android" on Node.js

## Installation

Via [npm][1]:

    $ npm install gcm

As a submodule of your project

    $ git submodule add http://github.com/h2soft/node-gcm.git gcm
    $ git submodule update --init

## Usage

    var GCM = require('gcm').GCM;

    var apiKey = '';
    var gcm = new gcm(apiKey);

    var message = {
        registration_id: 'Device registration id', // required
        collapse_key: 'Collapse key', 
        'data.key1': 'value1',
        'data.key2': 'value2'
    };
    
    gcm.send(message, function(err, messageId){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Sent with message ID: ", messageId);
        }
    });

See [GCM documentation][2] for details.

## Credits

Written and maintained by [Changshin Lee][3].
Thanks to Yury Proshchenko for his great work on [node-c2dm][4], from which this project stems.

## License

The MIT License

Copyright (c) 2012 Changshin Lee (cslee@h2soft.kr)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: http://github.com/isaacs/npm
[2]: http://developer.android.com/guide/google/gcm/index.html
[3]: mailto:cslee@h2soft.kr
[4]: https://github.com/SpeCT/node-c2dm

## Changelog

1.0.0:

  - Initial release