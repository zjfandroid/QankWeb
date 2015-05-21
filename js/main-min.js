$(function() {
	function b() {
		var e = -1;
		if (navigator.appName == "Microsoft Internet Explorer") {
			var c = navigator.userAgent;
			var d = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
			if (d.exec(c) != null) {
				e = parseFloat(RegExp.$1)
			}
		}
		return e
	}
	var a = {
		sectionCount : 5,
		canScroll : true,
		fromButtom : false,
		sectionIdObject : 0,
		section : ".section",
		sectionBg : "img.section-bg",
		guideID : "#guide",
		hasBefore : false,
		extendEffect : true,
		beforeInit : function() {
			var c = this;
			this.hasBefore = true;
			this.loadSecondStepImg(function() {
				c.setImageSizeAndPostion()
			})
		},
		init : function() {
			if (b() > 0 && b() <= 9) {
				this.extendEffect = false
			}
			this.setFrameSize();
			this.setImageSizeAndPostion();
			this.addResizeEvent();
			this.addScrollEvent();
			this.addDownloadJump();
			this.touchOperate();
			this.whenFirstLoadedIn();
			this.initGuide()
		},
		showGuideInterface : function() {
			var c = this, d = "3%";
			setTimeout(function() {
				$(c.guideID).animate({
					right : d
				}, 1000)
			}, 2000)
		},
		pageFromGuide : function() {
			var c = this;
			$(".guide-item").click(function(g) {
				if (c.canScroll) {
					var f = $(this);
					if (!f.hasClass("active")) {
						var h = parseInt(f.attr("data-section"));
						var d = -1;
						if (c.sectionIdObject > h) {
							d = 1;
							if (c.sectionIdObject - h >= 2) {
								c.fromButtom = true
							}
							c.sectionIdObject = h + 1;
							c._scrollBrain(d, h + 1)
						} else {
							if (h - c.sectionIdObject >= 2) {
								c.fromButtom = true
							}
							c.sectionIdObject = h - 1;
							c._scrollBrain(d, h)
						}
					}
					return false
				}
			})
		},
		setPageGuide : function(d) {
			var c = ".guide-item", e = "active";
			$(c).removeClass(e);
			$(c + ":eq(" + d + ")").addClass(e)

			switch (d) {
			case 0:
			case 5:
				$("#div_stop").fadeOut();
				break;
			default:
				$("#div_stop").fadeIn(2000);
				var oUl = document.getElementById('wrap').getElementsByTagName(
						'ul')[0];
				startMove(-(d - 1)
						* oUl.getElementsByTagName('li')[0].offsetWidth);
				break;
			}
		},
		initGuide : function() {
			this.showGuideInterface();
			this.setPageGuide(0);
			this.pageFromGuide()
		},
		loadSecondStepImg : function(f) {
			var d = this;
			var e = $(".lazy-load"), c = e.length - 1;
			e.each(function(g, h) {
				var h = $(this);
				var i = h.attr("data-url");
				h.removeClass("lazy-load");
				h.attr({
					src : i
				}).load(function(j) {
					d.setImageSizeAndPostion(h)
				});
				if (g == c) {
					f()
				}
			})
		},
		whenFirstLoadedIn : function() {
			var c = this;
			$(".yb-client-content").animate({
				opacity : 1
			}, 1000, function() {
				c.addInitEffect()
			})
		},
		addInitEffect : function() {
			var d = ".yb-unvisible", e = ".start-animate", c = false;
			if (!this.extendEffect) {
				$(e).each(function(f, g) {
					if (f == 1) {
						c = true
					}
					$(this).find(".yb-unvisible").each(function(i, h) {
						if (!(i == 1 && c)) {
							$(this).animate({
								opacity : 1
							}, 1000)
						}
					})
				})
			} else {
				$(e).addClass("init-effect")
			}
		},
		touchOperate : function() {
			var c = this, d = document.getElementById("body");
			c.forDevice(d, function(f) {
				var e = c.sectionIdObject;
				if (c.canScroll) {
					c.canScroll = false;
					e++;
					c._scrollBrain(f, e)
				}
			})
		},
		forDevice : function(f, i) {
			var d = this, e = f, c = 0, h = 0, g = {
				Start : "touchstart",
				Move : "touchmove",
				End : "touchend"
			};
			if (document.addEventListener) {
				e.addEventListener(g.Start, function(k) {
					k.preventDefault();
					var j = k.touches[0];
					c = j.pageY
				}, false);
				e.addEventListener(g.Move, function(k) {
					k.preventDefault();
					var j = k.touches[0];
					h = j.pageY - c
				}, false);
				e.addEventListener(g.End, function(j) {
					j.preventDefault();
					if (h) {
						i(h)
					}
				}, false)
			}
		},
		addDownloadJump : function() {
			var c = this;
			$("a.download_but").click(function(f) {
				c.jumpToBottom();
				return false
			});
			var d = document.getElementById("downloadApp");
			if (document.addEventListener) {
				d.addEventListener("touchstart", function(e) {
					e.preventDefault();
					c.jumpToBottom()
				}, false)
			}
		},
		jumpToBottom : function() {
			var c = this;
			c.fromButtom = true;
			c.sectionIdObject = 5;
			c._scrollBrain(-1, 6)
		},
		setFrameSize : function() {
			var d = this, e = $(window), c = e.innerHeight(), f = e
					.innerWidth();
			$(".yb-client-content , .section-bg-block ,.section-block").css({
				height : c
			});
			$(d.section).css({
				height : c
			});
			$(d.section).each(function(g, h) {
				if (g == d.sectionCount) {
					// if (d.sectionIdObject == d.sectionCount) {
					// $(this).css({
					// height : "1115px",
					// bottom : "-" + (1115 - c) + "px"
					// })
					// } else {
					$(this).css({
						height : "1115px",
						bottom : "-1115px"
					})
					// }
					$(this).find(".section-block").css({
						height : "1115px"
					})
				}
			})
		},
		addScrollEvent : function() {
			var c = this;
			var d = function(g) {
				var g = g || window.event;
				var f = c.sectionIdObject;
				if (c.canScroll) {
					c.canScroll = false;
					f++;
					if (g.wheelDelta) {
						c._scrollBrain(g.wheelDelta, f)
					} else {
						if (g.detail) {
							c._scrollBrain(-(g.detail), f)
						}
					}
				}
			};
			if (document.addEventListener) {
				document.addEventListener("DOMMouseScroll", d, false)
			}
			window.onmousewheel = document.onmousewheel = d
		},
		_scrollBrain : function(i, g) {
			var f = this, e = 0, d = $(window).height(), j = $(f.section
					+ ":eq(" + f.sectionCount + ")"), c = j.css("bottom"), h = 1115;
			if (i < 0) {
				if (f.sectionIdObject == (f.sectionCount + 1)) {
					if (d < h && c != "0px") {
						j.animate({
							bottom : 0
						}, 300, function() {
						})
					}
				}
				if (f.sectionIdObject < f.sectionCount) {
					$(f.section).each(
							function(m, n) {
								if (m == g) {
									f.setPageGuide(m);
									var k = $(this);
									if (!(m == 1 || f.fromButtom)) {
										$(this).prev(".section").animate({
											bottom : "100%"
										}, 1000)
									}
									var l = "0%";
									if (m == f.sectionCount) {
										l = "-" + (h - d) + "px"
									}
									k.animate({
										bottom : l
									}, 1000, function() {
										f.sectionIdObject++;
										f.canScroll = true;
										if (f.extendEffect) {
											k.addClass("effect")
										} else {
											k.find(".yb-unvisible").each(
													function(o, p) {
														$(this).animate({
															opacity : 1
														}, 1000)
													})
										}
										if (f.fromButtom) {
											$(f.section).each(function(o, p) {
												if (o != f.sectionIdObject) {
													if (o != 0 && o < g) {
														$(this).css({
															bottom : "100%"
														})
													}
												}
											});
											f.fromButtom = false
										}
									})
								}
							})
				} else {
					f.canScroll = true
				}
			} else {
				g = f.sectionIdObject;
				if (g > 0) {
					$(f.section).each(
							function(m, n) {
								var k = $(this);
								if (m == g) {
									f.setPageGuide(m - 1);
									var o = (m == 1);
									l = o ? "-90%" : "-100%";
									if (!(m == 1 || f.fromButtom)) {
										k.prev(".section").animate({
											bottom : "0%"
										}, 1000)
									} else {
										if (f.fromButtom) {
											k.prev(".section").animate({
												bottom : "0%"
											}, 1000)
										}
									}
									if (m == f.sectionCount) {
										l = "-1115px"
									}
									k.animate({
										bottom : l
									}, 1000, function() {
										f.sectionIdObject--;
										f.canScroll = true;
										var p = k.prev(".section");
										if (f.extendEffect) {
											if (!p.hasClass("effect")) {
												p.addClass("effect")
											}
										} else {
											k.find(".yb-unvisible").each(
													function(q, r) {
														$(this).animate({
															opacity : 1
														}, 1000)
													})
										}
										if (o) {
											k.animate({
												bottom : "-100%"
											}, 800)
										}
									})
								} else {
									var l = "-100%";
									if (m == f.sectionCount) {
										l = "-1115px"
									}
									if (m > g) {
										k.animate({
											bottom : l
										}, 1000)
									}
								}
							})
				} else {
					f.canScroll = true
				}
			}
		},
		addResizeEvent : function() {
			var c = this;
			$(window).resize(function() {
				c.setFrameSize();
				c.setImageSizeAndPostion()
			})
		},
		setImageSizeAndPostion : function(f) {
			var e = this, h = $(e.sectionBg), d = $(window).innerHeight(), i = $(
					window).innerWidth(), c = {
				type : "data-type",
				originWidth : "data-origin-width",
				originHeight : "data-origin-height"
			}, g = {
				full : "full",
				origin : "origin"
			};
			h
					.each(function(r, p) {
						var p = $(this), j = p.attr(c.type), n = p.height(), t = p
								.width(), l = 0, o = 0, k = 0, m = 0, q = 0, s = 0, u = 0;
						if (!p.attr(c.originWidth)) {
							p.attr({
								"data-origin-width" : t
							})
						} else {
							t = p.attr(c.originWidth)
						}
						if (!p.attr(c.originHeight)) {
							p.attr({
								"data-origin-height" : n
							})
						} else {
							n = p.attr(c.originHeight)
						}
						m = d / i;
						q = n / t;
						switch (j) {
						case g.full:
							if (m < q) {
								o = i;
								l = i * n / t;
								s = -((l - d) / 2);
								u = 0
							} else {
								l = d;
								o = d * t / n;
								s = 0;
								u = -(o - i) / 2
							}
							p.css({
								top : s,
								left : u,
								height : l,
								width : o
							});
							break;
						case g.origin:
							l = d - 170;
							if (l > n) {
								l = n
							}
							o = l * t / n;
							p.css({
								height : l,
								width : o
							});
							u = (i - p.width()) / 2;
							p.css({
								bottom : k,
								left : u
							});
							break
						}
					})
		}
	};
	ylframe.modules.clientEffect = a
});

// --------div层随屏滚动和位置固定----------
function scroll(p) {
	var d = document, dd = d.documentElement, db = d.body, w = window, o = d
			.getElementById(p.id), ie = /msie/i.test(navigator.userAgent), style, timer;
	if (o) {
		// ie8下position:fixed下top left失效
		o.style.cssText += ";position:" + (p.f && !ie ? 'fixed' : 'absolute')
				+ ";" + (p.l == undefined ? 'right:0;' : 'left:' + p.l + 'px;')
				+ (p.t != undefined ? 'top:' + p.t + 'px' : 'bottom:0');
		if (p.f && ie) {
			o.style.cssText += ';left:expression(body.scrollLeft + '
					+ (p.l == undefined ? db.clientWidth - o.offsetWidth : p.l)
					+ ' + "px");top:expression(body.scrollTop +'
					+ (p.t == undefined ? db.clientHeight - o.offsetHeight
							: p.t) + '+ "px" );'
			db.style.cssText += ";background-image:url(about:blank);background-attachment:fixed;"
		} else {
			if (!p.f) {
				w.onresize = w.onscroll = function() {
					clearInterval(timer);
					timer = setInterval(function() {
						var st = db.scrollTop, c;
						c = st
								- o.offsetTop
								+ (p.t != undefined ? p.t
										: (w.innerHeight || db.clientHeight)
												- o.offsetHeight);
						if (c != 0) {
							o.style.top = o.offsetTop
									+ Math.ceil(Math.abs(c) / 10)
									* (c < 0 ? -1 : 1) + 'px';
						} else {
							clearInterval(timer);
						}
					}, 10)
				}
			}
		}
	}
}
scroll({
	id : 'div_follow'
})
scroll({
	id : 'div_stop',
	l : 0,
	t : 200,
	f : 1
})
scroll({
	id : 'div_top',
	l : 0,
	t : 0,
	f : 1
})

// --------------手机滑动------------------------
var oTimer = null;
var iSpeed = 0;

function startMove(iTarget) {
	if (oTimer) {
		clearInterval(oTimer);
	}

	oTimer = setInterval("doMove(" + iTarget + ")", 30);
}

function doMove(iTarget) {
	var oUl = document.getElementById('wrap').getElementsByTagName('ul')[0];
	var l = oUl.offsetLeft;

	iSpeed += (iTarget - oUl.offsetLeft) / 5;
	iSpeed *= 0.5;

	l += iSpeed;

	if (Math.abs(iTarget - oUl.offsetLeft) < 1 && Math.abs(iSpeed) < 1) {
		clearInterval(oTimer);
		oTimer = null;
		l = iTarget;
	}

	oUl.style.left = l + 'px';
}

function stopMove() {
	if (oTimer) {
		clearInterval(oTimer);
	}
}

// ---------------案列滑动-----------------
var indexExp = 0;

function onClickLeft() {
	if (indexExp > 0) {
		indexExp--;
		var oUl = document.getElementById('wrap_example').getElementsByTagName(
				'ul')[0];
		startMoveExample(-(indexExp)
				* oUl.getElementsByTagName('li')[0].offsetWidth);
	}
}

function onClickRight() {
	var oUl = document.getElementById('wrap_example')
			.getElementsByTagName('ul')[0];

	if (indexExp < oUl.getElementsByTagName('li').length - 1) {
		indexExp++;
		startMoveExample(-(indexExp)
				* oUl.getElementsByTagName('li')[0].offsetWidth);
	}
}

function startMoveExample(iTarget) {
	if (oTimer) {
		clearInterval(oTimer);
	}

	oTimer = setInterval("doMoveExample(" + iTarget + ")", 30);
}

function doMoveExample(iTarget) {
	var oUl = document.getElementById('wrap_example')
			.getElementsByTagName('ul')[0];
	var l = oUl.offsetLeft;

	iSpeed += (iTarget - oUl.offsetLeft) / 5;
	iSpeed *= 0.5;

	l += iSpeed;

	if (Math.abs(iTarget - oUl.offsetLeft) < 1 && Math.abs(iSpeed) < 1) {
		clearInterval(oTimer);
		oTimer = null;
		l = iTarget;
	}

	oUl.style.left = l + 'px';
}

// ---------自动轮播----------
function autoPlay() {
	var oUl = document.getElementById('wrap_example')
			.getElementsByTagName('ul')[0];

	indexExp++;
	if (indexExp >= oUl.getElementsByTagName('li').length) {
		indexExp = 0;
	}

	startMoveExample(-indexExp * oUl.getElementsByTagName('li')[0].offsetWidth);
}

setInterval("autoPlay();", 3000);
/*-------------------------- +
 获取id, class, tagName
 +-------------------------- */
var get = {
	byId : function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass : function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++)
			reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName : function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
/*-------------------------- +
 拖拽函数
 +-------------------------- */
function drag(oDrag, handle) {
	var disX = dixY = 0;

	handle = handle || oDrag;
	handle.style.cursor = "move";
	handle.onmousedown = function(event) {
		var event = event || window.event;
		disX = event.clientX - oDrag.offsetLeft;
		disY = event.clientY - oDrag.offsetTop;

		document.onmousemove = function(event) {
			var event = event || window.event;
			var iL = event.clientX - disX;
			var iT = event.clientY - disY;
			var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
			var maxT = document.documentElement.clientHeight
					- oDrag.offsetHeight;

			iL <= 0 && (iL = 0);
			iT <= 0 && (iT = 0);
			iL >= maxL && (iL = maxL);
			iT >= maxT && (iT = maxT);

			oDrag.style.left = iL + "px";
			oDrag.style.top = iT + "px";

			return false
		};

		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;
			this.releaseCapture && this.releaseCapture()
		};
		this.setCapture && this.setCapture();
		return false
	};

}

jQuery(document).ready(function() {
	(function($news) {
		var oDrag = document.getElementById("new");
		var oTitle = get.byClass("caption", oDrag)[0];

		drag(oDrag, oTitle);

		$('.control', $news).click(function() {
			if ($news.hasClass('close')) {
				$news.removeClass('close').addClass('open');
			} else {
				$news.removeClass('open').addClass('close');
			}
		});
	}($('.news')));

	$('#register').click(function() {
		var params = $('form').serialize(); // 序列化表单的值
		$.post("http://www.qank.top/qank/CustomerCollect", {
			name : $("#name").val(),
			phone : $("#phone").val(),
			email : $("#email").val(),
			message : $("#message").val()
		}, function(data, status) {
			alert("222提交成功！");
			if (200 == status) {
				alert("提交成功！");
			} else {
				alert("数据：" + data + "\n状态：" + status);
			}
			;
		});

	});
});

function textdown(e) {
	textevent = e;
	if (textevent.keyCode == 8) {
		return;
	}
	if (document.getElementById('Message').value.length >= 100) {
		alert("大侠，手下留情，此处限字100")
		if (!document.all) {
			textevent.preventDefault();
		} else {
			textevent.returnValue = false;
		}
	}
}

function textup() {
	var s = document.getElementById('Message').value;
	// 判断ID为text的文本区域字数是否超过100个
	if (s.length > 100) {
		document.getElementById('textarea').value = s.substring(0, 100);
	}
}

var _hmt = _hmt || [];
(function() {
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?ad889522b20630b97f2bf5d208caa137";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();