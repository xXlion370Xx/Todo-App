
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Hola!';
  tasks = signal([
    'Instalar el Angular CLI',
    'Crear proyecto',
    'Crear componentes'
  ]);
  name = signal('Daniel');
  age = 18;
  disabled = true
  img = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1f/ad/7f/16/caption.jpg?w=1200&h=-1&s=1';

  person = signal({
    name: 'Daniel',
    avatar: 'Alg0?',
    age: this.age
  })

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(20, {
    nonNullable: true
  })
  nameCtrl = new FormControl('Daniel', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });
  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);

    })
  }

  clickHandler(): string {
    alert('Presionaste el boton')
    return "P"
  }

  changeHandler(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  keyDownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);

    console.log(input.value);
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newName = input.value;

    this.person.update((person) => {
      return {
        ...person,
        name: newName
      }
    }
    )
  }
}
