import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandBarDialogComponent } from './command-bar-dialog.component';

describe('CommandBarDialogComponent', () => {
  let component: CommandBarDialogComponent;
  let fixture: ComponentFixture<CommandBarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandBarDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandBarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
