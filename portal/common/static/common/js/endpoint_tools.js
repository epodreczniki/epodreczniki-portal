define(['underscore', 'jquery'], function (_, $) {
    'use strict';
    return {
        replaceUrlArgs: function(url, args){
            for(var a in args){
                url = url.replace('{' + a + '}', args[a]);
            }
            return url;
        },

        namedPatternUrl: function(patternName, args){
            var base = $('base');
            var pattern = base.data(patternName);
            if(pattern){
                return this.replaceUrlArgs(pattern, args);
            }
            return '';
        }
    }
});