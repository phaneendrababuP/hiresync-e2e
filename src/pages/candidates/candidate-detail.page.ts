import { type Page, type Locator } from '@playwright/test';
import { TIMEOUTS } from '@constants/index';
import type { CandidateStatus } from '@constants/index';

export class CandidateDetailPage {
  readonly page: Page;

  private readonly statusBadge: Locator;
  private readonly statusChangeDropdown: Locator;
  private readonly confirmStatusBtn: Locator;
  private readonly sendAssessmentBtn: Locator;
  private readonly assessmentTypeSelect: Locator;
  private readonly assessmentExpiryInput: Locator;
  private readonly cancelAssessmentBtn: Locator;
  private readonly sendAssessmentModal: Locator;
  private readonly nlpSkillsList: Locator;
  private readonly nlpExperienceValue: Locator;
  private readonly nlpConfidenceScore: Locator;
  private readonly competencyScorePanel: Locator;
  private readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statusBadge = page.getByTestId('candidate-status-badge');
    this.statusChangeDropdown = page.getByTestId('status-change-select');
    this.confirmStatusBtn = page.getByTestId('confirm-status-change-btn');
    this.sendAssessmentBtn = page.getByTestId('send-assessment-btn');
    this.assessmentTypeSelect = page.getByTestId('assessment-type-select');
    this.assessmentExpiryInput = page.getByTestId('assessment-expiry-days');
    this.cancelAssessmentBtn = page.getByTestId('send-assessment-cancel-btn');
    this.sendAssessmentModal = page.getByTestId('send-assessment-modal');
    this.nlpSkillsList = page.getByTestId('nlp-skills-list');
    this.nlpExperienceValue = page.getByTestId('nlp-experience-years');
    this.nlpConfidenceScore = page.getByTestId('nlp-confidence-score');
    this.competencyScorePanel = page.getByTestId('competency-score-panel');
    this.successToast = page.getByTestId('toast-success');
  }

  async getCurrentStatus(): Promise<string> {
    return this.statusBadge.innerText();
  }

  async changeStatus(status: CandidateStatus): Promise<void> {
    await this.statusChangeDropdown.selectOption(status);
    await this.confirmStatusBtn.click();
    await this.statusBadge.waitFor({ state: 'visible' });
  }

  async waitForStatusToast(expectedMessage?: string): Promise<string> {
    await this.successToast.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
    const msg = await this.successToast.innerText();
    if (expectedMessage && !msg.includes(expectedMessage)) {
      throw new Error(`Expected toast "${expectedMessage}" but got "${msg}"`);
    }
    return msg;
  }

  // Assessment modal — kept here since the modal only opens from this page.

  async openSendAssessmentModal(): Promise<void> {
    await this.sendAssessmentBtn.click();
    await this.sendAssessmentModal.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
  }

  async selectAssessmentType(type: string): Promise<void> {
    await this.assessmentTypeSelect.selectOption(type);
  }

  async setAssessmentExpiry(days: number): Promise<void> {
    await this.assessmentExpiryInput.fill(String(days));
  }

  async cancelSendAssessment(): Promise<void> {
    await this.cancelAssessmentBtn.click();
    await this.sendAssessmentModal.waitFor({ state: 'hidden' });
  }

  // NLP section

  async getNLPParsedSkills(): Promise<string[]> {
    await this.nlpSkillsList.waitFor({ state: 'visible', timeout: TIMEOUTS.AI_PROCESSING });
    const items = this.nlpSkillsList.getByRole('listitem');
    const count = await items.count();
    const skills: string[] = [];
    for (let i = 0; i < count; i++) {
      skills.push(await items.nth(i).innerText());
    }
    return skills;
  }

  async getNLPExperienceYears(): Promise<number> {
    return parseFloat(await this.nlpExperienceValue.innerText());
  }

  async getNLPConfidenceScore(): Promise<number> {
    const text = await this.nlpConfidenceScore.innerText();
    return parseFloat(text.replace('%', '')) / 100;
  }

  // Scoring

  async getCompetencyScore(): Promise<number> {
    await this.competencyScorePanel.waitFor({ state: 'visible', timeout: TIMEOUTS.AI_PROCESSING });
    const text = await this.competencyScorePanel.getByTestId('overall-score').innerText();
    return parseInt(text, 10);
  }
}
