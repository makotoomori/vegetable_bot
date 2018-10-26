'use strict';

require('date-utils');
const debug = require("debug")("bot-express:service");
const airtable =  require('../plugins/airtable');
const base = airtable.createClient();

module.exports = class ServiceLineMessage {

    static flex_message(){

        let value = {
            "type": "flex",
            "altText": "金子農園 - 購入履歴",
            "contents":{                        
                "type": "bubble",
                "styles": {
                  "footer": {
                    "separator": true
                  }
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "金子農園 - 購入履歴",
                      "weight": "bold",
                      "color": "#1DB446",
                      "size": "lg"
                    },
                    {
                      "type": "separator",
                      "margin": "md"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "margin": "xxl",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "horizontal",
                          "contents": [
                            {
                              "type": "text",
                              "text": "品名",
                              "size": "xs",
                              "color": "#555555"
                            },
                            {
                              "type": "text",
                              "text": "購入数",
                              "size": "xs",
                              "color": "#555555"
                            },
                            {
                              "type": "text",
                              "text": "配達日",
                              "size": "xs",
                              "color": "#111111",
                              "align": "end"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "separator",
                      "margin": "md"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "margin": "xxl",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "horizontal",
                          "contents": [
                            {
                              "type": "text",
                              "text": "人参",
                              "size": "xs",
                              "color": "#555555",
                              "action":
                                {  
                                  "type":"message",
                                  "label":"Yes",
                                  "text":"Yes"
                                }
                            },
                            {
                              "type": "text",
                              "text": "3本",
                              "size": "xs",
                              "color": "#555555"
                            },
                            {
                              "type": "text",
                              "text": "2018-10-10",
                              "size": "xs",
                              "color": "#111111",
                              "align": "end"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "margin": "xxl",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "horizontal",
                          "contents": [
                            {
                              "type": "text",
                              "text": "人参",
                              "size": "xs",
                              "color": "#555555"
                            },
                            {
                              "type": "text",
                              "text": "3本",
                              "size": "xs",
                              "color": "#555555"
                            },
                            {
                              "type": "text",
                              "text": "2018-10-10",
                              "size": "xs",
                              "color": "#111111",
                              "align": "end"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
        return value;
    }

    static flex_format_saleshistory(){
console.log("++flex_format_saleshistory:よばれました++");        
        let value={
            "type": "flex",
            "altText": "金子農園-flex message",
            "contents":{
                "type": "bubble",
                "header":{                        
                    "type": "box",
                    "layout": "vertical",            
                    "contents": [
                        {
                            "type": "text",
                            "text": "金子農園 - 購入履歴",
                            "weight": "bold",
                            "color": "#1DB446",
                            "size": "lg"
                        },
                        {
                            "type": "separator",
                            "margin": "md"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "margin": "xxl",
                            "spacing": "sm",
                            "contents": [
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "品名",
                                        "size": "xs",
                                        "color": "#555555"
                                    },
                                    {
                                        "type": "text",
                                      "text": "購入数",
                                      "size": "xs",
                                      "color": "#555555"
                                    },
                                    {
                                        "type": "text",
                                        "text": "配達日",
                                        "size": "xs",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                  ]
                            }
                            ] 
                        },
                        {
                          "type": "separator",
                          "margin": "md"
                        }
                    ]
                },
            }       
        };
        return value;
    }
    static async get_items(item){
        let value={
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": `${item.get('Name')}` ,
                        "size": "xs",
                        "color": "#555555",
                        "action":
                          {  
                            "type":"message",
                            "label":"注文No.",
                            "text":"注文No. " + item.get('Sales_ID')+ "を確認する"
                          }
                      },
                      {
                        "type": "text",
                        "text": `${item.get('Quantity')}` ,
                        "size": "xs",
                        "color": "#555555",
                        "action":
                        {  
                          "type":"message",
                          "label":"注文No.",
                          "text":"注文No. " + item.get('Sales_ID')+ "を確認する"
                        }
                      },
                      {
                        "type": "text",
                        "text": `${item.get('Delivery_Date')}` ,
                        "size": "xs",
                        "color": "#111111",
                        "align": "end",
                        "action":
                        {  
                          "type":"message",
                          "label":"注文No.",
                          "text":"注文No. " + item.get('Sales_ID')+ "を確認する"
                        }
                      }
                    ]
                  }
                ]
        };
        return value;
    }

    static async set_item(simei,pageNo,num){
        let value = this.flex_format_saleshistory();
        value.contents.body ={};
        value.contents.body.type = "box";
        value.contents.body.layout = "vertical";
        value.contents.body.contents = [];

        let eachpage = await base('sales_vetable').select({
            view: "Default",
            sort: [{field: "Delivery_Date", direction: "desc"}],
            filterByFormula:'{Simei} = ' + '"' + simei + '"'                        
        });
        let count=0;
        await eachpage.eachPage(function page(records, fetchNextPage){
            records.forEach(function(item) {
                count++;
                if( (pageNo-1)*num < count && count <= (pageNo*num) ){
                    let items={
                        "type": "box",
                        "layout": "vertical",
                        "margin": "xxl",
                        "spacing": "sm",
                        "contents": [
                          {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                              {
                                "type": "text",
                                "text": `${item.get('Name')}` ,
                                "size": "xs",
                                "color": "#555555",
                                "action":
                                  {  
                                    "type":"message",
                                    "label":"注文No.",
                                    "text":"注文No. " + item.get('Sales_ID')+ "を確認する"
                                  }
                              },
                              {
                                "type": "text",
                                "text": `${item.get('Quantity')}` ,
                                "size": "xs",
                                "color": "#555555",
                                "action":
                                {  
                                  "type":"message",
                                  "label":"注文No.",
                                  "text":"注文No. " + item.get('Sales_ID')+ "を確認する"
                                }
                              },
                              {
                                "type": "text",
                                "text": `${item.get('Delivery_Date')}` ,
                                "size": "xs",
                                "color": "#111111",
                                "align": "end",
                                "action":
                                {  
                                  "type":"message",
                                  "label":"注文No.",
                                  "text":"注文No. " + item.get('Sales_ID')+ "を確認する"
                                }
                              }
                            ]
                          }
                        ]
                    };
                    //let items = this.get_items(record);
                    value.contents.body.contents.push(items);
                }
            });
            fetchNextPage();
        });
        if(count > (pageNo*num) ){
            let footer={
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "style": "primary",
                        "color": "#905c44",
                        "action": {
                          "type": "postback",
                          "label": "もっとみる",
                          "data":"2",
//                          "text":"もっとみる"
                        }
                      }
                    ]
            }
            value.contents.footer = footer;
        }
        return value;
    }
    static flex_format_sales_detail(item){
      let value ={
        "type": "flex",
        "altText": "金子農園-flex message",
        "contents":{        
          "type": "bubble",
          "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "金子農園 - 詳細",
              "weight": "bold",
              "color": "#1DB446",
              "size": "lg",
              "align": "center"
            }
/*
            {
              "type": "text",
              "text": "(支払い済み)",
              "size": "xs",
              "color": "#111111",
              "align": "center"
            }
*/            
            ]
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [         
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "品名",
                      "size": "md",
                      "color": "#555555"
                    },
                    {
                      "type": "text",
                      "text": "購入数",
                      "size": "md",
                      "color": "#555555"
                    },
                    {
                      "type": "text",
                      "text": "金額",
                      "size": "md",
                      "color": "#111111",
                      "align": "end"
                    }
                  ]
                }
              ]
              },
              {
              "type": "separator",
              "margin": "xs"
              },
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "xs",
            "contents": "",
          }
        }
      }

      if(item.get('pay')){
        let header_value = {
          "type": "text",
          "text": "(支払い済み)",
          "size": "xs",
          "color": "#111111",
          "align": "center"
        }
        value.contents.header.contents.push(header_value);
      }

      if(item){
        let body_value = 
        {
          "type": "box",
          "layout": "vertical",
          "margin": "xxl",
          "spacing": "xs",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": `${item.get('Name')}` ,
                  "size": "md",
                  "color": "#555555",
                },
                {
                  "type": "text",
                  "text": `${item.get('Quantity')}`,
                  "size": "md",
                  "color": "#555555"
                },
                {
                  "type": "text",
                  "text": "¥"+`${item.get('Amount')}`,
                  "size": "md",
                  "color": "#111111",
                  "align": "end"
                }
              ]
            }
          ]
        }
        value.contents.body.contents.push(body_value);

        let sales_date = new Date(item.get('Date'));

        let footer_value = [
          {
            "type": "separator",
            "margin": "xs"
          },
          {
            "type": "text",
            "text": "注文No.：" + item.get('Sales_ID'),
            "size": "xs",
            "color": "#111111",
            "align": "center"
          },
          {
            "type": "text",
            "text": "配達日：" + item.get('Delivery_Date'),
            "size": "xs",
            "color": "#111111",
            "align": "center"
          },
          {
            "type": "text",
            "text": "購入日：" + sales_date.toFormat('YYYY-MM-DD'),
            "size": "xs",
            "color": "#111111",
            "align": "center"
          },
          {
            "type": "spacer",
            "size": "xs"
          }
        ]

        //value.contents.footer.contents= [];
        value.contents.footer.contents = footer_value;

      }
      return value;
  }
}
