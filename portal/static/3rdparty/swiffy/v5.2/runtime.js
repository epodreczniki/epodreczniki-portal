/*
 * Copyright 2013 Google Inc.
 *
 * Swiffy runtime version 5.2.0
 *
 * In addition to the Google Terms of Service (http://www.google.com/accounts/TOS),
 * Google grants you and the Google Swiffy end users a personal, worldwide,
 * royalty-free, non-assignable and non-exclusive license to use the Google Swiffy
 * runtime to host it for Google Swiffy end users and to use it in connection with
 * the Google Swiffy service.
 */
(function () {
    function f(a) {
        throw a;
    }

    var h = void 0, l = !0, m = null, p = !1, aa = encodeURIComponent, ba = window, q = Object, ca = Function, r = document, da = isNaN, s = Math, t = Array, u = Number, ea = navigator, fa = Error, ga = Boolean, ha = parseInt, ia = parseFloat, w = String, ja = isFinite, ka = decodeURIComponent, ma = RegExp;

    function na(a, b) {
        return a.onload = b
    }

    function oa(a, b) {
        return a.font = b
    }

    function pa(a, b) {
        return a.valueOf = b
    }

    function qa(a, b) {
        return a.width = b
    }

    function ra(a, b) {
        return a.text = b
    }

    function sa(a, b) {
        return a.replace = b
    }

    function ta(a, b) {
        return a.matrix = b
    }

    function ua(a, b) {
        return a.data = b
    }

    function va(a, b) {
        return a.load = b
    }

    function wa(a, b) {
        return a.concat = b
    }

    function xa(a, b) {
        return a.value = b
    }

    function ya(a, b) {
        return a.italic = b
    }

    function za(a, b) {
        return a.color = b
    }

    function Aa(a, b) {
        return a.currentTarget = b
    }

    function Ba(a, b) {
        return a.definition = b
    }

    function Ca(a, b) {
        return a.status = b
    }

    function Da(a, b) {
        return a.remove = b
    }

    function Ea(a, b) {
        return a.keyCode = b
    }

    function Fa(a, b) {
        return a.blendmode = b
    }

    function Ga(a, b) {
        return a.copy = b
    }

    function Ha(a, b) {
        return a.play = b
    }

    function Ia(a, b) {
        return a.depth = b
    }

    function Ja(a, b) {
        return a.namespaces = b
    }

    function Ka(a, b) {
        return a.type = b
    }

    function La(a, b) {
        return a.method = b
    }

    function Ma(a, b) {
        return a.clear = b
    }

    function Oa(a, b) {
        return a.name = b
    }

    function Pa(a, b) {
        return a.bounds = b
    }

    function Qa(a, b) {
        return a.nextSibling = b
    }

    function Ra(a, b) {
        return a.fillStyle = b
    }

    function Sa(a, b) {
        return a.stop = b
    }

    function Ta(a, b) {
        return a.toString = b
    }

    function Ua(a, b) {
        return a.bold = b
    }

    function Va(a, b) {
        return a.length = b
    }

    function Wa(a, b) {
        return a.position = b
    }

    function Xa(a, b) {
        return a.prototype = b
    }

    function Ya(a, b) {
        return a.complete = b
    }

    function Za(a, b) {
        return a.size = b
    }

    function $a(a, b) {
        return a.actions = b
    }

    function ab(a, b) {
        return a.angle = b
    }

    function bb(a, b) {
        return a.next = b
    }

    function cb(a, b) {
        return a.from = b
    }

    function db(a, b) {
        return a.stopPropagation = b
    }

    function eb(a, b) {
        return a.alpha = b
    }

    function fb(a, b) {
        return a.target = b
    }

    function gb(a, b) {
        return a.call = b
    }

    function hb(a, b) {
        return a.start = b
    }

    function hbStop(a, b) {
        return a.stop = b
    }

    function ib(a, b) {
        return a.returnValue = b
    }

    function kb(a, b) {
        return a.eventPhase = b
    }

    function lb(a, b) {
        return a.loaded = b
    }

    function mb(a, b) {
        return a.contains = b
    }

    function nb(a, b) {
        return a.apply = b
    }

    function ob(a, b) {
        return a.distance = b
    }

    function pb(a, b) {
        return a.filters = b
    }

    function qb(a, b) {
        return a.normalize = b
    }

    function rb(a, b) {
        return a.height = b
    }

    function sb(a, b) {
        return a.transform = b
    }

    var x = "appendChild", tb = "slot", y = "push", ub = "object", vb = "filter", z = "font", wb = "indent", xb = "valueOf", yb = "kind", zb = "ascent", Ab = "getParent", Bb = "getOwnPropertyNames", Cb = "open", Db = "test", Eb = "shift", Fb = "hideObject", Gb = "strings", Hb = "POSITIVE_INFINITY", Jb = "exec", Kb = "width", Lb = "text", Mb = "expand", Nb = "round", Ob = "slice", Pb = "replace", Qb = "matrix", Rb = "nodeType", Sb = "toFixed", Tb = "setCapture", C = "data", Ub = "ceil", Vb = "events", Wb = "leading", Xb = "floor", Zb = "concat", $b = "charAt", ac = "createTextNode", bc = "miter", cc = "value", dc = "italic",
        ec = "preventDefault", fc = "setAttributeNS", gc = "fixed", hc = "indexOf", ic = "defineProperties", jc = "color", kc = "trim", lc = "dispatchEvent", nc = "capture", oc = "nodeName", pc = "writable", qc = "stops", rc = "ratio", sc = "setTransform", tc = "interfaces", D = "definition", uc = "knockout", vc = "match", wc = "status", xc = "linestyles", yc = "getName", zc = "fromCharCode", Ac = "charCode", Bc = "remove", Cc = "fillstyles", E = "defineProperty", Dc = "createElement", Ec = "sounds", Fc = "keyCode", Gc = "blendmode", Hc = "children", Ic = "firstChild", Jc = "sound", Kc = "forEach", Lc = "localName",
        Mc = "sqrt", Nc = "states", Oc = "variables", F = "setAttribute", Pc = "copy", Qc = "play", Rc = "path", Sc = "depth", Tc = "namespaces", Uc = "type", Vc = "method", Wc = "translate", Xc = "matrixX", Yc = "matrixY", Zc = "childNodes", $c = "rightMargin", ad = "bind", bd = "emSquareSize", cd = "offset", G = "name", dd = "bounds", ed = "nextSibling", fd = "keys", gd = "tags", hd = "getPrototypeOf", id = "clientX", jd = "releaseCapture", kd = "clientY", ld = "substr", md = "fill", nd = "stop", od = "toString", pd = "altKey", qd = "bold", rd = "gradient", sd = "doubles", H = "length", td = "propertyIsEnumerable",
        ud = "position", vd = "create", I = "prototype", wd = "descent", xd = "clip", yd = "complete", zd = "result", Ad = "size", Bd = "index", Cd = "inner", Dd = "actions", Ed = "variable", Fd = "multinames", Gd = "angle", J = "createElementNS", Hd = "next", Id = "ctrlKey", Jd = "split", Kd = "traits", Ld = "constructor", Md = "from", Nd = "stopPropagation", Od = "userAgent", Pd = "multiline", Qd = "location", Rd = "glyphs", Sd = "records", Td = "frameCount", Ud = "hasOwnProperty", Vd = "alpha", Wd = "style", Xd = "body", Yd = "methods", Zd = "removeChild", $d = "parent", ae = "getOwnPropertyDescriptor", be =
            "target", K = "call", ce = "isEnabled", de = "mask", ee = "line", fe = "lastIndexOf", ge = "random", he = "getAttribute", ie = "multiply", je = "strength", ke = "NEGATIVE_INFINITY", le = "init", me = "charCodeAt", ne = "colortransform", oe = "bottom", pe = "fireEvent", qe = "href", re = "substring", se = "advance", te = "removeNode", ue = "paths", ve = "trackAsMenu", we = "every", xe = "contains", L = "apply", ye = "distance", ze = "filters", Ae = "border", Be = "attributes", Ce = "removeAttribute", De = "navigator", Ee = "parentNode", Fe = "align", Ge = "height", He = "toUpperCase", Ie = "splice", Je =
            "leftMargin", Ke = "join", Le = "classes", Me = "unshift", Ne = "transform", Oe = "quality", Pe = "toLowerCase", Qe = "right", M, Re = this, Se = function (a) {
            a.za = function () {
                return a.Tl ? a.Tl : a.Tl = new a
            }
        }, Te = function (a) {
            var b = typeof a;
            if ("object" == b)if (a) {
                if (a instanceof t)return"array";
                if (a instanceof q)return b;
                var c = q[I][od][K](a);
                if ("[object Window]" == c)return"object";
                if ("[object Array]" == c || "number" == typeof a[H] && "undefined" != typeof a[Ie] && "undefined" != typeof a[td] && !a[td]("splice"))return"array";
                if ("[object Function]" ==
                    c || "undefined" != typeof a[K] && "undefined" != typeof a[td] && !a[td]("call"))return"function"
            } else return"null"; else if ("function" == b && "undefined" == typeof a[K])return"object";
            return b
        }, N = function (a) {
            return a !== h
        }, Ue = function (a) {
            return"array" == Te(a)
        }, Ve = function (a) {
            var b = Te(a);
            return"array" == b || "object" == b && "number" == typeof a[H]
        }, We = function (a) {
            return"string" == typeof a
        }, Xe = function (a) {
            return"boolean" == typeof a
        }, Ye = function (a) {
            return"number" == typeof a
        }, O = function (a) {
            return"function" == Te(a)
        }, Ze = function (a) {
            var b =
                typeof a;
            return"object" == b && a != m || "function" == b
        }, bf = function (a) {
            return a[$e] || (a[$e] = ++af)
        }, $e = "closure_uid_" + (1E9 * s[ge]() >>> 0), af = 0, cf = function (a, b, c) {
            return a[K][L](a[ad], arguments)
        }, df = function (a, b, c) {
            a || f(fa());
            if (2 < arguments[H]) {
                var d = t[I][Ob][K](arguments, 2);
                return function () {
                    var c = t[I][Ob][K](arguments);
                    t[I][Me][L](c, d);
                    return a[L](b, c)
                }
            }
            return function () {
                return a[L](b, arguments)
            }
        }, ef = function (a, b, c) {
            ef = ca[I][ad] && -1 != ca[I][ad][od]()[hc]("native code") ? cf : df;
            return ef[L](m, arguments)
        }, ff = function (a, b) {
            var c = t[I][Ob][K](arguments, 1);
            return function () {
                var b = t[I][Ob][K](arguments);
                b[Me][L](b, c);
                return a[L](this, b)
            }
        }, Q = function (a, b) {
            function c() {
            }

            Xa(c, b[I]);
            a.r = b[I];
            Xa(a, new c);
            a[I].constructor = a
        };
    var mf = function (a, b) {
        if (b)return a[Pb](gf, "&amp;")[Pb](hf, "&lt;")[Pb](jf, "&gt;")[Pb](kf, "&quot;");
        if (!lf[Db](a))return a;
        -1 != a[hc]("&") && (a = a[Pb](gf, "&amp;"));
        -1 != a[hc]("<") && (a = a[Pb](hf, "&lt;"));
        -1 != a[hc](">") && (a = a[Pb](jf, "&gt;"));
        -1 != a[hc]('"') && (a = a[Pb](kf, "&quot;"));
        return a
    }, gf = /&/g, hf = /</g, jf = />/g, kf = /\"/g, lf = /[&<>\"]/;
    var nf = t[I], of = nf[hc] ? function (a, b, c) {
            return nf[hc][K](a, b, c)
        } : function (a, b, c) {
            c = c == m ? 0 : 0 > c ? s.max(0, a[H] + c) : c;
            if (We(a))return!We(b) || 1 != b[H] ? -1 : a[hc](b, c);
            for (; c < a[H]; c++)if (c in a && a[c] === b)return c;
            return-1
        }, pf = nf[Kc] ? function (a, b, c) {
            nf[Kc][K](a, b, c)
        } : function (a, b, c) {
            for (var d = a[H], e = We(a) ? a[Jd]("") : a, g = 0; g < d; g++)g in e && b[K](c, e[g], g, a)
        }, qf = nf[we] ? function (a, b, c) {
            return nf[we][K](a, b, c)
        } : function (a, b, c) {
            for (var d = a[H], e = We(a) ? a[Jd]("") : a, g = 0; g < d; g++)if (g in e && !b[K](c, e[g], g, a))return p;
            return l
        },
        rf = function (a, b) {
            var c = of(a, b), d;
            (d = 0 <= c) && nf[Ie][K](a, c, 1);
            return d
        }, sf = function (a, b, c) {
            t:{
                for (var d = a[H], e = We(a) ? a[Jd]("") : a, g = 0; g < d; g++)if (g in e && b[K](c, e[g], g, a)) {
                    b = g;
                    break t
                }
                b = -1
            }
            return 0 <= b ? (nf[Ie][K](a, b, 1), l) : p
        }, tf = function (a) {
            return nf[Zb][L](nf, arguments)
        }, uf = function (a) {
            var b = a[H];
            if (0 < b) {
                for (var c = t(b), d = 0; d < b; d++)c[d] = a[d];
                return c
            }
            return[]
        }, vf = function (a, b, c) {
            return 2 >= arguments[H] ? nf[Ob][K](a, b) : nf[Ob][K](a, b, c)
        }, wf = function (a, b, c, d, e) {
            for (var g = 0, k = a[H], n; g < k;) {
                var v = g + k >> 1, A;
                A = c ?
                    b[K](e, a[v], v, a) : b(d, a[v]);
                0 < A ? g = v + 1 : (k = v, n = !A)
            }
            return n ? g : ~g
        }, xf = function (a, b) {
            return a > b ? 1 : a < b ? -1 : 0
        };
    var yf = function (a, b, c) {
        for (var d in a)b[K](c, a[d], d, a)
    }, zf = function (a) {
        var b = [], c = 0, d;
        for (d in a)b[c++] = a[d];
        return b
    }, Af = function (a) {
        var b = [], c = 0, d;
        for (d in a)b[c++] = d;
        return b
    }, Bf = function (a) {
        var b = Te(a);
        if ("object" == b || "array" == b) {
            if (a.J)return a.J();
            var b = "array" == b ? [] : {}, c;
            for (c in a)b[c] = Bf(a[c]);
            return b
        }
        return a
    }, Cf = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), Df = function (a, b) {
        for (var c, d, e = 1; e < arguments[H]; e++) {
            d = arguments[e];
            for (c in d)a[c] = d[c];
            for (var g = 0; g < Cf[H]; g++)c = Cf[g], q[I][Ud][K](d, c) && (a[c] = d[c])
        }
    };
    var Ef, Ff, Gf, Hf, If, Jf, Kf, Lf = function () {
        return Re[De] ? Re[De][Od] : m
    };
    If = Hf = Gf = Ff = Ef = p;
    var Mf;
    if (Mf = Lf()) {
        var Nf = Re[De];
        Ef = 0 == Mf[hc]("Opera");
        Ff = !Ef && -1 != Mf[hc]("MSIE");
        Hf = (Gf = !Ef && -1 != Mf[hc]("WebKit")) && -1 != Mf[hc]("Mobile");
        If = !Ef && !Gf && "Gecko" == Nf.product
    }
    var Of = Ef, Pf = Ff, Qf = If, Rf = Gf, Sf = Hf, Tf = Re[De];
    Jf = -1 != (Tf && Tf.platform || "")[hc]("Mac");
    var Uf = Lf();
    Kf = !!Uf && 0 <= Uf[hc]("iPhone");
    var Vf = !!Uf && 0 <= Uf[hc]("iPad"), Wf = function () {
        var a = Re.document;
        return a ? a.documentMode : h
    }, Xf;
    t:{
        var Yf = "", Zf;
        if (Of && Re.opera)var $f = Re.opera.version, Yf = "function" == typeof $f ? $f() : $f; else if (Qf ? Zf = /rv\:([^\);]+)(\)|;)/ : Pf ? Zf = /MSIE\s+([^\);]+)(\)|;)/ : Rf && (Zf = /WebKit\/(\S+)/), Zf)var ag = Zf[Jb](Lf()), Yf = ag ? ag[1] : "";
        if (Pf) {
            var bg = Wf();
            if (bg > ia(Yf)) {
                Xf = w(bg);
                break t
            }
        }
        Xf = Yf
    }
    var cg = Xf, dg = {}, eg = function (a) {
        var b;
        if (!(b = dg[a])) {
            b = 0;
            for (var c = w(cg)[Pb](/^[\s\xa0]+|[\s\xa0]+$/g, "")[Jd]("."), d = w(a)[Pb](/^[\s\xa0]+|[\s\xa0]+$/g, "")[Jd]("."), e = s.max(c[H], d[H]), g = 0; 0 == b && g < e; g++) {
                var k = c[g] || "", n = d[g] || "", v = ma("(\\d*)(\\D*)", "g"), A = ma("(\\d*)(\\D*)", "g");
                do {
                    var B = v[Jb](k) || ["", "", ""], P = A[Jb](n) || ["", "", ""];
                    if (0 == B[0][H] && 0 == P[0][H])break;
                    b = ((0 == B[1][H] ? 0 : ha(B[1], 10)) < (0 == P[1][H] ? 0 : ha(P[1], 10)) ? -1 : (0 == B[1][H] ? 0 : ha(B[1], 10)) > (0 == P[1][H] ? 0 : ha(P[1], 10)) ? 1 : 0) || ((0 == B[2][H]) < (0 == P[2][H]) ?
                        -1 : (0 == B[2][H]) > (0 == P[2][H]) ? 1 : 0) || (B[2] < P[2] ? -1 : B[2] > P[2] ? 1 : 0)
                } while (0 == b)
            }
            b = dg[a] = 0 <= b
        }
        return b
    }, fg = Re.document, gg = !fg || !Pf ? h : Wf() || ("CSS1Compat" == fg.compatMode ? ha(cg, 10) : 5);
    var hg = !Pf || Pf && 9 <= gg;
    !Qf && !Pf || Pf && Pf && 9 <= gg || Qf && eg("1.9.1");
    Pf && eg("9");
    var ig = function (a, b) {
        var c;
        c = a.className;
        c = We(c) && c[vc](/\S+/g) || [];
        for (var d = vf(arguments, 1), e = c[H] + d[H], g = c, k = 0; k < d[H]; k++)0 <= of(g, d[k]) || g[y](d[k]);
        a.className = c[Ke](" ");
        return c[H] == e
    };
    var kg = function (a, b) {
        yf(b, function (b, d) {
            "style" == d ? a[Wd].cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in jg ? a[F](jg[d], b) : 0 == d[fe]("aria-", 0) || 0 == d[fe]("data-", 0) ? a[F](d, b) : a[d] = b
        })
    }, jg = {cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", frameborder: "frameBorder", height: "height", maxlength: "maxLength", role: "role", rowspan: "rowSpan", type: "type", usemap: "useMap", valign: "vAlign", width: "width"}, mg = function (a, b, c) {
        var d = arguments, e = d[0], g = d[1];
        if (!hg && g && (g[G] || g[Uc])) {
            e = ["<",
                e];
            g[G] && e[y](' name="', mf(g[G]), '"');
            if (g[Uc]) {
                e[y](' type="', mf(g[Uc]), '"');
                var k = {};
                Df(k, g);
                delete k[Uc];
                g = k
            }
            e[y](">");
            e = e[Ke]("")
        }
        e = r[Dc](e);
        g && (We(g) ? e.className = g : Ue(g) ? ig[L](m, [e][Zb](g)) : kg(e, g));
        2 < d[H] && lg(r, e, d, 2);
        return e
    }, lg = function (a, b, c, d) {
        function e(c) {
            c && b[x](We(c) ? a[ac](c) : c)
        }

        for (; d < c[H]; d++) {
            var g = c[d];
            Ve(g) && !(Ze(g) && 0 < g[Rb]) ? pf(ng(g) ? uf(g) : g, e) : e(g)
        }
    }, og = function (a) {
        for (var b; b = a[Ic];)a[Zd](b)
    }, pg = function (a) {
        return a && a[Ee] ? a[Ee][Zd](a) : m
    }, qg = function (a, b) {
        var c = b[Ee];
        c && c.replaceChild(a,
            b)
    }, ng = function (a) {
        if (a && "number" == typeof a[H]) {
            if (Ze(a))return"function" == typeof a.item || "string" == typeof a.item;
            if (O(a))return"function" == typeof a.item
        }
        return p
    };
    var rg = function (a) {
        rg[" "](a);
        return a
    };
    rg[" "] = function () {
    };
    var sg = !Pf || Pf && 9 <= gg, tg = Pf && !eg("9");
    !Rf || eg("528");
    Qf && eg("1.9b") || Pf && eg("8") || Of && eg("9.5") || Rf && eg("528");
    Qf && !eg("8") || Pf && eg("9");
    var ug = function () {
    };
    var vg = function (a, b) {
        Ka(this, a);
        fb(this, b);
        Aa(this, this[be])
    };
    M = vg[I];
    M.dd = p;
    M.defaultPrevented = p;
    M.rd = l;
    db(M, function () {
        this.dd = l
    });
    M.preventDefault = function () {
        this.defaultPrevented = l;
        this.rd = p
    };
    var wg = function (a, b) {
        a && this[le](a, b)
    };
    Q(wg, vg);
    M = wg[I];
    fb(M, m);
    M.relatedTarget = m;
    M.offsetX = 0;
    M.offsetY = 0;
    M.clientX = 0;
    M.clientY = 0;
    M.screenX = 0;
    M.screenY = 0;
    M.button = 0;
    Ea(M, 0);
    M.charCode = 0;
    M.ctrlKey = p;
    M.altKey = p;
    M.shiftKey = p;
    M.metaKey = p;
    M.Pc = m;
    M.init = function (a, b) {
        var c = Ka(this, a[Uc]);
        vg[K](this, c);
        fb(this, a[be] || a.srcElement);
        Aa(this, b);
        var d = a.relatedTarget;
        if (d) {
            if (Qf) {
                var e;
                t:{
                    try {
                        rg(d[oc]);
                        e = l;
                        break t
                    } catch (g) {
                    }
                    e = p
                }
                e || (d = m)
            }
        } else"mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement);
        this.relatedTarget = d;
        this.offsetX = Rf || a.offsetX !== h ? a.offsetX : a.layerX;
        this.offsetY = Rf || a.offsetY !== h ? a.offsetY : a.layerY;
        this.clientX = a[id] !== h ? a[id] : a.pageX;
        this.clientY = a[kd] !== h ? a[kd] : a.pageY;
        this.screenX = a.screenX || 0;
        this.screenY = a.screenY ||
            0;
        this.button = a.button;
        Ea(this, a[Fc] || 0);
        this.charCode = a[Ac] || ("keypress" == c ? a[Fc] : 0);
        this.ctrlKey = a[Id];
        this.altKey = a[pd];
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.state = a.state;
        this.Pc = a;
        a.defaultPrevented && this[ec]();
        delete this.dd
    };
    db(M, function () {
        wg.r[Nd][K](this);
        this.Pc[Nd] ? this.Pc[Nd]() : this.Pc.cancelBubble = l
    });
    M.preventDefault = function () {
        wg.r[ec][K](this);
        var a = this.Pc;
        if (a[ec])a[ec](); else if (ib(a, p), tg)try {
            (a[Id] || 112 <= a[Fc] && 123 >= a[Fc]) && Ea(a, -1)
        } catch (b) {
        }
    };
    var xg = "closure_listenable_" + (1E6 * s[ge]() | 0), yg = 0;
    var zg = function (a, b, c, d, e, g) {
        this.lb = a;
        this.cl = b;
        this.src = c;
        Ka(this, d);
        this.capture = !!e;
        this.ze = g;
        this.key = ++yg;
        this.dc = this.Ae = p
    };
    zg[I].No = function () {
        this.dc = l;
        this.ze = this.src = this.cl = this.lb = m
    };
    var Ag = {}, Bg = {}, Cg = {}, Dg = {}, Eg = function (a, b, c, d, e) {
        if (Ue(b)) {
            for (var g = 0; g < b[H]; g++)Eg(a, b[g], c, d, e);
            return m
        }
        c = Fg(c);
        if (a && a[xg])a = a.Cn(b, c, d, e); else t:{
            b || f(fa("Invalid event type"));
            d = !!d;
            var k = Bg;
            b in k || (k[b] = {H: 0, zc: 0});
            k = k[b];
            d in k || (k[d] = {H: 0, zc: 0}, k.H++);
            var k = k[d], g = bf(a), n;
            k.zc++;
            if (k[g]) {
                n = k[g];
                for (var v = 0; v < n[H]; v++)if (k = n[v], k.lb == c && k.ze == e) {
                    if (k.dc)break;
                    n[v].Ae = p;
                    a = n[v];
                    break t
                }
            } else n = k[g] = [], k.H++;
            v = Gg();
            k = new zg(c, v, a, b, d, e);
            k.Ae = p;
            v.src = a;
            v.lb = k;
            n[y](k);
            Cg[g] || (Cg[g] = []);
            Cg[g][y](k);
            a.addEventListener ? a.addEventListener(b, v, d) : a.attachEvent(b in Dg ? Dg[b] : Dg[b] = "on" + b, v);
            a = Ag[k.key] = k
        }
        return a
    }, Gg = function () {
        var a = Hg, b = sg ? function (c) {
            return a[K](b.src, b.lb, c)
        } : function (c) {
            c = a[K](b.src, b.lb, c);
            if (!c)return c
        };
        return b
    }, Ig = function (a, b, c, d, e) {
        if (Ue(b)) {
            for (var g = 0; g < b[H]; g++)Ig(a, b[g], c, d, e);
            return m
        }
        c = Fg(c);
        if (a && a[xg])return a.Oo(b, c, d, e);
        d = !!d;
        t:{
            g = Bg;
            if (b in g && (g = g[b], d in g && (g = g[d], a = bf(a), g[a]))) {
                a = g[a];
                break t
            }
            a = m
        }
        if (!a)return p;
        for (g = 0; g < a[H]; g++)if (a[g].lb == c && a[g][nc] ==
            d && a[g].ze == e)return Jg(a[g]);
        return p
    }, Jg = function (a) {
        if (Ye(a) || !a || a.dc)return p;
        var b = a.src;
        if (b && b[xg])return b.Rk(a);
        var c = a[Uc], d = a.cl, e = a[nc];
        b.removeEventListener ? b.removeEventListener(c, d, e) : b.detachEvent && b.detachEvent(c in Dg ? Dg[c] : Dg[c] = "on" + c, d);
        b = bf(b);
        Cg[b] && (d = Cg[b], rf(d, a), 0 == d[H] && delete Cg[b]);
        a.No();
        if (d = Bg[c][e][b])d.Yk = l, Kg(c, e, b, d);
        delete Ag[a.key];
        return l
    }, Kg = function (a, b, c, d) {
        if (!d.Wg && d.Yk) {
            for (var e = 0, g = 0; e < d[H]; e++)d[e].dc || (e != g && (d[g] = d[e]), g++);
            Va(d, g);
            d.Yk = p;
            0 == g &&
            (delete Bg[a][b][c], Bg[a][b].H--, 0 == Bg[a][b].H && (delete Bg[a][b], Bg[a].H--), 0 == Bg[a].H && delete Bg[a])
        }
    }, Lg = function (a, b) {
        var c = 0, d = b == m;
        if (a != m) {
            if (a && a && a[xg])return a.cq(b);
            var e = bf(a);
            if (Cg[e])for (var e = Cg[e], g = e[H] - 1; 0 <= g; g--) {
                var k = e[g];
                if (d || b == k[Uc])Jg(k), c++
            }
        } else yf(Ag, function (a) {
            Jg(a);
            c++
        });
        return c
    }, Ng = function (a, b, c, d, e) {
        var g = 1;
        b = bf(b);
        if (a[b]) {
            var k = --a.zc, n = a[b];
            n.Wg ? n.Wg++ : n.Wg = 1;
            try {
                for (var v = n[H], A = 0; A < v; A++) {
                    var B = n[A];
                    B && !B.dc && (g &= Mg(B, e) !== p)
                }
            } finally {
                a.zc = s.max(k, a.zc), n.Wg--,
                    Kg(c, d, b, n)
            }
        }
        return ga(g)
    }, Mg = function (a, b) {
        var c = a.lb, d = a.ze || a.src;
        a.Ae && Jg(a);
        return c[K](d, b)
    }, Hg = function (a, b) {
        if (a.dc)return l;
        var c = a[Uc], d = Bg;
        if (!(c in d))return l;
        var d = d[c], e, g;
        if (!sg) {
            var k;
            if (!(k = b))t:{
                k = ["window", "event"];
                for (var n = Re; e = k[Eb]();)if (n[e] != m)n = n[e]; else {
                    k = m;
                    break t
                }
                k = n
            }
            e = k;
            k = l in d;
            n = p in d;
            if (k) {
                if (0 > e[Fc] || e.returnValue != h)return l;
                t:{
                    var v = p;
                    if (0 == e[Fc])try {
                        Ea(e, -1);
                        break t
                    } catch (A) {
                        v = l
                    }
                    (v || e.returnValue == h) && ib(e, l)
                }
            }
            v = new wg;
            v[le](e, this);
            e = l;
            try {
                if (k) {
                    for (var B = [],
                             P = v.currentTarget; P; P = P[Ee])B[y](P);
                    g = d[l];
                    g.zc = g.H;
                    for (var X = B[H] - 1; !v.dd && 0 <= X && g.zc; X--)Aa(v, B[X]), e &= Ng(g, B[X], c, l, v);
                    if (n) {
                        g = d[p];
                        g.zc = g.H;
                        for (X = 0; !v.dd && X < B[H] && g.zc; X++)Aa(v, B[X]), e &= Ng(g, B[X], c, p, v)
                    }
                } else e = Mg(a, v)
            } finally {
                B && Va(B, 0)
            }
            return e
        }
        c = new wg(b, this);
        return e = Mg(a, c)
    }, Og = "__closure_events_fn_" + (1E9 * s[ge]() >>> 0), Fg = function (a) {
        return O(a) ? a : a[Og] || (a[Og] = function (b) {
            return a.handleEvent(b)
        })
    };
    var Pg = function () {
        this.ec = {};
        this.Eo = this
    };
    Q(Pg, ug);
    Pg[I][xg] = l;
    M = Pg[I];
    M.Ul = m;
    M.addEventListener = function (a, b, c, d) {
        Eg(this, a, b, c, d)
    };
    M.removeEventListener = function (a, b, c, d) {
        Ig(this, a, b, c, d)
    };
    M.dispatchEvent = function (a) {
        var b, c = this.Ul;
        if (c) {
            b = [];
            for (var d = 1; c; c = c.Ul)b[y](c), ++d
        }
        c = this.Eo;
        d = a[Uc] || a;
        if (We(a))a = new vg(a, c); else if (a instanceof vg)fb(a, a[be] || c); else {
            var e = a;
            a = new vg(d, c);
            Df(a, e)
        }
        var e = l, g;
        if (b)for (var k = b[H] - 1; !a.dd && 0 <= k; k--)g = Aa(a, b[k]), e = g.ih(d, l, a) && e;
        a.dd || (g = Aa(a, c), e = g.ih(d, l, a) && e, a.dd || (e = g.ih(d, p, a) && e));
        if (b)for (k = 0; !a.dd && k < b[H]; k++)g = Aa(a, b[k]), e = g.ih(d, p, a) && e;
        return e
    };
    M.Cn = function (a, b, c, d) {
        return this.Tp(a, b, p, c, d)
    };
    M.Tp = function (a, b, c, d, e) {
        var g = this.ec[a] || (this.ec[a] = []), k = Qg(g, b, d, e);
        if (-1 < k)return a = g[k], c || (a.Ae = p), a;
        a = new zg(b, m, this, a, !!d, e);
        a.Ae = c;
        g[y](a);
        return a
    };
    M.Oo = function (a, b, c, d) {
        if (!(a in this.ec))return p;
        a = this.ec[a];
        b = Qg(a, b, c, d);
        return-1 < b ? (c = a[b], delete Ag[c.key], c.dc = l, 1 == nf[Ie][K](a, b, 1)[H]) : p
    };
    M.Rk = function (a) {
        var b = a[Uc];
        if (!(b in this.ec))return p;
        if (b = rf(this.ec[b], a))delete Ag[a.key], a.dc = l;
        return b
    };
    M.cq = function (a) {
        var b = 0, c;
        for (c in this.ec)if (!a || c == a) {
            for (var d = this.ec[c], e = 0; e < d[H]; e++)++b, delete Ag[d[e].key], d[e].dc = l;
            Va(d, 0)
        }
        return b
    };
    M.ih = function (a, b, c) {
        if (!(a in this.ec))return l;
        var d = l;
        a = uf(this.ec[a]);
        for (var e = 0; e < a[H]; ++e) {
            var g = a[e];
            if (g && !g.dc && g[nc] == b) {
                var k = g.lb, n = g.ze || g.src;
                g.Ae && this.Rk(g);
                d = k[K](n, c) !== p && d
            }
        }
        return d && c.rd != p
    };
    var Qg = function (a, b, c, d) {
        for (var e = 0; e < a[H]; ++e) {
            var g = a[e];
            if (g.lb == b && g[nc] == !!c && g.ze == d)return e
        }
        return-1
    };
    var Sg = function (a, b, c, d, e) {
        if (!Pf && (!Rf || !eg("525")))return l;
        if (Jf && e)return Rg(a);
        if (e && !d || !c && (17 == b || 18 == b || Jf && 91 == b))return p;
        if (Rf && d && c)switch (a) {
            case 220:
            case 219:
            case 221:
            case 192:
            case 186:
            case 189:
            case 187:
            case 188:
            case 190:
            case 191:
            case 192:
            case 222:
                return p
        }
        if (Pf && d && b == a)return p;
        switch (a) {
            case 13:
                return!(Pf && Pf && 9 <= gg);
            case 27:
                return!Rf
        }
        return Rg(a)
    }, Rg = function (a) {
        if (48 <= a && 57 >= a || 96 <= a && 106 >= a || 65 <= a && 90 >= a || Rf && 0 == a)return l;
        switch (a) {
            case 32:
            case 63:
            case 107:
            case 109:
            case 110:
            case 111:
            case 186:
            case 59:
            case 189:
            case 187:
            case 61:
            case 188:
            case 190:
            case 191:
            case 192:
            case 222:
            case 219:
            case 220:
            case 221:
                return l;
            default:
                return p
        }
    }, Tg = function (a) {
        switch (a) {
            case 61:
                return 187;
            case 59:
                return 186;
            case 224:
                return 91;
            case 0:
                return 224;
            default:
                return a
        }
    };
    var Ug = function (a, b) {
        Pg[K](this);
        a && this.Dp(a, b)
    };
    Q(Ug, Pg);
    M = Ug[I];
    M.Kf = m;
    M.Yg = m;
    M.Gi = m;
    M.Zg = m;
    M.pb = -1;
    M.ed = -1;
    M.Mi = p;
    var Vg = {3: 13, 12: 144, 63232: 38, 63233: 40, 63234: 37, 63235: 39, 63236: 112, 63237: 113, 63238: 114, 63239: 115, 63240: 116, 63241: 117, 63242: 118, 63243: 119, 63244: 120, 63245: 121, 63246: 122, 63247: 123, 63248: 44, 63272: 46, 63273: 36, 63275: 35, 63276: 33, 63277: 34, 63289: 144, 63302: 45}, Wg = {Up: 38, Down: 40, Left: 37, Right: 39, Enter: 13, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, "U+007F": 46, Home: 36, End: 35, PageUp: 33, PageDown: 34, Insert: 45}, Xg = Pf || Rf && eg("525"), Yg = Jf && Qf;
    M = Ug[I];
    M.Io = function (a) {
        if (Rf && (17 == this.pb && !a[Id] || 18 == this.pb && !a[pd] || Jf && 91 == this.pb && !a.metaKey))this.ed = this.pb = -1;
        -1 == this.pb && (a[Id] && 17 != a[Fc] ? this.pb = 17 : a[pd] && 18 != a[Fc] ? this.pb = 18 : a.metaKey && 91 != a[Fc] && (this.pb = 91));
        Xg && !Sg(a[Fc], this.pb, a.shiftKey, a[Id], a[pd]) ? this.handleEvent(a) : (this.ed = Qf ? Tg(a[Fc]) : a[Fc], Yg && (this.Mi = a[pd]))
    };
    M.wp = function () {
        this.ed = this.pb = -1
    };
    M.Jo = function (a) {
        this.wp();
        this.Mi = a[pd]
    };
    M.handleEvent = function (a) {
        var b = a.Pc, c, d, e = b[pd];
        Pf && "keypress" == a[Uc] ? (c = this.ed, d = 13 != c && 27 != c ? b[Fc] : 0) : Rf && "keypress" == a[Uc] ? (c = this.ed, d = 0 <= b[Ac] && 63232 > b[Ac] && Rg(c) ? b[Ac] : 0) : Of ? (c = this.ed, d = Rg(c) ? b[Fc] : 0) : (c = b[Fc] || this.ed, d = b[Ac] || 0, Yg && (e = this.Mi), Jf && (63 == d && 224 == c) && (c = 191));
        var g = c, k = b.keyIdentifier;
        c ? 63232 <= c && c in Vg ? g = Vg[c] : 25 == c && a.shiftKey && (g = 9) : k && k in Wg && (g = Wg[k]);
        a = g == this.pb;
        this.pb = g;
        b = new Zg(g, d, a, b);
        b.altKey = e;
        this[lc](b)
    };
    M.Dp = function (a, b) {
        this.Zg && this.detach();
        this.Kf = a;
        this.Yg = Eg(this.Kf, "keypress", this, b);
        this.Gi = Eg(this.Kf, "keydown", this.Io, b, this);
        this.Zg = Eg(this.Kf, "keyup", this.Jo, b, this)
    };
    M.detach = function () {
        this.Yg && (Jg(this.Yg), Jg(this.Gi), Jg(this.Zg), this.Zg = this.Gi = this.Yg = m);
        this.Kf = m;
        this.ed = this.pb = -1
    };
    var Zg = function (a, b, c, d) {
        d && this[le](d, h);
        Ka(this, "key");
        Ea(this, a);
        this.charCode = b;
        this.repeat = c
    };
    Q(Zg, wg);
    var $g = function (a) {
        return a
    };
    var ah = function () {
    };
    Se(ah);
    ah[I].Wp = 0;
    ah[I].Ga = function () {
        return":" + (this.Wp++)[od](36)
    };
    ah.za();
    var bh = "StopIteration"in Re ? Re.StopIteration : fa("StopIteration"), ch = function () {
    };
    bb(ch[I], function () {
        f(bh)
    });
    ch[I].Si = function () {
        return this
    };
    var dh = function (a) {
        if ("function" == typeof a.Nb)a = a.Nb(); else if (Ve(a) || We(a))a = a[H]; else {
            var b = 0, c;
            for (c in a)b++;
            a = b
        }
        return a
    }, eh = function (a) {
        if ("function" == typeof a.nb)return a.nb();
        if (We(a))return a[Jd]("");
        if (Ve(a)) {
            for (var b = [], c = a[H], d = 0; d < c; d++)b[y](a[d]);
            return b
        }
        return zf(a)
    }, fh = function (a, b, c) {
        if ("function" == typeof a[we])return a[we](b, c);
        if (Ve(a) || We(a))return qf(a, b, c);
        var d;
        if ("function" == typeof a.Ld)d = a.Ld(); else if ("function" != typeof a.nb)if (Ve(a) || We(a)) {
            d = [];
            for (var e = a[H], g = 0; g < e; g++)d[y](g)
        } else d =
            Af(a); else d = h;
        for (var e = eh(a), g = e[H], k = 0; k < g; k++)if (!b[K](c, e[k], d && d[k], a))return p;
        return l
    };
    var gh = function (a, b) {
        this.K = {};
        this.fa = [];
        var c = arguments[H];
        if (1 < c) {
            c % 2 && f(fa("Uneven number of arguments"));
            for (var d = 0; d < c; d += 2)this.set(arguments[d], arguments[d + 1])
        } else a && this.Be(a)
    };
    M = gh[I];
    M.H = 0;
    M.Pg = 0;
    M.Nb = function () {
        return this.H
    };
    M.nb = function () {
        this.Gf();
        for (var a = [], b = 0; b < this.fa[H]; b++)a[y](this.K[this.fa[b]]);
        return a
    };
    M.Ld = function () {
        this.Gf();
        return this.fa[Zb]()
    };
    M.xc = function (a) {
        return hh(this.K, a)
    };
    M.bj = function (a) {
        for (var b = 0; b < this.fa[H]; b++) {
            var c = this.fa[b];
            if (hh(this.K, c) && this.K[c] == a)return l
        }
        return p
    };
    M.Ad = function (a, b) {
        if (this === a)return l;
        if (this.H != a.Nb())return p;
        var c = b || ih;
        this.Gf();
        for (var d, e = 0; d = this.fa[e]; e++)if (!c(this.get(d), a.get(d)))return p;
        return l
    };
    var ih = function (a, b) {
        return a === b
    };
    M = gh[I];
    M.Aa = function () {
        return 0 == this.H
    };
    Da(M, function (a) {
        return hh(this.K, a) ? (delete this.K[a], this.H--, this.Pg++, this.fa[H] > 2 * this.H && this.Gf(), l) : p
    });
    M.Gf = function () {
        if (this.H != this.fa[H]) {
            for (var a = 0, b = 0; a < this.fa[H];) {
                var c = this.fa[a];
                hh(this.K, c) && (this.fa[b++] = c);
                a++
            }
            Va(this.fa, b)
        }
        if (this.H != this.fa[H]) {
            for (var d = {}, b = a = 0; a < this.fa[H];)c = this.fa[a], hh(d, c) || (this.fa[b++] = c, d[c] = 1), a++;
            Va(this.fa, b)
        }
    };
    M.get = function (a, b) {
        return hh(this.K, a) ? this.K[a] : b
    };
    M.set = function (a, b) {
        hh(this.K, a) || (this.H++, this.fa[y](a), this.Pg++);
        this.K[a] = b
    };
    M.Be = function (a) {
        var b;
        a instanceof gh ? (b = a.Ld(), a = a.nb()) : (b = Af(a), a = zf(a));
        for (var c = 0; c < b[H]; c++)this.set(b[c], a[c])
    };
    M.J = function () {
        return new gh(this)
    };
    M.Si = function (a) {
        this.Gf();
        var b = 0, c = this.fa, d = this.K, e = this.Pg, g = this, k = new ch;
        bb(k, function () {
            for (; ;) {
                e != g.Pg && f(fa("The map has changed since the iterator was created"));
                b >= c[H] && f(bh);
                var k = c[b++];
                return a ? k : d[k]
            }
        });
        return k
    };
    var hh = function (a, b) {
        return q[I][Ud][K](a, b)
    };
    var jh = function (a, b, c) {
        this.ad = a || m;
        this.op = !!c
    };
    M = jh[I];
    M.bd = function () {
        if (!this.pa && (this.pa = new gh, this.H = 0, this.ad))for (var a = this.ad[Jd]("&"), b = 0; b < a[H]; b++) {
            var c = a[b][hc]("="), d = m, e = m;
            0 <= c ? (d = a[b][re](0, c), e = a[b][re](c + 1)) : d = a[b];
            d = ka(d[Pb](/\+/g, " "));
            d = this.Fd(d);
            this.add(d, e ? ka(e[Pb](/\+/g, " ")) : "")
        }
    };
    M.pa = m;
    M.H = m;
    M.Nb = function () {
        this.bd();
        return this.H
    };
    M.add = function (a, b) {
        this.bd();
        this.Qg();
        a = this.Fd(a);
        var c = this.pa.get(a);
        c || this.pa.set(a, c = []);
        c[y](b);
        this.H++;
        return this
    };
    Da(M, function (a) {
        this.bd();
        a = this.Fd(a);
        return this.pa.xc(a) ? (this.Qg(), this.H -= this.pa.get(a)[H], this.pa[Bc](a)) : p
    });
    M.Aa = function () {
        this.bd();
        return 0 == this.H
    };
    M.xc = function (a) {
        this.bd();
        a = this.Fd(a);
        return this.pa.xc(a)
    };
    M.bj = function (a) {
        var b = this.nb();
        return 0 <= of(b, a)
    };
    M.Ld = function () {
        this.bd();
        for (var a = this.pa.nb(), b = this.pa.Ld(), c = [], d = 0; d < b[H]; d++)for (var e = a[d], g = 0; g < e[H]; g++)c[y](b[d]);
        return c
    };
    M.nb = function (a) {
        this.bd();
        var b = [];
        if (a)this.xc(a) && (b = tf(b, this.pa.get(this.Fd(a)))); else {
            a = this.pa.nb();
            for (var c = 0; c < a[H]; c++)b = tf(b, a[c])
        }
        return b
    };
    M.set = function (a, b) {
        this.bd();
        this.Qg();
        a = this.Fd(a);
        this.xc(a) && (this.H -= this.pa.get(a)[H]);
        this.pa.set(a, [b]);
        this.H++;
        return this
    };
    M.get = function (a, b) {
        var c = a ? this.nb(a) : [];
        return 0 < c[H] ? w(c[0]) : b
    };
    M.sq = function (a, b) {
        this[Bc](a);
        0 < b[H] && (this.Qg(), this.pa.set(this.Fd(a), uf(b)), this.H += b[H])
    };
    Ta(M, function () {
        if (this.ad)return this.ad;
        if (!this.pa)return"";
        for (var a = [], b = this.pa.Ld(), c = 0; c < b[H]; c++)for (var d = b[c], e = aa(w(d)), d = this.nb(d), g = 0; g < d[H]; g++) {
            var k = e;
            "" !== d[g] && (k += "=" + aa(w(d[g])));
            a[y](k)
        }
        return this.ad = a[Ke]("&")
    });
    M.Qg = function () {
        this.ad = m
    };
    M.J = function () {
        var a = new jh;
        a.ad = this.ad;
        this.pa && (a.pa = this.pa.J(), a.H = this.H);
        return a
    };
    M.Fd = function (a) {
        a = w(a);
        this.op && (a = a[Pe]());
        return a
    };
    var kh = function (a) {
        this.K = new gh;
        a && this.Be(a)
    }, lh = function (a) {
        var b = typeof a;
        return"object" == b && a || "function" == b ? "o" + bf(a) : b[ld](0, 1) + a
    };
    M = kh[I];
    M.Nb = function () {
        return this.K.Nb()
    };
    M.add = function (a) {
        this.K.set(lh(a), a)
    };
    M.Be = function (a) {
        a = eh(a);
        for (var b = a[H], c = 0; c < b; c++)this.add(a[c])
    };
    Da(M, function (a) {
        return this.K[Bc](lh(a))
    });
    M.Aa = function () {
        return this.K.Aa()
    };
    mb(M, function (a) {
        return this.K.xc(lh(a))
    });
    M.nb = function () {
        return this.K.nb()
    };
    M.J = function () {
        return new kh(this)
    };
    M.Ad = function (a) {
        return this.Nb() == dh(a) && this.fp(a)
    };
    M.fp = function (a) {
        var b = dh(a);
        if (this.Nb() > b)return p;
        !(a instanceof kh) && 5 < b && (a = new kh(a));
        return fh(this, function (b) {
            if ("function" == typeof a[xe])b = a[xe](b); else if ("function" == typeof a.bj)b = a.bj(b); else if (Ve(a) || We(a))b = 0 <= of(a, b); else t:{
                for (var d in a)if (a[d] == b) {
                    b = l;
                    break t
                }
                b = p
            }
            return b
        })
    };
    M.Si = function () {
        return this.K.Si(p)
    };
    var mh = m, nh = m, oh = Qf || Rf || Of || "function" == typeof Re.atob, ph = function () {
        if (!mh) {
            mh = {};
            nh = {};
            for (var a = 0; 65 > a; a++)mh[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="[$b](a), nh[mh[a]] = a
        }
    };
    var qh = function (a) {
        a = w(a);
        if (/^\s*$/[Db](a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/[Db](a[Pb](/\\["\\\/bfnrtu]/g, "@")[Pb](/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")[Pb](/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, "")))try {
            return eval("(" + a + ")")
        } catch (b) {
        }
        f(fa("Invalid JSON string: " + a))
    };
    var sh = function (a, b) {
        this.Ik = a || m;
        this.xb = !!b;
        this.K = new gh;
        this.ka = new rh("", h);
        bb(this.ka, this.ka.zb = this.ka)
    };
    M = sh[I];
    M.Fl = function (a) {
        if ((a = this.K.get(a)) && this.xb)a[Bc](), this.hl(a);
        return a
    };
    M.get = function (a, b) {
        var c = this.Fl(a);
        return c ? c[cc] : b
    };
    M.set = function (a, b) {
        var c = this.Fl(a);
        c ? xa(c, b) : (c = new rh(a, b), this.K.set(a, c), this.hl(c))
    };
    M.shift = function () {
        return this.zl(this.ka[Hd])
    };
    M.pop = function () {
        return this.zl(this.ka.zb)
    };
    Da(M, function (a) {
        return(a = this.K.get(a)) ? (this[te](a), l) : p
    });
    M.removeNode = function (a) {
        a[Bc]();
        this.K[Bc](a.key)
    };
    M.Nb = function () {
        return this.K.Nb()
    };
    M.Aa = function () {
        return this.K.Aa()
    };
    M.Ld = function () {
        return this.map(function (a, b) {
            return b
        })
    };
    M.nb = function () {
        return this.map(function (a) {
            return a
        })
    };
    mb(M, function (a) {
        return this.some(function (b) {
            return b == a
        })
    });
    M.xc = function (a) {
        return this.K.xc(a)
    };
    M.forEach = function (a, b) {
        for (var c = this.ka[Hd]; c != this.ka; c = c[Hd])a[K](b, c[cc], c.key, this)
    };
    M.map = function (a, b) {
        for (var c = [], d = this.ka[Hd]; d != this.ka; d = d[Hd])c[y](a[K](b, d[cc], d.key, this));
        return c
    };
    M.some = function (a, b) {
        for (var c = this.ka[Hd]; c != this.ka; c = c[Hd])if (a[K](b, c[cc], c.key, this))return l;
        return p
    };
    M.every = function (a, b) {
        for (var c = this.ka[Hd]; c != this.ka; c = c[Hd])if (!a[K](b, c[cc], c.key, this))return p;
        return l
    };
    M.hl = function (a) {
        this.xb ? (bb(a, this.ka[Hd]), a.zb = this.ka, bb(this.ka, a), a[Hd].zb = a) : (a.zb = this.ka.zb, bb(a, this.ka), this.ka.zb = a, bb(a.zb, a));
        this.Ik != m && this.$n(this.Ik)
    };
    M.$n = function (a) {
        for (var b = this.K.Nb(); b > a; b--)this[te](this.xb ? this.ka.zb : this.ka[Hd])
    };
    M.zl = function (a) {
        this.ka != a && this[te](a);
        return a[cc]
    };
    var rh = function (a, b) {
        this.key = a;
        xa(this, b)
    };
    Da(rh[I], function () {
        bb(this.zb, this[Hd]);
        this[Hd].zb = this.zb;
        delete this.zb;
        delete this[Hd]
    });
    var th;
    th = p;
    var uh = Lf();
    uh && (-1 != uh[hc]("Firefox") || -1 != uh[hc]("Camino") || -1 != uh[hc]("iPhone") || -1 != uh[hc]("iPod") || -1 != uh[hc]("iPad") || -1 != uh[hc]("Android") || -1 != uh[hc]("Chrome") && (th = l));
    var vh = th;
    var wh = /iPhone|iPod/, xh = function (a, b, c, d) {
        return a << 21 | b << 14 | c << 7 | d
    }, yh = /OS (\d)_(\d)(?:_(\d))?/;
    q[E] && !q[ic] && (q.defineProperties = function (a, b) {
        for (var c in b)q[E](a, c, b[c])
    });
    var zh = function (a, b) {
        this.x = a;
        this.y = b
    };
    zh[I].F = function (a) {
        var b = this.x * a.o + this.y * a.g + a.l;
        this.x = this.x * a.m + this.y * a.d + a.k;
        this.y = b
    };
    zh[I].J = function () {
        return new zh(this.x, this.y)
    };
    var Ah = function (a, b, c, d, e, g) {
        this.m = a;
        this.o = b;
        this.d = c;
        this.g = d;
        this.k = e;
        this.l = g
    }, Bh = new Ah(1, 0, 0, 1, 0, 0), Ch = new Ah(1, 0, 0, -1, 0, 0), Dh = new Ah(20, 0, 0, 20, 0, 0);
    M = Ah[I];
    M.ng = function () {
        var a = this.m * this.g - this.o * this.d;
        return new Ah(this.g / a, -this.o / a, -this.d / a, this.m / a, (this.d * this.l - this.g * this.k) / a, (this.o * this.k - this.m * this.l) / a)
    };
    M.multiply = function (a) {
        return new Ah(this.m * a.m + this.o * a.d, this.m * a.o + this.o * a.g, this.d * a.m + this.g * a.d, this.d * a.o + this.g * a.g, this.k * a.m + this.l * a.d + a.k, this.k * a.o + this.l * a.g + a.l)
    };
    M.$p = function (a, b) {
        return new Ah(this.m * a, this.o * a, this.d * b, this.g * b, this.k, this.l)
    };
    M.gj = function (a) {
        var b = s.cos(a);
        a = s.sin(a);
        return new Ah(this.m * b + this.o * a, this.o * b - this.m * a, this.d * b + this.g * a, this.g * b - this.d * a, this.k * b + this.l * a, this.l * b - this.k * a)
    };
    M.gf = function (a, b) {
        return new Ah(this.m * a, this.o * b, this.d * a, this.g * b, this.k * a, this.l * b)
    };
    M.Fh = function () {
        return s[Mc](this.m * this.m + this.o * this.o)
    };
    M.Gh = function () {
        return s[Mc](this.d * this.d + this.g * this.g)
    };
    M.translate = function (a, b) {
        return new Ah(this.m, this.o, this.d, this.g, this.k + a, this.l + b)
    };
    M.$d = function (a, b) {
        return new Ah(this.m, this.o, this.d, this.g, a, b)
    };
    Ta(M, function () {
        return"matrix(" + this.m + " " + this.o + " " + this.d + " " + this.g + " " + this.k + " " + this.l + ")"
    });
    M.Xo = function () {
        var a = this.Fh(), b = this.Gh();
        if (!a || !b)return{uc: 1, ud: 1, angle: 0, d: 0, g: 1};
        var c = this.m / a, d = this.o / a;
        return{uc: a, ud: b, angle: -s.atan2(this.o, this.m), d: (c * this.d + d * this.g) / a, g: (c * this.g - d * this.d) / b}
    };
    var Eh = function (a, b, c) {
        var d = s.cos(a[Gd]), e = s.sin(a[Gd]);
        return new Ah(a.uc * d, -a.uc * e, a.uc * d * a.d + a.ud * e * a.g, a.ud * d * a.g - a.uc * e * a.d, b, c)
    };
    Ah[I].Ad = function (a) {
        return!!a && this.m == a.m && this.o == a.o && this.d == a.d && this.g == a.g && this.k == a.k && this.l == a.l
    };
    var Fh = function (a, b, c, d, e, g, k, n) {
        this.X = a;
        this.U = b;
        this.W = c;
        this.T = d;
        this.V = e;
        this.S = g;
        this.M = k;
        this.Y = n
    }, Gh = new Fh(1, 0, 1, 0, 1, 0, 1, 0);
    M = Fh[I];
    M.zk = function (a) {
        return new Fh(this.X * a.X, this.X * a.U + this.U, this.W * a.W, this.W * a.T + this.T, this.V * a.V, this.V * a.S + this.S, this.M * a.M, this.M * a.Y + this.Y)
    };
    nb(M, function (a) {
        return new Hh(a.ne * this.X + this.U, a.me * this.W + this.T, a.le * this.V + this.S, this.Ym(a.od))
    });
    M.Ym = function (a) {
        return this.M * a + this.Y / 255
    };
    M.Ad = function (a) {
        return a != m && this.X == a.X && this.U == a.U && this.W == a.W && this.T == a.T && this.V == a.V && this.S == a.S && this.M == a.M && this.Y == a.Y
    };
    M.vj = function () {
        return 1 == this.X && 0 == this.U && 1 == this.W && 0 == this.T && 1 == this.V && 0 == this.S && 0 == this.Y
    };
    var Ih = function (a, b, c, d) {
        this.i = a;
        this.h = b;
        this.C = c;
        this.A = d;
        this.Aa() && this.Ch()
    };
    M = Ih[I];
    M.Ch = function () {
        this.i = u[Hb];
        this.h = u[Hb];
        this.C = u[ke];
        this.A = u[ke]
    };
    M.J = function () {
        return new Ih(this.i, this.h, this.C, this.A)
    };
    M.expand = function (a, b) {
        this.qe(a, b, 0)
    };
    M.qe = function (a, b, c) {
        this.i = s.min(this.i, a - c);
        this.C = s.max(this.C, a + c);
        this.h = s.min(this.h, b - c);
        this.A = s.max(this.A, b + c)
    };
    M.add = function (a) {
        this.h += a.h;
        this.A += a.A;
        this.i += a.i;
        this.C += a.C
    };
    M.F = function (a) {
        if (!this.Aa()) {
            var b = new zh(this.i, this.h), c = this.C - this.i, d = this.A - this.h;
            this.Ch();
            b.F(a);
            var e = c * a.o, c = c * a.m, g = d * a.d;
            a = d * a.g;
            this[Mb](b.x, b.y);
            this[Mb](b.x + c, b.y + e);
            this[Mb](b.x + g, b.y + a);
            this[Mb](b.x + c + g, b.y + e + a)
        }
    };
    M.Gm = function (a) {
        return(this.i >= a.i && this.i <= a.C || this.C >= a.i && this.C <= a.C || a.i >= this.i && a.i <= this.C) && (this.h >= a.h && this.h <= a.A || this.A >= a.h && this.A <= a.A || a.h >= this.h && a.h <= this.A)
    };
    mb(M, function (a, b) {
        return a >= this.i && a <= this.C && b >= this.h && b <= this.A
    });
    M.ue = function (a) {
        this.i = s.min(this.i, a.i);
        this.C = s.max(this.C, a.C);
        this.h = s.min(this.h, a.h);
        this.A = s.max(this.A, a.A)
    };
    M.Lm = function (a) {
        this.i = s.max(this.i, a.i);
        this.C = s.min(this.C, a.C);
        this.h = s.max(this.h, a.h);
        this.A = s.min(this.A, a.A);
        this.Aa() && this.Ch()
    };
    M.Aa = function () {
        return!(this.i <= this.C && this.h <= this.A)
    };
    M.Mm = function () {
        return new Ih(-this.C, -this.A, -this.i, -this.h)
    };
    qa(M, function () {
        return s.max(this.C - this.i, 0)
    });
    rb(M, function () {
        return s.max(this.A - this.h, 0)
    });
    var Jh = function (a) {
        return new Ih(a.xmin, a.ymin, a.xmax, a.ymax)
    };
    var Kh = function (a) {
        this.O = a ? a : [];
        this.Ui = ""
    }, Lh = {0: 1, 1: 1, 2: 2, 3: 0}, Mh = {0: "M", 1: "L", 2: "Q", 3: "Z"};
    M = Kh[I];
    Ta(M, function () {
        if (!this.Ui) {
            for (var a = this.O[Ob](0), b = 0, c = a[H]; b < c;) {
                var d = a[b];
                a[b++] = Mh[d];
                b += 2 * Lh[d]
            }
            this.Ui = c ? a[Ke](" ") : "M 0 0"
        }
        return this.Ui
    });
    M.di = function (a) {
        for (var b = this.O, c = 0, d = b[H], e = t(d); c < d;) {
            var g = b[c];
            e[c] = Mh[g];
            ++c;
            for (g = Lh[g]; 0 < g; --g) {
                var k = b[c + 0], n = b[c + 1];
                e[c + 0] = k * a.m + n * a.d + a.k;
                e[c + 1] = k * a.o + n * a.g + a.l;
                c += 2
            }
        }
        return e[Ke](" ")
    };
    M.F = function (a) {
        if (a == Bh)return this;
        for (var b = 0, c = this.O[H], d = t(c); b < c;) {
            var e = this.O[b];
            d[b++] = e;
            for (var g = 0; g < Lh[e]; g++) {
                var k = this.O[b], n = this.O[b + 1];
                d[b] = k * a.m + n * a.d + a.k;
                d[b + 1] = k * a.o + n * a.g + a.l;
                b += 2
            }
        }
        return new Kh(d)
    };
    wa(M, function (a) {
        return new Kh(this.O[Zb](a.O))
    });
    M.Go = function () {
        var a = this.O;
        if (13 != a[H] && 16 != a[H] || 0 != a[0] || 1 != a[3] || 1 != a[6] || 1 != a[9] || 3 != a[a[H] - 1])return p;
        var b = a[1], c = a[2], d = a[4], e = a[5], g = a[7], k = a[8], n = a[10], v = a[11];
        if (!(c == e && d == g && k == v && b == n || b == d && e == k && g == n && c == v))return p;
        if (16 == a[H]) {
            if (1 != a[12])return p;
            d = a[14];
            if (!(b == a[13] && c == d))return p
        }
        return l
    };
    M.Qm = function () {
        if (this.Go()) {
            var a = new Ih;
            a[Mb](this.O[1], this.O[2]);
            a[Mb](this.O[7], this.O[8]);
            return a
        }
        return m
    };
    M.Aa = function () {
        for (var a = 0; a < this.O[H];) {
            var b = this.O[a++];
            switch (b) {
                case 0:
                case 3:
                    break;
                case 1:
                case 2:
                    return p;
                default:
                    return p
            }
            a += 2 * Lh[b]
        }
        return l
    };
    M.hm = function () {
        for (var a = [], b = 0; b < this.O[H];) {
            var c = this.O[b++];
            3 != c && a[y](c);
            for (var d = 0; d < 2 * Lh[c]; d++)a[y](this.O[b++])
        }
        return new Kh(a)
    };
    var Oh = function (a) {
        for (var b = [], c = 0, d = Nh(function () {
            return a[me](c++)
        }), e = 0, g = 0; c < a[H];) {
            var k = d();
            b[y](k);
            switch (k) {
                case 0:
                case 1:
                    e += d();
                    g += d();
                    b[y](e);
                    b[y](g);
                    break;
                case 2:
                    var k = e + d(), n = g + d(), e = e + d(), g = g + d();
                    b[y](k);
                    b[y](n);
                    b[y](e);
                    b[y](g)
            }
        }
        return new Kh(b)
    };
    var Ph, Hh = function (a, b, c, d) {
        this.ne = a;
        this.me = b;
        this.le = c;
        this.od = d
    };
    Ta(Hh[I], function () {
        return"rgb(" + this.ne[Sb]() + "," + this.me[Sb]() + "," + this.le[Sb]() + ")"
    });
    Hh[I].sg = function () {
        return"rgba(" + this.ne[Sb]() + "," + this.me[Sb]() + "," + this.le[Sb]() + "," + this.od[Sb](3) + ")"
    };
    var Qh = function (a) {
        var b = 0, c = Nh(function () {
            return a[me](b++)
        });
        return new Ah(c() / 65536 + 1, c() / 65536, c() / 65536, c() / 65536 + 1, c(), c())
    }, Sh = function (a) {
        for (var b = [], c = 0, d = Rh(function () {
            return a[me](c++)
        }), e = 0; c < a[H];)e += ha(d(), 10), b[y](e);
        return b
    }, Rh = function (a) {
        return function () {
            var b = a();
            if (58 == b)return 0;
            for (var c = ""; 48 <= b && 57 >= b;)c += w[zc](b), b = a();
            return(97 <= b ? b - 96 : -(b - 64)) + c
        }
    }, Nh = function (a) {
        var b = Rh(a);
        return function () {
            return ha(b(), 10)
        }
    }, Th = function (a) {
        a = u(a);
        return ja(a) ? a : 0
    }, Uh = function (a) {
        var b =
            0, c = Nh(function () {
            return a[me](b++)
        });
        return new Fh((c() + 256) / 256, c(), (c() + 256) / 256, c(), (c() + 256) / 256, c(), (c() + 256) / 256, c())
    }, Vh = function (a, b) {
        var c = a, d = c & 255, c = c >> 8, e = c & 255, c = c >> 8, g = c & 255, c = c >> 8 & 255, c = c / 255;
        b && (g = g * b.X + b.U, e = e * b.W + b.T, d = d * b.V + b.S, c = c * b.M + b.Y / 255);
        return new Hh(g, e, d, c)
    }, Wh = function (a) {
        a = a[Pb](/^ *rgb *\( *([^,]+) *, *([^,]+) *, *([^,]+) *\) *$/, function (a, c, d, e) {
            return(c << 16) + (d << 8) + (e << 0)
        });
        a = a[Pb](/^ *#([0-9a-fA-F]+) *$/, function (a, c) {
            var d = ha(c, 16);
            return 4278190080 | d
        });
        return a |
            0
    }, Xh = function (a, b) {
        N(b) || (b = 100);
        return a & 16777215 | (2.55 * b & 255) << 24
    }, Yh = function (a, b) {
        var c = new zh(20 * b.x, 20 * b.y);
        c.F(a);
        c.x /= 20;
        c.y /= 20;
        return c
    }, Zh = function (a, b, c) {
        return a + (b - a) * c
    }, $h = function (a) {
        a = w(a)[kc]();
        return"0" == a[$b](0) && "x" != a[$b](1)[Pe]()
    }, ai = function (a) {
        a[F]("opacity", 0)
    }, bi = function (a) {
        if (!Ph) {
            var b = function (a) {
                ba.setTimeout(a, 1E3 / 60)
            };
            Ph = /iPhone|iPod|iPad/[Db](ea[Od]) ? b : ba.requestAnimationFrame || ba.webkitRequestAnimationFrame || ba.mozRequestAnimationFrame || ba.oRequestAnimationFrame ||
                ba.msRequestAnimationFrame || b
        }
        Ph[K](ba, a)
    }, di = function (a, b) {
        var c;
        if (We(a))c = a; else {
            c = new jh;
            if (a)for (var d in a) {
                var e = a[d];
                "$" == d[$b](0) || e instanceof ci || (Ue(e) || (e = [e]), c.sq(d, e))
            }
            c = c[od]()
        }
        if (!b)return c;
        if (!c)return b;
        d = b[hc]("?");
        return b = -1 != d ? b[Ob](0, d + 1) + c + "&" + b[Ob](d + 1) : b + ("?" + c)
    }, fi = function (a) {
        var b = a.internedStrings;
        b && (delete a.internedStrings, ei(a, b))
    }, ei = function (a, b) {
        for (var c in a) {
            var d = a[c];
            "string" == typeof d && "#" == d[$b](0) ? a[c] = b[d[ld](1)] : d instanceof q && ei(d, b)
        }
    }, gi = function (a) {
        a =
            a[Pb](/\+/g, " ");
        try {
            return ka(a)
        } catch (b) {
            for (var c = "", d = 0, e = d; e < a[H]; d = e) {
                e = a[hc]("%", d);
                if (0 > e)break;
                for (var c = c + a[re](d, e), g = d = 0; e < a[H];) {
                    var k = a[me](e++);
                    if (37 === k) {
                        if (!/[0-9a-fA-F]/[Db](a[$b](e)) || !/[0-9a-fA-F]/[Db](a[$b](++e)))if (0 < g)continue; else break;
                        k = ha(a[ld](++e - 2, 2), 16)
                    }
                    if (0 < g)d = (d << 6) + (k & 63), g--; else if (192 === (k & 192)) {
                        for (; k & 64;)k <<= 1, g++;
                        d = (k & 127) >> g
                    } else d = k;
                    if (0 === g) {
                        c += w[zc](d);
                        break
                    }
                }
            }
            return c + a[re](d)
        }
    }, hi = function (a, b) {
        var c = {};
        if (a)for (var d = a[Jd]("&"), e = 0; e < d[H]; e++) {
            var g =
                d[e], k = g[hc]("="), n = 0 <= k ? g[re](0, k) : g;
            if (n || b)g = 0 <= k ? g[re](k + 1) : "", n = gi(n), g = gi(g), n in c || (c[n] = []), c[n][y](g)
        }
        return c
    };
    var ii = function () {
        this.Fi = [];
        this.pd = {};
        this.kd = r[J]("http://www.w3.org/2000/svg", "defs")
    }, ji = function (a, b) {
        this.id = a;
        this.pe = b
    };
    ji[I].$f = function () {
        return!!this.pe
    };
    ji[I].get = function () {
        return this.pe
    };
    ii[I].$c = function (a) {
        var b = this.Fi[a];
        b || (b = new ji(a, m), this.Fi[a] = b);
        return b
    };
    ii[I].Il = function (a, b) {
        this.$c(a).pe = b
    };
    ii[I].gp = function (a, b) {
        for (var c = this.Fi, d = 0; d < c[H]; d++)if (c[d] && c[d].pe) {
            var e = c[d].get().Q(a);
            e && this.kd[x](e)
        }
        b && a.al(b);
        a.bl()
    };
    var ki = function (a, b, c, d) {
        if (Ze(a)) {
            b = b == m ? q[Bb](a) : We(b) ? b[Jd](",") : b;
            var e = {};
            d & 4 && (e.writable = l);
            d & 2 && (e.configurable = l);
            d & 1 && (e.enumerable = l);
            c & 4 && (e.writable = p);
            c & 2 && (e.configurable = p);
            c & 1 && (e.enumerable = p);
            for (c = 0; c < b[H]; ++c)(d = q[ae](a, b[c])) && d.configurable && q[E](a, b[c], e)
        }
    }, li = function () {
    };
    pa(li[I], function () {
    });
    var mi = function (a) {
        return a != m ? q(a) : new li
    }, ni = function (a) {
        return a != m ? q(a) : q[vd](mi[I])
    }, oi = {};
    mi.registerClass = function (a, b) {
        if (2 > arguments[H])return p;
        oi[a] = b;
        return l
    };
    ki(mi, m, 3);
    var pi = function (a) {
        q[E](this, "__swiffy_vm", {value: a})
    }, qi = function (a, b) {
        for (var c = t[I][Ob][K](arguments, 2), d = 0; d < this._listeners[H]; ++d) {
            var e = this._listeners[d];
            if (e != m) {
                var g = e[a.j(e, b)];
                O(g) && g[L](e, c)
            }
        }
        return 0 < this._listeners[H] ? l : h
    }, ri = function (a) {
        a != m ? rf(this._listeners, a) : sf(this._listeners, function (a) {
            return a == m
        });
        this._listeners[y](a);
        return l
    }, si = function (a) {
        return rf(this._listeners, a)
    };
    pi[I].initialize = function (a) {
        a._listeners = [];
        a.addListener = ri;
        a.broadcastMessage = ff(qi, this.__swiffy_vm);
        a.removeListener = si;
        ki(a, ["addListener", "broadcastMessage", "removeListener", "_listeners"], 3)
    };
    ki(pi[I], m, 3);
    var ti = {Va: function () {
        return 0
    }}, vi = function (a, b, c) {
        return 1 == a[H] ? new ui(c(a[0])) : new b(c(a[0]), c(a[1]))
    }, ui = function (a) {
        xa(this, a)
    };
    ui[I].td = l;
    ui[I].R = function () {
        return this[cc]
    };
    var wi = function (a, b) {
        cb(this, a);
        this.to = b
    };
    wi[I].td = p;
    wi[I].R = function (a) {
        return Zh(this[Md], this.to, a.Va())
    };
    var xi = function (a) {
        return vi(a, wi, $g)
    }, yi = function (a, b) {
        cb(this, a);
        this.to = b
    };
    yi[I].td = p;
    yi[I].R = function (a) {
        var b = this[Md], c = this.to;
        a = a.Va();
        return new Ah(Zh(b.m, c.m, a), Zh(b.o, c.o, a), Zh(b.d, c.d, a), Zh(b.g, c.g, a), Zh(b.k, c.k, a), Zh(b.l, c.l, a))
    };
    var zi = function (a, b) {
        return vi(a, yi, function (a) {
            return Qh(a).$p(b, b)
        })
    }, Ai = function (a, b) {
        cb(this, a);
        this.to = b
    };
    Ai[I].td = p;
    Ai[I].R = function (a) {
        var b = this[Md], c = this.to;
        a = a.Va();
        return new Hh(Zh(b.ne, c.ne, a), Zh(b.me, c.me, a), Zh(b.le, c.le, a), Zh(b.od, c.od, a))
    };
    var Bi = function (a, b) {
        cb(this, a);
        this.to = b;
        this.bo = a.hm();
        this.co = b.hm()
    };
    Bi[I].td = p;
    Bi[I].R = function (a) {
        a = a.Va();
        if (0 == a)return this[Md];
        if (1 == a)return this.to;
        for (var b = [], c = 0, d = this.bo.O, e = this.co.O; c < d[H];) {
            var g = d[c++];
            b[y](g);
            for (var k = 0; k < 2 * Lh[g]; k++)b[y](Zh(d[c], e[c++], a))
        }
        return new Kh(b)
    };
    var Ci;
    if (Ci = -1 != ea[Od][hc]("iPad") || wh[Db](ea[Od])) {
        var Di = yh[Jb](ea[Od]) || [];
        Di[Eb]();
        Ci = xh[L](m, Di) < xh(6)
    }
    var Ei = Ci, Fi = [m, "reflect", "repeat"], Gi = [m, "linearRGB"], Hi = function (a, b) {
        za(this, vi(b[jc], Ai, Vh))
    };
    Hi[I].sb = function () {
        return m
    };
    Hi[I].Ed = function (a, b, c, d, e) {
        a[F](c, e, this[jc], Ii);
        return c
    };
    Hi[I].Mg = p;
    Hi[I].Wc = function (a, b) {
        Ra(a, this[jc].R(b).sg());
        a[md]();
        return l
    };
    var Ji = function (a, b, c, d, e) {
        c[F](e, "url(#" + d.id + ")");
        return c
    }, Ki = function (a, b) {
        b[Ne] && sb(this, zi(b[Ne], 16384));
        this.stops = [];
        for (var c = 0; c < b[rd][qc][H]; c++) {
            var d = b[rd][qc][c];
            this[qc][c] = {color: vi(d[jc], Ai, Vh), offset: xi(d[cd].map(function (a) {
                return a / 255
            }))}
        }
        this.og = Fi[b[rd].spread];
        this.ql = Gi[b[rd].interpolation]
    };
    M = Ki[I];
    M.gm = function (a, b) {
        a[F]("gradientUnits", "userSpaceOnUse");
        this[Ne] ? b[F](a, "gradientTransform", this[Ne], Li) : a[F]("gradientTransform", "scale(16384)");
        for (var c = 0; c < this[qc][H]; c++)a[x](Mi(this[qc][c], b));
        this.og && a[F]("spreadMethod", this.og);
        this.ql && a[F]("color-interpolation", this.ql);
        a.id = ah.za().Ga();
        return a
    };
    M.Ed = Ji;
    M.sb = function () {
    };
    M.Wc = function () {
    };
    M.Mg = p;
    var Ni = function (a, b) {
        Ki[K](this, a, b)
    };
    Q(Ni, Ki);
    Ni[I].sb = function (a, b) {
        var c = r[J]("http://www.w3.org/2000/svg", "linearGradient");
        c[F]("x1", -1);
        c[F]("x2", 1);
        c[F]("y1", 0);
        c[F]("y2", 0);
        return this.gm(c, b)
    };
    Ni[I].Wc = function (a, b) {
        if (this.og)return p;
        if (this[Ne]) {
            var c = this[Ne].R(b);
            a[Ne](c.m, c.o, c.d, c.g, c.k, c.l)
        } else a.scale(16384, 16384);
        for (var c = a.createLinearGradient(-1, 0, 1, 0), d = this[qc], e = 0; e < d[H]; e++)c.addColorStop(d[e][cd].R(b), d[e][jc].R(b).sg());
        Ra(a, c);
        a[md]();
        return l
    };
    var Oi = function (a, b) {
        Ki[K](this, a, b);
        b[rd].f && (this.xg = xi(b[rd].f))
    };
    Q(Oi, Ki);
    Oi[I].sb = function (a, b) {
        var c = r[J]("http://www.w3.org/2000/svg", "radialGradient");
        c[F]("r", 1);
        c[F]("cx", 0);
        c[F]("cy", 0);
        this.xg && b[F](c, "fx", this.xg, Li);
        return this.gm(c, b)
    };
    Oi[I].Wc = function (a, b) {
        if (this.og)return p;
        if (this[Ne]) {
            var c = this[Ne].R(b);
            a[Ne](c.m, c.o, c.d, c.g, c.k, c.l)
        } else a.scale(16384, 16384);
        c = 0;
        this.xg && (c = this.xg.R(b));
        for (var c = a.createRadialGradient(c, 0, 0, 0, 0, 1), d = this[qc], e = 0; e < d[H]; e++)c.addColorStop(d[e][cd].R(b), d[e][jc].R(b).sg());
        Ra(a, c);
        a[md]();
        return l
    };
    var Qi = function (a, b) {
        this.Zh = "";
        var c = a.$c(b.bitmap).get();
        c instanceof Pi && (this.Rb = c);
        sb(this, b[Ne] ? Qh(b[Ne]) : Dh)
    };
    Qi[I].sb = function () {
        this.Zh || (this.Zh = this.Rb ? "#" + this.Rb.xk : "missing");
        return m
    };
    Qi[I].Ed = function (a, b, c, d) {
        var e;
        d == m ? (e = r[J]("http://www.w3.org/2000/svg", "use"), e[fc]("http://www.w3.org/1999/xlink", "href", this.Zh)) : e = d;
        this[Ne] && e[F]("transform", this[Ne][od]());
        a = r[J]("http://www.w3.org/2000/svg", "g");
        a[x](e);
        var g;
        b[C].td && (g = b[C].R(ti).Qm());
        if (g && this.Rb) {
            var k;
            if (d == m)d = new zh(0, 0), k = new zh(this.Rb[Kb], this.Rb[Ge]); else {
                b = u(d[he]("x"));
                e = u(d[he]("y"));
                var n = u(d[he]("width"));
                k = u(d[he]("height"));
                d = new zh(b, e);
                k = new zh(b + n, e + k)
            }
            this[Ne] && (d.F(this[Ne]), k.F(this[Ne]));
            b = s[Nb](d.x);
            e = s[Nb](d.y);
            n = s[Nb](k.x - d.x);
            k = s[Nb](k.y - d.y);
            0 > n && (b += n, n = -n);
            0 > k && (e += k, k = -k);
            if (g.i == b && g.h == e && g[Kb]() == n && g[Ge]() == k)return a
        }
        g = r[J]("http://www.w3.org/2000/svg", "clipPath");
        g.id = ah.za().Ga();
        g[x](c);
        a[x](g);
        a[F]("clip-path", "url(#" + g.id + ")");
        return a
    };
    Qi[I].Mg = l;
    Qi[I].Wc = function (a) {
        if (this[Ne]) {
            var b = this[Ne];
            a[Ne](b.m, b.o, b.d, b.g, b.k, b.l)
        }
        a[xd]();
        a.drawImage(this.Rb.Eb, 0, 0);
        return l
    };
    var Ri = function (a, b) {
        Qi[K](this, a, b)
    };
    Q(Ri, Qi);
    Ri[I].sb = function (a, b) {
        Ri.r.sb[K](this, a, b);
        var c = this.Rb;
        if (!c)return m;
        var d = this[Ne], e = r[J]("http://www.w3.org/2000/svg", "pattern");
        e[F]("width", c[Kb]);
        e[F]("height", c[Ge]);
        e[F]("patternUnits", "userSpaceOnUse");
        var g = r[J]("http://www.w3.org/2000/svg", "use");
        g[fc]("http://www.w3.org/1999/xlink", "href", "#" + c.xk);
        e[x](g);
        e[F]("patternTransform", d[od]());
        e.id = ah.za().Ga();
        return e
    };
    Ri[I].Ed = function (a, b, c, d, e) {
        Ji(a, b, c, d, e);
        a = r[J]("http://www.w3.org/2000/svg", "g");
        a[x](c);
        return a
    };
    Ri[I].Wc = function (a) {
        var b = a.createPattern(this.Rb.Eb, "repeat");
        if (this[Ne]) {
            var c = this[Ne];
            a[Ne](c.m, c.o, c.d, c.g, c.k, c.l)
        }
        Ra(a, b);
        a[md]();
        return l
    };
    var Si = function (a, b) {
        Qi[K](this, a, b)
    };
    Q(Si, Qi);
    Si[I].sb = function (a, b) {
        Si.r.sb[K](this, a, b);
        if (!this.Rb)return m;
        var c = this[Ne], d = this.Rb, e = a[0].J();
        e.F(c.ng());
        var g = e[Kb](), k = e[Ge](), c = r[Dc]("canvas");
        c[F]("width", g);
        c[F]("height", k);
        var n = r[J]("http://www.w3.org/2000/svg", "image");
        n[F]("width", g);
        n[F]("height", k);
        n[F]("x", e.i);
        n[F]("y", e.h);
        Ti && n[F]("transform", "rotate(360)");
        var v = c.getContext("2d");
        v.rect(0, 0, g, k);
        v[Wc](-e.i, -e.h);
        d = v.createPattern(d.Eb, "repeat");
        Ra(v, d);
        v[md]();
        n[fc]("http://www.w3.org/1999/xlink", "href", c.toDataURL("image/png"));
        n.id = ah.za().Ga();
        return n
    };
    var Mi = function (a, b) {
        var c = r[J]("http://www.w3.org/2000/svg", "stop");
        b[F](c, "offset", a[cd], Li);
        b[F](c, "stop-color", a[jc], Ii);
        return c
    }, Ui = [m, Hi, Ni, Oi, Oi, Ei ? Si : Ri, Qi], Vi = function (a, b) {
        var c = Ui[b[Uc]];
        return c ? new c(a, b) : m
    };
    var Wi = ["round", "butt", "square"], Xi = ["round", "none", "square"], Yi = ["round", "bevel", "miter"], Zi = function (a, b) {
        b[md] ? this.fill = Vi(a, b[md]) : za(this, vi(b[jc], Ai, Vh));
        this.jl = Wi[b.cap | 0];
        this.ml = Yi[b.joint | 0];
        b[bc] && (this.miter = b[bc]);
        qa(this, xi(b[Kb]))
    }, $i = function (a, b) {
        return b ? new Zi(a, b) : m
    };
    Zi[I].sb = function (a, b) {
        return this[md] ? this[md].sb(a, b) : m
    };
    Zi[I].Mg = p;
    Zi[I].Ed = function (a, b, c, d, e) {
        a[F](c, "stroke-width", this[Kb], aj);
        c[F]("stroke-linecap", this.jl);
        c[F]("stroke-linejoin", this.ml);
        this[bc] != m && c[F]("stroke-miterlimit", this[bc]);
        if (this[md])return this[md].Ed(a, b, c, d, e);
        a[F](c, e, this[jc], Ii);
        return c
    };
    Zi[I].Wc = function (a, b) {
        if (this[md])return p;
        a.lineCap = this.jl;
        a.lineJoin = this.ml;
        this[bc] != m && (a.miterLimit = this[bc]);
        a.lineWidth = s.max(this[Kb].R(b), 20);
        a.strokeStyle = this[jc].R(b).sg();
        a.stroke();
        return l
    };
    var bj = function (a, b) {
        this.ub = a ? a : new Ih;
        this.Fa = b
    };
    M = bj[I];
    M.ue = function (a) {
        this.Fa ? a.Fa ? this.Fa.ue(a.Fa) : this.Fa.ue(a.ub) : a.Fa && (this.Fa = this.ub.J(), this.Fa.ue(a.Fa));
        this.ub.ue(a.ub)
    };
    M.F = function (a) {
        this.Fa && this.Fa.F(a);
        this.ub.F(a)
    };
    M.J = function () {
        return new bj(this.ub.J(), this.Fa ? this.Fa.J() : h)
    };
    M.Ec = function () {
        return this.Fa ? this.Fa : this.ub
    };
    M.hn = function (a) {
        this.Fa || (this.Fa = this.ub.J());
        this.ub = a
    };
    var cj = function (a, b) {
        Ka(this, a);
        this.hk = b || m
    }, dj = {Hq: 1, Fq: 2, Lq: 4, Jq: 8, Kq: 16, Rq: 32, Dq: 64, Iq: 128, Pq: 256, Qq: 512, Oq: 1024, Nq: 2048, Mq: 4096, Aq: 8192, Cq: 16384, zq: 32768, Bq: 65536, Eq: 131072, yq: 262144, xq: 524288, Gq: 1048576, wq: 2097152};
    var fj = function (a) {
        this.xb = this.Cd = this.ja = m;
        this.ve = 0;
        this.e = a || m;
        this.Af = [];
        this.B = new ej(this)
    };
    M = fj[I];
    M.hh = function (a) {
        if (!this.ja || this.ja[Sc] > a)return this.xb = m;
        var b = this.ja;
        this.xb && a >= this.xb[Sc] && (b = this.xb);
        for (; b[ed] && !(b[ed][Sc] >= a);)b = b[ed];
        b[ed] && b[ed][Sc] == a && (b = b[ed]);
        return this.xb = b
    };
    M.Rg = function (a, b) {
        this.Yl(a, this.hh(b));
        Ia(a, b)
    };
    M.Yl = function (a, b) {
        b ? (b[ed] ? b[ed].Gb = a : this.Cd = a, a.Gb = b, Qa(a, b[ed]), Qa(b, a)) : (this.ja && (this.ja.Gb = a, Qa(a, this.ja)), this.ja = a, this.Cd || (this.Cd = a));
        a.Vc || ++this.ve
    };
    M.Ge = function (a) {
        this.xb === a && (this.xb = this.xb[ed]);
        a.Gb ? Qa(a.Gb, a[ed]) : this.ja = a[ed];
        a[ed] ? a[ed].Gb = a.Gb : this.Cd = a.Gb;
        Qa(a, m);
        a.Gb = m;
        Ia(a, h);
        a.Vc || --this.ve
    };
    M.yj = function (a, b) {
        this.Rg(a, b);
        gj(this.e, a)
    };
    M.xj = function (a) {
        return(a = this.mc(a)) ? this.si(a) : m
    };
    M.si = function (a) {
        this.Ge(a);
        a.Vo(32) ? this.Af[y](a) : this.Ki(a);
        return a
    };
    M.Sm = function (a) {
        for (var b = this.ja; b;) {
            var c = b, b = b[ed];
            !c.Vc && !a(c) && this.si(c)
        }
    };
    M.mc = function (a) {
        var b = this.hh(a);
        return b && b[Sc] == a ? b : m
    };
    M.forEach = function (a) {
        for (var b = this.ja; b;) {
            if (a(b))return l;
            b = b[ed]
        }
        return p
    };
    M.wl = function (a) {
        for (var b = this.ja; b;) {
            if (b[yc]() == a)return b;
            b = b[ed]
        }
        return m
    };
    M.wo = function () {
        return this.Cd ? s.max(0, this.Cd[Sc] + 1) : 0
    };
    M.Ki = function (a) {
        hj(this.e, a);
        a.L();
        Ia(a, h)
    };
    M.L = function () {
        for (; this.ja;) {
            var a = this.ja;
            this.Ge(a);
            this.Ki(a)
        }
    };
    M.rc = function () {
        for (var a = this.ja; a;)a.rc(), a = a[ed]
    };
    M.ho = function () {
        if (0 < this.Af[H]) {
            for (var a = 0; a < this.Af[H]; a++)this.Ki(this.Af[a]);
            this.Af = []
        }
    };
    M.Rm = function (a) {
        this.e = a.e;
        for (a = this.ja; a;)gj(this.e, a), a = a[ed]
    };
    M.Ei = function (a, b) {
        this.e && (hj(this.e, a), b && gj(this.e, a, b))
    };
    M.Ci = function (a, b) {
        b < a && (b = a = b);
        var c = this.hh(a), d = this.hh(b);
        c && c[Sc] == a ? this.Ge(c) : c = m;
        d && d[Sc] == b ? this.Ge(d) : d = m;
        c && this.Rg(c, b);
        d && this.Rg(d, a)
    };
    M.nn = function (a) {
        var b = s.min(-16384, this.ja[Sc]) - 1;
        this.Ge(a);
        this.Rg(a, b)
    };
    M.$g = function () {
        return this.ve
    };
    M.Id = function (a) {
        if (0 > a || a >= this.ve)return m;
        if (a <= this.ve - a) {
            for (var b = this.ja; 1 <= a;)b = b[ed], b.Vc || --a;
            for (; b.Vc;)b = b[ed]
        } else {
            b = this.Cd;
            for (a = this.ve - 1 - a; 1 <= a;)b = b.Gb, b.Vc || --a;
            for (; b.Vc;)b = b.Gb
        }
        return b
    };
    M.Ie = function (a) {
        for (var b = 0, c = this.ja; c; c = c[ed]) {
            if (c == a)return b;
            c.Vc || ++b
        }
    };
    M.Gd = function (a, b) {
        var c = this.Id(b - 1);
        Ia(a, NaN);
        this.Yl(a, c)
    };
    M.zf = function (a) {
        this.Ge(a)
    };
    var gj = function (a, b, c) {
        if (a && (c = N(c) ? c : b[yc]())) {
            var d = b.a.G();
            b = b.Z() ? b.e : a;
            d.Sj(a, c, b)
        }
    }, hj = function (a, b) {
        if (a) {
            var c = b[yc]();
            if (c) {
                var d = b.a.G(), e = b.Z() ? b.e : a;
                d.Tj(a, c, e)
            }
        }
    }, ej = function (a) {
        this.t = a;
        this.te = []
    };
    M = ej[I];
    M.Yj = function () {
        this.ca || (this.ca = r[J]("http://www.w3.org/2000/svg", "g"));
        return this.ca
    };
    M.lc = function (a) {
        this.en();
        for (var b = [], c = this.t.ja, d = m; c;) {
            for (var e = c.B; 0 < b[H] && c[Sc] > b[b[H] - 1].Re;)b.pop();
            e.lc(a);
            e.dn(b);
            this.te[y](c);
            e = e.Tc();
            d = d ? d[ed] : this.ca[Ic];
            d != e && (this.ca.insertBefore(e, d), d = e);
            c.Hj() && !(c instanceof ij) && b[y](c);
            c = c[ed]
        }
        for (d = d ? d[ed] : this.ca[Ic]; d;)a = d, d = d[ed], this.ca[Zd](a)
    };
    M.Kb = function (a) {
        for (var b = "", c = this.t.ja; c;)b += c.B.tn(a), c = c[ed];
        return b
    };
    M.Tc = function () {
        return this.ca
    };
    M.en = function () {
        for (var a = this.te[H] - 1; 0 <= a; --a) {
            var b = this.te[a], c = b.B;
            b.Wd() && (c.L(), this.ca[Zd](c.Tc()))
        }
        this.te = []
    };
    M.L = function () {
        for (var a = 0; a < this.te[H]; ++a)this.te[a].B.L()
    };
    var jj = function (a, b, c) {
        this.a = a;
        Ba(this, b);
        this.Re = h;
        this.wh = "";
        this.Ja = m;
        Qa(this, m);
        this.Gb = m;
        this.nh = this.N = 0;
        this.wa = 15;
        this.Sa = [];
        this.vh = m;
        this.Se = l;
        this.qj = 0;
        this.cg = h;
        this.kc = Bh;
        this.Vd = m;
        this.Oa = Gh;
        this.s(4);
        this.gc = this.Oa;
        this.Uf = Gh;
        this.Gc = this.Wf = m;
        this.dg = p;
        this.xh = m;
        this.bf();
        this.e = c || this.Ca();
        q[E](this.e, "__swiffy_d", {value: this})
    };
    M = jj[I];
    M.bf = function () {
    };
    M.cf = function () {
        var a = this.Ja;
        if (a) {
            if (this.N & 4 || a.N & 4096)a = a.gc.zk(this.Oa), this.nc() ? (this.Uf = a, this.gc = Gh) : (this.Uf = Gh, this.gc = a), this.s(4096)
        } else this.N & 4 && (this.gc = this.Oa, this.s(4096));
        this.ji(function (a) {
            a.cf()
        })
    };
    M.Ua = function () {
        this.wa & 1 && (this.Zn = this.Ja ? this.kc[ie](this.Ja.Ua()) : this.kc, this.wa ^= 1);
        return this.Zn
    };
    M.ic = function () {
        this.wa & 2 && (this.qo = this.Ua().ng(), this.wa ^= 2);
        return this.qo
    };
    M.ji = function () {
    };
    M.map = function (a) {
        return a(this)
    };
    M.ia = function () {
        this.Fp = l
    };
    M.Wj = function () {
        return!!this.Fp
    };
    M.setTransform = function (a) {
        this.kc != a && (this.s(1), this.kc = a, this.Vd = m, this.Jg(), this.Ja && this.Ja.wb())
    };
    M.Ab = function () {
        this.Vd || (this.Vd = this.kc.Xo());
        return this.Vd
    };
    M.Ee = function () {
        var a = this.Vd;
        a && (this[sc](Eh(a, this.kc.k, this.kc.l)), this.Vd = a)
    };
    M.$a = function () {
        var a = this.Bb().Ec();
        if (a.Aa())return 0;
        a = a.J();
        a.F(this.na());
        return(a.C - a.i) / 20
    };
    M.Nl = function (a) {
        if (0 <= a) {
            var b = this.$a(), c = this.na();
            0 == b ? (b = this.Bb().Ec()[Kb]() / 20, 0 == b && (b = 1), this[sc](new Ah(a / b, c.o, 0, c.g, c.k, c.l))) : (0 == a && (a = 1 / 1024), this[sc](c.gf(a / b, 1).$d(c.k, c.l)))
        }
    };
    M.Yh = function () {
        var a = this.Bb().Ec();
        if (a.Aa())return 0;
        a = a.J();
        a.F(this.na());
        return(a.A - a.h) / 20
    };
    M.Ml = function (a) {
        if (0 <= a) {
            var b = this.Yh(), c = this.na();
            0 == b ? (b = this.Bb().Ec()[Ge]() / 20, 0 == b && (b = 1), this[sc](new Ah(c.m, 0, c.d, a / b, c.k, c.l))) : (0 == a && (a = 1 / 1024), this[sc](c.gf(1, a / b).$d(c.k, c.l)))
        }
    };
    M.Jg = function () {
        this.wa |= 3;
        this.s(2048);
        this.ji(function (a) {
            a.Jg()
        });
        0 < this.Sa[H] && this.wb()
    };
    M.wb = function () {
        this.wa |= 4;
        this.s(16384);
        this.Ja && this.Ja.wb()
    };
    M.Wn = function () {
        this.wa |= 8;
        this.wb()
    };
    M.na = function () {
        return this.kc
    };
    M.Hj = function () {
        return N(this.Re)
    };
    M.ph = function (a) {
        this.Re != a && (this.s(32768), this.Re = a)
    };
    M.Va = function () {
        return this.qj
    };
    M.s = function (a) {
        (this.N & a) != a && (this.N |= a, this.nh |= a, this.Ja && this.Ja.s(65536))
    };
    M.tg = function (a) {
        this.qj = a
    };
    M.L = function () {
        this.cg = l
    };
    M.rc = function () {
    };
    M.Db = function (a) {
        this.Oa.Ad(a) || (this.s(4), this.Oa = a)
    };
    M.Sk = function (a) {
        a != this.nc() && (this.s(8192), this.s(4))
    };
    M.bg = function (a) {
        var b = this.nc();
        this.Hl = a;
        this.Sk(b)
    };
    M.nc = function () {
        return!this.Hl && 0 < this.Sa[H] ? 1 : this.Hl
    };
    M.sf = function (a) {
        if (this.Wf != a) {
            this.s(32768);
            var b = this.Wf;
            this.Gc && this.Gc.sf(m);
            b && (b.Gc = m, b.s(32768), b.Jg());
            a && (a.sf(m), a.ph(h), a.Gc && a.Gc.sf(m), a.Gc = this, a.s(32768), a.Jg());
            this.Wf = a
        }
    };
    M.Zd = function (a) {
        if (this.Sa != a && (0 < this.Sa[H] || 0 < a[H])) {
            var b = this.nc();
            this.s(2);
            this.Sa = a;
            this.Wn();
            this.Sk(b)
        }
    };
    M.Cj = function () {
        if (this.wa & 8) {
            this.vh = new Ih(0, 0, 0, 0);
            for (var a = 0; a < this.Sa[H]; a++)this.vh.add(this.Sa[a].Nf());
            this.wa ^= 8
        }
        return this.vh
    };
    M.Ta = function (a) {
        a = w(a);
        a != this.wh && this.Ja && this.Ja.Ei(this, a);
        this.wh = a
    };
    M.getName = function () {
        return this.wh
    };
    M.ae = function (a) {
        (this.Ja = a) && this.N && a.s(65536)
    };
    M.getParent = function () {
        return this.Ja
    };
    M.dm = function () {
        for (var a = [], b = this; b; b = b[Ab]())a[y](b);
        return a
    };
    M.Zk = function () {
        return this.a[xe](this)
    };
    M.uk = function () {
        for (var a = "", b = this; b && b[yc]();)a = "." + b[yc]() + a, b = b[Ab]();
        b && b[Ab]() == b.a && (a = "_level" + (b[Sc] - -16384) + a);
        return a
    };
    M.sm = function (a) {
        this.Se != a && (this.s(8), this.Se = a)
    };
    M.Z = function () {
        return p
    };
    M.xp = function () {
        return this.cg === p
    };
    M.Wd = function () {
        return this.cg === l
    };
    M.Lb = 2097152;
    M.Ye = function (a) {
        this.Lb |= a
    };
    M.xm = function (a) {
        this.Lb &= ~a
    };
    M.fireEvent = function (a, b) {
        var c = p;
        this.Lb & a[Uc] && ((c = this.Xh(a[Uc])) && c[Jc] && this.a.qd().Rj(c[Jc]), c = this.a.G()[pe](this.e, c, a, b));
        return c
    };
    M.Xh = function () {
        return m
    };
    M.Vo = function (a) {
        return!!this.Xh(a, l)
    };
    M.Bb = function () {
        if (this.wa & 4) {
            this.ri = this.we();
            if (0 < this.Sa[H]) {
                var a = this.ri.ub.J();
                a.F(this.Ua());
                a.add(this.Cj());
                a.F(this.ic());
                this.ri.hn(a)
            }
            this.wa ^= 4
        }
        return this.ri
    };
    M.Q = function (a, b) {
        this.cg = p;
        this.a.G().pk(this, a, b)
    };
    M.of = function () {
    };
    M.ci = function (a) {
        this.xh = a
    };
    M.Am = function () {
        var a = this.Bb().ub.J();
        a.F(this.Ua());
        var b = new Ih(0, 0, 20 * this.a.Rd, 20 * this.a.Qd);
        b.add(this.Cj().Mm());
        a.Lm(b);
        return a
    };
    M.Ag = function () {
        return this.a.G().Ag(this)
    };
    M.Kj = function (a) {
        this.dg = a
    };
    mb(M, function (a) {
        for (; a && a != this;)a = a[Ab]();
        return a == this
    });
    var kj = function (a) {
        this.b = a;
        this.Xd = this.ib = this.ce = this.tb = m;
        this.Lh = [];
        this.de = [];
        this.Ve = 1;
        this.Ha = [];
        this.Bh = this.wg = p;
        this.Zb = m
    };
    M = kj[I];
    M.Tc = function () {
        return this.ca
    };
    M.Hk = function (a) {
        return Vh(a, this.b.gc)
    };
    M.lc = function (a) {
        a & 4 && this.ki();
        if (this.b.N) {
            var b;
            this.b.N & 32768 ? (b = this.b.Hj() || this.b.Gc != h, this.wg != b && (a |= 4, this.wg = b, this.ki())) : b = this.wg;
            b ? this.jn(a) : this.hb(a);
            this.b.N = 0
        }
    };
    M.jn = function () {
        if (!this.ca) {
            this.ca = r[J]("http://www.w3.org/2000/svg", "clipPath");
            this.ca.id = this.Gg();
            var a = r[J]("http://www.w3.org/2000/svg", "path");
            this.ca[x](a)
        }
        var a = Bh, b = this.b.Gc, c = this.b[Ab]();
        b && b[Ab]() != c && (a = a[ie](c.Ua()));
        b = this.Kb(a);
        a = this.ca[Ic];
        a[F]("d", b || "M 0 0")
    };
    M.hb = function (a) {
        this.ca || (this.ca = this.pc = this.Oc(a), this.nf && (this.pc.id = this.nf));
        a & 1 && (this.b instanceof lj || (this.pg()[Wd].pointerEvents = "visiblePainted"));
        a = this.b.N;
        a & 8 && this.pc[F]("display", this.b.Se ? "inline" : "none");
        a & 4096 && (a |= 8192);
        a & 8192 && this.Jm() && (a |= 2);
        a & 1 && this.pc[F]("transform", this.Ph());
        if (a & 2) {
            if (a |= 4096, mj) {
                var b = "SourceGraphic";
                this.tb && (og(this.tb), this.de = []);
                this.Ve = 1;
                for (var c = this.b.Sa, d = 0; d < c[H]; ++d) {
                    var e = c[d].tc(this);
                    this.de[y](e);
                    e[L](b);
                    b = e[zd]();
                    this.Ve = s.max(this.Ve,
                        c[d].Mj())
                }
                this.ce && (c = this.ce.tc(this), c[L](b), this.de[y](c));
                this.Nj();
                this.ib && (0 < this.tb[Zc][H] ? this.ib[F]("filter", "url(#" + this.tb.id + ")") : this.ib[Ce]("filter"))
            }
        } else this.tb && (a & 2048 || a & 16384) && this.Nj();
        this.Km();
        a & 4096 && this.Rh()
    };
    M.pg = function () {
        return this.ca
    };
    M.Kb = function () {
        return""
    };
    M.tn = function (a) {
        if (this.b.N)return this.Zb = m, this.b.N = 0, this.Kb(a);
        this.Zb == m && (this.Zb = this.Kb(a));
        return this.Zb
    };
    M.Ph = function () {
        return this.b.kc[od]()
    };
    var nj = function (a) {
        var b = r[J]("http://www.w3.org/2000/svg", "g");
        qg(b, a);
        b[x](a);
        return b
    };
    M = kj[I];
    M.dn = function (a) {
        if (!this.wg) {
            var b = 0, c = this.Lh;
            a = a[Ob](0);
            var d = this.b.Wf;
            d && a[y](d);
            for (var d = s.min(c[H], a[H]), e = this.Xd; b < d;)c[b] != a[b] && e[F]("clip-path", "url(#" + a[b].B.Gg() + ")"), e = e[Ic], ++b;
            if (a[H] > d) {
                d = a[H];
                0 == b && (e ? (c = e, e = e[Ic]) : (e = this.ca, this.ca = this.Xd = c = nj(e)), c[F]("clip-path", "url(#" + a[b].B.Gg() + ")"), ++b);
                for (; b < d;)c = nj(e), c[F]("clip-path", "url(#" + a[b].B.Gg() + ")"), ++b
            } else if (c[H] > d) {
                d = c[H];
                0 == b && (e[Ce]("clip-path"), e = e[Ic], ++b);
                for (; b < d;)c = e[Ic], qg(c, e), e = c, ++b
            }
            this.Lh = a
        }
    };
    M.Gg = function () {
        N(this.nf) || (this.nf = ah.za().Ga(), this.pc && (this.pc.id = this.nf));
        return this.nf
    };
    M.L = function () {
        pg(this.tb)
    };
    M.ki = function () {
        this.L();
        this.ca = this.pc = this.Xd = this.tb = m;
        this.de = [];
        this.Ha = [];
        this.Lh = [];
        this.Zb = m;
        this.b.N = this.b.nh
    };
    M.Xa = function () {
        this.tb == m && (this.tb = r[J]("http://www.w3.org/2000/svg", "filter"), this.tb.id = ah.za().Ga(), this.b.a.kd[x](this.tb), this.ib == m && (this.ib = r[J]("http://www.w3.org/2000/svg", "g"), qg(this.ib, this.ca), this.Xd == m && (this.Xd = nj(this.ca)), this.ib[x](this.Xd), this.ca = this.ib));
        return this.tb
    };
    M.Nj = function () {
        var a = this.b[Ab]().ic(), b = this.b.Am(), c = this.Xa();
        if (b.Aa())c[F]("width", 0), c[F]("height", 0); else {
            var d = s[Ub]((b.C - b.i) / 20), e = s[Ub]((b.A - b.h) / 20), g = d, k = e;
            5E4 < d * e && (g = s[Xb](g / this.Ve), k = s[Xb](k / this.Ve));
            b = b.J();
            b.F(a);
            c[F]("filterUnits", "userSpaceOnUse");
            c[F]("x", b.i);
            c[F]("y", b.h);
            c[F]("width", b.C - b.i);
            c[F]("height", b.A - b.h);
            g < d ? c[F]("filterRes", g + " " + k) : c[Ce]("filterRes")
        }
    };
    M.Km = function () {
        for (var a = this.de, b = 0; b < a[H]; ++b)a[b].lc()
    };
    M.Jm = function () {
        var a = this.b, b = a.Uf;
        1 <= a.nc() ? this.pc[F]("enable-background", "new") : this.ib && this.pc[Ce]("enable-background");
        if (1 < a.nc() || 1 == a.nc() && !b.vj()) {
            if (!this.ce)return this.ce = new oj(a.nc()), this.ib && this.ib[Ce]("opacity"), l
        } else {
            a = b.M[Sb](3);
            if (1 != a || this.ib)this.Xa(), this.ib[F]("opacity", a);
            if (this.ce)return this.ce = m, l
        }
        return p
    };
    M.ee = function (a, b, c) {
        this.Ha[y](function () {
            var d = this.Hk(c);
            a[F](b, d[od]());
            a[F](b + "-opacity", d.od[Sb](3))
        })
    };
    M.Rh = function () {
        for (var a = this.Ha, b = 0; b < a[H]; ++b)a[b][K](this);
        if (a = this.de)for (b = 0; b < a[H]; ++b)a[b].Rh()
    };
    var pj = function () {
        $a(this, [])
    }, rj = function (a, b, c, d) {
        jj[K](this, a, b, d);
        this.Jb = 1;
        this.qg = p;
        this.Sb = {};
        this.Zf = c ? c : ah.za().Ga()
    };
    Q(rj, jj);
    M = rj[I];
    M.Lb = rj[I].Lb | 2096896;
    M.Xh = function (a, b) {
        var c = this.Sb[a];
        return c && (!b || c[Dd][H]) ? c : m
    };
    M.kk = function (a) {
        var b = this.Sb[a];
        b || (b = new pj, this.Sb[a] = b);
        return b
    };
    M.zj = function (a, b, c) {
        var d = this.a.G(), e;
        for (e in dj) {
            var g = dj[e];
            if (a & g) {
                this.Ye(g);
                var k = this.kk(g), n = {};
                n.Th = new sj(c, d.Um(this));
                g & 1048576 && (n.Oj = function (a) {
                    return a.getKey().Vm() == b
                }, db(n, l));
                k[Dd][y](n);
                g & 130816 && this.hf()
            }
        }
    };
    M.on = function (a, b) {
        for (var c in dj) {
            var d = dj[c];
            a & d && (this.kk(d).sound = b)
        }
    };
    M.isEnabled = function () {
        return this.qg && this.e.enabled != p && !this.Wd()
    };
    M.hf = function () {
        this.qg || (this.s(256), this.qg = l)
    };
    M.Na = function (a) {
        this.Jb != a && (this.Jb = a)
    };
    M.trackAsMenu = function () {
        return p
    };
    M.cm = function (a) {
        if (this[ce]()) {
            var b;
            this.a.isCaptured() == p && 1 == this.Jb ? (this.Na(2), b = 512) : this[ve]() && this.a.Cg() == p && 1 == this.Jb ? (this.Na(4), b = 16384) : this.a.Bg(this) && 2 == this.Jb && (this.Na(4), b = 65536);
            b && this[pe](new cj(b, a))
        }
    };
    M.bm = function (a) {
        if (this[ce]()) {
            var b;
            this.a.isCaptured() == p && 2 == this.Jb ? (this.Na(1), b = 256) : this[ve]() && this.a.Cg() == p && 4 == this.Jb ? (this.Na(1), b = 8192) : this.a.Bg(this) && 4 == this.Jb && (this.Na(2), b = 32768);
            b && this[pe](new cj(b, a))
        } else this.Na(1)
    };
    M.Ce = function () {
        this[ce]() ? (this[ve]() ? this.a[Tb](this) : this.a[Tb](this, l, ef(this.fn, this)), this.Na(4), this[pe](new cj(4096))) : this.Na(1)
    };
    M.De = function () {
        if (this[ce]()) {
            var a = this[ve]() && this.a.Cg() == p || this.a.Bg(this);
            this.a[jd](this);
            this.Na(2);
            a ? this[pe](new cj(2048)) : this[pe](new cj(512))
        } else this.Na(1)
    };
    M.fn = function () {
        this[ce]() && (this.Na(1), this[pe](new cj(1024)))
    };
    var tj = function (a) {
        kj[K](this, a);
        this.Qb = []
    };
    Q(tj, kj);
    M = tj[I];
    M.hb = function (a) {
        tj.r.hb[K](this, a);
        if (this.b.N & 256 && this.b.qg) {
            a = this.pg();
            var b;
            "createTouch"in r ? (b = Eg(a, "touchmove", this.Uh, p, this), this.Qb[y](b), b = Eg(a, "touchstart", this.Vh, p, this)) : b = Eg(a, "mousemove", this.Xm, p, this);
            this.Qb[y](b)
        }
    };
    M.Xm = function (a) {
        this.b.a.Qc(this.b, a);
        a[Nd]()
    };
    M.Uh = function () {
        this.b.a.Bg(this.b) && (this.b[pe](new cj(8192)), this.b.a[jd](this.b.a))
    };
    M.Vh = function (a) {
        1 == a.Pc.touches[H] && (this.b.a.Om(this.b, a), a[Nd]())
    };
    M.L = function () {
        tj.r.L[K](this);
        for (var a = 0; a < this.Qb[H]; a++)Jg(this.Qb[a])
    };
    var lj = function (a, b, c, d) {
        rj[K](this, a, b, c, d);
        this.t = new fj(this.e)
    };
    Q(lj, rj);
    M = lj[I];
    M.L = function () {
        lj.r.L[K](this);
        this.t.L();
        this.s(16)
    };
    M.we = function () {
        var a = new bj;
        this.t[Kc](function (b) {
            var c = b.Bb().J();
            c.F(b.na());
            a.ue(c)
        });
        return a
    };
    M.map = function (a) {
        var b = lj.r.map[K](this, a);
        return b = b || this.t[Kc](function (b) {
            return b.map(a)
        })
    };
    M.ji = function (a) {
        this.t[Kc](a)
    };
    M.Z = function () {
        return l
    };
    M.eo = function (a) {
        return this.t.wl(a)
    };
    M.fb = function (a, b) {
        this.s(16);
        var c = a[Ab]();
        c && c[Zd](a);
        a.ae(this);
        this.t.yj(a, b);
        this.wb();
        this.Ak(a, c)
    };
    M.removeChild = function (a) {
        this.s(16);
        this.t.si(a);
        a.rc();
        a.ae(m);
        this.wb()
    };
    M.rn = function () {
        for (var a = this.t.ja; a;)this[Zd](a), a = this.t.ja
    };
    M.Fc = function (a) {
        this.s(16);
        if (a = this.t.xj(a))a.rc(), a.ae(m);
        this.wb()
    };
    M.mc = function (a) {
        return this.t.mc(a)
    };
    M.Ei = function (a, b) {
        this.t.Ei(a, b)
    };
    M.Ci = function (a, b) {
        this.s(16);
        this.t.Ci(a, b)
    };
    M.$g = function () {
        return this.t.$g()
    };
    M.Id = function (a) {
        return this.t.Id(a)
    };
    M.Ie = function (a) {
        return this.t.Ie(a)
    };
    M.Gd = function (a, b) {
        this.s(16);
        var c = a[Ab]();
        c && c.zf(a);
        a.ae(this);
        this.t.Gd(a, b);
        this.wb();
        this.Ak(a, c)
    };
    M.zf = function (a) {
        this.s(16);
        this.t.zf(a);
        a.ae(m);
        this.wb()
    };
    M.Ak = function (a, b) {
        b !== this && (a.xp() && a.Zk()) && a.map(function (a) {
            a[pe](new cj(2097152), l);
            return p
        })
    };
    var uj = function (a) {
        tj[K](this, a)
    };
    Q(uj, tj);
    uj[I].hb = function (a) {
        this.b.Sa[H] && (a |= 2);
        uj.r.hb[K](this, a);
        this.b instanceof vj ? a &= -2 : this.b[ce]() && this.b[Ab]() != this.b.a && (a |= 1);
        var b = this.b;
        b.N & 65552 && b.t.B.lc(a)
    };
    uj[I].Kb = function (a) {
        return this.b.t.B.Kb(this.b.na()[ie](a))
    };
    uj[I].L = function () {
        uj.r.L[K](this);
        this.b.t.B.L()
    };
    uj[I].Oc = function () {
        return this.b.t.B.Yj()
    };
    var vj = function (a, b, c, d) {
        lj[K](this, b, a, c, d);
        this.mf = new fj;
        this.B = new wj(this)
    };
    Q(vj, lj);
    M = vj[I];
    M.Q = function () {
        vj.r.Q[K](this);
        this.Qh(this.t, 1);
        this.Qh(this.mf, 8);
        this.hf();
        for (var a = 0; a < this[D][Dd][H]; a++) {
            var b = this[D][Dd][a];
            this.zj(b[Vb], b.key, b[Dd])
        }
        for (a = 0; a < this[D][Ec][H]; a++)b = this[D][Ec][a], this.on(b[Vb], b[Jc])
    };
    M.L = function () {
        vj.r.L[K](this);
        this.mf.L()
    };
    M.Na = function (a) {
        a != this.Jb && (this.Qh(this.t, a, this.Jb), this.a.Pd = l);
        vj.r.Na[K](this, a)
    };
    M.trackAsMenu = function () {
        return this[D][ve]
    };
    M.Qh = function (a, b, c) {
        this.s(16);
        var d = this[D][Sd];
        if (d) {
            if (N(c))for (var e = 0; e < d[H]; e++) {
                var g = d[e], k = g[Nc] & c, n = g[Nc] & b;
                k && !n && a.xj(g[Sc])
            }
            for (e = 0; e < d[H]; e++)if (g = d[e], k = g[Nc] & c, (n = g[Nc] & b) && !k)if (k = this.Zf + "." + g[D].id[od](36), g[D].$f() && (k = g[D].get().Fb(this.a, k)))k.Z() && 8 != b && k.Ta(this.a.af()), k.ae(this), k.Q(), a.yj(k, g[Sc]), g[Ne] && k[sc](g[Ne]), g[ze] && k.Zd(g[ze]), g[Gc] && k.bg(g[Gc]), g.Gj && k.Db(g.Gj)
        }
    };
    var wj = function (a) {
        tj[K](this, a)
    };
    Q(wj, uj);
    wj[I].Oc = function (a) {
        var b = wj.r.Oc[K](this, a), c = this.b.mf.B, d = c.Yj();
        a |= 1;
        this.b.mf[Kc](function (a) {
            a.cf()
        });
        c.lc(a);
        this.hi = d.cloneNode(l);
        ai(this.hi);
        a = r[J]("http://www.w3.org/2000/svg", "g");
        a[x](this.hi);
        a[x](b);
        return a
    };
    wj[I].pg = function () {
        return this.hi
    };
    wj[I].L = function () {
        wj.r.L[K](this);
        this.b.mf.B.L()
    };
    var ij = function (a, b, c, d) {
        rj[K](this, b, a, c, d);
        this.Zj = "normal";
        this.Yf = a.autoSize;
        this.$j = a[Ae];
        this.Te = 16777215;
        this.ak = a[Ae];
        this.$h = 0;
        this.bk = p;
        this.ai = a.editable;
        this.yh = a.oj;
        this.ck = "pixel";
        this.Ya = a.html;
        this.dk = a.maxChars;
        this.lg = a[Pd];
        this.ek = a.password;
        this.Pm = m;
        this.bi = a.selectable;
        this.fk = 0;
        this.nd = a[jc];
        this.gk = 0;
        this.Nh = a.wrap;
        this.Lc = xj(a[jc], a[Ge]);
        this.Ub = [];
        this.jc = [];
        this.B = new yj(this);
        this.Xf = a[dd].J();
        N(this.Wb) || (a = a[Lb], this.Jc(N(a) ? a : ""))
    };
    Q(ij, rj);
    M = ij[I];
    M.we = function () {
        return new bj(this.Xf)
    };
    M.Jc = function (a, b) {
        !b && (this.Ya && this.nd != this[D][jc]) && (this.s(64), this.nd = this[D][jc]);
        this.Wb != a && this.Nk(a)
    };
    M.Zo = function (a) {
        this.Ya != a && (this.s(64), this.Ya = a)
    };
    M.rm = function (a) {
        this.nd = 16777215 & a | this.nd & 4278190080;
        a = new zj;
        a.Vl(this.nd);
        this.ah(a)
    };
    M.km = function () {
        return this.nd & 16777215
    };
    M.dq = function (a) {
        this.Zj = a
    };
    M.eq = function (a) {
        this.$j = a
    };
    M.fq = function (a) {
        this.Te = 16777215 & a | this.Te & 4278190080
    };
    M.Kp = function () {
        return this.Te & 16777215
    };
    M.gq = function (a) {
        this.ak = a
    };
    M.hq = function (a) {
        this.$h = 16777215 & a | this.$h & 4278190080
    };
    M.Lp = function () {
        return this.$h & 16777215
    };

    M.iq = function (a) {
        this.bk = a
    };
    M.jq = function (a) {
        this.yh = a;
        this.Nk(this.Wb)
    };
    M.lq = function (a) {
        this.ck = a
    };
    M.mq = function (a) {
        this.dk = a
    };
    M.oq = function (a) {
        this.lg = a;
        this.jc = this.B.mg(this.Ub)
    };
    M.pq = function (a) {
        this.ek = a
    };
    M.qq = function (a) {
        this.fk = a
    };
    M.rq = function (a) {
        this.gk = a
    };
    M.Xg = function () {
        return this[D][Ed]
    };
    M.tq = function (a) {
        this.Nh = a;
        this.jc = this.B.mg(this.Ub)
    };
    M.nm = function (a) {
        this.s(32);
        this.Yf = a
    };
    M.qm = function (a) {
        this.bi = a
    };
    M.lj = function (a) {
        this.ai = a
    };
    M.Pl = function (a, b) {
        N(a) ? N(b) || (b = a + 1) : (a = 0, b = this.Wb[H]);
        for (var c = new zj, d, e = 0, g, k = p, n = 0; n < this.Ub[H]; n++)for (var v = this.Ub[n], A = 0; A < v[H]; A++) {
            var B = v[A];
            g = e + B[Lb][H] - 1;
            e < b && g >= a && (k ? (Ua(c, c[qd] == B[qd] ? c[qd] : m), za(c, c[jc] == B[jc] ? c[jc] : m), d = d == B[z] ? d : m, ya(c, c[dc] == B[dc] ? c[dc] : m), Za(c, 20 * c[Ad] == B[Ad] ? c[Ad] : m)) : (Ua(c, B[qd]), za(c, B[jc]), d = B[z], ya(c, B[dc]), Za(c, B[Ad] / 20), k = l));
            e = g + 1
        }
        d && oa(c, d.sd(l));
        return c
    };
    M.Np = function () {
        var a = new zj;
        a.Zl(this.Lc);
        return a
    };
    M.ah = function (a, b, c) {
        N(b) ? N(c) || (c = b + 1) : (b = 0, c = this.Wb[H]);
        for (var d = 0, e, g = 0; g < this.Ub[H]; g++)for (var k = this.Ub[g], n = 0; n < k[H]; n++) {
            var v = k[n];
            e = d + v[Lb][H] - 1;
            if (d < c && e >= b) {
                var A = s.max(d, b) - d, d = s.min(e + 1, c) - d;
                if (0 < A) {
                    var B = v.lf(v[Lb][re](0, A));
                    k[Ie](n, 0, B);
                    n++
                }
                d < v[Lb][H] && (B = v.lf(v[Lb][re](d)), k[Ie](n + 1, 0, B));
                ra(v, v[Lb][re](A, d));
                v.Hm(a);
                v.ef(this.a.Cb)
            }
            d = e + 1
        }
        this.jc = this.B.mg(this.Ub);
        this.s(128)
    };
    M.zp = function (a) {
        this.Lc.Zl(a)
    };
    M.Q = function () {
        ij.r.Q[K](this);
        this[D][Ed] && this.a.G().Xj(this[D][Ed], this, this[D][Lb])
    };
    M.L = function () {
        ij.r.L[K](this);
        this[D][Ed] && this.a.G().Vj(this[D][Ed], this)
    };
    M.Z = function () {
        return 6 <= this.a.Ba ? l : p
    };
    M.Nk = function (a) {
        this.s(32);
        this.Wb = a;
        this.Ub = [];
        this.Ya || (a = Aj(a));
        this.On(a, this.lg)
    };
    M.On = function (a, b) {
        var c = new Bj;
        Za(c, this[D][Ge]);
        if (this.yh && this[D][z]) {
            var d = this[D][z].get();
            d instanceof Cj && oa(c, d)
        } else this[D][z] && (d = this[D][z].get(), d instanceof Cj && (c.ie = d[G]));
        za(c, this.nd | 0);
        c.Nc = p;
        c.Ue = this[D][Fe];
        c[z] && (ya(c, c[z][dc]), Ua(c, c[z][qd]));
        this.Ya && this.Lc && (ya(c, !!this.Lc[dc]), Ua(c, !!this.Lc[qd]), Za(c, 20 * this.Lc[Ad]), d = this.Lc[jc], za(c, this.Lc.yg ? 4278190080 | d : c[jc]));
        var d = new Dj(c, this.a.Cb, b), e = a[Pb](/(&nbsp;)+/g, "&nbsp;")[Pb](/\r\n|\r|\n/g, "<br/>");
        c.ef(this.a.Cb);
        c =
            r[Dc]("div");
        c.innerHTML = e;
        for (e = 0; e < c[Zc][H]; e++)Ej(c[Zc][e], d);
        this.Ub = d.Kh;
        this.jc = this.B.mg(this.Ub)
    };
    var zj = function () {
        Ua(this, m);
        za(this, m);
        this.yg = p;
        oa(this, m);
        ya(this, m);
        Za(this, m)
    };
    zj[I].Vl = function (a) {
        za(this, a);
        this.yg = l
    };
    zj[I].Zl = function (a) {
        a[qd] != m && Ua(this, a[qd]);
        a[jc] != m && za(this, a[jc]);
        a[z] != m && oa(this, a[z]);
        a[dc] != m && ya(this, a[dc]);
        a[Ad] != m && Za(this, a[Ad]);
        this.yg = a.yg
    };
    var xj = function (a, b) {
        var c = new zj;
        Ua(c, p);
        ya(c, p);
        oa(c, "Arial");
        za(c, 16777215 & a);
        Za(c, N(b) ? b / 20 : m);
        return c
    }, Bj = function () {
        ra(this, "");
        oa(this, m);
        this.ie = "Times";
        Za(this, 0);
        Ua(this, p);
        this.Nc = m;
        ya(this, p);
        za(this, 0);
        this.Ue = 0;
        this.ff = this.link = m
    };
    M = Bj[I];
    M.lf = function (a) {
        var b = this.Ll();
        ra(b, a);
        return b
    };
    M.Hm = function (a) {
        a[qd] != m && Ua(this, a[qd]);
        a[jc] != m && za(this, 4278190080 | a[jc]);
        a[dc] != m && ya(this, a[dc]);
        a[Ad] != m && Za(this, 20 * a[Ad])
    };
    M.ef = function (a, b) {
        if (b && !this[z])this.ie = b; else if (!b && this[z] && (b = this[z].sd(l)), !this[z] || !(b == this[z].sd(l) && !!this[dc] == !!this[z][dc] && !!this[qd] == !!this[z][qd])) {
            var c = m;
            if (N(b) && a[b])for (var d = a[b], e = 0; e < d[H]; ++e) {
                if (!!this[dc] == !!d[e][dc] && !!this[qd] == !!d[e][qd]) {
                    oa(this, d[e]);
                    return
                }
                c || (c = d[e])
            }
            c && oa(this, c)
        }
    };
    M.Ll = function () {
        var a = new Bj;
        oa(a, this[z]);
        a.ie = this.ie;
        Za(a, this[Ad]);
        Ua(a, this[qd]);
        a.Nc = this.Nc;
        ya(a, this[dc]);
        za(a, this[jc]);
        a.Ue = this.Ue;
        a.link = this.link;
        a.ff = this.ff;
        return a
    };
    M.$a = function (a) {
        N(a) || (a = this[Lb]);
        if (this[z] && this[z][Rd][H]) {
            for (var b = 0, c = 0; c < a[H]; c++)var d = this[z].Jf(a[$b](c)), b = N(d) ? b + (d[se] ? d[se] : 0) : b + 0;
            return b * this[Ad] / this[z][bd]
        }
        return this.qp(a)
    };
    M.qp = function (a) {
        var b = r[Dc]("div");
        b[x](r[ac](a));
        Wa(b[Wd], "absolute");
        qa(b[Wd], "auto");
        b[Wd].fontSize = this[Ad] + "px";
        this[z] ? (b[Wd].fontFamily = "'" + this[z][G] + "'", b[Wd].fontWeight = this[z][qd] ? "bold" : "normal", b[Wd].fontStyle = this[z][dc] ? "italic" : "normal") : (b[Wd].fontFamily = "'" + this.ie + "'", b[Wd].fontWeight = this[qd] ? "bold" : "normal", b[Wd].fontStyle = this[dc] ? "italic" : "normal");
        b[Wd].whiteSpace = "nowrap";
        r[Xd][x](b);
        a = b.clientWidth;
        pg(b);
        return a
    };
    var Fj = function (a, b) {
        return a[Pb](/<[^>]+>|&[^;]+;/g, function (a) {
            switch (a) {
                case "&amp;":
                    return"&";
                case "&lt;":
                    return"<";
                case "&gt;":
                    return">";
                case "&quot;":
                    return'"';
                case "&apos;":
                    return"'";
                case "&nbsp;":
                    return" ";
                case "</p>":
                case "<br>":
                case "<br/>":
                    return b ? "\n" : ""
            }
            return""
        })
    }, Gj = function (a) {
        return a[Pb](/[<>&]/g, function (a) {
            switch (a) {
                case "&":
                    return"&amp;";
                case "<":
                    return"&lt;";
                case ">":
                    return"&gt;"
            }
            return a
        })
    }, Aj = function (a) {
        return a[Pb](/[&<>"'\u02c6\u02dc]/g, function (a) {
            switch (a) {
                case "&":
                    return"&amp;";
                case "<":
                    return"&lt;";
                case ">":
                    return"&gt;";
                case "'":
                    return"&apos;";
                case '"':
                    return"&quot;";
                case "\u02c6":
                    return"&#710;";
                case "\u02dc":
                    return"&#732;"
            }
            return a
        })
    }, Hj = function (a) {
        for (var b = /\s*<p(?: [^>]*)?>.*?<\/p>\s*/ig, c = 0, d = b[Jb](a), e = ""; d;)d[Bd] > c && (e += "<p>" + a[re](c, d[Bd]) + "</p>"), e += d[0], c = b.lastIndex, d = b[Jb](a);
        a[H] > c && (e += "<p>" + a[re](c) + "</p>");
        return e
    }, Ej = function (a, b) {
        switch (a[Rb]) {
            case Node.ELEMENT_NODE:
                var c = a[oc][Pe]();
                b.tp(c, a);
                for (var d = 0; d < a[Zc][H]; d++)Ej(a[Zc][d], b);
                b.sp(c);
                break;
            case Node.TEXT_NODE:
                b.rp(a[C])
        }
    };
    ij[I].Op = function () {
        for (var a = 0, b = 0; b < this.jc[H]; b++)var c = this.jc[b], d = Ij(c), c = Jj(c), a = a + c * d;
        return a + 40
    };
    var Ij = function (a) {
        for (var b = 0, c = 0; c < a[H]; c++)b = s.max(b, a[c][Ad]);
        return b
    }, Jj = function (a) {
        for (var b = 1, c = 0; c < a[H]; c++)b = a[c][z] && a[c][z].lineHeight ? s.max(b, a[c][z].lineHeight) : s.max(b, 1.14);
        return b
    };
    ij[I].Pp = function () {
        for (var a = 0, b = 0; b < this.jc[H]; b++) {
            for (var c = 0, d = this.jc[b], e = 0; e < d[H]; e++)c += d[e].$a(d[e][Lb]);
            a = s.max(a, c)
        }
        return a
    };
    var Dj = function (a, b, c) {
        this.He = [];
        this.Qa = a;
        this.Bc = [];
        this.Kh = [];
        this.Kh[y](this.Bc);
        this.Cb = b;
        this.multiline = c
    };
    M = Dj[I];
    M.Fe = function (a) {
        this.He[y](this.Qa.Ll());
        this.He[y](a)
    };
    M.yp = function (a) {
        this.He[this.He[H] - 1] == a && (this.He.pop(), this.Qa = this.He.pop())
    };
    M.tp = function (a, b) {
        switch (a) {
            case "p":
                this.Fe(a);
                var c = b[he]("align");
                c && (this.Qa.Ue = Kj(c));
                break;
            case "b":
                this.Fe(a);
                Ua(this.Qa, l);
                this.Qa.ef(this.Cb);
                break;
            case "i":
                this.Fe(a);
                ya(this.Qa, l);
                this.Qa.ef(this.Cb);
                break;
            case "u":
                this.Fe(a);
                this.Qa.Nc = l;
                break;
            case "a":
                this.Fe(a);
                if (c = b[he]("href"))this.Qa.link = c;
                if (c = b[he]("target"))this.Qa.ff = c;
                break;
            case "br":
            case "sbr":
                this.Vk();
                break;
            case "font":
                this.Fe(a), (c = b[he]("color")) && za(this.Qa, Wh(c)), (c = b[he]("face")) && this.Qa.ef(this.Cb, c), (c = b[he]("size")) &&
                    Za(this.Qa, 20 * c)
        }
    };
    M.sp = function (a) {
        switch (a) {
            case "p":
                this[Pd] && this.Vk()
        }
        this.yp(a)
    };
    M.Vk = function () {
        if (this.Bc[H]) {
            var a = this.Bc[H];
            do {
                a--;
                var b = this.Bc[a];
                ra(b, b[Lb][Pb](/\s+$/g, ""))
            } while (0 < a && !this.Bc[a][Lb][H])
        } else this.Bc[y](this.Qa.lf(""));
        this.Bc = [];
        this.Kh[y](this.Bc)
    };
    M.rp = function (a) {
        this.Bc[y](this.Qa.lf(a))
    };
    var yj = function (a) {
        kj[K](this, a)
    };
    Q(yj, kj);
    M = yj[I];
    M.hb = function (a) {
        var b = this.b.N;
        yj.r.hb[K](this, a);
        b & 224 && (og(this.Eh), this.Wm(this.b.jc, this.Eh));
        for (a = this.rj; a < this.Ha[H]; ++a)this.Ha[a][K](this)
    };
    M.mg = function (a) {
        var b = this.Ej(this.b[D], this.b.Xf);
        a = a[Ob]();
        if (!this.b.lg && !this.b.Ya) {
            var c = [];
            c[y](t[I][Zb][L]([], a));
            a = c
        }
        this.b.Nh && (a = this.pn(a, b));
        return a
    };
    M.Ej = function (a, b) {
        return b.C - b.i - 80 - a[Je] - a[$c]
    };
    M.pn = function (a, b) {
        var c = [], d = 0;
        c[d] = [];
        for (var e = 0; e < a[H]; e++) {
            for (var g = a[e], k = 0, n = 0; n < g[H]; n++)for (var v = this.Po(g[n], k, b), A = 0; A < v[H]; A++) {
                var B = g[n].lf(v[A]);
                c[d][y](B);
                A == v[H] - 1 ? k += B.$a() : (d++, c[d] = [])
            }
            d++;
            c[d] = []
        }
        0 == c[d][H] && c.pop();
        return c
    };
    M.Po = function (a, b, c) {
        for (var d = [], e = 0, g = d[0] = "", k = 0, n = a[Lb][Jd](" "), v = 0; v < n[H]; v++)if (!(0 < e && 0 == b && "" == n[v])) {
            n[v] = n[v][Pb](/&nbsp;/g, " ");
            var A = a.$a(n[v]);
            b + k + A > c ? A < c && 0 < v ? (e++, b = A, d[e] = n[v]) : (!e && !d[e] ? d.pop() : b = 0, this.Wl(a, n[v], c, b, d), e = d[H] - 1, b = a.$a(d[e])) : (d[e] = d[e] + g + n[v], b += k + A);
            0 == v && (g = " ", k = a.$a("a a") - a.$a("aa"))
        }
        return d
    };
    M.Wl = function (a, b, c, d, e) {
        for (var g = 1, k = b[H]; k > g;) {
            var n = g + (k - g) / 2, n = s[Ub](n);
            a.$a(b[re](0, n)) <= c - d ? g = n : k = n - 1
        }
        e[y](b[re](0, g));
        g <= b[H] - 1 && this.Wl(a, b[re](g), c, 0, e)
    };
    M.Oc = function () {
        var a = this.b[D], b = this.b.Xf, c = r[J]("http://www.w3.org/2000/svg", "g");
        this.Ha = [];
        this.Eh = r[J]("http://www.w3.org/2000/svg", "g");
        this.Yb = r[J]("http://www.w3.org/2000/svg", "rect");
        this.Yb[F]("x", b.i);
        this.Yb[F]("y", b.h);
        this.Yb[F]("width", b.C - b.i);
        this.Yb[F]("height", b.A - b.h);
        a[Ae] ? (this.Yb[F]("stroke-width", "10"), this.ee(this.Yb, "fill", 4294967295), this.ee(this.Yb, "stroke", 4278190080)) : ai(this.Yb);
        c[x](this.Yb);
        c[x](this.Eh);
        this.rj = this.Ha[H];
        return c
    };
    M.Wm = function (a, b) {
        var c = this.b, d = c[D][Wb] | 0, e = c[D];
        this.Ha[Ie](this.rj, u[Hb]);
        var g = c.Xf, k = g.h + 40 - 0.5 * d;
        0 > d ? k = g.h : 0 > k && (k = g.h + 40);
        for (var n = this.Ej(e, g), v = 0; v < a[H]; v++) {
            var A = a[v], B = g.i + 40 + e[Je], P = n;
            0 == v && (B += e[wb], P -= e[wb]);
            for (var X = 0, la = Jj(A), jb = Ij(A), Ib = h, Na = 0; Na < A[H]; Na++)X += A[Na].$a(), Ib = A[Na].Ue;
            switch (Ib) {
                case 2:
                    B += (P - X) / 2;
                    break;
                case 1:
                    B = B + 40 + (P - X)
            }
            for (Na = 0; Na < A[H]; Na++)if (A[Na][Lb][H]) {
                g[Mb](g.i, k + la * jb);
                this.Yb[F]("height", g.A - g.h);
                var mc = 0;
                3 == Ib && v < a[H] - 1 && (X = (A[Na][Lb][vc](/ /g) || [])[H],
                    mc = (P - A[Na].$a()) / X);
                var qj = !A[Na][z] || !A[Na][z][Rd][H], X = m;
                Lj && !qj ? X = this.Em(A[Na], B, k, jb, mc) : (X = this.Fm(A[Na], B, k, jb, mc), qj || X[F]("unicode-bidi", "bidi-override"));
                if (A[Na].link)mc = r[J]("http://www.w3.org/2000/svg", "a"), mc[Wd].pointerEvents = "visible", mc[fc]("http://www.w3.org/1999/xlink", "href", A[Na].link), A[Na].ff && mc[F]("target", A[Na].ff), mc[x](X), b[x](mc); else b[x](X);
                B += A[Na].$a()
            }
            k += la * jb + d;
            if ("none" == c.Yf && k + la * jb > g.A)break
        }
    };
    M.Fm = function (a, b, c, d, e) {
        var g = r[J]("http://www.w3.org/2000/svg", "text");
        g[F]("fill-rule", "nonzero");
        g[F]("style", "white-space:pre");
        g[F]("font-size", a[Ad]);
        var k = a[Lb], n = a[z];
        if (n) {
            g[F]("font-family", "'" + n.sd() + "'");
            b = this.ol(a, n, b, e);
            if (b[H] < a[Lb][H]) {
                k = "";
                for (e = 0; e < a[Lb][H]; e++) {
                    var v = a[Lb][$b](e);
                    if (N(n.Jf(v)) || 160 == v || " " == v)k += v
                }
            }
            g[F]("x", b.map(function (a) {
                return a[Sb](2)
            })[Ke](" "));
            n[zb] && n[bd] ? g[F]("y", c + d * n[zb] / n[bd]) : g[F]("y", c + 0.9 * d);
            a[z][qd] && g[F]("font-weight", "bold");
            a[z][dc] && g[F]("font-style",
                "italic")
        } else g[F]("font-family", a.ie), g[F]("y", c + 0.9 * d), g[F]("x", b), a[qd] && g[F]("font-weight", "bold"), a[dc] && g[F]("font-style", "italic");
        g[x](r[ac](w(k)));
        a.Nc && g[F]("text-decoration", "underline");
        this.ee(g, "fill", a[jc]);
        return g
    };
    M.Em = function (a, b, c, d, e) {
        var g = a[z], k = c, n = r[J]("http://www.w3.org/2000/svg", "g");
        if (g && g[zb] && g[bd]) {
            b = this.ol(a, g, b, e);
            for (k = 0; k < a[Lb][H]; k++);
            var v = r[J]("http://www.w3.org/2000/svg", "path"), k = c + d * g[zb] / g[bd];
            c = this.hp(a, b, k, e);
            v[F]("d", c[od]());
            this.ee(v, "fill", a[jc]);
            n[x](v)
        }
        return n
    };
    M.hp = function (a, b, c) {
        for (var d = new Kh, e = a[Lb], g = a[z], k = a[Ad] / g[bd], n = 0, v = 0; v < e[H] && n < b[H]; v++) {
            var A = g.dl(e[$b](v));
            if (A) {
                var B;
                B = new Ah(k, 0, 0, k, b[n], c);
                A = A.F(B);
                d = d[Zb](A);
                a.Nc && (A = g.Jf(e[$b](v))[se], A = new Kh([0, 0, g[wd] / 2, 1, A, g[wd] / 2, 1, A, g[wd] / 2 + 400, 1, 0, g[wd] / 2 + 400, 3]), A = A.F(B), d = d[Zb](A));
                n++
            }
        }
        return d
    };
    M.ol = function (a, b, c, d) {
        var e = a[Lb];
        a = a[Ad];
        var g = [];
        g[y](c);
        if (b && b[Rd][H])for (var k = 1; k < e[H]; k++) {
            var n = b.Jf(e[$b](k - 1)), v = 0;
            N(n) && N(n[se]) && (v = n[se], c += v * a / b[bd], g[y](c), " " == e[$b](k) && (c += d))
        }
        return g
    };
    var Kj = function (a) {
        switch (a) {
            case "left":
                return 0;
            case "center":
                return 2;
            case "right":
                return 1;
            case "justify":
                return 3;
            default:
                return 0
        }
    };
    yj[I].Kb = function () {
        return""
    };
    var Mj = function (a, b, c) {
        a[F]("type", "linear");
        a[F]("slope", b);
        a[F]("intercept", c)
    }, Nj = function (a, b, c, d, e, g, k) {
        if (!(c == e && d == g) && (1 != c || 0 != d || b[Ee]))k(b, c, d / 255), b[Ee] || a[x](b)
    }, Oj = function (a) {
        var b = m, c = m, d = m, e = m, g = m, k = m, n = new Fh(1, 0, 1, 0, 1, 0, 1, 0);
        return function () {
            var v = this.b.gc;
            v.vj() ? (b && b[Ee] && (pg(b), a[Ce]("filter")), a[F]("opacity", v.M[Sb](3))) : (b || (b = r[J]("http://www.w3.org/2000/svg", "filter"), b.id = ah.za().Ga(), b[F]("x", "0%"), b[F]("y", "0%"), b[F]("width", "100%"), b[F]("height", "100%"), k = r[J]("http://www.w3.org/2000/svg",
                "feComponentTransfer"), b[x](k), c = r[J]("http://www.w3.org/2000/svg", "feFuncR"), d = r[J]("http://www.w3.org/2000/svg", "feFuncG"), e = r[J]("http://www.w3.org/2000/svg", "feFuncB"), g = r[J]("http://www.w3.org/2000/svg", "feFuncA"), g[F]("type", "linear")), a[Ce]("opacity"), b[Ee] || (a[x](b), a[F]("filter", "url(#" + b.id + ")")), Nj(k, c, v.X, v.U, n.X, n.U, Mj), Nj(k, d, v.W, v.T, n.W, n.T, Mj), Nj(k, e, v.V, v.S, n.V, n.S, Mj), Nj(k, g, v.M, v.Y, n.M, n.Y, Mj), n = v)
        }
    };
    var Li = function (a, b, c, d) {
        this.B = a;
        this.Fg = b;
        Oa(this, c);
        xa(this, d);
        this.Xc = 0;
        d.td || (this.Xc |= 512)
    };
    nb(Li[I], function () {
        this.Fg[F](this[G], this[cc].R(this)[od]())
    });
    Li[I].Va = function () {
        return this.B.b.Va() / 65535
    };
    var aj = function (a, b, c, d) {
        Li[K](this, a, b, c, d);
        this.Xc |= 2048
    };
    Q(aj, Li);
    nb(aj[I], function () {
        var a = this[cc].R(this), b = this.B.b.Ua(), b = 14 / ((b.Fh() + b.Gh()) / 2);
        this.Fg[F](this[G], a < b ? b : a)
    });
    var Ii = function (a, b, c, d) {
        Li[K](this, a, b, c, d);
        this.opacity = ("-color" == c[Ob](-6) ? c[Ob](0, -6) : c) + "-opacity";
        this.Xc |= 4096
    };
    Q(Ii, Li);
    nb(Ii[I], function () {
        var a = this[cc].R(this), a = this.B.b.gc[L](a);
        this.Fg[F](this[G], a[od]());
        this.Fg[F](this.opacity, a.od[Sb](3))
    });
    var Qj = function (a, b, c) {
        jj[K](this, b, a, c);
        this.B = new Pj(this)
    };
    Q(Qj, jj);
    Qj[I].we = function () {
        return this[D].we(this.Va())
    };
    Qj[I].tg = function (a) {
        a != this.Va() && (this.s(512), this.wb());
        Qj.r.tg[K](this, a)
    };
    var Pj = function (a) {
        kj[K](this, a);
        this.jg = [];
        this.kg = [];
        this.qf = [];
        this.Wa = this.ti = this.Hh = m
    };
    Q(Pj, kj);
    M = Pj[I];
    M.Oc = function (a) {
        this.Ha = [];
        for (var b = this.b, c = b[D], b = b.a.kd, d = c[Cc], e = 0; e < d[H]; e++)if (d[e]) {
            var g = d[e].sb(c[dd], this);
            g != m && (this.jg[e] = g, b[x](g))
        }
        d = c[xc];
        for (e = 0; e < d[H]; e++)d[e] && (g = d[e].sb(c[dd], this), g != m && (this.kg[e] = g, b[x](g)));
        this.Wa = this.Dm(a);
        this.Hh = r[J]("http://www.w3.org/2000/svg", "g");
        this.Bh = h;
        this.wj(a);
        return this.Hh
    };
    M.ln = function () {
        var a = this.b[D];
        if (!this.ti) {
            var b = r[J]("http://www.w3.org/2000/svg", "image");
            b[F]("width", a.Bj);
            b[F]("height", a.Aj);
            b[F]("x", a.Ih);
            b[F]("y", a.Jh);
            b[fc]("http://www.w3.org/1999/xlink", "href", a.Dh);
            Ti && b[F]("transform", "rotate(360)");
            this.ti = b
        }
        return this.ti
    };
    M.Dm = function () {
        for (var a = this.b[D], b = a[ue], c = [], d = 0; d < b[H]; d++) {
            var e = b[d], g = r[J]("http://www.w3.org/2000/svg", "path");
            this[F](g, "d", e[C], Li);
            e[ee] != m && (g = a[xc][e[ee]].Ed(this, e, g, this.kg[e[ee]], "stroke"));
            if (e[md] != m) {
                var k = a[Cc][e[md]], g = k.Ed(this, e, g, this.jg[e[md]], "fill");
                k.Mg && this.Ha[y](Oj(g))
            } else g[F]("fill", "none");
            c[y](g)
        }
        if (1 == c[H])g = c[0]; else {
            g = r[J]("http://www.w3.org/2000/svg", "g");
            for (d = 0; d < c[H]; d++)g[x](c[d])
        }
        return g
    };
    M.Kb = function (a) {
        var b = this.b[D], c;
        if (0 == this.b.Va())c = b.Kb(); else {
            c = new Kh;
            for (var d = 0; d < b[ue][H]; d++)if (b[ue][d][md] != m) {
                var e = b[ue][d][C].R(this);
                c = c[Zb](e)
            }
        }
        return c.di(this.b.na()[ie](a))
    };
    M.Va = function () {
        return this.b.Va() / 65535
    };
    M.zo = function (a) {
        a[L]();
        a.Xc && this.qf[y](a)
    };
    M.setAttribute = function (a, b, c, d) {
        d == Li && c.td ? a[F](b, c.R(m)[od]()) : this.zo(new d(this, a, b, c))
    };
    M.L = function () {
        Pj.r.L[K](this);
        for (var a = 0; a < this.jg[H]; a++)pg(this.jg[a]);
        for (a = 0; a < this.kg[H]; a++)pg(this.kg[a]);
        this.qf = []
    };
    M.mn = function (a, b) {
        var c = this.b.Ua(), d = c.Fh(), c = c.Gh();
        return d >= a && d <= b && c >= a && c <= b
    };
    M.wj = function (a) {
        var b = this.Hh;
        b && (a = Rj && 0 == (a & 1) && 0 == (a & 2) && this.b[D].Dh != m && this.b.gc.Ad(Gh) && this.mn(0.2, 1), this.Bh != a && (b[Ic] && b[Zd](b[Ic]), a ? b[x](this.ln()) : b[x](this.Wa), this.Bh = a))
    };
    M.hb = function (a) {
        var b = this.b.N;
        Pj.r.hb[K](this, a);
        this.wj(a);
        for (a = 0; a < this.qf[H]; a++)b & this.qf[a].Xc && this.qf[a][L]()
    };
    var Uj = function (a, b) {
        Qj[K](this, new Sj(-1, [], m, [], []), a, b);
        this.clear();
        this.uf = this.re = m;
        this.B = new Tj(this);
        this.ia()
    };
    Q(Uj, Qj);
    Uj[I].ua = function (a, b) {
        this[a][L](this, b)
    };
    Uj[I].duplicate = function () {
        var a = new Uj(this.a);
        Ba(a, Bf(this[D]));
        return a
    };
    Ma(Uj[I], function () {
        this[D].fillstyles = [];
        this[D].linestyles = [];
        this[D].paths = [];
        this.bc = this.cc = this.Yc = this.Zc = 0;
        this.s(1024);
        this.wb()
    });
    Uj[I].Kd = function (a) {
        var b = this.re, c = this.uf, d;
        c && (d = c);
        b && b != c && (d = b);
        if (d) {
            b = d[C][cc].O;
            for (c = 0; c < a[H]; c++)b[y](a[c]);
            this.s(1024);
            this.wb()
        }
    };
    Uj[I].moveTo = function (a, b) {
        N(a) && N(b) && (a *= 20, b *= 20, this.Kd([0, a, b]), this.bc = a, this.cc = b, this.Yc = a, this.Zc = b)
    };
    Uj[I].lineTo = function (a, b) {
        N(a) && N(b) && (a *= 20, b *= 20, a == this.bc && b == this.cc && !this.uf ? this.Kd([3]) : this.Kd([1, a, b]), this.Yc = a, this.Zc = b)
    };
    Uj[I].curveTo = function (a, b, c, d) {
        N(c) && N(d) && (N(a) && N(b)) && (c *= 20, d *= 20, this.Kd([2, 20 * a, 20 * b, c, d]), this.Yc = c, this.Zc = d)
    };
    Uj[I].drawRect = function (a, b, c, d) {
        N(a) && N(b) && (N(c) && N(d)) && (a *= 20, b *= 20, c *= 20, d *= 20, this.Kd([0, a, b, 1, a, b + d, 1, a + c, b + d, 1, a + c, b, 1, a, b]), this.bc = this.Yc = a, this.cc = this.Zc = b)
    };
    var Vj = s[Mc](2);
    Uj[I].drawEllipse = function (a, b, c, d) {
        if (N(a) && N(b) && N(c) && N(d)) {
            a *= 20;
            b *= 20;
            c *= 20;
            d *= 20;
            var e = c / Vj, g = d / Vj, k = c * (Vj - 1), n = d * (Vj - 1);
            this.Kd([0, a + c, b, 2, a + c, b + n, a + e, b + g, 2, a + k, b + d, a, b + d, 2, a - k, b + d, a - e, b + g, 2, a - c, b + n, a - c, b, 2, a - c, b - n, a - e, b - g, 2, a - k, b - d, a, b - d, 2, a + k, b - d, a + e, b - g, 2, a + c, b - n, a + c, b]);
            this.bc = this.Yc = a + c;
            this.cc = this.Zc = b
        }
    };
    Uj[I].drawRoundRect = function (a, b, c, d, e, g) {
        N(a) && N(b) && (N(c) && N(d) && N(e) && N(g)) && (e && g ? (e > c && (e = c), g > d && (g = d)) : e = g = 0, a *= 20, b *= 20, c *= 20, d *= 20, e *= 10, g *= 10, this.Kd([0, a + c, b + d - g, 2, a + c, b + d, a + c - e, b + d, 1, a + e, b + d, 2, a, b + d, a, b + d - g, 1, a, b + g, 2, a, b, a + e, b, 1, a + c - e, b, 2, a + c, b, a + c, b + g, 1, a + c, b + d - g]), this.bc = this.Yc = a + c, this.cc = this.Zc = b + d - g)
    };
    Uj[I].Bf = function (a, b, c, d) {
        var e = this[D][ue], g = e[e[H] - 1];
        a = new Wj(new ui(new Kh([0, a, b])), d, c);
        !g || !g[C][cc].Aa() ? e[y](a) : e[e[H] - 1] = a;
        return a
    };
    Uj[I].Vp = function (a) {
        var b = this.re, c = this.uf;
        if (c) {
            if (c[C][cc].Aa()) {
                b = c;
                b.line = a;
                this.re = b;
                return
            }
            b == c && (b = this.Bf(0, 0, c[ee], h), ua(b, c[C]), delete c[ee])
        }
        this.re = b = N(a) ? this.Bf(this.Yc, this.Zc, a, h) : m
    };
    Uj[I].kj = function (a) {
        var b = this.uf;
        b && b[C][cc].O[y](3);
        var c = this.re;
        !b || !c || c == b ? (b = N(a) ? this.Bf(this.bc, this.cc, h, a) : m, c && (b ? (b.line = c[ee], c = b) : c = this.Bf(this.bc, this.cc, c[ee], h))) : (b = c[C][cc].O, b[y](1), b[y](this.bc), b[y](this.cc), N(a) ? c = b = this.Bf(this.bc, this.cc, c[ee], a) : b = m);
        this.uf = b;
        this.re = c;
        this.Yc = this.bc;
        this.Zc = this.cc;
        this.s(1024)
    };
    Uj[I].lineStyle = function (a, b, c, d, e, g, k, n) {
        d = h;
        N(a) && (d = this[D][xc], e = {}, qa(e, [20 * a]), za(e, [Xh(b, c)]), e.cap = Xj(Xi, g, 0), e.joint = Xj(Yi, k, 0), N(n) && (e.miter = n), d[y](new Zi(m, e)), d = d[H] - 1);
        this.Vp(d)
    };
    var Xj = function (a, b, c) {
        return b && (a = a[hc](b), 0 <= a) ? a : c
    };
    Uj[I].beginFill = function (a, b) {
        if (N(a)) {
            var c = this[D][Cc], d = {type: 1};
            za(d, [Xh(a, b)]);
            c[y](new Hi(m, d));
            this.kj(c[H] - 1)
        } else this.kj()
    };
    Uj[I].endFill = function () {
        this.kj()
    };
    var Tj = function (a) {
        Pj[K](this, a)
    };
    Q(Tj, Pj);
    Tj[I].hb = function (a) {
        this.b.N & 1024 && this.ki();
        Tj.r.hb[K](this, a)
    };
    var Zj = function (a, b, c) {
        jj[K](this, b, a, c);
        this.B = new Yj(this)
    };
    Q(Zj, jj);
    Zj[I].we = function () {
        return new bj(this[D][dd])
    };
    var Yj = function (a) {
        kj[K](this, a);
        this.$e = p;
        this.b.s(1)
    };
    Q(Yj, kj);
    M = Yj[I];
    M.Oc = function () {
        return Lj ? this.Ap() : this.Bp()
    };
    M.Bp = function () {
        var a = this.Gp(), b;
        if (1 == a[H])b = a[0]; else {
            b = r[J]("http://www.w3.org/2000/svg", "g");
            for (var c = 0; c < a[H]; c++)b[x](a[c])
        }
        return b
    };
    M.Gp = function () {
        for (var a = this.b[D], b = [], c = 0; c < a[Sd][H]; c++) {
            var d = a[Sd][c], e = r[J]("http://www.w3.org/2000/svg", "text");
            e[x](r[ac](w(d[Lb])));
            d[z] && d[z].$f() && (e[F]("font-family", "'" + d[z].get().sd() + "'"), d[z].get()[qd] && e[F]("font-weight", "bold"), d[z].get()[dc] && e[F]("font-style", "italic"));
            e[F]("font-size", d[Ge]);
            e[F]("x", d.x[Ke](" "));
            e[F]("y", d.y);
            e[F]("fill-rule", "nonzero");
            e[F]("style", "white-space:pre");
            e[F]("unicode-bidi", "bidi-override");
            this.ee(e, "fill", d[jc]);
            b[y](e)
        }
        return b
    };
    M.Ap = function () {
        var a = r[J]("http://www.w3.org/2000/svg", "g");
        a[F]("fill-rule", "nonzero");
        a[F]("opacity", 1);
        var b = this.b[D], c = b[dd], d = r[J]("http://www.w3.org/2000/svg", "rect");
        c.Aa() ? (d[F]("x", 0), d[F]("width", 0), d[F]("y", 0), d[F]("height", 0)) : (d[F]("x", c.i), d[F]("width", c.C - c.i), d[F]("y", c.h), d[F]("height", c.A - c.h));
        ai(d);
        a[x](d);
        for (c = 0; c < b[Sd][H]; c++) {
            var d = b[Sd][c], e = this.Ij(d), g = r[J]("http://www.w3.org/2000/svg", "path");
            g[F]("d", e[od]());
            a[x](g);
            this.ee(g, "fill", d[jc])
        }
        return a
    };
    M.Kb = function (a) {
        for (var b = this.b[D][Sd], c = new Kh, d = 0; d < b[H]; d++)var e = this.Ij(b[d]), c = c[Zb](e);
        a = this.b[D][Qb][ie](this.b.na())[ie](a);
        return c.di(a)
    };
    M.Ij = function (a, b) {
        var c = new Kh, d = a[Lb], e = a[z] ? a[z].get() : m;
        if (e instanceof Cj)for (var g = a[Ge] / e[bd], k = 0; k < d[H]; k++) {
            var n = e.dl(d[$b](k));
            if (n)var v = new Ah(g, 0, 0, g, a.x[k], a.y), v = N(b) ? b[ie](v) : v, n = n.F(v), c = c[Zb](n)
        }
        return c
    };
    M.hb = function (a) {
        var b = this.b;
        if (b.N & 2048) {
            var c = b.Ua(), d = b.a.oh, e = b.Bb().ub.J();
            e.F(d);
            e.F(c);
            1 > e[Kb]() || 1 > e[Ge]() ? this.$e || (this.$e = l, b.N |= 1) : this.$e && (this.$e = p, b.N |= 1)
        }
        Yj.r.hb[K](this, a)
    };
    M.Ph = function () {
        return this.$e ? "scale(0)" : Yj.r.Ph[K](this) + " " + this.b[D][Qb][od]()
    };
    var ck = function (a, b, c, d) {
        lj[K](this, b, a, c, d);
        this.vg = p;
        this.kf = {};
        this.Jj();
        this.B = new ak(this);
        this.ge = m;
        this.a.Tm(this);
        this.uj = ef(bk, this)
    };
    Q(ck, lj);
    M = ck[I];
    M.Lb = ck[I].Lb | 127;
    M.Jj = function () {
        this.kl = [];
        this.ta = -1;
        this.Sg = p;
        this.ug = l;
        this.Qk = []
    };
    M.mi = function (a) {
        this.rc();
        this.rn();
        this.Jj();
        for (var b = this.e, c = q[Bb](b), d = 0; d < c[H]; ++d)delete b[c[d]];
        Ba(this, a);
        this.Hc = l;
        this.Q()
    };
    M.bf = function () {
        for (var a = this[D][gd], b = 0; b < a[H]; b++)for (var c = 0; a[b] && c < a[b][H]; ++c)a[b][c].bf(this)
    };
    M.Q = function (a, b) {
        this.Hc && this.Ye(128);
        ck.r.Q[K](this, a, b)
    };
    M.of = function () {
        ck.r.of[K](this);
        !this.vg && this.a.oa !== this && (this.vg = l, this[Qc](), this.Pj())
    };
    M.rc = function () {
        this.vg && (this.t.rc(), this[pe](new cj(32)), this.vg = p);
        ck.r.rc[K](this)
    };
    Ha(M, function () {
        this.Sg = l
    });
    M.om = function (a) {
        this.ug = a
    };
    M.ei = function () {
        this.t.ho();
        this.Sg && this.Pj()
    };
    M.Pj = function () {
        var a = this.ta + 1;
        if (a >= this[D][Td]) {
            if (this.a.oa === this && this.a.tm)return;
            a = 0
        }
        (0 != this[D][Td] || this.a.oa != this) && this.se(a)
    };
    Sa(M, function () {
        this.Sg = p
    });
    M.Sc = function (a, b) {
        0 <= a && (a >= this[D][Td] && (a = this[D][Td] - 1), this.se(a), this.Sg = b)
    };
    M.aq = function () {
        var a = this[D].ke.yo(this.ta);
        ja(a) && this.se(a);
        this[nd]()
    };
    M.Xp = function () {
        var a = this[D].ke.xo(this.ta);
        ja(a) && this.se(a);
        this[nd]()
    };
    M.wd = function (a, b) {
        var c = this[D].ke, d = h, e;
        if (N(b)) {
            if (e = c.il[b], e == h)return
        } else e = c.xl(this.ta);
        if ("string" == typeof a && (d = c.zg[a]) && c.xl(d) != e)return;
        d == h && (c = u(a) + e - 1, 0 <= c && c == s[Xb](c) && (d = c));
        return d
    };
    M.Zm = function (a) {
        return this[D][gd][a]
    };
    M.se = function (a) {
        if (a != this.ta)if (a > this.ta) {
            for (; a > ++this.ta;) {
                this.ik(this.ta);
                var b = this[D][gd][this.ta];
                if (b)for (var c = 0; c < b[H]; c++)b[c].xd(this)
            }
            this.G().pf(this.uj);
            this.ik(this.ta);
            if (b = this[D][gd][this.ta])for (c = 0; c < b[H]; c++)b[c].xd(this), b[c].fi(this)
        } else {
            this.ta = a;
            this.G().pf(this.uj);
            var b = this[D].Uj[this.ta], d = [];
            if (b)for (c = 0; c < b[H]; c++)d[y](b[c].vf(this)), b[c].fi(this);
            var e = this;
            this.t.Sm(function (a) {
                if (!(0 > a[Sc]) || 0 <= d[hc](a))return l;
                e.s(16);
                a.rc();
                return p
            });
            this.N & 16 && this.t.Rm(this)
        }
    };
    var bk = function () {
        var a = this.Qk[this.ta];
        if (O(a)) {
            var b = this;
            this.G().$k(a, function () {
                b[nd]()
            })
        }
    };
    M = ck[I];
    M.ik = function (a) {
        if (!this.kl[a]) {
            for (var b = this[D].eh[a], c = 0; b && c < b[H]; c++)b[c].ii(this);
            this.kl[a] = l
        }
    };
    M.ej = function () {
        0 < this.ta && this.se(this.ta - 1);
        this[nd]()
    };
    M.Pf = function () {
        this.ta + 1 < this[D][Td] && this.se(this.ta + 1);
        this[nd]()
    };
    M.G = function () {
        return this.a.G()
    };
    M.ui = function () {
        return this.a.ui()
    };
    M.qd = function () {
        return this.a.qd()
    };
    M.setCapture = function (a, b, c) {
        this.a[Tb](a, b, c)
    };
    M.releaseCapture = function (a) {
        this.a[jd](a)
    };
    M.duplicate = function (a, b, c) {
        var d = new ck(this[D], this.a, this.Zf + "_d");
        d.Hc = l;
        d.Ta(b);
        d[sc](this.na());
        this.ge && (d.ge = this.ge.duplicate(d), d.fb(d.ge, -16385));
        d.Q();
        a.Fc(c);
        a.fb(d, c);
        d.Db(this.Oa);
        return d
    };
    M.ua = function (a, b) {
        var c = this.ge;
        c || (this.ge = c = new Uj(this.a), c.Vc = l, this.fb(c, -16385));
        c[a][L](c, b)
    };
    M.Na = function (a) {
        if (this.ug && a != this.Jb) {
            var b;
            switch (a) {
                case 1:
                    b = "_up";
                    break;
                case 4:
                    b = "_down";
                    break;
                case 2:
                    b = "_over"
            }
            b && (b = this[D].ke.zg[b], N(b) && (this.Sc(b, p), this.a.Pd = l))
        }
        ck.r.Na[K](this, a)
    };
    M.jk = function (a, b, c) {
        var d = new dk;
        this.ci(ek(a));
        var e = this;
        d.Ka = function (a) {
            fk(e, a)
        };
        gk(a, this.a, b || h, c, d)
    };
    var ak = function (a) {
        tj[K](this, a)
    };
    Q(ak, uj);
    ak[I].Oc = function (a) {
        return ak.r.Oc[K](this, a)
    };
    ak[I].pg = function () {
        return this.Tc()
    };
    var fk = function (a, b, c) {
        var d = a.a, e = new ii, g = hk(b, d, e);
        d.Vf(e, function () {
            a.mi(g);
            a[pe](new cj(262144));
            d.la();
            c && c()
        })
    }, ik = function (a, b, c, d, e) {
        var g = new ii, k = hk(c, a, g);
        a.Vf(g, function () {
            var c = new ck(k, a, m);
            d && d(c);
            a.fb(c, -16384 + b);
            c.Q();
            c.Hc = l;
            a.la();
            e && e()
        })
    }, jk = function (a, b, c, d) {
        var e = p;
        if (Ue(c))for (var g = 0; g < c[H]; ++g) {
            var k = c[g];
            switch (k[G] && k[G][Pe]()) {
                case "content-type":
                    e = l
            }
            a.setRequestHeader(k[G], k[cc])
        }
        e || ("POST" == b && (d = d || "application/x-www-form-urlencoded"), d && a.setRequestHeader("Content-Type",
            d))
    }, mk = function (a, b, c, d, e, g, k) {
        d = w(d)[He]();
        switch (d) {
            case "POST":
                if ("function" == typeof ArrayBuffer) {
                    kk(a, b, c, "POST", di(e), g, k);
                    break
                }
            case "GET":
                b = di(e, b);
            default:
                USING_SWIFFY_MOCKS ? kk(a, b, c, "GET", m, g, k) : lk(b, c, g)
        }
    }, kk = function (a, b, c, d, e, g, k) {
        c && c.Ng();
        var n = new XMLHttpRequest;
        n[Cb](d, b);
        n.responseType = "arraybuffer";
        n.onreadystatechange = function () {
            if (4 == n.readyState) {
                if (200 == n[wc] || 0 == n[wc] && n.response) {
                    var b = new Uint8Array(n.response);
                    Ve(b) || f(fa("encodeByteArray takes an array as a parameter"));
                    ph();
                    for (var d = mh, e = [], k = 0; k < b[H]; k += 3) {
                        var X = b[k], la = k + 1 < b[H], jb = la ? b[k + 1] : 0, Ib = k + 2 < b[H], Na = Ib ? b[k + 2] : 0, mc = X >> 2, X = (X & 3) << 4 | jb >> 4, jb = (jb & 15) << 2 | Na >> 6, Na = Na & 63;
                        Ib || (Na = 64, la || (jb = 64));
                        e[y](d[mc], d[X], d[jb], d[Na])
                    }
                    lk("data:image/" + a + ";base64," + e[Ke](""), c, g)
                } else g.vb(n[wc]);
                c && c.Hd()
            }
        };
        jk(n, d, k);
        n.send(e)
    }, lk = function (a, b, c) {
        b && b.Ng();
        var d = new Image;
        na(d, function () {
            c.Ka({tags: [
                {type: 8, id: 1, data: d.src, width: d[Kb], height: d[Ge]},
                {type: 3, id: 1, depth: 1},
                {type: 2}
            ], frameCount: 1, id: 0}, 200);
            b && b.Hd()
        });
        d.onerror =
            function () {
                c.vb(404);
                b && b.Hd()
            };
        d.src = a
    }, nk = function (a, b, c, d, e, g, k) {
        b && b.Ng();
        var n = new XMLHttpRequest;
        c = w(c)[He]();
        var v = m;
        switch (c) {
            case "POST":
                n[Cb](c, a);
                v = di(d);
                break;
            case "GET":
                a = di(d, a);
            default:
                n[Cb]("GET", a)
        }
        n.onreadystatechange = function () {
            4 == n.readyState && (200 == n[wc] || 0 == n[wc] && n.response ? e.Ka(n.responseText, n[wc]) : e.vb(n[wc]), b && b.Hd())
        };
        jk(n, c, g, k);
        n.send(v)
    }, ok = function (a, b, c, d, e, g) {
        var k = new dk;
        k.Ka = function (a) {
            var b = e(), c = b.e;
            a = hi(a);
            for (var d = q[fd](a), g = 0; g < d[H]; g++) {
                var k = a[d[g]];
                c[d[g]] =
                    k[k[H] - 1]
            }
            b[pe](new cj(262144));
            c.onData && c.onData[K](c)
        };
        nk(a, b, c, d, k, g)
    }, pk = {png: ff(mk, "png"), gif: ff(mk, "gif"), jpg: ff(mk, "jpeg"), jpeg: ff(mk, "jpeg"), swf: function (a, b, c, d, e, g) {
        USING_SWIFFY_MOCKS || (a += ".json");
        var k = new dk(e);
        k.Ka = function (a, b) {
            var c = {};
            a && (c = qh(a), fi(c));
            e.Ka(c, b)
        };
        nk(a, b, c, d, k, g)
    }}, gk = function (a, b, c, d, e, g) {
        var k = a[vc](/\.([^.?#]+)(?:#.*$|\?.*$|$)/);
        (k = pk[k && k[1] || ""]) && k(a, b, c, d, e, g)
    }, ek = function (a) {
        var b = r[Dc]("a");
        b.href = a;
        return b[qe]
    }, dk = function (a) {
        this.Dl = function () {
            N(a) &&
                O(a.Dl) && a.Dl()
        };
        this.vb = function (b) {
            N(a) && O(a.vb) && a.vb(b)
        };
        this.Cl = function (b, c) {
            N(a) && O(a.Cl) && a.Cl(b, c)
        };
        this.Ka = function (b, c) {
            N(a) && O(a.Ka) && a.Ka(b, c)
        }
    };
    var qk = function () {
        this.em = [];
        this.Rf = []
    };
    qk[I].pp = function (a, b) {
        this.em[a] = b
    };
    qk[I].Rj = function (a) {
        this.Rf[a] = new Audio(this.em[a]);
        this.Rf[a][Qc]()
    };
    qk[I].yk = function () {
        for (var a = 0; a < this.Rf[H]; a++)N(this.Rf[a]) && this.Rf[a].pause()
    };
    q[E](Date, "__swiffy_override", {value: function (a, b, c, d, e, g, k) {
        switch (arguments[H]) {
            case 0:
                return new Date(Date.now());
            case 1:
                return new Date(arguments[0]);
            default:
                return c = N(c) ? c : 1, d = N(d) ? d : 0, e = N(e) ? e : 0, g = N(g) ? g : 0, k = N(k) ? k : 0, new Date(a, b, c, d, e, g, k)
        }
    }});
    q[E](t, "__swiffy_override", {value: t});
    var rk = function (a, b) {
        a.__swiffy_baseclass = b[I];
        Xa(a, q[vd](b[I]));
        a[I].constructor = a;
        if (b.__swiffy_if) {
            var c = new kh;
            c.Be(b.__swiffy_if);
            q[E](a, "__swiffy_if", {value: c})
        }
    }, sk = function (a) {
        q[E](a[I], "__swiffy_nvr", {value: l})
    }, tk = function (a) {
        ba.console && ba.console.log("[trace] " + a)
    }, uk = function () {
    }, vk = function (a) {
        tk(a)
    }, wk = function (a) {
        f(a)
    };
    "__proto__"in q || q[E](mi[I], "__proto__", {get: function () {
        return q[hd](this)
    }});
    var xk = function (a, b, c, d, e, g, k) {
        this.D = a;
        this.variables = b;
        this.url = c;
        fb(this, d || "_self");
        La(this, e);
        this.Xk = !!g;
        this.Di = !!k;
        this.Wh = m;
        if (this.Xk || this.Di)this.Wh = this.fo()
    }, yk = {0: h, 1: "GET", 2: "POST"};
    M = xk[I];
    M.np = function (a) {
        var b = this[be][vc](/^\_level(\d+)$/i);
        if (this.Xk)return this.Di ? b ? this.Ql(u(b[1])) : this.To() : this.So(), l;
        if (b)return this.Di ? this.Ql(u(b[1])) : this.Ro(u(b[1])), l;
        if ("" == this.url)return l;
        if (this.url[vc](/^fscommand:/i))return this.Qo(), l;
        switch (this[Vc]) {
            case 0:
            case 1:
                if (!a && "_self" != this[be])return p;
                var c = this.url;
                1 == this[Vc] && (c = di(this[Oc], c), c = c[Pb](/%20/g, "+"));
                ba[Cb](c, this[be]);
                break;
            case 2:
                a = mg("form");
                a.acceptCharset = "utf-8";
                La(a, "post");
                if (We(this[Oc]))b = mg("input", {type: "hidden",
                    name: this[Oc]}), a[x](b); else for (c in this[Oc])"$" != c[$b](0) && (b = mg("input", {type: "hidden", name: c, value: this[Oc][c]}), a[x](b));
                a.action = this.url;
                fb(a, this[be]);
                a[Wd].visibility = "hidden";
                r[Xd][x](a);
                a.submit();
                pg(a);
                break;
            default:
                if (!a && "_self" != this[be])return p;
                ba[Cb](this.url, this[be])
        }
        return l
    };
    M.Qo = function () {
        var a = this.D.a[yc]();
        if (a) {
            var a = a + "_DoFSCommand", b = this.url[ld](10), c = this[be];
            if (ba[a])ba[a](b, c)
        }
    };
    M.Ro = function (a) {
        var b = this.D.a;
        b.Fc(-16384 + a);
        if (this.url) {
            var c = new dk;
            c.Ka = function (c) {
                ik(b, a, c)
            };
            gk(this.url, b, yk[this[Vc]], this[Oc], c)
        }
    };
    M.So = function () {
        var a = this.Wh, b = yk[this[Vc]];
        if (a instanceof R) {
            var c = a.__swiffy_d;
            if (c) {
                var d = c.a.G().$(this.url);
                c.jk(d, b, a)
            }
        }
    };
    M.To = function () {
        var a = this.Wh, b = yk[this[Vc]];
        a instanceof R && a.loadVariables[K](a, this.url, b)
    };
    M.Ql = function (a) {
        var b = this.D.a;
        ok(this.url, b, yk[this[Vc]], this[Oc], function () {
            var c = -16384 + a, d = b.mc(c);
            d || (d = new zk(0, 0, {}), d = new ck(d, b, m), b.fb(d, c), d.Q(), d.Hc = l);
            return d
        })
    };
    M.fo = function () {
        return this.D.Xg("_self" == this[be] ? "this" : this[be])
    };
    USING_SWIFFY_MOCKS = "undefined" != eval("typeof USING_SWIFFY_MOCKS") ? USING_SWIFFY_MOCKS : p;
    var Lj = !Rf, Ti = vh || (Kf || Vf) && p, mj = "undefined" != eval("typeof SVGFilterElement"), Rj = Sf, Dk = function (a, b) {
        fi(b);
        this.Sd = a;
        this.Pd = p;
        this.hc = new zh(0, 0);
        this.Td = p;
        this.sa = r[J]("http://www.w3.org/1999/xhtml", "div");
        Wa(this.sa[Wd], "relative");
        rb(this.sa[Wd], "100%");
        this.sa[Wd].overflow = "hidden";
        this.sa[Wd].webkitTapHighlightColor = "rgba(0,0,0,0)";
        this.Te = b.backgroundColor;
        this.ym = new qk;
        this.Rd = b.frameSize.xmax / 20;
        this.Qd = b.frameSize.ymax / 20;
        this.vm = b.fileSize;
        this.tm = !!b.truncated;
        this.Wa = r[J]("http://www.w3.org/2000/svg",
            "svg");
        this.Wa[F]("color-interpolation-filters", "sRGB");
        this.Wa[Wd].fillRule = "evenodd";
        this.Wa[Wd].pointerEvents = "none";
        this.Wa[Wd].MozUserSelect = "none";
        this.Wa[Wd].webkitUserSelect = "none";
        this.Wa[Wd].vq = "none";
        qa(this.Wa[Wd], "100%");
        rb(this.Wa[Wd], "100%");
        this.sa[x](this.Wa);
        this.sh = r[J]("http://www.w3.org/2000/svg", "g");
        this.Wa[x](this.sh);
        this.Hb = "showAll";
        this.Mc = 0;
        this.ag = l;
        this.um = ah.za().Ga();
        this.qh = new Ak(b.frameRate, this);
        this.ig = [];
        this.wm = [];
        this.Cb = {};
        var c = new ii, d = hk(b, this, c);
        this.da ||
        this.md(Bk);
        lj[K](this, this, new zk(0, 0, m), "stage");
        this.Ba = b.version;
        this.Ud = [];
        this.oc = m;
        this.uh = p;
        this.fg = m;
        this.zm = 1;
        this.Qb = [];
        this.mj = l;
        var e = ba[Qd][qe][hc]("?"), g = ba[Qd][qe][hc]("#"), e = 0 <= e && (0 > g || g > e) ? hi(ba[Qd][qe][re](e + 1)) : {};
        this.oa = new ck(d, this, "#0");
        this.da instanceof Ck && this.oa.Ta("root1");
        this.Q();
        this.oa.xm(524288);
        this.oa[Qc]();
        this.th = new uj(this);
        this.fb(this.oa, -16384);
        this.qb = m;
        this.kd = r[J]("http://www.w3.org/2000/svg", "defs");
        this.Wa[x](this.kd);
        this.zh = 0;
        this.Vf(c);
        this.sj(e);
        this.pj();
        this.Sd[x](this.sa);
        this.nj = p;
        this.qc = []
    };
    Q(Dk, lj);
    var Ek = ["swiffy", "Stage"], Fk = Re;
    !(Ek[0]in Fk) && Fk.execScript && Fk.execScript("var " + Ek[0]);
    for (var Gk; Ek[H] && (Gk = Ek[Eb]());)!Ek[H] && Dk !== h ? Fk[Gk] = Dk : Fk = Fk[Gk] ? Fk[Gk] : Fk[Gk] = {};
    M = Dk[I];
    M.fb = function (a, b) {
        Dk.r.fb[K](this, a, b);
        this.da.Pk(a, b - -16384)
    };
    M.hf = function () {
    };
    M.Ng = function () {
        this.zh++
    };
    M.Hd = function () {
        this.zh--;
        this.bl()
    };
    M.fm = function () {
        return 0 == this.zh
    };
    M.al = function (a) {
        this.fm() ? a() : this.ig[y](a)
    };
    M.bl = function () {
        if (this.fm()) {
            for (var a = 0; a < this.ig[H]; a++)(0, this.ig[a])();
            this.ig = []
        }
    };
    M.Jp = function () {
        this.qh[nd]();
        for (var a = 0; a < this.Qb[H]; a++)Jg(this.Qb[a]);
        this.oa.L();
        this.oa.B.L();
        Lg(this.sa);
        pg(this.sa);
        this.qd().yk()
    };
    Dk[I].destroy = Dk[I].Jp;
    M = Dk[I];
    M.an = function () {
        this.mj = p;
        if ("createTouch"in r) {
            Eg(this.sa, "touchstart", this.Vh, p, this);
            Eg(this.sa, "touchmove", this.Uh, p, this);
            Eg(this.sa, "touchend", this.Jn, p, this);
            var a = Eg(r, "touchstart", this.Kn, p, this)
        } else Eg(this.sa, "mousemove", this.Gn, p, this), Eg(this.sa, "mousedown", this.Bi, p, this), Eg(this.sa, "mouseup", this.Kk, p, this), Eg(this.sa, "mouseout", this.Hn, p, this), Eg(this.sa, "mouseover", function (a) {
            a[Nd]()
        }, p), a = Eg(r, "mousedown", this.Fn, p, this), this.Qb[y](a), a = Eg(r, "mouseup", this.In, p, this), this.Qb[y](a),
            a = Eg(r, "mouseover", function (a) {
                this.Qc(m, a)
            }, p, this);
        this.Qb[y](a);
        Eg(r, "keyup", this.En, p, this);
        Eg(new Ug(r), "key", this.Dn, p, this)
    };
    M.Sn = function (a) {
        this.oa.map(function (b) {
            if (b instanceof rj)return b[pe](a)
        })
    };
    M.Vh = function (a) {
        this.Qc(m, a);
        this.Bi(a)
    };
    M.Kn = function (a) {
        this.Qc(m, a)
    };
    M.Uh = function (a) {
        this.Qc(m, a);
        a[Nd]()
    };
    M.Jn = function (a) {
        this.Kk(a)
    };
    M.Bi = function (a) {
        2 != a.button && (a[Nd](), this.Yp())
    };
    M.Yp = function () {
        this.Bk();
        this.Td = l;
        this.da.xe(new cj(8));
        this.la();
        this.da.Ce();
        this.qb ? this.qb.Ce() : this[Tb](this);
        this.la();
        this.je(p)
    };
    M.Gn = function (a) {
        a[Nd]();
        this.Qc(m, a)
    };
    M.Kk = function (a) {
        2 != a.button && (a[Nd](), this.Zp())
    };
    M.Zp = function () {
        this.Td = p;
        this.da.xe(new cj(4));
        this.la();
        this.da.De();
        this.qb ? this.qb.De() : this[jd](this);
        this.la();
        this.je(l)
    };
    M.Hn = function (a) {
        var b;
        if (!(b = !a.relatedTarget)) {
            b = this.sa;
            var c = a.relatedTarget;
            if (b[xe] && 1 == c[Rb])b = b == c || b[xe](c); else if ("undefined" != typeof b.compareDocumentPosition)b = b == c || ga(b.compareDocumentPosition(c) & 16); else {
                for (; c && b != c;)c = c[Ee];
                b = c == b
            }
            b = !b
        }
        b && this.Qc(m, a)
    };
    M.Fn = function () {
        this.Td = l;
        this[Tb](this, l)
    };
    M.In = function () {
        this.Td = p;
        this[jd](this)
    };
    M.ap = function (a) {
        if (!this.Dk)return m;
        var b = a.Pc.touches;
        b && 1 == b[H] && (a = b[0]);
        var c = b = 0;
        if (a.pageX || a.pageY)b = a.pageX, c = a.pageY; else if (a[id] || a[kd])b = a[id] + r[Xd].scrollLeft + r.documentElement.scrollLeft, c = a[kd] + r[Xd].scrollTop + r.documentElement.scrollTop;
        a = new zh(b, c);
        a.F(this.Dk);
        return a
    };
    M.En = function (a) {
        this.da.Vg(a);
        this.da.xe(new cj(1));
        this.la();
        this.da.Wk();
        this.je(l)
    };
    M.Dn = function (a) {
        this.da.Ug(a);
        this.da.xe(new cj(2));
        this.la();
        this.da.Tk();
        this.Sn(new cj(1048576));
        this.la();
        this.je(l)
    };
    M.Mn = function () {
        return this.qb != m
    };
    M.vi = function () {
        var a = "default";
        if (this.G().Lk()) {
            if (this.Cg() || this.Ln() || !this.isCaptured() && this.Mn())this.qb && this.G().Mk(this.qb) && (a = "pointer")
        } else a = "none";
        this.sa[Wd].cursor = a
    };
    M.cp = function (a, b, c) {
        this.hc.x = b;
        this.hc.y = c;
        this.da.xe(new cj(16));
        this.la();
        this.da.Og();
        if (a && (b = a[Ab]())) {
            do this.da.Ag(b) || (a = b); while (b = b[Ab]())
        }
        this.qb != a && (this.da.Ek(this.qb, a), this.qb = a, this.la(), this.je(p), this.vi())
    };
    M.Qc = function (a, b) {
        var c = this.ap(b);
        c == m && (c = this.hc);
        this.cp(a, c.x, c.y)
    };
    M.Om = function (a, b) {
        this.Qc(a, b);
        this.Bi(b)
    };
    M.isCaptured = function () {
        return this.oc != m
    };
    M.Cg = function () {
        return this.oc != m && this.uh
    };
    M.Bg = function (a) {
        return this.oc == a
    };
    M.Ln = function () {
        return this.oc != m && this.oc == this.qb
    };
    M.setCapture = function (a, b, c) {
        this[jd](a);
        this.oc = a;
        b && (this.uh = l);
        c && (this.fg = c, this.vi())
    };
    M.releaseCapture = function (a) {
        this.oc && (this.vi(), this.oc != a && (this.Bk(), this.fg && (this.fg(), this.la())), this.oc = this.fg = m, this.uh = p)
    };
    hb(M, function () {
        var a = this.qh;
        window.stageObj = this;
        this.al(function () {
            a.start()
        })
    });
    hb(Dk[I], Dk[I].start);
    hbStop(M, function () {
        var a = this.qh;
        this.al(function () {
            a.stop()
        })
    });
    hbStop(Dk[I], Dk[I].stop);
    M = Dk[I];
    M.Tm = function (a) {
        this.Ud[y](a)
    };
    M.Vf = function (a, b) {
        a.gp(this, b);
        this.wm[y](a);
        this.kd[x](a.kd)
    };
    M.ei = function () {
        this.mj && this.an();
        this.Ud = this.Ud[vb](function (a) {
            return!a.Wd()
        });
        for (var a = this.Ud[H] - 1; 0 <= a; --a) {
            var b = this.Ud[a];
            b[pe](new cj(64));
            b.ei()
        }
        this.nj || (this.oa.e.$version = "HTML 11,0,0,0", this.oa.Q(), this.la(), this.oa.Ye(128), this.oa[pe](new cj(128)), this.nj = l);
        this.la();
        this.je(!this.Td);
        this.Pd = l
    };
    M.md = function (a) {
        this.da || (this.da = new a(this));
        return this.da
    };
    M.G = function () {
        return this.da
    };
    M.la = function () {
        this.da.la()
    };
    M.je = function (a) {
        for (var b = [], c = 0; c < this.qc[H]; ++c)this.qc[c].np(a) || b[y](this.qc[c]);
        this.qc = b
    };
    M.Bk = function () {
        this.qc = []
    };
    M.rf = function (a) {
        for (var b = 0; b < this.qc[H]; ++b)if (this.qc[b][be] == a[be]) {
            this.qc[b] = a;
            return
        }
        this.qc[y](a)
    };
    M.ui = function () {
        return this.qh
    };
    M.qd = function () {
        return this.ym
    };
    M.kq = function (a) {
        this.sj(hi(a))
    };
    Dk[I].setFlashVars = Dk[I].kq;
    M = Dk[I];
    M.sj = function (a) {
        for (var b = q[fd](a), c = 0; c < b[H]; c++) {
            var d = b[c], e = a[d];
            this.G().Gl(d, e[e[H] - 1])
        }
    };
    M.af = function () {
        return"instance" + this.zm++
    };
    M.pm = function (a) {
        this.Hb != a && (this.Hb = a, this.ag = l, "noScale" == this.Hb && (a = this.Ef != this.Qd, (this.Ff != this.Rd || a) && this.da.Ai()))
    };
    M.mm = function (a) {
        a = a[He]();
        var b = 0;
        -1 < a[hc]("L") && (b |= 1);
        -1 < a[hc]("T") && (b |= 2);
        -1 < a[hc]("R") && (b |= 4);
        -1 < a[hc]("B") && (b |= 8);
        this.Mc != b && (this.Mc = b, this.ag = l)
    };
    M.Un = function () {
        return this.Mc & 1 ? 0 : this.Mc & 4 ? 2 : 1
    };
    M.Vn = function () {
        return this.Mc & 2 ? 0 : this.Mc & 8 ? 2 : 1
    };
    M.pj = function () {
        var a = this.Sd.offsetWidth, b = this.Sd.offsetHeight, c, d = this.Sd, e = c = 0;
        if (d.offsetParent) {
            do c += d.offsetLeft, e += d.offsetTop; while (d = d.offsetParent)
        }
        c = [c, e];
        d = c[0];
        c = c[1];
        e = p;
        if (this.pi != d || this.qi != c)this.pi = d, this.qi = c, e = l;
        if (this.Ff != a || this.Ef != b)this.Ff = a, this.Ef = b, "noScale" == this.Hb && this.da.Ai(), e = l;
        return e
    };
    M.Tn = function () {
        var a = this.Ff, b = this.Ef, c = this.Rd, d = this.Qd, e = a / c, g = b / d;
        switch (this.Hb) {
            case "noScale":
                e = g = 1;
                break;
            case "showAll":
                e < g ? g = e : e = g;
                break;
            case "noBorder":
                e > g ? g = e : e = g
        }
        var k = 0, n = 0;
        switch (this.Un()) {
            case 1:
                k = (a - c * e) / 2;
                break;
            case 2:
                k = a - c * e
        }
        switch (this.Vn()) {
            case 1:
                n = (b - d * g) / 2;
                break;
            case 2:
                n = b - d * g
        }
        this.oh = new Ah(e / 20, 0, 0, g / 20, this.pi + k, this.qi + n);
        this.Dk = this.oh.ng()
    };
    M.lc = function () {
        var a = this.pj();
        if (this.ag || a)this.Tn(), a = this.oh[Wc](-this.pi, -this.qi), this.sh[F]("transform", a[od]()), this.ag = p;
        this.Pd && (this.cf(), this.th.lc(0), this.th.Tc()[Ee] || this.Rn(), this.Pd = p)
    };
    M.Rn = function () {
        var a = Vh(this.Te)[od]();
        this.sa[Wd].background = a;
        var b = r[J]("http://www.w3.org/2000/svg", "g");
        this.sh[x](b);
        b[F]("enable-background", "new");
        var c = r[J]("http://www.w3.org/2000/svg", "rect");
        c[fc]("http://www.w3.org/2000/svg", "width", 20 * this.Rd);
        c[fc]("http://www.w3.org/2000/svg", "height", 20 * this.Qd);
        c[fc]("http://www.w3.org/2000/svg", "fill", a);
        b[x](c);
        b[x](this.th.Tc())
    };
    M.getName = function () {
        return this.Sd.id
    };
    var Hk = function () {
    };
    Hk[I].tc = function (a) {
        return new Ik(a, this)
    };
    var Jk = [];
    Hk[I].Nf = function () {
        return new Ih(0, 0, 0, 0)
    };
    var Lk = function (a, b, c, d) {
        var e = new Ih;
        c = Kk(b, c);
        b = Kk(b, d);
        e[Mb](3 * -c, 3 * -b);
        e[Mb](3 * +c, 3 * +b);
        a.add(e)
    }, Mk = function (a, b, c) {
        a[Mb](20 * s.cos(b) * c, 20 * s.sin(b) * c)
    };
    Hk[I].Mj = function () {
        return 1
    };
    var Kk = function (a, b) {
        var c = 1;
        switch (a) {
            case 1:
                c = 4;
                break;
            case 2:
                c = 3;
                break;
            case 3:
                c = 2
        }
        return s.abs(20 * b / c)
    }, Ik = function (a, b) {
        this.B = a;
        this.filter = b;
        this.un = ah.za().Ga();
        this.Ha = [];
        this.Dg = []
    };
    M = Ik[I];
    nb(M, function () {
    });
    M.result = function () {
        return this.un
    };
    M.Cp = function (a, b, c, d) {
        var e = r[J]("http://www.w3.org/2000/svg", "feBlend");
        e[F]("mode", a);
        N(c) && e[F]("in", c);
        e[F]("in2", b);
        N(d) && e[F]("result", d);
        this.Xa()[x](e)
    };
    M.pl = function (a, b, c, d, e) {
        var g = r[J]("http://www.w3.org/2000/svg", "feGaussianBlur");
        N(d) && g[F]("in", d);
        N(e) && g[F]("result", e);
        d = function (d) {
            var e = new zh(b, c);
            e.F(d);
            g[F]("stdDeviation", Kk(a, e.x) + " " + Kk(a, e.y))
        };
        d(this.gi());
        this.Dg[y](d);
        this.Xa()[x](g)
    };
    M.df = function (a, b, c, d, e, g, k) {
        var n = r[J]("http://www.w3.org/2000/svg", "feComponentTransfer");
        N(g) && n[F]("in", g);
        N(k) && n[F]("result", k);
        N(e) || (e = "linear");
        g = ["feFuncR", "feFuncG", "feFuncB", "feFuncA"];
        a = [a, b, c, d];
        for (b = 0; 4 > b; ++b) {
            c = m;
            for (var v in a[b])c == m && (c = r[J]("http://www.w3.org/2000/svg", g[b]), c[F]("type", e)), c[F](v, a[b][v]);
            c && n[x](c)
        }
        this.Xa()[x](n);
        return n
    };
    M.ni = function (a, b, c) {
        var d = this.df({intercept: 0}, {intercept: 0}, {intercept: 0}, {slope: 0}, h, h, c), e = this;
        this.Ha[y](function () {
            for (var c = e.B.Hk(a), k = 0; k < d[Zc][H]; ++k) {
                var n = d[Zc][k];
                switch (n[Lc]) {
                    case "feFuncR":
                        n[F]("intercept", c.ne / 255);
                        break;
                    case "feFuncG":
                        n[F]("intercept", c.me / 255);
                        break;
                    case "feFuncB":
                        n[F]("intercept", c.le / 255);
                        break;
                    case "feFuncA":
                        n[F]("slope", c.od * b)
                }
            }
        })
    };
    M.ya = function (a, b, c, d, e) {
        var g = r[J]("http://www.w3.org/2000/svg", "feComposite");
        N(e) && g[F]("result", e);
        N(b) && g[F]("in", b);
        N(c) && g[F]("in2", c);
        g[F]("operator", a);
        if (N(d))for (var k in d)g[F](k, d[k]);
        this.Xa()[x](g)
    };
    M.gn = function (a) {
        var b = r[J]("http://www.w3.org/2000/svg", "feFlood");
        N(a) && b[F]("result", a);
        b[F]("flood-color", "black");
        this.Xa()[x](b)
    };
    M.jp = function (a, b, c, d) {
        var e = 20 * s.cos(a) * b, g = 20 * s.sin(a) * b, k = r[J]("http://www.w3.org/2000/svg", "feOffset");
        N(c) && k[F]("in", c);
        N(d) && k[F]("result", d);
        a = function (a) {
            var b = new zh(e, g);
            b.F(a);
            k[F]("dx", b.x);
            k[F]("dy", b.y)
        };
        a(this.gi());
        this.Dg[y](a);
        this.Xa()[x](k)
    };
    M.oi = function (a, b, c, d, e, g, k) {
        if (0 < c || 0 < d)this.pl(b, c, d, a), a = h;
        0 != g && (this.jp(e, g, a), a = h);
        this.df({slope: 0}, {slope: 0}, {slope: 0}, {}, "linear", a, k)
    };
    M.Mb = function () {
        return ah.za().Ga()
    };
    M.Xa = function () {
        return this.B.Xa()
    };
    M.Rh = function () {
        for (var a = this.Ha, b = 0; b < a[H]; ++b)a[b][K](this)
    };
    M.gi = function () {
        var a = this.B.b[Ab]();
        return a ? a.ic().$d(0, 0) : Bh
    };
    M.lc = function () {
        if (this.B.b.N & 2048)for (var a = this.gi(), b = 0; b < this.Dg[H]; ++b)this.Dg[b](a)
    };
    var Nk = function (a) {
        this.Li = a
    };
    Q(Nk, Hk);
    Jk[3] = function (a) {
        a = a[Qb];
        a[4] /= 255;
        a[9] /= 255;
        a[14] /= 255;
        a[19] /= 255;
        return new Nk(a)
    };
    Nk[I].tc = function (a) {
        return new Ok(a, this)
    };
    var Ok = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Ok, Ik);
    nb(Ok[I], function (a) {
        var b = this.Xa(), c = r[J]("http://www.w3.org/2000/svg", "feColorMatrix");
        c[F]("in", a);
        c[F]("result", this[zd]());
        c[F]("type", "matrix");
        c[F]("values", this[vb].Li[Ke](" "));
        b[x](c)
    });
    var Pk = function (a, b, c, d, e, g, k, n) {
        this.no = a;
        this.mk = c;
        this.po = d;
        this.Li = e;
        this.ro = g;
        this.so = k;
        this.uo = n
    };
    Q(Pk, Hk);
    Jk[5] = function (a) {
        return new Pk(a.bias, a.clamp, a[jc], a.divisor, a[Qb], a[Xc], a[Yc], a.preserveAlpha)
    };
    Pk[I].tc = function (a) {
        return new Qk(a, this)
    };
    var Qk = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Qk, Ik);
    nb(Qk[I], function (a) {
        var b = this.Xa(), c = r[J]("http://www.w3.org/2000/svg", "feConvolveMatrix");
        c[F]("in", a);
        c[F]("result", this[zd]());
        c[F]("order", this[vb].ro + "," + this[vb].so);
        c[F]("divisor", this[vb].po);
        c[F]("bias", this[vb].no / 255);
        c[F]("kernelMatrix", this[vb].Li[Ob]().reverse()[Ke](" "));
        c[F]("preserveAlpha", this[vb].uo);
        b[x](c)
    });
    var Rk = function (a, b, c) {
        this.vc = a;
        this.$b = b;
        this.ac = c
    };
    Q(Rk, Hk);
    Jk[2] = function (a) {
        return new Rk(a[Oe], a.x, a.y)
    };
    Rk[I].tc = function (a) {
        return new Sk(a, this)
    };
    Rk[I].Mj = function () {
        return 1 < this.$b && 1 < this.ac ? 2 : 1
    };
    Rk[I].Nf = function () {
        var a = new Ih(0, 0, 0, 0);
        Lk(a, this.vc, this.$b, this.ac);
        return a
    };
    var Sk = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Sk, Ik);
    nb(Sk[I], function (a) {
        var b = this[vb];
        this.pl(b.vc, b.$b, b.ac, a, this[zd]())
    });
    var Tk = function (a, b, c, d, e, g, k, n, v, A) {
        this.yd = a;
        this.mk = b;
        this.zd = c;
        this.Hg = d;
        this.vc = e;
        this.$b = g;
        this.ac = k;
        this.sk = n;
        this.wc = v;
        this.wf = A
    };
    Q(Tk, Hk);
    Jk[1] = function (a) {
        return new Tk(a[Gd], a[jc], a[ye], a[je], a[Oe], a.x, a.y, a[Fb], a[Cd], a[uc])
    };
    Tk[I].tc = function (a) {
        return new Uk(a, this)
    };
    Tk[I].Nf = function () {
        var a = new Ih(0, 0, 0, 0);
        Mk(a, this.yd, this.zd);
        Lk(a, this.vc, this.$b, this.ac);
        return a
    };
    var Uk = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Uk, Ik);
    nb(Uk[I], function (a) {
        this.Ha = [];
        var b = this[vb], c = this.Xa();
        b.wc && this.gn("black");
        this.oi(a, b.vc, b.$b + 1, b.ac + 1, b.yd, b.zd);
        b.wc && this.ya("arithmetic", h, "black", {k2: -1, k3: 1});
        var d = this.Mb();
        this.ni(b.mk, b.Hg, d);
        !b.wc && !b.wf && !b.sk ? this.ya("over", a, d) : b.wc && !b.wf && !b.sk ? this.ya("atop", d, a) : !b.wc && b.wf ? this.ya("out", d, a) : b.wc && this.ya("in", d, a);
        c.lastChild[F]("result", this[zd]())
    });
    var Vk = function (a, b, c, d, e, g, k, n, v, A, B) {
        this.yd = a;
        this.bn = b;
        this.cn = c;
        this.zd = d;
        this.Hg = e;
        this.vc = g;
        this.$b = k;
        this.ac = n;
        this.tk = v;
        this.wc = A;
        this.wf = B
    };
    Q(Vk, Hk);
    Jk[4] = function (a) {
        return new Vk(a[Gd], a.highlight, a.shadow, a[ye], a[je], a[Oe], a.x, a.y, a.onTop, a[Cd], a[uc])
    };
    Vk[I].tc = function (a) {
        return new Wk(a, this)
    };
    Vk[I].Nf = function () {
        var a = new Ih(0, 0, 0, 0);
        Mk(a, this.yd, -this.zd);
        Mk(a, this.yd, this.zd);
        Lk(a, this.vc, this.$b, this.ac);
        return a
    };
    var Wk = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Wk, Ik);
    nb(Wk[I], function (a) {
        this.Ha = [];
        var b = this[vb], c = this.Xa(), d = this.Mb(), e = this.Mb(), g = this.Mb(), k = this.Mb(), n = this.Mb();
        this.oi(a, b.vc, b.$b, b.ac, b.yd, -b.zd, e);
        this.oi(a, b.vc, b.$b, b.ac, b.yd, b.zd, d);
        this.ya("arithmetic", e, d, {k2: 1, k3: -1});
        this.ni(b.bn, b.Hg, k);
        this.ya("arithmetic", d, e, {k2: 1, k3: -1});
        this.ni(b.cn, b.Hg, g);
        this.ya("arithmetic", k, g, {k2: 1, k3: 1}, n);
        b.wf ? b.wc ? this.ya("in", n, a) : b.tk || this.ya("out", n, a) : b.wc ? this.ya("atop", n, a) : b.tk ? this.ya("over", n, a) : this.ya("over", a, n);
        c.lastChild[F]("result",
            this[zd]())
    });
    var oj = function (a) {
        this.mode = a
    };
    Q(oj, Hk);
    oj[I].tc = function (a) {
        return new Xk(a, this)
    };
    var Xk = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Xk, Ik);
    M = Xk[I];
    nb(M, function (a) {
        switch (this[vb].mode) {
            case 7:
                this.fj("add", a);
                break;
            case 5:
                this.lh("darken", a);
                break;
            case 6:
                this.fj("difference", a);
                break;
            case 4:
                this.lh("lighten", a);
                break;
            case 2:
                this.lh("multiply", a);
                break;
            case 3:
                this.lh("screen", a);
                break;
            case 8:
                this.fj("subtract", a)
        }
        this.ip()
    });
    M.ip = function (a) {
        var b = this.df({intercept: 0}, {intercept: 0}, {intercept: 0}, {slope: 0}, "linear", a), c = this;
        this.Ha[y](function () {
            for (var a = c.B.b.Uf, e = 0; e < b[Zc][H]; ++e) {
                var g = b[Zc][e];
                switch (g[Lc]) {
                    case "feFuncR":
                        g[F]("slope", a.X);
                        g[F]("intercept", a.U / 255);
                        break;
                    case "feFuncG":
                        g[F]("slope", a.W);
                        g[F]("intercept", a.T / 255);
                        break;
                    case "feFuncB":
                        g[F]("slope", a.V);
                        g[F]("intercept", a.S / 255);
                        break;
                    case "feFuncA":
                        g[F]("slope", a.M), g[F]("intercept", a.Y / 255)
                }
            }
        })
    };
    M.lh = function (a, b) {
        this.Cp(a, "BackgroundImage", b)
    };
    M.fj = function (a, b) {
        var c = this.Mb();
        switch (a) {
            case "add":
                var d = this.Lf(b), e = this.Lf("BackgroundImage");
                this.ya("arithmetic", d, e, {k2: 1, k3: 1}, c);
                break;
            case "difference":
                var d = this.Lf(b), g = this.Ji(b), e = this.Lf("BackgroundImage"), k = this.Ji("BackgroundImage"), d = this.Ii(d, k), e = this.Ii(g, e);
                this.ya("arithmetic", d, e, {k2: 1, k3: 1}, c);
                break;
            case "subtract":
                g = this.Ji(b), e = this.Lf("BackgroundImage"), c = this.Ii(g, e)
        }
        e = this.Mb();
        this.ya("in", c, "BackgroundAlpha", {}, e);
        this.ya("in", e, b)
    };
    M.Ii = function (a, b) {
        var c = this.Mb();
        this.ya("arithmetic", a, b, {k2: 1, k3: 1, k4: -1}, c);
        return c
    };
    M.Lf = function (a) {
        var b = this.Mb();
        this.df({}, {}, {}, {slope: 0, intercept: 1}, "linear", a, b);
        return b
    };
    M.Ji = function (a) {
        var b = this.Mb();
        this.df({slope: -1, intercept: 1}, {slope: -1, intercept: 1}, {slope: -1, intercept: 1}, {slope: 0, intercept: 1}, "linear", a, b);
        return b
    };
    var Yk = function () {
    };
    Q(Yk, Hk);
    Jk[0] = function (a) {
        return new Yk(a)
    };
    Yk[I].tc = function (a) {
        return new Zk(a, this)
    };
    Yk[I].Nf = function () {
        return new Ih(0, 0, 0, 0)
    };
    var Zk = function (a, b) {
        Ik[K](this, a, b)
    };
    Q(Zk, Ik);
    nb(Zk[I], function () {
    });
    var $k = function () {
    };
    $k[I].ob = function () {
    };
    var al = [];
    var bl = function (a) {
        this.id = a
    };
    Q(bl, $k);
    M = bl[I];
    M.Z = p;
    M.Q = function () {
        return m
    };
    M.Fb = function () {
        return m
    };
    M.fh = function (a) {
        this.Wo = a
    };
    M.ob = function (a, b, c) {
        c.Il(this.id, this)
    };
    var cl = function () {
    };
    Q(cl, $k);
    M = cl[I];
    M.bf = function () {
    };
    M.vf = function () {
    };
    M.ii = function () {
    };
    M.xd = function () {
    };
    M.fi = function () {
    };
    M.cj = function () {
    };
    M.Qf = function () {
    };
    var el = function (a, b) {
        for (var c = 0; c < a[H]; ++c)if (a[c]instanceof dl && a[c][Sc] == b)return c;
        return-1
    };
    cl[I].ob = function (a, b, c, d) {
        a[gd][d] || (a[gd][d] = []);
        a[gd][d][y](this)
    };
    var fl = function (a, b, c, d, e, g, k) {
        Ba(this, a);
        Ia(this, b);
        sb(this, c);
        this.states = d;
        this.Gj = e;
        pb(this, g);
        Fa(this, k)
    }, gl = function (a, b, c) {
        $a(this, a);
        this.key = b;
        this.events = c
    }, hl = function (a, b) {
        this.events = a;
        this.sound = b
    }, il = function (a, b, c, d, e) {
        this.id = a;
        this.trackAsMenu = b;
        this.records = c;
        $a(this, d);
        this.sounds = e
    };
    Q(il, bl);
    al[10] = function (a, b, c) {
        for (var d = [], e = 0; a[Sd] && e < a[Sd][H]; e++) {
            var g = a[Sd][e], k = g[Ne] ? Qh(g[Ne]) : m, n = g[ne] ? Uh(g[ne]) : m, v = h;
            if (g[ze])for (var v = [], A = 0; A < g[ze][H]; A++)v[y]((0, Jk[g[ze][A][Uc]])(g[ze][A]));
            N(g.id) && d[y](new fl(c.$c(g.id), g[Sc], k, g[Nc], n, v, g[Gc]))
        }
        c = [];
        for (e = 0; a[Dd] && e < a[Dd][H]; e++)g = b.md(Bk), k = a[Dd][e], c[y](new gl(g.fc(k[Dd]), k.key, k[Vb]));
        b = [];
        for (e = 0; a[Ec] && e < a[Ec][H]; e++)g = a[Ec][e], b[y](new hl(g[Vb], g[Jc]));
        return new il(a.id, a[ve], d, c, b)
    };
    il[I].Fb = function (a, b, c) {
        return new vj(this, a, b, c)
    };
    il[I].Z = l;
    var jl = function (a, b, c, d) {
        this.id = a;
        oa(this, b);
        rb(this, c);
        za(this, N(d) ? d : 4278190080);
        this.autoSize = "none"
    };
    Q(jl, bl);
    al[13] = function (a, b, c) {
        c = N(a[z]) ? c.$c(a[z]) : m;
        c = new jl(a.id, c, a[Ge], a[jc]);
        ra(c, a[Lb]);
        c.align = a[Fe];
        Pa(c, Jh(a[dd]));
        c.html = !!a.html;
        c.wrap = !!a.wrap;
        c.multiline = !!a[Pd];
        c.indent = a[wb];
        c.leading = a[Wb];
        c.leftMargin = a[Je];
        c.rightMargin = a[$c];
        c.border = !!a[Ae];
        c.variable = a[Ed] || m;
        c.Z = 6 <= b.Ba;
        c.selectable = !!a.selectable;
        c.editable = !!a.editable;
        c.password = !!a.password;
        c.maxChars = a.maxChars || m;
        c.oj = !!a.embed;
        c.autoSize = a.autoSize ? "left" : "none";
        return c
    };
    jl[I].Fb = function (a, b, c) {
        return new ij(this, a, b, c)
    };
    jl[I].Z = l;
    var kl = function (a, b, c) {
        ua(this, a);
        this.unicode = b;
        this.advance = c
    }, Cj = function (a, b, c, d, e, g, k, n, v) {
        this.id = b;
        Oa(this, c);
        this.a = a;
        this.glyphs = d;
        this.emSquareSize = e;
        this.ascent = g;
        this.descent = k;
        Ua(this, n);
        ya(this, v);
        this.lineHeight = (g + k) / e;
        this.Lg = {};
        for (a = 0; a < d[H]; a++)this.Lg[d[a].unicode] = d[a]
    };
    Q(Cj, bl);
    al[5] = function (a, b) {
        for (var c = a[bd] ? a[bd] : 1024, d = [], e = 0; a[Rd] && e < a[Rd][H]; e++)d[y](new kl(Oh(a[Rd][e][C]), a[Rd][e].unicode, a[Rd][e][se]));
        return new Cj(b, a.id, a[G], d, c, a[zb] ? a[zb] : 0, a[wd] ? a[wd] : 0, a[qd], a[dc])
    };
    M = Cj[I];
    M.Tc = function () {
        return this.Jd
    };
    M.sd = function (a) {
        return this[G] && !this[Rd][H] || Lj || a ? this[G] : this[G] + this.a.um
    };
    M.dl = function (a) {
        return this.Lg[a] ? this.Lg[a][C] : m
    };
    M.Jf = function (a) {
        return this.Lg[a]
    };
    M.Q = function () {
        if (Lj)return m;
        var a = r[J]("http://www.w3.org/2000/svg", "font");
        this[G] || Oa(this, ah.za().Ga());
        var b = r[J]("http://www.w3.org/2000/svg", "font-face");
        b[F]("font-family", "'" + this.sd() + "'");
        b[F]("units-per-em", this[bd]);
        this[zb] && b[F]("ascent", this[zb]);
        this[wd] && b[F]("descent", this[wd]);
        b[F]("font-weight", this[qd] ? "bold" : "normal");
        b[F]("font-style", this[dc] ? "italic" : "normal");
        if (this[G] && !this[Rd][H]) {
            var a = r[J]("http://www.w3.org/2000/svg", "font-face-src"), c = r[J]("http://www.w3.org/2000/svg",
                "font-face-name");
            c[F]("name", this[G]);
            a[x](c);
            b[x](a);
            this.Jd = b
        } else {
            a[F]("horiz-adv-x", this[bd]);
            a[x](b);
            for (b = 0; b < this[Rd][H]; b++) {
                var c = this[Rd][b], d = r[J]("http://www.w3.org/2000/svg", "glyph");
                d[F]("unicode", c.unicode);
                var e = c[C].di(Ch);
                d[F]("d", e || "M 0 0");
                c[se] && d[F]("horiz-adv-x", c[se]);
                a[x](d)
            }
            this.Jd = a
        }
        return this.Jd
    };
    M.ob = function (a, b, c, d) {
        Cj.r.ob[K](this, a, b, c, d);
        a = this.sd(l);
        b.Cb[a] || (b.Cb[a] = []);
        b.Cb[a][y](this)
    };
    var Pi = function (a, b, c, d, e) {
        this.id = a;
        ua(this, b);
        this.mask = c;
        qa(this, d);
        rb(this, e);
        this.Eb = m
    };
    Q(Pi, bl);
    al[8] = function (a) {
        return new Pi(a.id, a[C], a[de], a[Kb], a[Ge])
    };
    M = Pi[I];
    M.Tc = function () {
        return this.Jd
    };
    M.Q = function (a) {
        var b = this.Jk(this[C]);
        this.Jd = b;
        Ti && b[F]("transform", "rotate(360)");
        a.Ng();
        this[de] ? USING_SWIFFY_MOCKS && !Rj ? (this.Qn(b), a.Hd()) : this.Pn(b, a) : (this.Eb = new Image, na(this.Eb, this.Eb.onerror = function () {
            a.Hd()
        }), this.Eb.src = this[C]);
        b.id = this.xk = ah.za().Ga();
        return this.Jd
    };
    M.Pn = function (a, b) {
        var c = this[Kb], d = this[Ge], e = r[Dc]("canvas");
        qa(e, this[Kb]);
        rb(e, this[Ge]);
        var g = new Image, k = new Image, n = p, v = p, A = this, B = function () {
            if (n && v) {
                var B = e.getContext("2d");
                B.clearRect(0, 0, c, d);
                B.drawImage(g, 0, 0, c, d);
                B.globalCompositeOperation = "destination-in";
                B.drawImage(k, 0, 0, c, d);
                B = e.toDataURL("image/png");
                a[fc]("http://www.w3.org/1999/xlink", "href", B);
                A.Eb = new Image;
                na(A.Eb, A.Eb.onerror = function () {
                    b.Hd()
                });
                A.Eb.src = B
            }
        };
        na(g, function () {
            n = l;
            B()
        });
        na(k, function () {
            v = l;
            B()
        });
        g.src = this[C];
        k.src = this[de]
    };
    M.Qn = function (a) {
        var b = r[J]("http://www.w3.org/2000/svg", "mask");
        b[x](this.Jk(this[de]));
        b.id = ah.za().Ga();
        var c = r[J]("http://www.w3.org/2000/svg", "defs");
        c[x](a);
        c[x](b);
        a[F]("mask", "url(#" + b.id + ")");
        this.Jd = c
    };
    M.Jk = function (a) {
        var b = r[J]("http://www.w3.org/2000/svg", "image");
        b[F]("width", this[Kb]);
        b[F]("height", this[Ge]);
        b[fc]("http://www.w3.org/1999/xlink", "href", a);
        return b
    };
    M.Fb = function (a, b, c) {
        if (!this.Ti) {
            b = 20 * this[Kb];
            var d = 20 * this[Ge];
            this.Ti = new Sj(this.id, [new Wj(new ui(new Kh([0, 0, 0, 1, b, 0, 1, b, d, 1, 0, d, 1, 0, 0, 3])), 0, h)], [new Ih(0, 0, b, d)], [new Qi(this.Nn, {bitmap: this.id})], []);
            this.Ti.Q(a)
        }
        return new Qj(this.Ti, a, c)
    };
    M.ob = function (a, b, c, d) {
        Pi.r.ob[K](this, a, b, c, d);
        this.Nn = c
    };
    var Sj = function (a, b, c, d, e) {
        this.id = a;
        this.paths = b;
        Pa(this, c);
        this.fillstyles = d;
        this.linestyles = e;
        this.Dh = m;
        this.Jh = this.Ih = this.Aj = this.Bj = 0
    };
    Q(Sj, bl);
    Sj[I].Nm = function () {
        if (!this[dd] || 1 < this[dd][H])return p;
        for (var a = 0, b = 0; b < this[ue][H]; b++) {
            var c = this[ue][b], d = c[C].R(ti).O, e = c[md] != m ? this[Cc][c[md]] : m;
            if (e instanceof Qi)return p;
            a += d[H] * (!!e + 2 * !(c[ee] == m || !this[xc][c[ee]]))
        }
        return 100 < a
    };
    Sj[I].Q = function () {
        if (!Rj || !this.Nm())return m;
        if (this[dd] && 1 == this[dd][H]) {
            var a = r[Dc]("canvas"), b = this[dd][0], c = s[Ub](b.C / 20) + 1, d = s[Ub](b.A / 20) + 1, e = s[Xb](b.i / 20) - 1, b = s[Xb](b.h / 20) - 1;
            this.Bj = 20 * (c - e);
            this.Aj = 20 * (d - b);
            this.Ih = 20 * e;
            this.Jh = 20 * b;
            qa(a, c - e);
            rb(a, d - b);
            c = a.getContext("2d");
            c.save();
            c[Ne](0.05, 0, 0, 0.05, 0, 0);
            c[Wc](-this.Ih, -this.Jh);
            for (d = 0; d < this[ue][H]; d++) {
                var g = this[ue][d], e = g[C].R(ti).O, b = g[ee] != m ? this[xc][g[ee]] : m, g = g[md] != m ? this[Cc][g[md]] : m;
                c.beginPath();
                for (var k = 0; k < e[H];)switch (e[k++]) {
                    case 0:
                        c.moveTo(e[k++],
                            e[k++]);
                        break;
                    case 2:
                        c.quadraticCurveTo(e[k++], e[k++], e[k++], e[k++]);
                        break;
                    case 1:
                        c.lineTo(e[k++], e[k++]);
                        break;
                    case 3:
                        c.closePath()
                }
                if (g) {
                    c.save();
                    if (!g.Wc(c, ti))return m;
                    c.restore()
                }
                if (b && !b.Wc(c, ti))return m
            }
            a = a.toDataURL("image/png");
            "data:image/png" == a[ld](0, 14) && (this.Dh = a)
        }
    };
    al[1] = function (a, b, c) {
        b = ff(Vi, c);
        b = a[Cc] ? a[Cc].map(b) : [];
        c = ff($i, c);
        c = a[xc] ? a[xc].map(c) : [];
        return new Sj(a.id, a[ue].map(ll), a[dd].map(Jh), b, c)
    };
    Sj[I].Fb = function (a, b, c) {
        return new Qj(this, a, c)
    };
    Sj[I].Kb = function () {
        if (!this.Zb) {
            this.Zb = new Kh;
            for (var a = 0; a < this[ue][H]; a++)if (this[ue][a][md] != m) {
                var b = this[ue][a][C].R(ti);
                this.Zb = this.Zb[Zb](b)
            }
        }
        return this.Zb
    };
    Sj[I].we = function (a) {
        if (this[dd]) {
            if (1 == this[dd][H])return new bj(this[dd][0]);
            var b = a / 65535, b = new Ih(Zh(this[dd][0].i, this[dd][1].i, b), Zh(this[dd][0].h, this[dd][1].h, b), Zh(this[dd][0].C, this[dd][1].C, b), Zh(this[dd][0].A, this[dd][1].A, b));
            return new bj(b, this[dd][0])
        }
        for (var b = {Va: function () {
            return a / 65535
        }}, c = new Ih, d = this[ue], e = 0; e < d[H]; ++e) {
            var g = d[e][C].R(b).O, k = 0;
            d[e][ee] != m && (k = this[xc][d[e][ee]][Kb].R(b) / 2);
            for (var n = 0, v = 0, A = 0; n < g[H];)switch (g[n++]) {
                case 0:
                    v = g[n++];
                    A = g[n++];
                    break;
                case 1:
                    c.qe(v,
                        A, k);
                    v = g[n++];
                    A = g[n++];
                    c.qe(v, A, k);
                    break;
                case 2:
                    var B = g[n++], P = g[n++], X = g[n++], la = g[n++], jb = (B - v) / (2 * B - v - X), Ib = (P - A) / (2 * P - A - la);
                    0 < Ib && 1 > Ib && c.qe(v, (1 - Ib) * (1 - Ib) * A + 2 * (1 - Ib) * Ib * P + Ib * Ib * la, k);
                    0 < jb && 1 > jb && c.qe((1 - jb) * (1 - jb) * v + 2 * (1 - jb) * jb * B + jb * jb * X, A, k);
                    v = X;
                    A = la;
                    c.qe(v, A, k)
            }
        }
        return new bj(c)
    };
    var Wj = function (a, b, c) {
        ua(this, a);
        this.fill = b;
        this.line = c
    }, ll = function (a) {
        return new Wj(vi(a[C], Bi, Oh), a[md], a[ee])
    };
    var ml = function (a, b) {
        this.id = a;
        this.sound = b
    };
    Q(ml, bl);
    al[11] = function (a) {
        return new ml(a.id, a[C])
    };
    ml[I].ob = function (a, b) {
        b.qd().pp(this.id, this[Jc])
    };
    var nl = function (a, b, c, d, e, g) {
        ra(this, a);
        oa(this, b);
        rb(this, c);
        this.x = d;
        this.y = e;
        za(this, g)
    }, ol = function (a, b, c, d) {
        this.id = a;
        ta(this, b);
        this.records = c;
        Pa(this, d)
    };
    Q(ol, bl);
    al[6] = function (a, b, c) {
        b = Jh(a[dd]);
        for (var d = Qh(a[Qb]), e = [], g = 0; a[Sd] && g < a[Sd][H]; g++) {
            var k = a[Sd][g], n = N(k[z]) ? c.$c(k[z]) : m;
            e[y](new nl(k[Lb], n, k[Ge], Sh(k.x), u(k.y), k[jc]))
        }
        return new ol(a.id, d, e, b)
    };
    ol[I].Fb = function (a, b, c) {
        return new Zj(this, a, c)
    };
    var pl = function (a) {
        $a(this, a)
    };
    Q(pl, cl);
    al[9] = function (a, b) {
        var c = b.md(Bk).fc(a[Dd]);
        return new pl(c)
    };
    pl[I].vf = function () {
    };
    pl[I].fi = function (a) {
        a.G().Fk(new sj(this[Dd], a))
    };
    pl[I].ii = function (a) {
        a.G().xi(new sj(this[Dd], a))
    };
    pl[I].Qf = function (a) {
        a[y](this)
    };
    var ql = function (a, b) {
        this.pe = a;
        this.a = b
    };
    Q(ql, cl);
    al[18] = function (a, b) {
        b.md(Ck);
        return new ql(a, b)
    };
    ql[I].bf = function () {
        var a = this.a.G(), b = new rl(this.pe, a);
        a.$m(b)
    };
    var sl = function (a) {
        $a(this, a)
    };
    Q(sl, pl);
    al[20] = function (a, b) {
        var c = b.md(Bk).fc(a[Dd]);
        return new sl(c)
    };
    sl[I].ob = function (a, b, c, d) {
        a.eh[d] || (a.eh[d] = []);
        a.eh[d][y](this)
    };
    var tl = function (a) {
        this.id = a
    };
    Q(tl, cl);
    al[12] = function (a, b) {
        return new tl(a.id, b)
    };
    tl[I].xd = function (a) {
        a.qd().Rj(this.id)
    };
    tl[I].vf = tl[I].xd;
    tl[I].Qf = function (a) {
        a[y](this)
    };
    var ul = function (a) {
        this.Ol = a
    };
    Q(ul, cl);
    al[16] = function (a) {
        return new ul(a[C])
    };
    ul[I].ob = function (a, b, c) {
        for (var d in this.Ol)a = c.$c(this.Ol[d]).get(), a instanceof zk && (a.pd[d] = a, a.Fj = d)
    };
    var vl = function (a, b) {
        this.Od = a;
        this.il = {};
        for (var c = 0; c < a[H]; c++)this.il[a[c][G]] = a[c][cd];
        this.zg = {};
        for (c = 0; c < b[H]; c++)this.zg[b[c][G]] = b[c][cd]
    };
    Q(vl, cl);
    al[23] = function (a) {
        return new vl(a.scenes, a.frames)
    };
    M = vl[I];
    M.ob = function (a) {
        a.ke = this
    };
    M.dj = function (a) {
        if (2 > this.Od[H])return 0;
        a = wf(this.Od, function (a, c) {
            return a[cd] - c[cd]
        } || xf, p, {offset: a});
        0 > a && (a = s.max(0, -a - 2));
        return a
    };
    M.xl = function (a) {
        return 2 > this.Od[H] ? 0 : this.Od[this.dj(a)][cd]
    };
    M.yo = function (a) {
        a = this.dj(a);
        return 0 < a ? this.Od[a - 1][cd] : u[ke]
    };
    M.xo = function (a) {
        a = this.dj(a);
        return a < this.Od[H] - 1 ? this.Od[a + 1][cd] : u[Hb]
    };
    var wl = function (a) {
        this.Ko = a
    };
    Q(wl, cl);
    al[19] = function (a, b) {
        return new wl(a.references, b)
    };
    wl[I].ob = function (a, b, c) {
        a = this.Ko;
        for (var d = 0; d < a[H]; d++) {
            var e = a[d], g = c.$c(e.id).get();
            g && (g.fh(e[G]), b.md(Ck).fh(e[G], g))
        }
    };
    var xl = function (a) {
        this.bp = a
    };
    Q(xl, cl);
    al[15] = function (a) {
        return new xl(a.label)
    };
    xl[I].ob = function (a, b, c, d) {
        a.ke.zg[this.bp] = d
    };
    var dl = function (a, b, c) {
        Ba(this, a);
        Ia(this, b);
        ta(this, c);
        this.Zf = ah.za().Ga()
    };
    Q(dl, cl);
    al[3] = function (a, b, c) {
        var d;
        if (N(a[Dd])) {
            var e = b.md(Bk);
            d = a[Dd].map(function (a) {
                return{events: a[Vb], key: a.key, actions: e.fc(a[Dd])}
            })
        }
        var g;
        g = N(a[Qb]) ? a[Qb] ? Qh(a[Qb]) : Bh : h;
        b = N(a.id) ? c.$c(a.id) : m;
        c = new dl(b, a[Sc], g);
        Oa(c, a[G]);
        c.ratio = a[rc];
        sa(c, a[Pb]);
        g = p;
        b && b.$f() && (g = b.get().Z);
        c.Z = g;
        c.clip = a[xd];
        c.colortransform = N(a[ne]) ? Uh(a[ne]) : h;
        Fa(c, a[Gc]);
        b = h;
        if (a[ze]) {
            b = [];
            for (g = 0; g < a[ze][H]; g++)b[y]((0, Jk[a[ze][g][Uc]])(a[ze][g]))
        }
        pb(c, b);
        $a(c, d);
        return c
    };
    M = dl[I];
    M.xd = function (a) {
        var b = this[Sc] + -16384, c = a.t.mc(b), d = m;
        if (!this[Pb] == !c) {
            if (c)if (this[D] && !c.Z() && !this.Z) {
                if (a.Fc(b), d = this.Eg(a))d[sc](c.na()), d.Db(c.Oa), d.Zd(c.Sa), d.bg(c.nc()), d.ph(c.Re), d.Ta(c[yc]())
            } else d = c; else d = this.Eg(a);
            d && !d.Wj() && (this[Qb] && d[sc](this[Qb]), this[ne] && d.Db(this[ne]), N(this[rc]) && d.tg(this[rc]), N(this[ze]) && d.Zd(this[ze]), N(this[Gc]) && d.bg(this[Gc]))
        }
    };
    M.vf = function (a) {
        var b = a.t.mc(this[Sc] + -16384), c = m;
        if (b) {
            var c = b.Z() && this.Z, d = this[D] ? this[D].id : h, d = !b.Z() && b[D].id == d;
            (c || d) && b.Va() == (this[rc] | 0) ? c = b : (a.t.nn(b), c = this.Eg(a))
        } else c = this.Eg(a);
        if (c)return c.Wj() || (c[sc](this[Qb] ? this[Qb] : Bh), c.Db(this[ne] ? this[ne] : Gh), c.tg(this[rc] | 0), c.Zd(this[ze] ? this[ze] : []), c.bg(this[Gc] | 0)), c
    };
    M.Eg = function (a) {
        if (!this[D] || !this[D].$f())return m;
        var b = this[D].get(), c = b.Fb(a.a, this.Zf);
        if (!c)return m;
        this[G] ? c.Ta(this[G]) : a.a.G().Lj(a.a, c);
        this[xd] && c.ph(this[xd] + -16384);
        if (this[Dd]) {
            c.Ye(128);
            for (b = 0; b < this[Dd][H]; ++b) {
                var d = this[Dd][b];
                c.zj(d[Vb], d.key, d[Dd])
            }
        } else b.Fj && c.Ye(128);
        a.fb(c, this[Sc] + -16384);
        c.Q(l);
        return c
    };
    M.cj = function (a) {
        a[y](this)
    };
    M.Qf = function (a) {
        var b = el(a, this[Sc]);
        if (0 > b)this[Pb] || a[y](this); else if (this[Pb]) {
            var c = a[b];
            a[Ie](b, 1);
            b = c[D];
            !c.Z && (!this.Z && this[D]) && (b = this[D]);
            b = new dl(b, this[Sc], N(this[Qb]) ? this[Qb] : c[Qb]);
            Oa(b, c[G]);
            b.ratio = N(this[rc]) ? this[rc] : c[rc];
            sa(b, p);
            b.Z = c.Z;
            b.clip = c[xd];
            b.colortransform = N(this[ne]) ? this[ne] : c[ne];
            Fa(b, N(this[Gc]) ? this[Gc] : c[Gc]);
            pb(b, N(this[ze]) ? this[ze] : c[ze]);
            $a(b, c[Dd]);
            a[y](b)
        }
    };
    M.mp = function (a) {
        if (!this[Dd] || !this.Z)return p;
        for (var b = 0; b < this[Dd][H]; ++b)if (0 != (this[Dd][b][Vb] & a))return l;
        return p
    };
    M.kp = function () {
        var a = new dl(this[D], this[Sc] + -65536, this[Qb]);
        Oa(a, this[G]);
        a.ratio = this[rc];
        sa(a, p);
        a.Z = l;
        a.clip = 0;
        a.colortransform = this[ne];
        Fa(a, this[Gc]);
        pb(a, this[ze]);
        $a(a, this[Dd]);
        return a
    };
    var yl = function (a) {
        this.Xi = a
    };
    Q(yl, cl);
    al[4] = function (a) {
        return new yl(a[Sc])
    };
    M = yl[I];
    M.xd = function (a) {
        a.Fc(this.Xi + -16384)
    };
    M.vf = yl[I].xd;
    M.cj = function (a) {
        a[y](this)
    };
    M.Qf = function (a) {
        var b = el(a, this.Xi);
        if (0 <= b) {
            var c = a[b];
            if (c.mp(160))a[b] = c.kp(), a[y](this.lp()); else a[Ie](b, 1)
        }
    };
    M.lp = function () {
        return new yl(this.Xi + -65536)
    };
    var zk = function (a, b, c) {
        this.id = a;
        this.Uj = [];
        this.ke = new vl([], []);
        this.frameCount = b;
        this.tags = [];
        this.eh = [];
        this.pd = c
    };
    Q(zk, bl);
    var hk = function (a, b, c) {
        var d = new zk(a.id, a[Td], c.pd);
        N(a.id) || c.Il(0, d);
        for (var e = 0, g = 0; a[gd] && g < a[gd][H]; g++) {
            var k = a[gd][g];
            if (2 == k[Uc])e++; else {
                var n = al[k[Uc]];
                n && n(k, b, c).ob(d, b, c, e)
            }
        }
        d.Fo();
        return d
    };
    al[7] = hk;
    zk[I].Z = l;
    zk[I].Fb = function (a, b, c) {
        return new ck(this, a, b, c)
    };
    zk[I].Fo = function () {
        for (var a = [], b = 0; b < this[Td]; ++b) {
            for (var c = this[gd][b], d = [], e = 0; e < a[H]; ++e)a[e].cj(d);
            if (c)for (e = 0; e < c[H]; ++e)c[e].Qf(d);
            a = this.Uj[b] = d
        }
    };
    var Ak = function (a, b) {
        this.Kl = a ? a : 60;
        this.sl = 1E3 / this.Kl;
        this.Mf = 0;
        this.tl = b;
        this.bh = p
    };
    hb(Ak[I], function () {
        this.bh || (this.bh = l, this.Mf = Date.now(), bi(ef(this.yl, this)))
    });
    Sa(Ak[I], function () {
        this.bh = p
    });
    Ak[I].yl = function () {
        if (this.bh) {
            var a = Date.now();
            a >= this.Mf && (this.tl.ei(), this.Mf += (s[Xb]((a - this.Mf) / this.sl) + 1) * this.sl);
            this.tl.lc();
            bi(ef(this.yl, this))
        }
    };
    var zl = ma("^[A-Z_a-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd][A-Z_a-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd.0-9\u00b7\u0300-\u036f\u203f-\u2040-]*$"), Al = function (a) {
        if (a != m && (a = w(a), a[vc](zl)))return a
    }, Bl = {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;", "\t": "&#x9;", "\n": "&#xA;",
        "\r": "&#xD;"}, Cl = function (a) {
        return Bl[a] || a
    }, Dl = function (a) {
        return a[Pb](/[<>&]/g, Cl)
    }, El = function (a) {
        return a[Pb](/[<&"\t\n\r]/g, Cl)
    }, Fl = {}, Gl;
    for (Gl in Bl)Fl[Bl[Gl]] = Gl;
    var Hl = function (a) {
        return a[Pb](/&(#?)([^\s]+?);/g, function (a, c, d) {
            return c && (c = u("0" + d), c === c) ? w[zc](c) : Fl[a] || a
        })
    }, Il = function (a, b, c) {
        this.mb = a;
        this.ha = 0;
        this.Yn = b;
        this.sn = c;
        bb(this, this.Hf)
    };
    M = Il[I];
    M.fl = function () {
        bb(this, this.fl);
        return m
    };
    M.Ob = function (a) {
        bb(this, function () {
            f(this.Ob(a))
        });
        f(new Jl(a))
    };
    M.Hf = function () {
        var a = this.Tg("<"), b;
        0 > a ? (b = this.mb[re](this.ha), bb(this, this.fl)) : (b = this.mb[re](this.ha, a), this.ha = a, bb(this, this.ao));
        this.Yn && (b = b[kc]());
        return b ? (b = Hl(b), {type: "text", value: b}) : this[Hd]()
    };
    M.ao = function () {
        var a = this.If("<![CDATA[", "]]\x3e", p, "cdata");
        if (a || (a = this.If("\x3c!--", "--\x3e", p, "comment")) || (a = this.If("<!DOCTYPE", ">", l, "doctype")) || (a = this.If("<?XML", "?>", l, "xml_declaration")) || !this.sn && (a = this.If("<?", "?>", p, "processing_instruction")))return a;
        if ("/" == this.mb[$b](this.ha + 1))return bb(this, this.Hf), {type: "close", value: this.yn()};
        for (a = {type: "tag", value: this.zn(), attributes: []}; ;) {
            this.Gk();
            this.Bn() && f(this.Ob("tag"));
            if (this.yi(">"))return bb(this, this.Hf), a;
            if (this.yi("/>"))return bb(this,
                this.An(a[cc])), a;
            a[Be][y]({name: this.wn(), value: this.xn()})
        }
    };
    M.An = function (a) {
        return function () {
            bb(this, this.Hf);
            return{type: "close", value: a}
        }
    };
    M.Tg = function (a) {
        return this.mb[hc](a, this.ha)
    };
    M.Bn = function () {
        return this.ha >= this.mb[H]
    };
    M.yi = function (a) {
        return this.mb[ld](this.ha, a[H])[He]() == a ? (this.ha += a[H], l) : p
    };
    M.Gk = function () {
        for (var a = this.mb; this.ha < a[H]; this.ha++)switch (a[$b](this.ha)) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
                break;
            default:
                return
        }
    };
    M.If = function (a, b, c, d) {
        var e = this.ha;
        if (!this.yi(a))return m;
        a = this.Tg(b);
        0 > a && f(this.Ob(d));
        c = c ? this.mb[re](e, a + b[H]) : this.mb[re](this.ha, a);
        this.ha = a + b[H];
        bb(this, this.Hf);
        return{type: d, value: c}
    };
    M.zn = function () {
        for (var a = this.mb, b = this.ha + 1, c = b; c < a[H]; c++)switch (a[$b](c)) {
            case "/":
                if (">" != a[$b](c + 1))break;
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case ">":
                return c == b && f(this.Ob("tag")), this.ha = c, a[re](b, c)
        }
        f(this.Ob("tag"))
    };
    M.yn = function () {
        for (var a = this.mb, b = this.ha + 2, c = p, d = b; d < a[H]; d++)switch (a[$b](d)) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
                c = l;
                break;
            case ">":
                return d == b && f(this.Ob("close")), this.ha = d + 1, a[re](b, d)[kc]();
            default:
                c && f(this.Ob("close"))
        }
        f(this.Ob("close"))
    };
    M.wn = function () {
        var a = this.Tg(">");
        0 > a && f(this.Ob("tag"));
        var b = this.Tg("="), c = this.ha;
        (0 > b || b == c || b > a) && f(this.Ob("attribute"));
        this.ha = b + 1;
        return this.mb[re](c, b)[kc]()
    };
    M.xn = function () {
        this.Gk();
        var a = this.mb, b = this.ha, c = a[$b](b++);
        if ('"' == c || "'" == c)for (var d = b; d < a[H]; d++)if (a[$b](d) == c)return this.ha = d + 1, Hl(a[re](b, d));
        f(this.Ob("attribute"))
    };
    var Jl = function (a) {
        Ka(this, a)
    };
    var Kl = function () {
        this.fa = {};
        this.Ni = this.Vb = 0;
        ki(this, m, 3)
    };
    Kl[I].getAscii = function () {
        return this.Ni
    };
    Kl[I].getCode = function () {
        return this.Vb
    };
    Kl[I].isDown = function (a) {
        return!!this.fa[a]
    };
    Kl[I].isToggled = function () {
        return p
    };
    q[ic](Kl[I], {BACKSPACE: {value: 8}, CAPSLOCK: {value: 20}, CONTROL: {value: 17}, DELETEKEY: {value: 46}, DOWN: {value: 40}, END: {value: 35}, ENTER: {value: 13}, ESCAPE: {value: 27}, HOME: {value: 36}, INSERT: {value: 45}, LEFT: {value: 37}, PGDN: {value: 34}, PGUP: {value: 33}, RIGHT: {value: 39}, SHIFT: {value: 16}, SPACE: {value: 32}, TAB: {value: 9}, UP: {value: 38}});
    Kl[I].Vg = function (a) {
        this.Vb = a[Fc];
        this.fa[a[Fc]] = p
    };
    Kl[I].Ug = function (a) {
        this.Vb = a[Fc];
        this.Ni = a[Ac];
        this.fa[a[Fc]] = l
    };
    var Ll = {37: 1, 39: 2, 36: 3, 35: 4, 45: 5, 46: 6, 8: 8, 13: 13, 38: 14, 40: 15, 33: 16, 34: 17, 9: 18, 27: 19};
    Kl[I].Vm = function () {
        var a = Ll[this.Vb];
        return a ? a : this.Ni
    };
    ki(Kl[I], m, 3);
    var Ml = function () {
        q[E](this, "__swiffy_mv", {value: l, writable: l});
        ki(this, m, 3)
    };
    Ml[I].Ce = function () {
        this.broadcastMessage("onMouseDown")
    };
    Ml[I].Og = function () {
        this.broadcastMessage("onMouseMove")
    };
    Ml[I].De = function () {
        this.broadcastMessage("onMouseUp")
    };
    Ml[I].hide = function () {
        var a = this.__swiffy_mv;
        this.__swiffy_mv = p;
        return a
    };
    Ml[I].show = function () {
        var a = this.__swiffy_mv;
        this.__swiffy_mv = l;
        return a
    };
    ki(Ml[I], m, 3);
    var Nl = function (a) {
        q[E](this, "__swiffy_v", {value: {rg: this.__swiffy_vm.tf(a), el: 0}})
    };
    sk(Nl);
    Nl[I].getRGB = function () {
        var a = this.__swiffy_v.rg;
        return!a || !a.__swiffy_d ? h : this.__swiffy_v.el
    };
    Nl[I].setRGB = function (a) {
        var b = this.__swiffy_v.rg;
        if (b && (b = b.__swiffy_d))this.__swiffy_v.el = a, a = new Fh(0, (a & 16711680) >> 16, 0, (a & 65280) >> 8, 0, a & 255, 1, 0), b.Db(a), b.ia()
    };
    Nl[I].setTransform = function (a) {
        var b = this.__swiffy_v.rg;
        if (b && a && (b = b.__swiffy_d)) {
            var c = this.__swiffy_vm, d = c.j(a, "ra"), e = c.j(a, "rb"), g = c.j(a, "ga"), k = c.j(a, "gb"), n = c.j(a, "ba"), v = c.j(a, "bb"), A = c.j(a, "aa"), c = c.j(a, "ab"), B = b.Oa;
            a = new Fh(N(a[d]) ? a[d] / 100 : B.X, N(a[e]) ? a[e] : B.U, N(a[g]) ? a[g] / 100 : B.W, N(a[k]) ? a[k] : B.T, N(a[n]) ? a[n] / 100 : B.V, N(a[v]) ? a[v] : B.S, N(a[A]) ? a[A] / 100 : B.M, N(a[c]) ? a[c] : B.Y);
            b.Db(a);
            b.ia()
        }
    };
    Nl[I].getTransform = function () {
        var a = this.__swiffy_v.rg;
        if (a && (a = a.__swiffy_d))return a = a.Oa, {ra: 100 * a.X, rb: a.U, ga: 100 * a.W, gb: a.T, ba: 100 * a.V, bb: a.S, aa: 100 * a.M, ab: a.Y}
    };
    ki(Nl[I], m, 3);
    var sj = function (a, b) {
        this.qn = a;
        this.b = b
    };
    var Ol = function (a, b) {
        this.object = a;
        La(this, b)
    };
    Ol[I].qk = function () {
        for (var a = p, b = this[ub][Ld]; b; b = b.r && b.r[Ld]) {
            if (a)return b[I];
            for (var c = q[Bb](b[I]), d = 0; d < c[H] && !a; d++)b[I][c[d]] === this[Vc] && (a = l)
        }
    };
    var Pl = function (a, b) {
        this.D = a;
        ua(this, {});
        this.Da = b
    };
    M = Pl[I];
    M.get = function (a) {
        var b = this.D.j(this[C], a);
        return b in this[C] ? this[C][b] : this.Da.get(a)
    };
    gb(M, function (a, b) {
        var c = this.D.j(this[C], a);
        if (c in this[C])if (c = this[C][c], c instanceof Ol) {
            var d = c[Vc].r[Ld];
            if (O(d))return d[L](c[ub], b)
        } else {
            if (O(c))return c[L](this.cb(), b)
        } else return this.Da[K](a, b)
    });
    M.set = function (a, b) {
        var c = this.D.j(this[C], a);
        return c in this[C] ? (this[C][c] = b, l) : this.Da.set(a, b)
    };
    M.Ib = function (a, b) {
        this[C][this.D.Xb(this[C], a)] = b
    };
    M.Cf = function (a) {
        a = this.D.Xb(this[C], a);
        a in this[C] || (this[C][a] = h)
    };
    M.Rc = function (a) {
        return this.D.j(this[C], a)in this[C] ? p : this.Da.Rc(a)
    };
    M.sc = function (a) {
        this.Da.sc(a)
    };
    M.cb = function () {
        return this.Da.cb()
    };
    M.Bd = function () {
        return this.Da.Bd()
    };
    var Ql = function (a, b, c) {
        this.D = a;
        ua(this, c);
        this.Da = b
    };
    M = Ql[I];
    M.get = function (a) {
        var b = this.D.j(this[C], a);
        return b in this[C] ? this[C][b] : this.Da.get(a)
    };
    gb(M, function (a, b) {
        var c = this.D.j(this[C], a);
        if (c in this[C]) {
            if (c = this[C][c], O(c))return c[L](this[C], b)
        } else return this.Da[K](a, b)
    });
    M.set = function (a, b) {
        var c = this.D.j(this[C], a);
        return c in this[C] ? (this[C][c] = b, l) : this.Da.set(a, b)
    };
    M.Ib = function (a, b) {
        var c = this.D.j(this[C], a);
        c in this[C] ? this[C][c] = b : this.Da.Ib(a, b)
    };
    M.Cf = function (a) {
        this.D.j(this[C], a)in this[C] || this.Da.Cf(a)
    };
    M.Rc = function (a) {
        var b = this.D.j(this[C], a);
        return b in this[C] ? this.D.yb(this[C], b) : this.Da.Rc(a)
    };
    M.sc = function (a) {
        this.Da.sc(a)
    };
    M.cb = function () {
        return this.Da.cb()
    };
    M.Bd = function () {
        return this.Da.Bd()
    };
    var Rl = function (a, b, c) {
        this.D = a;
        ua(this, c);
        this.Hi = c;
        this.wi = b;
        this.zi = c
    };
    M = Rl[I];
    M.get = function (a) {
        var b = this.D.j(this[C], a);
        return b in this[C] ? this[C][b] : "this" == a[Pe]() ? this.zi : this.wi.get(a)
    };
    gb(M, function (a, b) {
        var c = this.D.j(this[C], a), d = this[C][c];
        if (c in this[C]) {
            if (O(d))return d[L](this[C], b)
        } else return this.wi[K](a, b)
    });
    M.set = function (a, b) {
        var c = this.D.Xb(this[C], a);
        this[C][c] = b;
        return l
    };
    M.Ib = function (a, b) {
        var c = this.D.Xb(this[C], a);
        this[C][c] = b
    };
    M.Cf = function (a) {
        a = this.D.Xb(this[C], a);
        a in this[C] || (this[C][a] = h)
    };
    M.Rc = function (a) {
        var b = this.D.j(this[C], a);
        return b in this[C] ? this.D.yb(this[C], b) : this.wi.Rc(a)
    };
    M.sc = function (a) {
        a ? (this.Hi = a, ua(this, a)) : (this.Hi = m, ua(this, this.zi))
    };
    M.cb = function () {
        return this.Hi
    };
    M.Bd = function () {
        return this.zi
    };
    var Tl = function (a) {
        this.D = a;
        ua(this, new Sl(a));
        this[C]._global = this[C];
        ki(this[C], "_global", 3)
    };
    M = Tl[I];
    M.get = function (a) {
        return this[C][this.D.j(this[C], a)]
    };
    gb(M, function (a, b) {
        var c = this[C][this.D.j(this[C], a)];
        if (O(c))return c[L](this[C], b)
    });
    M.set = function () {
        return p
    };
    M.Ib = function () {
    };
    M.Cf = function () {
    };
    M.Rc = function (a) {
        a = this.D.j(this[C], a);
        return this.D.yb(this[C], a)
    };
    M.sc = function () {
        f(new TypeError("setTarget should not be called on the GlobalContext"))
    };
    M.cb = function () {
        f(new TypeError("getTarget should not be called on the GlobalContext"))
    };
    M.Bd = function () {
        f(new TypeError("getTargetBase should not be called on the GlobalContext"))
    };
    var ci = function () {
    };
    Q(ci, mi);
    pa(ci[I], function () {
        return this
    });
    ci[I].getDepth = function () {
        var a = this.__swiffy_d;
        return a ? a[Sc] : h
    };
    var Ul = function (a, b, c, d) {
        q[E](a, b, {get: function () {
            var a = this.__swiffy_d;
            if (a)return c[K](this, a)
        }, set: function (a) {
            var c = this.__swiffy_d;
            c ? d[K](this, c, a) : q[E](this, b, {value: a})
        }})
    }, Vl = function (a, b, c, d) {
        Ul(a, b, c, function (a, b) {
            var c = a.a.G().vd(b);
            da(c) || d[K](this, a, c)
        })
    }, Wl = function (a, b) {
        Ul(a, b, function () {
            return 0
        }, function () {
        })
    }, Xl = function (a, b, c) {
        Ul(a, b, c, function () {
        })
    };
    Vl(ci[I], "_x", function (a) {
        return a.na().k / 20
    }, function (a, b) {
        var c = a.na();
        a[sc](c[Wc](20 * b - c.k, 0));
        a.ia()
    });
    Vl(ci[I], "_y", function (a) {
        return a.na().l / 20
    }, function (a, b) {
        var c = a.na();
        a[sc](c[Wc](0, 20 * b - c.l));
        a.ia()
    });
    Vl(ci[I], "_xscale", function (a) {
        return 100 * a.Ab().uc
    }, function (a, b) {
        a.Ab().uc = b / 100;
        a.Ee();
        a.ia()
    });
    Vl(ci[I], "_yscale", function (a) {
        return 100 * a.Ab().ud
    }, function (a, b) {
        a.Ab().ud = b / 100;
        a.Ee();
        a.ia()
    });
    Vl(ci[I], "_alpha", function (a) {
        return(256 * a.Oa.M | 0) / 2.56
    }, function (a, b) {
        var c = a.Oa;
        a.Db(new Fh(c.X, c.U, c.W, c.T, c.V, c.S, b / 100, c.Y));
        a.ia()
    });
    Vl(ci[I], "_visible", function (a) {
        return a.Se
    }, function (a, b) {
        a.sm(ga(b))
    });
    Vl(ci[I], "_rotation", function (a) {
        return-180 * a.Ab()[Gd] / s.PI
    }, function (a, b) {
        ab(a.Ab(), -b * s.PI / 180);
        a.Ee();
        a.ia()
    });
    Ul(ci[I], "_name", function (a) {
        return a[yc]()
    }, function (a, b) {
        a.Ta(b)
    });
    Wl(ci[I], "_quality");
    Wl(ci[I], "_highquality");
    Wl(ci[I], "_soundbuftime");
    Xl(ci[I], "_parent", function (a) {
        return(a = a[Ab]()) && a != a.a ? a.e : h
    });
    Xl(ci[I], "_xmouse", function (a) {
        var b = a.a.hc.J();
        b.F(a.ic());
        return b.x / 20
    });
    Xl(ci[I], "_ymouse", function (a) {
        var b = a.a.hc.J();
        b.F(a.ic());
        return b.y / 20
    });
    Xl(ci[I], "_url", function (a) {
        return a.xh === m ? r[Qd][qe][Pb](/\.html$/, "") : a.xh
    });
    Vl(ci[I], "_width", function (a) {
        return a.$a()
    }, function (a, b) {
        a.Nl(b);
        a.ia()
    });
    Vl(ci[I], "_height", function (a) {
        return a.Yh()
    }, function (a, b) {
        a.Ml(b);
        a.ia()
    });
    Xl(ci[I], "_root", function (a) {
        for (; a && !a.dg && a[Ab]() != a.a;)a = a[Ab]();
        return a ? a.e : h
    });
    Xl(ci[I], "_target", function (a) {
        for (var b = ""; a && a[yc]();)b = "/" + a[yc]() + b, a = a[Ab]();
        a && a[Ab]() == a.a && (a = a[Sc] - -16384) && (b = "_level" + a + b);
        return b || "/"
    });
    Ul(ci[I], "filters", function () {
        return[]
    }, function (a, b) {
        for (var c = [], d = 0; b != m && d < b[H]; d++) {
            var e = b[d].__swiffy_v;
            c[y](e ? e : new Yk)
        }
        a.Zd(c)
    });
    ki(ci[I], m, 3);
    var Yl = function () {
    };
    Q(Yl, ci);
    var Zl = function (a, b) {
        q[E](this, a, {value: b, configurable: l, writable: l, enumerable: l});
        var c = this.__swiffy_d;
        c && c != c.a.oa && c.hf()
    }, $l = function () {
    }, am = {4: "onMouseUp", 8: "onMouseDown", 16: "onMouseMove", 32: "onUnload", 64: "onEnterFrame", 524288: "onConstruct", 128: "onLoad", 16384: "onDragOver", 65536: "onDragOver", 256: "onRollOut", 512: "onRollOver", 1024: "onReleaseOutside", 2048: "onRelease", 4096: "onPress", 8192: "onDragOut", 32768: "onDragOut"};
    q[ic](Yl[I], function () {
        var a = {}, b;
        for (b in am)if (b & 130816) {
            var c = am[b];
            a[c] = {get: $l, set: ff(Zl, c)}
        }
        return a
    }());
    ki(Yl[I], m, 3);
    var bm = function () {
    };
    Q(bm, Yl);
    ki(bm[I], m, 3);
    var cm = function (a) {
        Oa(this, "Error");
        this.message = N(a) ? a : "Error"
    };
    Ta(cm[I], function () {
        return this.message
    });
    ki(cm[I], m, 3);
    var dm = function (a) {
        return mi[K](this, a)
    };
    Q(dm, mi);
    q[E](dm, "__swiffy_wrapped_type", {value: ca});
    q[E](ca, "__swiffy_override", {value: ni});
    q[E](dm, "__swiffy_override", {value: ni});
    nb(dm[I], function (a, b) {
        var c = this;
        if (O(c))return"__swiffy_override"in c && (c = c.__swiffy_override), ca[I][L][K](c, em(a), Ue(b) ? b : [])
    });
    q[E](ca[I][L], "__swiffy_override", {value: dm[I][L]});
    ca[I][ad] && q[E](ca[I][ad], "__swiffy_override", {value: h});
    gb(dm[I], function (a, b) {
        return dm[I][L][K](this, a, t[I][Ob][K](arguments, 1))
    });
    q[E](ca[I][K], "__swiffy_override", {value: dm[I][K]});
    ki(dm, m, 3);
    ki(dm[I], m, 3);
    var R = function () {
    };
    Q(R, bm);
    R[I].enabled = l;
    R[I].useHandCursor = l;
    R[I].focusEnabled = h;
    R[I].gotoAndStop = function (a) {
        var b = this.__swiffy_d;
        b && b.Sc(b.wd(a), p)
    };
    R[I].gotoAndPlay = function (a) {
        var b = this.__swiffy_d;
        b && b.Sc(b.wd(a), l)
    };
    Ha(R[I], function () {
        var a = this.__swiffy_d;
        a && a[Qc]()
    });
    Sa(R[I], function () {
        var a = this.__swiffy_d;
        a && a[nd]()
    });
    R[I].nextFrame = function () {
        var a = this.__swiffy_d;
        a && a.Pf()
    };
    R[I].prevFrame = function () {
        var a = this.__swiffy_d;
        a && a.ej()
    };
    R[I].globalToLocal = function (a) {
        var b = this.__swiffy_d;
        if (b) {
            var c = b.a.G(), d = c.Qj(a);
            if (d != m) {
                var e = c.j(a, "x"), c = c.j(a, "y"), b = Yh(b.ic(), d);
                a[e] = b.x;
                a[c] = b.y
            }
        }
    };
    R[I].localToGlobal = function (a) {
        var b = this.__swiffy_d;
        if (b) {
            var c = b.a.G(), d = c.Qj(a);
            if (d != m) {
                var e = c.j(a, "x"), c = c.j(a, "y"), b = Yh(b.Ua(), d);
                a[e] = b.x;
                a[c] = b.y
            }
        }
    };
    R[I].createEmptyMovieClip = function (a, b) {
        var c = this.__swiffy_d;
        if (c) {
            var d = new zk(0, 0, c[D].pd), d = new ck(d, c.a, m);
            d.Hc = l;
            d.Ta(a);
            d.Q();
            c.Fc(b);
            c.fb(d, b);
            return d.e
        }
    };
    R[I].createTextField = function (a, b, c, d, e, g) {
        if (!(6 > arguments[H])) {
            a = w(a);
            b = Th(b);
            c = Th(c);
            d = Th(d);
            e = s.abs(Th(e));
            g = s.abs(Th(g));
            var k = this.__swiffy_d;
            if (k) {
                var n = new jl(-1, m, 240, 4278190080);
                n.border = p;
                n.oj = p;
                n.html = p;
                n.maxChars = m;
                n.multiline = p;
                n.password = p;
                n.selectable = l;
                n.variable = m;
                n.wrap = p;
                Pa(n, new Ih(0, 0, 20 * e, 20 * g));
                n = new ij(n, k.a, m);
                n.Ta(a);
                n[sc](new Ah(1, 0, 0, 1, 20 * c, 20 * d));
                n.Q();
                k.Fc(b);
                k.fb(n, b);
                return n.e
            }
        }
    };
    R[I].getNextHighestDepth = function () {
        var a = this.__swiffy_d;
        return a ? a.t.wo() : h
    };
    R[I].getInstanceAtDepth = function (a) {
        var b = this.__swiffy_d;
        if (b && !(-16384 > a) && (a = b.t.mc(a)))return a instanceof rj ? a.e : b.e
    };
    R[I].getSWFVersion = function () {
        var a = this.__swiffy_d;
        return a ? a.a.Ba : -1
    };
    R[I].setMask = function (a) {
        var b = this.__swiffy_d;
        if (b) {
            var c;
            c = We(a) ? b.a.G().ok(a) : a;
            if (c instanceof R)return b.sf(c.__swiffy_d), l;
            b.sf(m);
            return!N(a)
        }
    };
    R[I].attachMovie = function (a, b, c, d) {
        var e = this.__swiffy_d;
        if (e && (a = e[D].pd[a], N(a))) {
            var g = ah.za().Ga();
            a = a.Fb(e.a, g);
            a.Hc = l;
            a.Ta(b);
            e.Fc(c);
            e.fb(a, c);
            if (N(d)) {
                b = a.e;
                for (var k in d)b[k] = d[k]
            }
            a.Q();
            return a.e
        }
    };
    R[I].duplicateMovieClip = function (a, b, c) {
        var d = this.__swiffy_d;
        if (d) {
            var e = d[Ab]();
            if (e) {
                a = d.duplicate(e, a, b);
                if (N(c)) {
                    b = a.e;
                    for (var g in c)b[g] = c[g]
                }
                return a.e
            }
        }
    };
    R[I].removeMovieClip = function () {
        var a = this.__swiffy_d;
        if (a) {
            var b = a[Ab]();
            0 <= a[Sc] && (a.Hc && b) && (a.L(), b[Zd](a))
        }
    };
    R[I].loadMovie = function (a, b) {
        var c = this.__swiffy_d;
        c && (a = c.a.G().$(a), c.jk(a, b, this))
    };
    R[I].loadVariables = function (a, b) {
        var c = this.__swiffy_d;
        c && ok(a, c.a, b, this, function () {
            return c
        })
    };
    R[I].unloadMovie = function () {
        var a = this.__swiffy_d;
        a && a.mi(new zk(0, 0, a[D].pd))
    };
    R[I].swapDepths = function (a) {
        var b = this.__swiffy_d, c = b ? b[Ab]() : h;
        if (c) {
            var d = h;
            if (a instanceof ci) {
                a = a.__swiffy_d;
                if (a[Ab]() != c)return;
                d = a[Sc]
            } else"number" === typeof a && (d = a);
            N(d) && c.Ci(b[Sc], d)
        }
    };
    R[I].getBytesTotal = function () {
        var a = this.__swiffy_d;
        if (a)return a.a.vm
    };
    R[I].getBytesLoaded = R[I].getBytesTotal;
    R[I].getBounds = function (a) {
        var b = this.__swiffy_d;
        if (b) {
            var c = b.Bb().Ec().J();
            c.Aa() && c[Mb](134217728, 134217728);
            if (N(a)) {
                var d = m;
                We(a) && (a = b.a.G().We(a, this));
                a instanceof R && (d = a.__swiffy_d);
                if (d)a = d.ic(), c.F(b.Ua()[ie](a)); else return
            }
            b = {};
            b.xMin = c.i / 20;
            b.xMax = c.C / 20;
            b.yMin = c.h / 20;
            b.yMax = c.A / 20;
            return b
        }
    };
    R[I].getURL = function (a, b, c) {
        var d = this.__swiffy_d;
        if (d) {
            var e = d.a.G();
            a = e.$(a);
            var g = 0;
            We(c) && (c = c[Pe](), "get" == c ? g = 1 : "post" == c && (g = 2));
            a = new xk(e, this, a, b, g);
            d.a.rf(a)
        }
    };
    R[I].hitTest = function (a, b, c) {
        var d = this.__swiffy_d;
        if (N(a) && d) {
            var e = d.Bb().Ec().J();
            e.F(d.Ua());
            if (!N(b) && !N(c)) {
                if (b = m, a instanceof R ? b = a.__swiffy_d : We(a) && (b = d.a.G().We(a, this)), b != m)return a = b.Bb().Ec().J(), a.F(b.Ua()), e.Gm(a)
            } else if (N(b))return e[xe](20 * a, 20 * b)
        }
        return p
    };
    Ma(R[I], function () {
        var a = this.__swiffy_d;
        a && a.ua("clear", arguments)
    });
    R[I].moveTo = function () {
        var a = this.__swiffy_d;
        a && a.ua("moveTo", arguments)
    };
    R[I].lineTo = function () {
        var a = this.__swiffy_d;
        a && a.ua("lineTo", arguments)
    };
    R[I].curveTo = function () {
        var a = this.__swiffy_d;
        a && a.ua("curveTo", arguments)
    };
    R[I].lineStyle = function () {
        var a = this.__swiffy_d;
        a && a.ua("lineStyle", arguments)
    };
    R[I].beginFill = function () {
        var a = this.__swiffy_d;
        a && a.ua("beginFill", arguments)
    };
    R[I].endFill = function () {
        var a = this.__swiffy_d;
        a && a.ua("endFill", arguments)
    };
    R[I].startDrag = function () {
    };
    R[I].stopDrag = function () {
    };
    Xl(R[I], "_currentframe", function (a) {
        return s.max(1, a.ta + 1)
    });
    Xl(R[I], "_totalframes", function (a) {
        return a[D][Td]
    });
    Xl(R[I], "_framesloaded", function (a) {
        return a[D][Td]
    });
    Ul(R[I], "_lockroot", function (a) {
        return a.dg
    }, function (a, b) {
        a.Kj(ga(b))
    });
    ki(R[I], m, 3);
    var fm = function () {
        this.__swiffy_vm.jf(this)
    };
    sk(fm);
    fm[I].checkPolicyFile = p;
    fm[I].loadClip = function (a, b) {
        if (a && b) {
            var c = this.__swiffy_vm;
            a = c.$(a);
            var d = this, e = b.__swiffy_d;
            Ye(b) ? e = c.a.oa : We(b) ? e = c.tf(b).__swiffy_d : e.ci(ek(a));
            c = new dk;
            c.Ka = function (c, k) {
                d.broadcastMessage("onLoadStart", b);
                d.broadcastMessage("onLoadProgress", b, 1024, 1024);
                d.broadcastMessage("onLoadComplete", b, k);
                Ye(b) ? ik(e.a, b, c, function (b) {
                    b.ci(ek(a))
                }, function () {
                    d.broadcastMessage("onLoadInit", b)
                }) : fk(e, c, function () {
                    d.broadcastMessage("onLoadInit", b)
                })
            };
            c.vb = function (a) {
                d.broadcastMessage("onLoadError", b,
                    a)
            };
            gk(a, e.a, "", this, c)
        }
    };
    fm[I].getProgress = function () {
        return{bytesLoaded: 1024, bytesTotal: 1024}
    };
    fm[I].unloadClip = function (a) {
        (a = a && a.__swiffy_d) && a.mi(new zk(0, 0, a[D].pd))
    };
    var gm = function () {
    };
    sk(gm);
    gm[I].connect = function (a) {
        var b = this.__swiffy_vm.a.wk;
        b && a && b.vk("GET", a, m, m, "AS2.NetConnection.connect");
        return l
    };
    var hm = function () {
    };
    sk(hm);
    Ha(hm[I], function (a) {
        var b = this.__swiffy_vm.a.wk;
        b && a && b.vk("GET", a, m, m, "AS2.NetStream.play")
    });
    hm[I].close = function () {
    };
    hm[I].pause = function () {
    };
    hm[I].receiveAudio = function () {
    };
    hm[I].receiveVideo = function () {
    };
    hm[I].seek = function () {
    };
    hm[I].setBufferTime = function () {
    };
    q[E](hm, "bufferLength", {value: 0, writable: p});
    q[E](hm, "bufferTime", {value: 0.1, writable: p});
    q[E](hm, "currentFps", {value: 0, writable: p});
    q[E](hm, "liveDelay", {value: 0, writable: p});
    q[E](hm, "time", {value: 0, writable: p});
    var im = function () {
    };
    Q(im, bm);
    im[I].enabled = l;
    im[I].useHandCursor = l;
    ki(im[I], m, 3);
    var jm = function () {
    };
    Q(jm, ci);
    jm[I].getTextFormat = function (a, b) {
        var c = this.__swiffy_d;
        if (c) {
            var d = new km, c = c.Pl(a, b);
            Ua(d, c[qd]);
            za(d, c[jc]);
            oa(d, c[z]);
            ya(d, c[dc]);
            Za(d, c[Ad]);
            return d
        }
    };
    jm[I].setTextFormat = function (a, b, c) {
        var d = this.__swiffy_d;
        if (d) {
            var e, g, k;
            a instanceof km && (e = a);
            N(b) && b instanceof km && (e = b, g = a);
            N(c) && (e = c, g = a, k = b);
            a = new zj;
            Ua(a, e[qd]);
            N(e[jc]) && za(a, 16777215 & e[jc]);
            oa(a, e[z]);
            ya(a, e[dc]);
            N(e[Ad]) && Za(a, e[Ad]);
            d.ah(a, g, k)
        }
    };
    jm[I].getNewTextFormat = function () {
        var a = this.__swiffy_d;
        if (a) {
            var b = new km, a = a.Np();
            Ua(b, a[qd]);
            za(b, a[jc]);
            oa(b, a[z]);
            ya(b, a[dc]);
            Za(b, a[Ad]);
            return b
        }
    };
    jm[I].setNewTextFormat = function (a) {
        var b = this.__swiffy_d;
        if (b) {
            var c = new zj;
            Ua(c, a[qd]);
            N(a[jc]) && c.Vl(16777215 & a[jc]);
            oa(c, a[z]);
            ya(c, a[dc]);
            b.zp(c)
        }
    };
    var lm = function (a, b, c) {
        q[E](jm[I], a, {get: function () {
            var a = this.__swiffy_d;
            if (a)return b[K](this, a)
        }, set: function (a) {
            var b = this.__swiffy_d;
            b && c && c[K](this, b, a)
        }, enumerable: l})
    };
    lm("text", function (a) {
        var b = a.Wb;
        a.Ya && (b = Fj(b, a[D][Pd]));
        return b
    }, function (a, b) {
        b = a.a.G().$(b);
        a.Ya && (b = Gj(b));
        a.Jc(b, l)
    });
    lm("htmlText", function (a) {
        var b = a.Wb;
        a.Ya && (b = Hj(w(b)));
        return b
    }, function (a, b) {
        b = a.a.G().$(b);
        a.Jc(b)
    });
    lm("textColor", function (a) {
        return a.km()
    }, function (a, b) {
        a.rm(u(b))
    });
    lm("antiAliasType", function (a) {
        return a.Zj
    }, function (a, b) {
        ("normal" == b || "advanced" == b) && a.dq(w(b))
    });
    lm("autoSize", function (a) {
        return a.Yf
    }, function (a, b) {
        switch (b) {
            case l:
                b = "left";
            case "center":
            case "left":
            case "none":
            case "right":
                break;
            default:
                b = "none"
        }
        a.nm(b)
    });
    lm("background", function (a) {
        return a.$j
    }, function (a, b) {
        a.eq(!!b)
    });
    lm("backgroundColor", function (a) {
        return a.Kp()
    }, function (a, b) {
        a.fq(u(b))
    });
    lm("border", function (a) {
        return a.ak
    }, function (a, b) {
        a.gq(!!b)
    });
    lm("borderColor", function (a) {
        return a.Lp()
    }, function (a, b) {
        a.hq(u(b))
    });
    lm("condenseWhite", function (a) {
        return a.bk
    }, function (a, b) {
        a.iq(!!b)
    });
    lm("embedFonts", function (a) {
        return a.yh
    }, function (a, b) {
        a.jq(!!b)
    });
    lm("gridFitType", function (a) {
        return a.ck
    }, function (a, b) {
        ("none" == b || "pixel" == b || "subpixel" == b) && a.lq(w(b))
    });
    q[E](jm[I], "filters", {value: [], enumerable: l});
    lm("html", function (a) {
        return a.Ya
    }, function (a, b) {
        b = !!b;
        if (b != a.Ya) {
            var c = this[Lb];
            a.Zo(b);
            ra(this, c)
        }
    });
    lm("length", function () {
        return this[Lb][H]
    });
    lm("maxChars", function (a) {
        return a.dk
    }, function (a, b) {
        a.mq(b != m ? u(b) : m)
    });
    lm("mouseWheelEnabled", function () {
        return l
    });
    lm("multiline", function (a) {
        return a.lg
    }, function (a, b) {
        a.oq(!!b)
    });
    lm("password", function (a) {
        return a.ek
    }, function (a, b) {
        a.pq(!!b)
    });
    lm("restrict", function (a) {
        return a.Pm
    }, function () {
    });
    lm("selectable", function (a) {
        return a.bi
    }, function (a, b) {
        a.qm(!!b)
    });
    q[E](jm[I], "styleSheet", {value: h, enumerable: l});
    lm("sharpness", function (a) {
        return a.fk
    }, function (a, b) {
        a.qq(u(b))
    });
    q[E](jm[I], "tabIndex", {value: h, enumerable: l});
    lm("textHeight", function (a) {
        return s[Xb](a.Op() / 20)
    });
    lm("textWidth", function (a) {
        return s[Xb](a.Pp() / 20)
    });
    lm("thickness", function (a) {
        return a.gk
    }, function (a, b) {
        a.rq(u(b))
    });
    lm("variable", function (a) {
        return a.Xg()
    });
    lm("wordWrap", function (a) {
        return a.Nh
    }, function (a, b) {
        a.tq(!!b)
    });
    lm("type", function (a) {
        return a.ai ? "input" : "dynamic"
    }, function (a, b) {
        b = w(b)[Pe]();
        "input" == b ? a.lj(l) : "dynamic" == b && a.lj(p)
    });
    ki(jm[I], m, 3);
    var mm = function () {
        q[E](this, "contentType", {value: "application/x-www-form-urlencoded", writable: l});
        q[E](this, "loaded", {value: p, writable: l});
        q[E](this, "requestHeaders", {value: []})
    };
    sk(mm);
    mm[I].addRequestHeader = function (a, b) {
        if (We(a) && N(b))this.requestHeaders[y](new nm(a, b)); else if (Ue(a))for (var c = a[H] / 2, d = 0; d < c; d++)this.requestHeaders[y](new nm(a[2 * d], a[2 * d + 1]))
    };
    va(mm[I], function (a) {
        var b = this.__swiffy_vm;
        a = b.$(a);
        lb(this, p);
        var c = this, d = new dk;
        d.Ka = function (a) {
            if (O(c.onData))c.onData(a)
        };
        d.vb = function () {
            if (O(c.onData))c.onData(h)
        };
        nk(a, b.a, h, this, d)
    });
    mm[I].send = function (a, b, c) {
        if (0 == arguments[H])return p;
        var d = this.__swiffy_vm;
        a = d.$(a);
        var e = N(b) ? b : "_self", g;
        "GET" == c ? g = 1 : !N(c) || "POST" == c ? g = 2 : f("Bad method: " + c);
        d.a.rf(new xk(d, this, a, e, g))
    };
    mm[I].sendAndLoad = function (a, b, c) {
        var d = this.__swiffy_vm;
        a = d.$(a);
        lb(b, p);
        var e = new dk;
        e.Ka = function (a) {
            if (O(b.onData))b.onData(a)
        };
        e.vb = function () {
            if (O(b.onData))b.onData(h)
        };
        nk(a, d.a, c || "POST", this[od](), e, this.requestHeaders, this.contentType)
    };
    mm[I].onData = function (a) {
        var b = N(a);
        b && O(this.decode) && this.decode(a);
        lb(this, b);
        if (O(this.onLoad))this.onLoad(b)
    };
    mm[I].onLoad = function () {
    };
    mm[I].decode = function (a) {
        a = hi(a);
        for (var b in a) {
            var c = a[b];
            this[b] = c[c[H] - 1]
        }
    };
    Ta(mm[I], function () {
        return di(this)
    });
    ki(mm[I], m, 3);
    var om = function (a, b) {
        q[E](this, "nodeType", {value: a, writable: p});
        q[E](this, "attributes", {value: {}, writable: p});
        1 == a ? (this.nodeName = b, this.nodeValue = m) : (this.nodeName = m, this.nodeValue = b);
        this["__swiffy.next_sibling"] = m;
        this["__swiffy.previous_sibling"] = m;
        this["__swiffy.parent_node"] = m;
        this["__swiffy.child_nodes"] = []
    };
    q[E](om[I], "childNodes", {get: function () {
        return this["__swiffy.child_nodes"][Ob](0)
    }});
    q[E](om[I], "firstChild", {get: function () {
        return this["__swiffy.child_nodes"][0]
    }});
    q[E](om[I], "lastChild", {get: function () {
        return this["__swiffy.child_nodes"][this["__swiffy.child_nodes"][H] - 1]
    }});
    q[E](om[I], "nextSibling", {get: function () {
        return this["__swiffy.next_sibling"]
    }});
    q[E](om[I], "parentNode", {get: function () {
        return this["__swiffy.parent_node"]
    }});
    q[E](om[I], "previousSibling", {get: function () {
        return this["__swiffy.previous_sibling"]
    }});
    Ta(om[I], function () {
        return pm(this, p, 0)
    });
    var pm = function (a, b, c) {
        b = "undefined" !== typeof b ? b : p;
        c = "undefined" !== typeof c ? c : 0;
        var d = "";
        if (b)for (var e = 0; e < c; e++)d += "  ";
        var g = b ? "\n" : "";
        if (3 == a[Rb])return d + Dl(a.nodeValue) + g;
        var k = "";
        if (a[oc] == m)a.xmlDecl && (k += d + a.xmlDecl + g), a.docTypeDecl && (k += d + a.docTypeDecl + g); else {
            var k = k + (d + "<" + a[oc]), n;
            for (n in a[Be])k += " " + n + '="' + a[Be][n] + '"';
            if (0 == a["__swiffy.child_nodes"][H])return k + " />";
            k += ">" + g
        }
        for (e = 0; e < a["__swiffy.child_nodes"][H]; e++)n = pm(a["__swiffy.child_nodes"][e], b, c + 1), k += n;
        a[oc] != m && (k += d +
            "</" + a[oc] + ">" + g);
        return k
    };
    om[I].appendChild = function (a) {
        if (!~this["__swiffy.child_nodes"][hc](a)) {
            a[te]();
            var b = this.lastChild;
            this["__swiffy.child_nodes"][y](a);
            b && (b["__swiffy.next_sibling"] = a, a["__swiffy.previous_sibling"] = b);
            a["__swiffy.parent_node"] = this
        }
    };
    om[I].insertBefore = function (a, b) {
        if (!~this["__swiffy.child_nodes"][hc](a)) {
            var c = this["__swiffy.child_nodes"][hc](b);
            if (~c) {
                a[te]();
                a["__swiffy.parent_node"] = this;
                var d = this["__swiffy.child_nodes"][c - 1], e = this["__swiffy.child_nodes"][c];
                this["__swiffy.child_nodes"][Ie](c, 0, a);
                d ? (d["__swiffy.next_sibling"] = a, a["__swiffy.previous_sibling"] = d) : a["__swiffy.previous_sibling"] = m;
                e ? (e["__swiffy.previous_sibling"] = a, a["__swiffy.next_sibling"] = e) : a["__swiffy.next_sibling"] = m
            }
        }
    };
    om[I].removeNode = function () {
        if (this["__swiffy.parent_node"]) {
            var a = this["__swiffy.parent_node"]["__swiffy.child_nodes"][hc](this);
            ~a && this["__swiffy.parent_node"]["__swiffy.child_nodes"][Ie](a, 1)
        }
        this["__swiffy.next_sibling"] && (this["__swiffy.next_sibling"]["__swiffy.previous_sibling"] = this["__swiffy.previous_sibling"]);
        this["__swiffy.previous_sibling"] && (this["__swiffy.previous_sibling"]["__swiffy.next_sibling"] = this["__swiffy.next_sibling"]);
        this["__swiffy.next_sibling"] = m;
        this["__swiffy.previous_sibling"] =
            m;
        this["__swiffy.parent_node"] = m
    };
    om[I].cloneNode = function (a) {
        var b = new om(this[Rb], m);
        b.nodeName = this[oc];
        b.nodeValue = this.nodeValue;
        for (var c in this[Be])b[Be][c] = this[Be][c];
        if (a)for (c = 0; c < this["__swiffy.child_nodes"][H]; c++) {
            var d = this["__swiffy.child_nodes"][c].cloneNode(a);
            b["__swiffy.child_nodes"][c] = d
        }
        return b
    };
    om[I].hasChildNodes = function () {
        return this["__swiffy.child_nodes"] && 0 < this["__swiffy.child_nodes"][H]
    };
    var qm = function (a, b, c) {
        for (var d = m, e; e = c[Hd]();) {
            var g;
            switch (e[Uc]) {
                case "close":
                    return e[cc];
                case "tag":
                    g = 1;
                    break;
                case "text":
                case "cdata":
                    g = 3;
                    break;
                case "xml_declaration":
                    a.xmlDecl || (a.xmlDecl = "");
                    a.xmlDecl += e[cc];
                    continue;
                case "doctype":
                    a.docTypeDecl = e[cc];
                    continue;
                default:
                    continue
            }
            g = new om(g, e[cc]);
            g["__swiffy.parent_node"] = b;
            d && (g["__swiffy.previous_sibling"] = d, d["__swiffy.next_sibling"] = g);
            d = g;
            b["__swiffy.child_nodes"][y](g);
            if ("tag" == e[Uc]) {
                if (e[Be])for (var k = 0; k < e[Be][H]; k++) {
                    var n = e[Be][k];
                    g[Be][n[G]] = n[cc]
                }
                g = qm(a, g, c);
                if (g === m || g != e[cc])return Ca(a, -9), g
            }
        }
        return m
    }, rm = function (a) {
        om[K](this, 1, m);
        a && this.parseXML(a);
        q[E](this, "requestHeaders", {value: []})
    };
    Q(rm, om);
    sk(rm);
    lb(rm[I], h);
    rm[I].contentType = "application/x-www-form-urlencoded";
    Ca(rm[I], 0);
    rm[I].createElement = function (a) {
        return new om(1, a)
    };
    rm[I].createTextNode = function (a) {
        return new om(3, a)
    };
    rm[I].addRequestHeader = function (a, b) {
        if (We(a) && N(b))this.requestHeaders[y](new nm(a, b)); else if (Ue(a))for (var c = a[H] / 2, d = 0; d < c; d++)this.requestHeaders[y](new nm(a[2 * d], a[2 * d + 1]))
    };
    va(rm[I], function (a) {
        var b = this.__swiffy_vm;
        a = b.$(a);
        lb(this, p);
        var c = this, d = new dk;
        d.Ka = function (a) {
            if (O(c.onData))c.onData(a)
        };
        d.vb = function () {
            if (O(c.onData))c.onData(h)
        };
        nk(a, b.a, h, this, d)
    });
    rm[I].send = function (a, b, c) {
        if (0 == arguments[H])return p;
        var d = this.__swiffy_vm;
        a = d.$(a);
        var e = N(b) ? b : "_self", g, k = this[od]();
        "GET" == c ? (g = 1, k = aa(k)) : !N(c) || "POST" == c ? g = 2 : f("Bad method: " + c);
        d.a.rf(new xk(d, k, a, e, g))
    };
    rm[I].sendAndLoad = function (a, b) {
        var c = this.__swiffy_vm;
        a = c.$(a);
        lb(b, p);
        var d = new dk;
        d.Ka = function (a) {
            if (O(b.onData))b.onData(a)
        };
        d.vb = function () {
            if (O(b.onData))b.onData(h)
        };
        nk(a, c.a, "POST", this[od](), d, this.requestHeaders, this.contentType)
    };
    rm[I].onData = function (a) {
        var b = N(a);
        b && O(this.parseXML) && this.parseXML(a);
        lb(this, b);
        if (O(this.onLoad))this.onLoad(b)
    };
    rm[I].onLoad = function () {
    };
    rm[I].parseXML = function (a) {
        for (var b = this["__swiffy.child_nodes"][H] - 1; 0 <= b; b--)this["__swiffy.child_nodes"][b][te]();
        for (var c in this[Be])delete this[Be][c];
        this.docTypeDecl = this.xmlDecl = h;
        a = new Il(a, this.ignoreWhite, l);
        try {
            Ca(this, 0), qm(this, this, a) !== m && Ca(this, -10)
        } catch (d) {
            Ca(this, sm(d[Uc]))
        }
    };
    var sm = function (a) {
        switch (a) {
            case "cdata":
                return-2;
            case "xml_declaration":
                return-3;
            case "doctype":
                return-4;
            case "comment":
                return-5;
            case "tag":
            case "close":
                return-6;
            case "attribute":
                return-8;
            default:
                return-1
        }
    };
    ki(rm[I], m, 3);
    var km = function () {
    };
    var tm = function () {
        this.showMenu = l
    };
    q[E](tm[I], "height", {get: function () {
        var a = this.__swiffy_d;
        return"noScale" == a.Hb ? a.Ef : a.Qd
    }, set: function () {
    }});
    q[E](tm[I], "width", {get: function () {
        var a = this.__swiffy_d;
        return"noScale" == a.Hb ? a.Ff : a.Rd
    }, set: function () {
    }});
    q[E](tm[I], "align", {get: function () {
        var a = this.__swiffy_d.Mc, b = "";
        a & 1 && (b += "L");
        a & 2 && (b += "T");
        a & 4 && (b += "R");
        a & 8 && (b += "B");
        return b
    }, set: function (a) {
        this.__swiffy_d.mm(w(a))
    }});
    q[E](tm[I], "scaleMode", {get: function () {
        return this.__swiffy_d.Hb
    }, set: function (a) {
        var b = this.__swiffy_d;
        switch (w(a)[Pe]()) {
            case "exactfit":
                a = "exactFit";
                break;
            case "noborder":
                a = "noBorder";
                break;
            case "noscale":
                a = "noScale";
                break;
            default:
                a = "showAll"
        }
        b.pm(a)
    }});
    ki(tm[I], m, 3);
    var um = function () {
        this.allowDomain = function () {
            return l
        };
        this.allowInsecureDomain = function () {
            return l
        }
    };
    ki(tm[I], m, 3);
    var vm = function () {
        q[E](this, "__swiffy_v", {value: {Ri: 0, volume: 100, transform: {hd: 100, Oi: 0, Pi: 0, Qi: 100}}})
    };
    sk(vm);
    vm[I].checkPolicyFile = p;
    q[E](vm[I], "duration", {value: 0});
    q[E](vm[I], "id3", {value: h});
    q[E](vm[I], "position", {value: 0});
    vm[I].onID3 = h;
    vm[I].onLoad = h;
    vm[I].onSoundComplete = h;
    vm[I].attachSound = function () {
    };
    vm[I].getBytesLoaded = function () {
        return 0
    };
    vm[I].getBytesTotal = function () {
        return 0
    };
    vm[I].getPan = function () {
        return this.__swiffy_v.Ri
    };
    vm[I].getTransform = function () {
        var a = this.__swiffy_v;
        return{ll: a[Ne].hd, lr: a[Ne].Oi, rl: a[Ne].Pi, rr: a[Ne].Qi}
    };
    vm[I].getVolume = function () {
        return this.__swiffy_v.volume
    };
    vm[I].loadSound = function (a) {
        var b = this.__swiffy_vm.a.wk;
        b && b.vk("GET", a, m, m);
        this.__swiffy_vm.Kg("setTimeout")(ef(function () {
            if (O(this.onLoad))this.onLoad(l)
        }, this), 1)
    };
    vm[I].setPan = function (a) {
        a = wm[K](this, a);
        var b = this.__swiffy_v;
        b.Ri = -100 > a ? -200 - a : 100 < a ? 200 - a : a;
        sb(b, {hd: 0 < a ? 100 - a : 100, Qi: 0 > a ? 100 + a : 100, Oi: 0, Pi: 0})
    };
    vm[I].setTransform = function (a) {
        if (a) {
            var b = this.__swiffy_v;
            N(a.ll) && (b[Ne].hd = xm[K](this, a.ll));
            N(a.lr) && (b[Ne].Oi = xm[K](this, a.lr));
            N(a.rl) && (b[Ne].Pi = xm[K](this, a.rl));
            N(a.rr) && (b[Ne].Qi = xm[K](this, a.rr));
            b.Ri = -100 > 100 - b[Ne].hd ? -200 - (100 - b[Ne].hd) : 100 < 100 - b[Ne].hd ? 200 - (100 - b[Ne].hd) : 100 - b[Ne].hd
        }
    };
    vm[I].setVolume = function (a) {
        this.__swiffy_v.volume = wm[K](this, a)
    };
    hb(vm[I], function () {
        this.__swiffy_vm.Kg("setTimeout")(ef(function () {
            if (O(this.onSoundComplete))this.onSoundComplete()
        }, this), 1)
    });
    Sa(vm[I], function () {
    });
    Ta(vm[I], function () {
        return"[object Object]"
    });
    ki(vm[I], m, 3);
    var wm = function (a) {
        a = this.__swiffy_vm.Kg("Number")(a);
        return da(a) ? -2147483648 : a >> 0
    }, xm = function (a) {
        return this.__swiffy_vm.Kg("Number")(a) >> 0
    };
    var Sl = function (a) {
        q[E](this, "__swiffy_vm", {value: a});
        this.String = ym(w, function (b) {
            return a.$(b)
        }, ["fromCharCode"]);
        ki(this, "String", 3);
        this.Number = ym(u, function (b) {
            return a.vd(b)
        }, ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY"]);
        ki(this, "Number", 3);
        this.Boolean = ym(ga, function (b) {
            return a.nk(b)
        });
        ki(this, "Boolean", 3);
        this.AsBroadcaster = new pi(a);
        ki(this, "AsBroadcaster", 3);
        this.setInterval = function () {
            return zm(a, ba.setInterval, arguments)
        };
        ki(this, "setInterval", 3);
        this.setTimeout =
            function () {
                return zm(a, ba.setTimeout, arguments)
            };
        ki(this, "setTimeout", 3);
        this.updateAfterEvent = function () {
            a.a.Pd = l
        };
        ki(this, "updateAfterEvent", 3);
        this.escape = function (b) {
            return aa(a.$(b))[Pb](/[.!*'()]/g, function (a) {
                return"%" + a[me](0)[od](16)[He]()
            })
        };
        ki(this, "escape", 3);
        this.unescape = function (b) {
            return gi(a.$(b))
        };
        ki(this, "unescape", 3);
        q[I][Ud]("addProperty") || (Ta(ca[I], function () {
            return"[type Function]"
        }), ki(ca[I], ["toString"], 3), q[I].unwatch = function (a) {
            if (1 > arguments[H])return p;
            var c = this[a];
            delete this[a];
            this[a] = c;
            return l
        }, q[I].watch = function (a, c, d) {
            if (2 > arguments[H])return p;
            for (var e = this, g = m, k = this; k; k = q[hd](k))if (q[ae](k, a) != m) {
                e = k;
                g = q[ae](k, a);
                break
            }
            if (!g || g.configurable) {
                var n = e[a];
                delete e[a];
                q[E](e, a, {get: function () {
                    return n
                }, set: function (e) {
                    return n = c[K](this, a, n, e, d)
                }, configurable: l})
            }
            return l
        }, q[I].addProperty = function (a, c, d) {
            var e = q[ae](this, a);
            if (a == m || "" == a || !O(c) || d && !O(d) || e && !e.configurable)return p;
            if (!d || e && !e[pc])d = function () {
            };
            q[E](this, a, {get: c, set: d, configurable: l,
                enumerable: !(e && !e.enumerable)});
            return l
        }, ki(q[I], ["watch", "unwatch", "addProperty"], 3))
    }, ym = function (a, b, c) {
        b.__swiffy_override = function (c) {
            return new a(b(c))
        };
        b.__swiffy_wrapped_type = a;
        if (N(c))for (var d = 0; d < c[H]; d++)b[c[d]] = a[c[d]];
        ki(b, m, 3);
        return b
    };
    Sl[I].ASSetPropFlags = ki;
    Sl[I].clearInterval = function (a) {
        ba.clearInterval(a)
    };
    Sl[I].clearTimeout = function (a) {
        ba.clearTimeout(a)
    };
    Sl[I].parseFloat = ia;
    Sl[I].parseInt = function (a, b) {
        !N(b) && $h(a) && (b = 8);
        return ha(a, b)
    };
    Sl[I].isFinite = function (a) {
        return ja(a)
    };
    Sl[I].isNaN = function (a) {
        return da(a)
    };
    var zm = function (a, b, c) {
        var d = c[0];
        if (O(d) && 2 <= c[H]) {
            var e = t[I][Ob][K](c, 2);
            c = c[1];
            return b[K](ba, function () {
                d[L](em(m), e);
                a.la()
            }, c)
        }
        if (Ze(d) && 3 <= c[H]) {
            var g = c[1], e = t[I][Ob][K](c, 3);
            c = c[2];
            return b[K](ba, function () {
                O(d[g]) && (d[g][L](em(d), e), a.la())
            }, c)
        }
    };
    Sl[I].Array = t;
    Sl[I].AsBroadcaster = pi;
    Sl[I].Button = im;
    Sl[I].flash = {filters: {BevelFilter: function (a, b, c, d, e, g, k, n, v, A, B, P) {
        ab(this, N(b) ? b : 45);
        this.blurX = N(k) ? k : 10;
        this.blurY = N(n) ? n : 10;
        ob(this, N(a) ? a : 4);
        this.highlightAlpha = N(d) ? d : 1;
        this.highlightColor = N(c) ? c : 16777215;
        this.knockout = N(P) ? P : p;
        this.quality = N(A) ? A : 1;
        this.shadowAlpha = N(g) ? g : 1;
        this.shadowColor = N(e) ? e : 0;
        this.strength = N(v) ? v : 1;
        Ka(this, N(B) ? B : "inner");
        ki(this, m, 3);
        q[E](this, "__swiffy_v", {get: function () {
            return new Vk(90 + this[Gd], this.highlightColor | 4278190080 * this.highlightAlpha, this.shadowColor |
                4278190080 * this.shadowAlpha, this[ye], this[je], this[Oe], this.blurX, this.blurY, p, l, this[uc])
        }})
    }, BlurFilter: function (a, b, c) {
        this.blurX = N(a) ? a : 4;
        this.blurY = N(b) ? b : 4;
        this.quality = N(c) ? c : 1;
        ki(this, m, 3);
        q[E](this, "__swiffy_v", {get: function () {
            return new Rk(this[Oe], this.blurX, this.blurY)
        }})
    }, ColorMatrixFilter: function (a) {
        ta(this, N(a) ? a : [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);
        ki(this, m, 3);
        q[E](this, "__swiffy_v", {get: function () {
            return new Nk(this[Qb])
        }})
    }, DropShadowFilter: function (a, b, c, d, e, g, k, n, v, A, B) {
        ab(this,
            N(b) ? b : 45);
        this.blurX = N(e) ? e : 10;
        this.blurY = N(g) ? g : 10;
        ob(this, N(a) ? a : 4);
        eb(this, N(d) ? d : 1);
        za(this, N(c) ? c : 0);
        this.knockout = N(A) ? A : p;
        this.quality = N(n) ? n : 1;
        this.strength = N(k) ? k : 1;
        this.inner = N(v) ? v : p;
        this.hideObject = N(B) ? B : p;
        ki(this, m, 3);
        q[E](this, "__swiffy_v", {get: function () {
            return new Tk(90 + this[Gd], this[jc] | 4278190080 * this[Vd], this[ye], this[je], this[Oe], this.blurX, this.blurY, this[Fb], this[Cd], this[uc])
        }})
    }}};
    Sl[I].Color = Nl;
    Sl[I].Date = Date;
    Sl[I].Error = cm;
    Sl[I].Function = dm;
    Sl[I].LoadVars = mm;
    Sl[I].Math = s;
    Sl[I].MovieClip = R;
    Sl[I].MovieClipLoader = fm;
    Sl[I].NetConnection = gm;
    Sl[I].NetStream = hm;
    Sl[I].Object = mi;
    q[E](mi, "__swiffy_override", {value: ni});
    q[E](mi, "__swiffy_wrapped_type", {value: q});
    Sl[I].Sound = vm;
    Sl[I].System = new function () {
        this.security = new um
    };
    Sl[I].TextField = jm;
    Sl[I].TextFormat = km;
    Sl[I].XML = rm;
    Sl[I].XMLNode = om;
    q[E](Sl[I], "Key", {get: function () {
        return this.__swiffy_vm.getKey()
    }, set: function () {
    }});
    q[E](Sl[I], "Mouse", {get: function () {
        return this.__swiffy_vm.fe
    }, set: function () {
    }});
    q[E](Sl[I], "Stage", {get: function () {
        return this.__swiffy_vm.a.e
    }, set: function () {
    }});
    ki(Sl[I], m, 3);
    var Bk = function (a) {
        this.c = [];
        this.qa = [];
        this.a = a;
        this.Bm = this.Dj();
        this.be = [];
        this.Kc = [];
        this.Mh = p;
        this.Za = 0;
        this.jb = 4;
        this.Ah = m;
        this.Tb = uk;
        this.eg = new Tl(this, a);
        this.fe = new Ml;
        this.jf(this.fe);
        this.he = new Kl;
        this.jf(this.he);
        this.rh();
        this.Cm()
    };
    M = Bk[I];
    M.Cm = function () {
        var a = this, b = this.a.Sd;
        b.SetVariable = function (b, d) {
            var e = a.Yd(w(b), a.a.oa.e);
            if (e[Rc]) {
                var g = a.Xb(e[Rc], e.ld);
                e[Rc][g] = w(d)
            }
        };
        b.GetVariable = function (b) {
            b = a.Yd(w(b), a.a.oa.e);
            if (b[Rc]) {
                var d = a.j(b[Rc], b.ld);
                return d in b[Rc] ? w(b[Rc][d]) : m
            }
            return m
        }
    };
    M.getKey = function () {
        return this.he
    };
    M.Fk = function (a) {
        this.Kc[y](function () {
            this.xi(a)
        })
    };
    M.pf = function (a) {
        this.Kc[y](a)
    };
    M.la = function () {
        if (!this.Mh) {
            for (this.Mh = l; this.be[H] || this.Kc[H];)this.be[H] ? this.be[Eb]()[K](this) : this.Kc[Eb]()[K](this);
            this.Mh = p
        }
    };
    M.$k = function (a, b) {
        try {
            a()
        } catch (c) {
            b(c), f(c)
        }
    };
    M.Dj = function () {
        return Date.now()
    };
    M.jf = function (a) {
        this.eg.get("AsBroadcaster").initialize(a)
    };
    M.reset = function (a) {
        this.c = [];
        this.Za = 0;
        this.jb = 4;
        Va(this.c, this.c[H] + this.jb);
        this.u = new Rl(this, this.eg, a.e)
    };
    M.oe = function (a) {
        var b = 0, c = this.Tb;
        this.Tb = wk;
        try {
            for (; b < a[H];)b = a[b][K](this, b + 1)
        } catch (d) {
            c[K](this, d)
        } finally {
            this.Tb = c
        }
    };
    M.xi = function (a) {
        a.b.Wd() || (this.reset(a.b), this.oe(a.qn))
    };
    var Am = function (a) {
        a = a[Pb](/\.\.|\/:?|:/g, function (a) {
            return".." == a ? "_parent" : "."
        });
        "." == a[0] && (a = "_root" + a);
        "." == a[a[H] - 1] && (a = a[re](0, a[H] - 1));
        return a
    };
    Bk[I].Yd = function (a, b) {
        N(b) || (b = this.cb());
        var c = 0 < a[hc](":") ? a[Jd](":") : a[Jd](".");
        if (1 < c[H]) {
            var d = c[Ob](0, c[H] - 1)[Ke]("."), c = c[c[H] - 1];
            return{path: this.We(d, b), ld: c}
        }
        return{path: b, ld: a}
    };
    Bk[I].Kg = function (a) {
        return this.eg.get(a)
    };
    var Bm = {"boolean": {}, number: {}, string: {}, undefined: {}}, Cm = function (a) {
        var b = q[Bb](a[Ld][I]);
        a = Bm[typeof a];
        for (var c = 0; c < b[H]; ++c) {
            var d = b[c], e = d[Pe]();
            d != e && (a[e] = d)
        }
    };
    Cm(p);
    Cm(0);
    Cm("");
    var Dm = function (a) {
        if (!a)return{constructor: "constructor"};
        var b = a.__swiffy_nm;
        if (!b || b.__swiffy_nm != a) {
            for (var b = q[vd](Dm(q[hd](a))), c = q[Bb](a), d = 0; d < c[H]; ++d) {
                var e = c[d], g = e[Pe]();
                e != g && (b[g] = e)
            }
            q[E](b, "__swiffy_nm", {value: a, writable: l});
            q[E](a, "__swiffy_nm", {value: b, writable: l})
        }
        return b
    };
    Bk[I].j = function (a, b) {
        if (7 <= this.a.Ba) {
            if (a instanceof ci) {
                if (b in a)return b;
                var c = b[Pe]();
                if (c in a && -1 < Em[hc](c))return c
            }
            return b
        }
        var d = Bm[typeof a];
        if (!d) {
            if (b in a)return b;
            d = Dm(a)
        }
        c = b[Pe]();
        return(d = d[c]) ? d : c
    };
    var em = function (a) {
        return mi[K](m, a)
    };
    M = Bk[I];
    M.Xb = function (a, b) {
        if (7 <= this.a.Ba) {
            if (a instanceof ci) {
                if (b in a)return b;
                var c = b[Pe]();
                if (c in a && -1 < Em[hc](c))return c
            }
            return b
        }
        var d = Bm[typeof a];
        if (d)return c = b[Pe](), (d = d[c]) ? d : c;
        if (b in a)return b;
        var e = Dm(a), c = b[Pe]();
        return(d = e[c]) ? d : b == c || c in a ? c : e[c] = b
    };
    M.Qj = function (a) {
        if (Ze(a)) {
            var b = a[this.j(a, "x")];
            a = a[this.j(a, "y")];
            if (Ye(b) && Ye(a))return new zh(b, a)
        }
        return m
    };
    M.cb = function () {
        return this.u.cb()
    };
    M.cd = function () {
        var a = this.u.cb();
        return a ? a.__swiffy_d : m
    };
    M.push = function (a) {
        this.c[y](a)
    };
    M.pop = function () {
        if (this.c[H] > this.Za + this.jb)return this.c.pop()
    };
    M.p = function () {
        return this.vd(this.pop())
    };
    M.ea = function () {
        return this.$(this.pop())
    };
    M.fd = function () {
        return this.nk(this.pop())
    };
    M.Ok = function () {
        return this.tf(this.pop())
    };
    M.kb = function () {
        for (var a = this.p(), a = s.min(a, this.c[H] - (this.Za + this.jb)), b = [], c = 0; c < a; ++c)b[c] = this.pop();
        return b
    };
    M.tf = function (a) {
        return a instanceof ci ? a : this.ok(w(a))
    };
    M.We = function (a, b) {
        if (!b || !a)return b;
        a = Am(a);
        for (var c = b, d = a[Jd]("."), e = 0; e < d[H] && c; e++)c = c[this.j(c, d[e])];
        return c
    };
    M.ok = function (a) {
        return this.We(a, this.cb())
    };
    M.Ce = function () {
        this.fe.Ce()
    };
    M.Og = function () {
        this.fe.Og()
    };
    M.De = function () {
        this.fe.De()
    };
    M.Lk = function () {
        return this.fe.__swiffy_mv
    };
    M.Ai = function () {
        this.a.e.broadcastMessage("onResize")
    };
    M.Vg = function (a) {
        this.he.Vg(a)
    };
    M.Wk = function () {
        this.he.broadcastMessage("onKeyUp")
    };
    M.Ug = function (a) {
        this.he.Ug(a)
    };
    M.Tk = function () {
        this.he.broadcastMessage("onKeyDown")
    };
    M.Sj = function (a, b, c) {
        b = this.j(a, b);
        b in a || (a[this.Xb(a, b)] = c)
    };
    M.Tj = function (a, b, c) {
        b = this.j(a, b);
        c === a[b] && delete a[b]
    };
    M.Xj = function (a, b, c) {
        var d = this.Ig(b, ck);
        d && this.be[y](function () {
            this.dp(d, a, b, c)
        })
    };
    M.dp = function (a, b, c, d) {
        b = Am(b);
        b = this.Yd(b, a.e);
        if (b[Rc] && b[Rc].__swiffy_d) {
            a = b[Rc].__swiffy_d;
            var e = b[Rc];
            b = this.Xb(e, b.ld);
            N(a.kf[b]) || (a.kf[b] = []);
            a.kf[b][y](c);
            b in e && (c.Jc(w(e[b])), d = e[b]);
            q[E](e, b, this.vn(d, a.kf[b]))
        }
    };
    M.Vj = function (a, b) {
        var c = this.Ig(b, ck);
        c && this.be[y](function () {
            this.ep(c, a, b)
        })
    };
    M.ep = function (a, b, c) {
        b = Am(b);
        b = this.Yd(b, a.e);
        if (b[Rc]) {
            var d = b[Rc];
            if (a = b[Rc].__swiffy_d)b = this.j(d, b.ld), (a = a.kf[b]) && rf(a, c)
        }
    };
    M.Ig = function (a, b) {
        for (var c = a; c && !(c instanceof b);)c = c[Ab]();
        return c
    };
    M.Pk = function (a, b) {
        var c = -16384 + b, d = "_level" + b;
        d in R[I] || q[E](R[I], d, {get: function () {
            var a = this.__swiffy_d.a.mc(c);
            if (a)return a.e
        }, set: function (a) {
            q[E](this, d, {value: a, configurable: l, writable: l, enumerable: l})
        }})
    };
    M.fireEvent = function (a, b, c, d) {
        var e = am[c[Uc]];
        c = p;
        if (b)for (var g = 0; g < b[Dd][H]; ++g) {
            var k = b[Dd][g];
            if (!k.Oj || k.Oj(this))k.Th && (d ? this.xi(k.Th) : this.Fk(k.Th)), k[Nd] && (c = l)
        }
        if (e) {
            var n = this;
            b = function () {
                var b = n.j(a, e);
                if (O(a[b]))a[b]()
            };
            d ? b() : this.pf(b)
        }
        return c
    };
    M.Um = function (a) {
        a = a instanceof vj ? a[Ab]() : a;
        return a = 5 < this.a.Ba ? this.Ig(a, lj) : this.Ig(a, ck)
    };
    M.rh = function () {
        var a = this;
        jj[I].Ca = function () {
            return q[vd](ci[I])
        };
        ij[I].Ca = function () {
            var b = q[vd](jm[I]);
            a.jf(b);
            b.addListener(b);
            return b
        };
        Dk[I].Ca = function () {
            var b = q[vd](tm[I]);
            a.jf(b);
            return b
        };
        lj[I].Ca = function () {
            return q[vd](bm[I])
        };
        ck[I].Ca = function () {
            var a = h, c = this[D].Fj;
            c && (a = oi[c]);
            return q[vd]((a ? a : R)[I])
        };
        vj[I].Ca = function () {
            return q[vd](im[I])
        }
    };
    M.pk = function (a, b) {
        var c = a.e;
        b ? (this.be[y](function () {
            a[pe](new cj(524288), l);
            c[Ld]()
        }), a[pe](new cj(128)), a.of()) : (a.of(), a[pe](new cj(524288), l), c[Ld](), a[pe](new cj(128)))
    };
    M.vn = function (a, b) {
        var c = a, d = this;
        return{get: function () {
            return c
        }, set: function (a) {
            c = a;
            a = d.$(a);
            for (var g = 0; g < b[H]; g++)b[g].Jc(a)
        }, configurable: l}
    };
    M.yb = function (a, b) {
        if (a != m) {
            var c = b in a, d = delete a[b];
            delete a[b];
            if (a instanceof R) {
                var e = a.__swiffy_d;
                e && (e = e.t.wl(b)) && gj(a, e, b)
            }
            return c && d
        }
        return p
    };
    M.Gl = function (a, b) {
        this.a.oa.e[a] = b
    };
    M.fc = function (a) {
        for (var b = [], c = 0; c < a[H]; ++c)b[c] = this.Ep(a[c]);
        return b
    };
    M.Ep = function (a) {
        var b = S[a[Uc]];
        if (!b)return ef(Fm, this, a[Uc]);
        b.Ra && (b = b(a, this));
        return b
    };
    M.Ag = function (a) {
        return!(a instanceof ck && a[ce]())
    };
    M.Mk = function (a) {
        return a[ce]() && (a instanceof ck || a instanceof vj) && a.e.useHandCursor
    };
    M.Ek = function (a, b) {
        a && a.bm(b);
        b && b.cm(a)
    };
    M.xe = function (a) {
        for (var b = this.a.Ud, c = b[H] - 1; 0 <= c; c--)b[c].Wd() || b[c][pe](a)
    };
    M.Lj = function (a, b) {
        b.Z() && b.Ta(a.af())
    };
    var Em = "_x _y _xscale _yscale _currentframe _totalframes _alpha _visible _width _height _rotation _target _framesloaded _name _droptarget _url _highquality _focusrect _soundbuftime _quality _xmouse _ymouse".split(" "), S = {4: function (a) {
        this.Pf();
        return a
    }};
    Bk[I].Pf = function () {
        var a = this.cd();
        a && a.Pf()
    };
    S[5] = function (a) {
        this.bq();
        return a
    };
    Bk[I].bq = function () {
        var a = this.cd();
        a && a.ej()
    };
    S[6] = function (a) {
        this[Qc]();
        return a
    };
    Ha(Bk[I], function () {
        var a = this.cd();
        a && a[Qc]()
    });
    S[7] = function (a) {
        this[nd]();
        return a
    };
    Sa(Bk[I], function () {
        var a = this.cd();
        a && a[nd]()
    });
    S[9] = function (a) {
        this.uq();
        return a
    };
    Bk[I].uq = function () {
        var a = this.cd();
        a && a.qd().yk()
    };
    S[10] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c + b);
        return a
    };
    S[11] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c - b);
        return a
    };
    S[12] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c * b);
        return a
    };
    S[13] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c / b);
        return a
    };
    S[14] = function (a) {
        var b = this.p(), c = this.p();
        this[y](this.mo(c, b));
        return a
    };
    S[15] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c < b);
        return a
    };
    S[16] = function (a) {
        var b = this.fd(), c = this.fd();
        this[y](c && b);
        return a
    };
    S[17] = function (a) {
        var b = this.fd(), c = this.fd();
        this[y](c || b);
        return a
    };
    S[18] = function (a) {
        var b = this.fd();
        this[y](!b);
        return a
    };
    S[19] = function (a) {
        var b = this.ea(), c = this.ea();
        this[y](c == b);
        return a
    };
    S[20] = function (a) {
        var b = this.ea();
        this[y](b[H]);
        return a
    };
    S[21] = function (a) {
        var b = this.pop(), c = this.pop(), d = this.ea();
        this[y](this.Mo(d, c, b));
        return a
    };
    Bk[I].Mo = function (a, b, c) {
        a = this.$(a);
        c = u(c);
        b = s.max(0, u(b) - 1);
        return a[ld](b, c)
    };
    S[23] = function (a) {
        this.pop();
        return a
    };
    S[24] = function (a) {
        var b = this.p(), b = 0 > b ? s[Ub](b) : s[Xb](b);
        this[y](b);
        return a
    };
    S[28] = function (a) {
        var b = this.ea();
        this[y](this.Xg(b));
        return a
    };
    Bk[I].Xg = function (a) {
        a = Am(a);
        a = a[Jd](".");
        var b = this.u.get(a[0]);
        if (1 < a[H]) {
            var c;
            for (c = 1; N(b) && c < a[H] - 1; ++c)b = b[this.j(b, a[c])];
            N(b) && (b = b[this.j(b, a[c])])
        }
        return b
    };
    S[29] = function (a) {
        var b = this.pop(), c = this.ea();
        this.Lo(c, b);
        return a
    };
    Bk[I].Lo = function (a, b) {
        a = Am(a);
        var c = a[Jd](".");
        if (1 == c[H])this.u.set(a, b); else {
            var d = this.u.get(c[0]), e;
            for (e = 1; N(d) && e < c[H] - 1; ++e)d = d[this.j(d, c[e])];
            N(d) && (d[this.Xb(d, c[e])] = b)
        }
    };
    S[33] = function (a) {
        var b = this.ea(), c = this.ea();
        this[y](c + b);
        return a
    };
    S[34] = function (a) {
        var b = this.p(), c = this.pop();
        this[y](this.Ac(c, b));
        return a
    };
    Bk[I].Ac = function (a, b) {
        var c = this.tf(a), d = Em[b];
        if (c)return c[d]
    };
    S[35] = function (a) {
        var b = this.pop(), c = this.p(), d = this.pop();
        this.setProperty(d, c, b);
        return a
    };
    Bk[I].setProperty = function (a, b, c) {
        b = Em[b];
        (a = this.tf(a)) && b && (a[b] = c)
    };
    S[36] = function (a) {
        var b = this.p(), c = this.ea(), d = this.Ok(), e = this.cd();
        d && (e && d.__swiffy_d) && d.__swiffy_d.duplicate(e, c, b + -16384);
        return a
    };
    S[37] = function (a) {
        var b = this.Ok();
        b instanceof R && b.removeMovieClip();
        return a
    };
    S[38] = function (a) {
        this.trace(this.pop());
        return a
    };
    Bk[I].trace = function (a) {
        ba.console && (a = N(a) ? this.$(a) : "undefined", tk(a))
    };
    var Fm = function (a, b) {
        return b
    };
    S[51] = function (a) {
        var b = this.p();
        this[y](w[zc](b));
        return a
    };
    S[50] = function (a) {
        var b = this.ea();
        this[y](b[me](0));
        return a
    };
    S[52] = function (a) {
        this[y](this.getTime());
        return a
    };
    Bk[I].getTime = function () {
        return this.Dj() - this.Bm
    };
    S[48] = function (a) {
        var b = this.p();
        this[y](this[ge](b));
        return a
    };
    Bk[I].random = function (a) {
        var b;
        do b = s[Xb](s[ge]() * a); while (b == a && 0 < a);
        return b
    };
    S[60] = function (a) {
        var b = this.pop(), c = this.pop();
        this.u.Ib(c, b);
        return a
    };
    S[65] = function (a) {
        var b = this.pop();
        this.u.Cf(b);
        return a
    };
    S[59] = function (a) {
        var b = this.Hp(this.pop());
        this[y](b);
        return a
    };
    Bk[I].Hp = function (a) {
        a = this.$(a);
        a = Am(a);
        var b = a[Jd](".");
        if (1 == b[H])return this.u.Rc(a);
        a = this.u.get(b[0]);
        var c;
        for (c = 1; N(a) && c < b[H] - 1; ++c)a = a[this.j(a, b[c])];
        return this.yb(a, this.j(a, b[c]))
    };
    S[62] = function () {
        ib(this, this.pop());
        return u.MAX_VALUE
    };
    S[63] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c % b);
        return a
    };
    S[71] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](this.add(c, b));
        return a
    };
    S[72] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](this.lm(c, b));
        return a
    };
    Bk[I].lm = function (a, b) {
        if ("object" === typeof a && a !== m && (a = a[xb](), "object" === typeof a) || "object" === typeof b && b !== m && (b = b[xb](), "object" === typeof b))return p;
        if ("string" === typeof a && "string" === typeof b)return a < b;
        "number" !== typeof a && (a = this.vd(a));
        "number" !== typeof b && (b = this.vd(b));
        return da(a) || da(b) ? h : a < b
    };
    S[103] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](this.lm(b, c));
        return a
    };
    S[73] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](this.Ad(c, b));
        return a
    };
    Bk[I].Ad = function (a, b) {
        if (!(typeof a === typeof b && a === m == (b === m) && 6 <= this.a.Ba)) {
            "object" === typeof a && a !== m && (a = a[xb]());
            "object" === typeof b && b !== m && (b = b[xb]());
            if ("object" === typeof a || "object" === typeof b)return a === h || a === m ? b === h || b === m : a === b;
            if ("string" === typeof a && ("boolean" === typeof b || "number" === typeof b))"" == a[kc]() && (a = u.NaN); else if ("string" === typeof b && ("boolean" === typeof a || "number" === typeof a) && "" == b[kc]())b = u.NaN
        }
        return a == b
    };
    S[102] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](c === b);
        return a
    };
    S[41] = function (a) {
        var b = this.ea(), c = this.ea();
        this[y](c < b);
        return a
    };
    S[42] = function () {
        f(this.pop())
    };
    S[104] = function (a) {
        var b = this.ea(), c = this.ea();
        this[y](c > b);
        return a
    };
    S[105] = function (a) {
        var b = this.pop(), c = this.pop();
        O(b) && O(c) && Q(c, b);
        return a
    };
    S[74] = function (a) {
        var b = this.p();
        this[y](b);
        return a
    };
    S[75] = function (a) {
        var b = this.ea();
        this[y](b);
        return a
    };
    S[76] = function (a) {
        var b = this.pop();
        this[y](b);
        this[y](b);
        return a
    };
    S[77] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](b);
        this[y](c);
        return a
    };
    S[78] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](this.Mp(c, b));
        return a
    };
    Bk[I].Mp = function (a, b) {
        if (a != m)if (a instanceof Ol && (a = a.qk()), "number" === typeof b) {
            if ("string" !== typeof a)return a[b]
        } else return a[this.j(a, this.$(b))]
    };
    S[79] = function (a) {
        var b = this.pop(), c = this.pop(), d = this.pop();
        this.nq(d, c, b);
        return a
    };
    Bk[I].nq = function (a, b, c) {
        a != m && ("number" === typeof b ? a[b] = c : (a[this.Xb(a, this.$(b))] = c, O(a) && "prototype" == b && (a.r = c[Ld][I], c.constructor = a)))
    };
    S[80] = function (a) {
        var b = this.p();
        this[y](++b);
        return a
    };
    S[81] = function (a) {
        var b = this.p();
        this[y](--b);
        return a
    };
    S[96] = function (a) {
        var b = this.p(), c = this.p();
        this[y](b & c);
        return a
    };
    S[97] = function (a) {
        var b = this.p(), c = this.p();
        this[y](b | c);
        return a
    };
    S[98] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c ^ b);
        return a
    };
    S[99] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c << b);
        return a
    };
    S[100] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c >> b);
        return a
    };
    S[101] = function (a) {
        var b = this.p(), c = this.p();
        this[y](c >>> b);
        return a
    };
    S[58] = function (a) {
        var b = this.ea(), c = this.pop(), b = this.yb(c, this.j(c, b));
        this[y](b);
        return a
    };
    S[129] = function (a, b) {
        return ef(Gm, b, a.frame)
    };
    S[129].Ra = l;
    var Gm = function (a, b) {
        this.Qp(a);
        return b
    };
    Bk[I].Qp = function (a) {
        var b = this.cd();
        b && b.Sc(a, p)
    };
    S[140] = function (a, b) {
        return ef(Hm, b, a.label)
    };
    S[140].Ra = l;
    var Hm = function (a, b) {
        this.Rp(a);
        return b
    };
    Bk[I].Rp = function (a) {
        var b = this.cd();
        b && (a = b.wd(a), a != h && b.Sc(a, p))
    };
    S[136] = function (a, b) {
        for (var c = a.constants, d = t(c[H]), e = 0; e < c[H]; ++e) {
            var g = ef(Im, b, c[e]);
            d[e] = g
        }
        b.qa = d;
        return Jm
    };
    S[136].Ra = l;
    S[136].Sp = l;
    var Jm = function (a) {
        return a
    };
    S[32] = function (a) {
        this.sc(this.pop());
        return a
    };
    Bk[I].sc = function (a) {
        a instanceof ci || (a = w(a), a = this.We(a, this.u.Bd()), a instanceof ci || (a = h));
        this.u.sc(a)
    };
    S[69] = function (a) {
        var b = this.pop(), c = h;
        b instanceof ci && (c = b.__swiffy_d.uk());
        this[y](c);
        return a
    };
    S[305] = function (a, b) {
        return ef(Im, b, a[cc])
    };
    S[305].Ra = l;
    var Im = function (a, b) {
        this[y](a);
        return b
    };
    S[306] = function (a) {
        this[y](h);
        return a
    };
    S[307] = function (a) {
        this[y](u[Hb]);
        return a
    };
    S[308] = function (a) {
        this[y](u[ke]);
        return a
    };
    S[309] = function (a) {
        this[y](u.NaN);
        return a
    };
    S[304] = function (a, b) {
        return b.qa[a[Bd]]
    };
    S[304].Ra = l;
    S[304].Sp = l;
    S[303] = function (a, b) {
        return ef(Km, b, a[Bd])
    };
    S[303].Ra = l;
    var Km = function (a, b) {
        0 <= a && a < this.jb ? this[y](this.c[this.Za + a]) : this[y](h);
        return b
    };
    S[135] = function (a, b) {
        return ef(Lm, b, a[Bd])
    };
    S[135].Ra = l;
    var Lm = function (a, b) {
        0 <= a && a < this.jb && (this.c[this.Za + a] = this.c[this.c[H] - 1]);
        return b
    };
    S[154] = function (a, b) {
        return ef(Mm, b, a[Vc], a[be], a[Oc])
    };
    S[154].Ra = l;
    var Mm = function (a, b, c, d) {
        var e = this.ea(), g = this.ea();
        a = new xk(this, this.cb(), g, e, a, b, c);
        this.a.rf(a);
        return d
    };
    S[148] = function (a, b) {
        return ef(Nm, b, b.fc(a[Xd]))
    };
    S[148].Ra = l;
    var Nm = function (a, b) {
        var c = this.pop();
        if (!(c instanceof q))return b;
        var d = this.u;
        this.u = new Ql(this, d, c);
        try {
            this.oe(a)
        } finally {
            this.u = d
        }
        return b
    };
    S[155] = function (a, b) {
        return ef(Om, b, a.args, b.fc(a[Xd]), [], 0, 4)
    };
    S[155].Ra = l;
    S[142] = function (a, b) {
        return ef(Om, b, a.args, b.fc(a[Xd]), a.preloads, a.suppress, a.registerCount)
    };
    S[142].Ra = l;
    var Om = function (a, b, c, d, e, g) {
        var k = this;
        this[y](this.kn(function () {
            var d = k.Za, g = k.jb;
            k.Za = k.c[H];
            k.jb = e;
            Va(k.c, k.c[H] + k.jb);
            for (var A = 0; A < c[H] && A + 1 < e; ++A)k.c[k.Za + A + 1] = k.u.get(c[A]);
            for (A = 0; A < a[H]; ++A)We(a[A]) ? k.u.Ib(a[A], arguments[A]) : k.c[k.Za + a[A]] = arguments[A];
            ib(k, h);
            try {
                k.oe(b)
            } finally {
                Va(k.c, k.Za), k.Za = d, k.jb = g
            }
            return k.returnValue
        }, d));
        return g
    };
    Bk[I].kn = function (a, b) {
        var c = this, d = this.u, e = function () {
            var g = c.u, k = c.u.cb(), n = c.Ah;
            if (5 < c.a.Ba)c.u = new Pl(c, d); else {
                var v = new Rl(c, c.eg, this);
                c.u = new Pl(c, v)
            }
            b & 4 || c.u.Ib("this", this);
            b & 1 || c.u.Ib("super", new Ol(this, e));
            b & 2 || (v = t[I][Ob][K](arguments), v.callee = e, v.caller = n, c.u.Ib("arguments", v));
            c.Ah = e;
            var A;
            try {
                A = a[L](em(this), arguments)
            } finally {
                c.u = g, c.u.sc(k)
            }
            c.Ah = n;
            return A
        };
        Q(e, mi);
        return e
    };
    S[143] = function (a, b) {
        return ef(Pm, b, b.fc(a.tryBlock), a.catchBlock ? b.fc(a.catchBlock) : m, a.finallyBlock ? b.fc(a.finallyBlock) : m, a.register, a[Ed])
    };
    S[143].Ra = l;
    var Pm = function (a, b, c, d, e, g) {
        try {
            this.oe(a)
        } catch (k) {
            if (b != m) {
                var n;
                N(e) ? (n = this.u.get(e), this.u.Ib(e, k)) : 0 <= d && d < this.jb && (this.c[this.Za + d] = k);
                try {
                    this.oe(b)
                } finally {
                    N(e) && (N(n) ? this.u.Ib(e, n) : this.u.Rc(e))
                }
            } else f(k)
        } finally {
            c != m && this.oe(c)
        }
        return g
    };
    S[61] = function (a) {
        var b = this.ea(), c = this.kb();
        this[y](this.u[K](b, c));
        return a
    };
    gb(Bk[I], function (a, b) {
        return this.u[K](a, b)
    });
    S[82] = function (a) {
        var b = this.pop(), c = this.pop(), d = this.kb();
        this[y](this.$o(b, c, d));
        return a
    };
    Bk[I].$o = function (a, b, c) {
        if (b != m)if (a == m || "" === a)if (b instanceof Ol) {
            var d = b[Vc].r[Ld];
            if (O(d))return d[L](em(b[ub]), c)
        } else {
            if ((d = this.u.cb()) || (d = this.u.Bd()), O(b) && "__swiffy_override"in b && (b = b.__swiffy_override), O(b))return b[L](em(d), c)
        } else if (d = b, d instanceof Ol && (b = d.qk(), d = d[ub]), b = b[this.j(b, w(a))], O(b) && "__swiffy_override"in b && (b = b.__swiffy_override), O(b))return b[L](em(d), c)
    };
    S[64] = function (a) {
        var b = this.ea(), b = this.u.get(b), c = this.kb();
        O(b) || (b = mi);
        var d;
        O(b) && "__swiffy_override"in b ? d = b.__swiffy_override[L](em(m), c) : (d = q[vd](b[I]), d.__swiffy_nvr && q[E](d, "__swiffy_vm", {value: this}), b[L](em(d), c));
        this[y](d);
        return a
    };
    S[83] = function (a) {
        var b = this.pop(), c = this.pop(), d = this.kb(), e = h;
        c != m && (e = b == m || "" === b ? c : c[this.j(c, w(b))]);
        O(e) || (e = mi);
        O(e) && "__swiffy_override"in e ? b = e.__swiffy_override[L](em(m), d) : (b = q[vd](e[I]), b.__swiffy_nvr && q[E](b, "__swiffy_vm", {value: this}), e[L](em(b), d));
        this[y](b);
        return a
    };
    S[67] = function (a) {
        for (var b = ni(), c = this.p(), d = 0; d < c; d++) {
            var e = this.pop(), g = this.ea();
            b[g] = e
        }
        this[y](b);
        return a
    };
    S[66] = function (a) {
        for (var b = [], c = this.p(), d = 0; d < c; d++) {
            var e = this.pop();
            b[d] = e
        }
        this[y](b);
        return a
    };
    S[68] = function (a) {
        var b = this.pop();
        this[y](b instanceof R ? "movieclip" : b == m || b == h ? w(b) : typeof b);
        return a
    };
    S[85] = function (a) {
        var b = this.pop();
        this[y](h);
        if ("string" !== typeof b)for (var c in b)this[y](c);
        return a
    };
    S[153] = function (a, b) {
        return ef(Qm, b, a[be])
    };
    S[153].Ra = l;
    var Qm = function (a) {
        return a
    };
    S[157] = function (a, b) {
        return ef(Rm, b, a[be])
    };
    S[157].Ra = l;
    var Rm = function (a, b) {
        return this.fd() ? a : b
    };
    S[158] = function (a) {
        var b = this.ea(), c = this.Yd(b);
        if (c[Rc] && c[Rc].__swiffy_d && (b = c[Rc].__swiffy_d))if (c = b.wd(c.ld), c != h && (c = b.Zm(c))) {
            for (var d = this.u, e = this.Za, g = this.jb, k = this.c, n = 0; n < c[H]; n++)c[n].ii(b);
            this.c = k;
            this.u = d;
            this.Za = e;
            this.jb = g
        }
        return a
    };
    S[159] = function (a, b) {
        return ef(Sm, b, a.frameBias, a[Qc])
    };
    S[159].Ra = l;
    var Sm = function (a, b, c) {
        var d = this.ea(), e = this.Yd(d);
        if (e[Rc] && e[Rc].__swiffy_d && (d = e[Rc].__swiffy_d))e = d.wd(e.ld), e != h && d.Sc(e + a, b);
        return c
    };
    S[44] = function (a) {
        var b = this.pop(), c = this.p(), b = (b = b ? b[I] : m) ? b : {}, d;
        b[Ud]("__swiffy_if") ? d = b.__swiffy_if : (d = new kh, b.__swiffy_if && d.Be(b.__swiffy_if), q[E](b, "__swiffy_if", {value: d}));
        for (var e = 0; e < c; ++e) {
            var g = this.pop();
            if (b = g ? g[I] : m)d.add(g), b.__swiffy_if && d.Be(b.__swiffy_if)
        }
        return a
    };
    var Tm = function (a, b) {
        if (O(b)) {
            "__swiffy_wrapped_type"in b && (b = b.__swiffy_wrapped_type);
            if (a instanceof b)return a;
            if (a instanceof q) {
                var c = a.__swiffy_if;
                if (c && c[xe](b))return a
            }
        }
        return m
    };
    S[43] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](Tm(b, c));
        return a
    };
    S[84] = function (a) {
        var b = this.pop(), c = this.pop();
        this[y](!!Tm(c, b));
        return a
    };
    S[39] = function (a) {
        this.pop();
        this.fd();
        this.fd() && (this.p(), this.p(), this.p(), this.p());
        return a
    };
    S[40] = function (a) {
        return a
    };
    M = Bk[I];
    M.vd = function (a) {
        return 7 <= this.a.Ba ? !N(a) || a === m || We(a) && "" === a[kc]() ? u.NaN : u(a) : 5 <= this.a.Ba && 7 > this.a.Ba ? !N(a) || a === m ? 0 : We(a) && "" === a[kc]() ? u.NaN : u(a) : !N(a) || this.a.Ba === m ? 0 : We(a) ? (a = u(a), da(a) ? 0 : a) : u(a)
    };
    M.$ = function (a) {
        5 > this.a.Ba && Xe(a) && (a = a ? "1" : "0");
        return 7 > this.a.Ba && !N(a) ? "" : a instanceof ci ? a.__swiffy_d.uk() : a + ""
    };
    M.nk = function (a) {
        return 7 <= this.a.Ba ? ga(a) : "string" == typeof a ? ga(u(a)) : ga(a)
    };
    M.mo = function (a, b) {
        return 5 > this.a.Ba ? a == b ? 1 : 0 : a == b
    };
    M.add = function (a, b) {
        return We(a) || We(b) ? this.$(a) + this.$(b) : this.vd(a) + this.vd(b)
    };
    var Um = function (a, b) {
        return a ? a + "." + b : w(b)
    }, Wm = function (a, b, c) {
        Vm && b instanceof Vm && (b = b.__swiffy_v, c = c || b.P, a ? b = b.Pa() : (a = b.uri, b = b[Lc]));
        this.uri = a;
        this.localName = b;
        this.P = c;
        Oa(this, Um(a, b))
    };
    M = Wm[I];
    Ya(M, function () {
        return this
    });
    M.La = function () {
        return this[G]
    };
    M.Ma = function (a) {
        return!this.P && this[G]in q(a) ? this[G] : h
    };
    M.Uc = function () {
        return this
    };
    M.Pa = function () {
        switch (this.uri) {
            case "":
                return"" + this[Lc];
            case m:
                return"*::" + this[Lc];
            default:
                return this.uri + "::" + this[Lc]
        }
    };
    Ta(M, function () {
        return(this.P ? "@" : "") + this[G]
    });
    qb(M, function () {
        var a = w(this[Lc]);
        return a === this[Lc] ? this : new Wm(this.uri, a, this.P)
    });
    M.Pb = function () {
        if (!this.P && !this.uri) {
            var a = this[Lc];
            return!Ye(a) ? (a = w(a), /^[0-9]+$/[Db](a) ? ha(a, 10) : h) : !ja(a) || 0 > a || 0 != a % 1 ? h : a
        }
    };
    M.Sf = function (a, b) {
        var c = this.Pb();
        N(c) || f(T(a, this.Pa(), Xm(b).La()));
        return c
    };
    var Ym = function (a, b) {
        Oa(this, a);
        this.P = b
    };
    Ya(Ym[I], function (a) {
        a = w(a.pop());
        return new Wm(a, this[G], this.P)
    });
    Ta(Ym[I], function () {
        return(this.P ? "@" : "") + Um("?", this[G])
    });
    var Zm = function (a) {
        this.P = a
    };
    Ya(Zm[I], function (a) {
        var b = a.pop();
        a = w(a.pop());
        return new Wm(a, b, this.P)
    });
    Ta(Zm[I], function () {
        return(this.P ? "@" : "") + Um("?", "?")
    });
    var $m = function (a, b, c) {
        Ja(this, a);
        Oa(this, b);
        this.P = c
    };
    M = $m[I];
    Ya(M, function () {
        return this
    });
    M.La = function () {
        return w(Um("", this[G]))
    };
    M.Ma = function (a) {
        if (!this.P) {
            var b = this[Tc], c = this[G];
            a = q(a);
            for (var d = 0; d < b[H]; ++d) {
                var e = Um(b[d], c);
                if (e in a)return e
            }
        }
    };
    M.Uc = function () {
        return new Wm("", this[G], this.P)
    };
    M.Pa = function () {
        return w(this[G])
    };
    Ta(M, function () {
        return(this.P ? "@" : "") + Um("[" + this[Tc][Ke](", ") + "]", this[G])
    });
    var an = function (a, b) {
        Ja(this, a);
        this.P = b
    };
    Ya(an[I], function (a) {
        a = a.pop();
        return new $m(this[Tc], a, this.P)
    });
    Ta(an[I], function () {
        return(this.P ? "@" : "") + Um("[" + this[Tc][Ke](", ") + "]", "?")
    });
    var bn = function (a) {
        this.am = a;
        this.Oe = ""
    };
    bn[I].Rl = function (a) {
        this.Oe && (this.Oe += ",");
        this.Oe += a ? a.Pa() : "*";
        return this
    };
    bn[I].Sl = function () {
        return new Wm(this.am.uri, this.am[Lc] + ".<" + this.Oe + ">", p)
    };
    var cn = function (a, b, c, d, e) {
        switch (a[yb]) {
            case 9:
                return new $m(d[a.ns], b[a[G]], p);
            case 14:
                return new $m(d[a.ns], b[a[G]], l);
            case 27:
                return new an(d[a.ns], p);
            case 28:
                return new an(d[a.ns], l);
            case 15:
                return new Ym(b[a[G]], p);
            case 16:
                return new Ym(b[a[G]], l);
            case 17:
                return new Zm(p);
            case 18:
                return new Zm(l);
            case 7:
                return new Wm(c[a.ns], b[a[G]], p);
            case 13:
                return new Wm(c[a.ns], b[a[G]], l);
            case 29:
                b = new bn(e[a[G]]);
                for (c = 0; c < a.params[H]; c++)b.Rl(e[a.params[c]]);
                return b.Sl();
            default:
                return m
        }
    };
    var dn = function (a) {
        q[E](this, "__swiffy_vm", {value: a})
    }, en = function (a, b) {
        q[E](dn[I], a, {value: b})
    };
    var fn = function () {
        return"[class " + this.__swiffy_name[Lc] + "]"
    }, hn = function () {
        return gn
    }, jn = 1, kn = function (a, b, c, d, e, g, k, n, v) {
        var A = jn++;
        if (n) {
            if (!(n instanceof Wm)) {
                var B = n[fe](".");
                n = new Wm(0 < B ? n[re](0, B) : "", 0 < B ? n[re](B + 1) : n, p)
            }
        } else n = new Wm("", "unnamed#" + A, p);
        v || en(n.La(), a);
        q[E](a[I], "__swiffy_classdef", {value: a});
        q[E](a[I], "constructor", {value: a, writable: l});
        q[E](a, "__swiffy_classdef", {get: hn});
        q[E](a, "__swiffy_coerce", {value: b});
        q[E](a, "__swiffy_istype", {value: c});
        q[E](a, "__swiffy_constructor",
            {value: d});
        q[E](a, "__swiffy_new", {value: e});
        q[E](a, "__swiffy_baseclass", {value: g});
        b = g ? g.__swiffy_if[Ob]() : [];
        if (k)for (c = 0; c < k[H]; ++c) {
            d = k[c].__swiffy_if;
            for (e = 0; e < d[H]; ++e)d[e] && (b[e] = d[e])
        }
        b[A] = a;
        q[E](a, "__swiffy_if", {value: b});
        q[E](a, "__swiffy_name", {value: n});
        q[E](a, "__swiffy_typeid", {value: A});
        q[E](a, "toString", {value: fn});
        return a
    }, ln = kn(function (a) {
        return a != m ? a : {}
    }, function (a) {
        return a != m ? a : m
    }, function (a) {
        return a != m
    }, function () {
    }, function () {
        return{}
    }, m, m, "Object");
    q[E](ln[I], "toString", {value: function () {
        return"[object " + this.__swiffy_classdef.__swiffy_name[Lc] + "]"
    }, writable: l});
    q[E](q[I], "__swiffy_classdef", {value: ln});
    var nn = function (a, b, c, d) {
        return kn(b, c || b, mn, b, d || b, ln, m, a)
    }, on = function (a, b, c) {
        return a == m ? c : !!a.__swiffy_classdef.__swiffy_if[b.__swiffy_typeid]
    }, qn = function () {
        return function b(c) {
            return pn[K](b, c)
        }
    }, pn = function (a) {
        if (on(a, this, l))return a;
        f(T(1034, Xm(a), this.__swiffy_name))
    }, rn = function (a) {
        return on(a, this, p)
    }, mn = function (a) {
        return this(a) === a
    }, Xm = function (a) {
        return a != m ? (a.__swiffy_typeid || (a = a.__swiffy_classdef), a.__swiffy_name) : new Wm("", w(a), p)
    }, sn = function () {
        var a = q[vd](this[I]);
        this.__swiffy_constructor[L](a,
            arguments);
        return a
    }, U = function (a, b, c, d, e) {
        return tn(a, b, {Jl: c, interfaces: d}, e)
    }, tn = function (a, b, c, d) {
        var e = c.Ne || qn(), g = c.Jl || ln;
        Xa(e, q[vd](g[I]));
        Xa(a, e[I]);
        return kn(e, c.Ho || c.Ne || pn, rn, a, c.Zi || sn, g[I].__swiffy_classdef, c[tc], b, d)
    }, un = function (a) {
        return function () {
            f(T(a, Xm(this)[Lc]))
        }
    }, vn = function (a) {
        (!a || !a.__swiffy_typeid) && f(T(1041));
        return a.__swiffy_baseclass
    }, wn = function (a, b) {
        (!b || !b.__swiffy_typeid) && f(T(1041));
        return b.__swiffy_istype(a) ? a : m
    }, xn = function (a, b) {
        (!b || !b.__swiffy_typeid) &&
        f(T(1041));
        return b.__swiffy_istype(a)
    }, yn = function (a, b) {
        (!b || !b.__swiffy_typeid) && f(T(1041));
        return b.__swiffy_coerce(a)
    }, zn = function (a) {
        if (this.__swiffy_new)return this.__swiffy_new[L](this, arguments);
        var b = q[vd](this[I]), c = this[L](b, arguments);
        return c instanceof q ? c : b
    }, gn = U(un(1115), "Class");
    var An = function (a) {
        this.Ip = a
    };
    An[I].Tf = function (a, b) {
        q[E](a, b, this.Ip)
    };
    An[I].Df = function () {
    };
    var Bn = function (a) {
        La(this, a)
    };
    Bn[I].Tf = function (a, b, c, d) {
        q[E](a, b, {value: ef(this[Vc], a, c, d)})
    };
    Bn[I].Df = function (a, b, c, d) {
        q[E](a, b, {value: ff(this[Vc], c, d)})
    };
    var Cn = function (a, b) {
        this.Ke = a;
        this.Le = b
    };
    Cn[I].Tf = function (a, b, c, d) {
        q[E](a, b, {get: this.Ke ? ef(this.Ke, a, c, d) : h, set: this.Le ? ef(this.Le, a, c, d) : h})
    };
    Cn[I].Df = function (a, b, c, d) {
        q[E](a, b, {get: this.Ke ? ff(this.Ke, c, d) : h, set: this.Le ? ff(this.Le, c, d) : h})
    };
    var Dn = function (a) {
        this.Bl = a
    };
    Dn[I].Tf = function (a, b) {
        q[E](a, b, {value: this.Bl[Ob]()})
    };
    Dn[I].Df = function () {
    };
    var En = function (a, b) {
        this.vp = a;
        Ka(this, b);
        this.im = []
    };
    En[I].Tf = function (a, b) {
        var c = a.__swiffy_slots, d = c[H];
        c[y](this.vp);
        (c = this.im[d]) || (this.im[d] = c = {get: Fn(d), set: Gn(d, this[Uc])});
        q[E](a, b, c)
    };
    En[I].Df = function () {
    };
    var Fn = function (a) {
        return function () {
            return this.__swiffy_slots[a]
        }
    }, Gn = function (a, b) {
        return b ? function (c) {
            this.__swiffy_slots[a] = b.__swiffy_coerce(c)
        } : function (b) {
            this.__swiffy_slots[a] = b
        }
    };
    var rl = function (a, b) {
        this.li = a;
        this.strings = a[Gb];
        this.ints = a.ints;
        this.uints = a.uints;
        this.doubles = [u.NaN];
        if (a[sd])for (var c = 0; c < a[sd][H]; ++c)this[sd][y](u(a[sd][c]));
        this.D = b;
        var d = [""];
        Ja(this, [new Hn]);
        for (c = 0; c < a[Tc][H]; ++c) {
            var e = a[Tc][c], e = e[G] ? a[Gb][e[G]] : e[yb] + "_" + c;
            d[y](e);
            this[Tc][y](new Hn(h, e))
        }
        Ja(this, d);
        e = [
            [""]
        ];
        for (c = 0; c < a.namespacesets[H]; ++c) {
            for (var g = a.namespacesets[c], k = [], n = 0; n < g[H]; ++n)k[y](d[g[n]]);
            e[y](k)
        }
        this.multinames = [m];
        for (c = 0; c < a[Fd][H]; ++c)this[Fd][y](cn(a[Fd][c],
            this[Gb], d, e, this[Fd]));
        this.methods = [];
        for (c = 0; c < a[Yd][H]; ++c)this[Yd][y](this.vo(a[Yd][c]));
        this.classes = []
    };
    rl[I].vo = function (a) {
        if (!a.code)return m;
        var b;
        if (oh)b = Re.atob(a.code); else {
            b = a.code;
            ph();
            for (var c = nh, d = [], e = 0; e < b[H];) {
                var g = c[b[$b](e++)], k = e < b[H] ? c[b[$b](e)] : 0;
                ++e;
                var n = e < b[H] ? c[b[$b](e)] : 0;
                ++e;
                var v = e < b[H] ? c[b[$b](e)] : 0;
                ++e;
                (g == m || k == m || n == m || v == m) && f(fa());
                d[y](g << 2 | k >> 4);
                64 != n && (d[y](k << 4 & 240 | n >> 2), 64 != v && d[y](n << 6 & 192 | v))
            }
            b = w[zc][L](m, d)
        }
        c = {};
        this.yf(a[Kd], c);
        d = this.lo(a.optionals);
        e = this.ko(a.exceptions);
        return ff(In, this.D, this, b, a.locals, a.params, d, a[Uc], a.arguments, e, c)
    };
    rl[I].ko = function (a) {
        var b = [];
        if (a != m)for (var c = 0; c < a[H]; c++)b[y](new Jn(a[c], this));
        return b
    };
    var Kn = [h, p, l, m];
    rl[I].Al = function (a, b) {
        switch (a) {
            case "methods":
            case "getters":
            case "setters":
                return this[Yd][b];
            case "classes":
                return this[Le][b];
            case "specials":
                return Kn[b];
            case "doubles":
                return b ? this[sd][b] : h;
            case "namespaces":
                return this[Tc][b];
            default:
                return b ? this.li[a][b] : h
        }
    };
    rl[I].yf = function (a, b) {
        var c = m;
        b.__swiffy_slots ? c = b.__swiffy_slots.Bl : (c = [], b.__swiffy_slots = new Dn(c));
        for (var d = 0; d < a[H]; ++d) {
            var e = a[d], g = this.Al(e[yb], e[cc]), k = m;
            if (e[Uc] && e[pc])var n = this[Fd][e[Uc]][yd](m).La(), k = dn[I][n];
            var n = e, v = h;
            if (n[tb])v = new An({get: Fn(n[tb]), set: n[pc] ? Gn(n[tb], k) : h}), c[n[tb]] = g; else switch (n[yb]) {
                case "methods":
                    v = new Bn(g);
                    break;
                case "setters":
                    v = new Cn(h, g);
                    break;
                case "getters":
                    v = new Cn(g, h);
                    break;
                default:
                    v = k ? new En(g, k) : new An({value: g, writable: !!n[pc]})
            }
            n = v;
            e[G] && (e =
                this[Fd][e[G]][yd](m).La(), (g = b[e]) && (n = !(g instanceof Cn) || !(n instanceof Cn) ? n : new Cn(g.Ke || n.Ke, g.Le || n.Le)), b[e] = n)
        }
        return b
    };
    rl[I].lo = function (a) {
        var b = [];
        if (N(a))for (var c = 0; c < a[H]; c++)b[y](this.Al(a[c][yb], a[c][cc]));
        return b
    };
    var Jn = function (a, b) {
        cb(this, a[Md]);
        this.to = a.to;
        fb(this, a[be]);
        this.lk = 0 == a.excType ? m : b[Fd][a.excType][yd](m).La();
        this.traits = b.yf([
            {slot: 1, kind: "specials", value: 0, type: a.excType, name: a.varName}
        ], {})
    };
    var Ck = function (a) {
        this.a = a;
        this.va = new dn(this);
        this.startTime = Date.now();
        this.c = [];
        this.gg = this.I = 0;
        this.Ia = [];
        this.Ze = 0;
        this.q = -1;
        this.Vb = "";
        this.Sb = [];
        this.Tb = vk;
        this.Xe = "";
        this.tj = new Ln;
        this.Kc = [];
        this.hg = {};
        this.Ic = m;
        this.rh()
    }, Mn = m;
    M = Ck[I];
    M.push = function (a) {
        this.c[y](a)
    };
    M.pop = function () {
        return this.c.pop()
    };
    M.eb = function () {
        var a = this.c.pop();
        a == m && f(T(1009));
        return a
    };
    M.trace = function (a) {
        tk(a)
    };
    M.xa = function (a) {
        return this.qa[Fd][a][yd](this)
    };
    var Nn = function (a) {
        this.Uk = a
    };
    Ck[I].find = function (a, b) {
        for (var c = this.Ia, d = c[H] - 1; 0 <= d; --d) {
            var e = c[d], g = e instanceof Nn;
            g && (e = e.Uk);
            if (N(a.Ma(e)) || g && On(e, a))return e
        }
        if (N(b))return b;
        f(T(1065, a.La()))
    };
    Ck[I].xf = function (a, b, c, d) {
        if (a)for (var e in a) {
            var g = a[e];
            b[Ud](e) || g.Tf(b, e, c, d)
        }
    };
    var In = function (a, b, c, d, e, g, k, n, v, A, B, P, X) {
        var la = a.qa, jb = a.Ia, Ib = a.Ze, Na = a.Vb, mc = a.q, qj = a.I, Aq = a.gg, Bq = a.Sb, Cq = a.Sh, Dq = a.Ic, Eq = a.Xe, Fq = Mn;
        a.qa = b;
        a.Ia = P[Ob]();
        a.Ze = P[H];
        a.Sb = v;
        a.Sh = A;
        a.Ic = B;
        Mn = a;
        a.rd = h;
        a.I = a.c[H];
        Va(a.c, a.c[H] + d);
        a.c[a.I] = this != m && this != ba ? this : a.va;
        a.gg = a.c[H];
        a.Vb = c;
        for (var Yb = 0; Yb < e[H]; ++Yb)a.c[a.I + Yb + 1] = arguments[H] > Pn + Yb ? a.Oh(arguments[Pn + Yb], e[Yb]) : g[g[H] + Yb - e[H]];
        if (n != m) {
            for (var jo = t[I][Ob][K](arguments, Pn + n), Yb = n; Yb < e[H]; ++Yb)jo[Yb] = a.c[a.I + Yb + 1];
            a.c[a.I + e[H] + 1] = jo
        }
        Yb = a.Tb;
        a.Tb = wk;
        try {
            a.Im(), a.rd = a.Oh(a.rd, k)
        } catch (Gq) {
            Yb[K](a, Gq)
        } finally {
            a.qa = la, a.Ia = jb, a.Ze = Ib, a.Vb = Na, a.q = mc, Va(a.c, a.I), a.I = qj, a.gg = Aq, a.Sb = Bq, a.Sh = Cq, a.Ic = Dq, a.Tb = Yb, a.Xe = Eq, Mn = Fq
        }
        return a.rd
    }, Pn = In[H] - 1;
    M = Ck[I];
    M.Im = function () {
        var a = this.Vb[H];
        for (this.q = 0; ;)try {
            for (; this.q < a;)V[this.yc()][K](this);
            break
        } catch (b) {
            this.Xn(b)
        }
    };
    M.Xn = function (a) {
        for (var b = 0; b < this.Sb[H]; b++) {
            var c = this.Sb[b];
            if (this.q >= c[Md] && this.q <= c.to && (!c.lk || this.rk(a, this.va[c.lk]))) {
                Va(this.Ia, this.Ze);
                Va(this.c, this.gg);
                this[y](a);
                this.q = c[be];
                return
            }
        }
        f(a)
    };
    M.nl = function (a, b) {
        var c = {};
        b.yf(a[Kd], c);
        this.xf(c, this.va, m, this.Ia);
        b[Yd][a[le]][K](this.va, m, [])
    };
    M.$m = function (a) {
        for (var b = a.li.scripts, c = 0; c < b[H] - 1; ++c)for (var d = b[c][Kd], e = 0; e < d[H]; ++e) {
            var g = d[e];
            "classes" == g[yb] && (g = a[Fd][g[G]][yd](m).La(), q[E](this.va, g, {get: this.io(b[c], g, a), set: ff(Qn, g), configurable: l}))
        }
        this.nl(b[b[H] - 1], a)
    };
    M.io = function (a, b, c) {
        var d = this;
        return function () {
            var e = q[ae](this, b), g;
            e.get = function () {
                return g
            };
            e.set = function (a) {
                g = a
            };
            q[E](this, b, e);
            d.nl(a, c);
            q[E](this, b, {value: g});
            return g
        }
    };
    var Qn = function (a, b) {
        q[E](this, a, {value: b})
    }, Rn = function (a, b, c, d, e, g, k) {
        var n = b[Le][c];
        a.xf(e, this, n, g);
        var v = t[I][Ob][K](arguments, 6);
        v[Me](g);
        v[Me](n);
        d[L](this, v)
    };
    Ck[I].jo = function (a, b) {
        var c = this.qa.li[Le][a], d = {}, e = this.Ia[Ob](0);
        this.qa.yf(c[Kd], d);
        var g = this.xa(c[G]).Uc(), k = [];
        if (c[tc])for (var n = 0; n < c[tc][H]; ++n) {
            var v = this.xa(c[tc][n]).Ma(this.va);
            v && k[y](this.va[v])
        }
        n = ff(Rn, this, this.qa, a, this.qa[Yd][c[le]], d, e);
        g = U(n, g, b, k);
        e[y](g);
        for (var A in d)d[A].Df(g[I], A, g, e);
        d = {};
        this.qa.yf(c.ctraits, d);
        this.xf(d, g, g, e);
        this.qa[Yd][c.cinit][K](g, m, this.Ia);
        return this.qa[Le][a] = g
    };
    Ck[I].rk = function (a, b) {
        return b == ln ? a != m : q(a)instanceof b
    };
    Ck[I].Oh = function (a, b) {
        if (!b)return a;
        var c = this.xa(b).Ma(this.va), c = this.va[c];
        return!c && a === m ? m : yn(a, c)
    };
    var W = function (a, b, c, d, e) {
        var g = d;
        q[E](a, b, {get: function () {
            return g
        }, set: function (a) {
            g = !e || a != m ? yn(a, dn[I][c]) : m
        }})
    }, Y = function (a, b, c) {
        q[E](a, b, {value: c})
    }, Z = function (a, b, c, d) {
        return!N(a) && N(c) ? c : d && a == m ? m : yn(a, dn[I][b])
    }, Sn = function (a, b, c, d) {
        if (O(b))return b[L](a, c);
        f(T(1006, d || "value"))
    };
    M = Ck[I];
    M.yc = function () {
        return this.Vb[me](this.q++)
    };
    M.n = function () {
        var a = 0, b = 0;
        do var c = this.yc(), b = b + ((c & 127) << a), a = a + 7; while (c & 128);
        return b
    };
    M.Ea = function () {
        var a = this.yc(), a = a | this.yc() << 8;
        return a |= this.yc() << 24 >> 8
    };
    M.kb = function () {
        for (var a = this.n(), a = s.min(a, this.c[H] - this.I), b = []; 0 <= --a;)b[a] = this.pop();
        return b
    };
    M.fh = function (a, b) {
        this.hg[a] = b
    };
    M.Ce = function () {
    };
    M.Og = function () {
    };
    M.De = function () {
    };
    M.Lk = function () {
        return l
    };
    M.Vg = function () {
    };
    M.Wk = function () {
    };
    M.Ug = function () {
    };
    M.Tk = function () {
    };
    M.pf = function (a) {
        this.Kc[y](a)
    };
    M.la = function () {
        for (; 0 < this.Kc[H];)this.Kc[Eb]()[K](this)
    };
    M.$k = function (a, b) {
        var c = this.Tb;
        this.Tb = wk;
        try {
            a()
        } catch (d) {
            b(d), c[K](this, d)
        } finally {
            this.Tb = c
        }
    };
    M.Ai = function () {
    };
    M.Sj = function (a, b, c) {
        a[b] = c
    };
    M.Tj = function (a, b) {
        a[b] = m
    };
    M.Xj = function () {
    };
    M.Vj = function () {
    };
    M.Pk = function () {
    };
    M.fireEvent = function (a, b, c, d) {
        if (a instanceof Tn && (b = Un[c[Uc]])) {
            c = b(a, c);
            if (d)return a[lc](c);
            this.pf(ef(a[lc], a, c))
        }
        return p
    };
    M.pk = function (a, b, c) {
        a.of();
        b = a.e;
        b.__swiffy_classdef.__swiffy_constructor[L](b, c);
        a.Zk() && a[pe](new cj(2097152), l)
    };
    M.Ca = function (a, b) {
        var c = q[vd]((this.va[a[D].Wo] || b)[I]), d;
        for (d in c)O(c[d]) && (c[d] = ef(c[d], c));
        return c
    };
    M.rh = function () {
        var a = this;
        jj[I].Ca = function () {
            return a.Ca(this, Vn)
        };
        ck[I].Ca = function () {
            return a.Ca(this, Wn)
        };
        Dk[I].Ca = function () {
            return a.Ca(this, Xn)
        };
        ij[I].Ca = function () {
            return a.Ca(this, Yn)
        };
        vj[I].Ca = function () {
            return a.Ca(this, Zn)
        }
    };
    M.Ck = function (a, b) {
        for (var c in this.hg) {
            var d = this.va[c];
            if (d) {
                var e = this.hg[c];
                q[E](d[I], "__swiffy_definition", {value: e});
                delete this.hg[c]
            }
        }
        return(e = a[I].__swiffy_definition) ? (c = q[vd](a[I]), e = e.Fb(this.a, m, c), e.Ta(this.a.af()), e.Q(p, b), c) : zn[L](a, b)
    };
    M.Gl = function (a, b) {
        q[E](this.tj.parameters, a, {value: b, configurable: l, enumerable: l})
    };
    M.Ag = function (a) {
        return a instanceof ck || a instanceof Dk
    };
    M.Mk = function (a) {
        return a[ce]() && (a instanceof vj || a instanceof ck && a.ug) && a.e.useHandCursor
    };
    M.Ek = function (a, b) {
        var c;
        c = a ? a.dm() : [];
        var d;
        d = b ? b.dm() : [];
        var e = c[H] - 1, g = d[H] - 1;
        if (0 < e && 0 < g)for (; c[e] == d[g];)e--, g--;
        for (var k = 0; k <= e; k++)c[k].bm(b);
        for (k = 0; k <= g; k++)d[k].cm(a)
    };
    M.xe = function (a) {
        var b = this.a.qb;
        b && !b.Wd() && b[pe](a)
    };
    M.Lj = function (a, b) {
        b.Ta(a.af())
    };
    M.jm = function () {
        var a = this.n(), b = this.kb(), a = this.xa(a), c;
        var d = this.eb();
        d == m && f(T(1009));
        var e = a.Ma(d);
        N(e) ? c = Sn(d, d[e], b, e) : (e = d.__swiffy_proxy) && e.ye ? c = e.ye[K](d, a.Uc(), b) : f(T(1069, a.Pa(), Xm(d).La()));
        return c
    };
    var V = {36: function () {
        this[y](this.yc() << 24 >> 24)
    }, 47: function () {
        var a = this.n();
        this[y](this.qa[sd][a])
    }, 39: function () {
        this[y](p)
    }, 45: function () {
        var a = this.n();
        this[y](this.qa.ints[a])
    }, 40: function () {
        this[y](u.NaN)
    }, 32: function () {
        this[y](m)
    }, 37: function () {
        var a = this.n();
        this[y](a)
    }, 44: function () {
        var a = this.n();
        this[y](this.qa[Gb][a])
    }, 38: function () {
        this[y](l)
    }, 46: function () {
        var a = this.n();
        this[y](this.qa.uints[a])
    }, 33: function () {
        this[y](h)
    }, 28: function () {
        this.Ia[y](new Nn(this.pop()))
    }, 42: function () {
        var a =
            this.pop();
        this[y](a);
        this[y](a)
    }, 43: function () {
        var a = this.pop(), b = this.pop();
        this[y](a);
        this[y](b)
    }, 41: function () {
        this.pop()
    }, 29: function () {
        this.Ia.pop()
    }, 48: function () {
        this.Ia[y](this.pop())
    }, 101: function () {
        var a = this.yc(), a = this.Ia[this.Ze + a];
        a instanceof Nn && (a = a.Uk);
        this[y](a)
    }, 100: function () {
        this[y](this.Ia[0])
    }, 71: function () {
        this.q = u[Hb]
    }, 72: function () {
        this.rd = this.pop();
        this.q = u[Hb]
    }, 65: function () {
        var a = this.kb(), b = this.pop(), c = this.pop();
        this[y](Sn(b, c, a))
    }, 78: function () {
        var a = this.n(), b =
            this.kb(), c = this.xa(a), a = this.eb(), c = c.Ma(a);
        vn(this.Ic)[I][c][L](a, b)
    }, 79: function () {
        this.jm()
    }, 69: function () {
        var a = this.n(), b = this.kb(), c = this.xa(a), a = this.eb(), c = c.Ma(a), d = vn(this.Ic)[I];
        this[y](d[c][L](a, b))
    }, 70: function () {
        this[y](this.jm())
    }, 94: function () {
        var a = this.n(), a = this.xa(a);
        this[y](this.find(a, this.va))
    }, 93: function () {
        var a = this.n(), a = this.xa(a);
        this[y](this.find(a))
    }, 96: function () {
        var a = this.n(), a = this.xa(a), b = this.find(a);
        this[y]($n(b, a))
    }, 97: function () {
        var a = this.pop(), b = this.n(),
            b = this.xa(b), c = this.eb();
        c == m && f(T(1009));
        var d = b.Ma(c);
        N(d) ? c[d] = a : (d = c.__swiffy_proxy) && d.setProperty ? d.setProperty[K](c, b.Uc(), a) : c[b.La()] = a
    }};
    V[104] = V[97];
    V[102] = function () {
        var a = this.n(), a = this.xa(a), b = this.eb();
        this[y]($n(b, a))
    };
    V[106] = function () {
        var a = this.n(), a = this.xa(a), b = this.eb();
        this[y](ao(b, a))
    };
    V[3] = function () {
        f(this.pop())
    };
    V[90] = function () {
        var a = this.Sb[this.n()][Kd], b = {};
        this.xf(a, b, m, this.Ia);
        this[y](b)
    };
    V[120] = function () {
        var a = this.c[this.c[H] - 1];
        a === m && f(T(1009));
        a === h && f(T(1010));
        !on(a, bo, p) && !on(a, co, p) && f(T(1123, Xm(a).La()))
    };
    V[89] = function () {
        var a = this.n(), a = this.xa(a), b = this.eb();
        this[y](eo(b, a))
    };
    V[6] = function () {
        var a = this.n();
        this.Xe = this.qa[Gb][a]
    };
    V[7] = function () {
        this.Xe = w(this.pop())
    };
    V[114] = function () {
        this[y](El(w(this.pop())))
    };
    V[113] = function () {
        this[y](Dl(w(this.pop())))
    };
    V[4] = function () {
        var a = this.n(), a = this.xa(a), b = this.eb(), c = a.Ma(b);
        N(c) || f(T(1069, a.Pa(), Xm(b).La()));
        for (var d = vn(this.Ic)[I], e; d && !(e = q[ae](d, c));)d = q[hd](d);
        e || f(T(1069, a.Pa(), Xm(b).La()));
        this[y](e.get[K](b))
    };
    V[5] = function () {
        var a = this.pop(), b = this.n(), b = this.xa(b), c = this.eb(), d = b.Ma(c);
        N(d) || (d = b.La());
        for (var e = vn(this.Ic)[I], g; e && !(g = q[ae](e, d));)e = q[hd](e);
        e || f(T(1069, b.Pa(), Xm(c).La()));
        g.set[K](c, a)
    };
    V[108] = function () {
        var a = this.n(), b = this.eb().__swiffy_slots;
        this[y](b[a])
    };
    V[109] = function () {
        var a = this.n(), b = this.pop();
        this.eb().__swiffy_slots[a] = b
    };
    V[177] = function () {
        var a = this.pop(), b = this.pop();
        this[y](this.rk(b, a))
    };
    V[180] = function () {
        var a = q(this.eb()), b = this.pop();
        this[y](On(a, new Wm("", b, p)))
    };
    V[208] = function () {
        this[y](this.c[this.I + 0])
    };
    V[209] = function () {
        this[y](this.c[this.I + 1])
    };
    V[210] = function () {
        this[y](this.c[this.I + 2])
    };
    V[211] = function () {
        this[y](this.c[this.I + 3])
    };
    V[98] = function () {
        var a = this.n();
        this[y](this.c[this.I + a])
    };
    V[212] = function () {
        this.c[this.I + 0] = this.pop()
    };
    V[213] = function () {
        this.c[this.I + 1] = this.pop()
    };
    V[214] = function () {
        this.c[this.I + 2] = this.pop()
    };
    V[215] = function () {
        this.c[this.I + 3] = this.pop()
    };
    V[99] = function () {
        var a = this.n();
        this.c[this.I + a] = this.pop()
    };
    V[146] = function () {
        var a = this.n();
        ++this.c[this.I + a]
    };
    V[148] = function () {
        var a = this.n();
        --this.c[this.I + a]
    };
    V[194] = function () {
        var a = this.n();
        this.c[this.I + a] = (this.c[this.I + a] | 0) + 1 | 0
    };
    V[195] = function () {
        var a = this.n();
        this.c[this.I + a] = (this.c[this.I + a] | 0) - 1 | 0
    };
    V[8] = function () {
        var a = this.n();
        this.c[this.I + a] = h
    };
    V[88] = function () {
        var a = this.n(), b = this.pop();
        this[y](this.jo(a, b))
    };
    V[64] = function () {
        var a = this.n(), a = this.qa[Yd][a], b = this.Ia[Ob](0);
        this[y](ff(a, m, b))
    };
    V[66] = function () {
        var a = this.kb(), b = this.pop();
        this[y](this.Ck(b, a))
    };
    V[74] = function () {
        var a = this.n(), b = this.kb(), a = this.xa(a), c = this.eb();
        this[y](this.Ck(c[a.Ma(c)], b))
    };
    V[73] = function () {
        var a = this.kb(), b = this.eb();
        vn(this.Ic).__swiffy_constructor[L](b, a)
    };
    V[83] = function () {
        var a = this.kb(), b = this.pop(), c = b && b.__swiffy_type_apply;
        c || f(T(1127));
        this[y](c[K](b, this.va, a))
    };
    V[85] = function () {
        for (var a = this.n(), b = {}, c = this.c[H] - 2 * a, d = 0; d < a; ++d)b[this.c[c + 2 * d]] = this.c[c + 2 * d + 1];
        Va(this.c, c);
        this[y](b)
    };
    V[86] = function () {
        for (var a = this.n(), b = t(a); a--;) {
            var c = this.pop();
            b[a] = c
        }
        this[y](b)
    };
    V[87] = function () {
        var a = {};
        this.xf(this.Sh, a, m, this.Ia);
        this[y](a)
    };
    V[160] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b + a)
    };
    V[161] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b - a)
    };
    V[162] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b * a)
    };
    V[163] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b / a)
    };
    V[164] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b % a)
    };
    V[144] = function () {
        var a = this.pop();
        this[y](-a)
    };
    V[150] = function () {
        var a = this.pop();
        this[y](!a)
    };
    V[145] = function () {
        var a = this.pop();
        ++a;
        this[y](a)
    };
    V[147] = function () {
        var a = this.pop();
        --a;
        this[y](a)
    };
    V[197] = function () {
        var a = this.pop() | 0, b = this.pop() | 0;
        this[y](b + a | 0)
    };
    V[198] = function () {
        var a = this.pop() | 0, b = this.pop() | 0;
        this[y](b - a | 0)
    };
    V[199] = function () {
        var a = this.pop() | 0, b = this.pop() | 0;
        this[y](b * a | 0)
    };
    V[196] = function () {
        var a = this.pop() | 0;
        this[y](-a | 0)
    };
    V[192] = function () {
        var a = this.pop() | 0;
        this[y](a + 1 | 0)
    };
    V[193] = function () {
        var a = this.pop() | 0;
        this[y](a - 1 | 0)
    };
    V[151] = function () {
        var a = this.pop();
        this[y](~a)
    };
    V[169] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b | a)
    };
    V[170] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b ^ a)
    };
    V[168] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b & a)
    };
    V[165] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b << a)
    };
    V[166] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b >> a)
    };
    V[167] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b >>> a)
    };
    V[118] = function () {
        var a = this.pop();
        this[y](ga(a))
    };
    V[117] = function () {
        var a = this.pop();
        this[y](u(a))
    };
    V[115] = function () {
        var a = this.pop();
        this[y](a | 0)
    };
    V[116] = function () {
        var a = this.pop();
        this[y](a >>> 0)
    };
    V[112] = function () {
        var a = this.pop();
        this[y](w(a))
    };
    V[128] = function () {
        var a = this.n(), b = this.pop();
        this[y](this.Oh(b, a))
    };
    V[130] = function () {
    };
    V[133] = function () {
        var a = this.pop();
        a != m ? this[y](w(a)) : this[y](m)
    };
    V[149] = function () {
        var a = this.pop();
        this[y](typeof a)
    };
    V[134] = function () {
        var a = this.n(), a = this.xa(a).Ma(this.va), a = this.va[a], b = this.pop();
        this[y](wn(b, a))
    };
    V[178] = function () {
        var a = this.n(), a = this.xa(a).Ma(this.va), a = this.va[a], b = this.pop();
        this[y](xn(b, a))
    };
    V[135] = function () {
        var a = this.pop(), b = this.pop();
        this[y](wn(b, a))
    };
    V[179] = function () {
        var a = this.pop(), b = this.pop();
        this[y](xn(b, a))
    };
    V[171] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b == a)
    };
    V[172] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b === a)
    };
    V[173] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b < a)
    };
    V[174] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b <= a)
    };
    V[175] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b > a)
    };
    V[176] = function () {
        var a = this.pop(), b = this.pop();
        this[y](b >= a)
    };
    V[16] = function () {
        var a = this.Ea();
        this.q += a
    };
    V[14] = function () {
        var a = this.Ea(), b = this.pop(), c = this.pop();
        b < c || (this.q += a)
    };
    V[12] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() < b || (this.q += a)
    };
    V[15] = function () {
        var a = this.Ea(), b = this.pop(), c = this.pop();
        b <= c || (this.q += a)
    };
    V[19] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() == b && (this.q += a)
    };
    V[20] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() != b && (this.q += a)
    };
    V[25] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() === b && (this.q += a)
    };
    V[26] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() !== b && (this.q += a)
    };
    V[13] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() <= b || (this.q += a)
    };
    V[18] = function () {
        var a = this.Ea();
        this.pop() || (this.q += a)
    };
    V[23] = function () {
        var a = this.Ea(), b = this.pop(), c = this.pop();
        b < c && (this.q += a)
    };
    V[21] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() < b && (this.q += a)
    };
    V[24] = function () {
        var a = this.Ea(), b = this.pop(), c = this.pop();
        b <= c && (this.q += a)
    };
    V[22] = function () {
        var a = this.Ea(), b = this.pop();
        this.pop() <= b && (this.q += a)
    };
    V[17] = function () {
        var a = this.Ea();
        this.pop() && (this.q += a)
    };
    V[27] = function () {
        for (var a = this.q - 1, b = this.Ea(), c = this.n(), d = [], e = 0; e < c + 1; e++)d[y](this.Ea());
        e = this.pop();
        0 <= e && e < c + 1 && (b = d[e]);
        this.q = a + b
    };
    V[31] = function () {
        var a = this.pop(), b = this.pop();
        this[y](fo(b, a))
    };
    V[50] = function () {
        for (var a = this.n(), b = this.n(), c = this.c[this.I + a], d = this.c[this.I + b]; c && 0 == (d = fo(c, d));) {
            var e = c.__swiffy_proxy, c = e && e.Dd ? m : q[hd](c);
            this.c[this.I + a] = c
        }
        this.c[this.I + b] = d;
        this[y](!!d)
    };
    V[30] = function () {
        var a = this.pop(), b = this.pop();
        this[y](go(b, a))
    };
    V[35] = function () {
        var a = this.pop(), b = this.pop();
        this[y](ho(b, a))
    };
    V[2] = function () {
    };
    V[9] = function () {
    };
    V[239] = function () {
        this.yc();
        this.n();
        this.yc();
        this.n()
    };
    V[241] = function () {
        this.n()
    };
    V[240] = function () {
        this.n()
    };
    var Hn = function (a, b) {
        var c, d;
        N(b) ? (c = Al(a), d = b instanceof Vm ? b.uri : w(b)) : N(a) ? a instanceof Hn ? (c = a.prefix, d = a.uri) : (d = a instanceof Vm ? a.uri : w(a), c = h) : d = c = "";
        Y(this, "prefix", c);
        Y(this, "uri", d)
    }, io = function (a) {
        return a instanceof Hn ? a : new Hn(h, w(a))
    };
    tn(Hn, "Namespace", {Ne: io});
    pa(Hn[I], function () {
        return this.uri
    });
    Ta(Hn[I], function () {
        return this.uri
    });
    var Vm = function (a) {
        q[E](this, "__swiffy_v", {value: a.normalize()})
    }, ko = function (a, b, c) {
        return new Vm(new Wm(a, b, c))
    };
    tn(Vm, "QName", {Ne: function (a) {
        return a instanceof Vm ? a : ko("", a, p)
    }, Zi: function (a, b) {
        var c, d;
        if (N(b))c = N(a) ? a instanceof Vm ? a.uri : a !== m ? w(a) : m : b instanceof Vm ? b.uri : "", d = b instanceof Vm ? b[Lc] : w(b); else if (c = "", N(a)) {
            if (a instanceof Vm)return a;
            d = w(a)
        } else d = "";
        return ko(c, d, p)
    }});
    q[E](Vm[I], "uri", {get: function () {
        return this.__swiffy_v.uri
    }});
    q[E](Vm[I], "localName", {get: function () {
        return this.__swiffy_v[Lc]
    }});
    Ta(Vm[I], function () {
        return this.__swiffy_v.Pa()
    });
    dn[I]["flash.net.navigateToURL"] = function (a, b) {
        a.url == m && f(new TypeError);
        var c = N(b) ? b : "_blank", d = 0;
        a[C] && (d = a[Vc] == lo.POST ? 2 : 1);
        var e = this.__swiffy_vm;
        e.a.rf(new xk(e, a[C] ? a[C][od]() : m, a.url, c, d))
    };
    dn[I].trace = function (a) {
        var b = t[I].map[K](arguments, w)[Ke](" ");
        this.__swiffy_vm.trace(b)
    };
    dn[I].parseInt = function (a, b) {
        !N(b) && $h(a) && (b = 10);
        return ha(a, b)
    };
    dn[I].parseFloat = ia;
    dn[I].isNaN = da;
    dn[I].isFinite = ja;
    Ta(dn[I], function () {
        return"[object global]"
    });
    dn[I]["flash.utils.setTimeout"] = function (a, b) {
        var c = this, d = t[I][Ob][K](arguments, 2);
        return ba.setTimeout(function () {
            a[L](c, d)
        }, b)
    };
    dn[I]["flash.utils.clearTimeout"] = function (a) {
        ba.clearTimeout(a)
    };
    dn[I]["flash.utils.setInterval"] = function (a, b) {
        var c = this, d = t[I][Ob][K](arguments, 2);
        return ba.setInterval(function () {
            a[L](c, d)
        }, b)
    };
    dn[I]["flash.utils.clearInterval"] = function (a) {
        ba.clearInterval(a)
    };
    dn[I]["flash.utils.getTimer"] = function () {
        return Date.now() - this.__swiffy_vm.startTime
    };
    dn[I]["flash.utils.getDefinitionByName"] = function (a) {
        a = a[Pb]("::", ".");
        "." == a[0] && (a = a[re](1));
        return this[a]
    };
    dn[I]["flash.utils.getQualifiedClassName"] = function (a) {
        switch (typeof a) {
            case "undefined":
                return"void";
            case "number":
                if ((a | 0) == a)return"int"
        }
        return Xm(a).Pa()
    };
    dn[I]["flash.utils.getQualifiedSuperclassName"] = function (a) {
        t:{
            if (a != m && (a.__swiffy_typeid || (a = a.__swiffy_classdef), a = a.__swiffy_baseclass, a != m)) {
                a = a.__swiffy_name;
                break t
            }
            a = m
        }
        return a ? a.Pa() : a
    };
    en("isXMLName", function (a) {
        return N(Al(a))
    });
    var mo = function (a, b) {
        en(a, function (c) {
            try {
                return c != m ? b(w(c)) : "null"
            } catch (d) {
                f(T(1052, a))
            }
        })
    };
    mo("escape", escape);
    mo("unescape", unescape);
    mo("encodeURI", encodeURI);
    mo("encodeURIComponent", aa);
    mo("decodeURI", decodeURI);
    mo("decodeURIComponent", ka);
    dn[I].Math = s;
    nn("Boolean", ga);
    nn("Number", u);
    nn("int", function (a) {
        return a | 0
    });
    nn("uint", function (a) {
        return a >>> 0
    });
    nn("void", function () {
    });
    nn("String", w, function (a) {
        return a != m ? w(a) : m
    });
    nn("Date", function (a) {
        return a instanceof Date ? a : Date()
    }, function (a) {
        if (a instanceof Date)return a;
        f(T(1034, Xm(a), "Date"))
    }, Date.__swiffy_override);
    Xa(dn[I].Date, Date[I]);
    dn[I].Date.UTC = Date.UTC;
    kn(ca, pn, rn, ca, ca, ln, m, "Function");
    kn(t, pn, rn, t, t, ln, m, "Array");
    var no = eval("RegExp");
    kn(no, pn, rn, no, function (a, b) {
        if (a instanceof ma)return N(b) && f(T(1100)), ma(a);
        var c = p, d = p;
        if (b != m) {
            a = w(a);
            b = w(b);
            b = b[Pb](/[^gim]/g, function (a) {
                switch (a) {
                    case "s":
                        c = l;
                        break;
                    case "x":
                        d = l
                }
                return""
            });
            if (c) {
                var e = p;
                a = a[Pb](/[.\[\]]|\\./g, function (a) {
                    switch (a) {
                        case ".":
                            if (!e)return"[^]";
                            break;
                        case "[":
                            e = l;
                            break;
                        case "]":
                            e = p
                    }
                    return a
                })
            }
            d && (a = a[Pb](/\s+/g, ""))
        }
        return ma(a, b)
    }, ln, m, "RegExp");
    dn[I].undefined = h;
    dn[I]["null"] = m;
    dn[I].Infinity = Infinity;
    dn[I].NaN = NaN;
    en("AS3", io("http://adobe.com/AS3/2006/builtin"));
    var oo = function (a, b) {
        q[E](a, Um("http://adobe.com/AS3/2006/builtin", b), {value: function () {
            return this[b][L](this, arguments)
        }})
    };
    oo(q[I], "toLocaleString");
    oo(q[I], "toString");
    oo(q[I], "valueOf");
    var $ = function (a, b) {
        q[E](a, Um("http://adobe.com/AS3/2006/builtin", b), {value: a[b]})
    };
    $(q[I], "hasOwnProperty");
    $(q[I], "isPrototypeOf");
    $(q[I], "propertyIsEnumerable");
    $(ca[I], "apply");
    $(ca[I], "call");
    $(w, "fromCharCode");
    $(w[I], "charAt");
    $(w[I], "charCodeAt");
    $(w[I], "concat");
    $(w[I], "indexOf");
    $(w[I], "lastIndexOf");
    $(w[I], "localeCompare");
    $(w[I], "match");
    $(w[I], "replace");
    $(w[I], "search");
    $(w[I], "slice");
    $(w[I], "split");
    $(w[I], "substr");
    $(w[I], "substring");
    $(w[I], "toLocaleLowerCase");
    $(w[I], "toLocaleUpperCase");
    $(w[I], "toLowerCase");
    $(w[I], "toUpperCase");
    $(w[I], "toString");
    $(w[I], "valueOf");
    $(t[I], "concat");
    $(t[I], "every");
    $(t[I], "filter");
    $(t[I], "forEach");
    $(t[I], "indexOf");
    $(t[I], "join");
    $(t[I], "lastIndexOf");
    $(t[I], "map");
    $(t[I], "pop");
    $(t[I], "push");
    $(t[I], "reverse");
    $(t[I], "shift");
    $(t[I], "slice");
    $(t[I], "some");
    $(t[I], "sort");
    $(t[I], "splice");
    $(t[I], "unshift");
    var On = function (a, b) {
        a == m && f(T(1009));
        if (b.La()in a)return l;
        var c = a.__swiffy_proxy;
        return c && c.Md ? c.Md[K](a, b.Uc()) : p
    }, eo = function (a, b) {
        a == m && f(T(1009));
        var c = a.__swiffy_proxy;
        if (c && c.kh)return c.kh[K](a, b.Uc());
        f(T(1016))
    }, $n = function (a, b) {
        a == m && f(T(1009));
        var c = b.Ma(a);
        if (N(c))return a[c];
        if ((c = a.__swiffy_proxy) && c.Ac)return c.Ac[K](a, b.Uc())
    }, ao = function (a, b) {
        a == m && f(T(1009));
        var c = a.__swiffy_proxy;
        if (c && c.yb)return c.yb[K](a, b.Uc());
        c = b.Ma(a);
        return N(c) ? delete a[c] : p
    }, fo = function (a, b) {
        a == m &&
        f(T(1009));
        var c = a.__swiffy_proxy;
        c && c.Dd ? b = c.Dd[K](a, b) : ++b > q[fd](q(a))[H] && (b = 0);
        return b
    }, go = function (a, b) {
        a == m && f(T(1009));
        var c = a.__swiffy_proxy;
        return c && c.Pe ? c.Pe[K](a, b) : q[fd](q(a))[b - 1]
    }, ho = function (a, b) {
        a == m && f(T(1009));
        var c = a.__swiffy_proxy;
        return c && c.Qe ? c.Qe[K](a, b) : a[q[fd](q(a))[b - 1]]
    };
    var po = function (a, b) {
        a = Z(a, "String", "");
        b = Z(b, "int", 0);
        Y(this, "errorID", b);
        W(this, "message", "String", a);
        W(this, "name", "String", "Error")
    };
    U(po, "Error");
    po[I].getStackTrace = function () {
        return""
    };
    Ta(po[I], function () {
        return this[G] + (this.message ? ": " + this.message : "")
    });
    var qo = function (a, b) {
        po[K](this, a, b);
        Oa(this, "ReferenceError")
    };
    U(qo, "ReferenceError", po);
    var ro = function (a, b) {
        po[K](this, a, b);
        Oa(this, "TypeError")
    };
    U(ro, "TypeError", po);
    var so = function (a, b) {
        po[K](this, a, b);
        Oa(this, "VerifyError")
    };
    U(so, "VerifyError", po);
    var to = function (a, b) {
        po[K](this, a, b);
        Oa(this, "ArgumentError")
    };
    U(to, "ArgumentError", po);
    var uo = function (a, b) {
        po[K](this, a, b);
        Oa(this, "RangeError")
    };
    U(uo, "RangeError", po);
    var vo = function (a, b) {
        po[K](this, a, b);
        Oa(this, "URIError")
    };
    U(vo, "URIError", po);
    var wo = function (a, b) {
        po[K](this, a, b);
        Oa(this, "IOError")
    };
    U(wo, "flash.errors.IOError", po);
    var xo = function (a, b) {
        wo[K](this, a, b);
        Oa(this, "Error")
    };
    U(xo, "flash.errors.EOFError", wo);
    var T = function (a, b) {
        var c = yo[a], d = zo[a] || po, e = t[I][Ob][K](arguments, 1), g = "Error #" + a;
        c ? g += ": " + c[Pb](/{(\d+)}/g, function (a, b) {
            return N(e[b]) ? e[b] : a
        }) : 0 < e[H] && (g += ": " + e[Ke](", "));
        return new d(g, a)
    }, yo = {1001: "The method {0} is not implemented.", 1006: "{0} is not a function.", 1007: "Instantiation attempted on a non-constructor.", 1009: "Cannot access a property or method of a null object reference.", 1010: "A term is undefined and has no properties.", 1016: "Descendants operator (..) not supported on type",
        1034: "Type Coercion failed: cannot convert {0} to {1}.", 1041: "The right-hand side of operator must be a class.", 1052: "Invalid URI passed to {0} function.", 1056: "Cannot create property {0} on {1}.", 1065: "Variable {0} is not defined.", 1069: "Property {0} not found on {1} and there is no default value.", 1083: 'The prefix "{0}" for element "{1}" is not bound.', 1085: 'The element type "{0}" must be terminated by the matching end-tag "</{0}>".', 1086: "The {0} method only works on lists containing one item.",
        1087: "Assignment to indexed XML is not allowed.", 1088: "The markup in the document following the root element must be well-formed.", 1090: "XML parser failure: element is malformed.", 1091: "XML parser failure: Unterminated CDATA section.", 1094: "XML parser failure: Unterminated comment.", 1095: "XML parser failure: Unterminated attribute.", 1097: "XML parser failure: Unterminated processing instruction.", 1100: "Cannot supply flags when constructing one RegExp from another.", 1115: "{0}$ is not a constructor.",
        1123: "Filter operator not supported on type {0}.", 1125: "The index {0} is out of range {1}.", 1126: "Cannot change the length of a fixed Vector.", 1127: "Type application attempted on a non-parameterized type.", 1508: "The value specified for argument {0} is invalid.", 2007: "Parameter {0} must be non-null.", 2008: "{0} must be one of the accepted values.", 2012: "{0}$ class cannot be instantiated.", 2030: "End of file was encountered.", 2067: "The ExternalInterface is not available in this container.", 2088: "The Proxy class does not implement {0}. It must be overridden by a subclass.",
        2089: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2090: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2091: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2092: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2093: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2101: "The String passed to URLVariables.decode() must be a URL-encoded query string containing name/value pairs.",
        2105: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2106: "The Proxy class does not implement {0}. It must be overridden by a subclass.", 2107: "The Proxy class does not implement {0}. It must be overridden by a subclass."}, zo = {1001: so, 1006: ro, 1007: ro, 1009: ro, 1010: ro, 1016: ro, 1034: ro, 1041: ro, 1052: vo, 1056: qo, 1065: qo, 1069: qo, 1083: ro, 1085: ro, 1086: ro, 1087: ro, 1088: ro, 1090: ro, 1091: ro, 1094: ro, 1095: ro, 1097: ro, 1100: ro, 1115: ro, 1123: ro, 1125: uo, 1126: uo, 1127: ro, 1508: to, 2007: ro, 2008: to,
        2012: to, 2030: xo, 2067: po, 2088: po, 2089: po, 2090: po, 2091: po, 2092: po, 2093: po, 2101: po, 2105: po, 2106: po, 2107: po};
    var Ao = function () {
    };
    U(Ao, "flash.filters.BitmapFilter");
    Ao[I].clone = function () {
        return new Ao
    };
    Ta(Ao[I], function () {
        return"[object BitmapFilter]"
    });
    var Bo = U(function () {
    }, "flash.filters.BitmapFilterQuality");
    q[ic](Bo, {HIGH: {value: 3}, LOW: {value: 1}, MEDIUM: {value: 2}});
    var Co = U(function () {
    }, "flash.filters.BitmapFilterType");
    q[ic](Co, {FULL: {value: "full"}, INNER: {value: "inner"}, OUTER: {value: "outer"}});
    var Do = function (a, b, c, d, e, g, k, n, v, A, B, P) {
        a = Z(a, "Number", 4);
        b = Z(b, "Number", 45);
        c = Z(c, "uint", 16777215);
        d = Z(d, "Number", 1);
        e = Z(e, "uint", 0);
        g = Z(g, "Number", 1);
        k = Z(k, "Number", 4);
        n = Z(n, "Number", 4);
        v = Z(v, "Number", 1);
        A = Z(A, "int", 1);
        B = Z(B, "String", "inner");
        P = Z(P, "Boolean", p);
        W(this, "angle", "Number", b);
        W(this, "blurX", "Number", k);
        W(this, "blurY", "Number", n);
        W(this, "distance", "Number", a);
        W(this, "highlightAlpha", "Number", d);
        W(this, "highlightColor", "uint", c);
        W(this, "knockout", "Boolean", P);
        W(this, "quality", "int", A);
        W(this, "shadowAlpha", "Number", g);
        W(this, "shadowColor", "uint", e);
        W(this, "strength", "Number", v);
        W(this, "type", "String", B);
        q[E](this, "__swiffy_v", {get: function () {
            return new Vk(this[Gd], this.highlightColor | 4278190080 * this.highlightAlpha, this.shadowColor | 4278190080 * this.shadowAlpha, this[ye], this[je], this[Oe], this.blurX, this.blurY, p, l, this[uc])
        }})
    };
    U(Do, "flash.filters.BevelFilter", Ao);
    Do[I].clone = function () {
        return new Do(this[ye], this[Gd], this.highlightColor, this.highlightAlpha, this.shadowColor, this.shadowAlpha, this.blurX, this.blurY, this[je], this[Oe], this[Uc], this[uc])
    };
    var Eo = function (a, b, c) {
        a = Z(a, "Number", 4);
        b = Z(b, "Number", 4);
        c = Z(c, "int", 1);
        W(this, "blurX", "Number", a);
        W(this, "blurY", "Number", b);
        W(this, "quality", "int", c);
        q[E](this, "__swiffy_v", {get: function () {
            return new Rk(this[Oe], this.blurX, this.blurY)
        }})
    };
    U(Eo, "flash.filters.BlurFilter", Ao);
    Eo[I].clone = function () {
        return new Eo(this.blurX, this.blurY, this[Oe])
    };
    var Fo = function (a) {
        var b;
        q[E](this, "matrix", {get: function () {
            return b
        }, set: function (a) {
            b = Z(a, "Array");
            if (b != m)if (20 < b[H])Va(b, 20); else for (; 20 > b[H];)b[y](0); else b = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
        }});
        ta(this, a);
        q[E](this, "__swiffy_v", {get: function () {
            return new Nk(this[Qb])
        }})
    };
    U(Fo, "flash.filters.ColorMatrixFilter", Ao);
    Fo[I].clone = function () {
        return new Fo(this[Qb][Ob](0))
    };
    var Go = function (a, b, c, d, e, g, k, n, v) {
        a = Z(a, "Number", 0);
        b = Z(b, "Number", 0);
        d = Z(d, "Number", 1);
        e = Z(e, "Number", 0);
        g = Z(g, "Boolean", l);
        k = Z(k, "Boolean", l);
        n = Z(n, "uint", 0);
        var A;
        q[E](this, "alpha", {get: function () {
            return A
        }, set: function (a) {
            A = s.min(1, s[Xb](255 * Z(a, "Number", 0)) / 255)
        }});
        eb(this, v);
        W(this, "bias", "Number", e);
        W(this, "clamp", "Boolean", k);
        W(this, "color", "uint", n);
        W(this, "divisor", "Number", d);
        W(this, "matrixX", "Number", a);
        W(this, "matrixY", "Number", b);
        var B = [];
        q[E](this, "matrix", {get: function () {
            return B
        },
            set: function (a) {
                B = Z(a, "Array");
                a = this[Yc] * this[Xc];
                B != m || (B = []);
                if (B[H] > a)Va(B, a); else for (; B[H] < a;)B[y](0)
            }});
        N(c) && ta(this, c);
        W(this, "preserveAlpha", "Boolean", g);
        q[E](this, "__swiffy_v", {get: function () {
            return new Pk(this.bias, this.clamp, this[jc] | 4278190080 * this[Vd], this.divisor, this[Qb], this[Xc], this[Yc], this.preserveAlpha)
        }})
    };
    U(Go, "flash.filters.ConvolutionFilter", Ao);
    Go[I].clone = function () {
        return new Go(this[Xc], this[Yc], this[Qb], this.divisor, this.bias, this.preserveAlpha, this.clamp, this[jc], this[Vd])
    };
    var Io = function (a, b, c, d, e, g, k, n, v) {
        c = Z(c, "uint", 0);
        d = Z(d, "uint", 0);
        e = Z(e, "Number", 0);
        g = Z(g, "Number", 0);
        k = Z(k, "String", "wrap");
        var A;
        q[E](this, "alpha", {get: function () {
            return A
        }, set: function (a) {
            A = s.min(1, s[Xb](255 * Z(a, "Number", 0)) / 255)
        }});
        eb(this, v);
        var B;
        q[E](this, "color", {get: function () {
            return B
        }, set: function (a) {
            B = Z(a, "uint", 0) % 16777216
        }});
        za(this, n);
        W(this, "componentX", "uint", c);
        W(this, "componentY", "uint", d);
        W(this, "mapBitmap", "flash.display.BitmapData", a);
        var P;
        q[E](this, "mapPoint", {get: function () {
            return P
        },
            set: function (a) {
                a = Z(a, "flash.geom.Point", m);
                P = a != m ? new Ho(a.x, a.y) : new Ho(0, 0)
            }});
        this.mapPoint = b;
        W(this, "mode", "String", k);
        W(this, "scaleX", "Number", e);
        W(this, "scaleY", "Number", g)
    };
    U(Io, "flash.filters.DisplacementMapFilter", Ao);
    Io[I].clone = function () {
        return new Io(this.mapBitmap, this.mapPoint, this.componentX, this.componentY, this.scaleX, this.scaleY, this.mode, this[jc], this[Vd])
    };
    var Jo = function () {
    };
    Jo.ma = U(Jo, "flash.filters.DisplacementMapFilterMode");
    q[ic](Jo.ma, {CLAMP: {value: "clamp"}, COLOR: {value: "color"}, IGNORE: {value: "ignore"}, WRAP: {value: "wrap"}});
    var Ko = function (a, b, c, d, e, g, k, n, v, A, B) {
        a = Z(a, "Number", 4);
        b = Z(b, "Number", 45);
        c = Z(c, "uint", 0);
        d = Z(d, "Number", 1);
        e = Z(e, "Number", 4);
        g = Z(g, "Number", 4);
        k = Z(k, "Number", 1);
        n = Z(n, "int", 1);
        v = Z(v, "Boolean", p);
        A = Z(A, "Boolean", p);
        B = Z(B, "Boolean", p);
        var P;
        q[E](this, "alpha", {get: function () {
            return P
        }, set: function (a) {
            P = s.min(1, s[Xb](255 * Z(a, "Number", 0)) / 255)
        }});
        eb(this, d);
        W(this, "angle", "Number", b);
        W(this, "blurX", "Number", e);
        W(this, "blurY", "Number", g);
        var X;
        q[E](this, "color", {get: function () {
            return X
        }, set: function (a) {
            X =
                Z(a, "uint", 0) % 16777216
        }});
        za(this, c);
        W(this, "distance", "Number", a);
        W(this, "hideObject", "Boolean", B);
        W(this, "inner", "Boolean", v);
        W(this, "knockout", "Boolean", A);
        W(this, "quality", "int", n);
        W(this, "strength", "Number", k);
        q[E](this, "__swiffy_v", {get: function () {
            return new Tk(this[Gd], this[jc] | 4278190080 * this[Vd], this[ye], this[je], this[Oe], this.blurX, this.blurY, this[Fb], this[Cd], this[uc])
        }})
    };
    U(Ko, "flash.filters.DropShadowFilter", Ao);
    Ko[I].clone = function () {
        return new Ko(this[ye], this[Gd], this[jc], this[Vd], this.blurX, this.blurY, this[je], this[Oe], this[Cd], this[uc], this[Fb])
    };
    var Lo = function (a, b, c, d, e, g, k, n) {
        c = Z(c, "Number", 6);
        d = Z(d, "Number", 6);
        e = Z(e, "Number", 2);
        g = Z(g, "int", 1);
        k = Z(k, "Boolean", p);
        n = Z(n, "Boolean", p);
        var v;
        q[E](this, "alpha", {get: function () {
            return v
        }, set: function (a) {
            v = s.min(1, s[Xb](255 * Z(a, "Number", 1)) / 255)
        }});
        eb(this, b);
        W(this, "blurX", "Number", c);
        W(this, "blurY", "Number", d);
        var A;
        q[E](this, "color", {get: function () {
            return A
        }, set: function (a) {
            A = Z(a, "uint", 16711680) % 16777216
        }});
        za(this, a);
        W(this, "inner", "Boolean", k);
        W(this, "knockout", "Boolean", n);
        W(this, "quality",
            "int", g);
        W(this, "strength", "Number", e);
        q[E](this, "__swiffy_v", {get: function () {
            return new Tk(0, this[jc] | 4278190080 * this[Vd], 0, this[je], this[Oe], this.blurX, this.blurY, p, this[Cd], this[uc])
        }})
    };
    U(Lo, "flash.filters.GlowFilter", Ao);
    Lo[I].clone = function () {
        return new Lo(this[jc], this[Vd], this.blurX, this.blurY, this[je], this[Oe], this[Cd], this[uc])
    };
    var Mo = function (a, b, c, d, e, g, k, n, v, A, B) {
        a = Z(a, "Number", 4);
        b = Z(b, "Number", 45);
        g = Z(g, "Number", 4);
        k = Z(k, "Number", 4);
        n = Z(n, "Number", 1);
        v = Z(v, "int", 1);
        A = Z(A, "String", "inner");
        B = Z(B, "Boolean", p);
        var P = [];
        q[E](this, "colors", {get: function () {
            return P
        }, set: function (a) {
            P = Z(a, "Array", []);
            N(P) || (P = []);
            for (a = 0; a < P[H]; a++)P[a] = Z(P[a], "uint", 16711680) % 16777216
        }});
        this.colors = c;
        var X = [];
        q[E](this, "alphas", {get: function () {
            return X
        }, set: function (a) {
            X = Z(a, "Array", []);
            N(X) || (X = []);
            a = N(P) ? P[H] : 0;
            for (var b = 0; b < a; b++)X[b] =
                s.min(1, s[Xb](255 * Z(X[b], "Number", 1)) / 255);
            Va(X, a)
        }});
        this.alphas = d;
        var la = [];
        q[E](this, "ratios", {get: function () {
            return la
        }, set: function (a) {
            la = Z(a, "Array", []);
            N(la) || (la = []);
            a = N(P) ? P[H] : 0;
            for (var b = 0; b < a; b++)la[b] = s[Xb](Z(la[b], "Number", 0)), 0 > la[b] ? la[b] = 0 : 255 < la[b] && (la[b] = 255);
            Va(la, a)
        }});
        this.ratios = e;
        W(this, "angle", "Number", b);
        W(this, "blurX", "Number", g);
        W(this, "blurY", "Number", k);
        W(this, "distance", "Number", a);
        W(this, "knockout", "Boolean", B);
        W(this, "quality", "int", v);
        W(this, "strength", "Number",
            n);
        W(this, "type", "String", A)
    };
    U(Mo, "flash.filters.GradientBevelFilter", Ao);
    Mo[I].clone = function () {
        return new Mo(this[ye], this[Gd], this.colors, this.alphas, this.ratios, this.blurX, this.blurY, this[je], this[Oe], this[Uc], this[uc])
    };
    var No = function (a, b, c, d, e, g, k, n, v, A, B) {
        a = Z(a, "Number", 4);
        b = Z(b, "Number", 45);
        g = Z(g, "Number", 4);
        k = Z(k, "Number", 4);
        n = Z(n, "Number", 1);
        v = Z(v, "int", 1);
        A = Z(A, "String", "inner");
        B = Z(B, "Boolean", p);
        var P = [];
        q[E](this, "colors", {get: function () {
            return P
        }, set: function (a) {
            P = Z(a, "Array", []);
            N(P) || (P = []);
            for (a = 0; a < P[H]; a++)P[a] = Z(P[a], "uint", 16711680) % 16777216
        }});
        this.colors = c;
        var X = [];
        q[E](this, "alphas", {get: function () {
            return X
        }, set: function (a) {
            X = Z(a, "Array", []);
            N(X) || (X = []);
            a = N(P) ? P[H] : 0;
            for (var b = 0; b < a; b++)X[b] =
                s.min(1, s[Xb](255 * Z(X[b], "Number", 1)) / 255);
            Va(X, a)
        }});
        this.alphas = d;
        var la = [];
        q[E](this, "ratios", {get: function () {
            return la
        }, set: function (a) {
            la = Z(a, "Array", []);
            N(la) || (la = []);
            a = N(P) ? P[H] : 0;
            for (var b = 0; b < a; b++)la[b] = s[Xb](Z(la[b], "Number", 0)), 0 > la[b] ? la[b] = 0 : 255 < la[b] && (la[b] = 255);
            Va(la, a)
        }});
        this.ratios = e;
        W(this, "angle", "Number", b);
        W(this, "blurX", "Number", g);
        W(this, "blurY", "Number", k);
        W(this, "distance", "Number", a);
        W(this, "knockout", "Boolean", B);
        W(this, "quality", "int", v);
        W(this, "strength", "Number",
            n);
        W(this, "type", "String", A)
    };
    U(No, "flash.filters.GradientGlowFilter", Ao);
    No[I].clone = function () {
        return new No(this[ye], this[Gd], this.colors, this.alphas, this.ratios, this.blurX, this.blurY, this[je], this[Oe], this[Uc], this[uc])
    };
    var Oo = function (a, b, c) {
        a = Z(a, "String");
        b = Z(b, "Boolean", p);
        c = Z(c, "Boolean", p);
        Y(this, "type", a);
        Y(this, "bubbles", b);
        Y(this, "cancelable", c);
        kb(this, 2);
        this.$i = this.Xl = this.El = this.jh = p
    }, Po = U(Oo, "flash.events.Event");
    Oo[I].isDefaultPrevented = function () {
        return this.Xl
    };
    Oo[I].preventDefault = function () {
        this.cancelable && (this.Xl = l)
    };
    db(Oo[I], function () {
        this.jh = l
    });
    Oo[I].stopImmediatePropagation = function () {
        this.jh = this.El = l
    };
    Oo[I].formatToString = function () {
        for (var a = "[" + Xm(this)[Lc], b = 0; b < arguments[H]; b++) {
            var c = this[arguments[b]];
            Ye(c) ? c = s[Nb](100 * c) / 100 : We(c) && (c = '"' + c + '"');
            a += " " + arguments[b] + "=" + c
        }
        return a + "]"
    };
    Ta(Oo[I], function () {
        return this.formatToString("type", "bubbles", "cancelable", "eventPhase")
    });
    q[ic](Po, {ACTIVATE: {value: "activate"}, ADDED: {value: "added"}, ADDED_TO_STAGE: {value: "addedToStage"}, CANCEL: {value: "cancel"}, CHANGE: {value: "change"}, CHANNEL_MESSAGE: {value: "channelMessage"}, CHANNEL_STATE: {value: "channelState"}, CLEAR: {value: "clear"}, CLOSE: {value: "close"}, CLOSING: {value: "closing"}, COMPLETE: {value: "complete"}, CONNECT: {value: "connect"}, CONTEXT3D_CREATE: {value: "context3DCreate"}, COPY: {value: "copy"}, CUT: {value: "cut"}, DEACTIVATE: {value: "deactivate"}, DISPLAYING: {value: "displaying"}, ENTER_FRAME: {value: "enterFrame"},
        EXIT_FRAME: {value: "exitFrame"}, EXITING: {value: "exiting"}, FRAME_CONSTRUCTED: {value: "frameConstructed"}, FRAME_LABEL: {value: "frameLabel"}, FULLSCREEN: {value: "fullScreen"}, HTML_BOUNDS_CHANGE: {value: "htmlBoundsChange"}, HTML_DOM_INITIALIZE: {value: "htmlDOMInitialize"}, HTML_RENDER: {value: "htmlRender"}, ID3: {value: "id3"}, INIT: {value: "init"}, LOCATION_CHANGE: {value: "locationChange"}, MOUSE_LEAVE: {value: "mouseLeave"}, NETWORK_CHANGE: {value: "networkChange"}, OPEN: {value: "open"}, PASTE: {value: "paste"}, PREPARING: {value: "preparing"},
        REMOVED: {value: "removed"}, REMOVED_FROM_STAGE: {value: "removedFromStage"}, RENDER: {value: "render"}, RESIZE: {value: "resize"}, SCROLL: {value: "scroll"}, SELECT: {value: "select"}, SELECT_ALL: {value: "selectAll"}, SOUND_COMPLETE: {value: "soundComplete"}, STANDARD_ERROR_CLOSE: {value: "standardErrorClose"}, STANDARD_INPUT_CLOSE: {value: "standardInputClose"}, STANDARD_OUTPUT_CLOSE: {value: "standardOutputClose"}, SUSPEND: {value: "suspend"}, TAB_CHILDREN_CHANGE: {value: "tabChildrenChange"}, TAB_ENABLED_CHANGE: {value: "tabEnabledChange"},
        TAB_INDEX_CHANGE: {value: "tabIndexChange"}, TEXT_INTERACTION_MODE_CHANGE: {value: "textInteractionModeChange"}, TEXTURE_READY: {value: "textureReady"}, UNLOAD: {value: "unload"}, USER_IDLE: {value: "userIdle"}, USER_PRESENT: {value: "userPresent"}, VIDEO_FRAME: {value: "videoFrame"}, WORKER_STATE: {value: "workerState"}});
    var Qo = function (a, b, c, d, e, g, k, n, v, A, B) {
        Oo[K](this, a, b, c);
        Z(a, "String");
        Z(b, "Boolean", l);
        Z(c, "Boolean", p);
        d = Z(d, "Number", NaN);
        e = Z(e, "Number", NaN);
        g = Z(g, "flash.display.InteractiveObject", m);
        k = Z(k, "Boolean", p);
        n = Z(n, "Boolean", p);
        v = Z(v, "Boolean", p);
        A = Z(A, "Boolean", p);
        B = Z(B, "int", 0);
        W(this, "localX", "Number", d);
        W(this, "localY", "Number", e);
        W(this, "relatedObject", "flash.display.InteractiveObject", g);
        W(this, "ctrlKey", "Boolean", k);
        W(this, "altKey", "Boolean", n);
        W(this, "shiftKey", "Boolean", v);
        W(this, "buttonDown",
            "Boolean", A);
        W(this, "delta", "int", B);
        this.stageY = this.stageX = NaN
    }, Ro = U(Qo, "flash.events.MouseEvent", Oo);
    Ta(Qo[I], function () {
        return this.formatToString("type", "bubbles", "cancelable", "eventPhase", "localX", "localY", "stageX", "stageY", "relatedObject", "ctrlKey", "altKey", "shiftKey", "buttonDown", "delta")
    });
    q[ic](Ro, {CLICK: {value: "click"}, CONTEXT_MENU: {value: "contextMenu"}, DOUBLE_CLICK: {value: "doubleClick"}, MIDDLE_CLICK: {value: "middleClick"}, MIDDLE_MOUSE_DOWN: {value: "middleMouseDown"}, MIDDLE_MOUSE_UP: {value: "middleMouseUp"}, MOUSE_DOWN: {value: "mouseDown"}, MOUSE_MOVE: {value: "mouseMove"}, MOUSE_OUT: {value: "mouseOut"}, MOUSE_OVER: {value: "mouseOver"}, MOUSE_UP: {value: "mouseUp"}, MOUSE_WHEEL: {value: "mouseWheel"}, RIGHT_CLICK: {value: "rightClick"}, RIGHT_MOUSE_DOWN: {value: "rightMouseDown"}, RIGHT_MOUSE_UP: {value: "rightMouseUp"},
        ROLL_OUT: {value: "rollOut"}, ROLL_OVER: {value: "rollOver"}});
    var So = function (a, b, c) {
        Oo[K](this, a, !!b, !!c)
    }, To = U(So, "flash.events.TimerEvent", Oo);
    q[ic](To, {TIMER: {value: "timer"}, TIMER_COMPLETE: {value: "timerComplete"}});
    var Uo = U(un(1001), "flash.events.IEventDispatcher");
    Uo.ma = Uo;
    Uo[I].addEventListener = function () {
    };
    Uo[I].dispatchEvent = function () {
    };
    Uo[I].hasEventListener = function () {
    };
    Uo[I].removeEventListener = function () {
    };
    Uo[I].willTrigger = function () {
    };
    var Vo = function (a, b, c, d, e) {
        Oo[K](this, a, b, c);
        d = Z(d, "String");
        Z(e, "int", 0);
        Y(this, "text", d)
    }, Wo = U(Vo, "flash.events.IOErrorEvent", Oo);
    q[ic](Wo, {IO_ERROR: {value: "ioError"}, STANDARD_ERROR_IO_ERROR: {value: "standardErrorIoError"}, STANDARD_INPUT_IO_ERROR: {value: "standardInputIoError"}, STANDARD_OUTPUT_IO_ERROR: {value: "standardOutputIoError"}});
    Ta(Vo[I], function () {
        return this.formatToString("type", "bubbles", "cancelable", "text")
    });
    var Xo = function (a, b, c, d, e) {
        Oo[K](this, a, b, c);
        d = Z(d, "Number", 0);
        e = Z(e, "Number", 0);
        W(this, "bytesLoaded", "Number", d);
        W(this, "bytesTotal", "Number", e)
    }, Yo = U(Xo, "flash.events.ProgressEvent", Oo);
    q[ic](Yo, {PROGRESS: {value: "progress"}, SOCKET_DATA: {value: "socketData"}, STANDARD_ERROR_DATA: {value: "standardErrorData"}, STANDARD_INPUT_PROGRESS: {value: "standardInputProgress"}, STANDARD_OUTPUT_DATA: {value: "standardOutputData"}});
    Ta(Xo[I], function () {
        return this.formatToString("type", "bubbles", "cancelable", "bytesLoaded", "bytesTotal")
    });
    var Zo = function (a, b, c, d) {
        Oo[K](this, a, b, c);
        d = Z(d, "int", 0);
        W(this, "responseHeaders", "Array", m);
        W(this, "responseURL", "String", m);
        Y(this, "status", d)
    }, $o = U(Zo, "flash.events.HTTPStatusEvent", Oo);
    q[ic]($o, {HTTP_RESPONSE_STATUS: {value: "httpResponseStatus"}, HTTP_STATUS: {value: "httpStatus"}});
    Ta(Zo[I], function () {
        return this.formatToString("type", "bubbles", "cancelable", "eventPhase", "status", "responseURL")
    });
    var ap = function (a, b, c) {
        this.lb = a;
        this.Vi = b;
        this.Uo = c
    }, Tn = function () {
    };
    U(Tn, "flash.events.EventDispatcher", h, [Uo]);
    Tn[I].addEventListener = function (a, b, c, d) {
        this.__swiffy_listeners || q[E](this, "__swiffy_listeners", {value: {}});
        var e = this.__swiffy_listeners, g = e[a];
        g || (e[a] = g = []);
        a = d | 0;
        c = !!c;
        for (d = 0; d < g[H]; ++d)if (g[d].lb == b && g[d].Vi == c)return;
        for (d = g[H]; 0 < d && a > g[d - 1].Uo; --d);
        g[Ie](d, 0, new ap(b, c, a))
    };
    Tn[I].dispatchEvent = function (a) {
        fb(a, this);
        if (!a.$i) {
            for (var b = [], c = this; c = c[$d];)b[y](c);
            kb(a, 1);
            for (c = b[H] - 1; 0 <= c && !a.jh; c--)Aa(a, b[c]), bp(b[c], a, l)
        }
        kb(a, 2);
        Aa(a, this);
        bp(this, a);
        if (!a.$i && a.bubbles) {
            kb(a, 3);
            for (c = 0; c < b[H] && !a.jh; c++)Aa(a, b[c]), bp(b[c], a)
        }
        return!a.isDefaultPrevented()
    };
    var bp = function (a, b, c) {
        if ((a = a.__swiffy_listeners) && a[b[Uc]]) {
            a = a[b[Uc]];
            for (var d = 0; d < a[H] && !b.El; d++)a[d].Vi == !!c && a[d].lb[K](m, b)
        }
    };
    Tn[I].removeEventListener = function (a, b, c) {
        var d = this.__swiffy_listeners;
        if (d && d[a]) {
            a = d[a];
            for (d = 0; d < a[H]; d++)a[d].lb == b && a[d].Vi == !!c && a[Ie](d--, 1)
        }
    };
    Tn[I].hasEventListener = function (a) {
        var b = this.__swiffy_listeners;
        return!!b && !!b[a] && b[a][H]
    };
    Tn[I].willTrigger = function (a) {
        var b = this;
        do if (b.hasEventListener(a))return l; while (b = b[$d]);
        return p
    };
    var cp = function (a, b, c, d, e) {
        Oo[K](this, a, b, c);
        Z(a, "String");
        d = Z(d, "flash.display.InteractiveObject", m);
        e = Z(e, "flash.display.InteractiveObject", m);
        W(this, "contextMenuOwner", "flash.display.InteractiveObject", e);
        W(this, "isMouseTargetInaccessible", "Boolean", p);
        W(this, "mouseTarget", "flash.display.InteractiveObject", d)
    }, dp = U(cp, "flash.events.ContextMenuEvent", Oo);
    q[E](dp, "MENU_ITEM_SELECT", {value: "menuItemSelect"});
    q[E](dp, "MENU_SELECT", {value: "menuSelect"});
    cp[I].clone = function () {
        return new cp(this[Uc], this.bubbles, this.cancelable, this.mouseTarget, this.contextMenuOwner)
    };
    var ep = un(2012);
    ep.ma = U(ep, "flash.external.ExternalInterface");
    Y(ep.ma, "available", p);
    W(ep.ma, "marshallExceptions", "Boolean", p);
    Y(ep.ma, "objectID", "");
    ep.ma.addCallback = function (a, b) {
        Z(a, "String");
        Z(b, "Function")
    };
    gb(ep.ma, function (a) {
        Z(a, "String")
    });
    var fp = function (a, b, c, d, e, g, k, n) {
        a = Z(a, "Number", 1);
        b = Z(b, "Number", 1);
        c = Z(c, "Number", 1);
        d = Z(d, "Number", 1);
        e = Z(e, "Number", 0);
        g = Z(g, "Number", 0);
        k = Z(k, "Number", 0);
        n = Z(n, "Number", 0);
        q[E](this, "__swiffy_v", {writable: l, value: new Fh(a, e, b, g, c, k, d, n)})
    };
    U(fp, "flash.geom.ColorTransform");
    var gp = function (a) {
        return new fp(a.X, a.W, a.V, a.M, a.U, a.T, a.S, a.Y)
    };
    q[E](fp[I], "redMultiplier", {get: function () {
        return this.__swiffy_v.X
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(a, b.U, b.W, b.T, b.V, b.S, b.M, b.Y)
    }});
    q[E](fp[I], "greenMultiplier", {get: function () {
        return this.__swiffy_v.W
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, b.U, a, b.T, b.V, b.S, b.M, b.Y)
    }});
    q[E](fp[I], "blueMultiplier", {get: function () {
        return this.__swiffy_v.V
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, b.U, b.W, b.T, a, b.S, b.M, b.Y)
    }});
    q[E](fp[I], "alphaMultiplier", {get: function () {
        return this.__swiffy_v.M
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, b.U, b.W, b.T, b.V, b.S, a, b.Y)
    }});
    q[E](fp[I], "redOffset", {get: function () {
        return this.__swiffy_v.U
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, a, b.W, b.T, b.V, b.S, b.M, b.Y)
    }});
    q[E](fp[I], "greenOffset", {get: function () {
        return this.__swiffy_v.T
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, b.U, b.W, a, b.V, b.S, b.M, b.Y)
    }});
    q[E](fp[I], "blueOffset", {get: function () {
        return this.__swiffy_v.S
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, b.U, b.W, b.T, b.V, a, b.M, b.Y)
    }});
    q[E](fp[I], "alphaOffset", {get: function () {
        return this.__swiffy_v.Y
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(b.X, b.U, b.W, b.T, b.V, b.S, b.M, a)
    }});
    q[E](fp[I], "color", {get: function () {
        return(this.__swiffy_v.U << 16 | this.__swiffy_v.T << 8 | this.__swiffy_v.S) >>> 0
    }, set: function (a) {
        a = Z(a, "uint");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Fh(0, a >> 16 & 255, 0, a >> 8 & 255, 0, a & 255, b.M, b.Y)
    }});
    wa(fp[I], function (a) {
        a = Z(a, "flash.geom.ColorTransform");
        this.__swiffy_v = this.__swiffy_v.zk(a.__swiffy_v)
    });
    Ta(fp[I], function () {
        return"(redMultiplier=" + this.__swiffy_v.X + ", greenMultiplier=" + this.__swiffy_v.W + ", blueMultiplier=" + this.__swiffy_v.V + ", alphaMultiplier=" + this.__swiffy_v.M + ", redOffset=" + this.__swiffy_v.U + ", greenOffset=" + this.__swiffy_v.T + ", blueOffset=" + this.__swiffy_v.S + ", alphaOffset=" + this.__swiffy_v.Y + ")"
    });
    var Ho = function (a, b) {
        a = Z(a, "Number", 0);
        b = Z(b, "Number", 0);
        W(this, "x", "Number", a);
        W(this, "y", "Number", b)
    }, hp = U(Ho, "flash.geom.Point");
    q[E](Ho[I], "length", {get: function () {
        return s[Mc](this.x * this.x + this.y * this.y)
    }});
    Ho[I].add = function (a) {
        return new Ho(this.x + a.x, this.y + a.y)
    };
    Ho[I].clone = function () {
        return new Ho(this.x, this.y)
    };
    Ho[I].copyFrom = function (a) {
        this.x = a.x;
        this.y = a.y
    };
    ob(hp, function (a, b) {
        return s[Mc]((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
    });
    Ho[I].equals = function (a) {
        return this.x == a.x && this.y == a.y
    };
    hp.interpolate = function (a, b, c) {
        return new Ho(a.x * c + b.x * (1 - c), a.y * c + b.y * (1 - c))
    };
    qb(Ho[I], function (a) {
        a /= this[H];
        this.x *= a;
        this.y *= a
    });
    Ho[I].offset = function (a, b) {
        this.x += a;
        this.y += b
    };
    hp.polar = function (a, b) {
        return new Ho(a * s.cos(b), a * s.sin(b))
    };
    Ho[I].setTo = function (a, b) {
        this.x = a;
        this.y = b
    };
    Ho[I].subtract = function (a) {
        return new Ho(this.x - a.x, this.y - a.y)
    };
    Ta(Ho[I], function () {
        return"(x=" + this.x + ", y=" + this.y + ")"
    });
    var ip = function (a, b, c, d) {
        a = Z(a, "Number", 0);
        b = Z(b, "Number", 0);
        c = Z(c, "Number", 0);
        d = Z(d, "Number", 0);
        W(this, "x", "Number", a);
        W(this, "y", "Number", b);
        W(this, "width", "Number", c);
        W(this, "height", "Number", d)
    };
    U(ip, "flash.geom.Rectangle");
    q[E](ip[I], "top", {get: function () {
        return this.y
    }, set: function (a) {
        this.y = Z(a, "Number")
    }});
    q[E](ip[I], "left", {get: function () {
        return this.x
    }, set: function (a) {
        this.x = Z(a, "Number")
    }});
    q[E](ip[I], "bottom", {get: function () {
        return this.y + this[Ge]
    }, set: function (a) {
        a = Z(a, "Number");
        rb(this, a - this.y)
    }});
    q[E](ip[I], "right", {get: function () {
        return this.x + this[Kb]
    }, set: function (a) {
        a = Z(a, "Number");
        qa(this, a - this.x)
    }});
    q[E](ip[I], "topLeft", {get: function () {
        return new Ho(this.left, this.top)
    }, set: function (a) {
        a = Z(a, "flash.geom.Point");
        this.left = a.x;
        this.top = a.y
    }});
    q[E](ip[I], "bottomRight", {get: function () {
        return new Ho(this[Qe], this[oe])
    }, set: function (a) {
        a = Z(a, "flash.geom.Point");
        this.right = a.x;
        this.bottom = a.y
    }});
    q[E](ip[I], "size", {get: function () {
        return new Ho(this[Kb], this[Ge])
    }, set: function (a) {
        a = Z(a, "flash.geom.Point");
        qa(this, a.x);
        rb(this, a.y)
    }});
    ip[I].clone = function () {
        return new ip(this.x, this.y, this[Kb], this[Ge])
    };
    mb(ip[I], function (a, b) {
        return this.x <= a && this.y <= b && a < this[Qe] && b < this[oe]
    });
    ip[I].containsPoint = function (a) {
        return this[xe](a.x, a.y)
    };
    ip[I].containsRect = function (a) {
        var b = this[Qe], c = this[oe], d = a[Qe], e = a[oe];
        return this.x <= a.x && this.y <= a.y && a.x < b && a.y < c && this.x < d && this.y < e && d <= b && e <= c
    };
    ip[I].copyFrom = function (a) {
        this.x = a.x;
        this.y = a.y;
        qa(this, a[Kb]);
        rb(this, a[Ge])
    };
    ip[I].equals = function (a) {
        return this.x == a.x && this.y == a.y && this[Kb] == a[Kb] && this[Ge] == a[Ge]
    };
    ip[I].inflate = function (a, b) {
        this.x -= a;
        this.y -= b;
        qa(this, this[Kb] + 2 * a);
        rb(this, this[Ge] + 2 * b)
    };
    ip[I].inflatePoint = function (a) {
        this.inflate(a.x, a.y)
    };
    ip[I].intersection = function (a) {
        if (this.intersects(a)) {
            var b = s.max(this.x, a.x), c = s.max(this.y, a.y), d = s.min(this[Qe], a[Qe]);
            a = s.min(this[oe], a[oe]);
            return new ip(b, c, d - b, a - c)
        }
        return new ip
    };
    ip[I].intersects = function (a) {
        return 0 < a[Kb] && 0 < a[Ge] && 0 < this[Kb] && 0 < this[Ge] && a.x < this[Qe] && a.y < this[oe] && a[Qe] > this.x && a[oe] > this.y
    };
    ip[I].isEmpty = function () {
        return 0 >= this[Kb] || 0 >= this[Ge]
    };
    ip[I].offset = function (a, b) {
        this.x += a;
        this.y += b
    };
    ip[I].offsetPoint = function (a) {
        this[cd](a.x, a.y)
    };
    ip[I].setEmpty = function () {
        this.y = this.x = 0;
        qa(this, 0);
        rb(this, 0)
    };
    ip[I].setTo = function (a, b, c, d) {
        this.x = a;
        this.y = b;
        qa(this, c);
        rb(this, d)
    };
    ip[I].union = function (a) {
        if (this.isEmpty())return a.clone();
        if (a.isEmpty())return this.clone();
        var b = s.min(this.x, a.x), c = s.min(this.y, a.y), d = s.max(this[Qe], a[Qe]);
        a = s.max(this[oe], a[oe]);
        return new ip(b, c, d - b, a - c)
    };
    Ta(ip[I], function () {
        return"(x=" + this.x + ", y=" + this.y + ", w=" + this[Kb] + ", h=" + this[Ge] + ")"
    });
    var jp = function (a, b, c, d) {
        this.w = N(d) ? u(d) : 0;
        this.x = N(a) ? u(a) : 0;
        this.y = N(b) ? u(b) : 0;
        this.z = N(c) ? u(c) : 0
    }, kp = U(jp, "flash.geom.Vector3D");
    q[E](jp[I], "lengthSquared", {get: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }});
    q[E](jp[I], "length", {get: function () {
        return s[Mc](this.lengthSquared)
    }});
    q[E](kp, "X_AXIS", {value: new jp(1, 0, 0, 0)});
    q[E](kp, "Y_AXIS", {value: new jp(0, 1, 0, 0)});
    q[E](kp, "Z_AXIS", {value: new jp(0, 0, 1, 0)});
    jp[I].add = function (a) {
        return new jp(this.x + a.x, this.y + a.y, this.z + a.z)
    };
    kp.angleBetween = function () {
        return 0
    };
    jp[I].clone = function () {
        return new jp(this.x, this.y, this.z, this.w)
    };
    jp[I].copyFrom = function (a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        this.w = a.w
    };
    jp[I].crossProduct = function () {
        return new jp
    };
    jp[I].decrementBy = function () {
    };
    ob(kp, function (a, b) {
        return a.subtract(b)[H]
    });
    jp[I].dotProduct = function () {
        return 0
    };
    jp[I].equals = function (a, b) {
        return this.x == a.x && this.y == a.y && this.z == a.z && (!b || this.w == a.w)
    };
    jp[I].incrementBy = function () {
    };
    jp[I].nearEquals = function () {
        return p
    };
    jp[I].negate = function () {
    };
    qb(jp[I], function () {
        return 0
    });
    jp[I].project = function () {
    };
    jp[I].scaleBy = function () {
    };
    jp[I].setTo = function (a, b, c) {
        this.x = u(a);
        this.y = u(b);
        this.z = u(c)
    };
    jp[I].subtract = function (a) {
        return new jp(this.x - a.x, this.y - a.y, this.z - a.z)
    };
    Ta(jp[I], function () {
        return"Vector3D(" + this.x + ", " + this.y + ", " + this.z + ")"
    });
    var lp = function (a, b, c, d, e, g) {
        a = Z(a, "Number", 1);
        b = Z(b, "Number", 0);
        c = Z(c, "Number", 0);
        d = Z(d, "Number", 1);
        e = Z(e, "Number", 0);
        g = Z(g, "Number", 0);
        q[E](this, "__swiffy_v", {writable: l, value: new Ah(a, b, c, d, e, g)})
    };
    U(lp, "flash.geom.Matrix");
    var mp = function (a) {
        a = a.__swiffy_v;
        return a.$d(20 * a.k, 20 * a.l)
    }, np = function (a) {
        return new lp(a.m, a.o, a.d, a.g, a.k / 20, a.l / 20)
    };
    q[E](lp[I], "a", {get: function () {
        return this.__swiffy_v.m
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Ah(a, b.o, b.d, b.g, b.k, b.l)
    }});
    q[E](lp[I], "b", {get: function () {
        return this.__swiffy_v.o
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Ah(b.m, a, b.d, b.g, b.k, b.l)
    }});
    q[E](lp[I], "c", {get: function () {
        return this.__swiffy_v.d
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Ah(b.m, b.o, a, b.g, b.k, b.l)
    }});
    q[E](lp[I], "d", {get: function () {
        return this.__swiffy_v.g
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = new Ah(b.m, b.o, b.d, a, b.k, b.l)
    }});
    q[E](lp[I], "tx", {get: function () {
        return this.__swiffy_v.k
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = b.$d(a, b.l)
    }});
    q[E](lp[I], "ty", {get: function () {
        return this.__swiffy_v.l
    }, set: function (a) {
        a = Z(a, "Number");
        var b = this.__swiffy_v;
        this.__swiffy_v = b.$d(b.k, a)
    }});
    lp[I].clone = function () {
        var a = new lp;
        a.__swiffy_v = this.__swiffy_v;
        return a
    };
    wa(lp[I], function (a) {
        a = Z(a, "flash.geom.Matrix");
        this.__swiffy_v = this.__swiffy_v[ie](a.__swiffy_v)
    });
    lp[I].copyColumnFrom = function (a, b) {
        a = Z(a, "uint");
        b = Z(b, "flash.geom.Vector3D");
        var c = this.__swiffy_v.m, d = this.__swiffy_v.o, e = this.__swiffy_v.d, g = this.__swiffy_v.g, k = this.__swiffy_v.k, n = this.__swiffy_v.l;
        switch (a) {
            case 0:
                c = b.x;
                d = b.y;
                break;
            case 1:
                e = b.x;
                g = b.y;
                break;
            case 2:
                k = b.x;
                n = b.y;
                break;
            default:
                return
        }
        this.__swiffy_v = new Ah(c, d, e, g, k, n)
    };
    lp[I].copyColumnTo = function (a, b) {
        a = Z(a, "uint");
        b = Z(b, "flash.geom.Vector3D");
        switch (a) {
            case 0:
                b.x = this.__swiffy_v.m;
                b.y = this.__swiffy_v.o;
                b.z = 0;
                break;
            case 1:
                b.x = this.__swiffy_v.d;
                b.y = this.__swiffy_v.g;
                b.z = 0;
                break;
            case 2:
                b.x = this.__swiffy_v.k, b.y = this.__swiffy_v.l, b.z = 1
        }
    };
    lp[I].copyFrom = function (a) {
        a = Z(a, "flash.geom.Matrix");
        this.__swiffy_v = a.__swiffy_v
    };
    lp[I].copyRowFrom = function (a, b) {
        a = Z(a, "uint");
        b = Z(b, "flash.geom.Vector3D");
        var c = this.__swiffy_v.m, d = this.__swiffy_v.o, e = this.__swiffy_v.d, g = this.__swiffy_v.g, k = this.__swiffy_v.k, n = this.__swiffy_v.l;
        switch (a) {
            case 0:
                c = b.x;
                e = b.y;
                k = b.z;
                break;
            case 1:
                d = b.x;
                g = b.y;
                n = b.z;
                break;
            default:
                return
        }
        this.__swiffy_v = new Ah(c, d, e, g, k, n)
    };
    lp[I].copyRowTo = function (a, b) {
        a = Z(a, "uint");
        b = Z(b, "flash.geom.Vector3D");
        switch (a) {
            case 0:
                b.x = this.__swiffy_v.m;
                b.y = this.__swiffy_v.d;
                b.z = this.__swiffy_v.k;
                break;
            case 1:
                b.x = this.__swiffy_v.d;
                b.y = this.__swiffy_v.g;
                b.z = this.__swiffy_v.l;
                break;
            case 2:
                b.x = 0, b.y = 0, b.z = 1
        }
    };
    lp[I].createBox = function (a, b, c, d, e) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number", 0);
        d = Z(d, "Number", 0);
        e = Z(e, "Number", 0);
        this.__swiffy_v = Bh.gj(-c).gf(a, b)[Wc](d, e)
    };
    lp[I].createGradientBox = function (a, b, c, d, e) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number", 0);
        d = Z(d, "Number", 0);
        e = Z(e, "Number", 0);
        this.__swiffy_v = Bh.gj(-c).gf(a / 1638.4, b / 1638.4)[Wc](a / 2 + d, b / 2 + e)
    };
    lp[I].deltaTransformPoint = function (a) {
        a = Z(a, "flash.geom.Point");
        return new Ho(this.__swiffy_v.m * a.x + this.__swiffy_v.d * a.y, this.__swiffy_v.o * a.x + this.__swiffy_v.g * a.y)
    };
    lp[I].identity = function () {
        this.__swiffy_v = Bh
    };
    lp[I].invert = function () {
        this.__swiffy_v = this.__swiffy_v.ng()
    };
    lp[I].rotate = function (a) {
        a = Z(a, "Number");
        this.__swiffy_v = this.__swiffy_v.gj(-a)
    };
    lp[I].scale = function (a, b) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        this.__swiffy_v = this.__swiffy_v.gf(a, b)
    };
    lp[I].setTo = function (a, b, c, d, e, g) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number");
        d = Z(d, "Number");
        e = Z(e, "Number");
        g = Z(g, "Number");
        this.__swiffy_v = new Ah(a, b, c, d, e, g)
    };
    lp[I].transformPoint = function (a) {
        a = Z(a, "flash.geom.Point");
        return new Ho(this.__swiffy_v.m * a.x + this.__swiffy_v.d * a.y + this.__swiffy_v.k, this.__swiffy_v.o * a.x + this.__swiffy_v.g * a.y + this.__swiffy_v.l)
    };
    lp[I].translate = function (a, b) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        this.__swiffy_v = this.__swiffy_v[Wc](a, b)
    };
    Ta(lp[I], function () {
        return"(a=" + this.__swiffy_v.m + ", b=" + this.__swiffy_v.o + ", c=" + this.__swiffy_v.d + ", d=" + this.__swiffy_v.g + ", tx=" + this.__swiffy_v.k + ", ty=" + this.__swiffy_v.l + ")"
    });
    var op = function (a) {
        a = Z(a, "flash.display.DisplayObject");
        q[E](this, "__swiffy_d", {value: a.__swiffy_d})
    };
    U(op, "flash.geom.Transform");
    q[E](op[I], "colorTransform", {get: function () {
        return gp(this.__swiffy_d.Oa)
    }, set: function (a) {
        a = Z(a, "flash.geom.ColorTransform");
        var b = this.__swiffy_d;
        b.Db(a.__swiffy_v);
        b.ia();
        b.cf()
    }});
    q[E](op[I], "concatenatedColorTransform", {get: function () {
        return gp(this.__swiffy_d.gc)
    }});
    q[E](op[I], "concatenatedMatrix", {get: function () {
        return np(this.__swiffy_d.Ua())
    }});
    q[E](op[I], "matrix", {get: function () {
        return np(this.__swiffy_d.na())
    }, set: function (a) {
        a = Z(a, "flash.geom.Matrix");
        var b = this.__swiffy_d;
        b[sc](mp(a));
        b.ia()
    }});
    q[E](op[I], "pixelBounds", {get: function () {
        var a = this.__swiffy_d, b = a.Bb().Ec().J();
        b.F(a.Ua());
        return new ip(s[Xb](b.i / 20), s[Xb](b.h / 20), s[Ub]((b.C - b.i) / 20), s[Ub]((b.A - b.h) / 20))
    }});
    var pp = function (a, b) {
        a = Z(a, "Number", 1);
        b = Z(b, "Number", 0);
        W(this, "leftToLeft", "Number", 0);
        W(this, "leftToRight", "Number", 0);
        W(this, "pan", "Number", b);
        W(this, "rightToLeft", "Number", 0);
        W(this, "rightToRight", "Number", 0);
        W(this, "volume", "Number", a)
    };
    U(pp, "flash.media.SoundTransform");
    var qp = U(function () {
    }, "flash.display.CapsStyle");
    Y(qp, "NONE", "none");
    Y(qp, "ROUND", "round");
    Y(qp, "SQUARE", "square");
    var rp = U(function () {
    }, "flash.display.LineScaleMode");
    Y(rp, "HORIZONTAL", "horizontal");
    Y(rp, "NONE", "none");
    Y(rp, "NORMAL", "normal");
    Y(rp, "VERTICAL", "vertical");
    var sp = U(function () {
    }, "flash.display.JointStyle");
    Y(sp, "BEVEL", "bevel");
    Y(sp, "MITER", "miter");
    Y(sp, "ROUND", "round");
    var Vn = function () {
        this.Sa = [];
        W(this, "mask", "flash.display.DisplayObject", m)
    };
    U(Vn, "flash.display.DisplayObject", Tn);
    q[E](Vn[I], "x", {get: function () {
        return this.__swiffy_d.na().k / 20
    }, set: function (a) {
        var b = this.__swiffy_d, c = b.na();
        b[sc](c[Wc](20 * a - c.k, 0));
        b.ia()
    }});
    q[E](Vn[I], "y", {get: function () {
        return this.__swiffy_d.na().l / 20
    }, set: function (a) {
        var b = this.__swiffy_d, c = b.na();
        b[sc](c[Wc](0, 20 * a - c.l));
        b.ia()
    }});
    q[E](Vn[I], "alpha", {get: function () {
        return(256 * this.__swiffy_d.Oa.M | 0) / 256
    }, set: function (a) {
        var b = this.__swiffy_d, c = b.Oa;
        b.Db(new Fh(c.X, c.U, c.W, c.T, c.V, c.S, a, c.Y));
        b.ia()
    }});
    q[E](Vn[I], "visible", {get: function () {
        return this.__swiffy_d.Se
    }, set: function (a) {
        this.__swiffy_d.sm(ga(a))
    }});
    q[E](Vn[I], "rotation", {get: function () {
        return-180 * this.__swiffy_d.Ab()[Gd] / s.PI
    }, set: function (a) {
        var b = this.__swiffy_d;
        ab(b.Ab(), -a * s.PI / 180);
        b.Ee();
        b.ia()
    }});
    q[E](Vn[I], "width", {get: function () {
        return this.__swiffy_d.$a()
    }, set: function (a) {
        var b = this.__swiffy_d;
        b.Nl(u(a));
        b.ia()
    }});
    q[E](Vn[I], "height", {get: function () {
        return this.__swiffy_d.Yh()
    }, set: function (a) {
        var b = this.__swiffy_d;
        b.Ml(u(a));
        b.ia()
    }});
    q[E](Vn[I], "scaleX", {get: function () {
        return this.__swiffy_d.Ab().uc
    }, set: function (a) {
        var b = this.__swiffy_d;
        b.Ab().uc = a;
        b.Ee();
        b.ia()
    }});
    q[E](Vn[I], "scaleY", {get: function () {
        return this.__swiffy_d.Ab().ud
    }, set: function (a) {
        var b = this.__swiffy_d;
        b.Ab().ud = a;
        b.Ee();
        b.ia()
    }});
    q[E](Vn[I], "mouseX", {get: function () {
        var a = this.__swiffy_d, b = a.a.hc.J();
        b.F(a.ic());
        return b.x / 20
    }});
    q[E](Vn[I], "mouseY", {get: function () {
        var a = this.__swiffy_d, b = a.a.hc.J();
        b.F(a.ic());
        return b.y / 20
    }});
    q[E](Vn[I], "root", {get: function () {
        for (var a = this.__swiffy_d; a && !a.dg && a != a.a;)if (a[Ab]())if (a == a.a.oa)break; else a = a[Ab](); else a = m;
        return a ? a.e : m
    }});
    q[E](Vn[I], "parent", {get: function () {
        var a = this.__swiffy_d[Ab]();
        return a ? a.e : m
    }});
    q[E](Vn[I], "name", {get: function () {
        return this.__swiffy_d[yc]()
    }, set: function (a) {
        this.__swiffy_d.Ta(a)
    }});
    q[E](Vn[I], "loaderInfo", {get: function () {
        return this.__swiffy_d.a.G().tj
    }});
    q[E](Vn[I], "stage", {get: function () {
        var a = this.__swiffy_d;
        return this.root ? a.a.e : m
    }});
    q[E](Vn[I], "transform", {get: function () {
        return new op(this)
    }, set: function (a) {
        a = Z(a, "flash.geom.Transform");
        a = a.__swiffy_d;
        var b = this.__swiffy_d;
        b[sc](a.na());
        b.Db(a.Oa);
        b.ia();
        b.cf()
    }});
    q[E](Vn[I], "filters", {get: function () {
        return this.Sa[Ob]()
    }, set: function (a) {
        var b = this.__swiffy_d;
        this.Sa = a;
        for (var c = [], d = 0; d < a[H]; d++) {
            var e = a[d].__swiffy_v;
            c[y](e ? e : new Yk)
        }
        b.Zd(c)
    }});
    var tp = function () {
        Vn[K](this);
        var a = this.__swiffy_d;
        a.Lb = ck[I].Lb;
        a.hf();
        W(this, "focusRect", "Boolean", m)
    };
    U(tp, "flash.display.InteractiveObject", Vn);
    var up = function (a, b, c, d) {
        a = new Qo(a, b, p);
        d.hk && (a.relatedObject = d.hk.e);
        c instanceof Vn && (a.localX = c.mouseX, a.localY = c.mouseY, c = c.__swiffy_d, a.stageX = c.a.hc.x / 20, a.stageY = c.a.hc.y / 20, a.buttonDown = c.a.Td);
        return a
    }, vp = function (a) {
        a = new Oo(a, p, p);
        a.$i = l;
        return a
    }, Un = {};
    Un[64] = ff(vp, Po.ENTER_FRAME);
    Un[2097152] = ff(vp, Po.ADDED_TO_STAGE);
    Un[32] = ff(vp, Po.UNLOAD);
    Un[2048] = ff(up, Ro.CLICK, l);
    Un[4] = ff(up, Ro.MOUSE_UP, l);
    Un[8] = ff(up, Ro.MOUSE_DOWN, l);
    Un[256] = ff(up, Ro.ROLL_OUT, p);
    Un[512] = ff(up, Ro.ROLL_OVER, p);
    var Zn = function () {
        tp[K](this)
    };
    U(Zn, "flash.display.SimpleButton", tp);
    q[E](Zn[I], "__swiffy_definition", {value: new il(0, p, [], [], [])});
    Zn[I].enabled = l;
    Zn[I].useHandCursor = l;
    var wp = function () {
        tp[K](this)
    };
    U(wp, "flash.display.DisplayObjectContainer", tp);
    q[E](wp[I], "__swiffy_definition", {value: new zk(0, 0, m)});
    q[E](wp[I], "numChildren", {get: function () {
        return this.__swiffy_d.$g()
    }});
    wp[I].addChild = function (a) {
        var b = this.__swiffy_d;
        b.Gd(a.__swiffy_d, b.$g())
    };
    wp[I].addChildAt = function (a, b) {
        this.__swiffy_d.Gd(a.__swiffy_d, b | 0)
    };
    mb(wp[I], function (a) {
        return this.__swiffy_d[xe](a.__swiffy_d)
    });
    wp[I].getChildAt = function (a) {
        return(a = this.__swiffy_d.Id(a | 0)) ? a.e : a
    };
    wp[I].getChildByName = function (a) {
        return(a = this.__swiffy_d.eo(a)) ? a.e : a
    };
    wp[I].getChildIndex = function (a) {
        return this.__swiffy_d.Ie(a.__swiffy_d)
    };
    wp[I].removeChild = function (a) {
        this.__swiffy_d.zf(a.__swiffy_d)
    };
    wp[I].removeChildAt = function (a) {
        var b = this.__swiffy_d;
        if (a = b.Id(a | 0))return b.zf(a), a.e
    };
    wp[I].setChildIndex = function (a, b) {
        this.__swiffy_d.Gd(a.__swiffy_d, b | 0)
    };
    wp[I].swapChildren = function (a, b) {
        this.swapChildrenAt(this.getChildIndex(a), this.getChildIndex(b))
    };
    wp[I].swapChildrenAt = function (a, b) {
        var c = this.__swiffy_d, d = c.Id(a | 0), e = c.Id(b | 0);
        d && e && (c.Gd(d, b | 0), c.Gd(e, a | 0))
    };
    var xp = un(2012);
    xp.ma = U(xp, "flash.display.Graphics");
    xp.create = function (a) {
        var b = q[vd](xp[I]);
        q[E](b, "__swiffy_d", {value: a});
        return b
    };
    xp[I].beginBitmapFill = function (a, b, c, d) {
        Z(b, "flash.geom.Matrix", m);
        Z(c, "Boolean", l);
        Z(d, "Boolean", p)
    };
    xp[I].beginFill = function (a, b) {
        a = Z(a, "uint");
        b = 100 * Z(b, "Number", 1);
        this.__swiffy_d.ua("beginFill", [a, b])
    };
    xp[I].beginGradientFill = function (a, b, c, d, e, g, k, n) {
        Z(a, "String");
        Z(b, "Array");
        Z(c, "Array");
        Z(d, "Array");
        Z(e, "flash.geom.Matrix", m);
        Z(g, "String", "pad");
        Z(k, "String", "rgb");
        Z(n, "Number", 0)
    };
    xp[I].beginShaderFill = function (a, b) {
        Z(b, "flash.geom.Matrix", m)
    };
    Ma(xp[I], function () {
        this.__swiffy_d.ua("clear")
    });
    xp[I].copyFrom = function (a) {
        Z(a, "flash.display.Graphics")
    };
    xp[I].cubicCurveTo = function (a, b, c, d, e, g) {
        Z(a, "Number");
        Z(b, "Number");
        Z(c, "Number");
        Z(d, "Number");
        Z(e, "Number");
        Z(g, "Number")
    };
    xp[I].curveTo = function (a, b, c, d) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number");
        d = Z(d, "Number");
        this.__swiffy_d.ua("curveTo", [a, b, c, d])
    };
    xp[I].drawCircle = function (a, b, c) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number");
        this.__swiffy_d.ua("drawEllipse", [a, b, c, c])
    };
    xp[I].drawEllipse = function (a, b, c, d) {
        c = Z(c, "Number") / 2;
        d = Z(d, "Number") / 2;
        a = Z(a, "Number") + c;
        b = Z(b, "Number") + d;
        this.__swiffy_d.ua("drawEllipse", [a, b, c, d])
    };
    xp[I].drawGraphicsData = function () {
    };
    xp[I].drawPath = function (a, b, c) {
        Z(c, "String", "evenOdd")
    };
    xp[I].drawRect = function (a, b, c, d) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number");
        d = Z(d, "Number");
        this.__swiffy_d.ua("drawRect", [a, b, c, d])
    };
    xp[I].drawRoundRect = function (a, b, c, d, e, g) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        c = Z(c, "Number");
        d = Z(d, "Number");
        e = Z(e, "Number");
        g = Z(g, "Number", e);
        this.__swiffy_d.ua("drawRoundRect", [a, b, c, d, e, g])
    };
    xp[I].drawTriangles = function (a, b, c, d) {
        Z(d, "String", "none")
    };
    xp[I].endFill = function () {
        this.__swiffy_d.ua("endFill")
    };
    xp[I].lineBitmapStyle = function (a, b, c, d) {
        Z(b, "flash.geom.Matrix", m);
        Z(c, "Boolean", l);
        Z(d, "Boolean", p)
    };
    xp[I].lineGradientStyle = function (a, b, c, d, e, g, k, n) {
        Z(a, "String");
        Z(b, "Array");
        Z(c, "Array");
        Z(d, "Array");
        Z(e, "flash.geom.Matrix", m);
        Z(g, "String", "pad");
        Z(k, "String", "rgb");
        Z(n, "Number", 0)
    };
    xp[I].lineShaderStyle = function (a, b) {
        Z(b, "flash.geom.Matrix", m)
    };
    xp[I].lineStyle = function (a, b, c, d, e, g, k, n) {
        N(a) && (a = Z(a, "Number"));
        b = Z(b, "uint", 0);
        c = 100 * Z(c, "Number", 1);
        d = Z(d, "Boolean", p);
        e = Z(e, "String", "normal");
        g = Z(g, "String", "null");
        k = Z(k, "String", "null");
        n = Z(n, "Number", 3);
        this.__swiffy_d.ua("lineStyle", [a, b, c, d, e, g, k, n])
    };
    xp[I].lineTo = function (a, b) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        this.__swiffy_d.ua("lineTo", [a, b])
    };
    xp[I].moveTo = function (a, b) {
        a = Z(a, "Number");
        b = Z(b, "Number");
        this.__swiffy_d.ua("moveTo", [a, b])
    };
    var yp = function () {
        Vn[K](this);
        Y(this, "graphics", xp[vd](this.__swiffy_d))
    };
    U(yp, "flash.display.Shape", Vn);
    q[E](yp[I], "__swiffy_definition", {value: {Fb: function (a, b, c) {
        return new Uj(a, c)
    }}});
    var zp = function () {
        tp[K](this);
        var a = this.__swiffy_d;
        a.om(p);
        Y(this, "graphics", xp[vd](a))
    };
    U(zp, "flash.display.Sprite", wp);
    q[E](zp[I], "buttonMode", {set: function (a) {
        this.__swiffy_d.om(ga(a))
    }, get: function () {
        return this.__swiffy_d.ug
    }});
    q[E](zp[I], "soundTransform", {set: function (a) {
        Z(a, "flash.media.SoundTransform")
    }, get: function () {
        return new pp
    }});
    zp[I].useHandCursor = l;
    var Ap = U(function () {
    }, "flash.display.StageAlign");
    Y(Ap, "BOTTOM", "B");
    Y(Ap, "BOTTOM_LEFT", "BL");
    Y(Ap, "BOTTOM_RIGHT", "BR");
    Y(Ap, "LEFT", "L");
    Y(Ap, "RIGHT", "R");
    Y(Ap, "TOP", "T");
    Y(Ap, "TOP_LEFT", "TL");
    Y(Ap, "TOP_RIGHT", "TR");
    var Bp = U(function () {
    }, "flash.display.StageScaleMode");
    Y(Bp, "EXACT_FIT", "exactFit");
    Y(Bp, "NO_BORDER", "noBorder");
    Y(Bp, "NO_SCALE", "noScale");
    Y(Bp, "SHOW_ALL", "showAll");
    var Xn = function () {
        tp[K](this);
        Y(this, "allowsFullScreen", p);
        Y(this, "allowsFullScreenInteractive", p);
        W(this, "autoOrients", "Boolean", p);
        W(this, "color", "uint", 0);
        W(this, "colorCorrection", "String", "default");
        Y(this, "colorCorrectionSupport", "unsupported");
        Y(this, "contentsScaleFactor", 1);
        Y(this, "deviceOrientation", "unknown");
        W(this, "displayState", "String", "normal");
        W(this, "focus", "flash.display.InteractiveObject", m);
        W(this, "fullScreenSourceRect", "flash.geom.Rectangle", m);
        W(this, "mouseLock", "Boolean", p);
        Y(this, "nativeWindow", m);
        Y(this, "orientation", "unknown");
        W(this, "quality", "String", "HIGH");
        W(this, "showDefaultContextMenu", "Boolean", l);
        Y(this, "softKeyboardRect", new ip(0, 0, 0, 0));
        Y(this, "stage3Ds", m);
        W(this, "stageFocusRect", "Boolean", l);
        Y(this, "stageVideos", m);
        Y(this, "supportedOrientations", ["default"]);
        Y(this, "wmodeGPU", p)
    }, Cp = U(Xn, "flash.display.Stage", wp);
    Y(Cp, "supportsOrientationChange", p);
    Xn[I].assignFocus = function (a, b) {
        Z(a, "flash.display.InteractiveObject");
        Z(b, "String")
    };
    Xn[I].invalidate = function () {
    };
    Xn[I].isFocusInaccessible = function () {
        return p
    };
    Xn[I].setAspectRatio = function (a) {
        Z(a, "String")
    };
    Xn[I].setOrientation = function (a) {
        Z(a, "String")
    };
    q[E](Xn[I], "stageWidth", {get: function () {
        var a = this.__swiffy_d;
        return"noScale" == a.Hb ? a.Ff : a.Rd
    }, set: function () {
    }});
    q[E](Xn[I], "stageHeight", {get: function () {
        var a = this.__swiffy_d;
        return"noScale" == a.Hb ? a.Ef : a.Qd
    }, set: function () {
    }});
    q[E](Xn[I], "fullScreenWidth", {get: function () {
        return this.stageWidth
    }});
    q[E](Xn[I], "fullScreenHeight", {get: function () {
        return this.stageHeight
    }});
    q[E](Xn[I], "frameRate", {get: function () {
        return this.__swiffy_d.ui().Kl
    }, set: function (a) {
        Z(a, "Number")
    }});
    q[E](Xn[I], "scaleMode", {get: function () {
        return this.__swiffy_d.Hb
    }, set: function (a) {
        a = Z(a, "String");
        var b = this.__swiffy_d;
        switch (a) {
            case "showAll":
            case "exactFit":
            case "noBorder":
            case "noScale":
                break;
            default:
                f(T(2008, "Property scaleMode"))
        }
        b.pm(a)
    }});
    q[E](Xn[I], "align", {get: function () {
        var a = this.__swiffy_d.Mc, b = "";
        a & 2 && (b += "T");
        a & 8 && (b += "B");
        a & 1 && (b += "L");
        a & 4 && (b += "R");
        return b
    }, set: function (a) {
        a = Z(a, "String");
        this.__swiffy_d.mm(a)
    }});
    var Dp = U(function () {
    }, "flash.text.FontStyle");
    Y(Dp, "BOLD", "bold");
    Y(Dp, "BOLD_ITALIC", "boldItalic");
    Y(Dp, "ITALIC", "italic");
    Y(Dp, "REGULAR", "regular");
    var Ep = U(function () {
    }, "flash.text.FontType");
    Y(Ep, "DEVICE", "device");
    Y(Ep, "EMBEDDED", "embedded");
    Y(Ep, "EMBEDDED_CFF", "embeddedCFF");
    var Fp = function () {
    }, Gp = U(Fp, "flash.text.Font");
    q[E](Fp[I], "fontName", {get: function () {
        var a = this.__swiffy_v;
        return a ? a[G] : m
    }});
    q[E](Fp[I], "fontStyle", {get: function () {
        var a = this.__swiffy_v;
        return a ? a[qd] ? a[dc] ? Dp.BOLD_ITALIC : Dp.BOLD : a[dc] ? Dp.ITALIC : Dp.REGULAR : m
    }});
    q[E](Fp[I], "fontType", {get: function () {
        return!this.__swiffy_v ? m : Ep.EMBEDDED
    }});
    Gp.enumerateFonts = function (a) {
        Z(a, "Boolean", p);
        a = [];
        var b = Mn.a.Cb, c;
        for (c in b)for (var d = b[c], e = 0; e < d[H]; e++) {
            var g = new Fp;
            q[E](g, "__swiffy_v", {value: d[e]});
            a[y](g)
        }
        return a
    };
    Fp[I].hasGlyphs = function (a) {
        a = Z(a, "String");
        var b = this.__swiffy_v;
        if (!b)return p;
        for (var c = 0; c < a[H]; c++)if (!b.Jf(a[$b](c)))return p;
        return l
    };
    Gp.registerFont = function (a) {
        Z(a, "Class");
        f(T(1508, "font"))
    };
    var Hp = U(function () {
    }, "flash.text.TextFieldAutoSize");
    Y(Hp, "CENTER", "center");
    Y(Hp, "LEFT", "left");
    Y(Hp, "NONE", "none");
    Y(Hp, "RIGHT", "right");
    var Ip = U(function () {
    }, "flash.text.TextFieldType");
    Y(Ip, "DYNAMIC", "dynamic");
    Y(Ip, "INPUT", "input");
    var Jp = U(function () {
    }, "flash.text.TextFormatAlign");
    Y(Jp, "CENTER", "center");
    Y(Jp, "END", "end");
    Y(Jp, "JUSTIFY", "justify");
    Y(Jp, "LEFT", "left");
    Y(Jp, "RIGHT", "right");
    Y(Jp, "START", "start");
    var Kp = function (a, b, c, d, e, g, k, n, v, A, B, P, X) {
        a = Z(a, "String", m);
        b = Z(b, "Number", m, l);
        c = Z(c, "Number", m, l);
        d = Z(d, "Boolean", m, l);
        e = Z(e, "Boolean", m, l);
        g = Z(g, "Boolean", m, l);
        k = Z(k, "String", m);
        n = Z(n, "String", m);
        v = Z(v, "String", m);
        A = Z(A, "Number", m, l);
        B = Z(B, "Number", m, l);
        P = Z(P, "Number", m, l);
        X = Z(X, "Number", m, l);
        W(this, "align", "String", v);
        W(this, "blockIndent", "Number", m, l);
        W(this, "bold", "Boolean", d, l);
        W(this, "bullet", "Boolean", m, l);
        W(this, "color", "Number", c, l);
        W(this, "font", "String", a);
        W(this, "indent", "Number", P,
            l);
        W(this, "italic", "Boolean", e, l);
        W(this, "kerning", "Boolean", m, l);
        W(this, "leading", "Number", X, l);
        W(this, "leftMargin", "Number", A, l);
        W(this, "letterSpacing", "Number", m, l);
        W(this, "rightMargin", "Number", B, l);
        W(this, "size", "Number", b, l);
        W(this, "tabStops", "Array", m);
        W(this, "target", "String", n);
        W(this, "underline", "Boolean", g, l);
        W(this, "url", "String", k)
    };
    U(Kp, "flash.text.TextFormat");
    var Yn = function () {
        tp[K](this)
    };
    U(Yn, "flash.text.TextField", tp);
    q[E](Yn[I], "__swiffy_definition", {value: function () {
        var a = new jl(0, m, 12, h);
        a.html = l;
        a.selectable = l;
        Pa(a, new Ih(0, 0, 2E3, 2E3));
        return a
    }()});
    Yn[I].appendText = function (a) {
        var b = this.__swiffy_d;
        b.Jc(b.Wb + Gj(a))
    };
    Yn[I].getTextFormat = function (a, b) {
        var c = this.__swiffy_d, d = new Kp, c = c.Pl(a, b);
        d.align = c[Fe];
        d.blockIndent = c.Ao;
        Ua(d, c[qd]);
        d.bullet = c.Bo;
        za(d, c[jc]);
        oa(d, c[z]);
        d.indent = c[wb];
        ya(d, c[dc]);
        d.kerning = c.Co;
        d.leading = c[Wb];
        d.leftMargin = c[Je];
        d.letterSpacing = c.letterSpacing;
        d.rightMargin = c[$c];
        Za(d, c[Ad]);
        d.tabStops = c.Do;
        fb(d, c[be]);
        d.underline = c.Nc;
        d.url = c.url;
        return d
    };
    Yn[I].setTextFormat = function (a, b, c) {
        var d = this.__swiffy_d, e = new zj;
        e.align = a[Fe];
        e.Ao = a.blockIndent;
        Ua(e, a[qd]);
        e.Bo = a.bullet;
        za(e, a[jc]);
        oa(e, a[z]);
        e.indent = a[wb];
        ya(e, a[dc]);
        e.Co = a.kerning;
        e.leading = a[Wb];
        e.leftMargin = a[Je];
        e.letterSpacing = a.letterSpacing;
        e.rightMargin = a[$c];
        Za(e, a[Ad]);
        e.Do = a.tabStops;
        fb(e, a[be]);
        e.Nc = a.underline;
        e.url = a.url;
        d.ah(e, b, c)
    };
    q[E](Yn[I], "text", {get: function () {
        var a = this.__swiffy_d, b = a.Wb;
        a.Ya && (b = Fj(b, a[D][Pd]));
        return b
    }, set: function (a) {
        var b = this.__swiffy_d;
        b.Ya && (a = Gj(a));
        b.Jc(a, l)
    }});
    q[E](Yn[I], "htmlText", {get: function () {
        var a = this.__swiffy_d, b = a.Wb;
        a.Ya && (b = Hj(w(b)));
        return b
    }, set: function (a) {
        var b = this.__swiffy_d;
        b.ah(xj(4278190080));
        b.Jc(w(a))
    }});
    q[E](Yn[I], "length", {get: function () {
        return this[Lb][H]
    }});
    q[E](Yn[I], "textColor", {get: function () {
        return this.__swiffy_d.km()
    }, set: function (a) {
        this.__swiffy_d.rm(a)
    }});
    q[E](Yn[I], "autoSize", {get: function () {
        return this.__swiffy_d.Yf
    }, set: function (a) {
        switch (a) {
            case "center":
            case "left":
            case "none":
            case "right":
                break;
            default:
                f(T(2008, "Property autoSize"))
        }
        this.__swiffy_d.nm(a)
    }});
    q[E](Yn[I], "selectable", {get: function () {
        return this.__swiffy_d.bi
    }, set: function (a) {
        a = Z(a, "Boolean");
        this.__swiffy_d.qm(a)
    }});
    q[E](Yn[I], "type", {get: function () {
        return this.__swiffy_d.ai ? Ip.INPUT : Ip.DYNAMIC
    }, set: function (a) {
        var b;
        switch (a) {
            case Ip.DYNAMIC:
                b = p;
                break;
            case Ip.INPUT:
                b = l;
                break;
            default:
                f(T(2008, "Property type"))
        }
        this.__swiffy_d.lj(b)
    }});
    var Wn = function () {
        zp[K](this)
    };
    U(Wn, "flash.display.MovieClip", zp);
    Wn[I].addFrameScript = function (a, b) {
        for (var c = 0; c < arguments[H]; c += 2)this.__swiffy_d.Qk[arguments[c]] = arguments[c + 1]
    };
    Sa(Wn[I], function () {
        this.__swiffy_d[nd]()
    });
    Ha(Wn[I], function () {
        this.__swiffy_d[Qc]()
    });
    Wn[I].prevScene = function () {
        this.__swiffy_d.aq()
    };
    Wn[I].nextScene = function () {
        this.__swiffy_d.Xp()
    };
    Wn[I].prevFrame = function () {
        this.__swiffy_d.ej()
    };
    Wn[I].nextFrame = function () {
        this.__swiffy_d.Pf()
    };
    Wn[I].gotoAndStop = function (a, b) {
        var c = this.__swiffy_d;
        c.Sc(c.wd(a, b), p)
    };
    Wn[I].gotoAndPlay = function (a, b) {
        var c = this.__swiffy_d;
        c.Sc(c.wd(a, b), l)
    };
    var Lp = U(function () {
    }, "flash.net.URLLoaderDataFormat");
    Y(Lp, "BINARY", "binary");
    Y(Lp, "TEXT", "text");
    Y(Lp, "VARIABLES", "variables");
    var Mp = function (a) {
        a = Z(a, "flash.net.URLRequest", m);
        W(this, "bytesLoaded", "uint", 0);
        W(this, "bytesTotal", "uint", 0);
        ua(this, h);
        W(this, "dataFormat", "String", Lp.TEXT);
        a && this.load(a)
    };
    U(Mp, "flash.net.URLLoader", Tn);
    Mp[I].close = function () {
    };
    va(Mp[I], function (a) {
        a = Z(a, "flash.net.URLRequest");
        var b = this;
        this[lc](new Oo(Po.OPEN));
        var c = new dk;
        c.Ka = function (a) {
            b.bytesLoaded = 1024;
            b.bytesTotal = 1024;
            b[lc](new Xo(Yo.PROGRESS, p, p, 1024, 1024));
            b[lc](new Zo($o.HTTP_STATUS, p, p, 400));
            ua(b, a);
            b[lc](new Oo(Po.COMPLETE))
        };
        c.vb = function () {
        };
        nk(a.url, m, a[Vc], a[C] ? a[C][od]() : m, c, a.requestHeaders)
    });
    U(function (a) {
        a = Z(a, "String", m);
        W(this, "authenticate", "Boolean", p);
        W(this, "cacheResponse", "Boolean", p);
        W(this, "contentType", "String", m);
        W(this, "data", "Object", m);
        W(this, "digest", "String", "");
        W(this, "followRedirects", "Boolean", p);
        W(this, "idleTimeout", "Number", 0);
        W(this, "manageCookies", "Boolean", p);
        W(this, "method", "String", lo.GET);
        W(this, "url", "String", a);
        W(this, "useCache", "Boolean", p);
        W(this, "userAgent", "String", "");
        Y(this, "requestHeaders", [])
    }, "flash.net.URLRequest");
    var nm = function (a, b) {
        a = Z(a, "String", "");
        b = Z(b, "String", "");
        W(this, "name", "String", a);
        W(this, "value", "String", b)
    };
    U(nm, "flash.net.URLRequestHeader");
    Ta(nm[I], function () {
        return this[G] + ": " + this[cc]
    });
    var Np = function () {
    }, lo = U(Np, "flash.net.URLRequestMethod");
    Y(lo, "DELETE", "DELETE");
    Y(lo, "GET", "GET");
    Y(lo, "HEAD", "HEAD");
    Y(lo, "OPTIONS", "OPTIONS");
    Y(lo, "POST", "POST");
    Y(Np, "PUT", "PUT");
    var Op = function (a) {
        a = Z(a, "String", m);
        a != m && this.decode(a)
    };
    U(Op, "flash.net.URLVariables");
    q[E](Op[I], "decode", {value: function (a) {
        a = Z(a, "String");
        a = hi(a, l);
        var b = q[fd](a);
        b[H] || f(T(2101));
        for (var c = 0; c < b[H]; c++) {
            var d = b[c];
            d[H] || f(T(2101));
            var e = a[d];
            this[d] = 1 == e[H] ? e[0] : e
        }
    }});
    q[E](Op[I], "toString", {value: function () {
        return di(this)
    }});
    var Pp = function (a) {
        a = Z(a, "flash.system.ApplicationDomain", m);
        W(this, "domainMemory", "Object", m);
        Y(this, "parentDomain", a)
    };
    U(Pp, "flash.system.ApplicationDomain");
    Y(Pp, "currentDomain", "");
    Y(Pp, "MIN_DOMAIN_MEMORY_LENGTH", 0);
    Pp[I].getDefinition = function (a) {
        Z(a, "String");
        return m
    };
    Pp[I].getQualifiedDefinitionNames = function () {
        return[]
    };
    Pp[I].hasDefinition = function (a) {
        Z(a, "String");
        return p
    };
    U(function (a, b, c) {
        a = Z(a, "Boolean", p);
        b = Z(b, "flash.system.ApplicationDomain", m);
        c = Z(c, "flash.system.SecurityDomain", m);
        W(this, "allowCodeImport", "Boolean", p);
        W(this, "allowLoadBytesCodeExecution", "Boolean", p);
        W(this, "applicationDomain", "flash.system.ApplicationDomain", b);
        W(this, "checkPolicyFile", "Boolean", a);
        W(this, "imageDecodingPolicy", "String", "");
        W(this, "parameters", "Object", m);
        W(this, "requestedContentParent", "flash.display.DisplayObjectContainer", m);
        W(this, "securityDomain", "flash.system.SecurityDomain",
            c)
    }, "flash.system.LoaderContext");
    var Qp = un(2012);
    Qp.ma = U(Qp, "flash.system.Security");
    W(Qp.ma, "exactSettings", "Boolean", p);
    Y(Qp.ma, "pageDomain", h);
    Y(Qp.ma, "sandboxType", "remote");
    Y(Qp.ma, "LOCAL_TRUSTED", "localTrusted");
    Y(Qp.ma, "LOCAL_WITH_FILE", "localWithFile");
    Y(Qp.ma, "LOCAL_WITH_NETWORK", "localWithNetwork");
    Y(Qp.ma, "REMOTE", "remote");
    Qp.ma.allowDomain = function () {
    };
    Qp.ma.allowInsecureDomain = function () {
    };
    Qp.ma.loadPolicyFile = function (a) {
        Z(a, "String")
    };
    Qp.ma.showSettings = function (a) {
        Z(a, "String", "default")
    };
    var Rp = U(function () {
    }, "flash.system.SecurityDomain");
    Y(Rp, "currentDomain", "");
    var Ln = function () {
        Y(this, "actionScriptVersion", 0);
        Y(this, "applicationDomain", m);
        Y(this, "bytes", m);
        Y(this, "bytesLoaded", 0);
        Y(this, "bytesTotal", 0);
        Y(this, "childAllowsParent", l);
        W(this, "childSandboxBridge", "Object", m);
        Y(this, "content", m);
        Y(this, "contentType", "");
        Y(this, "frameRate", 0);
        Y(this, "height", 0);
        W(this, "isURLInaccessible", "Boolean", p);
        Y(this, "loader", m);
        Y(this, "loaderURL", "");
        Y(this, "parameters", {});
        Y(this, "parentAllowsChild", l);
        W(this, "parentSandboxBridge", "Object", m);
        Y(this, "sameDomain", p);
        Y(this, "sharedEvents", m);
        Y(this, "swfVersion", 0);
        Y(this, "uncaughtErrorEvents", m);
        Y(this, "url", "");
        Y(this, "width", 0)
    };
    U(Ln, "flash.display.LoaderInfo", Tn).getLoaderInfoByDefinition = function (a) {
        Z(a, "Object");
        return m
    };
    var Sp = function () {
        tp[K](this);
        Y(this, "content", m);
        Y(this, "contentLoaderInfo", new Ln);
        Y(this, "uncaughtErrorEvents", m)
    };
    U(Sp, "flash.display.Loader", wp);
    q[E](Sp[I], "__swiffy_definition", {value: function () {
        var a = new zk(0, 0, m);
        a.fh("flash.display.Loader");
        return a
    }()});
    Sp[I].close = function () {
    };
    va(Sp[I], function (a, b) {
        a = Z(a, "flash.net.URLRequest");
        b = Z(b, "flash.system.LoaderContext", m);
        var c = a.url, d = this.contentLoaderInfo, e = this.__swiffy_d, g = new dk;
        g.Ka = function (a, b) {
            e.mc(0) && (e.Fc(0), d[lc](new Oo(Po.UNLOAD)));
            var c = e.a, g = new ii, B = hk(a, c, g);
            d[lc](new Oo(Po.OPEN));
            d[lc](new Xo(Yo.PROGRESS, p, p, 1024, 1024));
            c.Vf(g, function () {
                var a = new ck(B, c, m);
                a.Kj(l);
                a.Hc = l;
                a.Ta(c.af());
                a.Q();
                e.fb(a, 0);
                c.la();
                d[lc](new Oo(Po.INIT));
                d[lc](new Zo($o.HTTP_STATUS, p, p, b));
                d[lc](new Oo(Po.COMPLETE));
                c.la()
            })
        };
        g.vb =
            function () {
            };
        gk(c, e.a, a[Vc], a[C] ? a[C][od]() : m, g, a.requestHeaders)
    });
    Sp[I].loadBytes = function (a, b) {
        Z(a, "flash.utils.ByteArray");
        Z(b, "flash.system.LoaderContext", m)
    };
    Sp[I].loadFilePromise = function (a, b) {
        Z(a, "flash.desktop.IFilePromise");
        Z(b, "flash.system.LoaderContext", m)
    };
    Sp[I].unload = function () {
    };
    Sp[I].unloadAndStop = function (a) {
        Z(a, "Boolean", l)
    };
    var Tp = function () {
    };
    U(Tp, "flash.display.NativeMenu", Tn);
    Tp[I].clone = function () {
        return new Tp
    };
    var Up = function () {
    };
    U(Up, "flash.display.NativeMenuItem", Tn);
    Up[I].clone = function () {
        return new Up
    };
    var Vp = function () {
        W(this, "builtInItems", "flash.ui.ContextMenuBuiltInItems", m);
        W(this, "clipboardItems", "flash.ui.ContextMenuClipboardItems", m);
        W(this, "clipboardMenu", "Boolean", p);
        W(this, "customItems", "Array", []);
        W(this, "link", "flash.net.URLRequest", m)
    }, Wp = U(Vp, "flash.ui.ContextMenu", Tp);
    q[E](Wp, "isSupported", {value: p});
    Vp[I].clone = function () {
        return new Vp
    };
    Vp[I].hideBuiltInItems = function () {
    };
    var Xp = function (a, b, c, d) {
        a = Z(a, "String");
        b = Z(b, "Boolean", p);
        d = Z(d, "Boolean", l);
        W(this, "caption", "String", a);
        W(this, "separatorBefore", "Boolean", b);
        W(this, "visible", "Boolean", d)
    }, Yp = U(Xp, "flash.ui.ContextMenuItem", Up);
    Xp[I].clone = function () {
        return new Xp(this.caption, this.separatorBefore, this.enabled, this.visible)
    };
    Yp.systemClearMenuItem = function () {
        return m
    };
    Yp.systemCopyLinkMenuItem = function () {
        return m
    };
    Yp.systemCopyMenuItem = function () {
        return m
    };
    Yp.systemCutMenuItem = function () {
        return m
    };
    Yp.systemOpenLinkMenuItem = function () {
        return m
    };
    Yp.systemPasteMenuItem = function () {
        return m
    };
    Yp.systemSelectAllMenuItem = function () {
        return m
    };
    var Zp = U(function () {
    }, "flash.utils.Endian");
    q[E](Zp, "BIG_ENDIAN", {value: "bigEndian"});
    q[E](Zp, "LITTLE_ENDIAN", {value: "littleEndian"});
    var $p = function () {
            q[E](this, "bytesAvailable", {get: function () {
                return s.max(0, this[H] - this[ud])
            }});
            q[E](this, "__swiffy_v", {value: m, writable: l});
            var a = Zp.BIG_ENDIAN;
            q[E](this, "endian", {get: function () {
                return a
            }, set: function (b) {
                b == m && f(T(2007, "endian"));
                b == Zp.BIG_ENDIAN || b == Zp.LITTLE_ENDIAN ? a = b : f(T(2008, "Parameter type"))
            }});
            q[E](this, "length", {get: function () {
                var a = this.__swiffy_v;
                return a ? a.byteLength : 0
            }, set: function (a) {
                a = Z(a, "uint");
                if (0 == a)this.__swiffy_v = m; else {
                    var c = this[H];
                    if (c != a) {
                        var d = new ArrayBuffer(a);
                        0 < c && (new Int8Array(d)).set(new Int8Array(this.__swiffy_v, 0, s.min(a, c)));
                        this.__swiffy_v = d
                    }
                }
                Wa(this, s.min(this[ud], a))
            }});
            W(this, "objectEncoding", "uint", 0);
            W(this, "position", "uint", 0);
            W(this, "shareable", "Boolean", p)
        }, aq, bq = U($p, "flash.utils.ByteArray"), cq = function () {
            if (!aq) {
                var a = new ArrayBuffer(4), b = new Int8Array(a);
                (new Int32Array(a))[0] = 513;
                var a = b[0], c = b[1], d = b[2], b = b[3];
                0 == a && 0 == c && 2 == d && 1 == b ? aq = Zp.BIG_ENDIAN : 1 == a && 2 == c && 0 == d && 0 == b ? aq = Zp.LITTLE_ENDIAN : f("Platform endianness detection failed")
            }
            return aq
        },
        dq = function (a, b) {
            b = Z(b, "uint");
            Va(a, s.max(a[ud] + b, a[H]))
        }, eq = function (a, b) {
            b = Z(b, "uint");
            a[H] < a[ud] + b && f(T(2030))
        }, fq = function (a, b, c) {
            eq(a, c);
            var d = a[ud];
            Wa(a, d + c);
            if (1 < c) {
                if (a.endian != cq()) {
                    a = new Int8Array(a.__swiffy_v, d, c);
                    for (var e = new ArrayBuffer(c), d = new Int8Array(e), g = 0; g < c; g++)d[g] = a[c - 1 - g];
                    return(new b(e))[0]
                }
                if (0 != d % c)return e = new ArrayBuffer(c), (new Int8Array(e)).set(new Int8Array(a.__swiffy_v, d, c)), (new b(e))[0]
            }
            return(new b(a.__swiffy_v, d, 1))[0]
        }, gq = function (a, b, c, d) {
            dq(a, c);
            var e = a[ud];
            Wa(a, e + c);
            if (1 < c) {
                if (a.endian != cq()) {
                    var g = new ArrayBuffer(c);
                    (new b(g))[0] = d;
                    a = new Int8Array(a.__swiffy_v, e, c);
                    b = new Int8Array(g);
                    for (g = 0; g < c; g++)a[g] = b[c - 1 - g];
                    return
                }
                if (0 != e % c) {
                    g = new ArrayBuffer(c);
                    b = new b(g);
                    b[0] = d;
                    (new Int8Array(a.__swiffy_v, e)).set(new Int8Array(g));
                    return
                }
            }
            (new b(a.__swiffy_v, e, 1))[0] = d
        }, hq = function (a, b, c) {
            (new Int8Array(a.__swiffy_v))[b] = c
        };
    q[E](bq, "defaultObjectEncoding", {value: 0});
    q[E]($p[I], "__swiffy_proxy", {value: {Ac: function (a) {
        a = a.Sf(1069, this);
        return a >= this[H] ? h : (new Int8Array(this.__swiffy_v))[a]
    }, Md: function (a) {
        return a.Pb() < this[H]
    }, setProperty: function (a, b) {
        var c = a.Sf(1056, this);
        b = Z(b, "int");
        c >= this[H] && Va(this, c + 1);
        hq(this, c, b)
    }}});
    $p[I].atomicCompareAndSwapIntAt = function (a, b, c) {
        a = Z(a, "int");
        b = Z(b, "int");
        c = Z(c, "int");
        var d = this[ud];
        try {
            Wa(this, a);
            var e = this.readInt();
            e == b && (Wa(this, a), this.writeInt(c));
            return e
        } finally {
            Wa(this, d)
        }
    };
    $p[I].atomicCompareAndSwapLength = function (a, b) {
        a = Z(a, "int");
        b = Z(b, "int");
        var c = this[H];
        c == a && Va(this, b);
        return c
    };
    Ma($p[I], function () {
        Va(this, 0)
    });
    $p[I].compress = function (a) {
        Z(a, "String")
    };
    $p[I].deflate = function () {
    };
    $p[I].inflate = function () {
    };
    $p[I].readBoolean = function () {
        return 0 != this.readByte()
    };
    $p[I].readByte = function () {
        eq(this, 1);
        var a = this.position++;
        return(new Int8Array(this.__swiffy_v))[a]
    };
    $p[I].readBytes = function (a, b, c) {
        a = Z(a, "flash.utils.ByteArray");
        b = Z(b, "uint", 0);
        c = Z(c, "uint", this.bytesAvailable);
        eq(this, c);
        Va(a, s.max(a[H], b + c));
        for (var d = 0; d < c; d++)hq(a, b + d, this.readByte())
    };
    $p[I].readDouble = function () {
        return fq(this, Float64Array, 8)
    };
    $p[I].readFloat = function () {
        return fq(this, Float32Array, 4)
    };
    $p[I].readInt = function () {
        return fq(this, Int32Array, 4)
    };
    $p[I].readMultiByte = function (a, b) {
        Z(a, "uint");
        Z(b, "String");
        return""
    };
    $p[I].readObject = function () {
    };
    $p[I].readShort = function () {
        return fq(this, Int16Array, 2)
    };
    $p[I].readUnsignedByte = function () {
        return fq(this, Uint8Array, 1)
    };
    $p[I].readUnsignedInt = function () {
        return fq(this, Uint32Array, 4)
    };
    $p[I].readUnsignedShort = function () {
        return fq(this, Uint16Array, 2)
    };
    $p[I].readUTF = function () {
        return this.readUTFBytes(this.readUnsignedShort())
    };
    $p[I].readUTFBytes = function (a) {
        a = Z(a, "uint");
        if (0 == a)return"";
        eq(this, a);
        for (var b = [], c = 0; c < a; c++)b[y](w[zc](this.readUnsignedByte()));
        return ka(escape(b[Ke]("")))
    };
    $p[I].toJSON = function (a) {
        Z(a, "String");
        return"ByteArray"
    };
    $p[I].uncompress = function (a) {
        Z(a, "String")
    };
    $p[I].writeBoolean = function (a) {
        a = Z(a, "Boolean");
        this.writeByte(a ? 1 : 0)
    };
    $p[I].writeByte = function (a) {
        a = Z(a, "int");
        dq(this, 1);
        hq(this, this.position++, a)
    };
    $p[I].writeBytes = function (a, b, c) {
        a = Z(a, "flash.utils.ByteArray");
        b = Z(b, "uint", 0);
        c = Z(c, "uint", a[H] - b);
        if (0 != c) {
            dq(this, c);
            var d = a.__swiffy_v;
            (new Int8Array(this.__swiffy_v)).set(new Int8Array(d, b > a[H] ? a[H] : b, (b + c > a[H] ? a[H] : b + c) - b), this[ud]);
            Wa(this, this[ud] + c)
        }
    };
    $p[I].writeDouble = function (a) {
        a = Z(a, "Number");
        gq(this, Float64Array, 8, a)
    };
    $p[I].writeFloat = function (a) {
        a = Z(a, "Number");
        gq(this, Float32Array, 4, a)
    };
    $p[I].writeInt = function (a) {
        a = Z(a, "int");
        gq(this, Int32Array, 4, a)
    };
    $p[I].writeMultiByte = function (a, b) {
        Z(a, "String");
        Z(b, "String")
    };
    $p[I].writeObject = function (a) {
        Z(a, "*")
    };
    $p[I].writeShort = function (a) {
        a = Z(a, "int");
        gq(this, Int16Array, 2, a)
    };
    $p[I].writeUnsignedInt = function (a) {
        a = Z(a, "uint");
        gq(this, Uint32Array, 4, a)
    };
    $p[I].writeUTF = function (a) {
        a = Z(a, "String");
        var b = new $p;
        b.writeUTFBytes(a);
        this.writeShort(b[H]);
        this.writeBytes(b)
    };
    $p[I].writeUTFBytes = function (a) {
        a = Z(a, "String");
        a = unescape(aa(a));
        for (var b = 0; b < a[H]; b++)this.writeByte(a[me](b))
    };
    var iq = function () {
        q[E](this, "__swiffy_v", {value: {}})
    };
    U(iq, "flash.utils.Dictionary");
    var jq = 0, kq = function (a, b) {
        this.key = a;
        xa(this, b)
    }, lq = function (a) {
        if (!a.P && !a.uri)switch (a = a[Lc], typeof a) {
            case "object":
                if (a === m)return"_null";
            case "function":
                var b = a.__swiffy_dic_key;
                b || (a.__swiffy_dic_key = b = ++jq);
                return b;
            default:
                return"_" + a
        }
    };
    q[E](iq[I], "toJSON", {value: function (a) {
        return a = Z(a, "String")
    }, writable: l, configurable: l});
    q[E](iq[I], "__swiffy_proxy", {value: {ye: function (a, b) {
        var c = lq(a);
        if (c)return c = (c = this.__swiffy_v[c]) && c[cc], Sn(this, c, b, a);
        f(T(1069, a.Pa(), "flash.utils.Dictionary"))
    }, yb: function (a) {
        return(a = lq(a)) ? delete this.__swiffy_v[a] : p
    }, Ac: function (a) {
        var b = lq(a);
        if (b)return(a = this.__swiffy_v[b]) && a[cc];
        f(T(1069, a.Pa(), "flash.utils.Dictionary"))
    }, Md: function (a) {
        return(a = lq(a)) ? a in this.__swiffy_v : p
    }, Pe: function (a) {
        var b = this.__swiffy_v;
        return b[q[fd](b)[a - 1]].key
    }, Dd: function (a) {
        var b = this.__swiffy_v;
        return++a <
            q[fd](b)[H] ? a : 0
    }, Qe: function (a) {
        var b = this.__swiffy_v;
        return b[q[fd](b)[a - 1]][cc]
    }, setProperty: function (a, b) {
        var c = lq(a);
        c ? this.__swiffy_v[c] = new kq(a[Lc], b) : f(T(1056, a.Pa(), "flash.utils.Dictionary"))
    }}});
    var mq = function (a, b) {
        a = Z(a, "Number");
        b = Z(b, "int", 0);
        this.__swiffy_tid = m;
        W(this, "delay", "Number", a);
        W(this, "repeatCount", "int", b);
        this.running = p;
        this.currentCount = 0
    };
    U(mq, "flash.utils.Timer", Tn);
    hb(mq[I], function () {
        if (!this.running) {
            var a = this;
            this.__swiffy_tid = ba.setInterval(function () {
                a.currentCount++;
                if (!a.repeatCount || a.currentCount <= a.repeatCount)a[lc](new So(To.TIMER, p, p));
                a.currentCount == a.repeatCount && (a[nd](), a[lc](new So(To.TIMER_COMPLETE, p, p)))
            }, this.delay)
        }
        this.running = l
    });
    Sa(mq[I], function () {
        ba.clearTimeout(this.__swiffy_tid);
        this.running = p;
        this.__swiffy_tid = m
    });
    mq[I].reset = function () {
        this[nd]();
        this.currentCount = 0
    };
    var oq = function (a, b, c) {
        q[E](this, "__swiffy_v", {value: a});
        c && nq(this, 0);
        W(this, "fixed", "Boolean", !!b);
        q[E](this, "length", {get: function () {
            return this.__swiffy_v[H]
        }, set: function (a) {
            a = Z(a, "uint");
            this[gc] && f(T(1126));
            var b = this.__swiffy_v[H];
            Va(this.__swiffy_v, a);
            nq(this, b)
        }})
    }, pq = function (a) {
        return a.__swiffy_classdef.__swiffy_v.mh ? 0 : m
    }, nq = function (a, b) {
        for (var c = a.__swiffy_v, d = pq(a); b < c[H]; b++)c[b] = d
    }, qq = function (a, b, c) {
        if (b == m)return pq(a);
        a = a.__swiffy_classdef.__swiffy_v;
        return a[Uc] && (!c || a.mh) ?
            yn(b, a[Uc]) : b
    }, rq = function (a, b) {
        var c = q[vd](a[I]);
        oq[K](c, b || []);
        return c
    };
    Xa(oq, q[vd](ln[I]));
    var sq = function (a, b) {
        var c = function (a) {
            if (on(a, c, p))return a;
            (a == m || q(a) !== a) && f(T(1034, Xm(a), c.__swiffy_name));
            var b = rq(c);
            a instanceof oq && (a = a.__swiffy_v);
            if (Ue(a))for (var g = b.__swiffy_v, k = 0; k < a[H]; k++)g[k] = qq(b, a[k]);
            return b
        };
        q[E](c, "__swiffy_v", {value: {type: a, mh: b}});
        return c
    }, tq = function () {
        return function (a, b) {
            a = Z(a, "uint", 0);
            b = Z(b, "Boolean", p);
            oq[K](this, t(a), b, l)
        }
    }, uq = new Wm("__AS3__.vec", "Vector", p), wq = function (a, b, c, d) {
        d = d || dn[I];
        var e = (new bn(uq)).Rl(a && a.__swiffy_name).Sl(), g = d[e];
        g ||
        (g = tn(tq(), e, {Ne: sq(a, b), Ho: pn, Jl: c ? oq : vq}), d[e] = g);
        return g
    }, xq = function (a, b, c) {
        a = wq(a && dn[I][a], b, l);
        en(uq + "$" + c, a);
        return a
    }, vq = xq(m, p, "object");
    xq("int", l, "int");
    xq("uint", l, "uint");
    xq("Number", l, "double");
    var yq = U(function () {
        f(T(1007))
    }, uq);
    q[E](yq, "__swiffy_type_apply", {value: function (a, b) {
        1 != b[H] && f("PANIC! Wrong number of vector type parameters");
        return wq(b[0], p, p, a)
    }});
    q[E](oq[I], "__swiffy_proxy", {value: {ye: function (a, b) {
        var c = a.Sf(1069, this), d = this.__swiffy_v;
        c >= d[H] && f(T(1125, c, d[H]));
        c = d[c];
        O(c) || f(T(1006));
        return c[L](this, b)
    }, yb: function (a) {
        return!a.Ma(this)
    }, Ac: function (a) {
        a = a.Sf(1069, this);
        var b = this.__swiffy_v;
        a >= b[H] && f(T(1125, a, b[H]));
        return b[a]
    }, Md: function (a) {
        return a.Pb() < this.__swiffy_v[H]
    }, Pe: function (a) {
        return a - 1
    }, Dd: function (a) {
        return++a > this.__swiffy_v[H] ? 0 : a
    }, Qe: function (a) {
        return this.__swiffy_v[a - 1]
    }, setProperty: function (a, b) {
        var c = a.Sf(1056,
            this), d = this.__swiffy_v;
        (c > d[H] || c == d[H] && this[gc]) && f(T(1125, c, d[H]));
        d[c] = qq(this, b)
    }}});
    var zq = function (a, b, c) {
        on(c, a, p) || f(T(1034, Xm(c), a.__swiffy_name));
        b[y][L](b, c.__swiffy_v)
    }, Hq = function (a, b, c, d) {
        if (b != m) {
            b = Z(b, "Function");
            c = c != m ? c : Mn.va;
            for (var e = a.__swiffy_v, g = 0; g < e[H]; g++) {
                var k = e[g], n = b[K](c, k, g, a);
                if (d && d[K](a, n, k))return p
            }
        }
        return l
    }, Iq = function (a, b, c, d) {
        a[gc] && f(T(1126));
        var e = a.__swiffy_v, g = d[H];
        c = [b, c];
        Va(c, c[H] + g);
        c = e[Ie][L](e, c);
        var k = 0;
        try {
            for (; 0 < g; k++, b++, g--)e[b] = qq(a, d[k])
        } finally {
            for (a = pq(a); 0 < g; b++, g--)e[b] = a
        }
        return c
    };
    wa(oq[I], function (a) {
        var b = this.__swiffy_classdef, c = this.__swiffy_v[Ob]();
        if (10 < Mn.a.Ba)for (var d = 0; d < arguments[H]; d++)zq(b, c, arguments[d]); else for (d = arguments[H] - 1; 0 <= d; d--)zq(b, c, arguments[d]);
        return rq(b, c)
    });
    $(oq[I], "concat");
    oq[I].every = function (a, b) {
        return Hq(this, a, b, function (a) {
            return!a
        })
    };
    $(oq[I], "every");
    oq[I].filter = function (a, b) {
        var c = [];
        Hq(this, a, b, function (a, b) {
            a && c[y](b)
        });
        return rq(this.__swiffy_classdef, c)
    };
    $(oq[I], "filter");
    oq[I].forEach = function (a, b) {
        Hq(this, a, b)
    };
    $(oq[I], "forEach");
    oq[I].indexOf = function (a, b) {
        a = qq(this, a, l);
        b = Z(b, "int", 0);
        return this.__swiffy_v[hc](a, b)
    };
    $(oq[I], "indexOf");
    oq[I].join = function (a) {
        a = Z(a, "String", ",");
        return this.__swiffy_v[Ke](a)
    };
    $(oq[I], "join");
    oq[I].lastIndexOf = function (a, b) {
        a = qq(this, a, l);
        b = Z(b, "int", 2147483647);
        return this.__swiffy_v[fe](a, b)
    };
    $(oq[I], "lastIndexOf");
    oq[I].map = function (a, b) {
        var c = [];
        Hq(this, a, b, function (a) {
            c[y](qq(this, a))
        });
        return rq(this.__swiffy_classdef, c)
    };
    $(oq[I], "map");
    oq[I].pop = function () {
        this[gc] && f(T(1126));
        var a = this.__swiffy_v;
        return a[H] ? a.pop() : this.__swiffy_classdef.__swiffy_v.mh ? 0 : h
    };
    $(oq[I], "pop");
    oq[I].push = function (a) {
        var b = this.__swiffy_v;
        Iq(this, b[H], 0, arguments);
        return b[H]
    };
    $(oq[I], "push");
    oq[I].reverse = function () {
        this.__swiffy_v.reverse();
        return this
    };
    $(oq[I], "reverse");
    oq[I].shift = function () {
        this[gc] && f(T(1126));
        var a = this.__swiffy_v;
        return a[H] ? a[Eb]() : this.__swiffy_classdef.__swiffy_v.mh ? 0 : h
    };
    $(oq[I], "shift");
    oq[I].slice = function (a, b) {
        a = Z(a, "int", 0);
        b = Z(b, "int", 16777215);
        return rq(this.__swiffy_classdef, this.__swiffy_v[Ob](a, b))
    };
    $(oq[I], "slice");
    oq[I].some = function (a, b) {
        return!Hq(this, a, b, function (a) {
            return a
        })
    };
    $(oq[I], "some");
    oq[I].sort = function (a) {
        this.__swiffy_v.sort(a);
        return this
    };
    $(oq[I], "sort");
    oq[I].splice = function (a, b, c) {
        a = Z(a, "int");
        b = Z(b, "uint");
        c = t[I][Ob][K](arguments, 2);
        return rq(this.__swiffy_classdef, Iq(this, a, b, c))
    };
    $(oq[I], "splice");
    oq[I].toLocaleString = function () {
        return this[od]()
    };
    oq[I].unshift = function (a) {
        Iq(this, 0, 0, arguments);
        return this.__swiffy_v[H]
    };
    $(oq[I], "unshift");
    Ta(oq[I], function () {
        return this.__swiffy_v[Ke](",")
    });
    var Kq = function (a) {
        this.Dc = q[vd](Jq[I]);
        q[E](this.Dc, "__swiffy_v", {value: this});
        this.parent = a
    };
    M = Kq[I];
    Oa(M, m);
    Ja(M, m);
    M.attributes = m;
    M.children = m;
    xa(M, m);
    M.dh = function (a, b) {
        b[y](this.Cc(a));
        return a
    };
    M.Of = function () {
        return p
    };
    M.$l = function () {
        return!this.Of()
    };
    M.Ie = function () {
        if (this[$d])for (var a = 0; a < this[$d][Hc][H]; a++)if (this[$d][Hc][a] == this)return a;
        return-1
    };
    M.Je = function (a, b) {
        return!b && !a.P && "*" == a[Lc]
    };
    M.aj = function () {
        return p
    };
    M.Nd = function (a) {
        return a
    };
    M.Me = function (a) {
        return a
    };
    M.hj = function (a) {
        return a
    };
    M.ij = function (a) {
        return a
    };
    M.jj = function (a) {
        return a
    };
    var Lq = function (a, b, c) {
        Kq[K](this, a);
        Oa(this, b);
        Ja(this, c);
        this.attributes = [];
        this.children = []
    };
    rk(Lq, Kq);
    M = Lq[I];
    M.gd = "element";
    M.Cc = function (a) {
        var b = [];
        a = this.dh(a, b);
        return Mq(b, a)
    };
    M.dh = function (a, b, c) {
        a = a || this.Of();
        if (!a) {
            for (a = 0; a < this[Hc][H]; a++)this[Hc][a].dh(p, b);
            return p
        }
        c = new Nq(c);
        for (a = 0; a < this[Tc][H]; a++)c.gl(this[Tc][a]);
        var d = c.vl(this[G]), e = "<" + d;
        for (a = 0; a < this[Be][H]; a++)var g = this[Be][a], e = e + (" " + c.vl(g[G]) + '="' + El(g[cc]) + '"');
        e += c.oo();
        if (0 == this[Hc][H])b[y](e + "/>"); else if (1 == this[Hc][H] && "text" == this[Hc][0].gd)b[y](e + ">" + this[Hc][a].Cc(l) + "</" + d + ">"); else {
            g = [];
            for (a = 0; a < this[Hc][H]; a++)this[Hc][a].dh(l, g, c);
            b[y](e + ">");
            b[y](g);
            b[y]("</" + d + ">")
        }
        return l
    };
    M.Of = function () {
        for (var a = 0; a < this[Hc][H]; a++)if (this[Hc][a]instanceof Lq)return l;
        return p
    };
    Ga(M, function (a) {
        a = new Lq(a, this[G], this[Tc][Ob]());
        for (var b = 0; b < this[Be][H]; b++)a[Be][y](this[Be][b][Pc](a));
        for (b = 0; b < this[Hc][H]; b++)a[Hc][y](this[Hc][b][Pc](a));
        return a
    });
    M.Je = function (a) {
        if (a.P)return p;
        if ("*" == a[Lc])return l;
        var b = this[G].__swiffy_v;
        return a[Lc] == b[Lc] && a.uri == b.uri
    };
    M.aj = function (a) {
        for (var b = a.P ? this[Be] : this[Hc], c = 0; c < b[H]; c++)if (b[c].Je(a, p))return l;
        return p
    };
    M.Nd = function (a, b, c) {
        var d = N(c);
        c = (c = d ? c : b.P) ? this[Be] : this[Hc];
        for (var e = 0; e < c[H]; e++) {
            var g = c[e];
            g.Je(b, d) && a[y](g)
        }
        return a
    };
    M.Me = function (a, b, c) {
        if (b.P)for (var d = 0; d < this[Be][H]; d++) {
            var e = this[Be][d];
            e.Je(b, c) && a[y](e)
        }
        for (d = 0; d < this[Hc][H]; d++)e = this[Hc][d], e.Je(b, c) && a[y](e), e.Me(a, b, c);
        return a
    };
    M.hj = function (a) {
        for (var b = 0; b < this[Be][H]; b++)a[y](this[Be][b]);
        return a
    };
    M.ij = function (a) {
        for (var b = 0; b < this[Hc][H]; b++)a[y](this[Hc][b]);
        return a
    };
    M.jj = function (a, b) {
        for (var c = 0; c < this[Hc][H]; c++) {
            var d = this[Hc][c];
            d.gd == b && a[y](d)
        }
        return a
    };
    var Oq = function (a, b, c) {
        Kq[K](this, a);
        Oa(this, b);
        xa(this, c)
    };
    rk(Oq, Kq);
    M = Oq[I];
    M.gd = "attribute";
    M.Cc = function (a) {
        return a ? El(this[cc]) : this[cc]
    };
    Ga(M, function (a) {
        return new Oq(a, this[G], this[cc])
    });
    M.Ie = function () {
        return-1
    };
    M.Je = function (a, b) {
        if ("*" == a[Lc])return l;
        var c = this[G].__swiffy_v;
        return a[Lc] == c[Lc] && (b && !c.uri || a.uri == c.uri)
    };
    var Pq = function (a, b) {
        Kq[K](this, a);
        xa(this, b)
    };
    rk(Pq, Kq);
    Pq[I].gd = "text";
    Pq[I].Cc = function (a) {
        return a ? Dl(this[cc]) : this[cc]
    };
    Ga(Pq[I], function (a) {
        return new Pq(a, this[cc])
    });
    var Qq = function (a, b) {
        Kq[K](this, a);
        xa(this, b)
    };
    rk(Qq, Kq);
    Qq[I].gd = "text";
    Qq[I].Cc = function (a) {
        return a ? "<![CDATA[" + this[cc] + "]]\x3e" : this[cc]
    };
    Ga(Qq[I], function (a) {
        return new Qq(a, this[cc])
    });
    var Rq = function (a, b) {
        if (a instanceof Vm)return a.__swiffy_v;
        a = Z(a, "String", b);
        return new Wm("", a, p)
    }, Sq = function (a) {
        try {
            return a[Hd]()
        } catch (b) {
            switch (b[Uc]) {
                case "tag":
                case "close":
                    f(T(1090));
                case "cdata":
                    f(T(1091));
                case "comment":
                    f(T(1094));
                case "processing_instruction":
                    f(T(1097));
                case "attribute":
                    f(T(1095));
                default:
                    f(T(1088))
            }
        }
    }, Tq = function (a, b) {
        for (var c = new sh, d = 0; d < a[H];) {
            var e = a[d], g = e[G][vc](/^xmlns(?::(.*))?$/);
            g ? (c.set(g[1] || "", e[cc]), a[Ie](d, 1)) : d++
        }
        d = Mn.Xe;
        !b && (d && !c.xc("")) && c.set("",
            d);
        this.ul = c;
        this.Ja = b
    };
    Tq[I].Wi = function (a, b, c) {
        if (!N(c)) {
            var d = b[hc](":");
            c = 0 <= d ? b[re](0, d) : "";
            b = 0 <= d ? b[re](d + 1) : b
        }
        if (a && !c)return ko("", b, l);
        d = this.ul.get(c);
        if (N(d))return ko(d, b, a);
        if (this.Ja)return this.Ja.Wi(a, b, c);
        c && f(T(1083, c, b));
        return ko("", b, p)
    };
    Tq[I].up = function () {
        return this.ul.map(function (a, b) {
            return new Hn(b, a)
        })
    };
    var Uq = function (a, b, c, d) {
        for (var e = c || m, g; g = Sq(a);)switch (g[Uc]) {
            case "tag":
                c = g[Be];
                b = new Tq(c, b);
                for (var k = new Lq(e, b.Wi(p, g[cc]), b.up()), n = 0; n < c[H]; n++) {
                    var v = c[n];
                    k[Be][y](new Oq(k, b.Wi(l, v[G]), v[cc]))
                }
                for (; ;) {
                    c = Uq(a, b, k, g[cc]);
                    if (!c)return k;
                    k[Hc][y](c)
                }
            case "close":
                if (e)return d != g[cc] && f(T(1085, e[G][Lc])), m;
                f(T(1088));
            case "text":
                return new Pq(e || m, g[cc]);
            case "cdata":
                return new Qq(e || m, g[cc])
        }
        if (!c)return m;
        f(T(1085, e[G][Lc]))
    }, Nq = function (a) {
        this.gh = [];
        this.jd = (this.Yi = !N(a)) ? {} : a.jd
    };
    Nq[I].Yo = function () {
        if (!this.Yi) {
            var a = {}, b;
            for (b in this.jd)a[b] = this.jd[b];
            this.jd = a;
            this.Yi = l
        }
    };
    Nq[I].gl = function (a) {
        var b = a.prefix || "", c = a.uri, d = this.jd[c];
        d != b && (d === h && (this.Yo(), this.jd[c] = b), this.gh[y](a))
    };
    Nq[I].vl = function (a) {
        var b = a.uri;
        a = a[Lc];
        if (!b)return a;
        var c = this.jd[b];
        if (!c) {
            for (var c = "", d = 0; c in this.jd; d++)c = w[zc](97 + d / 17576) + w[zc](97 + d / 17576 % 26) + w[zc](97 + d / 676 % 26) + w[zc](97 + d / 26 % 26);
            this.gl(new Hn(c, b))
        }
        return!c ? a : c + ":" + a
    };
    Nq[I].oo = function () {
        for (var a = "", b = 0; b < this.gh[H]; b++) {
            var a = a + " xmlns", c = this.gh[b], d = c.prefix;
            d && (a += ":" + d);
            a += '="' + El(c.uri) + '"'
        }
        this.gh = [];
        return a
    };
    var Mq = function (a, b) {
        b = b && bo.prettyPrinting;
        var c = "";
        if (b)for (var d = bo.prettyIndent; 0 < d; d--)c += " ";
        var e = [], g = function (a, d) {
            for (var v = 0; v < a[H]; v++)if (Ue(a[v]))g(a[v], d + c); else if (b)for (var A = a[v][kc]()[Jd](/\n/), B = 0; B < A[H]; B++)e[y](d + A[B]); else e[y](a[v])
        };
        g(a, "");
        return e[Ke](b ? "\n" : "")
    };
    var Jq = function (a) {
        if (a instanceof Vq)return a = Wq[K](a, 1088), Xq[Pc][K](a);
        if (a instanceof Jq)return Xq[Pc][K](a);
        if (a != m) {
            a = Z(a, "String");
            a = new Il(a, bo.ignoreWhitespace, p);
            var b = Uq(a);
            b || (b = new Pq(m, ""));
            Sq(a) && f(T(1088));
            return b.Dc
        }
        return(new Pq(m, "")).Dc
    }, bo = function (a) {
        return a instanceof Jq ? a : a instanceof Vq ? Wq[K](a, 1088) : new Jq(a)
    };
    tn(Jq, "XML", {Ne: bo, Zi: Jq});
    W(bo, "ignoreComments", "Boolean", l);
    W(bo, "ignoreProcessingInstructions", "Boolean", l);
    W(bo, "ignoreWhitespace", "Boolean", l);
    W(bo, "prettyIndent", "int", 2);
    W(bo, "prettyPrinting", "Boolean", l);
    var Yq = function (a) {
        return 0 == a.Pb() || this.__swiffy_v.aj(a)
    };
    q[E](Jq[I], "__swiffy_proxy", {value: {ye: function (a, b) {
        return Sn(this, Xq[a], b)
    }, yb: function () {
        return p
    }, kh: function (a) {
        a = this.__swiffy_v.Me([], a, p);
        return Zq(a)
    }, Ac: function (a) {
        if (0 == a.Pb())return this;
        a = this.__swiffy_v.Nd([], a);
        return Zq(a)
    }, setProperty: function (a) {
        N(a.Pb()) && f(T(1087))
    }, Md: Yq, Pe: function () {
        return"0"
    }, Dd: function (a) {
        return 0 == a ? 1 : 0
    }, Qe: function () {
        return this
    }}});
    Jq[I].hasOwnProperty = function (a) {
        return Yq[K](this, Rq(a))
    };
    Ta(Jq[I], function () {
        return this.__swiffy_v.Cc(p)
    });
    pa(Jq[I], function () {
        return this
    });
    Jq[I].toJSON = function () {
        return"XML"
    };
    var Xq = {addNamespace: function () {
        return this
    }, appendChild: function (a) {
        Z(a, "Object");
        return this
    }, attribute: function (a) {
        a = Rq(a);
        a = this.__swiffy_v.Nd([], a, l);
        return Zq(a)
    }, attributes: function () {
        var a = this.__swiffy_v.hj([]);
        return Zq(a)
    }, child: function (a) {
        Z(a, "Object");
        return Zq([])
    }, childIndex: function () {
        return this.__swiffy_v.Ie()
    }, children: function () {
        var a = this.__swiffy_v.ij([]);
        return Zq(a)
    }, comments: function () {
        return Zq([])
    }, contains: function (a) {
        Z(a, "XML");
        return p
    }, copy: function () {
        return this.__swiffy_v[Pc](m).Dc
    }};
    bo.defaultSettings = function () {
        return{ignoreComments: l, ignoreProcessingInstructions: l, ignoreWhitespace: l, prettyIndent: 2, prettyPrinting: l}
    };
    Xq.descendants = function (a) {
        a = Rq(a, "*");
        a = this.__swiffy_v.Me([], a, l);
        return Zq(a)
    };
    Xq.elements = function (a) {
        a = Rq(a, "*");
        a = this.__swiffy_v.Nd([], a, p);
        return Zq(a)
    };
    Xq.hasComplexContent = function () {
        return this.__swiffy_v.Of()
    };
    Xq.hasSimpleContent = function () {
        return this.__swiffy_v.$l()
    };
    Xq.inScopeNamespaces = function () {
        return[]
    };
    Xq.insertChildAfter = function (a, b) {
        Z(a, "Object");
        Z(b, "Object")
    };
    Xq.insertChildBefore = function (a, b) {
        Z(a, "Object");
        Z(b, "Object")
    };
    Va(Xq, function () {
        return 1
    });
    Xq.localName = function () {
        var a = this.__swiffy_v[G];
        return a ? a[Lc] : m
    };
    Oa(Xq, function () {
        return this.__swiffy_v[G]
    });
    Xq.namespace = function (a) {
        Z(a, "String", "null");
        return m
    };
    Xq.namespaceDeclarations = function () {
        return[]
    };
    Xq.nodeKind = function () {
        return this.__swiffy_v.gd
    };
    qb(Xq, function () {
        return this
    });
    Xq.parent = function () {
        var a = this.__swiffy_v;
        if (a[$d])return a[$d].Dc
    };
    Xq.prependChild = function (a) {
        Z(a, "Object");
        return this
    };
    Xq.processingInstructions = function (a) {
        Z(a, "String", "*");
        return Zq([])
    };
    Xq.propertyIsEnumerable = function (a) {
        return"0" == Rq(a).Pb()
    };
    Xq.removeNamespace = function (a) {
        Z(a, "Namespace");
        return this
    };
    sa(Xq, function (a, b) {
        Z(a, "Object");
        Z(b, "XML");
        return this
    });
    Xq.setChildren = function (a) {
        Z(a, "Object");
        return this
    };
    Xq.setLocalName = function (a) {
        Z(a, "String")
    };
    Xq.setName = function (a) {
        Z(a, "String")
    };
    Xq.setNamespace = function (a) {
        Z(a, "Namespace")
    };
    bo.setSettings = function (a) {
        Ze(a) || (a = Jq.defaultSettings());
        Xe(a.ignoreComments) && (bo.ignoreComments = a.ignoreComments);
        Xe(a.ignoreProcessingInstructions) && (bo.ignoreProcessingInstructions = a.ignoreProcessingInstructions);
        Xe(a.ignoreWhitespace) && (bo.ignoreWhitespace = a.ignoreWhitespace);
        Ye(a.prettyIndent) && (bo.prettyIndent = a.prettyIndent);
        Xe(a.prettyPrinting) && (bo.prettyPrinting = a.prettyPrinting)
    };
    bo.settings = function () {
        return{ignoreComments: Jq.ignoreComments, ignoreProcessingInstructions: bo.ignoreProcessingInstructions, ignoreWhitespace: Jq.ignoreWhitespace, prettyIndent: Jq.prettyIndent, prettyPrinting: Jq.prettyPrinting}
    };
    ra(Xq, function () {
        var a = this.__swiffy_v.jj([], "text");
        return Zq(a)
    });
    Xq.toXMLString = function () {
        return this.__swiffy_v.Cc(l)
    };
    var Vq = function (a) {
        if (a instanceof Jq)a = [a.__swiffy_v]; else if (a instanceof Vq)a = a.__swiffy_v[Ob](); else if (a == m || "" == a)a = []; else {
            a = Z(a, "String");
            a = new Il(a, bo.ignoreWhitespace, p);
            for (var b, c = []; b = Uq(a);)c[y](b);
            a = c
        }
        return Zq(a)
    }, co = function (a) {
        return a instanceof Vq ? a : new Vq(a)
    };
    tn(Vq, "XMLList", {Ne: co, Zi: Vq});
    var $q = function (a) {
        for (var b = this.__swiffy_v, c = a.Pb() < b[H], d = 0; !c && d < b[H]; d++)c = b[d].aj(a);
        return c
    };
    q[E](Vq[I], "__swiffy_proxy", {value: {ye: function (a, b) {
        var c = ar[a];
        if (O(c))return c[L](this, b);
        c = Xq[a];
        if (O(c)) {
            var d = Wq[K](this, 1086, a);
            return c[L](d, b)
        }
        f(T(1006, "value"))
    }, yb: function () {
        return p
    }, kh: function (a) {
        for (var b = this.__swiffy_v, c = [], d = 0; d < b[H]; d++)b[d].Me(c, a, p);
        return Zq(c)
    }, Ac: function (a) {
        var b = this.__swiffy_v, c = a.Pb();
        if (N(c))return b[c] ? b[c].Dc : h;
        for (var c = [], d = 0; d < b[H]; d++)b[d].Nd(c, a);
        return Zq(c)
    }, setProperty: function (a, b) {
        var c = this.__swiffy_v, d = a.Pb();
        N(d) && (d > c[H] && (d = c[H]), b instanceof
            Jq && (c[d] = b.__swiffy_v))
    }, Md: $q, Pe: function (a) {
        return w(a - 1)
    }, Dd: function (a) {
        return++a > this.__swiffy_v[H] ? 0 : a
    }, Qe: function (a) {
        return this.__swiffy_v[a - 1] ? this.__swiffy_v[a - 1].Dc : h
    }}});
    Vq[I].hasOwnProperty = function (a) {
        return $q[K](this, Rq(a))
    };
    Ta(Vq[I], function () {
        if (ar.hasComplexContent[K](this))return ar.toXMLString[K](this);
        for (var a = this.__swiffy_v, b = [], c = 0; c < a[H]; c++)b[y](a[c].Cc(p));
        return b[Ke]("")
    });
    pa(Vq[I], function () {
        return this
    });
    Vq[I].toJSON = function () {
        return"XMLList"
    };
    var ar = {attribute: function (a) {
            a = Rq(a);
            for (var b = this.__swiffy_v, c = 0; c < b[H]; c++)b[c].Nd([], a, l);
            return Zq([])
        }, attributes: function () {
            for (var a = [], b = this.__swiffy_v, c = 0; c < b[H]; c++)b[c].hj(a);
            return Zq(a)
        }, child: function (a) {
            Z(a, "Object");
            return Zq([])
        }, children: function () {
            for (var a = this.__swiffy_v, b = [], c = 0; c < a[H]; c++)a[c].ij(b);
            return Zq(b)
        }, comments: function () {
            return Zq([])
        }, contains: function (a) {
            Z(a, "XML");
            return p
        }, copy: function () {
            return Zq([])
        }, descendants: function (a) {
            a = Rq(a, "*");
            for (var b = this.__swiffy_v,
                     c = [], d = 0; d < b[H]; d++)b[d].Me(c, a, l);
            return Zq(c)
        }, elements: function (a) {
            a = Rq(a, "*");
            for (var b = this.__swiffy_v, c = [], d = 0; d < b[H]; d++)b[d].Nd(c, a, p);
            return Zq(c)
        }, hasComplexContent: function () {
            var a = this.__swiffy_v;
            if (0 == a[H])return p;
            if (1 == a[H])return a[0].Of();
            for (var b = 0; b < a[H]; b++)if ("element" == a[b].gd)return l;
            return p
        }, hasSimpleContent: function () {
            var a = this.__swiffy_v;
            if (0 == a[H])return l;
            if (1 == a[H])return a[0].$l();
            for (var b = 0; b < a[H]; b++)if ("element" == a[b].gd)return p;
            return l
        }, length: function () {
            return this.__swiffy_v[H]
        },
            normalize: function () {
                return Zq([])
            }, parent: function () {
                var a = this.__swiffy_v;
                if (a[H]) {
                    for (var b = a[0][$d], c = 1; b && c < a[H]; c++)if (a[c][$d] != b)return;
                    return b ? b.Dc : h
                }
            }, processingInstructions: function (a) {
                Z(a, "String", "*");
                return Zq([])
            }, propertyIsEnumerable: function (a) {
                var b = this.__swiffy_v;
                return Rq(a).Pb() < b[H]
            }, text: function () {
                for (var a = this.__swiffy_v, b = [], c = 0; c < a[H]; c++)a[c].jj(b, "text");
                return Zq(b)
            }, toXMLString: function () {
                for (var a = this.__swiffy_v, b = [], c = 0; c < a[H]; c++)b[y](a[c].Cc(l));
                return b[Ke]("\n")
            }},
        Zq = function (a) {
            var b = q[vd](Vq[I]);
            q[E](b, "__swiffy_v", {value: a});
            return b
        }, Wq = function (a, b) {
            var c = this.__swiffy_v;
            if (1 == c[H])return c[0].Dc;
            f(T[L](m, arguments))
        };
    var br = function () {
    };
    U(br, "flash.utils.Proxy");
    en("flash.utils.flash_proxy", new Hn(h, "http://www.adobe.com/2006/actionscript/flash/proxy"));
    en(Um("http://www.adobe.com/2006/actionscript/flash/proxy", "isAttribute"), function (a) {
        return a instanceof Vm && a.__swiffy_v.P
    });
    var cr = function (a) {
        var b = a[Lc];
        return a.P || a.uri || !Ye(b) ? new Vm(a) : w(b)
    };
    q[E](br[I], "__swiffy_proxy", {value: {ye: function (a, b) {
        a = cr(a);
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "callProperty")][L](this, [a][Zb](b))
    }, yb: function (a) {
        a = cr(a);
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "deleteProperty")][K](this, a)
    }, kh: function (a) {
        a = cr(a);
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "getDescendants")][K](this, a)
    }, Ac: function (a) {
        a = cr(a);
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy",
            "getProperty")][K](this, a)
    }, Md: function (a) {
        a = a.Pa();
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "hasProperty")][K](this, a)
    }, Pe: function (a) {
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "nextName")][K](this, Z(a, "int"))
    }, Dd: function (a) {
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "nextNameIndex")][K](this, Z(a, "int"))
    }, Qe: function (a) {
        return this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "nextValue")][K](this, Z(a, "int"))
    },
        setProperty: function (a, b) {
            a = cr(a);
            this[Um("http://www.adobe.com/2006/actionscript/flash/proxy", "setProperty")][K](this, a, b)
        }}});
    var dr = function (a, b) {
        q[E](br[I], Um("http://www.adobe.com/2006/actionscript/flash/proxy", a), {value: function () {
            f(T(b, a))
        }})
    };
    dr("callProperty", 2090);
    dr("deleteProperty", 2092);
    dr("getDescendants", 2093);
    dr("getProperty", 2088);
    dr("hasProperty", 2091);
    dr("setProperty", 2089);
    dr("nextNameIndex", 2105);
    dr("nextName", 2106);
    dr("nextValue", 2107);
})()