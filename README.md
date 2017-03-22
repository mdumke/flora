# Flora not Fauna

This is a basic development setup involving NodeJs, Express, Angular, and Webpack. In the following, I will go over some points that might be helpful to know if you want to build out the Angular web-application using this setup. As always, the text may be a bit verbose, but most of it is just my harmless blah-blah.


## 1. Webpack

Webpack's main purpose is to **take a number of small files and bundle them together into a big one** that browsers can handle. It has a lot of other functionality, and we'll see some of it here, but this is the basic one: start from a given file ('entry-point') and see if this file `requires` or `imports` any other files, and if so, include those in the final bundle (and if those files require or import yet other files, include those as well, and so on).

Our project's entry-point is `./src/app/index.js` (I specified this in `webpack.config.js`). If you take a look at this file (go ahead, open up `./src/app/index.js`...), you will see that it does not really do anything itself, it just imports other files. Interesting, right? And what's even more interesting, it even imports a CSS-file. A JavaScript file that imports a CSS-file? Seriously, dawg?

Before we move on to this weird CSS-import and all the rest, let's get practical for a moment. You sure want to see that the app is working before you invest more time understanding how. That's easy. On the command line, in a folder of your choice, run:

```bash
# clone the repository
git clone https://github.com/mdumke/flora

# change into the directory that was created
cd flora

# download the relevant node-modules (takes a while)
npm install

# start the development server (takes a moment)
npm run dev-server
```

If all goes well, you now have a webpack development-server running (see that? Webpack can also run a server...). Direct your browser to `localhost:3000` and you should see something with flowers.

Now take a moment, and while the server is still running, open `./src/index.html` in a code editor, change something, and save the file. If you now go back to the browser, the change should already be there, without reloading anything. How cool is that!


## 2. ES6

I think now is a good time to take a look at `webpack.config.js`. If you haven't already, please open this file and take a look around. This is the file that tells Webpack what to do. In line 12, you will recognize `index.js` as the entry point for our bundle. A bit further down, you see some `rules` defined, and the first one concerns `.js`-files and specifies `babel-loader` as a loader. What's with that?

Webpack can not only bundle files together, but also do some pre-processing. For example, it can load all the JavaScript-files and run them through the [babel-transpiler](https://babeljs.io/) that will transform brand new [ES6 JavaScript](http://babeljs.io/learn-es2015/) to regular old ES5 JavaScript that all browsers can understand. This means you can write ES6 code today and don't have to worry if your browser supports this or not because the code that the browser sees will only be ES5!

But don't take my word for it. Try it out yourself. Create a new file in `./src/app/scripts` and call it `es6-test.js`. Now put this simple line of ES6-code in there:

```js
const someNumbers = [1, 2, 3]
```

And finally, import the new file in `index.js` via `import './scripts/es6-test'` (you don't need the .js-ending, though it won't hurt you).

Now that's all fine, but how do we know this code is transpiled to ES5? Hm. I say let's get to know Webpack a little better and see what actually happens to our code. I told you that Webpack is processing and bundling files, but where are those bundles? They don't seem to show up anywhere. That's because the Webpack-server keeps them in working memory, which is cool because it speeds up development, but in the end we want to have the final files in our hands.

Let's do the following: stop the server if it's still running (`Ctrl-c` or `Ctrl-d`), then type

```bash
npm run build
```

This will process and bundle our files, create a directory called 'dist', and put them there. Open the `dist/bundle`-file with the weird hash. Inside the file, search for `someNumbers`. That should get you to a funny-looking place inside a string inside a call to `eval` and you don't have to understand what's going on, but note that there is the code you wrote eariler, only now it does not say `const` anymore, which is new to ES6, but it says

```js
var someNumbers = [1, 2, 3]
```

Webpack has transpiled your JavaScript and has included your file with the rest of the bundle.


## 3. PostCSS

Remember this weird statement that tried to import `main.css` into our `index.js`-file? We can now better understand what is going on here. First of all, we know we have to import the CSS-file somewhere if we want Webpack to see it. And we want Webpack to see it because then it can preprocess it!

If you take another look at `webpack.config.js` you can see that we're defining another rule in lines 34 to 44 where it says `style-loader`, `css-loader`, and `postcss-loader`. In these lines we are telling Webpack what to do with CSS-files. In particular, we would like Webpack to preprocess them using the `postcss-loader` and `css-loader`. This means that Webpack will take the css-file, run it through the postcss-loader, run it through the css-loader, and then output it (the final result will end up in `dist/styles.someHash.css`.

So what is postcss in the first place? If you're not familiar with it, Postcss is the new hot CSS pre-processor (or post-processor...) that is versatile and modular and more powerful than simple less, sass, or scss compilation. Take a look at their [website](http://postcss.org/).

I have included some examples of what postcss can do in the project. If you open up `./src/app/styles/main.css` you can see that I'm nesting css rules inside each other. That's not legal css. I'm also using the new `flex-direction`-rule without any vendor-prefixes. That's very bad practice. So am I stupid? Or lazy? But wait, take a quick look at the file that Webpack created for us in `dist/styles.someHash.css`. There's no nesting anymore! And someone has added all the annoying prefixes! How lovely!

So is that all magic? Well, yes, obviously. But we can begin to understand how all this is happening if we open up `postcss.config.js`. In here, I'm basically telling Webpack to include two postcss-modules, `autoprefixer` and `postcss-nested` that do exactly what I was demonstrating above.

That's the spirit of PostCSS: write a plain css-file, but if you want to use anything fancy, you can do so if you simply install a module and process the css. And there are *tons* of modules - for creating variables, checking for correct formatting, building grids, working with fonts and a lot of other things that can make your life a lot easier. Check out [postcss.parts](http://postcss.parts/) for a list of available packages. To use one, try the following steps.

- Install the module in the project root-folder:
```bash
npm install someModuleILike --save-dev
```
- Include it in `postcss.config.js`
- Stop and re-start the dev-server.

Explore and enjoy!



## 4. StandardJS

One last point, and very quickly. I have included [standardjs](https://standardjs.com/) in this project. This is a JavaScript-linter that has very reasonable defaults and is closed for discussion, meaning that it will effectively dictate the style of your JavaScript, but it will be a good JavaScript you will write... Standard has become quite popular recently and it will definitely help you write much more consistent code.

Since we don't have any tests for this projects, I'm using the npm test-script for running standard. In other words, after you write some JavaScript go and run

```bash
npm test
```

This will check all your JavaScript code and check for style-errors. In fact, if you run it now you should get an error message about a variable `someNumbers` that was defined but is never used. That's really helpful! StandardJS does some static checking for you! So even if its a bit annoying from time to time because it will be complaining a **lot** until you get used to writing consistent code, remember: Standard is your friend. It can help you catch bugs and make you a better coder.

So to finish up, delete this test-file that we created earlier and remove the import statement from `index.js`. Now everything should be back to normal, you can type `npm run dev-server` and start developing.

Oh, and in case you're wondering: `npm start` will now start up a node-server that will listen on port 8080 and that will be used in production. It will serve the `dist`-directory. But don't be bothered by this now. Stick to the dev-server and its fast and automatic browser-refresh.
