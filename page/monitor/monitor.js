layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage', 'flow'], function () {
    var flow = layui.flow,
        form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //流加载图片
    var monitorNums = 15;  //单页显示图片数量
    flow.load({
        elem: '#Monitor', //流加载容器
        done: function (page, next) { //加载下一页
            $.get("../../json/monitor.json", function (data) {
                //模拟插入
                var monitorList = [];
                var maxPage = monitorNums * page < data.length ? monitorNums * page : data.length;
                setTimeout(function () {
                    for (var i = monitorNums * (page - 1); i < maxPage; i++) {
                        monitorList.push('<a><li><video src="' + data[i].monitorSrc + '" type="video/mp4" controls="controls" autoplay="autoplay" preload="auto" width="100%" height="100%" loop="loop"></li><la><div class="operate"><div class="check"><input type="checkbox" name="belle" lay-filter="choose" lay-skin="primary" title="' + data[i].monitorTitle + '"></div><i class="layui-icon monitor_look">&#xe615;</i></div></la></a>')
                    }
                    next(monitorList.join(''), page < (data.length / monitorNums));
                    form.render();
                }, 500);
            });
        }
    });

    //查询
    //$(".search_btn").click(function () {
    //    var newArray = [];
    //    if ($(".search_input").val() != '') {
    //        var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
    //        setTimeout(function () {
    //            $.ajax({
    //                url: "../../json/monitor.json",
    //                type: "get",
    //                dataType: "json",
    //                success: function (data) {
    //                    if (window.sessionStorage.getItem("addterminal")) {
    //                        var addterminal = window.sessionStorage.getItem("addterminal");
    //                        terminalData = JSON.parse(addterminal).concat(data);
    //                    } else {
    //                        terminalData = data;
    //                    }
    //                    for (var i = 0; i < terminalData.length; i++) {
    //                        var terminalStr = terminalData[i];
    //                        var selectStr = $(".search_input").val();
    //                        function changeStr(data) {
    //                            var dataStr = '';
    //                            var showNum = data.split(eval("/" + selectStr + "/ig")).length - 1;
    //                            if (showNum > 1) {
    //                                for (var j = 0; j < showNum; j++) {
    //                                    dataStr += data.split(eval("/" + selectStr + "/ig"))[j] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
    //                                }
    //                                dataStr += data.split(eval("/" + selectStr + "/ig"))[showNum];
    //                                return dataStr;
    //                            } else {
    //                                dataStr = data.split(eval("/" + selectStr + "/ig"))[0] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/" + selectStr + "/ig"))[1];
    //                                return dataStr;
    //                            }
    //                        }
    //                        //终端ID
    //                        if (terminalStr.ID.indexOf(selectStr) > -1) {
    //                            terminalStr["ID"] = changeStr(terminalStr.ID);
    //                        }
    //                        //终端名称
    //                        if (terminalStr.Name.indexOf(selectStr) > -1) {
    //                            terminalStr["Name"] = changeStr(terminalStr.Name);
    //                        }
    //                        if (terminalStr.ID.indexOf(selectStr) > -1 || terminalStr.Name.indexOf(selectStr) > -1) {
    //                            newArray.push(terminalStr);
    //                        }
    //                    }
    //                    terminalData = newArray;
    //                    terminalList(terminalData);
    //                }
    //            })

    //            layer.close(index);
    //        }, 2000);
    //    } else {
    //        layer.msg("请输入需要查询的内容");
    //    }
    //})

    //放大监控
    $("body").on("click", ".monitor_look", function () {
        var _this = $(this);
        var index = layui.layer.open({
            title: "监控",
            type: 2,
            content: "monitoring.html",
            area: ['50%', '70%'],
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处返回监控列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 100)
            }
        })
    })

    //全选
    form.on('checkbox(selectAll)', function (data) {
        var child = $("#Monitor la input[type='checkbox']");
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    //通过判断是否全部选中来确定全选按钮是否选中
    form.on("checkbox(choose)", function (data) {
        var child = $(data.elem).parents('#Monitor').find('la input[type="checkbox"]');
        var childChecked = $(data.elem).parents('#Monitor').find('la input[type="checkbox"]:checked');
        if (childChecked.length == child.length) {
            $(data.elem).parents('#Monitor').siblings("blockquote").find('input#selectAll').get(0).checked = true;
        } else {
            $(data.elem).parents('#Monitor').siblings("blockquote").find('input#selectAll').get(0).checked = false;
        }
        form.render('checkbox');
    })

})