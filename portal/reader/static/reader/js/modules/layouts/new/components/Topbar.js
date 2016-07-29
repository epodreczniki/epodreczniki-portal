define([
    'jquery',
    '../../Component',
    'text!../templates/topbar.html'
], function(
    $, 
    Component,
    Template
) {

    return Component.extend({

        name: 'Topbar',

        template: _.template(Template), 

        postInitialize: function(options) {
            this.setElement($('#topbar'));
            this.render();
        },

        render: function() {
            this.$el.html(this.template());

            this.setModuleTitle('Testowy');
        },

        setModuleTitle: function(title) {
            this.$('.title').html(title);
        }

    });

});
