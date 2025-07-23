// tabs.component.ts
import {
  Component,
  ContentChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectVal } from 'src/definition/global.definition';
import { SolidThemeColor } from '../badges-without-bg/badges-without-bg.component';


export interface Tab {
  id: string;
  label: string; // Menambahkan label untuk setiap tab
}

type TabVariant = 'underline' | 'pills' | 'bordered';

const TabThemeClass: Record<ObjectVal<typeof SolidThemeColor>, {textColor: string, background: string, borderBottomColor: string}> = {
    [SolidThemeColor.RED]: {textColor: 'text-text-brand', background: 'bg-tint-brand', borderBottomColor: 'bg-solid-brand'},
    [SolidThemeColor.GREEN]: {textColor: 'text-text-green', background: 'bg-tint-green', borderBottomColor: 'bg-solid-green'},
    [SolidThemeColor.MAROON]: {textColor: 'text-text-maroon', background: 'bg-tint-maroon', borderBottomColor: 'bg-solid-maroon'},
    [SolidThemeColor.YELLOW]: {textColor: 'text-text-yellow', background: 'bg-tint-yellow', borderBottomColor: 'bg-solid-yellow'},
    [SolidThemeColor.CYAN]: {textColor: 'text-text-cyan', background: 'bg-tint-cyan', borderBottomColor: 'bg-solid-cyan'},
    [SolidThemeColor.BLUE]: {textColor: 'text-text-blue', background: 'bg-tint-blue', borderBottomColor: 'bg-solid-blue'},
    [SolidThemeColor.TEAL]: {textColor: 'text-text-teal', background: 'bg-tint-teal', borderBottomColor: 'bg-solid-teal'},
    [SolidThemeColor.MAGENTA]: {textColor: 'text-text-magenta', background: 'bg-tint-magenta', borderBottomColor: 'bg-solid-magenta'},
    [SolidThemeColor.ORANGE]: {textColor: 'text-text-orange', background: 'bg-tint-orange', borderBottomColor: 'bg-solid-orange'},
    [SolidThemeColor.PURPLE]: {textColor: 'text-text-primary', background: 'bg-y-brand-subtle-default', borderBottomColor: 'bg-line-warning'},
}

@Component({
  selector: 'app-tabs2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
})
export class Tabs2Component implements OnChanges {
  @Input() variant: TabVariant = 'underline';
  @Input() initialTab?: string;
  @Input() tabItems: Tab[] = []; // Menambahkan input untuk tab items
  @Input() theme: ObjectVal<typeof SolidThemeColor> = SolidThemeColor.RED
  @Output() tabChanged = new EventEmitter<string>();

  @ContentChild('leftIconTemplate') leftIconTemplate?: TemplateRef<any>;
  @ContentChild('rightIconTemplate') rightIconTemplate?: TemplateRef<any>;
  @ContentChild('textTemplate') textTemplate!: TemplateRef<any>;

  activeTabId: string = 'tab1';

  get themeClass() {
    return TabThemeClass[this.theme];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialTab'] && changes['initialTab'].currentValue) {
        this.activeTabId = changes['initialTab'].currentValue;
    }

  }

  setActiveTab(tabId: string) {
      if (this.activeTabId !== tabId) {
          this.activeTabId = tabId;
          this.tabChanged.emit(tabId);
      }
  }

  getIconClasses(tabId: string): string {
    return this.activeTabId === tabId 
      ? this.themeClass.textColor 
      : 'text-text-default';
  }

  getTabClasses(tabId: string): string {
      const baseClasses =
          'flex items-center gap-2 px-6 py-3 cursor-pointer relative font-semibold text-xs';
      const activeClasses =
          this.activeTabId === tabId
              ? this.themeClass.textColor
              : 'text-text-subtlest ';

      if (this.variant === 'pills') {
          const borderClasses =
              `flex items-center  rounded-md gap-2 px-3 py-2 cursor-pointer relative font-semibold text-xs ${this.themeClass.textColor} transition-all duration-200 ease-in-out hover:brightness-90`;
          const activeState =
              this.activeTabId === tabId
                  ? `text-text-primary  bg-[#F6F0FF]`
                  : '';
          return ` ${activeClasses} ${borderClasses} ${activeState}`;
      }
      if (this.variant === 'bordered') {
          const borderClasses =
              `flex items-center gap-2 px-14 py-5 cursor-pointer relative font-semibold text-xs ${this.themeClass.textColor} border-r-2 justify-center`;
          const activeState =
              this.activeTabId === tabId
                  ? `bg-surface-default ${this.themeClass.textColor}`
                  : '';
          return ` ${activeClasses} ${borderClasses} ${activeState}`;
      }

      return `${baseClasses} ${activeClasses}`;
  }

  getContainerClasses(): string {
      if (this.variant === 'pills') {
          return 'flex space-x-1 ';
      } else if (this.variant === 'bordered') {
          return 'flex border-2 border-line-default w-fit rounded-lg pl-1';
      } else {
          return 'flex border-b-2 border-line-default';
      }
  }

  getIndicatorClasses(tabId: string): string {
      if (this.variant === 'pills') {
          return 'hidden';
      }

      return this.activeTabId === tabId
          ? `absolute -bottom-0.5 left-0 w-full h-0.5 ${this.themeClass.borderBottomColor} z-20`
          : 'absolute bottom-0 left-0 w-full h-0.5 bg-transparent';
  }
}