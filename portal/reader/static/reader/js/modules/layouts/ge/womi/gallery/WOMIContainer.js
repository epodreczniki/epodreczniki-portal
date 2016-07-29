define(['modules/core/womi/gallery/WOMIContainer', './WOMIImageContainer'
], function (WOMIContainer, WOMIImageContainer) {

    var deviceDetection = require('device_detection');

    return WOMIContainer.extend({
        CLASS_MAPPINGS: function () {
            var registry = require('modules/core/Registry').get('womi');
            return {
                'dummy': registry.DummyContainer,
                'image-container': WOMIImageContainer,
                'movie-container': registry.WOMIMovieContainer,
                'audio-container': registry.WOMIAudioContainer,
                'icon-container': registry.WOMIIconContainer,
                'attachment-container': registry.WOMIAttachmentContainer,
                'interactive-object-container': registry.WOMIInteractiveObjectContainer,
                'multiple': registry.MultipleWOMIContainer
            }
        },

        getDefaultSize: function(){
            var selected = this.selected.object;
            if(selected && selected.imageOriginalSize){
                return selected.imageOriginalSize();
            }else {
                return {
                    width: 100,
                    height: 100
                }
            }
        },

        _altTextItem: function(){
            return {
                name: 'alttext1',
                callback: function(){
                }
            }
        }
    })
});