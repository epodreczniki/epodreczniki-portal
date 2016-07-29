define(['jquery', 'modules/scrolling'],function($, scrolling){

    var scrolledObject = $('.scrollable-text');
    var myScrollingObject = new scrolling(scrolledObject, 70, 'right');

    return function(){
        var readValue = function(key){
            if(localStorage!==undefined && key!==undefined && key!==null){
                return localStorage.getItem(key);
            }
        };

        var storeValue = function(key,value){
            if(localStorage!==undefined && key!==undefined && key!==null){
                localStorage.setItem(key,value);
            }
        }

        var readStatus = function(){       
            return readValue('epo.adm.msg.status'); 
        };

        var storeStatus = function(stat){
            storeValue('epo.adm.msg.status',stat);
        };
    
        var markCurrentAsSeen = function(){
            if($.inArray(currIdx,marked)!==-1){
                storeValue(markAsSeen($($messages.get(currIdx)).data('publish-date')),'seen');
                marked.push(currIdx);
            }
        };
        
        var currIdx = 0;
        var marked = [];
        var $messageBar = $("#admin-message-bar");
        var $messageContainer = $messageBar.find("#admin-message-bar-messages");
        var $messages = $messageContainer.find(".admin-message");
        var $newMsgIndicator = $messageBar.find("#admin-message-bar-indicator");

        /*$(document).on("changeState", function(){
            myScrollingObject.performChanges($('.scrollable-text'));
        });*/

         $(scrolledObject).bind('widthChange', function(){
             myScrollingObject.performChanges(scrolledObject);
        });

        $(window).resize(function(){
            scrolledObject.trigger('widthChange');
        });

        // if there are no messages hide everything
        if($messages.size()>0){
            // check if bar was hidden
            //$messageBar.css('display', 'block');
            var stat = readStatus();
            if(stat === 'hidden'){
                $messageContainer.css('display','none');
                // check date
                var showIndicator = false;
                // check whether red indicator should be shown
                $messages.each(function(idx,item){
                    var pub = $(item).data('publish-date');
                    showIndicator = showIndicator || readValue(pub) !== 'seen';
                });
                if(!showIndicator){
                   $newMsgIndicator.css('display','none');
                }
            }else{
                //hide indicator
                $newMsgIndicator.css('display','none');
            }
    
            $('#admin-message-toggle').bind('click',function(){
                if($messageContainer.css('display')==='none'){
                    //show
                    storeStatus('shown');
                    //$messageBar.css('display', 'block');
                    $messageContainer.css('display','block');
                    $newMsgIndicator.css('display','none');
                    markCurrentAsSeen();
                }else{
                    //hide
                    storeStatus('hidden');
                    $messageContainer.css('display','none');
                    //$messageBar.css('display', 'block');

                }
            });
            $messages.each(function(idx,item){                                
                $(item).css('display',idx==0?'block':'none');
            });
            if($messageContainer.css('display')==='block'){
                markCurrentAsSeen();

            }
            setInterval(function(){
                if($messageContainer.css('display')==='block'){
                    var nextIdx = $messages.size()==currIdx+1?0:currIdx+1;

                    $($messages.get(currIdx)).css('display','none');
                    $($messages.get(nextIdx)).css('display','block');
                    currIdx = nextIdx;
                    //$(document).trigger("changeState");
                    myScrollingObject.stopAnimation(scrolledObject);
                    myScrollingObject.performChanges(scrolledObject);
                    markCurrentAsSeen();

                }
            },5000);
            
        }else{
           $messageBar.css('display','none');
        }
    };
});
