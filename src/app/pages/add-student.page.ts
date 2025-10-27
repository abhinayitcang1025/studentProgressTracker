import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentFormComponent } from '../../components/student-form/student-form.component';

@Component({
  selector: 'page-add-student',
  standalone: true,
  imports: [StudentFormComponent],
  template: `
    <h2>Add student</h2>
    <student-form (saved)="onSaved($event)"></student-form>
  `
})
export class AddStudentPage {
  constructor(private router: Router) {}

  onSaved(_: any) {
    // navigate back to list after save
    this.router.navigate(['/students']);
  }
}
