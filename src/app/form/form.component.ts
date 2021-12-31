import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../shared/message.service';
import { NgForm } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @ViewChild('form') postForm!: NgForm;

  constructor(private messageService: MessageService) { }

  ngOnInit() {}

  onSend() {
    const body = new HttpParams()
      .set('message', this.postForm.value.name)
      .set('author', this.postForm.value.post);
    this.messageService.postMessage(body);
  }
}
