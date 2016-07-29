define(['underscore'], function(_) {

    var getFieldName = function(field) {
        switch(field) {
            case "category": return "kategoria";
            case "extended_category": return "Kategoria";

            case "title": return "tytuł";
            case "author": return "autor";
            case "_id":
            case "identifier": return "identyfikator";
            case "created": return "data utworzenia";

            case "womi_type": return "typ womi";
            case "subject": return "przedmiot";
            case "educationLevels": return "Poziom nauczania";
        }
    };

    var getValueName = function(value) {
        switch(value) {
            case "module": return "moduły";
            case "womi": return "WOMI";
            case "collection": return "kolekcje";

            case "graphics": return "grafika";
            case "movie": return "film";
            case "sound": return "sound";
            case "interactive": return "interaktywne";
            case "icon": return "ikona";

            case "E1": return "edukacja wczesnoszkolna";
            case "E2": return "edukacja podstawowa 4-6";
            case "E3": return "edukacja gimnazjalna";
            case "E4": return "edukacja ponadgimnazjalna";

            default: return '„' + value + '”';
        }
    };

    var getSummaryFieldName = function(field) {
        switch(field) {
            case "category": return "";
            default: return getFieldName(field);
        }
    };

    var getSummaryString = function(field, value) {
        return "" + getSummaryFieldName(field) + " " + getValueName(value);
    };

    return {
        getFieldName: getFieldName,
        getValueName: getValueName,
        getSummaryString: getSummaryString
    }

});
