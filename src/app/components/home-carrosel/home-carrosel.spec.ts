import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCarrosel } from './home-carrosel';

describe('HomeCarrosel', () => {
  let component: HomeCarrosel;
  let fixture: ComponentFixture<HomeCarrosel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCarrosel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCarrosel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
