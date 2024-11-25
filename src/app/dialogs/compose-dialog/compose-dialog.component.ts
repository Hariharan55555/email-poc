import { Component, computed, inject, model, signal } from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../api.service';
import { COMMON } from '../../constant';

@Component({
  selector: 'app-compose-dialog',
  standalone: true,
  imports: [MATERIAL_MODULES, MatIconModule],
  templateUrl: './compose-dialog.component.html',
  styleUrl: './compose-dialog.component.scss'
})
export class ComposeDialogComponent {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentemail = model('');
  readonly emails = signal(['test1@gmail.com']);
  readonly allemails: string[] = ['test1@gmail.com', 'test2@gmail.com', 'test3@gmail.com', 'test4@gmail.com', 'test5@gmail.com'];
  readonly filteredemails = computed(() => {
    const currentemail = this.currentemail().toLowerCase();
    return currentemail
      ? this.allemails.filter(email => email.toLowerCase().includes(currentemail))
      : this.allemails.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  constructor(private apiService: ApiService) {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the email only if it's not already in the list
    if (value && !this.emails().includes(value)) {
      this.emails.update(emails => [...emails, value]);
    }

    // Clear the input field after adding the chip
    this.currentemail.set('');
  }

  remove(email: string): void {
    this.emails.update(emails => {
      const index = emails.indexOf(email);
      if (index < 0) {
        return emails;
      }

      emails.splice(index, 1);
      this.announcer.announce(`Removed ${email}`);
      return [...emails];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // Only add if email is not already in the list
    const selectedEmail = event.option.viewValue;
    if (!this.emails().includes(selectedEmail)) {
      this.emails.update(emails => [...emails, selectedEmail]);
    }

    this.currentemail.set('');
    event.option.deselect();
  }

  public closeDialog(): void {
    this.apiService.closeDialog(COMMON.COMPOSE);
  }

  public sendEmail(): void {
    this.closeDialog();
    alert('Email Sent Successfully!');
  }
}
