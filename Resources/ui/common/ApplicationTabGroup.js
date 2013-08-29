function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var //win1 = new Window(L('home')),
	win1 = new Window(L('StartPage'));
	win2= makeScratchSheetView(L('ScratchSheet')); 
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
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);

	//lets try this with a scrollable section
	//make the template
	var startPageTemplate = {
	      childTemplates: [
	    	{
	            type: 'Ti.UI.Label', // Use a label
	            bindId: 'fleetName',  // Bind ID for this label
	            properties: {        // Sets the Label.left property
	                left: '10dp'
	            }
	        }, 
	        {
	            type: 'Ti.UI.Label', // Use a label
	            bindId: 'fleetDistLabel',  // Bind ID for this label
	            properties: {        // Sets the Label.left property
	                left: '100dp'
	            }
	        }, 
	        {
	            type: 'Ti.UI.TextField', // Use a textField
	            bindId: 'distance',  // Bind ID for this field
	            properties: {        // Sets the field  properties
	             	left: '180dp',
	             	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			 	 	color: '#336699',
	  				width: 30, height: 20,
	            },
	            events : { 'return' : saveDistance}
	        },                
	        {
	            type: 'Ti.UI.Button',   // Use a button
	            bindId: 'startButton',       // Bind ID for this button
	            properties: {           // Sets several button properties
	                width: '80dp',
	                height: '30dp',                        	
	                right: '10dp',
	                title: 'Start'
	            },
	            events: { 'click' : startFleet }  // Binds a callback to the button's click event
	        }
	    ]
	};
	
	var listView = Ti.UI.createListView({
	    // Maps the plainTemplate object to the 'plain' style name
	    templates: { 'plain': startPageTemplate },
	    // Use the plain template, that is, the plainTemplate object defined earlier
	    // for all data list items in this list view
	    defaultItemTemplate: 'plain'               
	});

	//build the data set.  the fleets were dynamically created when we read in the boats
	var fleetSection = Ti.UI.createListSection({ headerTitle: 'Fleet'});
	var fleetDataSet = []; 	
	fleets.forEach(function(element, index, array) {
		fleetDataSet.push({
	        // Maps to the fleet component in the template
	        fleetName : { text: "Fleet " + element },
	        fleetDistLabel : {text : element + " Distance"},
	       	distance : {
	            itemId: element + "_distance",
	            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
	        },
	        // Sets the regular list data properties
	        properties : {
	            itemId: element + "_startButton",
	            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
	        }
    	});
	});
	
	var sections = [];
	fleetSection.setItems(fleetDataSet);
	sections.push(fleetSection);
	listView.sections = sections;
	win1.add(listView);
	
	return self;
	
	/**
	 * callback to start a fleet saving the timestamp and putting a checkmark on the row of the start page
	 */
	function startFleet(e){
		var now = new Date();
		var item = e.section.getItemAt(e.itemIndex);
		fleet = e.itemId.charAt(0);
		Ti.API.info('starting Fleet ' + fleet);
		startTimes[fleet] = now;
		if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
            item.properties.color = 'gray';
        }
        else {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        }
        e.section.updateItemAt(e.itemIndex, item);
	}
	
	/**
	 * callback to save the distance for a fleet
	 */
	function saveDistance(e){
		var item = e.section.getItemAt(e.itemIndex);
		Ti.API.info('Saving distance for ' + e.source.itemId+ " as " + e.value);
		fleet = e.source.itemId.charAt(0);
		distances[fleet] = e.value;
	}
	
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