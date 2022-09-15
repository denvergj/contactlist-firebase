var Firebase = require('firebase');
var AppActions = require('../actions/AppActions');

// Initialize Firebase
var config = {
	apiKey: "AIzaSyA9j78omqzBvXnCnL-q0g9S1FblzSiF6C0",
	authDomain: "contactlistdenver.firebaseapp.com",
	databaseURL: "https://contactlistdenver.firebaseio.com",
	storageBucket: "contactlistdenver.appspot.com"
};

Firebase.initializeApp(config); 

module.exports = {
	saveContact: function(contact) {
		
		Firebase.database().ref('/contacts/').push({
			contact: contact
		});
	},
	getContacts: function() {
		Firebase.database().ref('/contacts/').once("value").then(function(snapshot) {
			var contacts = [];
			
			$.each(snapshot.val(), function(key, record) {
			   var contact = {
					id: key,
					name: record.contact.name,
					phone: record.contact.phone,
					email: record.contact.email,
				}
				contacts.push(contact);
				AppActions.receiveContacts(contacts);
			}); 
		});
	},
	removeContact: function(contactId) {
		Firebase.database().ref('/contacts/'+contactId).remove();
	},
	updateContact: function(contact) {
		var id = contact.id;
		var updatedContact = {
			name: contact.name,
			phone: contact.phone,
			email: contact.email,
		};
		
		Firebase.database().ref('/contacts/'+contact.id+'/contact/')
				.update(updatedContact);
	}
}