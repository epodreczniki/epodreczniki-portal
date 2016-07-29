require(['domReady', 'jquery'], function (domReady, $) {
	'use strict';
	domReady(function () {

		var data = $('body').data('statisticsapi');
		var imageurl = $('body').data('imagepath');
		
		var XHRImage = function (image, fullPath, callback) {
			var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (image.length) {
                        image[0].contentWindow.document.write(xhr.responseText);
                        callback($(image[0].contentWindow.document));
                        var svg = $(image[0].contentWindow.document).find('svg')[0];
                        var width = $(window).width() * 0.5;
                        var height = $(window).width() * 0.5;
                        svg.setAttribute('width', width);
                        svg.setAttribute('height', height);
                        image.width(width);
                        image.height(height);
                        $(image[0].contentWindow.document).find('body').css({'overflow': 'hidden',
                            'width': '100%', 'height': '100%', 'margin': 0});
                    } else {
                        processData(data);
                    }
                }
            };
            xhr.open('GET', fullPath.replace('./', ''), true);
            xhr.overrideMimeType('text/plain');
            xhr.send(null);
        };

		var clicked = "";
		var regionalStatistics;

		function processData(data) {
			processVisitsSummary(data);
			processDataKind(data, 'browser');
			processDataKind(data, 'device');
			storeRegionalStatistics(data);
		}

		function processDataKind(data, kind) {
			var section = $('.' + kind + '-section');
			var elements = data[kind];
			for (var key in elements) {
				section.find('.' + key).find('p').html(elements[key]);
			}
		}

		function storeRegionalStatistics(data) {
			regionalStatistics = data;
		}

        function recalculateVisits(data){
            var sum = 0;
            for(var key in data){
                sum += data[key]['visits'];
            }
            return sum;
        }

		function processVisitsSummary(data) {
			var section = $('.map-section');
			section.find('.province').html(data['label']);
			section.find('.visits').html(data['visits']);
            if(data['regions']){
                section.find('.visits').html(recalculateVisits(data['regions']));
            }
		}

		function mapListenerClicked(event){
//			console.log('clicked ' + $(this).attr('id'));
			clicked = $(this).attr('id').substring(7,9);
			event.stopPropagation();
			mapListener();
		}

		function mapListener() {
			processVisitsSummary(regionalStatistics["regions"][$(this).attr('id').substring(7,9)]);
			processDataKind(regionalStatistics["regions"][$(this).attr('id').substring(7,9)], 'browser');
			processDataKind(regionalStatistics["regions"][$(this).attr('id').substring(7,9)], 'device');
		}

		function mapListenerRestore() {
			if(clicked == "") {
				processVisitsSummary(regionalStatistics);
				processDataKind(regionalStatistics, 'browser');
				processDataKind(regionalStatistics, 'device');
			} else {
				processVisitsSummary(regionalStatistics["regions"][clicked]);
				processDataKind(regionalStatistics["regions"][clicked], 'browser');
				processDataKind(regionalStatistics["regions"][clicked], 'device');
			}
		}

		function documentListener(){
			clicked = "";
			processVisitsSummary(regionalStatistics);
			processDataKind(regionalStatistics, 'browser');
			processDataKind(regionalStatistics, 'device');
		}

		function attachListeners(map) {
			map.find('.region').click(mapListenerClicked);
			map.find('.region').mouseover(mapListener);
			map.find('.region').mouseout(mapListenerRestore);
			$(document).click(documentListener);
		}

		function processMap(data, map) {
			for (var key in data.regionsMapping) {
				var value = data.regionsMapping[key];
				map.find('#region_' + key).css({'opacity': value * 0.75 + 0.25});
			}
		}

		XHRImage($("#embed_map"), imageurl, function(frameDoc){
			processData(data);
			attachListeners(frameDoc);
			processMap(data, frameDoc);
		});
		
		function resizeMap(){
			var svg = $($("#embed_map")[0].contentWindow.document).find('svg')[0];
			var width = $(window).width() * 0.5;
			var height = $(window).width() * 0.5;
			svg.setAttribute('width', width);
			svg.setAttribute('height', height);
			$("#embed_map").width(width);
			$("#embed_map").height(height);
		}
		
		$(window).on('resize', resizeMap);

        $(".statistics-reset").on('click', function () {
            processData(data);
        });
	});
});