import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskService } from '../../services/task.service';
import { Task, TaskInput } from '../../models/task.model';

type FilterOption = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TaskFormComponent, TaskItemComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  error = '';
  filter: FilterOption = 'all';
  filters: FilterOption[] = ['all', 'active', 'completed'];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tasks';
        this.loading = false;
      },
    });
  }

  handleAdd(taskInput: TaskInput): void {
    this.taskService.createTask(taskInput).subscribe({
      next: (task) => (this.tasks = [task, ...this.tasks]),
      error: () => (this.error = 'Failed to add task'),
    });
  }

  handleToggle(task: Task): void {
    this.taskService.updateTask(task._id, { completed: !task.completed }).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map((t) => (t._id === updated._id ? updated : t));
      },
    });
  }

  handleUpdate(event: { id: string; updates: Partial<TaskInput> }): void {
    this.taskService.updateTask(event.id, event.updates).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map((t) => (t._id === updated._id ? updated : t));
      },
    });
  }

  handleDelete(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((t) => t._id !== id);
      },
    });
  }

  setFilter(f: FilterOption): void {
    this.filter = f;
  }

  get filteredTasks(): Task[] {
    if (this.filter === 'active') return this.tasks.filter((t) => !t.completed);
    if (this.filter === 'completed') return this.tasks.filter((t) => t.completed);
    return this.tasks;
  }

  get activeCount(): number {
    return this.tasks.filter((t) => !t.completed).length;
  }
}
