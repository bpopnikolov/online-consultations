import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  ReflectiveInjector
} from '@angular/core';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

@Component({
  selector: 'app-chat-window-factory',
  templateUrl: './chat-window-factory.component.html',
  styleUrls: ['./chat-window-factory.component.css'],
  entryComponents: [ChatWindowComponent]
})
export class ChatWindowFactoryComponent implements OnInit {

  currentComponent: any = [];

  @ViewChild('chatWindowContainer', { read: ViewContainerRef }) ChatWindowContainer: ViewContainerRef;

  @Input() set componentData(data: { component: any, inputs: any }) {
    if (!data) {
      return;
    }

    const inputProviders = Object.keys(data.inputs).map((inputName) => {
      return { provide: inputName, useValue: data.inputs[inputName] };
    });
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.ChatWindowContainer.parentInjector);

    const factory = this.resolver.resolveComponentFactory(data.component);

    const component = factory.create(injector);

    this.ChatWindowContainer.insert(component.hostView);

    this.currentComponent.push(component);

  }



  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

}
