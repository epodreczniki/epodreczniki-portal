define(['jquery'], function ($) {
    return function () {
        var searchButton = $('#search-button');
        searchButton.click(function () {
            var q = $('input[name=q]');
            var _this = $(this);
            _this.attr('href', _this.data('href') + '?q=' + q.val());
        });

        var itemsCreator = function (data) {
            var divList = [];
			if (!data.service_ok) {
				divList.push($('<div />', {
					html: [
						$('<h3 />', { text: "Prace konserwacyjne" }),
						$('<dir />', {
							html: "Usługa wyszukiwania jest niedostępna z powodu prac konserwacyjnych. Spróbuj ponownie za chwilę.",
							'class': 'live-search-item-text'
						})
					]
				}));
				return divList;
			}
            data.entries.forEach(function (entry) {
                var img = $('<img>', {
                    src: entry.thumb_url,
                    'class': 'live-search-item-img',
                    style: 'float: left; width: 72px;'
                });
                var title = $('<a>', {
                    text: entry.md_title,
                    href: entry.content_url,
                    'class': 'live-search-item-text'
                });
                var colAbstract = $('<div>', {
                    html: '<span>' + entry.md_abstract + '</span>',
                    'class': 'live-search-item-abstract ellipsable',
                    style: 'overflow: hidden; height: 60px; display: block;'
                });
                var clear = $('<div />', {
                    style: 'clear: both;',
                    'class': 'live-search-item-clear'
                });
                divList.push($('<div />', {
                    html: [img, title, colAbstract, clear],
                    'class': 'live-search-item'
                }));
            });
            return divList;
        };
        $('input[name=q]').liveSearch({url: searchButton.data('ds') + '?q=', itemsCreator: itemsCreator});
    };
});
