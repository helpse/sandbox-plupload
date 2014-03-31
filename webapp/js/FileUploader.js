/** @jsx React.DOM */
define([
    'underscore', 'react', 'q',
    'plupload', 'plupload-flash', 'plupload-html5'
], function (_, React, Q, plupload) {
    'use strict';


    var DEFAULT_SETTINGS = {
        runtimes: 'flash,html5',
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
                    <pre>{JSON.stringify(_.pluck(this.state.fileQueue, 'name'), undefined, 2)}</pre>
                </div>
            );
        },

        componentDidMount: function () {

            this.settings = _.defaults({
                browse_button: '42'
            }, DEFAULT_SETTINGS);

            this.uploader = new plupload.Uploader(this.settings);
            this.uploader.bind('FilesAdded', this.onFilesAdded);
            this.uploader.bind('FilesRemoved', this.onFilesRemoved);
            this.uploader.init();
        },

        componentWillUnmount: function () {
            this.uploader.unbind('FilesAdded', this.onFilesAdded);
            this.uploader.unbind('FilesRemoved', this.onFilesRemoved);
            this.uploader.destroy();
        },

        onFilesAdded: function (uploader, files) {
            this.setState({
                fileQueue: _.union(this.state.fileQueue, [files])
            });
        },

        onFilesRemoved: function (uploader, files) {
            this.setState({
                fileQueue: _.difference(this.state.fileQueue, [files])
            });
        },

        onUploadButtonClick: function () {
            var settings = _.defaults({ url: this.props.url }, this.settings);
            var doUpload = _.partial(this.uploadOneFile, settings);

            asyncEachSerial(doUpload, this.uploader.files) // use the uploader's file reference directly, react state only mirrors it
                .fin(function (results) {
                    console.log('fin ', results);
                })
                .done();
        },

        uploadOneFile: function (settings, fileRef) {
            var uploader = this.uploader; //new plupload.Uploader(settings);

            // Abuse private sate -
            // Add the native file object directly into the plupload list of file objects.
            uploader.files = [fileRef];

            var deferred = Q.defer();

            function onFileUploaded (uploader, file, response) {
                uploader.unbind('FileUploaded', onFileUploaded);
                uploader.unbind('UploadProgress', onUploadProgress);
                uploader.unbind('Error', onError);
                deferred.resolve(response);
                uploader.destroy();
            }

            function onUploadProgress(uploader, file) {
                deferred.notify(file);
            }

            function onError (uploader, err) {
                deferred.reject(err);
            }

            uploader.bind('FileUploaded', onFileUploaded);
            uploader.bind('UploadProgress', onUploadProgress);
            uploader.bind('Error', onError);
            //uploader.init();
            setTimeout(_.bind(uploader.start, uploader), 100);
            return deferred.promise;
        }
    });

    /**
     * Iterates over a list, applying a function to each element.
     * The function must be an asynchronous effect. The results are accumulated and returned.
     */
    function asyncEachSerial (fAsyncEffect, list) {

        var acc = [];

        var iterate = function (next, rest) {
            var promise = fAsyncEffect(next);
            return promise.fin(function (response) {
                acc.push(response);
                return ((rest.length === 0) ? acc : iterate(_.head(rest), _.tail(rest)));
            });
        };

        return iterate(_.head(list), _.tail(list));
    }




    return FileUploader;
});
