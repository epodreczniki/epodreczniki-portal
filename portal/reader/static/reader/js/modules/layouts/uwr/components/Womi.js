define([
    'jquery',
    'backbone',
    'modules/core/WomiManager',
    'layout',
    '../../Component',
    'underscore',
    'modules/core/Registry',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'layoutWomiPath/gallery/WOMIContainer',
    'layoutWomiPath/WOMIGalleryContainer',
    //womi classes to load
    'modules/core/womi/DummyContainer',
    'layoutWomiPath/WOMIImageContainer',
    'modules/core/womi/SplashscreenImageContainer',
    'modules/core/womi/WOMIIconContainer',
    'layoutWomiPath/WOMIMovieContainer',
    'layoutWomiPath/WOMIAudioContainer',
    'modules/core/womi/WOMIAttachmentContainer',
    'modules/core/womi/WOMIInteractiveObjectContainer',
    'modules/core/womi/MultipleWOMIContainer',
    //womi engines
    'modules/core/engines/AceEditorEngine',
    'modules/core/engines/AdobeEdgeEngine',
    'modules/core/engines/CustomLogicExerciseWomi',
    'modules/layouts/uwr/engines/GeneratedExerciseEngine',
    'modules/core/engines/GeogebraEngine',
    'modules/core/engines/PureHTMLEngine',
    'modules/core/engines/RaphaelWomiEngine',
    'modules/core/engines/SvgEditEngine',
    'modules/core/engines/SwiffyEngine',
    'modules/core/engines/WomiExerciseEngine',
    'modules/core/engines/Pano2VREngine',
    'modules/core/engines/AutonomicWomi',
    'modules/core/engines/WomiAggregate',
    'modules/core/engines/CPEngine'
], function ($, Backbone, womi, layout, Component, _, Registry, Logger, ReaderUtils, WOMIContainerGallery, WOMIGalleryContainer,//womis
             DummyContainer, WOMIImageContainer, SplashscreenImageContainer, WOMIIconContainer, WOMIMovieContainer, WOMIAudioContainer, WOMIAttachmentContainer, WOMIInteractiveObjectContainer, MultipleWOMIContainer, //engines
             AceEditorEngine, AdobeEdgeEngine, CustomLogicExerciseWomi, GeneratedExerciseEngine, GeogebraEngine, PureHTMLEngine, RaphaelWomiEngine, SvgEditEngine, SwiffyEngine, WomiExerciseEngine, Pano2VREngine, AutonomicWomi, WomiAggregate, CPEngine) {

    return Component.extend({
        name: 'WOMI',

        postInitialize: function (options) {

            this._galleryRegisters();
            //initialize womi processors
            var o = {
                DummyContainer: DummyContainer,
                WOMIImageContainer: WOMIImageContainer,
                SplashscreenImageContainer: SplashscreenImageContainer,
                WOMIMovieContainer: WOMIMovieContainer,
                WOMIAudioContainer: WOMIAudioContainer,
                WOMIIconContainer: WOMIIconContainer,
                WOMIAttachmentContainer: WOMIAttachmentContainer,
                WOMIInteractiveObjectContainer: WOMIInteractiveObjectContainer,
                MultipleWOMIContainer: MultipleWOMIContainer
            };
            Registry.set('womi', o);

            //initialize womi engines
            var e = {
                ace_editor: AceEditorEngine,
                processingjs_animation: AdobeEdgeEngine,
                edge_animation: AdobeEdgeEngine,
                custom_logic_exercise_womi: CustomLogicExerciseWomi,
                custom_womi: GeneratedExerciseEngine,
                ge_animation: GeneratedExerciseEngine,
                geogebra: GeogebraEngine,
                createjs_animation: PureHTMLEngine,
                raphael_womi: RaphaelWomiEngine,
                svg_editor: SvgEditEngine,
                swiffy: SwiffyEngine,
                womi_exercise_engine: WomiExerciseEngine,
                framed_html: PureHTMLEngine,
                pano2vr_engine: Pano2VREngine,
                autonomic_womi: AutonomicWomi,
                womi_aggregate: WomiAggregate,
                cp_engine: CPEngine
            };

            Registry.set('engines', e);

        },

        _galleryRegisters: function(){
            Registry.set('womiContainerGallery', WOMIContainerGallery);
            Registry.set('galleryContainer', WOMIGalleryContainer);
        },

        eventBlacklist: ['toggleWOMILicense', 'toggleWOMIAltText'],


        load: function () {
            var _this = this;
            this.listenTo(this._layout, 'moduleLoaded', function () {
                womi.load(function () {
                    //TODO: invent better load function in case of promise of all graphics loaded
                    setTimeout(function () {
                        _this.trigger('moduleWomiLoaded');
                        //womi.womiEventBus.trigger('toggleWOMILicense');
                    }, 2000);
                });
            });

            this.listenTo(womi.womiEventBus, 'all', function () {
                if(_.indexOf(_this.eventBlacklist, arguments[0]) < 0) {
                    _this.trigger.apply(_this, arguments);
                }
            });
        }

    });
});