define(['jquery'], function(jquery){
(function ($) {
    'use strict';

    var formUrl = $('#contact-form-data').data('contact-form-absolute-path');

    var switchState = function(processing){
	var dial = $('#dialog_form');
    	if(!!processing){
		dial.activity();
		dial.find('input').bind('keydown',preventSubmission);
		dial.find('#send_user_form').prop('disabled',true);
	}else{
		dial.activity(false);
		dial.find('#send_user_form').prop('disabled',false);
		dial.find('input').unbind('keydown',preventSubmission);
	}
    };

    var preventSubmission = function(event){
    	if(event.which == 13){
		return false;
	}
    };

    var initModuleId = function(){
        if(checkIfModuleUrl()){
            $("input[name=md_module_id]").val(getModuleContentId());
            $("input[name=md_collection_id]").val(getCollectionContentId());
        }
    };

    var checkIfModuleUrl = function(){
        return /^\/reader\/c\/[^\/]+\/m\/[^\/]+/.test($(location).attr('pathname'));
    };

    var checkIfTitle = function(){
        return /^\/reader\/c\/[^\/]+\/v\/[^\/]+\/t\/[^\/]+[^\/]$/.test($(location).attr('pathname'));
    };

    var getModuleContentId = function(){
        if(checkIfModuleUrl()){
            return $(location).attr('pathname').split('/m/').pop().split('/').shift();
        }else if(checkIfTitle()){
            return 'title';
        }
    };

    var getCollectionContentId = function(){
        if(checkIfModuleUrl){
            return $(location).attr('pathname').split('/c/').pop().split('/').shift();
        }
    };

    function assignButtons(dialog) {
        dialog.find('#close_success_modal_window, #close_modal_window').click(function () {
            $.fancybox.close();
            return false;
        });

        dialog.find('#send_user_form').click(function () {
            sendForm(false);
            return false;
        });
    }

    function sendForm(retry) {
        var dialog = $('#dialog_form');

        dialog.children('input[name=user_agent]').val(navigator.userAgent);
        dialog.children('input[name=url]').val(window.location.href);
        dialog.children('input[name=width_of_browser]').val($(window).width());
        dialog.children('input[name=height_of_browser]').val($(window).height());

	    switchState(true);

    	$.ajax({
            data: dialog.serialize(),
            type: 'POST',
            url: $('#contact-form-data').data('contact-form-absolute-path'),
            success: function (data) {
                dialog.html($(data).children());
		        assignButtons(dialog);
                initModuleId();
                $('#close_success_modal_window').focus();
            },
            error: function(jqXHR, textStatus, err){
                if(!retry){
                    sendForm(true)
                }
	        },
	        complete: function(jqXHR,textStatus){
		        switchState(false);
	        }
        });
    }

    $(document).ready(
        function () {
            var elements = $('#contact_form, #footer_contact, #contact_side, button.contact-form-trigger');

	        var escapeHandler = function(event){
	    	    if(event.which==27){
			        $.fancybox.close();
		        }
	        };
            elements.fancybox({
                //modal: true,
                type: 'ajax',
                padding: 15,
                //href: formUrl,
                wrapCSS: 'fancybox-modal fancybox-modal-contact',
                beforeLoad: function(){
                    this.href = $('#contact-form-data').data('contact-form-absolute-path');
                },
                beforeShow: function () {

                	$('#contact_form').data('tooltipsy') && $('#contact_form').data('tooltipsy').hide();
	                //$('body').addClass('stop-scrolling');
                    assignButtons($('#dialog_form'));
		            initModuleId();
                    $(document).bind('keydown', escapeHandler);

                    var textArea = $('#dialog_form').find('#id_message');
                    var maxLength = textArea.attr('maxlength');

                    $('<span class="counter"></span>').insertAfter($('#dialog_form').find('[for="id_message"]'));
                    $('.counter').html(maxLength + '/' + maxLength);


		            $('#dialog_form').keydown(function(ev){
			            if(ev.which > 36 && ev.which < 41){
				            ev.stopPropagation();
		    	        }
                        $('.counter').html(maxLength - textArea.val().length + '/' + maxLength);
		            });

                    $("#dialog_form input[name=riddle]").focus();
                    $("#dialog_form").attr("role","alert");

                    $(".fancybox-wrap.fancybox-desktop").attr("aria-labelledby","dialog_form-header")
                },
		        afterShow: function(){
		            switchState(false);
		            //$('body').removeClass('stop-scrolling');
                    $('.fancybox-close').hide();
                    $('.fancybox-overlay').prevAll('div').attr('aria-hidden', 'true');
                },
                beforeClose: function() {
                    $('.fancybox-overlay').prevAll('div').removeAttr('aria-hidden');
                },
                afterClose: function () {
                    $("#dialog_form").removeAttr("role");

                    window.scrollTo(window.pageXOffset + 1, window.pageYOffset);
		            $(document).unbind('keydown',escapeHandler);
                },
                helpers: {
                    overlay: {
                        locked: true,
                        scrolling: 'no',
                        autoDimensions: 'true',
                        closeEffect: 'none',
                        css: {
                            'background': 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                }
            });
        }
    );

}(jquery));
});
