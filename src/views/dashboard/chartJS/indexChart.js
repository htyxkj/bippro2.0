// 常量定义解析
// 图表见 以 ";" 分隔
// XCAR|id,  XSORG|orgcode,  fcy,  YSOFCY|id|sorg,   bar,  12 ;
// 最后一个：宽度
// 倒数二个：类型
// 倒数三个：返回结果集   辅助名称|第一个X轴字段名称|第二个X轴字段名称
// 倒数四个：Y轴在结果集中的字段
// 倒数四个前：X轴{
// 				第一个：X一     辅助名称|在辅助中的字段，字段值用来匹配结果集
// 				第二个：X二     辅助名称|在辅助中的字段，字段值用来匹配结果集
// 			}
import pieC from './pieC.js';
import lineOneXC from './lineOneXC.js'
import lineTwoXC from './lineTwoXC.js'
import fChart from './funnelChart.js'
import axios from 'axios';
import qs from 'qs';
export default {
  //
  mounted() {},
  data() {
    return {
      layoutFigure: [],
      usercode: '', //用户编码
      constant: '', //常量值
      Figure: [], //图信息
      param: {
        apiId: "assisto",
        dbid: `${global.DBID}`,
        usercode: '',
        page: 1,
        pagesize: 999999,
        assistid: null,
        cont: null,
      },
    }
  },
  methods: {
    async getDateStr() {
      this.usercode = JSON.parse(window.sessionStorage.getItem('user')).userCode; //用户编码  
      this.param.usercode = this.usercode;
      this.constant = window.sessionStorage.getItem('INDEXCONSTANT');
      var data0 = {
        'dbid': `${global.DBID}`, //数据库连接id 
        "usercode": this.usercode, //用户编码
        "apiId": "constant", //获取cellID标识 
        'assistid': "INDEX", //辅助,变量标识 如 {&SOPR},{$D.SOPR}    	'cont': "BXQ0000517060001"  //查询条件
      };
      if (this.constant == null || this.constant == '') {
        let _this = this;
        await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(data0)).then(res => {
          _this.constant = res.data.data.value;
          window.sessionStorage.setItem('INDEXCONSTANT', _this.constant);
        }).catch(err => {
          console.log(err)
        })
      }
      if (this.constant == null || this.constant == '')
        return;
      //开始拆分 常量信息
      //XCAR|id,XSORG|orgcode,fcy,YSOFCY|id|sorg,bar,12 
      let arr = this.constant.split(";");
      for (var i = 0; i < arr.length; i++) {
        var arrOne = arr[i];
        var _arr = arrOne.split(",");
        var width = _arr[_arr.length - 1]; //图表宽度
        var type = _arr[_arr.length - 2]; //图表类型 
        var val = _arr[_arr.length - 3]; //返回结果辅助
        var Y = _arr[_arr.length - 4]; //y轴在返回结果中的字段
        var x = [];
        for (var j = 0; j < _arr.length - 4; j++) {
          x.push(_arr[j]);
        }

        //柱状图
        if (type == 'bar' || type == 'line' || type == 'column') {
          if (x.length == 2)
            await this.line2XOpetion(x, Y, val, type, width);
          else
            await this.line1XOpetion(x, Y, val, type, width);
        } else if (type == 'pie') {
          await this.pieOption(x, Y, val, type, width);
        } else if (type == 'funnel') {
          await this.funnelOption(x, Y, val, type, width);
        }
      }
      //layoutFigure
      var k = 0;
      var f = []
      for (var i = 0; i < this.Figure.length; i++) {
        var num = parseInt(k) + parseInt(this.Figure[i].width)
        if (num < 100) {
          k += this.Figure[i].width;
          f.push(this.Figure[i]);
          if (this.Figure.length - 1 == i) {
            var _f = f.concat();
            this.layoutFigure.push(_f);
          }
        } else if (num == 100) {
          f.push(this.Figure[i]);
          var _f = f.concat();
          this.layoutFigure.push(_f);
          f = [];
          k = 0;
        } else if (num > 100) {
          var _f = f.concat();
          this.layoutFigure.push(_f);
          k = 0;
          f = [];
          k += this.Figure[i].width;
          f.push(this.Figure[i]);
        }
      }
    },
    //柱状图||折线图 ----两个X轴
    async line2XOpetion(x, Y, val, type, width) {
      //    console.log(x,Y,val,type,width)
      var fanhu = null; //返回数据结果集,包括标签字段名称
      var value = []; //返回结果 数据
      var _varr = val.split("|");
      //查询数据结果集
      var params = this.param;
      params.assistid = _varr[0];
      params.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(params)).then(res => {
        if (res.data.message) {

        } else {
          value = res.data.values;
          fanhu = res.data;
        }
      }).catch(err => {
        console.log(err);
      });

      //初始化图表OptiOnsObject.assign({}, lineC.chart);
      var lineChart = JSON.parse(JSON.stringify(lineTwoXC.chart));
      var categories = []; //X1轴 
      var X1Val = null;
      var X2Val = null;
      var xtwoData = [];
      //查询X1数据
      var x1 = x[0];
      var x1arr = x1.split("|");
      var paramsX1 = this.param;
      paramsX1.assistid = x1arr[0];
      paramsX1.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(paramsX1)).then(res => {
        if (res.data.message) {

        } else {
          X1Val = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
      if (X1Val == null || X1Val.values == null)
        return;
      //设置X轴显示图例 
      for (var i = 0; i < X1Val.values.length; i++) {
        xtwoData.push(0);
        var v = X1Val.values[i];
        categories.push(v[X1Val.allCols[X1Val.showCols[0]]])
      }
      lineChart.xAxis.categories = categories;
      //筛选数据  
      var series = [];
      //查询X2数据
      var x2 = x[1];
      var x2arr = x2.split("|");
      var paramsX2 = this.param;
      paramsX2.assistid = x2arr[0];
      paramsX2.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(paramsX2)).then(res => {
        X2Val = res.data;
      }).catch(err => {
        console.log(err)
      })
      if (X2Val == null)
        return;

      for (var j = 0; j < X2Val.values.length; j++) {
        var c = xtwoData.concat()
        var v2 = X2Val.values[j];
        var d = {
          name: v2[X2Val.allCols[X2Val.showCols[0]]],
          data: c
        }
        series.push(d);
      }
      for (var i = 0; i < X1Val.values.length; i++) {
        var v1 = X1Val.values[i];
        for (var j = 0; j < X2Val.values.length; j++) {
          var v2 = X2Val.values[j];
          for (var z = 0; z < value.length; z++) {
            var _value = value[z];
            var _v1 = v1[x1arr[1]];
            var _v2 = v2[x2arr[1]];
            if (_value[_varr[1]] == _v1 && _value[_varr[2]] == _v2) {
                let v =  _value[Y];
                if(!v)
                    v=0;
                series[j].data[i] = v
            }
          }
        }
      }
      lineChart.series = series;
      //图表类型
      lineChart.chart.type = type;
      //图表标题
      if (fanhu != null) {
        lineChart.title.text = fanhu.title
        for (var i = 0; i <= fanhu.allCols.length; i++) {
          if (fanhu.allCols[i] == Y) {
            lineChart.yAxis.title.text = fanhu.labers[i]
          }
        }
        var _chart = {
          options: lineChart,
          width: width
        } 
        this.Figure.push(_chart);
      }
    },

    //柱状图||折线图 ----一个X轴
    async line1XOpetion(x, Y, val, type, width) {
      var fanhu = null; //返回数据结果集,包括标签字段名称
      var value = []; //返回结果 数据
      var _varr = val.split("|");
      //查询数据结果集
      let params = this.param;
      params.assistid = _varr[0];
      params.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(params)).then(res => {
        value = res.data.values;
        fanhu = res.data;
      }).catch(err => {
        console.log(err)
      })

      //初始化图表OptiOnsObject.assign({}, lineC.chart);
      var lineChart = JSON.parse(JSON.stringify(lineOneXC.chart));
      var categories = []; //X1轴 
      var X1Val = null;
      var xtwoData = [];
      //查询X1数据
      var x1 = x[0];
      var x1arr = x1.split("|");
      let paramsX1 = this.param;
      paramsX1.assistid = x1arr[0];
      paramsX1.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(paramsX1)).then(res => {
        X1Val = res.data;
      }).catch(err => {
        console.log(err)
      })
      if (X1Val.values == null)
        return
      //设置X轴显示图例 
      let series = [{
        data: [],
      }];
      //  series: [{
      //     data: [
      //         ['上海', 24.25],
      //     ], 
      // }]
      for (var j = 0; j < X1Val.values.length; j++) {
        var c = xtwoData.concat()
        var v2 = X1Val.values[j];
        var d = [v2[X1Val.allCols[X1Val.showCols[0]]], c]
        series[0].data.push(d);
      }
      for (var i = 0; i < X1Val.values.length; i++) {
        var v1 = X1Val.values[i];
        for (var z = 0; z < value.length; z++) {
          var _value = value[z];
          var _v1 = v1[x1arr[1]];
          if (_value[_varr[1]] == _v1) {
            series[0].data[i][1] = _value[Y]
          }
        }
      }
      lineChart.series = series;
      //图表类型
      lineChart.chart.type = type;
      //图表标题
      lineChart.title.text = fanhu.title
      for (var i = 0; i <= fanhu.allCols.length; i++) {
        if (fanhu.allCols[i] == Y) {
          lineChart.yAxis.title.text = fanhu.labers[i]
        }
      }
      console.log(lineChart)
      var _chart = {
        options: lineChart,
        width: width
      }
      this.Figure.push(_chart); 
    },
    //饼状图
    async pieOption(x, Y, val, type, width) {
      var fanhu = null;
      var value = [];
      var _varr = val.split("|");
      //查询数据结果集
      let params = this.param;
      params.assistid = _varr[0];
      params.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(params)).then(res => {
        if (res.data.code && res.data.code == -1) {
          value = null;
          return;
        }
        value = res.data.values;
        fanhu = res.data;
      }).catch(err => {
        console.log(err)
      })
      if (value == null) {
        return;
      }
      //初始化图表OptiOnsObject.assign({}, lineC.chart);
      var pieChart = JSON.parse(JSON.stringify(pieC.bar));
      var X1Val = null;

      //查询X1数据
      var x1 = x[0];
      var x1arr = x1.split("|");
      let paramsX1 = this.param;
      params.assistid = x1arr[0];
      params.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(paramsX1)).then(res => {
        X1Val = res.data;
      }).catch(err => {
        console.log(err)
      })
      var series_data = [];
      // //{ name: '收11入', y: 200 },
      // //筛选数据
      for (var i = 0; i < X1Val.values.length; i++) {
        for (var j = 0; j < value.length; j++) {
          var v = value[j];
          var x1 = X1Val.values[i];
          if (v[_varr[1]] == x1[x1arr[1]]) {
            let d = {
              name: x1[X1Val.allCols[X1Val.showCols[0]]],
              y: v[Y]
            }
            series_data.push(d);
          }
        }
      }
      //图表类型 
      pieChart.series[0].type = type;
      //图表数据
      pieChart.series[0].data = series_data;
      //图表标题
      pieChart.title.text = fanhu.title
      var _chart = {
        options: pieChart,
        width: width
      }
      this.Figure.push(_chart);
    },

    //漏洞图
    async funnelOption(x, Y, val, type, width) {
      var fanhu = null;
      var value = [];
      var _varr = val.split("|");
      //查询数据结果集
      let params = this.param;
      params.assistid = _varr[0];
      params.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(params)).then(res => {
        if (res.data.code && res.data.code == -1) {
          value = null;
          return;
        }
        value = res.data.values;
        fanhu = res.data;
      }).catch(err => {
        console.log(err)
      })
      if (value == null) {
        return;
      }
      //初始化图表OptiOnsObject.assign({}, lineC.chart);
      var funnelChart = JSON.parse(JSON.stringify(fChart.chart));
      var X1Val = null;

      //查询X1数据
      var x1 = x[0];
      var x1arr = x1.split("|");
      let paramsX1 = this.param;
      params.assistid = x1arr[0];
      params.pagesize = 100000;
      await axios.post(`${global.BIPAPIURL}` + `${global.API_COM }`, qs.stringify(paramsX1)).then(res => {
        X1Val = res.data;
      }).catch(err => {
        console.log(err)
      })
      var series_data = [];
      // //{ name: '收11入', y: 200 },
      // //筛选数据
      for (var i = 0; i < X1Val.values.length; i++) {
        for (var j = 0; j < value.length; j++) {
          var v = value[j];
          var x1 = X1Val.values[i];
          if (v[_varr[1]] == x1[x1arr[1]]) {
            let d = [x1[X1Val.allCols[X1Val.showCols[0]]], v[Y]]
            series_data.push(d);
          }
        }
      }
      //图表类型 
      // funnelChart.series[0].type=type;   
      //图表数据
      funnelChart.series[0].data = series_data;
      //图表标题
      funnelChart.title.text = fanhu.title
      var _chart = {
        options: funnelChart,
        width: width
      }
      this.Figure.push(_chart);
    }
  }
}
