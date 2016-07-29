define(['jquery',
        'underscore',
        'backbone',
        'modules/parser/EPXMLParser',
        'text!modules/templates/EPXMLTemplate.html'
        ], function ($, _, Backbone, EPXMLParser, EPXMLTemplate) {

	return Backbone.Router.extend({

		routes: {
	          'edit/tiles/editor/:spaceId/:moduleId/:version': 'query'
		},

		initialize: function(props){
			this.model = props.model;
			this.cache = props.cache;
			this.grid = props.grid;
		},

		query: function(spaceId, moduleId, version) {
			var metadataUrl = "//preview.{{ TOP_DOMAIN }}/content/module/"+moduleId+"/"+version+"/module.xml";
			var _this = this;
			$.ajax({
		        type: "get",
		        url: metadataUrl,
		        dataType: "xml",
		        success: function(data) {
                    console.log(data);
		        	if (window.ActiveXObject){
		        		var string = data.xml;
		        	}else{
		        		var string = (new XMLSerializer()).serializeToString(data);
		        	}
		        	_this._loadModule(string);
		        },
                error: function (jqXHR, status) {
                    var stack = $(jqXHR.responseText);
                    var err = _.where(stack, {className: 'error'});
                    var d = $('<div>' + $(err[0]).html() + '</div>');
                    d.dialog({title: 'Problem z ładowaniem modułu ' + moduleId + ', wersja :' + version});
                }
		    });
		},

		_loadModule: function(result){
			var _this = this;
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
                			common.womitranscript = para.value;
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

//                	if (section.para[0].reference) {
//                        common.attrWomi = section.para[0].reference[0]['ep:id'];
//                        common.attrType = 'WOMI';
//                        common.womiwidth = (section.para[0].reference[0].width !== undefined ? section.para[0].reference[0].width[0] : "0");
//                        common.womitype = (section.para[0].reference[0].type !== undefined ? section.para[0].reference[0].type[0] : null);
//                        common.womicontext = (section.para[0].reference[0].context !== undefined ? section.para[0].reference[0].context[0] : 'false');
//                        common.womireadingRoom = (section.para[0].reference[0]['reading-room'] !== undefined ? section.para[0].reference[0]['reading-room'][0] : 'false');
//                        common.womihideCaption = (section.para[0].reference[0]['hide-caption'] !== undefined ? section.para[0].reference[0]['hide-caption'][0] : "none");
//                        common.womizoomable = (section.para[0].reference[0].zoomable !== undefined ? section.para[0].reference[0].zoomable[0] : 'false');
//                        common.womiembedded = (section.para[0].reference[0].embedded !== undefined ? section.para[0].reference[0].embedded[0] : 'false');
//                        common.womiautoplay = (section.para[0].reference[0].autoplay !== undefined ? section.para[0].reference[0].autoplay[0] : 'false');
//                        common.womitransparent = (section.para[0].reference[0].transparent !== undefined ? section.para[0].reference[0].transparent[0] : 'false');
//                        common.womiavatar = (section.para[0].reference[0].avatar !== undefined ? section.para[0].reference[0].avatar[0] : 'false');
//                        common.womicontent = (section.para[0].reference[0].content !== undefined ? section.para[0].reference[0].content[0].value : '');
//                        common.womicontentFormat = (section.para[0].reference[0].content !== undefined ? section.para[0].reference[0].content[0]['ep:format'] : 'classic');
//                    } else if (section.para[0].gallery) {
//                        common.attrType = 'gallery';
//                        var gal = section.para[0].gallery;
//                        blocks.push({womi: common, gallery: gal});
//                    }
//                    if (common.womicontext == 'false'){
//                    	blocks.push({womi: common});
//                    }
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
								attrZoomable: ref.zoomable !== undefined ? ref.zoomable[0] : false,
								attrMagnifier: ref.magnifier !== undefined ? ref.magnifier[0] : false,
								attrContent: ref.content !== undefined ? ref.content[0].value : '',
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
            removeLeaveWarning();

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
