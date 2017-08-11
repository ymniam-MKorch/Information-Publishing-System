layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var terminalData = '';
    $.get("../../json/terminalList.json", function (data) {
        var newArray = [];
        terminalData = data;
        if (window.sessionStorage.getItem("addterminal")) {
            var addterminal = window.sessionStorage.getItem("addterminal");
            terminalData = JSON.parse(addterminal).concat(terminalData);
        }
            //执行加载数据的方法
        terminalList();
    })

    //查询
    $(".search_btn").click(function () {
        var newArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "../../json/terminalList.json",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (window.sessionStorage.getItem("addterminal")) {
                            var addterminal = window.sessionStorage.getItem("addterminal");
                            terminalData = JSON.parse(addterminal).concat(data);
                        } else {
                            terminalData = data;
                        }
                        for (var i = 0; i < terminalData.length; i++) {
                            var terminalStr = terminalData[i];
                            var selectStr = $(".search_input").val();
                            function changeStr(data) {
                                var dataStr = '';
                                var showNum = data.split(eval("/" + selectStr + "/ig")).length - 1;
                                if (showNum > 1) {
                                    for (var j = 0; j < showNum; j++) {
                                        dataStr += data.split(eval("/" + selectStr + "/ig"))[j] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
                                    }
                                    dataStr += data.split(eval("/" + selectStr + "/ig"))[showNum];
                                    return dataStr;
                                } else {
                                    dataStr = data.split(eval("/" + selectStr + "/ig"))[0] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/" + selectStr + "/ig"))[1];
                                    return dataStr;
                                }
                            }
                            //终端ID
                            if (terminalStr.ID.indexOf(selectStr) > -1) {
                                terminalStr["ID"] = changeStr(terminalStr.ID);
                            }
                            //终端名称
                            if (terminalStr.Name.indexOf(selectStr) > -1) {
                                terminalStr["Name"] = changeStr(terminalStr.Name);
                            }
                            //所有者
                            if (terminalStr.Author.indexOf(selectStr) > -1) {
                                terminalStr["Author"] = changeStr(terminalStr.Author);
                            }
                            //节目
                            if (terminalStr.Program.indexOf(selectStr) > -1) {
                                terminalStr["Program"] = changeStr(terminalStr.Program);
                            }
                            //IP
                            if (terminalStr.IP.indexOf(selectStr) > -1) {
                                terminalStr["IP"] = changeStr(terminalStr.IP);
                            }
                            //时间
                            if (terminalStr.Last_Login.indexOf(selectStr) > -1) {
                                terminalStr["Last_Login"] = changeStr(terminalStr.Last_Login);
                            }
                            if (terminalStr.ID.indexOf(selectStr) > -1 || terminalStr.Name.indexOf(selectStr) > -1
                                || terminalStr.Author.indexOf(selectStr) > -1 || terminalStr.Program.indexOf(selectStr) > -1
                                || terminalStr.IP.indexOf(selectStr) > -1 || terminalStr.Last_Login.indexOf(selectStr) > -1) {
                                newArray.push(terminalStr);
                            }
                        }
                        terminalData = newArray;
                        terminalList(terminalData);
                    }
                })

                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加文章
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).one("resize", function () {
        $(".terminalAdd_btn").click(function () {
            var index = layui.layer.open({
                title: "添加终端",
                type: 2,
                content: "addterminal.html",
                area: ['100%', '100%'],
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回终端列表', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
            layui.layer.full(index);
        })
    }).resize();

    //刷新进度
    $(".refresh_all").click(function () {
        var $checkbox = $('.terminal_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.terminal_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            var index = layer.msg('刷新中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                for (var j = 0; j < $checked.length; j++) {
                    for (var i = 0; i < terminalData.length; i++) {
                        if (terminalData[i].ID == $checked.eq(j).parents("tr").find(".terminal_del").attr("data-id")) {
                            //修改列表中的文字
                            terminalData[i].Progress = "100%";
                            terminalList(terminalData);
                            //将选中状态删除
                            $checked.eq(j).parents("tr").find('input[type="checkbox"][name="checked"]').prop("checked", false);
                            form.render();
                        }
                    }
                }
                layer.close(index);
                layer.msg("刷新成功");
            }, 2000);
        } else {
            layer.msg("请选择需要刷新的终端");
        }
    })

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.terminal_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.terminal_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的终端？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < terminalData.length; i++) {
                            if (terminalData[i].ID == $checked.eq(j).parents("tr").find(".terminal_del").attr("data-id")) {
                                terminalData.splice(i, 1);
                                terminalList(terminalData);
                            }
                        }
                    }
                    $('.terminal_list thead input[type="checkbox"]').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 2000);
            })
        } else {
            layer.msg("请选择需要删除的终端");
        }
    })

    //全选
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
            form.render();
        });
        form.render('checkbox');
    });

    //通过判断文章是否全部选中来确定全选按钮是否选中
    form.on("checkbox(choose)", function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked');
        if (childChecked.length == child.length) {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
        } else {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
        }
        form.render('checkbox');
    })

    //是否使用
    form.on('switch(Use)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("使用状态修改成功！");
        }, 1000);
    })

    //操作
    $("body").on("click", ".terminal_refresh", function () {  //刷新
        var _this = $(this);
        var index = layer.msg('刷新中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            for (var i = 0; i < terminalData.length; i++) {
                if (terminalData[i].ID == _this.attr("data-id")) {
                    terminalData[i].Progress = "100%";
                    terminalList(terminalData);
                }
            }
        layer.close(index);
        }, 1000);
    })

    $("body").on("click", ".terminal_edit", function () {  //编辑
        var _this = $(this);
        var Name;
        for (var i = 0; i < terminalData.length; i++) {
            if (terminalData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "编辑终端",
                    type: 2,
                    content: "edit_terminal.html",
                    area: ['50%', '50%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回终端列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".send_program", function () {  //发送节目
        var _this = $(this);
        var Name;
        for (var i = 0; i < terminalData.length; i++) {
            if (terminalData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "发送节目",
                    type: 2,
                    content: "../program/send_program.html",
                    area: ['50%', '360px'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回终端列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".terminal_monitor", function () {  //监控
        var _this = $(this);
        var Name;
        for (var i = 0; i < terminalData.length; i++) {
            if (terminalData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "监控",
                    type: 2,
                    content: "../monitor/monitoring.html",
                    area: ['50%', '70%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回终端列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".terminal_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此终端？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < terminalData.length; i++) {
                if (terminalData[i].ID == _this.attr("data-id")) {
                    terminalData.splice(i, 1);
                    terminalList(terminalData);
                }
            }
            layer.close(index);
        });
    })

    function terminalList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = terminalData.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                        + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                        + '<td>' + currData[i].ID + '</td>'
                        + '<td>' + currData[i].Name + '</td>'
                        + '<td>' + currData[i].Hardware_Identification_Code + '</td>'
                        + '<td>' + currData[i].Author + '</td>'
                        + '<td>' + currData[i].Progress + '<a class="layui-btn layui-btn-mini terminal_refresh" data-id="' + data[i].ID + '" style="background-color:#5FB878;margin-left:30px"><i class="layui-icon">&#x1002;</i></a>'
                        +'</td>'
                        + '<td>' + currData[i].Program + '</td>';
                    if (currData[i].Status == "1") {
                        dataHtml += '<td><img src="../../images/yes.jpg" alt="是" width="25" height="20"> </td>';
                    } else {
                        dataHtml += '<td><img src="../../images/no.jpg" alt="否" width="25" height="20"> </td>';
                    }
                    dataHtml += '<td>' + currData[i].IP + '</td>'
                        + '<td>' + currData[i].Last_Login + '</td>'
                        + '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="Use"' + currData[i].Use + '></td>'
                        + '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini terminal_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini send_program" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-send"></i> 发送节目</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini terminal_monitor" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-monitor"></i> 监控</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini power" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-logout1"></i> 电源管理</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini wake" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-wake"></i> 网络唤醒</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini terminal_del" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a></li>'
                        + '</ul>'
                        + '</div>'
                        + '</td>'
                        + '</tr>';
                }
            } else {
                dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
            }
            return dataHtml;
        }

        //分页
        var nums = 10; //每页出现的数据量
        if (that) {
            terminalData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(terminalData.length / nums),
            jump: function (obj) {
                $(".terminal_content").html(renderDate(terminalData, obj.curr));
                $('.terminal_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})

