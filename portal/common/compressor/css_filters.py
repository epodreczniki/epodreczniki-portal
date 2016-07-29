from compressor.filters.css_default import *
import os

class NewCssAbsoluteFilter(CssAbsoluteFilter):

    def input(self, filename=None, basename=None, **kwargs):
        if filename is not None:
            filename = os.path.normcase(os.path.abspath(filename))
        if (not (filename and filename.startswith(self.root)) and
                not self.find(basename)):
            return self.content
        self.path = basename.replace(os.sep, '/')
        self.path = self.path.lstrip('/')
        if self.url.startswith(('http://', 'https://')):
            self.has_scheme = True
            parts = self.url.split('/')
            self.url = '/'.join(parts[2:])
            self.url_path = '/%s' % '/'.join(parts[3:])
            self.protocol = '%s/' % '/'.join(parts[:2])
            self.host = parts[2]
        self.directory_name = self.url
        return SRC_PATTERN.sub(self.src_converter,
            URL_PATTERN.sub(self.url_converter, self.content))
