import BipLayCells from './BipLayCells';
import BipLayConf from './BipLayConf'; 
export class BipLayout {
    constructor(_laystr, _cells) {
        console.log("BipLayout")
        this.layType = 'B';
        this.binit = false;
        this.ccells = [];
        this.laystr = _laystr;
        this.compconfs = new Array();
        if (this.laystr) {
            //初始化界面组成 
            let index = this.laystr.indexOf(':');
            if (_cells) {
                this.ccells = _cells;
            }
            if (index > 0) {
                //T:(@100103#725[~tprn]//合同基本信息;100103C#728//出租房屋信息;100103B#830//合同金额及收款约定;@100103#725[f1~f3]//其他约定项)
                this.layType = this.laystr.substring(0, index);
                let str = this.laystr.substring(index + 1);
                str = str.substring(1, str.length - 1); 
                let comps = this.doLayout(str);
                console.log(comps);
                comps.forEach(cmpstr => {
                    if (cmpstr.indexOf(':') > 0) {
                        let cp = new BipLayout(cmpstr, _cells);
                        let cc = new BipLayConf(false, cp, '');
                        this.compconfs.push(cc);
                    } else if(cmpstr !==""){
                        let objid = this.getObjId(cmpstr);
                        let cel = this.getCells(objid, true, this.ccells);
                        let lay = new BipLayCells(cmpstr, cel);
                        let cc = new BipLayConf(true, lay, lay.name);
                        this.compconfs.push(cc);
                    }
                });
            }
            else {
                let objid = this.getObjId(this.laystr);
                let cel = this.getCells(objid, true, this.ccells);
                let lay = new BipLayCells(this.laystr, cel);
                let cc = new BipLayConf(true, lay, lay.name);
                this.compconfs.push(cc);
            }
            this.binit = true;
        }
    }
    doLayout(str) {
        let hv = new Array();
        let cs0 = str.split('');
        let cdv = 0;
        let buf = '';
        cs0.forEach(c0 => {
            if (c0 === '(' || c0 === '[') {
                cdv++;
            }
            else if (c0 === ')' || c0 === ']') {
                cdv--;
            }
            else if (cdv === 0 && (c0 === ';' || c0 === ',')) {
                hv.push(buf);
                buf = '';
                c0 = '';
            }
            buf += c0;
        });
        hv.push(buf);
        return hv;
    }
    getCells(objid, bchild = true, _cells) {
        let c = null;
        for (let i = 0; i < _cells.length; i++) {
            let cell = _cells[i];
            if (cell.obj_id === objid) {
                c = cell;
                break;
            }
            if (cell.haveChild) {
                let cel = this.getCells(objid, true, cell.subLayCells);
                if (cel) {
                    c = cel;
                    break;
                }
                continue;
            }
        }
        return c;
    }
    getObjId(str){
        if (str.startsWith("@")) str = str.substring(1);
        let index = str.indexOf("#");
        if (index > 0) {
          str = str.substring(0, index);
          return str;
        } 
        index = str.indexOf("[");
        if (index > 0) {
          str = str.substring(0, index);
        }
        index = str.indexOf("/");
        if (index > 0) {
          str = str.substring(0, index);
        }
        index = str.indexOf("*");
        if (index > 0) {
          str = str.substring(0, index);
          return str;
        }
        return str;
    }
}
//# sourceMappingURL=BipLayout.js.map