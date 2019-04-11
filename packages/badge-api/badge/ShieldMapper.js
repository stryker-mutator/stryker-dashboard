"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stryker_dashboard_data_access_1 = require("stryker-dashboard-data-access");
const Shield_1 = require("./Shield");
class ShieldMapper {
    constructor(scoreMapper) {
        this.scoreMapper = scoreMapper;
    }
    async shieldFor(provider, owner, repo, branch) {
        const mutationScore = await this.scoreMapper.select(stryker_dashboard_data_access_1.MutationScoreMapper.createPartitionKey(provider, owner, repo), stryker_dashboard_data_access_1.MutationScoreMapper.createRowKey(branch));
        if (mutationScore) {
            const score = Math.round(mutationScore.score * 10) / 10;
            const scoreColor = determineColor(score);
            return {
                color: scoreColor,
                label: 'Mutation score',
                message: `${score}%`,
                schemaVersion: 1
            };
        }
        else {
            return {
                color: Shield_1.Color.Grey,
                label: 'Mutation score',
                message: 'unknown',
                schemaVersion: 1
            };
        }
    }
}
exports.ShieldMapper = ShieldMapper;
function determineColor(score) {
    if (score < 60) {
        return Shield_1.Color.Red;
    }
    else if (score < 80 && score >= 60) {
        return Shield_1.Color.Orange;
    }
    else {
        return Shield_1.Color.Green;
    }
}
//# sourceMappingURL=ShieldMapper.js.map