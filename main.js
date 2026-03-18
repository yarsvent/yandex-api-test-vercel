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

setTimeout(initMap, 500);

function random_x() {
  return rand.numb2(20,70);
}
function random_y() {
  return rand.numb2(20,40);
}

async function initMap() {
    // Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    await ymaps3.ready.then(init);

    function init() {
      const map = new YMap(
          document.getElementById('map'),
          {
              location: {
                  center: [random_x(), random_y()],
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

function generatePanorama() {
  var locateRequest = ymaps3.panorama.locate([55.83403, 37.623370]);

  locateRequest.then(
    function (panoramas) {
      if (panoramas.length) {
        // Создание на странице плеера панорам.
        var player = new ymaps3.panorama.Player('div_id', panoramas[0], {
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
