require(['jquery',
         'underscore',
         'backbone',
         'domReady',
         'modules/view/grid/Grid',
         'modules/view/toolbox/Toolbar',
         'modules/app/PropertiesManager',
         'modules/app/CacheManager',
         'modules/view/router/EditorRouter',
         'aci_plugin',
         'aci_tree',
         'blockUI',
         'dateFormat'], function ($, _, Backbone, domReady, Grid, Toolbox, PropertiesManager, CacheManager, EditorRouter) {
	'use strict';
    domReady(function () {
        var globalProps = PropertiesManager.getProperties();
        var cacheProps = CacheManager.getProperties();
        
        cacheProps.clearModel();
        
        var board = $('#board');
        board.addClass('add-left');
        var grid = new Grid({el: board, model: globalProps});
        grid.blocks.each(function (m) {m.destroy(); });
        
        new Toolbox({el: $('#toolbar'), model: globalProps, grid: grid, cache: cacheProps});
        
        var router = new EditorRouter({model: globalProps, grid: grid, cache: cacheProps});
        
        Backbone.history.start({pushState: true});
    });
});
