define(['jquery',
    'underscore',
    'backbone',
    './Dialog',
    'womi_dialog',
    './../app/util/IdGenerator',
    'modules/app/util/TreeNodesHelper',
    'modules/app/util/RolesUtil',
    'text!modules/templates/EducationLevelDialogBody.html',
    'text!modules/templates/SubjectListDialogBody.html',
    'text!modules/templates/ActorsDialogBody.html',
    'text!modules/templates/OrganizationsDialogBody.html',
    'text!modules/templates/RolesDialogBody.html',
    'text!modules/templates/ViewAtributesDialogBody.html',
    'text!modules/templates/StylesheetDialogBody.html'
], function ($, _, Backbone, Dialog, WOMISelectDialog, IdGenerator, TreeNodesHelper, RolesUtil, EducationLevelDialogBody, SubjectListDialogBody, ActorsDialogBody, OrganizationsDialogBody, RolesDialogBody, ViewAtributesDialogBody, StylesheetDialogBody) {
    return Dialog.extend({

        initialize: function (options) {
            this.model = options.model;
            this.treeData = this.model.get('treeData');
            this.selectedTreeDataPath = this.model.get('selectedTreeDataPath');
            this.womiSelectDialog = new WOMISelectDialog({treeData: this.treeData, selectedPath: this.selectedTreeDataPath, saveCallback: function () {
            }});
            this.saveCallback = options.saveCallback;
            this.attributesName = options.attributesName;
            this.initAttrs = options.initAttrs;
            this.modal = $("#editAttrsModal");
            this._setTitle(options.title);
            this._createModalBodyElements();
            this._initButtons();
            this._initAttributesList();
            this.render();
        },

        _setTitle: function (title) {
            this.modal.find("#editAttrsModalTitle").html(title);
        },

        _createModalBodyElements: function () {
            var modalBody = this.modal.find("#editAttrsModalBody");
            modalBody.empty();
            if (this.attributesName == 'educationLevellist') {
                modalBody.html(_.template(EducationLevelDialogBody));
            } else if (this.attributesName == "subjectlist") {
                modalBody.html(_.template(SubjectListDialogBody));
            } else if (this.attributesName == "actors") {
                modalBody.html(_.template(ActorsDialogBody));
            } else if (this.attributesName == "organizations") {
                modalBody.html(_.template(OrganizationsDialogBody));
            } else if (this.attributesName == "roles") {
                modalBody.html(_.template(RolesDialogBody));
            } else if (this.attributesName == "view-attributes") {
                modalBody.html(_.template(ViewAtributesDialogBody));
            } else if (this.attributesName == "stylesheet") {
                modalBody.html(_.template(StylesheetDialogBody));
            }
        },

        _initAttributesList: function () {
            var _this = this;
            if (_this.attributesName == 'educationLevellist') {
                _.each(_this.model.get("metadata").educationLevellist, function (level) {
                    if (level != "") {
                        $('#level-list').append('<option value=' + level + '>' + level + '</option>');
                    }
                });
                var allValues = $("#level-list>option").map(function () {
                    return $(this).val();
                }).toArray();
                _this._setAttributes(allValues);
            } else if (_this.attributesName == "subjectlist") {
                _.each(_this.model.get("metadata").subjectlist, function (subject) {
                    if (subject != "") {
                        $('#subjectlist').append('<option value=' + subject + '>' + subject + '</option>');
                    }
                });
                var allValues = $("#subjectlist>option").map(function () {
                    return $(this).val();
                }).toArray();
                _this._setAttributes(allValues);
            } else if (_this.attributesName == "actors") {
                _.each(_this.model.get("metadata").actors, function (actor) {
                    if (actor != "") {
                        var _actorid = actor.userid;
                        var _firstname = actor.firstname;
                        var _surname = actor.surname;
                        var _fullname = actor.fullname;
                        var _email = actor.email;
                        // var actorField = "Id: " + _actorid + " " + _firstname + " " + _surname + " (" + _email + ")";
                        var actorField = _firstname + " " + _surname + (_email != '' ? " e-mail: " + _email : '');
                        var _actor = {
                            userid: _actorid,
                            firstname: _firstname,
                            surname: _surname,
                            fullname: _fullname,
                            email: _email
                        }

                        var actorOption = $('<option>', {
                            "value": _actorid
                        });
                        actorOption.append(actorField);
                        actorOption.data({"actor": _actor});
                        $("#actorslist").append(actorOption);
                    }
                });
                var allValues = $("#actorslist>option").map(function () {
                    return $(this).data("actor");
                }).toArray();
                _this._setAttributes(allValues);
            } else if (_this.attributesName == "organizations") {
                _.each(_this.model.get("metadata").organizations, function (organization) {
                    if (organization != "") {
                        var _userId = organization.userid;
                        var _fullname = organization.fullname;
                        var _shortname = organization.shortname;
//                        var organizationField = "Id: " + _userId + " " + _shortname + "(" + _fullname + ")";
                        var organizationField = _shortname + " (" + _fullname + ")";
                        var _organization = {
                            userid: _userId,
                            fullname: _fullname,
                            shortname: _shortname
                        }
                        var organizationOption = $('<option>', {
                            "value": _userId
                        });
                        organizationOption.append(organizationField);
                        organizationOption.data({"organization": _organization});
                        $("#organizationslist").append(organizationOption);

                    }
                });
                var allValues = $("#organizationslist>option").map(function () {
                    return $(this).data("organization");
                }).toArray();
                _this._setAttributes(allValues);
            } else if (_this.attributesName == "roles") {

                var users = [];
                _.each(_this.model.get("metadata").actors, function (actor) {
                    users.push([ actor.userid, actor.fullname + ' (' + actor.firstname + ' ' + actor.surname + ')']);
                });
                _.each(_this.model.get("metadata").organizations, function (organization) {
                    users.push([ organization.userid, organization.shortname ]);
                });
                $('#roleValue-list option').remove();
                _.each(users, function (user) {
                    var userIdOption = $('<option>', {
                        "value": user[0]
                    });
                    userIdOption.append(user[1]);
                    $('#roleValue-list').append(userIdOption);
                });

                _.each(_this.model.get("metadata").roles, function (role) {
                    if (role != "") {
                        $("#roleslist").append(RolesUtil.getSelectOptionRole(role.value, role.type, _this.model.get("metadata").actors, _this.model.get("metadata").organizations));
                    }
                });
                var allValues = $("#roleslist>option").map(function () {
                    return $(this).data("role");
                }).toArray();
                _this._setAttributes(allValues);
            } else if (_this.attributesName == "view-attributes") {
                _.each(this.initAttrs, function (attr) {
                    var attrField = '';
                    if (attr.value == '' || attr.value === undefined) {
                        attrField = "Typ: " + attr.type + "; Identyfikator: " + attr.id;
                    } else if (attr.id == '' || attr.id === undefined) {
                        attrField = "Typ: " + attr.type + "; Wartość: " + attr.value;
                    } else {
                        attrField = "Typ: " + attr.type + "; Identyfikator: " + attr.id + "; Wartość: " + attr.value;
                    }
                    var viewAttrOption = $('<option>', {
                        "value": attr.id
                    });
                    viewAttrOption.append(attrField);
                    viewAttrOption.data({"view-attribute": attr});
                    $("#viewAttrslist").append(viewAttrOption);
                });

                $('#viewAttr-input').change(function () {
                    if ($(this).val() == 'matte-color') {
                        $('#viewAttrValue-input').show();
                        $('#viewAttrId-input').hide();
                    } else {
                        $('#viewAttrValue-input').hide();
                        $('#viewAttrId-input').show();
                    }
                });
                var allValues = $("#viewAttrslist>option").map(function () {
                    return $(this).data("view-attribute");
                }).toArray();
                _this._setAttributes(allValues);
            } else if (_this.attributesName == "stylesheet") {

            }
        },

        _initButtons: function () {
            var _this = this;
            if (this.attributesName == 'educationLevellist') {
                $('#addLevelButton').click(function (event) {
                    var newLevel = $('#level-input').val();
                    if (newLevel != '') {
                        $('#level-list').append('<option value="' + newLevel + '">' + newLevel + '</option>');
                        $('#level-input').val("");
                        var allValues = $("#level-list>option").map(function () {
                            return $(this).val();
                        }).toArray();
                        _this._setAttributes(allValues);
                    } else {
                        alert("Podaj nazwę nowego etapu edukacji.");
                    }
                    event.stopPropagation();
                });
                $('#deleteLevelButton').click(function (event) {
                    _.each($('#level-list').val(), function (selected) {
                        $("#level-list option[value='" + selected + "']").remove();
                    });
                    var allValues = $("#level-list>option").map(function () {
                        return $(this).val();
                    }).toArray();
                    _this._setAttributes(allValues);
                    event.stopPropagation();
                });
            } else if (_this.attributesName == "subjectlist") {
                $('#addSubjectButton').click(function (event) {
                    var newSubject = $('#subjectlist-input').val();
                    if (newSubject != '') {
                        $('#subjectlist').append('<option value="' + newSubject + '">' + newSubject + '</option>');
                        $('#subjectlist-input').val("");
                        var allValues = $("#subjectlist>option").map(function () {
                            return $(this).val();
                        }).toArray();
                        _this._setAttributes(allValues);
                    } else {
                        alert("Podaj nowy temat.");
                    }
                    event.stopPropagation();
                });
                $('#deleteSubjectButton').click(function (event) {
                    _.each($('#subjectlist').val(), function (selected) {
                        $("#subjectlist option[value='" + selected + "']").remove();
                    });
                    var allValues = $("#subjectlist>option").map(function () {
                        return $(this).val();
                    }).toArray();
                    _this._setAttributes(allValues);
                    event.stopPropagation();
                });
            } else if (_this.attributesName == "actors") {
                $('#addActorButton').click(function (event) {
                    //var _actorid = $('#userid-input').val();
                    var _actorid = (new IdGenerator('author', 'simple')).getId();
                    var _firstname = $('#firstname-input').val();
                    var _surname = $('#surname-input').val();
                    var _fullname = $('#fullname-input').val();
                    var _email = $('#email-input').val();
                    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (!emailFilter.test(_email)) {
                        BootstrapDialog.alert({
                            title: 'Niepoprawny e-mail',
                            message: 'Proszę wprowadzić poprawny e-mail.'
                        });
                        $('#email-input').focus();
                        return false;
                    } else {
                        //var actorField = "Id: " + _actorid + " " + _firstname + " " + _surname + " e-mail: " + _email + "";
                        var actorField = _fullname + " (" + _firstname + " " + _surname + (_email != '' ? " e-mail: " + _email : '') + ")";
                        var _actor = {
                            userid: _actorid,
                            firstname: _firstname,
                            surname: _surname,
                            fullname: _fullname,
                            email: _email
                        }
                        var actorOption = $('<option>', {
                            "value": _actorid
                        });
                        actorOption.append(actorField);
                        actorOption.data({"actor": _actor});
                        $("#actorslist").append(actorOption);
                        //$('#userid-input').val('');
                        $('#firstname-input').val('');
                        $('#surname-input').val('');
                        $('#fullname-input').val('');
                        $('#email-input').val('');

                        var allValues = $("#actorslist>option").map(function () {
                            return $(this).data("actor");
                        }).toArray();
                        _this._setAttributes(allValues);

                        event.stopPropagation();
                    }
                });
                $('#deleteActorButton').click(function (event) {
                    _.each($('#actorslist').val(), function (selected) {
                        $("#actorslist option[value='" + selected + "']").remove();
                    });
                    var allValues = $("#actorslist>option").map(function () {
                        return $(this).data("actor");
                    }).toArray();
                    _this._setAttributes(allValues);
                    event.stopPropagation();
                });
            } else if (_this.attributesName == "organizations") {
                $('#addOrganizationButton').click(function (event) {
                    // var _userid = $('#userid-input').val();
                    var _userid = (new IdGenerator('organization', 'simple')).getId();
                    var _fullname = $('#fullname-input').val();
                    var _shortname = $('#shortname-input').val();
//                    var organizationField = "Id: " + _userid + " " + _shortname + " (" + _fullname + ")";
                    var organizationField = _shortname + " (" + _fullname + ")";
                    if (_userid != '') {
                        var _organization = {
                            userid: _userid,
                            fullname: _fullname,
                            shortname: _shortname
                        }
                        var organizationOption = $('<option>', {
                            "value": _userid
                        });
                        organizationOption.append(organizationField);
                        organizationOption.data({"organization": _organization});
                        $("#organizationslist").append(organizationOption);
                        //$('#userid-input').val('');
                        $('#fullname-input').val('');
                        $('#shortname-input').val('');

                        var allValues = $("#organizationslist>option").map(function () {
                            return $(this).data("organization");
                        }).toArray();
                        _this._setAttributes(allValues);
                    } else {
                        alert("Podaj identyfikator organizacji.");
                    }
                    event.stopPropagation();
                });
                $('#deleteOrganizationButton').click(function (event) {
                    _.each($('#organizationslist').val(), function (selected) {
                        $("#organizationslist option[value='" + selected + "']").remove();
                    });
                    var allValues = $("#organizationslist>option").map(function () {
                        return $(this).data("organization");
                    }).toArray();
                    _this._setAttributes(allValues);
                    event.stopPropagation();
                });
            } else if (_this.attributesName == "roles") {
                $('#addRoleButton').click(function (event) {
                    var _roleValue = $('#roleValue-list').val();
                    var _roleType = $('#roleType-input').val();

                    if (_roleValue != null && _roleType != '') {
                        $("#roleslist").append(RolesUtil.getSelectOptionRole($('#roleValue-list').val(), $('#roleType-input').val(), _this.model.get("metadata").actors, _this.model.get("metadata").organizations));
                        // $('#roleValue-input').val('');
                        $('#roleType-input').val('');
                        var allValues = $("#roleslist>option").map(function () {
                            return $(this).data("role");
                        }).toArray();
                        _this._setAttributes(allValues);
                    } else {
                        alert("Podaj identyfikator użytkownika oraz typ nowej roli.");
                    }
                    event.stopPropagation();
                });
                $('#deleteRoleButton').click(function (event) {
                    $("#roleslist option:selected").remove()
                    var allValues = $("#roleslist>option").map(function () {
                        return $(this).data("role");
                    }).toArray();
                    _this._setAttributes(allValues);
                    event.stopPropagation();
                });
            } else if (_this.attributesName == "view-attributes") {

                $('#viewAttrId-input').on("keydown", function (event) {
                    //only show window if enter was pressed
                    if (event.which == 13) {
                        event.preventDefault();
                        _this.hide();
                        var womiDialog = _this.womiSelectDialog;
                        womiDialog.saveCallback = function (id, womi, treeData, selectedPath) {
                            _this.model.setTreeData(treeData);
                            _this.model.setSelectedTreeDataPath(selectedPath);
                            _this.render();
                            $('#viewAttrId-input').val(id);
                            womiDialog.close();
                        };
                        womiDialog.show();
                        $('.ui-dialog-titlebar-close').html("X");
                    }
                });


                $('#addViewAttrButton').click(function (event) {
                    var viewAttrId = $('#viewAttrId-input').val();
                    var viewAttrValue = $('#viewAttrValue-input').val();
                    var viewAttrType = $('#viewAttr-input').val();

                    var viewAttributeExists = false;
                    _.each(_this._getAttributes(), function (attribute) {
                        if (attribute.type == viewAttrType) {
                            viewAttributeExists = true;
                        }
                    });
                    if (viewAttributeExists == true) {
                        alert('Atrybut ' + viewAttrType + ' może wystąpić tylko raz!');
                    } else {
                        var viewAttr = {
                            id: viewAttrId,
                            type: viewAttrType,
                            value: viewAttrValue
                        }
                        var attrField = '';
                        if (viewAttr.value == '' || viewAttr.value === undefined) {
                            attrField = "Typ: " + viewAttr.type + "; Identyfikator: " + viewAttr.id;
                        } else if (viewAttr.id == '' || viewAttr.id === undefined) {
                            attrField = "Typ: " + viewAttr.type + "; Wartość: " + viewAttr.value;
                        } else {
                            attrField = "Typ: " + viewAttr.type + "; Identyfikator: " + viewAttr.id + "; Wartość: " + viewAttr.value;
                        }
                        if (viewAttrType == 'matte-color') {
                            if (viewAttr.value != '') {
                                _this._setViewAttrsList(viewAttr, attrField);
                            } else {
                                alert("Podaj wartość koloru w hexach.");
                            }
                        } else {
                            if (viewAttr.id != '') {
                                _this._setViewAttrsList(viewAttr, attrField);
                            } else {
                                alert("Podaj identyfikator WOMI.");
                            }
                        }
                    }
                    event.stopPropagation();
                });
                $('#deleteViewAttrButton').click(function (event) {
                    _.each($('#viewAttrslist').val(), function (selected) {
                        $("#viewAttrslist option[value='" + selected + "']").remove();
                    });
                    var allValues = $("#viewAttrslist>option").map(function () {
                        return $(this).data("view-attribute");
                    }).toArray();
                    _this._setAttributes(allValues);
                    event.stopPropagation();
                });
            } else if (this.attributesName == "stylesheet") {
                $('#stylesheet-input').focusout(function (event) {
                    _this._setAttributes($('#stylesheet-input').val());
                });
            }

            $("#editAttrsModalSaveButton").off("click");
            $('#editAttrsModalSaveButton').on("click", function (event) {
                _this.saveCallback(_this._getAttributes());
                _this.hide();
                event.stopImmediatePropagation();
            });
        },

        _setViewAttrsList: function (viewAttr, attrField) {
            var _this = this;
            var viewAttrOption = $('<option>', {
                "value": viewAttr.id
            });
            viewAttrOption.append(attrField);
            viewAttrOption.data({"view-attribute": viewAttr});
            $("#viewAttrslist").append(viewAttrOption);
            $('#viewAttrId-input').val("");
            $('#viewAttrValue-input').val("");
            var allValues = $("#viewAttrslist>option").map(function () {
                return $(this).data("view-attribute");
            }).toArray();
            _this._setAttributes(allValues);
        },

        _setAttributes: function (values) {
            this.editAttrs = values;
        },

        _getAttributes: function () {
            return this.editAttrs;
        },

        hide: function () {
            this.modal.modal('hide');
        },

        render: function () {
            this.modal.modal('show');
        },

        show: function () {
            this.render();
        }

    })
});
