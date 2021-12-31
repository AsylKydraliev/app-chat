import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from './message.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService{
  messages: Message[] | null = null;
  messagesChange = new Subject<Message[]>();
  loadingChange = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  start(){
    this.loadingChange.next(true);
    this.http.get<{[id: string]: Message}>('http://146.185.154.90:8000/messages').pipe(map(result => {
      if(result === null){
        return [];
      }
      return Object.keys(result).map(id => {
        const message = result[id];
        return new Message(message._id, message.message, message.author, message.datetime);
      })
    }))
      .subscribe(result => {
        this.messages = [];
        this.messages = result;
        this.messagesChange.next(this.messages.slice());
        this.loadingChange.next(false);
      }, () => {
        this.loadingChange.next(false);
      })
  }

  postMessage(message: HttpParams){
    this.http.post('http://146.185.154.90:8000/messages', message).subscribe(() => {
      this.start();
      });
  }
}
