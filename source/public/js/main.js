// This serves as the bootstrapper for the application. The only
// thing it is responsible for is bootstrapping everything so that the
// application logic (in app.js) can run successfully.

var appVersion = '0.1';

// Require.js configure shortcut aliases
require.config({
    paths: {
    	'text': '../dist/requirejs-text/text',
        'jquery': '../dist/jquery/dist/jquery.min',
        'bootstrap': '../dist/bootstrap/dist/js/bootstrap.min',
        'underscore': '../dist/underscore/underscore-min',
        'backbone': '../dist/backbone/backbone-min',
        'vash': '../dist/vash/build/vash',
        'swal': '../dist/sweetalert/dist/sweetalert.min',
        'validation': '../dist/jquery-validation/dist/jquery.validate.min',
        'bootstrap-table': '../dist/bootstrap-table/dist/bootstrap-table.min',
        'bootstrap-table-editable': '../dist/bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min',
        'bootstrap-editable': '../dist/x-editable/dist/bootstrap3-editable/js/bootstrap-editable',
        'moment': '../dist/moment/min/moment.min'
    },
    // shims let us load non-AMD formatted js files in require js
    // and define what those files depend on
    shim: {
        'bootstrap': ['jquery'],
        'validation': ['jquery'],
        'bootstrap-table': ['jquery', 'bootstrap'],
        'bootstrap-editable': ['jquery', 'bootstrap'],
        'bootstrap-table-editable': ['bootstrap-table', 'bootstrap-editable']
    }
});

// Load our app module and pass it to our definition function
require([
  'app'
], function (App) {
    // The "app" dependency is passed in as "App". Run the initialize function
    // once all its dependencies are ready
    App.initialize();
});