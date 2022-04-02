# Chapter 3: Starting Out Right

## Webpack Config

Time to start for real build out a webpack.config.js file!

```js
module.exports = () => ({
    output: {
        filename: "bundle.js"
    }
});
```

The above will change the defalut Webpack output filename to bundle.js

## Passing Variables to Webpack Config

Now we look at how too access environment variables. In the package.json file, update the --mode flag in the “prod” “dev” “prod:debug” “dev:debug” definitions to --env.mode. When you are using the --env.mode flag, it takes whatever value that is, in this case it’s like an object with a mode property and it will provide that to the config for you. Update the webpack.config.js file as below:

```js
module.exports = env => {
console.log(env); // this way you can see what env is
    return {
        output: {
            filename: "bundle.js"
        }
    }
};
```

type npm run prod in the console and you can see the value of env. It should log the whole object, in this case {mode: production}. You’ll also see a warning that the mode has not been set, so set one in your webpack.config.js file.

```js
module.exports = env => {
console.log(env); // this way you can see what env is
    return {
        mode: env.mode,
        output: {
            filename: "bundle.js"
        }
    }
};
```

Now that you know how to get different things into your config file, you can start to change the behavior of your returned object conditionally. First update the webpack.config.js file to:

```js
module.exports = ({ mode }) => {
console.log(mode); // this way you can see what mode is
    return {
        mode,
        output: {
            filename: "bundle.js"
        }
    }
};
```

Moving forward, the next step is to configure the different build environments. One will be to define a set of plugins that you want to use across your whole build system, another is what you want for your development mode, and then what you need for your production mode. There can be more than these, but for the purposes of this workshop, this is the baseline.

## Adding Webpack Plugins

[🔥 OOTB Webpack plugins](https://webpack.js.org/plugins/)

The first essential Webpack plugin is the html-webpack-plugin. If you don’t already have it installed, type npm install html-webpack-plugin --save-dev in your terminal. To get this to exist across all environments of your project, create a new folder for your config files, called built-utils or webpack-thangs or whatever makes sense. Then update your webpack.config.js file as below:

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({ mode }) => {
console.log(mode); // this way you can see what mode is
    return {
        mode,
        output: {
            filename: "bundle.js"
        },
        plugins: [
            new HtmlWebpackPlugin(),
            new webpack.ProgressPlugin()
        ]
    }
};
```

Anytime you pass a plugin to your config file, you need to add new before declaring it (see above code block).
