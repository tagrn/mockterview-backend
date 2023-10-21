export class UnsavedVideoSchema {
  public userId: number;
  public question: string;
  public fileName: string;

  constructor(userId: number, question: string, fileName: string) {
    this.userId = userId;
    this.question = question;
    this.fileName = fileName;
  }
}

export class VideoSchema {
  public id: number;
  public userId: number;
  public question: string;
  public fileName: string;

  constructor(id: number, userId: number, question: string, fileName: string) {
    this.id = id;
    this.userId = userId;
    this.question = question;
    this.fileName = fileName;
  }
}
