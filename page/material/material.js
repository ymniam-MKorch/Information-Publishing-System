layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var materialData = '';
    $.get("../../json/material.json", function (data) {
        var newArray = [];
        materialData = data;
        if (window.sessionStorage.getItem("addmaterial")) {
            var addmaterial = window.sessionStorage.getItem("addmaterial");
            materialData = JSON.parse(addmaterial).concat(materialData);
        }
        //执行加载数据的方法
        materialList();
    })

    //查询
    $(".search_btn").click(function () {
        var newArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "../../json/material.json",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (window.sessionStorage.getItem("addmaterial")) {
                            var addmaterial = window.sessionStorage.getItem("addmaterial");
                            materialData = JSON.parse(addmaterial).concat(data);
                        } else {
                            materialData = data;
                        }
                        for (var i = 0; i < materialData.length; i++) {
                            var materialStr = materialData[i];
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
                            //素材ID
                            if (materialStr.ID.indexOf(selectStr) > -1) {
                                materialStr["ID"] = changeStr(materialStr.ID);
                            }
                            //素材名称
                            if (materialStr.Name.indexOf(selectStr) > -1) {
                                materialStr["Name"] = changeStr(materialStr.Name);
                            }
                            //所有者
                            if (materialStr.Owner.indexOf(selectStr) > -1) {
                                materialStr["Owner"] = changeStr(materialStr.Owner);
                            }
                            //类型
                            if (materialStr.Type.indexOf(selectStr) > -1) {
                                materialStr["Type"] = changeStr(materialStr.Type);
                            }
                            //原名
                            if (materialStr.Old.indexOf(selectStr) > -1) {
                                materialStr["Old"] = changeStr(materialStr.Old);
                            }
                            //时间
                            if (materialStr.Time.indexOf(selectStr) > -1) {
                                materialStr["Time"] = changeStr(materialStr.Time);
                            }
                            if (materialStr.ID.indexOf(selectStr) > -1 || materialStr.Name.indexOf(selectStr) > -1
                                || materialStr.Owner.indexOf(selectStr) > -1 || materialStr.Type.indexOf(selectStr) > -1
                                || materialStr.Old.indexOf(selectStr) > -1 || materialStr.Time.indexOf(selectStr) > -1) {
                                newArray.push(materialStr);
                            }
                        }
                        materialData = newArray;
                        materialList(materialData);
                    }
                })

                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加素材
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).one("resize", function () {
        $(".materialAdd_btn").click(function () {
            var index = layui.layer.open({
                title: "添加素材",
                type: 2,
                content: "addmaterial.html",
                area: ['100%', '100%'],
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回素材列表', '.layui-layer-setwin .layui-layer-close', {
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
        var $checkbox = $('.material_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.material_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的素材？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < materialData.length; i++) {
                            if (materialData[i].ID == $checked.eq(j).parents("tr").find(".material_del").attr("data-id")) {
                                materialData.splice(i, 1);
                                materialList(materialData);
                            }
                        }
                    }
                    $('.material_list thead input[type="checkbox"]').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 2000);
            })
        } else {
            layer.msg("请选择需要删除的素材");
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
    form.on('switch(Share)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("使用状态修改成功！");
        }, 1000);
    })

    //操作
    $("body").on("click", ".material_edit", function () {  //编辑
        var _this = $(this);
        var Name;
        for (var i = 0; i < materialData.length; i++) {
            if (materialData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "编辑素材",
                    type: 2,
                    content: "edit_material.html",
                    area: ['50%', '50%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回素材列表', '.layui-layer-setwin .layui-layer-close', {
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
        for (var i = 0; i < materialData.length; i++) {
            if (materialData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "发送节目",
                    type: 2,
                    content: "../program/send_program.html",
                    area: ['50%', '360px'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回素材列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".material_look", function () {  //查看
        var _this = $(this);
        var Name;
        for (var i = 0; i < materialData.length; i++) {
            if (materialData[i].ID == _this.attr("data-id") && materialData[i].Type == "图片") {
                var index = layui.layer.open({
                    title: "查看",
                    type: 2,
                    content: [materialData[i].Path, 'no'],
                    area:[auto,auto],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回素材列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
            else if (materialData[i].ID == _this.attr("data-id") && materialData[i].Type == "视频") {
                var index = layui.layer.open({
                    title: "查看",
                    type: 1,
                    content: "<video src=\" " + materialData[i].Path + " \" type=\"video/mp4\" width=\"640\" height=\"480\" controls=\"controls\" autoplay=\"autoplay\" preload=\"auto\">",
                    area: ['auto', 'auto'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回素材列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 300)
                    }
                })
            }
        }
    })

    $("body").on("click", ".material_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此素材？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < materialData.length; i++) {
                if (materialData[i].ID == _this.attr("data-id")) {
                    materialData.splice(i, 1);
                    materialList(materialData);
                }
            }
            layer.close(index);
        });
    })

    function materialList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = materialData.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                        + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                        + '<td>' + currData[i].ID + '</td>'
                        + '<td>' + currData[i].Name + '</td>'
                        + '<td>' + currData[i].Type + '</td>'
                        + '<td>' + currData[i].Duration + '</td>'
                        + '<td>' + currData[i].Size + '</td>'
                        + '<td>' + currData[i].Owner + '</td>'
                        + '<td>' + currData[i].Old + '</td>'
                        + '<td>' + currData[i].Time + '</td>';
                    dataHtml +=  '<td><input type="checkbox" name="show" lay-skin="switch" lay-text="任何|管理" lay-filter="Share"' + currData[i].Share + '></td>'
                        + '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini material_look" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-look"></i> 查看</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini material_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini material_del" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a></li>'
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
            materialData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(materialData.length / nums),
            jump: function (obj) {
                $(".material_content").html(renderDate(materialData, obj.curr));
                $('.material_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})

