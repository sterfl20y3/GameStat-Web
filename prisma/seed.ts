import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const Role = { ADMIN: 'ADMIN' as const, USER: 'USER' as const };
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gamestat.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@gamestat.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin created:', admin.username);

  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@gamestat.com' },
    update: {},
    create: {
      username: 'demo_user',
      email: 'user@gamestat.com',
      password: userPassword,
      role: Role.USER,
    },
  });
  console.log('✅ Demo user created:', user.username);

  const playersData = [
    { nickname: 'ProTanker_EU', region: 'eu', clanTag: '[PRO]', clanName: 'Pro Players', winrate: 62.5, battles: 15420, avgDamage: 2340, wn8: 3250, kills: 18920 },
    { nickname: 'SteelCommander', region: 'eu', clanTag: '[STEEL]', clanName: 'Steel Warriors', winrate: 58.3, battles: 8700, avgDamage: 1980, wn8: 2100, kills: 10230 },
    { nickname: 'NightRider99', region: 'na', clanTag: '[NIGHT]', clanName: 'Night Riders', winrate: 55.1, battles: 12300, avgDamage: 1750, wn8: 1850, kills: 13500 },
    { nickname: 'TankDestroyer', region: 'eu', clanTag: null, clanName: null, winrate: 72.1, battles: 3200, avgDamage: 3100, wn8: 4500, kills: 4800 },
    { nickname: 'BlitzMaster', region: 'eu', clanTag: '[BM]', clanName: 'Blitz Masters', winrate: 50.2, battles: 5600, avgDamage: 1200, wn8: 900, kills: 5800 },
    { nickname: 'ArmorPiercer', region: 'na', clanTag: '[AP]', clanName: 'Armor Piercers', winrate: 65.4, battles: 9800, avgDamage: 2580, wn8: 3100, kills: 12000 },
    { nickname: 'SniperElite', region: 'eu', clanTag: '[SNPR]', clanName: 'Elite Snipers', winrate: 68.9, battles: 6700, avgDamage: 2900, wn8: 3800, kills: 9200 },
    { nickname: 'UA_Kozak', region: 'eu', clanTag: '[SICH]', clanName: 'Kozak Sich', winrate: 64.2, battles: 18500, avgDamage: 2650, wn8: 3400, kills: 21000 },
    { nickname: 'LvivBrawler', region: 'eu', clanTag: '[LVIV]', clanName: 'Lviv Lions', winrate: 59.8, battles: 11200, avgDamage: 2150, wn8: 2450, kills: 14200 },
    { nickname: 'KyivGhost', region: 'eu', clanTag: '[GHOST]', clanName: 'Ghosts of Kyiv', winrate: 75.5, battles: 4500, avgDamage: 3400, wn8: 4900, kills: 7800 },
    { nickname: 'MapleLeaf_NA', region: 'na', clanTag: '[MAPLE]', clanName: 'Canadian Armor', winrate: 53.4, battles: 14000, avgDamage: 1600, wn8: 1700, kills: 15100 },
    { nickname: 'TokyoDrifter', region: 'asia', clanTag: '[DRIFT]', clanName: 'Tokyo Drifters', winrate: 61.1, battles: 9500, avgDamage: 2200, wn8: 2900, kills: 11000 },
    { nickname: 'AussieGunner', region: 'asia', clanTag: '[AUS]', clanName: 'Aussie Gunners', winrate: 57.7, battles: 16800, avgDamage: 1850, wn8: 2050, kills: 17500 },
    { nickname: 'DesertFox', region: 'na', clanTag: '[FOX]', clanName: 'Desert Foxes', winrate: 66.3, battles: 8200, avgDamage: 2750, wn8: 3600, kills: 10400 },
    { nickname: 'Vanguard_X', region: 'eu', clanTag: '[VAN]', clanName: 'Vanguard', winrate: 52.9, battles: 21000, avgDamage: 1500, wn8: 1600, kills: 19800 },
    { nickname: 'ShadowNinja', region: 'asia', clanTag: '[SHDW]', clanName: 'Shadow Ninjas', winrate: 69.5, battles: 5100, avgDamage: 2950, wn8: 4100, kills: 7100 },
    { nickname: 'EagleEye_US', region: 'na', clanTag: '[EAGLE]', clanName: 'Screaming Eagles', winrate: 54.8, battles: 10500, avgDamage: 1700, wn8: 1800, kills: 11200 },
    { nickname: 'PolskaGurom', region: 'eu', clanTag: '[PL]', clanName: 'Winged Hussars', winrate: 63.7, battles: 13400, avgDamage: 2450, wn8: 3150, kills: 16300 },
    { nickname: 'IronClad_UK', region: 'eu', clanTag: '[IRON]', clanName: 'Ironclad Vanguard', winrate: 56.5, battles: 24000, avgDamage: 1850, wn8: 1950, kills: 23100 },
    { nickname: 'TexasRanger', region: 'na', clanTag: '[TX]', clanName: 'Lone Star Tanks', winrate: 49.8, battles: 31000, avgDamage: 1350, wn8: 1100, kills: 28500 },
    { nickname: 'SeoulReaper', region: 'asia', clanTag: '[KR]', clanName: 'Korean Reapers', winrate: 67.2, battles: 12500, avgDamage: 2800, wn8: 3750, kills: 15000 },
    { nickname: 'BerlinWall', region: 'eu', clanTag: '[GER]', clanName: 'Panzer Division', winrate: 58.9, battles: 42000, avgDamage: 2100, wn8: 2400, kills: 45000 },
    { nickname: 'ParisianSniper', region: 'eu', clanTag: '[FR]', clanName: 'French Resistance', winrate: 60.4, battles: 18000, avgDamage: 2250, wn8: 2600, kills: 19500 },
    { nickname: 'GrizzlyBear', region: 'na', clanTag: '[BEAR]', clanName: 'Grizzlies', winrate: 51.5, battles: 9000, avgDamage: 1450, wn8: 1400, kills: 8000 },
    { nickname: 'DragonWarrior', region: 'asia', clanTag: '[DRGN]', clanName: 'Dragon Masters', winrate: 62.8, battles: 16000, avgDamage: 2400, wn8: 3100, kills: 18500 },
    { nickname: 'VikingRaider', region: 'eu', clanTag: '[OODIN]', clanName: 'Sons of Odin', winrate: 55.7, battles: 28000, avgDamage: 1750, wn8: 1850, kills: 29000 },
    { nickname: 'AlpineSkier', region: 'eu', clanTag: '[CH]', clanName: 'Swiss Guard', winrate: 59.1, battles: 14500, avgDamage: 2050, wn8: 2350, kills: 15200 },
    { nickname: 'CactusJack', region: 'na', clanTag: null, clanName: null, winrate: 48.2, battles: 3500, avgDamage: 1100, wn8: 850, kills: 2500 },
    { nickname: 'SamuraiSoul', region: 'asia', clanTag: '[RONIN]', clanName: 'Masterless', winrate: 64.9, battles: 11000, avgDamage: 2600, wn8: 3300, kills: 13500 },
    { nickname: 'BalticStorm', region: 'eu', clanTag: '[BALT]', clanName: 'Baltic Forces', winrate: 57.4, battles: 19500, avgDamage: 1900, wn8: 2150, kills: 20000 },
    { nickname: 'TornadoAlley', region: 'na', clanTag: '[WIND]', clanName: 'Twisters', winrate: 52.8, battles: 21000, avgDamage: 1550, wn8: 1500, kills: 21500 },
    { nickname: 'KiwiSmasher', region: 'asia', clanTag: '[NZ]', clanName: 'All Blacks Armor', winrate: 56.9, battles: 13200, avgDamage: 1800, wn8: 2000, kills: 14000 },
    { nickname: 'CarpathianLynx', region: 'eu', clanTag: '[LYNX]', clanName: 'Mountain Cats', winrate: 61.5, battles: 17400, avgDamage: 2300, wn8: 2800, kills: 19200 },
    { nickname: 'FloridaMan', region: 'na', clanTag: '[FLA]', clanName: 'Swamp Things', winrate: 46.5, battles: 45000, avgDamage: 1200, wn8: 950, kills: 38000 },
    { nickname: 'ManilaMenace', region: 'asia', clanTag: '[PH]', clanName: 'Pearl of the Orient', winrate: 58.1, battles: 8800, avgDamage: 2000, wn8: 2200, kills: 9500 },
  ];

  for (const pd of playersData) {
    const player = await prisma.player.upsert({
      where: { nickname: pd.nickname },
      update: {},
      create: {
        nickname: pd.nickname,
        accountId: `ACC_${Math.floor(1000000 + Math.random() * 9000000)}`,
        region: pd.region,
        clanTag: pd.clanTag,
        clanName: pd.clanName,
      },
    });

    await prisma.stats.create({
      data: {
        playerId: player.id,
        battles: pd.battles,
        wins: Math.floor(pd.battles * pd.winrate / 100),
        losses: Math.floor(pd.battles * (1 - pd.winrate / 100)),
        winrate: pd.winrate,
        avgDamage: pd.avgDamage,
        avgXp: Math.floor(pd.avgDamage * 0.42),
        wn8: pd.wn8,
        kills: pd.kills,
        survivalRate: pd.winrate * 0.65,
      },
    });

    const results = ['win', 'loss', 'win', 'win', 'loss', 'draw', 'win', 'loss', 'win', 'win'];
    const tanks = [
      'IS-7', 'T-62A', 'E 100', 'Leopard 1', 'Obj. 140', 
      'Super Conqueror', 'AMX 50 B', 'Kranvagn', 'STB-1', 'Progetto 65',
      'T110E5', 'Bat.-Châtillon 25 t', 'TVP T 50/51', 'Object 277', 'Vz. 55'
    ];
    
    for (let i = 0; i < 15; i++) {
      const isWin = results[i % results.length] === 'win';
      await prisma.match.create({
        data: {
          playerId: player.id,
          tankName: tanks[Math.floor(Math.random() * tanks.length)],
          tankId: `TANK_${Math.floor(Math.random() * 100)}`,
          result: results[i % results.length],
          damage: Math.floor(pd.avgDamage * (0.5 + Math.random() * 0.8)),
          xp: Math.floor(pd.avgDamage * 0.4 * (0.6 + Math.random() * 0.7)),
          kills: Math.floor(Math.random() * 6),
          survived: isWin && Math.random() > 0.3,
          playedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000 - i * 3600000),
        },
      });
    }

    console.log(`✅ Player created: ${player.nickname}`);
  }

  const metaData = [
    { entityName: 'IS-7', entityType: 'tank', winrate: 51.2, popularity: 8.5, avgDamage: 2100 },
    { entityName: 'T-62A', entityType: 'tank', winrate: 49.1, popularity: 4.2, avgDamage: 1850 },
    { entityName: 'E 100', entityType: 'tank', winrate: 50.8, popularity: 7.1, avgDamage: 2600 },
    { entityName: 'Leopard 1', entityType: 'tank', winrate: 49.5, popularity: 9.3, avgDamage: 2450 },
    { entityName: 'Obj. 140', entityType: 'tank', winrate: 52.2, popularity: 8.9, avgDamage: 2150 },
    { entityName: 'Maus', entityType: 'tank', winrate: 53.7, popularity: 5.1, avgDamage: 2200 },
    { entityName: 'FV215b 183', entityType: 'tank', winrate: 48.2, popularity: 6.8, avgDamage: 3100 },
    { entityName: 'Bat.-Châtillon 25 t', entityType: 'tank', winrate: 50.8, popularity: 5.6, avgDamage: 2000 },
    { entityName: 'Super Conqueror', entityType: 'tank', winrate: 54.5, popularity: 11.2, avgDamage: 2550 },
    { entityName: 'AMX 50 B', entityType: 'tank', winrate: 49.8, popularity: 3.4, avgDamage: 2300 },
    { entityName: 'Kranvagn', entityType: 'tank', winrate: 53.1, popularity: 7.8, avgDamage: 2450 },
    { entityName: 'STB-1', entityType: 'tank', winrate: 52.9, popularity: 8.4, avgDamage: 2350 },
    { entityName: 'Progetto 65', entityType: 'tank', winrate: 48.5, popularity: 6.5, avgDamage: 2100 },
    { entityName: 'T110E5', entityType: 'tank', winrate: 50.1, popularity: 4.9, avgDamage: 2250 },
    { entityName: 'TVP T 50/51', entityType: 'tank', winrate: 51.4, popularity: 5.7, avgDamage: 2150 },
    { entityName: 'Object 277', entityType: 'tank', winrate: 53.8, popularity: 10.5, avgDamage: 2400 },
    { entityName: 'Vz. 55', entityType: 'tank', winrate: 54.2, popularity: 9.8, avgDamage: 2650 },
    { entityName: 'Grille 15', entityType: 'tank', winrate: 48.9, popularity: 8.1, avgDamage: 2500 },
    { entityName: 'T110E3', entityType: 'tank', winrate: 52.6, popularity: 5.3, avgDamage: 2300 },
    { entityName: 'Minotauro', entityType: 'tank', winrate: 53.4, popularity: 7.2, avgDamage: 2200 },
    { entityName: 'Centurion Action X', entityType: 'tank', winrate: 50.5, popularity: 6.0, avgDamage: 2150 },
    { entityName: '60TP Lewandowskiego', entityType: 'tank', winrate: 52.8, popularity: 9.5, avgDamage: 2600 },
    { entityName: 'Strv 103B', entityType: 'tank', winrate: 51.1, popularity: 4.7, avgDamage: 2350 },
    { entityName: 'CS-63', entityType: 'tank', winrate: 50.2, popularity: 8.8, avgDamage: 2100 },
    { entityName: 'Manticore', entityType: 'tank', winrate: 53.9, popularity: 5.5, avgDamage: 1800 },
  ];

  for (const md of metaData) {
    await prisma.metaStat.create({ data: { ...md, region: 'global' } });
  }
  console.log('✅ Meta stats created');

  console.log('\n🎉 Seeding complete!');
  console.log('📧 Admin: admin@gamestat.com / admin123');
  console.log('📧 User:  user@gamestat.com  / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });