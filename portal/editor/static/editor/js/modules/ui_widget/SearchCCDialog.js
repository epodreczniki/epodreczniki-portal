define([
        'jquery',
        'underscore',
        'backbone',
        './Dialog',
        'text!modules/templates/CCSearchDialog.html',
        'text!modules/templates/CCItem.html'
        ], function ($, _, Backbone, Dialog, CCSearchDialog, CCItemTpl) {

	var USPP_API_URL = 'http://uspp.pl/api/',

	STAGES_URL = USPP_API_URL + 'stages/',
	SCHOOLS_URL =  USPP_API_URL + 'schools/',
	SUBJECTS_URL = USPP_API_URL + 'subjects/',
	VERSIONS_URL = USPP_API_URL + 'versions/',
	ABILITIES_URL = USPP_API_URL + 'abilities/';

	var QuickModel = Backbone.Model.extend({});

	var CCItem = Backbone.View.extend({
		template: _.template('<div></div>'),
		initialize: function (options) {
			this.item = options.item;
			var _this = this;
			this.$el.click(function () {
				_this.$el.find('.womi-item').addClass('active').siblings().removeClass('active');

				_this.item.trigger('modelSelected', _this.item);
			});
		},
		render: function () {
			this.$el.html(_.template(CCItemTpl, {item: this.item.toJSON()}));
			return this.$el;
		}
	});

	return Dialog.extend({

		scopes: null,

		stages: null,

		subjects: null,

		initialize: function (params) {
			this.header = 'Wyszukiwanie podstawy programowej';
			this.template = CCSearchDialog;
			this.saveCallback = params.saveCallback;
			this._loadResources();
			this._loaded = false;
			this._openCalled = false;
			this.abilities = new (Backbone.Collection.extend({
				model: QuickModel
			}));
			this.selectedItem = null;
			var _this = this;
			this.listenTo(this.abilities, 'modelSelected', function (o) {
				_this.selectedItem = o;
				if(_this._getParams().version !== undefined){
					_.each(_this.selectedItem.get("versions"), function(version, idx){
						if(version.code != _this._getParams().version){
							_this.selectedItem.get("versions").splice(idx,1);
						}
					});
				}
			});
		},

		_loadResources: function () {
			var _this = this;
			require([
			'json!' + STAGES_URL,
			'json!' + SCHOOLS_URL,
			'json!' + SUBJECTS_URL,
			'json!' + VERSIONS_URL
			], function (stages, schools, subjects, versions) {
				_this.stages = stages;
				_this.schools = schools;
				_this.subjects = subjects;
				_this.versions = versions;
				_this._init();
			}, function (err) {
				console.log(err);
				//_this._loadResources();
			});
		},

		_init: function () {
			this._loaded = true;
			if (this._openCalled) {
				this.open();
			}
		},

		open: function () {
			this._openCalled = true;
			if (this._loaded) {
				Dialog.prototype.open.call(this);
			}
		},

		_click: function () {
			if (this.selectedItem == null) {
				alert('Nie wybrano elementu');
				return false;
			}
			this.saveCallback(this.selectedItem);
		},
		
		_getParams: function() {
			var params = {};
			var categories = this.dialog.find('.dialog-menu-categories');
			categories.find('[data-param]').each(function () {
				var t = $(this);
				if (t.val() != 'empty' && t.val() != '') {
					params[t.data('param')] = t.val();
				}
			});
			return params;
		},

		_afterCreate: function () {
			var categories = this.dialog.find('.dialog-menu-categories');
			var items = this.dialog.find('.dialog-menu-items');
			var search = this.dialog.find('[data-role="search-ability"]');
			var _this = this;

			this._bindSelects(categories);

			function addModel(item) {
				var m = new QuickModel(item);
				_this.abilities.add(m);
				var v = new CCItem({item: m});
				items.append(v.render());
			}

			function loopItems(list) {
				_.each(list, function (item) {
					addModel(item);
					if(item.children_count > 0){
						$.getJSON(item.children_url, function (data) {
							loopItems(data);
						});
					}
					if (item.children) {
						loopItems(item.children);
					}
				});
			}

			function infiniteScroll(data, params) {
				var pages = data.num_pages;
				var current_page = 1;
				var lock = false;
				items.off('scroll');
				items.scroll(function () {
					var winTop = items.scrollTop(),
					docHeight = items[0].scrollHeight,
					winHeight = items.height();
					var scrollTrigger = 0.95;

					if (((winTop / (docHeight - winHeight)) > scrollTrigger) && !lock) {
						if (++current_page <= pages) {
							params.page = current_page;
							lock = true;
							$.getJSON(ABILITIES_URL + '?' + $.param(params), function (data) {
								loopItems(data.results);
								lock = false;
							});
						}
					}
				});
			}

			search.button().click(function () {
				items.html('');
				var loadingDiv = $("<div>", {"class" : "loading-image"});
				items.append(loadingDiv);
				_this.abilities.reset([]);
				$.getJSON(ABILITIES_URL + '?' + $.param(_this._getParams()), function (data) {
					items.html('');
					if(data.count == 0){
						items.append("<h5>Nie znaleziono podstawy programowej o podanych parametrach.</h5>")
					}else{
						loopItems(data.results);
						infiniteScroll(data, _this._getParams());
					}
				});
			});

		},

		_bindSelects: function (selects) {
			var _this = this;
			selects.find('[data-param="stage"]').change(function () {
				var t = $(this);
				selects.find('[data-param="subject"]').find('option').each(function () {
					var s = _.where(_this.subjects, {code: $(this).attr('value')});
					if (s.length > 0) {
						if (s[0].schools[0].stages[0].code == t.val() || t.val() == 'empty') {
//							if (s[0].stage.code == t.val() || t.val() == 'empty') {
							$(this).show();
						} else {
							$(this).hide();
						}
					}
				});
			});
		},

		_attributes: function () {
			function addEmpty(list) {
				return [
				        {code: 'empty', name: 'puste'}
				        ].concat(list);
			}

			return { attributes: [
			                      {
			                    	  name: 'Poziom',
			                    	  param: 'stage',
			                    	  select: addEmpty(this.stages),
			                    	  value: 'empty'
			                      },
			                      {
			                    	  name: 'Szkoła',
			                    	  param: 'school',
			                    	  select: addEmpty(this.schools),
			                    	  value: 'empty'
			                      },
			                      {
			                    	  name: 'Przedmiot',
			                    	  param: 'subject',
			                    	  select: addEmpty(this.subjects),
			                    	  value: 'empty'
			                      },
			                      {
			                    	  name: 'Wersja',
			                    	  param: 'version',
			                    	  select: addEmpty(this.versions),
			                    	  value: 'empty'
			                      },
			                      {
			                    	  name: 'Pełnotekstowe',
			                    	  param: 'query',
			                    	  input: true,
			                    	  value: ''
			                      }
			                      ] };
		}
	});
});