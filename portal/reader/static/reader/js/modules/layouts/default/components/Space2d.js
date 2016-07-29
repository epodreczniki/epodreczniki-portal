define(['jquery',
    'modules/core/WomiManager',
    '../../Component',
    'underscore',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/core/HookManager'], function ($, womi, Component, _, Logger, Utils, HookManager) {

    'use strict';
    function newSpace(_this) {
        var tileScheme;
        var tileExtension;
        var tileWidth = 200;

        //view size based on the image
        var viewWidth;
        var viewHeight;

        var imagesX = [];
        var imagesY = [];

        var womiPath;
        var womiConfigFile = 'config/main.json';

        //20 and 0.94
        var timeout = 10;
        var pixelVelocity = 4000; //px per second
        var step = 0;//0.91;
        var debounceTimeout = 250;

        var pixelsToHandlerCall = 1;


        var currentCollection = -1;

        var context;
        var currentImage;
        var imageBuffer = [];

        var imagesToLoad = 0;
        var currentX;
        var currentY;
        var stripesCount = 0;

        var useDummy = true;
        var space2dUsed;

        var timeoutHandler = null;
        var debounceHandler;

        var topbarHeight = 0;
        var pixelsBetweenTiles = 0;
        var containerHeightPercent = 1;//0.8;

        var initFunction = (function (collectionIdentifier, moduleNumber, womiId, dummyJson) {
            if (womiId === undefined) {
                space2dUsed = false;
                _this.trigger('tilesSetSpace2d', false);
                return;
            }
            womiPath = '/content/womi/' + womiId + '/';

            space2dUsed = true;
            _this.trigger('tilesSetSpace2d', true);
            _this.trigger('tilesPositionElements');
            //console.log(collectionIdentifier + ' ' + moduleNumber);
            currentImage = moduleNumber;
            currentCollection = collectionIdentifier;
            $('body').css('overflow', 'hidden');
            $('.reader-content').parent().append('<canvas id="canvas"></canvas>');
            $('#canvas').css({'position': 'absolute', 'z-index': '-10', 'display': 'block', 'left': '0px', 'top': topbarHeight });

            imageBuffer = [];
            context = $('#canvas')[0].getContext('2d');
            _this.on('resizeSpace2d', function(){
                debounceHandler && debounceHandler()
            });
            if (useDummy) {
                $('.reader-content').parent().append('<div class="dummyTilesContainer"></div>');
                var container = $('.reader-content').parent().find('.dummyTilesContainer');
                container.css('display', 'block');
                $.each(dummyJson, function (index) {
                    var module = $('<div class="dummy-module"></div>').appendTo(container).css({'position': 'absolute', 'z-index': -8}).attr({'data-grid-width': this['width'], 'data-grid-height': this['height']});
                    $.each(this['tiles'], function (index, data) {
                        $('<div class="dummy-tile"></div>').appendTo(module).css({'position': 'absolute', 'background-color': 'white', 'opacity': 0.6})
                            .attr({'data-left': data['left'], 'data-top': data['top'], 'data-width': data['width'], 'data-height': data['height']});
                    });
                });
            }
            setDummyVisibility(currentImage, false);
            loadMetadata();
        });

        function afterMetadataLoaded() {
            debounceHandler = _.debounce(canvasResized, debounceTimeout);

            updateCanvasSize();

            updateCurrentXY();
            tryRedraw();
        }

        function loadMetadata() {
            Logger.log('downloading ' + (womiPath + womiConfigFile), _this.name);
            require(['json!' + (womiPath + womiConfigFile)], function (data) {
                tileScheme = data['stripesNamingScheme'];
                tileExtension = data['stripesExtension'];
                viewWidth = Number(data['screenWidth']);
                viewHeight = Number(data['screenHeight']);
                stripesCount = Number(data['stripesCount']);
                _this.trigger('backgroundParams', {
                    viewWidth: viewWidth,
                    viewHeight: viewHeight
                });
                $.each(data['corners'], function (index, d) {
                    imagesX.push(d['left']);
                    imagesY.push(d['top']);
                });
                afterMetadataLoaded();
            });
        }

        //TODO new parameters
        function moveTo(collection, module, beginHandler, endHandler, womiId, dummyJson) {
            //console.log(collection, module, beginHandler, endHandler, womiId, dummyJson);
            //console.log('moveTo from ' + currentCollection + ' to ' + collection);
            if (currentCollection != collection) { //we moved to another module, which may have its own image space
                if (timeoutHandler != null) {
                    window.clearTimeout(timeoutHandler);
                }
                beginHandler();
                $('.dummyTilesContainer').remove();
                $('#canvas').remove();
                currentCollection = collection;
                endHandler();
                initFunction(collection, module, womiId, dummyJson);
                return;
            } else if (!space2dUsed) {
                endHandler();
            }
            var temp = currentImage;
            var afterDownloadHandler = function () {
                setDummyVisibility(temp, true);
                beginHandler();
            };
            animatedImageSwitch(module, afterDownloadHandler, endHandler);
        };

        function animatedImageSwitch(to, beginHandler, endHandler) {
            //console.log('animatedImageSwitch ', currentImage, to, imagesX.length);
            if ($('#canvas').size() > 0 && to >= 0 && to < imagesX.length) {
                animate(currentImage, to, beginHandler, endHandler);
                currentImage = to;
            }
        }

        //checking the presence of images
        function tryRedraw() {
            var firstTile = Math.floor(imagesX[currentImage] / tileWidth);
            var lastTile = Math.floor((imagesX[currentImage] + viewWidth) / tileWidth);
            //console.log(firstTile, lastTile, imagesX[currentImage], currentImage, tileWidth, viewWidth, (imagesX[currentImage] + viewWidth) / tileWidth);
            downloadTiles(firstTile, lastTile, redraw, null);
        }

        function canvasResized() {
            updateCanvasSize();
            redraw();
        }

        function animate(from, to, beginHandler, endHandler) {
            if (timeoutHandler != null) {
                window.clearTimeout(timeoutHandler);
            }
            var firstTile;
            var lastTile;
            if (from < to) { //moving to the right
                firstTile = Math.floor((imagesX[from]) / tileWidth);
                lastTile = Math.floor((imagesX[to] + viewWidth) / tileWidth);
            } else { //moving to the left
                firstTile = Math.floor((imagesX[to]) / tileWidth);
                lastTile = Math.floor((imagesX[from] + viewWidth) / tileWidth);
            }
            var object = {'from': from, 'to': to, 'x': currentX, 'y': currentY, 'beginHandler': beginHandler, 'beginHandlerCalled': false, 'endHandler': endHandler, 'endHandlerCalled': false};
            downloadTiles(firstTile, lastTile, animationFunction, object);
        }

        function sign(val){
            if(val > 0){
                return 1;
            }else if(val < 0){
                return -1;
            }else{
                return 0;
            }
        }

        function animationFunction(object) {
            var toX = imagesX[object['to']];
            var toY = imagesY[object['to']];
            currentX = object['x'];
            currentY = object['y'];
            //check if end else calculate next x and y, call window.setTimeout
            if (!object['beginHandlerCalled']) {
                object['beginHandler']();
                object['beginHandlerCalled'] = true;
            }
            var d = Math.sqrt(Math.pow(toX - currentX, 2) + Math.pow(toY - currentY, 2));
            if (d > 1) {
                redraw();
                var v = pixelVelocity * (timeout / 1000);
                object['x'] = currentX + sign(toX - currentX) * v;//currentX + (1 - step) * (toX - currentX);
                object['y'] = currentY + sign(toY - currentY) * v;//currentY + (1 - step) * (toY - currentY);
                timeoutHandler = window.setTimeout(function () {
                    animationFunction(object);
                }, timeout);
            } else {
                timeoutHandler = null;
                updateCurrentXY();
                redraw();
            }
            if (d < pixelsToHandlerCall && !object['endHandlerCalled']) {
                setDummyVisibility(currentImage, false);
                object['endHandler']();
                object['endHandlerCalled'] = true;
            }
        }

        function updateCanvasSize() {

            var canvas = $('#canvas');
            //to avoid horizontal scrolling
            var aspect = 1.0 / Math.max((viewHeight / (window.innerHeight - topbarHeight)),
                (viewWidth / window.innerWidth));
            canvas[0].width = viewWidth * aspect;
            canvas[0].height = viewHeight * aspect;
            canvas.css({left: 0, top: topbarHeight});
            if (Math.round(canvas[0].width) != Math.round(window.innerWidth)) {
                canvas.css('left', (window.innerWidth - canvas[0].width) / 2);
            } else {
                canvas.css('top', (((window.innerHeight - topbarHeight) - canvas[0].height) / 2) + topbarHeight);
            }


        }

        //could be binary search
        function getIndex(num) {
            for (var i = 0; i < imageBuffer.length; i++) {
                if (imageBuffer[i].number == num) {
                    return i;
                }
            }
            return -1;
        }

        function insertImage(img) {
            var i = 0;
            while (imageBuffer.length != 0 && imageBuffer[i]['number'] < img['number']) {
                i++;
                if (i >= imageBuffer.length) {
                    break;
                }
            }
            imageBuffer.splice(i, 0, img);
        }

        function updateCurrentXY() {
            currentX = imagesX[currentImage];
            currentY = imagesY[currentImage];
        }

        function downloadTiles(firstTile, lastTile, handler, object) {
            if (lastTile < firstTile) {
                var t = lastTile;
                lastTile = firstTile;
                firstTile = t;
            }

            for (var i = firstTile; i <= lastTile; i++) {
                if (getIndex(i) == -1) {
                    imagesToLoad++;
                }
            }
            for (var i = firstTile; i <= lastTile; i++) {
                var _i = (i < stripesCount ? i : stripesCount - 1);
                if (getIndex(i) == -1) {
                    var img = new Image();

                    img.onload = function () {
                        this.title = 'ok';
                        imagesToLoad--;
                        if (imagesToLoad == 0) {
                            handler(object);
                        }
                    };
                    //this may be handled in other way (retry or something)
                    img.onerror = function () {
                        //console.log('error when downloading ' + img.src);
                        this.title = 'error';
                        imagesToLoad--;
                    };
                    img.src = womiPath + tileScheme + _i + '.' + tileExtension;
                    //console.log('downloading ' + img.src);
                    var temp = { 'image': img, 'number': i};
                    insertImage(temp);
                }
            }

            if (imagesToLoad == 0) {
                handler(object);
            }
        }

        //draws image that starts at [currentX, currentY]
        function redraw() {
            var canvas = $('#canvas');
            var width = canvas.width();
            var height = canvas.height();
            context.fillStyle = "rgb(0,204,255)";
            context.fillRect(0, 0, width, height);

            var firstIndex = getIndex(Math.floor(currentX / tileWidth));
            var lastIndex = getIndex(Math.floor((currentX + viewWidth) / tileWidth));

            var firstTileWidth = ((tileWidth - currentX % tileWidth) / tileWidth); //width of the first tile in %

            var lastTileWidth = ((currentX + viewWidth) % tileWidth / tileWidth); //width of the first tile in %

            var drawnTileWidth = width / (lastTileWidth + firstTileWidth + (lastIndex - firstIndex - 1));

            //how drawImage works http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#drawing-images
            for (var i = firstIndex; i <= lastIndex; i++) {
                if (imageBuffer[i]['image'].title == 'error') {
                    continue;
                }
                //console.log(imageBuffer.length, firstIndex, lastIndex, i, currentX, currentY);
                //console.log(imageBuffer[i]['image'], 0, currentY, (currentX + viewWidth) % tileWidth, viewHeight, Math.floor((i - firstIndex - 1) * drawnTileWidth + drawnTileWidth * firstTileWidth), 0, Math.ceil(drawnTileWidth * lastTileWidth), height);
                if (i == firstIndex) {
                    context.drawImage(imageBuffer[i]['image'], currentX % tileWidth, currentY, tileWidth - currentX % tileWidth, viewHeight, 0, 0, drawnTileWidth * firstTileWidth, height);
                } else if (i == lastIndex) {
                    var _w = Math.max(1, (currentX + viewWidth) % tileWidth);
                    var _h = Math.max(1, viewHeight);
                   context.drawImage(imageBuffer[i]['image'], 0, currentY, _w, _h, Math.floor((i - firstIndex - 1) * drawnTileWidth + drawnTileWidth * firstTileWidth), 0, Math.ceil(drawnTileWidth * lastTileWidth), height);
                } else {
                    context.drawImage(imageBuffer[i]['image'], 0, currentY, tileWidth, viewHeight, Math.floor((i - firstIndex - 1) * drawnTileWidth + drawnTileWidth * firstTileWidth), 0, Math.ceil(drawnTileWidth), height);
                }
            }

            var tilesHeight = height;//$(window).height() * containerHeightPercent;

            var imagePixelToRealH = viewHeight / (height - topbarHeight);

            var imagePixelToRealW = viewWidth / width;

            $('.dummy-module').each(function (index) {
                var main = $(this);
                var gridWidth = main.attr('data-grid-width');
                var gridHeight = main.attr('data-grid-height');

                var spacesSumH = pixelsBetweenTiles * (gridHeight - 1);
                var spacesSumW = pixelsBetweenTiles * (gridWidth - 1);
                var cellSize = (tilesHeight - spacesSumH) / gridHeight;

                var deltaX = (currentX - imagesX[index]) / imagePixelToRealW;
                var deltaY = (currentY - imagesY[index]) / imagePixelToRealH;

                var spaceLeft = ((width - (cellSize * gridWidth + spacesSumW)) / 2 - deltaX) + canvas.position().left;

                var spaceTop = ((height - (cellSize * gridHeight + spacesSumH)) / 2 - deltaY);
                main.css({'height': tilesHeight + 'px', 'width': (cellSize * gridWidth + spacesSumW) + 'px', 'top': spaceTop + topbarHeight + 'px', 'left': spaceLeft + 'px'});
                main.children().each(function (index, data) {

                    var xToSet = ((Number($(data).attr('data-left')) - 1) * cellSize) + ((Number($(data).attr('data-left')) - 1) * pixelsBetweenTiles) + 'px';
                    var yToSet = ((Number($(data).attr('data-top')) - 1) * cellSize) + ((Number($(data).attr('data-top')) - 1) * pixelsBetweenTiles) + 'px';
                    var widthToSet = (Number($(data).attr('data-width')) * cellSize) + (Number($(data).attr('data-width') - 1) * pixelsBetweenTiles) + 'px';
                    var heightToSet = (Number($(data).attr('data-height')) * cellSize) + (Number($(data).attr('data-height') - 1) * pixelsBetweenTiles ) + 'px';
                    $(data).css({'left': xToSet, 'top': yToSet, 'width': widthToSet, 'height': heightToSet});
                });
            });

        }

        function setDummyVisibility(which, state) {
            if ($('.dummyTilesContainer').children().length > which) {
                $('.dummyTilesContainer').children()[which].style.display = state ? '' : 'none';
            }
        }

        return {
            initFunction: initFunction,
            moveTo: moveTo
        }

    }


    return Component.extend({
        name: 'Space2d',
        elementSelector: '[data-grid-width]',

        postInitialize: function (options) {
            var space = newSpace(this);
            var _this = this;
            var spaceInitialized = false;
            HookManager.addHook('loadModuleHook', function(kernel, moduleElement, fromClick, save){
                var params = ['save', 'ajaxUrl', 'module_id', 'version', 'href', 'dependencies', 'click', 'moduleElement'];
                //we can add one more condition to disable image space
                //TODO: consider rework loadModule to accept just HTML element - resolve attr()
                if (spaceInitialized && moduleElement) {
                    var temp = $(moduleElement);
                    var parent = $('#table-of-contents').find('[data-toc-path=' + moduleElement.attr('data-toc-parent-path') + ']');
                    var base = $('#module-base');
                    //base.attr('href', temp.data('ajax-url'));
                    kernel._layout.trigger('space2dMoveStart', moduleElement);
                    kernel._layout.trigger('space2dMoveTo', [moduleElement.attr('data-toc-parent-path'),
                        Number(moduleElement.attr('data-attribute-panorama-order') - 1), function () {
                            $('#module-content').html('');
                        }, function () {
                            kernel.trigger('loadModule', _.object(params, [save, temp.data('ajax-url'),
                                temp.data('module-id'), temp.data('module-version'), temp.attr('href'), temp.data('dependencies-url'), fromClick, temp]));
                            kernel._layout.trigger('space2dMoveEnd', moduleElement);
                        }, parent.attr('data-attribute-panorama-womi-id'), Utils.collectTilesDummies(parent)]);
                    return false;
                } else {
                    return true;
//                    return kernel.trigger('loadModule', _.object(params, [true, $(this).data('ajax-url'), '#module-content',
//                        $(this).data('module-id'), $(this).data('module-version'), $(this).attr('href'), $(this).data('dependencies-url'), fromClick, $(this)]));
                }
            });

            this.listenTo(this._layout, 'initSpace', function (args) {
                spaceInitialized = true;
                space.initFunction.apply(null, args);
                _this.trigger('hideTOC');
            });

            this.listenTo(this._layout, 'space2dMoveTo', function (args) {
                space.moveTo.apply(null, args);
            });

            this.listenTo(this._layout, 'windowResize', function () {
                _this.trigger('resizeSpace2d');
            });

            this.listenTo(this._layout, 'userTypeSelect', function(){
                _this.trigger('resizeSpace2d');
            });
        }
    });
});

