import { ConsoleLogger, Injectable } from '@nestjs/common';
import appInsights from 'applicationinsights';

@Injectable()
export class AppInsightsLogger extends ConsoleLogger {
  #client: appInsights.TelemetryClient;
  #isInitialized = false;

  constructor(context: string) {
    super(context);
    if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
      appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .start();

      this.#isInitialized = true;
    }

    this.#client = appInsights.defaultClient;
  }

  log(message: string, context?: string) {
    super.log(message, context);

    if (this.#isInitialized) {
      this.#client.trackTrace({ message, severity: 1, properties: { context } });
      this.#client.flush();
    }
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);

    if (this.#isInitialized) {
      this.#client.trackException({ exception: new Error(message), properties: { trace, context } });
      this.#client.flush();
    }
  }

  warn(message: string, context?: string) {
    super.warn(message, context);

    if (this.#isInitialized) {
      this.#client.trackTrace({ message, severity: 2, properties: { context } });
      this.#client.flush();
    }
  }

  debug(message: string, context?: string) {
    super.debug?.(message, context);

    if (this.#isInitialized) {
      this.#client.trackTrace({ message, severity: 0, properties: { context } });
      this.#client.flush();
    }
  }

  verbose(message: string, context?: string) {
    super.verbose?.(message, context);

    if (this.#isInitialized) {
      this.#client.trackTrace({ message, severity: 0, properties: { context } });
      this.#client.flush();
    }
  }
}
