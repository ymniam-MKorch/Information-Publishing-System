layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var templateData = '';
    $.get("../../json/template.json", function (data) {
        var newArray = [];
        templateData = data;
        if (window.sessionStorage.getItem("addtemplate")) {
            var addtemplate = window.sessionStorage.getItem("addtemplate");
            templateData = JSON.parse(addtemplate).concat(templateData);
        }
        //执行加载数据的方法
        templateList();
    })

    //查询
    $(".search_btn").click(function () {
        var newArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "../../json/template.json",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (window.sessionStorage.getItem("addtemplate")) {
                            var addtemplate = window.sessionStorage.getItem("addtemplate");
                            templateData = JSON.parse(addtemplate).concat(data);
                        } else {
                            templateData = data;
                        }
                        for (var i = 0; i < templateData.length; i++) {
                            var templateStr = templateData[i];
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
                            //ID
                            if (templateStr.ID.indexOf(selectStr) > -1) {
                                templateStr["ID"] = changeStr(templateStr.ID);
                            }
                            //名称
                            if (templateStr.Name.indexOf(selectStr) > -1) {
                                templateStr["Name"] = changeStr(templateStr.Name);
                            }
                            //标签
                            if (templateStr.Label.indexOf(selectStr) > -1) {
                                templateStr["Label"] = changeStr(templateStr.Label);
                            }
                            //所有者
                            if (templateStr.Owner.indexOf(selectStr) > -1) {
                                templateStr["Owner"] = changeStr(templateStr.Owner);
                            }
                            //时间
                            if (templateStr.Last_modify.indexOf(selectStr) > -1) {
                                templateStr["Last_modify"] = changeStr(templateStr.Last_modify);
                            }
                            if (templateStr.ID.indexOf(selectStr) > -1 || templateStr.Name.indexOf(selectStr) > -1
                                || templateStr.Label.indexOf(selectStr) > -1 || templateStr.Owner.indexOf(selectStr) > -1
                                || templateStr.Last_modify.indexOf(selectStr) > -1) {
                                newArray.push(templateStr);
                            }
                        }
                        templateData = newArray;
                        templateList(templateData);
                    }
                })

                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加模板
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).one("resize", function () {
        $(".templateAdd_btn").click(function () {
            var index = layui.layer.open({
                title: "添加模板",
                type: 2,
                content: "addtemplate.html",
                area: ['100%', '100%'],
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回模板列表', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 300)
                }
            })
            layui.layer.full(index);
        })
    }).resize();

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.template_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.template_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的模板？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < templateData.length; i++) {
                            if (templateData[i].ID == $checked.eq(j).parents("tr").find(".template_del").attr("data-id")) {
                                templateData.splice(i, 1);
                                templateList(templateData);
                            }
                        }
                    }
                    $('.template_list thead input[type="checkbox"]').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 2000);
            })
        } else {
            layer.msg("请选择需要删除的模板");
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

    //是否共享
    form.on('switch(Share)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("共享状态修改成功！");
        }, 1000);
    })

    //操作
    $("body").on("click", ".template_edit", function () {  //编辑
        var _this = $(this);
        var Name;
        for (var i = 0; i < templateData.length; i++) {
            if (templateData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "编辑模板",
                    type: 2,
                    content: "edit_template.html",
                    area: ['50%', '50%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回模板列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".template_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此模板？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < templateData.length; i++) {
                if (templateData[i].ID == _this.attr("data-id")) {
                    templateData.splice(i, 1);
                    templateList(templateData);
                }
            }
            layer.close(index);
        });
    })

    function templateList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = templateData.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                        + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                        + '<td>' + currData[i].ID + '</td>'
                        + '<td>' + currData[i].Name + '</td>'
                        + '<td>' + currData[i].Label + '</td>'
                        + '<td>' + currData[i].Owner + '</td>'
                        + '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="Share"' + currData[i].Share + '></td>'
                        + '<td>' + currData[i].Last_modify + '</td>'
                        + '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini template_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini template_del" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a></li>'
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
            templateData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(templateData.length / nums),
            jump: function (obj) {
                $(".template_content").html(renderDate(templateData, obj.curr));
                $('.template_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})