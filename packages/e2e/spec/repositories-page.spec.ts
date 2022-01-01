// import { RepositoriesPage } from '../po/repositories/repositories-page.po';
// import { logOn, logOff } from '../actions/auth.action';
// import { enableRepository, getUserRepositories } from '../actions/report.action';
// import { expect } from 'chai';
// import { RepositorySwitchPageObject } from '../po/repositories/repository-switch.po';
// import { Repository } from '@stryker-mutator/dashboard-contract/src';

// // Example: 0527de29-6436-4564-9c5f-34f417ec68c0
// const API_KEY_REGEX = /^[0-9a-z]{8}-(?:[0-9a-z]{4}-){3}[0-9a-z]{12}$/;

// describe('Repositories page', () => {
//   let page: RepositoriesPage;

//   before(async () => {
//     await logOn();
//     page = new RepositoriesPage();
//     await page.navigate();
//   });

//   after(async () => {
//     await logOff();
//   });

//   it('should list all my repos', async () => {
//     const repoNames = await page.repositoryList.allRepositoryNames();
//     expect(repoNames).deep.eq([
//       'github.com/strykermutator-test-account/hello-test',
//       'github.com/strykermutator-test-account/hello-world'
//     ]);
//   });

//   it('should all be disabled', async () => {
//     const repos = await page.repositoryList.all();
//     const areEnabled = await Promise.all(repos.map(repo => repo.isEnabled()));
//     expect(areEnabled).deep.eq([false, false]);
//   });

//   it('should not show the modal dialog', async () => {
//     expect(await page.modalDialog.isVisible()).false;
//   });

//   describe('owner selector', () => {
//     it('should show the username and organization', async () => {
//       expect(await page.ownerSelector.optionValues()).deep.eq([
//         'strykermutator-test-account',
//         'stryker-mutator-test-organization'
//       ]);
//     });

//     describe('when selecting an organization', () => {
//       before(async () => {
//         await page.ownerSelector.select('stryker-mutator-test-organization');
//       });

//       after(async () => {
//         await page.ownerSelector.select('strykermutator-test-account');
//       });

//       it('should show the repo\'s belonging to that organization', async () => {
//         const repoNames = await page.repositoryList.allRepositoryNames();
//         expect(repoNames).deep.eq([
//           'github.com/stryker-mutator-test-organization/hello-org'
//         ]);
//       });
//     });
//   });

//   describe('when enabling a repository', () => {
//     before(async () => {
//       const repos = await page.repositoryList.all();
//       await repos[0].flipSwitch();
//     });

//     after(async () => {
//       if (await page.modalDialog.isVisible()) {
//         await page.modalDialog.close();
//       }
//     });

//     it('should show the modal dialog', async () => {
//       expect(await page.modalDialog.isVisible()).true;
//       expect(await page.modalDialog.title()).eq('hello-test');
//     });

//     it('should show the api key', async () => {
//       const apiKey = await page.modalDialog.apiKeyGenerator.apiKey();
//       expect(apiKey).matches(API_KEY_REGEX);
//     });

//     it('should show an explanation "About your key"', async () => {
//       const card = await page.modalDialog.accordion.getCard('About your key');
//       expect(await card.isBodyVisible()).true;
//     });

//     it('should hide "About your key" explanation when activated again', async () => {
//       const card = await page.modalDialog.accordion.activateCard('About your key');
//       expect(await card.isBodyVisible()).false;
//     });

//   });

//   describe('when a repository is enabled', () => {
//     let repositoryPageObject: RepositorySwitchPageObject;
//     let repository: Repository;
//     before(async () => {
//       const allRepositories = await getUserRepositories();
//       repository = allRepositories[1];
//       await enableRepository(repository.slug);
//       await page.navigate();
//       repositoryPageObject = (await page.repositoryList.all())[1];
//     });

//     it('should show the mutation score badge for that repo', async () => {
//       expect(await repositoryPageObject.mutationScoreBadge.hasLink()).true;
//       expect(await repositoryPageObject.mutationScoreBadge.imgSrc()).contains(encodeURIComponent(repository.slug));
//       expect(await repositoryPageObject.mutationScoreBadge.linkHref()).contains(`reports/${repository.slug}`);
//     });

//     describe('and displayed', () => {
//       before(async () => {
//         await repositoryPageObject.display();
//       });
//       it('should hide the API key', async () => {
//         expect(await page.modalDialog.apiKeyGenerator.apiKey()).contains('•••••••••••••••••••');
//       });

//       it('should generate a new api key if "Generate new" is clicked', async () => {
//         await page.modalDialog.apiKeyGenerator.generateNew();
//         expect(await page.modalDialog.apiKeyGenerator.apiKey()).match(API_KEY_REGEX);
//       });
//     });
//   });
// });
