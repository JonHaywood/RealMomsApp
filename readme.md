# Real Moms App

This is the source code for the application used by the Real Moms ministry by Crossway Chapel. It manages nursery checkins and balances.

##Components
The app is built using a handful of different web components. The major ones are listed below.

###Back-End Application Components
* [Node.js](https://nodejs.org/) - the source is written in javascript and executed using Node.
* [Express](http://expressjs.com/) - this is the web server/framework part of the web stack.
* [Vash](https://github.com/kirbysayshi/vash) - this is a javascript templating engine with a [Razor-like syntax](http://www.w3schools.com/aspnet/razor_syntax.asp). It is used on the server and in the browser.
* [Underscore](underscorejs.org) - this is a javascript utility library used on the server and in the browser.
* [Mongo DB](https://www.mongodb.org/) - this is a document database used for housing the application's data.
* [Mongoose](http://mongoosejs.com/) - this is an object modeling framework for Node.js so you can easily interact with Mongo DB is javascript.

###Front-End Browser Components
* [Require.js](http://requirejs.org/) - A javascript file and module loader optimized for the browser.
* [Bootstrap](http://getbootstrap.com/) - An HTML, CSS and JS framework that provides reusable components for building web applications.
* [Bootstrap-Table](https://github.com/wenzhixin/bootstrap-table) - Bootstrap plugin that extends the Bootstrap table with grid like functionality.
* [Sweet Alert](http://t4t5.github.io/sweetalert/) - replacement for javascript's "alert".
* [Moment.js](http://momentjs.com/) - library for manipulating dates in javascript.

###Build Components
* [Gulp](http://gulpjs.com/) - build system for Node.js that keeps development and deployment simple.
* [Bower](http://bower.io/) - a package manager for front-end browser components.

##How to Run
First, clone the repository locally. 