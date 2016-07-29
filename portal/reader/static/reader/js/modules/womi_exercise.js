define(['declare',
	'jquery',
	'modules/womi_exercise/app/controller'], function (declare, $, appController) {

		'use strict';

		return declare({
			instance: {

				constructor: function(options) {
					options = options || {};
					this._source = options.source;
					this._destination = options.destination;
				},

				start: function() {
					var that = this;

                    var srcWomi = this._source.substring(0, this._source.lastIndexOf("/"));

					require(['require', 'text!' + this._source, 'reader.api'], function(require, data, api) {
                        var readerApi = new api(require, true, that._source);
						that.exercise = appController.createExercise(JSON.parse(data), that._destination, srcWomi, readerApi);
					}, function() {
						console.error("Failure loading json: " + that._source);
					});
				},

                resize: function(){
                    this.exercise && this.exercise.view && this.exercise.view.trigger('resize');
                }

			}

		});

});
