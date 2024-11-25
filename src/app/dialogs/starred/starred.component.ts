import { ChangeDetectorRef, Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { COMMON } from '../../constant';

@Component({
  selector: 'app-starred',
  standalone: true,
  imports: [MATERIAL_MODULES, FormsModule, CommonModule],
  templateUrl: './starred.component.html',
  styleUrl: './starred.component.scss',
})
export class StarredComponent {
  public emails: any[] = [];
  public selectedEmail: any;
  public isLoading: boolean = false;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef){}

  public ngOnInit(): void {
    this.getEmails();
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
    if (emailList.length) {
      this.emails = emailList?.filter((email: any) => email.isFavorate);
      this.selectedEmail = this.emails?.[0] ? this.emails[0] : null;
      this.apiService.currentEmail.next(this.selectedEmail?.id || 0);
    } else {
      this.apiService.currentEmail.next(0);
    }
  }

  public onStarred(removeEmail: any): void {
    const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');

    // Update the 'isFavorate' property of the email that matches removeEmail.id
    const updatedEmailList = emailList.map((email: any) => {
      if (email.id === removeEmail.id) {
        return { ...email, isFavorate: removeEmail.isFavorate }; // Update isFavorate
      }
      return email;
    });

    // Save the updated email list back to localStorage
    localStorage.setItem('emailList', JSON.stringify(updatedEmailList));

    // Update the component's emails array to reflect the current favorite status
    this.emails = updatedEmailList.filter((email: any) => email.isFavorate);

    // Set the selectedEmail to the first favorite email, or null if no favorites remain
    if (!this.emails.length) {
      this.selectedEmail = null;
      this.apiService.currentEmail.next(0);
    }
    this.apiService.starredChange.next();
    this.cdr.detectChanges();
  }

  public getAiResponse(emailContent: string): void {
    if(this.isLoading) return;
    this.isLoading = true;
    this.apiService.getAiResponse(emailContent).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.apiService.openComponentByName(COMMON.AI_RESPONSE, res.response);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.log(err);
        this.cdr.detectChanges();
      }
    })
  }
}
