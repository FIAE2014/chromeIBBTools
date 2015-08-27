'use strict';
var baseLink = 'http://service.viona24.com/umschueler/daten/US_{department}_{firstyear}_{season}{class}{currentyear}_abKW{kw}.pdf';

function saveIntoCookie(){
	var obj =  {
		'department' : $('#department').val(),
		'firstyear' : $('#firstyear').val(),
		'season' : $('#season').val(),
		'class' : $('#class').val()
	};

	window.localStorage.setItem('options' , JSON.stringify(obj));
	window.localStorage.setItem('last' , $('#linkit').attr('href'));
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
	var thislink = baseLink
		.replace('{department}' , $('#department').val())
		.replace('{firstyear}' , $('#firstyear').val())
		.replace('{season}' , $('#season').val())
		.replace('{currentyear}' , new Date().getFullYear())
		.replace('{kw}' , KalenderWoche());

	if ($('#class').val()) {
		thislink = thislink.replace('{class}' , '_'+$('#class').val()+'_');
	}else{
		thislink = thislink.replace('{class}' , '_');
	}


	$.get(thislink).then(function(data){
		console.log(data);
		$('#linkit').show().attr('href' , thislink);
		saveIntoCookie();
	}, function(){
		if (window.localStorage.options) {delete window.localStorage.options;}
		$('#linkit').show().html('Plan not found: '+thislink);
	});
};









$(function(){
	$('#linkit').hide();

	$('#send').click(getPlan);

	var obj = JSON.parse(window.localStorage.getItem('options'));
	if (obj) {
		$('#department').val(obj.department);
		$('#firstyear').val(obj.firstyear);
		$('#season').val(obj.season);
		$('#class').val(obj['class']);
	}

});

