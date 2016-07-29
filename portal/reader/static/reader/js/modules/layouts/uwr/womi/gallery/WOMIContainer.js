define(['modules/core/womi/gallery/WOMIContainer', './WOMIImageContainer', '../../../../core/womi/gallery/WOMIMovieContainer'
], function (WOMIContainer, WOMIImageContainer, WOMIMovieContainer) {

    var deviceDetection = require('device_detection');

    return WOMIContainer.extend({
        CLASS_MAPPINGS: function () {
            var registry = require('modules/core/Registry').get('womi');
            return {
                'dummy': registry.DummyContainer,
                'image-container': WOMIImageContainer,
                'movie-container': WOMIMovieContainer,
                'audio-container': registry.WOMIAudioContainer,
                'icon-container': registry.WOMIIconContainer,
                'attachment-container': registry.WOMIAttachmentContainer,
                'interactive-object-container': registry.WOMIInteractiveObjectContainer,
                'multiple': registry.MultipleWOMIContainer
            }
        }
    })
});