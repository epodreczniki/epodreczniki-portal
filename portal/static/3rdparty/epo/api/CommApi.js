define('reader.communication.api', ['jquery', 'underscore'], function ($, _) {

    var comm = function () {
    };
    _.extend(comm.prototype, {
        listen: function (eventName, callback) {
            $(window).on('message', function (event) {
                if (event.originalEvent.data.eventName == eventName) {
                    callback(event.originalEvent.data.data);
                }
            });
            window.parent.postMessage({object: 'commapi', method: 'listen', args: [eventName]}, '*');
        },
        trigger: function (eventName, value) {
            window.parent.postMessage({object: 'commapi', method: 'trigger', args: [eventName, value]}, '*');
        }
    });
    return new comm();
});