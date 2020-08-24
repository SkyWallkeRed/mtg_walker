import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanCardPage } from './scan-card.page';

describe('ScanCardPage', () => {
  let component: ScanCardPage;
  let fixture: ComponentFixture<ScanCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
