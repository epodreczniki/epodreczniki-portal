define([
    'declare',
    'underscore'], function (declare, _) {
    return declare({
        'static': {
            prettify: function (attrName, model) {
                var label = this.getDescriptionAttr('label', attrName, model);
                if (label != null) {
                    return label;
                }
                return _.reduce(attrName.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1), function (memo, str) {
                    return memo + ' ' + str;
                });
            },

            getDescriptionAttr: function (descAttr, attrName, model) {
                if (model.getDescription) {
                    var descr = model.getDescription();
                    var attr;
                    if (attr = descr[attrName]) {
                        return attr[descAttr];
                    }
                }
                return null;
            },

            getType: function (attrName, model) {
                var type = this.getDescriptionAttr('type', attrName, model);
                if (type != null) {
                    return type;
                }
                return 'text';
            },

            use: function (attrName, model) {
                var use = this.getDescriptionAttr('use', attrName, model);
                if (use == null) {
                    return true;
                }
                return use;
            },

            getPattern: function (attrName, model) {
                var pattern = this.getDescriptionAttr('pattern', attrName, model);
                if (pattern != null) {
                    return pattern;
                }
                return null;
            },

            getMax: function (attrName, model) {
                var max = this.getDescriptionAttr('max', attrName, model);
                if (max != null) {
                    return max;
                }
                return null;
            },

            getMin: function (attrName, model) {
                var min = this.getDescriptionAttr('min', attrName, model);
                if (min != null) {
                    return min;
                }
                return null;
            },

            getAttrs: function (model, prefixOrAttrs) {
                var _this = this;
                var attrs = _.filter(_.keys(model.attributes), function (attr) {
                    if (typeof prefixOrAttrs == 'string') {
                        return attr.indexOf(prefixOrAttrs) == 0;
                    } else {
                        return _.contains(prefixOrAttrs, attr);
                    }
                });
                var editableAttributes = [];
                _.each(attrs, function (attr) {
                    if (!_this.use(attr, model)) {
                        return;
                    }
                    var label = _this.prettify(attr, model);
                    if (model.get(attr) != null) {
                        editableAttributes.push({
                            value: model.get(attr),
                            name: attr,
                            prettyName: label,
                            label: label,
                            id: model.id + '_' + model.get(attr),
                            type: _this.getType(attr, model),
                            pattern: _this.getPattern(attr, model),
                            max: _this.getMax(attr, model),
                            min: _this.getMin(attr, model)
                        });
                    }
                });
                return editableAttributes;
            }
        }
    })
});
