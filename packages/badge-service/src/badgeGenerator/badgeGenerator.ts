import { createMutationTestingReportMapperWithoutReportJson } from '@stryker-mutator/dashboard-data-access';
import * as httpHelpers from '../helpers/helpers';
import { retrieveUnknownBadge } from '../helpers/helpers';

const scoreRepo = createMutationTestingReportMapperWithoutReportJson();

export = async function run(context: any, req: any) {
  const statusCode = 400;
  context.res = {
    status: statusCode,
  };

  async function setResult(badgePromise: Promise<string | undefined>) {
    let badge = await badgePromise;
    if (!badge) {
      badge = await retrieveUnknownBadge();
    }

    context.res = {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Content-Type': 'image/svg+xml'
      },
      body: badge
    };
  }

  try {
    const mutationScore = await scoreRepo.findOne({
      repositorySlug: `${context.bindingData.provider}/${context.bindingData.owner}/${context.bindingData.repo}`,
      version: context.bindingData.branch || '',
      moduleName: context.bindingData.moduleName
    });
    if (mutationScore) {
      const score = Math.round(mutationScore.mutationScore * 10) / 10;
      const scoreColor = determineColor(score);
      await setResult(retrieveBadge(scoreColor, score.toFixed(1)));
    }
    else {
      await setResult(retrieveUnknownBadge());
    }
  }
  catch (error) {
    httpHelpers.logError(error);
    await setResult(retrieveUnknownBadge());
  }
};

function determineColor(score: number): Color {
  if (score < 60) {
    return Color.Red;
  }
  else if (score < 80 && score >= 60) {
    return Color.Orange;
  }
  else {
    return Color.Green;
  }
}

enum Color {
  Grey = 'lightgrey',
  Red = 'red',
  Orange = 'orange',
  Green = 'green'
}

function retrieveBadge(color: Color, score: string): Promise<string | undefined> {
  const url = `https://img.shields.io/badge/mutation%20score-${score}-${color}.svg`;
  return httpHelpers.getContent(url);
}
