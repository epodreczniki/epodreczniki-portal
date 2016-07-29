// See default.js for all available options
MathJax.Hub.Config({
    "MMLorHTML": {
        prefer: {
            MSIE: "HTML",
            Firefox: "HTML",
            Safari: "HTML",
            Chrome: "HTML",
            Opera: "HTML",
            other: "HTML"
        }// HTML or MML
    },
    "HTML-CSS": {
        imageFont: null,

        linebreaks: {
            automatic: false,
            width: "container"
        },
        scale: 100,
//        styles: {
//            ".MathJax_Display": {
//                width: null,
//                margin: null
//            }
//        }
        //availableFonts: ["Asana-Math","Gyre-Pagella","Latin-Modern","Neo-Euler","STIX-Web","TeX"],
        availableFonts: ["STIX-Web","TeX"],
        preferredFont: "STIX-Web",
        webFont: "STIX-Web"
    },
    "menuSettings": {
        zoom: "None"
    },
    positionToHash: true,
    jax: ["input/TeX", "output/HTML-CSS", "output/NativeMML"],
    skipStartupTypeset: true
//    displayIndent: "0em"
});

MathJax.Hub.Register.StartupHook("HTML-CSS Jax Config", function () {
    var v = parseInt(MathJax.Hub.Browser.version.substr(0, 2));
    if ((MathJax.Hub.Browser.isChrome && v >= 32) ||
        (MathJax.Hub.Browser.isOpera && v >= 19)) {
        //MathJax.OutputJax["HTML-CSS"].FontFaceBug = true;
    }
});

MathJax.HTML.Cookie.prefix = "_mjx";

MathJax.Ajax.loadComplete("[MathJax]/config/epo2.js");
