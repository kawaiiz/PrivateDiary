import * as echarts from '../../public/plugin/ec-canvas/echarts';
/* eslint-disable */
var data = []
var geoCoordMap = {};
var mapFeatures = echarts.getMap('china').geoJson.features;
mapFeatures.forEach(function(v) {
  // 地区名称
  var name = v.properties.name;
  // 地区经纬度
  geoCoordMap[name] = v.properties.cp;
  data.push({
    name: name,
    value: Math.round(Math.random() * 10)
  })
});
console.log("============geoCoordMap===================")
console.log(geoCoordMap)
console.log("================data======================")
console.log(data)
var max = 10,
  min = 0; // todo 
var maxSize4Pin = 40,
  minSize4Pin = 20;

var convertData = function(data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
      });
    }
  }
  return res;
};

let title = {
  sheng: '15',
  tai: '3000'
}

export default {
  title: {
    // text: '共计14个省，设备3sads00台',
    text: '{a|共计}{b|' + title.sheng + '}{a|个省}  {a|共计设备}{b|' + title.tai + '}{a|台}',
    left: '20',
    textStyle: {
      rich: {
        a: {
          color: '#0168EA',
          fontSize: '12'
        },
        b: {
          color: '#0168EA',
          fontSize: '18'
        },
      }
    }

    // subtext: '纯属虚构',
  },
  geo: {
    show: true,
    map: 'china',
    left: '10',
    top: '10',
    right: '10',
    bottom: '10',
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        areaColor: '#031525',
        borderColor: '#fff',
      },
      emphasis: {
        areaColor: new echarts.graphic.LinearGradient(
          0, 1, 1, 0, [{
              offset: 0,
              color: '#FFBD55'
            },
            {
              offset: 1,
              color: '#EF475F'
            }
          ]
        )
      }
    }
  },
  visualMap: {
    show: false,
    min: 0,
    max: 10,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'], // 文本，默认为数值文本
    calculable: true,
    seriesIndex: [0],
    inRange: {
      color: ['#e0ffff', '#1399F8'],
    }
  },
  series: [{
      type: 'map',
      map: 'china',
      geoIndex: 0,
      label: {
        normal: {
          show: false,
          textStyle: {
            color: '#fff',
            fontSize: 9,
          },
          formatter: (params) => {
            console.log(params)
            let str = params.name + '\n' + params.value[2]
            return str
          }
        },
        emphasis: {
          show: true
        }
      },
      itemStyle: {
        normal: {
          color: '#F62157', //标志颜色
          borderColor: '#000',
          borderWidth: '2'
        }
      },
      animation: false,
      data: convertData(data)
    },
    {
      name: '点',
      type: 'scatter',
      coordinateSystem: 'geo',
      // symbol: 'pin', //气泡
      symbolSize: function(val) {
        return val[2]
      },
      label: {
        normal: {
          show: false,
          textStyle: {
            color: '#fff',
            fontSize: 9,
          },
          formatter: (params) => {
            let str = params.name + '\n' + params.value[2]
            return str
          }
        },
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0, 1, 1, 0, [{
                offset: 0,
                color: '#FFBD55'
              },
              {
                offset: 1,
                color: '#EF8247'
              }
            ]
          )
        }
      },
      data: convertData(data),
    },
  ],
  // backgroundColor: 'rgba(255,255,255,0)'
};