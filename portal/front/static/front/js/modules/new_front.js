require([
    'domReady',
    'jquery',
    'modules/admin_messages',
    'modules/new_front/search_box',
    'modules/search_results',
    'modules/kzd_index',
    'EpoAuth'
],
    function (domReady, $, adminMessages, searchBox, searchResults, kzdIndex, EpoAuth) {

        domReady(function () {
            EpoAuth.connectToPage($('#topbar').find('.epo-auth-hook'));


            EpoAuth.once(EpoAuth.POSITIVE_PING, function(){
                $('.settings-container').show();
            });

            EpoAuth.once(EpoAuth.NEGATIVE_PING, function(){
                $('.settings-container').hide();
            });

            EpoAuth.ping();

            $('body').on('click', function (ev) {
                if ($(ev.target).is('.dropdown-toggle')) {
                    $('.dropdown-group').removeClass('open');
                    $(ev.target).parent().addClass('open');
                } else {
                    $('.dropdown-group').removeClass('open');
                }
            });
            $(".dropdown-group .dropdown-toggle").click(function () {
                if ($(this).parent().hasClass("open")) {
                    $(this).parent().find(".dropdown-menu").attr("role", "menu");
                } else {
                    $(this).parent().find(".dropdown-menu").attr("role", "alert");
                }
            });

            var eduLevels = $('#list-of-levels').find('a').map(function (i, o) {
                return o.pathname;
            });
            var currentEduLevel = $('.level-box').data('active-level-id');

            $('.level-box .next-x').on('click', function (ev) {
                goTo(eduLevels[currentEduLevel] || _.first(eduLevels));
            });

            $('.level-box .prev-x').on('click', function (ev) {
                goTo(eduLevels[currentEduLevel - 2] || _.last(eduLevels));
            });

            $('.education-class-new a.active').on('click', function (ev) {
                ev.preventDefault();
                // ALERT BAD BAD BAD BAD BAD BAD BAD ALERT 

                //var badurl = eduLevels[currentEduLevel - 1].split("/").slice(0, -2).join('/');
                goTo(eduLevels[currentEduLevel-1]);
            });

            $('div.res-lister').keydown(function (event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13) {
                    var searchValue = $(event.currentTarget).find('input').val();
                    var locPath = window.location.pathname;
                    if (locPath.toLowerCase().indexOf($('.url-container').data('index-url')) < 0) {
                        window.location.href = $('.url-container').data('index-url') + "?search=" + encodeURI(searchValue);
                    } else {
                        search(decodeURI(searchValue));
                    }
                }
            });

            var search = function (searchValue) {
                console.log("searchValue: asjkjdlahkfjsdh", searchValue);
                if (searchValue !== undefined) {
                    var allResults = $('.result-item');
                    var visibleResults = [];
                    var invisibleResults = [];
                    _.each(allResults, function (item) {
                        if ($(item).data('title').toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                            visibleResults.push($(item));
                        } else if ($(item).data('category').toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                            visibleResults.push($(item));
                        } else if ($(item).data('description').toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                            visibleResults.push($(item));
                        } else if ($(item).data('author').toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                            visibleResults.push($(item));
                        } else if ($(item).data('keywords').toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                            visibleResults.push($(item));
                        } else {
                            invisibleResults.push($(item));
                        }
                    });
                    _.each(visibleResults, function (item) {
                        item.show();
                    });
                    _.each(invisibleResults, function (item) {
                        item.hide();
                    });
                    if (visibleResults.length > 0) {
                        $('div.no-results').hide();
                    } else {
                        $('div.no-results').show();
                    }
                }
            };


            var queryString = window.location.search;
            queryString = queryString.substring(1);
            var queries = queryString.split("=");
            if (queries[0] == 'category') {
                var category;
                switch (queries[1]) {
                    case 'epodreczniki':
                        category = 'e-podręczniki';
                        break;
                    case 'podreczniki':
                        category = 'podręczniki';
                        break;
                    case 'multimedia-edukacyjne':
                        category = 'multimedia edukacyjne';
                        break;
                    case 'poradniki-dla-nauczycieli':
                        category = 'poradniki dla nauczycieli';
                        break;
                    case 'programy-nauczania':
                        category = 'programy nauczania';
                        break;
                    case 'karty-pracy':
                        category = 'karty pracy';
                        break;
                    case 'scenariusze-lekcji':
                        category = 'scenariusze lekcji';
                        break;
                    case 'lektury-szkolne':
                        category = 'lektury szkolne';
                        break;
                    case 'zdjecia-i-ilustracje':
                        category = 'zdjęcia i ilustracje';
                        break;
                    case 'czcionka':
                        category = 'czcionka pisanka szkolna';
                        break;
                    case 'nagrania-edukacyjne':
                        category = 'nagrania edukacyjne';
                        break;
                    case 'generator-kart-pracy':
                        category = 'generator kart pracy';
                        break;
                    case 'podstawa programowa':
                        category = 'podstawa programowa';
                        break;
                    case 'literatura':
                        category = 'literatura';
                        break;
                    case 'gry-edukacyjne':
                        category = 'gry edukacyjne';
                        break;
                    case 'e-learning':
                        category = 'e-learning';
                        break;
                    case 'testy-i-sprawdziany':
                        category = 'testy i sprawdziany';
                        break;
                    case 'wirtualne-wycieczki':
                        category = 'wirtualne wycieczki';
                        break;
                    case 'doswiadczenia':
                        category = 'doświadczenia';
                        break;
                }

                var allResults = $('.result-item');
                var visibleResults = [];
                var invisibleResults = [];
                _.each(allResults, function (item) {
                    if ($(item).data('category').toLowerCase().indexOf(category) >= 0) {
                        visibleResults.push($(item));
                    } else {
                        invisibleResults.push($(item));
                    }
                });
                _.each(visibleResults, function (item) {
                    item.show();
                });
                _.each(invisibleResults, function (item) {
                    item.hide();
                });
                if (visibleResults.length > 0) {
                    $('div.no-results').hide();
                } else {
                    $('div.no-results').show();
                }
            } else {
//                console.log("Query from search: ", queries[1]);
                $('div.res-lister').find('input').val(decodeURI(queries[1] || ''));
                search(decodeURI(queries[1]));
            }

            $(".categories").children().each(function (ind, category) {
                var oldValue = $(category).find('p').html();
                if (oldValue.indexOf('podręczniki') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Podręczniki<br>' + cropCount);
                } else if (oldValue.indexOf('nagrania edukacyjne') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Nagrania Edukacyjne<br>' + cropCount);
                } else if (oldValue.indexOf('poradniki dla nauczycieli') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Poradniki Dla Nauczycieli<br>' + cropCount);
                } else if (oldValue.indexOf('mapy') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Mapy<br>' + cropCount);
                } else if (oldValue.indexOf('lektury szkolne') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Lektury Szkolne<br>' + cropCount);
                } else if (oldValue.indexOf('programy nauczania') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Programy Nauczania<br>' + cropCount);
                } else if (oldValue.indexOf('scenariusze lekcji') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Scenariusze Lekcji<br>' + cropCount);
                } else if (oldValue.indexOf('generator kart pracy') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Generator Kart Pracy<br>' + cropCount);
                } else if (oldValue.indexOf('czcionka pisana szkolna') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Szkolne Pismo<br>' + cropCount);
                } else if (oldValue.indexOf('karty pracy') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Karty Pracy<br>' + cropCount);
                } else if (oldValue.indexOf('zdjęcia i ilustracje') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Zdjęcia i ilustracje<br>' + cropCount);
                } else if (oldValue.indexOf('multimedia edukacyjne') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Multimedia Edukacyjne<br>' + cropCount);
                } else if (oldValue.indexOf('podstawa programowa') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Podstawa Programowa<br>' + cropCount);
                } else if (oldValue.indexOf('literatura') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Literatura<br>' + cropCount);
                } else if (oldValue.indexOf('gry edukacyjne') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Gry Edukacyjne<br>' + cropCount);
                } else if (oldValue.indexOf('e-learning') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('E-learning<br>' + cropCount);
                } else if (oldValue.indexOf('testy i sprawdziany') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Testy i Sprawdziany<br>' + cropCount);
                } else if (oldValue.indexOf('wirtualne wycieczki') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Wirtualne Wycieczki<br>' + cropCount);
                } else if (oldValue.indexOf('doświadczenia') >= 0) {
                    var cropCount = oldValue.substr(oldValue.indexOf('['), oldValue.length - 1);
                    $(category).find('p').html('Doświadczenia<br>' + cropCount);
                }
            });

            var locPath = window.location.pathname;
            if (locPath.toLowerCase().indexOf($('.url-container').data('index-url')) < 0) {
                $('.new-search').hide();
            } else {
                $('.new-search').show();
            }

            console.log("CATEGORY :::: ", category);

            var catName = window.location.search.replace("?category=", "").replace("-", " ");
            if (catName.length) {
                $("#current-name").text(category);
                $("#filters-lister").show();
            }
            ;

            function goTo(n) {
                //var url = n.replace("education/2/level/1", "education/2/level/4");
                window.location.pathname = n;
            };

        });
        //searchBox.init();
        adminMessages();
    });
