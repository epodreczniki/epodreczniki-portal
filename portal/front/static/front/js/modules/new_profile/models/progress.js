define([
    'underscore',
    'backbone',
    'endpoint_tools'
], function (_, Backbone, endpoint_tools) {

    function makeDate(date){
        //Months mapped to Roman numbers
        var monthsMap = new Array();
        monthsMap = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

        return date.getDate() + ' ' + monthsMap[date.getMonth()] + ' ' + date.getFullYear();
    }

    var ProgressModel = Backbone.Model.extend({
        defaults: {},
        getViewAttrs: function(){
            var pattern = $('.progress-list').data('url-pattern');
            var collAttrs = this.get('handbook_id').split(':');
            var link = endpoint_tools.replaceUrlArgs(pattern, {
                module_id: this.get('module_id'),
                collection_id: collAttrs[0],
                version: collAttrs[1],
                variant: collAttrs[2]
            });
            if(this.get('page_id').indexOf('#') > -1) {
                link = link + this.get('page_id');
            }

            var div = document.createElement('div');
            div.innerHTML = this.get('value');
            var elements = div.childNodes;
            var content = '';
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].nodeType == '3') {

                    content += elements[i].nodeValue;
                }
                else if (elements[i].tagName == 'A') {
                    var nodeValue = elements[i].firstChild.nodeValue;
                    content += '<a href="' + nodeValue + '" style="width:100%;margin-left:0;" target="_blank">' + nodeValue + '</a>';
                }
            }
            return {
                date: makeDate(new Date(this.get('modify_time'))),
                content: content,
                read_link: link,
                problem: this.get('problem')

            }
        }
    });

    return ProgressModel;
});