import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fade = trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition(':enter, :leave', [animate(150)]),
]);

export const move = trigger('move', [
  state(
    'void',
    style({
      transform: `translateX(0px) translateY(0px)`,
    }),
    { params: { X: 0, Y: 0 } }
  ),
  state(
    'moved',
    style({
      transform: `translateX(0px) translateY(0px)`,
    }),
    { params: { X: 0, Y: 0 } }
  ),
  transition('void => moved', [
    style({ transform: `translateX({{X}}px) translateY({{Y}}px)` }),
    animate('300ms', style({ transform: `translateX(0px) translateY(0px)` })),
  ]),
]);
