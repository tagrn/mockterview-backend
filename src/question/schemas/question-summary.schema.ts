export class QuestionSummarySchema {
  public id: number;
  public title: string;
  public questionCount: number;
  public updatedAt: Date;

  constructor(
    id: number,
    title: string,
    questionCount: number,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.questionCount = questionCount;
    this.updatedAt = updatedAt;
  }
}
