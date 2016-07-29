define(['declare', './Section'], function (declare, Section) {
    return declare(Section, {
        instance: {

            _initVars: function () {
                Section.prototype._initVars.call(this);
                //this.collapsed = true;
                //this.currentSection = '';
                this.clickReturn = true;

            },
            toggle: function () {
                Section.prototype.toggle.call(this);
            },

            setSelected: function (sectionElement, text) {
                this.sections.forEach(function (value) {
                    value.resetActiveClass();
                });
                sectionElement.setActiveClass();

            }
        }
    });
});
