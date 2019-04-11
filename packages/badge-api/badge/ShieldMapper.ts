import { MutationScoreMapper } from 'stryker-dashboard-data-access';
import { Shield, Color } from './Shield';

export class ShieldMapper {
  constructor(private readonly scoreMapper: MutationScoreMapper) {
  }

  public async shieldFor(provider: string, owner: string, repo: string, branch?: string): Promise<Shield> {
    const mutationScore = await this.scoreMapper.select(
      MutationScoreMapper.createPartitionKey(provider, owner, repo),
      MutationScoreMapper.createRowKey(branch)
    );
    if (mutationScore) {
      const score = Math.round(mutationScore.score * 10) / 10;
      const scoreColor = determineColor(score);
      return {
        color: scoreColor,
        label: 'Mutation score',
        message: `${score}%`,
        schemaVersion: 1
      };
    } else {
      return {
        color: Color.Grey,
        label: 'Mutation score',
        message: 'unknown',
        schemaVersion: 1
      };
    }
  }
}

function determineColor(score: number): Color {
  if (score < 60) {
    return Color.Red;
  } else if (score < 80 && score >= 60) {
    return Color.Orange;
  } else {
    return Color.Green;
  }
}
