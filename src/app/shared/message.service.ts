import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from './message.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService{
  messages: Message[] | null = null;
  messagesChange = new Subject<Message[]>();
  loadingChange = new Subject<boolean>();
  postLoadingChange = new Subject<boolean>();
  interval!: number;
  lastMessages: Message[] | null = null;

  constructor(private http: HttpClient) {}

  getAllMessages(){
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
        this.start(this.messages[this.messages.length - 1].datetime);
      }, () => {
        this.loadingChange.next(false);
      })
  }

  postMessage(message: HttpParams){
    this.postLoadingChange.next(true);
    this.http.post('http://146.185.154.90:8000/messages', message).subscribe(() => {
      this.postLoadingChange.next(false);
    }, () => {
      this.postLoadingChange.next(false);
    });
  }

  start(date: string){
    const observable = new Observable<Message[]>(subscriber => {
      this.interval = setInterval(() => {
        this.http.get<{[id: string]: Message}>(`http://146.185.154.90:8000/messages?datetime=${date}`)
          .pipe(
            map(result => {
                return Object.keys(result).map(id => {
                  const message = result[id];
                  return new Message(message._id, message.message, message.author, message.datetime)
                })
              }
            ))
            .subscribe(messages => {
              if(messages.length !== 0) {
                if(this.messages) {
                  this.lastMessages = this.messages.concat(messages);
                  subscriber.next(this.lastMessages.slice());
                }
              }
            })
      }, 1000)
    });
    observable.subscribe((messages: Message[]) => {
      this.lastMessages = messages;
      this.messagesChange.next(this.lastMessages.slice());
    });
  }

  stop(){
    clearInterval(this.interval);
  }
}
