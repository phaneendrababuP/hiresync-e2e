import { type Page, type Locator } from '@playwright/test';
import { ROUTES, TIMEOUTS } from '@constants/index';

export class JobsListPage {
  readonly page: Page;

  private readonly jobsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobsTable = page.getByTestId('jobs-table');
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.JOBS);
    await this.jobsTable.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
  }
}
