import * as Ask from 'ask-sdk';
import * as thingiverse from 'thingiverse-js'
import 'source-map-support/register';

import axios from "axios";
// const constants = require('./constants');


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


const SearchIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SearchIntent';
  },
  handle(handlerInput) {
    const speechText: string = "Returning the ten newest things on thingiverse";

    console.log("Repeat Variable:  ", handlerInput.requestEnvelope.request.intent);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Repeat', speechText)
      // .reprompt("test reprompt")
      .getResponse();
  }
}



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
    OctoprintTestIntentHandler,
    SearchIntentHandler,
    LaunchRequestHandler,
    DefaultHandler
  )
  .addErrorHandlers(myErrorHandler)
  .lambda();
