import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';



//Subcription
Meteor.subscribe('theResultAliexpress');
Meteor.subscribe('theResultAlibaba');
Meteor.subscribe('theResultEbay');

Template.search.events({

    'click #submitbut': function(event) {
        event.preventDefault(); //to avoid refreshing behaviour

        Meteor.call('RemoveAllResult');//removing all result before making and inserting new resul

        var sendObj = { keywords: $('#productName').val(), maxprice: $('#maxprice').val() };



        console.log(sendObj);
        //to see if Product name is not empty
        if (sendObj.keywords !==0) {
            //calling api and screen scrapping
            if ($('#ebay').is(':checked')) {

                Meteor.call('findProductByKeywordEbay', sendObj, function(error, res) {
                    if (!error) {

                        console.log("result succesfully stored for eBay");
                    } else {
                        console.log(error);
                    }
                });
            }
            if ($('#alibaba').is(':checked')) {
                Meteor.call('findProductByKeywordAlibaba', sendObj, function(error, res) {
                    if (!error) {

                        console.log("result succesfully stored for alibaba");
                    } else {
                        console.log(error);
                    }
                });
            }
            if ($('#aliexpress').is(':checked')) {
                Meteor.call('findProductByKeywordAliexpress', sendObj, function(error, res) {
                    if (!error) {

                        console.log("result succesfully stored for Aliexpress ");
                    } else {
                        console.log(error);
                    }
                });
            }


        }

    }
});



Template.ebayResult.helpers({
    'getEbayResult': function() {

        return ResultEbay.find().fetch();
    }

});

Template.ebayResult.events({
     'click .delete-todo': function(event){
        event.preventDefault();
        var documentId = this._id;
        console.log(documentId);
        //calling the server method and deleting the task 
        var confirm = window.confirm("Remove this product?");
        if(confirm){
            Meteor.call('removeItemEbayById', documentId, function(error, res) {
                    if (!error) {

                        console.log("removed succesfully eBay");
                    } else {
                        console.log(error);
                    }
                });//removing item here
        }
    }
});

Template.alibabaResult.events({
     'click .delete-todo': function(event){
        event.preventDefault();
        var documentId = this._id;
        console.log(documentId);
        //calling the server method and deleting the task 
        var confirm = window.confirm("Remove this product?");
        if(confirm){
            Meteor.call('removeItemAlibabaById', documentId, function(error, res) {
                    if (!error) {

                        console.log("removed succesfully Alibaba");
                    } else {
                        console.log(error);
                    }
                });//removing item here
        }
    }
});

Template.aliexpressResult.events({
     'click .delete-todo': function(event){
        event.preventDefault();
        var documentId = this._id;
        console.log(documentId);
        //calling the server method and deleting the task 
        var confirm = window.confirm("Remove this product?");
        if(confirm){
            Meteor.call('removeItemAliexpressById', documentId, function(error, res) {
                    if (!error) {

                        console.log("removed succesfully aliexpress");
                    } else {
                        console.log(error);
                    }
                });//removing item here
        }
    }
});

Template.alibabaResult.helpers({
    'getAlibabaResult': function() {
        return ResultAlibaba.find();
    }
});

Template.aliexpressResult.helpers({
    'getAliexpressResult': function() {
        return ResultAliexpress.find();
    }
});
