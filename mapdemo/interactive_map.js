setTimeout(initMap, 1);
async function initMap() {
    const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    await ymaps3.ready.then(init);

    function init() {
      const map = new YMap(
          document.getElementById('interactiveMap'),
          {
              location: {
                  center: [37.648308, 55.753636],
                  zoom: 1
              }
          }
      );

      const layer = new ymaps3.YMapDefaultSchemeLayer({
        customization: [
          //{
          //  tags: {
          //    any: ['industrial']
          //  },
          //  elements: 'geometry.fill',
          //  stylers: [
          //    {
          //      color: '#CC0000'
          //    }
          //  ]
          //}
        ]
      });
      map.addChild(layer);

      const features_layer = new ymaps3.YMapDefaultFeaturesLayer();
      map.addChild(features_layer);

      const locationMarkers = {};
      for (let place of LOCATION_DATA) {
        locationMarkers[place] = document.createElement('div');
        const markerElement = locationMarkers[place];
        markerElement.className = 'map-marker';
        markerElement.innerHTML = "<span style=\"background-image: url('mapdemo/flags/"+place.flag+"')\" "+"class=\"map-flag\"></span>"+place.name;

        const marker = new ymaps3.YMapMarker(
          {
            coordinates: place.location,
            draggable: false
          },
          markerElement
        );

        // Description
        const descriptionElement = document.createElement('div');
        descriptionElement.innerHTML = "<b>"+place.full_name+"</b><br>"+place.description;
        descriptionElement.classList.add("map-description");
        markerElement.appendChild(descriptionElement);

        markerElement.addEventListener("click", function() {
          descriptionElement.style.display = "block";
        });
        //markerElement.addEventListener("mouseout", function() {
        //  descriptionElement.style.display = "none";
        //});

        map
          .addChild(marker);
      }
    }
}
