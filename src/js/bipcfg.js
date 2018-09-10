global.APIID_LOGOUT = 'logout';//登出
global.APIID_MPARAMS = 'mparam';//获取菜单参数
global.APIID_CELLPARAM = 'cellparam';//获取cell
global.APIID_CELLPARAMS = 'cellparams';//
global.APIID_MENUPARAM = 'menuparam';//获取菜单信息
global.APIID_LOGIN = 'login';//登陆ID
global.APIID_AID = 'assist';//辅助id
global.APIID_AIDO = 'assisto';//辅助获取数据（旧的）
global.APIID_VAR = 'variable';//变量
global.APIID_FINDDATA = 'finddata';//获取数据
global.APIID_EXPDATA = 'expdata';//导出数据
global.APIID_FINDCELLDATA = 'findcelldata';//获取celldata
global.APIID_SAVEDATA = 'savedata';//保存数据
global.APIID_CHKUP = 'chkup';//审核ID
global.FULLDATE = '^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$';
global.YEARMONTH = '^(?:(?!0000)[0-9]{4}-(?:0[1-9]|1[0-2])|[0-9]{4})$';
global.APIID_FILEUP = 33; //上传文件
global.APIID_FILEDEL= 34;//删除文件
global.APIID_FILEINFO = 35;//文件信息
global.APIID_FILEDOWN = 36;//下载文件列表

//任务和消息
global.APIID_TA_MSG = 'taskmsg';
global.APIID_TM_ALL  = 200;//获取任务和消息
global.APIID_TM_TASK  = 201;//只获取未处理任务
global.APIID_TM_TASK_DTL  = 211;//任务明细
global.APIID_TM_MSG  = 202;//只获取未处理消息
global.APIID_TM_MSG_DTL  = 212;//只获取未处理消息
global.APIID_TM_MSG_UPD  = 213;//更新消息状态
global.APIID_TM_RL  = 249;//重新加载RMQ配置信息

//执行selectSQL语句

global.APIID_SQL  = 'sts';//执行sql查询
