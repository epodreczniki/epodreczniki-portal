require(['domReady', 'base_lister','operandScheme', 'EpoAuth', 'backbone'], function(domReady, BaseLister, oScheme, Auth, backbone) {
    
    domReady(function() {
        this.lister = new BaseLister({
            defaultFilter: {
                'field': 'purpose',
                'value': ['kzd'],
                'hidden': true
            },
            autoFilters: [
                {
                    'field': 'educationLevels',
                    'value': [],
                    'mode': 'exact',
                    'static': true
                },
                {
                    'field': 'extended_category',
                    'value': [],
                    'mode': 'exact',
                    'static': true
                }
            ],
            selectedItemAction: function(model) {
                console.log(model); 
            },
            // By default is setted to true.
            killAfterSelect: true,
            tilesView: true,
            saveMode: false,
            styleMode: 'kzd',
            resultFields: ['identifier', 'category', 'authors', 'attributes', 'keywords', 'purpose', 'extended_category', 'description'],
        });
        this.lister.render();

        //Auth.connectEventObject(this);
        Auth.connectToPage($('#topbar').find('.epo-auth-hook'));

        $('#kzd-lister').append(this.lister.$el);

        backbone.history.start();
    });

});
