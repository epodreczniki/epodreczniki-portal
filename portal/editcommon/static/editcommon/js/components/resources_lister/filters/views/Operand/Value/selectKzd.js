define([
    'jquery',
    './select',
    'operandScheme',
    '../../../helpers/names',
    '../../../helpers/domTools'
], function(
    $,
    Select,
    oScheme,
    names,
    domTools
) {

    return Select.extend({

        postInitialize: function(params) {
            var scheme = oScheme.types[this.operand.get('field')];
            var list = scheme.values.reduce(function(res, obj) {
                //console.log(obj);
                res.push({ name: obj.label, value: obj.value });
                return res;
            }, []);
            var element = domTools.renderSelect(list);
            this.$value = element.addClass('model-value');
        }
    
    });

});
