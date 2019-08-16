import {Component, HostBinding} from '@angular/core';
import {fadeStateTrigger} from '../shared/animations/fade.animations';

@Component({
    selector: 'wfm-system',
    templateUrl: './system.component.html',
    animations: [fadeStateTrigger] // Анимация страницы;
})
export class SystemComponent {
    @HostBinding('@fade') a = true; // Анимация страницы подключаем библиотека;
}
