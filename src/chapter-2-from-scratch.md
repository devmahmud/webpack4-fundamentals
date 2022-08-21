# Chapter 2: From Scratch

## Using Webpack for the First Time

Start in branch feature/01-first-script. Looking at the package.json file. Run npm install. Still in the package.json file, add the following:

```json
"scripts" : {
    "webpack": "webpack"
}
```

Then in the CLI type: npm run webpack and you will see the default Webpack CLI output and there isn’t even a config file yet!

## Adding npm Scripts for Environment Builds

In the output, there should be a warning message that no mode has been set. [Click the link to learn more about Webpack mode(s)](https://webpack.js.org/configuration/mode/) Now add dev and prod environments to the scripts section from above:

```json
"scripts" : {
    "webpack": "webpack",
    "dev": "npm run webpack -- --mode development",
    "prod": "npm run webpack -- --mode production"
}
```

Now in the CLI you can type npm run dev or npm run prod to trigger the Webpack build mode as needed. Webpack defaults to production. Development is a faster build, production is an optimized build. Time to debug.

Switch to:

```bash
git checkout feature/02-debug-script
```

## Setting Up Debugging

If you want to debug a node application, you can simply run node and pass in a couple of arguments; i.e.

```json
"debugthis": "node --inspect --inspect-brk ./src/index.js"
```

When you run the above with npm run debugthis, you will see a url in terminal that will link you to a debugger in your browser. If we want to be able to debug Webpack, the debug command in the project is:

```json
"debug": "node --inspect --debug-brk ./node_modules/webpack/bin/webpack.js"
```

Run the debug command and you can debug Webpack!

Get comfortable with adding to your config file, because the Webpack methodology is based on ‘separation of concerns’. Most people have trouble with Webpack because they shove everything into one file, into one build file, so it becomes fragile.

## Coding Your First Module

In src/ add a new file; i.e. nav.js. If you want to share some variables or a function, using the export {a, v, r} syntax will allow you to do so. Otherwise, use export default "nav". In your entry-point; i.e. index.js add an import statement, import nav from "./nav";.

```js
import nav from "./nav";

console.log(nav)
```

Then build the project with the npm run prod command.

## Adding Watch Mode

To avoid having to continuously run a build command, you can just add a ‘watch’ flag to your dev command in the config file; i.e.

```json
"dev": "npm run webpack -- --mode development --watch"
```

Now when you type npm run dev in terminal, Webpack will ‘watch’ for changes. Update nav.js to the following:

```js
export default () => "nav";
```

Then you have to update the index.js file to:

```js
import nav from "./nav";

console.log(nav()) <!-- call the nav function -->
```

You will see in your terminal the changes to the files being ‘watched’ and Webpack will incrementally compile the changes.

## ES Module Syntax

Add a new file footer.js with the following:

```js
export const top = "top";
export const bottom = "bottom";
```

And in the index.js file add the following import statement:

```js
import { top, bottom } from "./footer";
```

Now you have access to the variables from footer.

## CommonJS Export

If you want / need to use a CommonJS module, the format is kind of similar to what we’ve already seen. There are two options, a default or a named export. The syntax is as follows (in a file button.js):

```js
// take a str, the button label and return an element

module.exports = (buttonName) => {
    return `Button: ${buttonName}`;
};
```

In Webpack, you cannot use CommonJS and ES6 in the same file, it would throw an error.
Webpack supports using require, but you can import a CommonJS module as any other.

## CommonJS Named Exports

If you want to do a named export, maybe adding button styles?, make a new file button-styles.js and add the following:

```js
const red = "color: red;";
const blue = "color:  blue;";
const makeColorStyle = color => `color: ${color};`;

exports.red = red;
exports.blue = blue;
exports.makeColorStyle = makeColorStyle;
```

You can name the exports anything you want, but it might make sense to name them same or similar to the variable that they represent. If you would like to destructure your exports, you could (in footer.js) do the following:

export { top, bottom };

It is recommended to put your exoprts at the bottom of your files. You can put your exports anywhere in the file, but it might make sense to choose and stick to a convention. Webpack only bundles whatever imports you are using, so if you only use the function from the button-styles.js file, only that function will be bundled, not the color variables.

## Tree Shaking

If you run npm prod and check your main.js file, you would not see the color variables if you did not import them. This is an example of Webpack’s tree shaking. Webpack will exclude any unused code. At the top level of your code directory, make a new file: webpack.config.jsand add to it the following:

```js
module.exports = {
    mode: "none"
};
```

The above basic configuration will run Webpack without any encapsulation.

## Webpack Bundle Walkthrough

If you’ve been following along, you can check out the dist/main.js file and take a look at how Webpack handles the code we’ve been working with.

In that file, you will find a bunch of comments (to see comments, you may need to make a webpack.config.js file in the root of your project, see below for example file) that will inform you of what each piece of the function(s) is doing.

```js
// simple webpack.config.js file to remove code minification/optimization... because comments 

module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  }
};
```

Take a look through the file and try to follow each line of comments to figure out what Webpack has produced.

## Webpack Core Concepts

---

## Webpack Entry

Now we will begin to actually build out the config file, add loaders, support for other things, and talk about some why(s).

Webpack Entry - It’s not the entry property on the config file, but speaking of the ‘entry’ of the various files required for your project; i.e.

```bash
└── bootstrap.js
    └── app.components.ts
        ├── external.lib.js
        │   ├── external.lib.dep.css
        │   └── external.lib.dep.js
        └── some.components.ts
            └── some.component.sass
```

The first file bootstrap.js is your entry point, Webpack uss this as the starting point. This is defined by using an entry property in the config file.

```js
// webpack.config.js

module.exports = {
  mode: 'development',
  entry: './my-entry-file.main.js',
  //...
  }
};
```

There are a couple of different data types that you can enter into the entry point of your config file, but the simplest of them is just a string which is just a relative path. Webpack will trace through each of your imports and then recurisively look for other dependencies in those files until it creates a graph.

The entry point tells Webpack **what** (files) to load for the browser; it compliments the output property.

## Output & Loaders

The next concept important to understanding Webpack is the output property.

```js
// webpack.config.js

module.exports = {
  //...
  output: {
    path: './my-output-path',
    filename: './my-output-filename.js',
  },
  //...
};
```

The above talks about where and how we are going to name the file. We’ve previously explored what the output looks like.

Fromo a high level: The output property tells Webpack **where** and **how** to distribute bundles (compilations). It works with entry.

The next concept is Loaders and Rules. Loaders and Rules go ‘hand in hand’, they tell Webpack how to modify files before they are added to the dependency graph. Loadrs are also JavaScript modules (functions) that take source files, and return them in their modified state. A Loader / Module set up could look like the following:

```js
module: {
  rules: [
      {
          test: /\.ts$/,
          use: 'ts-loader'
      },
      {
          test: /\.js$/,
          use: 'babel-loader'
      },
      {
          test: /\.css$/,
          use: 'css-loader'
      }
  ]
};
```

In the above codeblock are a few (what Webpack calls) ‘rule sets’. A rule set at its minimum takes two parameters. The first is, as Webpack is creating the dependency graph, to look for one of the test cases. The second parameter ‘use’ tells Webapck what Node module to use when it finds a ‘test’ case. When you are adding different rule sets to your configuration, you are basically defining a pattern to match and what loader to use. You are pattern matching the file extension and telling Webpack how to ingest that file. This happens per file, not in bulk.

Rule sets can have the following parameters:

```js
module: {
  rules: [
      {
          test: regex,
          use: (Array|String|Function),
          include: RegExp[],
          exclude: RegExp[],
          issuer: (RegExp|String)[],
          enforce: "pre"|"post"
      },
  ],
};
```

‘test’ accepts a regular expression that instructs the compiler which files to run the loader against.

‘use’ accepts an array/string/function that returns loader objects.

‘enforce’ can be either “pre” or “post” which tells Webpack to run this rule either before or after all other rules.

‘include’ accepts an array of regular expressions that instructs the compiler which folders/files to include. Will only search paths provided with the include.

‘exclude’ accepts an array of regular expressions that instructs the compiler which folders/files to ignore.

Whether or not you use any or all of the available parameters in the rule set will be based on your specific use case.

## Chaining Loaders

The anatomy of a loader is such that it just takes a source and returns a new source. ‘use’ can accept an array, and execute from right to left. Technically, under the hood they go right left right, but the first pass going from right to left is just to collect metadata. Just before Webpack is going to process any file, it checks to see if any rule sets match against the file.

```js
module: {
  rules: [
      {
          test: /\.less$/,
          use: ['style', 'css', 'less']
      }
  ],
};
```

The above example, when finding a file with the .less extension, would start with the less loader, then pass the result to the css loader, andd finally to the style loader which results in the styles being placed in a script tag at the head of your HTML file. Not a very performant way to handle your styles, but an example of chaining loaders.

[There are tons of loaders available in the NPM registry…](https://www.npmjs.com/search?q=webpack%20loader) responsive image handling, babel, php to JS.

Loaders tell Webpack **how** to interpret and translate files. Transformed on a per-file basis before adding to the dependency graph.

## Webpack Plugins

The last core concept of Webpack is plugins. The anatomy of a Webpack plugin is at its core a JavaScript object that has an apply property in the prototype chain. A plugin allows you to hook into the entire Webpack lifecycle of events. There are a bunch of plugins built out of the box to make things easier. An example of plugin:

```js
function BellOnBundlerErrorPlugin () { }

BellOnBundlerErrorPlugin.prototype.apply = function(compiler) {
  if (typeof(process) !== 'undefined'){

    // Complier events that are emitted and handled
    compiler.plugin('done', function(stats) {
        if (stats.hasErrors()) {
            process.stderr.write('\x07');
        }
    });

    compiler.plugin('failed', function(err) {
        process.stderr.write('\x07');
    });

  }
}

module.exports = BellOnBundlerErrorPlugin
```

The above plugin is instantiable, so we can require() it from the node_modules into the config file. In the webpack.config.js file, you can add this plugin as so:

```js
// require() from node_modules or webpack or local file
var BellOnBundleErrorPlugin = require('bell-on-error');
var webpack = require('webpack');

module.exports = {
    //...
    plugins: [
        new BellOnBundlerErrorPlugin(),

        // And some more of the built-in plugins
        new webpack.optimize.CommonsChunckPlugin('vendors'),
        new webpack.optimize.UglifyJSPlugin()
    ]
    //...
}
```

The above passes a new instance of the plugin(s) into the configuration. Within the () of each plugin you can pass in additional arguments.

80% of Webpack is made up of its own plugin system. Webpack itself is a completely event drive architecture. Having this sort of architecture allows Webpack to pivot very quickly. It allows Webpack to instantly adopt a new feature without breaking anything. Alternatively, Webpack could drop a feature without breaking changes.

Plugins add additional functionality to Compliations(optimized bundled modules). They are more powerful with more access to the [CompilerAPI](https://webpack.js.org/api/compiler-hooks/). They do everything else you’d ever want to do in Webpack. Plugins let you do anything that you can’t do with a loader. Loaders are only applied on a profile basis, but plugins can access the whole bundle.

Plugins are useful when you want to interact with the compiler runtime, the event lifecycle, or even when you want to just apply functionality at the bundle level.

[Previous](./chapter-1-why.md) | [Next](./chapter-3-starting-out-right.md)
