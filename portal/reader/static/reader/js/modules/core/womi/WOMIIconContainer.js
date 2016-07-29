define(['./WOMIImageContainer'], function (WOMIImageContainer) {
    return WOMIImageContainer.extend({
        MEDIA_MAPPINGS: {
        },
        DEFAULT_MEDIA: '',
        _buildMediaUrl: function (root, entry) {
            return root;
        }
    });
});