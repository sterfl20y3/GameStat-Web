import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  const partialsDir = join(__dirname, '..', 'views', 'partials');
  hbs.registerPartials(partialsDir);

  const sidebarPath = join(partialsDir, 'admin-sidebar.hbs');
  try {
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    hbs.registerPartial('admin-sidebar', sidebarContent);
  } catch (err) {
    console.error('\nFailed to load admin sidebar');
    console.error(sidebarPath);
    console.error(err.message, '\n');
  }

  hbs.registerHelper('substring', (str, start, end) => (str || '').substring(start, end).toUpperCase());
  hbs.registerHelper('eq', (a, b) => a === b);
  hbs.registerHelper('neq', (a, b) => a !== b);
  hbs.registerHelper('gt', (a, b) => a > b);
  hbs.registerHelper('lt', (a, b) => a < b);
  hbs.registerHelper('gte', (a, b) => a >= b);
  hbs.registerHelper('and', (a, b) => a && b);
  hbs.registerHelper('or', (a, b) => a || b);
  hbs.registerHelper('not', (a) => !a);
  hbs.registerHelper('toFixed', (num, digits) => Number(num).toFixed(digits));
  hbs.registerHelper('multiply', (a, b) => a * b);
  hbs.registerHelper('add', (a, b) => a + b);
  hbs.registerHelper('json', (obj) => JSON.stringify(obj));
  hbs.registerHelper('wn8Color', (wn8) => {
    if (wn8 >= 3000) return '#a00dc5';
    if (wn8 >= 2450) return '#d042f3';
    if (wn8 >= 2000) return '#02a8f4';
    if (wn8 >= 1600) return '#318000';
    if (wn8 >= 1200) return '#44b300';
    if (wn8 >= 900) return '#ccb800';
    if (wn8 >= 650) return '#cc7700';
    if (wn8 >= 450) return '#cc1500';
    return '#999999';
  });
  hbs.registerHelper('wn8Label', (wn8) => {
    if (wn8 >= 3000) return 'Super Unicum';
    if (wn8 >= 2450) return 'Unicum';
    if (wn8 >= 2000) return 'Great';
    if (wn8 >= 1600) return 'Very Good';
    if (wn8 >= 1200) return 'Good';
    if (wn8 >= 900) return 'Above Average';
    if (wn8 >= 650) return 'Average';
    if (wn8 >= 450) return 'Below Average';
    return 'Bad';
  });
  hbs.registerHelper('regionFlag', (region) => {
    const flags = { eu: '🇪🇺', na: '🇺🇸', asia: '🌏' };
    return flags[region] || '🌍';
  });
  hbs.registerHelper('formatDate', (date) => {
    return new Date(date).toLocaleDateString('uk-UA');
  });
  hbs.registerHelper('timeAgo', (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'щойно';
    if (hours < 24) return `${hours}г тому`;
    const days = Math.floor(hours / 24);
    return `${days}д тому`;
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n🚀 GameStat running on: http://localhost:${port}`);
  console.log(`📊 Admin panel: http://localhost:${port}/admin`);
}

bootstrap();
