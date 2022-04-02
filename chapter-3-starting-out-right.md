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

## Using Plugins

---

## Using CSS with Webpack

It would be more manageable if styles were out of the JavaScript right?! Like maybe in their own CSS/SCSS file? Yep. Go ahead and make a new stylesheet for your footer.js file. Call it footer.css or something clever like that (I ‘m actually using SASS, so if you’d like to do that as well, run npm install sass sass-loader to get support for that filetype). I added classes and an import for the SCSS file to my footer.js file like so:

```js
import "./footer.scss";
import { red, blue } from "./button-styles";

const top = document.createElement("div");
top.className = "footer--top";
top.innerText = "Top of Footer";
const bottom = document.createElement("div");
bottom.innerText = "Bottom of Footer";
bottom.className = "footer--bottom";
const footer = document.createElement("footer");
footer.appendChild(top);
footer.appendChild(bottom);

export { top, bottom, footer };
```

In your new footer.css (or footer.scss) file, add some styling like so:

```css
footer {
    height: 100px;
    width: 100%;
    text-align: center;

    .footer--top {
        padding: 10px 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: lawngreen;
    }

    .footer--bottom {
        padding: 10px 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: aqua;
    }
}
```

Do whatever you like for styling, the important thing is to see the things! But before we get to see all the awesome we’ve made, we have to update the config file to provide the appropriate loaders for the stylesheet(s). Update the webpack.development.js file with this:

```js
module.exports = () => ({
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
})
```

I believe the instructor skipped over the breaking up of the configs into separate files, so here’s that. Make (at the root of your project) a folder for your configuration files, build-utils is a fine name. Add webpack.development.js and webpack.production.js in that folder and add the following base for each:

```js
module.exports = () => ({});
```

And if you are using straight up CSS, your config should look like this remember that test is a regular expession to find the specific filetype and use is what loader we will use to process the file:

```js
module.exports = () => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
})
```

Initially, the instructor only includes the css-loader and nothing happens. To check out what’s going on (if you want to try this progressively), console.log the import from footer.js and you can then see what is actually being imported. style-loader actually consumes the CSS and applies it for you. note: if you are modifying your config, you will have to restart your dev environment.

## Hot Module Replacement with CSS

If you look at the generated code, there are special annotations wrapped around your CSS (now JavaScript code). Loaders are really useful for helping support a unique Webpack feature called [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/). So… we’re going to try it. In the package.json file, add another flag to the end of your dev setup, --hot. To see Hot Module Replacement in action, restart your dev environment npm run dev, remove the import ".footer.(s)css"; statement from footer.js and place that same line into your entry point, index.js. Then, make some arbitrary change to your stylesheet and you should see the browser instantly reload itself. Currently your package.json file should look something like this:

```json
//...
"scripts": {
    "webpack": "webpack",
    "webpack-dev-server": "webpack-dev-server",
    "debug": "node --inspect --inspect-brk ./node_modules/webpack/bin/webpack.js",
    "prod": "npm run webpack -- --env.mode production",
    "dev": "npm run webpack-dev-server -- --env.mode development --hot",
    "prod:debug": "npm run debug -- --env.mode production",
    "dev:debug": "npm run debug -- --env.mode development"
},
//...
```

Webpack has the ability to ‘patch’ files with changes incrementally and apply them without you ever having to reload the browser. Currently, the setup is relying on JavaScript to insert a style tag to implement the CSS, but that is not an ideal way to apply styling, so let’s update the production config to use the mini-css-extract-plugin. In webpack.production.js, make your file look like this:

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => ({
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
})
```

Next run your production environment, npm run prod, and check out the magic. There should now be a seperate CSS file in your dist folder AND you will see in the index.html file that there is a <link> without stylesheet in the appropriate place. The mini-css-extract-plugin has support for lazy loading CSS, a pretty huge performance win espcially when it comes to CSS. With the css-loader you can [minify your CSS amongst other things](https://webpack.js.org/loaders/css-loader/). Whatever CSS you have, say multiple files for each component, they will be concatenated into one file.

## File Loader & URL Loader

Now we will add File and URL Loaders to the base configuration webpack.config.js. npm install file-loader url-loader These new loaders are an all around fallback to things that may not be mappable to a browser API or a source image/video/audio file, the most basic example being something like a .jpeg. You may want to Base64 inline an image or just optput it to your dist directory. This is what the URL Loader does for you. Grab any image and put it into your src folder. Set up the URL loader in the webpac.config.js file like so:

```js
//...
mode,
module: {
    rules: [
        test: /\.jpe?g/,
        use: ["url-loader"]
    ]
}
output: {
//...
```

## Loading Images with JavaScript

When it comes to Laoders (or pretty much anything) Webpack treats everything like JavaScript, so you can use it like JavaScript. In the index.js file, you can now import your image, something like import image from "./name-of-your-image.jpg" and if you log that to the console, you would see the base64 encoded version of your image file. Go ahead and make a new file in your src folder called image.js and add the following:

```js
const makeImage = url => {
    const image = document.createElement("img");

    image.src = url;
    return image;
};

export default makeImage
```

And back in the entry point index.js import the new script import makeImage from "./image";

Still in index.js add the following:

```js
const imageURL = "./path-to-my-image.jpg";

const image = makeImage(imageURL);

document.body.appendChild(image);
```

If you are running the dev environment, you should see the image appear.

## Limit Filesize Option in URL Loader

Now you should have an image loading, but it is not optimized yet, because it is a giant URI… Let’s fix that. The URL Loader has an option called limit. Update the webpack.config.js url-loader to:

```js
use: [
        {
            loader: "url-loader",
            options: {
                limit: 5000
            }
        }
    ]
```

Notice the modified syntax for the loader, it is now an object. Both the shorthand ["url-loader"] or its object counterpart work, but if you want to be able to pass options to the loader, you need to use its object form. Above, the limit option is set which for the URL loader will cause it to base64 encode any images that are below the specified size or if they are above the specified size, it will just include a hashed image in your output file (stored in memory). To do this, the url-loader is actually calling the file-loader behind the scenes.
