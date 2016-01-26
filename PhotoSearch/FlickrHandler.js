define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'./FlickrLayer'
	], function(
		declare,
		lang,
		FlickrLayer
	) {
		return declare("application.FlickrHandler", [FlickrLayer], {
			
			constructor: function(options) {
				lang.mixin(this, options);
			},
			
			search: function(searchTerm, time)
			{
				this.set("searchTerm", searchTerm);
				this.set("time", time);
			}
		});
	}
);