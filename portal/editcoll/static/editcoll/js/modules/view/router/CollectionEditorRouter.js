define(['jquery',
    'underscore',
    'backbone',
    'modules/app/util/IdGenerator',
    'modules/parser/EPCollXMLParser',
    'text!modules/templates/EPCollXMLTemplate.html'
], function ($, _, Backbone, IdGenerator, EPCollXMLParser, EPCollXMLTemplate) {

    return Backbone.Router.extend({
        routes: {
            'edit/coll/:spaceId/:collectionId/:version': 'query'
        },

        initialize: function (props) {
            this.collection = props.model;
        },

        _loadCollection: function (xmlString) {
            var _this = this;
            var parser = new EPCollXMLParser();
            var document = parser.parseXML(xmlString);
            var metadata = {};
            if (document.collection[0].metadata !== undefined) {
                try {
                    metadata.contentId = document.collection[0].metadata[0]["content-id"] != undefined ? document.collection[0].metadata[0]["content-id"][0] : "";
                    metadata.repository = document.collection[0].metadata[0].repository != undefined ? document.collection[0].metadata[0].repository[0] : "";
                    metadata.version = document.collection[0].metadata[0].version != undefined ? document.collection[0].metadata[0].version[0] : "";
                    metadata.created = document.collection[0].metadata[0].created != undefined ? document.collection[0].metadata[0].created[0] : "";
                    metadata.revised = document.collection[0].metadata[0].revised != undefined ? document.collection[0].metadata[0].revised[0] : "";
                    metadata.title = document.collection[0].metadata[0].title != undefined ? document.collection[0].metadata[0].title[0] : "";
                    metadata.subtitle = document.collection[0].metadata[0].subtitle != undefined ? document.collection[0].metadata[0].subtitle[0] : "";
                    metadata.language = document.collection[0].metadata[0].language != undefined ? document.collection[0].metadata[0].language[0] : "";
                    metadata._abstract = document.collection[0].metadata[0]["abstract"] != undefined ? document.collection[0].metadata[0]["abstract"][0] : "";
                } catch(err) {
                    BootstrapDialog.alert("Problem z przetwarzaniem metadanych - "+ err);
                }
                try {
                    var license = {
                        "url": document.collection[0].metadata[0].license != undefined ? document.collection[0].metadata[0].license[0].url : null,
                        "name": document.collection[0].metadata[0].license != undefined ? document.collection[0].metadata[0].license[0].value : null
                    }
                    metadata.license = license;
                } catch(err) {
                    BootstrapDialog.alert("Problem z przetwarzaniem licencji - "+ err);
                }
                try {
                    var educationLvlList = [];
                    if (document.collection[0].metadata[0]["education-levellist"] != undefined) {
                        _.each(document.collection[0].metadata[0]["education-levellist"][0]["education-level"], function (educationLevel, idx) {
                            educationLvlList.push(educationLevel);
                        });
                    }
                    metadata.educationLevellist = educationLvlList;
                } catch(err) {
                    BootstrapDialog.alert("Problem z przetwarzaniem poziomu edukacji - "+ err);
                }
                try {
                    var subjectList = [];
                    if (document.collection[0].metadata[0].subjectlist != undefined) {
                        _.each(document.collection[0].metadata[0].subjectlist[0].subject, function (subject, idx) {
                            subjectList.push(subject.toLowerCase());
                        });
                    }
                    metadata.subjectlist = subjectList;
                } catch(err) {
                    BootstrapDialog.alert("Problem z przetwarzaniem tematów - "+ err);
                }
                try {
                    var eTextbook = {};
                    if (document.collection[0].metadata[0]["e-textbook"] != undefined) {
                        eTextbook = {
                            contentStatus: document.collection[0].metadata[0]["e-textbook"][0]["ep:content-status"],
                            recipient: document.collection[0].metadata[0]["e-textbook"][0]["ep:recipient"],
                            version: document.collection[0].metadata[0]["e-textbook"][0]["ep:version"],
//                        collectionHeader: document.collection[0].metadata[0]["e-textbook"][0].references != undefined ?
//                            document.collection[0].metadata[0]["e-textbook"][0].references[0]["collection-header"][0].reference[0]["ep:id"] : '',
//                        collectionHeaderTitlePresentation: document.collection[0].metadata[0]["e-textbook"][0].references != undefined ?
//                            document.collection[0].metadata[0]["e-textbook"][0].references[0]["collection-header"][0]["ep:title-presentation"] : '',
                            _class: document.collection[0].metadata[0]["e-textbook"][0]["class"] != undefined ? document.collection[0].metadata[0]["e-textbook"][0]["class"][0] : '',
                            volume: document.collection[0].metadata[0]["e-textbook"][0]["volume"] != undefined ? document.collection[0].metadata[0]["e-textbook"][0]["volume"][0] : '',
                            stylesheet: document.collection[0].metadata[0]["e-textbook"][0].stylesheet != undefined ? document.collection[0].metadata[0]["e-textbook"][0].stylesheet[0] : '',
                            environmentType: document.collection[0].metadata[0]["e-textbook"][0]["environment-type"] != undefined ? document.collection[0].metadata[0]["e-textbook"][0]["environment-type"][0] : '',
                            signature: document.collection[0].metadata[0]["e-textbook"][0].signature != undefined ? document.collection[0].metadata[0]["e-textbook"][0].signature[0] : '',
                            coverType: document.collection[0].metadata[0]["e-textbook"][0].cover != undefined ? document.collection[0].metadata[0]["e-textbook"][0].cover[0]["ep:cover-type"] : '',
                            cover: document.collection[0].metadata[0]["e-textbook"][0].cover != undefined ? document.collection[0].metadata[0]["e-textbook"][0].cover[0].value : '',
                            showTechnicalRemarks: document.collection[0].metadata[0]["e-textbook"][0]["show-technical-remarks"] != undefined ? document.collection[0].metadata[0]["e-textbook"][0]["show-technical-remarks"][0] : ''
                        }
                        if (document.collection[0].metadata[0]["e-textbook"][0]['learning-objectives'] != undefined) {
                            var learnObjcts = document.collection[0].metadata[0]["e-textbook"][0]['learning-objectives'][0];
                            eTextbook.learningObjectives = [];
                            _.each(learnObjcts["learning-objective"], function (learningObj, idx){
                                var learningObjective = {
                                    versionKey: learningObj["learning-objective-version"] != undefined ? learningObj["learning-objective-version"][0]["ep:key"] : '',
                                    version: learningObj["learning-objective-version"] != undefined ? learningObj["learning-objective-version"][0].value : '',
                                    stageKey: learningObj["learning-objective-stage"] != undefined ? learningObj["learning-objective-stage"][0]["ep:key"] : '',
                                    stage: learningObj["learning-objective-stage"] != undefined ? learningObj["learning-objective-stage"][0].value : '',
                                    schoolKey: learningObj["learning-objective-school"] != undefined ? learningObj["learning-objective-school"][0]["ep:key"] : '',
                                    school:  learningObj["learning-objective-school"] != undefined ? learningObj["learning-objective-school"][0].value : '',
                                    subjectKey: learningObj["learning-objective-subject"] != undefined ? learningObj["learning-objective-subject"][0]["ep:key"] : '',
                                    subject:  learningObj["learning-objective-subject"][0] != undefined ? learningObj["learning-objective-subject"][0].value : '',
                                    scopeKey: learningObj["learning-objective-scope"] != undefined ? learningObj["learning-objective-scope"][0]["ep:key"] : '',
                                    scope: learningObj["learning-objective-scope"] != undefined ? learningObj["learning-objective-scope"][0].value : '',
                                    nameKey: learningObj["learning-objective-name"] != undefined ? learningObj["learning-objective-name"][0]["ep:key"] : '',
                                    name: learningObj["learning-objective-name"] != undefined ? learningObj["learning-objective-name"][0].value : '',
                                    text: learningObj["learning-objective-text"] != undefined ? learningObj["learning-objective-text"][0] : ''
                                }
                                eTextbook.learningObjectives.push(learningObjective);
                            });
                        }
                        if (document.collection[0].metadata[0]["e-textbook"][0].references != undefined) {
                            var references = document.collection[0].metadata[0]["e-textbook"][0].references[0];
                            eTextbook.collectionToc = [];
                            _.each(references['collection-toc'], function(child, idx){
                                _.each(child.reference, function(obj, id){
                                    var referenceId = obj['ep:id'];
                                    var linksArray = [];
                                    var links = obj.link;
                                    _.each(links, function(link, inde){
                                        var tocLink = [link["ep:module-id"], link["ep:toc-id"]];
                                        linksArray.push(tocLink);
                                    });
                                    eTextbook.collectionToc.push([referenceId, linksArray]);
                                });
                            });

                            if (document.collection[0].metadata[0]["e-textbook"][0].references[0]["collection-header"] !== undefined) {
                                eTextbook.collectionHeader = document.collection[0].metadata[0]["e-textbook"][0].references[0]["collection-header"][0].reference[0]["ep:id"];
                                eTextbook.collectionHeaderTitlePresentation = document.collection[0].metadata[0]["e-textbook"][0].references[0]["collection-header"][0]["ep:title-presentation"];
                            }

                        }
                    }
//                console.log(eTextbook);
                    metadata.eTextbook = eTextbook;
                }catch(err){
                    BootstrapDialog.alert("Problem z przetwarzaniem 'eTextbook' - "+ err);
                }
                try {
                    var actors = [];
                    if (document.collection[0].metadata[0].actors != undefined) {
                        if (document.collection[0].metadata[0].actors[0].person != undefined) {
                            _.each(document.collection[0].metadata[0].actors[0].person, function (person, idx) {
                                var p = {
                                    userid: person.userid,
                                    firstname: person.firstname != undefined ? person.firstname[0] : '',
                                    surname: person.surname != undefined ? person.surname[0] : '',
                                    fullname: person.fullname != undefined ? person.fullname[0] : '',
                                    email: person.email != undefined ? person.email[0] : ''
                                }
                                actors.push(p);
                            });
                        }
                    }
                    metadata.actors = actors;

                    var organizations = [];
                    if (document.collection[0].metadata[0].actors != undefined) {
                        if (document.collection[0].metadata[0].actors[0].organization != undefined) {
                            _.each(document.collection[0].metadata[0].actors[0].organization, function (organization, idx) {
                                var o = {
                                    userid: organization.userid,
                                    fullname: organization.fullname != undefined ? organization.fullname[0] : '',
                                    shortname: organization.shortname != undefined ? organization.shortname[0] : ''
                                }
                                organizations.push(o);
                            });
                        }
                    }
                    metadata.organizations = organizations;
                }catch(err){
                    BootstrapDialog.alert("Problem z przetwarzaniem autorów - "+ err);
                }
                try {
                    var roles = [];
                    if (document.collection[0].metadata[0].roles != undefined) {
                        _.each(document.collection[0].metadata[0].roles[0].role, function (role, idx) {
                            var r = {
                                type: role.type,
                                value: role.value
                            }
                            roles.push(r);
                        });
                    }
                    metadata.roles = roles;
                } catch(err) {
                    BootstrapDialog.alert("Problem z przetwarzaniem ról - "+ err);
                }
            }
            _this.collection.clear();
            _this.collection.setDocument(xmlString);

            //console.log(xmlString);

//            _this.collection.clearSubcollections();
//            _this.collection.clearModules();

            _this.collection.clearContent();

            if (document.collection[0].content !== undefined) {
                var objectsList = [];
                $.each(document.collection[0].content[0], function(key, object){
                    try {
                        if (key == "subcollection" || key == "module") {
                            object.forEach(function(obj){
                                var contentObject = {};
                                contentObject.order = parseInt(obj._order, 10);
                                if (key == "subcollection") {
                                    contentObject.contentType = "subcollection";
                                    var title = obj.title != undefined ? obj.title[0] : '';
                                    contentObject.title = title;
                                    var id;
                                    if (obj["ep:id"] == null || obj["ep:id"] == "") {
                                        id = (new IdGenerator('subcollection', 'simple')).getId();
                                    } else {
                                        id = obj["ep:id"];
                                    }
                                    contentObject.id = id;
                                    var subcollectionModelViewAttrs = [];
                                    var viewAttrs = obj["view-attributes"] != undefined ? obj["view-attributes"][0] : [];
                                    var viewAttr = viewAttrs["view-attribute"] != undefined ? viewAttrs["view-attribute"] : [];
                                    _.each(viewAttr, function (vAttr) {
                                        var viewAttrObj = {
                                            type: vAttr["ep:type"]
                                        };
                                        if (vAttr["ep:id"] != null) {
                                            viewAttrObj.id = vAttr["ep:id"];
                                        }
                                        if (vAttr["ep:value"] != null) {
                                            viewAttrObj.value = vAttr["ep:value"];
                                        }
                                        subcollectionModelViewAttrs.push(viewAttrObj);
                                    });
                                    contentObject.viewAttributes = subcollectionModelViewAttrs;

                                    _this._createContentOfSubcollection(contentObject, obj.content[0]);
                                } else if(key == "module") {
                                    contentObject.contentType = "module";
                                    var module = _this._createModuleModel(obj);
                                    $.extend(contentObject, module);
                                }
                                objectsList.push(contentObject);
                            });
                        }
                    }catch(err){
                        BootstrapDialog.alert("Problem z przetwarzaniem subkolekcji/modułów - "+ err);
                    }

                });
                var sortedList = _.sortBy(objectsList, 'order');
                _this.collection.setContent(sortedList);
            }
            _this.collection.setMetadata(metadata);
        },

        _createContentOfSubcollection: function (subcollection, subcollectionContent){
            var objectsList = [];
            var _this = this;
            $.each(subcollectionContent, function(key, object) {
                if (key == "subcollection" || key == "module") {
                    object.forEach(function(obj){
                        var contentObject = {};
                        contentObject.order = parseInt(obj._order, 10);
                        if (key == "subcollection") {
                            contentObject.contentType = "subcollection";
                            var title = obj.title != undefined ? obj.title[0] : '';
                            contentObject.title = title;
                            var id;
                            if (obj["ep:id"] == null || obj["ep:id"] == "") {
                                id = (new IdGenerator('subcollection', 'simple')).getId();
                            } else {
                                id = obj["ep:id"];
                            }
                            contentObject.id = id;
                            var subcollectionModelViewAttrs = [];
                            var viewAttrs = obj["view-attributes"] != undefined ? obj["view-attributes"][0] : [];
                            var viewAttr = viewAttrs["view-attribute"] != undefined ? viewAttrs["view-attribute"] : [];
                            _.each(viewAttr, function (vAttr) {
                                var viewAttrObj = {
                                    type: vAttr["ep:type"]
                                };
                                if (vAttr["ep:id"] != null) {
                                    viewAttrObj.id = vAttr["ep:id"];
                                }
                                if (vAttr["ep:value"] != null) {
                                    viewAttrObj.value = vAttr["ep:value"];
                                }
                                subcollectionModelViewAttrs.push(viewAttrObj);
                            });
                            contentObject.viewAttributes = subcollectionModelViewAttrs;
                            _this._createContentOfSubcollection(contentObject, obj.content[0]);
                        } else if(key == "module") {
                            contentObject.contentType = "module";
                            var module = _this._createModuleModel(obj);
                            $.extend(contentObject, module);
                        }
                        objectsList.push(contentObject);
                    });
                }
            });
            var sortedList = _.sortBy(objectsList, 'order');
            subcollection.content = sortedList;
        },

        _createSubcollectionsFromContent: function (subcollection, content) {
            _this = this;
            if (content != undefined) {
                if (content[0].module != undefined) {
                    var modules = [];
                    _.each(content[0].module, function (module, idx) {
                        modules.push(_this._createModuleModel(module));
                    });
                    subcollection.modules = modules;
                }
                var subcollections = [];
                if (content[0].subcollection != undefined) {
                    _.each(content[0].subcollection, function (subcollection, idx) {
                        var innerSubcollectionModel = {};
                        var title = subcollection.title != undefined ? subcollection.title[0] : '';
                        innerSubcollectionModel.title = title;
                        var id;
                        if (subcollection["ep:id"] == null) {
                            id = (new IdGenerator('subcollection', 'simple')).getId();
                        } else {
                            id = subcollection["ep:id"];
                        }
                        innerSubcollectionModel.id = id;
                        var subcollectionModelViewAttrs = [];
                        var viewAttrs = subcollection["view-attributes"] != undefined ? subcollection["view-attributes"][0] : [];
                        var viewAttr = viewAttrs["view-attribute"] != undefined ? viewAttrs["view-attribute"] : [];
                        _.each(viewAttr, function (vAttr) {
                            //var viewAttrId = vAttr["ep:id"];
                            //var viewAttrType = vAttr["ep:type"] != null ? vAttr["ep:type"] : '';
                            //var viewAttrValue = vAttr["ep:value"] != null ? vAttr["ep:value"]: '';
                            var viewAttrObj = {
                                //id: viewAttrId
                                type: vAttr["ep:type"]
                                //value: viewAttrValue
                            };
                            if (vAttr["ep:id"] != null) {
                                viewAttrObj.id = vAttr["ep:id"];
                            }
                            if (vAttr["ep:value"] != null) {
                                viewAttrObj.value = vAttr["ep:value"];
                            }
                            subcollectionModelViewAttrs.push(viewAttrObj);
                        });
                        innerSubcollectionModel.viewAttributes = subcollectionModelViewAttrs;
                        if (subcollection.content != undefined) {
                            _this._createSubcollectionsFromContent(innerSubcollectionModel, subcollection.content);
                        }
                        subcollections.push(innerSubcollectionModel);
                    });
                    subcollection.subcollections = subcollections;
                }
            }
        },
        _createModuleModel: function (module) {
            var moduleModel = {};
            var title = module.title != undefined ? module.title[0] : '';
            var document = module.document;
            var repository = module.repository;
            var version = module.version;
            var verAtThisCollVer = module["cnxsi:version-at-this-collection-version"];
            moduleModel.title = title;
            moduleModel.document = document;
            moduleModel.id = document;
            moduleModel.repository = repository;
            moduleModel.version = version;
            moduleModel.versionAtThisCollectionVersion = verAtThisCollVer;
            return moduleModel;
        }
    });
});
