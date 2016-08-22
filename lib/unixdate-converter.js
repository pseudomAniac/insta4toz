module.exports = function unxConverter(unxdate) {
	var date = new Date(unxdate*1000);
	var hours = date.getHours();
	var mins = date.getMinutes();
	return hours + ":" + mins; 
}

exports.townsList = ["Port Moresby","Lae","Arawa","Mount Hagen","Madang","Wewak","Goroka","Kokopo","Popondetta","Aitape","Rabaul","Kimbe","Tabubil","Daru","Kavieng","Alotau","Vanimo","Bulolo","Kiunga","Kundiawa","Mendi","Kainantu","Lorengau","Ialibu","Kerema","Ningerum","Wau","Wabag","Rabaul"];