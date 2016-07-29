define(['declare',
    "text!modules/predefined_layouts/siatka_2kolumny.json",
    "text!modules/predefined_layouts/siatka_2komorki_kolumna.json",
    "text!modules/predefined_layouts/siatka_2komorki_wiersz.json",
    "text!modules/predefined_layouts/siatka_3kolumny.json",
    "text!modules/predefined_layouts/siatka_4komorki.json",
    "text!modules/predefined_layouts/siatka_kolumna_2komorki.json",
    "text!modules/predefined_layouts/siatka_kolumnaSzeroka_kolumnaWaska.json",
    "text!modules/predefined_layouts/siatka_kolumnaWaska_kolumnaSzeroka.json",
    "text!modules/predefined_layouts/siatka_wiersz_2komorki.json",
    "text!modules/predefined_layouts/siatka_wiersz_3komorki.json"

], function (declare, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10) {
    var TEMPLATES = {
        "1": v1,
        "2": v2,
        "3": v3,
        "4": v4,
        "5": v5,
        "6": v6,
        "7": v7,
        "8": v8,
        "9": v9,
        "10": v10
    };

    return new (declare({
        'instance': {
            BASE_DIR: 'modules/predefined_layouts/',

            TEMPLATE_MAPPINGS: {
                "1": "siatka_2kolumny",
                "2": "siatka_2komorki_kolumna",
                "3": "siatka_2komorki_wiersz",
                "4": "siatka_3kolumny",
                "5": "siatka_4komorki",
                "6": "siatka_kolumna_2komorki",
                "7": "siatka_kolumnaSzeroka_kolumnaWaska",
                "8": "siatka_kolumnaWaska_kolumnaSzeroka",
                "9": "siatka_wiersz_2komorki",
                "10": "siatka_wiersz_3komorki"
            },

            constructor: function (options) {
                this._super(arguments);
                this.TEMPLATES_MAP = this.makeTemplates();
            },
            makeRequire: function (name) {
                return require('text!' + this.BASE_DIR + name + '.json');
            },
            makeTemplates: function () {
                return TEMPLATES;
            },

            getTemplateById: function (id) {
                return this.TEMPLATES_MAP[id];
            }
        }
    }))();
});
