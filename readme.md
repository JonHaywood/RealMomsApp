# Real Moms App

This is the source code for the application used by the Real Moms ministry by Crossway Chapel. It manages nursery checkins and balances.

## Components
The app is built using a handful of different web components. The major ones are listed below.

### Back-End Application Components
* [Node.js](https://nodejs.org/) - the source is written in javascript and executed using Node.
* [Express](http://expressjs.com/) - this is the web server/framework part of the web stack.
* [Vash](https://github.com/kirbysayshi/vash) - this is a javascript templating engine with a [Razor-like syntax](http://www.w3schools.com/aspnet/razor_syntax.asp). It is used on the server and in the browser.
* [Underscore](underscorejs.org) - this is a javascript utility library used on the server and in the browser.
* [Mongo DB](https://www.mongodb.org/) - this is a document database used for housing the application's data.
* [Mongoose](http://mongoosejs.com/) - this is an object modeling framework for Node.js so you can easily interact with Mongo DB is javascript.

### Front-End Browser Components
* [Require.js](http://requirejs.org/) - A javascript file and module loader optimized for the browser.
* [Bootstrap](http://getbootstrap.com/) - An HTML, CSS and JS framework that provides reusable components for building web applications.
* [Bootstrap-Table](https://github.com/wenzhixin/bootstrap-table) - Bootstrap plugin that extends the Bootstrap table with grid like functionality.
* [Sweet Alert](http://t4t5.github.io/sweetalert/) - replacement for javascript's "alert".
* [Moment.js](http://momentjs.com/) - library for manipulating dates in javascript.

### Build Components
* [Gulp](http://gulpjs.com/) - build system for Node.js that keeps development and deployment simple.
* [Bower](http://bower.io/) - a package manager for front-end browser components.

## How to Run
Make sure that Node.js and Mongo DB are installed. Use the default settings for Mongo DB and you should be fine. The code will automatically create the database if it doesn't already exist.

1. First, [clone the git repository locally](https://help.github.com/articles/fetching-a-remote/).
2. Using the command line, navigate to the `source` directory.
3. Run `npm install -l` from the command line to install all needed Node.js packages. (4/28/2019) EDIT: if this fails, delete node_modules folder and the packages-lock.json file. Then run `npm install --unsafe-perm=true`. This is needed because of the age of some of the technology used.
4. Run `gulp`. This will copy all the files to where they need to go and start the web server.
5. Navigate to [http://localhost:8000/](http://localhost:8000/) in a browser.

## How to Deploy
See the [Deployment](docs/deploy.md) documentation on how to push source up to Heroku.