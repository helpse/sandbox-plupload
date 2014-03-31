/** @jsx React.DOM */
define([
    'underscore', 'react', 'q',
    'plupload', 'plupload-flash', 'plupload-html5'
], function (_, React, Q, plupload) {
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
                    <button id="42">Select file...</button>
                    <button onClick={this.onUploadButtonClick}>Upload</button>
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
        },

        onUploadButtonClick: function () {
            this.upload()
                .then(function () {
                    console.log('success');
                })
                .fail(function () {
                    console.log('fail');
                })
                .fin(function () {
                    console.log('fin');
                })
                .done();
        },

        upload: function () {
            var deferred = Q.defer();

            function onFileUploaded (uploader, file, response) {
                deferred.resolve(response);
                uploader.unbind('FileUploaded', onFileUploaded);
                uploader.unbind('UploadProgress', onUploadProgress);
                uploader.unbind('Error', onError);
            }

            function onUploadProgress(uploader, file) {
                deferred.notify(file);
            }

            function onError (uploader, err) {
                deferred.reject(err);
            }

            this.uploader.start();
            return deferred.promise;
        }
    });

    return FileUploader;
});
