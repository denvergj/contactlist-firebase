var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var AppAPI = require('../utils/appAPI.js');

var CHANGE_EVENT = 'change';

var _contacts = [];
var _contact_to_edit = '';

var AppStore = assign({}, EventEmitter.prototype, {
	setContacts: function(contacts) {
		_contacts = contacts;
	},
	saveContact: function(contact) {
		_contacts.push(contact);
	},
	removeContact: function(contactId) {
		var index = _contacts.findIndex(x => x.id === contactId);
		_contacts.splice(index, 1);
	},
	setContactToEdit: function(contact) {
		_contact_to_edit = contact;	
	},
	updateContact: function(contact) {
		for(i = 0; i < _contacts.length;i++) {
			if(_contacts[i].id == contact.id) {
				_contacts.splice(i, 1);
				_contacts.push(contact);
			}
		}
	},
	getContactToEdit: function() {
		return _contact_to_edit;	
	},
	getContacts: function() {
		return _contacts;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action; 
	switch(action.actionType) {
		case AppConstants.SAVE_CONTACT:
			
			//Store Save.
			AppStore.saveContact(action.contact);
			
			//Save to Api.
			AppAPI.saveContact(action.contact);
			
			AppStore.emit('change');
		break;
		case AppConstants.RECEIVE_CONTACTS:
			
			AppStore.setContacts(action.contacts);
			
			AppStore.emit('change');
		break;
		case AppConstants.REMOVE_CONTACT:
			
			AppStore.removeContact(action.contactId);
			
			AppAPI.removeContact(action.contactId);
			
			AppStore.emit('change');
		break;
		case AppConstants.EDIT_CONTACT:
			
			AppStore.setContactToEdit(action.contact);
			
			AppStore.emit('change');
		break;
		case AppConstants.UPDATE_CONTACT:
			
			AppStore.updateContact(action.contact);
			
			AppAPI.updateContact(action.contact);
			
			AppStore.emit('change');
		break;
	}
	
	return true;
});


module.exports = AppStore;