require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');

async function fix() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  // Fix products
  const productFixes = {
    'Domaca jajca (prosta reja)': 'Domača jajca (prosta reja)',
    'Prepelicja jajca': 'Prepeličja jajca',
    'Sveze alpsko mleko': 'Sveže alpsko mleko',
    'Domac jogurt': 'Domač jogurt',
    'Alpski sir (zorjen 6 mesecev)': 'Alpski sir (zorjen 6 mesecev)',
    'Eko paradizniki': 'Eko paradižniki',
    'Eko solata (mesano)': 'Eko solata (mešano)',
    'Eko bucke': 'Eko bučke',
    'Eko cesen': 'Eko česen',
    'Jabolka Jonagold': 'Jabolka Jonagold',
    'Hruske Williams': 'Hruške Williams',
    'Domac jabolcni sok': 'Domač jabolčni sok',
    'Suhe slive': 'Suhe slive',
    'Cvetlicni med': 'Cvetlični med',
    'Akacijev med': 'Akacijev med',
    'Gozdni med': 'Gozdni med',
    'Propolis kapljice': 'Propolis kapljice',
    'Medeno pecivo': 'Medeno pecivo',
    'Domaca svinjska salama': 'Domača svinjska salama',
    'Goveje meso (zrezki)': 'Goveje meso (zrezki)',
    'Piscancje prsi': 'Piščančje prsi',
    'Domaca klobasa': 'Domača klobasa',
    'Mikro zelenjava mix': 'Mikro zelenjava mix',
    'Sveza bazilika': 'Sveža bazilika',
    'Cherry paradizniki': 'Cherry paradižniki',
    'Sveze mleko': 'Sveže mleko',
    'Domaca skuta': 'Domača skuta',
    'Prosta reja jajca': 'Prosta reja jajca',
    'Rdeca pesa': 'Rdeča pesa',
    'Rzen kruh': 'Ržen kruh',
    'Domaci struklji': 'Domači štruklji',
  };

  const descFixes = {
    '10 kosov, kokosi prosto rejene na travniku': '10 kosov, kokoši prosto rejene na travniku',
    '12 kosov, bogata z beljakovinami': '12 kosov, bogata z beljakovinami',
    'Nepasterizirano mleko z alpskih travnikov': 'Nepasterizirano mleko z alpskih travnikov',
    'Naravni jogurt brez dodatkov, 500ml': 'Naravni jogurt brez dodatkov, 500ml',
    'Trdi sir, zorjen v nasi kleti': 'Trdi sir, zorjen v naši kleti',
    'Domace maslo, 250g': 'Domače maslo, 250g',
    'Soncno zreli paradizniki, razlicne sorte': 'Sončno zreli paradižniki, različne sorte',
    'Rdeca in rumena paprika': 'Rdeča in rumena paprika',
    'Mesana solata, sveza iz vrta': 'Mešana solata, sveža iz vrta',
    'Mlade zelene bucke': 'Mlade zelene bučke',
    'Domaci cesen, mocen okus': 'Domači česen, močen okus',
    'Sladka in socna jabolka': 'Sladka in sočna jabolka',
    'Zrele hruske, odlicne za solato ali desert': 'Zrele hruške, odlične za solato ali desert',
    '100% naravni sok brez dodanega sladkorja': '100% naravni sok brez dodanega sladkorja',
    'Soncno susene slive iz nasega sadovnjaka': 'Sončno sušene slive iz našega sadovnjaka',
    'Vecvrstni cvetlicni med iz Gorenjske': 'Večvrstni cvetlični med iz Gorenjske',
    'Svetel in mil akacijev med': 'Svetel in mil akacijev med',
    'Temen in aromaticen gozdni med': 'Temen in aromatičen gozdni med',
    'Naravne propolis kapljice, 30ml': 'Naravne propolis kapljice, 30ml',
    'Tradicionalni medenjaki, 200g': 'Tradicionalni medenjaki, 200g',
    'Suha svinjska salama, zorjena 3 mesece': 'Suha svinjska salama, zorjena 3 mesece',
    'Svezi goveji zrezki iz prosto rejenih govedi': 'Sveži goveji zrezki iz prosto rejenih govedi',
    'Prosto rejeni piscanci': 'Prosto rejeni piščanci',
    'Tradicionalna kranjska klobasa': 'Tradicionalna kranjska klobasa',
    'Mesanica mikro zelisc, 100g': 'Mešanica mikro zelišč, 100g',
    'Loncek sveze bazilike': 'Lonček sveže bazilike',
    'Sladki cherry paradizniki, razlicne barve': 'Sladki cherry paradižniki, različne barve',
    'Sveza rukola, 150g': 'Sveža rukola, 150g',
    'Sveze kravje mleko, dnevna dobava': 'Sveže kravje mleko, dnevna dobava',
    'Kremna skuta iz svezega mleka': 'Kremna skuta iz svežega mleka',
    '10 kosov, kokosi na prostem': '10 kosov, kokoši na prostem',
    'Domaci krompir, razlicne sorte': 'Domači krompir, različne sorte',
    'Sveza rdeca pesa iz vrta': 'Sveža rdeča pesa iz vrta',
    'Tradicionalni rzen kruh, 800g': 'Tradicionalni ržen kruh, 800g',
    'Kruh iz pirove moke, 700g': 'Kruh iz pirove moke, 700g',
    'Skutini struklji po babicinem receptu': 'Skutini štruklji po babičinem receptu',
    'Orehova potica, prava slovenska klasika': 'Orehova potica, prava slovenska klasika',
  };

  // Fix farm descriptions
  const farmDescFixes = {
    'Druzinska kmetija s prosto rejo kokosi in ekoloskimi jajci. Na kmetiji skrbimo za zivali ze vec kot 30 let.':
      'Družinska kmetija s prosto rejo kokoši in ekološkimi jajci. Na kmetiji skrbimo za živali že več kot 30 let.',
    'Visokogorska kmetija s tradicijo mlekarske pridelave. Nase krave pasejo na alpskih travnikih.':
      'Visokogorska kmetija s tradicijo mlekarske pridelave. Naše krave pasejo na alpskih travnikih.',
    'Ekoloska kmetija z raznovrstno pridelavo zelenjave. Vse gojimo brez pesticidov in umetnih gnojil.':
      'Ekološka kmetija z raznovrstno pridelavo zelenjave. Vse gojimo brez pesticidov in umetnih gnojil.',
    'Sadjarska kmetija v Vipavski dolini. Pridelujemo jabolka, hruske in breskve ze tri generacije.':
      'Sadjarska kmetija v Vipavski dolini. Pridelujemo jabolka, hruške in breskve že tri generacije.',
    'Cebelarska kmetija s 50-letno tradicijo. Nas med je nagrajen na stevilnih tekmovanjih. Skrbimo za 80 panjev kranjske sivke.':
      'Čebelarska kmetija s 50-letno tradicijo. Naš med je nagrajen na številnih tekmovanjih. Skrbimo za 80 panjev kranjske sivke.',
    'Mesna kmetija z lastno klavnico in predelavo. Nase zivali so rejene na prostem, brez hormonov in antibiotikov.':
      'Mesna kmetija z lastno klavnico in predelavo. Naše živali so rejene na prostem, brez hormonov in antibiotikov.',
    'Urbana kmetija v okolici Ljubljane. Specializirani smo za mikro zelenjavo in disiila za restavracije in domaco uporabo.':
      'Urbana kmetija v okolici Ljubljane. Specializirani smo za mikro zelenjavo in zelišča za restavracije in domačo uporabo.',
    'Mesana kmetija na Stajerskem. Pridelujemo zelenjavo, imamo krave molznice in kokosi nesnice.':
      'Mešana kmetija na Štajerskem. Pridelujemo zelenjavo, imamo krave molznice in kokoši nesnice.',
    'Druzinska pekarija s tradicijo peke kruha in peciva. Uporabljamo le lokalno moko in naravne sestavine.':
      'Družinska pekarija s tradicijo peke kruha in peciva. Uporabljamo le lokalno moko in naravne sestavine.',
  };

  // Farm name fixes
  const farmNameFixes = {
    'Cebelarstvo Krajnc': 'Čebelarstvo Krajnc',
    'Kmetija Korosec': 'Kmetija Korošec',
    'Domaca pekarija Lah': 'Domača pekarija Lah',
  };

  // Farmer name fixes
  const userNameFixes = {
    'Ana Korosec': 'Ana Korošec',
    'Tomaz Potocnik': 'Tomaž Potočnik',
    'Bostjan Murko': 'Boštjan Murko',
  };

  let count = 0;

  // Fix products
  for (const [oldName, newName] of Object.entries(productFixes)) {
    if (oldName === newName) continue;
    const r = await prisma.$executeRawUnsafe(`UPDATE products SET name = $1 WHERE name = $2`, newName, oldName);
    if (r > 0) { count += r; console.log(`Product name: "${oldName}" -> "${newName}"`); }
  }

  for (const [oldDesc, newDesc] of Object.entries(descFixes)) {
    if (oldDesc === newDesc) continue;
    const r = await prisma.$executeRawUnsafe(`UPDATE products SET description = $1 WHERE description = $2`, newDesc, oldDesc);
    if (r > 0) { count += r; console.log(`Product desc fixed`); }
  }

  // Fix farms
  for (const [oldDesc, newDesc] of Object.entries(farmDescFixes)) {
    const r = await prisma.$executeRawUnsafe(`UPDATE farms SET description = $1 WHERE description = $2`, newDesc, oldDesc);
    if (r > 0) { count += r; console.log(`Farm desc fixed`); }
  }

  for (const [oldName, newName] of Object.entries(farmNameFixes)) {
    const r = await prisma.$executeRawUnsafe(`UPDATE farms SET name = $1 WHERE name = $2`, newName, oldName);
    if (r > 0) { count += r; console.log(`Farm name: "${oldName}" -> "${newName}"`); }
  }

  // Fix user names
  for (const [oldName, newName] of Object.entries(userNameFixes)) {
    const r = await prisma.$executeRawUnsafe(`UPDATE users SET name = $1 WHERE name = $2`, newName, oldName);
    if (r > 0) { count += r; console.log(`User name: "${oldName}" -> "${newName}"`); }
  }

  // Fix category name
  await prisma.$executeRawUnsafe(`UPDATE categories SET name = $1 WHERE slug = $2`, 'Med in čebelji izdelki', 'med');
  await prisma.$executeRawUnsafe(`UPDATE categories SET name = $1 WHERE slug = $2`, 'Mlečni izdelki', 'mlecni-izdelki');

  console.log(`\nFixed ${count} records total`);
  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
