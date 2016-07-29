define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    return Backbone.View.extend({

        title: '',

        initialize: function (params) {
            this.model = options.model;
            this.saveCallback = options.saveCallback;
            this.selectedNode = null;
            this._setTitle(this.title);
            this._createModalBodyElements();
            this._initTree();
            this._initButtons();
            this.render();
        },

        _setTitle: function () {
        },

        _createModalBodyElements: function () {
        },

        _initTree: function () {
        },

        updateTree: function () {
        },

        _initButtons: function () {
        },

        show: function () {
            this.modal.modal('show');
        },

        hide: function () {
        },

        render: function () {
        }
    })
});
