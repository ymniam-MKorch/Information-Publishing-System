layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var terminalData = '';
    $.get("../../json/terminalGroup.json", function (data) {
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
                    url: "../../json/terminalGroup.json",
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
                            //描述
                            if (terminalStr.Describe.indexOf(selectStr) > -1) {
                                terminalStr["Describe"] = changeStr(terminalStr.Describe);
                            }
                            if (terminalStr.ID.indexOf(selectStr) > -1 || terminalStr.Name.indexOf(selectStr) > -1
                                || terminalStr.Author.indexOf(selectStr) > -1 || terminalStr.Describe.indexOf(selectStr) > -1) {
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

    //添加群组
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).one("resize", function () {
        $(".terminalAdd_btn").click(function () {
            var index = layui.layer.open({
                title: "添加群组",
                type: 2,
                content: "addgroup.html",
                area: ['100%', '100%'],
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回群组列表', '.layui-layer-setwin .layui-layer-close', {
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

    //通过判断是否全部选中来确定全选按钮是否选中
    form.on("checkbox(choose)", function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
        if (childChecked.length == child.length) {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
        } else {
            $(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
        }
        form.render('checkbox');
    })

    //操作
    $("body").on("click", ".terminal_look", function () {  //刷新
        var _this = $(this);
        var ter;
        for (var i = 0; i < terminalData.length; i++) {
            if (terminalData[i].ID == _this.attr("data-id")) {
                ter = terminalData[i].Terminal;
            }
        }

        var strs = new Array();
        strs = ter.split(",");
        var terminal = '';
        for (i = 0; i < strs.length; i++) {
            if (strs[i] == "1")
                terminal += '屏幕一号\n';
            else if (strs[i] == "2")
                terminal += '屏幕二号\n';
            else if (strs[i] == "3")
                terminal += '屏幕三号\n';
            else if (strs[i] == "4")
                terminal += '屏幕四号\n';
            else if (strs[i] == "5")
                terminal += '屏幕五号\n';
            else if (strs[i] == "6")
                terminal += '屏幕六号\n';
            else
                terminal+='包涵不存在的终端！'
        }

        layer.open({
            type: 1,
            title: '下属终端',
            skin: 'layui-layer-rim',
            area: ['420px', '240px'],
            content: terminal
        });
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
                        }, 500)
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
                        + '<td align="left">' + currData[i].Name + '</td>'
                        + '<td>' + currData[i].Author + '</td>'
                        + '<td align="left">' + currData[i].Describe + '</td>'
                        + '<td>'
                        + '<li><a class="layui-btn terminal_look" style="background-color:#5FB878;height:35px;" data-id="' + data[i].ID + '"><i class="iconfont icon-look"></i>查看</a></li>'
                        + '</td>'
                    dataHtml +=  '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini terminal_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑群组</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini terminal_modify" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-chengyuan"></i> 编辑成员</a></li>'
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