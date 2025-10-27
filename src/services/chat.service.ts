import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Lightweight representation of a chat message used by the ChatService.
 *
 * role: the speaker role (user | assistant | system)
 * content: the textual content of the message
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable({ providedIn: 'root' })
/**
 * ChatService handles sending conversation messages to a server-side proxy
 * which in turn forwards requests to a Gemini / generative model endpoint.
 *
 * The service keeps no local state; it simply posts the provided messages to
 * the proxy URL and returns the upstream response as an observable.
 */
export class ChatService {
  // Frontend communicates with a server-side proxy at /api/chat to avoid
  // exposing the Gemini API key in browser code.
  private proxyUrl = '/api/chat';

  constructor(private http: HttpClient) {}

  /**
   * Send an array of ChatMessage entries to the server proxy.
   * @param messages Array of ChatMessage objects representing the conversation so far
   * @param model Optional model identifier (will be forwarded to the proxy)
   * @returns Observable that emits whatever the upstream model responds with
   */
  sendMessages(messages: ChatMessage[], model?: string): Observable<any> {
    return this.http.post<any>(this.proxyUrl, { model, messages });
  }
}
