import {NgModule} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoaderComponent} from './components/loader/loader.component';


@NgModule({
    declarations: [LoaderComponent],
    imports: [ReactiveFormsModule, FormsModule, NgxChartsModule],
    exports: [ReactiveFormsModule, FormsModule, NgxChartsModule, LoaderComponent],
})

export class SharedModule {}