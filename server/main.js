import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
});

// ExportItems.remove({}); //removing all items

//this is just a change I am making  
//publication 
Meteor.publish('theResultAliexpress', function() {

    if(this.userId) {
        return ResultAliexpress.find({productSearchedBy: this.userId});
    }
});

Meteor.publish('theResultAlibaba', function() {

    if(this.userId) {
        return ResultAlibaba.find({productSearchedBy: this.userId});
    }
});

Meteor.publish('theResultEbay', function() {
      if(this.userId) {
          return ResultEbay.find({productSearchedBy: this.userId});
      }
});
//
// Meteor.publish('exportItems', () =>{
//     return ExportItems.find();
// });

var Xray = require('x-ray');
var x = Xray();

Meteor.methods({
    //Aliexpress
    RemoveAllResult: function(currentUser) {
        console.log("the current user is :"+currentUser);
        ResultEbay.remove({productSearchedBy:currentUser}); //removing all results

        ResultAliexpress.remove({productSearchedBy:currentUser});
        ResultAlibaba.remove({productSearchedBy:currentUser});
    },
    removeItemEbayById: function(id) {
        ResultEbay.remove({ _id: id }); //removing the item as per the id
    },
    removeItemAlibabaById: function(id) {
        ResultAlibaba.remove({ _id: id }); //removing the item as per the id
    },
    removeItemAliexpressById: function(id) {
        ResultAliexpress.remove({ _id: id }); //removing the item as per the id
    },
    selectAll: function () {
        if(ResultEbay.find().count() >=0) {
            ResultEbay.update({}, {$set: {checked: true}}, {multi: true});
        }
        if(ResultAlibaba.find().count() >=0){
            ResultAlibaba.update({}, {$set: {checked: true}}, {multi: true});
        }
        if(ResultAliexpress.find().count() >=0){
            ResultAliexpress.update({}, {$set: {checked: true}}, {multi: true});
        }

    },
    deselectAll: function(){
        if(ResultEbay.find().count() >=0) {
            ResultEbay.update({}, {$set: {checked: false}}, {multi: true});
        }
        if(ResultAlibaba.find().count() >=0) {
            ResultAlibaba.update({}, {$set: {checked: false}}, {multi: true});
        }
        if(ResultAliexpress.find().count() >=0) {
            ResultAliexpress.update({}, {$set: {checked: false}}, {multi: true});
        }
    },
    checkEbayItemFalse:function (documentID) {
        ResultEbay.update({_id:documentID}, {$set:{checked:false}});
    },
    checkEbayItemTrue: function(documentID){
        ResultEbay.update({_id:documentID}, {$set:{checked:true}});
    },
    checkAlibabaItemFalse:function (documentID) {
        ResultAlibaba.update({_id:documentID}, {$set:{checked:false}});
    },
    checkAlibabaItemTrue: function(documentID){
        ResultAlibaba.update({_id:documentID}, {$set:{checked:true}});
    },
    checkAliexpressItemFalse:function (documentID) {
        ResultAliexpress.update({_id:documentID}, {$set:{checked:false}});
    },
    checkAliexpressItemTrue: function(documentID){
        ResultAliexpress.update({_id:documentID}, {$set:{checked:true}});
    },

    'findProductByKeywordAliexpress': function(obj) {

        this.unblock();


        //aliexpress web scraping
        // x('http://m.aliexpress.com/search.htm?keywords=' + encodeURI(obj.keywords) + '&priceRange=0-' + encodeURI(obj.maxprice), 'li.product-item', [{
        //     productId: 'div.pro-inner a:first-child@prodid',
        //     productName: 'div.pro-inner span:first-child',
        //     productPrice: 'div.pro-inner span em'
        //
        // }])
        //
        // (Meteor.bindEnvironment(function(err, resObj) {
        //     console.log(resObj);
        //
        //     ResultAliexpress.remove({}); //removing old collections before insertin new one
        //     resObj.forEach(function(e) {
        //         ResultAliexpress.insert(e);       //inserting into ResultAliexpress Collection
        //     });
        //
        //
        // }));


        //trying calling the get api
        for(i=1;i<10;i++){
            var url = 'https://m.aliexpress.com/search/productListJson.htm?keywords='+encodeURI(obj.keywords)+'+&sortType=MAIN&shippingCountry=AU&viewtype=1&page='+i+'&version=3|1|1';
            try{
                var result = HTTP.get(url);
                console.log(result.content);
                console.log("end result");
            } catch (error) {
                throw new Meteor.Error(error.getMessage());
            }

            if(result.statusCode ===200){
                var parsedResult = parseDataIntoArrayAliexpress(result);
                //ResultAliexpress.remove({});
                parsedResult.forEach(function(e){
                    ResultAliexpress.insert(e);
                });
            }
        }

    },

    //Alibaba 
    'findProductByKeywordAlibaba': function(obj) {

        this.unblock();
        //alibaba web scraping
        for(i= 1;i<=10;i++) {
            // x('http://m.alibaba.com/products/' + encodeURI(obj.keywords) + '/'+i+'.html', 'div.product-info-wrap', [{
            //
            //     productName: 'h3.product-title',
            //     productPrice: 'div.product-price.product-fob-wrap'
            // }])
            // (Meteor.bindEnvironment(function (err, resObj) {
            //     console.log(resObj);
            //
            //     resObj.forEach(function (e) {
            //         ResultAlibaba.insert(e);
            //     });
            //
            //
            // }));

            //New technique for alibaba
            var url = 'https://m.alibaba.com/products/'+encodeURI(obj.keywords)+'/'+i+'.html?spm=a2706.7843299.0.0.cszzEG&XPJAX=1&_=1462861673376';
            try{
                var result = HTTP.get(url);
                console.log(result.content);
                console.log("end result");
            } catch (error) {
                throw new Meteor.Error(error.getMessage());
            }

            if(result.statusCode ===200){
                var parsedResult = parseDataIntoArrayAlibaba(result);
                //ResultAliexpress.remove({});
                parsedResult.forEach(function(e){
                    ResultAlibaba.insert(e);
                });
            }
        }
    },

    'findProductByKeywordEbay': function(obj) {
        this.unblock();

        var result;
        console.log("in server the object is " + obj);
        //preparing an ApI call here
        var url = "http://svcs.ebay.com/services/search/FindingService/v1";
        url += "?OPERATION-NAME=findItemsByKeywords";
        url += "&SERVICE-VERSION=1.0.0";
        url += "&SECURITY-APPNAME=Developm-SearchAp-PRD-338ccab7b-b1f75bea";
        url += "&GLOBAL-ID=EBAY-US";
        url += "&RESPONSE-DATA-FORMAT=JSON";
        url += "&REST-PAYLOAD";
        url += "&keywords=" + encodeURI(obj.keywords);
        url += "&itemFilter(0).name=MaxPrice";
        url += "&itemFilter(0).value=" + parseInt(obj.maxprice);
        url += "&itemFilter(0).paramName=Currency";
        url += "&itemFilter(0).paramValue=USD";
        url += "&paginationInput.entriesPerPage=20";

        //New code with callback 
        try {
              result = HTTP.get(url);
            //console.log("the resutl in try comes out to be: "+ result);
        } catch (error) {
            throw new Meteor.Error(error.getMessage());
        }
        if (result.statusCode === 200) {
            //console.log("ebay result is "+result.content);
            var parsedResult = parseDataIntoArrayEbay(result);

            //inserting result data into ResultEbay collection
           // ResultEbay.remove({}); //remving the old eBay data.
            parsedResult.forEach(function(e) {
                ResultEbay.insert(e);
                console.log(ResultEbay.find().fetch());
            });

            //return parsedResult;
        } else {
            throw new Meteor.Error('HTTP get status ' + result.statusCode);
        }
    }
    //export item
    // 'exportItemEbay': function(obj){
    //     //inserting into the
    //     ExportItems.insert({
    //         "productURL": obj
    //     });
    // },
    // 'removeItemEbay': function(obj){
    //     ExportItems.remove({
    //         productURL:obj
    //     });
    // }
});


var parseDataIntoArrayEbay = function(result) {
    //code goes here
    // console.log("hi i am parsing function");

    //var someDummyArray = [{name:"aman"},{name:"Peter"}];

    var myObjectArray = [];

    //console.log(JSON.parse(result.content).findItemsByKeywordsResponse[0].searchResult[0].item);
    JSON.parse(result.content).findItemsByKeywordsResponse[0].searchResult[0].item.forEach(function(item, index) {
        //console.log("Item is: "+item+ "ends");
        // console.log('start');
        var requiredObject = {
            productSearchedBy: Meteor.userId(),
            productPortal:'eBay',
            productId: item.itemId[0],
            productName: item.title[0],
            productPrice: item.sellingStatus[0].currentPrice[0].__value__,
            productImageUrl: item.galleryURL[0],
            productURL: item.viewItemURL[0],
            checked:false
        };
       // console.log(requiredObject);
        myObjectArray.push(requiredObject);
        // productList.insert({
        //     productId: item.item[0].itemId[0],
        //     productName: item.item[0].title[0],
        //     productPrice: item.item[0].sellingStatus[0].currentPrice[0].__value__
        // });
    });
    //console.log(myObjectArray);
    return myObjectArray;
};


var parseDataIntoArrayAliexpress = function(result){

    var myObjectArray = [];
    JSON.parse(result.content).productList.forEach(function(item,index){
        var reqObj = {
            productSearchedBy: Meteor.userId(),
            productPortal:'AliExpress',
            productId: item.id,
            productName: item.subject,
            productImageUrl: item.img_url,
            productURL:item.detailUrl,
            productPrice: item.maxAmount.value,
            checked:false
        };
        //console.log(reqObj);
        myObjectArray.push(reqObj);
    });
    return myObjectArray;
};

var parseDataIntoArrayAlibaba = function(result){
    var myObjectArray = [];
    JSON.parse(result.content).productNormalList.forEach(function (item){
        var reqObj = {
            productSearchedBy: Meteor.userId(),
            productPortal:'Alibaba',
            productId :item.id,
            productName :item.productName,
            productImageUrl:item.imagePath,
            productURL: item.productDetailUrl,
            productPrice:item.fobPriceTo,
            checked:false
        };
       // console.log(reqObj);
        myObjectArray.push(reqObj);
    });
    return myObjectArray;
}