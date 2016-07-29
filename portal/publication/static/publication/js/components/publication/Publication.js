define([
    'jquery',
    'underscore',
    'declare',
    'domReady',
    'text!./templates/presentation_section.html',
    'text!./templates/presentation_progress_bar.html',
], function ($, _, declare, domReady, presentationSectionSource, presentationProgressBarSource) {

    var presentationSectionTemplate = _.template(presentationSectionSource);
    var presentationProgressBarTemplate = _.template(presentationProgressBarSource);


    var stateApiRoot = '//www.{{ TOP_DOMAIN }}/edit/publication/api/state/';
    var stateApiMulti = '//www.{{ TOP_DOMAIN }}/edit/publication/api/multi';
    var REFRESH_BATCH_SIZE = 10;
    var PERIODIC_REFRESH_INTERVAL = 1000 * 2;
    var OBJECT_REFRESH_INTERVAL = 10 * 1000;

    var publicationStatusMapping = {
        'missing': ['NIE ISTNIEJE!', 'danger'],
        'edited': ['EDYTOWANE', 'danger'],
        'sealed': ['W PRZYGOTOWANIU...', 'warning'],
        'ready': [ 'PRZYGOTOWANE', 'info'],
        'published': ['OPUBLIKOWANE', 'success'],
        'stale': ['NIEAKTUALNY', 'warning'],
        'invalid': ['NIEPOPRAWNY', 'danger'],

        'initial': ['ZLECONO', 'info'],
        'fetching': ['POBIERANIE', 'warning'],
        'dependencies': ['ZALEŻNOŚCI...', 'info'],
        'processing': ['W TRAKCIE', 'warning'],
        'verifying': ['WERYFIKACJA...', 'info'],
        'failed': ['NIEUDANE', 'danger'],
        'canceled': ['ANULOWANE', 'danger'],
        'success': ['ZAKOŃCZONO', 'success'],

        'loading': ['(INICJALIZACJA)', 'info'],
    };

    var publicationRootPath = null;
    var mainPresentation = null;
    var mainDescriptor = null;
    var rootPresentations = [];
    var allPresentations = [];
    var presentationLevels = [];
    var presentationTokens = [];
    var presentationsMaxDepth = null;
    var presentationLinks = [];

    var allPresentationsMap = {};
    var initializationMarker = null;
    var initializing = true;
    var hasAdministration = false;



    function orderAction(ev) {
        var currentButton = $(ev.currentTarget);
        var actionUrl  = $('#orders-section').data('action-url');
        var action = currentButton.attr('data-action');
        var id;
        if (action == '0') {
            id = '0';
        } else {
            id = currentButton.parent().attr('data-publication-order-id');
        }

        $.ajax({
                url: actionUrl,
                type: 'POST',
                data: {
                    'id': id,
                    'action': action,
                }
            }).success(function (data) {
                if (data.executed) {
                    addAlert('Zmieniono status zlecenia', 'success');
                }
            }).fail(function (jqXHR, textStatus, errorMessage) {
                addAlert('Wystąpił błąd', 'danger');
                var stack = $(jqXHR.responseText);
                var err = _.where(stack, {className: 'error'});
            });

        ev.stopPropagation();
        return false;
    }


    function processMainDescriptor() {
        $('#published-url-button').toggleClass('disabled', !(mainDescriptor.object_status === 'published' || mainDescriptor.object_status === 'stale'));
        // $('#publish-button').toggleClass('disabled', !(descriptor.object_status === 'ready' || hasAdministration));
        $('#edition-button').toggle(mainDescriptor.object_status === 'edited');
        $('#publish-button').toggleClass('disabled', !((mainDescriptor.publication_status === null && mainDescriptor.object_status !== 'published' && mainDescriptor.object_status !== 'edited' && mainDescriptor.object_status !== 'missing') || (mainDescriptor.publication_status === 'success' && mainDescriptor.object_status === 'ready')));
        $('#cancel-button').toggleClass('disabled', !(mainDescriptor.publication_status !== null && mainDescriptor.publication_status !== 'success'));
        $('#forget-button').toggleClass('disabled', !(mainDescriptor.publication_status !== null));
        $('#restart-button').toggleClass('disabled', !(mainDescriptor.publication_status !== 'success' || mainDescriptor.object_status !== 'published' && mainDescriptor.object_status !== 'edited' && mainDescriptor.object_status !== 'missing'));
    }


    function addAlert(message, mode) {
        $('#messages-container').append($('<div>').addClass('alert alert-dismissable alert-' + mode)
            .append($('<button>').attr('type', 'button').addClass('close').attr('data-dismiss', 'alert').append('×'))
            .append($('<strong>').append(message))
        );
    }

    function getPresentationsInDepth(number, depth, predicate) {
        var result = [];
        var currentCounter = 0;
        var presentations = presentationLevels[depth];
        while ((result.length < number) && (currentCounter < presentations.length)) {
            if (presentationTokens[depth] >= presentations.length) {
                presentationTokens[depth] = 0;
            }
            var presentation = presentations[presentationTokens[depth]];
            if (!_.contains(result, presentation) && predicate(presentation)) {
                result.push(presentation);
            }
            presentationTokens[depth] += 1;
            currentCounter += 1;
        }
        return result;
    }

    function getPresentations(number, predicate) {
        var result = [];
        var depth = 0;
        while (result.length < number && depth < presentationLevels.length) {
            var partialResult = getPresentationsInDepth(Math.max(1, Math.floor(number / 2)), depth, predicate);
            if (partialResult.length > 0) {
                result = result.concat(partialResult);
            }
            depth += 1;
        }

        return result;
    }



    $(document).ready(function () {

    });

    function updatePresentations(presentations) {
        var query = '';
        _.each(presentations, function(presentation) {
            presentation.refreshingMarker.show('slow');
            if (query) {
                query += '&';
            }
            query += 'identification=' + presentation.identification.path;
        });

        return $.ajax({
            type: "get",
            url: stateApiMulti,
            dataType: "json",
            data: query,
            success: function(descriptors) {
                _.each(descriptors, function(descriptor, path) {
                    try {
                        var presentation = allPresentationsMap[path];
                        presentation.refreshingMarker.hide('slow');
                        processDescriptor(presentation, descriptor);
                    } catch(err) {
                        console.log(err);
                    }
                });
            },
            error: function (jqXHR, status) {
                _.each(presentations, function(presentation) {
                    try {
                        presentation.refreshingMarker.hide('slow');
                    } catch(err) {
                        console.log(err);
                    }
                });
            }
        }).always(function() {
            _.each(presentations, function(presentation) {
                presentation.updating = false;
            });
        });
    }

    function presentationSetTitle(presentation, title) {
        presentation.title = title;
        if (title !== null) {
            presentation.subSection.find('.publication-title').text(title).show('slow');
        }
    }

    function refreshPresentationLink(presentationLink) {
        presentationSetTitle(presentationLink, presentationLink.originalPresentation.title);
        presentationSetStatus(presentationLink, presentationLink.originalPresentation.objectStatus, presentationLink.originalPresentation.publicationStatus, presentationLink.originalPresentation.singleStatus);
    }

    function refreshAllPresentationLinks(presentation) {
        _.each(presentation.links, refreshPresentationLink);
    }

    function processDescriptor(presentation, descriptor) {

        if ((mainPresentation !== null) && (presentation.identification.path == mainPresentation.identification.path)) {
            mainDescriptor = descriptor;
            processMainDescriptor();
        }

        presentationSetTitle(presentation, descriptor.title);
        presentationSetStatus(presentation, descriptor.object_status, descriptor.publication_status, descriptor.single_status);
        refreshAllPresentationLinks(presentation);

        if (!presentation.initialized) {

            if (descriptor.dependencies && descriptor.dependencies.length && (presentationsMaxDepth === null || presentation.depth < presentationsMaxDepth - 1)) {

                presentation.subSection.find('.publication-progress-placeholder').html(presentationProgressBarTemplate());
                presentation.progressSection = presentation.subSection.find('.publication-progress-placeholder .progress');
                presentation.descendantsStatuses = createStatusAccumulator();

                presentation.dependencies = [];
                _.each(descriptor.dependencies, function(dependencyIdentification, number) {
                    var dependencyPresentation = createPresentation(presentation, presentation.section, dependencyIdentification);
                });
            }

            presentation.initialized = true;
        }

        var next_interval = (presentation.singleStatus != 'published' ? OBJECT_REFRESH_INTERVAL : 30 * 60 * 1000);
        presentation.nextRefreshAfter = Date.now() + next_interval;

        if (initializing) {
            if (_.every(allPresentations, function(presentation) { return presentation.initialized; })) {
                initializationMarker.hide('slow');
                presentationLevels = _.map(presentationLevels, _.shuffle);

                initializing = false;
            }
        }

    }


    function createStatusAccumulator() {
        var result = {};
        _.each(publicationStatusMapping, function(value, key) {
            result[key] = 0;
        });
        return result;
    }

    function presentationBubbleStatus(presentation, old_status, new_status, new_entity) {

        if (!presentation.parent) {
            return;
        }
        if (new_entity) {
            presentation.parent.descendantsTotal += 1;
        }
        if (old_status) {
            presentation.parent.descendantsStatuses[old_status] -= 1;
        }
        if (new_status) {
            presentation.parent.descendantsStatuses[new_status] += 1;
        }

        _.each(presentation.parent.descendantsStatuses, function(count, status) {
            var ratio = count / presentation.parent.descendantsTotal * 100;
            var value = ratio + '%';
            presentation.parent.progressSection.find('.publication-state-' + status).css('width', value);
        })

        presentationBubbleStatus(presentation.parent, old_status, new_status, new_entity)
    }

    function updateStatusLabel(presentation, kind, status) {
        var markup = presentation.subSection.find('.' + kind + '-status');
        var config = publicationStatusMapping[status];
        if (status && config) {
            markup.text(config[0]).removeClass().addClass(kind + '-status label label-' + config[1]).show();
        } else {
            markup.hide();
        }
    }

    function presentationSetStatus(presentation, objectStatus, publicationStatus, singleStatus) {

        var oldSingleStatus = presentation.singleStatus;
        presentation.singleStatus = singleStatus;
        presentation.objectStatus = objectStatus;
        presentation.publicationStatus = publicationStatus;

        updateStatusLabel(presentation, 'object', objectStatus);
        updateStatusLabel(presentation, 'publication', publicationStatus);

        presentationBubbleStatus(presentation, oldSingleStatus, singleStatus, false);
    }

    function scheduleNextRefresh() {
        setTimeout(periodicRefresh, PERIODIC_REFRESH_INTERVAL);
    }

    function periodicRefresh() {
        var currentMoment = Date.now();
        var presentations = getPresentations(REFRESH_BATCH_SIZE, function (presentation) {
            if (!presentation.initialized) {
                return true;
            }
            if (!presentation.nextRefreshAfter) {
                return true;
            }
            return presentation.nextRefreshAfter < currentMoment;
        });

        if (presentations.length > 0) {
            updatePresentations(presentations).always(scheduleNextRefresh);
        } else {
            scheduleNextRefresh();
        }
    }

    function refreshLinkPresentation(presentation) {

    }

    function createPresentation(parentPresentation, parentSection, identification) {

        var presentation = {
            identification: identification,
            initialized: false,
            dependencies: null,
            progressSection: null,
            subSection: null,
            descendantsTotal: 0,
            descendantsStatuses: null,
            parent: parentPresentation,
            singleStatus: null,
            publicationStatus: null,
            objectStatus: null,
            nextRefreshAfter: null,
            updating: false,
            links: [],
            title: null,
            isLink: (identification.path in allPresentationsMap),
            id: identification.path + '-section',
            originalPresentation: null,
            depth: (parentPresentation ? parentPresentation.depth + 1 : 0),
        };

        if (!presentation.isLink) {
            allPresentations.push(presentation);
            if (!(presentation.depth in presentationLevels)) {
                presentationLevels[presentation.depth] = [];
                presentationTokens[presentation.depth] = 0;
            }
            presentationLevels[presentation.depth].push(presentation);
            allPresentationsMap[presentation.identification.path] = presentation;
        } else {
            presentation.originalPresentation = allPresentationsMap[identification.path];
            presentation.originalPresentation.links.push(presentation);
            presentation.id = presentation.id + '-link';
        }

        parentSection.append(presentationSectionTemplate({ presentation: presentation }));

        presentation.section = parentSection.find('#' + presentation.id);
        presentation.subSection = presentation.section.find('.presentation-subsection');
        presentation.refreshingMarker = presentation.subSection.find('.publication-refreshing');
        presentation.section.show('slow');

        presentationBubbleStatus(presentation, null, null, true);
        if (!presentation.isLink) {
            var objectStateGuess = 'loading';
            if (parentPresentation && parentPresentation.objectStatus == 'published') {
                objectStateGuess = 'published';
            }
            presentationSetStatus(presentation, objectStateGuess, 'loading', objectStateGuess);
            $('#publication-objects-counter').text(allPresentations.length);
        } else {
            refreshPresentationLink(presentation);
        }

        if (parentPresentation !== null) {
            parentPresentation.dependencies.push(presentation);
        }

        return presentation;
    }

    function bindOperationButton(button, operation) {
        var executeUrl = $('#main-section').data('action-url');

        button.off();
        button.on("click", function(ev) {
            button.attr('disabled', true);
            $.ajax({
                    url: executeUrl,
                    type: 'POST',
                    data: {
                        'operation': operation,
                    }
                }).success(function (data) {
                    button.attr('disabled', false);
                    updatePresentations([mainPresentation]);
                }).fail(function (jqXHR, textStatus, errorMessage) {
                    button.attr('disabled', false);
                    addAlert('Wystąpił błąd', 'danger');
                    var stack = $(jqXHR.responseText);
                    var err = _.where(stack, {className: 'error'});
                });
            ev.stopPropagation();
            return false;
        });

    }

    domReady(function () {

        presentationsMaxDepth = presentationsDepth;

        publicationRootPath = $('#main-section').attr('data-publication-root-path');


        $("#orders-add-button").click(orderAction);

        bindOperationButton($('#publish-button'), 'publish');
        bindOperationButton($('#restart-button'), 'restart');
        bindOperationButton($('#cancel-button'), 'cancel');
        bindOperationButton($('#forget-button'), 'forget');

        hasAdministration = ($('#main-section').attr('data-has-administration-permissions') === 'true');
        initializationMarker = $('#publication-initialization-marker');

        rootPresentations = _.map(rootDescriptors, function(descriptor) {
            return createPresentation(null, $('#presentation-root-section'), descriptor.identification);
        });

        if (rootDescriptors.length == 1) {
            mainPresentation = rootPresentations[0];
            mainDescriptor = rootDescriptors[0];
        }

        _.each(rootDescriptors, function(descriptor) {
            var presentation = allPresentationsMap[descriptor.identification.path];
            processDescriptor(presentation, descriptor);
        });


        periodicRefresh();


    } );
});
