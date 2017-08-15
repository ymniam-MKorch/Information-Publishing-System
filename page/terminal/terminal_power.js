layui.config({
    base: "js/"
}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form(),
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        $ = layui.jquery;

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

    function timeList(that) {
        //渲染数据
        //分页
        var nums = 10; //每页出现的数据量
        if (that) {
            timeData = that;
        }
        laypage({
            cont: "page",
            pages: Math.ceil(timeData.length / nums),
            jump: function (obj) {
                $(".time_content").html(renderDate(timeData, obj.curr));
                $('.time_list thead input[type="checkbox"]').prop("checked", false);
                form.render();
            }
        })
    }

    //点击确认按钮
    form.on("submit(comfirm_time)", function (data) {

        //弹出loading
        var index = top.layer.msg('节目提交审核中，请稍候', { icon: 16, time: false, shade: 0.8 });
        setTimeout(function () {
            top.layer.close(index);
            top.layer.msg("提交成功！等待审核");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }, 2000);
        return false;
    })
})
