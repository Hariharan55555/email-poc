import { Component, Inject, OnInit } from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../api.service';
import { COMMON } from '../../constant';

@Component({
  selector: 'app-ai-response-dialog',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './ai-response-dialog.component.html',
  styleUrl: './ai-response-dialog.component.scss',
})
export class AiResponseDialogComponent implements OnInit {
  public messageContent: string =
    "Subject: Re: Connecting with you!\n\nHi [Name],\n\nIt's great to hear from you! I appreciate you reaching out and taking the time to connect.  I'm in the same industry, and I'm always interested in learning from and connecting with others in similar fields. I'd be happy to network and discuss potential collaboration opportunities.  Please feel free to share more about your specific interests and projects. I look forward to hearing from you.\n\nBest regards,\n\nThe response going from me.\n";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {}

  public ngOnInit(): void {
    if (this.data?.data) {
      this.messageContent = this.data.data;
    }
  }

  copyToClipboard(emailResponse: string) {
    const textArea = document.createElement('textarea');
    textArea.value = emailResponse; // Use dynamic response from API

    // Prevent scrolling to the bottom of the page
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    try {
      document.execCommand('copy');
      console.log('Response copied to clipboard');
      // Optionally, show a success message to the user
      this.closeDialog();
      alert('AI generated email response copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy response', err);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  public closeDialog(): void {
    this.apiService.closeDialog(COMMON.AI_RESPONSE);
  }
}
