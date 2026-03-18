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
                  //center: [37.588144, 55.733842],
                  bounds: [[-0.118092, 51.509865], [-0.118092, 51.509865]],
                  zoom: 15
              }
          }
      );

      const layer = new ymaps3.YMapDefaultSchemeLayer();
      map.addChild(layer);
    }
}
