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
  return rand.numb2(37.323534155040264,37.930571172086076);
}
function random_y() {
  return rand.numb2(55.944811001873,55.578215891268236);
}

setTimeout(initMap, 1);
let myMap;
function initMap() {
  ymaps.ready(init);
  function init() {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7
      }, {
        yandexMapDisablePoiInteractivity: true,
        yandexMapType : "future_map",
        dragCursor: "crosshair"
      }
    );
    myMap.controls.remove('geolocationControl'); // удаляем геолокацию
    myMap.controls.remove('searchControl'); // удаляем поиск
    myMap.controls.remove('trafficControl'); // удаляем контроль трафика
    myMap.controls.remove('typeSelector'); // удаляем тип
    myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
    myMap.controls.remove('rulerControl'); // удаляем контрол линейки
    //myMap.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

    function MyBehavior() {
    // Определим свойства класса
    this.options = new ymaps.option.Manager(); // Менеджер опций
    this.events = new ymaps.event.Manager(); // Менеджер событий
    }

    // Определим методы.
    MyBehavior.prototype = {
        constructor: MyBehavior,
        enable: function () {
            this._parent.getMap().events.add('click', this._onClick, this);
        },
        disable: function () {
            this._parent.getMap().events.remove('click', this._onClick, this);
        },
        setParent: function (parent) { this._parent = parent; },
        getParent: function () { return this._parent; },
        _onClick: function (e) {
            let coords = e.get('coords');
            //this._parent.getMap().setCenter(coords);
            answerPanorama(coords);
        }
    };
    ymaps.behavior.storage.add('mybehavior', MyBehavior);
    myMap.behaviors.enable('mybehavior');
  }
}

let panoramaPlacemark;
let panoramaCoords;
let answerPlacemark;
let answerCoords;
let answerLine;
let answered = false;

function displayPanorama(x, y) {
  // Получение объекта Panorama.
  var locateRequest = ymaps.panorama.locate([x || 55.83403, y || 37.623370]);

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
              direction: 'auto',
              hotkeysEnabled : false,
              suppressMapOpenBlock : true,
              controls : []
        });
        player.events.add(["panoramachange"], function (e) {
          const panorama = player.getPanorama();
          panorama.setMarkers([]);
          player.setPanorama(panorama);
        });
      } else {
        console.log("В заданной точке нет панорам.");
      }
    }
  );
}

function nextLocation() {
  let t_coords = rand.list(LOCATION_DATA.moscow);

  answered = false;

  if (!!panoramaPlacemark) myMap.geoObjects.remove(panoramaPlacemark);
  if (!!answerPlacemark) myMap.geoObjects.remove(answerPlacemark);
  if (!!answerLine) myMap.geoObjects.remove(answerLine);

  //panoramaPlacemark = new ymaps.GeoObject({
  //    geometry: {
  //        type: "Point",
  //        coordinates: t_coords
  //    }
  //});
  //myMap.geoObjects.add(panoramaPlacemark);
  panoramaCoords = t_coords;
  answerCoords = t_coords;

  displayPanorama(t_coords[0], t_coords[1]);
}

function answerPanorama(coords) {
  if (answered) return;
  answered = true;
  answerCoords = coords;

  myMap.setCenter(answerCoords);
  answerLine = new ymaps.GeoObject({
    geometry: {
        type: "LineString",
        coordinates: [
            answerCoords,
            panoramaCoords
        ]
    }
  }, {
    strokeWidth: 4
  });
  myMap.geoObjects.add(answerLine);

  answerPlacemark = new ymaps.GeoObject({
      geometry: {
          type: "Point",
          coordinates: coords
      }
  });
  myMap.geoObjects.add(answerPlacemark);
  panoramaPlacemark = new ymaps.GeoObject({
      geometry: {
          type: "Point",
          coordinates: t_coords
      }
  }, {
    fillColor: '#FF0000'
  });
  myMap.geoObjects.add(panoramaPlacemark);

  let t_answer = haversineDistanceKM(answerCoords[0],answerCoords[1],panoramaCoords[0],panoramaCoords[1]);
  if (t_answer >= 1) {
    let t_answer_display = t_answer.toFixed(1);
    alert('Расстояние до места: '+t_answer_display+' километра.');
  }
  else {
    let t_answer_display = Math.floor(t_answer/1000);
    alert('Расстояние до места: '+t_answer+' метров.');
  }
}

function haversineDistanceKM(lat1Deg, lon1Deg, lat2Deg, lon2Deg) {
    function toRad(degree) {
        return degree * Math.PI / 180;
    }

    const lat1 = toRad(lat1Deg);
    const lon1 = toRad(lon1Deg);
    const lat2 = toRad(lat2Deg);
    const lon2 = toRad(lon2Deg);

    const { sin, cos, sqrt, atan2 } = Math;

    const R = 6371; // earth radius in km
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = sin(dLat / 2) * sin(dLat / 2)
            + cos(lat1) * cos(lat2)
            * sin(dLon / 2) * sin(dLon / 2);
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    const d = R * c;
    return d; // distance in km
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
