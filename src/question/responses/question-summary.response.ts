export class QuestionSummaryResponse {
  public id: number;
  public title: string;
  public questionCount: number;
  public viewCount: number;
  public updatedAt: Date;

  constructor(
    id: number,
    title: string,
    questionCount: number,
    viewCount: number,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.questionCount = questionCount;
    this.viewCount = viewCount;
    this.updatedAt = updatedAt;
  }
}
