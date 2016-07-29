define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/profile',
    '../models/profile',
    '../collections/teachers',
    '../models/teacher',
    'text!../templates/profile/show.html',
    'text!../templates/profile/teacher.html',
    'text!../templates/topbar/profile_topbar.html',
    'text!../templates/topbar/profile_topbar_small.html',
    'EpoAuth',
    'endpoint_tools',
    'JIC'
], function ($, _, Backbone, ProfileCollection, ProfileModel, TeachersCollection, TeacherModel, profileTemplate, teacherTemplate, topbarTemplate, topbarSmallTemplate, EpoAuth, endpoint_tools, jic) {

    var profile_fields_map = {
        'username': {find: '.user-name-input', type: 'text', default: ''},
        'origin': {find: '.user-home-input', type: 'text', default: ''},
        'school_name': {find: '.user-school-input', type: 'text', default: ''},
        'bio': {find: '.user-bio-input', type: 'text', default: ''},
        'first_name': {find: '.first-input', type: 'text', default: ''},
        'last_name': {find: '.surname-input', type: 'text', default: ''},
        'gender': {find: '[name=gender_gr]', type: 'group', find_save: '[name=gender_gr]:checked', default: 0},
        'account_type': {find: '[name=type_gr]', type: 'group', find_save: '[name=type_gr]:checked', default: 0},
        'avatar_descriptor': {find: '.selected-avatar', type: 'node-data', find_save: 'selected-avatar', default: 0},
        'avatar_type': {find: '.selected-avatar', type: 'node-data', find_save: 'avatar-type', default: 0}
    };

    var levels = [];
    $('#predefined-levels').children().each(function (idx, el){
        levels.push({
            "levelId": $(el).data('id'),
            "levelName": $(el).data('name')
        });
    });

    var subjects = [];
    $('#predefined-subjects').children().each(function (idx, el){
        subjects.push({
            "subjectId": $(el).data('id'),
            "subjectName": $(el).data('name')
        });
    });

    var teachersCounter = 0;
    var profileModel;

    var ProfileEditView = Backbone.View.extend({
        el: $(".edit-profile-wrap"),
        initialize: function(options){
            this.router = options.app_router;
            //this.profileShowView = options.profileShowView;
            this.initButtons();

            this.teachersCollection = new TeachersCollection();

            var _this = this;

            this.listenTo(this, 'modelchange', function(event, option){
                _this.render();
            });

            this.listenTo(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                _this._initModel(data);
                //_this.trigger('modelchange');
            });

            EpoAuth.ping();

        },
        render: function (){
            var _this = this;
            if(profileModel !== undefined){
                var profileM = profileModel.at(0);
                _.each(profile_fields_map, function(value, key) {
                    if(value.type == 'text') {
                        _this.$el.find(value.find).val(profileM.get(key));
                    }else if(value.type == 'node-data'){
                        //_this.$el.find(value.find).data()
                    }else{
                        var els = _this.$el.find(value.find);
                        els.each(function(){
                            if($(this).val() == profileM.get(key)){
                                this.checked = true;
                            }else {
                                this.checked = false;
                            }
                        });
                    }
                });
                _this._loadUserImage(profileM.get('endpoints').file_store.preview_file, profileM.get('avatar_descriptor'), profileM.get('avatar_type'));
                _this._refreshAccountData();
                _this._refreshTeachersView();
            }
        },
        buildForm: function(){
            var form = new FormData();
            var _this = this;
            _.each(profile_fields_map, function(value, key){
                if(value.type == 'node-data'){
                    form.append(key, _this.$el.find(value.find).data(value.find_save) || value.default);
                }else {
                    form.append(key, _this.$el.find(value.find_save || value.find).val() || value.default);
                }
            });
            return form;
        },

        _loadUserImage: function(url, avatar_descriptor, avatar_type){
            var _this = this;
            var ph = this.$el.find('.selected-avatar');
            ph.data('avatar-type', avatar_type);
            ph.data('selected-avatar', avatar_descriptor);
            if(avatar_type == 1) {
                var img = this.$el.find('.avatar[data-uuid="'+ avatar_descriptor+'"]');
                ph.css('background-image', img.css('background-image'));
            }else if(avatar_type == 2){
                var url = 'url(' + endpoint_tools.replaceUrlArgs(url, {descriptor: avatar_descriptor}) + ')';
                ph.css('background-image', url);

                if (_this.$el.find('.avatar-image[data-avatarid="7"]').length == 0) {
                    var addAvatarEl = _this.$el.find('.avatar-image[data-avatarid="8"]');
                    var custom = $('<div class="avatar-image" data-avatarid="7"><div class="avatar"></div></div>');
                    custom.insertBefore(addAvatarEl);
                    custom.on("click", function(event){
                        var avatarId = $(event.currentTarget).data('avatarid');
                        if (avatarId !== undefined && avatarId < 8) {
                            var imageUrl = $(event.currentTarget).find('.avatar').css('background-image');
                            var selA = _this.$el.find('.selected-avatar');
                            selA.css("background-image",imageUrl);
                            var uuid;
                            if ($(event.currentTarget).find('.avatar').data('uuid') !== undefined) {
                                uuid = $(event.currentTarget).find('.avatar').data('uuid');
                            } else {
                                uuid = 'custom';
                            }
                            selA.data('selected-avatar', uuid );
                            if(avatarId < 7){
                                selA.data('avatar-type', 1);
                            }else{
                                selA.data('avatar-type', 2);
                            }
                        }
                    });
                }

                var customAvatar = _this.$el.find('.avatar-image[data-avatarid="7"]').find('.avatar');
                customAvatar.data('uuid', avatar_descriptor);
                customAvatar.css('background-image', url);
            }
        },

        _getLevelName: function(id){
            var levelName;
            _.each(levels, function( el ){
                if(el.levelId == id){
                    levelName = el.levelName;
                }
            });
            return levelName;
        },

        _getSubjectName: function(id){
            var subjectName;
            _.each(subjects, function( el ){
                if(el.subjectId == id){
                    subjectName = el.subjectName;
                }
            });
            return subjectName;
        },

        _refreshTeachersView: function(){
//            var _this = this;
//            _this.$el.find('.teachers-list').empty();
//            teachersCounter = 0;
//            _this.teachersCollection.forEach(function(teacherObj){
//                teachersCounter += 1;
//                var newTeacherHtml = _.template(teacherTemplate, {
//                    level: _this._getLevelName(teacherObj.get('level_id')),
//                    levelList: levels,
//                    subject: _this._getSubjectName(teacherObj.get('subject_id')),
//                    subjectList: subjects,
//                    email: teacherObj.get('email'),
//                    id: teachersCounter
//                });
//
//                _this.$el.find('.teachers-list').append(newTeacherHtml);
//            });
        },

        _initModel: function(data){
            profileModel = new ProfileCollection(data);
            var _this = this;
//            var listUrl = profileModel.at(0).get('endpoints').user_teacher.list;
//            EpoAuth.apiRequest("GET", listUrl, null, function(data){
//                _this.teachersCollection.reset();
//                _.each(data, function(teacherObj){
//                    _this.teachersCollection.push(teacherObj);
//                });
//                _this.trigger('modelchange');
//            }, function(){});
        },

        _refreshAccountData: function() {

            this.$el.find('.account-edit-button').text('edytuj');

            this.$el.find('.account-field').addClass('disabled-field');
            this.$el.find('.account-field').prop('disabled', true);

            this.$el.find('.gender-group').hide();
            this.$el.find('.gender-input').show();

            this.$el.find('.type-group').hide();
            this.$el.find('.account-type-input').show();

            this.$el.find('.gender-input').val(this.$el.find('input[name=gender_gr]:checked').data('present-value'));
            this.$el.find('.account-type-input').val(this.$el.find('input[name=type_gr]:checked').data('present-value'));
        },

        _updateModel: function() {
            var _this = this;
            var profileM = profileModel.at(0);
            _.each(profile_fields_map, function(value, key){
                if(value.type == 'node-data'){
                    profileM.set(key, _this.$el.find(value.find).data(value.find_save) || value.default);
                }else {
                    profileM.set(key, _this.$el.find(value.find_save || value.find).val() || value.default);
                }
            });
            this.trigger('modelchange');
        },

        goBackToLastView: function() {
            this.$el.slideUp();
            $('.user-bar').slideDown();
            Backbone.history.loadUrl(Backbone.history.fragment);
        },

        initButtons: function() {
            var _this = this;
            this.$el.find('.cancel-button').click(function(e){
                _this.$el.hide();
                //_this.profileShowView.show();
                _this.goBackToLastView();
                return true;
            });
            this.$el.find('.edit-profile-button').click(function(e){
                var selectedAvatar = _this.$el.find('.selected-avatar');
                var avatarType = selectedAvatar.data('avatar-type');
                if(avatarType == null || avatarType == 1 || avatarType == 0){
                    _this._updateModel();
                    var form = _this.buildForm();
                    EpoAuth.apiPostFormRequest(EpoAuth.updateEndpoint, form, function(){
                        _this._refreshTeachersView();
                    }, function(){});
                }else if(avatarType == 2){
                    _this.saveImage(localStorage.avatar, 'custom_avatar', null, function(data){
                        if(data.status == "success"){

                            var oldDescriptor = _this.$el.find('.avatar-image[data-avatarid="7"]').find('.avatar').data('uuid');
                            if(oldDescriptor != undefined){
                                var saveUrl = profileModel.at(0).get('endpoints').file_store.save_file_descriptor;
                                var deleteurl = endpoint_tools.replaceUrlArgs(saveUrl, {descriptor: oldDescriptor});
                                EpoAuth.apiRequest("DELETE", deleteurl, null, function(){}, function(){});
                            }

                            var descriptor = data.data.descriptor;
                            _this.$el.find('.avatar-image[data-avatarid="7"]').find('.avatar').data('uuid', descriptor);
                            selectedAvatar.data('selected-avatar', descriptor);
                            selectedAvatar.data('avatar-type', 2);
                            _this._updateModel();
                            var form = _this.buildForm();
                            EpoAuth.apiPostFormRequest(EpoAuth.updateEndpoint, form, function(){
                                _this._refreshTeachersView();
                            }, function(){});
                        }
                    });
                }

                _this.$el.hide();
                _this.trigger("profileChanged", { profileModel: profileModel.at(0) });
                _this.goBackToLastView();
                return true;
            });

            this.$el.find('.account-edit-button').click(function(ev){
                //if ($(event.currentTarget).text() == "edytuj") {
                    //$(event.currentTarget).text('ustaw');
                    $(ev.currentTarget).text('');
                    _this.$el.find('.account-field').removeClass('disabled-field');
                    _this.$el.find('.account-field').prop('disabled', false);

                    _this.$el.find('.gender-group').show();
                    _this.$el.find('.gender-input').hide();

                    _this.$el.find('.type-group').show();
                    _this.$el.find('.account-type-input').hide();


                //} else if ($(event.currentTarget).text() == 'ustaw') {
                //    $(event.currentTarget).text('edytuj');
                //    _this._refreshAccountData();
                //}

                return true;
            });
            /*
            // for now teacher functions are disabled

            this.$el.find('#teacher_level_select').on('change', function(ev){
                var selectedLevel = _this.$el.find('#teacher_level_select option:selected').val();

                if (selectedLevel != 'select_level') {
                    _this.$el.find('#teacher_subject_select').show();

                } else {
                    _this.$el.find('#teacher_subject_select option[value=select_subject]').attr('selected', 'selected');
                    _this.$el.find('#teacher_subject_select').hide();
                    _this.$el.find('#new-teacher-email').val('');
                    _this.$el.find('#new-teacher-email').hide();
                    _this.$el.find('.teacher-buttons-box').hide();
                }

            });

            this.$el.find('#teacher_subject_select').on('change', function(ev){
                var selectedSubject = _this.$el.find('#teacher_subject_select option:selected').val();

                if  (selectedSubject != 'select_subject') {
                    _this.$el.find('.new-teacher-email').show();
                    _this.$el.find('.teacher-buttons-box').show();
                } else {
                    _this.$el.find('.new-teacher-email').hide();
                    _this.$el.find('.teacher-buttons-box').hide();
                }

            });

            this.$el.find('.add-teacher-button').click(function (ev){
                ev.preventDefault();

                var level = _this.$el.find('#teacher_level_select').val();
                var subject = _this.$el.find('#teacher_subject_select').val();
                var teachersEmail = _this.$el.find('#new-teacher-email').val();

                var canAddNew = true;
                _this.teachersCollection.forEach(function(model){
                    if((model.get('level_id') == level) && (model.get('subject_id') == subject)){
                        canAddNew = false;
                        return;
                    }
                });
                var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if(canAddNew == false){
                    alert(" Nauczyciel dla tego poziomu nauczania oraz przedmiotu już istnieje ! ");
                    ev.stopImmediatePropagation();
                    return false;
                }else if(!emailFilter.test(teachersEmail)) {
                    alert(" Niepoprawny adres email ! ");
                    ev.stopImmediatePropagation();
                    return false;
                } else {
                    var teacherObj = {
                        level_id: level,
                        subject_id: subject,
                        email: teachersEmail
                    };
                    _this.teachersCollection.push(teacherObj);

                    var selectedLevel = _this.$el.find('#teacher_level_select option:selected').text();
                    var selectedSubject = _this.$el.find('#teacher_subject_select option:selected').text();

                    _this.$el.find('.new-teacher').hide();
                    _this.$el.find('.add-subject').removeClass('disabled-buttons');
                    _this.$el.find('.add-subject').on("click", addLevelShow);

                    //_this.$el.find('.level-select-box').height(teacherBoxHeight);
                    _this.$el.find('#teacher_level_select option[value=select_level]').attr('selected', 'selected');
                    _this.$el.find('#teacher_subject_select option[value=select_subject]').attr('selected', 'selected');
                    _this.$el.find('#teacher_subject_select').hide();
                    _this.$el.find('#new-teacher-email').val('');
                    _this.$el.find('#new-teacher-email').hide();
                    _this.$el.find('.teacher-buttons-box').hide();

                    //console.log(" saving teacher object: ", teacherObj);
                    var update_url = profileModel.at(0).get('endpoints').user_teacher.update;
                    EpoAuth.apiPostFormRequest(update_url, JSON.stringify(teacherObj), function(){
                        _this._refreshTeachersView();
                    }, function(){});

                    ev.stopImmediatePropagation();
                    return false;
                }
            });

            this.$el.find('.teachers-list').on('click', '.teachers-edit-button', function(ev){
                var editButton = $(ev.currentTarget);
                var teacherId = editButton.data('id');
                _this.$el.find('#edit_teacher_'+teacherId).show();
                editButton.parent().hide();
                editButton.parent().next().hide();

            });

            this.$el.find('.teachers-list').on('click', '.close-edit-teacher', function(ev){
                var closeEditButton = $(ev.currentTarget);
                var teacherId = closeEditButton.data('id');
                _this.$el.find('#edit_teacher_'+teacherId).hide();
                _this.$el.find('#teacher_view_'+teacherId).show();
                _this.$el.find('#teacher_view_'+teacherId).next().show();
            });

            this.$el.find('.teachers-list').on('click', '.remove-teacher-button', function(ev){
                var removeTeacherButton = $(ev.currentTarget);
                var teacherId = removeTeacherButton.data('id');

                //var level = _this.$el.find('#teacher_level_select_'+teacherId).val();
                //var subject = _this.$el.find('#teacher_subject_select_'+teacherId).val();
                //var teacher = _this.teachersCollection.find(function(teacher) {
                //    return (teacher.get('level_id') == level) && (teacher.get('subject_id') == subject);
                //});

                var teacher = _this.teachersCollection.at(teacherId-1);
                var level = teacher.get('level_id');
                var subject = teacher.get('subject_id');

                //console.log(" Removing teacher :", level, subject);
                var deleteUrl = profileModel.at(0).get('endpoints').user_teacher.delete;
                EpoAuth.apiRequest("DELETE", deleteUrl, JSON.stringify({
                    level_id: level,
                    subject_id: subject
                }), function(){
                    _this.teachersCollection.remove(teacher);
                    _this._refreshTeachersView();
                }, function(){
                    alert(" Błąd usuwania nauczyciela ! ")
                });
            });

            function updatingTeacher(level, subject, email) {
                //console.log(" updating ", level, subject);
                var teacherObj = {
                    level_id: level,
                    subject_id: subject,
                    email: email
                };
                var update_url = profileModel.at(0).get('endpoints').user_teacher.update;
                EpoAuth.apiPostFormRequest(update_url, JSON.stringify(teacherObj), function(){
                    _this._refreshTeachersView();
                }, function(){});
            }

            this.$el.find('.teachers-list').on('click', '.save-teacher-button', function(ev){
                var saveTeacherButton = $(ev.currentTarget);
                var teacherId = saveTeacherButton.data('id');

                var selectedLevel = _this.$el.find('#teacher_level_select_'+teacherId+' option:selected').text();
                var selectedSubject = _this.$el.find('#teacher_subject_select_'+teacherId+' option:selected').text();
                var teachersEmail = _this.$el.find('#teacher_email_'+teacherId).val();

                var level = _this.$el.find('#teacher_level_select_'+teacherId).val();
                var subject = _this.$el.find('#teacher_subject_select_'+teacherId).val();

                var teacher = _this.teachersCollection.at(teacherId - 1);
                var prevLevel = teacher.get('level_id');
                var prevSubject = teacher.get('subject_id');
                var teacherObj = {
                    level_id: level,
                    subject_id: subject,
                    email: teachersEmail
                };

                var canUpdate = true;
                _this.teachersCollection.forEach(function(model, index){
                    index += 1;
                    if(index != teacherId){
                        if((model.get('level_id') == level) && (model.get('subject_id') == subject)){
                            canUpdate = false;
                            return;
                        }
                    }
                });
                var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if(canUpdate == false) {
                    alert(" Nauczyciel dla tego poziomu nauczanie oraz przedmiotu już istnieje! ");
                    ev.stopImmediatePropagation();
                    return false;
                }else if(!emailFilter.test(teachersEmail)){
                    alert(" Niepoprawny adres email ! ");
                    ev.stopImmediatePropagation();
                    return false;
                }else{
                    if (prevLevel != level && prevSubject != subject) {
                        //console.log(" removing teacher before update :", prevLevel, prevSubject);
                        var deleteUrl = profileModel.at(0).get('endpoints').user_teacher.delete;
                        EpoAuth.apiRequest("DELETE", deleteUrl, JSON.stringify({
                            level_id: prevLevel,
                            subject_id: prevSubject
                        }), function(){
                            teacher.set(teacherObj);
                            updatingTeacher(level, subject, teachersEmail);
                        }, function(){});
                    } else {
                        teacher.set(teacherObj);
                        updatingTeacher(level, subject, teachersEmail);
                    }

                    _this.$el.find('#teacher_view_'+teacherId+' :first-child').text(selectedLevel + ' - ' + selectedSubject);
                    _this.$el.find('#teacher_view_'+teacherId).next().val(teachersEmail);

                    _this.$el.find('#edit_teacher_'+teacherId).hide();
                    _this.$el.find('#teacher_view_'+teacherId).show();
                    _this.$el.find('#teacher_view_'+teacherId).next().show();
                }
            });


            function addLevelShow(event){
                event.preventDefault();
                $(event.currentTarget).addClass('disabled-buttons');
                $(event.currentTarget).off("click");
                _this.$el.find('.new-teacher').show();
            }

            this.$el.find('.add-subject').on("click", addLevelShow);

            this.$el.find('.close-level-select').click(function(e){
                _this.$el.find('.new-teacher').hide();
                _this.$el.find('.add-subject').removeClass('disabled-buttons');
                _this.$el.find('.add-subject').on("click", addLevelShow);
            });
            */
            function avatarClickHandler(event) {
                var avatarId = $(event.currentTarget).data('avatarid');
                if (avatarId !== undefined && avatarId < 8) {
                    var imageUrl = $(event.currentTarget).find('.avatar').css('background-image');
                    var selA = _this.$el.find('.selected-avatar');
                    selA.css("background-image",imageUrl);
                    var uuid;
                    if ($(event.currentTarget).find('.avatar').data('uuid') !== undefined) {
                        uuid = $(event.currentTarget).find('.avatar').data('uuid');
                    } else {
                        uuid = 'custom';
                    }
                    selA.data('selected-avatar', uuid );
                    if(avatarId < 7){
                        selA.data('avatar-type', 1);
                    }else{
                        selA.data('avatar-type', 2);
                    }
                }
            }

            this.$el.find('.avatar-image').on("click", avatarClickHandler);

            this.$el.find('#avatarfile').on('change', function(ev){
                if (File && FileReader) {
                    var files = ev.target.files;
                    if (files && files.length) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var avatarSrc = e.target.result;

                            localStorage.setItem('avatar', avatarSrc);

                            _this.$el.find('.selected-avatar').css('background-image', 'url('+avatarSrc+')');
                            _this.$el.find('.selected-avatar').data('avatar-type', 2);

                            if (_this.$el.find('.avatar-image[data-avatarid="7"]').length == 0) {
                                var addAvatarEl = _this.$el.find('.avatar-image[data-avatarid="8"]');
                                var custom = $('<div class="avatar-image" data-avatarid="7"><div class="avatar"></div></div>');
                                custom.insertBefore(addAvatarEl);
                                custom.on("click", avatarClickHandler);
                            }
                            var customAvatar = _this.$el.find('.avatar-image[data-avatarid="7"]');
                            customAvatar.find('.avatar').css('background-image', 'url('+avatarSrc+')');
                        };

                        reader.readAsDataURL(files[0]);
                    }}
            });

        },

        saveImage: function (fileData, filename, descriptor, callback) {
            //this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(userData) {
                var endpoints = profileModel.at(0).get('endpoints');
                var url = (descriptor ? endpoints.file_store.save_file_descriptor : endpoints.file_store.save_file);
                if(descriptor){
                    url = endpoint_tools.replaceUrlArgs(url, {descriptor: descriptor});
                }
                var image = new Image();

                var headers = {};
                _.extend(headers, EpoAuth.getHeaders(), {'Accept': 'application/json'});

                image.onload = function () {
                    //adjust size
                    var maxWidth = 500;
                    var maxHeight = 500;
                    var size = {width: image.naturalWidth, height: image.naturalHeight};
                    if (image.naturalHeight > image.naturalWidth) {
                        if (image.naturalHeight > maxHeight) {
                            size = {};
                            size.height = maxHeight;
                            size.width = (image.naturalWidth / image.naturalHeight) * maxHeight;
                        }
                    }
                    if (image.naturalHeight <= image.naturalWidth) {
                        if (image.naturalWidth > maxWidth) {
                            size = {};
                            size.width = maxWidth;
                            size.height = (image.naturalHeight / image.naturalWidth) * maxWidth;
                        }
                    }

                    jic.compress(image, 85, undefined, function () {
                        jic.upload(this, url, 'file', filename, function (data) {
                            callback({
                                status: 'success',
                                data: JSON.parse(data)
                            });
                        }, function (errtext, status) {
                            if (status == 403) {
                                alert('Nie możesz zapisać więcej obrazków na swoim koncie, osiągnięto limit.')
                            }
                            callback({
                                status: 'failed',
                                httpCode: status
                            });
                        }, null, headers);
                    }, size);


                };
                image.src = fileData;
            //});
            //EpoAuth.ping();
        },

        hide: function(){
            this.$el.slideUp();
        }
    });

    return {
        ProfileEditView: ProfileEditView
    }
});
