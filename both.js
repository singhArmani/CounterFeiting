ResultAlibaba = new Mongo.Collection('resultsAlibaba'); //results storage for Alibaba search
ResultAliexpress = new Mongo.Collection('resultsAliexpress'); //results storage for Aliexpress search
ResultEbay = new Mongo.Collection('resultsEbay'); //results storage for eBay search

// ExportItems = new Mongo.Collection('exportItems');

// Router.route('/csv',{
//     where:'server',
//     action: function(){
//         console.log("I am running on server");
//         var filename = 'reportItem.csv';
//         var fileData = '';
//        
//         var headers = {
//             'Content-type': 'text/csv',
//             'Content-Disposition': "attachment;filename="+filename
//         };
//         var checkedRecords = ResultEbay.find({checked:true}); //getting item which are checked
//         console.log("the export record is"+checkedRecords);
//         checkedRecords.forEach((rec) => {
//            fileData += rec.productURL +"," + rec.productName+","+ rec.productId+","+ rec.productPrice+","+"\r\n";
//         });
//        
//         this.response.writeHead(200,headers);
//         return this.response.end(fileData);
//     }
// });