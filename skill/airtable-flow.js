"use strict";
require('date-utils');
const nanoid = require("nanoid");
const debug = require("debug")("bot-express:skill");
Promise = require('bluebird');
const airtable =  require('../plugins/airtable');
const base = airtable.createClient();

const contentful = require('../plugins/contentful');
const client = contentful.createClient();

const dialogflow = require("../service/dialogflow.js");

module.exports = class SkillAirtableFlow {

    constructor(){
        this.clear_context_on_finish = true;
console.log("skill constructor");
        this.required_parameter = { 
            vege1: {
                message_to_confirm: async (bot, event, context, resolve, reject) =>{

                    var columns=[];
                    let vege_items = await client.getEntries({
                        'content_type': 'vegetable',
                    });
                    bot.queue({
                        type: "text",
                        text: `金子農園のお野菜購入です`
                    });
                    bot.queue({
                        type: "text",
                        text: `購入した野菜はロフトワークに持っていきます`
                    });
                    bot.queue({
                        type: "text",
                        text: `購入したいものをタッチして選んで下さい`
                    });
                    await vege_items.items.forEach(function(entry){
                        if(entry.fields.name) {
                        }
                        var actions = [
                            {
                                "type":"message",
                                "label":"購入",
                                "text": entry.fields.name
                            },
                            {
                                "type":"message",
                                "label":"購入しない",
                                "text": " "
                            }
                        ];
                        columns.push({
                            "thumbnailImageUrl": "https:" + entry.fields.image.fields.file.url,
                            "title": `${entry.fields.name} 単価：${entry.fields.price}`,
                            "text": `${entry.fields.description}` , 
                            "actions":actions,
                        });
                    });
                    let value = {
                        "type": "template",
                        "altText": "金子農園の野菜たち",
                        "template": {
                            "type": "carousel",
                            "imageAspectRatio":"square",
                            "columns": columns,
                        }
                    }
//console.log(JSON.stringify(value));

                    return Promise.resolve(value); 
                },
      
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return Promise.resolve();

//console.log("reaction");
//console.log(JSON.stringify(event.source.userId));
                    bot.queue({
                        type: "text",
                        text: `${value}ですね。`
                    });
                    Promise.resolve();
                }
            },
            
            quantity:{
                message_to_confirm: async (bot, event, context, resolve, reject) =>{
                    let actions =[];

console.log("unit:message_to_confirm"); 
                    let vege_items = await client.getEntries({
                        'content_type': 'vegetable',
                        'fields.name': context.confirmed.vege1                        
                    });

                    await vege_items.items.forEach(async function(entry){

console.log(JSON.stringify(entry.fields.count));             
                        entry.fields.count.forEach(function(item){
                            actions.push({
                                "type":"message",
                                "label":item + entry.fields.unit,
                                "text": item + entry.fields.unit
                            });
                        })
                    });
                    let value = {
                        "type": "template",
                        "altText": "いくつ購入されますか？",
                        "template": {
                            "type": "buttons",
                            "text": "いくつ購入されますか？",
                            "actions": actions,
                        }
                    }
                    return Promise.resolve(value); 
                },
                reaction:async (error, value, bot, event, context, resolve, reject) => {

                    bot.queue({
                        type: "text",
                        text: `${value}ですね。`
                    });

                    bot.queue({
                        type: "text",
                        text: "お名前を確認中..."
                    });

                    let firstpage = await base('user').select({
                        view: "Default",
                        maxRecords:1,
                        filterByFormula:'{Line_ID} = ' + '"' + event.source.userId + '"'                        
                    });

                    let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });
                    let simei;
                    if(records.length == 1){
                        simei = records[0].get('Name');
                        bot.queue({
                            type: "text",
                            text: `${simei}さんですね。`
                        });
                        context.confirmed.name = simei;
                    }else{
console.log("0件");                          
                        bot.collect({
                            name:{
                                message_to_confirm: {
                                    type: "text",
                                    text: "登録されておりませんでした。名前を入力して下さい"
                                },                                    
                                reaction:  (error, value, bot, event, context, resolve, reject) => {
                                    return Promise.resolve({simei:value})
                                },                            
                            }
                        });  
                    }
                    Promise.resolve();
                },
            },
            
            delivery:{
                message_to_confirm: async (bot, event, context, resolve, reject) =>{
console.log("delivery:message_to_confirm");
                    let now = new Date();
                    let deli_date = new Date();
                    let vege_items = await client.getEntries({
                        'content_type': 'vegetable',
                        'fields.name': context.confirmed.vege1                        
                    });
                    await vege_items.items.forEach(async function(entry){          
                        //vege_items.fields.period
                        deli_date.setDate(deli_date.getDate() + entry.fields.period);
                    });

console.log(JSON.stringify(deli_date));                  

                    bot.queue({
                        type: "text",
                        text: `配達してもらいたい日を選択して下さい`
                    });

                    //airtableの確認
                    let firstpage = await base('calender').select({
                        view: "Default",
//                        filterByFormula:'"' + now.toFormat('YYYY-MM-DD') + '"' + ' <= {配達可能日} <= ' + '"' + deli_date.toFormat('YYYY-MM-DD') + '"'   
                        filterByFormula: '{配達可能日} <= ' + '"' + deli_date.toFormat('YYYY-MM-DD') + '"'
                    });                    
                    
                    let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });

                    let columns = [];
                    records.forEach(function(item){

                        if(item.get('配達可能日') >= now.toFormat('YYYY-MM-DD')){
                            columns.push({
                                "title": "ロフトワークへの配達可能日",
                                "text": "※希望通りに配達出来ない場合があります。" , 
                                "actions":[
                                    {
                                        "type":"message",
                                        "label":`${item.get('配達可能日')}に配達する`,
                                        "text": item.get('配達可能日')
                                    },
                                ],
                            });
                        }
                    });
                    let value = {
                        "type": "template",
                        "altText": "配達日をいつにしますか？",
                        "template": {
                            "type": "carousel",
                            "columns": columns,
                        }
                    }                    
console.log(records);
//records[0].get('Name');
                    return Promise.resolve(value);
                },
            }            
        }        
    }   
    async finish(bot, event, context, resolve, reject){
        let record_id;
        let now = new Date();
        const id = nanoid(7);
        let price;
        
        let vege_items = await client.getEntries({
            'content_type': 'vegetable',
            'fields.name': context.confirmed.vege1                        
        });
        await vege_items.items.forEach(async function(entry){          
            //vege_items.fields.period
            price = entry.fields.price;
        });


        let firstpage = await base('user').select({
            view: "Default",
            maxRecords:1,
            filterByFormula:'{Line_ID} = ' + '"' + event.source.userId + '"'                        
        });

        let records = await firstpage.firstPage().catch(error => { console.log("+++" + error+ "+++") });

        if(records.length == 0){
            let record = await base('user').create({
                    "Line_ID":event.source.userId ,
                    "Name":context.confirmed.name
            }).catch(error => { console.log("+++" + error+ "+++") });

            record_id = record.id    
        }else{
            record_id = records[0].id;
        }
        let amount = parseInt(price,10) * parseInt(context.confirmed.quantity.substring(0,1),10);

        let record = await base('sales_vetable').create({
                        "Sales_ID": id,
                        "Name": context.confirmed.vege1,
                        "Amount":amount,
                        "Price": price,
                        "Quantity":Number(context.confirmed.quantity.substring(0,1)),
                        "Unit":context.confirmed.quantity.substring(context.confirmed.quantity.length-1,context.confirmed.quantity.length),
                        "Date": now.toFormat('YYYY-MM-DDTHH24:MI:SS.000'),
                        "Delivery_Date":context.confirmed.delivery,
                        "link":[record_id]
        }).catch(error => { console.log("+++" + error+ "+++") });

        //dialogflowのintentを取得
        let intent_id = await dialogflow.get_intent_id();

        if(intent_id){
            //dialogflowのintentを削除
            await dialogflow.delete_intent(intent_id)
        }


        let training_phrases =[];

        training_phrases.push({
            type: "TYPE_EXAMPLE",
            parts:[{text:"aiueo"}]
        })

        training_phrases.push({
            type: "TYPE_EXAMPLE",
            parts:[{text:"kakikukeko"}]
        })

        let eachpage = await base('sales_vetable').select({
            view: "Default",
        });
        await eachpage.eachPage(function page(records, fetchNextPage){
            records.forEach(function(record) {
               training_phrases.push({
                    type: "TYPE_EXAMPLE",
                    parts:[{text:"注文No." + record.get('Sales_ID') + "を確認する"}]    
                });
            });
            fetchNextPage();
        });


console.log("++airtable-flow++");
console.log("++"+JSON.stringify(training_phrases) + "++");        
        //dialogflowのintentを追加
        await dialogflow.add_intent({
            "name": "金子農園-注文No.",
            "training_phrase": training_phrases,
            "action": "check-amount-detail"
        })
        
        let message;
        if(record){
            message = `${context.confirmed.name}さん。合計¥${amount}です。\n`; 
            message = message + `それでは、${context.confirmed.delivery}に${context.confirmed.vege1}を${context.confirmed.quantity}持っていきますね`;
        }else{
            message = `エラーが発生したみたいです。もう一度、行って下さい`;
        }

        //★★ここで再度もどらせる事をやっても良いかも★★

        return bot.reply({
            type: "text",
            text: message
        }).then((response) => {
            return Promise.resolve(response);
        });            
    }

}

