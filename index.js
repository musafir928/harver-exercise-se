const { writeFile } = require('fs');
const { join } = require('path');
const axios = require('axios');
const request = require('request');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));

let {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'Pink',
    size = 100
} = argv;

// refactoring step1: use request body/options function to achieve simplicity and reusability
/**
 * @returns eg: {url: https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150}
 */
const requestBodyGenerator = (word, width, height, color, size, encodingType) => ({
    url: `https://cataas.com/cat/says/${word}?width=${width}&height=${height}&color=${color}&s=${size}`,
    encoding: encodingType
});

const firstReq = requestBodyGenerator(greeting, width, height, color, size, 'binary');
const secondReq = requestBodyGenerator(who, width, height, color, size, 'binary');

// refactoring step1 end

// refactoring step2: use axios: reason1: npm request deprecated, reason2: avoid callback hell

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
