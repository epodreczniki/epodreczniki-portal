define(['jquery'], function ($) {

    var searchBox = $('.search-box');
    var searchUrl = $('#search-link').data('link');

    var formatData = function(data){
        return data;
    };

    function infiniteScroll(params) {
        var pages = $('#results').find('.search-num-pages').first().data('pages');
        var current_page = 1;
        var lock = false;
        searchBox.off('scroll');
        searchBox.scroll(function () {
            var winTop = searchBox.scrollTop(),
                docHeight = searchBox[0].scrollHeight,
                winHeight = searchBox.height();
            var scrollTrigger = 0.95;

            if (((winTop / (docHeight - winHeight)) > scrollTrigger) && !lock) {
                if (++current_page <= pages) {
                    params.p = current_page;
                    lock = true;
                    $.get(searchUrl + '?' + $.param(params), function (data) {
                        //loopItems(data.results);

                        $('#results').append(formatData(data));
                        lock = false;
                    });
                }
            }
        });
    }

    function hideKeyboard(element) {
        element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
        element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
        setTimeout(function () {
            element.blur();  //actually close the keyboard
            // Remove readonly attribute after keyboard is hidden.
            element.removeAttr('readonly');
            element.removeAttr('disabled');
        }, 100);
    }

    return {
        setFormatData: function(callback){
            formatData = callback;
        },
        init: function () {

        	$.each(['show', 'hide'], function (i, ev) {
        		var el = $.fn[ev];
        		$.fn[ev] = function () {
        			this.trigger(ev);
        			return el.apply(this, arguments);
        		};
        	});
        	
        	var searchValue = '';
        	
        	var keyModuleSwitchHandler = null;
        	
        	$('.search-box').on('show', function() {
        		$.each($._data(document, "events").keydown, function (idx, el) {
                    if (el.namespace == 'search') {
                        keyModuleSwitchHandler = el;
                    }
                });
                $(document).off('keydown.search');
                $(document).keydown(function (event) {
                    if (event.target.nodeName.toUpperCase() === "INPUT") {
                        if (event.keyCode == 13) {
                        	hideKeyboard($(this));
                        	var _searchVal = $('#textinput').val();
                            if (_searchVal != searchValue){
                            	searchValue = _searchVal;
                            	search(searchValue);	
                            }
                            event.preventDefault();
                            return false;
                        }
                    }
                });
        	});
        	
        	$('.search-box').on('hide', function() {
        		if (keyModuleSwitchHandler != null) {
                    $(document).on('keydown.search', keyModuleSwitchHandler);
                }
        	});
        	
            $('.search').click(function () {
                // TODO: Why show() doesn't work here?
                $('.search-box').css('display', 'block');
                $('html, body').addClass('html-body-no-overflow');

                $("#textinput").focus();  //EPP-3817

                $("#content-wrap a").attr("tabIndex", -1);
                $("#content-wrap button").attr("tabIndex", -1);
                $("#content-wrap a").attr("aria-hidden", true);
                $("#content-wrap button").attr("aria-hidden", true);

                $(".search-box a").removeAttr("tabIndex");
                $(".search-box button").removeAttr("tabIndex");
                $(".search-box a").removeAttr("aria-hidden");
                $(".search-box button").removeAttr("aria-hidden");
                
                return false;
            });

            $('#search-close').click(function () {
                $('.search-box').hide();
                $('html, body').removeClass('html-body-no-overflow');

                $("#content-wrap a").removeAttr("tabIndex");
                $("#content-wrap button").removeAttr("tabIndex");
                $("#content-wrap a").removeAttr("aria-hidden");
                $("#content-wrap button").removeAttr("aria-hidden");
                
                return false;
            });

            $('#textinput').change(function () {
                hideKeyboard($(this));
                var _searchVal = $(this).val();
                if (_searchVal != searchValue){
                	searchValue = _searchVal;
                    if($('#collection')[0]) {
                        collection = $('#collection').val();
                    }
                    if($('#version')[0]) {
                        version = $('#version').val();
                    }
                    if($('#variant')[0]) {
                        variant = $('#variant').val().split('-')[0];

                    }
                    if(typeof collection !== 'undefined' && typeof variant !== 'undefined') {
                        search(searchValue, collection, version, variant);
                    }
                    else
                    {
                        search(searchValue, null, null, null);
                    }

                }
                return false;
            });
            
            function search(searchValue, collection, version, variant){
                 if(collection != null) {
                     var subset = collection + '/' + version + '/' + variant;
                     var params = {q: searchValue, p: 1, in: subset};
                 }
                else {
                     var params = {q: searchValue, p: 1};
                 }

                 $.get(searchUrl + '?' + $.param(params), function (data) {
                     $('#results').html(formatData(data));
                     infiniteScroll(params);
                 });
            }
        }
    }

});
