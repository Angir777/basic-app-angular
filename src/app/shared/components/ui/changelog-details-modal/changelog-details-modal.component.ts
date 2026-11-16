import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-changelog-details-modal',
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './changelog-details-modal.component.html',
  styleUrl: './changelog-details-modal.component.scss',
})
export class ChangelogDetailsModalComponent {
  // State
  protected readonly timestamp = Date.now();
  protected readonly changelogUrl = '';
  protected changelogFile = '';

  // DI
  readonly translate = inject(TranslateService);
  readonly ref = inject(DialogRef);

  constructor() {
    const lang = this.translate.getCurrentLang() || 'pl';
    this.changelogFile = `assets/changelog/CHANGELOG.${lang}.md?t=${this.timestamp}`;
  }

  close() {
    this.ref.close();
  }
}
