import { TritonEditorPage } from './app.po';

describe('triton-editor App', () => {
  let page: TritonEditorPage;

  beforeEach(() => {
    page = new TritonEditorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
