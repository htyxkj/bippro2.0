module.exports = {
  chart: {
    chart: {
      type: 'line'
    },
    title: {
      text: '图表标题'
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: [ 
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Y轴显示'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
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
    series: [],
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
