import { Component } from '@angular/core';
import { StudentsListComponent } from '../../components/students-list/students-list.component';

@Component({
  selector: 'page-students',
  standalone: true,
  imports: [StudentsListComponent],
  template: `<students-list></students-list>`
})
export class StudentsPage {}
