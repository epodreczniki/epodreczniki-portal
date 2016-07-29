define(['jquery',
    'underscore',
    'backbone',
    './Dialog',
    'base_lister',
    'modules/app/util/TreeNodesHelper',
    'lock_driver/LockDriver',
    'editor_driver/EditorDriver',
    'text!modules/templates/AddModuleTemplate.html',
    'text!modules/templates/ListerTemplate.html',
    'CascadeForms'
], function ($, _, Backbone, Dialog, BaseLister, TreeNodesHelper, LockDriver, EditorDriver, AddModuleTemplate, ListerTemplate, CascadeForms) {
    return Dialog.extend({

        title: "Dodaj moduł",

        addModuleTemplate: _.template(AddModuleTemplate),
        listerTemplate: _.template(ListerTemplate),

        initialize: function (options) {
            this.model = options.model;
            this.saveCallback = options.saveCallback;
            this.selectedNode = options.selectedNode;
            this.modal = $("#editcollModuleModal");
            this._setTitle(this.title);
            this._createModalBodyElements();
            this._initButtons();
            this.render();
        },

        _setTitle: function (title) {
            this.modal.find("#addModuleModalTitle").html(title);
        },

        _createModalBodyElements: function () {
            var modalBody = this.modal.find("#addModuleModalBody");
            if (modalBody.children().length == 0) {
                var subcollTitleDiv = $(this.addModuleTemplate());
                modalBody.append(subcollTitleDiv);
            }
        },


        _initButtons: function () {
            var _this = this;
            // $("#createModuleButton").off();


            $("#moduleSearchButton").off("click");
            $("#moduleSearchButton").on("click", function(){
                $('#moduleSearchButton, #createModuleButton').attr('disabled', 'true');
                var selectedModule;
                BootstrapDialog.show({
                    title: "Wyszukaj moduł",
                    message: $("<div id='lister' style='height: 100px;'></div>").append($(_this.listerTemplate())),
                    buttons: [ {
                        label: 'Anuluj',
                        action: function(dialog) {
                            dialog.close();
                        }
                    },
                        {
                            label: 'OK',
                            action: function(dialog) {
                                if($("#foundModuleId").val() != ''){
                                    if($("#foundModuleVersion").val() != ''){
                                        $("#editcoll-newModuleId-input").val($("#foundModuleId").val());
                                        $("#editcoll-newModuleVersion-input").val($("#foundModuleVersion").val());
                                        dialog.close();
                                    }else{
                                        BootstrapDialog.alert("Proszę wprowadzić wersję modułu");
                                    }
                                }else{
                                    BootstrapDialog.alert("Proszę wprowadzić identyfikator modułu");
                                }
                            }
                    }],
                    onshown: function() {
                        $('#moduleSearchButton, #createModuleButton').removeAttr('disabled');
                        var lister = new BaseLister({
                            selectedItemAction: function(selectedItem) {
                                $("#foundModuleId").val(selectedItem.identifier);
                                $("#foundModuleVersion").val(selectedItem.version);
                            }
                        });
                        // TODO: lister temporary hidden
//                        lister.render();
//                        $('#lister').append(lister.$el);

                        $("#foundModuleVersion").keypress(function (e) {
                            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                                $("#version-error").html("Tylko wartości liczbowe").show().fadeOut("slow");
                                return false;
                            }
                        });
                    }
                });

            });
            $('#saveModuleChangesButton').off();
            $('#saveModuleChangesButton').on("click", function () {
//                var selectedNode = _this.subCollTree.jstree(true).get_node(_this.subCollTree.jstree(true).get_selected()[0]);
                var selectedNode = _this.selectedNode;
                if (selectedNode !== undefined && selectedNode != null && selectedNode != false) {
                    var itemData = selectedNode.original;
                    var parentTitle = itemData._title;
                    var parentId = itemData.id;
                    var newId = $("#editcoll-newModuleId-input").val();
                    var newVersion = $("#editcoll-newModuleVersion-input").val();
                    if (newId != "") {
                        _this.saveCallback(parentTitle, parentId, newId, newVersion);
                        //_this.hide();
                    } else {
                        alert("Podaj identyfikator modułu");
                    }
                } else {
                   alert("Wybierz kolekcję");
                }
            });
            $("#editcoll-newModuleId-input").keypress(function(event){
                var key = (event.keyCode ? event.keyCode : event.which);
                if(key == 13){
                    $('#saveModuleChangesButton').trigger('click');
                }
            });
        },

        updateTree: function (collection, selectedNode) {
            this.model = collection;
            this.selectedNode = selectedNode;
        },

        show: function () {

            var createModuleButton = $("#createModuleButton");
            createModuleButton.attr('disabled', false);
            CascadeForms.connectInitializer({
                button: createModuleButton,
                urlProvider: function() { return "//www.{{ TOP_DOMAIN }}/edit/store/api/start/" + EditorDriver.spaceId() + "/module"; },
                successCallback: function(result) {
//                     BootstrapDialog.alert({
//                        title: 'Nowy moduł',
//                        message: 'Identyfikator nowego modułu: ' + result.identifier
//                    });
                    $("#editcoll-newModuleId-input").val(result.identifier);
                    $("#editcoll-newModuleVersion-input").val(result.version);
                }
            });

            $("#editcoll-newModuleId-input").val('');
            $("#editcoll-newModuleVersion-input").val('');
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
