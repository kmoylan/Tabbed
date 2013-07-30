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

function makeMyWindowView(title){
		var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Scit_inv.txt');
		var contents = f.read();
		Ti.API.info('Output text of the file: '+contents.text);
		json = JSON.parse(contents.text);
		Ti.API.info('Super = '+ json.boats[0].name);
		buttonPos = 20;
		
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
	        }
	    ]
	};

	function report(e) {
		var now = new Date();
		Ti.API.info(e.itemId + " finished at " + now);
		
		var item = e.section.getItemAt(e.itemIndex);
		Ti.API.info(item);
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
	
	var aFleetSection = Ti.UI.createListSection({ headerTitle: 'A Fleet'});
	var aFleetDataSet = []; 
	var bFleetSection = Ti.UI.createListSection({ headerTitle: 'B Fleet'});
	var bFleetDataSet = []; 
	/**/
	



	
	json.boats.forEach(function(element, index, array) {
		if (element.class == 'A'){
			aFleetDataSet.push({
		        // Maps to the boatName component in the template
		        // Sets the text property of the Label component
		        boatName : { text: element.name },
		       	sailNumber : { text: element.sailNumber },
	
		        // Sets the regular list data properties
		        properties : {
		            itemId: element.sailNumber + "_" + element.name,
		            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
		        }
	    	});
	   }
	   if (element.class == 'B'){
			bFleetDataSet.push({
		        // Maps to the boatName component in the template
		        // Sets the text property of the Label component
		        boatName : { text: element.name },
		       	sailNumber : { text: element.sailNumber },
	
		        // Sets the regular list data properties
		        properties : {
		            itemId: element.sailNumber + "_" + element.name,
		            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
		        }
	    	});
	   }
	});
	
	var sections = [];

	aFleetSection.setItems(aFleetDataSet);
	sections.push(aFleetSection);
	bFleetSection.setItems(bFleetDataSet);
	sections.push(bFleetSection);
	listView.sections = sections;
	win.add(listView);
	
	var aFleetDistLabel = Titanium.UI.createLabel({
	    text:'A Fleet Distance',
	    left: 10 ,bottom : 30,
	});
	var aDistanceField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  color: '#336699',
	  bottom: 30, left: 150,
	  width: 50, height: 20,
	});
	aDistanceField.addEventListener('return', function(data) {
		Ti.API.info("A Fleet Distance ="+data.source.value);
	});
	win.add(aFleetDistLabel);
	win.add(aDistanceField);
	
	var bFleetDistLabel = Titanium.UI.createLabel({
	    text:'B Fleet Distance',
	    left: 10 ,bottom : 10,
	});
	var bDistanceField = Ti.UI.createTextField({
	  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	  color: '#336699',
	  bottom: 10, left: 150,
	  width: 50, height: 20,
	});
	bDistanceField.addEventListener('return', function(data) {
		Ti.API.info("B Fleet Distance ="+data.source.value);
	});
	win.add(bFleetDistLabel);
	win.add(bDistanceField);

	return win;
}
