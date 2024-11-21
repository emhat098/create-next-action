#!/usr/bin/env node --no-warnings=ExperimentalWarning
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { config as appConfig } from './app.config.mjs';

const program = new Command();

program
  .name(appConfig.name)
  .description(appConfig.description)
  .version(appConfig.version);

program
  .command('generate')
  .description('Generate a new API and a page functionality')
  .argument('<name>', 'Name of the feature (e.g., "product")')
  .action((name) => {
    const baseDir = process.cwd();

    const paths = {
      appDir: path.join(baseDir, 'app'),
      appPageDir: path.join(baseDir, 'app', name),
      appPageIndex: path.join(baseDir, 'app', name, 'page.js'),
      apiDir: path.join(baseDir, 'app', 'api', name),
      apiIndex: path.join(baseDir, 'app', 'api', name, 'route.js'),
    };

    // Create API Directory
    if (!fs.existsSync(paths.appDir)) {
      throw new Error('Ensure you are in the root folder of Next.js project');
    }

    const pageName = name.charAt(0).toUpperCase() + name.slice(1);

    const pageContent = `
export default function ${pageName}Page() {
  return (
    <div>
      <h1>${pageName} Page</h1>
    </div>
  );
}
    `;

    // Create <Name> Directory
    if (!fs.existsSync(paths.appPageDir)) {
      fs.mkdirSync(paths.appPageDir, { recursive: true });
    }

    // Create app page.
    if (!fs.existsSync(paths.appPageIndex)) {
      fs.writeFileSync(paths.appPageIndex, pageContent);
      console.log(chalk.green(`✔ Page created at: ${paths.appPageIndex}`));
    } else {
      console.log(
        chalk.yellow(`✖ Page already exists at: ${paths.appPageIndex}`),
      );
    }

    // Create API Directory
    if (!fs.existsSync(paths.apiDir)) {
      fs.mkdirSync(paths.apiDir, { recursive: true });
    }

    // Create API File with CRUD Boilerplate
    const apiContent = `
import { NextResponse } from 'next/server';

export function GET() {
  // Handle GET request (Read)
  return NextResponse.json({ message: 'Fetch products' });
}
    `;

    if (!fs.existsSync(paths.apiIndex)) {
      fs.writeFileSync(paths.apiIndex, apiContent);
      console.log(chalk.green(`✔ API created at: ${paths.apiIndex}`));
    } else {
      console.log(chalk.yellow(`✖ API already exists at: ${paths.apiIndex}`));
    }
  });

program.parse(process.argv);
