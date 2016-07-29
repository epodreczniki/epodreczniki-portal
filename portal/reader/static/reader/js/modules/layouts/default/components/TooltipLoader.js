define([
    'jquery',
    'backbone',
    '../../Component',
    'modules/core/WomiManager'
], function ($, Backbone, Component, WomiManager) {

    return Component.extend({
        name: 'TooltipLoader',

        tooltipWidth: '40%',

        beforeCloseTooltip: function(tooltipPlace, tooltipHelper) {
//          tooltipPlace.after(toolTipStageClone);
            //console.log("beforeCloseTooltip",tooltipPlace, tooltipHelper);
            if (tooltipHelper.isVisible) {
                tooltipPlace.after(tooltipHelper);
            }
            tooltipPlace.remove();
            // If hide() then it doesn't disapear in in ex. Słowniczek
//          toolTipStage.hide();
        },

        postInitialize: function (options) {
            this.listenTo(this._layout, 'moduleLoaded', _.bind(this.processTooltips, this, undefined));
            this.listenTo(this._layout, 'openAlttextTooltip', this.openTooltip);
        },

        openTooltip: function(target, id) {
            var _this = this;

            var tooltipPlace = $('<div>');
            var toolTipStage = target.find(id);
            // tooltips content can be visible (in eg. 'słowniczek') or invisible
            // visibility has to return to the state before the tooltip was loaded, so let's save it
            // taking into consideration the tooltip defined on other pagines is always invisible, when we check it
            var toolTipContentVisible = toolTipStage.is(':visible');
            if (!toolTipContentVisible && toolTipStage.parents('.pagination-page-blurred').length) {
                toolTipContentVisible = true;
            }
            //var interactive = (toolTipStage.find('.audio-container').length > 0) ||(toolTipStage.find('.movie-container').length > 0) || (toolTipStage.find('.gallery-container').length > 0);
            //console.log("tooltip with audio, movie or gallery? ", interactive);
            var tooltipHelper;
            //if(interactive){
            toolTipStage.after(tooltipPlace);
            toolTipStage.css('max-height', $(window).height() * 0.7);
            tooltipHelper = toolTipStage;
            tooltipHelper.isVisible = toolTipContentVisible;
            //}else{
            //    var toolTipStageClone = toolTipStage.clone(true, true).prop({ id: id+"_clone" });
            //    toolTipStageClone.after(tooltipPlace);
            //    toolTipStageClone.css('max-height', $(window).height() * 0.7);
            //    tooltipHelper = toolTipStageClone;
            //}

            $.fancybox.open({
//                            content: toolTipStageClone,
                content: tooltipHelper,
                wrapCSS: 'fancybox-modal reader-content',
                width: _this.tooltipWidth,
                height: 'auto',
                closeClick: false,
                autoSize: false,
                autoCenter: false,
                afterShow: function () {
//                                _this.processTooltips(div);
                    //$('div.fancybox-overlay').addClass('fullscreen-background');
                    $('div.fancybox-skin').css('background', 'white');
                    //$('a.fancybox-close').hide();
//                                toolTipStageClone.find(".fullscreen-image").hide();
                    tooltipHelper.find(".fullscreen-image").hide();
                    // next two lines to set min width of the tooltip
                    $('div.fancybox-wrap').css('min-width', '340px');
                    $('div.fancybox-inner').css('min-width', '280px');
//                                toolTipStageClone.find('a').click(function(){
//                                    $.fancybox.close();
//                                });
                    tooltipHelper.find('.go-to-glossary a').off('click').on('click',(function(){
                        $.fancybox.close();
                    }));
                    $('.fancybox-wrap').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 200);
                },
                afterLoad: function(){
                    $('.fancybox-wrap').css('visibility', 'hidden');
                    setTimeout(function() {
//                                    _this.trigger('refreshContent', toolTipStageClone);
                        _this.trigger('refreshContent', tooltipHelper);
//                                    var ws = toolTipStageClone.find('.womi-container').toArray();
                        var ws = tooltipHelper.find('.womi-container').toArray();
                        WomiManager.resizeSelected(_.map(ws, function (w) {
                            return $(w).data('womiObject')
                        }));

                        tooltipHelper.find('.gallery-container').resize();

                        if(tooltipHelper.find('iframe').length) {
                            try {
                                tooltipHelper.find('iframe')[0].contentWindow.postMessage({
                                    msg: 'svgIframeSize',
                                    width: $(tooltipHelper.find('iframe')[0]).css('width'),
                                    height: $(tooltipHelper.find('iframe')[0]).css('height'),
                                    haveSize: true, alt: 'ALT'}, '*')
                            } catch(err) {}
                        }

                    }, 100);


                },
                onUpdate: function (){
                    $('.fancybox-inner').height("auto");
                },
                afterClose: function () {
                    $('div.tooltipsy').remove();
                },
                beforeClose: function() {
                    _this.beforeCloseTooltip(tooltipPlace, tooltipHelper);
                },
                helpers: {
                    overlay: {
                        closeClick: true,
                        locked: false,
                        css: {
                            'background': 'rgba(255, 255, 255, 0.3)'

                        }
                    }
                }
            });
        },

        processTooltips: function (fancyboxTarget) {

            var _this = this;
            this.listenToOnce(this._layout, 'moduleContentTarget', function (obj) {
                var target = obj.target;
                $(fancyboxTarget || obj.target).find('a[data-link-type="tooltip"]').each(function () {
                    var a = $(this);

                    var id = a.data('tooltip-id');
                    a.attr('href', '#');

                    a.click(function (ev) {
                        ev.preventDefault();
                        _this.openTooltip(target, id);
                        return false;
                    });

                });
            });
            this.trigger('getModuleContent');

            if ($(location.hash).hasClass('tooltip')) {
                $('a[data-tooltip-id="' + location.hash + '"]').click();
            }
        }
    });
});