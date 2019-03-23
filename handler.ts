import * as Ask from 'ask-sdk';
import * as thingiverse from 'thingiverse-js'
import 'source-map-support/register';

// export const alexa = Ask.SkillBuilders.custom()
//   .addRequestHandlers({
//     canHandle: handlerInput => true,
//     handle: handlerInput =>
//       handlerInput.responseBuilder.speak('Hello world!').getResponse()
//   })
//   .lambda();

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
      .reprompt("test reprompt")
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
    SearchIntentHandler,
    LaunchRequestHandler,
    DefaultHandler
  )
  .addErrorHandlers(myErrorHandler)
  .lambda();
