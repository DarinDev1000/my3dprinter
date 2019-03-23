import * as Ask from 'ask-sdk';
import * as thingiverse from 'thingiverse-js'
import 'source-map-support/register';

import axios from "axios";
// const constants = require('./constants');

const api = {
  thingiverseUrl: "https://api.thingiverse.com/",
  thingiverseToken: "a34aca11d88f36b8bdd1793cfeafd2b0"
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle: handlerInput => 
    handlerInput.responseBuilder
      .speak(`Welcome to My three d printer`)
      // .reprompt("What would you like to play?")
      .withShouldEndSession(false)
      .getResponse()
}

const OctoprintTestIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'OctoprintTestIntent';
  },
  handle(handlerInput) {
    const speechText = "Octoprint Test"

    // console.log("Repeat Variable:  ", handlerInput.requestEnvelope.request.intent.slots.repeatName.value);
    // console.log("Repeat Variable:  ", handlerInput.requestEnvelope.context);
    // console.log("Repeat Variable:  ", handlerInput);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Octoprint Test', speechText)
      // .reprompt("test reprompt")
      .getResponse();
  }
}

const PrintThingIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PrintThingIntent';
  },

  async handle(handlerInput) {
    let data: any;
    let speechText: string;
    const options = {
      method: 'get',
      url: `${api.thingiverseUrl}search/${handlerInput.requestEnvelope.request.intent.slots.thingQuery.value}?access_token=${api.thingiverseToken}`
    }

    let items
    try {
      data = await axios(options);
      items = data.data[0];
      console.log( 'items', items)
    } catch (e) {
      console.log('error in items')
      console.log(e)
    }

    const newoptions = {
      method: 'get',
      url: `${api.thingiverseUrl}things/${items.id}?access_token=${api.thingiverseToken}`
    }
    let things
    let result: any;
    try {
      things = await axios(newoptions);
      result = things.data;
      console.log( 'result' ,result)
    } catch (e) {
      console.log('error in files')
      console.log(e)
    }

    speechText = `printing ${result.name}`;
    console.log("Speech Text", speechText)

    return handlerInput.responseBuilder
      .speak(speechText)
      // .reprompt("test reprompt")
      .withSimpleCard('Print Thing', speechText)
      .getResponse();
  }

 }


const SearchThingIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchThingIntent';
  },


  async handle(handlerInput) {
    let data: any;
    let speechText: string;
    let options = {
      method: 'get',
      url: `${api.thingiverseUrl}search/${handlerInput.requestEnvelope.request.intent.slots.thingQuery.value}?access_token=${api.thingiverseToken}`
    }
    

    let items
    try {
      data = await axios(options);
      items = data.data[0];
      console.log(items)
    } catch (e) {
      console.log(e)
    }

    options = {
      method: 'get',
      url: `${api.thingiverseUrl}things/${items.id}?access_token=${api.thingiverseToken}`
    }
    let things
    let result: any;
    try {
      things = await axios(options);
      result = data.data;
      console.log(result)
    } catch (e) {
      console.log(e)
    }
    let thingString = `The files for ${items.name} are `;
    // if (Array.isArray(things)) {
      for (let thing of result) {
        thingString +=  ", name: " + thing.name + ", file id: " + thing.id;
      }
    // } else {
    //   thingString +=  ", name: " + things.name + " file id: " + things.id;
    // }


    speechText = `the id for ${items.name} is ${items.id}.`;
    // console.log("Name:", handlerInput.requestEnvelope.request.intent.slots.thingQuery.value)
    // const speechText = handlerInput.requestEnvelope.request.intent.slots.thingQuery.value;
    // console.log('Speech Text', speechText)

    return handlerInput.responseBuilder
      .speak(speechText)
      // .reprompt("test reprompt")
      .withSimpleCard('Search Thing', speechText)
      .getResponse();
  }
}

const NewestThingsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NewestThingsIntent';
  },
  async handle(handlerInput) {
    // const speechText: string = "Returning the ten newest things on thingiverse";
    const things = [];
    let data: any;
    const options = {
      method: 'get',
      url: `${api.thingiverseUrl}/newest?access_token=${api.thingiverseToken}`, // Thingiverse get newest
    }

    try {
      data = await axios(options);
      // console.log('big response', data);
      console.log('data', data.data)
      for (let i = 0; i < 10; i++) {
        things.push(data.data[i])
        // console.log('Data', data.data[i])
      }

      // console.log('Response ', data.data);
    } catch (e) {
      console.log(e)
    }
    let speechText: string = '';
    // console.log(things);
    for (let item of things) {
      speechText +=  ", " + item.name;
      // console.log(typeof item.name)
      // console.log(item.name)
    }
    console.log('Speech Text', speechText)

    return handlerInput.responseBuilder
      .speak('Here are the ten newest items from thingiverse ' + speechText)
      // .reprompt("test reprompt")
      .withSimpleCard('Search Newest Things', speechText)
      .getResponse();
  }
}


const CancelIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
  },
  handle(handlerInput) {
    const speechText = 'Canceled';
    return handlerInput.responseBuilder
      .speak(speechText)
      .addAudioPlayerStopDirective()
      .withShouldEndSession(true)
      .getResponse();
  }
};

const DefaultHandler = {
  canHandle: handlerInput => true,
  handle: handlerInput =>
  handlerInput.responseBuilder
  .speak('I do not understand your request.')
  .withShouldEndSession(false)
  .getResponse()
}

const myErrorHandler = {
  canHandle(handlerInput, error) {
    return error.name.startsWith('AskSdk');
  },
  handle(handlerInput, error) {
    return handlerInput.responseBuilder
      .speak('An error was encountered while handling your request. Try again later')
      .withShouldEndSession(true)
      .getResponse();
  }
}


export const alexa = Ask.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    OctoprintTestIntentHandler,
    PrintThingIntentHandler,
    SearchThingIntentHandler,
    NewestThingsIntentHandler,
    CancelIntentHandler,
    DefaultHandler
  )
  .addErrorHandlers(myErrorHandler)
  .lambda();
