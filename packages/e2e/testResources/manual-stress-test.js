/* eslint-disable no-undef */
// @ts-check
import axios from 'axios';
import { promises as fs } from 'fs';
const httpClient = axios.create({ baseURL: 'http://localhost:4200' });

async function uploadAll() {
  const fileNames = await fs.readdir(
    new URL('stryker-reports', import.meta.url)
  );

  const files = await Promise.all(
    fileNames.map(async (name) => ({
      name,
      content: JSON.parse(
        await fs.readFile(
          new URL(`stryker-reports/${name}`, import.meta.url),
          'utf8'
        )
      ),
    }))
  );
  await Promise.all(
    files.map(async (file) => {
      const parts = file.name.split('_');
      const moduleName = parts[parts.length - 1].substr(
        0,
        parts[parts.length - 1].indexOf('.')
      );
      const projectAndVersion = parts.slice(0, parts.length - 1).join('/');
      const result = await httpClient.put(
        `/api/reports/${projectAndVersion}?module=${moduleName}`,
        file.content,
        {
          headers: {
            ['X-Api-Key']: '<API_KEY>',
          },
        }
      );
      console.log(result.status, result.statusText, result.data);
    })
  );
}

uploadAll().catch((err) => console.error(err));
