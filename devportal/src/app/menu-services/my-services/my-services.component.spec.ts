import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyServicesComponent } from './my-services.component';

describe('MyServicesComponent', () => {
  let component: MyServicesComponent;
  let fixture: ComponentFixture<MyServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
