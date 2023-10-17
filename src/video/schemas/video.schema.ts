export class VideoSchema {
  public userId: number;
  public question: string;
  public fileName: string;

  constructor(userId: number, question: string, fileName: string) {
    this.userId = userId;
    this.question = question;
    this.fileName = fileName;
  }
}
