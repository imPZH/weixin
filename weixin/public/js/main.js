$(function(){

	window.ontouchmove=function(e){
		var evt=e||event;
		evt.returnValue=false;
	}
	window.onmousemove=function(e){
		var evt=e||event;
		evt.returnValue=false;
	}

	function record () {
		var localId = "",
			time_start = 0,
			totla_t = 0,
			timesUp;

		wx.ready(function(){
			$( "record-area" ).on("touchstart", function(e){
				e.preventDeafult || e.preventDefault();
				wx.startRecord();
			}).on("touched", function(){
				wx.stopRecord(function(res){
					localId = res.localId;
				});
			})
		})
	}
	record();



	//点击关注按钮
	$(".p3-attention").on("click",function(){
		window.open("http://mp.weixin.qq.com/s?__biz=MzA4MDk3MDgxOA==&mid=207747019&idx=1&sn=cb706c76dc0622695953adb7e223b297&scene=1&from=groupmessage&isappinstalled=0#rd");
	});

});
