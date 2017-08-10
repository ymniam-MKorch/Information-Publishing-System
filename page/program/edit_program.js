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
    var edit_programArray = [], edit_program;
    form.on("submit(edit_program)", function (data) {
        //是否添加过信息
        if (window.sessionStorage.getItem("edit_program")) {
            edit_programArray = JSON.parse(window.sessionStorage.getItem("edit_program"));
        }
        //显示、审核状态
        var share = data.field.share == "on" ? "checked" : "",

        edit_program = '{"ID":"' + $(".programID").val() + '",';  //ID
        edit_program += '"Name":"' + $(".programName").val() + '",';  //名称
        edit_program += '"Describe":"' + $(".programDescribe").val() + '",';  //描述
        edit_program += '"Author":"' + $(".programAuthor option").eq($(".programAuthor").val()).text() + '",';//所有者
        edit_program += '"Status":"1",'; //状态
        edit_program += '"Last_Login": "2017.7.28 20:20:20",'; //时间
        edit_program += '"share":"' + share + '"}';  //是否展示

        //edit_programArray.unshift(JSON.parse(edit_program));
        //window.sessionStorage.setItem("edit_program", JSON.stringify(edit_programArray));
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg("节目修改成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }, 2000);
        return false;
    })

})
