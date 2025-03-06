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

/* export const move = trigger('move', [
  state(
    'active',
    style({
      transform: `translateX({{X}}px) translateY({{Y}}px)`,
    }),
    { params: { X: 0, Y: 0 } }
  ),
  transition(':enter', [animate('300ms')]),
]);
 */