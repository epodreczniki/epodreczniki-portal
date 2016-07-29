define(['jquery',
    'underscore',
    'backbone',
    './../../libs/jstree',
    './../../utils/RTUtils',
    'base_dialog',
    'text!./templates/CatalogueTree.html',
    'text!./templates/WOMIItem.html'], function ($, _, Backbone, jstree, RTUtil, Dialog, CatalogueTree, WOMIItem) {
    return Dialog.extend({

        dialogHeight: 350,
        dialogWidth: 700,

        PAGE_SIZE: 10,

        dialogClass: ' womi-select-dialog',

        initialize: function (params) {
            //this.fields = params.fields;
        	this.treeData = params.treeData;
        	this.selectedPath = params.selectedPath;
            this.saveCallback = params.saveCallback;
            this.template = CatalogueTree;
            this.buttonText = 'Wybierz';
            this.header = 'Wybierz WOMI';
            this.created = false;
            this.selectedWomi = null;
        },

        _click: function () {
            if (this.selectedWomi === null) {
                alert('Nie wybrano WOMI');
                return false;
            }

            this.saveCallback(this.selectedWomi.id, this.selectedWomi, this.treeData, this.selectedPath);
        },

        _afterOpen: function () {
            var _this = this;
            this.dialog.dialog('option', 'title', this.header);
            this.dialog.on("dialogbeforeclose", function (event, ui) {
                $(this).dialog('widget').hide();
                return false;
            });


            function prepareData(d) {
                d.text = d.name;
                if (d.subfolders) {
                    d.children = d.subfolders;
                    _.each(d.children, function (subfolder) {
                        prepareData(subfolder);
                    });
                    if (d.children.length === 0) {
                        delete d.children
                    }
                }
            }
            var tree = _this.dialog.find('.tree-handle');

            if(_this.treeData == null || _this.treeData === undefined){
            	var loadingDiv = $('<div/>', {text: 'loading folders list ...'});
                loadingDiv.addClass("loading-folders");
            	$.get('{% url "editor.views.folders" %}', function (data) {
                    prepareData(data);
                    _this.treeData = data;
                    tree.jstree({'core': {
                        'data': data.subfolders
                    }});
                    _this.womiList = _this.dialog.find('.womi-list-handle');
                    tree.on("changed.jstree", function (e, data) {
                        if(data.selected && data.selected.length == 1) {
                        	_this.selectedPath = data.selected[0];
                            _this._loadWomis(data.selected[0]);
                        }
                    });
                    loadingDiv.remove();
                }).fail(function (xhr, textStatus, errorMessage) {
                    //alert(errorMessage+ ". Please again later.")
                    loadingDiv.text("ERROR: " + errorMessage + ". Spróbuj jeszcze raz później.");
                });
            }else{
            	tree.bind('before.jstree', function(e, data) {
            	    // invoked before jstree starts loading
            	}).bind('loaded.jstree', function(e, data) {
            	    $(this).jstree("open_node", _this.selectedPath);
            	    $(this).jstree("select_node", _this.selectedPath);
            	}).jstree({'core': {
            		'data': _this.treeData.subfolders
                }});

            	_this.womiList = _this.dialog.find('.womi-list-handle');
            	tree.on("changed.jstree", function (e, data) {
            		if(data.selected && data.selected.length == 1) {
            			_this.selectedPath = data.selected[0];
            			_this._loadWomis(data.selected[0]);
            		}
            	});
            }
            this.created = true;
            var dialogUi = $(this.dialog).dialog();
            dialogUi.parent().height(this.dialogHeight);
            dialogUi.height(this.dialogHeight - 100);

            dialogUi.width(this.dialogWidth);

            dialogUi.prepend(loadingDiv);

            this.dialog.on("dialogresize", function (event, ui) {
                _this._resizeDialog();
            });

            this._resizeDialog();
        },

        _resizeDialog: function () {
            var womiList = this.dialog.find('.womi-list-handle');
            if (womiList.find('img').length > 0) {
                womiList.find('img').each(function () {

                    var maxWidth = $(this).width();
                    var maxHeight = $(this).height();

                    var width = $(this).width();
                    var height = $(this).height();

                    if (width > maxWidth) {
                        var ratio = maxWidth / width;
                        $(this).css("width", maxWidth);
                        $(this).css("height", height * ratio);
                        $(this).css("max-width", maxWidth);
                        $(this).css("max-height", height * ratio);
                        height = height * ratio;
                    }

                    if (height > maxHeight) {
                        var ratio = maxHeight / height;
                        $(this).css("height", maxHeight);
                        $(this).css("width", width * ratio);
                        $(this).css("max-height", maxHeight);
                        $(this).css("max-width", width * ratio);
                        width = width * ratio;
                    }

                });

            }
        },

        _infiniteScroll: function(data, url, params, callback) {
            var items = this.womiList;
            var allItemsCount = data.count;
            var pages = parseInt(Math.floor(allItemsCount / this.PAGE_SIZE));
            var current_page = 0;
            var lock = false;
            items.off('scroll');
            items.scroll(function () {
                var winTop = items.scrollTop(),
                        docHeight = items[0].scrollHeight,
                        winHeight = items.height();
                var scrollTrigger = 0.95;

                if (((winTop / (docHeight - winHeight)) > scrollTrigger) && !lock) {
                    if (++current_page <= pages) {
                        params.pageIndex = current_page;
                        lock = true;
                        $.getJSON(url, params, function (data) {
                            callback(data);
                            lock = false;
                        });
                    }
                }
            });
        },

        _loadWomis: function (id) {
            var _this = this;
            _this.womiList.html('');
            var loadingDiv = $("<div>", {"class": "loading-image"});
            _this.womiList.append(loadingDiv);
            this.selectedWomiId = null;

            var callback = function(data){
                _.each(data.items, function (item) {
                    //var data = {womi: item, image: RTUtil.getMinatureImage(item.id)};
                    var data = {womi: item, image: RTUtil.getFullImage(item.id)};
                    var womiItem = $(_.template(WOMIItem, data));
                    _this.womiList.append(womiItem);
                    womiItem.data(data);

                });
                _this.womiList.find('.womi-item').click(function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    _this.selectedWomi = $(this).data();
                });
            };
            var url = '{% url "editor.views.searchwomi" %}';
            var params = {
                folder: id,
                pageSize: this.PAGE_SIZE,
                pageIndex: 0
            };
            $.get(url, params, function (data) {
                _this.womiList.html('');
                callback(data);

                _this._resizeDialog();
                _this._infiniteScroll(data, url, params, callback);
            }, null, 'json').fail(function (xhr, textStatus, errorMessage) {
                _this.womiList.html('');
                alert(errorMessage + " Spróbuj jeszcze raz później.");
            });
        },

        _attributes: function () {
            return { };
        },

        hide: function () {
            this.dialog.dialog('widget').hide();
        },

        show: function () {
            if (this.created) {
                this.dialog.dialog('widget').show();
                this.dialog.dialog('moveToTop');
            } else {
                this.open();
            }
        }
    })
});
