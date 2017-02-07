$(function(){

	window.ontouchmove=function(e){
		var evt=e||event;
		evt.returnValue=false;
	}
	window.onmousemove=function(e){
		var evt=e||event;
		evt.returnValue=false;
	}



	var timeouts = [];


	var mySwiper01;
	setTimeout(function(){


		mySwiper01 = new Swiper('.swiper-containermain',{

					slidesPerView:1,

					mode:'vertical',

					//Enable 3D Flow



					//followFinger:false,

					progress: false,

					speed:800,

					noSwiping:true,

					initialSlide:0,

					followFinger:true,

					updateOnImagesReady:true,

					onSwiperCreated: function(swiper){

						eval('showp'+(swiper.activeIndex+1)+'()');

					} ,



					onSlideChangeEnd:function(swiper){

						eval('showp'+(swiper.activeIndex+1)+'()');

					},



					onSlideChangeStart:function(swiper){

						disappearall();

					},



					onProgressChange: function(swiper) {

						// var slide=swiper.slides[0];
						// var progress=slide.progress;
						// $("#p1_light").css({'y':-progress*20+'px'});
						// console.log(progress);
					},

					onTouchStart:function(swiper){
						// disappearall();
					},

					onTouchEnd:function(swiper) {

					},

					onImagesReady: function(swiper){
						console.log("onImagesReady");
						$("#loading").fadeOut(300);
						eval('showp'+(swiper.activeIndex+1)+'()');
					}

				});

		// $("#loading").fadeOut(300);

	},0);



	function stopDefault(e){
		if(e&&e.preventDefault){
			e.preventDefault();
		}
		else{
			window.event.returnValue-false;
		}
		return false;
	}

	stopDefault();

	//写cookies
	function setCookie(name,value)
	{
	    var Days = 30;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();


	    var strsec = getsec(time);
	    var exp = new Date();
	    exp.setTime(exp.getTime() + strsec*1);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}

	//读取cookies
	// function getCookie(name)
	// {
	//     var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

	//     if(arr=document.cookie.match(reg))

	//         return (arr[2]);
	//     else
	//         return null;
	// }

	//删除cookies
	// function delCookie(name)
	// {
	//     var exp = new Date();
	//     exp.setTime(exp.getTime() - 1);
	//     var cval=getCookie(name);
	//     if(cval!=null)
	//         document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	// }

/*------------------------代码增加区 START--------------------------*/



	$("body,html,div[id^='p2'],div[id^='p2'] img,img[id^='p2']").on("touchstart touchmove touchend",function(e){
		// return false;
		e.preventDefault||e.preventDefault();
	});


	function blow(){

		var localId="",
			time_start=0,
			num=0,
			total_t=0,
			timesUp;

		wx.ready(function(){


			$("#p2_btn_a").on("touchstart",function(e){

				e.preventDefault||e.preventDefault();

				wx.startRecord();

				$("#p2_warn").hide();

				$("#p2a_time_num").attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/"+num+"s.png")

				$("#p2_btn").hide();

				$("#p2").fadeOut(800);
				$("#p2_a").fadeIn(200);
				clearInterval(timesUp);
				timesUp=setInterval(function(){
					if(num<30){
						++num;
						console.log(num);
						$("#p2a_time_num").attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/"+num+"s.png")
					}
					else{
						clearInterval(timesUp);
						score=Math.floor(2500+(Math.random()*499));
						percent=Math.floor(90+(Math.random()*10));
						deal_transit("e");
						share_words(percent,"不是跟你吹，阿甘追我吃嘴灰！");
						mySwiper01.swipeNext();
					}
				},1000);

				time_start=new Date();
				return false;

			}).on("touchend",function(e){

				clearInterval(timesUp);

				$("#p2_btn").show();
				// alert((new Date())-time_start);

				wx.stopRecord({
				    success: function (res) {
				       var localId = res.localId;

				    }
				});

				$("#p2_warn").on("touchstart",function(){
					$("#p2_warn").fadeOut(300);
				});

				if((new Date())-time_start<3000){
					$("#p2_warn").fadeIn(300);
					num=0;
					return;
				};

				setTimeout(deal_result,500);


			});
		});




		function deal_transit(s){
			$("#p3"+s).show();
			$("#p3"+s+"_btn01,#p3"+s+"_btn02").fadeIn(800);
			$("#p3"+s+"_words01,#p3_num_ct").delay(800).show().addClass("fadeIn");
			setTimeout(function(){
				$("#p3"+s+"_btn03").show().addClass("bounceInUp");
			},2000);
		}

		function share_words(per,score,w,url){

			$("#p3_num_ct").text(per);
			var a=score%10,
				b=Math.floor(score/10)%10,
				c=Math.floor(score/100)%10,
				d=Math.floor(score/1000)%10;
				// alert(score);
			// alert(a+"-"+b+"-"+c+"-"+d);
			$(".p3-num").eq(0).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/"+d+".png").delay(2400).show().addClass("fadeIn");
			$(".p3-num").eq(1).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/"+c+".png").delay(2400).show().addClass("fadeIn");
			$(".p3-num").eq(2).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/"+b+".png").delay(2400).show().addClass("fadeIn");
			$(".p3-num").eq(3).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/"+a+".png").delay(2400).show().addClass("fadeIn");
			$(".p3-num-cover").delay(2000).fadeOut(200);
			// timeouts.push(setTimeout('$(".p3-num").eq(0).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/'+d+'.png").addClass("floating");',4000));
			// timeouts.push(setTimeout('$(".p3-num-cover").eq(0).fadeOut(400)',4000));
			// timeouts.push(setTimeout('$(".p3-num").eq(1).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/'+c+'.png").addClass("floating");',3000));
			// timeouts.push(setTimeout('$(".p3-num-cover").eq(1).fadeOut(400)',3000));
			// timeouts.push(setTimeout('$(".p3-num").eq(2).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/'+b+'.png").addClass("floating");',2000));
			// timeouts.push(setTimeout('$(".p3-num-cover").eq(2).fadeOut(400)',2000));
			// timeouts.push(setTimeout('$(".p3-num").eq(3).attr("src","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-10/'+a+'.png").addClass("floating");',1000));
			// timeouts.push(setTimeout('$(".p3-num-cover").eq(3).fadeOut(400)',1000));

			setwx({
				debug:false,
				title:w+"全国"+per+"%的人被我击败！",
				desc:"跑赢我？好大口气！",
				imgurl:url,
			});


		}

		function deal_result(){
			var score=0;
	        var t=num;
			// alert(t);
			var percent=0;
			if(t<=6){
				score=Math.floor(500+(Math.random()*499));
				percent=Math.floor(20+(Math.random()*30));

				console.log(t);
				deal_transit("a");
				share_words(percent,score,"小勃别上火，下次努力追上我！","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-14/05.jpg");
			}
			else if(t<=13){
				score=Math.floor(1000+(Math.random()*499));
				percent=Math.floor(50+(Math.random()*20));

				share_words(percent,score,"昆仑你别追，跑断双腿也白费！","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-14/04.jpg");
				deal_transit("b");
			}
			else if(t<=19){
				score=Math.floor(1500+(Math.random()*499));
				percent=Math.floor(70+(Math.random()*10));

				share_words(percent,score,"阿星别颓废，我跑慢点慢慢追！","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-14/03.jpg");
				deal_transit("c");
			}
			else if(t<=25){
				score=Math.floor(2000+(Math.random()*499));
				percent=Math.floor(80+(Math.random()*10));

				share_words(percent,score,"罗拉跑得快，那是全靠我来带！","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-14/02.jpg");
				deal_transit("d");
			}
			else{
				score=Math.floor(2500+(Math.random()*499));
				percent=Math.floor(90+(Math.random()*10));

				share_words(percent,score,"不是跟你吹，阿甘追我吃嘴灰！","http://myteamproject.oss-cn-beijing.aliyuncs.com/hxjj/7-14/01.jpg");
				deal_transit("e");
			}
        	mySwiper01.swipeNext();
		}

	}

	blow();

	$("#p3a_btn02,#p3b_btn02,#p3c_btn02,#p3d_btn02,#p3e_btn02").on("click",function(){
		// alert("click");
		$(".share").fadeIn(600).on("click",function(){
			$(".share").fadeOut(400);
		});
	});



	//点击关注按钮
	$(".p3-attention").on("click",function(){
		window.open("http://mp.weixin.qq.com/s?__biz=MzA4MDk3MDgxOA==&mid=207747019&idx=1&sn=cb706c76dc0622695953adb7e223b297&scene=1&from=groupmessage&isappinstalled=0#rd");
	});

});
