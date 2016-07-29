define([],function(){
    
    return {
        getUserId: function(){
            // Replace by user context
            return "TEST_USER_ID";
        },
        getMdContentId: function(){
            return "";
        },
        getMdVersion: function(){
            return 7;
        },
        getHandbookId: function(){
            return "TEST_MD_CONTENT:7";
        },
        getModuleId: function(){
            return "TEST_MODULE";
        },
        getPageId: function() {
            return (window.location.hash != '' ? window.location.hash : 'NO_PAGE_ID');
        }
    };
});
