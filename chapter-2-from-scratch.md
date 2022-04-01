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