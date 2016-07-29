define(['_jquery',
        'underscore',
        'backbone',
        '../../core/Registry'],

        function($, _, backbone, Registry) {
        
            'user strict';

            return backbone.View.extend({
            
                initialize: function(options) {
                    
                    this.options = options || {};

                    this.eventBus = this.options.eventBus;

                    this.readerApi = this.options.readerApi;

                    this.eventBus.on('checkExercise', this.checkExercise, this);

                    this.eventBus.on('clearExample', this.clearExample, this);

                    this.eventBus.on('allImagesLoaded', this.afterRender, this);

                    this.eventBus.on('saveState', this.saveState, this);

                    this.render = _.wrap(this.render, function(render) {
                        this.beforeRender();
                        render.call(this);
                        this.afterRender();
                        return this;
                    }.bind(this));

                    if(Registry.get('layout')){
                        Registry.get('layout').on('windowResize', this.onResize, this);
                    }

                    this.postInitialize(options);
                },

                beforeRender: function() {},

                render: function() {},

                afterRender: function() {},

                onResize: function() {},

                postInitialize: function(options) {},

                checkExercise: function() {}, 

                clearExample: function() {},

                saveState: function() {}

            });
        
        }
);
