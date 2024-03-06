import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MutationTestReportAppTheme,
  ReportPageComponent,
} from './report-page/report-page.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ReportPageComponent, MutationTestReportAppTheme],
  imports: [CommonModule, SharedModule, HttpClientModule],
  exports: [ReportPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportModule {}
