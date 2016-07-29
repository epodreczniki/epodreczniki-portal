define(['backbone', 'modules/app/util/IdGenerator', 'dateFormat'], function (Backbone, IdGenerator, dateFormat) {
    var moduleId = new IdGenerator('n29389n23omwe9fm3894' + (new Date()), 'moduleid');
    var thisDate = new Date();
    var longDateFormat = 'yyyy-MM-dd HH:mm CET';
    return Backbone.Model.extend({
        defaults: {
            width: 16,
            height: 10,
            a: 10,
            currentState: null,
            currentBackground: null,
            propX: 16,
            propY: 9,
            gridVisible: true,
            buttonsVisible: true,
            metadata: {
                "document": [
                    {
                        "id": moduleId.getId(),
                        "module-id": moduleId.getId(),
                        "cnxml-version": "0.7",
                        "title": ["module"],
                        "metadata": [
                            {
                                "mdml-version": "0.5",
                                "content-id": [moduleId.getId()],
                                "repository": ["https://epodreczniki.pcss.pl/"],
                                "version": ["1"],
                                "created": [dateFormat.format.date(thisDate, longDateFormat)],
                                "revised": [dateFormat.format.date(thisDate, longDateFormat)],
                                "title": ["module"],
                                "language": ["pl"],
                                "license": [
                                    {"value": "CC BY 3.0", "url": "http://creativecommons.org/licenses/by/3.0/pl/legalcode"}
                                ],
                                "actors": [
                                    {
                                        "person": []
                                    }
                                ],
                                "e-textbook-module": [
                                    {
                                        "ep:version": "1.5",
                                        "ep:recipient": "student",
                                        "ep:content-status": "canon",
                                        "core-curriculum-entries": [
                                            {
                                                "core-curriculum-entry": []
                                            }
                                        ]
                                    }
                                ]}

                        ]}
                ]}
        },

        regenerateDefaults: function () {

            moduleId = new IdGenerator('n29389n23omwe9fm3894' + (new Date()), 'moduleid');
            thisDate = new Date();

            this.defaults = {
                width: 16,
                height: 10,
                a: 10,
                currentState: null,
                currentBackground: null,
                propX: 16,
                propY: 9,
                gridVisible: true,
            	buttonsVisible: true,
                metadata: {
                    "document": [
                        {
                            "id": moduleId.getId(),
                            "module-id": moduleId.getId(),
                            "cnxml-version": "0.7",
                            "title": ["module"],
                            "metadata": [
                                {
                                    "mdml-version": "0.5",
                                    "content-id": [moduleId.getId()],
                                    "repository": ["https://epodreczniki.pcss.pl/"],
                                    "version": ["1"],
                                    "created": [dateFormat.format.date(thisDate, longDateFormat)],
                                    "revised": [dateFormat.format.date(thisDate, longDateFormat)],
                                    "title": ["module"],
                                    "language": ["pl"],
                                    "license": [
                                        {"value": "CC BY 3.0", "url": "http://creativecommons.org/licenses/by/3.0/pl/legalcode"}
                                    ],
                                    "actors": [
                                        {
                                            "person": []
                                        }
                                    ],
                                    "e-textbook-module": [
                                        {
                                            "ep:version": "1.5",
                                            "ep:recipient": "student",
                                            "ep:content-status": "canon",
                                            "core-curriculum-entries": [
                                                {
                                                    "core-curriculum-entry": []
                                                }
                                            ]
                                        }
                                    ]}

                            ]}
                    ]}
            };
        },

        cssValues: function () {
            return {
                width: this.get('width') * this.get('a'),
                height: this.get('height') * this.get('a'),
                a: this.get('a')
            }
        },

        blacklist: ['currentState'],

        toJSON: function (options) {
            return _.omit(this.attributes, this.blacklist);
        },
        toExportedJSON: function (options) {
            return _.omit(this.attributes, this.blacklist.concat(['id', 'a', 'metadata']));
        }
    });
});
