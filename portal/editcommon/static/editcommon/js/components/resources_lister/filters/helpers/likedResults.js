define([
    'jquery',
    'underscore'
], function(
    $,
    _
) {

    var getLiked = function() {
        var likedList = localStorage["epo.edit.liked"];
        return (likedList) ? JSON.parse(likedList) : []; 
    };

    var setLiked = function(id) {
        var likedList = getLiked();
        likedList.push(id);
        saveLiked(likedList);
    };

    var saveLiked = function(likedList) {
        localStorage["epo.edit.liked"] = JSON.stringify(_.uniq(likedList));
    };

    var removeLiked = function(id) {
        var likedList = getLiked(),
            index = likedList.indexOf(id);
        if (index > -1) {
            likedList.splice(index, 1);
            saveLiked(likedList);
        }
    };

    return {
        get: getLiked,
        set: setLiked,
        remove: removeLiked
    }

})
