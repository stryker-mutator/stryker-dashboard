import { config, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);
config.truncateThreshold = 0;
