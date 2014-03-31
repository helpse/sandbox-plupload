/** @jsx React.DOM */
define([
    'underscore', 'react', 'q',
    'plupload', 'plupload-flash', 'plupload-html5'
], function (_, React, Q, plupload) {
    'use strict';


    var DEFAULT_SETTINGS = {
        runtimes: 'flash',
        flash_swf_url: 'lib/plupload/plupload.flash.swf',
        multipart: true,
        multi_selection: true,
        file_data_name: 'file',
        headers: { 'Accept': 'application/json' }
    };


    var FileUploader = React.createClass({

        getDefaultProps: function () {
            return {
                url: undefined
            };
        },

        getInitialState: function () {
            return {
                fileQueue: []
            };
        },

        render: function () {
            return (
                <div>
                    <button id="42">Select file...</button>
                    <button onClick={this.onUploadButtonClick}>Upload</button>
                    <pre>{JSON.stringify(this.state.fileQueue, undefined, 2)}</pre>
                </div>
            );
        },

        componentDidMount: function () {

            var settings = _.defaults({
                browse_button: '42',
                url: this.props.url
            }, DEFAULT_SETTINGS);

            this.uploader = new plupload.Uploader(settings);
            this.uploader.bind('FilesAdded', this.onFilesAdded);
            this.uploader.init();
        },

        componentWillUnmount: function () {
            this.uploader.unbind('FilesAdded', this.onFilesAdded);
        },

        onFilesAdded: function (uploader, files) {
            this.setState({
                fileQueue: _.union(this.state.fileQueue, _.pluck(files, 'name'))
            });
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
