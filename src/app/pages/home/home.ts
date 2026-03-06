import { Component, inject } from '@angular/core'

import { DeviceService } from '@/app/services/DeviceService'

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly deviceService = inject(DeviceService)
}
