import { NgModule } from '@angular/core';
import { FilterUsersPipe } from './filter-users.pipe';
import { HighlightMsgDirective } from './highlight-msg.directive';
import { HighlightWordDirective } from './highlight-word.directive';


@NgModule({
  declarations: [
    HighlightWordDirective,
    HighlightMsgDirective,
    FilterUsersPipe,
  ],
  imports: [
  ],
  exports: [
    HighlightWordDirective,
    HighlightMsgDirective,
    FilterUsersPipe,

  ]

})
export class SharedModule { }
