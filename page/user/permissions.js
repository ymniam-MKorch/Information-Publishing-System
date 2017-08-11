layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

    //加载页面数据
    var permissionsData = '';
    $.get("../../json/permissions.json", function (data) {
        var newArray = [];
        permissionsData = data;
        if (window.sessionStorage.getItem("addpermissions")) {
            var addpermissions = window.sessionStorage.getItem("addpermissions");
            permissionsData = JSON.parse(addpermissions).concat(permissionsData);
        }
        //执行加载数据的方法
        permissionsList();
    })




    //审核权
    form.on('switch(Examine)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //添加权
    form.on('switch(Add)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //修改权
    form.on('switch(Edit)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //删除权
    form.on('switch(Delete)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //监控权
    form.on('switch(Monitor)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //修改权限权
    form.on('switch(Permision)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //发送节目权
    form.on('switch(Send)', function (data) {
        var index = layer.msg('修改中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            layer.close(index);
            layer.msg("权限修改成功！");
        }, 1000);
    })

    //操作

    function permissionsList(that) {
        //渲染数据
        function renderDate(data, curr) {
            var dataHtml = '';
            if (!that) {
                currData = permissionsData.concat().splice(curr * nums - nums, nums);
            } else {
                currData = that.concat().splice(curr * nums - nums, nums);
            }
            if (currData.length != 0) {
                for (var i = 0; i < currData.length; i++) {
                    dataHtml += '<tr>'
                        + '<td>' + currData[i].Level + '</td>'
                        + '<td><input type="checkbox" name="Send" lay-skin="switch" lay-text="是|否" lay-filter="Send"' + currData[i].Send + '></td>'
                        + '<td><input type="checkbox" name="Examine" lay-skin="switch" lay-text="是|否" lay-filter="Examine"' + currData[i].Examine + '></td>'
                        + '<td><input type="checkbox" name="Add" lay-skin="switch" lay-text="是|否" lay-filter="Add"' + currData[i].Add + '></td>'
                        + '<td><input type="checkbox" name="Edit" lay-skin="switch" lay-text="是|否" lay-filter="Edit"' + currData[i].Edit + '></td>'
                        + '<td><input type="checkbox" name="Delete" lay-skin="switch" lay-text="是|否" lay-filter="Delete"' + currData[i].Delete + '></td>'
                        + '<td><input type="checkbox" name="Monitor" lay-skin="switch" lay-text="是|否" lay-filter="Monitor"' + currData[i].Monitor + '></td>'
                        + '<td><input type="checkbox" name="Permision" lay-skin="switch" lay-text="是|否" lay-filter="Permision"' + currData[i].Permision + '></td>'
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
            permissionsData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(permissionsData.length / nums),
            jump: function (obj) {
                $(".permissions_content").html(renderDate(permissionsData, obj.curr));
                form.render();
            }
        })
    }
})
