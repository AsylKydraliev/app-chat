import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../shared/message.service';
import { Message } from '../shared/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy{
  messages!: Message[];
  loading = false;
  messagesSubscription!: Subscription;
  loadingSubscription!: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnInit(){
    this.messagesSubscription = this.messageService.messagesChange.subscribe((messages: Message[]) => {
      this.messages = messages;
    })
    this.loadingSubscription = this.messageService.loadingChange.subscribe((isLoading: boolean) => {
      this.loading = isLoading;
    })
    this.messageService.start();
  }

  ngOnDestroy(){
    this.messagesSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }
}
