# ⚡ GameStat — Аналітика ігрової статистики

Повноцінний вебзастосунок для аналізу статистики гравців World of Tanks.  
Побудований на **NestJS MVC + Prisma ORM + Handlebars + SQLite**.

---

## 📦 Технологічний стек

| Шар | Технологія |
|-----|-----------|
| Backend | NestJS 10 (MVC, без REST — рендер на сервері) |
| ORM | Prisma 5 + SQLite (легко замінити на PostgreSQL) |
| View Engine | Handlebars (hbs) |
| Auth | JWT у cookie + Passport.js |
| Стилі | Власний CSS (dark gaming theme) |
| Графіки | Chart.js 4 (CDN) |
| Scheduler | @nestjs/schedule (cron jobs) |
| API | Wargaming API (або mock-дані без ключа) |

---

## 🗂️ Структура проекту

```
gamestat/
├── prisma/
│   ├── schema.prisma       # схема БД
│   └── seed.ts             # початкові дані
├── src/
│   ├── main.ts             # точка входу
│   ├── app.module.ts
│   ├── app.controller.ts   # головна сторінка
│   ├── auth/               # JWT авторизація, стратегії
│   ├── users/              # кабінет, обрані, історія
│   ├── players/            # пошук, профіль, кеш API
│   ├── stats/              # глобальна статистика
│   ├── leaderboard/        # топ гравці, топ клани
│   ├── meta/               # мета-статистика + cron
│   ├── admin/              # CRUD панель адміна
│   ├── prisma/             # PrismaService (global)
│   └── common/             # guards, filters
├── views/
│   ├── home.hbs
│   ├── error.hbs
│   ├── partials/           # navbar, footer, admin-sidebar
│   ├── auth/               # login, register
│   ├── players/            # profile, list, not-found
│   ├── leaderboard/
│   ├── meta/
│   ├── dashboard/
│   └── admin/              # dashboard, users, players, meta, logs
├── public/
│   ├── css/style.css
│   └── js/app.js
├── .env.example
└── README.md
```

---

## ⚙️ Що потрібно зробити перед запуском

### 1. Встановити Node.js

Потрібна версія **Node.js 18+**.

Перевір версію:
```bash
node --version
```

Якщо не встановлено — завантаж з [nodejs.org](https://nodejs.org/).

---

### 2. Клонувати / розпакувати проект

```bash
unzip gamestat.zip
cd gamestat
```

---

### 3. Встановити залежності

```bash
npm install
```

---

### 4. Налаштувати змінні середовища

Скопіюй файл `.env.example` → `.env`:

```bash
cp .env.example .env
```

Відкрий `.env` і за потреби зміни значення:

```env
DATABASE_URL="file:./dev.db"          # SQLite база (за замовчуванням)
JWT_SECRET="змінити-на-свій-секрет"   # будь-який рядок
JWT_EXPIRES_IN="7d"
PORT=3000

# Необов'язково — API ключ Wargaming
# Отримати безкоштовно на: https://developers.wargaming.net/
WARGAMING_API_KEY=""
```

> **Без API ключа** — застосунок працює з **mock-даними** для демонстрації. Пошук гравця генерує реалістичні тестові дані.

---

### 5. Згенерувати Prisma Client і накатити міграції

```bash
npx prisma generate
npx prisma migrate dev --name init
```

> Ця команда створює файл бази даних `prisma/dev.db` та всі таблиці автоматично.

---

### 6. Заповнити базу початковими даними

```bash
npm run seed
```

Після цього в базі з'являться:
- **Адмін:** `admin@gamestat.com` / `admin123`
- **Юзер:** `user@gamestat.com` / `user123`
- 8 тестових гравців з статистикою та матчами
- Мета-статистика по танках

---

## 🚀 Запуск

### Режим розробки (з авто-перезавантаженням):
```bash
npm run start:dev
```

### Продакшн збірка:
```bash
npm run build
npm run start
```

Відкрий браузер: **http://localhost:3000**

---

## 📄 Сторінки застосунку

| URL | Опис | Доступ |
|-----|------|--------|
| `/` | Головна — пошук, топ гравці, мета | Всі |
| `/players/search?q=NICKNAME` | Пошук гравця | Всі |
| `/players/:id` | Профіль гравця + графіки | Всі |
| `/players` | Список всіх гравців | Всі |
| `/leaderboard` | Топ гравці та клани | Всі |
| `/meta` | Мета-статистика по технікам | Всі |
| `/auth/login` | Вхід | Гість |
| `/auth/register` | Реєстрація | Гість |
| `/dashboard` | Особистий кабінет | USER |
| `/admin` | Адмін-дашборд | ADMIN |
| `/admin/users` | CRUD користувачів | ADMIN |
| `/admin/players` | Управління кешем | ADMIN |
| `/admin/meta` | CRUD мета-статистики | ADMIN |
| `/admin/logs` | Логи активності | ADMIN |

---

## 🔐 Ролі та доступ

| Роль | Можливості |
|------|-----------|
| **Гість** | Перегляд профілів, лідерборду, мети |
| **USER** | + Додавання в обране, особистий кабінет |
| **ADMIN** | + Повний CRUD, логи, управління користувачами |

---

## 🗄️ Схема бази даних

```
User          — користувачі системи (USER / ADMIN)
Player        — кешовані гравці з API
Stats         — снапшоти статистики гравців (історія)
Match         — матчі гравців
Favorite      — обрані гравці юзера
ViewHistory   — історія переглядів
MetaStat      — мета-статистика по танках
ActivityLog   — логи дій для адміна
```

---

## 🌐 Wargaming API (опціонально)

1. Зареєструйся на [developers.wargaming.net](https://developers.wargaming.net/)
2. Створи застосунок і отримай `application_id`
3. Встав в `.env`:
   ```env
   WARGAMING_API_KEY="твій_ключ"
   ```
4. За замовчуванням використовується EU регіон (`api.worldoftanks.eu`)

Без ключа — пошук генерує **детерміновані mock-дані** на основі нікнейму. Це дозволяє демонструвати всі функції без реального API.

---

## 🔧 Корисні команди

```bash
# Переглянути базу через GUI
npx prisma studio

# Скинути базу і заповнити знову
npx prisma migrate reset
npm run seed

# Збілдити проект
npm run build

# Запустити збілдований проект
npm start
```

---

## 🏗️ Архітектура

```
Request → NestJS Router → Guard (JWT/Role) → Controller → Service → Prisma → SQLite
                                                     ↓
                                             Handlebars View → HTML Response
```

**Особливості:**
- **MVC без REST** — сервер рендерить HTML через Handlebars
- **Cookie-based JWT** — токен зберігається в HttpOnly cookie
- **DB-кеш API** — запити до Wargaming кешуються в БД на 1 годину
- **Cron job** — щодня о 00:00 оновлює мета-статистику
- **Role-based guards** — JwtAuthGuard + AdminGuard на NestJS рівні
- **Global exception filter** — красива сторінка помилки для всіх виключень

---

## 📝 Примітки для захисту

- ✅ **ORM + міграції**: Prisma з автоматичними міграціями
- ✅ **Авторизація + ролі**: JWT, USER/ADMIN, Guards
- ✅ **Інтерфейс**: повноцінний UI з темною темою, графіками, адаптивністю
- ✅ **CRUD**: Users, Players (cache), MetaStats, Favorites
- ✅ **Не банальщина**: API інтеграція, аналітика, WN8, кеш, cron, лідерборди
