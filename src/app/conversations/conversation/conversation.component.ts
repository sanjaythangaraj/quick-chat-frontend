import {Component, effect, inject, input, output} from '@angular/core';
import {Conversation} from "../model/conversation.model";
import {BaseUser} from "../../shared/model/user.model";
import {ConversationService} from "../conversation.service";
import dayjs from "dayjs";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SendStateDisplayComponent} from "../../messages/send-state-display/send-state-display.component";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'wac-conversation',
  standalone: true,
  imports: [
    FaIconComponent,
    SendStateDisplayComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {
  conversation = input.required<Conversation>();
  connectedUser = input.required<BaseUser>();

  conversationService = inject(ConversationService);

  select = output<Conversation>();
  delete = output<Conversation>();

  protected showMenu = false;
  nbOfUnReadMessage = 0;
  contact: BaseUser | undefined;

  showConversation() {
    this.select.emit(this.conversation());
  }

  private getReceiverMember() {
    effect(() => {
      this.contact = this.conversationService.getReceiverMember(this.conversation())
    });
  }

  constructor() {
    this.getReceiverMember();
  }

  computeTitle() {
    if (this.contact) {
      return this.contact.firstName + " " + this.contact.lastName;
    } else {
      return this.conversation().name;
    }
  }

  getLastMessage() {
    if (this.conversation().messages && this.conversation().messages.length > 0) {
      return this.conversation().messages[this.conversation().messages.length - 1];
    } else {
      return null;
    }
  }

  computeTime() {
    const lastMessage = this.getLastMessage();
    if (lastMessage) {
      return dayjs(lastMessage.sendDate).fromNow();
    } else{
      return ""
    }
  }

  hasUnreadMessage() {
    if (this.conversation().messages) {
      const unreadMessages = this.conversation().messages.filter(message => {
        return message.state === "RECEIVED" && message.senderId !== this.connectedUser().publicId;
      })
      if (unreadMessages.length > 0) {
        this.nbOfUnReadMessage = unreadMessages.length;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  onDelete() {
    this.delete.emit(this.conversation());
  }

  onMouseOver() {
    this.showMenu = true;
  }

  onMouseLeave() {
    this.showMenu = false;
  }

}
