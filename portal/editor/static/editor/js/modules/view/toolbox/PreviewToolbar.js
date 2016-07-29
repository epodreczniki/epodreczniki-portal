define(['jquery',
    'underscore',
    'backbone',
    '../../models/GridElementCollection',
    '../../models/blocks/BlockCollection',
    '../grid/Element',
    '../util/ColorPool',
    'modules/view/blocks/states/PreviewState'
], function ($, _, Backbone, GridElementCollection, BlockCollection, Element, ColorPool, Preview) {
    return Backbone.View.extend({
        previewState: {
            isImageLoaded: false,
            isImageMoving: false,
            isMouseDown: false,
            mouseDownPosition: {
                x: 0,
                y: 0
            },
            zoomFactor: 1.0,
            originalSize: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        },

        initialize: function (opts) {
            this.grid = opts.grid;
            this.model = opts.model;
            this.cache = opts.cache;

            //_.bindAll(this, 'keydown');
            _.bindAll(this, 'openLoadImageDialog');
            _.bindAll(this, 'clearLoadedImage');
            _.bindAll(this, 'startMoving');
            _.bindAll(this, 'stopMoving');
            _.bindAll(this, 'resetPositionAndZoom');
            _.bindAll(this, 'zoomIn');
            _.bindAll(this, 'zoomOut');
            _.bindAll(this, 'zoomReset');
            _.bindAll(this, 'toggleGridVisible');
            _.bindAll(this, 'toggleButtonsVisible');
            _.bindAll(this, 'mousedown');
            _.bindAll(this, 'mouseup');
            _.bindAll(this, 'mousemove');
            _.bindAll(this, 'fileInputChange');
            _.bindAll(this, 'setProp_16_9');
            _.bindAll(this, 'setProp_4_3');

            $("#btn-open").click(this.openLoadImageDialog);
            $("#btn-reset").click(this.resetPositionAndZoom);
            $("#btn-clear").click(this.clearLoadedImage);
            $("#btn-move").click(this.startMoving);
            $("#btn-lock").click(this.stopMoving);
            $("#btn-zoom-in").click(this.zoomIn);
            $("#btn-zoom-out").click(this.zoomOut);
            $("#btn-full-size").click(this.zoomReset);
            $("#btn-grid").click(this.toggleGridVisible);
            $("#btn-buttons").click(this.toggleButtonsVisible);
            $("#btn-16-9").click(this.setProp_16_9);
            $("#btn-4-3").click(this.setProp_4_3);

            $("#uploadBoxInput").change(this.fileInputChange);
            
            this.updateToolbarButtonsVisibility();
        },

		updateToolbarButtonsVisibility: function () {
			var visible = this.previewState.isImageLoaded;
			
			$("#btn-reset").css("display", visible ? "inline" : "none");
            $("#btn-clear").css("display", visible ? "inline" : "none");
            $("#btn-move").css("display", visible ? "inline" : "none");
            $("#btn-lock").css("display", visible ? "inline" : "none");
            $("#btn-zoom-in").css("display", visible ? "inline" : "none");
            $("#btn-zoom-out").css("display", visible ? "inline" : "none");
            $("#btn-full-size").css("display", visible ? "inline" : "none");
		},

        setState: function () {
            this.model.set('currentState', Preview);
        },

        inputsEnabled: function (enabled) {
            if (enabled) {
                $("html").bind('keydown', this.keydown);
                $("html").bind('mousedown', this.mousedown);
                $("html").bind('mouseup', this.mouseup);
                $('html').bind('mousemove', this.mousemove);
            } else {
                $("html").unbind('keydown', this.keydown);
                $("html").unbind('mousedown', this.mousedown);
                $("html").unbind('mouseup', this.mouseup);
                $('html').unbind('mousemove', this.mousemove);
                this.setMovingImage(false);
				this.previewState.isMouseDown = false;
            }
        },

        openLoadImageDialog: function () {

            if (!this.previewState.isImageMoving) {
                $("#uploadBoxInput").click();
            }
        },

        clearLoadedImage: function () {

            if (this.previewState.isImageLoaded) {
                if (confirm("Czy chcesz usunąć obraz tła?")) {
                    $('#uploadBoxImage').css("display", "none");
                    $('#uploadBoxImage').attr("src", null);

                    this.previewState.zoomFactor = 1.0;
                    this.previewState.originalSize.width = 0;
                    this.previewState.originalSize.height = 0;
                    this.previewState.isImageLoaded = false;
                    this.previewState.isImageMoving = false;
                    this.previewState.isMouseDown = false;
                    this.model.set('currentBackground', null);
                    var board = $('#board');
                    board.css("background-color", "rgba(0, 0, 0, 0.62)");
                    
                    this.updateToolbarButtonsVisibility();
                }
            }
        },

        startMoving: function () {

            // start moving
            if (this.previewState.isImageLoaded && !this.previewState.isImageMoving) {
                this.setMovingImage(true);
            }
        },

        stopMoving: function () {

            // stop moving
            if (this.previewState.isImageLoaded && this.previewState.isImageMoving) {
                this.setMovingImage(false);
            }
        },

		setMovingImage: function (state) {
			this.previewState.isImageMoving = state;
			this.grid.blocks.each(function (block) {
				block.trigger('setBlockDraggable', !state);
			});
		},

        resetPositionAndZoom: function () {

            // reset size and position
            if (this.previewState.isImageLoaded) {

                var board = $('#board');
                var uploadBoxImage = $('#uploadBoxImage');

                this.previewState.originalSize.x = parseInt(board.position().left);
                this.previewState.originalSize.y = parseInt(board.position().top);
                this.previewState.zoomFactor = 1.0;

                //uploadBoxImage.height(this.previewState.originalSize.height);
                this.fitImage(uploadBoxImage);
                uploadBoxImage.css("left", board.position().left+1);
                uploadBoxImage.css("top", board.position().top+1);

                this.previewState.isImageMoving = false;
                this.previewState.isMouseDown = false;
            }
        },

        zoomIn: function () {

            if (this.previewState.isImageLoaded) {
                this.previewState.zoomFactor += 0.01;
                var height = parseInt(this.previewState.zoomFactor * this.previewState.originalSize.height);
                $('#uploadBoxImage').height(height);
                var width = parseInt(this.previewState.zoomFactor * this.previewState.originalSize.width);
                $('#uploadBoxImage').width(width);
            }
        },

        zoomOut: function () {

            if (this.previewState.isImageLoaded) {
                this.previewState.zoomFactor -= 0.01;
                if (this.previewState.zoomFactor < 0.05) {
                    this.previewState.zoomFactor = 0.05;
                }
                var height = parseInt(this.previewState.zoomFactor * this.previewState.originalSize.height);
                $('#uploadBoxImage').height(height);
                var width = parseInt(this.previewState.zoomFactor * this.previewState.originalSize.width);
                $('#uploadBoxImage').width(width);
            }
        },

        zoomReset: function () {

            if (this.previewState.isImageLoaded) {
                this.previewState.zoomFactor = 1.0;
                var height = parseInt(this.previewState.originalSize.height);
                $('#uploadBoxImage').height(height);
                var width = parseInt(this.previewState.originalSize.width);
                $('#uploadBoxImage').width(width);
            }
        },

        toggleGridVisible: function () {

            var visible = this.model.get('gridVisible');
            this.setGridVisible(!visible);
        },

        toggleButtonsVisible: function () {
        	
        	var visible = this.model.get('buttonsVisible');
        	this.setButtonsVisible(!visible);
        },

		setButtonsVisible: function (visible) {
			this.grid.blocks.each(function (block) {
				block.trigger('setButtonsVisible', visible);
            });
            this.model.set('buttonsVisible', visible);
		},

        setGridVisible: function (visible) {
            $(".grid-element").each(function (idx, val) {
                $(val).css("display", visible ? "block" : "none");
            });
            this.model.set('gridVisible', visible);
        },

        mousedown: function (e) {
            if (this.previewState.isImageLoaded && this.previewState.isImageMoving) {
                var pos = $('#uploadBoxImage').position();
                this.previewState.originalSize.x = parseInt(pos.left);
                this.previewState.originalSize.y = parseInt(pos.top);
                this.previewState.mouseDownPosition.x = parseInt(e.clientX);
                this.previewState.mouseDownPosition.y = parseInt(e.clientY);
                this.previewState.isMouseDown = true;
            }
        },

        mouseup: function (e) {
            if (this.previewState.isImageLoaded && this.previewState.isImageMoving) {
                this.previewState.isMouseDown = false;
            }
        },

        mousemove: function (e) {
            if (this.previewState.isMouseDown) {
                var uploadBoxImage = $('#uploadBoxImage');
                var x = parseInt(this.previewState.originalSize.x) + parseInt(e.clientX) - parseInt(this.previewState.mouseDownPosition.x);
                var y = parseInt(this.previewState.originalSize.y) + parseInt(e.clientY) - parseInt(this.previewState.mouseDownPosition.y);
                uploadBoxImage.css("left", x + "px");
                uploadBoxImage.css("top", y + "px");
            }
        },

        fileInputChange: function () {
            this.readFileToPreview();
        },

        readFileToPreview: function () {
            var _this = this;
            var input = $("#uploadBoxInput").get(0);
            if (input.files && input.files[0]) {
                this.model.set('currentBackground', input.files[0].name);
                var reader = new FileReader();
                reader.onload = function (e) {
                    var uploadBoxImage = $('#uploadBoxImage');
                    var board = $('#board');
                    uploadBoxImage.attr('src', null);
                    uploadBoxImage.get(0).onload = function () {
						
						uploadBoxImage.css({width: '', height: ''});
						uploadBoxImage.css("position", "fixed");
						uploadBoxImage.css("left", (board.position().left+1) + "px");
						uploadBoxImage.css("top", (board.position().top+1) + "px");
						uploadBoxImage.css("z-index", "-100");
						uploadBoxImage.css("display", "block");

						board.css("background-color", "transparent");
						board.css("border", "1px dashed #ff0000");

                        _this.previewState.zoomFactor = 1.0;
                        _this.previewState.originalSize.x = parseInt(board.position().left);
                        _this.previewState.originalSize.y = parseInt(board.position().top);
                        _this.previewState.originalSize.width = parseInt(uploadBoxImage.width());
                        _this.previewState.originalSize.height = parseInt(uploadBoxImage.height());
                        _this.previewState.isImageLoaded = true;
                        _this.previewState.isImageMoving = false;
                        _this.previewState.isMouseDown = false;
                        _this.setProp_x_y(_this.model.get('propX'), _this.model.get('propY'));
                        _this.fitImage(uploadBoxImage);
                        
                        _this.updateToolbarButtonsVisibility();
                        
                        // recreate controls
                        $("#uploadBoxForm").remove();
                        var form = $("<form>", {
                        	id: 'uploadBoxForm',
                        	runat: 'server',
                        	style: 'display: none;'
                        });
                        var fileInput = $('<input>', {
							id: 'uploadBoxInput',
							type: 'file'
						});
						fileInput.change(_this.fileInputChange);
                        form.append(fileInput);
                        $("#uploadBox").append(form);
                    };
                    uploadBoxImage.attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);

            }
        },

        fitImage: function (img) {
            var board = $('#board');
            var h = board.height();
            var w = board.width();
            this.previewState.zoomFactor = 1.0 / Math.max((this.previewState.originalSize.height / h),
                (this.previewState.originalSize.width / w));
            img.height(this.previewState.zoomFactor * this.previewState.originalSize.height);
            img.width(this.previewState.zoomFactor * this.previewState.originalSize.width);
        },

        setProp_16_9: function () {
            this.setProp_x_y(16, 9);
        },

        setProp_4_3: function () {
            this.setProp_x_y(4, 3);
        },

        setProp_x_y: function (x, y) {
            this.model.set('propX', x);
            this.model.set('propY', y);
            this.model.trigger('propXYchanged');
        }

    });
});
