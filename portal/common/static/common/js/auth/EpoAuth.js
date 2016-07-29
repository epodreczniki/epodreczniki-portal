{% load common_ext %}
define(['underscore', 'backbone', 'jquery', 'text!auth_login_template'], function (_, Backbone, $, login_template) {

    function buildRedirectPath(){
        var subdomain = window.location.hostname.split('.')[0];
        var pathname = window.location.pathname + window.location.hash;
        return '/' + subdomain + pathname;
    }

    var MINUTE = 60 * 1000;
    var POLLING_INTERVAL = 1 * MINUTE;

    function pollingUser() {
        instance.ping();
        setTimeout(pollingUser, POLLING_INTERVAL);
    }

    var EPO_READER_AUTH_ENABLE = ('{{ EPO_READER_AUTH_ENABLE }}' == 'True');

    var USE_SECURE = '{{ EPO_USERAPI_FORCE_SECURE }}' == 'True';

    function prepareSecureUrl(url){
        if(USE_SECURE){
            return 'https:' + url;
        }
        return url;
    }

    var user_fields = ['user', 'first_name', 'last_name', 'email', 'account_type', 'avatar_descriptor',
        'avatar_type', 'bio', 'gender', 'origin', 'school_name', 'endpoints', 'user_groups'];

    var Auth = Backbone.View.extend({

        //constants
        POSITIVE_LOGIN: 'positiveLogin',
        POSITIVE_PING: 'positivePing',
        NEGATIVE_PING: 'negativePing',
        NEGATIVE_LOGIN: 'negativeLogin',


        name: 'EpoAuth',
        pingEndpoint: '{% host_url "user" "auth.views.user_ping" %}',
        loginEndpoint: '{% host_url "user" "auth.views.epo_login" %}',
        logoutEndpoint: '{% host_url "user" "auth.views.epo_logout" %}',
        updateEndpoint: '{% host_url "user" "auth.views.update_user" %}',
        agreementEndpoint: '{% host_url "user" "auth.views.agreement" %}',
        profileEndpoint: '{% host_url "www" "front.views.profile" %}',

        initialize: function (options) {
            //Logger.log(this.pingEndpoint, this);

            this.authenticated = false;
            this.token = null;

            //this._ping = this.ping;
            //this.ping = _.debounce(_.bind(this._ping, this), MINUTE);

            this.pingLock = false;
        },

        connectEventObject: function (object) {
            this.on(this.POSITIVE_LOGIN, function (status) {
                object.trigger(this.POSITIVE_LOGIN, status);
            });
            this.on(this.POSITIVE_PING, function (status) {
                object.trigger(this.POSITIVE_PING, status);
            });
            this.on(this.NEGATIVE_LOGIN, function () {
                object.trigger(this.NEGATIVE_LOGIN);
            });
            this.on(this.NEGATIVE_PING, function () {
                object.trigger(this.NEGATIVE_PING);
            })
        },

        startPolling: function () {
            if (!this._started) {
                setTimeout(pollingUser, POLLING_INTERVAL);
                this._started = true;
            }
        },

        ping: function () {
            if (!EPO_READER_AUTH_ENABLE) {
                this.trigger(this.NEGATIVE_PING);
                return;
            }

            if (this.pingLock) {
                return;
            }
            if (this.pingTime && (this.pingTime + MINUTE - 1000) >= Date.now()) {
                if (this.authenticated) {
                    var _this = this;
                    this.trigger(this.POSITIVE_PING, (function() {
                        var new_obj = {username: _this.user};
                        _.each(user_fields, function (field) {
                            new_obj[field] = _this[field]
                        });
                        return new_obj;
                    })());
                } else {
                    this.trigger(this.NEGATIVE_PING);
                }
                return;
            }
            //this.startPolling();
            this.pingLock = true;
            //setTimeout(_.bind(function() {
            $.ajax({
                url: prepareSecureUrl(this.pingEndpoint),
                type: 'GET',
                dataType: 'json',
                success: _.bind(function (data) {
                    //Logger.log(data, this, true);
                    if(data.authentication == 'negative'){
                        this.logout();
                    }else {
                        this._dispatch(data);
                        this.pingTime = Date.now();
                    }
                    this.pingLock = false;
                }, this),
                error: _.bind(function (jqXHR) {
                    if (jqXHR.status == 401) {
                        this.logout();
                    }
                    this.pingLock = false;
                }, this),
                xhrFields: {
                    withCredentials: true
                }
            });
        },

        cmpTkn: function (token) {
            return this.token === token;
        },

        checkAgreement: function(context){
            if(!context.agreement_accepted){
                window.location.href = prepareSecureUrl(this.agreementEndpoint) + '?next=' + buildRedirectPath();
                return false;
            }
            return true;
        },

        _dispatch: function (data) {
            if (data.authentication === 'positive') {
                var _data = _.clone(data.context);
                _data.user = _data.username;
                delete _data.access_token;

                _.extend(this, _data);
                if(!this.checkAgreement(data.context)){
                    return;
                }

                if (!this.authenticated) {
                    this.authenticated = true;
                    this.token = data.context.access_token;

                    this.trigger(this.POSITIVE_LOGIN, _data);
                    this.trigger(this.POSITIVE_PING, _data);
                } else if (this.authenticated && this.cmpTkn(data.context.access_token)) {
                    this.trigger(this.POSITIVE_PING, _data);
                }
//                this.user = data.context.username;
//                this.endpoints = data.context.endpoints;
            }
            if (data.authentication === 'negative') {
                this.logout();
            }
        },

        logout: function () {
            this.authenticated = false;
            this.token = null;
            this.trigger(this.NEGATIVE_LOGIN);
            this.trigger(this.NEGATIVE_PING);
        },

        apiRequest: function (type, url, data, callback, error) {
            var tkn = 'EPOTKN ' + this.token;
            $.ajax({
                url: url,
                type: type,
                data: data,
                dataType: 'json',
                success: callback,
                error: error || function () {
                },
                headers: {
                    'Authorization': tkn
                },
                xhrFields: {
                    withCredentials: true
                }
            });
        },

        apiPostFormRequest: function (url, formData, callback, error) {
            var tkn = 'EPOTKN ' + this.token;
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: callback,
                error: error || function () {
                },
                headers: {
                    'Authorization': tkn
                },
                xhrFields: {
                    withCredentials: true
                }
            });
        },

        getHeaders: function () {
            var tkn = 'EPOTKN ' + this.token;
            return {
                'Authorization': tkn
            }
        },

        _makeNodes: function (rootNode) {
            $(rootNode).html(_.template(login_template,
                    {
                        login_endpoint: prepareSecureUrl(this.loginEndpoint),
                        profile_endpoint: this.profileEndpoint
                        //logout_endpoint: prepareSecureUrl(this.logoutEndpoint)
                    }
                )
            );
            //var $loginBtn = $('#logout-hook .logout');
            var $logoutBtn = $('#logout-hook .logout');

            $logoutBtn.on('click', function() {
                 window.location.href = prepareSecureUrl(this.logoutEndpoint) + '?redirect_logout=' + buildRedirectPath();
            }.bind(this));
        },

        connectToPage: function (node, make) {
            make = (make === undefined ? true : make);

            make && this._makeNodes(node);

            var profileElement = $(node).find('.profile');
            var loginElement = $(node).find('.login');
            var logoutElement = $('.logout');

            if (make) {
//                profileElement.click(function () {
//                    return false;
//                });
            }

            this.once(this.POSITIVE_PING, function (data) {
                profileElement.find('.user-name').text(data.user);
                profileElement.show();
                loginElement.hide();
                logoutElement.show();
            });

            this.once(this.NEGATIVE_PING, _.bind(function (data) {
                profileElement.hide();
                loginElement.show();
                logoutElement.hide();
                if (make) {
                    loginElement.click(function (e) {
                        e.preventDefault();
                        loginElement.attr('href', loginElement.data('login-view') + '?next=' + buildRedirectPath());
                        window.location.href = loginElement.data('login-view') + '?next=' + buildRedirectPath();

                    });
                }

            }, this));
        },

        fromLoginToProfile: function() {
            return prepareSecureUrl(this.loginEndpoint) + "?next=" + buildRedirectPath()
        }


    });
    var instance = new Auth();
    return instance;
});
