define([
    'jquery',
    'underscore',
    'declare',
    'domReady',
    'text!./templates/execute_all_section.html',
    'text!./templates/multi_action_section.html',
    'text!./templates/single_action_section.html'
], function ($, _, declare, domReady, execute_all_section_source, multi_action_section_source, single_action_section_source) {

    var execute_all_section_template = _.template(execute_all_section_source);
    var multi_action_section_template = _.template(multi_action_section_source);
    var single_action_section_template = _.template(single_action_section_source);
    var animationTime = 'fast';


    function setIndicator(actionRow, style) {
        var indicatorSpan = actionRow.find('.cascade-forms-indicator span');
        indicatorSpan.removeClass();
        indicatorSpan.addClass('glyphicon');
        indicatorSpan.addClass('glyphicon-' + style);
    }

    function parseBoolean(value) {
        return ((value === 'true') || (value === 'True') || (value == 1));
    }


    function fireAction(instance, actionRow, actionSuccess, failure) {

        var actionUrl = actionRow.attr('data-action-url');
        var actionButton = actionRow.find('.cascade-forms-submit');
        var progressBar = actionRow.find('.cascade-forms-progress');

        actionButton.attr('disabled', true);
        setIndicator(actionRow, 'refresh');

        actionRow.find('.cascade-forms-message').hide();
        progressBar.show();

        var totalEstimatedTime = parseFloat(actionRow.attr('data-cascade-forms-estimated-time'));
        progressBar.find('.progress-bar').css('width', '0%').animate({
            width: "100%"
        }, totalEstimatedTime * 1000.0);

        function showMessage(message) {
            progressBar.hide();
            actionRow.find('.cascade-forms-message').html(message).show();
        }

        $.ajax({
            type: "post",
            url: actionUrl,
            dataType: "text",
            data: actionRow.find('form').serialize(),
            success: function(data) {

                try {
                    var loadedData = $(data);

                    var successMessage = loadedData.find('.cascade-forms-response-success');
                    var listPrepend = loadedData.find('.cascade-forms-list-prepend');

                    if (!parseBoolean(actionRow.attr('data-action-finish'))) {
                        successMessage.find('.cascade-forms-finish-only').hide();
                    }

                    showMessage(successMessage.length > 0 ? successMessage.html() : $('<span>').text('Wykonano'));

                    var machineResponseSection = loadedData.find('#machine-response');
                    var result = ((machineResponseSection.length > 0) ? JSON.parse(machineResponseSection.text()) : null);
                    setIndicator(actionRow, 'ok-circle');

                    if (listPrepend.children().length > 0 && actionRow.attr('data-action-list-prepend-id')) {
                        var prependTarget = $('#' + actionRow.attr('data-action-list-prepend-id'));
                        listPrepend.children().hide().addClass('cascade-forms-newly-added');
                        prependTarget.prepend(listPrepend.children());

                        var addedChildren = prependTarget.find('.cascade-forms-newly-added');
                        addedChildren.each(function(number, element) {
                            var currentId = $(element).attr('data-cascade-forms-list-entry-id');
                            if (currentId) {
                                prependTarget.find('[data-cascade-forms-list-entry-id="' + currentId + '"]').not('.cascade-forms-newly-added').hide();
                            }
                            connectInitializer({button: $(element).find('.cascade-forms-initializer'), setAsActive: true});
                        });
                        addedChildren.removeClass('cascade-forms-newly-added').show('highlight', {}, 1000);

                    }

                    var historyEntries = loadedData.find('#history-entries-append .edit-history-entry');
                    var streamSection = $('#edit-history-stream');

                    if (streamSection.length > 0 && historyEntries.length > 0) {
                        historyEntries.addClass('edit-history-entry-new').hide();
                        var streamKey = streamSection.attr('data-stream-key');
                        var streamList = streamSection.find('.edit-history-stream-list');
                        historyEntries.each(function(number, entry) {
                            if ($(entry).attr('data-stream-streams').search(streamKey) != -1) {
                                streamList.prepend($(entry));
                            }
                        });
                        streamList.find('.edit-history-entry-new').removeClass('edit-history-entry-new').show('highlight', {}, 'slow');
                    }


                    if (!instance.isMulti) {
                        runFinishAction(instance, actionRow);
                    }
                } catch (err) {
                    setIndicator(actionRow, 'remove-circle');
                    showMessage($('<span>').text('Błędna odpowiedź'));
                    console.log('failed to process response: ' + err);
                }

                actionSuccess(result);
            },
            error: function (jqXHR, status) {
                setIndicator(actionRow, 'remove-circle');

                try {
                    var response = $(jqXHR.responseText);
                    var repeatedForm = response.filter('.cascade-forms-single');
                    if (repeatedForm.length > 0) {
                        showMessage($('<span>').text('Niepoprawne żądanie'));
                    } else {
                        var message = [$('<p>').html(response.find('#exception-title').html())];
                        var elaborate = $.trim(response.find('#exception-elaborate').html());
                        if (!!elaborate) {
                            message.push($('<p>').html(elaborate));
                        }
                        showMessage(message);
                    }
                } catch (err) {
                    showMessage($('<span>').text('Wystąpił błąd'));
                }

                actionButton.attr('disabled', false);

                failure();
            }
        });
    }

    function fireAllActions(instance) {
        instance.allButton.attr('disabled', true);

        function finishAllOperation() {
            instance.allButton.attr('disabled', false);
        }

        function fireNextActionOrFinish(prevActionRow) {
            var iterator = prevActionRow;
            while (true) {
                var nextActionRow = iterator.next('.cascade-forms-action');
                iterator = nextActionRow;
                if (nextActionRow.length == 0) {
                    break;
                }
                if (nextActionRow.find('.cascade-forms-submit').is(':disabled')) {
                    continue;
                }
                if (!nextActionRow.find('.cascade-forms-checkbox span').hasClass('glyphicon-check')) {
                    setIndicator(nextActionRow, 'minus');
                    continue;
                }
                fireAction(instance, nextActionRow, function(result) { fireNextActionOrFinish(nextActionRow); }, finishAllOperation);
                return;
            }
            finishAllOperation();
            runFinishAction(instance, prevActionRow);
        }

        fireNextActionOrFinish(instance.allButton.closest('.cascade-forms-panel').find('.cascade-forms-first-marker'));
    }

    function boundSubmitAction(instance, button, callback) {
        return function() {
            var actionRow = button.closest('.cascade-forms-action');
            fireAction(instance, actionRow, callback, emptyCallback);
        }
    }


    function submitAction(instance, callback) {
        return function(ev) {
            boundSubmitAction(instance, $(ev.currentTarget), callback)();
            ev.stopPropagation();
            return false;
        }
    }

    function tickActionCheckbox(ev) {
        var currentButton = $(ev.currentTarget);
        var span = currentButton.find('span');
        if (span.hasClass('glyphicon-check')) {
            span.removeClass('glyphicon-check');
            span.addClass('glyphicon-unchecked');
        } else {
            span.addClass('glyphicon-check');
            span.removeClass('glyphicon-unchecked');
        }

        ev.stopPropagation();
        return false;
    }

    function installSingleForm(action, actionSource) {
        action.find('.cascade-forms-description').html(actionSource.find('.cascade-forms-source-description').html());
        action.find('.cascade-forms-fields').html(actionSource.find('.cascade-forms-source-fields').html());
        action.find('.cascade-forms-submit-container').html(actionSource.find('.cascade-forms-source-submit').html());
        action.attr('data-cascade-forms-estimated-time', actionSource.find('.cascade-forms-attributes').attr('data-cascade-forms-estimated-time'));
    }

    function mask(handler) {
        return function(ev) {
            handler();
            ev.stopPropagation();
            return false;
        }
    }

    function runFinishAction(instance, actionRow) {
        // TODO: don't know whether it is a good idea at all
        // var followLink = actionRow.find('a.cascade-forms-finish-follow');
        // if (followLink.length > 0) {
        //     var address = followLink.attr('href');
        //     followLink.fadeOut(2000, function () {
        //         console.log('here');
        //         followLink.fadeIn(2000, function () {
        //             console.log('there');
        //             // alert('finish: ' + address);
        //         });
        //     });
        // }
    }

    function emptyCallback() {
    }


    function installCascadeForm(instance, cascadeFormsResult) {
        var cascadeFormsSource = $(cascadeFormsResult);
        var cascadePanel = $('<div>').addClass('cascade-forms-panel');
        var singleSubmitAction = null;

        instance.isMulti = (cascadeFormsSource.filter('.cascade-forms-group').length > 0);

        if (instance.isMulti) {

            var actionSources = cascadeFormsSource.find('.cascade-forms-source');
            var moreThanOne = (actionSources.length > 1);

            if (moreThanOne) {
                cascadePanel.append(execute_all_section_template());
            }

            actionSources.each(function(num, action) {
                var actionSource = $(action);
                var actionRow = $(multi_action_section_template());

                var checkbox = actionRow.find('.cascade-forms-checkbox');
                if (!moreThanOne) {
                    checkbox.css('display', 'none');
                }
                if (!parseBoolean(actionSource.data('action-optional'))) {
                    checkbox.attr('disabled', true);
                }
                checkbox.find('span').addClass(parseBoolean(actionSource.data('action-checked')) ? 'glyphicon-check' : 'glyphicon-unchecked');

                actionRow.attr('data-action-url', actionSource.attr('data-action-url'));
                actionRow.attr('data-action-finish', actionSource.attr('data-action-finish'));
                installSingleForm(actionRow, actionSource.find('.cascade-forms-single'));
                actionRow.find('.cascade-forms-submit').click(submitAction(instance, function(result) { }));
                actionRow.find('.cascade-forms-description-in-button').hide();

                cascadePanel.append(actionRow);
            });
        } else {
            var action = cascadeFormsSource.filter('.cascade-forms-single')[0];
            var actionSource = $(action);
            var actionRow = $(single_action_section_template());

            // var checkbox = actionRow.find('.cascade-forms-checkbox');
            // checkbox.css('display', 'none');

            actionRow.attr('data-action-url', instance.providerUrl);
            actionRow.attr('data-action-list-prepend-id', instance.listPrependId);
            actionRow.attr('data-action-finish', 'true');
            installSingleForm(actionRow, actionSource);

            singleSubmitAction = boundSubmitAction(instance, actionRow.find('.cascade-forms-submit'), instance.config.successCallback);
            actionRow.find('.cascade-forms-submit').click(submitAction(instance, instance.config.successCallback)).toggle(!instance.config.autoRun);

            cascadePanel.append(actionRow);
        }
        instance.allButton = cascadePanel.find('.cascade-forms-all');

        instance.allButton.click(function(ev) {
            fireAllActions(instance);
            ev.stopPropagation();
            return false;
        });

        cascadePanel.find('.cascade-forms-checkbox').click(tickActionCheckbox);
        cascadePanel.find('.cascade-forms-cancel-button').click(mask(function() {
            resetCascadeForm(instance.config);
        })).toggle(!instance.config.autoRun);

        instance.config.formsContainer.html(cascadePanel).show(animationTime, function() {
            if (instance.config.autoRun) {
                if (instance.isMulti) {
                    fireAllActions(instance);
                } else {
                    singleSubmitAction();
                }
            }
        });

    }
    var fixedMatcher = /data-cascade-forms-fixed-(.+)/;

    function resetCascadeForm(config, callback) {
        if (!callback) {
            callback = function() {
                config.formsContainer.attr('data-cascade-forms-current-active-name', 'none');
            };
        }
        config.formsContainer.hide(animationTime, callback);
    }

    function connectInitializer(config) {

        if (!config.formsContainer) {
            config.formsContainer = $('#' + config.button.data('cascade-forms-container-id'))
        }
        config.name = config.button.data('cascade-forms-name');
        config.autoRun = parseBoolean(config.button.data('cascade-forms-auto-run'));
        if (!config.name) {
            config.name = Math.random().toString(16);
        }
        if (config.setAsActive) {
            config.formsContainer.attr('data-cascade-forms-current-active-name', config.name);
        }

        config.successCallback = (config.successCallback ? config.successCallback : function(result) {});

        config.button.click(mask(function() {

            if (config.name) {
                if (config.formsContainer.attr('data-cascade-forms-current-active-name') == config.name) {
                    resetCascadeForm(config);
                    return;
                }
                config.formsContainer.attr('data-cascade-forms-current-active-name', config.name);
            }

            var instance = {
                config: config,
            };

            resetCascadeForm(instance.config, function () {

                instance.providerUrl = (instance.config.urlProvider ? instance.config.urlProvider() : instance.config.button.attr('data-cascade-forms-provider-url'));
                instance.listPrependId = instance.config.button.attr('data-cascade-forms-list-prepend-id');

                var fixedInputs = null;
                if (instance.config.fixedInputsProvider) {
                    fixedInputs = instance.config.fixedInputsProvider();
                } else {
                    fixedInputs = instance.config.button.attr('data-cascade-forms-raw-fixed');
                    if (!fixedInputs) {
                        fixedInputs = {}
                        $.each(instance.config.button[0].attributes, function() {
                            var match = fixedMatcher.exec(this.name);
                            if (match) {
                                fixedInputs[match[1]] = this.value;
                            }
                        });
                    }
                }

                instance.config.button.attr('disabled', true);

                $.ajax({
                    type: "get",
                    url: instance.providerUrl,
                    dataType: "html",
                    data: fixedInputs,
                    // data: 'roles=author&roles=reviewer&username=xxx',
                    success: function(data) {
                        installCascadeForm(instance, data);
                    },
                    error: function (jqXHR, status) {
                        instance.config.formsContainer.text('failure').show(animationTime);
                    },
                }).always(function() {
                    instance.config.button.attr('disabled', false);
                });
            });
        }));
    }

    function connectAllInitializers(element) {
        $(element).find('.cascade-forms-initializer').each(function(index, initializer) { connectInitializer({ button: $(initializer) }); } );
    }

    domReady(function () {
        connectAllInitializers($('body'));
    });

    return {
        connectInitializer: connectInitializer,
        connectAllInitializers: connectAllInitializers
    }
});
