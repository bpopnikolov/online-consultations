import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightWordDirective } from './highlight-word.directive';
import { HighlightMsgDirective } from './highlight-msg.directive';

@NgModule({
  declarations: [
    HighlightWordDirective,
    HighlightMsgDirective
  ],
  imports: [
  ],
  exports: [
    HighlightWordDirective,
    HighlightMsgDirective
  ]

})
export class SharedModule { }
