define(['jquery', 'declare', 'xml_parser/XMLParser', 'text!./schema/epcollxml.json'], function ($, declare, XMLParser, epcollxml) {

    return declare(XMLParser, {

        instance: {
            schema: epcollxml,

            _parseAttrs: function (moduleObject, child, pos, node) {
                var hasAttr = false;
                if (typeof child.attrs != 'undefined') {
                    _.each(child.attrs, function (attr) {
                        hasAttr = true;
                        moduleObject[child.tag][pos][attr] = node.attributes.getNamedItem(attr) != null ? node.attributes.getNamedItem(attr).value : null;
                    });
                }
                return hasAttr;
            },

            _getVal: function (el, tag) {

                if (el.childNodes.length > 0) {
                    if (tag == "signature") {
                        var signature;
                        if(navigator.userAgent.match(/Trident/)) {
                            signature = new XMLSerializer().serializeToString(el);
                            signature = signature.replace(new RegExp('xmlns:cn=\"http:\/\/cnx.rice.edu\/cnxml\"', "g"), "");
                            signature = signature.replace(new RegExp('<ep:signature xmlns:ep=\"http:\/\/epodreczniki.pl\/\">', "g"), "");
                            signature = signature.replace(new RegExp('</ep:signature>', "g"), "");
                        } else {
                            signature = el.innerHTML.replace(/ xmlns:cn=\"http:\/\/cnx.rice.edu\/cnxml\"/g, "");
                        }
                        return signature;
                    } else {
                        return el.childNodes[0].nodeValue;
                    }
                } else {
                    return el.textContent;
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
                    moduleObject[child.tag][i] = { value: this._getVal(el[i], fullTag), _order: order };//textContent };
                    var hasAttr = this._parseAttrs(moduleObject, child, i, el[i]);
                    if (typeof child.children != 'undefined') {
                        this._parseChildren(moduleObject[child.tag][i], child, el[i]);
                    } else if (!hasAttr) {
                        moduleObject[child.tag][i] = this._getVal(el[i], fullTag);//.childNodes[0].nodeValue; //el.textContent;
                    }
                }
            }


        },
        _schemaErrorHandler: function(err) {
        }
    });

});