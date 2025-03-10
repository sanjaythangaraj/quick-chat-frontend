import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {UserSearchService} from "../user-search.service";
import {NgbActiveOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from "../../../shared/toast/toast.service";
import {BaseUser} from "../../../shared/model/user.model";
import {Pagination} from "../../../shared/model/request.model";
import {Subscription} from "rxjs";
import {SearchQuery} from "./model/user.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {ConversationSelectorComponent} from "./conversation-selector/conversation-selector.component";
import {ConversationService} from "../../../conversations/conversation.service";

@Component({
  selector: 'wac-new-conversation',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ConversationSelectorComponent
  ],
  templateUrl: './new-conversation.component.html',
  styleUrl: './new-conversation.component.scss'
})
export class NewConversationComponent implements OnInit, OnDestroy {

  searchService = inject(UserSearchService);
  toastService = inject(ToastService);
  activeOffCanvas = inject(NgbActiveOffcanvas);
  conversationService = inject(ConversationService);

  public query = "";

  public usersResults = Array<BaseUser>();

  searchPage: Pagination = {
    page: 0,
    size: 20,
    sort: ["firstName", "ASC"]
  }

  loadingSearch = true;

  searchSubscription: Subscription | undefined;

  onQueryChange(newQuery: string) {
    this.loadingSearch = true;
    const searchQuery: SearchQuery = {
      query: newQuery,
      page: this.searchPage,
    }
    this.searchService.search(searchQuery);
  }

  initSearchResultListener() {
    this.searchSubscription = this.searchService.searchResult
        .subscribe(usersState => {
          if (usersState.status === "OK" && usersState.value) {
            this.usersResults = usersState.value;
            this.toastService.show("Hello Toast", "SUCCESS");
          } else if (usersState.status === "ERROR") {
            this.toastService.show("Error occured when fetching search result, please try again", "DANGER");
          }
          this.loadingSearch = false;
        });

    const searchQuery: SearchQuery = {
      query: "",
      page: this.searchPage
    }
    this.searchService.search(searchQuery);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initSearchResultListener();
  }

  onCloseNav() {
    this.activeOffCanvas.close();
  }

  handleConversation(userPublicId: string) {
    this.conversationService.handleNavigationToConversation(userPublicId);
    this.activeOffCanvas.close();
  }



}
