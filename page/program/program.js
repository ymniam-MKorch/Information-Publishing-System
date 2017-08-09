layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var programData = '';
    $.get("../../json/programList.json", function (data) {
        var newArray = [];
        programData = data;
        if (window.sessionStorage.getItem("addprogram")) {
            var addprogram = window.sessionStorage.getItem("addprogram");
            programData = JSON.parse(addprogram).concat(programData);
        }
        //执行加载数据的方法
        programList();
    })

    //查询
    $(".search_btn").click(function () {
        var newArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "../../json/programList.json",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (window.sessionStorage.getItem("addprogram")) {
                            var addprogram = window.sessionStorage.getItem("addprogram");
                            programData = JSON.parse(addprogram).concat(data);
                        } else {
                            programData = data;
                        }
                        for (var i = 0; i < programData.length; i++) {
                            var programStr = programData[i];
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
                            //节目ID
                            if (programStr.ID.indexOf(selectStr) > -1) {
                                programStr["ID"] = changeStr(programStr.ID);
                            }
                            //节目名称
                            if (programStr.Name.indexOf(selectStr) > -1) {
                                programStr["Name"] = changeStr(programStr.Name);
                            }
                            //所有者
                            if (programStr.Author.indexOf(selectStr) > -1) {
                                programStr["Author"] = changeStr(programStr.Author);
                            }
                            //描述
                            if (programStr.Describe.indexOf(selectStr) > -1) {
                                programStr["Describe"] = changeStr(programStr.Describe);
                            }
                            //时间
                            if (programStr.Time.indexOf(selectStr) > -1) {
                                programStr["Time"] = changeStr(programStr.Time);
                            }
                            if (programStr.ID.indexOf(selectStr) > -1 || programStr.Name.indexOf(selectStr) > -1
                                || programStr.Author.indexOf(selectStr) > -1 || programStr.Describe.indexOf(selectStr) > -1
                                || programStr.Time.indexOf(selectStr) > -1) {
                                newArray.push(programStr);
                            }
                        }
                        programData = newArray;
                        programList(programData);
                    }
                })

                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //添加节目
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    $(window).one("resize", function () {
        $(".programAdd_btn").click(function () {
            var index = layui.layer.open({
                title: "添加节目",
                type: 2,
                content: "../terminal/addterminal.html",
                area: ['100%', '100%'],
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回节目列表', '.layui-layer-setwin .layui-layer-close', {
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
        var $checkbox = $('.program_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.program_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的节目？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < programData.length; i++) {
                            if (programData[i].ID == $checked.eq(j).parents("tr").find(".program_del").attr("data-id")) {
                                programData.splice(i, 1);
                                programList(programData);
                            }
                        }
                    }
                    $('.program_list thead input[type="checkbox"]').prop("checked", false);
                    form.render();
                    layer.close(index);
                    layer.msg("删除成功");
                }, 2000);
            })
        } else {
            layer.msg("请选择需要删除的节目");
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
    $("body").on("click", ".program_edit", function () {  //编辑
        var _this = $(this);
        var Name;
        for (var i = 0; i < programData.length; i++) {
            if (programData[i].ID == _this.attr("data-id")) {
                var index = layui.layer.open({
                    title: "编辑节目",
                    type: 2,
                    content: "edit_program.html",
                    area: ['50%', '50%'],
                    success: function (layero, index) {
                        setTimeout(function () {
                            layui.layer.tips('点击此处返回节目列表', '.layui-layer-setwin .layui-layer-close', {
                                tips: 3
                            });
                        }, 500)
                    }
                })
            }
        }
    })

    $("body").on("click", ".program_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此节目？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < programData.length; i++) {
                if (programData[i].ID == _this.attr("data-id")) {
                    programData.splice(i, 1);
                    programList(programData);
                }
            }
            layer.close(index);
        });
    })

    function programList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = programData.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {

                    dataHtml += '<tr>'
                        + '<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                        + '<td>' + currData[i].ID + '</td>'
                        + '<td>' + currData[i].Name + '</td>'
                        + '<td>' + currData[i].Describe + '</td>'
                        + '<td>' + currData[i].Author + '</td>';
                    if (currData[i].Status == "1") {
                        dataHtml += '<td><img src="../../images/yes.jpg" alt="是" width="25" height="20"> </td>';
                    } else {
                        dataHtml += '<td><img src="../../images/no.jpg" alt="否" width="25" height="20"> </td>';
                    }
                    dataHtml += '<td><input type="checkbox" name="Share" lay-skin="switch" lay-text="是|否" lay-filter="Share"' + currData[i].Share + '></td>'
                        + '<td>' + currData[i].Time + '</td>'
                        + '<td>'
                        + '<div class="btn-group-vertical">'
                        + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="background-color:#5FB878;width:80px;"><font color="FFFFFF">操作</font><span class="caret"></span>'
                        + '</button>'
                        + '<ul class="dropdown-menu">'
                        + '<li><a class="layui-btn layui-btn-mini program_edit" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="iconfont icon-edit"></i> 编辑</a></li>'
                        + '<li><a class="layui-btn layui-btn-mini program_del" style="background-color:#5FB878;height:25px;" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a></li>'
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
            programData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(programData.length / nums),
            jump: function (obj) {
                $(".program_content").html(renderDate(programData, obj.curr));
                $('.program_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})