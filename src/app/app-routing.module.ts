import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'system', loadChildren: './system/system.module#SystemModule'}, // Ленивая подгрузка;
    {path: '**', component: NotFoundComponent} // 404;
];

@NgModule({
   imports: [RouterModule.forRoot(routes, {
       preloadingStrategy: PreloadAllModules // Отпимизация загрузки;
   })],
   exports: [RouterModule]
})

export class  AppRoutingModule {}