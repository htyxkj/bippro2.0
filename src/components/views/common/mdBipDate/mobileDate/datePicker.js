 /* jshint esversion: 6 */ 
export default {
    mounted() { 

    },
    data() {
        return {
            trigger:null,
            format:'',
            gearDate:null,
            minY : 1900,//最小年
            minM : 1,//最小月
            minD : 1,//最小天
            maxY : 2999,//最大年
            maxM : 12,//最大月
            maxD : 31,//最大天
            isTouched:false,//是否触动
            isMoved:false,
            pree:null,
            date_yy_display:'',
            date_mm_display:'',
            date_dd_display:'',
            time_hh_display:'',
            time_mm_display:'',
            time_ss_display:'',
            checkV:'', 
        }
    },
    methods:{ 
        pickerDate (trigger,format,success,error,maxDate,minDate) {
            this.maxMinDate(maxDate,minDate);
            this.success = success;
            this.error = error;
            this.format = format;
            this.trigger = document.querySelector(trigger);  
            if(this.format == 'YYYY-MM-DD'){
                this.time_hh_display='display:none;';
                this.time_mm_display='display:none;';
                this.time_ss_display='display:none;';
            }else if(this.format == 'YYYY-MM-DD hh:mm:ss'){

            }else if(this.format == 'hh:mm'){
                this.date_yy_display='display:none;';
                this.date_mm_display='display:none;';
                this.date_dd_display='display:none;';
                this.time_ss_display='display:none;';
            }else if(this.format == 'hh:mm:ss'){
                this.date_yy_display='display:none;';
                this.date_mm_display='display:none;';
                this.date_dd_display='display:none;';
            }else if(this.format == 'YYYYMM' || this.format =='YYYY-MM'){
                this.date_dd_display='display:none;';
                this.time_hh_display='display:none;';
                this.time_mm_display='display:none;';
                this.time_ss_display='display:none;';
            }   
            this.popupDate();
        },
        popupDate(e) {
            this.gearDate = document.createElement("div");
            this.gearDate.className = "gearDate";
            this.gearDate.innerHTML = 
                '<div class="date_ctrl slideInUp" style="-webkit-overflow-scrolling：auto">' +
                    '<div class="date_btn_box">' +
                        '<div class="date_btn lcalendar_cancel">取消</div>' +
                        '<div class="date_btn lcalendar_finish">确定</div>' +
                    '</div>' +
                    '<div class="date_roll_mask">' +
                        '<div class="date_roll">' +
                        '<div style="'+this.date_yy_display+'">' +
                                '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                                '<div class="date_grid">' +
                                    '<div>年</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="'+this.date_mm_display+'">' +
                                '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                                '<div class="date_grid">' +
                                    '<div>月</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="'+this.date_dd_display+'">' +
                                '<div class="gear date_dd" data-datetype="date_dd"></div>' +
                                '<div class="date_grid">' +
                                    '<div>日</div>' +
                                '</div>' +
                            '</div>' + 

                            '<div style="'+this.time_hh_display+'">' +
                                '<div class="gear time_hh" data-datetype="time_hh"></div>' +
                                '<div class="date_grid">' +
                                    '<div>时</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="'+this.time_mm_display+'">' +
                                '<div class="gear time_mm" data-datetype="time_mm"></div>' +
                                '<div class="date_grid">' +
                                    '<div>分</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="'+this.time_ss_display+'">' +
                                '<div class="gear time_ss" data-datetype="time_ss"></div>' +
                                '<div class="date_grid">' +
                                    '<div>秒</div>' +
                                '</div>' +
                            '</div>' +



                        '</div>' +
                    '</div>' +
                '</div>'+
                '<div class="date_bg" style="width:100%;height:100%;-webkit-overflow-scrolling：auto"></div>';
            document.body.appendChild(this.gearDate);
            this.dateCtrlInit();
            this.timeCtrlInit();
            var lcalendar_cancel = this.gearDate.querySelector(".lcalendar_cancel");//取消按钮
            lcalendar_cancel.addEventListener("touchend", this.closeMobileCalendar);
            var lcalendar_finish = this.gearDate.querySelector(".lcalendar_finish");//确定按钮
            lcalendar_finish.addEventListener('touchend', this.finishMobileDate);
            var lcalendar_bg = this.gearDate.querySelector(".date_bg");//非日期内容
            lcalendar_bg.addEventListener('click', this.closeMobileCalendar);
            var date_yy = this.gearDate.querySelector(".date_yy");//年
            var date_mm = this.gearDate.querySelector(".date_mm");//月
            var date_dd = this.gearDate.querySelector(".date_dd");//日
            var time_hh = this.gearDate.querySelector(".time_hh");//时
            var time_mm = this.gearDate.querySelector(".time_mm");//分
            var time_ss = this.gearDate.querySelector(".time_ss");//秒


            date_yy.addEventListener('touchstart', this.gearTouchStart);
            date_mm.addEventListener('touchstart', this.gearTouchStart);
            date_dd.addEventListener('touchstart', this.gearTouchStart);
            time_hh.addEventListener('touchstart', this.gearTouchStart);
            time_mm.addEventListener('touchstart', this.gearTouchStart);
            time_ss.addEventListener('touchstart', this.gearTouchStart);

            date_yy.addEventListener('touchmove', this.gearTouchMove);
            date_mm.addEventListener('touchmove', this.gearTouchMove);
            date_dd.addEventListener('touchmove', this.gearTouchMove);
            time_hh.addEventListener('touchmove', this.gearTouchMove);
            time_mm.addEventListener('touchmove', this.gearTouchMove);
            time_ss.addEventListener('touchmove', this.gearTouchMove);


            date_yy.addEventListener('touchend', this.gearTouchEnd);
            date_mm.addEventListener('touchend', this.gearTouchEnd);
            date_dd.addEventListener('touchend', this.gearTouchEnd);
            time_hh.addEventListener('touchend', this.gearTouchEnd);
            time_mm.addEventListener('touchend', this.gearTouchEnd);
            time_ss.addEventListener('touchend', this.gearTouchEnd);
            // //-------------------------------------------------------------
            // lcalendar_cancel.addEventListener('click', this.closeMobileCalendar);
            // lcalendar_finish.addEventListener('click', this.finishMobileDate);
            date_yy.addEventListener('mousedown', this.gearTouchStart);
            date_mm.addEventListener('mousedown', this.gearTouchStart);
            date_dd.addEventListener('mousedown', this.gearTouchStart);
            date_yy.addEventListener('mousemove', this.gearTouchMove);
            date_mm.addEventListener('mousemove', this.gearTouchMove);
            date_dd.addEventListener('mousemove', this.gearTouchMove);
            date_yy.addEventListener('mouseup', this.gearTouchEnd);
            date_mm.addEventListener('mouseup', this.gearTouchEnd);
            date_dd.addEventListener('mouseup', this.gearTouchEnd);
            this.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', this.gearTouchOut);
            this.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', this.gearTouchOut);
        },
        //初始化年月日插件默认值
        dateCtrlInit() {
            var date = new Date();
            var dateArr = {
                yy: date.getYear(),
                mm: date.getMonth(),
                dd: date.getDate() - 1, 
            };
            if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(this.trigger.value)) {
                var rs = this.trigger.value.match(/(^|-)\d{1,4}/g);
                dateArr.yy = rs[0] - this.minY;
                dateArr.mm = rs[1].replace(/-/g, "") - 1;
                dateArr.dd = rs[2].replace(/-/g, "") - 1;
            } else {
                dateArr.yy = dateArr.yy + 1900 - this.minY;
            }
            this.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
            this.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
            this.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd); 

            this.setDateGearTooth();
        },
        //重置日期节点个数
        setDateGearTooth() {
            var passY = this.maxY - this.minY + 1;
            var date_yy = this.gearDate.querySelector(".date_yy");
            var itemStr = "";
            if (date_yy && date_yy.getAttribute("val")) {
                //得到年份的值
                var yyVal = parseInt(date_yy.getAttribute("val"));
                //p 当前节点前后需要展示的节点个数
                for (var p = 0; p <= passY - 1; p++) {
                    itemStr += "<div class='tooth'>" + (this.minY + p) + "</div>";
                }
                date_yy.innerHTML = itemStr;
                var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
                if (!isNaN(top)) {
                    top % 2 == 0 ? (top = top) : (top = top + 1);
                    top > 8 && (top = 8);
                    var minTop = 8 - (passY - 1) * 2;
                    top < minTop && (top = minTop);
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
                    date_yy.setAttribute('top', top + 'em');
                    yyVal = Math.abs(top - 8) / 2;
                    date_yy.setAttribute("val", yyVal);
                } else {
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
                    date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
                }
            } else {
                return;
            }
            var date_mm = this.gearDate.querySelector(".date_mm");
            if (date_mm && date_mm.getAttribute("val")) {
                itemStr = "";
                //得到月份的值
                var mmVal = parseInt(date_mm.getAttribute("val"));
                var maxM = 11;
                var minM = 0;
                //当年份到达最大值
                if (yyVal == passY - 1) {
                    maxM = this.maxM - 1;
                }
                //当年份到达最小值
                if (yyVal == 0) {
                    minM = this.minM - 1;
                }
                //p 当前节点前后需要展示的节点个数
                for (var p = 0; p < maxM - minM + 1; p++) {
                    itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
                }
                date_mm.innerHTML = itemStr;
                if (mmVal > maxM) {
                    mmVal = maxM;
                    date_mm.setAttribute("val", mmVal);
                } else if (mmVal < minM) {
                    mmVal = maxM;
                    date_mm.setAttribute("val", mmVal);
                }
                date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
                date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
            } else {
                return;
            }
            var date_dd = this.gearDate.querySelector(".date_dd");
            if (date_dd && date_dd.getAttribute("val")) {
                itemStr = "";
                //得到日期的值
                var ddVal = parseInt(date_dd.getAttribute("val"));
                //返回月份的天数
                var maxMonthDays = this.calcDays(yyVal, mmVal);
                //p 当前节点前后需要展示的节点个数
                var maxD = maxMonthDays - 1;
                var minD = 0;
                //当年份月份到达最大值
                if (yyVal == passY - 1 && this.maxM == mmVal + 1) {
                    maxD = this.maxD - 1;
                }
                //当年、月到达最小值
                if (yyVal == 0 && this.minM == mmVal + 1) {
                    minD = this.minD - 1;
                }
                for (var p = 0; p < maxD - minD + 1; p++) {
                    itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
                }
                date_dd.innerHTML = itemStr;
                if (ddVal > maxD) {
                    ddVal = maxD;
                    date_dd.setAttribute("val", ddVal);
                } else if (ddVal < minD) {
                    ddVal = minD;
                    date_dd.setAttribute("val", ddVal);
                }
                date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
                date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');
            } else {
                return;
            }  
        },
        //初始化时分插件默认值
        timeCtrlInit() {
            var d = new Date();
            var e = {
                hh: d.getHours(),
                mm: d.getMinutes(),
                ss: d.getSeconds(),
            };
            if (/^\d{2}:\d{2}$/.test(this.trigger.value)) {
                rs = this.trigger.value.match(/(^|:)\d{2}/g);
                e.hh = parseInt(rs[0].replace(/^0?/g, ""));
                e.mm = parseInt(rs[1].replace(/:0?/g, ""))
                e.ss = parseInt(rs[2].replace(/:0?/g, ""))
            }
            this.gearDate.querySelector(".time_hh").setAttribute("val", e.hh);
            this.gearDate.querySelector(".time_mm").setAttribute("val", e.mm);
            this.gearDate.querySelector(".time_ss").setAttribute("val", e.ss);
            this.setTimeGearTooth();
        },
        //重置时间节点个数
        setTimeGearTooth() {
            var time_hh = this.gearDate.querySelector(".time_hh");
            if (time_hh && time_hh.getAttribute("val")) {
                var i = "";
                var hhVal = parseInt(time_hh.getAttribute("val"));
                for (var g = 0; g <= 23; g++) {
                    i += "<div class='tooth'>" + g + "</div>";
                }
                time_hh.innerHTML = i;
                time_hh.style["-webkit-transform"] = 'translate3d(0,' + (8 - hhVal * 2) + 'em,0)';
                time_hh.setAttribute('top', 8 - hhVal * 2 + 'em');
            } else {
                return
            }
            var time_mm = this.gearDate.querySelector(".time_mm");
            if (time_mm && time_mm.getAttribute("val")) {
                var i = "";
                var mmVal = parseInt(time_mm.getAttribute("val"));
                for (var g = 0; g <= 59; g++) {
                    i += "<div class='tooth'>" + g + "</div>";
                }
                time_mm.innerHTML = i;
                time_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - mmVal * 2) + 'em,0)';
                time_mm.setAttribute('top', 8 - mmVal * 2 + 'em');
            } else {
                return
            }
            var time_ss = this.gearDate.querySelector(".time_ss");
            if (time_ss && time_ss.getAttribute("val")) {
                var i = "";
                var ssVal = parseInt(time_ss.getAttribute("val"));
                for (var g = 0; g <= 59; g++) {
                    i += "<div class='tooth'>" + g + "</div>";
                }
                time_ss.innerHTML = i;
                time_ss.style["-webkit-transform"] = 'translate3d(0,' + (8 - ssVal * 2) + 'em,0)';
                time_ss.setAttribute('top', 8 - ssVal * 2 + 'em');
            } else {
                return
            }
        },
        //求月份最大天数
        calcDays(year, month) {
            if (month == 1) {
                year += this.minY;
                if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
                    return 29;
                } else {
                    return 28;
                }
            } else {
                if (month == 3 || month == 5 || month == 8 || month == 10) {
                    return 30;
                } else {
                    return 31;
                }
            }
        },
        //取消
        closeMobileCalendar(e) {
            e.stopPropagation()
            document.body.removeChild(this.gearDate);
        },
        //日期确认
        finishMobileDate(e) {
            var passY = this.maxY - this.minY + 1;
            var date_yy = parseInt(Math.round(this.gearDate.querySelector(".date_yy").getAttribute("val")));
            var date_mm = parseInt(Math.round(this.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
            date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
            var date_dd = parseInt(Math.round(this.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
            date_dd = date_dd > 9 ? date_dd : '0' + date_dd;

            var time_hh = parseInt(Math.round(this.gearDate.querySelector(".time_hh").getAttribute("val")));
            time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
            var time_mm = parseInt(Math.round(this.gearDate.querySelector(".time_mm").getAttribute("val")));
            time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
            var time_ss = parseInt(Math.round(this.gearDate.querySelector(".time_ss").getAttribute("val")));
            time_ss = time_ss > 9 ? time_ss : '0' + time_ss;

            var v = (date_yy % passY + this.minY) + "-" + date_mm + "-" + date_dd +' '+time_hh+':'+time_mm+':'+time_ss;
            this.trigger.value = v; 
            this.checkV = v;
            this.success(this.checkV)
            setTimeout(() => {
                this.closeMobileCalendar(e); 
            }, 200);  
        },
        //触摸开始
        gearTouchStart(e) {
            if (this.isMoved || this.isTouched) return;         
            this.isTouched = true;    
            e.stopPropagation();
            var target = e.target;
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            clearInterval(target["int_" + target.id]);
            target["old_" + target.id] = e.targetTouches ? e.targetTouches[0].screenY : e.pageY;
            target["o_t_" + target.id] = (new Date()).getTime();
            var top = target.getAttribute('top');
            if (top) {
                target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
            } else {
                target["o_d_" + target.id] = 0;
            };
            this.pree=e;
        },
        //手指移动
        gearTouchMove(e) {
            if (!this.isTouched) return;
            this.isMoved = true;
            e.stopPropagation();
            var target;
            if(this.pree) {
                target = this.pree.target; 
            }else{
                target = e.target;
            }
            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            target["new_" + target.id] = e.targetTouches ? e.targetTouches[0].screenY : e.pageY;
            target["n_t_" + target.id] = (new Date()).getTime();
            //var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / target.clientHeight;
            var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
            target["pos_" + target.id] = target["o_d_" + target.id] + f;
            target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
            target.setAttribute('top', target["pos_" + target.id] + 'em');
        },
        //离开屏幕
        gearTouchEnd(e) {
            if (!this.isTouched || !this.isMoved) {
                this.isTouched = this.isMoved = false;
                return;
            }
            this.isTouched = this.isMoved = false;
            e.stopPropagation(); 

            var target;
            if(this.pree) {
                target = this.pree.target; 
            }else{
                target = e.target;
            }

            while (true) {
                if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                } else {
                    break;
                }
            }
            var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
            if (Math.abs(flag) <= 0.2) {
                target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
            } else {
                if (Math.abs(flag) <= 0.5) {
                    target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                } else {
                    target["spd_" + target.id] = flag / 2;
                }
            }
            if (!target["pos_" + target.id]) {
                target["pos_" + target.id] = 0;
            }
            this.rollGear(target);
            this.pree=null;
        },
        //缓动效果
        rollGear(target) {
            let _this =this;
            var d = 0;
            var stopGear = false;
            var passY = this.maxY - this.minY + 1;
            clearInterval(target["int_" + target.id]);
            target["int_" + target.id] = setInterval(function() {
                var pos = target["pos_" + target.id];
                var speed = target["spd_" + target.id] * Math.exp(-0.1 * d);
                pos += speed;
                if (Math.abs(speed) > 0.1) {} else {
                    speed = 0.1;
                    var b = Math.round(pos / 2) * 2;
                    if (Math.abs(pos - b) < 0.05) {
                        stopGear = true;
                    } else {
                        if (pos > b) {
                            pos -= speed
                        } else {
                            pos += speed
                        }
                    }
                }
                if (pos > 8) {
                    pos = 8;
                    stopGear = true;
                }
                switch (target.dataset.datetype) {
                    case "date_yy":
                        var minTop = 8 - (passY - 1) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            stopGear = true;
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2;
                            _this.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "date_mm":
                        var date_yy = _this.gearDate.querySelector(".date_yy");
                        //得到年份的值
                        var yyVal = parseInt(date_yy.getAttribute("val"));
                        var maxM = 11;
                        var minM = 0;
                        //当年份到达最大值
                        if (yyVal == passY - 1) {
                            maxM = _this.maxM - 1;
                        }
                        //当年份到达最小值
                        if (yyVal == 0) {
                            minM = _this.minM - 1;
                        }
                        var minTop = 8 - (maxM - minM) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            stopGear = true;
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2 + minM;
                            _this.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "date_dd":
                        var date_yy = _this.gearDate.querySelector(".date_yy");
                        var date_mm = _this.gearDate.querySelector(".date_mm");
                        //得到年份的值
                        var yyVal = parseInt(date_yy.getAttribute("val"));
                        //得到月份的值
                        var mmVal = parseInt(date_mm.getAttribute("val"));
                        //返回月份的天数
                        var maxMonthDays = _this.calcDays(yyVal, mmVal);
                        var maxD = maxMonthDays - 1;
                        var minD = 0;
                        //当年份月份到达最大值
                        if (yyVal == passY - 1 && _this.maxM == mmVal + 1) {
                            maxD = _this.maxD - 1;
                        }
                        //当年、月到达最小值
                        if (yyVal == 0 && _this.minM == mmVal + 1) {
                            minD = _this.minD - 1;
                        }
                        var minTop = 8 - (maxD - minD) * 2;
                        if (pos < minTop) {
                            pos = minTop;
                            stopGear = true;
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2 + minD;
                            _this.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "time_hh":
                        if (pos < -38) {
                            pos = -38;
                            stopGear = true;
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2;
                            _this.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "time_mm":
                        if (pos < -110) {
                            pos = -110;
                            stopGear = true;
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2;
                            _this.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    case "time_ss":
                        if (pos < -110) {
                            pos = -110;
                            stopGear = true;
                        }
                        if (stopGear) {
                            var gearVal = Math.abs(pos - 8) / 2;
                            _this.setGear(target, gearVal);
                            clearInterval(target["int_" + target.id]);
                        }
                        break;
                    default:
                }
                target["pos_" + target.id] = pos;
                target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                target.setAttribute('top', pos + 'em');
                d++;
            }, 30);
        },
        //控制插件滚动后停留的值
        setGear(target, val) {
            val = Math.round(val);
            target.setAttribute("val", val);
            if (/date/.test(target.dataset.datetype)) {
                this.setDateGearTooth();
            } else {
                this.setTimeGearTooth();
            }
        },
        //离开区域
        gearTouchOut(e) {
            this.gearTouchEnd(this.pree);
        },
        success(checkV){
            
        },
        error(){},
        maxMinDate(maxDate,minDate){ 
            if(maxDate){
                var arr = maxDate.split(/[- : \/]/);
                if(!arr[3])
                    arr[3] = "00"
                if(!arr[4])
                    arr[4] = "00"
                if(!arr[5])
                    arr[5] = "00" 
                this.maxY = arr[0];
                this.maxM = arr[1];
                this.maxD = arr[2]; 
            }
            if(minDate){
                var arr = minDate.split(/[- : \/]/);
                if(!arr[3])
                    arr[3] = "00"
                if(!arr[4])
                    arr[4] = "00"
                if(!arr[5])
                    arr[5] = "00" 
                this.minY = arr[0];
                this.minM = arr[1];
                this.minD = arr[2]; 
            }
        },
    }
}     