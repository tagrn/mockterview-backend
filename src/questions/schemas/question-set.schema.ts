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

export class QuestionSetSchema {
  public id: number;
  public title: string;
  public questions: string[];
  public isPrivate: boolean;

  constructor(
    id: number,
    title: string,
    questions: string[],
    isPrivate: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.questions = questions;
    this.isPrivate = isPrivate;
  }
}
