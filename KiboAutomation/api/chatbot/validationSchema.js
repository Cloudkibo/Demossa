exports.getChatbotResponseSchema = {
  type: 'object',
  properties: {
    userInput: {
      type: 'string',
      required: true
    },
    vertical: {
      type: 'string',
      required: true
    },
    subscriberId: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    }
  }
}
