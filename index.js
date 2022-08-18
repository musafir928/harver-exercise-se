const { writeFile } = require('fs');
const { join } = require('path');
const axios = require('axios');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));

const {
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
const requestBodyGenerator = (word, width, height, color, size) =>
    `https://cataas.com/cat/says/${word}?width=${width}&height=${height}&color=${color}&s=${size}`;

const firstReq = requestBodyGenerator(greeting, width, height, color, size);
const secondReq = requestBodyGenerator(who, width, height, color, size);

// refactoring step1 end

// refactoring step2: use axios: reason1: npm request deprecated, reason2: avoid callback hell

const getCatImage = async (requestUrl, requestNo) => {
    try {
        const catImage = await axios.request({
            method: 'GET',
            url: requestUrl,
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });
        console.log(`Received response with status: ${catImage.status}`);
        return catImage.data;
    } catch (error) {
        console.error(`get cat image for request with requestNo: ${requestNo} failed, 
        error: ${error}`);
    }
};

// refactoring second step finished

const combineImages = async () => {
    try {
        const firstBody = await getCatImage(firstReq, 1);
        const secondBody = await getCatImage(secondReq, 2);
        console.log([
            { buffer: new Buffer(firstBody, 'binary'), x: 0, y: 0 },
            { buffer: new Buffer(secondBody, 'binary'), x: width, y: 0 }
        ]);
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
    } catch (error) {
        console.error(`combining images failed, 
        error: ${error}`);
    }
};

combineImages();
