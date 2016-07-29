import xml.etree.ElementTree as ET

def namespace_tag(tag, namespace):
    return str(ET.QName(namespace, tag))

class Namespace(object):
    def __init__(self, url, prefix, register=True):
        self.url = url
        self.prefix = prefix
        if register:
            self.register()


    def __call__(self, tag):
        return namespace_tag(tag, self.url)

    def register(self):
        ET.register_namespace(self.prefix, self.url)
        return self

NS_EP = Namespace('http://epodreczniki.pl/', 'ep')
NS_MD = Namespace('http://cnx.rice.edu/mdml', 'md')
NS_COLXML = Namespace('http://cnx.rice.edu/collxml', 'col')
NS_CNXML = Namespace('http://cnx.rice.edu/cnxml', 'cn')
NS_CNXSI = Namespace('http://cnx.rice.edu/system-info', 'cnxsi')

NS_MML = Namespace('http://www.w3.org/1998/Math/MathML', 'mml')
NS_QML = Namespace('http://cnx.rice.edu/qml/1.0', 'q')
NS_BIB = Namespace('http://bibtexml.sf.net/', 'bib')
NS_EDITOR = Namespace('http://epodreczniki.pl/editor', 'epe')

