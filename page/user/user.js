layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var userData = '';
    $.get("../../json/userList.json", function (data) {
        var newArray = [];
        userData = data;
        if (window.sessionStorage.getItem("adduser")) {
            var adduser = window.sessionStorage.getItem("adduser");
            userData = JSON.parse(adduser).concat(userData);
        }
        //执行加载数据的方法
        userList();
    })

    //查询
    $(".search_btn").click(function () {
        var newArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "../../json/userList.json",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (window.sessionStorage.getItem("adduser")) {
                            var adduser = window.sessionStorage.getItem("adduser");
                            userData = JSON.parse(adduser).concat(data);
                        } else {
                            userData = data;
                        }
                        for (var i = 0; i < userData.length; i++) {
                            var userStr = userData[i];
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
                            //用户ID
                            if (userStr.ID.indexOf(selectStr) > -1) {
                                userStr["ID"] = changeStr(userStr.ID);
                            }
                            //用户名称
                            if (userStr.Name.indexOf(selectStr) > -1) {
                                userStr["Name"] = changeStr(userStr.Name);
                            }
                            //所有者
                            if (userStr.Owner.indexOf(selectStr) > -1) {
                                userStr["Owner"] = changeStr(userStr.Owner);
                            }
                            //级别
                            if (userStr.Level.indexOf(selectStr) > -1) {
                                userStr["Level"] = changeStr(userStr.Level);
                            }
                            //联系方式
                            if (userStr.Contact.indexOf(selectStr) > -1) {
                                userStr["Contact"] = changeStr(userStr.Contact);
                            }
                            //邮件
                            if (userStr.Email.indexOf(selectStr) > -1) {
                                userStr["Email"] = changeStr(userStr.Email);
                            }
                            if (userStr.ID.indexOf(selectStr) > -1 || userStr.Name.indexOf(selectStr) > -1
                                || userStr.Owner.indexOf(selectStr) > -1 || userStr.Level.indexOf(selectStr) > -1
                                || userStr.Contact.indexOf(selectStr) > -1 || userStr.Email.indexOf(selectStr) > -1) {
                                newArray.push(userStr);
                            }
                        }
                        userData = newArray;
                        userList(userData);
                    }
                })

                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加用户
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).one("resize", function () {
        $(".userAdd_btn").click(function () {
            var index = layui.layer.open({
                title: "添加用户",
                type: 2,
                content: "adduser.html",
                area: ['100%', '100%'],
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
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
        var $checkbox = $('.user_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.user_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的用户？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < userData.length; i++) {
                            if (userData[i].ID == $checked.eq(j).parents("tr").find(".user_del").attr("data-id")) {
                                userData.splice(i, 1);
                                userList(userData);
                            }
                        }
                    }
                    $('.user_list thead input[type="checkbox"]').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 2000);
            })
        } else {
            layer.msg("请选择需要删除的用户");
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

    //操作
    $("body").on("click", ".user_edit", function () {  //编辑
        var _this = $(this);
        var Name;
        for (var i = 0; i < userData.length; i++) {
            if (userData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "编辑用户",
                    type: 2,
                    content: "edit_user.html",
                    area: ['50%', '50%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".user_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此用户？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < userData.length; i++) {
                if (userData[i].ID == _this.attr("data-id")) {
                    userData.splice(i, 1);
                    userList(userData);
                }
            }
            layer.close(index);
        });
    })

    function userList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = userData.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                        + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                        + '<td>' + currData[i].ID + '</td>'
                        + '<td>' + currData[i].Name + '</td>'
                        + '<td>' + currData[i].Owner + '</td>'
                        + '<td>' + currData[i].Level + '</td>'
                        + '<td>' + currData[i].Contact + '</td>'
                        + '<td>' + currData[i].Email + '</td>';
                    dataHtml += '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini user_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini modify_password" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 修改密码</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini user_del" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a></li>'
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
            userData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(userData.length / nums),
            jump: function (obj) {
                $(".user_content").html(renderDate(userData, obj.curr));
                $('.user_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})

