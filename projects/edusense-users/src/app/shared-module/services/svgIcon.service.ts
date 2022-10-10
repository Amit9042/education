import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HOME_SVG_ICONS } from '@sharedModule/constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgIconsService {
  baseSvgPath = './assets/images/svg_files/';
  iconExtension = '.svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  registerIcons() {
    HOME_SVG_ICONS.forEach(icon => {
      this.addSvgIcon(icon);
    });
  }

  addSvgIcon = (icon: string) => {
    this.matIconRegistry.addSvgIcon(
      icon,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `${this.baseSvgPath}${icon}${this.iconExtension}`
      )
    );
  }
}
