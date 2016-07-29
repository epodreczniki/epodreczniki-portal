define([
	'underscore',
	'backbone',
	'./../app/util/md5'
	], function (_, Backbone, md5) {
    return Backbone.Model.extend({
    	
        defaults: {
            authors: {},
            galleries: {},
            galleriesLastID: 0,
            ccommands: [],
            pins: [],
            ccs: [],
            educations: []
        },
        
        putAuthor: function(obj) {
        	var author = {
        		email: obj.email,
        		firstname: obj.firstname,
        		fullname: obj.fullname,
        		surname: obj.surname
        	};
        	
        	var key = md5.md5(author.email + author.firstname + author.fullname + author.surname);
        	
        	var authors = this.get('authors');
        	authors[key] = author;
        	this.set('authors', authors);
        	// this.save();
        	this.trigger('cache:author:changed', this);
        },
        
        clearAuthors: function() {
        	this.set('authors', {});
        	// this.save();
        	this.trigger('cache:author:changed', this);	
        },
        
        putCcommand: function(ccommand){
        	var ccommands = this.get('ccommands');
        	ccommands.push(ccommand);
        	this.set('ccommands', ccommands);
        	// this.save();
        	this.trigger('cache:ccommand:changed', this);
        },

        clearCcommands: function(){
        	this.set('ccommands', []);
        	// this.save();
        	this.trigger('cache:ccommand:changed', this);	
        },
        
        putPin: function(pin){
        	var pins = this.get('pins');
        	pins.push(pin);
        	this.set('pins', pins);
        	// this.save();
        	this.trigger('cache:pin:changed', this);
        },
        
        clearPins: function(){
        	this.set('pins', []);
        	// // this.save();
        	this.trigger('cache:pin:changed', this);	
        },
        
        putCcs: function(cc){
        	var ccs = this.get('ccs');
        	ccs.push(cc);
        	this.set('ccs', ccs);
        	// this.save();
        	this.trigger('cache:ccs:changed', this);
        },
        
        clearCcs: function(){
        	this.set('ccs', []);
        	// this.save();
        	this.trigger('cache:ccs:changed', this);
        },
        
        putEducation: function(education){
        	var educations = this.get('educations');
        	educations.push(education);
        	this.set('educations', educations);
        	// this.save();
        	this.trigger('cache:educations:changed', this);
        },
        
        clearEducations: function(){
        	this.set('educations', []);
        	// this.save();
        	this.trigger('cache:educations:changed', this);
        },
        setTreeData: function(data){
			this.set('treeData', data);
			this.trigger('cache:treeData:changed', this);
		},
		setSelectedTreeDataPath: function(pathId){
			this.set('selectedTreeDataPath', pathId);
			this.trigger('cache:selectedTreeDataPath:changed', this);
		},
		clearTreeData: function(){
			this.set('treeData', null);
			this.set('selectedTreeDataPath', null);
			this.trigger('cache:treeData:changed', this);	
		},
        putGallery: function(gallery) {
        	
        	if (gallery.items.length == 0) {
        		return;
        	}
        	var key = this.createGalleryKey(gallery.items);
        	var galleries = this.get('galleries');
        	
        	if (galleries[key] == undefined) {
				
				var galleriesLastID = this.get('galleriesLastID');
				galleriesLastID++;
				this.set('galleriesLastID', galleriesLastID);
				gallery.name = 'Galeria nr ' + galleriesLastID;
				gallery.key = key;
				galleries[key] = gallery;
				this.set('galleries', galleries);
				// this.save();
//				this.save(null, {
//			        success: function(model, response) {
//			        	console.log('>>> success');
//			            console.log(response);
//			        },
//			        error: function(model, response) {
//			        	console.log('>>>> error');
//			            console.log(response);
//			        },
//			        wait: false
//			    });
				this.trigger('cache:galleries:changed', this);
        	}
        },
        
        createGalleryKey: function(array) {
        	var key = "";
        	
        	_.each(array, function (gallery) {
        		
        		key += gallery.womi.id + ":";
        		key += (gallery.womiRelated != null ? gallery.womiRelated.id : "null")  + ":";
        		key +=  gallery.position + ":";
        	});
        	
        	return  md5.md5(key);
        },
        
        removeGallery: function(key) {
        	
        	var galleries = this.get('galleries');
        	delete galleries[key];
        	this.set('galleries', galleries);
			// this.save();
			this.trigger('cache:galleries:changed', this);
        },
        
        getGalleries: function() {
        	
        	var array = new Array();
        	
        	var galleries = this.get('galleries');
        	for (var key in galleries) {
        		
        		var gallery = galleries[key];
        		gallery.key = key;
        		array.push(gallery);
        	}
        	
        	return array;
        },
        
        changeGalleryName: function (key, name) {
        	
        	var galleries = this.get('galleries');
        	galleries[key].name = name;
        	this.set('galleries', galleries);
			// this.save();
			this.trigger('cache:galleries:changed', this);
        }, 
        
        clearModel: function(){
        	 this.set('authors', {});
             this.set('galleries', {});
             this.set('ccommands', []);
             this.set('pins', []);
             this.set('ccs', []);
             this.set('educations', []);
             this.clearTreeData();
         	 // this.save();
        }
        
    });
});
