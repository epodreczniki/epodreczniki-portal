$(document).ready(function(){
    learning_obj_parent = $('[name="learning_objectives"]').parent();
    reload_learning_obj_view();
    create_learning_obj_change_button();
    $('#btn-delete').click(handle_delete);
});

function reload_learning_obj_view() {
    $(learning_obj_parent).find('ul').remove();
    $(learning_obj_parent).append('<ul></ul>');
    var list = $(learning_obj_parent).find('ul');
    $('[name="learning_objectives"]').each(function(){
        var uspp = $(this).val();
        $(list).append("<li>" + uspp + "</li>");
    });
}

function create_learning_obj_change_button() {
    $(learning_obj_parent).prepend('<button id="change_learning_obj_btn" class="btn btn-warning pull-right" type="button">Ustaw poziom edukacji</button>');
    $('#change_learning_obj_btn').click(handle_change_learning_obj);
}

function handle_change_learning_obj() {
    BootstrapDialog.show({
        title: 'Wybierz poziom edukacji:',
        buttons: [
             {
                label: 'Etap I',
                action: function(dialog) {
                    set_education_level(1);
                    dialog.close();
                }
             }, {
                label: 'Etap II',
                action: function(dialog) {
                    set_education_level(2);
                    dialog.close();
                }
             }, {
                label: 'Etap III',
                action: function(dialog) {
                    set_education_level(3);
                    dialog.close();
                }
             }, {
                label: 'Etap IV',
                action: function(dialog) {
                    set_education_level(4);
                    dialog.close();
                }
             }
        ]
    });
}

function set_education_level(level) {
    $('[name="learning_objectives"]').remove();
    $(learning_obj_parent).append('<input type="hidden" value="E'+level+'" name="learning_objectives" class="form-control">');
    reload_learning_obj_view();
}

function handle_delete() {
    var url = $(this).attr('data-url');
    var title = $('#custom-id').text();
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_WARNING,
        title: 'Usuwanie zasobu KZD',
        message: 'Czy na pewno chcesz usunąć zasób "' + title + '"?\nTa operacja jest nieodwracalna.',
        buttons: [
             {
                label: 'TAK, USUŃ',
                cssClass: 'btn-danger',
                action: function(dialog) {
                    var form = $('<form action="' + url + '" method="post"></form>');
                    $('body').append(form);
                    form.submit();
                }
             }, {
                label: 'Nie, nie usuwaj',
                action: function(dialog) {
                    dialog.close();
                }
             }
        ]
    });
}

