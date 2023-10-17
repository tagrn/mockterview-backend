export class VideoSchema {
  public userId: number;
  public questionSetId: number;
  public question: string;
  public videoUrl: string;

  constructor(
    userId: number,
    questionSetId: number,
    question: string,
    videoUrl: string,
  ) {
    this.userId = userId;
    this.questionSetId = questionSetId;
    this.question = question;
    this.videoUrl = videoUrl;
  }
}
