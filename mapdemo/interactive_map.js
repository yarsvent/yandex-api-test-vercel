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

      // Description
      const descriptionElement = document.createElement('div');
      descriptionElement.innerHTML = "<b>Высшая Школа Экономики</b><br>Национа́льный иссле́довательский университе́т «Вы́сшая шко́ла эконо́мики» (НИУ ВШЭ; разг. «Вы́шка») — российское федеральное государственное автономное высшее учебное заведение. Университет ведёт подготовку и исследования в области социальных и гуманитарных наук, также реализует программы в естественно-научной, медицинской, технической и сельскохозяйственной сферах.";
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
