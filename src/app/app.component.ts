import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { LoadingComponent } from './core/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'school-system2';

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
  ) {
    translate.setDefaultLang('pt-br');
    translate.use('pt-br');
  }

  ngOnInit() {
    this.authService.checkSession();
  }
}
