define(['backbone', 'underscore'], function (Backbone, _) {
    return Backbone.Model.extend({
        defaults: {
            blockId: 0,
            paramTitle: '',
            paramStartOn: 1,
            paramThumbnails: 'all',
            paramTitles: 'all',
            paramFormatContents: 'all',
            miniaturesOnly: false,
            viewWidth: 0,
            viewHeight: 0,
            type: "A"
        },

        paramOpts: ['all', 'hide', 'hide-normal', 'hide-fullscreen'],
        
        miniaturesOnlyOpts: [true, false],

        getAllParams: function(){
            return [
                {name: 'paramTitle', value: this.get('paramTitle'), input: true},
                {name: 'paramStartOn', value: this.get('paramStartOn'), input: true},
                {name: 'paramThumbnails', value: this.get('paramThumbnails'), select: this.paramOpts},
                {name: 'paramTitles', value: this.get('paramTitles'), select: this.paramOpts},
                {name: 'paramFormatContents', value: this.get('paramFormatContents'), select: this.paramOpts},
                {name: 'miniaturesOnly', value: this.get('miniaturesOnly'), select: this.miniaturesOnlyOpts},
                {name: 'viewWidth', value: this.get('viewWidth'), input: true},
                {name: 'viewHeight', value: this.get('viewHeight'), input: true}
            ]
        },
        
        getParamsA: function(){
            return [
                {name: 'paramTitle', value: this.get('paramTitle'), input: true},
                {name: 'paramStartOn', value: this.get('paramStartOn'), input: true},
                {name: 'paramThumbnails', value: this.get('paramThumbnails'), select: this.paramOpts},
                {name: 'paramTitles', value: this.get('paramTitles'), select: this.paramOpts},
                {name: 'paramFormatContents', value: this.get('paramFormatContents'), select: this.paramOpts}
            ]
        },
        
        getParamsB: function(){
            return [
                {name: 'paramTitle', value: this.get('paramTitle'), input: true},
                {name: 'viewWidth', value: this.get('viewWidth'), input: true},
                {name: 'viewHeight', value: this.get('viewHeight'), input: true}
            ]
        },
        
        getParamsC: function(){
            return [
                {name: 'paramTitle', value: this.get('paramTitle'), input: true}
            ]
        }
    });
});