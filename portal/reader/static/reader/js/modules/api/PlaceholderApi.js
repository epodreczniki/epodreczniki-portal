/**
 * Module returning a class to create and handle DOM elements and 3rd party JavaScript code.
 * @author Jakub Aftowicz
 * @version 1.1.1
 * @module EPO/api/PlaceholderApi
 * @see EPO.api.PlaceholderApi
 */
define('placeholder.api', ['declare', 'jquery', 'modules/core/WomiManager', 'require', 'reader.api', "underscore"], function (declare, $, womi, require, api, _) {
    var ENGINES = {
        processingjs_animation: true,
        edge_animation: true,
        createjs_animation: true,
        ge_animation: true,
        custom_womi: true,
        custom_logic_exercise_womi: true,
        ace_editor: true,
        svg_editor: true,
        womi_exercise_engine: true,
        raphael_womi: true,
        framed_html: true,
        pano2vr_engine: true,
        autonomic_womi: true,
        womi_aggregate: true,
        cp_engine: true
    };

    var errors = {
        UNKNOWN: -1,
        REQ_UNDEF: 0,
        NOT_DECLARED: 1,
        NO_MANIFEST: 2,
        NO_WOMI_IDS: 3,
        EMPTY_WOMI_IDS: 4,
        NO_WOMI_TYPE: 5,
        WRONG_METADATA: 6,
        WRONG_MANIFEST: 7,
        NO_MANIFEST_OR_METADATA: 8

    };

    /**
     * Class to create and handle DOM elements and 3rd party JavaScript code.
     * @class EPO.api.PlaceholderApi
     * @param {!JQuery} placeholder Handler to outer HTML element in DOM structure, it should be provided in WOMI constructor
     * @param {!Require.JS} require Adds require.js context of WOMI for further usage.
     * @property {Boolean} isDescription If user defines at least one description element, description section will be inserted. FALSE by default. Use one of following methods to insert Description element {@link EPO.api.PlaceholderApi#setExerciseTitle}, {@link EPO.api.PlaceholderApi#setExerciseAuthor}, {@link EPO.api.PlaceholderApi#setExerciseDescription}.
     * @property {Boolean} isContent If user defines whole content of the exercise or adds answers, content section will be inserted. FALSE by default. Use one of following methods to insert Content element {@link EPO.api.PlaceholderApi#setExerciseContent}, {@link EPO.api.PlaceholderApi#setAnswerList}, {@link EPO.api.PlaceholderApi#addAnswer}, {@link EPO.api.PlaceholderApi#setFeedback}, {@link EPO.api.PlaceholderApi#setHint}, {@link EPO.api.PlaceholderApi#setRecreateButtonLogic}, {@link EPO.api.PlaceholderApi#setDefaultsButtonLogic}, {@link EPO.api.PlaceholderApi#setHintButtonLogic}, {@link EPO.api.PlaceholderApi#setCheckButtonLogic}.
     * @property {Boolean} isButtons If user defines logic for one of the buttons, the buttons section will be inserted. FALSE by default. Use one of following methods to insert Content element {@link EPO.api.PlaceholderApi#setRecreateButtonLogic}, {@link EPO.api.PlaceholderApi#setDefaultsButtonLogic}, {@link EPO.api.PlaceholderApi#setHintButtonLogic}, {@link EPO.api.PlaceholderApi#setCheckButtonLogic}.
     * @property {JQuery} placeholder Handler to outer HTML element, it will be used during call of {@link EPO.api.PlaceholderApi#appendToPlaceholder} method.
     * @example
     * define(['require', 'jquery', 'declare', 'placeholder.api'], function (require, $, declare, placeholderApi) {
     *    return declare({
     *        instance: {
     *            start: function (placeholder) {
     *                var pa = new placeholderApi($(placeholder));
     *                ...
     *                ...
     *            }
     *        }
     *    });
     * });
     *
     */
    return declare({

        'instance': {

            constructor: function (placeholder, req) {
                this.isDescription = false;
                this.isContent = false;
                this.isButtons = false;

                if (req == undefined) {
                    console.warn("deprecated: PlaceholderApi can't be instantiated without providing require context in constructor," +
                        " it will cause problems during call of getWomiContainer method")
                } else if (req === false) {
                    this.require = false;
                } else {
                    this.require = req;
                }
                this.placeholder = placeholder;
            },

            /**
             * Adds exercise title.
             * @function EPO.api.PlaceholderApi#setExerciseTitle
             * @param {!String} title Exercise title.
             */
            setExerciseTitle: function (title) {
                this.title = $('<h3 />', {'class': 'exercise-title', 'html': title});
                this.isDescription = true;
            },

            /**
             * Adds information about exercise author.
             * @function EPO.api.PlaceholderApi#setExerciseAuthor
             * @param {!String} author Name of the author.
             */
            setExerciseAuthor: function (author) {
                this.author = $('<div />', {'class': 'exercise-author', 'html': author});
                this.isDescription = true;
            },

            /**
             * Sets entire description element.
             * Can't be used together with {@link EPO.api.PlaceholderApi#addDescriptionElement}
             * @function EPO.api.PlaceholderApi#setExerciseDescription
             * @param {!(String|HTML|JQuery)} description Element with complete exercise description.
             */
            setExerciseDescription: function (description) {
                this.description = description;
                this.isDescription = true;
            },

            /**
             * Initializes description element and adds paragraphs with text from attribute.
             * Can be called many times.
             * Can't be used together with {@link EPO.api.PlaceholderApi#setExerciseDescription}
             * @function EPO.api.PlaceholderApi#addDescriptionElement
             * @param {!(String[]|HTML[]|JQuery[])} elem List of elements which will be inserted as siblings in description.
             */
            addDescriptionElement: function (elem) {
                if (this.description == undefined) {
                    this.description = [];
                }

                this.isDescription = true;

                this.description.push(elem);
            },

            /**
             * This method is used to generate out of box schema for exercise content or when content is being generated by outer function.
             * It can be used together with {@link EPO.api.PlaceholderApi#setAnswerList} or {@link EPO.api.PlaceholderApi#addAnswer}
             * @function EPO.api.PlaceholderApi#setExerciseContent
             * @param {!(String|HTML)} content Exercise content to be inserted.
             */
            setExerciseContent: function (content) {
                this.content = $('<div />', {'class': 'exercise-content', 'html': content});
                this.isContent = true;
            },

            /**
             * Sets entire list of answers.
             * @function EPO.api.PlaceholderApi#setAnswerList
             * @param {!JQuery} answers jQuery object of type &lt;ul&gt; with &lt;li&gt; inside
             * @example
             * var tmpDiv = pa.createElement('div',{});
             *
             * tmpDiv.append("A = (");
             * tmpDiv.append(pa.createElement('input',{class:'', type:'text', size:'3', id:'x0'}))
             * tmpDiv.append(",");
             * tmpDiv.append(pa.createElement('input',{class:'', type:'text', size:'3', id:'y0'}))
             * tmpDiv.append("}");
             *
             * pa.setAnswerList(tmpDiv);
             */
            setAnswerList: function (answers) {

                this.answerList = answers;
                this.answerList['class'] = 'answer-list';
                this.isContent = true;
            },

            /**
             * Initializes list of answers and adds provided text or code in &lt;li&gt; element.
             * @function EPO.api.PlaceholderApi#addAnswer
             * @param {!(String|HTML)} answer Element containing single answer.
             * @example
             * placeholderApi.addAnswer([pa.createElement('input',{type: 'radio', name : 'answer', id:'r1'}), pa.createElement('span', {id: 'c1'}, -7)]);
             * placeholderApi.addAnswer([pa.createElement('input',{type: 'radio', name : 'answer', id:'r2'}), pa.createElement('span', {id: 'c2'}, 12)]);
             * placeholderApi.addAnswer([pa.createElement('input',{type: 'radio', name : 'answer', id:'r3'}), pa.createElement('span', {id: 'c3'}, 49)]);
             * placeholderApi.addAnswer([pa.createElement('input',{type: 'radio', name : 'answer', id:'r4'}), pa.createElement('span', {id: 'c4'}, 25)]);
             */
            addAnswer: function (answer) {

                if (this.answerList == undefined)
                    this.answerList = $('<ul />', {'class': 'answer-list'});


                var tempAnswer = $('<li />');
                for (var i = 0; i < answer.length; i++) {
                    tempAnswer.append(answer[i]);
                }

                this.answerList.append(tempAnswer);
                this.isContent = true;

            },

            /**
             * Adds feedback element to DOM structure.
             * @function EPO.api.PlaceholderApi#setFeedback
             * @param {String} [feedback] if not specified empty exercise-feedback element will be added and content of feedback can be later controled by {@link EPO.api.PlaceholderApi#showCorrectFeedback} etc.
             */
            setFeedback: function (feedback) {
                if (feedback == undefined)
                    this.feedback = $('<div />', {'class': 'exercise-feedback'});
                else
                    this.feedback = $('<div />', {'class': 'exercise-feedback', 'html': feedback});

                this.isContent = true;
            },

            /**
             * Adds exercise-hint and sets global hint for exercise
             * @function EPO.api.PlaceholderApi#setHint
             * @param {String} [hint] If not specified empty exercise-hint element will be inserted. Hints should be manipulated by user code.
             */
            setHint: function (hint) {

                if (hint != undefined)
                    this.hintMessage = hint;

                this.hint = $('<div />', {'class': 'exercise-hint'});
                this.isContent = true;
            },

            /**
             * Attaches user specified logic to Recreate button and creates that button.
             * @function EPO.api.PlaceholderApi#setRecreateButtonLogic
             * @param {Function} logic user defined function
             * @example
             * placeholderApi.setDefaultsButtonLogic(function(){ thirdPartyLib.restoreLogic() });
             */
            setRecreateButtonLogic: function (logic) {
                this.recreateButton = $('<button />', {'class': 'recreate', 'title': 'Nowy przykład', 'html': 'Nowy<span>Nowy</span>', 'click': logic});
                this.isButtons = true;
                this.isContent = true;
            },

            /**
             * Attaches user specified logic to Restore Defaults button and creates that button.
             * @function EPO.api.PlaceholderApi#setDefaultsButtonLogic
             * @param {Function} logic user defined function
             * @example
             * placeholderApi.setDefaultsButtonLogic(function(){ thirdPartyLib.defaultsLogic() });
             */
            setDefaultsButtonLogic: function (logic) {
                this.defaultsButton = $('<button />', {'class': 'defaults', 'title': 'Ustawienia domyślne', 'html': 'Ustawienia domyślne<span>Ust</span>', 'click': logic});
                this.isButtons = true;
                this.isContent = true;
            },

            /**
             * Attaches user specified logic to Check button and creates that button.
             * @function EPO.api.PlaceholderApi#setCheckButtonLogic
             * @param {Function} logic user defined function
             * @example
             * placeholderApi.setDefaultsButtonLogic(function(){ thirdPartyLib.checkLogic() });
             */
            setCheckButtonLogic: function (logic) {
                this.checkButton = $('<button />', {'class': 'check', 'title': 'Sprawdź', 'html': 'Sprawdź<span>Spr</span>', 'click': logic});
                this.isButtons = true;
                this.isContent = true;
            },

            /**
             * Attaches user specified logic to Hint button and creates that button.
             * @function EPO.api.PlaceholderApi#setHintButtonLogic
             * @param {Function} logic user defined function
             * @example
             * placeholderApi.setDefaultsButtonLogic(function(){ thirdPartyLib.hintLogic() });
             */
            setHintButtonLogic: function (logic) {
                this.hintButton = $('<button />', {'class': 'hint', 'html': 'Wsk', 'click': logic});
                this.isButtons = true;
                this.isContent = true;
            },

            /**
             * Creates jQuery Object with requested type and properties.
             * @function EPO.api.PlaceholderApi#createElement
             * @param {String} type i.e. div, body, p, h1
             * @param {json}attributes dictionary of attributes which should be used in html element
             * @param {(String|HTML|JQuery)} content innerHtml of the element
             * @returns {JQuery|HTMLElement}
             * @example
             * placeholderApi.createElement('input',{type: 'checkbox', name : 'answer', id:'cb1'})
             */
            createElement: function (type, attributes, content) {
                if (content != undefined)
                    attributes.html = content;
                return $('<' + type + ' />', attributes);
            },

            getWomiVersionContainer: function(womiId, version, percentWidth, callback){
                this.getWomiContainer(womiId + '/' + version, percentWidth, callback);
            },

            /**
             * Asynchronous method which obtains jQuery Object contining requested WOMI, user must provide callback function in which obtained element can be insert to DOM tree by one of methods: {@link addDescriptionElement}, {@link setExerciseDescription}, {@link addAnswer}. etc.
             * This method inserts WOMI of all types, user is not obligated to provide type of WOMI.
             * This method provides vast error handling and informs user about missconfigurations.
             * @function EPO.api.PlaceholderApi#getWomiContainer
             * @param {String} womiId Id of WOMI
             * @param {String} percentWidth Percentage width of WOMI element i.e. "80%".
             * @param {EPO.api.PlaceholderApi~getWomiCallback} callback - The callback that handles processing users code after successful obtaining requested WOMI element
             * @example
             * placeholderApi.getWomiContainer('5877','100%',function(returnedWomi){
             *      placeholderApi.addDescriptionElement(returnedWomi);
             *      ...
             * }
             */
            getWomiContainer: function (womiId, percentWidth, callback) {

                var _this = this;

                if (this.require == undefined) {
                    //console.error("Import WOMI error - PlaceholderApi was instantiated without providing require context in constructor, requested womi can't be served. Fix your PlaceholderApi constructor call and add require context (Check documentation)");
                    //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - Bibloteka została zainicjowana bez podania wymaganego kontekstu dla require.js (Sprawdź dokumentację)"});
                    //callback(errorContainer);
                    _this.showErrorImage(_this, errors.REQ_UNDEF, womiId, function (womiContainer) {
                        callback(womiContainer);
                    });
                }
                else {
                    var skipManifest = this.require == false;

                    if (!skipManifest) {
                        var a = new api(this.require);

                    }

                    var loadF = function (manif) {
                        //in case of correct usage

                        if (manif == undefined && !skipManifest) {
                            //console.error("Import WOMI error - manifest can't be loaded, fix your manifest file");
                            //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - nie można pobrać manifestu"});
                            //callback(errorContainer);
                            _this.showErrorImage(_this, errors.NO_MANIFEST, womiId, function (womiContainer) {
                                callback(womiContainer);
                            });
                        }

                        else if (!skipManifest && manif.womiIds == undefined) {
                            //console.error("Import WOMI error - manifest does not contains womiIds Array, fix your manifest file");
                            //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - manifest nie zawiera elementu womiIds"});
                            //callback(errorContainer);
                            _this.showErrorImage(_this, errors.NO_WOMI_IDS, womiId, function (womiContainer) {
                                callback(womiContainer);
                            });
                        }

                        else if (!skipManifest && manif.womiIds.length == 0) {
                            //console.error("Import WOMI error - manifest contains empty womiIds Array, fix your manifest file");
                            //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - manifest zawiera pustą tablicę womiIds"});
                            //callback(errorContainer);
                            _this.showErrorImage(_this, errors.EMPTY_WOMI_IDS, womiId, function (womiContainer) {
                                callback(womiContainer);
                            });
                        }

                        else {
                            var womiToCheck = womiId;

                            if (typeof womiId === 'number') {
                                womiToCheck = '' + womiId;
                                console.warn("deprecated: PlaceholderApi#getWomiContainer was called with womiId parameter type of Number (Int?), use String instead because it may not be supported in the future")
                            }


                            var warnDisplayed = false;
                            var wids = (manif ? manif.womiIds: []);
                            var found = _.some(wids, function (toFind) {

                                if (typeof toFind === 'number') {
                                    toFind = '' + toFind;

                                    if (warnDisplayed == false) {
                                        console.warn("deprecated: womiIds element in your manifest contains at least one number (Int?), use array of Strings instead because array of numbers may not be supported in the future");
                                        warnDisplayed = true;
                                    }
                                }
                                return (toFind == womiToCheck);

                            });


                            if (!skipManifest && found == false) {
                                //console.error('getWomi error - requested WOMI was not declared in womiIds Array in manifest file, fix your manifest file and declare requested WOMI');
                                //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas importu WOMI - WOMI niezadeklarowane w manifeście"});
                                //callback(errorContainer);
                                _this.showErrorImage(_this, errors.NOT_DECLARED, womiId, function (womiContainer) {
                                    callback(womiContainer);
                                });
                            }

                            else {
                                percentWidth = percentWidth || '100%';


                                require(['text!/content/womi/' + womiId + '/manifest.json', 'text!/content/womi/' + womiId + '/metadata.json'], function (manifest, metadata)
                                    //in case of successful obtaining of manifest and metadata
                                {

                                    try {
                                        manifest = JSON.parse(manifest);

                                        try {
                                            metadata = JSON.parse(metadata);

                                            if (manifest.engine == 'geogebra') {
                                                _this.getGeogebraContainer(_this, womiId, manifest, metadata, percentWidth, function (womiContainer) {
                                                    callback(womiContainer, manifest);
                                                });
                                            }

                                            else if (manifest.engine == 'swiffy') {
                                                _this.getSWIFFYContainer(_this, womiId, manifest, metadata, percentWidth, function (womiContainer) {
                                                    callback(womiContainer, manifest);
                                                });
                                            }
                                            else if (ENGINES[manifest.engine]) {
                                                _this.getInteractiveContainer(_this, womiId, manifest, metadata, percentWidth, function (womiContainer) {
                                                    callback(womiContainer, manifest);
                                                });
                                            }
                                            else if (manifest.engine == 'image') {
                                                _this.getImageContainer(_this, womiId, manifest, metadata, percentWidth, function (womiContainer) {
                                                    callback(womiContainer, manifest);
                                                }, 'image');
                                            }
                                            else if (manifest.engine == 'icon') {
                                                _this.getImageContainer(_this, womiId, manifest, metadata, percentWidth, function (womiContainer) {
                                                    callback(womiContainer, manifest);
                                                }, 'icon');
                                            }
                                            else if (manifest.engine == 'audio' || manifest.engine == 'video') {
                                                _this.getAudioVideoContainer(_this, manifest.engine, womiId, manifest, metadata, percentWidth, function (womiContainer) {
                                                    callback(womiContainer, manifest);
                                                });
                                            }
                                            else {
                                                //console.error('getWomi error - requested WOMI manifest contains empty or unknown engine element');
                                                //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - nieznany lub nieokreślony typ żądanego WOMI w manifeście"});
                                                //callback(errorContainer);
                                                _this.showErrorImage(_this, errors.NO_WOMI_TYPE, womiId, function (womiContainer) {
                                                    callback(womiContainer);
                                                });
                                            }

                                        } catch (ErrorMessage) {
                                            //console.error("Import WOMI error - requested WOMI metadata can't be parsed, check metadata file\n" + ErrorMessage);
                                            //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - nie można przetworzyć pliku metadanych żądanego WOMI"});
                                            //callback(errorContainer);
                                            _this.showErrorImage(_this, errors.WRONG_METADATA, womiId, function (womiContainer) {
                                                callback(womiContainer);
                                            });
                                        }

                                    } catch (ErrorMessage) {
                                        //console.error("Import WOMI error - requested WOMI manifest can't be parsed, check manifest file\n" + ErrorMessage);
                                        //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - nie można przetworzyć manifestu żądanego WOMI"});
                                        //callback(errorContainer);
                                        _this.showErrorImage(_this, errors.WRONG_MANIFEST, womiId, function (womiContainer) {
                                            callback(womiContainer);
                                        });
                                    }


                                }, function (err) {
                                    //The errback, error callback
                                    //console.error("Import WOMI error - requested WOMI's manifest or metadata can't be loaded, check if requested womi is correct");
                                    //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - nie można pobrać manifestu lub metadanych żądanego WOMI"});
                                    //callback(errorContainer);
                                    _this.showErrorImage(_this, errors.NO_MANIFEST_OR_METADATA, womiId, function (womiContainer) {
                                        callback(womiContainer);
                                    });
                                });
                            }
                        }

                    };
                    if (!skipManifest) {
                        a.getManifest(loadF, function (ErrorMessage)
                            //Handle error from loading manifest
                        {
                            //console.error("Import WOMI error - manifest can't be loaded, fix your manifest file\n" + ErrorMessage);
                            //var errorContainer = $('<div />', {'class': 'womi-container', 'data-title': "Błąd", 'html': "Błąd podczas wstawiania WOMI - nie można pobrać manifestu"});
                            //callback(errorContainer);
                            _this.showErrorImage(_this, errors.NO_MANIFEST, womiId, function (womiContainer) {
                                callback(womiContainer);
                            });

                        });
                    }else{
                        loadF();
                    }
                }


            },

            /**
             * @function EPO.api.PlaceholderApi#getGeogebraContainer
             * @param _this
             * @param {String} womiId
             * @param {JSON} manifest
             * @param {JSON} metadata
             * @param {String} percentWidth
             * @param {EPO.api.PlaceholderApi~getAuxiliaryWomiCallback} callback
             * @private
             */
            getGeogebraContainer: function (_this, womiId, manifest, metadata, percentWidth, callback) {

                require(['text!/content/womi/' + womiId + '/geogebra.html'], function (geogebraArticle) {

                    var ggbContainer = $('<div />', {'class': 'womi-container', 'data-title': metadata.title});

                    var classic = $('<div />', {'class': 'classic'});
                    var mobile = $('<div />', {'class': 'mobile'});

                    var interactiveContainer = $('<div />', {'class': 'interactive-object-container', 'data-alt': metadata.alternativeText, 'data-width': percentWidth});
                    var resourceContainer = $('<div />', {'class': 'resource-included-interactive-object', 'data-object-engine': 'geogebra', 'data-object-engine-version': manifest.version});

                    resourceContainer.append(geogebraArticle);
                    interactiveContainer.append(resourceContainer);
                    interactiveContainer.append(_this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, true));

                    classic.append(interactiveContainer);
                    ggbContainer.append(classic);

                    mobile.append(_this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, false));
                    ggbContainer.append(mobile);

                    callback(ggbContainer);
                });

            },

            /**
             * @function EPO.api.PlaceholderApi#getSWIFYContainer
             * @param _this
             * @param {String} womiId
             * @param {JSON} manifest
             * @param {JSON} metadata
             * @param {String} percentWidth
             * @param {EPO.api.PlaceholderApi~getAuxiliaryWomiCallback} callback
             * @private
             */
            getSWIFFYContainer: function (_this, womiId, manifest, metadata, percentWidth, callback) {
                var swiffyContainer = $('<div />', {'class': 'womi-container', 'data-title': metadata.title});

                var classic = $('<div />', {'class': 'classic'});
                var mobile = $('<div />', {'class': 'mobile'});

                var hr = 1;
                try{
                    hr = manifest.parameters.object.heightRatio;
                }catch(err){

                }
                var interactiveContainer = $('<div />', {'class': 'interactive-object-container', 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-height-ratio': hr});
                var resourceContainer = $('<div />', {'class': 'standard-interactive-object', 'data-object-src': '/content/womi/' + womiId + '/swiffy.html', 'data-object-engine': 'swiffy', 'data-object-engine-version': manifest.version });

                interactiveContainer.append(resourceContainer);
                interactiveContainer.append(_this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, true));

                classic.append(interactiveContainer);
                swiffyContainer.append(classic);

                mobile.append(_this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, false));
                swiffyContainer.append(mobile);

                callback(swiffyContainer);
            },

            /**
             * @function EPO.api.PlaceholderApi#getInteractiveContainer
             * @param _this
             * @param {String} womiId
             * @param {JSON} manifest
             * @param {JSON} metadata
             * @param {String} percentWidth
             * @param {EPO.api.PlaceholderApi~getAuxiliaryWomiCallback} callback
             * @private
             */
            getInteractiveContainer: function (_this, womiId, manifest, metadata, percentWidth, callback) {
                var swiffyContainer = $('<div />', {'class': 'womi-container', 'data-title': metadata.title});

                var classic = $('<div />', {'class': 'classic'});
                var mobile = $('<div />', {'class': 'mobile'});
                var hr = 1;
                try{
                    hr = manifest.parameters.object.heightRatio;
                }catch(err){

                }

                var interactiveContainer = $('<div />', {'class': 'interactive-object-container', 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-height-ratio': hr});
                var resourceContainer = $('<div />', {'class': 'standard-interactive-object', 'data-object-src': '/content/womi/' + womiId + '/' + manifest.mainFile, 'data-object-engine': manifest.engine, 'data-object-engine-version': manifest.version });

                interactiveContainer.append(resourceContainer);
                interactiveContainer.append(_this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, true));

                classic.append(interactiveContainer);
                swiffyContainer.append(classic);

                mobile.append(_this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, false));
                swiffyContainer.append(mobile);

                callback(swiffyContainer);
            },

            /**
             * @function EPO.api.PlaceholderApi#getImageContainer
             * @param _this
             * @param {String} womiId
             * @param {JSON} manifest
             * @param {JSON} metadata
             * @param {String} percentWidth
             * @param {EPO.api.PlaceholderApi~getAuxiliaryWomiCallback} callback
             * @private
             */
            getImageContainer: function (_this, womiId, manifest, metadata, percentWidth, callback, clazz) {

                var womiContainer = $('<div />', {'class': 'womi-container', 'data-title': metadata.title});

                var classic = $('<div />', {'class': 'classic'});
                var mobile = $('<div />', {'class': 'mobile'});

                var method = 'getPrimitiveImageContainer';
                if(clazz == 'icon'){
                    method = 'getPrimitiveIconContainer';
                }

                classic.append(_this[method](womiId, manifest, metadata, percentWidth, true));
                womiContainer.append(classic);

                mobile.append(_this[method](womiId, manifest, metadata, percentWidth, false));
                womiContainer.append(mobile);

                callback(womiContainer);
            },

            getAudioVideoContainer: function (_this, av, womiId, manifest, metadata, percentWidth, callback) {

                av = {'audio': 'audio', 'video': 'movie'}[av];
                if(typeof womiId === 'string' && womiId.indexOf('/') > 0){
                    womiId = womiId.substring(0, womiId.indexOf('/'));
                }
                var womiContainer = $('<div />', {'class': 'womi-container', 'data-title': metadata.title});

                var classic = $('<div />', {'class': 'classic'});
                var mobile = $('<div />', {'class': 'mobile'});

                classic.append(_this.getPrimitiveAVContainer(womiId, av, manifest, metadata, percentWidth, true));
                womiContainer.append(classic);

                mobile.append(_this.getPrimitiveAVContainer(womiId, av, manifest, metadata, percentWidth, false));
                womiContainer.append(mobile);

                callback(womiContainer);
            },

            _getExt: function(mime){
                var mimes = {
                    'image/jpeg': 'jpg',
                    'image/pjpeg': 'jpg',
                    'image/png': 'png',
                    'image/svg+xml': 'svg',
                    'image/svg': 'svg',
                    'svg': 'svg'
                };
                return mimes[mime];
            },

            getPrimitiveAVContainer: function (womiId, av, manifest, metadata, percentWidth, isClassic) {

                var avContainer, resArray, resArrayLength = 0;

                if(!manifest.parameters) {
                    return undefined;
                }else if (isClassic && (manifest.parameters.object || av == 'audio')) {

                    var p = {'class': av + '-container','data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-display-mode': '2d'};
                    if(av == 'movie'){
                        p['data-aspect-ratio'] = 1 / manifest.parameters.object.heightRatio;
                    }
                    p['data-' + av + '-id'] = womiId;
                    avContainer = $('<div />', p);
                    if(av == 'movie') {
                        avContainer.append(this.getPrimitiveImageContainer(womiId, manifest, metadata, percentWidth, isClassic, 'keyframe'));
                    }

                }
                else if (manifest.parameters.mobile) {
//                    imageContainer = $('<div />', {'class': av + '-container', 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-src': '/content/womi/' + womiId + '/mobile.' + this._getExt(manifest.parameters.classic.mimeType), 'data-display-mode': '2d'});
//                    resArray = manifest.parameters.mobile.resolution;
//                    resArrayLength = resArray.length;
                } else {
                    return undefined;
                }


                return avContainer;
            },

            /**
             * @function EPO.api.PlaceholderApi#getPrimitiveImageContainer
             * @param {String} womiId
             * @param {JSON} manifest
             * @param {JSON} metadata
             * @param {String} percentWidth
             * @param {Boolean} isClassic
             * @returns {JQuery}
             * @private
             */
            getPrimitiveImageContainer: function (womiId, manifest, metadata, percentWidth, isClassic, clazz) {

                var imageContainer, resArray, resArrayLength = 0;
                if(!clazz){
                    clazz = 'image-container';
                }

                if(!manifest.parameters) {
                    return undefined;
                }else if (isClassic && manifest.parameters.classic) {
                    imageContainer = $('<div />', {'class': clazz, 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-src': '/content/womi/' + womiId + '/classic.' + this._getExt(manifest.parameters.classic.mimeType), 'data-display-mode': '2d'});
                    resArray = manifest.parameters.classic.resolution;
                    resArrayLength = resArray.length;
                }
                else if (manifest.parameters.mobile) {
                    imageContainer = $('<div />', {'class': clazz, 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-src': '/content/womi/' + womiId + '/mobile.' + this._getExt(manifest.parameters.classic.mimeType), 'data-display-mode': '2d'});
                    resArray = manifest.parameters.mobile.resolution;
                    resArrayLength = resArray.length;
                } else {
                    return undefined;
                }

                var resDivs = [];

                for (var i = 0; i < resArrayLength; i++) {
                    resDivs[i] = $('<div />', {'data-resolution': resArray[i]});
                    imageContainer.append(resDivs[i]);
                }

                return imageContainer;
            },

            getPrimitiveIconContainer: function (womiId, manifest, metadata, percentWidth, isClassic, clazz) {

                var imageContainer, resArray, resArrayLength = 0;
                if(!clazz){
                    clazz = 'icon-container';
                }

                if(!manifest.parameters) {
                    return undefined;
                }else if (isClassic && manifest.parameters.classic) {
                    imageContainer = $('<div />', {'class': clazz, 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-src': '/content/womi/' + womiId + '/icon.' + this._getExt(manifest.parameters.classic.mimeType), 'data-display-mode': '2d'});
                    resArray = manifest.parameters.classic.resolution;
                    resArrayLength = resArray.length;
                }
                else if (manifest.parameters.mobile) {
                    imageContainer = $('<div />', {'class': clazz, 'data-alt': metadata.alternativeText, 'data-width': percentWidth, 'data-src': '/content/womi/' + womiId + '/icon.' + this._getExt(manifest.parameters.classic.mimeType), 'data-display-mode': '2d'});
                    resArray = manifest.parameters.mobile.resolution;
                    resArrayLength = resArray.length;
                } else {
                    return undefined;
                }

                return imageContainer;
            },

            /**
             *
             * @param errorNum
             * @private
             */
            showErrorImage: function(_this, errorNum, womiId, callback) {


                var manifestStub = {"engine":"image","parameters":{"classic":{"heightRatio":1,"resolution":[120,480,980,1440,1920]},"mobile":{"heightRatio":1,"resolution":[120,480,980,1440,1920]}}}
                var metadataStub = {"author":"PCSS", "title":"Błąd podczas wstawiania WOMI"};
                var errorImageId;

                switch(errorNum) {
                    case errors.REQ_UNDEF:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - Bibloteka została zainicjowana bez podania wymaganego kontekstu dla require.js (Sprawdź dokumentację)";
                        errorImageId = "13785"
                        console.error("Import WOMI error - PlaceholderApi was instantiated without providing require context in constructor, requested womi can't be served. Fix your PlaceholderApi constructor call and add require context (Check documentation)");
                        break;
                    case errors.NOT_DECLARED:
                        metadataStub.alternativeText = "Błąd podczas importu WOMI - WOMI niezadeklarowane w manifeście";
                        errorImageId = "13784";
                        console.error('getWomi error - requested WOMI was not declared in womiIds Array in manifest file, fix your manifest file and declare requested WOMI');
                        break;
                    case errors.NO_MANIFEST:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - nie można pobrać manifestu";
                        errorImageId = "13790";
                        console.error("Import WOMI error - manifest can't be loaded, fix your manifest file");
                        break;
                    case errors.NO_WOMI_IDS:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - manifest nie zawiera elementu womiIds";
                        errorImageId = "13791";
                        console.error("Import WOMI error - manifest does not contains womiIds Array, fix your manifest file");
                        break;
                    case errors.EMPTY_WOMI_IDS:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - manifest zawiera pustą tablicę womiIds";
                        errorImageId = "13792";
                        console.error("Import WOMI error - manifest contains empty womiIds Array, fix your manifest file");
                        break;     
                    case errors.NO_WOMI_TYPE:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - nieznany lub nieokreślony typ żądanego WOMI w manifeście";
                        errorImageId = "13793";
                        console.error("Import error - requested WOMI manifest contains empty or unknown engine element");
                        break;
                    case errors.WRONG_METADATA:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - nie można przetworzyć pliku metadanych żądanego WOMI";
                        errorImageId = "13794";
                        console.error("Import WOMI error - requested WOMI metadata can't be parsed, check metadata file");
                        break;
                    case errors.WRONG_MANIFEST:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - nie można przetworzyć manifestu żądanego WOMI";
                        errorImageId = "13795";
                        console.error("Import WOMI error - requested WOMI manifest can't be parsed, check manifest file");
                        break;
                    case errors.NO_MANIFEST_OR_METADATA:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI - nie można pobrać manifestu lub metadanych żądanego WOMI";
                        errorImageId = "13796";
                        console.error("Import WOMI error - requested WOMI's manifest or metadata can't be loaded, check if requested womi is correct");
                        break;

                    case errors.UNKNOWN:
                    default:
                        metadataStub.alternativeText = "Błąd podczas wstawiania WOMI";
                        errorImageId = "13797";
                        console.error("Import WOMI error");
                        break;
                } 

                _this.getImageContainer(_this, errorImageId, manifestStub, metadataStub, "80%", function (womiContainer) {
                    callback(womiContainer);
                });


            },

            /**
             * This method inserts predefined element to outer DOM tree.
             * It should always be called at the end of initialization of {@link EPO.api.PlaceholderApi} element.
             * @function EPO.api.PlaceholderApi#appendToPlaceholder
             * @example
             * {
             *     var pa = new placeholderApi($(placeholder));
             *     ...
             *     placeholderApi.set...{1}
             *     placeholderApi.set...{2}
             *     placeholderApi.set...{3}
             *     ...
             *     placeholderApi.set...{n}
             *
             *     placeholderApi.appendToPlaceholder();
             * }
             */
            appendToPlaceholder: function () {

                this.placeholder.append(this.generateBody());

 // ET-2312 and ET-2368 fix: Content of default button was to big so the tooltip wasn't working well.
                var isMath = $('#reader-definition').attr('data-stylesheet')  === 'standard-2-matematyka';
                if (isMath) {
                    $('.exercise-buttons').children().each(function(i, o) {
                        if($(o).hasClass("defaults")){
                            $(o).html('');
                        }
                    });
                };
                womi.load2(this.placeholder);
            },

            /**
             * Function created for more demanding partners, it enables raw append operation on placeholder.
             * Beware, proper styling may not be able to apply. Use this method carefully or with your own styling.
             * @since 1.1.1
             * @function EPO.api.PlaceholderApi#rawAppend
             * @param {JQuery|HTML|String} toAppend
             */
            rawAppend: function (toAppend) {

                this.placeholder.append(toAppend);
            },

            /**
             * This method takes responsibilities which are covered by {@link EPO.api.PlaceholderApi#appendToPlaceholder}
             * use it if you don't want to use predefined method for creation DOM tree.
             * @since 1.1.1
             * @function EPO.api.PlaceholderApi#rawLoadEngine
             */
            rawLoadEngine: function () {

                womi.load2(this.placeholder);
            },

            /**
             * @function EPO.api.PlaceholderApi#generateBody
             * @returns {Function|wrap|Function|*|HTMLElement}
             * @private
             */
            generateBody: function () {

                this.wrap = $('<div />', {'class': 'womi-exercise-3rd-party-container'});

                if (this.isDescription) {
                    this.exerciseDescrption = $('<div />', {'class': 'exercise-description'});

                    if (this.title)
                        this.exerciseDescrption.append(this.title);
                    if (this.author)
                        this.exerciseDescrption.append(this.author);
                    if (this.description)
                        this.exerciseDescrption.append(this.description);


                    this.wrap.append(this.exerciseDescrption);
                }


                if (this.isContent) {

                    if (this.content == undefined)
                        this.content = $('<div />', {'class': 'exercise-content'});

                    if (this.answerList)
                        this.content.append(this.answerList);
                    if (this.feedback)
                        this.content.append(this.feedback);
                    if (this.hint)
                        this.content.append(this.hint);

                    if (this.isButtons) {
                        this.buttons = $('<div />', {'class': 'exercise-buttons'});

                        if (this.recreateButton)
                            this.buttons.append(this.recreateButton);
                        if (this.defaultsButton)
                            this.buttons.append(this.defaultsButton);
                        if (this.checkButton)
                            this.buttons.append(this.checkButton);
                        if (this.hintButton)
                            this.buttons.append(this.hintButton);

                        this.buttons.children().each(function(idx, btn) {
                            $(btn).tooltipsy({
                                className: 'base-tooltip-black',
                                alignTo: 'element',
                                offset: [0, 1]
                            });
                        });
                        this.content.append(this.buttons)
                    }

                    this.wrap.append(this.content);
                }

                return this.wrap;
            },


            //Exercise interface manipulation
            /**
             * This method returns a handler for specified n-th Geogebra element in WOMI. If requested applet was not yet loaded (user haven't clicked geogebra splash image) message "Zanim wygenerujesz nowy przykład, uruchom silnik zadania klikając na niego" will be displayed.
             * @function EPO.api.PlaceholderApi#ggbApplet
             * @param {Number} num Use 0 to get first ggbApplet inserted in your WOMI, 1 to get second etc.
             * @returns {ggbApplet}
             * @example
             * ggbApplet = placeholderApi.ggbApplet(0);
             *
             * ggbApplet.evalCommand('x0=' + x0);
             */
            ggbApplet: function (num) {

                if ($(this.placeholder).find('iframe').get(num) == undefined) {
                    this.auxiliaryFeedback('feedback-info', 'Zanim wygenerujesz nowy przykład, uruchom silnik zadania klikając na niego');
                    return null;
                } else {
                    this.hideFeedback();
                }

                return $(this.placeholder).find('iframe').get(num).contentWindow.ggbApplet;

            },


            /**
             * Auxiliary method which can be used to cleanup feedback during generation of new exercise.
             * @function EPO.api.PlaceholderApi#hideFeedback
             */
            hideFeedback: function () {

                $(this.placeholder).find('.exercise-feedback').children().hide();

            },

            /**
             * Show message of type Correct.
             * @function EPO.api.PlaceholderApi#showCorrectFeedback
             * @param {String} [text] if not specified "Bardzo dobrze!" will be displayed
             */
            showCorrectFeedback: function (text) {

                this.auxiliaryFeedback('feedback-correct', text);

            },

            /**
             * Show message of type Incorrect.
             * @function EPO.api.PlaceholderApi#showIncorrectFeedback
             * @param {String} [text] if not specified "Niepoprawnie!" will be displayed
             */
            showIncorrectFeedback: function (text) {

                this.auxiliaryFeedback('feedback-incorrect', text);

            },

            /**
             * Show message of type Incomplete.
             * @function EPO.api.PlaceholderApi#showIncompleteFeedback
             * @param {String} [text] if not specified "Musisz wybrać odpowiedź." will be displayed
             */
            showIncompleteFeedback: function (text) {

                this.auxiliaryFeedback('feedback-incomplete', text);

            },

            /**
             * Show message of type PartiallyCorrect.
             * @function EPO.api.PlaceholderApi#showPartiallyCorrectFeedback
             * @param {String} [text] if not specified "Odpowiedź częsciowo poprawna." will be displayed
             */
            showPartiallyCorrectFeedback: function (text) {

                this.auxiliaryFeedback('feedback-partial', text);

            },

            /**
             * Show message of type Info.
             * @function EPO.api.PlaceholderApi#showInfoMessage
             * @param {String} [text] if not specified "Ostrzeżenie!" will be displayed
             */
            showInfoMessage: function (text) {

                this.auxiliaryFeedback('feedback-info', text);

            },

            /**
             * Auxiliary function which is used to create and show various feedback.
             * @function EPO.api.PlaceholderApi#auxiliaryFeedback
             * @param {String} type
             * @param {String} text
             * @private
             */
            auxiliaryFeedback: function (type, text) {

                var messageDict = {
                    'feedback-correct': 'Bardzo dobrze!',
                    'feedback-incorrect': 'Niepoprawnie!',
                    'feedback-incomplete': 'Musisz wybrać odpowiedź.',
                    'feedback-partial': 'Odpowiedź częsciowo poprawna.',
                    'feedback-info': 'Ostrzeżenie!'
                };

                if ($(this.placeholder).find('.' + type).length == 0) {
                    var info;

                    $(this.placeholder).find('.exercise-feedback').children().hide();

                    if (text != undefined)
                        info = $('<span />', {'class': type, 'html': text});
                    else
                        info = $('<span />', {'class': type, 'html': messageDict[type]});

                    $(this.placeholder).find('.exercise-feedback').append(info);

                }
                else {
                    if (text != undefined)
                        $(this.placeholder).find('.' + type).html(text);

                    $(this.placeholder).find('.' + type).show();
                    $(this.placeholder).find('.' + type).siblings().hide();

                }
            },

            /**
             * Auxiliary method which can be used to cleanup hint during generation of new exercise.
             * @function EPO.api.PlaceholderApi#hideHint
             */
            hideHint: function () {

                if (this.hintMessage != undefined)
                    $(this.placeholder).find('.exercise-hint').html("");

                $(this.placeholder).find('.exercise-hint').hide();

            },

            /**
             * Show hint defined by {@link EPO.api.PlaceholderApi#setHint} or specified in attribute (i.e. answer specific).
             * @function EPO.api.PlaceholderApi#showHint
             * @param {String} [text] if not specified hint defined by {@link EPO.api.PlaceholderApi#setHint} will be displayed. If both hints were not specified "Nie zdefiniowano podpowiedzi dla tego wariantu zadania." will be displayed.
             */
            showHint: function (text) {

                if (text != undefined)
                    $(this.placeholder).find('.exercise-hint').html(text);
                else if (this.hintMessage != undefined)
                    $(this.placeholder).find('.exercise-hint').html(this.hintMessage);
                else
                    $(this.placeholder).find('.exercise-hint').html("Nie zdefiniowano podpowiedzi dla tego wariantu zadania.");

                $(this.placeholder).find('.exercise-hint').show();

            },

            /**
             * Regenerate content of an element.
             * @function EPO.api.PlaceholderApi#regenerateContent
             * @param {String} [contentType] type of content to be reloaded (i.e. 'math' for MathML)
             * @param {String} [element] element that will be reloaded.
             */
            regenerateContent: function (contentType, element) {
                if(contentType == "math") {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
                }
            }

        }

        //Callbacks

        /**
         * function with one parameter which would be jQuery Object containing requested WOMI, this attribute should be inserted in DOM by users code
         * @callback EPO.api.PlaceholderApi~getWomiCallback
         * @param {JQuery} returnedWomi jQuery Object containing requested WOMI, which should be inserted in DOM by users code using {@link EPO.api.PlaceholderApi#addDescriptionElement} or {@link EPO.api.PlaceholderApi#addAnswer}, etc.
         */

        /**
         * function with one parameter which would be jQuery Object containing requested WOMI, this attribute should be passed by callback to the user's code
         * @callback EPO.api.PlaceholderApi~getAuxiliaryWomiCallback
         * @param {JQuery} returnedWomi jQuery Object containing requested WOMI, which should be passed as a parameter of {@link EPO.api.PlaceholderApi#getWomiCallback} to user code
         * @private
         */


    });
});
