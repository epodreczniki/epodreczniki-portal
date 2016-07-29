define(['./WOMIImageContainer'], function (WOMIImageContainer) {
    return WOMIImageContainer.extend({
        MEDIA_MAPPINGS: {
            '1920': '(min-width: 100px)'
        },
        DEFAULT_MEDIA: 1920
    });
});