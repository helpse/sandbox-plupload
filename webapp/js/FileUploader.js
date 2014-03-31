/** @jsx React.DOM */
define([
    'underscore', 'react',
    'plupload', 'plupload-flash', 'plupload-html5'
], function (_, React, plupload) {
    'use strict';


    var DEFAULT_SETTINGS = {
        runtimes: 'html5,flash',
        flash_swf_url: 'lib/plupload/plupload.flash.swf',
        multipart: true,
        multi_selection: false,
        file_data_name: 'file',
        headers: { 'Accept': 'application/json' }
    };


    var FileUploader = React.createClass({

        getDefaultProps: function () {
            return {
                url: undefined
            };
        },

        render: function () {
            return (
                <span>
                    <button id="42">Upload file...</button>
                </span>
            );
        },

        componentDidMount: function () {

            var settings = _.defaults({
                browse_button: '42',
                url: this.props.url
            }, DEFAULT_SETTINGS);

            this.uploader = new plupload.Uploader(settings);
            this.uploader.init();
        }
    });

    return FileUploader;
});
