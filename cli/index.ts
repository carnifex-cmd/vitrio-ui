#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const program = new Command();

function toPascalCase(name: string): string {
  return name
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toUpperCase())
    .replace(/[^A-Za-z0-9]/g, '');
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createFromTemplates(componentName: string) {
  const __dirnameLocal = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.resolve(__dirnameLocal, 'templates');
  const tsxTplPath = path.join(templatesDir, 'Component.tsx.tpl');
  const cssTplPath = path.join(templatesDir, 'Component.module.css.tpl');

  const destDir = path.resolve(process.cwd(), 'src', 'components', componentName);
  ensureDir(destDir);

  const tsxTpl = fs.readFileSync(tsxTplPath, 'utf8');
  const cssTpl = fs.readFileSync(cssTplPath, 'utf8');

  const tsxOut = tsxTpl.replace(/__COMPONENT_NAME__/g, componentName);
  const cssOut = cssTpl.replace(/__COMPONENT_NAME__/g, componentName);

  fs.writeFileSync(path.join(destDir, `${componentName}.tsx`), tsxOut, 'utf8');
  fs.writeFileSync(path.join(destDir, `${componentName}.module.css`), cssOut, 'utf8');
}

program
  .name('vitrio-cli')
  .description('CLI for Vitrio UI')
  .version('0.1.0');

program
  .command('generate')
  .argument('<ComponentName>', 'Name of the component to generate (PascalCase)')
  .action((rawName: string) => {
    const componentName = toPascalCase(rawName);
    if (!componentName || /[^A-Za-z0-9]/.test(componentName)) {
      console.error(chalk.red('Invalid component name. Use PascalCase letters and numbers.'));
      process.exit(1);
    }
    try {
      createFromTemplates(componentName);
      console.log(chalk.green(`Component ${componentName} created in src/components/${componentName}`));
    } catch (err) {
      console.error(chalk.red('Failed to generate component:'), err);
      process.exit(1);
    }
  });

program.parse(process.argv); 