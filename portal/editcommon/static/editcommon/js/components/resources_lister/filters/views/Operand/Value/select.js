define([
    'jquery',
    'underscore',
    'backbone',
    './Value',
    'operandScheme',
    '../../../helpers/names',
    '../../../helpers/domTools'
], function(
    $,
    _,
    backbone,
    ValueView,
    oScheme,
    names,
    domTools
) {

    return ValueView.extend({

        postInitialize: function(params) {
            var scheme = oScheme.types[this.operand.get('field')];
            var list = scheme.values.reduce(function(res, obj) {
                res.push({ name: names.getValueName(obj), value: obj });
                return res;
            }, []);
            var element = domTools.renderSelect(list);
            this.$value = element.addClass('model-value');
        }
    
    });

});
