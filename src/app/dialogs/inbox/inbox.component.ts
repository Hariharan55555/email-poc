import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { COMMON } from '../../constant';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
})
export class InboxComponent implements OnInit {
  public emails: any[] = [];

  public selectedEmail: any;
  public isLoading: boolean = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.getEmails();
    this.selectedEmail = this.emails[0];
    this.apiService.currentEmail.next(1);
    this.apiService.starredChange.subscribe(() => {
      this.getEmails();
    });
  }

  public selectEmail(email: any): void {
    this.selectedEmail = email;
    this.apiService.currentEmail.next(email.id);
  }

  public getEmails(): void {
    const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
    emailList?.length && (this.emails = emailList);
  }

  public onStarred(): void {
    localStorage.setItem('emailList', JSON.stringify(this.emails));
    this.apiService.starredChange.next();
  }

  public getAiResponse(emailContent: string): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.apiService.getAiResponse(emailContent).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.apiService.openComponentByName(COMMON.AI_RESPONSE, res.response);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        // this.apiService.openComponentByName(COMMON.AI_RESPONSE)
        console.log(err);
        this.cdr.detectChanges();
      },
    });
  }
}
