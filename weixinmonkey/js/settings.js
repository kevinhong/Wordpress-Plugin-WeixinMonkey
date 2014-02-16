jQuery(function(jQuery) {
	jQuery('a[data-toggle="tab"]:eq(0)').on('shown.bs.tab', function(e) {
		jQuery("#saveoption").show();

	});

	jQuery('a[data-toggle="tab"]:eq(1)').on('shown.bs.tab', function(e) {
		jQuery("#saveoption").show();

	});
	jQuery('a[data-toggle="tab"]:eq(2)').on('shown.bs.tab', function(e) {
		jQuery("#saveoption").show();

	});
	jQuery('a[data-toggle="tab"]:eq(3)').on('shown.bs.tab', function(e) {
		jQuery("#saveoption").show();

	});
	jQuery('a[data-toggle="tab"]:eq(4)').on('shown.bs.tab', function(e) {
		jQuery("#saveoption").hide();

	});
	jQuery('a[data-toggle="tab"]:eq(5)').on('shown.bs.tab', function(e) {
		jQuery("#saveoption").hide();

	});
	initCustomreplyTable();
	closereplyedit();
});

function closereplyedit() {
	jQuery("#editreply").hide();
}
function fillcustomreply(id, qword, reply, isvalid) {
	// isvalid = isvalid == '启用' ? 1 : 0;
	//
	// jQuery("select[name='kwrq-isvalid']").val(isvalid);
	//
	// jQuery("select[name='kwrq-isvalid']").val(isvalid);
	// jQuery("input[name='kwrq-id']").val(id);
	// jQuery("input[name='kwrq-qword']").val(qword);
	// jQuery("textarea[name='kwrq-reply']").val(reply);

	kwrbackendcommunicate('getcustomreplybyid', function(data) {
		var jsondata = JSON.parse(data);
		jQuery("select[name='kwrq-isvalid']").val(jsondata.isvalid);
		jQuery("select[name='kwrq-isqrvalid']").val(jsondata.isqrvalid);
		jQuery("input[name='kwrq-id']").val(jsondata.id);
		jQuery("input[name='kwrq-qword']").val(jsondata.qword);
		jQuery("textarea[name='kwrq-reply']").val(jsondata.reply);
	}, "id=" + id);

}
function showreplyedit() {
	jQuery("#editreply").show();
}
function refreshTable() {
	jQuery('#cstrply_tbl').dataTable()._fnAjaxUpdate();

}
function initCustomreplyTable() {

	jQuery('#cstrply_tbl')
			.dataTable(
					{
						"bProcessing" : true,
						"bServerSide" : true,
						"sAjaxSource" : "admin-ajax.php",
						"sServerMethod" : "POST",
						"bPaginate" : true, // 翻页功能
						"bInfo" : true, // 翻页功能
						"fnRowCallback" : function(nRow, aData, iDisplayIndex,
								iDisplayIndexFull) {

							var erlink = '';
							if (aData.qrticket.length > 0) {
								
								erlink =  ' | <a target=_balnk href="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='
										+ aData.qrticket + '">查看二维码</a>'
							}
							jQuery('td:eq(5)', nRow)
									.html(
											'<a href="javascript:void(0);" onclick="javascript:showreplyedit();fillcustomreply('
													+ aData.id
													+ ',\''
													+ aData.qword
													+ '\',\''
													+ aData.reply.replace(
															/\"/g, '\\\"')
															.replace(/\'/g,
																	"\\\'")
													+ '\',\''
													+ aData.isvalid
													+ '\');return false;">编辑</a> | <a href="javascript:void(0);" onclick="javascript:delcustomreply('
													+ aData.id
													+ ');return false;">删除</a> '
													+ erlink);

						},
						"oLanguage" : {
							"sLengthMenu" : "每页显示 _MENU_ 条记录",
							"sZeroRecords" : "抱歉， 没有找到",
							"sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
							"sInfoEmpty" : "没有数据",
							"sInfoFiltered" : "(从 _MAX_ 条数据中检索)",
							"sZeroRecords" : "没有检索到数据",
							"sSearch" : "名称:",

							"oPaginate" : {
								"sFirst" : "首页",
								"sPrevious" : "前一页",
								"sNext" : "后一页",
								"sLast" : "尾页"
							}

						},
						"fnServerParams" : function(aoData) {
							aoData.push({
								"action" : "getcustomreplies"
							});
						},
						"aoColumns" : [ {
							"mData" : "qword",
							"bSortable" : false
						}, {
							"mData" : "reply",
							"bSortable" : false

						}, {
							"mData" : "type",
							"bSortable" : false

						}, {
							"mData" : "isvalid",
							"bSortable" : false

						}, {
							"mData" : "update_date"
						}, {
							"mData" : "id"
						} ]
					});
}

function delcustomreply(id) {
	dialog("提示", "确认要删除自定义回复吗？", function() {
		jQuery.ajax({
			cache : true,
			type : "POST",
			url : 'admin-ajax.php',
			data : "delid=" + id + "&action=deletecustomreply",
			async : false,
			error : function(request) {
				alertNotice('操作失败');

			},
			success : function(data) {
				alertNotice("删除自定义回复成功");
				refreshTable();
			}
		});

		return;
	}).modal('show');
}

function editcustomreply(id) {
	alert('edit:' + id);
}

function savecustomreply() {
	jQuery("#pageform").validate();
	checked = jQuery("#pageform").valid();
	if (!checked) {
		return;
	}
	kwrbackendcommunicate('updatecustomreply', function(data) {
		alertNotice(data);
		refreshTable();
		closereplyedit();
	});
}

function updateoption() {
	jQuery("#pageform").validate();
	checked = jQuery("#pageform").valid();
	if (!checked) {
		return;
	}

	kwrbackendcommunicate('updateoption', function(data) {
		alertNotice(data);
	});
}