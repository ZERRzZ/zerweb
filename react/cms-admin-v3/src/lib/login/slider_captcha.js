/*! Verify&admin MIT License by anji-plus*/
import $ from "jquery"
import {aesEncrypt, aesDecrypt} from './aes.ts'
import env from "@/constants/env.json"

(function ($, window, document) {

    var wrapEndHtml
    var wrapStartHtml
    var uid
    var host = env.baseApiUrl;

    //请求图片get事件
    function getPictrue(chaptchaType) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: host + "/captcha/get?captcha_type=" + chaptchaType,
                dataType: 'json',
                cache: false,
                type: "get",
                success: function (res) {
                    uid = res.data.token
                    resolve(res)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })

    }

    //验证图片check事件
    function checkPictrue(data,authKey) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: host + "/captcha/check",
                dataType: 'json',
                type: "post",
                cache: false,
                data: JSON.stringify(data),    //请求参数包装函数   此方法再signUtil.js可修改
                contentType: "application/json;charset=UTF-8",
                header:{
                    "Auth-Key":authKey
                },
                success: function (res) {
                    resolve(res,authKey)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    }

    //定义Slide的构造函数
    var Slide = function (ele, opt) {
            this.$element = ele;
            this.backToken = null;
            this.moveLeftDistance = 0;
            this.y = 0;
            this.refreshTime = 0;
            this.refreshLimit = 6;
            this.defaults = {
                containerId: '',
                captchaType: "PUZZLE",
                mode: 'fixed',	//弹出式pop，固定fixed
                vOffset: 5,
                vSpace: 5,
                loadingImg: '',
                explain: '拖动左边滑块完成拼图',
                imgSize: {
                    width: '300px',
                    height: '150px',
                },
                blockSize: {
                    width: '55px',
                    height: '55px',
                },
                circleRadius: '0px',
                barSize: {
                    width: '300px',
                    height: '55px',
                },
                ready: function () {
                },
                success: function () {
                },
                error: function () {
                }

            };
            this.options = $.extend({}, this.defaults, opt);
    };

    //定义Slide的方法
    Slide.prototype = {
        init: function () {
            var _this = this;
            //加载页面
            this.loadDom();
            _this.refresh();
            this.options.ready();

            this.$element[0].onselectstart = document.body.ondrag = function () {
                return false;
            };

            if (this.options.mode == 'pop') {

                _this.$element.find('.verifybox-close').on('click', function () {
                    _this.$element.find(".mask").css("display", "none");
                });

                // var clickBtn = document.getElementById(this.options.containerId);
                // clickBtn && (clickBtn.onclick = function(){
                //     _this.$element.find(".mask").css("display","block");
                // })

                // 弹出按钮直接在业务js中设置    贺一珊20200507
                _this.$element.find(".mask").css("display", "block");
            }

            //按下
            this.htmlDoms.move_block.on('touchstart', function (e) {
                _this.start(e);
            });

            this.htmlDoms.move_block.on('mousedown', function (e) {
                _this.start(e);
            });


            //拖动
            document.addEventListener("touchmove", function (e) {

                _this.move(e);
            });

            document.addEventListener("mousemove", function (e) {
                _this.move(e);
            });

            //鼠标松开
            document.addEventListener("touchend", function () {
                _this.end();
            });

            //解决touchend移动端部分浏览器不触发
            document.addEventListener("touchcancel", function () {
                _this.end();
            });

            document.addEventListener("mouseup", function () {
                _this.end();
            });

            //刷新
            _this.$element.find('.verifybox-refresh').on('click', function () {
                _this.refresh();
            });

            $('.verify-left-bar').each(function (index, el) {
                el.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                }, false);
            });
        },

        //初始化加载
        loadDom: function () {
            var _this = this;
            this.status = false;	//鼠标状态
            this.isEnd = false;		//是够验证完成
            this.setSize = this.resetSize(this);	//重新设置宽度高度
            this.plusWidth = 0;
            this.plusHeight = 0;
            this.x = 0;
            this.y = 0;
            var panelHtml = '';
            var wrapHtml = '';
            this.lengthPercent = (parseInt(this.setSize.img_width) - parseInt(this.setSize.block_width) - parseInt(this.setSize.circle_radius) - parseInt(this.setSize.circle_radius) * 0.8) / (parseInt(this.setSize.img_width) - parseInt(this.setSize.bar_height));

            wrapStartHtml = '<div class="mask">' +
                '<div class="verifybox" style="width:' + (parseInt(this.setSize.img_width) * 1 + 30) + 'px">' +
                '<div class="verifybox-top">' +
                '请完成安全验证' +
                '<span class="verifybox-refresh">' +
                '<i class="iconfont icon-refresh"></i>' +
                '</span>' +
                '<span class="verifybox-close">' +
                '<i class="iconfont icon-close"></i>' +
                '</span>' +
                '</div>' +
                '<div class="verifybox-bottom" style="padding:15px">' +
                '<div style="position: relative;">'

            if (this.options.mode == 'pop') {
                panelHtml = wrapStartHtml
            }
            panelHtml += '<div class="verify-img-out">' +
                '<div class="verify-img-panel">' +
                '<span class="verify-tips"  class="suc-bg"></span>' +
                '<img src="' + this.options.loadingImg + '" class="backImg" ondragstart = "return false;" style="width:100%;height:100%;display:block">' +
                '</div>' +
                '</div>';

            this.plusWidth = parseInt(this.setSize.block_width) + parseInt(this.setSize.circle_radius) * 2 - parseInt(this.setSize.circle_radius) * 0.2;
            this.plusHeight = parseInt(this.setSize.block_height) + parseInt(this.setSize.circle_radius) * 2 - parseInt(this.setSize.circle_radius) * 0.2;

            panelHtml += '<div class="verify-bar-area" style="width:_this.setSize.img_width;height:_this.setSize.bar_height;line-height:_this.setSize.bar_height">' +
                '<span  class="verify-msg">${this.options.explain}</span>' +
                '<div class="verify-left-bar">' +
                '<span class="verify-msg"></span>' +
                '<div  class="verify-move-block">' +
                '<i  class="verify-icon iconfont icon-right"></i>' +
                '<div class="verify-sub-block">' +
                '<img src="" class="bock-backImg" alt="" ondragstart = "return false;" style="width:${this.options.blockSize.width};height:${this.options.blockSize.height};display:block;position: absolute;top: ${this.y};">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            wrapEndHtml = '</div></div></div></div>'
            if (this.options.mode == 'pop') {
                panelHtml += wrapEndHtml
            }

            this.$element.html(panelHtml);
            this.htmlDoms = {
                tips: this.$element.find('.verify-tips'),
                sub_block: this.$element.find('.verify-sub-block'),
                out_panel: this.$element.find('.verify-img-out'),
                img_panel: this.$element.find('.verify-img-panel'),
                img_canvas: this.$element.find('.verify-img-canvas'),
                bar_area: this.$element.find('.verify-bar-area'),
                move_block: this.$element.find('.verify-move-block'),
                left_bar: this.$element.find('.verify-left-bar'),
                msg: this.$element.find('.verify-msg'),
                icon: this.$element.find('.verify-icon'),
                refresh: this.$element.find('.verifybox-refresh')
            };

            this.$element.css('position', 'relative');

            this.htmlDoms.sub_block.css({
                'height': this.setSize.img_height,
                'width': Math.ceil(parseInt(this.setSize.img_width) * 55 / 300) + 'px',  //根据图片尺寸改变
                'top': -(parseInt(this.setSize.img_height) + this.options.vSpace) + 'px'
            });
            this.htmlDoms.out_panel.css('height', parseInt(this.setSize.img_height) + this.options.vSpace + 'px');
            this.htmlDoms.img_panel.css({'width': this.setSize.img_width, 'height': this.setSize.img_height});
            this.htmlDoms.bar_area.css({
                'width': this.setSize.img_width,
                'height': this.setSize.bar_height,
                'line-height': this.setSize.bar_height
            });
            this.htmlDoms.move_block.css({'width': this.setSize.bar_height, 'height': this.setSize.bar_height});
            this.htmlDoms.left_bar.css({'width': this.setSize.bar_height, 'height': this.setSize.bar_height});
        },


        //鼠标按下
        start: function (e) {
            this.startMoveTime = new Date().getTime();
            if (this.isEnd == false) {
                this.htmlDoms.msg.text('');
                this.htmlDoms.move_block.css('background-color', '#337ab7');
                this.htmlDoms.left_bar.css('border-color', '#337AB7');
                this.htmlDoms.icon.css('color', '#fff');
                e.stopPropagation();
                this.status = true;
            }
        },

        //鼠标移动
        move: function (e) {

            if (this.status && this.isEnd == false) {
                if (!e.touches) {    //兼容移动端
                    var x = e.clientX;
                } else {     //兼容PC端
                    var x = e.touches[0].pageX;
                }
                var bar_area_left = this.htmlDoms.bar_area[0].getBoundingClientRect().left;
                var move_block_left = x - bar_area_left; //小方块相对于父元素的left值
                if (move_block_left >= (this.htmlDoms.bar_area[0].offsetWidth - parseInt(this.setSize.bar_height) + parseInt(parseInt(this.setSize.block_width) / 2) - 2)) {
                    move_block_left = (this.htmlDoms.bar_area[0].offsetWidth - parseInt(this.setSize.bar_height) + parseInt(parseInt(this.setSize.block_width) / 2) - 2);
                }
                if (move_block_left <= parseInt(parseInt(this.setSize.block_width) / 2)) {
                    move_block_left = parseInt(parseInt(this.setSize.block_width) / 2);
                }
                //拖动后小方块的left值

                this.htmlDoms.move_block.css('left', move_block_left - parseInt(parseInt(this.setSize.block_width) / 2) + "px");
                this.htmlDoms.left_bar.css('width', move_block_left - parseInt(parseInt(this.setSize.block_width) / 2) + "px");
                this.htmlDoms.sub_block.css('left', "0px");

                this.moveLeftDistance = move_block_left - parseInt(parseInt(this.setSize.block_width) / 2)
            }
        },

        //鼠标松开
        end: function () {
            this.endMovetime = new Date().getTime();
            var _this = this;
            //判断是否重合
            if (this.status && this.isEnd == false) {
                var vOffset = parseInt(this.options.vOffset);
                this.moveLeftDistance = this.moveLeftDistance * 300 / parseInt(this.setSize.img_width)
                //图片滑动
                var data = {
                    "captcha_type": this.options.captchaType,
                    "point_json": aesEncrypt(JSON.stringify({x: Math.round(this.moveLeftDistance), y: this.y})),
                    // "point_json": JSON.stringify({x: Math.round(this.moveLeftDistance), y: this.y}),
                    "token": this.backToken
                }
                // var captchaVerification = aesEncrypt(this.backToken+'---'+JSON.stringify({x:this.moveLeftDistance,y:5.0}))
                checkPictrue(data,_this.options.authKey).then(function (res) {
                    // 请求反正成功的判断
                    if (res.data === true) {
                        _this.htmlDoms.move_block.css('background-color', '#5cb85c');
                        _this.htmlDoms.left_bar.css({'border-color': '#5cb85c', 'background-color': '#fff'});
                        _this.htmlDoms.icon.css('color', '#fff');
                        _this.htmlDoms.icon.removeClass('icon-right');
                        _this.htmlDoms.icon.addClass('icon-check');

                        //提示框
                        _this.htmlDoms.tips.addClass('suc-bg').removeClass('err-bg')
                        _this.htmlDoms.tips.css({
                            "display": "block",
                            animation: "move 1s cubic-bezier(0, 0, 0.39, 1.01)"
                        });
                        _this.htmlDoms.tips.text(((_this.endMovetime - _this.startMoveTime) / 1000).toFixed(2) + 's验证成功')

                        _this.isEnd = true;
                        setTimeout(function (res) {
                            _this.$element.find(".mask").css("display", "none");
                            _this.htmlDoms.tips.css({"display": "none", animation: "none"});
                            // _this.refresh();
                        }, 1000)
                        // _this.options.success({captchaVerification});
                        _this.options.success(uid);
                    } else {
                        _this.htmlDoms.move_block.css('background-color', '#d9534f');
                        _this.htmlDoms.left_bar.css('border-color', '#d9534f');
                        _this.htmlDoms.icon.css('color', '#fff');
                        _this.htmlDoms.icon.removeClass('icon-right');
                        _this.htmlDoms.icon.addClass('icon-close');

                        _this.htmlDoms.tips.addClass('err-bg').removeClass('suc-bg')
                        _this.htmlDoms.tips.css({
                            "display": "block",
                            animation: "move 1s cubic-bezier(0, 0, 0.39, 1.01)"
                        });
                        _this.htmlDoms.tips.text('验证失败')

                        setTimeout(function () {
                            _this.refresh();
                        }, 400);

                        setTimeout(function () {
                            _this.htmlDoms.tips.css({"display": "none", animation: "none"});
                        }, 1000)
                        _this.options.error(_this);
                    }
                })
                _this.status = false;
            }
        },

        resetSize: function (obj) {
            var img_width, img_height, bar_width, bar_height, block_width, block_height, circle_radius;	//图片的宽度、高度，移动条的宽度、高度
            var parentWidth = obj.$element.parent().width() || $(window).width();
            var parentHeight = obj.$element.parent().height() || $(window).height();

            if (obj.options.imgSize.width.indexOf('%') != -1) {
                img_width = parseInt(obj.options.imgSize.width) / 100 * parentWidth + 'px';
            } else {
                img_width = obj.options.imgSize.width;
            }

            if (obj.options.imgSize.height.indexOf('%') != -1) {
                img_height = parseInt(obj.options.imgSize.height) / 100 * parentHeight + 'px';
            } else {
                img_height = obj.options.imgSize.height;
            }

            if (obj.options.barSize.width.indexOf('%') != -1) {
                bar_width = parseInt(obj.options.barSize.width) / 100 * parentWidth + 'px';
            } else {
                bar_width = obj.options.barSize.width;
            }

            if (obj.options.barSize.height.indexOf('%') != -1) {
                bar_height = parseInt(obj.options.barSize.height) / 100 * parentHeight + 'px';
            } else {
                bar_height = obj.options.barSize.height;
            }

            if (obj.options.blockSize) {
                if (obj.options.blockSize.width.indexOf('%') != -1) {
                    block_width = parseInt(obj.options.blockSize.width) / 100 * parentWidth + 'px';
                } else {
                    block_width = obj.options.blockSize.width;
                }


                if (obj.options.blockSize.height.indexOf('%') != -1) {
                    block_height = parseInt(obj.options.blockSize.height) / 100 * parentHeight + 'px';
                } else {
                    block_height = obj.options.blockSize.height;
                }
            }

            if (obj.options.circleRadius) {
                if (obj.options.circleRadius.indexOf('%') != -1) {
                    circle_radius = parseInt(obj.options.circleRadius) / 100 * parentHeight + 'px';
                } else {
                    circle_radius = obj.options.circleRadius;
                }
            }

            return {
                img_width: img_width,
                img_height: img_height,
                bar_width: bar_width,
                bar_height: bar_height,
                block_width: block_width,
                block_height: block_height,
                circle_radius: circle_radius
            };
        },

        //刷新
        refresh: function () {
            if (this.refreshTime < this.refreshLimit){
                var _this = this;
                _this.htmlDoms.refresh.show();
                _this.$element.find('.verify-msg:eq(1)').text('');
                _this.$element.find('.verify-msg:eq(1)').css('color', '#000');
                _this.htmlDoms.move_block.animate({'left': '0px'}, 'fast');
                _this.htmlDoms.left_bar.animate({'width': parseInt(_this.setSize.bar_height)}, 'fast');
                _this.htmlDoms.left_bar.css({'border-color': '#ddd'});

                _this.htmlDoms.move_block.css('background-color', '#fff');
                _this.htmlDoms.icon.css('color', '#000');
                _this.htmlDoms.icon.removeClass('icon-close');
                _this.htmlDoms.icon.addClass('icon-right');
                _this.$element.find('.verify-msg:eq(0)').text(_this.options.explain);
                _this.isEnd = false;
                _this.$element.find(".bock-backImg")[0].src = '';
                getPictrue("PUZZLE").then(function (res) {
                    _this.$element.find(".backImg")[0].src = 'data:image/jpg;base64,' + res.data.shade_image;
                    _this.$element.find(".bock-backImg")[0].src = 'data:image/png;base64,' + res.data.cutout_image;
                    _this.backToken = res.data.token;
                    // _this.y = JSON.parse(res.data.point_json).y;
                    _this.y = JSON.parse(aesDecrypt(res.data.point_json)).y;
                    $('.bock-backImg').css('top', _this.y)
                });
                _this.htmlDoms.sub_block.css('left', "0px");
                this.refreshTime++;
            } else{
                $('.mask').hide();
                // var modal = new HtModal("尝试次数过多，请重试！", '', 0, '');
                // modal.initReminder();
            }

        },
    };

    // 定义Points的构造函数
    var Points = function (ele, opt) {
            this.$element = ele;
            this.backToken = null;
            this.refreshTime = 0;
            this.refreshLimit = 6;
            this.defaults = {
                captchaType: "CLICK",
                containerId: '',
                loadingImg: '',
                mode: 'fixed',	//弹出式pop，固定fixed
                checkNum: 3,	//校对的文字数量
                vSpace: 5,	//间隔
                imgSize: {
                    width: '300px',
                    height: '150px',
                },
                barSize: {
                    width: '300px',
                    height: '50px',
                },
                ready: function () {
                },
                success: function () {
                },
                error: function () {
                }
            };
            this.options = $.extend({}, this.defaults, opt);
    };

    //定义Points的方法
    Points.prototype = {

        init: function () {

            var _this = this;
            //加载页面
            _this.loadDom();

            _this.refresh();
            _this.options.ready();

            this.$element[0].onselectstart = document.body.ondrag = function () {
                return false;
            };

            if (this.options.mode == 'pop') {

                _this.$element.find('.verifybox-close').on('click', function () {
                    _this.$element.find(".mask").css("display", "none");
                });

                // var clickBtn = document.getElementById(this.options.containerId);
                // clickBtn && (clickBtn.onclick = function () {
                //     _this.$element.find(".mask").css("display", "block");
                // })

                _this.$element.find(".mask").css("display", "block");
            }

            // 注册点击验证事件
            _this.$element.find('.back-img').on('click', function (e) {

                _this.checkPosArr.push(_this.getMousePos(this, e));

                if (_this.num == _this.options.checkNum) {
                    _this.num = _this.createPoint(_this.getMousePos(this, e));
                    //按比例转换坐标值
                    _this.checkPosArr = _this.pointTransfrom(_this.checkPosArr, _this.setSize);
                    setTimeout(function () {
                        var data = {
                            "captcha_type": _this.options.captchaType,
                            "point_json": aesEncrypt(JSON.stringify(_this.checkPosArr)),
                            "token": _this.backToken
                        }
                        // var captchaVerification = aesEncrypt(_this.backToken + '---' + JSON.stringify(_this.checkPosArr))
                        checkPictrue(data,_this.options.authKey).then(function (res) {
                            if (res.data === true) {
                                _this.$element.find('.verify-bar-area').css({
                                    'color': '#4cae4c',
                                    'border-color': '#5cb85c'
                                });
                                // _this.$element.find('.verify-msg').text('验证成功');
                                _this.$element.find('.verifybox-refresh').hide();
                                _this.$element.find('.verify-img-panel').unbind('click');
                                setTimeout(function (res) {
                                    _this.$element.find(".mask").css("display", "none");
                                    // _this.refresh();
                                }, 1000)
                                _this.options.success(uid);
                                // _this.options.success({captchaVerification});
                            } else {
                                _this.options.error(_this);
                                _this.$element.find('.verify-bar-area').css({
                                    'color': '#d9534f',
                                    'border-color': '#d9534f'
                                });
                                _this.$element.find('.verify-msg').text('验证失败');
                                setTimeout(function () {
                                    _this.$element.find('.verify-bar-area').css({
                                        'color': '#000',
                                        'border-color': '#ddd'
                                    });
                                    _this.refresh();
                                }, 400);
                            }
                        })
                    }, 400);

                }
                if (_this.num < _this.options.checkNum) {
                    _this.num = _this.createPoint(_this.getMousePos(this, e));
                }
            });

            //刷新
            _this.$element.find('.verifybox-refresh').on('click', function () {
                _this.$element.find('.verify-msg').text('加载中...');
                _this.refresh();
            });

        },

        //加载页面
        loadDom: function () {
            var _this = this;
            this.fontPos = [];	//选中的坐标信息
            this.checkPosArr = [];	//用户点击的坐标
            this.num = 1;	//点击的记数

            var panelHtml = '';
            var wrapStartHtml = '';

            this.setSize = Slide.prototype.resetSize(_this);	//重新设置宽度高度

            wrapStartHtml = '<div class="mask">' +
                '<div class="verifybox" style="width:' + (parseInt(this.setSize.img_width) * 1 + 30) + 'px">' +
                '<div class="verifybox-top">' +
                '请完成安全验证' +
                '<span class="verifybox-refresh">' +
                '<i class="iconfont icon-refresh"></i>' +
                '</span>' +
                '<span class="verifybox-close">' +
                '<i class="iconfont icon-close"></i>' +
                '</span>' +
                '</div>' +
                '<div class="verifybox-bottom" style="padding:15px">' +
                '<div style="position: relative;">'

            if (this.options.mode == 'pop') {
                panelHtml = wrapStartHtml
            }

            panelHtml += '<div class="verify-img-out">' +
                '<div class="verify-img-panel">' +
                '<img src="' + this.options.loadingImg + '" class="back-img" width="' + this.setSize.img_width + '" height="' + this.setSize.img_height + '">' +
                '</div>' +
                '</div>' +
                '<div class="verify-bar-area" style="width:_this.setSize.img_width;height:_this.setSize.bar_height;line-height:_this.setSize.bar_height">' +
                '<span  class="verify-msg"></span>' +
                '</div>';

            wrapEndHtml = '</div></div></div></div>'

            if (this.options.mode == 'pop') {
                panelHtml += wrapEndHtml
            }

            this.$element.html(panelHtml);

            this.htmlDoms = {
                back_img: this.$element.find('.back-img'),
                out_panel: this.$element.find('.verify-img-out'),
                img_panel: this.$element.find('.verify-img-panel'),
                bar_area: this.$element.find('.verify-bar-area'),
                msg: this.$element.find('.verify-msg'),
            };

            this.$element.css('position', 'relative');

            this.htmlDoms.out_panel.css('height', parseInt(this.setSize.img_height) + this.options.vSpace + 'px');
            this.htmlDoms.img_panel.css({
                'width': this.setSize.img_width,
                'height': this.setSize.img_height,
                'background-size': this.setSize.img_width + ' ' + this.setSize.img_height,
                'margin-bottom': this.options.vSpace + 'px'
            });
            this.htmlDoms.bar_area.css({
                'width': this.setSize.img_width,
                'height': this.setSize.bar_height,
                'line-height': this.setSize.bar_height
            });

        },

        //获取坐标
        getMousePos: function (obj, event) {
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.clientX - ($(obj).offset().left - $(window).scrollLeft());
            var y = e.clientY - ($(obj).offset().top - $(window).scrollTop());

            return {'x': x, 'y': y};
        },

        //创建坐标点
        createPoint: function (pos) {
            this.htmlDoms.img_panel.append('<div class="point-area" style="background-color:#1abd6c;color:#fff;z-index:9999;width:20px;height:20px;text-align:center;line-height:20px;border-radius: 50%;position:absolute;top:' + parseInt(pos.y - 10) + 'px;left:' + parseInt(pos.x - 10) + 'px;">' + this.num + '</div>');
            return ++this.num;
        },

        //刷新
        refresh: function () {
            if(this.refreshTime < this.refreshLimit){
                var _this = this;
                this.$element.find('.point-area').remove();
                this.fontPos = [];
                this.checkPosArr = [];
                this.num = 1;
                getPictrue("CLICK").then(function (res) {
                    _this.htmlDoms.back_img[0].src = 'data:image/png;base64,' + res.data.original_image;
                    _this.backToken = res.data.token;
                    var text = '请依次点击【' + res.data.word_list.join(",") + '】';
                    _this.$element.find('.verify-msg').text(text);
                })
                this.refreshTime++;
            }else{
                $('.mask').hide();
                // var modal = new HtModal("尝试次数过多，请重试！", '', 0, '');
                // modal.initReminder();
            }

        },
        pointTransfrom: function (pointArr, imgSize) {
            var newPointArr = pointArr.map(function (p) {
                var x = Math.round(300 * p.x / parseInt(imgSize.img_width));
                var y = Math.round(150 * p.y / parseInt(imgSize.img_height));
                // return {x, y};
                return {x: x, y: y}
            })
            return newPointArr
        }
    };

    // 定义Chars的构造函数
    var Chars = function (ele, opt) {
            this.$element = ele;
            this.backToken = null;
            this.inputCode = null;
            this.refreshTime = 0;
            this.refreshLimit = 6;
            this.defaults = {
                captchaType: 'CHAR',
                loadingImg: '',
                mode: 'pop',
                imgSize: {
                    width: '100px',
                    height: '40px',
                },
                ready: function () {
                },
                success: function () {
                },
                error: function () {
                }
            };
            this.options = $.extend({}, this.defaults, opt);
    };
    //定义Char的方法
    Chars.prototype = {
        init: function () {
            var _this = this;
            _this.loadDom();
            _this.refresh();
            _this.options.ready();


            _this.$element.find(".mask").css("display", "block");
            _this.$element.find('.verifybox-close').on('click', function () {
                _this.$element.find(".mask").css("display", "none");
            });
            _this.$element.find('.delete_icon.delete_code').on('click', function () {
                _this.$element.find('.verifycode_img').val('');
            });
            _this.$element.find('.verifycode_img').focus(function () {
                _this.$element.find('.delete_icon.delete_code').show();
                _this.$element.find('.verify-msg').removeClass('char').text('');
            });
            _this.$element.find('.verifycode_img').blur(function () {
                setTimeout(function () {
                    _this.$element.find('.delete_icon.delete_code').hide()
                }, 100)
            });

            // 提交点击事件
            _this.$element.find(".verify-button").on('click', function () {
                // 校验验证码
                if (_this.$element.find('.verifycode_img').val().toString().length < 1) {
                    _this.$element.find('.verify-msg').addClass('char').text('验证码不能为空');
                    // element = true;
                }else if(_this.$element.find('.verifycode_img').val().toString().length < 4){
                    _this.$element.find('.verify-msg').addClass('char').text('请输入正确的验证码');
                    // element = true;
                } else {
                    setTimeout(function () {
                        var data = {
                            "captcha_type": _this.options.captchaType,
                            "token": _this.backToken,
                            "code": aesEncrypt(_this.$element.find('.verifycode_img').val())
                        }
                        checkPictrue(data,_this.options.authKey).then(function (res) {
                            if (res.data === true) {
                                // _this.$element.find('.verify-msg').addClass('char').text('验证成功');
                                _this.$element.find('.verifybox-refresh').hide();
                                _this.options.success(uid);
                                // _this.$element.find('.verify-img-panel').unbind('click');
                                setTimeout(function (res) {
                                    _this.$element.find(".mask").css("display", "none");
                                    // _this.refresh();
                                    _this.$element.find('.verify-msg').addClass('char').text('');
                                }, 1000)

                            } else {
                                _this.options.error(_this);
                                _this.$element.find('.verify-msg').addClass('char').text('验证失败，请重新尝试');
                                _this.refresh();

                            }
                        })
                    }, 400)
                }
            });

            //刷新
            _this.$element.find('.verifybox-refresh').on('click', function () {
                _this.refresh();
            });
        },

        loadDom: function () {
            var _this = this;
            var panelHtml = '';
            var wrapStartHtml = '';

            wrapStartHtml = '<div class="mask">' +
                '<div class="verifybox" style="width:300px">' +
                '<div class="verifybox-top">' +
                '请完成安全验证' +
                '<span class="verifybox-refresh">' +
                '<i class="iconfont icon-refresh"></i>' +
                '</span>' +
                '<span class="verifybox-close">' +
                '<i class="iconfont icon-close"></i>' +
                '</span>' +
                '</div>' +
                '<div class="verifybox-bottom">' +
                '<div style="position: relative;">'

            if (this.options.mode == 'pop') {
                panelHtml = wrapStartHtml
            }

            panelHtml += '<div class="verify-img-out">' +
                // '<div class="verify-img-panel">' +
                '<img src="" class="back-img" width="' + _this.options.imgSize.width + '" height="' + _this.options.imgSize.height + '">' +
                // '</div>' +
                '<input type="text" id="verifycode_img" class="verifycode_img" maxlength="4" placeholder="请输入验证码">' +
                '<i class="delete_icon delete_code"></i>' +
                '</div>' +
                // '<div class="verify-bar-area">' +
                '<div  class="verify-msg"></div>' +
                // '</div>' +
                '<div class="verify-button">提交</div>';

            wrapEndHtml = '</div></div></div></div>'

            if (this.options.mode == 'pop') {
                panelHtml += wrapEndHtml
            }

            this.$element.html(panelHtml);

            this.htmlDoms = {
                back_img: this.$element.find('.back-img'),
                // msg: this.$element.find('.verify-msg'),
            }

        },

        refresh: function () {
            if(this.refreshTime < this.refreshLimit){
                var _this = this;
                /*_this.$element.find('.verify-msg').text('');*/
                _this.$element.find('.verifycode_img').val('');
                getPictrue("CHAR").then(function (res) {
                    _this.htmlDoms.back_img[0].src = 'data:image/png;base64,' + res.data.original_image;
                    _this.backToken = res.data.token;
                });
                this.refreshTime++;
            }else{
                $('.mask').hide();
                // var modal = new HtModal("尝试次数过多，请重试！", '', 0, '');
                // modal.initReminder();
            }
        }
    };

    //在插件中使用slideVerify对象
    $.fn.slideVerify = function (options, callbacks) {
        var slide = new Slide(this, options);
        slide.init();
    };

    // 在插件中使用clickVerify对象
    $.fn.pointsVerify = function (options, callbacks) {
        var points = new Points(this, options);
        points.init();
    };

    // 在插件中使用charVerify对象
    $.fn.charVerify = function (options, callbacks) {
        var chars = new Chars(this, options);
        chars.init();
    };


})($, window, document);

export default $