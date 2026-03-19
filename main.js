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
        dragCursor: "crosshair",
        autoFitToViewport : "always"
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
            placeAnswer(coords);
        }
    };
    ymaps.behavior.storage.add('mybehavior', MyBehavior);
    myMap.behaviors.enable('mybehavior');
  }
}

let panoramaPlacemark;
let panoramaCoords;
let panoramaPlayer;
let answerPlacemark;
let answerCoords;
let answerLine;
let answered = false;
let answerScore = 0;
let gameRound = 0;

function displayPanorama(x, y) {
  // Получение объекта Panorama.
  var locateRequest = ymaps.panorama.locate([x || 55.83403, y || 37.623370]);

  // Функция ymaps.panorama.locate возвращает Promise-объект,
  // который разрешится массивом с найденной панорамой либо пустым
  // массивом, если в окрестностях точки панорам не нашлось.
  if (panoramaPlayer) panoramaPlayer.destroy();
  locateRequest.then(
    function (panoramas) {
      if (panoramas.length) {
        // Создание на странице плеера панорам.
        panoramaPlayer = new ymaps.panorama.Player('panoramaDisplay', panoramas[0], {
              // Опции панорамы.
              // direction - направление взгляда.
              direction: 'auto',
              hotkeysEnabled : false,
              suppressMapOpenBlock : true,
              controls : []
        });
      } else {
        console.log("В заданной точке нет панорам.");
      }
    }
  );
}

function startGame() {
  document.getElementById('startButton').style.display = 'none';
  document.getElementById('gameField').style.display = 'inline-block';
  nextLocation();
}

function nextLocation() {
  let t_coords = rand.list(LOCATION_DATA.moscow);

  answered = false;
  document.getElementById("guessButton").innerHTML = "Проверить";
  document.getElementById("locationPopup").innerHTML = "";

  gameRound++;
  document.getElementById("roundInfo").innerHTML = "Раунд "+gameRound;

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

  let t_map = document.getElementById("mapContainer");
  t_map.style.width = "32%";
  t_map.style.height = "32%";
}

function answerPanorama() {
  if (answered) {
    nextLocation();
    return;
  };
  answered = true;

  myMap.setCenter(panoramaCoords);
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

  panoramaPlacemark = new ymaps.GeoObject({
      geometry: {
          type: "Point",
          coordinates: panoramaCoords
      }
  }, {
    preset : 'islands#darkGreenCircleDotIcon'
  });
  myMap.geoObjects.add(panoramaPlacemark);

  let t_answer = haversineDistanceKM(answerCoords[0],answerCoords[1],panoramaCoords[0],panoramaCoords[1]);
  let t_answer_display;
  if (t_answer >= 1) {
    t_answer_display = t_answer.toFixed(1)+" километров";
    //alert('Расстояние до места: '+t_answer_display+' километра.');
  }
  else {
    t_answer_display = Math.floor(t_answer/1000)+" метров";
    //alert('Расстояние до места: '+t_answer_display+' метров.');
  }
  let t_score_round = Math.round(2000 * Math.exp(-0.5*Math.pow(t_answer/750, 2)));
  answerScore += t_score_round;
  document.getElementById("score").innerHTML = "Очков: "+answerScore;

  document.getElementById("locationPopup").innerHTML = "<h1>"+t_score_round+" ОЧКОВ<br>"+t_answer_display+" до места</h1>";

  let t_map = document.getElementById("mapContainer");
  t_map.style.width = "98%";
  t_map.style.height = "95%";

  document.getElementById("guessButton").innerHTML = "Следующая локация";
}

function placeAnswer(coords) {
  if (answered) return;

  answerCoords = coords;
  if (!!answerPlacemark) myMap.geoObjects.remove(answerPlacemark);
  answerPlacemark = new ymaps.GeoObject({
      geometry: {
          type: "Point",
          coordinates: coords
      }
  }, {
    preset: 'islands#blueCircleDotIcon'
  });
  myMap.geoObjects.add(answerPlacemark);
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
