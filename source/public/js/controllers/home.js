define([
    'jquery',
    'underscore',
    'ui'
], function ($, _, ui) {

    var run = function (tpl) {
    	ui.renderTemplate(tpl);
    };

    return {
        run: run
    };
});