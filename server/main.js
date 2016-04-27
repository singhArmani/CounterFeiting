import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


//publication 
Meteor.publish('theResultAliexpress', function(){
    return ResultAliexpress.find();
});

Meteor.publish('theResultAlibaba', function(){
    return ResultAlibaba.find();
});

Meteor.publish('theResultEbay', function(){
    return ResultEbay.find();
});


var Xray = require('x-ray');
var x = Xray();

Meteor.methods({
    //Aliexpress
     RemoveAllResult : function(){
         ResultEbay.remove({}); //removing all result 
         ResultAliexpress.remove({}); 
         ResultAlibaba.remove({});
     },
         'findProductByKeywordAliexpress' : function(obj)
    {
        
        this.unblock();


            //aliexpress web scraping
            x('http://m.aliexpress.com/search.htm?keywords='+encodeURI(obj.keywords)+'&priceRange=0-'+encodeURI(obj.maxprice), 'li.product-item', 
                [{
                    productId: 'div.pro-inner a:first-child@prodid',
                    productName: 'div.pro-inner span:first-child',
                    productPrice: 'div.pro-inner span em'

                }]
             )
            
            (Meteor.bindEnvironment(function(err,resObj){
                console.log(resObj);

                ResultAliexpress.remove({}); //removing old collections before insertin new one 
                resObj.forEach(function(e){
                    ResultAliexpress.insert(e);
                });
                 //inserting into ResultAliexpress Collection
                
            }));
    },
   
   //Alibaba 
    'findProductByKeywordAlibaba' : function(obj)
    {
        
        this.unblock();
            //alibaba web scraping
            x('http://m.alibaba.com/trade/search?SearchText='+encodeURI(obj.keywords), 'div.product-info-wrap', 
                [{
                   
                    productName: 'h3.product-title',
                    productPrice: 'div.product-price.product-fob-wrap',
                }]
             )
            (Meteor.bindEnvironment(function(err,resObj){
                console.log(resObj);

                ResultAlibaba.remove({}); //removing old collections before insertin new one 
                resObj.forEach(function(e){
                    ResultAlibaba.insert(e);
                });
                ResultAlibaba.insert(resObj);  //inserting into the ResultAliexpress collection. 
                
            }));
    },

    'findProductByKeywordEbay' : function(obj){
        this.unblock();


    console.log("in server the object is "+obj);
        //preparing an ApI call here
    var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=Developm-SearchAp-PRD-338ccab7b-b1f75bea";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&REST-PAYLOAD";
    url += "&keywords="+encodeURI(obj.keywords);
    url += "&itemFilter(0).name=MaxPrice";
    url += "&itemFilter(0).value="+parseInt(obj.maxprice);
    url += "&itemFilter(0).paramName=Currency";
    url += "&itemFilter(0).paramValue=USD";
    url += "&paginationInput.entriesPerPage=20";

//New code with callback 
      try {
        var result = HTTP.get(url);
        //console.log("the resutl in try comes out to be: "+ result);
      } catch (error) {
        throw new Meteor.Error(error.getMessage());
      }
      if (result.statusCode === 200) {
        //console.log("ebay result is "+result.content);
         var parsedResult = parseDataIntoArray(result);

         //inserting result data into ResultEbay collection
         ResultEbay.remove({}); //remving the old eBay data. 
         parsedResult.forEach(function(e) {
            ResultEbay.insert(e);
         });
         
         return parsedResult;
      } else {
        throw new Meteor.Error('HTTP get status ' + result.statusCode);
      }
 }
});


var parseDataIntoArray = function(result)
{
   //code goes here
  // console.log("hi i am parsing function");

   //var someDummyArray = [{name:"aman"},{name:"Peter"}];

   var myObjectArray = [];
 
 //console.log(JSON.parse(result.content).findItemsByKeywordsResponse[0].searchResult[0].item);
    JSON.parse(result.content).findItemsByKeywordsResponse[0].searchResult[0].item.forEach(function(item,index) {
         //console.log("Item is: "+item+ "ends");
        // console.log('start');
         var requiredObject = {
             productId: item.itemId[0],
             productName: item.title[0],
             productPrice: item.sellingStatus[0].currentPrice[0].__value__,
             productImageUrl: item.galleryURL[0],
             productURL:item.viewItemURL[0]
         }
        console.log(requiredObject);
  myObjectArray.push(requiredObject);
            // productList.insert({
            //     productId: item.item[0].itemId[0],
            //     productName: item.item[0].title[0],
            //     productPrice: item.item[0].sellingStatus[0].currentPrice[0].__value__
            // });
        });
  //console.log(myObjectArray);
    return myObjectArray;
}







