const DENSIY = 0x1;//压缩
const BROWSE = 0x2;//浏览
const SELECT = 0x4;//查询
const CACHE =0x8;//缓存 
const INSERT = 0x10; //增加
const DELETE = 0x20; //加删除标志
const SAVE = 0x40;//保存

const FILE = 0x800;//文件
const COUNT = 0x8000;//统计

const menuPattr = { 
  DENSIY,
  BROWSE,
  SELECT,
  CACHE,
  INSERT,
  DELETE,
  SAVE,
  FILE,
  COUNT,
}

export default menuPattr;