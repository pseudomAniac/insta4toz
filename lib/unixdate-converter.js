module.exports = function unxConverter(unxdate) {
	var date = new Date(unxdate*1000);
	var hours = date.getHours();
	var mins = date.getMinutes();
	return hours + ":" + mins; 
}