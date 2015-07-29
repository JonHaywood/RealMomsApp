/*
 * This module handles common UI functionality.
 */
define([
  'jquery',
  'vash',
  'swal'
], function ($, vash, swal) {

    var renderTemplate = function (template, model) {
        var tpl = vash.compile(template);
        var compiledTpl = tpl(model || {});
        App.DomRoot.empty().off('*'); // remove anything in the element and all event handlers
        App.DomRoot.append(compiledTpl); // add the newly compiled template
    };

    // this function shows or hides the loading screen
    var loading = function(show) {
        if (show)
            $('#loading').fadeIn();
        else
            $('#loading').fadeOut();
    };

    // this function presents a message to a user
    var alert = function(message) {
        swal(message);
    };

    // this function reports an ajax error
    var reportError = function (message, jqXhr, textStatus, errorThrown) {
        var responseMessage = (jqXhr.responseJSON && jqXhr.responseJSON.Message) ? jqXhr.responseJSON.Message : 'An unknown error has occurred.';

        swal({
            title: 'An Error Occurred',
            text: message + ' Server Error Message: "' + responseMessage + '"',
            type: 'error'
        });
        console.log(message, {
            textStatus: textStatus,
            errorThrown: errorThrown,
            message: responseMessage
        });
    };

    return {
        renderTemplate:  renderTemplate,
        loading: loading,
        alert: alert,
        reportError: reportError
    };
});