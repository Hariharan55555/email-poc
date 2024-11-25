import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CommandBarShortcutDirective } from './directives/command-bar-shortcut.directive';
import { MATERIAL_MODULES } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, CommandBarShortcutDirective, MATERIAL_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  isLoading: boolean = false;
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    this.apiService.isLoading.subscribe((loading: boolean)=> {
      this.isLoading = !!loading;
      this.cdr.detectChanges();
    })
  }
}
