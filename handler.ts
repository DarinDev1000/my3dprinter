import * as Ask from 'ask-sdk';
import 'source-map-support/register';

import axios from "axios";
// const constants = require('./constants');

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
};

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

// Export lambda handlers
export const alexa = Ask.SkillBuilders.custom()
  .addRequestHandlers(
    OctoprintTestIntentHandler
  )
  .addErrorHandlers(myErrorHandler)
  .lambda();
