define(['underscore',
        'jquery',
        'modules/core/WomiManager',
        'modules/core/womi/WOMIImageContainerEmbedded',
        'modules/core/womi/WOMIIconContainerEmbedded'],

    function (_, $, WomiManager, WOMIImageContainerEmbedded, WOMIIconContainerEmbedded) {
        var womiOverrides = {
            'image-container': WOMIImageContainerEmbedded,
            'icon-container': WOMIIconContainerEmbedded
        };

        var addImages = function (str, images, source, isLoaded) {

            if (images && images.length > 0) {
                var container = $('<div class="interactive-exercise-content">').html(str);
                var imgLoaded = 0, loadedImages = [];

                function returnCallback() {
                    if (imgLoaded == images.length) {
                        loadedImages.sort(function(a, b){ return a.order - b.order });
                        isLoaded && isLoaded(loadedImages);
                    }
                }

                container.find('img').each(function (index, value) {
                    var elem = $('<div>', {
                        class: "image-inside-exercise",
                        css: {
                            width: $(value).data('width')  
                        }
                    });
                    if (images[index].indexOf("womi#") === 0) {
                        var womiId = images[index].split("#")[1];
                        $(value).after(elem).remove();
                        checkWomi(source, womiId, function(){
                            WomiManager.loadSingleWOMI(womiId, elem, function (o) {
                                o.selected.object.getLoadedImage(function (l) {
                                    imgLoaded++;
                                    loadedImages.push({order: index, img: $(l.img), elem: elem});
                                    returnCallback();
                                });
                            }, womiOverrides);
                        },
                        function() {
                            WomiManager.loadSingleWOMI("13784", elem);
                        }
                        );

                    } else {
                        value.onload = function () {
                            imgLoaded++;
                            loadedImages.push({order: index, img: $(this), elem: elem});
                            returnCallback();
                        };
                        $(this).attr('src', source + "/" + images[index]).after(elem);
                        elem.append($(this));
                    }
                });

                return container;
            } else {
                return str;
            }


        };

        var addWomi = function (str, elements, source) {
        
            var container = $('<div class="interactive-exercise-content">').html(str);

            if (elements && elements.length > 0) {


                container.find('womi').each(function (index, value) {

                    var elem = $('<div>', {
                        class: 'womi-inside-exercise'
                    }); 

                    var womiId = elements[index].split("#")[1];

                    $(value).after(elem).remove();

                    checkWomi(source, womiId, 
                    
                        function() {
                            WomiManager.loadSingleWOMI(womiId, elem);
                        },

                        function() {
                            WomiManager.loadSingleWOMI("13784", elem);
                        }

                    )

                })
           }

           return container;

        };

        var checkWomi = function(source, womiId, callback, callbackWrong) {
            
            require(['text!' + source + '/manifest.json'], function(manifest) {
            
                var womiIds = JSON.parse(manifest)['womiIds'] || [];

                _.each(womiIds, function(womiId, index){
                    womiIds[index] = womiId + '';
                });

                womiIds.indexOf(womiId + '') > -1 ? callback() : callbackWrong();

            });

        };

        var showError = function(destination) {
        };

        var returnImg = function (str, images, source) {
            return $(addImages(str, images, source)).find('img');
        };



        return {
            addImages: addImages,
            returnImg: returnImg,
            addWomi: addWomi
        }

    });
