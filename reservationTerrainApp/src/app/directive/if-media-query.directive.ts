import { Event } from '../model/event';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
//import { isBlank } from '@angular/core/src/facade/lang';

/**
 * How to use this directive?
 *
 * ```
 * <div *ngIfMediaQuery="'(min-width: 500px)'">
 *     Div element will exist only when media query matches, and created/destroyed when the viewport size changes.
 * </div>
 * ```
 */
@Directive({
  selector: '[ngIfMediaQuery]',
  inputs: ['ngIfMediaQuery'],
})
export class NgIfMediaQuery {
  private prevCondition: boolean | null = null;

  private mql!: MediaQueryList;
  private mqlListener!: (ev: MediaQueryListEvent) => any; // reference kept for cleaning up in ngOnDestroy()

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<Object>
  ) {}

  /**
   * Called whenever the media query input value changes.
   */
  set ngIfMediaQuery(newMediaQuery: string) {
    if (!this.mql) {
      this.mql = window.matchMedia(newMediaQuery);

      /* Register for future events */
      this.mqlListener = (e: MediaQueryListEvent) => {
        this.onMediaMatchChange(e.matches);
      };
      let _this = this;
      //      this.mql.addEventListener('change',function(e){_this.onMediaMatchChange(e.matches);});
      this.mql.addEventListener('change', this.mqlListener);
    }

    this.onMediaMatchChange(this.mql.matches);
  }

  ngOnDestroy() {
    this.mql.removeEventListener('change', this.mqlListener);
    //    this.mql = this.mqlListener = null;
    //this.mql = undefined;
  }

  private onMediaMatchChange(matches: boolean) {
    // this has been taken verbatim from NgIf implementation
    if (matches && (this.prevCondition === null || !this.prevCondition)) {
      this.prevCondition = true;
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (
      !matches &&
      (this.prevCondition === null || this.prevCondition)
    ) {
      this.prevCondition = false;
      this.viewContainer.clear();
    }
  }
}
