﻿layui.config({
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
                            //文章标题
                            if (terminalStr.terminalName.indexOf(selectStr) > -1) {
                                terminalStr["terminalName"] = changeStr(terminalStr.terminalName);
                            }
                            //发布人
                            if (terminalStr.terminalAuthor.indexOf(selectStr) > -1) {
                                terminalStr["terminalAuthor"] = changeStr(terminalStr.terminalAuthor);
                            }
                            //审核状态
                            if (terminalStr.terminalStatus.indexOf(selectStr) > -1) {
                                terminalStr["terminalStatus"] = changeStr(terminalStr.terminalStatus);
                            }
                            //浏览权限
                            if (terminalStr.terminalLook.indexOf(selectStr) > -1) {
                                terminalStr["terminalLook"] = changeStr(terminalStr.terminalLook);
                            }
                            //发布时间
                            if (terminalStr.terminalTime.indexOf(selectStr) > -1) {
                                terminalStr["terminalTime"] = changeStr(terminalStr.terminalTime);
                            }
                            if (terminalStr.terminalName.indexOf(selectStr) > -1 || terminalStr.terminalAuthor.indexOf(selectStr) > -1 || terminalStr.terminalStatus.indexOf(selectStr) > -1 || terminalStr.terminalLook.indexOf(selectStr) > -1 || terminalStr.terminalTime.indexOf(selectStr) > -1) {
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
                title: "添加文章",
                type: 2,
                content: "terminalAdd.html",
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
            layui.layer.full(index);
        })
    }).resize();

    //推荐文章
    $(".recommend").click(function () {
        var $checkbox = $(".terminal_list").find('tbody input[type="checkbox"]:not([name="show"])');
        if ($checkbox.is(":checked")) {
            var index = layer.msg('推荐中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                layer.close(index);
                layer.msg("推荐成功");
            }, 2000);
        } else {
            layer.msg("请选择需要推荐的文章");
        }
    })

    //审核文章
    $(".audit_btn").click(function () {
        var $checkbox = $('.terminal_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.terminal_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            var index = layer.msg('审核中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                for (var j = 0; j < $checked.length; j++) {
                    for (var i = 0; i < terminalData.length; i++) {
                        if (terminalData[i].terminalId == $checked.eq(j).parents("tr").find(".terminal_del").attr("data-id")) {
                            //修改列表中的文字
                            $checked.eq(j).parents("tr").find("td:eq(3)").text("审核通过").removeAttr("style");
                            //将选中状态删除
                            $checked.eq(j).parents("tr").find('input[type="checkbox"][name="checked"]').prop("checked", false);
                            form.render();
                        }
                    }
                }
                layer.close(index);
                layer.msg("审核成功");
            }, 2000);
        } else {
            layer.msg("请选择需要审核的文章");
        }
    })

    //批量删除
    $(".batchDel").click(function () {
        var $checkbox = $('.terminal_list tbody input[type="checkbox"][name="checked"]');
        var $checked = $('.terminal_list tbody input[type="checkbox"][name="checked"]:checked');
        if ($checkbox.is(":checked")) {
            layer.confirm('确定删除选中的信息？', { icon: 3, title: '提示信息' }, function (index) {
                var index = layer.msg('删除中，请稍候', { icon: 16, time: false, shade: 0.8 });
                setTimeout(function () {
                    //删除数据
                    for (var j = 0; j < $checked.length; j++) {
                        for (var i = 0; i < terminalData.length; i++) {
                            if (terminalData[i].terminalId == $checked.eq(j).parents("tr").find(".terminal_del").attr("data-id")) {
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
            layer.msg("请选择需要删除的文章");
        }
    })

    //全选
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    //通过判断文章是否全部选中来确定全选按钮是否选中
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

    //是否展示
    form.on('switch(isShow)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("展示状态修改成功！");
        }, 2000);
    })

    //操作
    $("body").on("click", ".terminal_edit", function () {  //编辑
        layer.alert('您点击了文章编辑按钮，由于是纯静态页面，所以暂时不存在编辑内容，后期会添加，敬请谅解。。。', { icon: 6, title: '文章编辑' });
    })

    $("body").on("click", ".terminal_collect", function () {  //收藏.
        if ($(this).text().indexOf("已收藏") > 0) {
            layer.msg("取消收藏成功！");
            $(this).html("<i class='layui-icon'>&#xe600;</i> 收藏");
        } else {
            layer.msg("收藏成功！");
            $(this).html("<i class='iconfont icon-star'></i> 已收藏");
        }
    })

    $("body").on("click", ".terminal_del", function () {  //删除
        var _this = $(this);
        layer.confirm('确定删除此信息？', { icon: 3, title: '提示信息' }, function (index) {
            //_this.parents("tr").remove();
            for (var i = 0; i < terminalData.length; i++) {
                if (terminalData[i].terminalId == _this.attr("data-id")) {
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
                        + '<td>' + currData[i].Hardware_Identification_Code + '</td>'
                        + '<td>' + currData[i].Author + '</td>'
                        + '<td>' + currData[i].Progress + '<img src="../../images/refresh.png" alt="刷新" width="35" height="22" align="right" onclick="this.innerHTML=\'谢谢!\'"></td>'
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
                        + '<a class="layui-btn layui-btn-mini terminal_edit"><i class="iconfont icon-edit"></i> 编辑</a>'
                        + '<a class="layui-btn layui-btn-normal layui-btn-mini terminal_collect"><i class="layui-icon">&#xe600;</i> 收藏</a>'
                        + '<a class="layui-btn layui-btn-danger layui-btn-mini terminal_del" data-id="' + data[i].ID + '"><i class="layui-icon">&#xe640;</i> 删除</a>'
                        + '</td>'
                        + '</tr>';
                }
            } else {
                dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
            }
            return dataHtml;
        }

        //分页
        var nums = 13; //每页出现的数据量
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

