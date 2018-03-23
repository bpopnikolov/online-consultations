import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightWord]'
})
export class HighlightWordDirective implements OnInit {

  @Input() appHighlightWord: string;
  classToApply = 'highlight';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.


    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.replace(this.appHighlightWord));
  }

  replace(txt: string) {
    const rgx = new RegExp('(@\\w+)', 'gi');
    return txt.replace(rgx, `<span class="${this.classToApply}">$1</span>`);
  }

}
