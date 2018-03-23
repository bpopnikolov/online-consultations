import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlightMsg]'
})
export class HighlightMsgDirective implements OnInit {

  @Input() appHighlightMsg: string;
  classToApply = 'highlight';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    if (this.appHighlightMsg.startsWith('!important')) {

      const msg = this.appHighlightMsg.split('!important');
      const parent = this.renderer.parentNode(this.el.nativeElement);

      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.replace(msg[1]));
      this.renderer.setStyle(parent, 'background-color', '#f44336');
    }
  }

  replace(txt: string) {
    const rgx = new RegExp('(@\\w+)', 'gi');
    return txt.replace(rgx, `<span class="${this.classToApply}">$1</span>`);
  }
}
