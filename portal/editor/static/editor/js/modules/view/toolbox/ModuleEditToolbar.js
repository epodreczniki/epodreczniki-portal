define(['jquery',
    'underscore',
    'backbone',
    '../blocks/states/EditAttributes',
    '../util/FileManipulation',
    '../util/ModelAttributesMaker',
    '../util/TemplateLoader',
    'modules/ui_widget/combobox',
    'modules/ui_widget/FormDialog',
    'modules/ui_widget/SaveDialog',
    'womi_dialog',//'modules/ui_widget/WOMISelectDialog',
    'modules/ui_widget/GalleryWizardDialog',
    'modules/ui_widget/AddMediaDialog',
    'modules/ui_widget/FileBrowser',
    'modules/app/util/IdGenerator',
    'modules/parser/EPXMLParser',
    'modules/view/MetadataEdit',
    'text!modules/templates/ToolboxButtonTemplate.html',
    'text!modules/templates/EditableBlockTemplate.html',
    'text!modules/templates/EPXMLTemplate.html',
    'text!modules/templates/XMLTemplateExportTemplate.html',
    'text!modules/templates/PropertiesFileTemplate.txt'
], function ($, _, Backbone, EditAttributes, FileManipulation, ModelAttributesMaker, TemplateLoader, Combobox, FormDialog, SaveDialog, WOMISelectDialog, GalleryWizardDialog, AddMediaDialog, FileBrowser, IdGenerator, EPXMLParser, MetadataEdit, ToolboxButtonTemplate, EditableBlockTemplate, EPXMLTemplate, XMLTemplateExportTemplate, PropertiesFileTemplate) {
    return Backbone.View.extend({

        UPLOAD_URL: "/edit/store/api/upload/module/",

        initialize: function (opts) {

            this.grid = opts.grid;
            this.model = opts.model;
            this.cache = opts.cache;

            this.listenTo(this.grid, 'blockSelected', this.blockSelected);
            this.listenTo(this.grid, 'openWomiWindow', this.openWomiWindow);

            var options = [
                {state: EditAttributes, label: "Edit"}
            ];
            this.state = options[0].label;
            this.attrEditDiv = this.$el.find('[data-role="attr-edit"]');

            this.womiSelectDialog = new WOMISelectDialog({treeData: this.cache.get('treeData'), selectedPath: this.cache.get('selectedTreeDataPath'), saveCallback: function (id, selectedWomi) {}});
//            this.womiSelectDialog = new WOMISelectDialog({saveCallback: function () {
//            }});

            this.listenTo(this.model, 'change:currentState', this._stateChanged);

            this._initExportModuleTemplate();

            this._makeImportExport();

            this._initMetadataEdit();
        },

        setState: function () {
            this.model.set('currentState', EditAttributes);
        },

        _stateChanged: function (model, options) {
            if (model.get('currentState') != EditAttributes) {
                this.epxmlEdit.hide('slide', {}, 500);
            }
        },

        _initMetadataEdit: function () {
            var _this = this;
            var d = $('<div>', {'class': 'epxml-editor'});
            d.hide();
            this.epxmlEdit = d;
            function res() {
                d.css({
                    left: (_this.$el.width() + 10) + 'px',
                    width: '300px'
                });
            }

            $(window).resize(res);
            res();
            _this.grid.$el.after(d);
            this.$el.find('[data-role="epxml-attributes"]').button().click(function (ev) {
                d.toggle('slide', {}, 500);
                ev.stopPropagation();
            });

//            d.bind('clickoutside', function(event){
//            	if(d.is(':visible')){
//            		d.hide('slide', {}, 500);
//            	}
//            });

            this.metadataEditor = new MetadataEdit({el: d[0], model: this.model, cache: this.cache});

        },

        _makeXML: function (bundledVars) {
            //bundledVars['module_id'] = 'dnd3ndq';
            //bundledVars['title'] = 'module';
            bundledVars['create_date'] = new Date();
            bundledVars['IdGenerator'] = IdGenerator;
            return _.template(EPXMLTemplate, bundledVars);
        },

        _makeImportExport: function () {
            var _this = this;

            var importExportPLXML = this.$el.find('[data-role="epxml-import-export"]');

            importExportPLXML.find('[data-role="save-epxml"]').button().click(function () {
                var attrs = [
                    {
                        id: '_124455675',
                        name: 'publication.mainFile',
                        label: 'Zapisać plik EPXML w repozytorium ?',
                        value: 'module.xml'
                    }
                ];
                var dialog = new SaveDialog({
                    fields: attrs,
                    header: 'Zapisz EPXML w repozytorium',
                    saveCallback: function (attrs) {

                        var doc = _this.model.get('metadata').document;
                        var props = [
                            {
                                name: 'edition.externalId',
                                value: doc[0].id
                            },
                            {
                                name: 'publication.name',
                                value: doc[0].title
                            },
                            {
                                name: 'publication.metadataFile',
                                value: ''
                            }
                        ];
                        _.each(_.keys(attrs), function (attr) {
                            props.push({
                                name: attr,
                                value: attrs[attr]
                            })
                        });
                        var output = {
                            document: doc,
                            properties: _this.model.toJSON(),
                            blocks: _this.grid.blocks.fullJSON(),
                            title: attrs['publication.name']
                        };
                        output.background = _this.model.get('currentBackground');
                        output.ccommands = _this.cache.get('ccommands');
                        output.pins = _this.cache.get('pins');
                        output.ccs = _this.cache.get('ccs');
                        output.educations = _this.cache.get('educations');

                        output = _this._makeXML(output);

                        //var moduleId = props[0].value;
                        var moduleId = doc[0]['module-id'];
                        var version = doc[0].metadata[0].version[0];

                        var uploadUrl = _this.UPLOAD_URL+moduleId+"/"+version;
                        var formData = new FormData();
                        var blob = new Blob([output], { type: "text/xml"});
                        formData.append("xml_file", blob);
                        $.ajax({
                            url: uploadUrl,
                            type: 'POST',
                            data: formData,
                            cache: false,
                            dataType: 'xml',
                            processData: false,
                            contentType: false,
                            error: function(jqXHR, textStatus, errorMessage){
                                var stack = $(jqXHR.responseText);
                                var err = _.where(stack, {className: 'error'});
                                var d = $('<div>' + $(err[0]).html() + '</div>');
                                d.dialog({title: 'Problem z zapisaniem modułu ' + moduleId + ', wersja :' + version});
                            }
                        });

                        dialog.close();
                        removeLeaveWarning();
                    }
                });
                dialog.open();
            });

            importExportPLXML.find('[data-role="local-save-epxml"]').button().click(function () {
                var attrs = [
                    {
                        id: '_124455675',
                        name: 'publication.mainFile',
                        label: 'Zapisać pliki EPXML oraz properties na dysku ?',
                        value: 'module.xml'
                    },

                ];
                //var dialog = new SaveDialog({
                var dialog = new FormDialog({
                    fields: attrs,
                    header: 'Zachowaj EPXML + plik properties',
                    saveCallback: function (attrs) {

                        var doc = _this.model.get('metadata').document;
                        var props = [
                            {
                                name: 'edition.externalId',
                                value: doc[0].id
                            },
                            {
                                name: 'publication.name',
                                value: doc[0].title
                            },
                            {
                                name: 'publication.metadataFile',
                                value: ''
                            }
                        ];
                        _.each(_.keys(attrs), function (attr) {
                            props.push({
                                name: attr,
                                value: attrs[attr]
                            })
                        });

                        var output = {
                            document: doc,
                            properties: _this.model.toJSON(),
                            blocks: _this.grid.blocks.fullJSON(),
                            title: attrs['publication.name']
                        };
                        output.background = _this.model.get('currentBackground');
                        output.ccommands = _this.cache.get('ccommands');
                        output.pins = _this.cache.get('pins');
                        output.ccs = _this.cache.get('ccs');
                        output.educations = _this.cache.get('educations');

                        output = _this._makeXML(output);

                        FileManipulation.download($('body'), attrs['publication.mainFile'], output, 'xml');
                        FileManipulation.download($('body'), 'publication.properties', _.template(PropertiesFileTemplate, {attrs: props}), 'txt');

                        dialog.close();
                        removeLeaveWarning();
                    }
                });
                dialog.open();
            });

            var load = importExportPLXML.find("[data-role='load-epxml']");
            var browser = new FileBrowser({el: load[0], onChange: function (result) {
                //console.log(result)
                var par = new EPXMLParser();
                var document = par.parseXML(result);
                _this.model.set('metadata', document);
                var blocks = [];
                if(document.document[0].comment && document.document[0].comment[0].indexOf('background_file') >= 0){
                    alert(document.document[0].comment[0].replace('background_file', 'Ten moduł był zapisywany z tłem'));
                }
                _.each(document.document[0].content[0].section, function (section,idx) {
                    if(section.para[0].list){
                    }else{
                    	var common = {};
                    	if(section.parameters !== undefined ){
                    		common = {
                                    x: parseInt(section.parameters[0].left !== undefined ? section.parameters[0].left[0] : "0"),
                                    y: parseInt(section.parameters[0].top !== undefined ? section.parameters[0].top[0] : "0"),
                                    width: parseInt(section.parameters[0].width !== undefined ? section.parameters[0].width[0] : "0"),
                                    height: parseInt(section.parameters[0].height !== undefined ? section.parameters[0].height[0] : "0"),
                                    attrWomi: null,
                                    attrName: section.parameters[0].tile[0],
                                    attrMarginLeft: parseInt(section.parameters[0]['margin-left'] !== undefined ? section.parameters[0]['margin-left'][0] : "0"),
                                    attrMarginRight: parseInt(section.parameters[0]['margin-right'] !== undefined ? section.parameters[0]['margin-right'][0] : "0"),
                                    attrMarginTop: parseInt(section.parameters[0]['margin-top'] !== undefined ? section.parameters[0]['margin-top'][0] : "0"),
                                    attrMarginBottom: parseInt(section.parameters[0]['margin-bottom'] !== undefined ? section.parameters[0]['margin-bottom'][0] : "0")
                            };
                    	}
                    	_.each(section.para, function(para){
                    		if(para['ep:role'] == 'transcript'){
                    			common.womiTranscript = para.value;
                    		}else{
                    			if (para.reference) {
                                    common.attrWomi = para.reference[0]['ep:id'];
                                    common.attrType = 'WOMI';
                                    common.womiwidth = (para.reference[0].width !== undefined ? para.reference[0].width[0] : "0");
                                    common.womitype = (para.reference[0].type !== undefined ? para.reference[0].type[0] : null);
                                    common.womicontext = (para.reference[0].context !== undefined ? para.reference[0].context[0] : 'false');
                                    common.womireadingRoom = (para.reference[0]['reading-room'] !== undefined ? para.reference[0]['reading-room'][0] : 'false');
                                    common.womihideCaption = (para.reference[0]['hide-caption'] !== undefined ? para.reference[0]['hide-caption'][0] : "none");
                                    common.womizoomable = (para.reference[0].zoomable !== undefined ? para.reference[0].zoomable[0] : 'false');
                                    common.womiembedded = (para.reference[0].embedded !== undefined ? para.reference[0].embedded[0] : 'false');
                                    common.womiautoplay = (para.reference[0].autoplay !== undefined ? para.reference[0].autoplay[0] : 'false');
                                    common.womitransparent = (para.reference[0].transparent !== undefined ? para.reference[0].transparent[0] : 'false');
                                    common.womiavatar = (para.reference[0].avatar !== undefined ? para.reference[0].avatar[0] : 'false');
                                    common.womicontent = (para.reference[0].content !== undefined ? para.reference[0].content[0].value : '');
                                    common.womicontentFormat = (para.reference[0].content !== undefined ? para.reference[0].content[0]['ep:format'] : 'classic');
                                } else if (para.gallery) {
                                    common.attrType = 'gallery';
                                    var gal = para.gallery;
                                    blocks.push({womi: common, gallery: gal});
                                }
                    		}
                    	});

                    	if (common.womicontext == 'false'){
                        	blocks.push({womi: common});
                        }

//                    	if (section.para[0].reference) {
//                            common.attrWomi = section.para[0].reference[0]['ep:id'];
//                            common.attrType = 'WOMI';
//                            common.womiwidth = (section.para[0].reference[0].width !== undefined ? section.para[0].reference[0].width[0] : "0");
//                            common.womitype = (section.para[0].reference[0].type !== undefined ? section.para[0].reference[0].type[0] : null);
//                            common.womicontext = (section.para[0].reference[0].context !== undefined ? section.para[0].reference[0].context[0] : 'false');
//                            common.womireadingRoom = (section.para[0].reference[0]['reading-room'] !== undefined ? section.para[0].reference[0]['reading-room'][0] : 'false');
//                            common.womihideCaption = (section.para[0].reference[0]['hide-caption'] !== undefined ? section.para[0].reference[0]['hide-caption'][0] : "none");
//                            common.womizoomable = (section.para[0].reference[0].zoomable !== undefined ? section.para[0].reference[0].zoomable[0] : 'false');
//                            common.womiembedded = (section.para[0].reference[0].embedded !== undefined ? section.para[0].reference[0].embedded[0] : 'false');
//                            common.womiautoplay = (section.para[0].reference[0].autoplay !== undefined ? section.para[0].reference[0].autoplay[0] : 'false');
//                            common.womitransparent = (section.para[0].reference[0].transparent !== undefined ? section.para[0].reference[0].transparent[0] : 'false');
//                            common.womiavatar = (section.para[0].reference[0].avatar !== undefined ? section.para[0].reference[0].avatar[0] : 'false');
//                            common.womicontent = (section.para[0].reference[0].content !== undefined ? section.para[0].reference[0].content[0].value : '');
//                            common.womicontentFormat = (section.para[0].reference[0].content !== undefined ? section.para[0].reference[0].content[0]['ep:format'] : 'classic');
//                        } else if (section.para[0].gallery) {
//                            common.attrType = 'gallery';
//                            var gal = section.para[0].gallery;
//                            blocks.push({womi: common, gallery: gal});
//                        }
//                        if (common.womicontext == 'false'){
//                        	blocks.push({womi: common});
//                        }
                    }
                });
                _this.cache.clearCcommands();
                if(document.document[0].content[0].section !== undefined){
                	if (document.document[0].content[0].section[0].para[0].list) {
                		_.each(document.document[0].content[0].section[0].para[0].list[0].item, function(ccommand){
                			_this.cache.putCcommand(ccommand);
                		});
                	}
                }
                _this.cache.clearPins();
                _.each(document.document[0].content[0].section, function (section,idx) {
                	if(section.para[0].reference !== undefined){
                		var isContext = (section.para[0].reference[0].context) !== undefined ? section.para[0].reference[0].context[0] : 'false';
                    	if(isContext == 'true'){
                        	_this.cache.putPin(section.para[0].reference[0]['ep:id']);
                    	}
                	}
                });

                _this.cache.clearCcs();
                _this.cache.clearEducations();
                if(document.document[0].metadata[0]['e-textbook-module'] !== undefined){
                	if(document.document[0].metadata[0]['e-textbook-module'][0]['core-curriculum-entries'] !== undefined){
                		if(document.document[0].metadata[0]['e-textbook-module'][0]['core-curriculum-entries'][0]['core-curriculum-entry'] !== undefined){
                			var cces = document.document[0].metadata[0]['e-textbook-module'][0]['core-curriculum-entries'][0]['core-curriculum-entry'];
                            _.each(cces, function(ccsEl){
                            	if(ccsEl['core-curriculum-version'] === undefined && ccsEl['core-curriculum-ability'] === undefined ){
                            		if(ccsEl['core-curriculum-stage'] !== undefined || ccsEl['core-curriculum-school'] !== undefined || ccsEl['core-curriculum-subject'] !== undefined || ccsEl['authors-comment'] !== undefined){
                                		_this.cache.putEducation(ccsEl);
                            		}
                            	}else{
                            		_this.cache.putCcs(ccsEl);
                            	}
                            });
                		}
                	}
                }

                _this.grid.blocks.each(function (m) {
                	m.destroy();
                });
                _this.grid.blocks.fetch();
                _this.grid.blocks.set([]);
                _.each(blocks, function (block) {
                    var b = _this.grid.blocks.add(block.womi);
                    if (b.get('attrType') == 'gallery') {
                        var its = [];
                        var iii = 1;
                        _.each(block.gallery[0].reference, function (ref) {
                        	var related = null;
    						if(ref.related !== undefined){
    							related = {};
    							related.id = ref.related[0].reference['ep:id'];
    						}
                        	its.push({
								attrWomi: ref['ep:id'],
								position: iii++,
								attrZoomable: ref["ep:zoomable"] !== undefined ? ref["ep:zoomable"][0] : false,
								attrMagnifier: ref["ep:magnifier"] !== undefined ? ref["ep:magnifier"][0] : false,
								attrContent: ref["ep:magnifier"] !== undefined ? ref["ep:magnifier"][0] : '',
								attrRelatedWomi: related
							});
                        });
                        var galleryItem = {};
    					if(block.gallery[0]['ep:miniatures-only'] == true || block.gallery[0]['ep:miniatures-only'] == "true"){
    						if(block.gallery[0]['ep:view-width'] === undefined ||  block.gallery[0]['ep:view-height'] === undefined ){
    							galleryItem = {
    									startOn: block.gallery[0]['ep:start-on'],
    									thumbnails: block.gallery[0]['ep:thumbnails'],
    									titles: block.gallery[0]['ep:titles'],
    									formatContents : block.gallery[0]['ep:format-contents'],
    									title: (block.gallery[0].title != undefined ? block.gallery[0].title[0] : ""),
    									miniaturesOnly: block.gallery[0]['ep:miniatures-only'],
    									type: "C"
    								}
    						}else{
    							galleryItem = {
    									startOn: block.gallery[0]['ep:start-on'],
    									thumbnails: block.gallery[0]['ep:thumbnails'],
    									titles: block.gallery[0]['ep:titles'],
    									formatContents : block.gallery[0]['ep:format-contents'],
    									title: (block.gallery[0].title != undefined ? block.gallery[0].title[0] : ""),
    									miniaturesOnly: block.gallery[0]['ep:miniatures-only'],
    									viewWidth: block.gallery[0]['ep:view-width'],
    									viewHeight: block.gallery[0]['ep:view-height'],
    									type: "B"
    								}
    						}
    					}else{
    						galleryItem = {
    							startOn: block.gallery[0]['ep:start-on'],
    							thumbnails: block.gallery[0]['ep:thumbnails'],
    							titles: block.gallery[0]['ep:titles'],
    							formatContents : block.gallery[0]['ep:format-contents'],
    							title: (block.gallery[0].title != undefined ? block.gallery[0].title[0] : ""),
    							miniaturesOnly: block.gallery[0]['ep:miniatures-only'] != undefined ? block.gallery[0]['ep:miniatures-only'] : false,
    							type: "A"
    						}
    					}
    					b.setGalleryItems(galleryItem, its);
                    }
                });
                _this._getWomiTypes();
                if(document.document[0].metadata[0]['e-textbook-module'][0].presentation != undefined){
                	_this.model.set({
                        width: document.document[0].metadata[0]['e-textbook-module'][0].presentation[0].width[0],
                        height: document.document[0].metadata[0]['e-textbook-module'][0].presentation[0].height[0]
                    });
                }
                _this.model.save();
                _this.model.trigger('sizeChanged');
                //_this.cache.save();
                _this.cache.trigger('change:ccommand', _this.cache);
                _this.cache.trigger('change:pin', _this.cache);
                _this.model.trigger('change:metadata', _this.model);
            }});
            load.button();

            importExportPLXML.find("[data-role='clean-epxml']").button().click(function () {
                if (confirm('Czy na pewno chcesz przywrócić domyślne wartości?')) {
                    _this.model.set('metadata', _this.model.defaults.metadata);
                    _this.model.save();
                    _this.model.trigger('change:metadata', _this.model);
                    _this.cache.clearCcommands();
                   // _this.cache.save();
                    _this.cache.trigger('change:ccommand', _this.cache);
                    addLeaveWarning();
                }
            });
        },

        _xmlTemplateAttrs: function (blocks) {
            var tiles = blocks;
            var editableAttributes = [];
            editableAttributes.push({
                id: 'asdgadf235134g',
                name: 'type',
                label: 'typ',
                value: ''
            });

            editableAttributes.push({
                id: 'asdgadsada2314fg',
                name: 'template',
                label: 'szablon',
                value: ''
            });

            blocks.each(function (block) {
                var a = ModelAttributesMaker.getAttrs(block, 'attrName');
                _.each(a, function (_a) {
                    _a.label = 'rola dla ' + _a.value;
                    _a.name = 'rola:' + _a.value;
                    _a.value = '';

                });
                editableAttributes = editableAttributes.concat(a);
            });
            return editableAttributes;
        },

        _initExportModuleTemplate: function () {
            var _this = this;

            this.$el.find('[data-role="save-export-template"]').button().click(function () {
                var attrs = _this._xmlTemplateAttrs(_this.grid.blocks);

                var dialog = new FormDialog({
                    header: 'Eksport szablonu',
                    fields: attrs,
                    saveCallback: function (attrs) {
                        var tiles = [];
                        var config = {
                            moduleType: '',
                            templateRef: '',
                            width: _this.model.get('width'),
                            height: _this.model.get('height'),
                            tiles: tiles
                        };
                        _.each(_.keys(attrs), function (attr) {
                            if (attr == 'type') {
                                config.moduleType = attrs[attr];
                            } else if (attr == 'template') {
                                config.templateRef = attrs[attr];
                            } else if (attr.indexOf('role:') == 0) {
                                var attrVal = attr.substring(5);
                                var block = _this.grid.blocks.findWhere({ attrName: attrVal});
                                tiles.push({
                                    role: attrs[attr],
                                    name: block.get('attrName'),
                                    top: block.get('y'),
                                    left: block.get('x'),
                                    height: block.get('height'),
                                    width: block.get('width')
                                })
                            }
                        });
                        dialog.close();
                        FileManipulation.download('template.xml', _.template(XMLTemplateExportTemplate, config, 'xml'));

                    }
                });
                dialog.open();
            });
        },

        stateChanged: function (stateName) {
            this.attrEditDiv.html('');
        },

        blockSelected: function (block) {
            var _this = this;
            var editableAttributes = ModelAttributesMaker.getAttrs(block, 'attr');
            var template = _.template(EditableBlockTemplate, {attrs: editableAttributes, header: 'Atrybuty kafelka'});
            this.attrEditDiv.html(template);
            var d = this.womiSelectDialog;
            this.attrEditDiv.find('[data-attr="attrWomi"]').click(function () {
                var womiEdit = $(this);
                d.saveCallback = function (id, context, treeData, selectedPath) {
                	_this.cache.setTreeData(treeData);
                	_this.cache.setSelectedTreeDataPath(selectedPath);
                    womiEdit.val(id);
                    d.hide();
                    _this._saveAttributes(_this.attrEditDiv, block);
                    _this.grid.trigger('blockChanged', block);
                };
                d.show();
            });
            this.attrEditDiv.find('[data-attr="attrType"]').click(function () {
                if ($(this).val() == 'gallery') {
                    var d = new GalleryWizardDialog({block: block, grid: _this.grid});
                    d.open();
                }
            });

            this.attrEditDiv.find('button').button().click(function () {
                if ($(".full-input:invalid").length > 0) {
                    alert("Nieprawidłowa wartość w polu: " + $(".full-input:invalid").first().prev("label.input-label").html());
                    return false;
                }
                _this._saveAttributes(_this.attrEditDiv, block);
                _this.grid.trigger('blockChanged', block);
                _this.attrEditDiv.html('');
                return false;
            });
        },

        openWomiWindow: function (block) {
            var _this = this;
            var type = block.get('attrType');
            if (type == "gallery") {
                var d = new GalleryWizardDialog({block: block, grid: this.grid, cache: this.cache});
                d.open();
            }
            else if (type == "WOMI" || type == "VIDEO") {
                var d = this.womiSelectDialog;
                d.saveCallback = function (id, context, treeData, selectedPath) {
                	_this.cache.setTreeData(treeData);
                	_this.cache.setSelectedTreeDataPath(selectedPath);
                    block.set('attrWomi', id);
                    if(context.womi['media-type'] == 'VIDEO'){
                    	block.set('attrType', 'VIDEO');
                    }else{
                    	block.set('attrType', 'WOMI');
                    }
                    _this.grid.trigger('blockChanged', block);
                    _this.grid.trigger('blockSelected', block);
                    d.close();
                };
                d.show();
            }
            else {
                var d = new AddMediaDialog({block: block, grid: this.grid, cache: this.cache});
                d.open();
            }
        },

        _saveAttributes: function (el, model) {
            var updated = {};
            el.find('[data-attr]').each(function (index, element) {
                var el = $(element);
                updated[el.data('attr')] = el.val();
            });
            model.save(updated);
            addLeaveWarning();

        },

        _getWomiTypes: function(){
			var _this = this;
			var blocks = _this.grid.blocks.where({ "attrType": "WOMI"});
			_.each(blocks, function(block){
				var womiRef = block.get('attrWomi');
				if(womiRef != ''){
					$.get('{% url "editor.views.searchwomi" %}?womiId=' + womiRef, function(data){
						var mediaType = data.items[0]['media-type'];
						if(mediaType == 'VIDEO'){
							block.set("attrType", "VIDEO");
						}
		            }, null, 'json').fail(function(xhr, textStatus, errorMessage){
		            	alert(" Nie można pobrać typu WOMI.");
		            });
				}
			});
		}
    });
});
