import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskInput } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggle = new EventEmitter<Task>();
  @Output() update = new EventEmitter<{ id: string; updates: Partial<TaskInput> }>();
  @Output() delete = new EventEmitter<string>();

  isEditing = false;
  editTitle = '';
  editDescription = '';

  startEdit(): void {
    this.editTitle = this.task.title;
    this.editDescription = this.task.description || '';
    this.isEditing = true;
  }

  saveEdit(): void {
    if (!this.editTitle.trim()) return;
    this.update.emit({
      id: this.task._id,
      updates: { title: this.editTitle, description: this.editDescription },
    });
    this.isEditing = false;
  }

  formattedDate(): string | null {
    if (!this.task.dueDate) return null;
    return new Date(this.task.dueDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}
