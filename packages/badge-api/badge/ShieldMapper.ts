import { MutationTestingReportMapper } from '@stryker-mutator/dashboard-data-access';
import { Shield, Color } from './Shield.js';

export class ShieldMapper {
  constructor(private readonly reportMapper: MutationTestingReportMapper) {}

  public async shieldFor(
    projectName: string,
    version: string,
    moduleName?: string,
  ): Promise<Shield> {
    const report = await this.reportMapper.findOne({
      projectName,
      version,
      moduleName,
    });
    if (report) {
      const score = Math.round(report.model.mutationScore * 10) / 10;
      const scoreColor = determineColor(score);
      return {
        color: scoreColor,
        label: 'Mutation score',
        message: `${score}%`,
        schemaVersion: 1,
      };
    } else {
      return {
        color: Color.Grey,
        label: 'Mutation score',
        message: 'unknown',
        schemaVersion: 1,
      };
    }
  }
}

function determineColor(score: number): Color {
  if (score < 60) {
    return Color.Red;
  } else if (score < 80) {
    return Color.Orange;
  } else if (score < 100) {
    return Color.Green;
  } else {
    return Color.BrightGreen;
  }
}
