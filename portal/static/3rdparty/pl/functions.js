



function SimpleEngine(api,container){

	this.api=api
    this.container=container
	var engine=this;
    this.originalAnswers=null

	this.registerSingleAnswerQuestions = function(){
		$(engine.container).find(".singleanswerquestion").each(function(){
			var t=$(this)
            engine.originalAnswers=$(engine.container).find("ul.answers").find("li")
			$(this).find("mn:contains('$')").each(function(){
				var expression=$(this).text()
				$(this).attr("expression",expression)
			})
			engine.replaceExpressions(true)
		})
	}


	this.replaceExpressions = function(dflt){
        var elem=engine.container
		var values=[]
		$(elem).find(".variable").each(function(){

			if (dflt) {
				values[$(this).attr("name")]=parseFloat($(this).attr("default"))
			} else {
				values[$(this).attr("name")]=engine.pickRandom(parseFloat($(this).attr("start")),parseFloat($(this).attr("end")),parseFloat($(this).attr("step")))
			}
		})
		for(var i in values){
			$(elem).find("mn:contains('$"+i+"')").each(function(){
				var text=$(this).attr("expression")
				for (var j in values) text=text.replace(new RegExp("\\$"+j,'g'),values[j])

				$(this).html(eval(text))
			})
			$(elem).find("script[type='math/mml']").each(function(){
				var parsed=$(jQuery.parseHTML($(this).text()))
				parsed.find("mn[expression]").each(function(){
					var text=$(this).attr("expression")
					for (var j in values) text=text.replace(new RegExp("\\$"+j,'g'),values[j])
					var evaluated=eval(text)
					$(this).text(evaluated)
				})

				$(elem).find(".tmp").html(parsed)
				$(this).text($(".tmp").html())
			})

			$(elem).find("mn[expression]").each(function(){
				var text=$(this).attr("expression")
				for (var j in values) text=text.replace(new RegExp("\\$"+j,'g'),values[j])
				var evaluated=eval(text)
				$(this).text(evaluated)
			})


			$(elem).find("span.correctanswer[expression]").each(function(){
				var text=$(this).attr("expression")
				for (var j in values) text=text.replace(new RegExp("\\$"+j,'g'),values[j])
				$(this).attr("value",eval(text))
			})
		}
	}

    this.resortAnswers=function(dflt){
        var ul=$(engine.container).find("ul.answers")
        if (dflt) {
            engine.originalAnswers.appendTo(ul)
        } else {
            $("li",ul).sort(function(){
                return ( Math.round( Math.random() ) - 0.5 )
            }).appendTo(ul)
        }
        var labels=$(engine.container).find("span.answerlabel")
        var labelnames=["A.","B.","C.","D."]
        var i=0;
        labels.each(function(){
            $(this).text(labelnames[i])
            i++
        })
    }

	this.checkSingleRadio = function() {
        var elem=engine.container
		var allcorrect=true
		var error=false
		var hasgroups=false
		var groups=[]
		$(elem).find("span.correctanswer").each(function(){
			if ($(this).attr("group")!=undefined&&$(this).attr("group")!=false) {
				if (groups[$(this).attr("group")]==undefined) groups[$(this).attr("group")]=[]
				groups[$(this).attr("group")][$(this).attr("key")]=false
				hasgroups=true;
			}

			var input=$(elem).find("input[name='"+$(this).attr("key")+"']")
			if ($(input).attr("type")=="radio") {
				var checked=$(elem).find("input[name='"+$(this).attr("key")+"']:checked").val()
				if (allcorrect&&checked!="undefined"&&checked==$(this).attr("value")) allcorrect=true
				else allcorrect=false
				if (checked==undefined) error=true
			} else if ($(input).attr("type")=="text"){
				try {
				   if (allcorrect&&Math.round(eval($(input).val())*10000)/10000==$(this).attr("value")) allcorrect=true;
				   else allcorrect=false
				} catch (e) { error=true; }

				if ($(input).val()=="") error=true
			}
		})

		if (hasgroups) {
			allcorrect=true
			for (var group in groups) {
				var groupcorrect=true
				$(elem).find("span.correctanswer[group='"+group+"']").each(function(){
					var found=false
					for (var key in groups[group]){
						if ($(elem).find("input[name='"+key+"']").val()==$(this).attr("value")) found=true;
					}
					if (!found) groupcorrect=false
				})
				if (!groupcorrect) allcorrect=false
			}
		}

		if (error) {
			engine.showNoAnswer()
		} else {
			if (allcorrect) engine.showCorrect()
			else engine.showIncorrect()
		}
	}


	this.showCorrect = function(){
		this.api.showCorrectFeedback();
	}

	this.showIncorrect = function(){
		this.api.showIncorrectFeedback();
	}

	this.showNoAnswer = function() {
		this.api.showIncompleteFeedback();
	}

	this.regenerate = function(dflt) {
        var elem=engine.container
		this.api.hideFeedback();
		this.api.hideHint();

        engine.resortAnswers(dflt)
		$(elem).find(".feedback").empty()
		$(elem).find("input[type='text']").val('')
		$(elem).find("input[type='radio']").prop("checked",false)

		engine.replaceExpressions(dflt)
		$(elem).find(".MathJax").each(function(){
			if ($(this).attr("id")) MathJax.Hub.Queue(["Reprocess",MathJax.Hub.getJaxFor($(this).attr("id"))])
		})
	}

	this.pickRandom = function(from,to,step) {
		var numbers=engine.generateRandom(from,to,step)
		return numbers[Math.floor(Math.random()*numbers.length)]
	}

	this.generateRandom = function	(from,to,step){
		var ret=[]
		if (step==null) step=1
		for (var i=from; i<=to; i+=step) ret.push(i)
		return ret
	}


}
