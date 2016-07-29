require(["jquery",
    "domReady",
    "modules/app/CollectionModelManager",
    "modules/view/TreeView",
    "modules/view/router/CollectionEditorRouter",
    "dateFormat",
    'velocity',
    'velocityui'], function ($, domReady, CollectionModelManager, TreeView, CollectionEditorRouter, dateFormat) {
    'use strict';

    domReady(function () {
        $("[data-toggle='tooltip']").tooltip();
        var collectionProps = CollectionModelManager.getProperties();
        collectionProps.clearTreeData();
        var router = new CollectionEditorRouter({model: collectionProps});
        var treeContainer = $('#editcoll-tree-container');
        var treeView = new TreeView({el: treeContainer, collection: collectionProps, router: router});
        Backbone.history.start({pushState: true});
    });
});
