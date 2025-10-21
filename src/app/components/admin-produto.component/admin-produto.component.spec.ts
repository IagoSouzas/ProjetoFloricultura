import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdutoComponent } from './admin-produto.component';

describe('AdminProdutoComponent', () => {
  let component: AdminProdutoComponent;
  let fixture: ComponentFixture<AdminProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
