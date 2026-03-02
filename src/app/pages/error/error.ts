import { ChangeDetectionStrategy, Component } from '@angular/core'

import { DefaultLayout } from '@/layouts/default-layout/default-layout'

@Component({
  selector: 'app-error',
  imports: [DefaultLayout],
  templateUrl: './error.html',
  styleUrl: './error.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {}
