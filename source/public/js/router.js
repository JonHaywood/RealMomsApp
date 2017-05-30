/*
 * This module is responsible for 'routing' in the application.
 * When a user clicks on a link this router is invoked. If the URL
 * matches a provided pattern, that route's action will be called. If
 * not then 'defaultAction' will be called. Backbone.Router provides
 * this functionality and enables browser history to still work as
 * expected.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'text'
], function ($, _, Backbone) {

    // define our Router class
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define URL routes
            'checkin': 'showCheckin',
            'admin': 'showAdmin',
            'reports': 'showReports',

            // Default URL route
            '*actions': 'defaultAction'
        },

        showCheckin: function() {
            requirejs(['controllers/checkin', 'text!../templates/checkin.vash'], function(controller, tpl) {
                controller.run(tpl);
            });
        },

        showAdmin: function () {
            requirejs(['controllers/admin', 'text!../templates/admin.vash'], function(controller, tpl) {
                controller.run(tpl);
            });
        },

        showReports: function () {
            requirejs(['controllers/reports', 'text!../templates/reports.vash'], function(controller, tpl) {
                controller.run(tpl);
            });
        },

        defaultAction: function () {
            requirejs(['controllers/home', 'text!../templates/home.vash'], function(controller, tpl) {
                controller.run(tpl);
            });
        }
    });

    var initialize = function () {
        // create an instance of the router which will tell Backbone that
        // this is the router we will use
        var appRouter = new AppRouter;

        // spin up the Backbone routing engine and start routing
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});