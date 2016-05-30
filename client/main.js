import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';



//Subcription
// Meteor.subscribe('theResultAliexpress');
//  Meteor.subscribe('theResultAlibaba');
// Meteor.subscribe('theResultEbay');
Meteor.subscribe('exportItems');

//version of Meteor.subscribe that is stopped when the template is destroyed
Template.ebayResult.onCreated(function () {
    //use this.subscribe inside the onCreted callback
    this.subscribe('theResultEbay');
});

Template.alibabaResult.onCreated(function () {
    //use this.subscribe inside the onCreted callback
    this.subscribe('theResultAlibaba');
});

Template.aliexpressResult.onCreated(function () {
    //use this.subscribe inside the onCreted callback
    this.subscribe('theResultAliexpress');
});

Template.search.events({

    'click #submitbut': function(event) {
        event.preventDefault(); //to avoid refreshing behaviour
        var currentUser = Meteor.userId();
        Meteor.call('RemoveAllResult',currentUser);//removing all result before making and inserting new resul

        var sendObj = { keywords: $('#productName').val(), maxprice: $('#maxprice').val() };

        if(Meteor.userId()) {
            if (sendObj.keywords !== 0) {
                //calling api and screen scrapping
                if ($('#ebay').is(':checked')) {

                    Meteor.call('findProductByKeywordEbay', sendObj, function (error, res) {
                        if (!error) {

                            console.log("result succesfully stored for eBay");
                        } else {
                            console.log(error);
                        }
                    });
                }
                if ($('#alibaba').is(':checked')) {
                    Meteor.call('findProductByKeywordAlibaba', sendObj, function (error, res) {
                        if (!error) {

                            console.log("result succesfully stored for alibaba");
                        } else {
                            console.log(error);
                        }
                    });
                }
                if ($('#aliexpress').is(':checked')) {
                    Meteor.call('findProductByKeywordAliexpress', sendObj, function (error, res) {
                        if (!error) {

                            console.log("result succesfully stored for Aliexpress ");
                        } else {
                            console.log(error);
                        }
                    });
                }


            }
        }
        else {
            console.log("can't do search as user is not logged in!");
        }

    }
});



Template.ebayResult.helpers({
    'getEbayResult': function() {

        return ResultEbay.find().fetch();
    },
    'checked':function() {
        return this.checked ? "checked":"";
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
    },

    'change [type=checkbox]':function(){
        var documentID = this._id;
        var isChecked =  this.checked;

        if(isChecked){
            //making a sever method call
            Meteor.call('checkEbayItemFalse', documentID, function(error,res){
               if(!error){
                console.log("updated to false");
            }
            else {
                console.log(error);
            }
            });
        }else {
            //making a server method call 

            Meteor.call('checkEbayItemTrue',documentID, function(error,res){
                if(!error){
                console.log("updated to true");
            }
        else {
                console.log(error);
            }
        });
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
    },

    'change [type=checkbox]':function(){
        var documentID = this._id;
        var isChecked =  this.checked;

        if(isChecked){
            //making a sever method call
            Meteor.call('checkAlibabaItemFalse', documentID, function(error,res){
                if(!error){
                    console.log("updated to false");
                }
                else {
                    console.log(error);
                }
            });
        }else {
            //making a server method call

            Meteor.call('checkAlibabaItemTrue',documentID, function(error,res){
                if(!error){
                    console.log("updated to true");
                }
                else {
                    console.log(error);
                }
            });
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
    },
    'change [type=checkbox]':function(){
        var documentID = this._id;
        var isChecked =  this.checked;

        if(isChecked){
            //making a sever method call
            Meteor.call('checkAliexpressItemFalse', documentID, function(error,res){
                if(!error){
                    console.log("updated to false");
                }
                else {
                    console.log(error);
                }
            });
        }else {
            //making a server method call

            Meteor.call('checkAliexpressItemTrue',documentID, function(error,res){
                if(!error){
                    console.log("updated to true");
                }
                else {
                    console.log(error);
                }
            });
        }

    }

});

Template.alibabaResult.helpers({
    'getAlibabaResult': function() {
        return ResultAlibaba.find();
    },
    'checked':function() {
        return this.checked ? "checked":"";
    }                                      
});

Template.aliexpressResult.helpers({
    'getAliexpressResult': function() {
        return ResultAliexpress.find();
    },
    'checked':function() {                 
        return this.checked ? "checked":"";
    }                                      
});

Template.export.events({
    'click #download': function (e) {
        //creating a single json object
        let ebayResult = ResultEbay.find({checked:true},{fields:{productPortal:1,productId:1,productName:1,productPrice:1,productURL:1,_id:0}}).fetch();
        let alibabaResult = ResultAlibaba.find({checked:true},{fields:{productPortal:1,productId:1,productName:1,productPrice:1,productURL:1,_id:0}}).fetch();
        let aliexpress = ResultAliexpress.find({checked:true},{fields:{productPortal:1,productId:1,productName:1,productPrice:1,productURL:1,_id:0}}).fetch();
        let allFinalItems = (ebayResult.concat(alibabaResult)).concat(aliexpress);

        csv = json2csv(allFinalItems, true, true);
        e.target.href = "data:text/csv;charset=utf-8," + escape(csv)
        e.target.download = "reportItems.csv";
    }
});

Template.selectAll.events({
    'change [type=checkbox]': function (event) {

        //upon selecting all option all items should be selected
        if($('#selectAll').is(':checked')){
            Meteor.call('selectAll',function(error,res){
                if(!error){
                    console.log("all items all marked now");
                } 
                else{
                    console.log(error);
                }
            });
        }
        else {
            console.log("all items are unchecked now");
            Meteor.call('deselectAll',function(error,res){
                if(!error){
                    console.log("all items all unmarked now");
                }
                else{
                    console.log(error);
                }
            });
        }

    }
});


Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
});

(function(){
    new Clipboard('.btn');
})();