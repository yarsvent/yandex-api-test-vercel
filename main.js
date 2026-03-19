var rand = {};
  rand.percent = function(percent) {
    return Math.random() * 100 <= percent;
  }
  rand.numb = function(max) {
    return Math.floor(Math.random() * max + 1);
  }
  rand.list = function(list) {
    var tmp = list[Math.floor(Math.random() * list.length)];
    return tmp;
  }
  rand.prop = function(obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
  };
  rand.prop2 = function(obj) {
    var keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
  };
  rand.numb2 = function(min,max) {
    return Math.random() * (max - min) + min;
  }

function random_x() {
  return rand.numb2(20,70);
}
function random_y() {
  return rand.numb2(20,40);
}

setTimeout(initMap, 1);
function initMap() {
  ymaps.ready(init);
  function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        yandexMapDisablePoiInteractivity: true,
        zoom: 7
    });
    myMap.controls.remove('geolocationControl'); // удаляем геолокацию
    myMap.controls.remove('searchControl'); // удаляем поиск
    myMap.controls.remove('trafficControl'); // удаляем контроль трафика
    myMap.controls.remove('typeSelector'); // удаляем тип
    myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
    myMap.controls.remove('rulerControl'); // удаляем контрол линейки
    //myMap.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
  }
}

function displayPanorama() {
  // Получение объекта Panorama.
  var locateRequest = ymaps.panorama.locate([55.83403, 37.623370]);

  // Функция ymaps.panorama.locate возвращает Promise-объект,
  // который разрешится массивом с найденной панорамой либо пустым
  // массивом, если в окрестностях точки панорам не нашлось.
  locateRequest.then(
    function (panoramas) {
      if (panoramas.length) {
        // Создание на странице плеера панорам.
        var player = new ymaps.panorama.Player('panoramaDisplay', panoramas[0], {
              // Опции панорамы.
              // direction - направление взгляда.
              direction: [0, -50]
            });
      } else {
        console.log("В заданной точке нет панорам.");
      }
    }
  );
}

function nextLocation() {

}

// OLD V3 Code
/*
setTimeout(initMap, 1);
async function initMap() {
    const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    await ymaps3.ready.then(init);

    function init() {
      const map = new YMap(
          document.getElementById('map'),
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
      markerElement.className = 'marker-class';
      markerElement.innerText = "Пидорасы";

      const marker = new ymaps3.YMapMarker(
        {
          coordinates: [37.648308, 55.753636],
          draggable: false
        },
        markerElement
      );

      map
        .addChild(marker);
    }
}*/
