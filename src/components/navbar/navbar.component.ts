import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
/**
 * NavbarComponent
 *
 * Simple navigation bar rendered at the top of the application. Uses
 * `routerLink` to navigate between the major pages (students, add, chat).
 */
export class NavbarComponent {}
