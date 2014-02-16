<?php
require_once (dirname ( __FILE__ ) . '/kwr_backend.php');
function kweixinrobot_optionpage() {
	$array_kweixinrobot_option = get_kweixinrobot_option ();
	
	?>
<script src="<?php echo KWR_URL; ?>/js/settings.js"></script>

<div id="notice"></div>


<div class="container">
<div class="blog-header">
	   <h1 class="blog-title">基本设置</h1>
        <p class="lead blog-description">基本设置与自定义回复</p>   
	</div>
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


	<form name="pageform" id="pageform" method="post" action="">
		<div class="tabbable">
			<ul class="nav nav-tabs">
				<li class="active"><a href="#tabs-1" data-toggle="tab">基本设置</a></li>
				<li><a href="#tabs-11" data-toggle="tab">订阅号设置</a></li>

				<li><a href="#tabs-2" data-toggle="tab">默认回复</a></li>
				<li><a href="#tabs-3" data-toggle="tab">高级回复</a></li>
				<li><a href="#tabs-4" data-toggle="tab">自定义回复</a></li>
				<li><a href="#tabs-5" data-toggle="tab">回复语法说明</a></li>

			</ul>
			<div class="tab-content">

				<div class="tab-pane active" id="tabs-1">

					<table class="table  table-bordered table-striped">
						<tr>
							<td class="right"><label>微信TOKEN：</label></td>
							<td class="left"><input type="text" name="kwr-token"
								value="<?php echo $array_kweixinrobot_option[KWR_TOKEN]; ?>" />
								<span class="help-block">填写用于微信接口的TOKEN，与微信后台设置一致</span></td>
						</tr>

						<tr>
							<td class="right"><label>默认文章数：</label></td>
							<td class="left"><input type="text" min="1" max="10"
								name="kwr-default-article-account"
								value="<?php echo $array_kweixinrobot_option[KWR_DEFAULT_ARTICLE_ACCOUNT]; ?>" />
								<span class="help-block">填写默认返回的文章数目，即用户不用命令分隔符指定返回数目时返回的文章数目，最大数为10</span>
							</td>
						</tr>

						<tr>
							<td class="right"><label>命令分隔符：</label></td>
							<td class="left"><input type="text" name="kwr-cmd-seperator"
								value="<?php echo $array_kweixinrobot_option[KWR_CMD_SEPERATOR]; ?>" />
								<span class="help-block">填写命令分隔符，即支持使用类似“关键@6”的命令，其中“@”为命令分隔符，后面的数字为返回的文章数，最大为10</span>
							</td>
						</tr>
						<tr>
							<td class="right"><label>默认缩略图地址：</label></td>
							<td class="left"><input type="text" name="kwr-default-thumb"
								value="<?php echo $array_kweixinrobot_option[KWR_DEFAULT_THUMB]; ?>" />
								<span class="help-block">填写默认缩略图地址，当文章中没有图片时，使用该地址代表的图片</span></td>
						</tr>
						<tr>
							<td class="right"><label>信息保留时间（天）：</label></td>
							<td class="left"><input type="text" name="kwr-message-holdtime"
								min="1" max="360"
								value="<?php echo $array_kweixinrobot_option[KWR_MESSAGE_HOLDTIME]; ?>" />
								<span class="help-block">设置收到的信息在服务器的保留时间，过期的数据将被删除以节省服务器资源</span></td>
						</tr>
					</table>
				</div>
				
				<div class="tab-pane" id="tabs-11">

					<table class="table  table-bordered table-striped">
						<tr>
							<td class="right"><label>AppID：</label></td>
							<td class="left"><input type="text" name="kwr-appid"
								value="<?php echo $array_kweixinrobot_option[KWR_APPID]; ?>" />
								<span class="help-block">AppID和AppSecret可在公众账号管理界面的开发模式中获得</span></td>
						</tr>

						<tr>
							<td class="right"><label>AppSecret：</label></td>
							<td class="left"><input type="text"
								name="kwr-appsecret"
								value="<?php echo $array_kweixinrobot_option[KWR_APPSECRET]; ?>" />
								<span class="help-block">AppID和AppSecret可在公众账号管理界面的开发模式中获得<</span>
							</td>
						</tr>

						<tr>
							<td class="right"><label>Access Token：</label></td>
							<td class="left"><input type="text" name="kwr-accesstoken" readonly
								value="<?php echo $array_kweixinrobot_option[KWR_ACCESSTOKEN]; ?>" />
								<span class="help-block">如果AppID，AppSecret填写正确，AccessToken将会自动获取</span>
							</td>
						</tr>
						<tr>
							<td class="right"><label>Access Token 过期时间：</label></td>
							<td class="left"><?php echo $array_kweixinrobot_option[KWR_ACCESSTOKEN_EXPRIESIN]; ?>
								<span class="help-block">过期后如果有功能用到AccessToken，系统将会会自动续期。</span></td>
						</tr>
						
					</table>
				</div>
				
				
				<div class="tab-pane" id="tabs-2">
					<table class="table  table-bordered table-striped">
						<tr>
							<td class="right"><label>欢迎信息：</label></td>
							<td class="left"><textarea name="kwr-welcome"><?php echo $array_kweixinrobot_option[KWR_WELCOME]; ?></textarea>
								<span class="help-block">填写用于用户订阅时发送的欢迎信息</span></td>
						</tr>
						<tr>
							<td class="right"><label>欢迎命令：</label></td>
							<td class="left"><input type="text" name="kwr-welcome-cmd"
								value="<?php echo $array_kweixinrobot_option[KWR_WELCOME_CMD]; ?>" />
								<span class="help-block">填写用于用户查询问候信息的命令，例如“hi”，“你好”</span></td>
						</tr>
						<tr>
							<td class="right"><label>帮助信息：</label></td>
							<td class="left"><textarea name="kwr-help"><?php echo $array_kweixinrobot_option[KWR_HELP]; ?></textarea>
								<span class="help-block">填写用于用户寻求帮助时的帮助信息</span></td>
						</tr>
						<tr>
							<td class="right"><label>帮助命令：</label></td>
							<td class="left"><input type="text" name="kwr-help-cmd"
								value="<?php echo $array_kweixinrobot_option[KWR_HELP_CMD]; ?>" />
								<span class="help-block">填写用于用户寻求帮助时命令，例如“帮助”、“help”，持多个命令，中间用空格隔开</span>
							</td>
						</tr>
						<tr>
							<td class="right"><label>关键字长度：</label></td>
							<td class="left"><input type="text" name="kwr-keyword-length"
								min="1" max="100" step="1"
								value="<?php echo $array_kweixinrobot_option[KWR_KEYWORD_LENGTH]; ?>" />
								<span class="help-block">填写用户输入的关键字长度限制，注意：单个中文字长度为2，单个英文字符或数字长度为1，例如“时间管理”长度填为8，“weixin”长度是6</span>
							</td>
						</tr>
						<tr>
							<td class="right"><label>是否自动回复：</label></td>
							<td class="left"><input type="checkbox" name="kwr-auto-reply"
								value="1"
								<?php if($array_kweixinrobot_option[KWR_AUTO_REPLY]){ ?> checked
								<?php } ?> /><br /> <span class="help-block">当用户输入关键字长度超过限定长度时，是否自动回复消息。默认不勾选，即不自动回复消息，系统认为用户要与公共账号进行人工沟通。</span>
							</td>
						</tr>
						<tr>
							<td class="right"><label>关键字长度提醒：</label></td>
							<td class="left"><textarea name="kwr-keyword-length-warning"><?php echo $array_kweixinrobot_option[KWR_KEYWORD_LENGTH_WARNING]; ?></textarea>
								<span class="help-block">当用户输入的关键字长度超出限制时，自动回复给用户的错误提示信息，结合上面面“是否自动回复”使用</span>
							</td>
						</tr>
						<tr>
							<td class="right"><label>关键字错误提醒：</label></td>
							<td class="left"><textarea name="kwr-keyword-error-warning"><?php echo $array_kweixinrobot_option[KWR_KEYWORD_ERROR_WARNING]; ?></textarea>
								<span class="help-block">当使用用户输入的关键字没有查找到相关文章时，自动回复给用户的错误提示信息，信息中用户输入的关键词用”{keyword}“表示</span>
							</td>
						</tr>

					</table>
				</div>
				<div id="tabs-3" class="tab-pane">

					<table class="table  table-bordered table-striped">

						<tr>
							<td class="right"><label>最新文章命令：</label></td>
							<td class="left"><input type="text" name="kwr-new-article-cmd"
								value="<?php echo $array_kweixinrobot_option[KWR_NEW_ARTICLE_CMD]; ?>" />
								<span class="help-block">填写用户查询最新文章的命令，持多个命令，中间用空格隔开</span></td>
						</tr>
						<tr>
							<td class="right"><label>随机文章命令：</label></td>
							<td class="left"><input type="text" name="kwr-rand-article-cmd"
								value="<?php echo $array_kweixinrobot_option[KWR_RAND_ARTICLE_CMD]; ?>" />
								<span class="help-block">填写用户查询随机文章的命令，支持多个命令，中间用空格隔开</span></td>
						</tr>
						<tr>
							<td class="right"><label>热门文章命令：</label></td>
							<td class="left"><input type="text" name="kwr-hot-article-cmd"
								value="<?php echo $array_kweixinrobot_option[KWR_HOT_ARTICLE_CMD]; ?>" />
								<span class="help-block">填写用户查询随机文章的命令，持多个命令，中间用空格隔开</span></td>
						</tr>
					</table>
				</div>
				<div id="tabs-4" class="tab-pane">
					<table class="table  table-bordered table-striped" id="cstrply_tbl">
						<thead>
							<tr>
								<th width="10%">命令</th>
								<th width="30%">回复</th>
								<th width="10%">类型</th>
								<th width="10%">状态</th>
								<th width="10%">更新时间</th>
								<th width="20%">操作</th>

							</tr>
						</thead>
						<tbody>

						</tbody>


					</table>
					<button type="button" class="btn btn-danger"
						onclick="showreplyedit();">新增自定义消息</button>
					<input type="text" name="kwrq-id" value='0' hidden=true />
					<table id="editreply" class="table  table-bordered">
						<tr>
							<td><label>状态：</label></td>
							<td><select name="kwrq-isvalid">
									<option value=1>启用</option>
									<option value=0>禁用</option>

							</select></td>
						</tr>
						<tr>
							<td><label>二维码：</label></td>
							<td><select name="kwrq-isqrvalid">
									<option value=1>启用</option>
									<option value=0>禁用</option>

							</select></td>
						</tr>
						<tr>
							<td><label>命令：</label></td>
							<td><input type="text" name="kwrq-qword" required /> <span
								class="help-block">查询自定义回复的命令</span></td>
						</tr>
						<tr>
							<td><label>回复：</label></td>
							<td class="left"><textarea name="kwrq-reply" required></textarea>
								<span class="help-block">自定义回复</span></td>
						</tr>
						<tr>
							<td colspan="2"><input type="button" class="btn btn-primary"
								onclick="savecustomreply();" value='保存自定义回复'> <input
								type="button" type="button" id="cancelreply"
								onclick="closereplyedit();" class="btn btn-normal" value='取消' /></td>
						</tr>
					</table>

				</div>
				<div class="tab-pane" id="tabs-5">
					<h3>文本内容</h3>
					<p>在各设定的回复信息中输入文本的内容，即可自动回复文本消息。</p>
					<h3>站点资源</h3>
					<p>
						如果希望在输入特定指令时，自动回复来自站点网站中的资源（如文章、图片等），则可依照以下WP_Query表达式格式输入回复消息，如：[{"tag":"wptag"}]<br>
					</p>
					<p>
						详情请见：<a href='http://codex.wordpress.org/Class_Reference/WP_Query'>http://codex.wordpress.org/Class_Reference/WP_Query</a>
					</p>
					<h3>引用已设置的命令</h3>
					<p>
						如果希望在输入特定指令时，使用已经设置过的指令。则可按照以下语法：[{"ref":"待引用的指令","num":5}]<br>
						也可组合引用多个指令，并控制每个指令输出文章的数量，如：[{"ref":"n","num":5}，{"ref":"p","num":5}]
					</p>

				</div>
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-10">
						<input class="btn btn-primary" type="button" id='saveoption'
							onclick="updateoption();" value="保存设置" />
					</div>
				</div>
	
	</form>



</div>





<?php
}
