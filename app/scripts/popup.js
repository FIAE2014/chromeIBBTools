'use strict';
var baseLink = 'http://service.viona24.com/umschueler/daten/US_{department}_{firstyear}_{season}{class}{currentyear}_abKW{kw}.pdf';
var masterRegex = /US_([\w-]*)_(\d{4})_(Winter|Sommer)_([\w\.]*)_?(\d{4})_abKW(\d{1,2})(?:.pdf)?/g ;

chrome.browserAction.setBadgeText({text: 'Yo'});

function saveIntoCookie(){
	var obj =  {
		'department' : $('#department').val(),
		'firstyear' : $('#firstyear').val(),
		'season' : $('#season').val(),
		'class' : $('#class').val()
	};

	window.localStorage.setItem('options' , JSON.stringify(obj));
	window.localStorage.setItem('last' , $('#linkit').attr('href'));
	window.localStorage.setItem('next' , $('#nextlink').attr('href'));
}

function convertLinktoForm(evt){
	var val = evt.target.value;
	if (val.match(masterRegex)) {
		var fuck = masterRegex.exec(val);
		$('#department').val(fuck[1]);
		$('#firstyear').val(fuck[2]);
		$('#season').val(fuck[3]);
		if (fuck[4]) {$('#class').val(fuck[4].slice(0,fuck[4].length-1));}
	};
}

function KalenderWoche()
{
	var KWDatum = new Date();

	var DonnerstagDat = new Date(KWDatum.getTime() +
	(3-((KWDatum.getDay()+6) % 7)) * 86400000);

	var KWJahr = DonnerstagDat.getFullYear();

	var DonnerstagKW = new Date(new Date(KWJahr,0,4).getTime() +
	(3-((new Date(KWJahr,0,4).getDay()+6) % 7)) * 86400000);

	var KW = Math.floor(1.5 + (DonnerstagDat.getTime() -
	DonnerstagKW.getTime()) / 86400000/7);

	return KW;
}


var getPlan = function(){
	var baseLinkFilled = baseLink
		.replace('{department}' , $('#department').val())
		.replace('{firstyear}' , $('#firstyear').val())
		.replace('{season}' , $('#season').val())
		.replace('{currentyear}' , new Date().getFullYear());

	var thisWeek = baseLinkFilled.replace('{kw}' , KalenderWoche());
	var nextWeek = baseLinkFilled.replace('{kw}' , KalenderWoche()+1);


	if ($('#class').val()) {
		thisWeek = thisWeek.replace('{class}' , '_'+$('#class').val()+'_');
	}else{
		thisWeek = thisWeek.replace('{class}' , '_');
	}


	$.get(thisWeek).then(function(data){
		$('#linkit').show().attr('href' , thisWeek);
		$('#fakeform').hide();
		saveIntoCookie();
	}, function(){
		if (window.localStorage.options) {delete window.localStorage.options;}
		$('#linkit').show().html('Plan not found: '+thisWeek);
	});

	$.get(nextWeek).then(function(data){
		$('#nextlink').show().attr('href' , nextWeek);
	});
};









$(function(){
	$('#linkit, #nextlink').hide();
	$('#setup').click(function(event) {
		$('#fakeform').show();
	});
	$('#send').click(getPlan);
	$('#experimental')
		.keydown(convertLinktoForm)
		.change(convertLinktoForm)
		.on('paste' , convertLinktoForm);

	var obj = JSON.parse(window.localStorage.getItem('options'));
	if (obj) {
		$('#department').val(obj.department);
		$('#firstyear').val(obj.firstyear);
		$('#season').val(obj.season);
		$('#class').val(obj['class']);
	}

	if (window.localStorage.getItem('last')){$('#linkit').show().attr('href' , window.localStorage.getItem('last')); $('#fakeform').hide();};
	if (window.localStorage.getItem('next')) $('#nextlink').show().attr('href' , window.localStorage.getItem('next'));

});

