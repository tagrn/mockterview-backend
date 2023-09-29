export class UnsavedQuestionSetSchema {
  public title: string;
  public questions: string[];
  public isPrivate: boolean;

  constructor(title: string, questions: string[], isPrivate: boolean) {
    this.title = title;
    this.questions = questions;
    this.isPrivate = isPrivate;
  }
}
