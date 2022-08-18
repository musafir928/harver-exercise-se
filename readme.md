# Image combiner

A small nodejs project for excercise

_key words: Nodejs, fs, image combining_

## Features

1. Fetches an image of a cat with some custom text
2. Fetches an image of another cat with some more custom text
3. Binds these images together into one image
4. Saves the resulting image as a file

## Tech

Dillinger uses a number of open source projects to work properly:

-   [Nodejs](https://nodejs.org/en/)
-   [axios](https://axios-http.com/docs/intro)
-   [blend](https://www.npmjs.com/package/@mapbox/blend) usage: image combining(encoding)
-   [minimist](https://www.npmjs.com/package/minimist) usage: parsing commadline args
-   [cataas api](https://cataas.com/#/)
-   Async await
-   try catch

# user guide:

1.  clone the project: `https://github.com/musafir928/harver-exercise-se.git`
2.  run: `npm i`
3.  generate combined cat images:
    -   option 1: get image with default settings: `npm run start` or `node index.js`
    -   option 2: get image with customised settings: `node index.js --color=red`
        -   above line means: the text on the image will be red
        -   for how to define custom params: [minimist](https://www.npmjs.com/package/minimist)

# command line params:

| params       | default   | usage                           |
| ------------ | --------- | ------------------------------- |
| greeting/who | Hello/you | the text displayed on the image |
| color        | pink      | the text color                  |
| height/width | 500/400   | image size                      |
| size         | 100       | text size                       |

# folder structure:

```
📦 quakehunter
    📜 index.js => code with useful comments
    📜 .gitignore
    📜 index-clean => cleaned version of index
    📜 package.json=> npm packages and start script
    📜 cat-card.jpeg => generated file
```

# Thanks!

Thanks for giving this opportunity to do this assessment.
