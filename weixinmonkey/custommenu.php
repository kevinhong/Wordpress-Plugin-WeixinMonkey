<?php
require_once (dirname ( __FILE__ ) . '/kwr_backend.php');
function kweixinrobot_custommenupage() {
	// $wxmsg = '<xml><ToUserName><![CDATA[gh_d28e827c7481]]></ToUserName>
	// <FromUserName><![CDATA[onMOcuA7E-O0reYdWD14ban200Qo]]></FromUserName>
	// <CreateTime>1391220745</CreateTime>
	// <MsgType><![CDATA[text]]></MsgType>
	// <Content><![CDATA[e]]></Content>
	// <MsgId>5975247601491769604</MsgId>
	// </xml>';
	// $kweixinrobot = new weixinCallback ();
	// $kweixinrobot->debug = 1;
	// $kweixinrobot->content = $wxmsg;
	// $rtn = $kweixinrobot->responseMsg ();
	// echo $rtn;
	// die ();
	?>
<script src="<?php echo KWR_URL; ?>/js/custommenu.js"></script>

<div class="container">

	<div id="notice"></div>
	<div class="modal fade" id="modalDialog">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="modalDiaglogTitle">提示</h4>
				</div>
				<div class="modal-body" id="modalDialogMsg">确认吗？</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						id="sureBtn">确定</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	<div class="blog-header">
	   <h1 class="blog-title">自定义菜单</h1>
        <p class="lead blog-description">您可以在这里设置微信公众号的自定义菜单，此功能要求公众账号是服务号并通过认证</p>   
	</div>
    <?php
	$array_kweixinrobot_option = get_kweixinrobot_option ();
	?>


	<table class="table  table-bordered table-striped" id="example">
		<thead>
			<tr>
				<th width="10%">编号</th>
				<th width="10%">从属</th>
				<th width="20%">名称</th>

				<th width="20%">类型</th>
				<th width="20%">值</th>
				<th width="5%">排序</th>
				<th width="10%">编辑时间</th>
				<th width="5%">操作</th>

			</tr>
		</thead>
		<tbody>

		</tbody>

	</table>
	<form name="pageform" id="pageform" method="post" action="">

		<button type="button" class="btn btn-info"
			onclick="uploadcustommenu();">同步到微信服务器</button>

		<button type="button" class="btn btn-danger"
			onclick="showcustommenu();">新增自定义消息</button>
		<input type="text" name="kwrq-custommenu-id" value='0' hidden=true />
		<table id="editmenu" class="table  table-bordered">
			<tr>
				<td><label>名称：</label></td>
				<td><input type="text" name="kwrq-custommenu-name" required /> <span
					class="help-block">菜单的名称将显示在菜单按钮上</span></td>
			</tr>
			<tr>

				<td><label>从属：</label></td>
				<td><select name="kwrq-custommenu-parent"
					id='kwrq-custommenu-parent'>
						<option value='0'>根菜单</option>
				</select> <span class="help-block">菜单的从属关系，微信目前只支持一级菜单</span></td>

			</tr>
			<tr>

				<td><label>操作类型：</label></td>
				<td><select name="kwrq-custommenu-type">
						<option value='root'>根菜单</option>
						<option value='click'>消息查询</option>
						<option value='view'>远程页面</option>

				</select></td>
			</tr>

			<tr>
				<td><label>值：</label></td>
				<td class="left"><textarea name="kwrq-custommenu-value" required></textarea>
					<span class="help-block">click类型为点击后的触发的指令，view类型为外部url地址</span></td>
			</tr>
			<tr>
				<td><label>排序：</label></td>
				<td><input type="text" name="kwrq-custommenu-orderd" required /> <span
					class="help-block">菜单所在的顺序</span></td>
			</tr>
			<tr>
				<td colspan="2"><input type="button" class="btn btn-primary"
					onclick="savecustommenu();" value='保存自定义菜单'> <input type="button"
					type="button" id="cancelreply" onclick="closecustommenu();"
					class="btn btn-normal" value='取消' /></td>
			</tr>
		</table>
	</form>
</div>
<?php
}