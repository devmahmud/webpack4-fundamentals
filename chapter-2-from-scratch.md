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
