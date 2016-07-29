define([
    'jquery',
    'underscore',
    'backbone',
    'text!modules/kzd/templates/kzd_tile.html',
    'text!modules/kzd/templates/kzd_extended.html',
    'EpoAuth',
    'endpoint_tools'
], function(
    $,
    _,
    backbone,
    result_tile_template,
    kzd_extended_template,
    EpoAuth,
    endpoint_tools
) {

    return backbone.View.extend({

        result_tile: _.template(result_tile_template),
        kzd_extended: _.template(kzd_extended_template),

        className: 'result-item',

        tagName: 'li',

        events: {
            'click': 'showMore',
            'click .show-more-excerpt': 'showMoreExcerpt'
        },

        initialize: function(attrs, result) {
            this.result = _.extend({}, result, {imgUrl: ''});;
            var authors = this.result.authors;

            if (authors.length < 1) {
                this.result.authors = ''
            } else {
                this.result.authors = authors.map(function(obj) {
                    return obj.full_name;
                }).join(", ");
            };

            EpoAuth.connectEventObject(this);

            this.setKzdUrl();

            var eduLevelNames = [];
            var levels = this.result.attributes.educationLevels;
            for(i = 0; i < levels.length; i++) {
                eduLevelNames.push(this.getEduLevel(levels[i]));
            }
            this.result.nameEduLevel = eduLevelNames.join(', ');

            this.result.trunctAuthors = this.getTrunctAuthors(authors);
        },

        render: function() {
            var tooltipsyOpts = {
                className: 'base-tooltip-black',
                alignTo: 'element',
                offset: [0, 1]
            };

            this.result.attributes.trunctTitle = this.getTrunctDescripton(this.result.attributes.title, 80);

            this.$el.html(this.result_tile(this.result));

            this.getThumbnail(function(imgUrl) {
                this.$('.kzd-cover').css('background-image', 'url("' + imgUrl + '")');
                this.$('.kzd-cover img').attr('src', imgUrl);
            }.bind(this));

            this.result.attributes.educationLevels.forEach(function(lvl) {
                this.$('.kzd-education-level').append($('<div>', {
                    class: 'kzd-edu-level-marker',
                    'data-level': lvl,
                    'title': this.getEduLevel(lvl)
                }).tooltipsy(tooltipsyOpts));
            }, this);

            this.$('.kzd-education-level').append($('<div>', {
                class: 'kzd-subject',
                'data-subject': this.result.attributes.extended_category.replace(/ /g, "-"),
                'title': this.result.attributes.extended_category
            }).tooltipsy(tooltipsyOpts));

            return this;
        },

        getTrunctDescripton: function(desc, length, symbol) {
            if (desc.length > length) {
                return desc.substring(0, length).split(symbol||" ")
                       .slice(0, -1).join(symbol||" ") + " ..." ;
            } else {
                return desc;
            }
        },

        getTrunctAuthors: function(authors) {
            var names = authors.map(function(author) {
                return author.full_name;
            });
            var result  = names.reduce(function(memo, current, idx) {
                if (memo.length <= 10) {
                    memo += current + ' ';
                }
                return memo;
            }, '');

            if (authors.length > 1) {
                result += 'i inni'
            };
            return result;
        },

        setKzdUrl: function() {
            this.result.kzdUrl = "//www.{{ TOP_DOMAIN }}/preview/reader/w/" + this.result.identifier + '/v/' + this.result.version + '/aggregate';
        },

        getThumbnail: function (callback) {
            var id = this.result.attributes.thumbnail.id;
            var baseUrl = "//preview.{{ TOP_DOMAIN }}/content/womi/" + id;

            $.ajax({
                type: 'get',
                url: baseUrl + '/manifest.json',
                context: this,
                success: function(response) {
                    if (response.engine === 'image') {
                        var imgUrl = baseUrl + "/" + "classic-" + response.parameters.classic.resolution[1] + "." + this.getExt(response.parameters.classic.mimeType);
                        this.result.imgUrl = imgUrl;
                        callback(imgUrl);
                    }
                }
            });
        },

        getExt: function(mime){
            var mimes = {
                'image/jpeg': 'jpg',
                'image/pjpeg': 'jpg',
                'image/png': 'png',
                'image/svg+xml': 'svg',
                'image/svg': 'svg',
                'svg': 'svg'
            };
            return mimes[mime];
        },

        getEduLevel: function(level) {
            var edu = {
                'E1': 'Edukacja wczesnoszkolna',
                'E2': 'Edukacja podstawowa 4-6',
                'E3': 'Edukacja gimnazjalna',
                'E4': 'Edukacja ponadgimnazjalna'
            };
            return edu[level];
        },

        setProperHeight: function() {
            this.$el.removeAttr('style');
            this.$el.css('height', (this.$el.height() + this.$('.extended-kzd-description').outerHeight()));
        },

        showMore: function() {
            // Just clean all the bad stuff and opened dialogs
            if (!this.$el.hasClass('result-item-expanded')) {
                $('.result-item').removeAttr('style');
                $('.extended-kzd-description').remove();
                $('.result-item').removeClass('result-item-expanded');

                var $desc = this.createDescriptionElement(this.result.attributes.description);
                console.log("$desc", $desc);

                var div = $('<div>', {
                    class: 'extended-kzd-description',
                    html: this.kzd_extended(_.extend({}, this.result, {
                        description: $desc
                    }))
                });

                var _this = this;

                EpoAuth.once(EpoAuth.POSITIVE_PING, function(data){
                    if(_.indexOf(data.user_groups, 'kzd_editor') != -1){
                        var editBtn = div.find('.kzd-edit');
                        editBtn.show();
                        var attrs = {'womi_id': _this.result.identifier, 'womi_version': _this.result.version};
                        editBtn.attr('href', endpoint_tools.replaceUrlArgs($('#kzd-lister').data('edit-pattern'), attrs));
                    }
                });

                EpoAuth.ping();

                var kzdTags = $(div).find('.kzd-tags');
                this.result.attributes.keywords.forEach(function(keyword) {
                    var tag = $("<div>", {
                        class: 'kzd-tag',
                        text: keyword
                    });
                    kzdTags.append(tag);
                });


                this.$el.append(div);

                this.$el.addClass('result-item-expanded', 500, function() {
                    this.setProperHeight();
                }.bind(this));

                $('html,body').animate({
                    scrollTop: this.$el.offset().top - 50
                }, 'fast');

            }

        },

        createDescriptionElement: function(description) {
            var $para = $('<p>'),
                breakpoint = 230;

            if (description.length > breakpoint) {
                $para.html(description.substring(0, breakpoint) + "...");
                $para.append($('<div class="show-more-excerpt">Pokaż więcej</div>'));
            } else {
                $para.html(description);
            }

            return $para.html();
        },

        showMoreExcerpt: function(ev) {
            this.$('.show-more-excerpt').hide();
            this.$('p.kzd-description').html(this.result.attributes.description);
            this.setProperHeight();
        }

    });

});
