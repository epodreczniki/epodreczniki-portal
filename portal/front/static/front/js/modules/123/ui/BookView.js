define(['jquery',
        'libs/jquery.easing.1.3',
        'underscore','backbone',
        'text!modules/123/templates/Book.html'
        ,'modules/123/models/Book',
        'text!modules/123/templates/Chapter.html',
        'text!modules/123/templates/Details.html'],function($,jqe,_,Backbone,BookTpl,Book,ChapterTpl,DetailsTpl){
    return Backbone.View.extend({
        active:false,
        smallR:30,
        bigR:120,
        factor:1,
        angle:Math.PI/6,
	    chapterViews:[],
        centers:undefined,
        template:_.template(BookTpl),
        chapterTemplate:_.template(ChapterTpl),
        detailsTemplate:_.template(DetailsTpl),
        initialize:function(opts){
            this.parent = opts.parent;
            this.smallR = opts.smallR;
            var noc = this.model.get('chapters').length;
            this.factor = noc<=8?noc<=4?4:2:1;
            this.listenTo(this,'post-render',this.onPostRender);
            this.listenTo(this,'active-state',this.onActiveStateChange);
            if(this.model===undefined){
                this.model = new Book();
            }
            this.render();
            this.model.on('change',this.render,this);
            $.easing.kastom = function(x,t,b,c,d){
                var ts=(t/=d)*t;
                var tc=ts*t;
                return b+c*(13.3975*tc*ts + -54.39*ts*ts + 80.485*tc + -52.39*ts + 13.8975*t);
            };
        },

        events:{
            'click .central-circle':'onRequestActiveState',
    	    'click .chapter-circle a':'ot'
        },

    	ot:function(event){
            if(!this.active){
	            event.preventDefault();
    	        event.stopImmediatePropagation();
            }
    	},

	    onPostRender:function(){
		    //console.log('post-render');
    	},

        render:function(animate){
            this.$el.addClass('book-view');
            //this.$el.css('width',20*this.smallR).css('height',20*this.smallR);
            //this.$el.css('bottom',4*this.smallR);
            this.$el.html(this.template(this.model.toJSON()));
            var $chapterList = this.$el.find('#chapter-list');
            $chapterList.html('');
            if(this.coords===undefined){
                this.coords = this.calculateCoords();
            }
            var _th = this;
            this.chapterViews = [];
            this.model.get('chapters').each(function(chapter,idx){
                var li = $(_th.chapterTemplate(chapter.toJSON()));
                li.css('height',2*_th.coords[idx].rh)
                    .css('width',2*_th.coords[idx].rh)
                    .css('left',_th.coords[idx].chx)
                    .css('top',_th.coords[idx].chy);
                $chapterList.append(li);
                _th.chapterViews.push(li);
		        li.click(function(event){
                    if(!_th.active){
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        _th.parent.trigger('request-as',_th['cid']);
                    }
                });
            });
            this._createDetailsCircle($chapterList);
            //var $cc = this.$el.find('div.central-circle');
            //$cc.css('height',this.smallR*8).css('width',this.smallR*8).css('top',this.$el.height()/2-this.smallR*4).css('left',this.$el.width()/2-this.smallR*4);
            //this.$el.find('div.details').css('height',2*this.smallR).css('width',2*this.smallR).css('top',2*$cc.height()/3).css('left',$cc.width()/2-this.smallR);
            return this;
        },

        _createDetailsCircle: function(parent){
        	var _this = this;
        	var details =  $(_this.detailsTemplate({
                name: 'detale',
                image: 'http://www.psdgraphics.com/wp-content/uploads/2009/04/info-icon.jpg',
                url: _this.model.get('details_url')
            }));
        	_this.detailsCoords = _this._calculateDetailsCoords();
        	details.css('height',2*_this.detailsCoords.rh).css('width',2*_this.detailsCoords.rh).css('left',_this.detailsCoords.chx).css('top',_this.detailsCoords.chy);
        	parent.append(details);
        	_this.details = details;
        	details.click(function(event){
                if(!_this.active){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    _this.parent.trigger('request-as',_this['cid']);
                }
            });
        },

        animateTransition:function(){
            var _th = this;
            if(_th.active){
            	_th.$el.find('div.central-circle').addClass('active');
            	_th.details.animate({"left":_th.detailsCoords.cvx,"top":_th.detailsCoords.cvy,"width":2*_th.detailsCoords.rv,"height":2*_th.detailsCoords.rv},1500,'kastom'
//            			function(){
//            		_th.$el.find('div.details').css('display','block');
//            	}
                );
            }else{
            	_th.$el.find('div.central-circle').removeClass('active');
            	_th.details.stop();
            	_th.$el.find('div.details').css('display','none');
            	_th.details.css('height',2*_th.detailsCoords.rv).css('width',2*_th.detailsCoords.rv).css('left',_th.detailsCoords.cvx).css('top',_th.detailsCoords.cvy);
            	_th.details.animate({"left":_th.detailsCoords.chx,"top":_th.detailsCoords.chy,"width":2*_th.detailsCoords.rh,"height":2*_th.detailsCoords.rh},'fast','swing');
            }
            _.each(this.chapterViews,function(li,idx){
            	if(_th.active){
            		li.animate({"left":_th.coords[idx].cvx,"top":_th.coords[idx].cvy,"width":2*_th.coords[idx].rv,"height":2*_th.coords[idx].rv},1500,'kastom',
            				function(){
            			_th.$el.find('div.details').css('display','block');
            		});
            	}else{
            		li.stop();
            		_th.$el.find('div.details').css('display','none');
            		li.css('height',2*_th.coords[idx].rv).css('width',2*_th.coords[idx].rv).css('left',_th.coords[idx].cvx).css('top',_th.coords[idx].cvy);
            		li.animate({"left":_th.coords[idx].chx,"top":_th.coords[idx].chy,"width":2*_th.coords[idx].rh,"height":2*_th.coords[idx].rh},'fast','swing');
            	}

            });
        },
        calculateCoords:function(){
            var res = [];
            var noc = this.model.get('chapters').length;
            this.angle = 2*Math.PI/noc;
            //var angleShift = Math.PI/4*(1-Math.random()/5);
            
            var angleShift = Math.PI/-4;
            switch(this.model.get('chapters').length){
            	case 0:
            		break;
            	case 1:
            		angleShift = Math.PI/-0.5;
            		break;
            	case 2:
            		angleShift = Math.PI/-8;
            		break;
            	case 3:
            		angleShift = Math.PI/-5;
            		break;
            	case 4:
            		angleShift = Math.PI/-2;
            		break;
            	default:
            		angleShift = Math.PI/8;
            	
            }	
            //var angleShift = Math.PI/-4;
            var _th = this;
            //var _factor = noc<=8?noc<=4?4:2:1;
            var _factor = noc<=4?4:1;
            this.model.get('chapters').each(function(chapter,idx){
                // promien schowanego to smallR +-20%;
                // dla 1-4 większe
                var coords = {};
                var rh = _th.smallR+_th.smallR*(Math.random()-1)/10;
                rh*=noc<5?2:1;
                var chshift = noc<5?Math.random()*rh/2:0;
                //var chshift = 0;
                var idxShift = idx * 0.3;
                var chx = _th.$el.width()/2+Math.cos(idxShift*_th.angle+angleShift-Math.PI/2)*(_th.smallR*4-chshift)-rh;
                var chy = _th.$el.height()/2+Math.sin(idxShift*_th.angle+angleShift-Math.PI/2)*(_th.smallR*4-chshift)-rh;
                // promien widocznego
                // dla 1-4 tak jak promien duzego -10%
                // dla 5-8 polowa duzego -10%
                // dla 9-12 jedna czwarta duzego -10%
                var rv = noc<5?_th.smallR*_factor*0.7:_th.smallR*_factor;
                // okrag styczny do glownego
                var cvx = _th.$el.width()/2+Math.cos(idxShift*_th.angle+angleShift-Math.PI/2)*(_th.smallR*4.5+rv)-rv;
                var cvy = _th.$el.height()/2+Math.sin(idxShift*_th.angle+angleShift-Math.PI/2)*(_th.smallR*4.5+rv)-rv;
                coords["rh"]=rh;
                coords["chx"]=chx;
                coords["chy"]=chy;
                coords["rv"]=rv;
                coords["cvx"]=cvx;
                coords["cvy"]=cvy;
                res.push(coords);
            });
            return res;
        },
        _calculateDetailsCoords: function(){
        	var coords = {};
        	var angle = 2*Math.PI/2.28;
            var angleShift = Math.PI/8;
        	var rh = this.smallR+this.smallR*(Math.random()-1)/10;
        	var chshift = 0;
        	var chx = this.$el.width()/2+Math.cos(angle+angleShift-Math.PI/2)*(this.smallR*4-chshift)-rh;
            var chy = this.$el.height()/2+Math.sin(angle+angleShift-Math.PI/2)*(this.smallR*4-chshift)-rh;
            var rv = this.smallR*2*0.7;
            var cvx = this.$el.width()/2+Math.cos(angle+angleShift-Math.PI/2)*(this.smallR*4.5+rv)-rv;
            var cvy = this.$el.height()/2+Math.sin(angle+angleShift-Math.PI/2)*(this.smallR*4.5+rv)-rv;
            coords["rh"]=rh;
            coords["chx"]=chx;
            coords["chy"]=chy;
            coords["rv"]=rv;
            coords["cvx"]=cvx;
            coords["cvy"]=cvy;
        	return coords;
        },
        onRequestActiveState:function(event){
            event.stopImmediatePropagation();
            if(!this.active){
                this.parent.trigger('request-as',this['cid']);
            }
        },
        changeActiveStatus:function(newActive){
            this.active = newActive;
            this.animateTransition();
        }
    });
});
