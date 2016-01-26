define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'esri/symbols/PictureMarkerSymbol',
	'esri/renderers/ClassBreaksRenderer',
	'./ClusterLayer'
	], function(
		declare,
		lang,
		PictureMarkerSymbol,
		ClassBreaksRenderer,
		ClusterLayer
	) {
		return declare("application.ClusterHandler", [ClusterLayer], {
			
			constructor: function(options) {
				lang.mixin(this, options);
				
				//Required
				this._map = options.map;
				this._maxScale = options.maxScale;
				this._symbolFewUrl = options.symbolFewUrl;
				this._symbolSeveralUrl = options.symbolSeveralUrl;
				this._symbolManyUrl = options.symbolManyUrl;
				
				//Optional
				this._symbolFewWidth = options.symbolFewWidth || 24;
				this._symbolFewHeight = options.symbolFewHeight || 24;
				this._symbolSeveralWidth = options.symbolSeveralWidth || 48;
				this._symbolSeveralHeight = options.symbolSeveralHeight || 48;
				this._symbolManyWidth = options.symbolManyWidth || 54;
				this._symbolManyHeight = options.symbolManyHeight || 54;
				
				//Init
				this._init();				
			},
			
			_init: function()
			{
				this.setScaleRange(0, this._maxScale);
	
				var symbolFew = new PictureMarkerSymbol({
					"angle":0,
					"xoffset":0,
					"yoffset":11.25,
					"type":"esriPMS",
					"url": this._symbolFewUrl,
					"contentType":"image/png",
					"width": this._symbolFewWidth,
					"height": this._symbolFewHeight
				});
				var symbolSeveral = new PictureMarkerSymbol({
					"angle":0,
					"xoffset":0,
					"yoffset":11.25,
					"type":"esriPMS",
					"url": this._symbolSeveralUrl,
					"contentType":"image/png",
					"width": this._symbolSeveralWidth,
					"height": this._symbolSeveralHeight
				});
				var symbolMany = new PictureMarkerSymbol({
					"angle":0,
					"xoffset":0,
					"yoffset":11.25,
					"type":"esriPMS",
					"url": this._symbolManyUrl,
					"contentType":"image/png",
					"width": this._symbolManyWidth,
					"height": this._symbolManyHeight
				});
				
				var renderer = new ClassBreaksRenderer(null, "clusterCount");	
				renderer.addBreak(0, 2, symbolFew);
				renderer.addBreak(2, (this._clusterData.length * 0.2), symbolSeveral);
				renderer.addBreak((this._clusterData.length * 0.2), (this._maxSingles + 1), symbolMany);

				this.setRenderer(renderer);
				
				this._map.addLayer(this);
			},
			
			update: function(clusterData)
			{
				this.clear();
				this._clusterData = clusterData;
				this._clusterGraphics();
			},
		});
	}
);