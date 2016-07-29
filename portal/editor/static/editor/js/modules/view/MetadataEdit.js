define(['jquery',
    'underscore',
    'backbone',
    'modules/parser/EPXMLParser',
    'modules/app/util/IdGenerator',
    'modules/ui_widget/LicenseSelectDialog',
    'modules/ui_widget/FormDialog',
    'modules/ui_widget/SearchCCDialog',
    //'modules/ui_widget/WOMISelectDialog',
    'womi_dialog',
    'modules/ui_widget/EducationDialog',
    'text!modules/templates/schema_edit/FullForm.html',
    'text!modules/templates/schema_edit/Editable.html'
], function ($, _, Backbone, EPXMLParser, IdGenerator, LicenseSelectDialog, FormDialog, SearchCCDialog, WOMISelectDialog, EducationDialog, FullForm, Editable) {
    return Backbone.View.extend({
        blackList: ['content', 'roles'],
        defaultIdNames: ['userid', 'module-id', 'id'],

        initialize: function (params) {
            this.cache = params.cache;
            this.womiSelectDialog = new WOMISelectDialog({treeData: this.cache.get('treeData'), selectedPath: this.cache.get('selectedTreeDataPath'), saveCallback: function (id, selectedWomi) {}});
            //this.womiSelectDialog = new WOMISelectDialog({saveCallback: function () {}});
            this.listenTo(this.cache, 'cache:author:changed', this.cacheAuthorChanged);
            this.listenTo(this.model, 'change:metadata', this._metadataChanged);
            this.listenTo(this.cache, 'change:ccommand', this._ccommandChanged);
            this.listenTo(this.cache, 'change:pin', this._pinsChanges);
            this.listenTo(this.cache, 'change:educations', this._educationsChanges);
            //this._initFields();
            //this._initTree();
            this._initFieldsEditor();
            this.cacheAuthorChanged();

        },
//        _initFields: function () {
//            var _this = this;
//            var el = this.$el;
//            el.html('');
//            var metadata = this.model.get('metadata');
//            this._loopMetadata(metadata.document, 'document', 'document');
//            el.find('.saveButton').button().click(function () {
//                _this.model.set('metadata', _this._serializeData());
//                _this.model.save();
//            });
//        },

        _initFieldsEditor: function () {
            var metadata = this.model.get('metadata');
            var p = new EPXMLParser();
            var actor = p.schemaObject('document.metadata.actors.person');
            var cc = p.schemaObject('document.metadata.e-textbook-module.core-curriculum-entries.core-curriculum-entry');
            var authors = [];
            if (metadata.document[0].metadata[0].actors !== undefined) {
            	if(metadata.document[0].metadata[0].actors[0].person !== undefined){
            		authors = metadata.document[0].metadata[0].actors[0].person;
            	}else{
            		metadata.document[0].metadata[0].actors[0].person = [];
            		this.authors = authors;
            	}
            }
            var ccs = [];
            
            if(this.cache.get('ccs') !== undefined){
            	ccs = this.cache.get('ccs');
            }
            this.ccs = ccs;

    		var license = '';
            var licenseUrl = '';
            if (metadata.document[0].metadata[0].license != undefined) {
            	license = metadata.document[0].metadata[0].license[0].value;
            	licenseUrl = metadata.document[0].metadata[0].license[0].url;
            	if(license == ''){
            		license = licenseUrl;
            	}
            }

            var ccommands = [];
            if (this.cache.get('ccommands') !== undefined) {
            	ccommands = this.cache.get('ccommands');
            }
            this.ccommands = ccommands;

            var pins = [];
            if(this.cache.get('pins') !== undefined){
            	pins = this.cache.get('pins');
            }
            this.pins = pins;
            
            var educations = [];
            if(this.cache.get('educations') !== undefined){
            	educations = this.cache.get('educations');
            }
            this.educations = educations;

            this.form = $(_.template(FullForm, {
                title: metadata.document[0].title[0],
                license: license,
                licenseUrl: licenseUrl,
                authors: {
                    list: authors,
                    template: actor.children
                },
                cc: {
                    list: ccs,
                    template: cc.children
                },
                ccommands: ccommands,
                educations: educations,
                pins: pins
            }));
            var _this = this;
            this.form.find('#add-author').button().click(function () {
                var form = _this._createSaveForm('Dodaj autora', actor, authors,function (attrs, obj) {
                    obj.userid = (new IdGenerator(obj.email, 'simple')).getId();
                    _this.cache.putAuthor(obj);
                });
                form.open();
                var firstname = "";
                var surname = "";
                $(form.dialog).find('input[data-attr="firstname"]').focusout(function(){
                	firstname = $(this).val();
                	fullNameSet(firstname, surname);
            	});

                $(form.dialog).find('input[data-attr="surname"]').focusout(function(){
                	surname = $(this).val();
                	fullNameSet(firstname, surname);
            	});

                function fullNameSet(firstname, surrname){
                	$(form.dialog).find('input[data-attr="fullname"]').val(firstname+" "+surname);
                }

            });
            this.form.find('#add-author-menu').button({
                text: false,
                icons: {
                    primary: "ui-icon-triangle-1-s"
                }
            }).click(function () {
                var menu = _this.form.find("#add-author-menu-items").show().position({
                    my: "right top",
                    at: "right bottom",
                    of: this
                });
                $(document).one("click", function () {
                    menu.hide();
                });
                return false;
            }).parent().buttonset();
            this.form.find("#add-author-menu-items").hide().menu();

            this.form.find("#add-education").button().click(function(){
            	var educationDialog = new EducationDialog({
            		saveCallback: function(education){
            			_this.cache.putEducation(education);
            			//_this.cache.save();
            			_this.cache.trigger('change:educations', self.cache);
            			educationDialog.close();
            		}
            	}); 
            	educationDialog.open();
            });
            
            this.form.find('#add-cc').button().click(function () {
                var form = _this._createSaveForm('Dodaj podstawę programową', cc, ccs, function (attrs, obj) {
                });
                _this._ccTuneSaveForm('Dodaj podstawę programową', cc, ccs, form);
                form.open();
            });
            this.form.find('#add-ccommand').button().click(function(){
            	var form = _this._createCCommandForm("Dodaj polecenie", ccommands);
            	form.open();
            });

            this.form.find('#add-pin').button().click(function(){
            	var womiDialog = _this.womiSelectDialog;
            	womiDialog.saveCallback = function (id, selectedWomi, treeData, selectedPath) {
            		_this.cache.setTreeData(treeData);
            		_this.cache.setSelectedTreeDataPath(selectedPath);
                	_this.cache.putPin(id);
                    _this.cache.trigger('change:pin', _this.cache);
                    womiDialog.close();
                };
                womiDialog.show();
            });

            this.form.find('#metadata-license').click(function () {
                var self = $(this);
                var d = new LicenseSelectDialog({
                    saveCallback: function (url, val) {
                    	self.data('url', url);
                    	self.val(val);
                    	metadata.document[0].metadata[0].license[0].url = _this.form.find('#metadata-license').data('url');
                        metadata.document[0].metadata[0].license[0].value = _this.form.find('#metadata-license').val();
                        _this.model.save();
                        _this.model.trigger('change:metadata', _this.model);
                        d.close();
                    }
                });
                var defaultVal = _this.form.find('#metadata-license').val();
                d.defaultValue = defaultVal;
                d.open();
            });

//            this.form.find('[data-role="update-meta"]').button().click(function () {
//                metadata.document[0].metadata[0].license[0].url = _this.form.find('#metadata-license').data('url');
//                metadata.document[0].metadata[0].license[0].value = _this.form.find('#metadata-license').val();
//                metadata.document[0].title[0] = _this.form.find('#meta-module-title').val();
//                metadata.document[0].metadata[0].title[0] = metadata.document[0].title[0];
//
//                _this.model.save();
//                _this.model.trigger('change:metadata', _this.model);
//            });
            
            this._connectButtons('authors', authors);
            this._connectButtons('cc', ccs);
            this._connectButtons('education', educations);
            this._connectButtons('ccommand', ccommands);
            this._connectButtons('pins', pins);
            
            _this.form.find('#meta-module-title').focusout(function(){
            	 metadata.document[0].title[0] = _this.form.find('#meta-module-title').val();
            	 metadata.document[0].metadata[0].title[0] = metadata.document[0].title[0];
            	 _this.model.save();
                 _this.model.trigger('change:metadata', _this.model);
            });
            
            var el = this.$el;
            el.html('');
            el.append(this.form);
        },

        _connectButtons: function (secName, arrayObj) {
            var section = this.form.find('[data-role="' + secName + '"]');
            var _this = this;
            if((secName == 'ccommand') || (secName == 'pins') || (secName == 'education')){
            	section.find('[data-role="delete"]').each(function (index, element) {
                    $(element).button().click(function () {
                    	//var question = (secName == 'ccommand') ? 'Czy na pewno chcesz usunąć polecenie ?' : 'Czy na pewno chcesz usunąć przypinkę ?';
                    	var question = '';
                    	if(secName == 'ccommand'){
                    		question = 'Czy na pewno chcesz usunąć polecenie ?';
                    	}else if(secName == 'pins'){
                    		question = 'Czy na pewno chcesz usunąć przypinkę ?';
                    	}else if(secName == 'education'){
                    		question = 'Czy na pewno chcesz usunąć edukację ?';
                    	}
                    	
                        if (confirm(question)) {
                        	arrayObj.splice($(this).data('index'), 1);
                            //_this.cache.save();
                            _this.cache.trigger('change:ccommand', _this.cache);
                            _this.cache.trigger('change:pin', _this.cache);
                        }
                    });
                });
            	if(secName == 'education'){
            		section.find('[data-role="update"]').each(function (index, element) {
            			var item = $(element).closest('[data-role="item"]');
            			$(element).button().click(function () {
            				var indx = $(this).data('index');
            				var value = item.find('textarea').val();
            				arrayObj[indx]['authors-comment'][0] = value;
            				//_this.cache.save();
            				_this.cache.trigger('change:education', _this.cache);
            			});
            		});
            	}else{
            		section.find('[data-role="update"]').each(function (index, element) {
            			var item = $(element).closest('[data-role="item"]');
            			$(element).button().click(function () {
            				var indx = $(this).data('index');
            				var value = item.find('input').val();
            				arrayObj[indx] = value;
            				//_this.cache.save();
            				_this.cache.trigger('change:ccommand', _this.cache);
            				_this.cache.trigger('change:pin', _this.cache);
            			});
            		});
            	}
            }else{
            	section.find('[data-role="delete"]').each(function (index, element) {
                    $(element).button().click(function () {
                        if (confirm('Czy na pewno chcesz usunąć element?')) {
                            arrayObj.splice($(this).data('index'), 1);
                            _this.model.save();
                            _this.model.trigger('change:metadata', _this.model);
                        }
                    });
                });
                section.find('[data-role="update"]').each(function (index, element) {
                    var item = $(element).closest('[data-role="item"]');
                    $(element).button().click(function () {
                        var inx = $(this).data('index');
                        var emailValid = true;
                        item.find('input, textarea').each(function (idx, element) {
                            var t = $(this);
                            if(secName == 'authors'){
                            	if(idx == 3){
                            		if(t.val() == ''){
                            			alert("Proszę wprowadzić adres e-mail !!!");
                            			emailValid = false;
                            		}else{
                                    	if(!_this._isValidEmailAddress(t.val())){
                                    		alert("Niewłaściwy adres e-mail !!!");
                                    		emailValid = false;
                                    	}else{
                                    		arrayObj[inx][t.data('role')][0] = t.val();
                                    		emailValid = true;
                                    	}
                                    }
                            	}else{
                            		arrayObj[inx][t.data('role')][0] = t.val();
                            		emailValid = true;
                            	}
                            }else if(secName == 'cc'){
                            	if(t.data('role') == 'authors-comment'){
                            		arrayObj[inx][t.data('role')][0] = t.val();
                                	emailValid = true;
                            	}
                            }else{
                            	arrayObj[inx][t.data('role')][0] = t.val();
                            	emailValid = true;
                            }
                        });
                        if(emailValid){
                        	_this.model.save();
                            _this.model.trigger('change:metadata', _this.model);
                        }
                    });
                });
                if(secName == 'authors'){
                	var authorMetadata = section.find("li.metadata-item");
                	_.each(authorMetadata, function(el){
                		var firstname = "";
                		var surname = "";
                		$(el).find('[data-role="firstname"]').focusout(function(){
                			firstname = $(this).val();
                			_this.fullNameSett($(el), firstname, surname);
                		});
                		$(el).find('[data-role="surname"]').focusout(function(){
                			surname = $(this).val();
                			_this.fullNameSett($(el), firstname, surname);
                		});
                	});
                }
            }
        },

        fullNameSett: function (element, firstname, surname){
        	element.find('input[data-role="fullname"]').val(firstname +" "+ surname);
        },

        ccMap: {
            'core-curriculum-stage': 'stages.0.name',
            'core-curriculum-stage-key': 'stages.0.code',
            'core-curriculum-school': 'schools.0.name',
            'core-curriculum-school-key': 'schools.0.code',
            'core-curriculum-subject': 'subject.name',
            'core-curriculum-subject-key': 'subject.code',
            'core-curriculum-version': 'versions.0.code',
            'core-curriculum-version-key': 'versions.0.doc_reference',
            'core-curriculum-ability': 'name',
            'core-curriculum-ability-key': 'summary_code'
        },

        _createSaveForm: function (title, fields, object, callback) {
            var _this = this;
            var formFields = [];
            _.each(fields.children, function (field) {
                formFields.push({
                    id: (new IdGenerator(field.tag)).getId(),
                    name: field.tag,
                    label: field.label || field.tag,
                    value: ''
                });
            });
            return new FormDialog({
                header: title,
                fields: formFields,
                saveCallback: function (attrs) {
                	if(typeof attrs.email != 'undefined'){
                		if(attrs.email == ''){
                			alert("Proszę wprowadzić adres e-mail !");
                		}else{
                			if(!_this._isValidEmailAddress(attrs.email)){
                        		alert("Niewłaściwy adres e-mail !");
                        	}else{
                        		var obj = {};
                                _.each(fields.children, function (field) {
                                    obj[field.tag] = [attrs[field.tag]];
                                });
                                object.push(obj);
                                callback(attrs, obj);
                                _this.model.save();
                                _this.model.trigger('change:metadata', _this.model);
                                this.close();
                        	}
                		}
                	}else{
                		var obj = {};
                        _.each(fields.children, function (field) {
                            obj[field.tag] = [attrs[field.tag]];
                        });
                        object.push(obj);
                        callback(attrs, obj);
                        _this.model.save();
                        _this.model.trigger('change:metadata', _this.model);
                        this.close();
                	}
                }
            });
        },

        _isValidEmailAddress: function(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        },

        _ccTuneSaveForm: function (title, fields, object, form) {
            var self = this;
            form._afterCreate = function () {
                var _this = this;
                var search = $('<button>').button({label: 'Wyszukaj...'}).click(function () {
                    if (!_this.searchDialog) {
                        _this.searchDialog = new SearchCCDialog({ saveCallback: function (item) {
                            form.close();
                            var formFields = [];
                            _.each(fields.children, function (field) {
                                formFields.push({
                                    id: (new IdGenerator(field.tag)).getId(),
                                    name: field.tag,
                                    label: field.label || field.tag,
                                    key: field.tag != 'authors-comment' ? _.reduce(self.ccMap[field.tag+"-key"].split('.'), function(m, p){ return m[p]; }, item.toJSON()) : 'authors-comment',
                                    value: field.tag != 'authors-comment' ? _.reduce(self.ccMap[field.tag].split('.'), function(m, p){ return m[p]; }, item.toJSON()) : ''
                                });
                            });
                            var newForm = new FormDialog({fields: formFields, header: title, saveCallback: function (attrs){
                            		var obj = {};
                            		_.each(formFields, function (field) {
                            			if(field.key == 'authors-comment'){
                            				obj[field.name] = [attrs['authors-comment']];
                            			}else{
                            				var fieldObj = {
                                					value : field.value,
                                					"ep:key" : field.key
                                			};
                            				obj[field.name] = $.makeArray(fieldObj);
                            			}
                            		});
                                    object.push(obj);
                                    
                                    self.cache.set('ccs', object);
                                    //self.cache.save();
//                                    self.cache.trigger('change:ccs', self.cache);
                                    self.model.trigger('change:metadata', self.model);
                                    this.close();
                            	} 
                            });
                            _this.searchDialog.close();
                            newForm.open();
                        }});
                    }
                    _this.searchDialog.open();
                });
                this.dialog.prepend(search);
            };
        },

        _createCCommandForm: function (title){
        	var _this = this;
        	var formFields = [''];
            return new FormDialog({
                header: title,
                fields: formFields,
                isCCommandsForm: true,
                saveCallback: function (attr) {
                	 _this.cache.putCcommand(attr);
                     //_this.cache.save();
                     _this.cache.trigger('change:ccommand', _this.cache);
                     this.close();
                }
            });
        },

        _initTree: function () {
            var _this = this;
            var el = this.$el;
            el.html('');
            var tree = $('<div>', {'class': 'metadata-tree aciTree'});
            this.tree = tree;
            var editArea = $('<div>', {'class': 'metadata-edit-area'});
            el.append(tree);
            el.append(editArea);
            this.editArea = editArea;
            function prepareData(d, obj, key) {
                if (typeof obj != 'string') {
                    var hasObj = false;
                    _.each(_.keys(obj), function (k) {
                        if (typeof obj[k] != 'string' && _.indexOf(_this.blackList, k) == -1) {
                            var o = {
                                label: k,
                                branch: [],
                                inode: true,
                                path: d.path + '.' + k
                            };
                            d.branch.push(o);
                            hasObj = true;
                            prepareData(o, obj[k], k);
                        }
                    });
                    if (!hasObj) {
                        d.inode = false;
                    }
                }
            }

            var root = { id: 'root', branch: [], label: 'document', inode: true, path: 'document'};
            //console.log(JSON.stringify(this.model.get('metadata')));
            prepareData(root, this.model.get('metadata').document, 'document');
            tree.aciTree({
                rootData: [root],
                selectable: true,
                expand: true
            }, null, 'json');
            tree.on('acitree', function (event, api, item, eventName, options) {
                if (eventName == 'selected') {
                    var itemData = api.itemData(item);
                    //alert(itemData.path);
                    var o = _this._getObj(_this.model.get('metadata'), itemData.path);
                    var attrs = _this._loopMetadata(o[0][o[1]], o[1], itemData.path);
                    var p = new EPXMLParser();
                    var schemaObject = p.schemaObject(itemData.path);
                    var _new = false;
                    if (schemaObject && schemaObject.related != undefined) {
                        attrs = [];
                        var rel = _.where(schemaObject.children, {tag: schemaObject.related})[0];
                        _.each(rel.attrs, function (child) {
                            attrs.push({name: child, value: _this._createValue(child), id: itemData.path})
                        });
                        _.each(rel.children, function (child) {
                            attrs.push({name: child.tag, value: _this._createValue(child), id: itemData.path });
                        });
                        _new = true;
                    }
                    var _del = false;
                    if (!isNaN(o[1])) {
                        _del = true;
                    }
                    _this.editArea.html(_.template(Editable, {attrs: attrs, header: o[1], '_new': _new, '_del': _del, path: itemData.path}));
                    _this.editArea.find('input[name="document.0.metadata.0.license.0.url"]').click(function () {
                        var self = $(this);
                        var d = new LicenseSelectDialog({
                            saveCallback: function (url) {
                                self.val(url);
                                d.close();
                            }
                        });
                        d.open();
                    });
                    _this._registerButtons(item);
                }
            });
            setTimeout(function () {
                var api = tree.aciTree('api');
                api.searchId(true, true, {
                    success: function (item, options) {
                        api.open(item);
                        api.option('expand', false);
                    },
                    id: 'root'
                });
            }, 2000);
        },

        _createValue: function (name, salt) {
            salt = salt || name;
            if (_.indexOf(this.defaultIdNames, name) != -1) {
                return (new IdGenerator(salt, 'simple')).getId();
            }

            return '';
        },

        _registerButtons: function (item) {
            var _this = this;
            var api = _this.tree.aciTree('api');
            this.editArea.find('[data-role="save"]').button().click(function () {
                $(this).parent().find('input').each(function (index, element) {
                    var o = _this._getObj(_this.model.get('metadata'), $(element).attr('id'));
                    o[0][o[1]] = $(element).val();
                    _this.model.save();
                });
                return false;
            });
            this.editArea.find('[data-role="delete"]').button().click(function () {

                var o = _this._getObj(_this.model.get('metadata'), $(this).data('del'));
                delete o[0][o[1]];
                var compacted = _.compact(o[0]);
                Array.prototype.splice.apply(o[0], [0, o[0].length].concat(compacted));
                _this.model.save();
                var parent = api.parent(item);
                var self = this;
                api.unload(parent, {
                    success: function (item, options) {
                        var itemData = [];
                        var rootPath = ($(self).data('del').split('.'));
                        rootPath.pop();
                        rootPath = rootPath.join('.');
                        for (var i = 0; i < o[0].length; i++) {
                            itemData.push({
                                label: '' + i,
                                path: rootPath + '.' + i
                            })
                        }
                        api.append(parent, {itemData: itemData});
                        api.select(parent);
                    }
                });
                return false;
            });

            this.editArea.find('[data-role="create"]').button().click(function () {
                var o = _this._getObj(_this.model.get('metadata'), $(this).data('create'));
                var newElem = {};
                $(this).parent().find('input').each(function (index, element) {
                    newElem[$(element).data('attr')] = $(element).val();
                });
                o[0][o[1]].push(newElem);
                _this.model.save();

                var id = o[0][o[1]].length - 1;
                api.setInode(item);
                api.append(item, {
                    success: function (_item, options) {
                        api.select(_item);
                    },
                    itemData: {
                        label: id,
                        path: $(this).data('create') + '.' + id
                    }});
                return false;
            });
        },

        _metadataChanged: function (model, options) {
            model.regenerateDefaults();
            //this._initFields();
            //this._initTree();
            this._initFieldsEditor();
            this.cacheAuthorChanged();
            addLeaveWarning();
        },

        _ccommandChanged: function (cache, options) {
        	this._initFieldsEditor();
        },

        _pinsChanges: function (cache, options) {
        	this._initFieldsEditor();
        },
        
        _educationsChanges: function(cache, options){
        	this._initFieldsEditor();
        },

        _getObj: function (root, path) {
            var objects = path.split('.');
            var tmpObj = root;
            var lastKey, lastObj;
            _.each(objects, function (o) {
                var _o = o;
                if (o.indexOf('[]') > 0) {
                    _o = o.substring(0, o.indexOf('[]'));
                }
                if (!tmpObj[_o]) {
                    if (o.indexOf('[]') > 0) {
                        tmpObj[_o] = [];
                    } else {
                        tmpObj[_o] = {};
                    }
                }
                lastObj = tmpObj;
                tmpObj = tmpObj[_o];
                lastKey = _o;
            });
            return [lastObj, lastKey];
        },

        _serializeData: function () {
            var obj = {document: {}};

            function setObj(path, val) {
                var objects = path.split('.');
                var tmpObj = obj;
                var lastKey, lastObj;
                _.each(objects, function (o) {
                    var _o = o;
                    if (o.indexOf('[]') > 0) {
                        _o = o.substring(0, o.indexOf('[]'));
                    }
                    if (!tmpObj[_o]) {
                        if (o.indexOf('[]') > 0) {
                            tmpObj[_o] = [];
                        } else {
                            tmpObj[_o] = {};
                        }
                    }
                    lastObj = tmpObj;
                    tmpObj = tmpObj[_o];
                    lastKey = _o;
                });
                lastObj[lastKey] = val;
            }

            this.$el.find('input').each(function (index, element) {
                var e = $(element);
                setObj(e.attr('name'), e.val());
            });
            return obj;
        },

        _loopMetadata: function (parent, name, concatKey) {
            var _this = this;
            var div = $('<div>');
            var stackObj = [];
            var attrs = [];
            var keys = _.keys(parent);
            _.each(_.without.apply(undefined, [keys].concat(this.blackList.concat(['_value']))), function (key) {
                if (Array.isArray(parent[key])) {
                    stackObj.push(key);
                } else if (typeof parent[key] == 'object') {
                    stackObj.push(key);
                } else if (typeof parent[key] == 'string') {
                    attrs.push({
                        name: key,
                        prettyName: key,
                        value: parent[key].replace(/"/g, '&quot;'),
                        id: concatKey + '.' + key
                    });
                }
            });
            if (_.has(parent, '_value') && keys.length == 1) {
                attrs.push({
                    name: 'value',
                    prettyName: 'value',
                    value: parent['value'].replace(/"/g, '&quot;'),
                    id: concatKey + '.' + 'value'
                });
            }
            //this.editArea.html(_.template(Editable, {attrs: attrs, header: name}));
            return attrs;
//            _.each(stackObj, function (key) {
//                //_this._loopMetadata(parent[key], key, concatKey + '.' + (Array.isArray(parent[key]) ? key + '[]' : key));
//            });
        },

        cacheAuthorChanged: function () {
            var _this = this;
            var menuItems = this.$el.find('#add-author-menu-items');
            menuItems.html('');
            var authors = this.cache.get('authors');

            if (Object.keys(authors).length > 0) {
                menuItems.append('<li data-value="-1"><a href="#">Wyczyść listę</a></li>');
                menuItems.append('<li>---</li>');
            }
            else {
                menuItems.append('<li data-value="-2"><a href="#">Brak wpisów</a></li>');
            }

            _.each(authors, function (author, key) {
                var str = (author.fullname[0].length > 0 ? author.fullname[0] : "brak")
                    + ' (' + (author.firstname[0].length > 0 ? author.firstname[0] : "brak")
                    + ', ' + (author.surname[0].length > 0 ? author.surname[0] : "brak") + ')';
                menuItems.append('<li data-value="' + key + '"><a href="#">' + str + '</a></li>');
            });

            menuItems.find('li').each(function (index, element) {
                $(element).click(function () {

                    var dataValue = $(element).attr('data-value');
                    if (dataValue == '-2') {
                        menuItems.hide();
                        return false;
                    }
                    else if (dataValue == '-1') {
                        if (confirm('Czy na pewno chcesz wyczyścić listę?')) {
                            _this.cache.clearAuthors();
                        }
                    }
                    else {
                        var authors = _this.cache.get('authors');
                        var author = authors[dataValue];
                        author.userid = (new IdGenerator(author.email, 'simple')).getId();

                        _this.authors.push(author);
                        _this.model.save();
                        _this.model.trigger('change:metadata', _this.model);
                    }
                });
            });

            menuItems.menu('refresh');
        }

    });

});
