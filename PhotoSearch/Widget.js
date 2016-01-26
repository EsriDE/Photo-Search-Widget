define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'jimu/BaseWidget',
	'./FlickrHandler',
	'./ClusterHandler',
	'./InfoWindowHandler'
],
function(
	declare,
	lang,
	array,
	BaseWidget,
	FlickrHandler,
	ClusterHandler,
	InfoWindowHandler
	) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // FlickrWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-photo-search',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
	  
	  this.setConfig(this.config);
	  
	  this._graphics = [];
	  this._updateStatusNode();
	  
	  this._initInfoWindowHandler();
    },
	
	setConfig: function(config){
	  this.timeNode.value = config.time;
    },

    startup: function() {
      this.inherited(arguments);
      console.log('startup');
	  
	  this._initFlickrLayer();
    },
	
	_initInfoWindowHandler: function()
	{
		this._infoWindowHandler = new InfoWindowHandler({
			map: this.map,
			isMobile: window.appInfo.isRunInMobile,
			classDeleteButton: "classDeleteButton",
			classDeleteButtonMobile: "deleteGraphicMobile",
			deleteButtonLabel: this.nls.deleteLabel
		});
		
		this._infoWindowHandler.on("delete-graphic", lang.hitch(this, function(graphic)
		{
			console.log('delete-graphic');
			
			//Remove from feature layer
			this._flickrHandler.featureLayer.applyEdits(null, null, [graphic]);
			
			//Refresh popup
			this._infoWindowHandler.refreshPopup();
			
			//Update graphics array
			for(var i = 0; i < this._graphics.length; i++)
			{
				if(this._graphics[i].attributes["OBJECTID"] == graphic.attributes["OBJECTID"])
				{
					this._graphics.splice(i, 1);
					break;
				}
			}
			
			//Refresh status node
			this._updateStatusNode();
			
			//Update cluster layer
			var clusterData = this._mapClusterData();
			this._clusterHandler.update(clusterData);
		}));
	},
	
	_initFlickrLayer: function()
	{
		this._flickrHandler = new FlickrHandler({
			map: this.map,
			minScale: this.config.switchViewAtScale,
			time: this.config.time,
			searchTerm: this.config.searchTerm,
			key: this.config.flickrKey,
			imagePath: this.folderUrl + "images/pin_flickr.png"
		});
		
		this._flickrHandler.on("update", lang.hitch(this, function(data) 
		{
			this._graphics = this._graphics.concat(data.graphics);		
			this._updateStatusNode();			
		}));
		
		this._flickrHandler.on("update-end", lang.hitch(this, function() 
		{
			var clusterData = this._mapClusterData();
			
			if(typeof this._clusterHandler == 'undefined') 
			{
				this._clusterHandler = new ClusterHandler({
					"data": clusterData,
					"distance": 100,
					"labelColor": "#fff",
					"labelOffset": 10,
					"singleTemplate": this._flickrHandler.featureLayer.infoTemplate,
					"showSingles" : false,
					"maxSingles": 5000,
					"map": this.map,
					"maxScale": this.config.switchViewAtScale,
					"symbolFewUrl": this.folderUrl + "images/pin_blue.png",
					"symbolSeveralUrl": this.folderUrl + "images/pin_green.png",
					"symbolManyUrl": this.folderUrl + "/images/pin_red.png",
				});
			}
			else 
			{
				this._clusterHandler.update(clusterData);
			}
		}));
	},
	
	_mapClusterData: function()
	{
		return clusterData = array.map(this._graphics, function(feature){
			return {
				"x": feature.geometry.x,
				"y": feature.geometry.y,
				"attributes": feature.attributes,
			};
		});
	},

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },
	
	onSearchClicked: function() {
		console.log('onSearchClicked');
		this._clearMap();
		this._flickrHandler.search(this.searchTermNode.value, this.timeNode.value);
	},
	
	_clearMap: function()
	{
		this._flickrHandler.clear();
		this._graphics = [];
		this._updateStatusNode();
	},
	
	_updateStatusNode: function()
	{
		this.statusNode.innerHTML = this._graphics.length;
	}
  });
});