layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var groupData = '';
    $.get("../../json/terminalGroup.json", function (data) {
        var newArray = [];
        groupData = data;
        if (window.sessionStorage.getItem("addgroup")) {
            var addgroup = window.sessionStorage.getItem("addgroup");
            groupData = JSON.parse(addgroup).concat(groupData);
        }
        //执行加载数据的方法
        groupList();
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
                        if (window.sessionStorage.getItem("addgroup")) {
                            var addgroup = window.sessionStorage.getItem("addgroup");
                            groupData = JSON.parse(addgroup).concat(data);
                        } else {
                            groupData = data;
                        }
                        for (var i = 0; i < groupData.length; i++) {
                            var groupStr = groupData[i];
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
                            if (groupStr.ID.indexOf(selectStr) > -1) {
                                groupStr["ID"] = changeStr(groupStr.ID);
                            }
                            //终端名称
                            if (groupStr.Name.indexOf(selectStr) > -1) {
                                groupStr["Name"] = changeStr(groupStr.Name);
                            }
                            //所有者
                            if (groupStr.Author.indexOf(selectStr) > -1) {
                                groupStr["Author"] = changeStr(groupStr.Author);
                            }
                            //描述
                            if (groupStr.Describe.indexOf(selectStr) > -1) {
                                groupStr["Describe"] = changeStr(groupStr.Describe);
                            }
                            if (groupStr.ID.indexOf(selectStr) > -1 || groupStr.Name.indexOf(selectStr) > -1
                                || groupStr.Author.indexOf(selectStr) > -1 || groupStr.Describe.indexOf(selectStr) > -1) {
                                newArray.push(groupStr);
                            }
                        }
                        groupData = newArray;
                        groupList(groupData);
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
        $(".groupAdd_btn").click(function () {
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

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.group_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.group_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的终端？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < groupData.length; i++) {
                            if (groupData[i].ID == $checked.eq(j).parents("tr").find(".group_del").attr("data-id")) {
                                groupData.splice(i, 1);
                                groupList(groupData);
                            }
                        }
                    }
                    $('.group_list thead input[type="checkbox"]').prop("checked", false);
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
    $("body").on("click", ".group_look", function () {  //刷新
        var _this = $(this);
        var ter;
        for (var i = 0; i < groupData.length; i++) {
            if (groupData[i].ID == _this.attr("data-id")) {
                ter = groupData[i].Terminal;
            }
        }

        var strs = new Array();
        strs = ter.split(",");
        var group = '';
        for (i = 0; i < strs.length; i++) {
            if (strs[i] == "1")
                group += '屏幕一号\n';
            else if (strs[i] == "2")
                group += '屏幕二号\n';
            else if (strs[i] == "3")
                group += '屏幕三号\n';
            else if (strs[i] == "4")
                group += '屏幕四号\n';
            else if (strs[i] == "5")
                group += '屏幕五号\n';
            else if (strs[i] == "6")
                group += '屏幕六号\n';
            else
                group+='包涵不存在的终端！'
        }

        layer.open({
            type: 1,
            title: '下属终端',
            skin: 'layui-layer-rim',
            area: ['420px', '240px'],
            content: group
        });
    })

    $("body").on("click", ".group_edit", function () {  //编辑
        var _this = $(this);
        var Name;
        for (var i = 0; i < groupData.length; i++) {
            if (groupData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "编辑群组",
                    type: 2,
                    content: "edit_group.html",
                    area: ['50%', '50%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回群组列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 500)
                    }
                })
            }
        }
    })

    $("body").on("click", ".group_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此终端？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < groupData.length; i++) {
                if (groupData[i].ID == _this.attr("data-id")) {
                    groupData.splice(i, 1);
                    groupList(groupData);
                }
            }
            layer.close(index);
        });
    })

    function groupList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = groupData.concat().splice(curr * nums - nums, nums);
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
                        + '<li><a class="layui-btn group_look" style="background-color:#5FB878;height:35px;" data-id="' + data[i].ID + '"><i class="iconfont icon-look"></i>查看</a></li>'
                        + '</td>'
                    dataHtml +=  '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini group_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑群组</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini group_modify" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-chengyuan"></i> 编辑成员</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini group_del" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a></li>'
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
            groupData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(groupData.length / nums),
            jump: function (obj) {
                $(".group_content").html(renderDate(groupData, obj.curr));
                $('.group_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})