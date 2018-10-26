"use strict";
const debug = require("debug")("bot-express:skill");

const airtable =  require('../plugins/airtable');
const base = airtable.createClient();

const createclient = require('../plugins/contentful');
const client = createclient.createClient();

const flex = require('../service/line-message');

module.exports = class SkillCheckAmountDetail {

    
    constructor(){
    
        this.clear_context_on_finish = true;
console.log("注文No.：skill constructor");
         
    }   
    
    async finish(bot, event, context, resolve, reject){

console.log("購入詳細-finish");

        let orderno = context.intent.dialogflow.queryResult.queryText.replace("注文No. ","").replace("を確認する","");

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

