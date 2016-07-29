define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth'
], function (
    $, 
    _, 
    Backbone, 
    EpoAuth
){

    return Backbone.View.extend({

        initialize: function(opts) {
            this.controller = opts.cntrlr;
            this.postInitialize(opts);
        },

        postInitialize: function(opts) {},

        body: '',
        viewButton: '',

        render: function(params) {
            $('.profile-main-tab').removeClass('active')
            $(this.viewButton).addClass("active")
            this.$el.addClass('visible')
            $(this.body).empty()

            this.getData(this.showContent, params)
            console.log("FHDGJKJHGFDGJKLHFGDHJGFDHKJGFCHJK");
        },

        getData: function() {
        },

        showContent: function() {}

    })

})
