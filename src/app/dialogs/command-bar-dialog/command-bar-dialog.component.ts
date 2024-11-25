import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { MATERIAL_MODULES } from '../../app.config';
import { COMMON } from '../../constant';

interface IOptions {
  id: string;
  value: string;
  shortcut: string;
}

@Component({
  selector: 'app-command-bar-dialog',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './command-bar-dialog.component.html',
  styleUrl: './command-bar-dialog.component.scss',
})
export class CommandBarDialogComponent {
  public options: IOptions[] = [
    { id: COMMON.COMPOSE, value: 'Compose', shortcut: 'Ctrl + Shift + C' },
    { id: COMMON.INBOX, value: 'Inbox', shortcut: 'Ctrl + Shift + I' },
    { id: COMMON.STARRED, value: 'Start current mail', shortcut: 'Ctrl + Shift + S' },
    { id: COMMON.AI_RESPONSE, value: 'Get AI Response for current mail', shortcut: 'Ctrl + Shift + A' },
    { id: COMMON.SIDENAV, value: 'Expand / Collapse Side Bar', shortcut: 'Ctrl + Shift + E' },
  ];
  public searchText: string = '';
  constructor(private apiService: ApiService) {}

  public ngOnInit(): void {}

  public closeDialog(): void {
    this.apiService.closeDialog(COMMON.COMMAND_BAR);
  }

  public isSearch(option: IOptions): boolean {
    return option?.value?.toLowerCase()?.includes(this.searchText?.toLowerCase());
  }

  public isUnMatched(): boolean {
    return this.options?.every(
      (option: IOptions) =>
        !option?.value?.toLowerCase()?.includes(this.searchText?.toLowerCase())
    );
  }

  public actionChange(option: string): void {
    this.apiService.sideNavChange.next(option);
    this.closeDialog();
  }
}
