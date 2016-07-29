# -.- coding: utf-8 -.-


class KzdCategory:
    key = None
    label = None
    css_class = None

    def __init__(self, key, label, css_class):
        self.key = key
        self.label = label
        self.css_class = css_class

    def __str__(self):
        return "KzdCategory('%s')" % self.key


# this is an internal variable, use KZD_CATEGORIES outside of this file
_KZD_CATEGORY_LIST = [
    KzdCategory(u'podręczniki', u'Podręczniki', u'podreczniki'),
    KzdCategory(u'multimedia edukacyjne', u'Multimedia edukacyjne', u'multimedia-edukacyjne'),
    KzdCategory(u'poradniki dla nauczycieli', u'Poradniki dla nauczycieli', u'poradniki-dla-nauczycieli'),
    KzdCategory(u'mapy', u'Mapy', u'mapy'),
    KzdCategory(u'programy nauczania', u'Programy nauczania', u'programy-nauczania'),
    KzdCategory(u'karty pracy', u'Karty pracy', u'karty-pracy'),
    KzdCategory(u'scenariusze lekcji', u'Scenariusze lekcji', u'scenariusze-lekcji'),
    KzdCategory(u'lektury szkolne', u'Lektury szkolne', u'lektury-szkolne'),
    KzdCategory(u'zdjęcia i ilustracje', u'Zdjęcia i ilustracje', u'zdjecia-i-ilustracje'),
    KzdCategory(u'czcionka pisanka szkolna', u'Czcionka', u'czcionka'),
    KzdCategory(u'nagrania edukacyjne', u'Nagrania edukacyjne', u'nagrania-edukacyjne'),
    KzdCategory(u'generator kart pracy', u'Generator kart pracy', u'generator-kart-pracy'),
    KzdCategory(u'gry edukacyjne', u'Gry edukacyjne', u'gry-edukacyjne'),
    KzdCategory(u'e-learning', u'E-learning', u'e-learning'),
    KzdCategory(u'testy i sprawdziany', u'Testy i sprawdziany', u'testy-i-sprawdziany'),
    KzdCategory(u'wirtualne wycieczki', u'Wirtualne wycieczki', u'wirtualne-wycieczki'),
    KzdCategory(u'prezentacje', u'Prezentacje', u'prezentacje'),
    KzdCategory(u'olimpiady', u'Olimpiady', u'olimpiady'),
    KzdCategory(u'nasz elementarz', u'Nasz Elementarz I-III z obudową dydaktyczną', u'nasz-elementarz'),
    KzdCategory(u'układ okresowy pierwiastków', u'Układ okresowy pierwiastków', u'uklad-okresowy-pierwiastkow'),
    KzdCategory(u'podstawa programowa', u'Podstawa programowa', u'podstawa-programowa'),
    KzdCategory(u'zabytki architektury europejskiej', u'Zabytki architektury europejskiej', u'zabytki-architektury-europejskiej'),
    KzdCategory(u'promocja e-podręczników', u'Promocja e-podręczników', u'promocja-epodrecznikow'),
    KzdCategory(u'doświadczenia', u'Doświadczenia', u'doswiadczenia'),
    KzdCategory(u'materiały filmowe wos', u'Warsztaty WOS', u'materialy-filmowe-wos'),
]


KZD_CATEGORIES = { category.key: category for category in _KZD_CATEGORY_LIST }

