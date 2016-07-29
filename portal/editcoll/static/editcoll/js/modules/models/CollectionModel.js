define([
    'underscore',
    'backbone',
    'modules/app/util/IdGenerator',
    'text!modules/templates/EPCollXMLTemplate.html',
    'dateFormat'
], function (_, Backbone, IdGenerator, EPCollXMLTemplate, dateFormat) {

    var thisDate = new Date();
    var longDateFormat = 'yyyy-MM-dd HH:mm CET';

    return Backbone.Model.extend({
        defaults: {
            metadata: {
                contentId: "",
                repository: "http://epodreczniki.pcss.pl/repo/collxml",
                version: 1,
                created: dateFormat.format.date(thisDate, longDateFormat),
                revised: dateFormat.format.date(thisDate, longDateFormat),
                language: 'pl',
                title: 'Kolekcja',
                license: {"url": "http://creativecommons.org/licenses/by/3.0/pl/legalcode", "value": "CC"},
                educationLevellist: [],
                subjectlist: [],
                _abstract: null,
                eTextbook: {
                    contentStatus: "canon",
                    recipient: "student",
                    version: 1.1,
                    _class: null,
                    stylesheet: null,
                    environmentType: "normal",
                    signature: null,
                    cover: null,
                    showTechnicalRemarks: "true"
                },
                actors: [],
                organizations: [],
                roles: []
            },
            subcollections: [],
            modules: [],
            content: [],
            document: null
        },
        setTreeData: function (data) {
            this.set('treeData', data);
            this.save();
            this.trigger('collection:treeData:changed', this);
        },
        setSelectedTreeDataPath: function (pathId) {
            this.set('selectedTreeDataPath', pathId);
            this.save();
            this.trigger('collection:selectedTreeDataPath:changed', this);
        },
        clearTreeData: function () {
            this.set('treeData', null);
            this.set('selectedTreeDataPath', null);
            this.save();
            this.trigger('collection:treeData:changed', this);
        },
        setSelectedNodeId: function (selectedNodeId) {
            this.set('selectedNodeId', selectedNodeId);
            this.save();
            this.trigger('collection:selectedNodeId:changed', this);
        },
        setTargetNodeId: function (targetNodeId) {
            this.set('targetNodeId', targetNodeId);
            this.save();
            this.trigger('collection:targetNodeId:changed', this);
        },
        setDragSourceParent: function (dragSourceParent) {
            this.set('dragSourceParent', dragSourceParent);
            this.save();
            this.trigger('collection:dragSourceParent:changed', this);
        },
        setMetadata: function (newMetadata) {
            this.set("metadata", newMetadata);
            this.save();
            this.trigger('collection:metadata:changed', this);
        },
        clearMetadata: function () {
            this.set('metadata', {});
            this.save();
            this.trigger('collection:metadata:changed', this);
        },
//        setSubcollections: function (subcollections) {
//            this.set("subcollections", subcollections);
//            this.save();
//            this.trigger('collection:subcollections:changed', this);
//        },
//        addSubcollection: function (subcollection) {
//            var subcollections = this.get("subcollections");
//            subcollections.push(subcollection);
//            this.save();
//            this.trigger('collection:subcollections:changed', this);
//        },
//        clearSubcollections: function () {
//            this.set('subcollections', []);
//            this.save();
//            this.trigger('collection:subcollections:changed', this);
//        },
//        setModules: function (modules) {
//            this.set("modules", modules);
//            this.save();
//            this.trigger('collection:modules:changed', this);
//        },
//        addModule: function (module) {
//            var modules = this.get("modules");
//            modules.push(module);
//            this.save();
//            this.trigger('collection:modules:changed', this);
//        },
//        clearModules: function () {
//            this.set('modules', []);
//            this.save();
//            this.trigger('collection:modules:changed', this);
//        },
        setContent: function (content) {
            this.set("content", content);
            this.save();
            this.trigger('collection:content:changed', this);
        },
        clearContent: function () {
            this.set('content', []);
            this.save();
            this.trigger('collection:content:changed', this);
        },
        setDocument: function (doc) {
            this.set('document', doc);
            this.save();
            this.trigger('collection:document:changed', this);
        },
        clearDocument: function () {
            this.set('document', null);
            this.save();
            this.trigger('collection:document:changed', this);
        },
        updateCollection: function (parentTitle, parentId, subcollId, newSubcollectionTitle) {
            var newSubcollection = {
                id: subcollId,
                title: newSubcollectionTitle,
                viewAttrs: [],
                contentType: "subcollection",
                content: [],
                subcollections: [],
                modules: []
            };
            var content = this.get('content');
            if (parentTitle === undefined || parentTitle == 'root') {
                var lastOrder = 0;
                content.forEach(function(object){
                    lastOrder = parseInt(object.order);
                });
                newSubcollection.order = lastOrder + 1;
                content.push(newSubcollection);
            }
            var _this = this;
            content.forEach(function (object) {
                if(object.contentType == "subcollection"){
                    if (object.id == parentId) {
                        var subObjects = object.content;
                        var lastOrder = 0;
                        subObjects.forEach(function(object){
                            lastOrder = parseInt(object.order);
                        });
                        newSubcollection.order = lastOrder + 1;
                        subObjects.push(newSubcollection);
                    } else {
                        _this._updateSubcoll(object, parentId, subcollId, newSubcollectionTitle);
                    }
                }
            });

            this.setDocument(this._generateCollectionXML());
            this.save();
            this.trigger('collection:subcollections:changed', this);
        },
        _updateSubcoll: function (subcollection, parentId, subcollId, newSubcollectionTitle) {
            var _this = this;
            var content = subcollection.content;
            content.forEach(function(object){
                if (object.contentType == "subcollection") {
                    if(object.id == parentId){
                        var newSubcollection = {
                            id: subcollId,
                            title: newSubcollectionTitle,
                            viewAttrs: [],
                            contentType: "subcollection",
                            content: [],
                            subcollections: [],
                            modules: []
                        };
                        var subObjects = object.content;
                        var lastOrder = 0;
                        subObjects.forEach(function(object){
                            lastOrder = parseInt(object.order);
                        });
                        newSubcollection.order = lastOrder + 1;
                        subObjects.push(newSubcollection);
                    } else {
                        _this._updateSubcoll(object, parentId, subcollId, newSubcollectionTitle);
                    }
                }
            });
        },

        _addModuleToSubcollection: function (subcollection, parentTitle, module) {
            var _this = this;
            if (subcollection.subcollections != undefined) {
                _.each(subcollection.subcollections, function (subcoll) {
                    if (subcoll.title == parentTitle) {
                        if (subcoll.modules != undefined) {
                            subcoll.modules.push(module);
                        } else {
                            var newMod = [module];
                            subcoll.modules = newMod;
                        }
                    } else {
                        _this._addModuleToSubcollection(subcoll, parentTitle, module);
                    }
                });
            }
        },


        updateCollectionWithModule: function (parentTitle, parentId, _id, _version, title) {

            var newModule = {
                title: title,
                document: _id,
                id: _id,
                contentType: "module",
                repository: '',
                version: _version,
                versionAtThisCollectionVersion: _version
            };

            var content = this.get('content');
            if (parentTitle === undefined || parentTitle == 'root') {
                var lastOrder = 0;
                content.forEach(function(object){
                    lastOrder = parseInt(object.order);
                });
                newModule.order = lastOrder + 1;
                content.push(newModule);
            }
            var _this = this;
            content.forEach(function (object) {
                if (object.contentType == "subcollection") {
                    if(object.id == parentId){
                        var subObjects = object.content;
                        var lastOrder = 0;
                        subObjects.forEach(function(object){
                            lastOrder = parseInt(object.order);
                        });
                        newModule.order = lastOrder + 1;
                        subObjects.push(newModule);
                    } else {
//                        _this._updateSubcollWithModule(object, parentId, newModuleTitle, _version);
                         _this._updateSubcollWithModule(object, parentId, _id, _version);
                    }
                }
            });

            this.setDocument(this._generateCollectionXML());
            this.save();
            this.trigger('collection:subcollections:changed', this);
        },

        _updateSubcollWithModule: function (subcollection, parentId, newModuleTitle, _version) {
            var _this = this;
            var newModule = {
                title: newModuleTitle,
                document: newModuleTitle,
                contentType: "module",
                repository: '',
                version: _version,
                versionAtThisCollectionVersion: _version
            };
            subcollection.content.forEach(function (object) {
                if(object.contentType == "subcollection"){
                    if (object.id == parentId) {
                        var subObjects = object.content;
                        var lastOrder = 0;
                        subObjects.forEach(function(object){
                            lastOrder = parseInt(object.order);
                        });
                        newModule.order = lastOrder + 1;
                        subObjects.push(newModule);
                    } else {
                        _this._updateSubcollWithModule(object, parentId, newModuleTitle, _version);
                    }
                }
            });
        },

        _deleteObjectFromArray: function (objectContent, objectId) {
            var objectToRemove = null;
            objectContent.forEach(function (object) {
                if (object.id == objectId) {
                    objectToRemove = object;
                }
            });
            if (objectToRemove != null) {
                objectContent.splice($.inArray(objectToRemove, objectContent), 1);
            }
            var order = 0;
            objectContent.forEach(function (object) {
                object.order = order;
                order = order + 1;
            });
        },

        _deleteInnerObject: function(content, objectId){
            var _this = this;
            content.forEach(function (object) {
                if(object.contentType == "subcollection"){
                    var objContent = object.content;
                    _this._deleteObjectFromArray(objContent, objectId);
                    _this._deleteInnerObject(objContent, objectId);
                }
            });
        },

        deleteSubcollectionOrModule: function (objectId) {
            var _this = this;
            var content = _this.get('content');
            _this._deleteObjectFromArray(content, objectId);

            content.forEach(function (object) {
                if(object.contentType == "subcollection"){
                    var objContent = object.content;
                    _this._deleteObjectFromArray(objContent, objectId);
                    _this._deleteInnerObject(objContent, objectId);
                }
            });

            this.setDocument(this._generateCollectionXML());
            this.save();
            this.trigger('collection:subcollections:changed', this);
        },
        _generateCollectionXML: function () {
            var _this = this;
            var tempModel = {
                metadata: _this.get("metadata"),
                modules: _this.get("modules"),
                subcollections: _this.get("subcollections"),
                content: _this.get("content")
            };
            if(tempModel.metadata.eTextbook._class == 0) {
                delete tempModel.metadata.eTextbook._class;
            }
            var output = _.template(EPCollXMLTemplate, tempModel);
            //console.log(""+output);
            var flatOut = output.replace(/\r\n|\r|\t|  |\n/g, "");
//			return flatOut;
            return output;
        },
        updateMetadata: function (attrName, attrValues) {
            var metadata = this.get('metadata');
            $.each(metadata, function (key, element) {
                if (key == attrName) {
                    metadata[key] = attrValues;
                }
            });
            //console.log(">>> Updated metadata: ");
            //console.log(metadata);
            this.setMetadata(metadata);
            this.setDocument(this._generateCollectionXML());
            return this;
        },
        updateAllMetadata: function (attributes) {
            var metadata = this.get('metadata');
            $.each(attributes, function (key, element) {
                metadata[key] = element;
            });
           // console.log(">> updateAllMetadata");
           // console.log(metadata);
            this.setMetadata(metadata);
            this.setDocument(this._generateCollectionXML());
        },

        _updateInnerObjectMetadata: function(objContent, objectId, attributesName, attributesList){
            var _this = this;
            objContent.forEach(function (object) {
                if (object.contentType == "subcollection"){
                    if (object.id == objectId) {
                        $.each(object, function (key, element) {
                            if (key == attributesName) {
                                object[key] = attributesList;
                            }
                        });
                    } else {
                        var objContent = object.content;
                        _this._updateInnerObjectMetadata(objContent, objectId, attributesName, attributesList);
                    }
                } else {
                    // module
                    if (object.id == objectId) {
                        $.each(object, function (key, element) {
                            if (key == attributesName) {
                                object[key] = attributesList;
                            }
                        });
                    }
                }
            });

        },

        updateObjectMetadata: function (objectId, attributesName, attributesList){
            var _this = this;
            var content = _this.get('content');
            content.forEach(function (object) {
                if(object.contentType == "subcollection"){
                    if (object.id == objectId) {
                        $.each(object, function (key, element) {
                            if (key == attributesName) {
                                object[key] = attributesList;
                            }
                        });
                    } else {
                        var objContent = object.content;
                        _this._updateInnerObjectMetadata(objContent, objectId, attributesName, attributesList);
                    }
                } else {
                    // module
                    if (object.id == objectId) {
                        $.each(object, function (key, element) {
                            if (key == attributesName) {
                                object[key] = attributesList;
                            }
                        });
                    }
                }
            });
        },

        _updateInnerSubcollectionMetadata: function (objContent, objectId, attributesList){
            var _this = this;
            objContent.forEach(function (object) {
                if (object.contentType == "subcollection") {
                    if (object.id == objectId) {
                        object.title = attributesList["title"];
                        object.viewAttributes = attributesList["viewAttributes"];
                    } else {
                         var objContent = object.content;
                        _this._updateInnerSubcollectionMetadata(objContent, objectId, attributesList);
                    }
                } else {
                    //module
                    if (object.id == objectId) {
                        object.id = attributesList["id"];
                        object.title = attributesList["title"];
                        object.document = attributesList["document"];
                        object.repository = attributesList["repository"];
                        object.version = attributesList["version"];
                        object.versionAtThisCollectionVersion = attributesList["versionAtThisCollectionVersion"];
                    }
                }
            });
        },

        updateObjectAllMetadata: function (objectId, attributesList){
            var _this = this;
            var content = _this.get('content');
            content.forEach(function (object) {
                if (object.contentType == "subcollection"){
                    if (object.id == objectId) {
                        object.title = attributesList["title"];
                        object.viewAttributes = attributesList["viewAttributes"];
                    } else {
                         var objContent = object.content;
                        _this._updateInnerSubcollectionMetadata(objContent, objectId, attributesList);
                    }
                } else {
                    //module
                    if (object.id == objectId) {
                        object.id = attributesList["id"];
                        object.title = attributesList["title"];
                        object.document = attributesList["document"];
                        object.repository = attributesList["repository"];
                        object.version = attributesList["version"];
                        object.versionAtThisCollectionVersion = attributesList["versionAtThisCollectionVersion"];
                    }
                }
            });
        },

        hasModule: function(id){
            var found = false;
            var _this = this;
            var content = _this.get("content");
            content.forEach(function(object){
                if (object.contentType == "subcollection") {
                    function internalSearch(cont, idn){
                        cont.forEach(function(obj){
                            if (obj.contentType == "subcollection") {
                                internalSearch(obj.content, idn);
                            } else {
                                //module
                                if (obj.id == idn) {
                                    found = true;
                                    return;
                                }
                            }
                        });
                    }
                    internalSearch(object.content, id);
                } else {
                    //module
                    if (object.id == id) {
                        found = true;
                        return;
                    }
                }
            });
            return found;
        }

    });
});
