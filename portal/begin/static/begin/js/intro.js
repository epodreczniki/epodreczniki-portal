jQuery('.usertype-intro-block2').click(function(e){
    console.log(">>>>>> setting  STUDENT");
    if (window.localStorage !== undefined) {
        localStorage.setItem('epo.user.type', 'student');
    }
    return true;
});

jQuery('.usertype-intro-block-3').click(function(e){
    console.log(">>>>>> setting  TEACHER");
    if (window.localStorage !== undefined) {
        localStorage.setItem('epo.user.type', 'teacher');
    }
    return true;
});