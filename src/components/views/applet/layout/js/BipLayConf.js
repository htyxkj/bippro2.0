export default class BipLayConf {
    constructor(_bcomp, _comp, _name) {
        this.bcells = false; //是否是布局
        this.name = '';
        this.bcells = _bcomp;
        this.comp = _comp;
        this.name = _name;
    }
}