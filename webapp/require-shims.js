/* global require */
(function () {
    'use strict';

    require.config({
        baseUrl: 'js-built',
        paths: {
            'underscore': '../lib/underscore',
            'underscore-string': '../lib/underscore.string',
            'jquery': '../lib/jquery',
            'kendo': '../lib/kendo-ui/js/kendo.web',
            'moment': '../lib/moment',
            'react': '../lib/react-with-addons',
            'q': '../lib/q',
            'plupload': '../lib/plupload/plupload',
            'plupload-flash': '../lib/plupload/plupload.flash',
            'plupload-html5': '../lib/plupload/plupload.html5',
            'jsx': '../lib/jsx',
            'JSXTransformer': '../lib/JSXTransformer',
            'es5-shim': '../lib/es5-shim',
            'text': '../lib/text',
            'wingspan-forms': '../lib/wingspan-forms/wingspan-forms'
        },
        shim: {
            'underscore': { deps: [], exports: '_' },
            'underscore-string': { exports: '_s' },
            'jquery': { deps: [], exports: '$' },
            'kendo': { deps: [], exports: 'kendo' },
            'moment': { deps: [], exports: 'moment' },
            'react': { deps: [], exports: 'React' },
            'plupload': { deps: ['jquery'], exports: 'plupload' },
            'plupload-flash': { deps: ['jquery', 'plupload'] },
            'plupload-html5': { deps: ['jquery', 'plupload'] },
            'JSXTransformer': { exports: 'JSXTransformer' },
            'wingspan-forms': { deps: ['underscore', 'react', 'jquery', 'kendo', 'moment', 'underscore-string'], exports: 'Wingspan' }
        }
    });
})();
