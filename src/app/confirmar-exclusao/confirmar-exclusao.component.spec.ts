import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarExclusaoComponent } from './confirmar-exclusao.component';

describe('ConfirmarExclusaoComponent', () => {
  let component: ConfirmarExclusaoComponent;
  let fixture: ComponentFixture<ConfirmarExclusaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarExclusaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarExclusaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
