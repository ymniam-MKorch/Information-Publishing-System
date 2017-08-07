layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'layedit', 'laydate'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;

    //创建一个编辑器
    var editIndex = layedit.build('terminal_content');
    var edit_terminalArray = [], edit_terminal;
    form.on("submit(edit_terminal)", function (data) {
        //是否添加过信息
        if (window.sessionStorage.getItem("edit_terminal")) {
            edit_terminalArray = JSON.parse(window.sessionStorage.getItem("edit_terminal"));
        }
        //显示、审核状态
        var Use = data.field.use == "on" ? "checked" : "",

        edit_terminal = '{"ID":"' + $(".terminalID").val() + '",';  //ID
        edit_terminal += '"Name":"' + $(".terminalName").val() + '",';  //名称
        edit_terminal += '"Hardware_Identification_Code":"' + $(".terminalHard").val() + '",';  //硬件识别码
        edit_terminal += '"Author":"' + $(".terminalAuthor option").eq($(".terminalAuthor").val()).text() + '",';//作者
        edit_terminal += '"Progress":"??%",'; //发送进度
        edit_terminal += '"Program":"' + $(".terminalProgram option").eq($(".terminalProgram").val()).text() + '",';//节目
        edit_terminal += '"Status":"0",'; //状态
        edit_terminal += '"IP":"' + $(".terminalIP").val() + '",'; //IP
        edit_terminal += '"Last_Login": "2017.7.20 20:20:20",'; //时间
        edit_terminal += '"Use":"' + Use + '"}';  //是否展示

        //edit_terminalArray.unshift(JSON.parse(edit_terminal));
        //window.sessionStorage.setItem("edit_terminal", JSON.stringify(edit_terminalArray));
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg("终端修改成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }, 2000);
        return false;
    })

})
