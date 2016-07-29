require(['domReady',
         'jquery',
         'underscore',
         'backbone',
         'modules/123/ui/DetailsTabsView'
         ],function(domReady,$,_,Backbone, DetailsTabsView){
             domReady(function(){

                //  console.log('Beginning dom ready');
            	 var tabsContainer = $('.details123-tabs-container');
            	 var dtabsv = new DetailsTabsView({el: tabsContainer});

                $('[data-tab=details123-toc-tab]').click(); //set table of contents as active tab after page load

             });
         }
);
