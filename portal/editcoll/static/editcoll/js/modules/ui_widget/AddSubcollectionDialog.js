define(['jquery',
    'underscore',
    'backbone',
    './Dialog',
    'modules/app/util/TreeNodesHelper'
], function ($, _, Backbone, Dialog, TreeNodesHelper) {
    return Dialog.extend({

        title: "Dodaj subkolekcję",

        initialize: function (options) {
            this.model = options.model;
            this.saveCallback = options.saveCallback;
            this.selectedNode = options.selectedNode;
            this.modal = $("#editcollSubCollModal");
            this._setTitle(this.title);
            this._createModalBodyElements();
            this._initButtons();
            this.render();
        },

        _setTitle: function (title) {
            this.modal.find("#addSubcollectionModalTitle").html(title);
        },

        _createModalBodyElements: function () {
            var modalBody = this.modal.find("#addSubcollectionModalBody");
            if (modalBody.children().length == 0) {
                var subcollTitleHtml = "<form class='form-horizontal' role='form'>"
                    + "<div class='form-group'>"
                    + "<label for='editcoll-newSubcollTitle-input' class='col-sm-2 control-label'>Tytuł nowej podkolekcji</label>"
                    + "<div class='col-sm-6'>"
                    + "<input type=text' class='form-control' id='editcoll-newSubcollTitle-input' placeholder='Tytuł'>"
                    + "</div></form>";
                var subcollTitleDiv = $(subcollTitleHtml);
                modalBody.append(subcollTitleDiv);
            }
        },

        _initButtons: function () {
            var _this = this;
            $('#saveSubcollChangesButton').on("click", function () {

                var selectedNode = _this.selectedNode;
                if (selectedNode !== undefined && selectedNode != null && selectedNode != false) {
                    var itemData = selectedNode.original;
                    var parentTitle = itemData._title;
                    var parentId = itemData.id;
                    var newTitle = $("#editcoll-newSubcollTitle-input").val();
                    if (newTitle != "") {
                        _this.saveCallback(parentTitle, parentId, newTitle);
                        _this.hide();
                    } else {
                        BootstrapDialog.alert("Podaj tytuł nowej podkolekcji");
                    }
                } else {
                    //alert("Wybierz kolekcję");
                }
            });
            $("#editcoll-newSubcollTitle-input").keypress(function(event){
                var key = (event.keyCode ? event.keyCode : event.which);
                if (key == 13) {
                    $('#saveSubcollChangesButton').trigger('click');
                }
            });

        },

        updateTree: function (collection, selectedNode) {
            this.model = collection;
            this.selectedNode = selectedNode;
        },

        show: function () {
            this.modal.modal('show');
        },

        hide: function () {
            this.modal.modal('hide');
        },

        render: function () {
            var _this = this;
            _this.modal.modal('hide');
        }

    })
});
