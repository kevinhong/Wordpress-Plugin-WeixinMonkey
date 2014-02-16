var map;
var point;

jQuery(document).ready(function() {
	var r = jQuery("input[name='kwr-geosettings-radis']").val();
	var center = jQuery("input[name='kwr-geosettings-center']").val();
	if (center.length != 0 && r.length != 0) {
		var lng = center.split(',')[0];
		var lat = center.split(',')[1];
		point = new BMap.Point(lng, lat);
		initmap();
		addOL(point);
	}else{
		initmap();

	}

});
function gotocity() {
	var city = jQuery("input[name='kwr-geosettings-city']").val();

	if (city.length > 0) {
		map.centerAndZoom(city, 15); // 初始化地图,设置中心点坐标和地图级别。

	}
}
function changeRadis() {
	jQuery("#pageform").validate();

	var r = jQuery("input[name='kwr-geosettings-radis']").val();
	var overlays = map.getOverlays();
	r = parseInt(r);

	overlays.forEach(function(e) {
		if (e.getRadius() != 'undefined' && e.getRadius() > 0
				&& e.getRadius() != r) {
			if (isNaN(r) == false) {
				e.setRadius(r);
			}
			jQuery("input[name='kwr-geosettings-radis']").val(e.getRadius());
		}

	})
}
function initmap() {
	map = new BMap.Map("allmap")
	if (point == null) {
		point = new BMap.Point(116.404, 39.915);

	}
	map.addControl(new BMap.NavigationControl()); // 添加默认缩放平移控件
	map.addControl(new BMap.NavigationControl({
		anchor : BMAP_ANCHOR_BOTTOM_LEFT,
		type : BMAP_NAVIGATION_CONTROL_PAN
	})); // 左下角，仅包含平移按钮
	map.addControl(new BMap.NavigationControl({
		anchor : BMAP_ANCHOR_BOTTOM_RIGHT,
		type : BMAP_NAVIGATION_CONTROL_ZOOM
	})); // 右下角，仅包含缩放按钮
	map.addControl(new BMap.OverviewMapControl({
		isOpen : true,
		anchor : BMAP_ANCHOR_TOP_RIGHT
	})); // 右上角，打开

	map.centerAndZoom(point, 15);
	var contextMenu = new BMap.ContextMenu();
	var txtMenuItem = [ {
		text : '放大',
		callback : function() {
			map.zoomIn()
		}
	}, {
		text : '缩小',
		callback : function() {
			map.zoomOut()
		}
	}, {
		text : '放置到最大级',
		callback : function() {
			map.setZoom(18)
		}
	}, {
		text : '查看全国',
		callback : function() {
			map.setZoom(4)
		}
	}, {
		text : '在此添加标注',
		callback : function(p) {
			addOL(p);
		}
	} ];

	for ( var i = 0; i < txtMenuItem.length; i++) {
		contextMenu.addItem(new BMap.MenuItem(txtMenuItem[i].text,
				txtMenuItem[i].callback, 100));
		if (i == 1 || i == 3) {
			contextMenu.addSeparator();
		}
	}
	map.addContextMenu(contextMenu);

}

function addOL(p) {
	map.clearOverlays();

	var marker = new BMap.Marker(p), px = map.pointToPixel(p);
	var r = jQuery("input[name='kwr-geosettings-radis']").val();
	r = parseInt(r);
	point = p;
	var s = p.lng + ',' + p.lat;
	jQuery("input[name='kwr-geosettings-center']").val(s);

	if (isNaN(r) == true) {
		r = 500;
		jQuery("input[name='kwr-geosettings-radis']").val(500)
	}
	var circle = new BMap.Circle(p, r);
	map.addOverlay(circle);
	map.addOverlay(marker);
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