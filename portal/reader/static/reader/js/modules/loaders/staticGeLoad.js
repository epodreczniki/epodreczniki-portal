define(['modules/core/Registry',
    'modules/core/ReaderKernel',
    //'modules/layouts/ge/geConfigLoader',
    'modules/layouts/ge/GeLayout',
    'modules/layouts/ge/components/Topbar',
    'jquery',
    'modules/utils/ReaderUtils',
    'modules/core/engines/GEAnimation',
    'modules/core/womi/WOMIMovieContainer',
    'modules/core/womi/WOMIAudioContainer',
    'libs/avplayer/player.ext'
], function (Registry, ReaderKernel, DefaultLayout, Topbar, jquery, Utils, GEAnimation, MovieContainer, AudioContainer, player) {

    if (!Registry.get('kernel')) {
        var kernel = new ReaderKernel();
        Registry.set('kernel', kernel);

        kernel.once('moduleLoaded', function(state){
            kernel.trigger('loadModule', {
                href: state.href,
                module_id: jquery(state.moduleElement).data('module-id'),
                ajaxUrl: jquery(state.moduleElement).data('ajax-url')

            });
        });

        jquery('.module-a').each(function(){
            jquery(this).attr('href', '#');
        });

        //remove some topbar elements
        jquery('.additional-navigation-buttons').remove();
        jquery('#search-btn').remove();
        jquery('#help-btn').remove();
        jquery('.contact-form-trigger').remove();
        jquery('#showHideWomi').remove();

        jquery('#cc').off();
        jquery('#core-curriculum').off();
        jquery('#core-curriculum').find('ul').remove();
        jquery('#cc').attr('id', 'cc_');
        jquery('#cc_').click(function(){
            alert('By poznać szczegółowy rozkład materiału prosimy odwiedzić wersję online podręcznika.');
        });

        var hb = jquery('.home-btn');
        hb.attr('onclick', "window.external.BackToList();");

        kernel.loadModuleDependencies = function(){};

        kernel._initHistory = function(){};

        Utils.makeLinksAbsolute = function (windowHref, nodeToSearch) {

        };

        Topbar.prototype.addPrintCardLink = function(dest, url, title) {

            dest.append($('<span>', {
                'class': 'print-card-title',
                'text': title
            }));

            url = url.substring(1).replace(/\//g, '\\');

            dest.append($('<a>', {
                'style': 'cursor: pointer;',
                'class': 'module-print-card-link',
                'target': '_blank',
                click: function(e){
                    e.preventDefault();
                    window.external.OpenPdf(url);
                    return false;
                }
            }));

        };

        GEAnimation.prototype.url = jquery('base').data('static-url') + '..' + GEAnimation.prototype.url;
        GEAnimation.prototype.urlPattern = jquery('base').data('static-url') + '..' + GEAnimation.prototype.urlPattern;
        GEAnimation.prototype.prepareSourceUrl = function(source){
            return jquery('base').data('base') + source;
        };

        var _buildUrl = function (newid, urlType) {

            var _this = this;

            var hashCodeStart = '!';

			var womiid = _this._audioId || _this._movieId ;

            var media = 'video.mp4';

            if(typeof womiid === "undefined"){
				var ind = newid.indexOf('(');
				womiid = newid.substring(0, ind);
				if(newid.indexOf('audio') > -1){
					media = 'audio.mp4'
				}
			}

            if(_this._audioId){
                media = 'audio.mp4'
            }

            var RepositoryGlobalSettings = {
                url: "/content/womi/" + womiid + "/" + media,
                subtitles_url: "/content/womi/" + womiid + "/subtitles.txt",
                metadata_url: "/content/womi/" + womiid + "/meta.json"
            };

            var path = '';
            var baseUrl;

            switch (urlType) {
                case _this.urlType.Material:
                    baseUrl = RepositoryGlobalSettings.url;
					//var hashCode = _this._generateHashCode(String(newid));

					path = baseUrl;// + hashCodeStart + hashCode + newid;
                    break;
                case _this.urlType.Subtitle:
                    baseUrl = RepositoryGlobalSettings.subtitles_url;
					path = baseUrl;
                    break;
                case _this.urlType.Metadata:
                    baseUrl = RepositoryGlobalSettings.metadata_url;
					path = baseUrl;
                    break;
            }


            return path;
        };

        MovieContainer.prototype._buildUrl = _buildUrl;
        AudioContainer.prototype._buildUrl = _buildUrl;
        player.newBuildUrlFunc(_buildUrl);
    }


    if (!Registry.get('layout')) {
        var defaultLayout = new DefaultLayout({kernel: kernel});
        Registry.set('layout', defaultLayout);
    }


});
