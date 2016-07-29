define(['jquery',
    'modules/core/WomiManager',
    'layout',
    'modules/random_exercise',
    'bowser',
    'modules/core/Registry',
    'modules/core/ReaderKernel',
    'modules/layouts/default/DefaultLayout',
    'modules/utils/ReaderUtils'], function ($, womi, layout, randomExercise, bowser, Registry, ReaderKernel, DefaultLayout, Utils) {
    'use strict';

    var HIGHLIGHT_TIME = 2500;

    var kernel = Registry.get('kernel');

    var defaultLayout = Registry.get('layout');


    $(document).ready(function () {

        kernel.on('moduleLoaded', function () {
            randomExercise.loadRandomExercises();
        });

        kernel.run();

        Utils.setValidDomain();

    });

//    return {
//        goToPrevOrNextModule: _.bind(defaultLayout.components.bottombar.goToPrevOrNextModule, defaultLayout.components.toc)
//    };

});
