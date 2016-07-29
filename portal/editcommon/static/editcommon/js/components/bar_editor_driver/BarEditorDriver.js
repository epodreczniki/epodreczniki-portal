define([
    'jquery',
    'underscore',
    'declare',
    'lock_driver/LockDriver',
    'object_driver/ObjectDriver',
    'standard_extensions/StandardExtensions'
], function ($, _, declare, LockDriver, ObjectDriver, StandardExtensions) {

    function updatePresentationBadge(params) {
        params.place.hide('fast', function() {
            params.place.find('.editor-driver-icon').removeClass().addClass('editor-driver-icon glyphicon glyphicon-' + genericIconTranslator(params.icon));
            params.place.find('.editor-driver-text').text(params.text);
            params.place.show('fast', function() {
                if (params.hideAfter) {
                    setTimeout(function() {
                        params.place.hide('fast');
                    }, params.hideAfter);
                }
            });
        });
    }

    function genericIconTranslator(idea) {
        if (idea === 'true' || idea === 'ok') {
            return 'ok-circle';
        }
        if (idea === 'false' || idea === 'remove' || idea === 'error') {
            return 'remove-circle';
        }
        if (idea === 'denied' || idea === 'ban') {
            return 'ban-circle';
        }
        if (idea === 'info') {
            return 'info-sign';
        }
        if (idea === 'warning') {
            return 'alert';
        }
        if (idea === 'read' || idea === 'book') {
            return 'book';
        }
        if (idea === 'write') {
            return 'pencil';
        }
        if (idea === 'save') {
            return 'floppy-disk';
        }
        if (idea === 'none' || idea === 'drop') {
            return 'minus';
        }
        if (idea === 'eye' || idea === 'watch') {
            return 'eye-open';
        }
        return idea;
    }

    var lockModeNiceNameMap = {
        'drop': 'Brak',
        'watch': 'Obserwacja',
        'read': 'Odczyt',
        'write': 'Zapis',
    };

    function lockModeNiceName(mode) {
        return lockModeNiceNameMap[mode];
    }

    return declare({
        instance: {
            constructor: function (config) {
                this.params = config.metadata;
                this.xmlEditor = config.xmlEditor;
                this.filesPushProvider = config.filesPushProvider;
                this.setReadOnlyStateHandler = config.setReadOnlyStateHandler;
                this.beforePushValidator = config.beforePushValidator || function() { return []; };
                this.controlPanel = $('#editor-driver-control-panel');
                this.editButton = this.controlPanel.find('.editor-driver-edit-button');
                this.saveButton = this.controlPanel.find('.editor-driver-save-button');
                this.statePresentation = this.controlPanel.find('.editor-driver-save-button');
                this.lockPresentation = this.controlPanel.find('.editor-driver-lock-state');
                this.operationPresentation = this.controlPanel.find('.editor-driver-operation-presentation');
                this.otherLocksPresentation  = this.controlPanel.find('.editor-driver-other-locks');
                this.changeOccurred = false;

                this.onOkCallback = function(data) {
                    if (data.transition) {
                        if (data.mode === 'write') {
                            this.showMessage('Włączono tryb edycji', 'ok');
                        } else if (data.mode === 'read') {
                            this.showMessage('Włączono tryb odczytu', 'ok');
                        } else if (data.mode === 'watch') {
                            this.showMessage('Włączono tryb obserwacji', 'ok');
                        } else if (data.mode === 'drop') {
                            this.showMessage('', 'ok');
                        }
                    }
                    this.setReadOnlyStateHandler(!this.lockDriver.canWrite());
                    this.updateLockPresentation();
                }.bind(this);

                this.lockDriver = new LockDriver(this.params);
                this.lockDriver.initialize(this.onOkCallback);

                this.lockDriver.onOk(this.onOkCallback);
                this.lockDriver.onFailure(function(data) {
                    if (data.reason == 'other-read') {
                        this.showMessage('Inny użytkownik czyta ten obiekt', 'denied');
                    } else if (data.reason == 'other-write') {
                        this.showMessage('Inny użytkownik edytuje ten obiekt', 'denied');
                    } else {
                        this.showMessage('Błąd', 'question');
                    }
                    this.updateLockPresentation();
                }.bind(this));

                this.objectDriver = new ObjectDriver(this.params, this.lockDriver);

                this.editButton.on('click', function () {
                    this.editButton.disable();
                    if (!this.lockDriver.canWrite()) {
                        this.lockDriver.write();
                    } else {
                        this.lockDriver.read();
                    }
                }.bind(this));

                this.saveButton.on('click', this.postPush.bind(this));

                window.addEventListener("beforeunload", this.beforeUnloadCheck.bind(this), false);


            },

            beforeUnloadCheck: function(e) {
                if (!this.changeOccurred) {
                    return;
                }

                var confirmationMessage = "Masz niezapisane zmiany. Chcesz je utracić?";

                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            },


            postPush: function() {
                if (this.beforePushValidator().length == 0) {
                    var form = new FormData();
                    var content = this.filesPushProvider();
                    form.append('content', new Blob([content.content]), content.filepath);
                    this.objectDriver.push(form, function (data) {
                        if (!this.xmlEditor) {
                            this.saveButton.toggleEnabled(true);
                        }else{
                            this.updateSaveButtonState();
                        }
                        this.changeOccurred = false;
                        this.showMessage('Zapisano', 'save');
                        window.parent.postMessage({message: 'saved'}, '*');
                    }.bind(this));
                } else {
                    BootstrapDialog.alert({
                        title: 'Błędy w pliku.',
                        message: 'Plik zawiera błędy, oznaczone w edytorze po lewej stronie przy numerze linii.<br/> Popraw je a następnie spróbuj ponownie.'
                    });
                }
                return false;
            },

            updateSaveButtonState: function() {
                this.saveButton.toggleEnabled(this.lockDriver.canWrite() && this.changeOccurred);
                this.editButton.toggleEnabled(!this.changeOccurred);
            },

            updateLockPresentationStatic: function() {
                this.updateSaveButtonState();

                this.editButton.enable();
                this.editButton.find('span').removeClass().addClass('glyphicon glyphicon-' + (this.lockDriver.canWrite() ? 'check' : 'unchecked'));

                this.otherLocksPresentation.empty();
                if (this.lockDriver.others) {
                    _.each(this.lockDriver.others, function(item) {
                        this.otherLocksPresentation.append($('<span>').append($('<span>').addClass('glyphicon glyphicon-' + genericIconTranslator(item.mode))).append($('<span>').text(item.user)).addClass('badge'));
                    }.bind(this));
                }
            },

            markChangeOccurred: function() {
                if (this.changeOccurred) {
                    return;
                }
                this.changeOccurred = true;
                this.updateSaveButtonState();
            },


            updateLockPresentation: function() {
                this.updateLockPresentationStatic();
                updatePresentationBadge({ place: this.lockPresentation, text: lockModeNiceName(this.lockDriver.mode), icon: this.lockDriver.mode});
            },

            showMessage: function(message, type/*ok, info, warning, error*/){
                updatePresentationBadge({ place: this.operationPresentation, text: message, icon: type, hideAfter: 2000});
            }
        }
    });
});
