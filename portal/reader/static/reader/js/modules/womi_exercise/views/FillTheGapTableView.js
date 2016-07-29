define(['./FillTheGap', 'text!../templates/table_field.html'], function(FillTheGapView, body_template) {

    return FillTheGapView.extend({

        tagName: 'table',

        templateBody: _.template(body_template)

    });

});
