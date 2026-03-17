setTimeout(initMap, 500);

async function initMap() {
    // Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    await ymaps3.ready.then(init);;

    function init() {
      // Иницилиазируем карту
      const map = new YMap(
          // Передаём ссылку на HTMLElement контейнера
          document.getElementById('map'),

          // Передаём параметры инициализации карты
          {
              location: {
                  // Координаты центра карты
                  center: [37.588144, 55.733842],

                  // Уровень масштабирования
                  zoom: 10
              }
          }
      );

      // Добавляем слой для отображения схематической карты
      const layer = new ymaps3.YMapDefaultSchemeLayer();
      map.addChild(layer);
    }
}
