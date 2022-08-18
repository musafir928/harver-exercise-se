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
const requestBodyGenerator = (word, width, height, color, size) =>
    `https://cataas.com/cat/says/${word}?width=${width}&height=${height}&color=${color}&s=${size}`;

const firstReqUrl = requestBodyGenerator(greeting, width, height, color, size);
const secondReqUrl = requestBodyGenerator(who, width, height, color, size);

const getCatImage = async (requestUrl, requestNo) => {
    try {
        const catImage = await axios.request({
            method: 'GET',
            url: requestUrl,
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });
        console.log(
            `Received response with status: ${catImage.status}, for request with requestNo: ${requestNo}`
        );
        return catImage.data;
    } catch (error) {
        console.error(`get cat image for request with requestNo: ${requestNo} failed, 
        error: ${error}`);
    }
};

const combineImages = async () => {
    try {
        blend(
            [
                {
                    buffer: new Buffer.from(await getCatImage(firstReqUrl, 1), 'binary'),
                    x: 0,
                    y: 0
                },
                {
                    buffer: new Buffer.from(await getCatImage(secondReqUrl, 2), 'binary'),
                    x: width,
                    y: 0
                }
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
