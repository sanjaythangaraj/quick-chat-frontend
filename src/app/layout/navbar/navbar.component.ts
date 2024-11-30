import {Component, effect, inject} from '@angular/core';
import {Oauth2AuthService} from '../../auth/oauth2-auth.service';
import {ConnectedUser} from '../../shared/model/user.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbOffcanvas
} from '@ng-bootstrap/ng-bootstrap';
import {NewConversationComponent} from "./new-conversation/new-conversation.component";

@Component({
  selector: 'wac-navbar',
  standalone: true,
  imports: [
    FaIconComponent,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownToggle
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  oauth2Service = inject(Oauth2AuthService);
  connectedUser: ConnectedUser | undefined;
  offCanvasService = inject(NgbOffcanvas);

  constructor() {
    this.listenToFetchUser();
  }

  private listenToFetchUser() {
    effect(() => {
      const state = this.oauth2Service.fetchUser();
      if (state.status === "OK" && state.value?.email && state.value.email !== this.oauth2Service.notConnected) {
        this.connectedUser = state.value;
      }
    });
  }

  logout() {
    this.oauth2Service.logout();
  }

  editProfile() {
    this.oauth2Service.goToProfilePage();
  }

  openNewConversation() {
    this.offCanvasService.open(NewConversationComponent, {
      position: "start",
      container: "#main",
      panelClass: "offcanvas"
    })
  }
}
