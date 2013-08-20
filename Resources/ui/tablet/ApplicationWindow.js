function ApplicationWindow(title) {
   //win = makeMyWindowView(title);//a small channge
   var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
   return win;
};

module.exports = ApplicationWindow;
