define(['_jquery',
        'underscore',
        'backbone',
        'text!../templates/controls.html',
        '../../core/Registry'], 

        function($, _, backbone, controls_template, Registry) {
            
        'use strict';
            
            return Backbone.View.extend({
            
            className: 'exercise-controls',
            
            template: _.template(controls_template),
            
            initialize: function(options) {
                this.options = options || {};
                this.eventBus = this.options.eventBus;
                this.viewOpts = this.options.viewOpts;
                this.readerApi = this.options.readerApi;
                
                this.eventBus.on('getFeedback', this.getFeedback, this);
                this.eventBus.on('cleanupFeedback', this.cleanup, this);
                this.eventBus.on('clearButton', this.clearButton, this);
                this.eventBus.on('hideCheckBtn', this.hideCheckBtn, this);
                this.eventBus.on('setMessage', this.setFeedbackMessage, this);
                this.eventBus.on('showSaveState', this.saveStateShow, this);

                this.create();
            },
            
            events: {
                'click .check': 'check',
                'click .recreate': 'recreate',
                'click .hint': 'showHint',
                'click .clear': 'clear',
                'click .save': 'save'
            },
            
            create: function() {
                var that = this;
                if (this.viewOpts.multiSets) {
                }
            },

            check: function(e) {
                e.preventDefault();
                this.eventBus.trigger('checkExercise', e);
            },
            
            recreate: function() {
                this.cleanup();
                this.eventBus.trigger('recreate');
            },

            clear: function() {
                this.cleanup();
                this.eventBus.trigger('clearExample');
                var placeholder = this.$el.closest('.womi-container');

                if(Registry.get('layout')){
                    Registry.get('layout').trigger('refreshContent', placeholder, {typeset: true});
                }
            },

            save: function(e){
                e.preventDefault();
                this.eventBus.trigger('saveState', e);
            },

            saveStateShow: function() {
                this.$('.save').show();
            },

            clearButton: function() {
                this.$('.clear').fadeIn('fast');
            },
            
            hideCheckBtn: function() {
                this.$('.check').fadeOut('fast');
            },

            getFeedback: function(result, hint) {
                var feedback;
                
                if (!result) {
                    feedback = this.viewOpts.wrongFeedback;
                    this.setHint(hint);
                } else {
                    feedback = this.viewOpts.correctFeedback;
                }
                
                this.$('.exercise-feedback').html(feedback);
            },

            setFeedbackMessage: function(message){
                this.$('.exercise-feedback').html(message);
            },
            
            setHint: function(hint) {
                this.hint = hint || this.viewOpts.globalHint;
                if (!this.hint) return;
                this.$('.hint').fadeIn('fast');
            },
            
            showHint: function() {
                this.$('.exercise-hint').html(this.hint);
            },
            
            cleanup: function() {
                this.$('.exercise-hint, .exercise-feedback').empty();
                this.$('.hint').hide();
            },
            
            render: function() {
                this.$el.append( this.template() );
                if (this.viewOpts.multiSets) {
                    this.$('.recreate').show();
                }
                return this;
            }
            
            });
        }
        
);
