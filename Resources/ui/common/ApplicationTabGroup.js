function ApplicationTabGroup(Window) {
	//create module instance
	//var self = Ti.UI.createTabGroup();

	//create app tabs
	var //win1 = new Window(L('home')),
	//win1 = new Window(L('StartPage'));
	//win2 = makeScratchSheetView(L('ScratchSheet')); 
	win3 = makeInitPage(L('Init Page'));

	var tab1 = Ti.UI.createTab({
		title: L('StartPage'),
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	win1.containingTab = tab1;

	var tab2 = Ti.UI.createTab({
		title: L('ScratchSheet'),
		icon: '/images/KS_nav_views.png',
		window: win2
	});
	win2.containingTab = tab2;
	
	var tab3 = Ti.UI.createTab({
		title: L('Initialize'),
		icon: '/images/KS_nav_views.png',
		window: win3
	});
	win3.containingTab = tab3;

	/**
	self.addTab(tab3);	
	self.addTab(tab1);
	//self.addTab(tab2);
	*/
	tabGroup.addTab(tab3);
	tabGroup.addTab(tab2);
	tabGroup.addTab(tab1);

	makeInitPage();

	return tabGroup; //self;


};


module.exports = ApplicationTabGroup;


	/** This was the old way to make the start page, now using the listView
	 * 
	 *
	var buttonStartA = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('startAFleet'),
		top:50,
		left : 10
	});
	buttonStartA.addEventListener('click', function() {
		aStartTime = new Date(); 
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'aFleet.txt');
		log.write("A Fleet Start ="+aStartTime+'\n', true);
	});
	var aDistanceField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  hintText: 'A',
	  color: '#336699',
	  top: 10, left: 150,
	  width: 50, height: 20,
	});
	var aFleetDistLabel = Titanium.UI.createLabel({
	    text:'A ' + L('fleetDistance'),
	    left: 10 ,top : 10,
	});
	aDistanceField.addEventListener('return', function(data) {
		if (isNaN(Number(data.source.value))){
			data.source.value = 0;
		}

		Ti.API.info("A Fleet Distance ="+data.source.value);
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'aFleet.txt');
		log.write("A Fleet Distance ="+data.source.value+'\n', true);
		aFleetDistance = data.source.value;
	});
	win1.add(aFleetDistLabel);
	win1.add(aDistanceField);
	win1.add(buttonStartA);
	
	var buttonStartB = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('startBFleet'),
		top :50,
		left : 300
	});
	buttonStartB.addEventListener('click', function() {
		bStartTime = new Date(); 
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'bFleet.txt');
		log.write("B Fleet Start ="+bStartTime+'\n', true);
	});
	var bFleetDistLabel = Titanium.UI.createLabel({
	    text:'B '  + L('fleetDistance'),
	    left: 300 ,top : 10,
	});
	var bDistanceField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  hintText: 'B',
	  color: '#336699',
	  top: 10, left: 450,
	  width: 50, height: 20,
	});
	bDistanceField.addEventListener('return', function(data) {
		if (isNaN(Number(data.source.value))){
			data.source.value = 0;
		}
		Ti.API.info("B Fleet Distance ="+data.source.value);
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'bFleet.txt');
		log.write("B Fleet Distance ="+data.source.value+'\n', true);
		bFleetDistance = data.source.value;
	});
	win1.add(buttonStartB);
	win1.add(bFleetDistLabel);
	win1.add(bDistanceField);
	
	var buttonStartC = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('startCFleet'),
		top:150,
		left : 10
	});
	buttonStartC.addEventListener('click', function() {
		aStartTime = new Date(); 
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'cFleet.txt');
		log.write("C Fleet Start ="+aStartTime+'\n', true);
	});
	var cDistanceField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  hintText: 'C',
	  color: '#336699',
	  top: 110, left: 150,
	  width: 50, height: 20,
	});
	var cFleetDistLabel = Titanium.UI.createLabel({
	    text:'C ' + L('fleetDistance'),
	    left: 10 ,top : 110,
	});
	cDistanceField.addEventListener('return', function(data) {
		if (isNaN(Number(data.source.value))){
			data.source.value = 0;
		}

		Ti.API.info("C Fleet Distance ="+data.source.value);
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'cFleet.txt');
		log.write("C Fleet Distance ="+data.source.value+'\n', true);
		cFleetDistance = data.source.value;
	});
	win1.add(cFleetDistLabel);
	win1.add(cDistanceField);
	win1.add(buttonStartC);
	
	
	var buttonStartD = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('startDFleet'),
		top :150,
		left : 300
	});
	buttonStartD.addEventListener('click', function() {
		bStartTime = new Date(); 
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'dFleet.txt');
		log.write("D Fleet Start ="+bStartTime+'\n', true);
	});
	var dFleetDistLabel = Titanium.UI.createLabel({
	    text:'D '  + L('fleetDistance'),
	    left: 300 ,top : 110,
	});
	var dDistanceField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  hintText: 'D',
	  color: '#336699',
	  top: 110, left: 450,
	  width: 50, height: 20,
	});
	dDistanceField.addEventListener('return', function(data) {
		if (isNaN(Number(data.source.value))){
			data.source.value = 0;
		}
		Ti.API.info("D Fleet Distance ="+data.source.value);
		var log = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'dFleet.txt');
		log.write("D Fleet Distance ="+data.source.value+'\n', true);
		dFleetDistance = data.source.value;
	});
	win1.add(buttonStartD);
	win1.add(dFleetDistLabel);
	win1.add(dDistanceField);
	*
	* 
	*/