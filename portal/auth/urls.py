from django.conf import settings
from django.conf.urls import patterns, url
from django.contrib.auth.views import password_reset, password_reset_done, password_reset_confirm, \
    password_reset_complete

urlpatterns = patterns('auth.views',
                       url(r'^login$', 'epo_login'),
                       url(r'^logout$', 'epo_logout'),
                       url(r'^external_login/(?P<provider>[\w-]+)$', 'epo_external_login'),
                       url(r'^profile$', 'profile'),
                       url(r'^user_ping$', 'user_ping'),
                       url(r'^registration/feedback$', 'registration_feedback'),
                       url(r'^registration/activate/renew$', 'renew_activation_email',
                           name='auth-resend-activation-email'),
                       url(r'^registration/activate/(?P<guid>[\d\w-]+)$', 'activate_user', name='auth-activate-user'),
                       url(r'^exists$', 'user_exists'),
                       url(r'^update$', 'update_user'),
                       url(r'^agreement$', 'agreement'),
                       )

urlpatterns += patterns('',
                        url(r'^password/reset_done$', password_reset_done, {
                            'template_name': 'password_reset/password_reset_done.html'
                        }, name='auth-user-password-reset-done'),
                        url(r'^password/reset_complete$', password_reset_complete,
                            {'template_name': 'password_reset/password_reset_complete.html'},
                            name='auth-user-password-reset-complete'),

                        )


if settings.EPO_REGISTRATION_FORM_TYPE == 'native':
    urlpatterns += patterns('auth.views',
                            url(r'^registration/create$', 'register_user_django', name='auth-register-user'),
                            )
    urlpatterns += patterns('',
                            url(r'^password/reset$', password_reset, {'post_reset_redirect': password_reset_done,
                                                                      'template_name': 'password_reset/password_reset_form.html',
                                                                      'email_template_name': 'password_reset/password_reset_email.html',
                                                                      },
                                name='auth-user-password-reset'),
                            url(r'^password/reset_done$', password_reset_done, {
                                'template_name': 'password_reset/password_reset_done.html'
                            },
                                name='auth-user-password-reset-done'),
                            url(r'^password/reset_confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})$', password_reset_confirm,
                                {'template_name': 'password_reset/password_reset_confirm.html',
                                 'post_reset_redirect': password_reset_complete},
                                name='auth-user-password-reset-confirm'),
                            url(r'^password/reset_complete$', password_reset_complete,
                                {'template_name': 'password_reset/password_reset_complete.html'},
                                name='auth-user-password-reset-complete'),
                            )
