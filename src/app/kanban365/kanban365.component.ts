import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarToggleService } from '../services/sidebar-toggle.service';
import { BoardsService } from '../services/boards.service';
import { ModalShowService } from '../services/modal-show.service';
import { ColorThemeService } from '../services/color-theme.service';
import { GhlApiKeyService } from '../services/ghl-api-key.service';

@Component({
  selector: 'app-kanban365',
  templateUrl: './kanban365.component.html',
  styleUrls: ['./kanban365.component.scss'],
})
export class Kanban365Component {
  token: any;
  constructor(
    public sidebarService: SidebarToggleService,
    public boardsService: BoardsService,
    public modalShowService: ModalShowService,
    public colorThemeService: ColorThemeService,
    private router: Router,
    public ghlApiKeyService: GhlApiKeyService
  ) {
    boardsService.getBoards('onInit');
    ghlApiKeyService.getGHLApiKey();
    if (localStorage.getItem('lightMode') === null) {
      colorThemeService.setTheme('false');
    }
    colorThemeService.getTheme();
  }

  ngOnInit() {
    const token = localStorage.getItem('token-kanban365');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      const isTokenValid = this.verifyToken(token);
      if (!isTokenValid) {
        this.router.navigate(['/login']);
      }
    }
    if (window.innerWidth <= 575) {
      this.sidebarService.sidebarOpened = false;
    }
    console.log(this.user_id);
  }

  verifyToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch (e) {
      return false;
    }
  }

  getUserInfo(inf: any) {
    this.token = this.getTokens();
    let payload;
    if (this.token) {
      payload = this.token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload)[`${inf}`];
    } else {
      return null;
    }
  }

  getTokens() {
    return localStorage.getItem('token-kanban365');
  }

  user_id: any = this.getUserInfo('id');
  first_name: any = this.getUserInfo('first_name');
  last_name: any = this.getUserInfo('last_name');
  email: any = this.getUserInfo('email');
  phone_number: any = this.getUserInfo('phone_number');
  rol_name: any = this.getUserInfo('rol_name');
  tenant_id: any = this.getUserInfo('tenant_id');
}
