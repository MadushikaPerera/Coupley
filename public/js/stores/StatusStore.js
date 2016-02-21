var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActivityFeedConstants = require('../constants/ActivityFeedConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var searchresults = [];
var searchID; 

var StatusStore = assign({},EventEmitter.prototype, {

    getStatusData: function() {
      console.log(searchresults);
      return searchresults;
    },
    saveStatusData: function(results) {
      console.log(results);
      searchresults = results;
    },
    getStatusID:function() {
      console.log(searchID);
      return searchID;
    },
    saveStatusID: function(id) {
      console.log(id);
      searchID = id;
    },
    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(payload) {
	switch(payload.action.actionType) {
		case(ActivityFeedConstants.GETDATA):
      console.log(payload.action.statusdata);
      StatusStore.saveStatusData(payload.action.statusdata);
      StatusStore.emitChange();
      break;
    case(ActivityFeedConstants.GETID):
      console.log(payload.action.id);
      StatusStore.saveStatusID(payload.action.id);
      StatusStore.emitChange();
      break;
	}
});

module.exports = StatusStore;