define(['underscore',
        'backbone'],

        function(_, backbone, crossword_body, crossword_row) {
        
            'user strict';

            return backbone.View.extend({
            
                className: 'cross-word-exercise',

                initialize: function(options) {
                    this.options = options || {};
                    
                },

                greeting: function(name) {
                }

            });
        
        }
);
