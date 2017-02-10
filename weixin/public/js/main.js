
var dataManager = {

}

window.ontouchmove = function (e) {
	var evt = e || event;
	evt.returnValue = false;
}
window.onmousemove = function (e) {
	var evt = e || event;
	evt.returnValue = false;
}


var questionCard = {
	props: ['question'],
	methods: {
		startRecord: function () {
			e.preventDeafult || e.preventDefault();
			wx.startRecord();
		},
		finishRecord: function () {
			wx.stopRecord(function (res) {
				localId = res.localId;
			});
		}
	},
	template:
	'<div class="mui-panel qustion-card">' +
	'<div class="content">{{question}}</div>' +
	'<div class="record-area" v-on:touchstart="startRecord" v-on:touched="finishRecord"></div>' +
	'</div>'
};

var page = {
	props: ['question'],
	template:
	'<section class="swiper-slide">' +
	'<question-card v-bind:question="question"></question-card>' +
	'</section>',
	components: {
		'question-card': questionCard
	}

}

// var input = {
// 	template: '<div>' +
// 				'<input class="">'+

// 			  '</div>',
// 	props: ['classname','initValue'],
// 	data: function(){
// 		return {
// 			value : initValue
// 		}
// 	}
// }

var login = {
	template: '<section id="login" class="swiper-slide">' +
	'<div class="qustion-card">' +
	'<input class="username" v-model="user" placeholder="edit me">' +
	'<input class="password" v-model="pwd" placeholder="edit me">' +
	'<p>{{user}} {{pwd}}</p>' +
	'<button type="submit" v-on:click="handd">login</button>' +
	'</div>' +
	'</section>',
	props: ['isLogin'],
	data: function () {
		return {
			user: "user",
			pwd: "pwd"
		}
	},
	methods: {
		handd: function (event) {
			alert(1);
		}
	}
};

var navBar = Vue.component('navigation-bar', {
	template: '<div></div>',
	data: function(){
		return {
			
		}
	}
})


var app = new Vue({
	el: '#swiper_container',
	data: {
		message: "123",
		isLogin: false,
		questions: [
			'第一个问题',
			'第二个问题',
			'第三个问题'
		]
	},
	components: {
		'page': page,
		'login': login
	}
})




var swiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
	paginationClickable: true
});





function record() {
	var localId = "",
		time_start = 0,
		totla_t = 0,
		timesUp;

	wx.ready(function () {
		$("record-area").on("touchstart", function (e) {

		}).on("touched", function () {

		})
	})
}
record();



	// //点击关注按钮
	// $(".p3-attention").on("click",function(){
	// 	window.open("http://mp.weixin.qq.com/s?__biz=MzA4MDk3MDgxOA==&mid=207747019&idx=1&sn=cb706c76dc0622695953adb7e223b297&scene=1&from=groupmessage&isappinstalled=0#rd");
	// });