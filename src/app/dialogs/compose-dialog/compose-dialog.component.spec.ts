import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeDialogComponent } from './compose-dialog.component';

describe('ComposeDialogComponent', () => {
  let component: ComposeDialogComponent;
  let fixture: ComponentFixture<ComposeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
