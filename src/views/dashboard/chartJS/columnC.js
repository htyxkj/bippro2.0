module.exports = {
  chart: {
    chart: {
      type: 'column'
    },
    title: {
      text: 'XX公司月均销售量'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: '数值'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: '北京销售部',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }
      , {
        name: '太原销售部',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
      }, 
      {
        name: '大连销售部',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
      }, {
        name: '深圳销售部',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
      }
    ],    
    exporting: {
			enabled: true
    },
    lang:{ 
      printChart: '打印图表',
      downloadPNG: '下载JPEG 图片',        
      downloadJPEG: '下载JPEG文档',
      downloadPDF: '下载PDF 图片',
      downloadSVG: '下载SVG 矢量图',        
      contextButtonTitle: '下载图片'
  }
  }
}
