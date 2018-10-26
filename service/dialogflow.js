"use strict";

const debug = require("debug")("bot-express:service");
const language = "ja";
const dialogflow = require("dialogflow");

// Instantiates clients
const intents_client = new dialogflow.IntentsClient({
    project_id: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    }
});

// The path to identify the agent that owns the created intent.
const agent_path = intents_client.projectAgentPath(process.env.GOOGLE_PROJECT_ID);

module.exports = class ServiceDialogflow {
    static get_intents(){

    }

    /**
    @method add_intent
    @param {Object} intent
    @param {String} intent.name
    @param {String} intent.training_phrase
    @param {String} intent.action
    @param {String} intent.text_response
    */
    static add_intent(intent){

//console.log("+++add_intent+++");
//console.log("+++"+ JSON.stringify(intent) + "+++")

        const new_intent = {
            "displayName": intent.name,
            "webhookState": 'WEBHOOK_STATE_DISABLED',
            "trainingPhrases": intent.training_phrase,
            "action": intent.action
        };

console.log("new_intent" + JSON.stringify(new_intent));

        const request = {
            parent: agent_path,
            intent: new_intent
        }
        return intents_client.createIntent(request);
    }

    static async get_intent_id(){

        const request = {
            parent: agent_path,
        };

        let intents = await intents_client.listIntents(request);


        let intent_id;
        let phrase;
        intents[0].forEach(function(intent){
            if(intent.displayName == "金子農園-注文No."){
                intent_id = intent.name.split("/")[4];
//console.log("+++" + JSON.stringify(intent)+ "+++");                    
            }
        });
  
//console.log("+++" + intent_id + "+++");       
        return intent_id;
    }
    static delete_intent(intentId){
        //const intentsClient = new dialogflow.IntentsClient();
console.log("delete_intent" + " " + intentId);

        const intentPath = intents_client.intentPath(process.env.GOOGLE_PROJECT_ID, intentId);

        const request = {name: intentPath};

        return intents_client
            .deleteIntent(request)
            .then(console.log(`Intent ${intentPath} deleted`))
            .catch(err => {
              console.error(`Failed to delete intent ${intentPath}:`, err);
            });
    }

    static createEntity(entityValue, synonyms) {
        // [START dialogflow_create_entity]
        // Imports the Dialogflow library
        const dialogflow = require('dialogflow');
      
        // Instantiates clients
        const entityTypesClient = new dialogflow.EntityTypesClient();
      
        // The path to the agent the created entity belongs to.
        const agentPath = entityTypesClient.entityTypePath(process.env.GOOGLE_PROJECT_ID, "e691f087-bb03-4031-9713-56db9867cb86");
      
        const entity = {
//          value: entityValue,
//          synonyms: synonyms,
            value: "hoge",
            synonyms: "hoge",
        };
      
        const createEntitiesRequest = {
          parent: agentPath,
          entities: [entity],
        };
      
        entityTypesClient
          .batchCreateEntities(createEntitiesRequest)
          .then(responses => {
            console.log('Created entity type:');
            console.log(responses[0]);
          })
          .catch(err => {
            console.error('Failed to create size entity type:', err);
          });
        // [END dialogflow_create_entity]
      }    
}
