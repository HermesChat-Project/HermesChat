export class messageModel {
  messages: {content: string, dateTime: string, idUser: string, type: string}

  constructor( messages: {content: string, dateTime: string, idUser: string, type: string} ) {
    this.messages = messages
  }
}
