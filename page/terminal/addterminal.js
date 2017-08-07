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
    var addterminalArray = [], addterminal;
    form.on("submit(addterminal)", function (data) {
        //是否添加过信息
        if (window.sessionStorage.getItem("addterminal")) {
            addterminalArray = JSON.parse(window.sessionStorage.getItem("addterminal"));
        }
        //显示、审核状态
        var Use = data.field.use == "on" ? "checked" : "";

        addterminal = '{"ID":"' + $(".terminalID").val() + '",';  //ID
        addterminal += '"Name":"' + $(".terminalName").val() + '",';  //名称
        addterminal += '"Hardware_Identification_Code":"' + $(".terminalHard").val() + '",';  //硬件识别码
        addterminal += '"Author":"' + $(".terminalAuthor option").eq($(".terminalAuthor").val()).text() + '",';//作者
        addterminal += '"Progress":"??%",'; //发送进度
        addterminal += '"Program":"' + $(".terminalProgram option").eq($(".terminalProgram").val()).text() + '",';//节目
        addterminal += '"Status":"0",'; //状态
        addterminal += '"IP":"' + $(".terminalIP").val() + '",'; //IP
        addterminal += '"Last_Login": "2017.7.20 20:20:20",'; //时间
        addterminal += '"Use":"' + Use + '"}';  //是否展示

        addterminalArray.unshift(JSON.parse(addterminal));
        window.sessionStorage.setItem("addterminal", JSON.stringify(addterminalArray));
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg("终端添加成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }, 1000);
        return false;
    })

})
