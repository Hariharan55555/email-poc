import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MATERIAL_MODULES } from '../../app.config';
import { COMMON } from '../../constant';
import { ApiService } from '../../api.service';
import { InboxComponent } from '../../dialogs/inbox/inbox.component';
import { StarredComponent } from '../../dialogs/starred/starred.component';
import { CommonModule } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';

interface IOptions {
  id: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MATERIAL_MODULES, InboxComponent, StarredComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

  @ViewChild('snav') snav!: MatDrawer;
  @ViewChild('smallnav') smallnav!: MatDrawer;

  public common: any = COMMON;
  showFiller = false;

  title = 'Utiliko Email POC';

  selectedFolder: string = COMMON.INBOX;
  starredCount: number = 0;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    // const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
    // this.starredCount = emailList.filter((email: any) => email.isFavorate)?.length || 0;
    this.getStarredCount();
    this.apiService.starredChange.subscribe(() => {
      this.getStarredCount();
    });
    this.apiService.sideNavChange.subscribe((currentNav: string) => {
      if (currentNav === COMMON.COMPOSE) {
        this.apiService.openComponentByName(COMMON.COMPOSE);
        return;
      } else if (currentNav === COMMON.AI_RESPONSE) {
        // this.apiService.openComponentByName(COMMON.AI_RESPONSE);
        const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
        const currentEmailId: number = this.apiService.currentEmail.getValue();
        const currentEmail = emailList.find((email: any)=> email.id === currentEmailId);
        this.getAiResponse(currentEmail.body);
        return;
      } else if (currentNav === COMMON.SIDENAV) {
        this.openCloseNav();
        return;
      } else if (currentNav === COMMON.STARRED) {
        const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
        const currentEmailId: number = this.apiService.currentEmail.getValue();
        const updatedEmailList = emailList.map((email: any) => {
          if (email.id === currentEmailId) {
            return { ...email, isFavorate: !email.isFavorate };
          }
          return email;
        });
        if(!updatedEmailList.filter((email: any) => email.isFavorate).length) {
          this.apiService.currentEmail.next(0);
        }
        localStorage.setItem('emailList', JSON.stringify(updatedEmailList));
        this.apiService.starredChange.next();
        return;
      }
      this.selectedFolder = currentNav;
      this.cdr.detectChanges();
    });
  }

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

  public getStarredCount(): void {
    const emailList = JSON.parse(localStorage.getItem('emailList') || '[]');
    this.starredCount =
      emailList.filter((email: any) => email.isFavorate)?.length || 0;
    // this.cdr.detectChanges();
  }

  public navItems: IOptions[] = [
    { id: COMMON.INBOX, value: 'Inbox', icon: 'move_to_inbox' },
    { id: COMMON.STARRED, value: 'Starred', icon: 'star' },
    // { id: COMMON.AI_RESPONSE, value: 'AI Response', icon: 'email' },
    // { id: COMMON.SIDENAV, value: 'Collapse', icon: 'first_page' },
  ];
  // public availableOptions: IOptions[] = [
  //   { id: COMMON.COMPOSE, value: 'Compose' },
  //   { id: COMMON.INBOX, value: 'Go to Inbox' },
  //   { id: COMMON.AI_RESPONSE, value: 'AI Response' },
  //   { id: COMMON.STARRED, value: 'View Important Mails' },
  //   { id: COMMON.SIDENAV, value: 'Expand Side menu' },
  // ];

  public composeMail(): void {
    this.apiService.openComponentByName(COMMON.COMPOSE);
  }

  public dialogActions(dialogName: string): void {
    this.selectedFolder = dialogName;
  }

  public openCloseNav(): void {
    this.snav?.toggle();
    this.smallnav?.toggle();
  }
}
