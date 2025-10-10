import { Component, OnInit } from '@angular/core';
import { MessagesService, Message } from 'src/app/services/messages.service';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  user: User = { name: '', avatar: '', bio: '' };
  replies: Message[] = [];

  constructor(
    private msgService: MessagesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    this.replies = this.msgService.getReplied();
  }

  openSettings() {
    console.log('Go to settings');
  }

  trackById(index: number, item: Message) {
    return index;
  }

}
