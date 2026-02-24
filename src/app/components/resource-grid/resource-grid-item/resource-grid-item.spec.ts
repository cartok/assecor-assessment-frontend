import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ResourceGridItem } from '@/components/resource-grid/resource-grid-item/resource-grid-item';

describe('ResourceGridItem', () => {
  let component: ResourceGridItem;
  let fixture: ComponentFixture<ResourceGridItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceGridItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceGridItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
