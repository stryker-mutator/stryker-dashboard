import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ClipboardCopyComponent } from './clipboard-copy/clipboard-copy.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ClipboardCopyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    ClipboardCopyComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }
