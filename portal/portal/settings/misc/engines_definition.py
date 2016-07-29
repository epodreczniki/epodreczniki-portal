from .utils import lazy_format

EXTERNAL_ENGINES = {
    'mathjax': {
        #'url_template': '3rdparty/mathjax/2.2-727332c/MathJax.js?config=MML_HTMLorMML,epo&locale=pl',
        #'url_template': '3rdparty/mathjax/2.3-78ea6af/MathJax.js?config=MML_HTMLorMML,epo&locale=pl',
        #'url_template': '3rdparty/mathjax/2.5-latest/MathJax.js?config=MML_HTMLorMML,epo2&locale=pl',
        'url_template': '3rdparty/mathjax/2.6.1/MathJax.js?config=MML_HTMLorMML,epo&locale=pl',
        #config=MML_HTMLorMML,epo&locale=pl #TeX-AMS-MML_SVG,
        'after_load_call': '',#'var en = require("engines"); new en.MathJaxEngine();',
        'class_name': 'modules/core/engines/content_engines/MathJaxEngine',
        'internal': True,
        'ignore_in_dependencies': False
    },
    'geogebra': {
        'url_template': '3rdparty/geogebra/{ver}/web/web.nocache.js',
        'url_template2': '3rdparty/geogebra/{ver}/web3d/web3d.nocache.js',
        'after_load_call': '',
        'class_name': 'GeogebraEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'swiffy': {
        'url_template': '3rdparty/swiffy/v5.2/runtime.js',
        'after_load_call': '',
        'class_name': 'SwiffyEngine',
        'internal': True,
        'ignore_in_dependencies': False
    },
    'swiffypattern': {
        'url_template': '3rdparty/swiffy/v{ver}/runtime.js',
        'after_load_call': '',
        'class_name': 'SwiffyEngine',
        'internal': True,
        'ignore_in_dependencies': False
    },
    'pl_generated_excercise_1': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'GeneratedExerciseEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'custom_womi': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'GeneratedExerciseEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'raphael_womi': {
        'url_template': '3rdparty/raphael/raphael.html',
        'after_load_call': '',
        'class_name': 'RaphaelWomiEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'ace_editor': {
        'url_template': '3rdparty/aceeditor/editor.html',
        'after_load_call': '',
        'class_name': 'AceEditorEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'svg_editor': {
        'url_template': '3rdparty/svg_edit/2.7/svg-editor.html',
        'after_load_call': '',
        'class_name': 'SvgEditEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'createjs_animation': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'PureHTMLEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'edge_animation': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'AdobeEdgeEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'framed_html': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'PureHTMLEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'ge_animation': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'GeneratedExerciseEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'custom_logic_exercise_womi': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'CustomLogicExerciseWomi',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'womi_exercise_engine': {
        'url_template': '',
        'after_load_call': '',
        'class_name': 'WomiExerciseEngine',
        'internal': True,
        'ignore_in_dependencies': True
    },
    'qml': {
        'url_template': '3rdparty/qml/1_0/qml.js',
        'after_load_call': 'initQml();',
        'class_name': '',
        'internal': True,
        'ignore_in_dependencies': False
    },
    'pl_generator': {
        'url_template': '3rdparty/pl/generator/functions.js',
        'after_load_call': 'epGlobal.reader.pl.quizGeneratorPL.registerSingleAnswerQuestions();',
        'class_name': '',
        'internal': True,
        'ignore_in_dependencies': False,
        'priority': 1000
    },
    'pl_interactive': {
        'url_template': '3rdparty/pl/generator/interactive.js',
        'after_load_call': 'epGlobal.reader.pl.interactiveExercisePL.generateInteractive()',
        'class_name': '',
        'internal': True,
        'ignore_in_dependencies': False,
        'priority': 1000
    }
}