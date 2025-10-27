import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { CommonModule } from '@angular/common';
import { StudentDetailComponent } from '../../components/student-detail/student-detail.component';

@Component({
  selector: 'page-details',
  standalone: true,
  imports: [CommonModule, StudentDetailComponent],
  template: `
    <h2 *ngIf="student">Details for {{ student.name }}</h2>
    <student-detail *ngIf="student" [student]="student"></student-detail>
    <div *ngIf="!student">Loading...</div>
  `
})
export class DetailsPage implements OnInit {
  student?: Student;

  constructor(private route: ActivatedRoute, private studentService: StudentService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.studentService.getStudent(id).subscribe((s) => (this.student = s));
  }
}
