define(['jquery',
    'underscore',
    'backbone',
    'modules/app/util/TreeNodesHelper',
    'modules/app/util/RolesUtil',
    'modules/ui_widget/AddSubcollectionDialog',
    'modules/ui_widget/AddModuleDialog',
    'modules/ui_widget/EditAttributesDialog',
    'modules/app/util/IdGenerator',
    'modules/app/util/FileManipulation',
    'modules/view/MetadataView',
    'modules/view/SubcollectionMetaView',
    'modules/view/ModuleMetaView',
    'text!modules/templates/ModuleXMLTemplate.html',
    'text!modules/templates/SubcollectionXMLTemplate.html',
    'text!modules/templates/EPCollXMLTemplate.html',
    'dateFormat',
    'plugins/jstree',
    'lock_driver/LockDriver',
    'editor_driver/EditorDriver',
    'object_driver/ObjectDriver',
    'bar_editor_driver/BarEditorDriver',
    'CascadeForms'
], function ($, _, Backbone, TreeNodesHelper, RolesUtil, AddSubcollectionDialog, AddModuleDialog, EditAttributesDialog, IdGenerator, FileManipulation, MetadataView, SubcollectionMetaView, ModuleMetaView, ModuleXMLTemplate, SubcollectionXMLTemplate, EPCollXMLTemplate, dateFormat, jstree, LockDriver, EditorDriver, ObjectDriver, BarEditorDriver, CascadeForms) {


    var longDateFormat = 'yyyy-MM-dd HH:mm CEST';

    $.fn.extend({
        setCursorPosition: function(position){
            if(this.length == 0) return this;
            return $(this).setSelection(position, position);
        },

        setSelection: function(selectionStart, selectionEnd) {
            if(this.length == 0) return this;
            input = this[0];

            if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            } else if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }

            return this;
        },

        focusEnd: function(){
            this.setCursorPosition(this.val().length);
            return this;
        },

        getCursorPosition: function() {
            var el = $(this).get(0);
            var pos = 0;
            if('selectionStart' in el) {
                pos = el.selectionStart;
            } else if('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            return pos;
        },

        insertAtCursor: function(myValue) {
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos) + myValue +
                        this.value.substring(endPos,this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            })
        },

        getSelectionStart: function(){
            if (this.length == 0) return -1;
            var _input = this[0];
            var pos = _input.value.length;
            if (_input.createTextRange) {
                var r = document.selection.createRange().duplicate();
                r.moveEnd('character', _input.value.length);
                if (r.text == '')
                    pos = _input.value.length;
                pos = _input.value.lastIndexOf(r.text);
            } else if (typeof(_input.selectionStart) !== "undefined")
                pos = _input.selectionStart;

            return pos;
        },

        getSelectionEnd: function(){
            if (this.length == 0) return -1;
            var _input = this[0];

            var pos = _input.value.length;

            if (_input.createTextRange) {
                var r = document.selection.createRange().duplicate();
                r.moveStart('character', -_input.value.length);
                if (r.text == '')
                    pos = _input.value.length;
                pos = _input.value.lastIndexOf(r.text);
            } else if (typeof(_input.selectionEnd) !== "undefined" )
                pos = _input.selectionEnd;

            return pos;
        }

    });

    var stopPropagation = function(handler) {
        return function(event) {
            handler(event);
            event.stopPropagation();
            return false;
        }
    };

    var stopImmediatePropagation = function(handler) {
        return function(event) {
            handler(event);
            event.stopImmediatePropagation();
            return false;
        }
    };

    return Backbone.View.extend({

        LICENSES: [
            { name: 'CC BY 1.0', url: 'http://creativecommons.org/licenses/by/1.0/pl/legalcode' },
            { name: 'CC BY 2.0', url: 'http://creativecommons.org/licenses/by/2.0/pl/legalcode' },
            { name: 'CC BY 2.5', url: 'http://creativecommons.org/licenses/by/2.5/pl/legalcode' },
            { name: 'CC BY 3.0', url: 'http://creativecommons.org/licenses/by/3.0/pl/legalcode' },
            { name: 'CC BY 4.0', url: 'http://creativecommons.org/licenses/by/4.0/pl/legalcode' },
            { name: 'CC BY SA 1.0', url: 'http://creativecommons.org/licenses/by-sa/1.0/legalcode' },
            { name: 'CC BY SA 2.0', url: 'http://creativecommons.org/licenses/by-sa/2.0/legalcode' },
            { name: 'CC BY SA 2.5', url: 'http://creativecommons.org/licenses/by-sa/2.5/legalcode' },
            { name: 'CC BY SA 3.0', url: 'http://creativecommons.org/licenses/by-sa/3.0/legalcode' },
            { name: 'CC BY SA 4.0', url: 'http://creativecommons.org/licenses/by-sa/4.0/legalcode' },
            { name: 'Free for Commercial Use', url: '' },
            { name: 'GE S.A.', url: '' },
            { name: 'GNU FDL', url: '' },
            { name: 'GNU FDL 1.1', url: '' },
            { name: 'GNU FDL 1.2', url: '' },
            { name: 'GNU FDL 1.3', url: '' },
            { name: 'nieznana', url: '' },
            { name: 'ORE', url: '' },
            { name: 'PCSS', url: '' },
            { name: 'PŁ', url: '' },
            { name: 'pubic domail', url: '' },
            { name: 'slultterstock', url: '' },
            { name: 'Studio nagrań', url: '' },
            { name: 'wlasność prywatna', url: '' }
        ],

        STYLESHEETS: ['standard-2', 'ge', 'informatyka', 'matematyka', 'biologia', 'chemia', 'edubezp', 'geografia', 'przyroda', 'fizyka', 'wos', 'polski', 'historia', 'historia-i-spoleczenstwo'],

        //TODO: determine this with reverse
        UPLOAD_URL: "/edit/store/api/upload/collection/",

        initialize: function(options){
            this.router = options.router;
            var router = this.router;
            var _this = this;


            this.listenTo(this.router, 'route:query', function(spaceId, collectionId, version) {
                var params = { category: 'collection', identifier: collectionId, version: version };

                this.barEditorDriver = new BarEditorDriver({
                    metadata: params,
                    xmlEditor: false,
                    filesPushProvider: function () {

                        var thisDate = new Date();
                        this.collection.get("metadata").revised = dateFormat.format.date(thisDate, longDateFormat);
                        this.collection.save();
                        this.collection.setDocument(this.collection._generateCollectionXML());
                        var output = this.collection.get("document");
                        if(typeof this.collection.get("metadata").eTextbook._class == "undefined") {
                            output = output.replace("<ep:class></ep:class>", "");
                        }
                        return {
                            content: output,
                            filepath: 'collection.xml'
                        }
                    }.bind(this),
                    beforePushValidator: function () {
                        return [];
                    },
                    setReadOnlyStateHandler: function (readonly) {
                        var writeOnlyElements = $('.editcoll-write-only');
                        this.setDisabledState(readonly);
                        writeOnlyElements.find('*').toggleEnabled(!readonly);
                        writeOnlyElements.find('form').toggleEnabled(!readonly);
                        writeOnlyElements.find('a').toggleEnabled(!readonly);
                    }.bind(this)
                });



                this.barEditorDriver.objectDriver.pull({
                    filename: 'collection.xml'
                }, function (data) {
                    if (window.ActiveXObject) {
                        var xmlString = data.xml;
                    } else {
                        var xmlString = (new XMLSerializer()).serializeToString(data);
                    }
                    router._loadCollection(xmlString);
                });

                this.barEditorDriver.lockDriver.read();

            }.bind(this));

            this.postInitialize(options);
        },

        postInitialize: function (options) {
            this.selectedNode = null;
            this.addSubcollectionDialog = null;
            this.addModuleDialog = null;
            this.rootTreeId = null;
            this.collection = options.collection;
            this.listenTo(this.collection, 'change:metadata', this._metadataChanged);
            this.metadataContainer = $('#collection-editor-meta');
            this.selectedMetadataTab = "#editcoll-basic-tab";
            this._initializeMetadataViews();
            this.updating = false;
            this.updateModuleMetadataFinished = false;
            this.selectFromUpdate = false;
            this.updateFromMove = false;
            this.theJSTree = $('#jstree_main');
            this._initTree();
            this.render();
        },

        setDisabledState: function(disabled){
            this.metadataView.disabled(disabled);
            this.subcollMetaView.disabled(disabled);
            this.moduleMetaView.disabled(disabled);
        },

        _connectWatchers: function(){
            var _this = this;
            var b = $('body');

            var callback = function(){
                if(_this.barEditorDriver.lockDriver.mode != 'drop'){
                    _this.barEditorDriver.lockDriver.write();
                }
            };

            this.listenTo(this.metadataView, 'inputChanged', callback);
            this.listenTo(this.subcollMetaView, 'inputChanged', callback);
            this.listenTo(this.moduleMetaView, 'inputChanged', callback);

            $("#addSubcollectionButton").click(callback);
            $('#addModuleButton').click(callback);
            $('#deleteElementButton').click(callback);
        },


        render: function () {
            var _this = this;
            _this._initButtons();
            var metadataView = new MetadataView({el: _this.metadataContainer, collection: _this.collection});
        },

        _createCollectionFromJSTree: function (newJSTree) {
            var _this = this;
            var root = newJSTree.get_node($("#jstree_main ul > li:first"));
            var rootData = root.original;
            var metadata = {
                contentId: rootData._content_id,
                repository: rootData._repository,
                title: rootData._title,
                subtitle: rootData._subtitle,
                version: rootData._version,
                created: rootData._created,
                revised: rootData._revised,
                language: rootData._language,
                _abstract: rootData._abstract,
                educationLevellist: rootData._education_level,
                subjectlist: rootData._subjectlist,
                actors: rootData._actors,
                organizations: rootData._organizations,
                roles: rootData._roles
            };
            metadata.license = {
                url: rootData._license.url,
                name: rootData._license.name
            }
            metadata.eTextbook = {
                contentStatus: rootData._e_textbook.contentStatus,
                recipient: rootData._e_textbook.recipient,
                learningObjectives: rootData._e_textbook.learningObjectives,
                version: rootData._e_textbook.version,
                collectionHeader: rootData._e_textbook.collectionHeader,
                collectionHeaderTitlePresentation: rootData._e_textbook.collectionHeaderTitlePresentation,
                collectionToc: rootData._e_textbook.collectionToc,
                _class: rootData._e_textbook._class,
                volume: rootData._e_textbook.volume,
                stylesheet: rootData._e_textbook.stylesheet,
                environmentType: rootData._e_textbook.environmentType,
                signature: rootData._e_textbook.signature,
                coverType: rootData._e_textbook.coverType,
                cover: rootData._e_textbook.cover,
                showTechnicalRemarks: rootData._e_textbook.showTechnicalRemarks
            }
            _this.collection.setMetadata(metadata);

            var childNodes = root.children;

            var objectsList = [];
            _.each(childNodes, function (childNode) {
                var item = newJSTree.get_node(childNode);
                var contentObject = {};
                contentObject.order = item.original._order;
                if (item.type == "collection") {
                    contentObject.contentType = "subcollection";
                    var subcollection = _this._createSubcollFromJSTree(newJSTree, item);
                    $.extend(contentObject, subcollection);
                } else if(item.type == "module") {
                    contentObject.contentType = "module";
                    var module = _this._createModuleFromJSTreeItem(item);
                    $.extend(contentObject, module);
                }
                objectsList.push(contentObject);
            });

            _this.collection.setContent(objectsList);
            //console.log(_this.collection.get('content'));


            _this.collection.setDocument(_this._generateCollectionXML());
            _this.collection.save();

            _this._treeAPI().clear_state();

            _this.barEditorDriver.markChangeOccurred();
        },

        _createSubcollFromJSTree: function (newJSTree, node){
            var _this = this;

            var item = newJSTree.get_node(node);
            var itemData = item.original;

            var subcollection = {
                id: itemData.id,
                title: itemData._title,
                viewAttributes: itemData._viewAttributes
            }
            var childNodes = item.children;

            var objectsList = [];
            _.each(childNodes, function (childNode) {
                var item = newJSTree.get_node(childNode);
                var contentObject = {};
                contentObject.order = item.original._order;
                if (item.type == "collection") {
                    contentObject.contentType = "subcollection";
                    var subcoll = _this._createSubcollFromJSTree(newJSTree, item);
                    $.extend(contentObject, subcoll);
                } else if(item.type == "module") {
                    contentObject.contentType = "module";
                    var module = _this._createModuleFromJSTreeItem(item);
                    $.extend(contentObject, module);
                }
                objectsList.push(contentObject);
            });

            subcollection.content = objectsList;
            return subcollection;
        },

        _generateCollectionXML: function () {
            var _this = this;
            var tempModel = {
                metadata: _this.collection.get("metadata"),
                modules: _this.collection.get("modules"),
                subcollections: _this.collection.get("subcollections"),
                content: _this.collection.get("content")
            };
            var output = _.template(EPCollXMLTemplate, tempModel);
            return output;
        },

        _initializeMetadataViews: function () {
            var _this = this;
            _this.metadataView = new MetadataView({collection: _this.collection});
            _this.subcollMetaView = new SubcollectionMetaView({collection: _this.collection});
            _this.moduleMetaView = new ModuleMetaView({collection: _this.collection});

            this._connectWatchers();
        },

        _switchView: function (view) {
//            console.log("_switchView view" ,view);
            if (this.currentView) {
                this.currentView.remove();
            }
            this.metadataContainer.html(view.el);
            view.render();
            this.currentView = view;
        },

        _initTree: function () {
            var _this = this;
            _this.theJSTree.jstree(true);
        },
        _treeAPI: function() {
            var _this = this;
            return _this.theJSTree.jstree(true);
        },

        _updateTree: function () {
//            console.log("_updateTree");
            if (this.updateFromMove) {
                //console.log("_updateTree updateFromMove");
                return;
            }
            var _this = this;

            var treeData = TreeNodesHelper.createTreeData(_this.collection)[0];
//            console.log("TREE DATA:", treeData );
            var config = {
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "data": treeData
                },
                "types": {
                    "root": {
                        "icon": "glyphicon glyphicon-briefcase"
                    },
                    "collection": {
                        "icon": "glyphicon glyphicon-folder-open",
                        "valid_children": ["collection", "module"]
                    },
                    "module": {
                        "icon": "glyphicon glyphicon-file",
                        "valid_children": []
                    }
                },
                "state": { "key": "theJSTree"},
                "plugins": ["dnd", /*"wholerow",*/"types", "state"]
            }
            _this.theJSTree.jstree("destroy");
            _this.theJSTree.on("ready.jstree", function () {
//                console.log("ready.jstree");
                _this.selectFromUpdate = true;

                _this.rootTreeId = $("#jstree_main ul > li:first")[0].id;
                if (_this.collection.get('selectedNodeId') !== undefined) {
                    _this.collection.setSelectedNodeId(_this._getSelectedNode().id);
                } else {
                    //console.log($("#jstree_main ul > li:first")[0].id);
                    //_this.collection.setSelectedNodeId($("#jstree_main ul > li:first")[0].id);
                    _this.collection.setSelectedNodeId(_this.rootTreeId);

                }
                //console.log("select node:",_this._getSelectedNode().id);
                _this._treeAPI().select_node(_this._getSelectedNode().id);
                var selectInterval = setInterval(function(){
                    if($("#jstree_main ul > li#"+_this._getSelectedNode().id).length != 0){
                        clearInterval(selectInterval);
                        _this._treeAPI().select_node(_this._getSelectedNode().id);
                        _this._treeAPI().open_node(_this._getSelectedNode().id);
                    }
                }, 5);


            }).jstree(config);

            _this.theJSTree.on("changed.jstree", function (e, data) {
//                console.log("changed.jstree", data);
                var item = data.selected;
                if (item.length == 0) {
                    return;
                }

                _this.collection.setSelectedNodeId(item);

                if (!_this.selectFromUpdate) {
                    _this._getSelectedNode();
                } else {
                    _this.collection.setSelectedNodeId(item);
                }
                var itemData = _this._treeAPI().get_node(item).original;
                var itemType = _this._treeAPI().get_type(item);
                if (itemType == "root") {
                    _this._switchView(_this.metadataView);
                    _this._generateCollMetadataForm(treeData, true);
                } else {
                    if (itemType == "collection") {
                        try{
                            _this._switchView(_this.subcollMetaView);
                            _this._generateSubcollMetaForm(itemData);
                        }catch(err){
                            console.log("ERROR: ", err);
                        }
                    } else {   //"module"
                        try{
                            _this._switchView(_this.moduleMetaView);
                            _this._generateModuleMetaForm(itemData);
                        }catch(err){
                            console.log("ERROR: ", err);
                        }
                    }
                }
                _this.selectFromUpdate = false;

            });

            _this.theJSTree.on("move_node.jstree", function (e, data) {
//                console.log("move_node.jstree",e,data);
                _this.updateFromMove = true;

                _this._createCollectionFromJSTree(data.new_instance);
                //console.log("move_node.jstree _createCollectionFromJSTree",data.new_instance);
                _this.updateFromMove = false;

            });

        },

        _getSelectedNode: function () {
            var _this = this;
            var selectedNodeId = _this.collection.get('selectedNodeId');
            //var selectedNode = _this._treeAPI().get_node(_this._treeAPI().get_selected()[0]);
            var selectedNode = _this._treeAPI().get_node(selectedNodeId);

            if (selectedNode != undefined) _this.selectedNode = selectedNode;
            return _this.selectedNode;
        },


        _initButtons: function () {
            var _this = this;
            // TODO: EPP-6026

            $("#xml-preview-button").click(function () {
                $("#editcoll-metadata-tab").toggle('fast');
                $("#editcoll-preview-tab").toggle('fast');
            });


            $("#addSubcollectionButton").click(function (event) {
                event.preventDefault();
                var itemType = _this._treeAPI().get_type(_this._getSelectedNode());
                if (itemType != "module") {
                    if (_this.addSubcollectionDialog == null) {
                        _this.addSubcollectionDialog = new AddSubcollectionDialog({model: _this.collection, selectedNode: _this._getSelectedNode(), saveCallback: function (parentTitle, parentId, title) {
                            if (_this.collection.get('metadata').title == parentTitle) {
                                parentTitle = 'root';
                            }
                            var subcollId = (new IdGenerator('subcollection', 'simple')).getId();
                            _this.collection.updateCollection(parentTitle, parentId, subcollId, title);
                            _this.collection.setSelectedNodeId(subcollId);
//                            _this.theJSTree.jstree("destroy");
                            _this._treeAPI().clear_state();
                            _this._updateTree();
//                            _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);
                            _this.barEditorDriver.markChangeOccurred();
                        }});
                    } else {
                        _this.addSubcollectionDialog.updateTree(_this.collection, _this._getSelectedNode());
                    }
                    _this.addSubcollectionDialog.show();
                }
            });

            $("#addModuleButton").click(function (event) {
                event.preventDefault();
                var itemType = _this._treeAPI().get_type(_this._getSelectedNode());
                if (itemType != "module") {
                    if (_this.addModuleDialog == null) {
                        _this.addModuleDialog = new AddModuleDialog({model: _this.collection, selectedNode: _this._getSelectedNode(), saveCallback: function (parentTitle, parentId, _id, version) {
                            if (_this.collection.get('metadata').title == parentTitle) {
                                parentTitle = 'root';
                            }
                            if (!_this.collection.hasModule(_id)) {
                                _this._getModuleState(_id, version, function(that, next) {
                                    if (that != undefined) {
                                        _this.collection.setSelectedNodeId(_id);
                                        _this.collection.updateCollectionWithModule(parentTitle, parentId, _id, version, that.title);
                                        _this._treeAPI().clear_state();
                                        _this._updateTree();
                                        //                                _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);
                                        _this.addModuleDialog.hide();
                                        _this.barEditorDriver.markChangeOccurred();
                                        _this.barEditorDriver.showMessage("Moduł utworzony", "ok");
                                    } else {
                                        BootstrapDialog.alert({
                                            title: 'Brak modułu',
                                            message: "Moduł "+_id+" nie istnieje."
                                        });
                                    }
                                });
                            } else {
                                //alert("Moduł o identyfikatorze: "+ title +" już istnieje !");
                                BootstrapDialog.alert({
                                    title: 'Moduł istnieje',
                                    message: "Moduł o identyfikatorze: "+ _id +" już istnieje !"
                                });
                            }
                        }});
                    } else {
                        _this.addModuleDialog.updateTree(_this.collection, _this._getSelectedNode());
                    }
                    _this.addModuleDialog.show();
                }
            });

            $('#deleteElementButton').click(function (event) {
                event.preventDefault();
                var treeApi = _this._treeAPI();
                var selected_nodes = _this.collection.get('selectedNodeId');
                var deleteText = '';
                if (selected_nodes.length > 0) {

                    for (var i = 0; i < selected_nodes.length; i++) {
                        if (_this._treeAPI().get_type(treeApi.get_node(selected_nodes[0])) == "root") {
                            return;
                        }
                    }
                    if (selected_nodes.length > 1) {
                        deleteText = "Usunąć elementy: ";
                        for (var i = 0; i < selected_nodes.length; i++) {
                            deleteText += treeApi.get_node(selected_nodes[i]).text + "; ";
                        }
                        deleteText += " ?";
                    } else {
                        if (treeApi.get_type(selected_nodes[0]) == 'collection') {
                            deleteText = "Usunąć podkolekcję " + treeApi.get_node(selected_nodes[0]).text + " z wszystkimi elementami?";
                        } else {
                            deleteText = "Usunąć moduł " + treeApi.get_node(selected_nodes[0]).text + "?";
                        }
                    }
                    var yes = confirm(deleteText);
                    if (yes) {
                        for (var i = 0; i < selected_nodes.length; i++) {
                            var item = treeApi.get_node(selected_nodes[i]);


//                            console.log("Removing object with id: "+ item.id);
                            _this.collection.deleteSubcollectionOrModule(item.id);
                            _this.collection.setSelectedNodeId(treeApi.get_node("#jstree_main ul > li:first"));
                            _this._updateTree();
//                            _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);
                            _this.barEditorDriver.markChangeOccurred();
                            _this.collection.setSelectedNodeId(_this.rootTreeId);
                            _this._treeAPI().select_node(_this.rootTreeId);
                            _this._treeAPI().open_node(_this.rootTreeId);
                            if(selected_nodes.length>1){
                                _this.barEditorDriver.showMessage("Elementy usunięte", "ok");
                            }
                            else {
                                _this.barEditorDriver.showMessage("Element usunięty", "ok");
                            }

                        }
                    }
                } else {
//                    BootstrapDialog.alert({
//                        title: 'Wybierz element',
//                        message: "Wybierz element do usunięcia."
//                    });
                    _this.barEditorDriver.showMessage("Wybierz element do usunięcia", "denied");
                }
            });


            $('#editcoll-logout-link').on("click", function (event) {
                event.preventDefault();
                var logoutUrl = $(event.currentTarget).data('logout-url');
                if (_this.barEditorDriver.lockDriver) {
                    _this.barEditorDriver.lockDriver.drop(function(data) {
                        if(data.status == 'ok') {
                            var locPath = window.location.pathname;
                            window.location.href = logoutUrl+'?redirect_login='+locPath;
                        }
                    });
                }
            });

        },

        _metadataChanged: function (collection, options) {
            if (this.barEditorDriver.lockDriver.mode === 'drop') {
                return;
            }
            var _this = this;
            _this.collection = collection;
            // var title = "Struktura kolekcji";
            if (_this.collection.get('metadata') != undefined) {
                var metadata = this.collection.get('metadata');
                var collId = metadata.contentId != '' ? ': ' + metadata.contentId : '';
                var collTitle = metadata.title != '' ? '"' + metadata.title + '"' : '';
                var treeData = TreeNodesHelper.createTreeData(_this.collection)[0];
                _this._generateCollMetadataForm(treeData, true);
                _this._updateTree();
            }
        },
        _generateCollMetadataForm: function (itemData, updateXMLpreview) {
            var _this = this;

            var index = $('a[href="'+_this.selectedMetadataTab+'"]').parent().index();
            $("#metadata-tabs").tabs("option", "active", index);

            $("#metadata-tabs").find('li.active').removeClass('active');
            $('a[href="'+_this.selectedMetadataTab+'"]').parent().addClass('active');

            $('#editcoll-content-id-input').val(itemData._content_id);
            $('#editcoll-repository-input').val(itemData._repository);
            $('#editcoll-title-input').val(itemData._title);
            $('#editcoll-subtitle-input').val(itemData._subtitle);
            $('#editcoll-version-input').val(itemData._version);
            $('#editcoll-created-input').val(itemData._created);
            $('#editcoll-revised-input').val(itemData._revised);
            $('#editcoll-language-input').val(itemData._language);

            $('#editcoll-license-list option').remove();
            _.each(this.LICENSES, function (license) {
                var licenseField = license.name + (license.url != "" ? " (" + license.url + ")" : "");
                var licenseOption = $('<option>', {
                    "value": license.name
                });
                licenseOption.append(licenseField);
                licenseOption.data({"license": license});
                $('#editcoll-license-list').append(licenseOption);
            });

            $('#editcoll-license-list option').each(function () {
                if (itemData._license !== undefined) {
                    if ($(this).data().license.name == itemData._license.name) {
                        $(this).prop('selected', true);
                    }
                } else {
                    $("#editcoll-license-list").val($("#editcoll-license-list option:first").val());
                }
            });

            $('#editcoll-level-input option').each(function () {
                if (itemData._education_level == $(this).val()) {
                    $(this).prop('selected', true);
                }
            });

             $('#editcoll-subjectlist-input option').each(function () {
                if (itemData._subjectlist == $(this).val()) {
                    $(this).prop('selected', true);
                }
            });

            $('#editcoll-abstract-input').val(itemData._abstract);

            if (itemData._e_textbook) {
                $("#editcoll-epversion-input").val(itemData._e_textbook.version);
                $("#editcoll-header-input").val(itemData._e_textbook.collectionHeader);

                $('#editcoll-header-presentation-input option').each(function () {
                    if (itemData._e_textbook.collectionHeaderTitlePresentation == $(this).val()) {
                        $(this).prop('selected', true);
                    }
                });

                if(itemData._e_textbook._class == "")
                {
                    itemData._e_textbook._class = "0";
                }
                $("#editcoll-class-input").val(itemData._e_textbook._class);

                $("#editcoll-volume-input").val(itemData._e_textbook.volume);

                $('#editcoll-stylesheet-input option').remove();
                _.each(this.STYLESHEETS, function (stylesheet) {
                    $('#editcoll-stylesheet-input').append($('<option>', {
                        value: stylesheet,
                        html: stylesheet
                    }));
                });

                var stylesheetFound = false;
                $('#editcoll-stylesheet-input option').each(function () {
                    if (itemData._e_textbook.stylesheet == $(this).text()) {
                        stylesheetFound = true;
                        $(this).prop('selected', true);
                    }
                });

                if (!stylesheetFound) {
                    var styleSheet = itemData._e_textbook.stylesheet;
                    if (styleSheet != null && styleSheet != ""){
                        $('#editcoll-stylesheet-input').append($('<option>', {
                            value: styleSheet,
                            html: styleSheet
                        }));
                        $('#editcoll-stylesheet-input option').each(function () {
                            if (styleSheet == $(this).text()) {
                                $(this).prop('selected', true);
                            }
                        });
                    }
                }

                $("#stylesheetAddBtn").on("click", stopImmediatePropagation(function (event) {
                    var editAtributesDialog = new EditAttributesDialog({
                        model: _this.collection,
                        attributesName: 'stylesheet',
                        title: 'Nowy styl',
                        saveCallback: function (attrs) {
                            $('#editcoll-stylesheet-input').append($('<option>', {
                                value: attrs,
                                html: attrs
                            }));
                            $('#editcoll-stylesheet-input option').each(function () {
                                if (attrs == $(this).text()) {
                                    $(this).prop('selected', true);
                                }
                            });
                            _this.collection.get("metadata").eTextbook.stylesheet = attrs;
                            _this.collection.save();
                        }
                    });
                }));

                if (itemData._e_textbook.environmentType != "") {
                    $("#editcoll-environment-type-input").val(itemData._e_textbook.environmentType);
                }
                $("#editcoll-signature-input").val(itemData._e_textbook.signature);
                if (itemData._e_textbook.showTechnicalRemarks != "") {
                    $("#editcoll-show-technical-remarks-input").val(itemData._e_textbook.showTechnicalRemarks);
                }
                $("#editcoll-cover-input").val(itemData._e_textbook.cover);
                $("#editcoll-coverType-input").val(itemData._e_textbook.coverType);
            }

            $('#editcoll-actors-list').find('option').remove();
            _.each(itemData._actors, function (actor) {
                if (actor != "") {
                    var _actorid = actor.userid;
                    var _firstname = actor.firstname;
                    var _surname = actor.surname;
                    var _fullname = actor.fullname;
                    var _email = actor.email;
//                    var actorField = "Id: " + _actorid + " " + _firstname + " " + _surname + " (" + _email + ")";
                    var actorField = _fullname + " (" +_firstname + " " + _surname + (_email != '' ? " e-mail: " + _email : '') +")";
                    var _actor = {
                        userid: _actorid,
                        firstname: _firstname,
                        surname: _surname,
                        fullname: _fullname,
                        email: _email
                    }
                    var actorOption = $('<option>', {
                        "value": _actorid
                    });
                    actorOption.append(actorField);
                    actorOption.data({"actor": _actor});
                    $("#editcoll-actors-list").append(actorOption);
                }
            });

            $("#actorsEditButton").on("click", stopImmediatePropagation(function (event) {
                var editAtributesDialog = new EditAttributesDialog({
                    model: _this.collection,
                    attributesName: 'actors',
                    title: 'Autorzy',
                    saveCallback: function (attrs) {
                        _this.collection.updateMetadata("actors", attrs);
                        _this._updateTree();
                        _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);
                        _this.barEditorDriver.markChangeOccurred();
                    }
                });
            }));

            $('#editcoll-organizations-list').find('option').remove();
            _.each(itemData._organizations, function (organization) {
                if (organization != "") {
                    var _userId = organization.userid;
                    var _fullname = organization.fullname;
                    var _shortname = organization.shortname;
                    // var organizationField = "Id: " + _userId + " " + _shortname + "(" + _fullname + ")";
                    var organizationField = _shortname + " (" + _fullname + ")";
                    var _organization = {
                        userid: _userId,
                        fullname: _fullname,
                        shortname: _shortname
                    }
                    var organizationOption = $('<option>', {
                        "value": _userId
                    });
                    organizationOption.append(organizationField);
                    organizationOption.data({"organization": _organization});
                    $("#editcoll-organizations-list").append(organizationOption);
                }
            });

            $("#organizationsEditButton").on("click", stopImmediatePropagation(function (event) {
                var editAtributesDialog = new EditAttributesDialog({
                    model: _this.collection,
                    attributesName: 'organizations',
                    title: 'Organizacje',
                    saveCallback: function (attrs) {
                        _this.collection.updateMetadata("organizations", attrs);
                        _this._updateTree();
                        _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);
                        _this.barEditorDriver.markChangeOccurred();
                    }
                });
            }));

            $('#editcoll-roles-list').find('option').remove();
            _.each(itemData._roles, function (role) {
                $("#editcoll-roles-list").append(RolesUtil.getSelectOptionRole(role.value, role.type, itemData._actors, itemData._organizations));
            });

            $("#rolesEditButton").on("click", stopImmediatePropagation(function (event) {
                var editAtributesDialog = new EditAttributesDialog({
                    model: _this.collection,
                    attributesName: 'roles',
                    title: 'Role',
                    saveCallback: function (attrs) {
                        _this.collection.updateMetadata("roles", attrs);
                        _this._updateTree();
//                        _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);
                        _this.barEditorDriver.markChangeOccurred();
                    }
                });
            }));

            $('#editcoll-signature-input').keypress(function (e) {
                var code = e.keyCode || e.which;
                if(code == 13) {
                    e.preventDefault();
                    $(e.currentTarget).insertAtCursor("<cn:newline/>");
                }
                e.stopImmediatePropagation();
            });

            function setSygnatureEffect(effect){
                var textArea = $('#editcoll-signature-input');
                var start = textArea.getSelectionStart();
                var end = textArea.getSelectionEnd();
                var size = end - start;
                textArea.setCursorPosition(start);
                var startTag = "<cn:emphasis effect='"+effect+"'>";
                textArea.insertAtCursor(startTag);
                var endCursorPosition = start + startTag.length + size;
                textArea.setCursorPosition(endCursorPosition);
                var endtTag = "</cn:emphasis>";
                textArea.insertAtCursor(endtTag);
                if (size == 0 ) {
                    textArea.setCursorPosition(textArea.val().length - endtTag.length);
                }
                _this.barEditorDriver.markChangeOccurred();
            }

            $('#sygnatureBold').on('click', stopImmediatePropagation(function (e) {
                e.preventDefault();
                setSygnatureEffect("bold");
            }));

            $('#sygnatureItalic').on('click', stopImmediatePropagation(function (e) {
                e.preventDefault();
                setSygnatureEffect("italics");
            }));

            $('#sygnatureBoldItalic').on('click', stopImmediatePropagation(function (e) {
                e.preventDefault();
                setSygnatureEffect("bolditalics");
            }));

            $('a[data-toggle="tab"]').on("click", stopImmediatePropagation(function (e){
                $("#metadata-tabs").find('li.active').removeClass('active');
                _this.selectedMetadataTab = $(e.currentTarget).attr('href');
                $('a[href="'+_this.selectedMetadataTab+'"]').parent().addClass('active');
            }));

            if(updateXMLpreview){
                if (_this.collection.get('document') != undefined) {
                    $('#editcoll-xml').val(this.collection.get('document'));
                }
            }

            var tableOfInputs = [
                $('#editcoll-title-input'),
                $('#editcoll-subtitle-input'),
                $('#editcoll-language-input'),
                $('#editcoll-level-input'),
                $('#editcoll-license-list'),
                $('#editcoll-subjectlist-input'),
                $('#editcoll-abstract-input'),
                $('#editcoll-header-input'),
                $('#editcoll-header-presentation-input'),
                $('#editcoll-class-input'),
                $('#editcoll-volume-input'),
                $('#editcoll-stylesheet-input'),
                $('#editcoll-environment-type-input'),
                $('#editcoll-signature-input'),
                $('#editcoll-show-technical-remarks-input'),
                $('#editcoll-cover-input'),
                $('#editcoll-coverType-input')
            ];
            _.each(tableOfInputs, function(input){

                if(input.attr("id") == 'editcoll-signature-input') {
                    input.focusout(function (event) {
                        setTimeout(function(){
                            var val = input.val();
                            input.val(val);
                            _this._updateCollectionMetadata();
                            _this.barEditorDriver.markChangeOccurred();
                            event.stopImmediatePropagation();
                            return false;
                        }, 1000);
                    });
                } else {
                    if(input.attr("id") == "editcoll-header-input"){
                        input.keypress(function (e) {
                            var code = e.keyCode || e.which;
                            if (code == 32) {
                                $("#editcoll-header-error").html("Nie używaj spacji!").show().fadeOut("slow");
                                return false;
                            }
                        });
                    }
                    input.focusout(function (event) {
                        if ($('#editcoll-title-input').val() == '') {
                            BootstrapDialog.alert({
                                title: 'Brak Tytułu',
                                message: 'Wprowadź tytuł kolekcji'
                            });
                        }
                        var val = $.trim(input.val());
                        input.val(val);
                        if (_this.oldFieldValue != val) {
                            _this._updateCollectionMetadata();
                            _this.barEditorDriver.markChangeOccurred();
                            event.stopImmediatePropagation();
                        }
                    });
                    input.focusin(function (event) {
                        var val = $.trim(input.val());
                        _this.oldFieldValue = val;
                    });

                }

            });
        },

        _updateCollectionMetadata: function () {
            var _this = this;
            var thisDate = new Date();
            var lic = {};
            if ($('#editcoll-license-list').find(':selected').data() !== null) {
                lic.url = $('#editcoll-license-list').find(':selected').data().license.url;
                lic.name = $('#editcoll-license-list').find(':selected').data().license.name;
            }
            if (_this.updating == false) {
                var allValues = $("#editcoll-level-input>option").map(function () {
                    return $(this).val();
                }).toArray();
                var attributesList = {
                    "contentId": $('#editcoll-content-id-input').val(),
                    "repository": $('#editcoll-repository-input').val(),
                    "version": $('#editcoll-version-input').val(),
                    "title": $('#editcoll-title-input').val(),
                    "subtitle": $('#editcoll-subtitle-input').val(),
                    "created": $('#editcoll-created-input').val(),
//						"revised": $('#editcoll-revised-input').val(),
                    "revised": dateFormat.format.date(thisDate, longDateFormat),
                    "language": $('#editcoll-language-input').val(),
                    "_abstract": $('#editcoll-abstract-input').val(),
                    "license": {
                        "url": lic.url,
                        "name": lic.name
                    },
                    "educationLevellist": $("#editcoll-level-input").val(),
                    "subjectlist": $("#editcoll-subjectlist-input").val(),
                    "eTextbook": {
                        "contentStatus": _this.collection.get("metadata").eTextbook.contentStatus,
                        "recipient": _this.collection.get("metadata").eTextbook.recipient,
                        "learningObjectives": _this.collection.get("metadata").eTextbook.learningObjectives,
                        "version": $("#editcoll-epversion-input").val(),
                        "collectionHeader": $("#editcoll-header-input").val(),
                        "collectionHeaderTitlePresentation": $("#editcoll-header-presentation-input").val(),
                        "collectionToc": _this.collection.get("metadata").eTextbook.collectionToc,
                        "_class": $("#editcoll-class-input").val(),
                        "volume": $("#editcoll-volume-input").val(),
                        "stylesheet": $("#editcoll-stylesheet-input").find(':selected').val(),
                        "environmentType": $("#editcoll-environment-type-input").val(),
                        "signature": $("#editcoll-signature-input").val(),
                        "showTechnicalRemarks": $("#editcoll-show-technical-remarks-input").val(),
                        "coverType": $("#editcoll-coverType-input").val(),
                        "cover": $("#editcoll-cover-input").val()
                    },
                    "actors": $("#editcoll-actors-list>option").map(function () {
                        return $(this).data("actor");
                    }).toArray(),
                    "organizations": $("#editcoll-organizations-list>option").map(function () {
                        return $(this).data("organization");
                    }).toArray(),
                    "roles": $("#editcoll-roles-list>option").map(function () {
                        return $(this).data("role");
                    }).toArray()
                };
                _this.collection.updateAllMetadata(attributesList);
                //_this.collection.setSelectedNodeId($('#editcoll-content-id-input').val());

                _this._updateTree();
                //_this._updateJSTreeElement(); to be called instead of _this._updateTree()

                _this._generateCollMetadataForm(TreeNodesHelper.createTreeData(_this.collection)[0], true);

                _this.updating = true;

                setTimeout(function () {
                    _this.updating = false;

                }, 1500);
                _this.barEditorDriver.markChangeOccurred();
            }
        },

        _generateSubcollMetaForm: function (itemData) {
//            console.log(">>>> _generateSubcollMetaForm - itemData: ", itemData);
            var subcollectionModel = {
                title: itemData._title,
                id: itemData.id
            };
            var viewAttrs = [];
            $("#editcoll-subcollTitle-input").val(subcollectionModel.title);
            $('#editcoll-subcollAttrs-list').find('option').remove();
            _.each(itemData._viewAttributes, function (attr) {
                var viewAttr = {
                    id: attr.attrId,
                    type: attr.attrType,
                    value: attr.attrValue
                }
                viewAttrs.push(viewAttr);
                var attrField = '';
                if (viewAttr.value == '' || viewAttr.value === undefined) {
                    attrField = "Typ: " + viewAttr.type + "; Identyfikator: " + viewAttr.id;
                } else if (viewAttr.id == '' || viewAttr.id === undefined) {
                    attrField = "Typ: " + viewAttr.type + "; Wartość: " + viewAttr.value;
                } else {
                    attrField = "Typ: " + viewAttr.type + "; Identyfikator: " + viewAttr.id + "; Wartość: " + viewAttr.value;
                }
                var viewAttrOption = $('<option>', {
                    "value": viewAttr.id
                });
                viewAttrOption.append(attrField);
                viewAttrOption.data({"viewAttribute": viewAttr});
                $("#editcoll-subcollAttrs-list").append(viewAttrOption);
            });
            subcollectionModel.viewAttrs = viewAttrs;

            var _this = this;
            var childNodes = _this._getSelectedNode().children;

            var objectsList = [];
            _.each(childNodes, function (childNode) {
                var item = _this._treeAPI().get_node(childNode);
                var contentObject = {};
                contentObject.order = item.original._order;
                if (item.type == "collection") {
                    contentObject.contentType = "subcollection";
                    var subcoll = _this._createSubcollFromJSTree(_this._treeAPI(), item);
                    $.extend(contentObject, subcoll);
                } else if (item.type == "module") {
                    contentObject.contentType = "module";
                    var module = _this._createModuleFromJSTreeItem(item);
                    $.extend(contentObject, module);
                }
                objectsList.push(contentObject);
            });

            subcollectionModel.content = objectsList;


            var output = _.template(SubcollectionXMLTemplate, subcollectionModel);
            //var flatOut = output.replace(/\r\n|\r|\t|  |\n/g,"");
            $('#editcoll-xml').val(output);

            $("#metadataSubcollectionEditButton").click(stopImmediatePropagation(function (event) {
                var editAtributesDialog = new EditAttributesDialog({
                    model: _this.collection,
                    attributesName: 'view-attributes',
                    title: 'Atrybuty widoku',
                    initAttrs: $("#editcoll-subcollAttrs-list>option").map(function () {
                        return $(this).data("viewAttribute");
                    }).toArray(),
                    saveCallback: function (attrs) {
                        _this.collection.updateObjectMetadata(subcollectionModel.id, "viewAttributes", attrs);

                        //console.log(attrs);
                        _this._generateViewAttributesList(attrs);
                        _this._updateSubcollectionMetadata(itemData);
                        _this.barEditorDriver.markChangeOccurred();
                    }
                });
            }));

            var tableOfInputs = [
                $('#editcoll-subcollTitle-input'),
                $('#editcoll-subcollAttrs-input')
            ]
            _.each(tableOfInputs, function(input){
                input.focusout(function (event) {
                    if ($('#editcoll-title-input').val() == ''){
                        BootstrapDialog.alert({
                            title: 'Brak Tytułu',
                            message: 'Wprowadź tytuł kolekcji'
                        });
                    }
                    var val = $.trim(input.val());
                    input.val(val);
                    if (_this.oldFieldValue != val) {
                        _this._updateSubcollectionMetadata(itemData);
                        _this.barEditorDriver.markChangeOccurred();
                        event.stopImmediatePropagation();
                    }
                });
                input.focusin(function (event) {
                    var val = $.trim(input.val());
                    _this.oldFieldValue = val;
                });
            });

        },

        _updateSubcollectionMetadata: function (itemData) {
            var _this = this;
            if (_this.updating == false) {
                //var subcollectionTitle = itemData._title;
                var subcollectionId = itemData.id;
                var attributesList = {
                    "id": subcollectionId,
                    "title": $("#editcoll-subcollTitle-input").val(),
                    "viewAttributes": $("#editcoll-subcollAttrs-list>option").map(function () {
                        return $(this).data("viewAttribute");
                    }).toArray()

                };
                //_this.collection.updateSubcollectionAllMetadata(subcollectionId, attributesList);
                _this.collection.updateObjectAllMetadata(subcollectionId, attributesList);

                _this._updateTree();

            }
        },

        _generateViewAttributesList: function (attrs) {
            $('#editcoll-subcollAttrs-list').find('option').remove();
            _.each(attrs, function (attr) {
                var attrField = '';
                if (attr.value == '' || attr.value === undefined) {
                    attrField = "Typ: " + attr.type + "; Identyfikator: " + attr.id;
                } else if (attr.id == '' || attr.id === undefined) {
                    attrField = "Typ: " + attr.type + "; Wartość: " + attr.value;
                } else {
                    attrField = "Typ: " + attr.type + "; Identyfikator: " + attr.id + "; Wartość: " + attr.value;
                }
                var viewAttrOption = $('<option>', {
                    "value": attr.id
                });
                viewAttrOption.append(attrField);
                viewAttrOption.data({"viewAttribute": attr});
                $("#editcoll-subcollAttrs-list").append(viewAttrOption);
            });
        },

        _createSubcollectionFromJSTreeItem: function (newJSTree, node) {
            var _this = this;

            var item = newJSTree.get_node(node);
            var itemData = item.original;

            var subcollectionMeta = {
                id: itemData.id,
                title: itemData._title,
                viewAttributes: itemData._viewAttributes
            }
            var childNodes = item.children;
            var modules = [];
            var subcollections = [];
            _.each(childNodes, function (childNode) {
                var node = childNode;
                var item = newJSTree.get_node(node);
                var itemChild = item.original;

                if (itemChild._type == 'subcollection') {
                    var subcollection;
                    subcollection = _this._createSubcollectionFromJSTreeItem(newJSTree, item);

                    subcollections.push(subcollection);
                } else {
                    var module = _this._createModuleFromJSTreeItem(item);
                    modules.push(module);
                }
            });
            subcollectionMeta.subcollections = subcollections;
            subcollectionMeta.modules = modules;
            return subcollectionMeta;
        },

        _createModuleFromJSTreeItem: function (item) {
            var itemData = item.original;
            if (itemData === undefined) {
                itemData = item;
            }

            var moduleMeta = {
                title: itemData._title,
                document: itemData._document,
                version: itemData._version,
                repository: itemData._repository,
                id: itemData._id,
                versionAtThisCollectionVersion: itemData._versionAtThisCollectionVersion
            };
            return moduleMeta;
        },


        _getModuleState: function(moduleId, moduleVersion, callback) {
            var moduleUrl = "//www.{{ TOP_DOMAIN }}/edit/common/api/object/module/" + moduleId + "/" + moduleVersion + "/state";

            $.ajax({
                type: "get",
                url: moduleUrl,
                dataType: "json",
                success: function (data) {
                    callback(data.that, data.next);
                },
                error: function (jqXHR, status) {
                    var stack = $(jqXHR.responseText);
                    var err = _.where(stack, {className: 'error'});
                    BootstrapDialog.alert({
                        title: 'Problem przy pobieraniu informacji o module ' + moduleId + ', wersja: ' + moduleVersion,
                        message: err
                    });
                }
            });
        },

        _generateModuleMetaForm: function (itemData) {
            var _this = this;
            var moduleMeta = this._createModuleFromJSTreeItem(itemData);

            var editor = null;
            var nextVersion = null;

            var moduleStateIndicator = $('#editcoll-moduleState');

            var indicateModuleState = function(text, style) {
                moduleStateIndicator.val(text);
                // moduleStateIndicator.css('color', style);
            }

//            this._getModuleState(moduleMeta.document, moduleMeta.version, function(that, next) {
            this._getModuleState(moduleMeta.document, moduleMeta.versionAtThisCollectionVersion, function(that, next) {
                    if (that !== null) {
                        if (that.place == 'edit') {
                            indicateModuleState('Edycja Online', 'black');
                        } else if (that.place == 'repo') {
                            indicateModuleState('Repozytorium treści', 'black');
                        }
                        editor = that.editor;
                    } else {
                        editor = null;

                        indicateModuleState('Nie istnieje!', 'red');
                    }

                    if (next !== null) {
                        nextVersion = next.version;
                        var text = 'Wersja ' + next.version + ' znajduje się w ';
                        if (next.place == 'edit') {
                            text = text + ' edycji online';
                        } else if (next.place == 'repo') {
                            text = text + ' repozytorium treści';
                        }
                        $('#editcoll-moduleStateNext').val(text);
                    }

                    $('#editcoll-moduleViewButton').toggle(that !== null);
                    $('#editcoll-moduleEditButton').toggle(that !== null && that.place == 'edit' && that.editor !== null);
                    $('#editcoll-modulePageButton').toggle(that !== null && that.place == 'edit');

                    $('.editcoll-moduleNextVersion').toggle(next !== null);
                    $('.editcoll-moduleNextVersionButton').toggle(next !== null);
                    $("#editcoll-moduleImportAndEditButton").toggle(that !== null && that.place == 'repo' && next == null);
                    $("#editcoll-moduleImportButton").toggle(that !== null && that.place == 'repo');
                    $("#editcoll-moduleCloneButton").toggle(that !== null && that.place == 'edit');

                    var staleTitle = (that !== null && that.title !== moduleMeta.title);
                    $("#editcoll-moduleRefreshTitleButton").toggle(staleTitle);
                    if (staleTitle) {
                        $("#editcoll-refreshTitle-value").text(that.title);
                    }
                    if($("#editcoll-moduleCloneButton").css('display')=='none' && $("#editcoll-moduleRefreshTitleButton").css('display') == 'none') {
                        $("#editcoll-moduleCloneButton").before('Brak operacji dla tego obiektu');
                    }
                    // alert('here: ' + openEditor);
                    // if (that !== null && that.place == 'edit' && openEditor) {
                    //     alert('here');
                    //     openEditorInNewTab();
                    // }

            });

            $("#editcoll-moduleUpdateButton").off();
            $("#editcoll-moduleUpdateButton").on("click", stopPropagation(function(ev) {
                $("#editcoll-moduleVersionFull-input").val(nextVersion);
                this._updateModuleMetadata(itemData);
                $("#editcoll-moduleUpdateButton").hide();
                this.barEditorDriver.postPush();
            }.bind(this)));

            $("#editcoll-moduleRefreshTitleButton").off();
            $("#editcoll-moduleRefreshTitleButton").on("click", stopPropagation(function(ev) {
                var button = $("#editcoll-moduleRefreshTitleButton");
                $("#editcoll-moduleTitle-input").val(button.find('#editcoll-refreshTitle-value').text());
                this._updateModuleMetadata(itemData);
                button.hide();
                this.barEditorDriver.postPush();
            }.bind(this)));

            $("#editcoll-moduleViewButton").off();
            $("#editcoll-moduleViewButton").on("click", stopPropagation(function (event) {
                if (window.localStorage !== undefined) {
                    if (localStorage.getItem('epo.user.type') == null) {
                        localStorage.setItem('epo.user.type', 'student');
                    }
                }
                var collectionId = _this.collection.get("metadata").contentId;
                var collVersion = _this.collection.get("metadata").version;
                window.open('http://www.{{ TOP_DOMAIN }}/preview/reader/c/'+collectionId+'/v/'+collVersion+'/t/student-canon/m/'+moduleMeta.document, "_blank");
            }));

            $("#editcoll-modulePageButton").off();
            $("#editcoll-modulePageButton").on("click", stopPropagation(function (event) {
                var moduleId = moduleMeta.document;
                //var moduleVersion = moduleMeta.version;
                var moduleVersion = $("#editcoll-moduleVersionFull-input").val();

                var moduleUrl = "//www.{{ TOP_DOMAIN }}/edit/res/edit/" + EditorDriver.spaceId() + "/module/" + moduleMeta.document + "/" + moduleVersion;
                window.open(moduleUrl, "_blank");
            }));

            var openEditorInNewTab = function() {
                var moduleId = moduleMeta.document;
                //var moduleVersion = moduleMeta.version;
                var moduleVersion = $("#editcoll-moduleVersionFull-input").val();
                var collectionId = _this.collection.get("metadata").contentId;
                var collVersion = _this.collection.get("metadata").version;
                var spaceId = EditorDriver.spaceId(); //$("#editor-common-metadata").data('object-spaceid');
                sessionStorage["parentCollectionId_"+moduleId+"_"+moduleVersion]=collectionId+"/"+collVersion;
                window.open((editor ? editor.url : ('//www.{{ TOP_DOMAIN }}'+'/edit/line/editor/' + spaceId
                    + '/' + moduleId + '/' + moduleVersion))+'?c', "_blank");
                //window.open(editor.url + '?c', "_blank");
            }.bind(this);

            $("#editcoll-moduleEditButton").off();
            $("#editcoll-moduleEditButton").on("click", stopPropagation(openEditorInNewTab));

            var afterImportCallback = function(result) {
                var newId = result.identifier;
                var newVersion = result.version;

                $("#editcoll-moduleDoc-input").val(newId);
                $("#editcoll-moduleVersionFull-input").val(newVersion);
                $("#editcoll-moduleImportButton").hide();

                indicateModuleState('Edycja Online', 'black');
                this.updateModuleMetadataFinished = false;
                this._updateModuleMetadataIdVersion(itemData, newId, newVersion);
                var updateInterval = setInterval(function() {
                    if (this.updateModuleMetadataFinished == true) {
                        clearInterval(updateInterval);
                        this.barEditorDriver.postPush();
                        _this._generateModuleMetaForm(itemData);
                    }
                }.bind(this), 5);
            }.bind(this);

            CascadeForms.connectInitializer({
                button: $("#editcoll-moduleImportButton"),
                urlProvider: function() { return "//www.{{ TOP_DOMAIN }}/edit/store/api/import/" + EditorDriver.spaceId() + "/module"; },
                fixedInputsProvider: function() {
                    return {
                        identifier: moduleMeta.document,
                        version: moduleMeta.version,
                        mode: 'fixed'
                    };
                },
                successCallback: function(result) {
                    afterImportCallback(result);
                }.bind(this)
            });

            CascadeForms.connectInitializer({
                button: $("#editcoll-moduleImportAndEditButton"),
                urlProvider: function() { return "//www.{{ TOP_DOMAIN }}/edit/store/api/import/" + EditorDriver.spaceId() + "/module"; },
                fixedInputsProvider: function() {
                    return {
                        identifier: moduleMeta.document,
                        version: moduleMeta.version,
                        mode: 'continue'
                    };
                },
                successCallback: function(result) {
                    afterImportCallback(result);
                    //window.open('http://www.{{ TOP_DOMAIN }}/edit/line/editor/' + EditorDriver.spaceId() + '/' + result.identifier + '/' + result.version, "_blank");
                    openEditorInNewTab();
                }.bind(this)
            });

            CascadeForms.connectInitializer({
                button: $("#editcoll-moduleCloneButton"),
                urlProvider: function() { return "//www.{{ TOP_DOMAIN }}/edit/store/api/clone/" + EditorDriver.spaceId() + "/module/" + moduleMeta.document + "/" + moduleMeta.version; },
                successCallback: function(result) {
                    var parentId = this._treeAPI().get_parent(this._getSelectedNode());
                    var parentNode = this._treeAPI().get_node(parentId).original;
                    var parentTitle = parentNode._title;
                    var parentId = parentNode.id;
                    var newId = result.identifier;
                    var newVersion = result.version;
                    if (this.collection.get('metadata').title == parentTitle) {
                        parentTitle = 'root';
                    }
//                    BootstrapDialog.alert({
//                        title: 'Klonowanie modułu ukończone',
//                        message: 'Nowy moduł ma id: ' + newId
//                    });
                    _this.barEditorDriver.showMessage("Klonowanie modułu ukończone", "ok");
                    this.collection.setSelectedNodeId(newId);
                    this.collection.updateCollectionWithModule(parentTitle, parentId, newId, newVersion, result.title);
                    this._treeAPI().clear_state();
                    this._updateTree();
                    this.barEditorDriver.markChangeOccurred();
                }.bind(this)
            });


            $("#editcoll-moduleTitle-input").val(moduleMeta.title);
            $("#editcoll-moduleDoc-input").val(moduleMeta.document);
            $("#editcoll-repository-input").val(moduleMeta.repository);

            $("#editcoll-moduleVersionFull-input").val(moduleMeta.versionAtThisCollectionVersion);
            $("#editcoll-moduleVersionLatest-input").prop('checked', moduleMeta.version == 'latest');

            var output = _.template(ModuleXMLTemplate, moduleMeta);

            $('#editcoll-xml').val(output);

            var tableOfInputs = [
                $('#editcoll-moduleTitle-input'),
                $('#editcoll-moduleVersionFull-input'),
                $('#editcoll-moduleVersionLatest-input'),
                $('#editcoll-moduleDoc-input')
            ]
            _.each(tableOfInputs, function(input){
                input.focusout(function (event) {
                    if ($('#editcoll-title-input').val() == ''){
                        BootstrapDialog.alert({
                            title: 'Brak Tytułu',
                            message: 'Wprowadź tytuł kolekcji'
                        });
                    }
                    var val = $.trim(input.val());
                    input.val(val);
                    if (_this.oldFieldValue != val) {
                        _this._updateModuleMetadata(itemData);
                        _this.barEditorDriver.markChangeOccurred();
                        event.stopImmediatePropagation();
                    }
                });
                input.focusin(function (event) {
                    var val = $.trim(input.val());
                    _this.oldFieldValue = val;
                });
            });

        },

        _updateModuleMetadata: function (itemData) {
            var _this = this;
            if (_this.updating == false) {
                var moduleId = itemData.id;

                var attributesList = {
                    "title": $("#editcoll-moduleTitle-input").val(),
                    "document": $("#editcoll-moduleDoc-input").val(),
                    //"id": moduleId,
                    "id": $("#editcoll-moduleDoc-input").val(),
                    "repository": $("#editcoll-repository-input").val(),
                    "version": ($("#editcoll-moduleVersionLatest-input").prop('checked') ? 'latest' : $("#editcoll-moduleVersionFull-input").val()),
                    "versionAtThisCollectionVersion": $("#editcoll-moduleVersionFull-input").val()
                };
//                _this.collection.updateModuleMetadata(moduleId, attributesList);
                _this.collection.updateObjectAllMetadata(moduleId, attributesList);
                _this._updateTree();

            }
         },

         _updateModuleMetadataIdVersion: function (itemData, newId, newVersion) {
            var _this = this;
            if (_this.updating == false) {
                //var moduleTitle = itemData._title;
                var moduleId = itemData.id;
                var attributesList = {
                    "title": itemData._title,
                    "document": newId,
                    "id": newId,
                    "repository": itemData._repository,
                    "version": newVersion,
                    "versionAtThisCollectionVersion": newVersion
                };
                _this.collection.updateObjectAllMetadata(moduleId, attributesList);
                _this.collection.setSelectedNodeId(newId);
                _this._updateTree();
                _this.updateModuleMetadataFinished = true;

            }
         }
    });
});