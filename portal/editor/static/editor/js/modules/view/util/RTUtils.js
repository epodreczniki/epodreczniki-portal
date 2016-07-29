define(['declare', 'jquery'], function (declare, $) {
    return declare({
        'static': {
            URL: 'http://epodreczniki.pcss.pl/repo/image/edition/',

            URL2: 'http://epodreczniki.pcss.pl/repo/womi/',//2246/image/classic?res=980

            getFullImage: function (womiId) {
            	if (womiId == null) {
            		return null;
            	}
                return this.URL2 + womiId + '/image/pdf?res=1440';
            },

            getMinatureImage: function(womiId){
                if (womiId == null) {
            		return null;
            	}
                return this.URL + womiId;
            }
        }
    });
});

