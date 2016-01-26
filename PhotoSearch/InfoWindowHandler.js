define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/dom-style',
	'dojo/dom-construct',
	"dojo/Evented",
	], function(
		declare,
		lang,
		domStyle,
		domConstruct,
		Evented
	) {
		return declare("application.InfoWindowHandler", [Evented], {
			
			constructor: function(options) {
				
				//Required
				this._map = options.map;
				this._isMobile = options.isMobile;
				this._classDeleteButton = options.classDeleteButton;
				this._classDeleteButtonMobile = options.classDeleteButtonMobile;
				this._deleteButtonLabel = options.deleteButtonLabel;
			
				//Init
				this._init();
			},
			
			//Call after the graphic has been deleted from the feature layer
			refreshPopup: function()
			{
				console.log(this);
				
				//Refresh popup
				if(this._graphicsSelected.length > 0)
				{
					if(!this._isMobile)
					{
						if(this._graphicShownIndex == this._graphicsSelected.length)
						{
							this._map.infoWindow.selectPrevious();
							this._graphicShownIndex--;
						}
						else
						{
							this._map.infoWindow._updateUI();
							this._map.infoWindow._updateWindow();
						}
						
						if(this._graphicsSelected.length == 1)
						{
							this._graphicShownIndex = 0;
						}
						
						this._graphic = this._graphicsSelected[this._graphicShownIndex];
					
					}
					else
					{
						if(this._graphicsSelected.length > 1)
						{
							if(this._graphicShownIndex == this._graphicsSelected.length)
							{
								this._previous();
							}
							else if(this._graphicShownIndex == this._graphicsSelected.length - 1)
							{
								this._previous();
								this._next();
							}
							else
							{
								this._next();
								this._previous();
							}
						}
						else if(this._graphicsSelected.length == 1)
						{
							this._previous();
						}
					}
				}
				else
				{
					this._closePopup();
				}
			},
			
			_init: function()
			{
				this._map.infoWindow.on("show", lang.hitch(this, this._onShow));
			},
			
			_onShow: function(evt)
			{
				//Display
				this._display();
				
				//Data
				this._graphicsSelected = this._map.infoWindow.features;
				this._graphicShownIndex = 0;
				this._graphic = this._graphicsSelected[this._graphicShownIndex];
			
				//Refresh
				if(this._graphicsSelected.length > 1)
				{
					this._next();
					this._previous();
				}	
			},
			
			_display: function()
			{
				if(this._isMobile)
				{
					//Hide small mobile popup
					domStyle.set(dojo.query(".esriPopupMobile")[0], 'display', 'none');
					
					//Show full size popup
					domStyle.set(dojo.query(".esriMobileNavigationBar")[0], 'display', 'block');
					domStyle.set(dojo.query(".esriMobileInfoView")[0], 'display', 'block');
					
					//Next and previous buttons 
					domStyle.set(dojo.query(".esriMobileNavigationItem.right")[0], 'display', 'none');
					domStyle.set(dojo.query(".esriMobileNavigationItem.right1")[0], 'right', '0px');
					domStyle.set(dojo.query(".esriMobileNavigationItem.right2")[0], 'right', '36px');
				}
				
				//Delete button
				if((this._isMobile && dojo.query("." + this._classDeleteButtonMobile)[0] == null) ||
				   (! this._isMobile && dojo.query("." + this._classDeleteButton)[0] == null))
				{
					this._initDeleteButton();
					this._connectNextButton();
					this._connectPreviousButton();
				}

			},
			
			_initDeleteButton: function()
			{
				var cssClass;
				var cssStyle = "";
				if(this._isMobile)
				{
					var refNode = dojo.query(".esriMobileInfoViewItem")[2];
					var refPos = "first";
					cssClass = this._classDeleteButtonMobile;
					cssStyle = "float:right; position:absolute; right:5px; top:0; margin-top:4px;";
				}
				else
				{
					var refNode = dojo.query(".actionList", dojo.query(".esriPopup")[0])[0];
					var refPos = "last";
					cssClass = this._classDeleteButton;
				}
				var node = "<div class='" + cssClass + " jimu-btn' style='" + cssStyle + "'>" + this._deleteButtonLabel + "</div>";
				domConstruct.place(node, refNode, refPos);
				
				this._connectDeleteButton();
			},
			
			_connectDeleteButton: function()
			{
				dojo.disconnect(this._flickrDeleteGraphicHandle);
		
				var refNode;
				if(this._isMobile)
				{
					refNode = dojo.query("." + this._classDeleteButtonMobile)[0];
				}
				else
				{
					refNode = dojo.query("." + this._classDeleteButton)[0];
				}
				this._flickrDeleteGraphicHandle = dojo.connect(refNode, "click", lang.hitch(this, this._onDeleteClicked));

			},
			
			_onDeleteClicked: function()
			{
				//Data
				var index = this._graphicsSelected.indexOf(this._graphic);
				if(index != -1) 
				{
					this._graphicsSelected.splice(index, 1);
				}
				
				//Inform
				this.emit("delete-graphic", this._graphic);
			},
			
			_connectNextButton: function()
			{
				var selector;
				if(this._isMobile)
				{
					selector = ".esriMobileNavigationItem.right1";
				}
				else
				{
					selector = ".titleButton.next";
				}
				
				dojo.connect(dojo.query(selector)[0], "click", lang.hitch(this, function(evt) {
					if(this._graphicsSelected.length == 1)
					{
						this._graphicShownIndex = 0;
					}
					else
					{
						this._graphicShownIndex++;
					}
					this._graphic = this._graphicsSelected[this._graphicShownIndex];
				}));
			},
			
			_connectPreviousButton: function()
			{
				var selector;
				if(this._isMobile)
				{
					selector = ".esriMobileNavigationItem.right2";
				}
				else
				{
					selector = ".titleButton.prev";
				}
				
				dojo.connect(dojo.query(selector)[0], "click", lang.hitch(this, function(evt) {
					if(this._graphicsSelected.length == 1)
					{
						this._graphicShownIndex = 0;
					}
					else
					{
						this._graphicShownIndex--;
					}
					this._graphic = this._graphicsSelected[this._graphicShownIndex];
				}));
			},
			
			
			_next: function()
			{
				if(this._isMobile)
				{
					dojo.query("img", dojo.query(".esriMobileNavigationItem.right1")[0])[0].click();
				}
				else
				{
					dojo.query(".titleButton.next")[0].click();
				}
			},
			
			_previous: function()
			{
				if(this._isMobile)
				{
					dojo.query("img", dojo.query(".esriMobileNavigationItem.right2")[0])[0].click();
				}
				else
				{
					dojo.query(".titleButton.prev")[0].click();
				}
			},
			
			_closePopup: function()
			{
				if(this._isMobile)
				{
					dojo.query("img", dojo.query(".esriMobileNavigationItem.left")[0])[0].click();
				}
				else
				{
					dojo.query(".titleButton.close")[0].click();
				}
			}
			
		});
	}
);