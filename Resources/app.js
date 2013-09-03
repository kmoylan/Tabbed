/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

var startTimes = new Array();
var distances = new Array();
var fleetScratchData = new Array();
var fleets = new Array();
var tabGroup = Ti.UI.createTabGroup();

// This is a single context application with mutliple windows in a stack
(function() {
	
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	}
	else {
		Window = require('ui/handheld/ApplicationWindow');
	}
	
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Window).open();
})();
/**
 * what about adding the scratchSheet widget on this page once you click the button?
 * Have MakeScratchSheet return the listView instead of the window and then add the listView to this win
 */
function makeInitPage(title){
	
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	var theHTML;
	var h;
	var raceId;
	var raceName;
		
	var buttonLoadScratch = Ti.UI.createButton({
		height:44,
		width:400,
		title:L('Load Scratch Sheet'),
		top:150,
		left : 10
	});
	buttonLoadScratch.addEventListener('click', function() {
		c = Titanium.Network.createHTTPClient();
		url = 'http://www.regattaman.com/scratch.php?yr=2013&race_id=' + raceId + '&cancel_dest=def_event_page.php';
		Ti.API.info('url = ' + url);
		
	    c.open('GET', url);
	    c.onload = function()
			{
			    //label1.text= this.responseText;
			    theHTML=this.responseText;
			    //parse out the scratch sheet, then build the json file to be read by the scratchSheet window
			    /**
			     * The HTML looks like this :
			     * <table class = scratch ...>
			     *   <tr> 
			     *     <td class=fleet1 ....>  -- This is a new fleet
			     *   </tr>
			     *     <tr>  -- New Boat Data
			     * 	     <td> -- fleet
			     * 	     <td> -- skipper
			     * 	     <td> -- boat name
			     * 	     <td> -- yacht club
			     * 	     <td> -- sail number
			     * 	     <td> -- boat type
			     * 	     <td> --  Rating
			     * 	     <td> -- race rating
			     * 	     <td> -- cruise rating
			     * 	     <td> -- R/C
			     *    </tr>
			     *    <tr> -- New boat
			     * 	  <tr> -- New Boat
			     *    <tr class=fleet1> -- New Fleet
			     */
			     //Ti.API.info(theHTML);
			     
			    Ti.include('htmlparser.js');
			    Ti.include('soupselect.js');
			     
			    var select = soupselect.select;
				var handler = new htmlparser.DefaultHandler(function(err, dom) {
					if (err) {
						alert('Error: ' + err);
					} else {
						/*
						var img = select(dom, 'img');
				 
						img.forEach(function(img) {
							alert('src: ' + img.attribs.src);
						});
						*/
				 		//get all the TDs into an array
						var rows = select(dom, 'td');
				 		var i = 0;
				 		var boats = new Array();
				 		var myBoat = {}; 
						rows.forEach(function(row) {
							rowData = row.children[0].data;
							
							//Ti.API.info(i + ' ' + rowData);
							//build a boat, then push it to the boats array
							if (0 == i%10){
								//build a new boat, and store it's fleet
								myBoat = {};
								myBoat.fleet = rowData;
							} else {
								//add the rest of the stuff to the boat
								iString = i.toString();
								if (endsWith(iString, '1')){
									myBoat.skipper = rowData;
								}
								if (endsWith(iString, '2')){
									myBoat.name = rowData;
								}
								if (endsWith(iString, '3')){
									myBoat.town = rowData;
								}
								if (endsWith(iString, '4')){
									myBoat.sailNumber = rowData;
								}
								if (endsWith(iString, '5')){
									myBoat.boatType =rowData;
								}
								if (endsWith(iString, '6')){
									myBoat.rating =rowData;
								}
								if (endsWith(iString, '7')){
									myBoat.raceRating =rowData;
								}
								if (endsWith(iString, '8')){
									myBoat.cruiseRating = rowData;
								}
								if (endsWith(iString, '9')){
									myBoat.r_c =rowData;
									//and add the boat to the list of boats
									boats.push(myBoat);
								}
							}
							i++;
						});
						Ti.API.info('All Boats = ' + JSON.stringify(boats));
						var jsonOut = {};
						jsonOut.regattaName = raceName;
						jsonOut.boats = boats;
						Ti.API.info('jSon = ' + JSON.stringify(jsonOut));
						
						scratchListView = makeScratchSheetView(jsonOut);
						win.add(scratchListView);
						
						var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'testOut.txt');
						if(!f.write(JSON.stringify(jsonOut))) {
							Ti.API.info("could not write string to file.");
						}
						else {
							Ti.API.info("Wrote a file with " + f.size + " at " + f.resolve());
						}
					}
				});
			 
				var parser = new htmlparser.Parser(handler);
				parser.parseComplete(theHTML);
			     
			};
		c.send();
		
	});
	
	var raceIdField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  hintText: 'race Id',
	  color: '#336699',
	  top: 50, left: 150,
	  width: 150, height: 20,
	});
	var raceIdLabel = Titanium.UI.createLabel({
	    text:L('Race Id'),
	    left: 10 ,top : 50,
	});
	raceIdField.addEventListener('change', function(data) {
		if (isNaN(Number(data.source.value))){
			data.source.value = 0;
		}
		raceId = data.source.value;
	});
	
	var raceNameField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  hintText: 'Race Name',
	  color: '#336699',
	  top: 10, left: 150,
	  width: 150, height: 20,
	});
	var raceNameLabel = Titanium.UI.createLabel({
	    text:L('Race Name'),
	    left: 10 ,top : 10,
	});
	raceNameField.addEventListener('change', function(data) {

		raceName = data.source.value;
	});
	
    //var dom = Titanium.XML.parseString(theHTML);
    win.add(buttonLoadScratch);
	win.add(raceIdField);
	win.add(raceIdLabel);
	win.add(raceNameField);
	win.add(raceNameLabel);
   
    return win;
};

function jsonObject()
{
};

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function makeScratchSheetView(json){
	/**
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	**/

	var aFleetData = [];
	var bFleetData = [];
	var cFleetData = [];
	var dFleetData = [];
	var eFleetData = [];
	var fFleetData = [];
	var gFleetData = [];
	
	var aFleetStarted = false;
	var bFleetStarted = false;
	var cFleetStarted = false;
	var dFleetStarted = false;
	var eFleetStarted = false;
	var fFleetStarted = false;
	var gFleetStarted = false;

	
	//read in the scratch sheet, for now from a text file from the resources folder.
	//var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Scit_inv.txt');
	//var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'Scit_inv.txt');
	/**
	var f = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'testOut.txt');

	var contents = f.read();
	json = JSON.parse(contents.text);
	**/
	//sort it by handicap
	json.boats.sort(compare_boats_by_handicap);
		
	//make the template
	var plainTemplate = {
	    childTemplates: [
	    	{
	            type: 'Ti.UI.Label', // Use a label
	            bindId: 'sailNumber',  // Bind ID for this label
	            properties: {        // Sets the Label.left property
	                left: '10dp'
	            }
	        }, 
	        {
	            type: 'Ti.UI.Label', // Use a label
	            bindId: 'boatName',  // Bind ID for this label
	            properties: {        // Sets the Label.left property
	                left: '100dp'
	            }
	        },
	                         
	        {
	            type: 'Ti.UI.Button',   // Use a button
	            bindId: 'button',       // Bind ID for this button
	            properties: {           // Sets several button properties
	                width: '80dp',
	                height: '30dp',                        	
	                right: '10dp',
	                title: 'Finish'
	            },
	            events: { click : report }  // Binds a callback to the button's click event
	        },
	        { //just push this off
	        	type : 'Ti.UI.Label',
	        	bindId : 'boatfleet',
	        	properties : {left : 2000}
	        }
	    ]
	};

	function report(e) {
		var now = new Date();
		var item = e.section.getItemAt(e.itemIndex);
		var log;

		json.boats.forEach(function(boat, index, array) {
			//Ti.API.info('element = ' + element.name);
			if (boat.name == item['boatName']['text']){
				distance = distances[boat.fleet];
				startTime = startTimes[boat.fleet];
				switch (boat.fleet) {
					case 'A' :
						if (!aFleetStarted) {
							aFleetData.push({'startTime':startTime, 
											'distance':distance});
							aFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'aFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 			
						aFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					case 'B' :
						if (!bFleetStarted) {
							bFleetData.push({'startTime':startTime, 
											'distance':distance});
							bFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'bFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 
						bFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					case 'C' :
						if (!cFleetStarted) {
							cFleetData.push({'startTime':startTime, 
											'distance':distance});
							cFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'cFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 
						cFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					case 'D' :
						if (!dFleetStarted) {
							dFleetData.push({'startTime':startTime, 
											'distance':distance});
							dFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'dFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 
						dFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					case 'E' :
						if (!eFleetStarted){
							eFleetData.push({'startTime':startTime, 
											'distance':distance});
							eFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'eFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 
						eFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					case 'F' :
						if (!fFleetStarted){
							fFleetData.push({'startTime':startTime, 
											'distance':distance});
							fFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'fFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 
						fFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					case 'G' :
						if (!gFleetStarted){
							gbFleetData.push({'startTime':startTime, 
											'distance':distance});
							//log =  Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'gFleet.txt');
							gFleetStarted = true;
						}
						log =  Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'gFleet.txt');
						toc = Math.floor( (now.valueOf() - startTime.valueOf()) / 1000);
						//CT=ET - (Distance*PHRF/60) 
						correctedToc = toc - (distance *(boat.raceRating/60)); 
						gFleetData.push({'boatName':boat.name,
										 'finishTime' : now,
										 'totalTime' : toc,
										 'correctedTime':correctedToc});
						break;
					
				}

				//write a record to the file, not sure if we want this or not.
				log.write(boat.name + " : " + now + " : " + toc + " : " + correctedToc + "\n", true);
				
				Ti.API.info('A fleet data = ' + JSON.stringify(aFleetData));
				Ti.API.info('B fleet data = ' + JSON.stringify(bFleetData));
			}
		});

        if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
            item.properties.color = 'gray';
        }
        else {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        }
        e.section.updateItemAt(e.itemIndex, item);
	}
	
	var listView = Ti.UI.createListView({
	    // Maps the plainTemplate object to the 'plain' style name
	    templates: { 'plain': plainTemplate },
	    // Use the plain template, that is, the plainTemplate object defined earlier
	    // for all data list items in this list view
	    defaultItemTemplate: 'plain'               
	});
	
	var data = [];
	data = [
	    {
	        properties: {
	            title: 'Regatta :',
	            subtitle: json.regattaName,
	            image: 'KS_nav_views.png', // not used by this template
	            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
	        },
	        template: Ti.UI.LIST_ITEM_TEMPLATE_CONTACTS
	    }, 
	];
	
		
	var allFleetDataSet = [];
	
	json.boats.forEach(function(element, index, array) {
		//create the fleets array so we know how many fleets are in the regatta
		//this will be used to make sections on the finish page, and to make the start page
		if (fleets.indexOf(element.fleet) == -1) {
			fleets.push(element.fleet);
		}
		allFleetDataSet.push({
	        // Maps to the boatName component in the template
	        // Sets the text property of the Label component
	        boatName : { text: element.name },
	       	sailNumber : { text: element.sailNumber },

	        // Sets the regular list data properties
	        properties : {
	            itemId: element.sailNumber + "_" + element.name,
	            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
	        },
	        fleet : {text: element.fleet}
    	});

		
	});

	var sections = [];
	var fleetDataSet = new Array();
	fleets.forEach(function(fleetElement, fleetIndex, fleetArray) {
		allFleetDataSet.forEach(function(element, index, array) {
			if (element['fleet']['text'] == fleetElement){
				fleetDataSet.push(element);
			}
		});
		var myFleetSection = Ti.UI.createListSection({ headerTitle: fleetElement + ' Fleet'});
		myFleetSection.setItems(fleetDataSet);
		sections.push(myFleetSection);
		fleetDataSet = [];
	});
	//add the sections to the window
	
	listView.sections = sections;
	//win.add(listView);

	return listView;
}


function compare_boats_by_handicap(boat1, boat2){
	if (boat1.fleet.toLowerCase() == boat2.fleet.toLowerCase() && boat1.r_c.toLowerCase() == 'r') {
		if (parseInt(boat1.raceRating)< parseInt(boat2.raceRating))
	     return -1;
	 	if (parseInt(boat1.raceRating) > parseInt(boat2.raceRating))
	    return 1;
	} else {
		if (boat1.fleet.toLowerCase() == boat2.fleet.toLowerCase() && boat1.r_c.toLowerCase() == 'c') {
			if (parseInt(boat1.cruiseRating)< parseInt(boat2.cruiseRating))
		     return -1;
		 	if (parseInt(boat1.cruiseRating) > parseInt(boat2.cruiseRating))
		    return 1;
		}
	}
	
  return 0;
}

/** here's the old way of doing the scratch sheet data
 * 
 * var aFleetSection = Ti.UI.createListSection({ headerTitle: 'A Fleet'});
	var aFleetDataSet = []; 
	var bFleetSection = Ti.UI.createListSection({ headerTitle: 'B Fleet'});
	var bFleetDataSet = [];
	var cFleetSection = Ti.UI.createListSection({ headerTitle: 'C Fleet'});
	var cFleetDataSet = [];
	var dFleetSection = Ti.UI.createListSection({ headerTitle: 'D Fleet'});
	var dFleetDataSet = [];
	var eFleetSection = Ti.UI.createListSection({ headerTitle: 'E Fleet'});
	var eFleetDataSet = [];
	var fFleetSection = Ti.UI.createListSection({ headerTitle: 'F Fleet'});
	var fFleetDataSet = [];
	var gFleetSection = Ti.UI.createListSection({ headerTitle: 'G Fleet'});
	var gFleetDataSet = []; 
	var jFleetSection = Ti.UI.createListSection({ headerTitle: 'J Fleet'});
	var jFleetDataSet = [];

 * 
 * 
 * switch (element.fleet) {
			case 'A' :
				aFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	
	   			break;
			case 'B' :
				bFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;
			case 'C' :
				cFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;
			case 'D' :
				dFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;
			case 'E' :
				eFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;
	   	   	case'F' :
				fFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;
			case 'G' :
				gFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;
		    case 'J' :
				jFleetDataSet.push({
			        // Maps to the boatName component in the template
			        // Sets the text property of the Label component
			        boatName : { text: element.name },
			       	sailNumber : { text: element.sailNumber },
		
			        // Sets the regular list data properties
			        properties : {
			            itemId: element.sailNumber + "_" + element.name,
			            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
			        },
			        'fleet' : {text: element.fleet}
		    	});
		    	break;

		    }
 * 
 * 
 * 
	if (aFleetDataSet.length > 0){
		aFleetSection.setItems(aFleetDataSet);
		sections.push(aFleetSection);
	}
	if (bFleetDataSet.length > 0){
		bFleetSection.setItems(bFleetDataSet);
		sections.push(bFleetSection);
	}
	if (cFleetDataSet.length > 0){
		cFleetSection.setItems(cFleetDataSet);
		sections.push(cFleetSection);
	}
	if (dFleetDataSet.length > 0){
		dFleetSection.setItems(dFleetDataSet);
		sections.push(dFleetSection);
	}
	if (eFleetDataSet.length > 0){
		eFleetSection.setItems(eFleetDataSet);
		sections.push(eFleetSection);
	}
	if (fFleetDataSet.length > 0){
		fFleetSection.setItems(fFleetDataSet);
		sections.push(fFleetSection);
		}
	if (gFleetDataSet.length > 0){
		gFleetSection.setItems(gFleetDataSet);
		sections.push(gFleetSection);
		}
	if (jFleetDataSet.length > 0){
		jFleetSection.setItems(jFleetDataSet);
		sections.push(jFleetSection);
	}

 */