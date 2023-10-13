import { RepositoryResult } from '../../components/common/repository-result';

declare global {
  interface HTMLElementTagNameMap {
    'repository-result': RepositoryResult;
  }
}

customElements.define('repository-result', RepositoryResult);
