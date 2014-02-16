jQuery(document).ready(function() {

	initCustommenuTable();
	closecustommenu();
});

function refreshTable() {
	jQuery('#example').dataTable()._fnAjaxUpdate();

}


function initCustommenuTable() {
	jQuery('#example')
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
							if (aData.parent > 0) {
								jQuery('td:eq(1)', nRow).html(
										'&nbsp&nbsp&nbsp&nbsp|-------');

							} else {
								jQuery('td:eq(1)', nRow).html('----');

							}
							jQuery('td:eq(7)', nRow)
									.html(
											'<a href="javascript:void(0);" onclick="javascript:showcustommenu();fillcustommenu('
													+ aData.id
													+ ');return false;">编辑</a> | <a href="javascript:void(0);" onclick="javascript:delcustommenu('
													+ aData.id
													+ ');return false;">删除</a> ');

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
								"action" : "getcustommenu"
							});
						},
						"aoColumns" : [ {
							"mData" : "id",
							"bSearchable" : false,
							"bSortable" : false
						}, {
							"mData" : "parent",
							"bSearchable" : false,

							"bSortable" : false
						}, {
							"mData" : "name",
							"bSearchable" : false,

							"bSortable" : false
						}, {
							"mData" : "type",
							"bSearchable" : false,

							"bSortable" : false

						}, {
							"mData" : "value",
							"bSearchable" : false,

							"bSortable" : false
						}, {
							"mData" : "orderd",
							"bSearchable" : false,
							"bSortable" : false
						}, {
							"mData" : "create_date"
						}, {
							"mData" : "id"
						} ]
					});

	initcustomrootmenu();

}
function closecustommenu() {
	jQuery("#editmenu").hide();
}
function fillcustommenu(id) {
	getcustommenubyid(id);
	// alert("fill :" + id);

}
function showcustommenu() {
	jQuery("#editmenu").show();
}

function delcustommenu(id) {
	dialog("提示", "确认要删除自定义菜单吗？", function() {
		jQuery.ajax({
			cache : true,
			type : "POST",
			url : 'admin-ajax.php',
			data : "delid=" + id + "&action=delcustommenu",
			async : false,
			error : function(request) {
				alertNotice('操作失败');

			},
			success : function(data) {
				alertNotice(data);
				refreshTable();
			}
		});

		return;
	}).modal('show');

}

function savecustommenu() {
	jQuery("#pageform").validate();
	checked = jQuery("#pageform").valid();
	if (!checked) {
		return;
	}
	kwrbackendcommunicate('savecustommenu', function(data) {
		alertNotice(data);
		refreshTable();
		closereplyedit();
	});
}

function getcustommenubyid(id) {
	kwrbackendcommunicate('getcustommenubyid', function(data) {
		var jsondata = JSON.parse(data);
		jQuery("input[name='kwrq-custommenu-name']").val(jsondata.name);

		jQuery("select[name='kwrq-custommenu-type']").val(jsondata.type);
		jQuery("input[name='kwrq-custommenu-id']").val(jsondata.id);

		jQuery("input[name='kwrq-custommenu-orderd']").val(jsondata.orderd);
		jQuery("textarea[name='kwrq-custommenu-value']").val(jsondata.value);
		jQuery('#kwrq-custommenu-parent').attr('value', jsondata.parent);

	}, "id=" + id);
}

function initcustomrootmenu() {

	kwrbackendcommunicate('getcustomrootmenu', function(data) {
		var jsondata = JSON.parse(data);
		jQuery('#kwrq-custommenu-parent option').each(function() {
			if (jQuery(this).val() != '0') {
				jQuery(this).remove();
			}
		});

		for (i = 0; i < jsondata.length; i++) {
			if (jsondata[i].type == "root") {

				jQuery("#kwrq-custommenu-parent").append(
						"<option value='" + jsondata[i].id + "'>"
								+ jsondata[i].name + "</option>");

			}

		}
	});
}
function uploadcustommenu() {
	kwrbackendcommunicate('uploadcustommenu', function(data) {
		alertNotice(data);

	});
}