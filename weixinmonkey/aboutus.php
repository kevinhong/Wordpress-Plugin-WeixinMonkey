<?php
require_once (dirname ( __FILE__ ) . '/kwr_backend.php');
function kwxrobot_aboutus() {

		?>

<div class="container">

  <div class="blog-header">
        <h1 class="blog-title">关于我们</h1>
      </div>


<h1>WordPress Plugin WeixinMonkey</h1>

<p>微信猴子，是一个Wordpress插件，用于在Wordpress系统中与微信公众账号进行交互。</p>

<h2>功能</h2>

<ul>
<li>此插件完全符合Wordpress插件标准.</li>
<li>实现微信公众账号的自动回复，并从博客中抽取文章。</li>
<li>支持自定义回复。</li>
<li>支持人工回复（客服功能）。</li>
<li>支持定制微信公众账号的自定义菜单。</li>
<li>支持生成二维码。</li>
<li>支持微信语音识别。</li>
<li>支持基于地理位置的自动回复。</li>
</ul>

<h2>内容</h2>

<p>此插件包括以下文件：</p>

<ul>
<li> README， 和  <code>gitignore</code>.</li>
<li>子目录 <code>weixinmonkey</code> 包括所有插件必须的所有文件。</li>
</ul>

<h2>安装</h2>

<ol>
<li>拷贝插件目录weixinmonkey到 <code>wordpress/wp-content/plugins</code>下</li>
<li>修改geosettings.php头部的 <code>api.map.baidu.com/api?v=2.0&amp;ak=xxxxx</code> 为你的百度地图API key<br></li>
<li>在wordpress后台，打开<code>插件</code>页面</li>
<li>点击<code>启用</code></li>
</ol>

<h2>协议</h2>

<p>本软件遵守 GPL v2 协议.</p>

<ul>
<li>本程序免费，你可以免费使用或发布此软件，发布后的软件也必须遵照GPL v2协议。</li>
<li>你可以修改此软件，修改后的软件如果发布就必须开源。
&amp; 你不能将此软件或基于此软件修改后的软件进行商业销售。</li>
</ul>

<p>The WordPress Plugin Weixinmonkey is licensed under the GPL v2 or later.</p>

<h2>源码结构</h2>

<ul>
<li><code>weixinmonkey/core</code> 后台业务逻辑与数据库操作</li>
<li><code>weixinmonkey/images</code> 图片</li>
<li><code>weixinmonkey/js</code> Javascript</li>
<li><code>weixinmonkey/include</code> 引用的第三方包</li>
</ul>

<h2>开发者</h2>

<ul>
<li>Email: <a href="mailto:kevin.yanghong@gmail.com">kevin.yanghong@gmail.com</a></li>
<li>Blog: <a href="http://kevinyang.duapp.com">http://kevinyang.duapp.com</a></li>
<li>新浪微博:  @可行性架构</li>
</ul>
</div>
<?php
}