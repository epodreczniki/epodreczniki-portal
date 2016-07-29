require([
    'domReady',
    'jquery',
    'modules/navigation/sections/Section',
    'modules/navigation/sections/ClassSection',
    'modules/navigation/misc/subjectColoring',
    'modules/search/searchRoutines',
    'modules/admin_messages'],
    function (domReady, $, Section, ClassSection, subjectColoring, searchRoutines, adminMessages) {

        domReady(function () {

            var s = new Section('school-selection');
            var sections = $("[data-section-id]");
            var classSections = [];
            //new ClassSection('subject-selection');
            var allowScroll = false;
            sections.each(function (index, value) {
                var sectionId = $(value).data('section-id');
                if (sectionId != 'school-selection') {

                    if (sectionId != 'subject-selection') {
                        var cs = new ClassSection(sectionId);
                        classSections.push(cs);
                        if (cs.hasSomethingActive()) {
                            cs.quickHide();
                            cs.sectionNode.show();
                            if (cs.hasPhoneWidth()) {
                                allowScroll = true;
                            }
                        }
                    }
                    if (sectionId == 'subject-selection') {
                        var sec = new ClassSection(sectionId);
                        if (sec.hasSomethingActive()) {
                            sec.quickHide();
                            sec.sectionNode.show();
                            allowScroll = true;
                        } else {
                            sec.hide = function () {
                            };
                        }
                    }
                }
            });

            if (s.hasSomethingActive()) {
                s.hide();
                s.collapsed = true;
                if (s.hasPhoneWidth()) {
                    allowScroll = true;
                }
            }

            if (allowScroll) {
                //scrollToContent();
            }

            s.onSelected = function (obj, id) {
                s.currentSection = id;
                classSections.forEach(function (value) {

                    if (value.sectionName == id) {
                        value.showSection();
                    }
                });
            };
            s.onOpen = function () {
                classSections.forEach(function (value) {
                    value.hideSection();
                });
            };
            s.onClose = function () {
                classSections.forEach(function (value) {
                    if (value.sectionName == s.currentSection) {
                        value.showSection();
                    }
                });
            };

        });

        searchRoutines();

        subjectColoring();

        adminMessages();
    });
