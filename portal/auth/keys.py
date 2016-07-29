from surround.django.utils import CacheKey

oidc = CacheKey('oidc')
oidc_user = oidc + 'user:{user_id}'

oidc_admin_grant = oidc + 'admin_grant:{user_id}'
