export class messageModel {
  messages: {content: string, dateTime: string, idUser: string, type: string, options: any | null}

  constructor( messages: {content: string, dateTime: string, idUser: string, type: string, options: any |null } ) {
    this.messages = messages
  }
}
