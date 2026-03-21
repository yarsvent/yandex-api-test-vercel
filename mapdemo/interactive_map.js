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
                  zoom: 15
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

      const markerElement = document.createElement('div');
      markerElement.className = 'map-marker';
      markerElement.innerText = "ВШЭ";

      const marker = new ymaps3.YMapMarker(
        {
          coordinates: [37.648308, 55.753636],
          draggable: false
        },
        markerElement
      );

      const descriptionElement = document.createElement('div');
      descriptionElement.innerHTML = "Meow<br>Meow meow";
      descriptionElement.classList.add("map-description");
      markerElement.appendChild(descriptionElement);

      markerElement.addEventListener("click", function() {
        descriptionElement.style.display = "block";
      });
      markerElement.addEventListener("mouseout", function() {
        descriptionElement.style.display = "none";
      });

      map
        .addChild(marker);
    }
}
