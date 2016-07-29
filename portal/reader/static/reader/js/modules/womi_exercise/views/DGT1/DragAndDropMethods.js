define(['jquery'], function($) {

    var singleAnswer = function(element) {

        var _this = this;

        this.$('.droppable-element').droppable({
            drop: function( event, ui ) {
                $(ui.draggable).appendTo(this).removeClass('correct wrong');
                ui.helper.remove();
                _this.eventBus.trigger('cleanupFeedback');
            }
        });

        this.$('.draggable-collection').droppable({
            drop: function( event, ui ) {
                // To avoid changing order of elements when there are dropped FROM default TO default container.
                if (!$(ui.draggable).parent().is(this)) {
                    $(ui.draggable).appendTo(this);
                    ui.helper.remove();
                }
            }
        });

    };

    var multipleAnswer = function() {

        var _this = this;

        this.$('.droppable-element').droppable({
            drop: function( event, ui ) {
                if (!$(ui.draggable).parent().is('.droppable-element')) {
                    var isExist = $(this).find($("[data-id='" + $(ui.draggable).data('id') + "']"));
                    if (isExist.length > 0) return;

                    var elem = $(ui.draggable).clone();
                    elem.appendTo(this).removeClass('correct wrong');
                    elem.draggable(_this.drgProps);
                    ui.helper.remove();
                    _this.eventBus.trigger('cleanupFeedback');
                }
            }
        });

        this.$('.draggable-collection').droppable({
            drop: function( event, ui ) {
                // To avoid changing order of elements when there are dropped FROM default TO default container.
                if (!$(ui.draggable).parent().is(this)) {
                    $(ui.draggable).remove();
                    ui.helper.remove();
                    _this.eventBus.trigger('cleanupFeedback');
                }
                $(this).removeClass('before-delete');
            },
            over: function(event, ui) {
                if (!$(ui.draggable).parent().is(this)) {
                    $(ui.helper).css('opacity', '0.5');
                    $(ui.helper).addClass('before-delete');
                }
            }
        });

    };

    return {
        
        singleAnswer: singleAnswer,
        multipleAnswer: multipleAnswer

    }

});
