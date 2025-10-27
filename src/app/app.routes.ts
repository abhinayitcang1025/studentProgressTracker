import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  {
    path: 'students',
    loadComponent: () => import('./pages/students.page').then((m) => m.StudentsPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat.page').then((m) => m.ChatPage)
  },
  {
    path: 'add-student',
    loadComponent: () => import('./pages/add-student.page').then((m) => m.AddStudentPage)
  },
  {
    path: 'edit-student/:id',
    loadComponent: () => import('./pages/edit-student.page').then((m) => m.EditStudentPage)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./pages/details.page').then((m) => m.DetailsPage)
  }
];
