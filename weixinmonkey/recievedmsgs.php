<?php
require_once (dirname ( __FILE__ ) . '/kwr_backend.php');
function kweixinrobot_recievedmsgspage() {
	// $wxmsg = '<xml><ToUserName><![CDATA[gh_d28e827c7481]]></ToUserName>
	// <FromUserName><![CDATA[onMOcuA7E-O0reYdWD14ban200Qo]]></FromUserName>
	// <CreateTime>1391220745</CreateTime>
	// <MsgType><![CDATA[text]]></MsgType>
	// <Content><![CDATA[e]]></Content>
	// <MsgId>5975247601491769604</MsgId>
	// </xml>';
// 	$wxmsg = '<xml><ToUserName><![CDATA[gh_d28e827c7481]]></ToUserName>
// <FromUserName><![CDATA[onMOcuA7E-O0reYdWD14ban200Qo]]></FromUserName>
// <CreateTime>123456789</CreateTime>
// <MsgType><![CDATA[event]]></MsgType>
// <Event><![CDATA[subscribe]]></Event>
// <EventKey><![CDATA[qrscene_123]]></EventKey>
// <Ticket><![CDATA[TICKET]]></Ticket>
// </xml>';
	
// 	$kweixinrobot = new weixinCallback ();
// 	$kweixinrobot->debug = 1;
// 	$kweixinrobot->content = $wxmsg;
// 	$rtn = $kweixinrobot->responseMsg ();
// 	echo $rtn;
// 	die ();
	?>
<script src="<?php echo KWR_URL; ?>/js/recievedmsgs.js"></script>

<div class="container">

	<div id="notice"></div>

	<div class="blog-header">
	   <h1 class="blog-title">历史消息</h1>
        <p class="lead blog-description">接受的历史消息</p>   
	</div>
    <?php
	$array_kweixinrobot_option = get_kweixinrobot_option ();
	?>

	
	
	<div id="replydiag" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title">回复消息</h4>
				</div>
				<div class="modal-body">
					<textarea class="form-control" id='text-reply'></textarea>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					<button type="button" class="btn btn-primary" id='btn-savereply'>保存</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->

	<table class="table  table-bordered table-striped" id="example">
		<thead>
			<tr>
				<th width="10%">编号</th>
				<th width="25%">接收</th>
				<th width="25%">回复</th>
				<th width="8%">类型</th>
				<th width="12%">状态</th>
				<th width="10%">接收时间</th>
				<th width="10%">回复时间</th>

			</tr>
		</thead>
		<tbody>

		</tbody>

	</table>

</div>
<?php
}