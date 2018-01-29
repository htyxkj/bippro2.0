<script>
import moment from "moment";
import _ from "lodash";

import axios from "axios";
import qs from "qs";
export default {
  name:'baseTool',
  methods: {
    /**
     * 调整日期。
     * 参数：日期,日[天,月,年,小时,分钟]]
     */
    dateAdd(fps) {
      let d1 = fps[0];
      var day1 = moment(d1);
      const day = fps[1];
      const mon = fps[2];
      const year = fps[3];
      const hou = fps[4];
      const min = fps[5];
      return moment()
        .add(5, "d")
        .add(mon, "M")
        .add(year, "y")
        .add(hou, "h")
        .add(min, "m");
    },

    /**
     * 日期相减函数，返回不同的时间间隔
     * 0:年，1:月，2:天
     * @param {date1,date2,type} fps
     */
    dateSub(fps) {
      const size = fps.length;
      let d1 = typeof fps[0] === "number" ? Date.now() : Date.parse(fps[0]);
      let d2 = typeof fps[1] === "number" ? Date.now() : Date.parse(fps[1]);
      let ymd = fps[2];
      if (ymd === 2) {
        //天数
        d1 = d1 - d2;
        return parseInt(d1 / 86400000);
      } else if (ymd === 1) {
        //月
        let y1 = moment(d1).year();
        let m1 = moment(d1).month();
        let y2 = moment(d2).year();
        let m2 = moment(d2).month();
        return (y1 - y2) * 12 + (m1 - m2);
      } else {
        //年
        let y1 = moment(d1).year();
        let y2 = moment(d2).year();
        return y1 - y2;
      }
      return 0;
    },

    nextQuote4(cs0, x0, x1, ch) {
      for (x0++; x0 < x1; x0++) {
        var c0 = cs0[x0];
        if (c0 == ch) return x0;
        if (c0 == "\\") x0++;
      }
      return x1;
    },

    nextBarcket4(cs0, x0, x1, chL) {
      var chR = chL == "[" ? "]" : chL == "(" ? ")" : "}";
      var ct = 0;
      for (x0++; x0 < x1; x0++) {
        var c0 = cs0[x0];
        if (c0 == chR) {
          if (ct < 1) return x0;
          ct--;
        } else if (c0 == chL) {
          ct++;
        } else if (c0 == "\\") {
          x0++;
        } else if (c0 == "'" || c0 == '"') {
          x0 = this.nextQuote4(cs0, x0, x1, c0);
        }
      }
      return x1;
    },

    nextBarcket(buf, cs0, x0, x1, chL) {
      var c0,
        chR = chL == "(" ? ")" : chL == "[" ? "]" : "}";
      buf += chL;
      x0++;
      for (var ct = 0; x0 < x1; x0++) {
        c0 = cs0[x0];
        if (c0 == chR) {
          buf += c0;
          if (ct < 1) return [x0, buf];
          ct--;
        } else if (c0 == "'" || c0 == '"') {
          var retn = this.nextQuote(buf, cs0, x0, x1, c0);
          x0 = retn[0]; //;-括号中的不算。
          buf = retn[1];
        } else {
          buf += c0;
          if (c0 == chL) ct++;
          else if (c0 == "\\") {
            x0++;
            if (x0 < x1) buf += cs0[x0];
          }
        }
      }
      return [x1, buf];
    },

    nextQuote(buf, cs0, x0, x1, ch) {
      buf += ch;
      for (x0++; x0 < x1; x0++) {
        var c0 = cs0[x0];
        if (c0 == ch) {
          buf += ch;
          return [x0, buf];
        }
        if (c0 == "\\") {
          x0++;
          if (x0 < x1) {
            c0 = cs0[x0];
            if (c0 == "n") c0 = "\n";
            else if (c0 == "t") c0 = "\t";
            else if (c0 == "r") c0 = "\r";
          }
        }
        buf += c0;
      }
      return [x1, buf];
    },

    // 两个数值做运算
    calcTwoNumber(o0, o1, cfh, cpnt) {
      if (cfh == "+" || cfh == "-" || cfh == "*" || cfh == "/") {
        if (cfh == "+") {
          var a = new Number(o0) + new Number(o1);
          return a.valueOf();
        }
        if (cfh == "-") {
          var a = new Number(o0) - new Number(o1);
          return a.valueOf();
        }
        if (cfh == "*") {
          var a = new Number(o0) * new Number(o1);
          return a.valueOf();
        }
        if (cfh == "/") {
          var a = new Number(o0) / new Number(o1);
          return a.valueOf();
        }
      }
    },
    tolevel(c01) {
      var c0 = c01 & 0xff;
      c0 = String.fromCharCode(c0);
      if (c01 == "=") return 0; //不支持等号与运算符连用,如"+=","*="等，用"A=A+..."表示
      if (c0 == "&" || c0 == "|" || c0 == "^") return 1;
      if (c0 == ">" || c0 == "<") return 2;
      if (c0 == "+" || c0 == "-") return 3;
      if (c0 == "*" || c0 == "/" || c0 == "%") return 4;
    },

    //最终的两个数值运算，可以直接在接口中调用。
    calcTwoValue(o0, o1, ysf) {
      if (ysf == "+" || ysf == "|") {
        if (o0 == null) return o1;
        if (o1 == null) return o0;
        // console.log(o0)
        if (
          ysf == "+" &&
          typeof o0 != "date" &&
          (typeof o0 != "number" || typeof o1 != "number")
        )
          return o0 + "" + o1;
      }
      return this.calcTwoObject(o0, o1, ysf, 0);
    },

    calcTwoObject(o0, o1, ysf, cpnt) {
      return this.calcTwoNumber(o0, o1, ysf, cpnt);
    },
    calcTwoItem(o0, o1, cfh) {
      // console.log('calcTwoItem');
      var c0 = String.fromCharCode(cfh & 0xff),
        c1 = String.fromCharCode(cfh >>> 8);
      if (c1 === "=" || c0 === "<" || c0 === ">") {
        // 逻辑比较值
        return true;
      }
      return this.calcTwoValue(o0, o1, c0);
    },

    calcItems(ovs, fhs, idx) {
      var x0 = idx - 2,
        x1 = idx - 1,
        c0 = this.tolevel(fhs[x0]);
      if (c0 < 1 || c0 < this.tolevel(fhs[x1])) return idx; //注意赋值语句
      // console.log('calcItems');
      ovs[x0] = this.calcTwoItem(ovs[x0], ovs[x1], fhs[x0]);
      ovs[x1] = ovs[idx];
      fhs[x0] = fhs[x1];
      idx--;
      if (idx > 1) idx = this.calcItems(ovs, fhs, idx);
      return idx;
    },
    /**
     * SQL中变量和宏格式化，格式化时与当前界面数据关联。
     * @param {SQL语句} sql
     * @param {对象组成} cells
     * @param {数据对象} data
     */
    formatVarMacro(sql, cells, data) {
      return this.formatVarMacro4(sql, cells, data, true);
    },

    formatVarMacro4(str, cells, data, btrue) {
      // let x0 = str.indexOf('{^'); 中文字符先不考虑
      return this.formatVar(str, cells, data);
    },

    formatVar(sql, cells, data) {
      let x0 = this.findIndex(sql, "{", 0, true, false);
      if (x0 < 0) return sql;
      return this.formatVar2(sql, cells, data, x0);
    },

    formatVar2(sql, cells, data, xf) {
      let xt = null,
        st0 = null,
        sk;
      while (xf > -1) {
        xt = this.findIndex(sql, "}", xf, true, false);
        if (xt < 0) break;
        st0 = sql.substring(xf + 1, xt);
        let byy = st0.charAt(0) === "&"; //;--非SQL格式
        if (byy) st0 = st0.substring(1);
        let x00 = -1,
          s0 = "";
        try {
          st0 = this.proc_SqlVar(st0, cells, data);
        } catch (error) {
          x00 = 3;
        }
        if (x00 === 3) {
          return null;
        } else if (byy) {
          if (st0 == null) st0 = "null"; //单值为空时传入null
          st0 = sql.substring(0, xf) + st0;
          x00 = st0.length;
          sql = st0 + sql.substring(xt + 1); //引用。
        } else {
          for (xf--; xf > -1 && sql.charAt(xf) <= " "; xf--);
          if (xf < 0) {
            s0 = "";
            x00 = 0;
          } else {
            x00 = xf + 1;
            s0 = sql.substring(0, x00);
          }
          let cc = sql.length;
          for (xt++; xt < cc && sql.charAt(xt) <= " "; xt++);
          let s1 = xt < cc ? sql.substring(xt) : "";
          xt = s1.length;
          let t0 = -1;
          if (st0 === null || st0.length < 1) {
            if (xt > 0) {
              sk = this.nexttoken(s1, true);
              if (sk.charAt(0) === ")") t0 = 0;
              else {
                //--检查 "or"的组合项。
                sk = sk.toLowerCase();
                if ("and" === sk || "or" === sk) {
                  s1 = s1.substring(sk.length);
                  xt = s1.length;
                  t0 = 1;
                }
              }
            }
            if (t0 < 1 && x00 > 0) {
              sk = this.nexttoken(s0, false).toLowerCase(); //--检查删除全面的关键字。
              if (t0 === 0 && sk.charAt(0) === "(") {
                s0 = s0.replace(/(^\s+)|(\s+$)/g, ""); //---...( )...
                x00 = s0.length - 1;
                while (
                  x00 >= 0 &&
                  xt > 0 &&
                  s0.charAt(x00) === "(" &&
                  s1.charAt(0) === ")"
                ) {
                  s0 = s0.substring(0, xf).replace(/(^\s+)|(\s+$)/g, ""); //--去括号
                  s1 = s1.substring(1).replace(/(^\s+)|(\s+$)/g, "");
                  x00 = s0.length - 1;
                  xt = s1.length;
                }
                sk = this.nexttoken(s0, false).toLowerCase();
                if (xt > 2 && "where" === sk) {
                  sk = this.nexttoken(s1, true).toLowerCase();
                  if ("and" === sk || "or" === sk) {
                    s1 = s1.substring(sk.length); //--过滤后面的关键字。
                    xt = s1.length;
                    sk = ""; //--where在后面还有其它条件计算。
                  }
                }
                x00 = s0.length; //--新的终止位置。
              }
              if (t0 === 0 || "and" === sk || "or" === sk || "where" === sk) {
                t0 = sk.length;
                if (t0 > 0) {
                  x00 -= t0;
                  s0 = s0.substring(0, x00);
                }
              }
            }
            if (x00 > 0) {
              sql = s0;
              if (xt > 0) sql += s1;
            } else sql = s1;
          } else {
            sql = x00 > 0 ? s0 + " " + st0 : st0;
            x00 = sql.length;
            if (xt > 0) sql += " " + s1;
          }
        }
        xf = this.findIndex(sql, "{", x00, true, false);
      }
      return sql;
    },
    nexttoken(sv0, bnext) {
      let x1 = sv0.length - 1;
      let cs0 = sv0.split("");
      if (bnext) {
        if (cs0[0] === ")") return ")";
        for (let i = 1; i < x1; i++) {
          if (cs0[i].charCodeAt(0) <= " ".charCodeAt(0))
            return sv0.substring(0, i);
        }
      } else {
        if (cs0[x1] === "(") return "(";
        for (let i = x1--; i >= 0; i--) {
          if (cs0[i].charCodeAt(0) <= " ".charCodeAt(0))
            return sv0.substring(i + 1);
        }
      }
      return sv0;
    },

    proc_SqlVar(sv, cells, data) {
      let s0 = this.toCorpSQLVar(sv, -1);
      if (s0 !== null) {
        return s0;
      }
      let x1 = sv.length - 1;
      let o0 = this.toF_K_V(sv);
      let sf = null,
        sk = null;
      let c0,
        chinn = "A",
        bqc = false;

      if (typeof o0 !== "string") {
        sf = o0[0];
        c0 = sf.charAt(0);
        if (c0 === "\\") sf = sf.substring(1);
        else if (c0 === "#") {
          //加转义符
          chinn = sf.charAt(1); //;-指定SQL类型,转化时不依赖单元定义。
          sf = sf.substring(2);
        } else {
          bqc = c0 === "@";
          if (bqc) sf = sf.substring(1);
        }
        sk = o0[1];
        sv = o0[2];
      }
      c0 = sv.charAt(0);
      if (c0 === "^" && sv.length === 1) {
        //获取账期，需要些SQL定义
        return moment().year() * 100 + (moment().month() + 1);
      }
      if (c0 === "#" || c0 === "!" || c0 === "$") {
        //设置人员部门条件；
        console.log("设置人员部门条件");
        return "";
      }

      x1 = sv.indexOf("|");
      let iYMD = -1;
      if (x1 > 0) {
        //;--日期格工|数值公式。
        iYMD = this.toVarYMD(sv.substring(0, x1), c0, x1); //;--检查指定日期的格式。
        sv = sv.substring(x1 + 1);
      }
      let bmul = false,
        bvdiv = false;
      let cnot = 0;
      // 后续处理
      if (sv !== null && sv.length > 0) {
        bmul = sv.charAt(0) === "~"; //;--复合字段(需要过滤处理)
        if (bmul) sv = sv.substring(1);
        cnot =
          sv.length > 3 && sv.charAt(0) === "(" && sv.charAt(2) === ")"
            ? sv.charAt(1)
            : 0;
        if (cnot > 0) sv = sv.substring(3);
        if (sv.charAt(0) == "^") {
          sv = sv.substring(1); //;--父对象
          // ref = _rfpar; 暂不处理
        }
        bvdiv = sv.charAt(0) == ","; //;--','换成";"
        if (bvdiv) sv = sv.substring(1);
        x1 = cells === null ? -1 : this.getCellIndex(cells, sv);
        if (x1 < 0) return null;
        if (data === null) return null;
        o0 = data[sv];
      } else o0 = null;
      let cel = cells[x1];
      if (cel.xucc > 0) {
        //return proc_ucc(cels, ref.c_vals, ov, x1, sf);
        return null;
      }
      let itp = 0;
      if (chinn === "A") {
        itp = cel.ccType;
        chinn = this.sqlTypeToChar(itp);
      } else itp = -999999;
      let bDT = chinn === "D" || chinn === "T";
      let bundiv = false,
        bne = true;
      if (bDT && iYMD >= 0) {
        bundiv = (iYMD & 0x100) != 0; //;--年月没有分隔。
        sv = this.dateToString(o0, !bundiv, iYMD & 0xff); //;--日期格式
      } else {
        sv = this.objToString(o0, cel.ccType); //;-保持单元指定类型
        //复合字段不处理
        // if (bmul && sv != null)
        // sv = CCliTool.toMSQLString(sv, true);//;-复合字段
      }
      if (sv !== null && (bvdiv || cnot != 0)) {
        if (cnot !== 0) {
          if (sv.charAt(0) == cnot) sv = sv.substring(1);
          sv = sv.replace(String.fromCharCode(cnot), ","); //;-替换标识字符
        }
        if (bvdiv) sv = sv.replace(",", ";");
      }
      if (sk !== null && sk.length > 0) {
        c0 = sk.charAt(0);
        let notNull = (cel.c_par.attr & 0x80) != 0 && (cel.attr & 0x2) != 0; //;-不为空的单元必需有值
        if (c0 === "=") {
          if ((cel.attr & 0x20000000) != 0 && this.isAutoFit(sv))
            sv = "%" + sv + "%"; //匹配功能
          if (itp === -999999) itp = this.charToSQLType(chinn);
          sv = this.toBlurCond(sf, itp, sv, (cel.attr & 0x4000000) != 0);
          if (sv) {
            return sv;
          }
          throw "not match value";
        }
        if (c0 === "<" || c0 === ">") {
          sv = this.getCondItem(sv, c0 == "<"); //;--取得第一项或最后一项。
          if (!sv) return null;
        }
        if (bqc) {
          return null;
        }
        if (bDT) {
          if (bundiv) return sk === null ? sv : sf + " " + sk + " " + sv; //;--直接值
          return sv === null || sv.length < 1
            ? null
            : this.sqlDate(sf, chinn === "T", sk, sv);
        }
        if (chinn === "C") sv = this.sqlString(sv);
        return sk !== null ? sf + sk + sv : sv;
      }
    },
    /**
     * 用于取条件中的第一项或最后一项(<,<=)或最后一项(>,>=)，如期初值关联
     * @param {*} sv
     * @param {*} bL
     */
    getCondItem(sv, bL) {
      let t0 = sv !== null ? sv.length - 1 : -1,
        x0;
      if (t0 < 0) return null;
      let sFH = ",;+~";
      if (bL) {
        for (x0 = 0; x0 <= t0 && sFH.indexOf(sv.charAt(x0)) < 0; x0++);
        if (x0 == 0) return "";
        return x0 > t0 ? sv : sv.substring(0, x0);
      }
      for (x0 = t0; x0 >= 0 && sFH.indexOf(sv.charAt(x0)) < 0; x0--);
      if (x0 == t0) return "";
      return x0 < 0 ? sv : sv.substring(x0 + 1);
    },
    /**
     * 拼条件，模糊匹配。支持:A~B;C%;D;E;F...,它默认为A<=x<=B,如果想用A<x<B,则在前后加上"()",如：(A-B "11~22;45;78";"~BJS-123;EAS-%;EEE00;eee11";"1999-10-10~;1999-10-10;1999;2000-10-10 10";
     * 格式化：[%D|T+FIELDNAME<=VALUE],[%SVALUE];
     */
    toBlurCond(fname, type, ocd, blvl) {
      let sc0 =
        ocd === null || typeof ocd === "string"
          ? ocd
          : this.objToString(ocd, type);
      if (sc0 === null || sc0.length < 1) return null;
      let chinn = this.sqlTypeToChar(type);
      let t0,
        x0,
        ic0 = 0;
      let sr0 = "",
        st0,
        s0,
        s1,
        slk;
      let cor = this.findIndex4(sc0, ";", 0, true, false) > -1 ? ";" : ",";
      let cand = this.findIndex4(sc0, "~", 0, true, false) > -1 ? "~" : "+";
      let band = false,
        b0,
        b1,
        bdt = chinn === "D" || chinn === "T";
      while (sc0 != null) {
        x0 = this.findIndex(sc0, cor, 0, true, false);
        if (x0 < 0) {
          st0 = sc0;
          sc0 = null;
        } else {
          st0 = sc0.substring(0, x0);
          sc0 = sc0.substring(x0 + 1);
        }
        if (st0.length < 1) continue;
        b0 = st0.charAt(0) === "&"; //;-排除的用 "and" 运算
        if (b0) st0 = st0.substring(1);
        x0 = this.findIndex(st0, cand, 0, false, false);
        if (x0 < 0)
          st0 = this.toBlurConda(
            fname,
            blvl ? this.trimLevel(st0) + "%" : st0,
            chinn
          );
        else {
          t0 = st0.charAt(0) === "(" ? 1 : 0;
          if (x0 > t0) {
            s0 = st0.substring(t0, x0);
            slk = t0 > 0 ? ">" : ">=";
            if (bdt) s0 = this.sqlDate(fname, chinn === "T", slk, s0);
            else {
              if (chinn === "C") s0 = this.sqlString(this.filterESC(s0, null));
              s0 = fname + slk + s0;
            }
          } else s0 = null;
          x0++;
          t0 = st0.length - 1;
          if (x0 <= t0) {
            b1 = st0.charAt(t0) !== ")";
            s1 = b1 ? st0.substring(x0) : st0.substring(x0, t0);
            slk = b1 ? "<=" : "<";
            if (bdt) s1 = this.sqlDate(fname, chinn === "T", slk, s1);
            else {
              if (chinn === "C")
                s1 =
                  blvl && b1
                    ? "'" + s1 + "zz'"
                    : this.sqlString(this.filterESC(s1, null)); //;-注意分级指定前面值时包括子级
              s1 = fname + slk + s1;
            }
            if (s0 == null) st0 = s1;
            else {
              st0 = s0 + " and " + s1;
              if (!b0) st0 = "(" + st0 + ")"; //;-前面是"or"
            }
          } else st0 = s0;
        }
        if (ic0 === 0) sr0 = st0;
        else {
          if (b0 !== band && ic0 > 1) sr0 = "(" + sr0 + ")";
          sr0 += (b0 ? " and " : " or ") + st0;
        }
        ic0++;
        band = b0;
      }
      return ic0 < 2 ? sr0 : "(" + sr0 + ")";
    },

    toBlurConda(fname, sc0, ct) {
      let t0 = sc0.length;
      let c0 = sc0.charAt(0);
      let b0 = c0 === "!";
      if (b0) {
        if (t0 === 1) return fname + " is not null";
        sc0 = sc0.substring(1);
      } else if (c0 === "\\") sc0 = sc0.substring(1);
      else if (c0 === "=" && t0 === 1) return fname + " is null";
      let sk = b0 ? "<>" : "=";
      if (ct === "D" || ct === "T")
        return this.sqlDate(fname, ct === "T", sk, sc0);
      if (ct === "C") {
        sc0 = this.sqlString(this.filterESC(sc0, null));
        t0 = sc0.length;
        for (let i = 0; i < t0; i++) {
          c0 = sc0.charAt(i);
          if (c0 === "%" || c0 === "?") {
            sk = b0 ? " not like " : " like ";
            sc0 = sc0.replace("?", "_");
            break;
          }
        }
      }
      return fname + sk + sc0;
    },

    filterESC(s0, sCH) {
      let cc = s0 != null ? s0.length : 0;
      if (cc < 1) return s0;
      let x0 = s0.indexOf("\\");
      if (x0 < 0) return s0;
      let cs0 = s0.split(""),
        c0;
      let buf = s0.substring(0, x0);
      let b1 = sCH !== null && sCH.length > 0;
      while (x0 < cc) {
        c0 = cs0[x0++];
        if (c0 === "\\" && x0 < cc) {
          c0 = cs0[x0++];
          if (b1 && sCH.indexOf(c0) < 0) buf += "\\";
        }
        buf += c0;
      }
      return buf;
    },

    sqlString(s) {
      if (s === null) return "null";
      if (s.length < 1) return "''";
      //  if (haveTranCH(s)) { 转移
      //   s = addESC(s, "[]'\"");
      //   return "[%S" + s + "]";
      //  }
      return "'" + s + "'";
    },

    sqlDate(fName, btime, slk, sc) {
      if (fName === null) fName = "";
      if (fName.length < 1 || fName.charAt(0) !== "@") {
        sc = this.checkDate(sc, false);
        return (
          "[%" +
          (btime ? "T" : "D") +
          fName +
          (slk == null ? "" : slk) +
          sc +
          "]"
        );
      }
      fName = fName.substring(1); //;--@
      let x0 = sc.indexOf("-"),
        x1;
      let s0 = "1";
      if (x0 > 0) {
        x0++;
        x1 = sc.indexOf("-", x0);
        s0 = x1 < 0 ? sc.substring(x0) : sc.substring(x0, x1);
        sc = sc.substring(0, x0 - 1);
      }
      x0 = fName.indexOf(",");
      if (x0 < 0) return fName + slk + sc + (s0.length < 2 ? "0" + s0 : s0);
      x1 = fName.indexOf(".");
      return (
        "(" +
        fName.substring(0, x0) +
        slk +
        sc +
        " and " +
        (x1 > 0 ? fName.substring(0, x1 + 1) : "") +
        fName.substring(x0 + 1) +
        slk +
        s0 +
        ")"
      );
    },

    checkDate(s0, ymd) {
      let xs = this.dateToAry(s0);
      if (xs === null) return null;
      let cc = xs[6];
      return this.dateArrToString(xs, 0, ymd && cc > 3 ? 3 : cc, true); //;-年月日
    },

    dateArrToString(xs, x0, x1, bdiv) {
      let sb = "",
        iv = 0;
      if (bdiv) {
        let sdiv = "--- :: ";
        while (x0 < x1) {
          sb += sdiv.charAt(x0);
          iv = xs[x0];
          if (iv < 10) sb += "0";
          sb += iv;
          x0++;
        }
        return sb.substr(1);
      }
      while (x0 < x1) {
        iv = xs[x0];
        if (iv < 10) sb += "0";
        sb += iv;
        x0++;
      }
      return sb;
    },

    dateToAry(sd) {
      let cc = sd === null ? 0 : sd.length;
      if (cc < 1) return null;
      let cs0 = sd.split(""),
        c0 = cs0[0].charCodeAt(0);
      if (
        (c0 < "0".charCodeAt(0) || c0 > "9".charCodeAt(0)) &&
        c0 !== ";".charCodeAt(0) &&
        c0 !== ",".charCodeAt(0)
      )
        return null;
      let xs = [0, 1, 1, 0, 0, 0, 0];
      let cx = 0,
        t0 = 0;
      let bv = false;
      for (let i = 0; i < cc && cx < 6; i++) {
        c0 = cs0[i].charCodeAt(0);
        if (c0 >= "0".charCodeAt(0) && c0 <= "9".charCodeAt(0)) {
          t0 = t0 * 10 + c0 - "0".charCodeAt(0);
          bv = true;
        } else if (bv) {
          xs[cx++] = t0;
          t0 = 0;
          bv = false;
        }
      }
      if (bv && cx < 6) xs[cx++] = t0;
      if (cx < 1) return null; //;--必需至少有一项。
      t0 = xs[0]; //;--校验年月(日期做条件时,输入不完整)
      if (t0 === 0) {
        xs[0] = moment().year();
        xs[1] = moment().month() + 1;
        cx = 2;
      } else if (t0 < 1000) xs[0] += 2000;
      xs[6] = cx; //调整后的真正个数(对条件有用)
      return xs;
    },

    isAutoFit(o0) {
      if (o0) {
        let cc = o0.length;
        if (cc < 1) return false;
        for (let i = 0; i < cc; i++) {
          if ("%_?~+;,".indexOf(s0.charAt(i)) >= 0) return false;
        }
        return true;
      }
      return false;
    },

    objToString(value, sqltype) {
      if (value) {
        if (sqltype === 91) {
          return this.dateToString(value, true, 1);
        } else if (sqltype === 93) {
          return this.dateToString(value, true, 2);
        } else {
          return value + "";
        }
      }
      return null;
    },

    dateToString(ov, bdiv, fmt) {
      if (ov) {
        if (fmt === 4) {
          return moment(ov).year() + "";
        }
        if (fmt === 5) {
          return moment(ov).month() + 1 + "";
        }
        if (fmt === 0) {
          return moment(ov).format(bdiv ? "YYYY-MM" : "YYYYMM");
        }
        if (fmt === 1) {
          return moment(ov).format(bdiv ? "YYYY-MM-DD" : "YYYYMMDD");
        }
        if (fmt === 6 || fmt === 2) {
          return moment(ov).format(
            bdiv ? "YYYY-MM-DD HH:mm:ss" : "YYYYMMDD HH:mm:ss"
          );
        }
        if (fmt === 3) {
          return moment(ov).format("HH:mm:ss");
        }
        if (fmt === 7) {
          return moment(ov).format("HH:mm");
        }
      }
      return null;
    },

    getCellIndex(cells, sv) {
      let idx = _.findIndex(cells, cell => {
        return cell.id === sv;
      });
      return idx;
    },

    toVarYMD(sv, ch0, cc) {
      if (
        ch0 === "Y" &&
        (cc === 1 ||
          (sv.charAt(1) === "M" &&
            (cc === 2 || (cc === 3 && sv.charAt(2) === "D"))))
      )
        return cc === 1 ? 4 : cc === 2 ? 0 : 1;
      if (cc === 1 && (ch0 === "y" || ch0 === "m"))
        return 0x100 + (ch0 == "y" ? 4 : 5); //--年月独立。
      if (cc === 2 && ch0 === "y" && sv.charAt(1) === "m")
        //--年月独立。
        return 0x100 + 0;
      return -1;
    },
    sqlTypeToChar(type) {
      if (type === 12 || type === 1 || type == -9 || type == -16) return "C";
      if (type === 3 || type === 6 || type === 8 || type === 2) return "N";
      if (type === 5 || type === 4 || type === -5) return "I";
      return type === 91 ? "D" : type === 93 || type === 92 ? "T" : "C";
    },

    toF_K_V(sv0) {
      let c0 = "=",
        cs0 = sv0.split("");
      let t0 = cs0.length,
        x0 = 0;
      for (x0 = 0; x0 < t0; x0++) {
        c0 = cs0[x0];
        if (c0 === "=" || c0 === ">" || c0 === "<" || c0 === " ") break;
      }
      if (x0 >= t0) return sv0;
      let x01 = x0;
      if (c0 === " ") {
        for (x01++; x01 < t0; x01++) {
          c0 = cs0[x01];
          if (c0 > " ") break;
        }
      }
      if (x01 >= t0) return sv0;
      let s0 = null;
      let b0 = true;
      let x1 = x01 + 1,
        x2;
      if (c0 === "=" || c0 === ">" || c0 === "<") {
        c0 = cs0[x1];
        if (c0 === "=" || c0 === "<" || c0 === ">") x1++;
      } else {
        ////;-like,in或not like,not in
        for (; x1 < t0 && cs0[x1] > " "; x1++);
        s0 = sv0.substring(x01, x1).toLowerCase();
        if (s0 === "not") {
          for (x1++; x1 < t0 && cs0[x1] <= " "; x1++);
          for (x2 = x1; x1 < t0 && cs0[x1] > " "; x1++);
          s0 = sv0.substring(x2, x1).toLowerCase();
        }
        b0 = "like" === s0 || "in" === s0;
      }
      if (b0) {
        for (x2 = x1; x2 < t0 && cs0[x2] <= " "; x2++);
        if (x2 < t0) {
          let vv = [];
          vv[0] = sv0.substring(0, x0);
          vv[1] = sv0.substring(x01, x1);
          vv[2] = sv0.substring(x2);
          return vv;
        }
      }
      return sv0;
    },

    toCorpSQLVar(sf, ico) {
      let c0 = sf.charAt(0);
      let cf = sf.length;
      if (
        (c0 == "_" || c0 == "*") &&
        (cf < 2 || this.findIndex4(sf, "=<>", 0, true) < 0)
      ) {
        if (ico < 1) return "";
        sf = cf > 1 ? sf.substring(1) : "c_corp";
        let s0 = sf + "=" + ico;
        return c0 === "_" ? s0 : "(" + s0 + " or " + sf + "<1)";
      }
      return null;
    },
    findIndex4(str, sdiv, xfr, bsp) {
      let c0 = null;
      let cs0 = typeof str === "string" ? str.split("") : str;
      let cc = cs0 === null ? 0 : cs0.length;
      for (; xfr < cc; xfr++) {
        c0 = cs0[xfr];
        if ((bsp && c0 <= " ") || sdiv.indexOf(c0) >= 0) return xfr;
      }
      return -1;
    },

    /**
     * 查找单一分隔符。
     */
    findIndex(str, cch, xfr, quote, barcket) {
      return this.findIndex2(str, cch, xfr, quote, barcket, null);
    },

    /**
     * 查找多分隔符。
     */
    findIndex2(str, cch, xfr, quote, barcket, exdiv) {
      let c0 = null;
      let cs0 = typeof str === "string" ? str.split("") : str;
      let cc = cs0 === null ? 0 : cs0.length;
      let bex = exdiv !== null && exdiv.length > 0,
        bc0 = cch === "\0";
      if (bc0) cch = ";";
      for (; xfr < cc; xfr++) {
        c0 = cs0[xfr];
        if (
          c0 === cch ||
          (bc0 && cch === ",") ||
          (bex && exdiv.indexOf(c0) >= 0)
        )
          return xfr;
        if (c0 === "\\") xfr++;
        else if (quote && (c0 === "'" || c0 === '"'))
          xfr = this.nextQuote4(cs0, xfr, cc, c0);
        else if (barcket && (c0 === "(" || c0 === "[" || c0 === "{"))
          xfr = this.nextBarcket4(cs0, xfr, cc, c0);
      }
      return -1;
    },

    sqlQuery(sql, type) {
      var posParams = {
        snkey: JSON.parse(window.sessionStorage.getItem("snkey")),
        apiId: global.APIID_SQL,
        assistid: sql,
        type: type
      };
      return this.doAPi(posParams);
    },

    async doAPi(posParams) {
      const url = global.BIPAPIURL + global.API_COM;
      var res = await axios.post(url, qs.stringify(posParams));
      console.log(res);
      return res;
    }
  }
};
</script>
