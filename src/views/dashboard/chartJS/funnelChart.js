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
                //-- Other available options
                // height: pixels or percent
                // width: pixels or percent
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
        }]  
    }
}