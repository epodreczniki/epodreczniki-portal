//>startExclusion
{% load engines %}
//>endExclusion

define([], function () {
    return {
        //>startExclusion
        readerApiModes: {{ EPO_READER_API_MODES|to_json }}
        //>endExclusion
    };

});