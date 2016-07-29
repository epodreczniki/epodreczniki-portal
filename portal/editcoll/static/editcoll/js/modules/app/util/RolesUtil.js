define(['declare', 'jquery'], function (declare, $) {
    return declare({
        'static': {
            getSelectOptionRole: function (roleValue, roleType, actors, organizations) {
                var _roleType = roleType;
                var _roleValue = roleValue;
                var roles;
                if( Object.prototype.toString.call( _roleValue ) === '[object Array]' ) {
                    roles = _roleValue;
                } else {
                    roles = _roleValue.split(' ');
                }
                var users = '';
                _.each(actors, function (actor) {
                    if (actor != "") {
                        var _actorid = actor.userid;
                        _.each(roles, function(r){
                            if (r == _actorid) {
                                users += actor.fullname + ", ";
                            }
                        });
                    }
                });

                _.each(organizations, function (organization) {
                    if (organization != "") {
                        var _userId = organization.userid;
                        _.each(roles, function(r){
                            if (r == _userId) {
                                users += organization.shortname + ", ";
                            }
                        });
                    }
                });

                var roleField = "Typ: " + _roleType + " | Użytkownicy: " + users;
                var _role = {
                    type: _roleType,
                    value: _roleValue
                }

                var roleOption = $('<option>', {
                    "value": _roleValue
                });
                roleOption.append(roleField);
                roleOption.data({"role": _role});
                return roleOption;
            }
        }
    });
});
