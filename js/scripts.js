//Sistema de monitoreo de cultivo en CoopeCalifornia R.L.

// Mapa base
var map = L.map("mapid");

// Centro del mapa y nivel de acercamiento
var mapacoopevi = L.latLng([9.534628713007258, -84.352162100308789]);  
var zoomLevel = 13;

// Definición de la vista del mapa
map.setView(mapacoopevi, zoomLevel);

//Control de escala 
L.control.scale({position:'topleft',imperial:false}).addTo(map);

// Adición de las capas base
esri = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
osm = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);


///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Conjunto de control de Capas Base
var baseMaps = {
	"OpenStreetMap": osm,
	"ESRI World Imagery": esri
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Conjunto de capas overlay
var overlayMaps = {
	
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fincas de CoopeCalifornia
$.getJSON("https://raw.githubusercontent.com/CIAUCR/Coopecalifornia-R.L/main/lotes_coopecaliforniarl.geojson", function(geodata) {
	var layer_geojson_lotes_coopecaliforniarl = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "red", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Asociado: " + feature.properties.ASOCIADO + "<br>" + "Área: " + feature.properties.AREA + " ha";
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_lotes_coopecaliforniarl, 'Áreas de Producción');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Mapa de Coropletas

// Paleta de colores capa NDVI en base a 100
function getColor(d) {
    return d > 90 ? '#2b83ba' :
           d > 80 ? '#74b6ad' :
           d > 70 ? '#b7e2a8' :
           d > 60 ? '#e7f5b7' :
           d > 50 ? '#cab985' :
		   d > 40 ? '#c9965c' :
		   d > 30 ? '#bd5c3b' :
		   d > 20 ? '#d7191c' :
                    '#FFEDA0';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Selección de Asociados segun interes 

var asociados_coope = L.layerGroup().addTo(map);

function colorFincas(d) { 
	return d == "TODOS" ? '#FFFF00' :
		d == "El Tigre" ? '#FF0000' : 
		d == "La Palma" ? '#00FF00' : 
		d == "Los Angeles" ? '#FFFF00' : 
		'#000000'; 
	};
	
	
function estilo_fincas (feature) {
	return{
		fillColor: colorFincas(feature.properties.FINCA),
	};
};

function myFunction() {
	$.getJSON("https://raw.githubusercontent.com/CIAUCR/Coopecalifornia-R.L/main/lotes_coopecaliforniarl.geojson", function(geodata){
		var layer_geojson_lotes_coopecaliforniarl = L.geoJson(geodata, {
			style: estilo_fincas,
			onEachFeature: function(feature, layer) {
				var popupText = "Finca: " + feature.properties.FINCA;
				layer.bindPopup(popupText);
			}
		});
        asociados_coope.addLayer(layer_geojson_lotes_coopecaliforniarl);
	control_layers.addOverlay(layer_geojson_lotes_coopecaliforniarl, 'Fincas');
        layer_geojson_lotes_coopecaliforniarl.remove();
        });
};



function estiloSelect() {
	var miSelect = document.getElementById("estilo").value;
	
	$.getJSON("https://raw.githubusercontent.com/CIAUCR/Coopecalifornia-R.L/main/lotes_coopecaliforniarl.geojson", function(geodata){
		var layer_geojson_lotes_coopecaliforniarl = L.geoJson(geodata, {
			filter: function(feature, layer) {								
				if(miSelect != "TODOS")		
				return (feature.properties.FINCA == miSelect );
				else
				return true;
			},	
			style: estilo_fincas,
			onEachFeature: function(feature, layer) {
				var popupText = "Finca: " + feature.properties.FINCA;
				layer.bindPopup(popupText);
				map.fitBounds(layer.getBounds());
			}
		});
                asociados_coope.clearLayers();
		asociados_coope.addLayer(layer_geojson_lotes_coopecaliforniarl);
	});		
};
	


$.getJSON("https://raw.githubusercontent.com/CIAUCR/Coopecalifornia-R.L/e230efa2e683e68282e126b900fc8b7574e721d2/Geojson/rendimientohistorico.geojson", function(geodata) {
  var layer_geojson_historial = L.geoJson(geodata, {
    style: function(feature) {
      return {'color': "orange", 'weight': 1, 'fillOpacity': 0.0}
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip("Click en el gráfico ver la producción historica", {
        sticky: true,
        direction: "top"
      });
      layer.on({
        click: function (e) {  
        
      
        var xyValues = [
  {t:new Date("2016-10-01"), y:feature.properties.oct_16},
  {t:new Date("2016-11-01"), y:feature.properties.nov_16},
  {t:new Date("2016-12-01"), y:feature.properties.dic_16},
  {t:new Date("2017-01-01"), y:feature.properties.ene_17},
  {t:new Date("2017-02-01"), y:feature.properties.feb_17},
  {t:new Date("2017-03-01"), y:feature.properties.mar_17},
  {t:new Date("2017-04-01"), y:feature.properties.abr_17},
  {t:new Date("2017-05-01"), y:feature.properties.may_17},
  {t:new Date("2017-06-01"), y:feature.properties.jun_17},
  {t:new Date("2017-07-01"), y:feature.properties.jul_17},
  {t:new Date("2017-08-01"), y:feature.properties.ago_17},
  {t:new Date("2017-09-01"), y:feature.properties.sep_17},
  {t:new Date("2017-10-01"), y:feature.properties.oct_17},
  {t:new Date("2017-11-01"), y:feature.properties.nov_17},
  {t:new Date("2017-12-01"), y:feature.properties.dic_17},
  {t:new Date("2018-01-01"), y:feature.properties.ene_18},
  {t:new Date("2018-02-01"), y:feature.properties.feb_18},
  {t:new Date("2018-03-01"), y:feature.properties.mar_18},
  {t:new Date("2018-04-01"), y:feature.properties.abr_18},
  {t:new Date("2018-05-01"), y:feature.properties.may_18},
  {t:new Date("2018-06-01"), y:feature.properties.jun_18},
  {t:new Date("2018-07-01"), y:feature.properties.jul_18},
  {t:new Date("2018-08-01"), y:feature.properties.ago_18},
  {t:new Date("2018-09-01"), y:feature.properties.sep_18}
];

                
        Highcharts.chart('container', {

    title: {
        text: 'Evolución de la producción para el lote seleccionado (' + feature.properties.ASOCIADO + ')'
    },

    subtitle: {
        text: 'Si se coloca sobre el punto podrá ver el valor de producción en Toneladas'
    },
    
    yAxis: {
        title: {
            text: 'Toneladas totales'
        }
    },
    
    xAxis: { 
        title: {
            text: 'Fecha'
        },
        categories: ['Oct 2016', 'Nov 2016', 'Dic 2016', 'Ene 2017', 'Feb 2017', 'Mar 2017', 'Abr 2017', 'May 2017', 'Jun 2017','Jul 2017', 'Ago 2017', 'Sep 2017', 'Oct 2017', 'Nov 2017', 'Dic 2017','Ene 2018', 'Feb 2018', 'Mar 2018', 'Abr 2018', 'May 2018', 'Jun 2018','Jul 2018', 'Ago 2018', 'Sep 2018']
    },
    
    plotOptions: {
       yAxis_label_text: 'S1',
       series: {
            events: {
                afterAnimate: function () {
                    this.chart.renderer.label('Línea de evolución de producción ha aparecido', 10, 350)
                        .attr({
                            padding: 10,
                            fill: Highcharts.getOptions().colors[0]
                        })
                        .css({
                            color: 'white',
                             
                        })
                        .add();
                }
            }
        }
    },

    series: [{
    name: 'Producción',
        data: xyValues
    }]
});
       layer.bindPopup(container)
        }
      });
    }
  }).addTo(map);
  
  control_layers.addOverlay(layer_geojson_historial, 'Historial de Cosecha por Finca');
});




// Ubicacion del control de capas
control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topright', "autoZIndex": true, collapsed:true}).addTo(map);	





 

















