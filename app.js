require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const key = process.env.API_KEY

app.get('/', function(req, res) {
    res.render('index', {
        ip: "0.0.0.0",
        region: "Earth",
        country: "Space",
        postalCode: "xxxxxx",
        timezone: "-Relative",
        isp: "Satellite X",
        lat: '0',
        long: '0',
        valid: 1,
    });
})

app.post('/', function(req, res) {
    const apiKey = key;
    const q = req.body.ip;
    const url = "https://geo.ipify.org/api/v1?apiKey=" + apiKey + "&ipAddress=" + q;
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (regex.test(q)) 
    {

        https.get(url, function(response) {
            response.on("data", function(data) {
                const ipData = JSON.parse(data);

                const ip = ipData.ip;
                const region = ipData.location.region;
                const country = ipData.location.country;
                const postalCode = ipData.location.postalCode;
                const timezone = ipData.location.timezone;
                const isp = ipData.isp;
                const lat = ipData.location.lat;
                const long = ipData.location.lng;

                res.render('index', {
                    ip: ip,
                    region: region,
                    country: country,
                    postalCode: postalCode,
                    timezone: timezone,
                    isp: isp,
                    lat: lat,
                    long: long,
                    valid: 1,
                })
            })

        })
    } else {
    	const valid = 0;
        res.render('index',{
        ip: "0.0.0.0",
        region: "Earth",
        country: "Space",
        postalCode: "xxxxxx",
        timezone: "-Relative",
        isp: "Satellite X",
        lat: '0',
        long: '0',
        valid: 0,
    });
    }
})

app.listen(process.env.PORT || 3000, function() {
    console.log('listening on port 3000...');
})