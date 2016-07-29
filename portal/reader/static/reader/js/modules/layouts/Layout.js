define(['jquery', 'backbone', 'underscore', 'modules/core/Logger'], function ($, Backbone, _, Logger) {
    return Backbone.View.extend({
        name: 'Layout',

        constructor: function (options) {
            this.components = {};
            this._kernel = options.kernel;
            this._kernel.registerLayout(this);
            Logger.addLogger(this);

            this.layoutConstruct();
        },

        layoutConstruct: function(){
            this._addUserTypeSelectCallback();
        },

        _addUserTypeSelectCallback: function(){
            //resizing if user type select
            var layout = this;
            $('#user-type-student, #user-type-teacher').click(function(){
                setTimeout(function(){
                    layout.trigger('windowResize');
                }, 200);
            });
        },

        addComponent: function (componentName, componentClass) {
            var _this = this;
            this.components[componentName] = (_.isFunction(componentClass) ? new componentClass({layout: this}) : componentClass);
            this._kernel.listenTo(this.components[componentName], 'all', function () {
                _this.trigger.apply(_this, arguments);
            });
        },

        getKernel: function(){
            return this._kernel;
        },

        build: function () {
            _.each(_.values(this.components), function (component) {
                component.load();
            });
        }


    });
});
