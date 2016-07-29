define(['jquery','underscore','backbone','text!modules/123/templates/BookList.html','modules/123/ui/BookView'],function($,_,Backbone,BookListTpl,BookView){
    return Backbone.View.extend({              
        el:'#main-div',
        bookViews:{},
        template:_.template(BookListTpl),
        smallR:24,
        lastScrollLeft:0,
        initialize:function(){                     
            this.render(); 
            //this.model.on('change',this.render,this);
            this.listenTo(this,'request-as',this.onAsRequest);
            $(window).bind('resize',_.bind(this.onResize,this));
        },
        events:{
           'click #book-list':'dea' 
        },
        dea:function(event){
           console.log('deactivate');
           if(this.model.get('activeBookCid')!==undefined){
                var prev = this.bookViews[this.model.get('activeBookCid')];
                if(prev!==undefined){
                    prev.changeActiveStatus(false);
                    this.model.set('activeBookCid',undefined);
                }
           } 
        },
        onAsRequest:function(viewId){
            console.log(viewId);
            if(this.model.get('activeBookCid')!==undefined){
                var prev = this.bookViews[this.model.get('activeBookCid')];
                if(prev!==undefined)
                    this.bookViews[this.model.get('activeBookCid')].changeActiveStatus(false);
            }
            this.bookViews[viewId].changeActiveStatus(true);
            this.model.set('activeBookCid',viewId);
        },
        render:function(){         
            console.log('book list render');
            this.$el.html(this.template(this.model.toJSON()));
            this.bookViews = [];
            var _th = this;            
            this.model.get('books').each(function(book,idx){
                var bv = new BookView({smallR:_th.smallR,parent:_th,model:book}).render();            
                //console.log('ass'+bv['cid']);
                _th.bookViews[bv['cid']]=bv;
                //bv.$el.css('left',8*bv.smallR+(idx)*18*bv.smallR);
                //bv.$el.css('top',2*_th.$el.height()/4);
                //bv.$el.css('bottom','32px');
                _th.$el.find('#book-list').append(bv.el);
		        bv.trigger('post-render');
            });
            var _bookList = $('#book-list')[0];                    
            var prevIndicator = $('<div id="pr"></div>').css('left','10').css('visibility','hidden').addClass('navigation-left');
            var nextIndicator = $('<div id="ne"></div>').css('right','10').css('visibility',_bookList.offsetWidth<_bookList.scrollWidth?'visible':'hidden').addClass('navigation-right');
            prevIndicator.click(function(){
                var newScr = Math.max(_bookList.scrollLeft-100,0);
                $(_bookList).scrollLeft(newScr);
            });
            nextIndicator.click(function(){
                var newScr = Math.min(_bookList.scrollLeft+100,_bookList.scrollWidth);          
                $(_bookList).scrollLeft(newScr)
            });
            this.$el.append(prevIndicator);
            this.$el.append(nextIndicator);
            this.$el.find('#book-list').scroll(function(event){
                var scrollLeft = $('#book-list').scrollLeft();
                _th.lastScrollLeft=scrollLeft;
                $('#pr').css('visibility',scrollLeft>0?'visible':'hidden');
                $('#ne').css('visibility',_bookList.offsetWidth+_bookList.scrollLeft>=_bookList.scrollWidth?'hidden':'visible');                    
            });
            return this;
        },       
        onResize:function(event){
            console.log('resized!'+Date.now());
            this.render();
        }
    });
});
