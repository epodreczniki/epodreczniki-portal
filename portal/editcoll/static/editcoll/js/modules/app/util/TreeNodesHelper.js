define(['declare', 'jquery', 'underscore', './IdGenerator'], function (declare, $, _, IdGenerator) {
    return declare({
        'static': {
            createTreeData: function (collection) {
                var _this = this;
                var metadata = collection.get('metadata');
                var branch = _this._newBranch(collection, true);
                var treeData = [
                    {
                        id: metadata.contentId,
                        _content_id: metadata.contentId,
                        _title: metadata.title,
                        _subtitle: metadata.subtitle,
                        _repository: metadata.repository,
                        _version: metadata.version,
                        _created: metadata.created,
                        _revised: metadata.revised,
                        _language: metadata.language,
                        _license: metadata.license,
                        _education_level: metadata.educationLevellist,
                        _subjectlist: metadata.subjectlist,
                        _abstract: metadata._abstract,
                        _e_textbook: metadata.eTextbook,
                        _actors: metadata.actors,
                        _organizations: metadata.organizations,
                        _roles: metadata.roles,
                        _type: "collection",
                        text: metadata.title,
                        type: "root",
                        children: branch
                    }
                ];
                return treeData;
            },
            _newBranch: function(collection, withModules){
                var _this = this;
                var branches = [];
                var content = collection.get("content");
                content.forEach(function(object){
                    if (object.contentType == "subcollection") {
                        var branch = _this._subcollectionBranch(object, withModules);
                        var subCollBranch = {
                            id: (object.id ? object.id : (new IdGenerator('subcollection', 'simple')).getId()),
                            _viewAttributes: _this._subcollectionViewAttrs(object),
                            _title: object.title,
                            _type: "subcollection",
                            _order: object.order,
                            text: object.title,
                            type: "collection",
                            children: branch
                        }
                        branches.push(subCollBranch);
                    } else {
                        // module
                        if (withModules) {
                            var moduleBranch = {
                                id: (object.document ? object.document : object.title ),
                                _title: object.title,
                                _document: object.document,
                                _repository: object.repository,
                                _version: object.version,
                                _versionAtThisCollectionVersion: object.versionAtThisCollectionVersion,
                                _type: "module",
                                _order: object.order,
                                _id: (object.document ? object.document : object.title ),
                                text: object.title,
                                type: "module",
                                children: false
                            };
                            branches.push(moduleBranch);
                        }
                    }
                });
                return branches;
            },

            _subcollectionBranch: function (subcollection, withModules) {
                var _this = this;
                var branches = [];
                var content = subcollection.content;
                content.forEach(function(object){
                    if (object.contentType == "subcollection") {
                        var branch = _this._subcollectionBranch(object, withModules);
                        var subCollBranch = {
                            id: (object.id ? object.id : (new IdGenerator('subcollection', 'simple')).getId()),
                            _viewAttributes: _this._subcollectionViewAttrs(object),
                            _title: object.title,
                            _type: "subcollection",
                            _order: object.order,
                            text: object.title,
                            type: "collection",
                            children: branch
                        }
                        branches.push(subCollBranch);
                    } else {
                        // module
                        if (withModules) {
                            var moduleBranch = {
                                id: (object.document ? object.document : object.title ),
                                _title: object.title,
                                _document: object.document,
                                _repository: object.repository,
                                _version: object.version,
                                _versionAtThisCollectionVersion: object.versionAtThisCollectionVersion,
                                _type: "module",
                                _order: object.order,
                                _id: (object.document ? object.document : object.title ),
                                text: object.title,
                                type: "module",
                                children: false
                            };
                            branches.push(moduleBranch);
                        }
                    }
                });
                return branches;
            },

            _subcollectionViewAttrs: function (subcollection) {
                var viewAttrs = [];
                _.each(subcollection.viewAttributes, function (viewAttr) {
                    viewAttrs.push({
                        attrId: viewAttr.id,
                        attrType: viewAttr.type,
                        attrValue: viewAttr.value
                    });
                });
                return viewAttrs;
            },

            createTreeDataSubcollectionsOnly: function (collection) {
                var _this = this;
                var metadata = collection.get('metadata');
                var branch = _this._newBranch(collection, false);
                var treeData = [
                    {
                        id: metadata.contentId,
                        _content_id: metadata.contentId,
                        _title: metadata.title,
                        _subtitle: metadata.subtitle,
                        _repository: metadata.repository,
                        _version: metadata.version,
                        _created: metadata.created,
                        _revised: metadata.revised,
                        _language: metadata.language,
                        _license: metadata.license,
                        _education_level: metadata.educationLevellist,
                        _subjectlist: metadata.subjectlist,
                        _abstract: metadata._abstract,
                        _e_textbook: metadata.eTextbook,
                        _actors: metadata.actors,
                        _organizations: metadata.organizations,
                        _roles: metadata.roles,
                        _type: "collection",
                        text: metadata.title,
                        children: branch,
                        type: "root"
                    }
                ];
                return treeData;
            }
        }
    });
});

