import { OnlineConsultationsPage } from './app.po';

describe('online-consultations App', () => {
  let page: OnlineConsultationsPage;

  beforeEach(() => {
    page = new OnlineConsultationsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
