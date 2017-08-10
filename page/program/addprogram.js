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
    var editIndex = layedit.build('program_content');
    var addprogramArray = [], addprogram;
    form.on("submit(addprogram)", function (data) {
        //是否添加过信息
        if (window.sessionStorage.getItem("addprogram")) {
            addprogramArray = JSON.parse(window.sessionStorage.getItem("addprogram"));
        }
        //显示、审核状态
        var Share = data.field.share == "on" ? "checked" : "",
            Status = data.field.status == "on" ? "1" : "0";

        //if (!alert(isPositiveNum($(".programID").val()))) {
        //    top.layer.msg("ID不对！");
        //}
        addprogram = '{"ID":"' + $(".programID").val() + '",';  //ID
        addprogram += '"Name":"' + $(".programName").val() + '",';  //名称
        addprogram += '"Describe":"' + $(".programDescribe").val() + '",';  //描述
        addprogram += '"Author":"' + $(".programAuthor option").eq($(".programAuthor").val()).text() + '",';//所有者
        addprogram += '"Status":"'+Status+'",'; //状态
        addprogram += '"Share":"' + Share + '",';  //是否共享
        addprogram += '"Time":"2017.07.25 13:25:36"}'; //时间

        addprogramArray.unshift(JSON.parse(addprogram));
        window.sessionStorage.setItem("addprogram", JSON.stringify(addprogramArray));
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg("节目添加成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }, 1000);
        return false;
    })

    })

function isPositiveInteger(s) {//是否为正整数
    var re = /^[0-9]+$/;
    return re.test(s)
} 