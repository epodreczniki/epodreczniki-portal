from django import template

register = template.Library()

@register.simple_tag
def pluralize(base, n, singular, plural_1, plural_2):
    if n == 1 or n == -1:
        return base + singular
    elif n % 10 in [2, 3, 4] and (n / 10) % 10 != 1:
        return base + plural_1
    else:
        return base + plural_2


@register.simple_tag
def reprocess_cn_tags(string):
    to_replace = {
        '<cn:newline/>': '<br>',
        '<cn:emphasis effect="bold">': '<em class="bold">',
        '<cn:emphasis effect="italics">': '<em class="italic">',
        '<cn:emphasis effect="bolditalics">': '<em class="bolditalic">',
        '</cn:emphasis>': '</em>'
    }

    for key, value in to_replace.items():
        string = string.replace(key, value)

    return string
