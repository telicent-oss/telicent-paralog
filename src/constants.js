import appConfigJson from './app.config.json';
import z from 'zod';

const AppConfigJsonSchema = z.object({
  name: z.string(),
  repo_name: z.string(),
  app_name: z.string(),
  app_name_snake_case: z.string(),
  'uri-basename': z.string(),
  brandColor: z.string(),
});

export const APP_CONFIG_JSON = AppConfigJsonSchema.parse(appConfigJson);
