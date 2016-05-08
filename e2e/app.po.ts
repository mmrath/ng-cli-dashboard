export class DashboardPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('dashboard-app h1')).getText();
  }
}
