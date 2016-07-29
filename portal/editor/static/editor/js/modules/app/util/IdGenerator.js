define(['declare', './md5'], function (declare, md5) {
    return declare({
        instance: {
            constructor: function (baseString, type) {
                this.baseString = baseString;
                this.timestamp = new Date();
                if (typeof type == 'undefined') {
                    this._generate();
                } else {
                    switch (type) {
                        case 'moduleid':
                            this._generate();
                            break;
                        case 'simple':
                            this._simpleGenerate();
                            break;
                        default:
                            this._id = this._getMD5(this.baseString);
                    }
                }
            },
            _getMD5: function (x) {
                return md5.md5(x);
            },

            _getBase64Cleaned: function (x) {
                return (btoa(x)).replace(/[\+\/=]/g, '');
            },

            _generate: function () {

                var x = this.baseString + this.timestamp.getTime();
                x = this._getMD5(x);
                x = this._getBase64Cleaned(x);
                this._id = 'i' + x.substring(0, 9);
            },

            _simpleGenerate: function () {
                var x = this.baseString + this.timestamp.getTime();
                x = this._getMD5(x);
                this._id = x.substr(0, 5);
            },

            getId: function () {
                return this._id;
            }
        }
    });
});
