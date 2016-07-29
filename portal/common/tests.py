# -*- coding: utf-8 -*-
from common.forms import NewContactForm
from django.http import QueryDict
from django.test import TestCase, RequestFactory
from common.views import contact_form


def get_capcha(riddle_number, number_to_skip):
    transform = {
        'pierwszej': 0,
        'drugiej': 1,
        'trzeciej': 2,
        'czwartej': 3,
        'piątej': 4,
        'szóstej': 5,
    }
    to_skip = transform[number_to_skip]
    result = ""
    for i in range(6):
        if to_skip != i:
            result += riddle_number[i]
    return result


class CommonUtilsTestHelper(object):

    email = "test@test.com"
    message_type = 0
    message = 'MORE ADVANCED TEST MESSAGE'
    browser = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:22.0) Gecko/20100101 Firefox/22.0'
    html_code = 200
    win_height = 316
    win_width = 684

    def create_sample_post_dictionary(self, response_get):
        string_response = response_get.content

        pos1 = string_response.find("Przepisz liczbę ")
        riddle_number = string_response[pos1+17:pos1+23]

        pos2 = string_response.find("<b>")
        pos3 = string_response.find("</b>", pos2)
        number_to_skip = string_response[pos2+3:pos3]
        deriddle = get_capcha(riddle_number, number_to_skip)

        pos1 = string_response.find("csrfmiddlewaretoken")
        pos2 = string_response.find("value=", pos1)
        position_begin = string_response.find("\'", pos2) + 1
        position_end = string_response.find("\'", position_begin)
        csrf_token = string_response[position_begin:position_end]

        riddle_dict_string = 'riddle='+deriddle
        query_dict = QueryDict(riddle_dict_string, mutable=True)
        query_dict.update({'width_of_browser': self.win_width})
        query_dict.update({'height_of_browser': self.win_height})
        query_dict.update({'md_module_id': ''})
        query_dict.update({'md_collection_id': ''})
        query_dict.update({'email': self.email})
        query_dict.update({'user_agent': self.browser})
        query_dict.update({'csrfmiddlewaretoken': csrf_token})
        query_dict.update({'message_type': self.message_type})
        query_dict.update({'message': self.message})
        return query_dict


class CommonUtilsTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_contact_form_response_status(self):
        request = self.factory.get('/common/contactForm')
        get_response = contact_form(request)
        assert get_response.status_code == 200, 'invalid response from GET request in common form: status %s' % get_response.status_code

        test_helper = CommonUtilsTestHelper()
        request.POST = test_helper.create_sample_post_dictionary(get_response)

        post_response = contact_form(request)
        assert post_response.status_code == 200, 'invalid response from POST response in common form: status %s' % post_response.status_code

    def test_contact_form_valid(self):
        request = self.factory.get('/common/contactForm')
        get_response = contact_form(request)
        test_helper = CommonUtilsTestHelper()
        request.POST = test_helper.create_sample_post_dictionary(get_response)
        assert get_response.status_code == 200, 'invalid response form GET request in common form: status %s' % get_response.status_code

        form = NewContactForm(request.POST)
        assert form.is_valid(), 'invalid contact form: %s' % form.is_valid()


# class CommonUtilsTest(CommonUtilsTestHelper, TestCase):
#     fixtures = ['common_fixture.json']

#     #This group of tests checks behavior of the system in case of
#     #    valid and complete requests

#     def test_view_contact_form(self):
#         resp = self.client.get(reverse('common.views.contact_form'))
#         self.assertEqual(resp.status_code, 200)
