import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarEventoPage } from './modificar-evento.page';

describe('ModificarEventoPage', () => {
  let component: ModificarEventoPage;
  let fixture: ComponentFixture<ModificarEventoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
