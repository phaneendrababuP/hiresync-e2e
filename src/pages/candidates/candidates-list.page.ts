import { type Page, type Locator } from '@playwright/test';
import { ROUTES, TIMEOUTS } from '@constants/index';
import type { CandidateStatus } from '@constants/index';

export class CandidatesListPage {
  readonly page: Page;

  private readonly searchInput: Locator;
  private readonly statusFilter: Locator;
  private readonly candidateTable: Locator;
  private readonly candidateRows: Locator;
  private readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('candidate-search-input');
    this.statusFilter = page.getByTestId('candidate-status-filter');
    this.candidateTable = page.getByTestId('candidates-table');
    this.candidateRows = page.getByTestId('candidate-row');
    this.emptyState = page.getByTestId('candidates-empty-state');
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.CANDIDATES);
    await this.candidateTable.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
  }

  async searchByName(name: string): Promise<void> {
    await this.searchInput.fill(name);
    // debounce wait — search fires after typing stops
    await this.page.waitForTimeout(500);
  }

  async filterByStatus(status: CandidateStatus): Promise<void> {
    await this.statusFilter.selectOption(status);
    // wait for the table to re-render after filter, not networkidle which can be unreliable
    await this.candidateTable.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
  }

  async getCandidateCount(): Promise<number> {
    return this.candidateRows.count();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyState.isVisible();
  }
}
