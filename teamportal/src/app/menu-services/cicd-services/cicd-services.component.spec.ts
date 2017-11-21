import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CicdServicesComponent } from './cicd-services.component';

describe('CicdServicesComponent', () => {
  let component: CicdServicesComponent;
  let fixture: ComponentFixture<CicdServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CicdServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CicdServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
