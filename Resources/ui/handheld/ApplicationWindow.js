function ApplicationWindow(title) {
	win = makeMyWindow(title);
   return win;

};

function makeTheOldWay(){
	//oringinal button, I don't think we need it
	var button = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('openWindow'),
		top:20
	});
	button.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title: L('newWindow'),
			backgroundColor: 'white'
		}));
	});
	//self.add(button);
	
	var buttonTime = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('timeCheck'),
		top:100
	});
	//self.add(buttonTime);
	
	var buttonViewEntries = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('viewEntries'),
		bottom:20
	});
	self.add(buttonViewEntries);
	
	buttonTime.addEventListener('click', function() {
		var currentdate = new Date(); 
		Ti.API.info('Somebody clicked your cool button at :' + currentdate + ' for ' + buttonTime.title);
		Ti.API.info('I want to read files from ' +Ti.Filesystem.applicationDataDirectory);
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Scit_inv.txt');
		var contents = f.read();
		Ti.API.info('Output text of the file: '+contents.text);
		json = JSON.parse(contents.text);
		Ti.API.info('Super = '+ json.boats[0].name);
		json.boats.forEach(function(element, index, array) {
			Ti.API.info(element.name + ' = ' + element.sailNumber);
		})
	});
	
	buttonViewEntries.addEventListener('click', function(){
		var webview = Titanium.UI.createWebView({url:'http://www.regattaman.com/scratch.php?yr=2013&race_id=95&cancel_dest=def_event_page.php'});
    	var window = Titanium.UI.createWindow();
    	window.add(webview);
    	window.open({modal:true});
    	var homeButton = Ti.UI.createButton({
			height:44,
			width:200,
			title:L('closeMe'),
			bottom:20
		});
		window.add(homeButton);
		homeButton.addEventListener('click', function(){
			window.close();
		});
	});
	
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Scit_inv.txt');
		var contents = f.read();
		Ti.API.info('Output text of the file: '+contents.text);
		json = JSON.parse(contents.text);
		Ti.API.info('Super = '+ json.boats[0].name);
		buttonPos = 20;
		json.boats.forEach(function(element, index, array) {
			Ti.API.info(element.name + ' = ' + element.sailNumber);
			var myButton = Ti.UI.createButton({
				height:44,
				width:200,
				title:element.sailNumber + " " + element.name,
				top:buttonPos
			});
			self.add(myButton);
			myButton.addEventListener('click', function() {
				var currentdate = new Date(); 
				Ti.API.info('Somebody clicked your cool button at :' + currentdate + ' for ' + myButton.title);
			});
			buttonPos += 50;
		});
	/*
	var buttonCreate = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('makeButtons'),
		top:300
	});
	self.add(buttonCreate);
	
	buttonCreate.addEventListener('click', function(){
		//var webview = Titanium.UI.createWebView({url:'http://www.regattaman.com/scratch.php?yr=2013&race_id=95&cancel_dest=def_event_page.php'});
    	var window = Titanium.UI.createWindow();
		//here
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Scit_inv.txt');
		var contents = f.read();
		Ti.API.info('Output text of the file: '+contents.text);
		json = JSON.parse(contents.text);
		Ti.API.info('Super = '+ json.boats[0].name);
		buttonPos = 20;
		json.boats.forEach(function(element, index, array) {
			Ti.API.info(element.name + ' = ' + element.sailNumber);
			var myButton = Ti.UI.createButton({
				height:44,
				width:200,
				title:element.name,
				top:buttonPos
			});
			window.add(myButton);
			buttonPos += 50;
		});
		var homeButton = Ti.UI.createButton({
			height:44,
			width:200,
			title:L('closeMe'),
			bottom:20
		});
		window.add(homeButton);
		homeButton.addEventListener('click', function(){
			window.close();
		});
	});
	**/
}
module.exports = ApplicationWindow;
