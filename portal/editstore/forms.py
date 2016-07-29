# coding: utf-8
from __future__ import absolute_import

from django import forms
from django.forms import widgets
import django.shortcuts
from django.core.validators import MinLengthValidator
from . import models
from editstore.exceptions import WrongIdentifierException
from editstore.utils import get_style

class CascadeForm(forms.Form):
    style = 'operation'
    success_message = 'Wykonano'
    template = 'editres/cascade_form.html'
    description_text = 'Operacja'
    estimated_time = 1.0

    @property
    def style_glyph(self):
        return get_style(self.style).glyph

    @property
    def style_button(self):
        return get_style(self.style).button

    def __init__(self, request, arguments, *args, **kwargs):
        if arguments:
            super(CascadeForm, self).__init__(arguments, *args, **kwargs)
        else:
            super(CascadeForm, self).__init__(*args, **kwargs)


class EmptyCascadeForm(CascadeForm):

    hidden = forms.CharField(widget=widgets.HiddenInput, initial='hidden', required=False)


class RenameWizardForm(CascadeForm):

    style = 'rename'

    description_text = 'Przenieś'
    estimated_time = 4.0

    repository_name = forms.ChoiceField()

    def __init__(self, request, arguments, driver, *args, **kwargs):
        super(RenameWizardForm, self).__init__(request, arguments, *args, **kwargs)

        import repo
        from . import objects

        driver_class = objects.drivers.get(driver.category)
        self.fields['repository_name'] = forms.ChoiceField(label='Repozytorium', choices=[(repository.name, repository.config['info']['description']) for repository in repo.repositories.values() if driver.category in repository.can_create_new_objects_lines], initial=driver.repository.name)
        self.initial['repository_name'] = driver.repository.name


class CreateForm(CascadeForm):

    style = 'new'
    description_text = 'Utwórz obiekt'
    estimated_time = 2.0


    repository_name = forms.ChoiceField()
    template_name = forms.ChoiceField()

    def __init__(self, request, arguments, space_driver, category, *args, **kwargs):
        super(CreateForm, self).__init__(request, arguments, *args, **kwargs)
        import repo
        from . import objects

        driver_class = objects.drivers.get(category)
        self.fields['repository_name'] = forms.ChoiceField(label='Repozytorium', choices=[(repository.name, repository.config['info']['description']) for repository in repo.repositories.values() if category in repository.can_create_new_objects_lines])

        self.fields['template_name'] = forms.ChoiceField(label='Szablon', choices=[(template_value, template_name) for template_name, template_value in driver_class.TEMPLATES.items()])



class ImportWizardForm(CascadeForm):

    MODE_FULL = 'full'
    MODE_FIXED = 'fixed'
    MODE_CONTINUE = 'continue'

    MODES = (
        (MODE_FULL, 'full'),
        (MODE_FIXED, 'fixed'),
        (MODE_CONTINUE, 'continue'),
    )

    style = 'import'
    description_text = 'Import'

    mode = forms.ChoiceField(label='Tryb', choices=MODES, initial=MODE_FULL, widget=widgets.HiddenInput)
    identifier = forms.CharField(label='Identyfikator', min_length=1, max_length=100)
    version = forms.IntegerField(label='Wersja', min_value=1, required=False, widget=widgets.NumberInput(attrs={'placeholder': 'latest'}))
    new_line = forms.BooleanField(label='Nadać nowy identyfikator?', initial=False, required=False)
    estimated_time = 1.0

    def __init__(self, *args, **kwargs):
        super(ImportWizardForm, self).__init__(*args, **kwargs)
        self.is_valid()

        try:
            mode = self.cleaned_data.get('mode', None)
        except AttributeError:
            pass
        else:
            if mode in (self.MODE_FIXED, self.MODE_CONTINUE):
                self.fields['identifier'].widget = widgets.HiddenInput()
                self.fields['version'].widget = widgets.HiddenInput()

            if mode in (self.MODE_CONTINUE, ):
                self.fields['new_line'].widget = widgets.HiddenInput()

    def clean_identifier(self):
        if '/' in str(self.cleaned_data.get('identifier', '')) \
                or '#' in str(self.cleaned_data.get('identifier', '')):
            raise WrongIdentifierException()
        return self.cleaned_data.get('identifier', '')



class SealWizardForm(EmptyCascadeForm):

    style = 'seal'
    estimated_time = 12.0


class CloneObjectForm(EmptyCascadeForm):

    description_text = 'Sklonuj obiekt'
    style_glyph = 'certificate'
    estimated_time = 4.0


class DeleteObjectForm(EmptyCascadeForm):

    style = 'delete'
    description_text = 'Usuń obiekt'
    estimated_time = 2.0


class CreateSpaceForm(CascadeForm):

    description_text = 'Utwórz przestrzeń'
    style_glyph = 'plus-sign'
    style_button = 'success'

    label = forms.CharField(label='Etykieta (min. 8 znaków)', max_length=32, validators=[MinLengthValidator(8)])


class ModifySpaceForm(CreateSpaceForm):

    description_text = 'Modyfikacja przestrzeni'

    style = 'save'

    def __init__(self, request, arguments, space_driver, *args, **kwargs):
        super(ModifySpaceForm, self).__init__(request, arguments, *args, **kwargs)
        self.fields['label'].initial = space_driver.db_space.label


class EditSpacePermissionsForm(CascadeForm):

    MODE_ADD = 'add'
    MODE_MODIFY = 'modify'

    MODES = (
        (MODE_ADD, 'add'),
        (MODE_MODIFY, 'modify'),
    )

    description_text = 'Zmień uprawnienia'
    style_glyph = 'ok-sign'
    style_button = 'success'

    username = forms.CharField(label='Użytkownik')
    roles = forms.MultipleChoiceField(label='Role', choices=models.UserRoleInSpace.ROLES, widget=widgets.CheckboxSelectMultiple, required=False)
    mode = forms.ChoiceField(label='Tryb', choices=MODES, initial=MODE_ADD, widget=widgets.HiddenInput)


    def __init__(self, *args, **kwargs):
        super(EditSpacePermissionsForm, self).__init__(*args, **kwargs)
        self.is_valid()

        try:
            mode = self.cleaned_data.get('mode', None)
        except AttributeError:
            pass
        else:
            if mode == self.MODE_MODIFY:
                self.fields['username'].widget.attrs['readonly'] = 'true'


class DeleteSpaceForm(EmptyCascadeForm):

    description_text = 'Usuń przestrzeń'
    style = 'delete'


