import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'app-resource-detail-layout',
  imports: [],
  templateUrl: './resource-detail-layout.html',
  styleUrl: './resource-detail-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailLayout {
  readonly hasSlider = input(true)
}
