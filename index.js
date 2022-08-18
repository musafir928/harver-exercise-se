let { writeFile } = require('fs');
let { join } = require('path');
let request = require('request');
let blend = require('@mapbox/blend');
let argv = require('minimist')(process.argv.slice(2));

let {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'Pink',
    size = 100
} = argv;

/**
 * @returns eg: {url: https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150}
 */
const requestBodyGenerator = (word, width, height, color, size, encodingType) => ({
    url: `https://cataas.com/cat/says/${word}?width=${width}&height=${height}&color=${color}&s=${size}`,
    encoding: encodingType
});

const firstReq = requestBodyGenerator(greeting, width, height, color, size, 'binary');
const secondReq = requestBodyGenerator(greeting, width, height, color, size, 'binary');

request.get(firstReq, (err, res, firstBody) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Received response with status:' + res.statusCode);

    request.get(secondReq, (err, res, secondBody) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Received response with status:' + res.statusCode);

        blend(
            [
                { buffer: new Buffer(firstBody, 'binary'), x: 0, y: 0 },
                { buffer: new Buffer(secondBody, 'binary'), x: width, y: 0 }
            ],
            { width: width * 2, height: height, format: 'jpeg' },
            (err, data) => {
                const fileOut = join(process.cwd(), `/cat-card.jpg`);

                writeFile(fileOut, data, 'binary', (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log('The file was saved!');
                });
            }
        );
    });
});
