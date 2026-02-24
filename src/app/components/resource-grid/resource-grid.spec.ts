import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ResourceGrid } from '@/components/resource-grid/resource-grid';

describe('ResourceGrid', () => {
  let component: ResourceGrid;
  let fixture: ComponentFixture<ResourceGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
