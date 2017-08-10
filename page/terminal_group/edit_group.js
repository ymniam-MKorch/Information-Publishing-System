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
    var editIndex = layedit.build('group_content');
    var addgroupArray = [], addgroup;
    form.on("submit(addgroup)", function (data) {
        //是否添加过信息
        if (window.sessionStorage.getItem("addgroup")) {
            addgroupArray = JSON.parse(window.sessionStorage.getItem("addgroup"));
        }
        //显示、审核状态
        var Use = data.field.use == "on" ? "checked" : "";

        addgroup = '{"ID":"' + $(".groupID").val() + '",';  //ID
        addgroup += '"Name":"' + $(".groupName").val() + '",';  //名称
        addgroup += '"Hardware_Identification_Code":"' + $(".groupHard").val() + '",';  //硬件识别码
        addgroup += '"Author":"' + $(".groupAuthor").val() + '",'; //文章作者
        addgroup += '"Progress":"??%",'; //发送进度
        addgroup += '"Program":"' + $(".groupProgram").val() + '",'; //节目
        addgroup += '"Status":"0",'; //状态
        addgroup += '"IP":"' + $(".groupIP").val() + '",'; //IP
        addgroup += '"Last_Login": "2017.7.20",'; //时间
        addgroup += '"Use":"' + Use + '"}';  //是否展示

        addgroupArray.unshift(JSON.parse(addgroup));
        window.sessionStorage.setItem("addgroup", JSON.stringify(addgroupArray));
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
