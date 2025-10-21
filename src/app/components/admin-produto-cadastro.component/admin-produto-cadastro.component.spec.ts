import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdutoCadastroComponent } from './admin-produto-cadastro.component';

describe('AdminProdutoCadastroComponent', () => {
  let component: AdminProdutoCadastroComponent;
  let fixture: ComponentFixture<AdminProdutoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProdutoCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProdutoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
