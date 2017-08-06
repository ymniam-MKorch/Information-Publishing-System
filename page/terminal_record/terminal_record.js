layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var terminal_record = '';
    $.get("../../json/terminal_record.json", function (data) {
        var newArray = [];
        terminal_record = data;
        if (window.sessionStorage.getItem("terminalrecord")) {
            var terminalrecord = window.sessionStorage.getItem("terminalrecord");
            terminal_record = JSON.parse(terminalrecord).concat(terminal_record);
        }
        //执行加载数据的方法
        recordList();
    })

    //查询
    $(".search_btn").click(function () {
        var newArray = [];
        if ($(".search_input").val() != '') {
            var index = layer.msg('查询中，请稍候', { icon: 16, time: false, shade: 0.8 });
            setTimeout(function () {
                $.ajax({
                    url: "../../json/terminal_record.json",
                    type: "get",
                    dataType: "json",
                    success: function (data) {
                        if (window.sessionStorage.getItem("terminalrecord")) {
                            var terminalrecord = window.sessionStorage.getItem("terminalrecord");
                            terminal_record = JSON.parse(terminalrecord).concat(data);
                        } else {
                            terminal_record = data;
                        }
                        for (var i = 0; i < terminal_record.length; i++) {
                            var terminalStr = terminal_record[i];
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
                            //编号
                            if (terminalStr.NO.indexOf(selectStr) > -1) {
                                terminalStr["NO"] = changeStr(terminalStr.NO);
                            }
                            //终端名称
                            if (terminalStr.Terminal.indexOf(selectStr) > -1) {
                                terminalStr["Terminal"] = changeStr(terminalStr.Terminal);
                            }
                            //群组名称
                            if (terminalStr.Group.indexOf(selectStr) > -1) {
                                terminalStr["Group"] = changeStr(terminalStr.Group);
                            }
                            //操作
                            if (terminalStr.Operation.indexOf(selectStr) > -1) {
                                terminalStr["Operation"] = changeStr(terminalStr.Operation);
                            }
                            //操作人
                            if (terminalStr.Author.indexOf(selectStr) > -1) {
                                terminalStr["Author"] = changeStr(terminalStr.Author);
                            }
                            //时间
                            if (terminalStr.Time.indexOf(selectStr) > -1) {
                                terminalStr["Time"] = changeStr(terminalStr.Time);
                            }
                            if (terminalStr.NO.indexOf(selectStr) > -1 || terminalStr.Terminal.indexOf(selectStr) > -1
                                || terminalStr.Group.indexOf(selectStr) > -1 || terminalStr.Operation.indexOf(selectStr) > -1
                                || terminalStr.Author.indexOf(selectStr) > -1 || terminalStr.Time.indexOf(selectStr) > -1) {
                                newArray.push(terminalStr);
                            }
                        }
                        terminal_record = newArray;
                        recordList(terminal_record);
                    }
                })

                layer.close(index);
            }, 2000);
        } else {
            layer.msg("请输入需要查询的内容");
        }
    })

    //操作

    function recordList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = terminal_record.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                        + '<td>' + currData[i].NO + '</td>'
                        + '<td>' + currData[i].Terminal + '</td>'
                        + '<td>' + currData[i].Group + '</td>'
                        + '<td>' + currData[i].Operation + '</td>'
                        + '<td>' + currData[i].Author + '</td>'
                        + '<td>' + currData[i].Time + '</td>'
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
            terminal_record = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(terminal_record.length / nums),
            jump: function (obj) {
                $(".terminal_content").html(renderDate(terminal_record, obj.curr));
                $('.terminal_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }
})