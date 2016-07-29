define(['declare', './XMLParser', 'text!./schema/epxml11.json'], function(declare, XMLParser, epxml11){
    return declare(XMLParser, {
        instance:{
            schema: epxml11
        }
    });

});
