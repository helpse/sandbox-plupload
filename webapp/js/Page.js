/** @jsx React.DOM */
define([
    'react', 'wingspan-forms', 'jsx!FileUploader'
], function (React, Forms, FileUploader) {
    'use strict';


    var App = React.createClass({
        render: function () {
            return (
                <div>
                    <FileUploader url="//" />
                </div>
            );
        }
    });


    function entrypoint() {
        React.renderComponent(<App />, document.getElementById('root'));
    }

    return {
        entrypoint: entrypoint
    };
});
