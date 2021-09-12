var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '10000kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*")

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(500, {error: 'There is no Target-Endpoint header in the request'});
            return;
        }
        console.log(targetURL + req.url)
        request({
                url: targetURL + req.url, method: req.method, json: req.body, headers: {
                    'User-Agent': 'targetapp_android_20',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
            }).on("response", remoteRes => {
            // You can add/remove/modify headers here
            remoteRes.headers["Access-Control-Allow-Origin"] = "*";
        }).pipe(res);
    }
});

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});