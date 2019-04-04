import MutationScore from './models/MutationScore';
import Mapper from './Mapper';
import TableServiceAsPromised from './TableServiceAsPromised';

export default class MutationScoreMapper extends Mapper<MutationScore> {
  constructor(tableService: TableServiceAsPromised = new TableServiceAsPromised()) {
    super('MutationScore', 'slug', 'branch', tableService)
  }
}