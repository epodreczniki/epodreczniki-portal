define(['jquery',
        'underscore',
        'backbone',
        'text!../content_engines/templates/difficultyLevels.html',
        './ContentEngineInterface'],
    function ($, _, backbone, difficulty_levels_template, ContentEngineInterface) {

    return ContentEngineInterface.extend({

        reload: function (placeholder, options) {
            $(placeholder).find('.effect-of-education').append(_.template(difficulty_levels_template));
            _.each($(placeholder).find('.effect-of-education-info').children(), function(difficultLevelElement){
                if ($(difficultLevelElement).html().toLowerCase() == $(difficultLevelElement).parent().prev().html().toLowerCase()) {
                    $(difficultLevelElement).addClass('selected');
                }
            });
        }
    });



});