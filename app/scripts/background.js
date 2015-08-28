'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

var last = window.localStorage.last;

var check = function(){
	var regex = /abKW((\d{1,2}))/g;
	var kw = regex.exec(last);
	kw[1]++;
	var newit = last.replace(regex, 'abKW'+ kw[1]);
	
	console.log('check for new Plan: ', newit);
	$.get(newit).then(function(){
		console.info('found one', arguments);
		chrome.browserAction.setBadgeText({text: 'New'});
		chrome.notifications.create('one',{
			type: 'basic',
			title: 'Neuer Stundenplan für KW: '+kw[1],
			message: 'Es gibt nen neuen Plan',
			iconUrl: chrome.extension.getURL('images/icon-128.png')
		});
		window.localStorage.last = newit;
	},function(){
		console.info('found nothing');
	});

};


if (window.localStorage.options) {
	check();
	setInterval(function(){
		check();
	},1000*60*10);
}
