/*
 * This module is the starting point for the application. All necessary dependencies for the
 * initial running of the app are specified here.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'router'
], function ($, _, Backbone, Router) {

    // This will be our app object for the system. We're pulling in Backbone events
    // functionality so that we can have an application-level event aggregator.
    var App = _.extend({}, Backbone.Events);

    // This method is called via main.js once all dependencies are loaded. This
    // starts the app.
    App.initialize = function () {
        window.App = this;

        // save the root DOM element so it can be easily accessible in other parts of the application
        App.DomRoot = $('#app');

        // initialize the Router (which handles navigation)
        Router.initialize();
    };

    return App;
});