"use strict";
require('date-utils');
const nanoid = require("nanoid");
const debug = require("debug")("bot-express:skill");
Promise = require('bluebird');

module.exports = class SkillHelpFlow {

    constructor(){
        this.clear_context_on_finish = true;
console.log("SkillHelpFlow constructor");
        this.required_parameter = { 
            help_menu: {
                message_to_confirm: async (bot, event, context, resolve, reject) =>{

                    var columns=[];
                    let form_kind=["お支払いについて","キャンセルについて","その他お問い合わせ"]
                    await form_kind.forEach(function(value){
                        var actions = [
                            {
                                "type":"message",
                                "label":"確認する",
                                "text": `${value}`
                            },
                        ];
                        columns.push({
                            "title": `${value}`,
                            "text": `${value}`,
                            "actions":actions,
                        });
                    });
                    let value = {
                        "type": "template",
                        "altText": "金子農園-ヘルプ",
                        "template": {
                            "type": "carousel",
                            "columns": columns,
                        }
                    }

                    return Promise.resolve(value); 
                },
      
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return Promise.resolve();

                    Promise.resolve(value);
                }
            },
        },
        this.optional_parameter = {
            cancel: {
            },
            payment:{

            },
            inquiry:{

            }
        }
    }   
    async finish(bot, event, context, resolve, reject){
console.log("SkillHelpFlow - finish");    
console.log(context.confirmed.help_menu);
        let message;
        if(context.confirmed.help_menu == "お支払いについて"){
            message = `支払いは購入したお野菜をロフトワークに配達した際に現金でお支払い頂ければと思います。\n`;
            message = message + `一応、Kyashという個人間での送金アプリでも支払い可能です。\n`;
            message = message + `以下のIDまでに購入したお野菜の金額を送金頂ければと思います。\n`;
            message = message + `kyash id：oomori`;
        }else if(context.confirmed.help_menu == "キャンセルについて"){
            message = `買いすぎてしまったや間違えてしまったなどのキャンセルですが、\n`;
            message = message + `配達日の3日前までにお願いします。\n`;
            message = message + `キャンセルについて以下フォームより内容をご連絡下さい。\n`
            message = message + `https://kanekofarm41.typeform.com/to/cf6tTQ`;
        }else if(context.confirmed.help_menu == "その他お問い合わせ"){
            message = `何か問い合わせがあれば以下までお願いします。\n`;
            message = message + `https://kanekofarm41.typeform.com/to/iBbUh7`
        }

        return bot.reply({
            type: "text",
            text: message
        }).then((response) => {
            return Promise.resolve(response);
        });  
    }

}

