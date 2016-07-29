from __future__ import absolute_import
from surround.common.git_info import GitInfo as SurroundGitInfo
from os.path import dirname
from os.path import join

class GitInfo(SurroundGitInfo):

    repo_path = dirname(dirname(__file__))
    dump_path = join(dirname(__file__), 'git_info.pickled')

    def fetch_instance_version_hash(self, portal_domain):
        import requests
        import requests.exceptions
        try:
            url = 'http://www.' + portal_domain + '/common/version'
            v = requests.get(url, timeout=1)
            v.raise_for_status()
            return v.content
        except requests.exceptions.RequestException as e:
            return None
