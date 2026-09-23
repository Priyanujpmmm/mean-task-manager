import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskInput } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  @Output() add = new EventEmitter<TaskInput>();
  submitting = false;

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium'],
    dueDate: [''],
  });

  constructor(private fb: FormBuilder) {}

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.submitting = true;
    const raw = this.form.value;
    const payload: TaskInput = {
      title: raw.title!.trim(),
      description: raw.description || undefined,
      priority: (raw.priority as TaskInput['priority']) || 'medium',
      dueDate: raw.dueDate || undefined,
    };

    this.add.emit(payload);
    this.form.reset({ title: '', description: '', priority: 'medium', dueDate: '' });
    this.submitting = false;
  }
}
