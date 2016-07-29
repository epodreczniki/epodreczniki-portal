// TODO: PATHS MODIFICATION >> Talk with micz
define([
    'exports',
    './notes-config',
    './model/Note',
    './notes-cassandra',
    'jquery',
    'rangy-textrange',
    'rangy-classapplier',
    'modules/core/Registry'
], function(
    exports,
    notesConfig,
    Note,
    notesPlatform,
    $,
    rangyText,
    rangy,
    Registry
){
    "use strict";
    rangy.config.ignoredClasses=notesConfig.ignoredClasses;

    rangy.config.includeAttrCutoff_id = notesConfig.includeAttrCutoff_id;
    rangy.config.includeAttrCutoff_className = notesConfig.includeAttrCutoff_className;

    rangy.init();

    var getClassForType = function(t){
        return "note-type"+t;
    };    

    var getValueBool = function(note) {
        return note.value && !!note.value.trim().length;
    };

    var setElementAttr = function(node, note) {
        $(node).attr('note-with-value', getValueBool(note));
    };
    
    var onNoteClick = function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        var noteId = this.getAttribute("note-id");
        var position = _.extend($(ev.target).position(), {
            width: $(ev.target).width()
        });
        if(noteId){
            // added passing ev from click 
            notesPlatform.handleNoteClick(noteId, position);
        }else{
            console.log('this should never happen');
        }
    };

    var onNoteMarkClick = function(ev) {
        console.log("kliknięta notatka zakładka zaznacznik");
    };

    var showNotes = function(notes){
        var parsed = parseNoteList(notes);
        parsed.forEach(function(note){
            addNoteToView(note);
        });
        rangy.getSelection().removeAllRanges();
    };

    var showAllNotes = function(){
        var notes = getNotesForCurrentView();
        notes.forEach(function(note){
            addNoteToView(note);
        });
        // ;; added ;;
        Registry.get('layout').trigger('allNotesShown');
        // ;; end added ;;
        rangy.getSelection().removeAllRanges();
    };

    var addNoteToView = function(note){
        if(note && note instanceof Note && note.localNoteId){
            var applier = createApplierForNote(note.localNoteId);
            if(note.location && note.location.constructor===Array){
                note.location.forEach(function(locItem){
                    var sect = document.getElementById(locItem.sid);
                    if(sect){
                        locItem.ranges.forEach(function(storedRange){
                            var r = rangy.createRange();
                            r.selectCharacters(sect,storedRange.characterRange.start,storedRange.characterRange.end);
                            applier.applyToRange(r);
                        });

                        //// ADDED START;;
                        //var $noteWithValue = $('<div>', { 
                        //    class: 'ep-note-with-value ' + note.noteId,
                        //    'data-note-id': note.noteId
                        //});
                        //$noteWithValue.on('click', function() {
                        //    onNoteMarkClick();
                        //});
                        //$(sect).append($noteWithValue);
                        //// ADDED STOP;;

                    }else{
                        console.log('section not found',locItem.sid);
                    }
                });
                var $newNote = $("span[note-id='"+note.localNoteId+"']");
                $newNote.addClass(getClassForType(note.type));
                setElementAttr($newNote, note);
                //$newNote.attr('note-with-value', !!note.value.trim().length);
                $newNote.each(function(idx,span){
                    if(hasAnchorAncestor(span)){
                        span.ondblclick=null;
                    }
                });

                ///if (note.value && note.value.length) {
                ///    Registry.get('layout').trigger('addedNoteToView', note.noteId);
                ///}

                rangy.getSelection().removeAllRanges();
            }
        }
    };

    var removeNoteFromView = function(noteId){
        var $note = $("span[note-id='"+noteId+"']");    
        $note.removeClass();
        $note.removeAttr('note-with-value');
        $note.addClass("ep-note");
        var applier = createApplierForNote(noteId);
        $note.each(function(idx,item){
            var sel = rangy.getSelection();
            sel.selectAllChildren(item);
            applier.undoToSelection();
        });
        rangy.getSelection().removeAllRanges();
    };
    
    var createApplierForNote = function(noteId){
        if(noteId){
            return rangy.createCssClassApplier("ep-note",{
                elementProperties:{"onclick":onNoteClick},
                elementAttributes:{"note-id":noteId}
            });
        }
    }; 

    var rangeInReaderContent = function(ran){
        if(ran){
            var cac = ran.commonAncestorContainer;
            while(cac){
                if(cac.nodeType===1 && 
                   (cac.id==="reader-content" || hasClass(cac, 'reader-content')))
                {
                    return true;
                }
                cac = cac.parentNode;
            }
        }    
    };

    var hasClass = function(el,selector){
        return (" " + el.className + " " ).indexOf( " "+selector+" " ) > -1;
    };

    var hasAnchorAncestor = function(el){
        while(el){
            if(el.tagName==="A"){
                return true;
            }
            el = el.parentNode;
        }
    };

    var nodeInIgnored = function(n){
        while(n){
            if(n.nodeType===1 && checkElement(n)){
                return n;
            }
            n = n.parentNode;
        }
    };

    var rangeInAnchor = function(ran){
        if(ran){
            var nodesInRange = ran.getNodes([3]);
            if(nodesInRange && nodesInRange.length){
                for(var i=0,n;n=nodesInRange[i];i++){
                    if(!hasAnchorAncestor(n)){
                        return false;
                    }    
                } 
                return true;
            }
        }
    };

    var hasNonIgnoredTextNodes = function(ran){
        if(ran){
            var nodesInRange = ran.getNodes([3]);
            for(var i=0,n;n=nodesInRange[i];i++){
                if(!nodeInIgnored(n)){
                    return true;    
                }
            }
        }
    };

    var checkElement = function(el){
        if(notesConfig.ignoredClasses && notesConfig.ignoredClasses.constructor===Array){
            for(var i=0, ignoredClass;ignoredClass=notesConfig.ignoredClasses[i];i++){
                if(hasClass(el,ignoredClass)){
                    return true;
                }
            }
        }
    };
    
    var fixRange = function(ran){
        var s = nodeInIgnored(ran.startContainer);     
        var e = nodeInIgnored(ran.endContainer);
        if(s){
            ran.setStartAfter(s);
        }
        if(e){
            ran.setEndBefore(e);
        }
    };

    var rangeBeginsInNote = function(ran){
        if(ran){
            var s = ran.startContainer;
            while(s){
                if(s.nodeType===1 && hasClass(s,"ep-note")){
                    return s.getAttribute("note-id");
                }
                s = s.parentNode;
            }
        }
    }; 

    var rangeEndsInNote = function(ran){
        if(ran){
            var e = ran.endContainer;
            while(e){
                if(e.nodeType===1 && hasClass(e,"ep-note")){
                    return e.getAttribute("note-id");
                }
                e = e.parentNode;
            }
        } 
    };

    var selectionIntersectsWith = function(ran){
        if(ran){
            var res = [];
            var start = rangeBeginsInNote(ran);
            if(start && res.indexOf(start)===-1){
                res.push(start);
            }
            var end = rangeEndsInNote(ran);
            if(end && res.indexOf(end)===-1){
                res.push(end);
            }
            var within = ran.getNodes([1]);
            for(var i=0,n;n=within[i];i++){
                if(n.nodeName==="SPAN" && hasClass(n,"ep-note")){
                    var wni = n.getAttribute("note-id");
                    if(wni && res.indexOf(wni)===-1){
                        res.push(wni);
                    }
                }
            }
            return res.length?res:undefined;
        }
    };

    var getSelectedRange = function(){
        var sel = rangy.getSelection();
        if(sel && sel.rangeCount){
            return sel.getRangeAt(0);
        }
    };
    
    var getSectionsInRange = function(ran){
        var res = [];
        if(ran){
            var $sect = $(".section.level_1");
            $sect.each(function(idx,section){
                if(ran.containsNode(section,true)){
                    res.push(section);
                }
            });
        }    
        return res;
    };
    
    var buildNoteLocation = function(ran){
        var locationParts = [];
        var sections = getSectionsInRange(ran);
        sections.forEach(function(section){
            var tmpR = rangy.createRange();
            tmpR.selectNode(section);
            tmpR = ran.intersection(tmpR);
            var tmpS = rangy.getSelection();
            tmpS.setSingleRange(tmpR);
            var tmpCr = tmpS.saveCharacterRanges(section);
            locationParts.push(toLocationObject(section.id,tmpCr));
        });
        return locationParts;
    };

    var toLocationObject = function(sectionId,savedCharacterRanges){
        return {sid:sectionId,ranges:savedCharacterRanges};
    };

    var startAddNote = function(shouldStringify, callback){
        var ran = getSelectedRange();    
        if(ran){
            if(!rangeInReaderContent(ran)){
                notesPlatform.showMessage("nie ma notatek poza czytnikiem");
                return;
            }
            if(rangeInAnchor(ran)){
                notesPlatform.showMessage("nie moze byc cale w linku");
                return;
            }
            if(!hasNonIgnoredTextNodes(ran)){
                notesPlatform.showMessage("brak nieignorowanych text nodow");
                return;
            }
            fixRange(ran);
            var intersects = selectionIntersectsWith(ran);
            var finalRange;
            if(!intersects){
                finalRange = ran;
            }else{
                finalRange = rangy.createRange();
                var s = rangeBeginsInNote(ran);
                if(s){
                    finalRange.setStartBefore($("span[note-id='"+s+"']:first")[0]);
                }else{
                    finalRange.setStart(ran.startContainer,ran.startOffset);
                }
                var e = rangeEndsInNote(ran);
                if(e){
                    finalRange.setEndAfter($("span[note-id='"+e+"']:last")[0]);
                }else{
                    finalRange.setEnd(ran.endContainer,ran.endOffset);
                }
                var sel = rangy.getSelection();
                sel.removeAllRanges();
                sel.setSingleRange(finalRange);
            }
            if(shouldStringify){
                notesPlatform.showNoteCreate(finalRange.text(),JSON.stringify(buildNoteLocation(finalRange)),JSON.stringify(intersects));
            }else{
                notesPlatform.showNoteCreate(finalRange.text(),buildNoteLocation(finalRange),intersects, callback);
            }
        }
    };

    var argToNote = function(input){
        if(input){
            if(input.constructor===Note){
                return input;
            }
            if(input.constructor===String){
                return Note.fromJSONString(input);    
            }
            if(input.constructor===Object){
                return Note.fromJSONObject(input);
            }
        }
    };

    var argToArray = function(input){
        if(input){
            if(input.constructor===Array){
                return input;
            }    
            if(input.constructor===String){
                try{
                    var r = JSON.parse(input);
                    if(r && r.constructor===Array){
                        return r;
                    }
                }catch(e){
                    console.log('unable to convert',input);
                }
            }
        }
    };

    var noteCreateCallback = function(note,ntm){
        var n = argToNote(note); 
        var notesToMerge = argToArray(ntm); 
        if(notesToMerge){
            notesToMerge.forEach(function(nId){
                removeNoteFromView(nId);
            });
        } 
        addNoteToView(n);
    };

    var noteEditCallback = function(note){
        var n = argToNote(note);
        var $note = $("span[note-id='"+note.localNoteId+"']");
        $note.removeClass();
        $note.addClass("ep-note");
        $note.addClass(getClassForType(note.type)); 
        setElementAttr($note, note);
    };

    var noteDeleteCallback = function(noteId){
        removeNoteFromView(noteId);
    };
    
    var getNoteById = function(noteId){
        var res;
        var note = notesPlatform.getNoteById(noteId);
        if(note instanceof Note){
            res = note;
        }else{
            try{
                res = Note.fromJSONString(note);
            }catch(e){
                console.log('note parse error',e);
            }
        }
        return res;
    };

    var getNotesForCurrentView = function(){
        var res;
        var notes = notesPlatform.getNotesForCurrentView();
        if(notes && notes.constructor===Array){
            res = notes;
        }else{
            try{
                var noteArr = JSON.parse(notes);
                res = [];
                noteArr.forEach(function(noteObj){
                    var n = Note.fromJSONObject(noteObj);
                    res.push(n);    
                });
            }catch(e){
                console.log('notes parse error',e);
            }
        } 
        return res;
    };

    var parseNoteList = function(notes){
        var res;
        if(notes && notes.constructor===Array){
            res = [];
            notes.forEach(function(nObj){
                res.push(Note.fromJSONObject(nObj));
            });
        }else{
            try{
                var noteArr = JSON.parse(notes);
                res = [];
                noteArr.forEach(function(noteObj){
                    var n = Note.fromJSONObject(noteObj);
                    res.push(n);
                });
            }catch(e){
                console.log('notes parse error',e);
            }
        }
        return res;
    };
    
    var getSelectedText = function(){
        var ran = getSelectedRange();
        if(ran){
            return ran.text();
        }
    };
    
    exports.showAllNotes=showAllNotes;
    exports.showNotes=showNotes;
    exports.noteCreateCallback=noteCreateCallback;
    exports.noteEditCallback=noteEditCallback;
    exports.noteDeleteCallback=noteDeleteCallback;
    exports.startAddNote=startAddNote;
    exports.getSelectedText=getSelectedText;
});
