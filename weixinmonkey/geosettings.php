<?php
require_once (dirname ( __FILE__ ) . '/kwr_backend.php');
function kwxrobot_geosetting() {
	$array_kweixinrobot_option = get_kweixinrobot_option ();
	
	?>
<script src="<?php echo KWR_URL; ?>/js/geosettings.js"></script>

<script type="text/javascript"
	src="http://api.map.baidu.com/api?v=2.0&ak=RQZeAMITnbQZYGy3t95VpPZV"></script>
<style type="text/css">
body,html,#allmap {
	width: 100%;
	height: 600px;
	overflow: hidden;
	margin: 0;
}
</style>



<div class="container">
	<div class="blog-header">
		<h1 class="blog-title">地理设置</h1>
		<p class="lead blog-description">当接收到用户的地理位置事件时，回复特定指令，此功能要求公众账号是服务号并通过认证</p>
	</div>
	<div class="row">
		<div class="col-xs-6">

			<form name="pageform" id="pageform" method="post" action="">

				<table id="editmenu" class="table  table-bordered">
					<tr>
						<td><label>所在城市：</label></td>
						<td><input type="text" name="kwr-geosettings-city" required
							value="<?php echo $array_kweixinrobot_option[KWR_GEOSETTINGS_CITY]; ?>" />
							<input type="button" class="btn btn-primary"
							onclick="gotocity();" value='前往'><span class="help-block">直接输入城市的中文名称，如果输入错误，地图可能出现空白</span></td>
					</tr>
					<tr>

						<td><label>中心点：</label></td>
						<td><input type="text" name="kwr-geosettings-center" readonly
							required
							value="<?php echo $array_kweixinrobot_option[KWR_GEOSETTINGS_CENTER]; ?>" />
							<span class="help-block"></span></td>

					</tr>
					<tr>

						<td><label>半径：</label></td>
						<td><input type="text" name="kwr-geosettings-radis"
							value="<?php echo $array_kweixinrobot_option[KWR_GEOSETTINGS_RADIS]; ?>"
							onchange="changeRadis()" required min="100" max="10000" step="1" />米
							<span class="help-block"></span></td>
					</tr>
					<tr>

						<td><label>处理信息：</label></td>
						<td><input type="text" name="kwr-geosettings-info" required
							value="<?php echo $array_kweixinrobot_option[KWR_GEOSETTINGS_INFO]; ?>" />
							<span class="help-block">进入范围相当于收到该信息，据此回复</span></td>

					</tr>
				</table>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-10">
						<input class="btn btn-primary" type="button" id='saveoption'
							onclick="updateoption();" value="保存设置" />
					</div>
				</div>
			</form>
		</div>




		<div class="col-xs-6">
			<div id="allmap"></div>
		</div>
	</div>


</div>



<?php
}