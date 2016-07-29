define(['modules/core/womi/WOMIContainer', 'modules/core/Registry', './WOMIImageContainer', './WOMIMovieContainer'
], function (WOMIContainer, Registry, WOMIImageContainer, WOMIMovieContainer) {

    var deviceDetection = require('device_detection');

    return WOMIContainer.extend({
        CLASS_MAPPINGS: function () {
            var registry = Registry.get('womi');
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
        },

        overrideClasses: function(){
            this.off('resize');
            this.on('changeSize', function(size){
                this.selected.object.trigger('changeSize', size);
            });

            this.on('galleryFullscreenClose', function(size){
                this.selected.object.trigger('changeSize', size);
            });

            if(this.selected && this.selected.object){
                _.extend(this.selected.object, (this.CLASS_MAPPINGS()[this.selected.object.containerClass]).prototype);
            }

            this.selected.object.applyNewPrototype && this.selected.object.applyNewPrototype();
        },
        _licenseItem: function () {
            return null;
        },
        render: function(){
            this.galleryParams = this.galleryParams || {};
            this.overrideClasses();

            var selectedEl = this.selected.object.render();
            var container = this._mainContainerElement;
            container.html('');
            container.append(selectedEl);

            var menu = this._renderMenu();
            container.append(menu);


            this.selected.object.trigger('renderDone');
        }
    })
});