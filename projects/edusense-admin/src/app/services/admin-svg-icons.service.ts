import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { ADMIN_SVG_ICONS } from '../_shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AdminSvgIconsService {
  baseSvgPath = './assets/images/svg_files/';
  iconExtension = '.svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  registerIcons() {
    ADMIN_SVG_ICONS.forEach(icon => {
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
