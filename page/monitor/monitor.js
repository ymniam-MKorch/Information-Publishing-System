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
                            if (terminalStr.ID.indexOf(selectStr) > -1 || terminalStr.Name.indexOf(selectStr) > -1) {
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
                        + '<td></td>'
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