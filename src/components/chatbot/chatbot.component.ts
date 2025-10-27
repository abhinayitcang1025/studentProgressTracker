import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
/**
 * ChatbotComponent
 *
 * Small conversation UI that allows the user to send a natural-language query
 * and displays the generated responses returned by the backend proxy. The
 * component uses `ChatService` to post the conversation and attempts to
 * parse several common generative API response shapes.
 */
export class ChatbotComponent {
  /** Reactive form group for the input query. */
  form = this.createForm();
  /** Whether a request is currently in-flight. */
  loading = false;
  /** Error message when a request fails. */
  error: string | null = null;
  /** In-memory conversation log of role/text pairs for the session. */
  conversation: { role: string; text: string }[] = [];

  constructor(private fb: FormBuilder, private chat: ChatService) {}

  private createForm() {
    return this.fb.group({ query: [''] });
  }

  /**
   * Send the current query to the ChatService and append the assistant response
   * to the conversation when it arrives.
   */
  send() {
    this.error = null;
    const q = this.form.get('query')?.value?.trim();
    if (!q) return;

    // push user message locally
    this.conversation.push({ role: 'user', text: q });
    this.form.get('query')?.setValue('');
    this.loading = true;

    const messages: ChatMessage[] = [{ role: 'user', content: q }];
    this.chat.sendMessages(messages).subscribe({
      next: (res) => {
        const texts = this.parseResponse(res);
        texts.forEach((t) => this.conversation.push({ role: 'assistant', text: t }));
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || JSON.stringify(err);
        this.loading = false;
      }
    });
  }

  /**
   * Attempt to extract human-friendly textual output from multiple possible
   * generative API response formats. Returns an array because some APIs may
   * return multiple candidate outputs.
   */
  private parseResponse(resp: any): string[] {
    if (!resp) return ['(no response)'];

    const out: string[] = [];

    // common patterns
    if (typeof resp === 'string') return [resp];

    if (resp.output_text) out.push(String(resp.output_text));

    if (resp.candidates && Array.isArray(resp.candidates)) {
      resp.candidates.forEach((c: any) => {
        if (typeof c === 'string') out.push(c);
        else if (c.content) out.push(String(c.content));
        else if (c.output) out.push(String(c.output));
      });
    }

    if (resp.choices && Array.isArray(resp.choices)) {
      resp.choices.forEach((ch: any) => {
        if (ch.message?.content) out.push(String(ch.message.content));
        else if (ch.text) out.push(String(ch.text));
      });
    }

    // Google generative responses sometimes nest text into result or candidates
    if (resp.result && resp.result.output_text) out.push(String(resp.result.output_text));

    // Some APIs put text under data[0].text or data[0].content
    if (resp.data && Array.isArray(resp.data)) {
      resp.data.forEach((d: any) => {
        if (d.text) out.push(String(d.text));
        else if (d.content) out.push(String(d.content));
      });
    }

    // Fallback: attempt some common nested paths
    const possible = [
      resp?.output?.[0]?.content?.text?.[0]?.text,
      resp?.output?.[0]?.content?.text,
      resp?.message?.content,
      resp?.completion?.text,
      resp?.text
    ];
    possible.forEach((p) => {
      if (p) {
        if (Array.isArray(p)) p.forEach((x) => out.push(String(x)));
        else out.push(String(p));
      }
    });

    if (out.length) return out;

    // final fallback: stringify entire response (trimmed)
    try {
      const s = JSON.stringify(resp);
      return [s.length > 1000 ? s.slice(0, 1000) + '... (truncated)' : s];
    } catch (e) {
      return ['(unreadable response)'];
    }
  }
}
