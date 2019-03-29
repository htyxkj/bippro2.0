module.exports = {
    bar: {
      chart: {
        type: 'pie',
        spacing: [0, 0, 0, 0],
        margin: [0, 0, 0, 0],
        height: '180px'
      }, 
      title: { text: '', floating: true, align: 'center', verticalAlign: 'middle', },
      colors: ['#F7464A', '#46BFBD', '#FDB45C','#4CBE5D'],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderWidth: 0,
          innerSize: '60%',
          shadow: false,
          center: ['50%', '50%'],
          dataLabels: {
            enabled: false
          },
          showInLegend: true,
          point: {
            events: {
              click(e) {
                this.chart.setTitle({ text: this.name + '<br/>' + Math.round(this.percentage * 100) / 100 + '%' });
              }
            } 
          },
        }
      },
      tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
      legend: {
        enabled: true,
        symbolRadius: 3,
        align: 'left',
        verticalAlign: 'middle',
        floating: true,
        layout: "vertical"
      },
      series: [{
        type: 'pie',
        name: '占比',
        data: [
          { name: '收11入', y: 200 },
          { name: '成本', y: 152340 },
          { name: '利润', y: 5 },
        ]
      }],
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