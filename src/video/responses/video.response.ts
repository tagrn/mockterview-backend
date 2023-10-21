export class VideoResponse {
  public id: number;
  public userId: number;
  public questionSetTitle: string;
  public question: string;
  public fileName: string;

  constructor(
    id: number,
    userId: number,
    questionSetTitle: string,
    question: string,
    fileName: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.questionSetTitle = questionSetTitle;
    this.question = question;
    this.fileName = fileName;
  }
}