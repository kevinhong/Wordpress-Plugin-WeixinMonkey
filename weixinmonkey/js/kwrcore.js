function kwrbackendcommunicate(action, fnCallback ,params) {
	var d ;
	if(params==null){
		d = jQuery('form').serialize() + "&action=" + action;
	}else{
		d = params + "&action=" + action;
	}
	jQuery.ajax({
		cache : true,
		type : "POST",
		url : 'admin-ajax.php',
		data : d,
		async : false,
		error : function(request) {
			alertNotice('操作失败');

		},
		success : function(data) {
			fnCallback(data);

		}
	});
	return false;
}

jQuery.extend(jQuery.validator.messages, {
	required : "必选字段",
	remote : "请修正该字段",
	email : "请输入正确格式的电子邮件",
	url : "请输入合法的网址",
	date : "请输入合法的日期",
	dateISO : "请输入合法的日期 (ISO).",
	number : "请输入合法的数字",
	digits : "只能输入整数",
	creditcard : "请输入合法的信用卡号",
	equalTo : "请再次输入相同的值",
	accept : "请输入拥有合法后缀名的字符串",
	maxlength : jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
	minlength : jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
	rangelength : jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
	range : jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
	max : jQuery.validator.format("请输入一个最大为{0} 的值"),
	min : jQuery.validator.format("请输入一个最小为{0} 的值")
});

function alertNotice(msg) {
	var tag = 'information';
	if(msg.indexOf("成功")>0){
		tag = 'success';
	}else if(msg.indexOf("失败")>0){
		tag = 'error';
	}
	generateNoty(msg,tag);
}
function dialog(title, content, callback) {
	jQuery("#modalDiaglogTitle").text(title);
	jQuery("#modalDialogMsg").html(content);
	jQuery("#sureBtn").unbind('click');
	jQuery("#sureBtn").bind('click', callback);
	return jQuery('#modalDialog');
}

function generateNoty(msg,type) {
	var myDate = new Date();
	var datastr = myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString();

	msg =datastr +  ":" + msg;
	var n = noty({
		text : msg,
		type : type,
		killer: true,
		dismissQueue : true,
		layout : 'topRight',
		timeout : false,
		maxVisible : 3,
		theme : 'defaultTheme'
	});
	console.log('html: ' + n.options.id);
}
