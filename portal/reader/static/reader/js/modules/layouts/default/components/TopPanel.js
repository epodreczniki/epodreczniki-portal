define(['jquery',
    'backbone',
    '../../Component',
    'text!../templates/TopPanelItem.html',
    'underscore',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/core/WomiManager'], function ($, Backbone, Component, TopPanelItem, _, Logger, Utils, womi) {

    var PanelSlide = Backbone.View.extend({
        initialize: function (options) {
            this.element = options.element;
            this.setElement($('<div>', {'class': 'dropdown-div'}));
        },

        hide: function () {
            this.$el.hide();
        },

        render: function () {
            this.$el.html('');
            var parent = this.$el.parent();
            var _this = this;
            var found = false;
            _.each(womi.objects, function (o) {
                if(!(o._selectedElement || o._selectedBlock)){ return }
                var cnt = (o._selectedElement || o._selectedBlock).womiObj._mainContainerElement;
                if (cnt.hasClass(_this.element.validClass) && o.roles.context) {
                    var title = o._title || cnt.data('alt');
                    var item = $(_.template(TopPanelItem, {title: title}));
                    //item.find('a').click(function () { //-> changed to enable clicking on the whole <li> element
                        item.click(function () {
                        if(o.contextCallback()){
                            //o.contextCallback();
                        }else if(o._fullscreenMenuItem()){
                            o._fullscreenMenuItem().callback();
                        }
                        return false;
                    });
                    _this.$el.append(item);
                    found = true;
                }
            });
            if (!found) {
                var item = $(_.template(TopPanelItem, {title: 'brak elementów do wyświetlenia'}));
                //item.find('a').removeAttr('href'); //no more <a> elements in pin bar
                _this.$el.append(item);
            }
            //_this.$el.height($(window).height() * 0.7);
            _this.$el.css({
                top: parent.position().top + parent.height(),
                left: parent.position().left
            });
            return this.$el;
        }
    });

    return Component.extend({
        name: 'TopPanel',
        elementSelector: '[data-component="top-panel"]',

        load: function () {
            var _this = this;
            _this.$el.hide();

            this._layout.on('moduleWomiLoaded', function(){
                if(_.filter(womi.objects, function(o){ return o.roles.context; }).length > 0){
                    _this.$el.show();
                }else{
                    _this.$el.hide();
                }
            });

            this.elements = [
                {name: 'Wideo', validClass: 'video-container'},
                {name: 'Zdjecia', validClass: 'image-container'},
                {name: 'Załączniki', validClass: 'attachment-container'},
                {name: 'Obiekty', validClass: 'interactive-object-container'}
            ];
            this.slides = [];
            this._generateMenu();

            this.$('.top-panel-activator').click(function () {
                _this.$('.top-panel-body').slideToggle(200);
                _.each(_this.slides, function (slide) {
                    slide.hide();
                });
                return false;
            });
            //TODO: REMOVE IF DONE
            //this.$('.top-panel-body').append('<span style="color: red">FUNKCJONALNOŚĆ TESTOWA</span>');
        },

        _generateMenu: function () {
            var _this = this;
            var ul = this.$el.find('ul');
            _.each(this.elements, function (el) {
                var span = $('<a>', {text: el.name, href:''});
                var li = $('<li>');
                li.append(span);
                var sld = new PanelSlide({ element: el });
                _this.slides.push(sld);
                li.append(sld.$el);
                span.click(function () {
                    _.each(_this.slides, function (slide) {
                        if (slide != sld) {
                            slide.hide();
                        }
                    });
                    sld.render().slideToggle();

                    return false;
                });
                ul.append(li);
            });
        }
    });
});