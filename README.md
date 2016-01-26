# PhotoSearch Widget

The *PhotoSearch* widget for the [Web AppBuilder for ArcGIS](https://developers.arcgis.com/web-appbuilder/) allows users to search for Flickr photos and display them on the map.

## Use Case

This widget helps to easily plan holidays and trips. Search for photos such as for hiking or canoeing. Geotagged photos who's title, description or tags contain the search text will be be displayed on the map. Make a selection by deleting photos from the map.


## Features

*	Search for geotagged photos via [flickr.photos.search](https://www.flickr.com/services/api/flickr.photos.search.html) by text (free text search)
*	Define the search time: all time, last month, last 7 days, last 24 hours
*	Clusters the results depending on the zoom level
*	Allows the user to delete photos from the map

## Requirements

*    Minimum requirement is ArcGIS Web AppBuilder 1.2
*    [Flickr key](https://www.flickr.com/services/api/misc.api_keys.html)


## Instructions

In order to use, develop and test the Photo-Search-Widget you need to deploy the widget directory *PhotoSearch* to the stemapp/widgets directory in your Web AppBuilder installation.

For more ressources on developing and modifying widgets please visit [Web AppBuilder for ArcGIS (Developer Edition)](https://developers.arcgis.com/web-appbuilder/)

##References

This widget is based on source code from other projects:

*	[FlickrLayer](https://github.com/Esri/public-information-map-template-js/blob/master/js/FlickrLayer.js) from [public-information-map-template-js](https://github.com/Esri/public-information-map-template-js)
*	early version of the [Cluster Layer](https://github.com/Esri/cluster-layer-js)


## Licensing
Copyright 2016 Esri Deutschland GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://github.com/EsriDE/Photo-Search-Widget/blob/master/license.txt) file.

[](Esri Tags: ArcGIS Web AppBuilder widget)
[](Esri Language: JavaScript)