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

      const markerElement = document.createElement('div');
      markerElement.className = 'marker-class';
      markerElement.innerText = "I'm marker!";

      const marker = new YMapMarker(
        {
          source: 'markerSource',
          coordinates: [37.588144, 55.733842],
          draggable: true,
          mapFollowsOnDrag: true
        },
        markerElement
      );

      map.addChild(marker);
    }
}
