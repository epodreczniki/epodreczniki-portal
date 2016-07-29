define([], function () {

        var isModuleFirstOrLast = function(moduleEl) {
        
            // this method takes current module, and from data-attribute-panorama-order
            // for sure, It will only work if this attribute has valid value.

            var currentModuleNumber = moduleEl.data('attribute-panorama-order'),
                size = moduleEl.closest('ul').find('a').length;

            return currentModuleNumber === 1 || currentModuleNumber === size;

        };

        var getParentsOfModule = function(moduleEl) {
        
            // this method returns array of two elements, both in GE logic about subcollections
            // [0] is top level parent
            // [1] is active-link parent

            var parentOfActive = getParentOfElement($(moduleEl));

            var topParent = getParentOfElement(parentOfActive);

            return [topParent, parentOfActive];

        };
    
        var getParentOfElement = function(element) {
        
            return $('#table-of-contents').find('[data-toc-path=' + element.data('toc-parent-path') + ']');

        };

        return {

            isModuleFirstOrLast: isModuleFirstOrLast,

            getParentsOfModule: getParentsOfModule,

            getParentOfElement: getParentOfElement

        }

});
