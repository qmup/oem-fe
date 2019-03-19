import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  template: `
    <owl-form-field class="w-100 px-3 text-center">
      <input
        owlInput
        [min]="minDate"
        [selectMode]="mode"
        [owlDateTimeTrigger]="datepicker"
        [owlDateTime]="datepicker">
      <owl-date-time #datepicker></owl-date-time>
    </owl-form-field>
  `,
  styles: []
})
export class DatepickerComponent {

  minDate = new Date();
  @Input() mode: string;

}
