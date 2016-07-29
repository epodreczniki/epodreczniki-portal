define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth',
    './main_notes',
    './main_readings',
    './main_progress',
    './main_stats',
    './profile',
    'text!../templates/topbar/profile_topbar_small.html',
    'text!../templates/topbar/profile_topbar.html',
    'text!../templates/profile/overlay.html',
    'endpoint_tools'
], function(
    $,
    _,
    Backbone,
    EpoAuth,
    MainNotesView,
    MainReadingsView,
    MainProgressView,
    MainStatsView,
    profile,
    topbar_small_template,
    topbar_template,
    profile_overlay_template,
    endpoint_tools
) {

    return Backbone.View.extend({
        el: $(".user-bar"),

        events: {
            'click .user-photo,.user-name,.user-email': 'showSettings'
        },

        initialize: function(opts) {
            this.router = opts.router

            this.showOverlay();

            this.createAllViews();

            this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function (data) {
                this.apiData = data;
                this.hideOverlay();
                this.setProfileData(data);
                Backbone.history.start();
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PING PING");
            });

            this.profileEditView = new profile.ProfileEditView({app_router: this.router});

            this.listenTo(this.profileEditView, 'profileChanged', function(opts){
                this.updateProfileData(opts.profileModel);
            });

            this.listenToOnce(EpoAuth, EpoAuth.NEGATIVE_PING, function () {
                setTimeout(function() {
                    window.location = EpoAuth.fromLoginToProfile();
                }, 5000);
            });

            this.listenTo(this, 'showView', this.showView);
        },

        overlayId: 'profile-overlay',

        showOverlay: function() {
            var loginPage = EpoAuth.fromLoginToProfile(),
                start = $('a.logo').attr('href');

            var $overlay = $('<div>', {
                id: this.overlayId,
                html: _.template(profile_overlay_template)({
                    url: loginPage,
                    start: start
                })
            });

            $('body').append($overlay);
            $('body').addClass('no-scroll');
        },

        hideOverlay: function() {
            $("#" + this.overlayId).remove();
            $('body').removeClass('no-scroll');
            $('.edit-profile-wrap').hide();

            $(window).resize(_.debounce(function(){
                this.render();
                this.setProfileData(this.apiData);
            }.bind(this), 500));
        },

        createAllViews: function(data) {
            var opts = { cntrlr: this };
            this.subViews = {
                statsView: new MainStatsView(opts),
                notesView: new MainNotesView(opts),
                readingsView: new MainReadingsView(opts),
                progressView: new MainProgressView(opts)
            };

            EpoAuth.ping();
        },

        showView: function(view) {
            $('.profile-content-wrap').removeClass('visible');
            this.subViews[view].render();
        },

        render: function() {
            var version = ($(window).width() < 660) ? topbar_small_template : topbar_template;
            this.$el.html(_.template(version)());

            return this;
        },

        setProfileData: function(data) {
            this.$('.user-name').text(data.first_name + ' ' + data.last_name);
            this.$('.user-email').text(data.email);
            
            var url = null;
            if(data.avatar_type == 1) {
                var img = $('.avatar[data-uuid="'+ data.avatar_descriptor+'"]');
                url = img.css('background-image');
                url = url.replace('url(','').replace(')','');
            }else if(data.avatar_type == 2) {
                url = endpoint_tools.replaceUrlArgs(data.endpoints.file_store.preview_file, {descriptor: data.avatar_descriptor});
            }
            if (url !== null && url !== undefined) {
                url = url.replace(/"/g, "");
                this.$('.user-photo').find('img').attr('src', url);
            }
        },

        updateProfileData: function(profileModel) {
            this.$('.user-name').text(profileModel.get('first_name') + ' ' + profileModel.get('last_name'));
            this.$('.user-email').text(profileModel.get('email'));
            var url = null;
            if(profileModel.get('avatar_type') == 1) {
                var img = $('.avatar[data-uuid="'+ profileModel.get('avatar_descriptor')+'"]');
                url = img.css('background-image');
                url = url.replace('url(','').replace(')','');
            }else if(profileModel.get('avatar_type') == 2) {
                url = endpoint_tools.replaceUrlArgs(profileModel.get('endpoints').file_store.preview_file, {descriptor: profileModel.get('avatar_descriptor')});
            }
            if (url !== null && url !== undefined) {
                url = url.replace(/"/g, "");
                this.$('.user-photo').find('img').attr('src', url);
            }
            $('span.user-name').text(profileModel.get('username'));
        },

        showSettings: function() {
            this.$el.slideUp();
            $('.profile-content-wrap').removeClass('visible');
            $('.edit-profile-wrap').slideDown();
            //this.profileEditView = new profile.ProfileEditView({app_router: this.router});
            this.profileEditView.render();
        },

        hideSettings: function() {
            this.$el.hideSettings();
        }
    })

})
