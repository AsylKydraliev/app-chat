import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../shared/message.service';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('form') postForm!: NgForm;
  postSubscription!: Subscription;
  loading = false;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.postSubscription = this.messageService.postLoadingChange.subscribe((isLoading: boolean) => {
      this.loading = isLoading;
    })
  }

  onSend() {
    const body = new HttpParams()
      .set('message', this.postForm.value.name)
      .set('author', this.postForm.value.post);
    this.messageService.postMessage(body);
  }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
  }
}
