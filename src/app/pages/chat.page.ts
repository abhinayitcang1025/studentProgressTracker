import { Component } from '@angular/core';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

@Component({
  selector: 'page-chat',
  standalone: true,
  imports: [ChatbotComponent],
  template: `<app-chatbot></app-chatbot>`
})
export class ChatPage {}
