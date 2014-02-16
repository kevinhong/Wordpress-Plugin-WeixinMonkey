# WordPress Plugin WeixinMonkey

微信猴子，是一个Wordpress插件，用于在Wordpress系统中与微信公众账号进行交互。

## 功能

* 此插件完全符合Wordpress插件标准.
* 实现微信公众账号的自动回复，并从博客中抽取文章。
* 支持自定义回复。
* 支持人工回复（客服功能）。
* 支持定制微信公众账号的自定义菜单。
* 支持生成二维码。
* 支持微信语音识别。
* 支持基于地理位置的自动回复。


## 内容

此插件包括以下文件：

*  README， 和  `gitignore`.
* 子目录 `weixinmonkey` 包括所有插件必须的所有文件。

## 安装

1. 拷贝插件目录weixinmonkey到 `wordpress/wp-content/plugins`下
2. 修改geosettings.php头部的 `api.map.baidu.com/api?v=2.0&ak=xxxxx` 为你的百度地图API key   
2. 在wordpress后台，打开`插件`页面
3. 点击`启用`



## 协议

本软件遵守 GPL v2 协议.

* 本程序免费，你可以免费使用或发布此软件，发布后的软件也必须遵照GPL v2协议。
* 你可以修改此软件，修改后的软件如果发布就必须开源。
& 你不能将此软件或基于此软件修改后的软件进行商业销售。


The WordPress Plugin Weixinmonkey is licensed under the GPL v2 or later.

## 源码结构
* `weixinmonkey/core ` 后台业务逻辑与数据库操作
* `weixinmonkey/images ` 图片
* `weixinmonkey/js ` Javascript
* `weixinmonkey/include ` 引用的第三方包

## 开发者

* Email: kevin.yanghong@gmail.com
* Blog: http://kevinyang.duapp.com
* 新浪微博:  @可行性架构
* 项目地址: https://github.com/kevinhong/Wordpress-Plugin-WeixinMonkey


