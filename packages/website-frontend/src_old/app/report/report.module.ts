import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MutationTestReportAppTheme,
  ReportPageComponent,
} from './report-page/report-page.component';
import { SharedModule } from '../shared/shared.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [ReportPageComponent, MutationTestReportAppTheme],
    exports: [ReportPageComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [CommonModule, SharedModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ReportModule {}
