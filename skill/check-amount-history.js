"use strict";
const debug = require("debug")("bot-express:skill");
Promise = require('bluebird');
const airtable =  require('../plugins/airtable');
const base = airtable.createClient();

const createclient = require('../plugins/contentful');
const client = createclient.createClient();

const flex = require('../service/line-message');

module.exports = class SkillCheckAmountHistory {

    async begin(bot, event, context, resolve, reject){
console.log("購入履歴-begin"); 
        let firstpage = await base('user').select({
            view: "Default",
            maxRecords:1,
            filterByFormula:'{Line_ID} = ' + '"' + event.source.userId + '"'                        
        });                                              

        let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });
        let eachpage = await base('sales_vetable').select({
            view: "Default",
            sort: [{field: "Delivery_Date", direction: "desc"}],
            filterByFormula:'{Simei} = ' + '"' + records[0].get('Name') + '"'                        
        });

        records = await eachpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });

        if(records.length == 0){
            bot.reply({
                "type":"text",
                "text": "まだ、購入されたことがないようです"
            })                        
            this.clear_context_on_finish = true;
            return;
        }else{
            bot.collect("list");
            return Promise.resolve();
        }
    }
    constructor(){
        this.clear_context_on_finish = true;
    
console.log("購入履歴：skill constructor");
        this.required_parameter = { 
 
        }
        this.optional_parameter = {
            list: {
                message_to_confirm: async (bot, event, context, resolve, reject) =>{
console.log("購入履歴：skill list");
                    let message,simei;
                    //let value = flex.flex_format_saleshistory();
                    let value;
                    //チェックついていないものを並べる
                    //購入した順位
                    let firstpage = await base('user').select({
                        view: "Default",
                        maxRecords:1,
                        filterByFormula:'{Line_ID} = ' + '"' + event.source.userId + '"'                        
                    });                                              

                    let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });
            
console.log(records.length);                                
                    if(records.length == 0){
                    }else{
                        simei = records[0].get('Name');
                    
                        if(simei){
                            value = await flex.set_item(simei,1,10);
                        }
                    }
//console.log("+++" + JSON.stringify(value)+ "+++");                      
                    return Promise.resolve(value); 
                },                
                reaction: async (error, value, bot, event, context, resolve, reject) => {

                    console.log("reaction" + JSON.stringify(value));

                    if(value.data){
                        let pageNo = parseInt(value.data,10);

                        context.confirmed.list=pageNo;
                        let simei;
                                    
                        bot.collect("list2");
                    }else{
                        //bot.collect("detail");
                    }
                    return Promise.resolve();
                }
            },            
            list2:{
                message_to_confirm: async (bot, event, context, resolve, reject) =>{
                    let value;
                    let simei;
                    let pageNo=0;
console.log("list2 - message_to_confirm:" + JSON.stringify(value));
console.log("list2 - message_to_confirm context.confirmed.list:" + context.confirmed.list);
                    pageNo = parseInt(context.confirmed.list,10);
                    let firstpage = await base('user').select({
                        view: "Default",
                        maxRecords:1,
                        filterByFormula:'{Line_ID} = ' + '"' + event.source.userId + '"'                        
                    });                                              

                    let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });
                                
                    if(records.length == 0){
                        message = "まだ、購入されたことがないようです";

                    }else{
                        simei = records[0].get('Name');
                    }

                    value = await flex.set_item(simei,pageNo,10);
                    if(value.contents.footer){
                        value.contents.footer.contents[0].action.data=pageNo+1;
                    }
                    return Promise.resolve(value);
                },                                    
                reaction:  (error, value, bot, event, context, resolve, reject) => {
                
                    if(value.data){
                        let pageNo = parseInt(value.data,10);

                        context.confirmed.list=pageNo;                        
                        bot.collect("list2");
                    }else{
                        context.confirmed.list = value;
                    }
                    return Promise.resolve(value);
                },                            
            },
                    
        }                
    }   

    async finish(bot, event, context, resolve, reject){

console.log("購入履歴-finish");

        let orderno = context.confirmed.list.replace("注文No. ","").replace("を確認する","");

console.log(orderno);
        let message;
        let firstpage = await base('sales_vetable').select({
            view: "Default",
            maxRecords:1,
            filterByFormula:'{Sales_ID} = ' + '"' + orderno + '"'                        
        });

        let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });

        if(records.length == 0){
            message="該当の注文No.相当するレコードが存在していませんでした"
        }else{
          //message= "注文No.は" + records[0].get('Sales_ID') + "はありました";
            message = flex.flex_format_sales_detail(records[0]);
        }
        
        bot.reply_to_collect(message).then((response) =>{
            return Promise.resolve(response);
        })
   
    }

}

