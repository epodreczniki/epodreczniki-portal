define(function(){
    "use strict";
    var Note = function(localNoteId,localUserId,handbookId,moduleId,pageId){
        if(!localNoteId){
            throw("local note id is required");
        }
        if(localUserId===undefined || localUserId===null){
            throw("local user id is required");
        }
        if(!handbookId){
            throw("handbook id is required");
        }
        var handbookIdParts = handbookId.split(":"); 
        var cnt = 0;
        handbookIdParts.forEach(function(part){
            if(part)cnt++;
        });
        if(handbookIdParts.length!==3 || cnt!==3){
            throw("invalid handbook id");
        }
        if(!moduleId){
            throw("moduleId is required");
        }
        if(!pageId){
            throw("pageId is required");
        }
        Object.defineProperty(this,"localNoteId",{
            enumerable:true,
            value:localNoteId
        });
        Object.defineProperty(this,"localUserId",{
            enumerable:true,
            value:localUserId 
        }); 
        Object.defineProperty(this,"handbookId",{
            enumerable:true,
            value:handbookId
        });
        Object.defineProperty(this,"moduleId",{
            enumerable:true,
            value:moduleId
        });
        Object.defineProperty(this,"pageId",{
            enumerable:true,
            value:pageId
        });
        Object.defineProperty(this,"mdContentId",{
            enumerable:false,
            get: function(){
                return handbookId.split(":")[0];
            }
        });
        Object.defineProperty(this,"mdVersion",{
            enumerable:false,
            get: function(){
                return handbookId.split(":")[1];
            }
        });
    };
    Note.prototype = {
        constructor:Note,
        toJSONString: function(){
            return JSON.stringify(this,["noteId","userId","handbookId","moduleId","pageId","location","sid","ranges","characterRange","start","end","subject","value","type","accepted","referenceTo","referencedBy","modifyTime","localNoteId","localUserId"]);
        }
    };

    Note.fromJSONObject = function(parsed){
        var res = new Note(parsed["localNoteId"],parsed["localUserId"],parsed["handbookId"],parsed["moduleId"],parsed["pageId"]);
        res["noteId"] = parsed["noteId"];
        res["userId"] = parsed["userId"];
        res["location"] = parsed["location"];
        res["subject"] = parsed["subject"];
        res["value"] = parsed["value"];
        res["type"] = parsed["type"];
        res["accepted"] = parsed["accepted"];
        res["referenceTo"] = parsed["referenceTo"];
        res["referencedBy"] = parsed["referencedBy"];
        res["modifyTime"] = parsed["modifyTime"];
        return res; 
    };

    Note.fromWebService = function(parsed){
        var res = new Note(parsed["note_id"],parsed["user_id"],parsed["handbook_id"],parsed["module_id"],parsed["page_id"]);
        res["noteId"] = parsed["note_id"];
        res["userId"] = parsed["user_id"];
        res["location"] = JSON.parse(parsed["location"]);
        res["subject"] = parsed["subject"];
        res["value"] = parsed["value"];
        res["type"] = parsed["type"];
        res["accepted"] = parsed["accepted"];
        res["referenceTo"] = parsed["reference_to"];
        res["referencedBy"] = parsed["referenced_by"];
        res["modifyTime"] = parsed["modify_time"];
        return res;
    };

    Note.fromJSONString = function(jsonNote){
        var res;
        try{
            var parsed = JSON.parse(jsonNote);
            res = Note.fromJSONObject(parsed);
        }catch(e){
            console.log("could not create note from json: "+jsonNote);
        }  
        return res;
    }
    return Note;
});
