$(function() {
    //返回上一级
    function goback() {
        history.go(-1);
    }
    /*==============第一步购物车交互 start===============*/

    /*删除购物车中的课程*/
    function del(id) {
        if (window.confirm('您确定删除该课程吗？')) {
            $.ajax({
                url: '/ShoppingCart/delCart/',
                dataType: 'json',
                type: 'POST',
                data: 'id=' + id,
                success: function() {
                    window.location.reload();
                },
                error: function() {
                    alert('读取数据错误..');
                }
            });
            return true;
        } else {
            return false;
        }
    }

    /*
     * 购物车验证
     */
    function makeOrder() {
        var arr = [];
        $('body').find('.shop-car-select:visible').parents('.media').each(function() {
            var id = $(this).data('id');
            arr.push(id);
        });
        $.ajax({
            url: '/ShoppingCart/makeCart/',
            type: 'post',
            dataType: 'json',
            data: {
                id: arr
            },
            success: function(msg) {
                if (msg.sign == -1) {
                    alert(msg.errorMsg);
                }
                if (msg.sign == 1 || msg.sign == 2) {
                    //alert(msg.url);
                    window.location.href = msg.msg;
                }
                if (msg.sign == 5) {
                    for (var i = 0; i < msg.errorCids.length; i++) {
                        $("#cart" + msg.errorCids[i]).css('backgroundColor', '#F5D3D3');
                    }
                    alert(msg.errorMsg);
                }
                if (msg.sign == 3 || msg.sign == 4) {
                    for (var i = 0; i < msg.errorCids.length; i++) {
                        $("#cart" + msg.errorCids[i]).css('backgroundColor', '#F5D3D3');
                    }
                    alert(msg.errorMsg);
                }
            }
        });
    };
    var $body = $('body'),
        num = $body.find('.shop-car-select:visible').length, //选中的按钮的数量
        $account = $('#account'), //结算按钮
        price,
        $infoem = $('.order_pay_info .all-pay em'), //合计的价钱
        sum = 0,
        $selectall = $('.shop-car-select-all'), //全选按钮
        $select = $('.shop-car-select'), //选中按钮
        $selectcancel = $('.shop-car-select-cancel'), //未选中按钮
        $selectallspan = $('.select-all em'), //全选和取消全选字眼
        $selectbox = $('.select-box'), //选择按钮盒子
        $selectcancelall = $('.shop-car-select-cancel-all'); //取消全选按钮
    if (num == 0) {
        $('.order_pay_info button[id=account]').css('background', '#ccc');
        $('.order_pay_info button[id=account]').attr("disabled", true);
    } else {
        $('.order_pay_info button[id=account]').css('background', '#e74c3c');
        $('.order_pay_info button[id=account]').removeAttr("disabled");
    }
    $account.html('结算(' + num + ')');
    $body.find('.shop-car-select:visible').parents('.media').find('.course-price em').each(function(k, v) {
        sum += ($(v).text().match(/\d+/g)[0] * 1);
    });
    $infoem.html(sum); //合计价钱

    /*
     *
     * 取消全选
     *
     */
    $selectall.on('click', function() {
        $select.hide(); //选中按钮全部隐藏
        $selectall.hide(); //全选按钮也隐藏掉
        $selectcancel.css({ 'width': '20px', 'height': '20px', 'margin': '15px 5px 7px 5px' });
        $selectallspan.html('全选');
        var num = $body.find('.shop-car-select:visible').length;
        if (num == 0) {
            $('.order_pay_info button[id=account]').css('background', '#ccc');
            $('.order_pay_info button[id=account]').attr("disabled", true);
        } else {
            $('.order_pay_info button[id=account]').css('background', '#e74c3c');
            $('.order_pay_info button[id=account]').removeAttr("disabled");
        }
        $account.html('结算(' + num + ')');
        var sum = 0;
        $infoem.html(sum);
    });
    $selectbox.each(function() {
        $select.click(function() { //点击选中按钮
            $(this).hide();
            $selectall.hide();
            $selectallspan.html('全选');
            var num = $body.find('.shop-car-select:visible').length;
            if (num == 0) {
                $('.order_pay_info button[id=account]').css('background', '#ccc');
                $('.order_pay_info button[id=account]').attr("disabled", true);
            } else {
                $('.order_pay_info button[id=account]').css('background', '#e74c3c');
                $('.order_pay_info button[id=account]').removeAttr("disabled");
            }
            $account.html('结算(' + num + ')');
            var sum = 0;
            $body.find('.shop-car-select:visible').parents('.media').find('.course-price em').each(function(k, v) {
                sum += ($(v).text().match(/\d+/g)[0] * 1);
            });
            $infoem.html(sum);
        });
    });
    /*
     *
     * 全选
     *
     */
    $selectcancelall.on('click', function() {
        $select.show();
        $selectall.show();
        $selectallspan.html('取消全选');
        var num = $body.find('.shop-car-select:visible').length;
        if (num == 0) {
            $('.order_pay_info button[id=account]').css('background', '#ccc');
            $('.order_pay_info button[id=account]').attr("disabled", true);
        } else {
            $('.order_pay_info button[id=account]').css('background', '#e74c3c');
            $('.order_pay_info button[id=account]').removeAttr("disabled");
        }
        $account.html('结算(' + num + ')');
        var sum = 0;
        $body.find('.shop-car-select:visible').parents('.media').find('.course-price em').each(function(k, v) {
            sum += ($(v).text().match(/\d+/g)[0] * 1);
        });
        $infoem.html(sum);
    });
    $selectbox.each(function() {
        $selectcancel.click(function() {
            $(this).next().show();
            var num = $body.find('.shop-car-select:visible').length;
            if (num == 0) {
                $('.order_pay_info button[id=account]').css('background', '#ccc');
                $('.order_pay_info button[id=account]').attr("disabled", true);
            } else {
                $('.order_pay_info button[id=account]').css('background', '#e74c3c');
                $('.order_pay_info button[id=account]').removeAttr("disabled");
            }
            var total = $('.select-box').size(); //size返回                               
            $account.html('结算(' + num + ')');
            if (num == total) {
                $selectall.show();
                $selectallspan.html('取消全选');
            } //如果所有的selectall是显示状态，全选
            var sum = 0;
            $body.find('.shop-car-select:visible').parents('.media').find('.course-price em').each(function(k, v) {
                sum += ($(v).text().match(/\d+/g)[0] * 1);
            });
            $infoem.html(sum);
        });
    });


    /*==============购物车交互 end===============*/

    /*==============第三步确认支付页倒计时 start===============*/

    var m = $('#expireTime').val();

    function twoBit(num) {
        if (num < 10) {
            num = '0' + num;
        }
        return num;
    }

    function countDown2() {
        if (m < 0) {
            clearTimeout(t2);
            $('.container').children('.need-pay-money-item,.payment-mode-list').css('display', 'none');
            $('.order-status').text('订单已失效，请重新购买！');
            $('.order-times').css('display', 'none');
            $('#payTips').css('display', 'none');
            $('.failure_order').css('display', 'block');
            return;
        } else {
            var minute = Math.floor(m / 60);
            var second = m % 60;
            $('#minute').html(twoBit(minute));
            $('#second').html(twoBit(second));
            m--;
        }
        var t2 = setTimeout(function() {
            countDown2();
        }, 1000);
    }
    countDown2();

    /*==============第三步确认支付页倒计时 end===============*/
});


function filterHtml(str) {
    str = $.trim(str)
    str = str.replace(/<\/?[^>]*>/g, '') //去除HTML tag
    // str = str.replace(/[ | ]*\n/g, '\n') //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g, '\n') //去除多余空行
    // str = str.replace(/ /ig, ''); //去掉 
    return str;
}

function loadIn() { //ajax前的遮罩
    var load = $('.loading')
    var w = ($(window).width() - 100) / 2
    var h = ($(window).height() - 90) / 2
    if (load.length == 0) {
        var tpl = '<div class="loading" style="position:fixed;width:100%;height:100%;top:0;left:0;overflow:hidden;z-index:1000;">' + '<div style="position: absolute; width: 100px; height: 90px; line-height: 100px; color: rgb(255, 255, 255); text-align: center; font-size: 11px; border-radius: 13px;left: ' + w + 'px; top:' + h + 'px; background-color: rgba(0, 0, 0, 0.5);">' + '正在加载中</div></div>'
        $('body').append(tpl)
    }
}

function loadOut() { //删除遮罩
    if ($('.loading').length != 0) {
        $('.loading').remove()
    }
}

function banBrowserSlip() { //uc禁止左右滑动切换上一页下一页
    var control = navigator.control || {};
    if (control.gesture) {
        control.gesture(false)
    }
}

function errorTip() {
    var str = arguments[0],
        dom = arguments[1],
        error = $('.error-tip'),
        top = $(window).scrollTop(),
        w = ($(window).width() - 230) / 2,
        h = ($(window).height() - 40) / 2 + top
    if (error.length == 0) {
        $('body').append('<div class="error-tip" style="display:block;-webkit-animation: errorTip 3s ease-in;top:' + h + 'px;right:' + w + 'px;">' + str + '</div>')
    } else if (typeof error.attr('style') == 'string') {
        return false
    } else {
        error.html(str).css({
            'display': 'block',
            '-webkit-animation': 'errorTip 3s ease-in',
            'animation': 'errorTip 3s ease-in',
            'top': h,
            'right': w
        })
    }
    setTimeout(function() {
        $('.error-tip').removeAttr('style')
    }, 3000)
    if (dom) {
        var mod = dom.parents('.form-group'),
            scroll = dom.offset().top
        mod.addClass('has-error')
    }
}

/*
 * @description 滑动效果
 */
var slip = {
    index: null,
    box: '.slip-mod', //确认订单页外部盒子
    duration: 0,
    timer: null,
    index: 0,
    cache: ['确认订单'],
    init: function() {
        banBrowserSlip();
        var that = this;
        var slip = $(that.box);
        that.duration = 400;
        slip.each(function() {
            $(this).css({
                'margin-top': '50px',
                '-webkit-transition-property': 'all',
                '-webkit-transition-duration': '0.4s',
                '-webkit-transition-timing-function': 'cubic-bezier(0.540, 0.020, 0.440, 0.980)'
            })
        });
        that.sort()
    },
    move: function(box, dir, title, htm) {
        if (!dir) {
            return;
        }
        loadIn();
        var that = this;
        var t = title;
        var slip = box.hasClass('return-pre') ? $('.show') : $(box).parents(that.box);
        var order = dir == 'l' ? 'next' : 'pre';
        var dis = dir == 'l' ? -20 - slip.width() : slip.width() + 20;
        var tpl = htm || '哇哦,找不到家啦';
        var slipIn = slip.parent().find('.' + order);
        var slipOut = slip.parent().find('.show');
        var slipT = $('.title-slip');
        dir == 'l' ? that.cache.push(t) : (that.cache.pop(), t = that.cache[that.cache.length - 1]);
        this.index = parseInt(slipIn.attr('index'));
        if (parseInt(slipIn.attr('index')) != 0 && !box.hasClass('return-pre')) {
            slipIn.html('');
            slipIn.html(tpl);
        }
        slipT.html(t);
        slipOut.css({
            '-webkit-transform': 'translate(' + dis + 'px,0)',
            'opacity': 0.5
        });
        setTimeout(function() {
            slipOut.removeClass('show').css({
                '-webkit-transform': 'translate(0px,0px)',
                'opacity': 1
            })
            slipIn.addClass('show').removeClass(order)
            that.sort()
            $(window).scrollTop(0)
            loadOut()
        }, that.duration + 200)
    },
    sort: function() {
        var that = this;
        var slip = $(that.box)
        var showId = slip.parent().find('.show').attr('index')
        this.index = parseInt(showId)
        slip.each(function() {
            if ($(this).hasClass('show')) {
                return
            }
            if ($(this).hasClass('next') && parseInt($(this).attr('index')) !== parseInt(showId) + 1) {
                $(this).removeClass('next')
            }
            if ($(this).hasClass('pre') && parseInt($(this).attr('index')) !== parseInt(showId) - 1) {
                $(this).removeClass('pre')
            }
            if (parseInt($(this).attr('index')) == parseInt(showId) + 1) {
                $(this).addClass('next')
            }
            if (parseInt($(this).attr('index')) == parseInt(showId) - 1) {
                $(this).addClass('pre')
            }
        })
    }
}

/*
 * @description 支付页面交互,payment对象
 */
/* 针对QQ浏览器每5s刷新一次 start by lixd */
// 微信扫码
function ajaxstatusWx() {
    $.ajax({
        url: "/order/getOrderPayStatus",
        type: "POST",
        dataType: "json",
        data: {
            // rechargeNum : $('#wxQrRechargeNum').val()
            orderNum: $('#orderNum').val()
        },
        success: function(data) {
            if (data) { //订单状态为1表示支付成功
                window.location.href = "https://cart.xueersi.com/ShoppingComplete/complete"; //页面跳转
            }
        }
    });
}

var ua = navigator.userAgent,
    pattern = /[M]?QQBrowser\//,
    result = ua.match(pattern)
if (result) {
    var time = setInterval(function() {
        // window.location.reload()
        ajaxstatusWx()
    }, 5000)
} else {
    // code
}
/* 针对QQ浏览器每5s刷新一次 end */
var payment = payment || {}
payment = {
    //支付类型
    config: {
        onlinePay: 401003, //在线支付类型,默认支付宝,若为微信支付,在account函数内修改类型
        balancePay: 301000, //余额支付
        //微信支付，因为所属在在线支付下边，逻辑同支付宝支付一样
        //若为微信支付，在所有逻辑处理完之后，在结算的时候更换payType为微信支付
        wChatPay: 801000
    },
    //微信支付禁止多次点击结算
    canAccount: true,
    //需要判断的参数
    judge: {
        isWX: false
    },
    data: {
        orderNum: 0, //订单号
        payType: 1, //支付方式
        price: {
            initialBalance: 0, //初始余额
            balance: 0, //余额
            course: 0, //课程金额
            express: 0, //快递费
            coupon: 0, //优惠券
            pay: 0, //应付金额
            couponPrice: 0 //能使用特殊优惠券金额
        },
        coupon: {
            exist: false, //是否存在
            id: [],
            useId: [],
            list: {}
        },
        invoice: {
            exist: false //是否存在
            // type: 1, //发票类型
            // text: '' //抬头内容
        },
        goodsTime: {
            exist: true,
            val: 1
        },
        items: {
            hasBook: false,
            exist: false,
            list: []
        },
        addressExist: false,
        addressId: {
            have: [],
            use: null
        },
        addressList: {
            // realname: '收货人姓名',
            // province: '省份',
            // city: '城市',
            // country: '地区',
            // address: '详细地址',
            // zipcode: '邮政编码',
            // phone: '手机',
            // add_province: '省份',
            // add_city: '城市',
            // add_country: '地区'
        }
    },
    box: {},
    //初始化信息
    init: function() { //页面刚进入，0、需要的数据写入data  1、判断是否全余额，2、隐藏地址一栏（默认height=0）
        var a = parseFloat($('#balance').val()), //用户余额
            b = parseFloat($('#price').val()), //课程价格
            c = parseFloat($('#offer_price').val()), //隐藏域
            //一键购买
            oneKeyBuy = $('#oneKeyBuy').val();
        //直播课程
        isLive = $('#isLive').val();
        t = this;
        t.initBox();
        t.binding();
        t.data.price.initialBalance = a;
        t.data.price.course = b;
        // t.data.price.coupon = c || 0;
        //t.data.price.coupon = 0;
        //存在默认选中优惠券的情况
        var defaultUseCoupon = $('#defaultUseCoupon').length;
        //判断是否存在默认选中优惠券的情况
        if (defaultUseCoupon > 0) {
            t.data.price.coupon = parseInt($('#defaultUseCoupon').attr('couponvalue'));
            t.data.coupon.useId = []; //选择的地址id清空
            t.data.coupon.exist = true;
            t.data.coupon.useId.push($('#defaultUseCoupon').val().toString());
        } else {
            t.data.price.coupon = 0;
        }

        // 判断用户有无地址
        if ($('#isSendId').val() == 1) {
            $('.warmTips').show();
        }

        //页面金额
        $('.balance-list .text-danger').html(parseInt($('#balance').val()));
        $('.list-group-money #t_course').html($('#price').val());

        t.countPrice(); //计算结算价格

        if ($('#addressId').length > 0 && $('#addressId').val() != '') {
            payment.data.addressId.use = $('#addressId').val();
        }

        //判断是否是微信客户端
        var ua = navigator.userAgent.toLowerCase();

        if (/micromessenger/.test(ua)) {
            try {
                var wxVer = /micromessenger\s*\/\s*(\d\.\d*)/ig.exec(ua)[1];
                //微信版本号 大于5.0能支持支付接口
                t.judge.wxVer = parseInt(wxVer);
            } catch (e) {
                //微信ua如果改掉格式不报错,默认设置成6，可支付状态
                t.judge.wxVer = 6;
            }

            t.judge.isWX = true;

        } else {
            t.judge.isWX = false;
        }

        if (t.judge.isWX) { //在微信打开
            $('.payment-mode-list .wxipay').on('click', function() {
                $.ajax({
                    url: '/order/pay',
                    type: 'POST',
                    dataType: 'json',
                    data: { payCode: 801000, isUseBalance: $('#isUseBalance').val() },
                    success: function(result) {
                        if (result.sign == 0) {
                            // window.location.href = result.msg;
                            alert(result.msg);
                        } else {
                            t.wChatPay(result.msg, function() {
                                //可以点击结算按钮
                                t.canAccount = true
                            })
                        }
                    },
                    error: function() {
                        alert('数据加载失败！');
                    }
                });
            });
        } else { //非微信打开
            $('.payment-mode-list .alipay').on('click', function() {
                $.ajax({
                    url: '/order/pay/',
                    type: 'POST',
                    dataType: 'json',
                    data: { payCode: 401003, isUseBalance: $('#isUseBalance').val() },
                    success: function(result) {
                        if (result.sign == 0) {
                            alert(result.msg);
                        } else {
                            window.location.href = result.msg;
                        }
                    },
                    error: function() {
                        alert('数据加载失败！');
                    }
                });
            });
            $('.payment-mode-list .wxipay-phone').on('click', function() {
                $.ajax({
                    url: '/order/pay',
                    type: 'POST',
                    dataType: 'json',
                    data: { payCode: 804000, isUseBalance: $('#isUseBalance').val() },
                    success: function(result) {
                        // var url = '&redirect_url='+encodeURIComponent('https://trade.xueersi.com/Order/show');
                        // window.location.href = result.msg + url;
                        if (result.sign == 0) {
                            alert(result.msg);
                        } else {
                            var url = '&redirect_url=' + encodeURIComponent('https://trade.xueersi.com/Order/show');
                            window.location.href = result.msg + url;
                        }
                    },
                    error: function() {
                        alert('数据加载失败！');
                    }
                });
            });
        }

        //判断是直播课还是录播课
        if ($('#isLive').val() == 0) {
            $('.media-live-course').hide();
        } else {
            $('.course-list').hide();
        }

        //是否为一键购买
        t.judge.isQuick = oneKeyBuy === '1' ? true : false;
        t.judge.isLive = isLive === '1' ? true : false;

        t.box.payType.find('span.text-danger').html(a); //余额写入页面

        banBrowserSlip();
        t.saveItems();
    },
    initBox: function() {
        this.box = {
            getPaytype: $('#get-paytype'),
            useCoupon: $('#use-coupon'), //使用优惠券
            getAddress: $('#get-address'), //添加送货地址
            getGoodstime: $('#get-goodstime'), //配送时间
            form: $('#payMoney'), //应付金额的form表单
            payType: $('.pay-type-mod'),
            selBalance: $('.select-balance'), //使用余额勾选按钮
            goodsInfo: $('.goods-info-mod'),
            invoice: $('invoice-info-mod'),
            items: $('.add-items-mod'),
            courseInfo: $('.course-info-mod'),
            price: $('.price-detail-mod'),
            pay: $('.order_pay_info') //应付金额的外部盒子
        }
    },
    //取消点击事件,input禁止选择
    banTap: function(dom, check) {
        if (!dom)
            return false;
        dom instanceof window.Zepto ? dom = dom : dom = $(dom);
        dom.addClass('banthis');
        var input = dom.find('input'),
            arrow = dom.find('i.fa');
        if (arrow.length !== 0) { //删除箭头
            arrow.remove();
        }
        if (input.length !== 0) { //如果有input则禁用
            input.attr('disabled', 'disabled');
            if (check && check == 'check') {
                input.attr('checked', 'checked');
            }
            if (check && check === 'uncheck') {
                input.removeAttr('checked');
            }
        }
    },
    //设置显示文本信息
    setText: function(dom, str) {
        if (!dom || !str)
            return false;
        dom instanceof window.Zepto ? dom = dom : dom = $(dom);
        var html = '';
        str.arrow ? html += '<i class="fa fa-angle-right fa-4"></i>' : html = html;
        str.text ? html += str.text : html = html;
        str.newline ? html += '<br>' : html = html;
        str.tip ? (str.tip != '' ? html += '<em style="margin:0px;">' + str.tip + '</em>' : html = html) : html = html;
        str.html ? html = str.html : html = html;
        dom.html(html);
    },
    setText2: function(dom, str) {
        if (!dom || !str)
            return false;
        dom instanceof window.Zepto ? dom = dom : dom = $(dom);
        var html = '';
        str.text ? html += str.text : html = html;
        str.newline ? html += '<br>' : html = html;
        str.tip ? (str.tip != '' ? html += '<em style="margin:0px;">' + str.tip + '</em>' : html = html) : html = html;
        str.html ? html = str.html : html = html;
        dom.html(html);
    },
    //获取优惠券列表
    getCoupon: function(b, dir, arr1, sumPrice) {
        var t = this,
            param = t.data.coupon,
            banCoupon = t.data.price.coupon >= t.data.price.course * 0.7;

        //微信支付期间不能点击
        if (t.judge.isWX && param.payType == t.config.onlinePay) {
            if (!canAccount) {
                return false;
            }
        }

        loadIn();
        var couponParams = $("#couponParams").val();
        $.ajax({
            url: '/MyInfo/ajaxGetStuCouponList',
            // url: '../js/list.json',
            type: "post",
            dataType: "json",
            data: {
                data: couponParams
            },
            success: function(v) {
                if (v.sign == 0) {
                    alert(v.msg);
                    loadOut();
                    return false;
                }
                if (v.sign == 2) {
                    loadOut();
                    location.href = v.msg;
                    return false;
                }
                param.id = [] // 获取之前清空数组
                var tpl = '';
                tpl += t.html.coupon.no;
                data = v.data;

                if (data != '') {
                    // 循环可用优惠券
                    if (data.available.length != 0) {
                        $.each(data.available, function(k, n) {
                            param.id.push(n.id) //写入id数组
                            param.list[n.id] = {
                                'val': n.price,
                                'time': n.receive_date
                            }
                            var startTime = new Date();
                            var endTime = new Date(n.expiredDate);
                            var remainDay = Math.round((endTime - startTime) / 1000 / 60 / 60 / 24);
                            //通用优惠券
                            if (n.type == 1) {
                                var mod = t.html.coupon.getCommon.replace(/\$cardId\$/g, n.id) // id
                                    .replace(/\$value\$/g, n.price) // 价格
                                    .replace(/\$time\$/g, n.expiredDate)
                                    // .replace(/\$cardNum\$/g, n.coupon_code)
                                    .replace(/\$couponSum\$/g, n.price)
                                    // .replace(/\$grey-money\$/g, '')
                                    .replace(/\$unclick\$/g, '')
                                    .replace(/\$expiredDate\$/g, n.expiredDate)
                                    .replace(/\$priceLimitTip\$/g, n.priceLimitTip)
                                    .replace(/\$remainDay\$/g, remainDay)
                                    .replace(/\$canuse\$/g, '');
                            }
                            // 品类优惠券
                            if (n.type == 2) {
                                var mod = t.html.coupon.getSpecific.replace(/\$cardId\$/g, n.id)
                                    .replace(/\$value\$/g, n.price) // 价格
                                    .replace(/\$time\$/g, n.expiredDate)
                                    // .replace(/\$cardNum\$/g, n.coupon_code)
                                    .replace(/\$couponSum\$/g, n.price)
                                    // .replace(/\$grey-money\$/g, '')
                                    .replace(/\$unclick\$/g, '')
                                    .replace(/\$expiredDate\$/g, n.expiredDate)
                                    .replace(/\$priceLimitTip\$/g, n.priceLimitTip)
                                    .replace(/\$remainDay\$/g, remainDay)
                                    .replace(/\$canuse\$/g, '');
                            }

                            // param.useId[0] == n.id ? mod = mod.replace(/\$checked\$/gi, 'checked="checked"') :
                            //    mod = mod.replace(/\$checked\$/i, '');
                            //replace方法返回值并不是替换好内容的自己，所以如下写是错误的,应该像上一行那么写
                            // mod.replace(/\$cardNum\$/g, i + 1000).replace(/\$value\$/g, i + 20).replace(/\$time\$/g, '2014-02-01') 
                            //检查优惠券是否已经选择，若选择就勾选，否则不勾选
                            //先判断该优惠券是否被选择了,如果没被选择判断优惠券是超过课程价格一半
                            //优惠券只能只用一张
                            // $.inArray(n.id, param.useId) < 0 ? (banCoupon ? tpl += mod.replace(/\$checked\$/g, 'disabled="disabled"') : tpl += mod.replace(/\$checked\$/g, '')) :
                            //     tpl += mod.replace(/\$checked\$/g, 'checked="checked"')

                            tpl += mod;
                        })
                    }

                    // 循环不可以优惠券
                    if (data.unavailable.length != 0) {
                        $.each(data.unavailable, function(k, n) {
                            // param.id.push(n.id)    //写入id数组
                            // param.list[n.id] = {
                            //  'val': n.price,
                            //  'time': n.receive_date
                            // }
                            if (k == 0) {
                                tpl += '<p class="disbale-coupon">不可使用优惠券</p>'
                            }
                            var startTime = new Date();
                            var endTime = new Date(n.expiredDate);
                            var remainDay = Math.round((endTime - startTime) / 1000 / 60 / 60 / 24);
                            //通用优惠券
                            if (n.type == 1) {
                                var mod = t.html.coupon.getCommon.replace(/\$cardId\$/g, n.id) // id
                                    .replace(/\$value\$/g, n.price) // 价格
                                    .replace(/\$time\$/g, n.expiredDate)
                                    // .replace(/\$cardNum\$/g, n.coupon_code)
                                    .replace(/\$couponSum\$/g, n.price)
                                    // .replace(/\$grey-money\$/g, '')
                                    .replace(/\$unclick\$/g, '')
                                    .replace(/\$expiredDate\$/g, n.expiredDate)
                                    .replace(/\$priceLimitTip\$/g, n.priceLimitTip)
                                    .replace(/\$remainDay\$/g, remainDay)
                                    .replace(/\$canuse\$/g, 'disbale-coupon-gold');
                            }
                            // 品类优惠券
                            if (n.type == 2) {
                                var mod = t.html.coupon.getSpecific.replace(/\$cardId\$/g, n.id)
                                    .replace(/\$value\$/g, n.price) // 价格
                                    .replace(/\$time\$/g, n.expiredDate)
                                    // .replace(/\$cardNum\$/g, n.coupon_code)
                                    .replace(/\$couponSum\$/g, n.price)
                                    // .replace(/\$grey-money\$/g, '')
                                    .replace(/\$unclick\$/g, '')
                                    .replace(/\$expiredDate\$/g, n.expiredDate)
                                    .replace(/\$priceLimitTip\$/g, n.priceLimitTip)
                                    .replace(/\$remainDay\$/g, remainDay)
                                    .replace(/\$canuse\$/g, 'disbale-coupon-gold');
                            }

                            // param.useId[0] == n.id ? mod = mod.replace(/\$checked\$/gi, 'checked="checked"') :
                            //    mod = mod.replace(/\$checked\$/i, '');
                            //replace方法返回值并不是替换好内容的自己，所以如下写是错误的,应该像上一行那么写
                            // mod.replace(/\$cardNum\$/g, i + 1000).replace(/\$value\$/g, i + 20).replace(/\$time\$/g, '2014-02-01') 
                            //检查优惠券是否已经选择，若选择就勾选，否则不勾选
                            //先判断该优惠券是否被选择了,如果没被选择判断优惠券是超过课程价格一半
                            //优惠券只能只用一张
                            // $.inArray(n.id, param.useId) < 0 ? (banCoupon ? tpl += mod.replace(/\$checked\$/g, 'disabled="disabled"') : tpl += mod.replace(/\$checked\$/g, '')) :
                            //     tpl += mod.replace(/\$checked\$/g, 'checked="checked"')

                            tpl += mod;
                        })
                    }
                }
                // tpl += '<div class="active-btn">';
                // tpl += '<a class="btn btn-danger btn-block btn-lg add-coupon" href="javascript:void(0);" role="button">激活新的优惠券</a>';
                // tpl += '</div>';

                slip.move(b, dir, '优惠券', tpl || '');
            },
            error: function(v) {
                alert('通信失败')
                loadOut();
            }
        })
    },
    //添加优惠券--打开激活优惠券页面
    addCoupon: function(b) {
        slip.move(b, 'l', '优惠券', payment.html.coupon.active);
    },
    //激活优惠券
    activeCoupon: function(b) {
        var t = this,
            mod = b.parents('.slip-mod'),
            num = mod.find('input[name="cardNum"]').val(),
            pas = mod.find('input[name="cardPas"]').val();
        if (num == '' || pas == '') {
            errorTip('请填写内容');
            return false;
        }
        if (b.hasClass('can-not-tap')) {
            return false;
        }
        b.addClass('can-not-tap');
        // loadIn()
        $.ajax({
            url: '/MyInfo/ajaxActiveGift',
            type: "post",
            dataType: "json",
            data: {
                'cardNo': num,
                'cardPwd': pas
            },
            success: function(v) {
                if (v.sign == 0) {
                    alert(v.msg)
                    // loadOut()
                    b.removeClass('can-not-tap')
                    return false;
                }
                if (v.sign == 2) {
                    // loadOut()
                    b.removeClass('can-not-tap')
                    location.href = v.msg
                    return false;
                }
                var arr1 = [];
                $('body').find('.course-body').each(function(k, v) {
                    var id = $(this).attr('id');
                    $(this).find('.course-price em.price').each(function(kk, vv) {
                        var vv = $(vv).text().match(/\d+/g)[0] * 1;
                        arr1[k] = { 'courseId': id, 'price': vv };
                    })
                });
                var sumPrice = $('#t_course').text();
                t.getCoupon(b, 'r', arr1, sumPrice); //激活成功后调用coupon的get方法并向右滑
            },
            error: function(v) {
                loadOut();
            }
        })
    },
    //单选框优惠券
    chooseCoupon: function(data) {
        var b = data.find('.checkbox-button span.radio');
        if (data.hasClass('unclick')) {
            return false;
        } else {
            if (b.parent().find('input').attr('id') == 'no-coupon') {
                this.noCoupon(b);
                return false;
            }
            var id = b.prev().val().toString(), //优惠券id
                t = this,
                price = t.data.price,
                coupon = t.data.coupon,
                tpl = '',
                tips = '';
            if ($.inArray(id, coupon.id) < 0) { //验证优惠券号是否合法
                // alert('数据不合法')
                return false;
            }
            var couponSum = b.prev().attr('couponvalue');
            coupon.useId = []; //选择的地址id清空
            coupon.exist = true;
            price.coupon = parseInt(coupon.list[id].val); //更新优惠券金额
            coupon.useId.push(id);
            tpl += '您已经使用了一张' + parseInt(coupon.list[id].val) + '元优惠券';
            // if(couponSum){
            //  price.coupon <= couponSum * 0.7 ? tips = tips : tips += '优惠券不能超过订单金额70%,您只能使用' + Math.round(couponSum * 0.7) + '元';
            // }else{
            //  price.coupon <= price.course * 0.7 ? tips = tips : tips += '优惠券不能超过订单金额70%,您只能使用' + Math.round(price.course * 0.7) + '元';
            // }
            t.setText(t.box.useCoupon, {
                arrow: true,
                text: tpl,
                newline: true,
                tip: tips
            });
            t.countPrice();
            slip.move(b, 'r');
            $('.course_header .title-slip').text('确认订单');
            $('.order_pay_info').show();
        }
    },
    noCoupon: function(b) {
        this.data.coupon.useId = [];
        this.data.price.coupon = 0;
        this.data.coupon.exist = false;
        this.countPrice();
        slip.move(b, 'r');
        $('.course_header .title-slip').text('确认订单');
        $('.order_pay_info').show();
        this.setText(this.box.useCoupon, {
            arrow: true,
            text: '优惠券',
            tip: '不使用优惠券'
        })
    },
    //计算金额
    countPrice: function() { //计算金额
        var t = this;
        var data = payment.data;
        var price = payment.data.price;
        // 获取商品优惠金额
        var promotion = $("#t_promotion").text();
        price.promotion = parseInt(promotion);
        // 获取优惠券金额
        // var coupon = $("input[name='blankRadio']:checked").attr('couponvalue');
        price.coupon = parseInt(price.coupon);
        // if(couponSum){
        //  if(price.coupon <= couponSum * 0.7){
        //    price.coupon = price.coupon;
        //  }else{
        //    price.coupon = Math.round(couponSum * 0.7);
        //  }
        // }else{
        //  if(price.coupon <= price.course * 0.7){
        //    price.coupon = price.coupon;
        //  }else {
        //    price.coupon = Math.round(price.course * 0.7);
        //  }
        // }
        /*判断优惠券金额是否为0*/
        // if (price.balance == 0) {
        //  $('.list-group-money p').eq(2).css('display' , 'none');
        // }
        // else{
        //  $('.list-group-money p').eq(2).css('display' , 'block');
        // }
        var pListLength = $('.list-group-money p').length;
        // 不使用余额支付
        if (t.box.selBalance.hasClass('select-balance-no') || $('#balance').val() == 0) {
            price.pay = (parseInt(price.course) - parseInt(price.coupon) - parseInt(price.promotion));
            price.balance = price.initialBalance; //选择余额支付后剩余的
            if (pListLength == 4) {
                $('.list-group-money p').eq(3).css('display', 'none');
            } else {
                $('.list-group-money p').eq(2).css('display', 'none');
            }
        }
        // 使用余额支付
        else {
            if (pListLength == 4) {
                $('.list-group-money p').eq(3).css('display', 'block');
            } else {
                $('.list-group-money p').eq(2).css('display', 'block');
            }
            price.pay = (parseInt(price.course) - parseInt(price.coupon) - parseInt(price.initialBalance) - parseInt(price.promotion));
            if (price.pay <= 0) {
                price.balance = Math.abs(price.pay); //选择余额支付后剩余的
                price.pay = 0;
            } else {
                price.balance = 0;
            }
        }
        var useBalance = price.initialBalance - price.balance;
        useBalance = Math.floor(useBalance);
        // var detail = [price.course, price.promotion, price.coupon, useBalance, price.pay];
        if (pListLength == 4) {
            var detail = [price.course, price.promotion, price.coupon, useBalance, price.pay];
        } else {
            var detail = [price.course, price.promotion, useBalance, price.pay];
        }
        this.writePrice(detail); //写入页面
    },
    //把金额明细写入页面
    writePrice: function(arr) {
        if (!arr) {
            return false;
        }
        var text,
            priceDetail = payment.box.price.find('em'),
            orderPay = payment.box.pay.find('em'),
            //一键购买
            orderPayQuick = payment.box.pay.find('button');

        if (this.judge.isQuick) {
            text = arr[arr.length - 1] + '元 确认支付';
            orderPayQuick.text(text);

            //支付栏显示 '还需支付'
            $('.xbg').text(arr[arr.length - 1]);
            return
        }
        //页面金额容器与数据不匹配时
        if (priceDetail.length !== arr.length - 1) {
            return false;
        }
        for (var i = 0; i < arr.length - 1; i++) {
            priceDetail[i].innerHTML = arr[i];
        }
        //写入页面金额
        text = arr[arr.length - 1];
        orderPay.text(text);
    },
    //获取地址列表
    getAddress: function(b, dir) {
        var t = this,
            param = t.data;
        loadIn();
        $.ajax({
            url: '/MyInfo/ajaxGetStuAdds',
            type: "post",
            dataType: "json",
            data: {
                id: 2
            },
            success: function(v) {
                if (v.sign == 0) {
                    loadOut();
                    alert(v.msg);
                    return false;
                }
                if (v.sign == 2) {
                    loadOut();
                    location.href = v.msg;
                    return false;
                }
                param.addressId.have = []; // 获取之前清空已存地址数组
                var tpl = '',
                    str = t.html.address.get,
                    data = v.data;
                tpl += payment.html.address.add.replace(/(\$\w*\$)+?/ig, '');
                tpl += '<div class="form-order-info  form-order-info-time form-address-info-time">';
                $.each(data, function(k, n) {
                    var d = n.province_name + '&nbsp' + n.city_name + '&nbsp' + n.county_name + '&nbsp' + n.detail,
                        c = n.name + '&nbsp' + n.phone;
                    tpl += str.replace(/\$addressId\$/i, n.id).replace(/\$userinfo\$/i, c).replace(/\$address\$/i, d);
                    param.addressId.use == n.id ? tpl = tpl.replace(/\$checked\$/i, 'checked="checked"') :
                        tpl = tpl.replace(/\$checked\$/i, '');
                    param.addressId.have.push(n.id); //地址id推入数组
                    param.addressList[n.id] = {
                        realname: n.name, //收件人姓名
                        phone: n.phone, //收件人手机号
                        fixedphone: n.zipcode, //收件人邮政
                        province_id: { //省ID和名称
                            val: n.province_id,
                            text: n.province_name
                        },
                        city_id: { //市ID和名称
                            val: n.city_id,
                            text: n.city_name
                        },
                        country_id: { //区ID和名称
                            val: n.county_id,
                            text: n.county_name
                        },
                        address: n.detail
                    }
                })
                tpl += '<div class="invoice-botton-btn col-sm-offset-0 col-sm-12"><button type="button" class="btn btn-danger btn-lg btn-submit addNewAddr">+添加新地址</button></div>'
                tpl += '</div>';
                loadOut();

                slip.move(b, dir, '收货地址', tpl);
                $('.order_pay_info').hide();
                if (data == '') {
                    $('.form-address-edit').css('display', 'block');
                    $('.form-address-info-time').css('display', 'none');
                } else {
                    $('.form-address-edit').css('display', 'none');
                    $('.form-address-info-time').css('display', 'block');
                }
            },
            error: function(v) {
                loadOut();
            }
        })
    },
    //添加地址
    addAddress: function(b) {
        $('.form-address-edit').css('display', 'block');
        $('.form-address-info-time').css('display', 'none');
        $('.form-address-edit .warmTips').css('display', 'none');
    },
    //编辑地址
    changeAddress: function(b) {
        renderAreaSelect();
        var mod = b.parents('.address-body'),
            id = mod.data('addressid'),
            param = this.data.addressList[id],
            tpl = $('.form-address-edit');
        $('.save-address').data('id', id);
        tpl.find('input[name ="realname"]').val(param.realname);
        tpl.find('input[name ="phone"]').val(param.phone);
        tpl.find('input[name ="fixedphone"]').val(("undefined" != typeof param.fixedphone) ? param.fixedphone : '');
        tpl.find('#add_province option[value = "' + param.province_id.val + '"]').prop("selected", true).change();
        tpl.find('#add_city option[value = "' + param.city_id.val + '"]').prop("selected", true).change();
        tpl.find('#add_country option[value = "' + param.country_id.val + '"]').prop("selected", true).change();
        // renderAreaSelect();
        tpl.find('input[name ="address"]').val(param.address);
        $('.form-address-edit').css('display', 'block');
        $('.form-address-info-time').css('display', 'none');
    },
    //保存地址
    saveAddress: function(b) {
        var t = this,
            mod = b.parents('.slip-mod'),
            name = mod.find('input[name="realname"]'),
            phone = mod.find('input[name="phone"]'),
            fixedphone = mod.find('input[name="fixedphone"]'),
            province = mod.find('#add_province'),
            city = mod.find('#add_city'),
            country = mod.find('#add_country'),
            address = mod.find('input[name="address"]'),
            id = b.data('id');
        if (filterHtml(name.val()) == '') {
            errorTip('请填写姓名', name);
            return false
        }
        if (phone.val() == '') {
            errorTip('请填写手机号', phone);
            return false
        }
        if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone.val())) {
            errorTip('请填写正确的手机号', phone);
            return false
        }
        // if (!/^[0-9]*$/.test(fixedphone.val())) {
        //  errorTip('固定电话格式错误', fixedphone);
        //  return false
        // }
        // if (province.val() == '' || city.val() == '' || country.val() == '') {
        //  errorTip('请选择省份');
        //  return false
        // }
        if (province.val() == '') {
            errorTip('请选择省份');
            return false
        }
        if (city.val() == '') {
            errorTip('请选择城市');
            return false
        }
        if (country.val() == '') {
            errorTip('请选择区县');
            return false
        }
        if (filterHtml(address.val()) == '') {
            errorTip('请填写街道信息', address);
            return false
        }
        sendData = {
            'realname': filterHtml(name.val()),
            'phone': filterHtml(phone.val()),
            'fixedphone': filterHtml(fixedphone.val()),
            'province_id': province.val(),
            'city_id': city.val(),
            'country_id': country.val(),
            'province_text': $('#add_province option[value="' + province.val() + '"]').text(),
            'city_text': $('#add_city option[value="' + city.val() + '"]').text(),
            'country_text': $('#add_country option[value="' + country.val() + '"]').text(),
            'address': filterHtml(address.val()),
            'id': id
        }
        loadIn();
        $.ajax({
            url: '/MyInfo/saveStuAdds',
            type: "post",
            dataType: "json",
            data: sendData,
            success: function(v) {
                if (v.sign == 0) {
                    errorTip(v.msg);
                    loadOut();
                    setTimeout(function() {
                        t.getAddress($(t), 'l')
                    }, 3500)
                    return false
                }
                if (v.sign == 2) {
                    loadOut();
                    location.href = v.msg;
                    return false
                }
                if (v.sign == 1) {
                    payment.data.addressId.use = v.addId;
                }

                // var t = this,
                tpl = '';
                tpl += '<p class="addressTip">建议您填写公司/单位地址，以便及时验收讲义！</p>';
                tpl += '<div class="address-icon"></div><div class="address-detail">';
                tpl += '<p class="addrName">' + sendData.realname + '&nbsp&nbsp' + sendData.phone + '<br></p>';
                tpl += '<p class="addrCity">' + sendData.province_text + sendData.city_text + sendData.country_text + sendData.address + '</p>';
                tpl += '</div><div class="address-arrow"></div>';
                t.setText2(t.box.getAddress, {
                    arrow: true,
                    text: tpl
                })

                loadOut();
                slip.move(b, 'r');
                $('.course_header .title-slip').text('确认订单');
                $('.order_pay_info').show();
            },
            error: function(v) {
                loadOut()
            }
        });

    },
    //选择地址
    chooseAddress: function(b) {
        var mod = b.parents('.address-body'),
            id = mod.data('addressid'), //.toString()
            data = payment.data,
            tpl = '',
            t = this;
        data.addressId.use = id; //选择的地址id
        var param = data.addressList[id];

        tpl += '<div class="address-icon"></div><div class="address-detail">';
        tpl += '<p class="addrName">' + param.realname + '&nbsp&nbsp' + param.phone + '<br></p>';
        tpl += '<p class="addrCity">' + param.province_id.text + param.city_id.text + param.country_id.text + param.address + '</p>';
        tpl += '</div><div class="address-arrow"></div>';

        t.setText2(t.box.getAddress, {
            arrow: true,
            text: tpl
        })
        slip.move(b, 'r');
        $('.course_header .title-slip').text('确认订单');
        $('.order_pay_info').show();
    },
    //展示地址栏
    taggleAddress: function() {
        var mod = payment.box.goodsInfo,
            t = this,
            param = t.data;
        if (param.invoice.exist || param.payType == t.config.arrivalPay || $('#is_send').val() == 1) {
            param.addressExist = true;
            mod.show();
        } else {
            mod.hide();
            param.addressExist = false;
        }
    },
    //送货时间
    getGoodsTime: function(b) {
        var t = this,
            param = t.data.goodsTime,
            tpl = t.html.goodsTime;
        slip.move(b, 'l', '送货时间', tpl);
        $('.order_pay_info').hide();
    },
    //保存送货时间
    saveGoodsTime: function(b) {
        var type = b.attr('id'),
            t = this,
            tpl = '',
            param = t.data.goodsTime;
        param.exist = true;
        param.val = type;
        $('#carriage_time').val(type);
        type == 1 ? tpl += '工作日/周末/假日均可' : (type == 2 ? tpl += '仅周末与假日送货' : tpl += '仅工作日送货');
        t.setText(t.box.getGoodstime, {
            arrow: true,
            text: tpl
        })
        slip.move(b, 'r');
        $('.course_header .title-slip').text('确认订单');
        $('.order_pay_info').show();
    },
    //保存纸质版书籍&&物品
    saveItems: function() {
        var t = this;
        setTimeout(function() {
            var inputs = t.box.items.find('input[type="checkbox"]:checked'),
                param = t.data,
                bookNum = 0;
            param.items.list = [];
            inputs.length == 0 ? (param.items.exist = false, param.items.hasBook = false) : (param.items.exist = true, inputs.each(function() {
                var name = $(this).attr('name');
                $(this).data('type') == 1 ? bookNum += 1 : bookNum = bookNum;
                param.items.list.push({ name: name, val: this.value });
            }))
            bookNum > 0 ? param.items.hasBook = true : param.items.hasBook = false;
            t.taggleAddress();
            t.countPrice();
        }, 10)
    },
    account: function() {
        var t = this,
            param = t.data,
            form = t.box.form,
            tpl = t.html.input;

        //提示用户填写地址
        if (param.addressExist && (param.addressId.use == null || !param.goodsTime.exist)) {
            $(window).scrollTop(t.box.getAddress.offset().top / 2);
            var errtpl = param.addressId.use == null ? '请填写收货人信息' : '请填写送货时间';
            setTimeout(function() {
                errorTip(errtpl)
            }, 30);
            return false;
        }

        //支付宝支付
        //地址信息
        // param.addressExist ? tpl = tpl.replace(/\$addid\$/, param.addressId.use).replace(/\$sendTime\$/, param.goodsTime.val) :
        //    tpl = tpl.replace(/\$addid\$/, '').replace(/\$sendTime\$/, '');
        param.addressExist ? tpl = tpl.replace(/\$addid\$/, param.addressId.use) :
            tpl = tpl.replace(/\$addid\$/, '');

        //发票信息
        // param.invoice.exist ? tpl = tpl.replace(/\$invoiceType\$/, param.invoice.type).replace(/\$invoiceTitle\$/, param.invoice.text) :
        // tpl = tpl.replace(/\$invoiceType\$/, '').replace(/\$invoiceTitle\$/, '');


        //支付类型
        tpl = tpl.replace(/\$paytype\$/, param.payType);

        tpl += '<input type="hidden" name="idEncode" value="' + $('#idEncode').val() + '" checked="checked">';
        tpl += '<input type="hidden" name="key" value="' + $('#key').val() + '" checked="checked">';
        tpl += '<input type="hidden" name="isLimit" value="' + $('#isLimit').val() + '" checked="checked">';
        tpl += '<input type="hidden" name="grouponId" value="' + $('#grouponId').val() + '" checked="checked">';
        tpl += '<input type="hidden" name="orderType" value="' + $('#orderType').val() + '" checked="checked">';
        tpl += '<input type="hidden" name="grouponOrderNum" value="' + $('#grouponOrderNum').val() + '"  checked="checked">';
        //实物
        if (param.items.exist) {
            for (var i = 0; i < param.items.list.length; i++) {
                //如果是服包不创建input标签
                if (param.items.list[i].name != 'data[promotionCourse][]') {
                    continue
                }
                tpl += '<input type="hidden" name="' + param.items.list[i].name + '"" value="' + param.items.list[i].val + '" checked="checked">';
            }
        }
        tpl += '<input type="hidden" name="isUseBalance" value="' + $('#isUseBalance').val() + '" checked="checked">';
        //优惠券
        if (param.coupon.exist) {
            for (var j = 0; j < param.coupon.useId.length; j++) {
                tpl += '<input type="hidden" name="stuCouponId[]" value="' + param.coupon.useId[j] + '" checked="checked">';
            }
        }
        form.prepend(tpl);
        form.submit();
    },
    //微信支付
    wChatPay: function(param, fn) {
        param = JSON.parse(param);

        function jsApiCall() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', param,
                function(res) {
                    // alert(res.err_msg);       
                    // alert(res.err_code+res.err_desc+res.err_msg);
                    //回调
                    if (fn && typeof fn == 'function') {
                        fn()
                    }
                    //如果返回支付ok
                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        window.location.href = 'https://cart.xueersi.com/ShoppingComplete/complete'
                    }
                }
            );
        }

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
            }
        } else {
            jsApiCall();
        }
    },
    //绑定事件
    binding: function() {
        var t = this;

        //获取优惠券列表
        t.box.useCoupon.on('click', function() {
            var arr1 = [];
            $('body').find('.course-body').each(function(k, v) { //录播课程盒子
                var id = $(this).attr('id'); //课程id
                $(this).find('.course-price em').each(function(kk, vv) {
                    var vv = $(vv).text().match(/\d+/g)[0] * 1;
                    arr1[k] = { 'courseId': id, 'price': vv };
                })
            });
            var sumPrice = $('#t_course').text(); //课程金额
            t.getCoupon($(this), 'l', arr1, sumPrice);
            $('.order_pay_info').hide();
        })
        //获取地址列表
        t.box.getAddress.on('click', function() {
            t.getAddress($(this), 'l')
        })
        //获取送货日期编辑信息
        t.box.getGoodstime.on('click', function() {
            t.getGoodsTime($(this))
        })
        //选择余额
        t.box.selBalance.parent().on('click', function() {
            if ($(this).find('.select-balance').hasClass('select-balance-no')) {
                $(this).find('.select-balance').removeClass('select-balance-no');
                $('#isUseBalance').val(1);
                t.countPrice(); //计算金额
            } else {
                $(this).find('.select-balance').addClass('select-balance-no');
                $('#isUseBalance').val(0);
                t.countPrice(); //计算金额
            }
        });
        //保存实物
        t.box.items.find('label input').on('click', function() {
            t.saveItems()
        })
        //提交订单
        t.box.form.find('button').on('click', function() {
            t.account()
        })
        //打开激活优惠券界面
        $('body').on('click', '.add-coupon', function() {
            t.addCoupon($(this))
        })
        //选择优惠券
        $('body').off('tap', '.container .choose-coupons').on('tap', '.container .choose-coupons', function() {
            var that = $(this);
            t.chooseCoupon(that);
        })
        //激活优惠券
        $('body').on('click', '.active-coupon', function() {
            t.activeCoupon($(this))
        })
        //选择地址
        $('body').on('click', '.address-body .selectAddr', function() {
            t.chooseAddress($(this));
        });
        //编辑地址
        $('body').on('click', '.change-address', function() {
            t.changeAddress($(this))
        })
        //添加地址
        $('body').on('click', '.addNewAddr', function() {
            t.addAddress($(this))
        })
        //保存地址
        $('body').on('click', '.save-address', function() {
            t.saveAddress($(this))
        })
        //保存送货时间
        $('body').on('tap', '.choose-time', function() {
            t.saveGoodsTime($(this))
        })
        $('body').on('focus', '.has-error', function() {
            $(this).removeClass('has-error')
        })
        $('.return-pre').on('click', function() {
            if ($('.slip-mod').length == 0) {
                return false
            }
            var title = $(this).siblings('.title-slip').text()
            if (slip.index == 0) {
                window.history.go(-1)
            } else {
                if (slip.index == 1) {
                    $('.order_pay_info').show();
                }
                slip.move($(this), 'r');
                $('.course_header .title-slip').text('确认订单');
            }
        })
        //重新支付
        $('#rePay').on('click', function() {
            var groupId;
            if ($("#groupId").length > 0 && $('#groupId').val() != '') {
                groupId = $('#groupId').val();
            } else {
                groupId = '';
            }
            $.ajax({
                url: '/Order/rePay',
                type: "post",
                dataType: "json",
                data: {
                    courseId: $('#courseIds').val(),
                    groupId: groupId,
                    classId: $('#classId').val()
                },
                success: function(v) {
                    if (v.sign == 1) {
                        window.location.href = v.msg;
                        return false
                    }
                },
                error: function(v) {
                    loadOut();
                }
            })
        })
        var closeSetTimeout
        //创建扣费弹层效果
        function appDeductionDialog() {
            //判断是否重复创建弹层
            if ($('#pay_mobile_modal_box').length > 0) {
                return false;
            }
            var dialogBox = ['<div id="pay_mobile_modal_box" class="pay_mobile_modal">\
                                        <div class="pay_mobile_modal_header">\
                                            <h6>温馨提示</h6>\
                                        </div>\
                                    <div class="pay_mobile_body">\
                                        <div class="pay_mobile_prompt_container">\
                                            <p class="pay_mobile_prompt_txt">若商品申请退费时教辅已签收，需根据签收的教辅按分类扣除工本费。教辅分类及工本费明细如下:</p>\
                                        </div>\
                                        <table border="" cellspacing="" cellpadding="">\
                                            <thead>\
                                                <tr>\
                                                    <td>教辅分类</td>\
                                                    <td>教辅工本费（元）</td>\
                                                </tr>\
                                            </thead>\
                                            <tbody>\
                                                <tr>\
                                    <td>讲义</td>\
                                    <td>25</td>\
                                </tr>\
                                <tr>\
                                    <td>练习册</td>\
                                    <td>10</td>\
                                </tr>\
                                <tr>\
                                    <td>试卷</td>\
                                    <td>2</td>\
                                </tr>\
                                <tr>\
                                    <td>绘本</td>\
                                    <td>6</td>\
                                </tr>\
                                <tr>\
                                    <td>单词手册</td>\
                                    <td>5</td>\
                                </tr>\
                                <tr>\
                                    <td>小超市</td>\
                                    <td>6</td>\
                                </tr>\
                                <tr>\
                                    <td>教具</td>\
                                    <td>15</td>\
                                </tr>\
                                <tr>\
                                    <td>教具书</td>\
                                    <td>30</td>\
                                </tr>\
                                <tr>\
                                    <td>计算卡</td>\
                                    <td>5</td>\
                                </tr>\
                                <tr>\
                                    <td>礼包</td>\
                                    <td>20</td>\
                                </tr>\
                                <tr>\
                                    <td>编程套装</td>\
                                    <td>75</td>\
                                </tr>\
                                            </tbody>\
                                        </table>\
                                    </div>\
                                    <div class="pay_mobile_btn_group">\
                                            <button class="close-appPay-deductionBialog-btn">知道了</button>\
                                        </div>\
                                </div>\
                            <div class="pay-mobile-dialog-mask-box" id="pay-mobile-dialog-mask-box"></div>']
            $('body').append(dialogBox.join(''));
            //关闭弹层
            $('body').off('click', '.close-appPay-deductionBialog-btn').on('click', '.close-appPay-deductionBialog-btn', function() {
                clearTimeout(closeSetTimeout);
                $('body').find('#pay-mobile-dialog-mask-box').hide();
                $('body').find('#pay_mobile_modal_box').removeClass('pay-mobile-dialog-animation');
            })
        }
        //初始化弹层
        appDeductionDialog();
        $('#pay-deduction-tips').on('click', function() {
            $('body').find('#pay-mobile-dialog-mask-box').show();
            $('body').find('#pay_mobile_modal_box').addClass('pay-mobile-dialog-animation');
            //5s后自动关闭弹层
            closeSetTimeout = setTimeout(function() {
                $('body').find('#pay-mobile-dialog-mask-box').hide();
                $('body').find('#pay_mobile_modal_box').removeClass('pay-mobile-dialog-animation');
                clearTimeout(closeSetTimeout);
            }, 5000);
        })
    }

}

Zepto(function($) {
    slip.init() //初始化滑动参数
    payment.init() //初始化订单
    if ($('.slip-mod').length != 0) {
        $('.headTitle').css('position', 'fixed')
        $('.return-pre').removeAttr('onclick')
    }

})

payment.html = {
    input: '<input type="hidden" name="payType" value="$paytype$">' +
        '<input type="hidden" name="addId" value="$addid$">' +
        '<input type="hidden" name="sendTime" value="$sendTime$">' +
        '<input type="hidden" name="invoiceType" value="$invoiceType$">' +
        '<input type="hidden" name="invoiceTitle" value="$invoiceTitle$">',
    invoice: '<div class="form-order-info">' +
        '<ul class="list-group">' +
        '<li class="list-group-item">发票类型' +
        '</li>' +
        '<li class="list-group-item list-group-a invoice-type">' +
        '<div class="radio">' +
        '<label>' +
        '<input type="radio" name="invoice-type" id="optionsRadios1" value="1" $type0$>培训费</label>' +
        '</div>' +
        '<div class="radio">' +
        '<label>' +
        '<input type="radio" name="invoice-type" id="optionsRadios2" value="2" $type1$>资料费</label>' +
        '</div>' +
        '</li>' +
        '<li class="list-group-item">发票抬头' +
        '</li>' +
        '<li class="list-group-item list-group-a invoice-title">' +
        '<div class="form-group">' +
        '<input type="text" class="form-control" placeholder="发票抬头" value="$text$">' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '<div class="invoice-botton-btn col-sm-offset-0 col-sm-12">' +
        '<button type="button" class="btn btn-danger btn-lg btn-submit save-invoice">确 认</button>' +
        '</div>',
    goodsTime: '<div class="form-order-info  form-order-info-time"><ul class="list-group"><li class="list-group-item list-group-a">' +
        '<div class="radio choose-time" id="1">' +
        '<label class="">' +
        '工作日/周末/假日均可</label>' +
        '<em></em>' +
        '</div>' +
        '</li>' +
        '<li class="list-group-item list-group-a">' +
        '<div class="radio choose-time" id="2">' +
        '<label class="">' +
        '仅周末与假日送货</label>' +
        '<em></em>' +
        '</div>' +
        '</li>' +
        '<li class="list-group-item list-group-a">' +
        '<div class="radio choose-time" id="3">' +
        '<label class="">' +
        '仅工作日送货</label>' +
        '<em></em>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>',
    address: {
        get: '<div class="address-body" data-addressid="$addressId$" style="-webkit-transition: all 1s cubic-bezier(0.54, 0.02, 0.44, 0.98);">' +
            '<p class="address-t">$userinfo$</p>' +
            '<p class="address-a">$address$</p>' +
            '<div  class="address-d">' +
            '<span class="left choose-add">' +
            '<input type="radio" name="optionsRadios" $checked$ value="" id="getAddr" class="radio">' +
            '<label for="getAddr" class="radio selectAddr"></label>' +
            '<label class="choose-address">送到这里</label>' +
            '</span>' +
            '<span class="right"><a href="javascript:void(0);" class="change-address">编辑</a>' +
            '</span>' +
            '</div>' +
            '</div>',
        add: '<div class="form-order-info form-address-edit">' +
            '<div class="form-group">' +
            '<label for="">收货人姓名</label>' +
            '<input type="text" class="form-control" name="realname" placeholder="" value="$name$"></div>' +
            '<div class="form-group">' +
            '<label for="">手机号</label>' +
            '<input type="text" class="form-control" name="phone" placeholder="" value="$phone$"></div>'
            // + '<div class="form-group">'
            // + '<label for="">固定电话</label>'
            // + '<input type="text" class="form-control" name="fixedphone" placeholder="" value="$fixedphone$"></div>'
            +
            '<div class="form-group has-feedback">' +
            '<label for="" class="control-label">省份</label>' +
            '<select id="add_province" name="province" class="select"></select>' +
            '</div>' +
            '<div class="form-group has-feedback">' +
            '<label for="inputSuccess2" class="control-label">城市</label>' +
            '<select id="add_city" name="city" class="select"></select>' +
            '</div>' +
            '<div class="form-group has-feedback">' +
            '<label for="inputSuccess2" class="control-label">区县</label>' +
            '<select id="add_country" name="country" class="select"></select>' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="">详细地址</label>' +
            '<input name="address" maxlength="120" class="form-control" placeholder="街道、门牌号等" value="$address$">' +
            '</div>' +
            '<div class="invoice-botton-btn col-sm-offset-0 col-sm-12">' +
            '<button type="button" class="btn btn-danger btn-lg save-address" data-id="$id$">保存并使用</button>' +
            '</div>' +
            '</div>' +
            '<script>' +
            'function renderAreaSelect () { var defaults = {s1:"add_province",s2:"add_city",s3:"add_country",v1:$("#province").val(),v2:$("#city").val(),v3:$("#country").val()$init$ }; $("#add_province").empty("");$("#add_city").empty("");$("#add_country").empty("");threeSelect(defaults);};renderAreaSelect();' +
            '</script>'
    },
    coupon: {
        no:
            // '<div class="gold-txt-tips">优惠券使用额度上限为订单金额的50%</div>' 
            '<div class="row gold-num del-label choose-coupons choose-no">' +
            '<div class="col-xs-1 checkbox-button">' +
            '<input type="radio" class="radio" checked name="blankRadio" id="no-coupon" value="0" couponValue="0">' +
            '<span for="no-coupon" class="radio"></span>' +
            '</div>' +
            '<div class="gold col-xs-11">' +
            '<div class="gold-money" style="background:none">' +
            '<span class="none-coupon">不使用优惠券</span>' +
            '</div>' +
            '</div>' +
            '</div>',
        getCommon: '<div class="row gold-num del-label choose-coupons cheaper-card $unclick$ $canuse$">' +
            '<div class="col-xs-1 checkbox-button">' +
            '<input type="radio" name="blankRadio" class="radio" id="blankRadio1" $checked$ value="$cardId$" couponValue="$couponSum$">' +
            '<span for="blankRadio1" class="radio"></span>' +
            '</div>' +
            '<div class="gold col-xs-11">'
            // + '<div class="gold-money $grey-money$">'
            // + '<span class="goldMoney money">￥$value$</span>'
            // + '<span class="de">卡号：$cardNum$</span>'
            // + '</div>'
            +
            '<div class="coupon-wrap">' +
            '<div class="coupon-inner coupon-left">' +
            '<p><em>¥</em><strong>$value$</strong></p>' +
            '<p>满$priceLimitTip$可用</p>' +
            '</div>' +
            '<div class="coupon-inner coupon-right">' +
            '<p>全平台可用</p>' +
            '<p>$expiredDate$到期（<span>仅剩$remainDay$天</span>）</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<label class="coupon-label all-coupon-label">通用券</label>' +
            '</div>',
        getSpecific: '<div class="row gold-num del-label choose-coupons cheaper-card $unclick$ $canuse$ ">' +
            '<div class="col-xs-1 checkbox-button">' +
            '<input type="radio" name="blankRadio" class="radio" id="blankRadio2" type="hidden" value="$cardId$" couponvalue="$couponSum$" $checked$>' +
            '<span for="blankRadio2" class="radio"></span>' +
            '</div>' +
            '<div class="gold col-xs-11 ">' +
            '<div class="coupon-wrap">' +
            '<div class="coupon-inner coupon-left">' +
            '<p><em>¥</em><strong>$value$</strong></p>' +
            '<p>满$priceLimitTip$可用</p>' +
            '</div>' +
            '<div class="coupon-inner coupon-right">' +
            '<p>仅可购买限定课程</p>' +
            '<p>$expiredDate$到期（<span>仅剩$remainDay$天</span>）</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<label class="coupon-label pinlist-coupon-label">品类券</label>' +
            '</div>',
        disabled: '<p class="disbale-coupon">不可使用优惠券</p>' +
            '<div class="row gold-num del-label choose-coupons cheaper-card disbale-coupon-gold" $unclick$>' +
            '<div class="col-xs-1 checkbox-button">' +
            '<input type="radio" name="blankRadio" class="radio" id="blankRadio1" type="hidden" value="$cardId$" couponvalue="$couponSum$" $checked$>' +
            '</div>' +
            '<div class="gold col-xs-11 ">' +
            '<div class="coupon-wrap">' +
            '<div class="coupon-inner coupon-left">' +
            '<p><em>¥</em><strong>$value$</strong></p>' +
            '<p>满$priceLimitTip$可用</p>' +
            '</div>' +
            '<div class="coupon-inner coupon-right">' +
            '<p>仅可购买限定课程</p>' +
            '<p>$expiredDate$到期（<span>仅剩$remainDay$天</span>）</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<label class="coupon-label disable-coupon-label">通用券</label>' +
            '</div>',
        active: '<form class="form-horizontal active-gold" role="form">' +
            '<div class="form-group ">' +
            '<label class="col-xs-2 control-label del-label">卡号</label>' +
            '<div class="col-xs-10 text-group">' +
            '<input type="text" name="cardNum" class="form-control">' +
            '</div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="col-xs-2 control-label del-label">密码</label>' +
            '<div class="col-xs-10 text-group">' +
            '<input type="text" name="cardPas" class="form-control">' +
            '</div>' +
            '</div>' +
            '<div class="form-group">' +
            '<div class="col-sm-offset-0 col-sm-12">' +
            '<button type="button" class="btn btn-danger btn-lg btn-submit active-coupon" >激活</button>' +
            '</div>' +
            '</div>' +
            '</form>'
    },
    payType: '<div class="form-order-info">' +
        '<ul class="list-group">' +
        '<li class="list-group-item" style="">支付信息' +
        '</li>' +
        '<li class="list-group-item list-group-a">' +
        '<div class="radio">' +
        '<label data-type="401003" class="choose-paytype">' +
        '<input type="radio" value="" $check$>$onlinePayType$支付</label>' +
        '</div>' +
        '</li>' +
        '<li class="list-group-item list-group-a" style="border-bottom:1px solid #ddd;">' +
        '<div class="radio">' +
        '<label data-type="200000" class="choose-paytype">' +
        '<input type="radio"  value="" >货到付款</label>' +
        '<br><em>订单金额小于等于29元会收取快递费8元</em>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>'
}