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
    console.log(things);
    for (let item of things) {
      speechText +=  ", " + item.name;
      console.log(typeof item.name)
      console.log(item.name)
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
    NewestThingsIntentHandler,
    CancelIntentHandler,
    DefaultHandler
  )
  .addErrorHandlers(myErrorHandler)
  .lambda();
