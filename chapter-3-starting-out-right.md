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

## Setting Up a Local Development Server

Before you start to separate out the config file into different builds and conditionals, let’s set up a development server. Run npm install webpack-dev-server --dev. Then update the package.json file with:

```js
//...
"webpack-dev-server": "webpack-dev-server",
//...
"dev": "npm run webpack-dev-server..."
//...
```

Type npm run dev into your terminal and you should see that your code is available to view somewhere on a localhost address. Now you have a dev server to check on your changes as they are compiled, the browser will automatically refresh when changes are compiled. Webpack Dev Server is a web server based on [Express](https://expressjs.com/). All it’s doing is instead of making a bundle, is it is making a bundle in memory and serving that up to Express, which then does a web socket connection which displays the updates as they arrive.

## Starting to Code with Webpack

With the development server set up, making changes to files will cause a compile to occur and you can see the changes reflected in your browser. The workshop example shows the footer.js file being updated to create some markup with JavaScript.

```js
import{ red, blue } from "./button-styles";

const top = document.createElement("div");
top.innerText = "Top of Footer";
top.style = red;
const bottom = document.createElement("div");
bottom.innerText = "Bottom of Footer";
bottom.style = blue;

const footer = document.createElement("footer");
footer.appendChild(top);
footer.appendChild(bottom);

export { top, bottom, footer };
```

This is a very basic example, but it does allow you to immediately see the benefit of using the Webpack development server.

## Splitting Environment Config Files

Time to split the environment config files! In webpack.config.js, update it to:

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
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

The new const modeConfig is calling require and based on what is passed in to the function (env), it will either look for webpack.production or webpack.developemnt. This is leveraging the env.mode and passing it in. Also on the module.exports... line are some additional defaults added as a ‘safety net’ so that if no object is passed in, there is in fact now a default that would run the base configuration of Webpack.

To get your config split into different files, run npm install webpack-merge --dev, then add const webpackMerge = require("webpack-merge"); to the webpack.config.js file. By deafult, Webpack Merge is just using [Object Assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign). Again update the webpack.config.js file to:

```js
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const webpackMerge = require("webpack-merge");

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
    return webpackMerge (
        {
            mode,
            plugins: [
                new HtmlWebpackPlugin(),
                new webpack.ProgressPlugin()
            ]
        },
        modeConfig(mode),
        loadPresets({ mode, presets })
    );
}
```

modeConfig will set the mode. With the webpack.config.js file set up, you can now start to separate production, development, and whatever other build environment settings you would like to have.

## Webpack Q&A

**Can Webpack be used server side?**

Yes, with webpack-dev-middleware

**Can you use the HTML Webpack plugin to process all HTML files without having to declare the plugin across multiple build environments?**

For a multi-page app architecture, you do actually have to have a new instance of this plugin. Check out the [Multipage Webpack Plugin](https://github.com/zorigitano/multipage-webpack-plugin) for some insight on how that has been handled by the instructor in a previous role for Multual of Omaha. Basically, it accesses your entries and for each entry creates a new instance of the plugin.

**Are there situations where Webpack runs into an out of memory error andn where would you capture that exception?**

Yes? Your Webpack space complexity will be linear in terms of how many modules you have in your app. You will end up consuming more and more memory because it needs more and more memory. Increasing the memory limit for Node can help (AirBNB has gone up to 32GB). It’s also possible that you could have a memory leak i.e. you are using hashing while using the dev server and a new hash is created each time you make a file change which is then stored in memory. Don’t do that. BUT… that specific issue has been addressed in Webpack 5.
