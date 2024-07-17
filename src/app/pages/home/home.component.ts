import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);
  isChecked = false;
  inputControl = new FormControl('',
    {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }
  )
  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks()

    if (filter === 'pending') {
      return tasks.filter(task => !task.completed)
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.completed)
    }

    return tasks;
  })

  injector = inject(Injector)

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks)
    }

    this.trackTasks();
  }

  trackTasks() {
    effect(() => {
      const tasks = this.tasks();
      console.log(tasks);

      localStorage.setItem('tasks', JSON.stringify(tasks))
    }, { injector: this.injector });
  }

  changeHandler() {
    if (this.inputControl.valid) {
      const value = this.inputControl.value.trim();
      this.addTask(value)
      this.inputControl.setValue('');
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    }

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position != index));
  }

  checkBoxHandler(indexTask: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == indexTask) {
          return {
            ...task,
            completed: !task.completed
          }
        }

        return task;
      })
    })
  }

  updateTaskState(indexTask: number) {

    this.tasks()[indexTask].completed = true
    this.tasks.update((task) => task);
  }

  updateTaskEditMode(indexTask: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == indexTask && !task.completed) {
          return {
            ...task,
            edit: true
          }
        }

        return {
          ...task,
          edit: false
        };
      })
    })
  }

  updateTaskText(indexTask: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == indexTask) {
          return {
            ...task,
            title: input.value,
            edit: false
          }
        }
        return task;
      })
    })
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter)
  }
}
