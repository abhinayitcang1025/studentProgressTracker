import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from '../../components/student-form/student-form.component';

@Component({
  selector: 'page-edit-student',
  standalone: true,
  imports: [CommonModule, StudentFormComponent],
  template: `
    <h2 *ngIf="student">Edit student: {{ student.name }}</h2>
    <student-form *ngIf="student" [student]="student" (saved)="onSaved($event)"></student-form>
    <div *ngIf="!student">Loading...</div>
  `
})
export class EditStudentPage implements OnInit {
  student?: Student;

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.studentService.getStudent(id).subscribe((s) => (this.student = s));
  }

  onSaved(_: any) {
    this.router.navigate(['/students']);
  }
}
