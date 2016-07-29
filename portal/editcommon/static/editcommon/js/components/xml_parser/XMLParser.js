define(['jquery', 'declare', 'underscore'], function ($, declare, _) {
    function getVal(el) {
        if (el.childNodes.length > 0) {
            return el.childNodes[0].nodeValue;
        } else {
            return el.textContent;
        }
    }

    return declare({
        instance: {
            schema: null,

            constructor: function (options) {
                options = options || {};
                this._super(arguments);
                if (this.schema == null) {
                    throw 'XMLParser needs to be superclassed for setting schema';
                }
            },

            parseXML: function (xmlText) {
                var loadedXML = this._loadXML(xmlText);
                return this._createModuleObject(loadedXML);
            },

            _newSchemaObject: function () {
                return JSON.parse(this.schema);
            },

            schemaObject: function (path) {
                var keys = path.split('.');
                var schema = this._newSchemaObject();

                function findElement(root, key) {
                    var found = null;
                    _.each(root, function (elem) {
                        if (elem['tag'] == key) {
                            found = elem;
                        }
                    });
                    return found;
                }

                var found = schema.root;

                _.each(keys, function (key) {
                    if (_.isNaN(parseInt(key))) {
                        found = findElement(found.children, key);
                    }
                });

                return found;
            },

            _loadXML: function (xmlText) {
                if (window.DOMParser) {
                    var parser = new DOMParser();
                    return parser.parseFromString(xmlText, "text/xml");
                }
                else // Internet Explorer
                {
                    var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlText);
                    return xmlDoc;
                }
            },

            _createModuleObject: function (xml) {
                var schema = this._newSchemaObject();

                var moduleObject = {};
                try {
                    this._parseChildren(moduleObject, schema.root, xml);
                } catch (err) {
                	this._schemaErrorHandler(err);
                    console.error(err);
                }
                return moduleObject;
            },

            _schemaErrorHandler: function(err){
                alert("Plik niezgodny ze schematem. Proszę wczytać inny.");
            },

            _parseChildren: function (moduleObject, schemaNode, node) {
                var _this = this;
                _.each(schemaNode.children, function (child) {
                    switch (_this._elemType(child)) {
                        case 'object':
                            _this._parseObject(moduleObject, child, node);
                            break;
                        case 'comment':
                            _this._parseComment(moduleObject, child, node);
                            break;
                    }
                });
                
            },
            _parseComment: function(moduleObject, child, node){
                _.each(node.childNodes, function(childNode){
                     if(childNode == '[object Comment]'){
                         moduleObject[child.tag] = moduleObject[child.tag] || [];
                         moduleObject[child.tag].push(childNode.nodeValue);
                     }
                });
            },

            _tagGen: function (element) {
                return element.tag;//element.namespace != '' ? element.namespace + ':' + element.tag : element.tag;
            },

            _namespaceGen: function (element) {
            	return element.namespace;
            },

            _orderElements: function(node) {
                var el = node.firstChild;
                if(!el){
                    return
                }
                var idx = 0;
                while (el) {
//                    el.dataset && (el.dataset['order'] = idx++);
                    el.order = idx++;

                    el = el.nextSibling;
                }
            },

            _parseObject: function (moduleObject, child, node) {
                var fullTag = this._tagGen(child);
                var fullNamespace = this._namespaceGen(child);
                
                var el = [];
                var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
				if (isFirefox) {
					
					if (fullNamespace != undefined && fullNamespace != '' && fullNamespace != null) {
						el = node.getElementsByTagName(fullNamespace + ":" + fullTag);
					}
					else {
						el = node.getElementsByTagName(fullTag);
					}
				}
				else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
                    if (!document.all) {
                        // IE 11+
                        el = node.getElementsByTagName(fullNamespace + ":" + fullTag);
                    } else {
                        el = node.getElementsByTagName(fullTag);
                    }
				} else {
                    el = node.getElementsByTagName(fullTag);
                }
                this._orderElements(node);
                for (var i = 0; i < el.length; i++) {
                	if (el[i].parentNode != node) {
                        continue;
                    }
                    var order = null;
//                    if(el[i].dataset && el[i].dataset['order']){
//                        order = el[i].dataset['order'];
//                    }
                    if(el[i].order){
                        order = el[i].order;
                    }
                    moduleObject[child.tag] = moduleObject[child.tag] || [];
                    moduleObject[child.tag][i] = { value: getVal(el[i]), _order: order };//textContent };
                    var hasAttr = this._parseAttrs(moduleObject, child, i, el[i]);
                    if (typeof child.children != 'undefined') {
                        this._parseChildren(moduleObject[child.tag][i], child, el[i]);
                    } else if (!hasAttr) {
                        moduleObject[child.tag][i] = getVal(el[i]);//.childNodes[0].nodeValue; //el.textContent;
                    }
                }
            },

            _parseAttrs: function (moduleObject, child, pos, node) {
                var hasAttr = false;
                if (typeof child.attrs != 'undefined') {
                    _.each(child.attrs, function (attr) {
                        hasAttr = true;
                        moduleObject[child.tag][pos][attr] = node.attributes.getNamedItem(attr) != null ? node.attributes.getNamedItem(attr).value : "";
                    });
                }
                return hasAttr;
            },

            _parseList: function (moduleObject, child, node) {
                var _this = this;
                var fullTag = this._tagGen(child);
                var related = child.related;
                var els = node.getElementsByTagName(fullTag)[0].getElementsByTagName(this._tagGen(related));
                moduleObject[child.tag] = [];
                _.each(els, function (el) {
                    var o = {value: getVal(el)};//.childNodes[0].nodeValue }; //textContent };
                    var x = moduleObject[child.tag].push(o);
                    //o[related.tag] = {};
                    var r = $.extend(true, {}, related);
                    r.tag = x - 1;
                    var hasAttr = _this._parseAttrs(moduleObject[child.tag], r, el);

                    if (typeof related.children != 'undefined') {
                        _this._parseChildren(moduleObject[child.tag][x - 1], related, el);
                    } else if (!hasAttr) {
                        moduleObject[child.tag][x - 1] = getVal(el);//.childNodes[0].nodeValue;//el.textContent;
                    }
                });
                _this._parseAttrs(moduleObject, child, node.getElementsByTagName(fullTag)[0]);

            },

            _elemType: function (elem) {
                if (typeof elem.type != "undefined") {
                    return elem.type;
                }
                return 'object';
            }
        }
    });
});
