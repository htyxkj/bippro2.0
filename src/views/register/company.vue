<template>
  <div class="company">
    <div class="top-bkg">
      <img src="../../../src/img/register/bkgsa.png" alt />
    </div>
    <div class="content">
      <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label>企业名称</label>
        <md-input v-model="qyname" required></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label>身份证号</label>
        <md-input v-model="indent" required></md-input>
      </md-input-container>

      <!-- <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label>信用代码</label>
        <md-input v-model="license" required></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon class="md-accent">people</md-icon>
        <label>营业执照</label>
        <md-input v-model="licensephoto" required></md-input>
      </md-input-container>
      -->
      <md-layout md-gutter>
        <md-layout md-flex-medium="33">
          <md-input-container>
            <label for="cityvalues">省</label>
            <md-select
              v-model="cityvalues"
              id="cityvalues"
              name="cityvalues"
              required
              @change="getasids"
            >
              <md-option
                v-for="(item,index) in regions"
                :key="index"
                :value="item.orgcode"
              >{{item.orgname}}</md-option>
            </md-select>
          </md-input-container>
        </md-layout>

        <md-layout md-flex-medium="33">
          <md-input-container>
            <label for="cityvalues1">市</label>
            <md-select
              v-model="cityvalues1"
              id="cityvalues1"
              name="cityvalues1"
              required
              @change="getasidss"
            >
              <md-option
                v-for="(item,index) in regions1"
                :key="index"
                :value="item.orgcode"
              >{{item.orgname}}</md-option>
            </md-select>
          </md-input-container>
        </md-layout>

        <md-layout md-flex-medium="33">
          <md-input-container>
            <label for="cityvalues2">县</label>
            <md-select v-model="cityvalues2" id="cityvalues2" name="cityvalues2" required>
              <md-option
                v-for="(item,index) in regions2"
                :key="index"
                :value="item.orgcode"
              >{{item.orgname}}</md-option>
            </md-select>
          </md-input-container>
        </md-layout>
      </md-layout>
      <div class="reg-btn">
        <md-button class="md-raised md-primary">
          <div class="reg-btn-con" @click="saveupdata">完善资料</div>
        </md-button>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import axios from "axios";
const ICONS = [
  "menu",
  "dashboard",
  "verified_user",
  "videogame_asset",
  "assessment",
  "invert_colors",
  "cloud_download"
];
const ICONCOLOR = [
  { color: "red-700-0.8" },
  { color: "green" },
  { color: "indigo" },
  { color: "blue-700-0.8" },
  { color: "lime" },
  { color: "teal" },
  { color: "green-600-0.5" }
];
export default {
  data() {
    return {
      qyname: "",
      indent: "",
      // licensephoto:"",
      // license:"",
      cityvalues: "",
      cityvalues1: "",
      cityvalues2: "",
      regions: "",
      regions1: "",
      regions2: "",
      orgcode: "",
      name:""
    };
  },
  async created() {
    this.usrcode = this.$route.query.tel;
    var name;
    this.name=this.$route.query.name;
    this.loginRemote1();
    this.getasid();
  },
  mounted() {},
  methods: {
    //保存、登录、
    async saveupdata() {
      await this.saveInsuser();
    },
    // (1)校验字段为空
    saveInsuser() {
      this.saveInsuData();
    },
    // (2)更新字段
    saveInsuData() {
      let _this = this;
      if (this.qyname == "") {
        _this.$notify.danger({ content: "企业名称不能为空" });
      } else if (this.indent == "") {
        _this.$notify.danger({ content: "身份证号不能为空" });
      }
      //  else if (this.license == "") {
      //   _this.$notify.danger({ content: "信用代码不能为空" });
      // } else if (this.licensephoto == "") {
      //   _this.$notify.danger({ content: "营业执照不能为空" });
      // }
      else if (this.cityvalues == "") {
        _this.$notify.danger({ content: "省不能为空" });
      } else if (this.cityvalues1 == "") {
        _this.$notify.danger({ content: "市不能为空" });
      } else if (this.cityvalues2 == "") {
        _this.$notify.danger({ content: "县不能为空" });
      } else {
        let orgcode = "";
        if (this.dltype == "1") {
          orgcode = this.cityvalues;
        } else if (this.dltype == "2") {
          orgcode = this.cityvalues1;
        } else {
          orgcode = this.cityvalues2;
        }
        let jsonstr = {
          id_card: this.indent,
          orgname: this.qyname,
          // license:this.license,
          // licensephoto:this.licensephoto,
          orgcode: this.orgcode,
          provinces: this.cityvalues,
          city: this.cityvalues1,
          county: this.cityvalues2,
          tel: this.usrcode,
          frsopr:this.name,
          ilevl: "5",
          corg: "1",
          scm: this.cityvalues2,
          sys_stated: 1
        };
        var data1 = {
          dbid: `${global.DBID}`,
          usercode: "100003",
          apiId: "savedata",
          pcell: "6007ZA", // 对象标识
          jsonstr: JSON.stringify(jsonstr),
          datatype: 1
        };

        //验证身份checkIdCard
        var isD = this.checkIdCard(this.indent);
        if (isD == false) {
          this.$notify.danger({ content: "身份证输入有误" });
          return;
        }

        let _this = this;
        axios
          .post(
            `${global.BIPAPIURL}` + `${global.API_COM}`,
            qs.stringify(data1)
          )
          .then(res => {
            console.log(res);
            if (res.data.id == 0) {
              this.orgcode = res.data.data.orgcode;
              console.log(this.orgcode);
              this.updata();
              this.QYJM();
            } else {
              _this.$notify.danger({ content: "保存失败" });
            }
          })
          .catch(err => {
            console.log(err);
            _this.$notify.danger({ content: "系统故障！" });
            _this.loading = 0;
          });
      }
    },

    //校验身份证是否正确
    checkIdCard(indent) {
      var regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!regIdCard.test(indent)) {
        return false;
      } else {
        return true;
      }
    },

    //更新人员部门
    updata() {
      console.log(this.orgcode);
      let jsonstr = {
        usrcode: this.usrcode,
        orgcode: this.orgcode,
        tel: this.usrcode,
        provinces: this.cityvalues,
        city: this.cityvalues1,
        county: this.cityvalues2,
        ident: this.indent,
        sys_stated: 2
      };
      console.log(this.orgcode);
      console.log("222");
      var data1 = {
        dbid: `${global.DBID}`,
        usercode: "100003",
        apiId: "savedata",
        pcell: "6003RY", // 对象标识
        jsonstr: JSON.stringify(jsonstr),
        datatype: 1
      };

      let _this = this;
      axios
        .post(`${global.BIPAPIURL}` + `${global.API_COM}`, qs.stringify(data1))
        .then(res => {
          console.log(res);
          if (res.data.id == 0) {
            _this.$notify.success({ content: "保存成功" });
            this.change();
          } else {
            _this.$notify.danger({ content: "保存失败" });
          }
        })
        .catch(err => {
          console.log(err);
          _this.$notify.danger({ content: "系统故障！" });
          _this.loading = 0;
        });
    },

    // 辅助调用省  查询省
    getasid() {
      let data2 = {
        dbid: global.DBID,
        usercode: "100003",
        apiId: global.APIID_AIDO,
        page: 1,
        assistid: "REGION", //辅助名称
        currentPage: 1, //页数
        pageSize: 2000 //每页条数
      };
      this.getDataByAPINewSync(data2).then(res => {
        this.regions = res.data.values;
      });
    },

    // 辅助调用市  查询市
    getasids() {
      let data2 = {
        dbid: global.DBID,
        usercode: "100003",
        apiId: global.APIID_AIDO,
        page: 1,
        assistid: "REGIONS1", //辅助名称
        currentPage: 1, //页数
        pageSize: 2000, //每页条数
        cont: "~areacity=" + "'" + this.cityvalues + "'"
      };
      this.getDataByAPINewSync(data2).then(res => {
        console.log(res);
        this.regions1 = res.data.values;
      });
    },

          //首界面的跳转
         async  change(){
           window.sessionStorage.clear();
            this.$router.push({ path: "/", name: "" });
 
         },




              //企业加盟申请表
    QYJM() {
      console.log('11111111');
      let jsonstr = {
        name:this.name,
        sopr:this.usrcode,
        tel:this.usrcode,
        qyname:this.qyname,
        dltype:this.dltype,
        provinces: this.cityvalues,
        city: this.cityvalues1,
        county: this.cityvalues2,
        ident: this.indent,
        state:'0',
        sorg:this.orgcode,
        sbuid:'2517',
        sorg:this.orgcode,
        scm1:'1',
        sys_stated: 1
      };
     
      console.log("222");
      var data1 = {
        dbid: `${global.DBID}`,
        usercode: "100003",
        apiId: "savedata",
        pcell: "2517", // 对象标识
        jsonstr: JSON.stringify(jsonstr),
        datatype: 1
      };

      let _this = this;
      axios
        .post(`${global.BIPAPIURL}` + `${global.API_COM}`, qs.stringify(data1))
        .then(res => {
          console.log('333333');
          if (res.data.id == 0) {
          
          } else {
            _this.$notify.danger({ content: "保存失败" });
          }
        })
        .catch(err => {
          console.log(err);
          _this.$notify.danger({ content: "系统故障！" });
          _this.loading = 0;
        });
          console.log('444');
    },

















    // 辅助调用县 查询县
    getasidss() {
      let data2 = {
        dbid: global.DBID,
        usercode: "100003",
        apiId: global.APIID_AIDO,
        page: 1,
        assistid: "REGIONSS1", //辅助名称
        currentPage: 1, //页数
        pageSize: 2000, //每页条数
        cont: "~lscity=" + "'" + this.cityvalues1 + "'"
      };
      this.getDataByAPINewSync(data2).then(res => {
        console.log(res + this.regions);
        this.regions2 = res.data.values;
      });
    },
    // 再次登录方法
    async loginRemote1() {
      console.log("再次登录成功");
      var logindata = {
        apiId: global.APIID_OUTLOGIN,
        dbid: global.DBID,
        usercode: this.usrcode, //用户名
        ioutsys: 1 //天心选择web端 钉钉。。。
      };
      try {
        var res = await this.getDataByAPINew(logindata);
        this.$emit("dingLogin");
        var userI = res.data.data.user;
        var mlist = res.data.data.menulist;
        var snkey = res.data.data.snkey;
        window.sessionStorage.setItem("user", JSON.stringify(userI));
        window.sessionStorage.setItem("menulist", JSON.stringify(mlist));
        window.sessionStorage.setItem("snkey", JSON.stringify(snkey));
        return res;
      } catch (e) {
        console.log(e);
        this.$notify.danger({ content: "系统连接错误！！" });
      }
    }
  }
};
</script>

<style scoped>
.register {
  width: 100%;
  height: 100%;
}
.top-bkg {
  width: 100%;

}
img{
  width: 100%;
}
.content {
  margin: 10px;



}
.lable {
  margin-right: 10px;
}
.reg-btn {
  margin-top: 10px;
  text-align: center;
}
.reg-btn-con {
  padding: 3px 80px;
}
</style>