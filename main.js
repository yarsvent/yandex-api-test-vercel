setTimeout(initMap, 500);

async function initMap() {
    // Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    await ymaps3.ready.then(init);

    function init() {
      const map = new YMap(
          document.getElementById('map'),
          {
              location: {
                  center: [37.588144, 55.733842],
                  duration: 200,
                  zoom: 10
              }
          }
      );

      const layer = new ymaps3.YMapDefaultSchemeLayer({
        customization: [
          // Делаем прозрачными все геометрии водных объектов.
          {
            tags: {
              all: ['water']
            },
            elements: 'geometry',
            stylers: [
              {
                opacity: 0
              }
            ]
          },
          // Меняем цвет подписей для всех POI и узлов сети общественного транспорта.
          {
            tags: {
              any: ['industrial']
            },
            elements: 'geometry.fill',
            stylers: [
              {
                color: '#FF0000'
              }
            ]
          }
        ]
      });
      map.addChild(layer);
    }
}
