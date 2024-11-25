import { Directive, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { COMMON } from '../constant';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Directive({
  selector: '[appCommandBarShortcut]',
  standalone: true
})
export class CommandBarShortcutDirective {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event?.ctrlKey && event?.key?.toLowerCase() === 'k') {
      event.preventDefault();
      this.apiService.openComponentByName(COMMON.COMMAND_BAR);
    } else if (event?.ctrlKey && event?.shiftKey && event?.key?.toLowerCase() === 'c') {
      event.preventDefault();
      this.apiService.openComponentByName(COMMON.COMPOSE);
    } else if (event?.ctrlKey && event?.shiftKey && event?.key?.toLowerCase() === 'i') {
      event.preventDefault();
      this.apiService.sideNavChange.next(COMMON.INBOX);
    } else if (event?.ctrlKey && event?.shiftKey && event?.key?.toLowerCase() === 's') {
      event.preventDefault();
      const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
      const currentEmailId: number = this.apiService.currentEmail.getValue();
      const updatedEmailList = emailList.map((email: any) => {
        if (email.id === currentEmailId) {
          return { ...email, isFavorate: !email.isFavorate };
        }
        return email;
      });
      localStorage.setItem('emailList', JSON.stringify(updatedEmailList));
      this.apiService.starredChange.next();
    } else if (event?.ctrlKey && event?.shiftKey && event?.key?.toLowerCase() === 'a') {
      event.preventDefault();
      // this.apiService.openComponentByName(COMMON.AI_RESPONSE);
      const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
      const currentEmailId: number = this.apiService.currentEmail.getValue();
      const currentEmail = emailList.find((email: any)=> email.id === currentEmailId);
      this.getAiResponse(currentEmail.body);
    } else if (event?.ctrlKey && event?.shiftKey && event?.key?.toLowerCase() === 'e') {
      event.preventDefault();
      this.apiService.sideNavChange.next(COMMON.SIDENAV);
    }
  }

  constructor(private apiService: ApiService, ) { }

  public getAiResponse(emailContent: string): void {
    if (this.apiService.isLoading.getValue()) return;
    this.apiService.isLoading.next(true);
    this.apiService.getAiResponse(emailContent).subscribe({
      next: (res: any) => {
        this.apiService.isLoading.next(false);
        this.apiService.openComponentByName(COMMON.AI_RESPONSE, res.response);
      },
      error: (err: any) => {
        this.apiService.isLoading.next(false);
        // this.apiService.openComponentByName(COMMON.AI_RESPONSE)
        console.log(err);
      },
    });
  }

}
