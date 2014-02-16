jQuery(document).ready(
		function() {

			jQuery('#example').dataTable(
					{
						"bProcessing" : true,
						"bServerSide" : true,
						"sAjaxSource" : "admin-ajax.php",
						"sServerMethod" : "POST",
						"bPaginate" : true, // 翻页功能
						"bInfo" : true, // 翻页功能
						"fnRowCallback" : function(nRow, aData, iDisplayIndex,
								iDisplayIndexFull) {
								jQuery('td:eq(4)', nRow).html(aData.status + " | " +
										'<a href="javascript:void(0);" onclick="javascript:showreply();reply('
												+ aData.id
												+ ');return false;">回复</a> ');
							
							

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
								"action" : "getrecievedmsgs"
							});
						},
						"aoColumns" : [ {
							"mData" : "id",
							"bSortable" : false
						}, {
							"mData" : "msg",
							"bSortable" : false

						}, {
							"mData" : "reply",
							"bSortable" : false

						}, {
							"mData" : "type",
							"bSortable" : false
						}, {
							"mData" : "status",
							"bSortable" : false
						}, {
							"mData" : "create_date"
						}, {
							"mData" : "replydate"
						} ]
					});

		});
function showreply() {
	jQuery('#replydiag').modal('show')
}
function hidereply() {
	jQuery('#replydiag').modal('hide')
}
function refreshTable() {
	jQuery('#example').dataTable()._fnAjaxUpdate();

}
function reply(id) {
	
	jQuery("#btn-savereply").bind("click", function() {
		jQuery(this).attr('disabled',"true");
		var text = jQuery("#text-reply").val();
		kwrbackendcommunicate('replytouser', function(data) {
			hidereply();

			alertNotice(data);
			refreshTable();
		}, 'msg=' + text + '&' + 'id=' + id);

	});

}