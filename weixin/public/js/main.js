
Vue.component('nav-bar',{
	template: 
	'<div class="navigationBar">' +
		'<div class="tab" v-on:click="clickTab">' +
			'<span></span>' +
			'<p>第一页</p>' +
	'</div>' +
		'<div class="tab" v-on:click="clickTab">' +
			'<span></span>' +
			'<p>第二页</p>' +
		'</div>' +
	'</div>',
	methods: {
		clickTab : function(event){
			console.log(event.target);
		}
	}
}) 

// var dataManager = {

// }

var questionCard = {
	props: ['question'],
	template:
	'<div class="mui-panel qustion-card">' +
	'<div class="content">{{question}}</div>' +
	'<div class="record-area"></div>' +
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

var app = new Vue({
	el: '#abc',
	data: {
		questions: [
			'第一个问题',
			'第二个问题',
			'第三个问题'
		]
	}
	,
	components: {
		'page': page
	}
};

// var swiper = new Swiper('.swiper-container', {
// 	pagination: '.swiper-pagination',
// 	paginationClickable: true
// });



// function record() {
// 	var localId = "",
// 		time_start = 0,
// 		totla_t = 0,
// 		timesUp;


// 	wx.ready(function () {
// 		$("record-area").on("touchstart", function (e) {
// 			e.preventDeafult || e.preventDefault();
// 			wx.startRecord();
// 		}).on("touched", function () {
// 			wx.stopRecord(function (res) {
// 				localId = res.localId;
// 			});
// 		})
// 	})
// }
// record();
