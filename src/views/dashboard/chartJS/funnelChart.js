module.exports = {
    chart:{
        chart: {
            type: 'funnel',
            marginRight: 100
        },
        title: {
            text: '销售漏斗',
            x: -50
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    crop : false,
                    overflow: 'none',
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    color: 'black',
                    softConnector: true
                },
                neckWidth: '30%',
                neckHeight: '25%' 
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: '用户',
            data: [
                ['访问网站',   10],
                ['下载产品',       9],
                ['询价', 8],
                ['发送合同',    5],
                ['成交',    1]
            ]
        }] ,
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