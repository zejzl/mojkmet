require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const bcrypt = require('bcryptjs');

async function seed() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  // 1. Add missing categories
  console.log('Adding categories...');
  await prisma.category.upsert({ where: { slug: 'jajca' }, update: {}, create: { name: 'Jajca', slug: 'jajca', icon: '🥚' } });
  await prisma.category.upsert({ where: { slug: 'meso' }, update: {}, create: { name: 'Meso', slug: 'meso', icon: '🥩' } });
  await prisma.category.upsert({ where: { slug: 'pekarna' }, update: {}, create: { name: 'Pekarna', slug: 'pekarna', icon: '🍞' } });
  await prisma.category.upsert({ where: { slug: 'sadje' }, update: {}, create: { name: 'Sadje', slug: 'sadje', icon: '🍎' } });
  await prisma.category.upsert({ where: { slug: 'med' }, update: {}, create: { name: 'Med in cebelji izdelki', slug: 'med', icon: '🍯' } });

  const allCats = await prisma.category.findMany();
  const catMap = {};
  allCats.forEach(c => { catMap[c.slug] = c.id; });
  console.log('Categories:', Object.keys(catMap).join(', '));

  const hash = await bcrypt.hash('kmetija2026', 12);

  const farms = [
    {
      email: 'ana.korosec@kmetija-korosec.si',
      name: 'Ana Korosec',
      farm: { name: 'Kmetija Korosec', description: 'Druzinska kmetija s prosto rejo kokosi in ekoloskimi jajci. Na kmetiji skrbimo za zivali ze vec kot 30 let.', address: 'Trzaska cesta 45', city: 'Vrhnika', postalCode: '1360', phone: '+386 41 234 567' },
      products: [
        { name: 'Domaca jajca (prosta reja)', price: 3.50, unit: 'kos', stock: 200, cat: 'jajca', desc: '10 kosov, kokosi prosto rejene na travniku' },
        { name: 'Prepelicja jajca', price: 4.20, unit: 'kos', stock: 50, cat: 'jajca', desc: '12 kosov, bogata z beljakovinami' },
      ]
    },
    {
      email: 'janez.oblak@kmetija-oblak.si',
      name: 'Janez Oblak',
      farm: { name: 'Kmetija Oblak', description: 'Visokogorska kmetija s tradicijo mlekarske pridelave. Nase krave pasejo na alpskih travnikih.', address: 'Planina pod Golico 12', city: 'Jesenice', postalCode: '4270', phone: '+386 40 555 123' },
      products: [
        { name: 'Sveze alpsko mleko', price: 1.80, unit: 'l', stock: 100, cat: 'mlecni-izdelki', desc: 'Nepasterizirano mleko z alpskih travnikov' },
        { name: 'Domac jogurt', price: 2.50, unit: 'kos', stock: 60, cat: 'mlecni-izdelki', desc: 'Naravni jogurt brez dodatkov, 500ml' },
        { name: 'Alpski sir (zorjen 6 mesecev)', price: 14.90, unit: 'kg', stock: 30, cat: 'mlecni-izdelki', desc: 'Trdi sir, zorjen v nasi kleti' },
        { name: 'Maslo', price: 5.50, unit: 'kos', stock: 40, cat: 'mlecni-izdelki', desc: 'Domace maslo, 250g' },
      ]
    },
    {
      email: 'maja.zupan@kmetija-zupan.si',
      name: 'Maja Zupan',
      farm: { name: 'Eko kmetija Zupan', description: 'Ekoloska kmetija z raznovrstno pridelavo zelenjave. Vse gojimo brez pesticidov in umetnih gnojil.', address: 'Kolodvorska 8', city: 'Celje', postalCode: '3000', phone: '+386 31 678 901' },
      products: [
        { name: 'Eko paradizniki', price: 3.90, unit: 'kg', stock: 80, cat: 'zelenjava', desc: 'Soncno zreli paradizniki, razlicne sorte' },
        { name: 'Eko paprika', price: 3.20, unit: 'kg', stock: 60, cat: 'zelenjava', desc: 'Rdeca in rumena paprika' },
        { name: 'Eko solata (mesano)', price: 2.00, unit: 'kos', stock: 100, cat: 'zelenjava', desc: 'Mesana solata, sveza iz vrta' },
        { name: 'Eko bucke', price: 2.50, unit: 'kg', stock: 45, cat: 'zelenjava', desc: 'Mlade zelene bucke' },
        { name: 'Eko cesen', price: 8.00, unit: 'kg', stock: 20, cat: 'zelenjava', desc: 'Domaci cesen, mocen okus' },
      ]
    },
    {
      email: 'matej.horvat@kmetija-horvat.si',
      name: 'Matej Horvat',
      farm: { name: 'Kmetija Horvat', description: 'Sadjarska kmetija v Vipavski dolini. Pridelujemo jabolka, hruske in breskve ze tri generacije.', address: 'Vipavska cesta 33', city: 'Ajdovscina', postalCode: '5270', phone: '+386 51 234 890' },
      products: [
        { name: 'Jabolka Jonagold', price: 2.20, unit: 'kg', stock: 500, cat: 'sadje', desc: 'Sladka in socna jabolka' },
        { name: 'Hruske Williams', price: 2.80, unit: 'kg', stock: 200, cat: 'sadje', desc: 'Zrele hruske, odlicne za solato ali desert' },
        { name: 'Domac jabolcni sok', price: 3.50, unit: 'l', stock: 150, cat: 'sadje', desc: '100% naravni sok brez dodanega sladkorja' },
        { name: 'Suhe slive', price: 6.50, unit: 'kg', stock: 30, cat: 'sadje', desc: 'Soncno susene slive iz nasega sadovnjaka' },
      ]
    },
    {
      email: 'petra.krajnc@cebelarstvo-krajnc.si',
      name: 'Petra Krajnc',
      farm: { name: 'Cebelarstvo Krajnc', description: 'Cebelarska kmetija s 50-letno tradicijo. Nas med je nagrajen na stevilnih tekmovanjih. Skrbimo za 80 panjev kranjske sivke.', address: 'Medvedova 7', city: 'Radovljica', postalCode: '4240', phone: '+386 40 111 222' },
      products: [
        { name: 'Cvetlicni med', price: 12.00, unit: 'kg', stock: 100, cat: 'med', desc: 'Vecvrstni cvetlicni med iz Gorenjske' },
        { name: 'Akacijev med', price: 16.00, unit: 'kg', stock: 50, cat: 'med', desc: 'Svetel in mil akacijev med' },
        { name: 'Gozdni med', price: 14.50, unit: 'kg', stock: 40, cat: 'med', desc: 'Temen in aromaticen gozdni med' },
        { name: 'Propolis kapljice', price: 9.90, unit: 'kos', stock: 80, cat: 'med', desc: 'Naravne propolis kapljice, 30ml' },
        { name: 'Medeno pecivo', price: 4.50, unit: 'kos', stock: 60, cat: 'pekarna', desc: 'Tradicionalni medenjaki, 200g' },
      ]
    },
    {
      email: 'tomaz.potocnik@kmetija-potocnik.si',
      name: 'Tomaz Potocnik',
      farm: { name: 'Kmetija Potocnik', description: 'Mesna kmetija z lastno klavnico in predelavo. Nase zivali so rejene na prostem, brez hormonov in antibiotikov.', address: 'Dolenjska cesta 99', city: 'Novo mesto', postalCode: '8000', phone: '+386 41 999 888' },
      products: [
        { name: 'Domaca svinjska salama', price: 18.00, unit: 'kg', stock: 40, cat: 'meso', desc: 'Suha svinjska salama, zorjena 3 mesece' },
        { name: 'Goveje meso (zrezki)', price: 22.00, unit: 'kg', stock: 25, cat: 'meso', desc: 'Svezi goveji zrezki iz prosto rejenih govedi' },
        { name: 'Piscancje prsi', price: 9.90, unit: 'kg', stock: 50, cat: 'meso', desc: 'Prosto rejeni piscanci' },
        { name: 'Domaca klobasa', price: 12.50, unit: 'kg', stock: 35, cat: 'meso', desc: 'Tradicionalna kranjska klobasa' },
      ]
    },
    {
      email: 'katarina.novak2@zeleni-vrt.si',
      name: 'Katarina Novak',
      farm: { name: 'Zeleni vrt', description: 'Urbana kmetija v okolici Ljubljane. Specializirani smo za mikro zelenjavo in disiila za restavracije in domaco uporabo.', address: 'Cesta v Rozno dolino 5', city: 'Ljubljana', postalCode: '1000', phone: '+386 30 456 789' },
      products: [
        { name: 'Mikro zelenjava mix', price: 5.50, unit: 'kos', stock: 70, cat: 'zelenjava', desc: 'Mesanica mikro zelisc, 100g' },
        { name: 'Sveza bazilika', price: 2.00, unit: 'kos', stock: 90, cat: 'zelenjava', desc: 'Loncek sveze bazilike' },
        { name: 'Cherry paradizniki', price: 4.50, unit: 'kg', stock: 40, cat: 'zelenjava', desc: 'Sladki cherry paradizniki, razlicne barve' },
        { name: 'Rukola', price: 2.80, unit: 'kos', stock: 60, cat: 'zelenjava', desc: 'Sveza rukola, 150g' },
      ]
    },
    {
      email: 'bostjan.murko@kmetija-murko.si',
      name: 'Bostjan Murko',
      farm: { name: 'Kmetija Murko', description: 'Mesana kmetija na Stajerskem. Pridelujemo zelenjavo, imamo krave molznice in kokosi nesnice.', address: 'Pesnica pri Mariboru 22', city: 'Maribor', postalCode: '2211', phone: '+386 41 777 333' },
      products: [
        { name: 'Sveze mleko', price: 1.60, unit: 'l', stock: 80, cat: 'mlecni-izdelki', desc: 'Sveze kravje mleko, dnevna dobava' },
        { name: 'Domaca skuta', price: 4.50, unit: 'kg', stock: 30, cat: 'mlecni-izdelki', desc: 'Kremna skuta iz svezega mleka' },
        { name: 'Prosta reja jajca', price: 3.00, unit: 'kos', stock: 150, cat: 'jajca', desc: '10 kosov, kokosi na prostem' },
        { name: 'Krompir', price: 1.50, unit: 'kg', stock: 300, cat: 'zelenjava', desc: 'Domaci krompir, razlicne sorte' },
        { name: 'Rdeca pesa', price: 2.20, unit: 'kg', stock: 50, cat: 'zelenjava', desc: 'Sveza rdeca pesa iz vrta' },
      ]
    },
    {
      email: 'irena.lah@pekarija-lah.si',
      name: 'Irena Lah',
      farm: { name: 'Domaca pekarija Lah', description: 'Druzinska pekarija s tradicijo peke kruha in peciva. Uporabljamo le lokalno moko in naravne sestavine.', address: 'Stritarjeva 14', city: 'Kranj', postalCode: '4000', phone: '+386 40 222 444' },
      products: [
        { name: 'Rzen kruh', price: 3.80, unit: 'kos', stock: 50, cat: 'pekarna', desc: 'Tradicionalni rzen kruh, 800g' },
        { name: 'Pirin kruh', price: 4.20, unit: 'kos', stock: 40, cat: 'pekarna', desc: 'Kruh iz pirove moke, 700g' },
        { name: 'Domaci struklji', price: 6.50, unit: 'kos', stock: 25, cat: 'pekarna', desc: 'Skutini struklji po babicinem receptu' },
        { name: 'Potica', price: 12.00, unit: 'kos', stock: 15, cat: 'pekarna', desc: 'Orehova potica, prava slovenska klasika' },
      ]
    },
  ];

  let created = 0;
  for (const f of farms) {
    const user = await prisma.user.upsert({
      where: { email: f.email },
      update: {},
      create: { email: f.email, password: hash, name: f.name, role: 'FARMER' }
    });

    const farm = await prisma.farm.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: f.farm.name,
        description: f.farm.description,
        address: f.farm.address,
        city: f.farm.city,
        postalCode: f.farm.postalCode,
        phone: f.farm.phone || null,
        verified: Math.random() > 0.3,
      }
    });

    // Remove existing products for this farm to avoid duplicates
    await prisma.product.deleteMany({ where: { farmId: farm.id } });

    for (const p of f.products) {
      await prisma.product.create({
        data: {
          farmId: farm.id,
          categoryId: catMap[p.cat],
          name: p.name,
          description: p.desc,
          price: p.price,
          unit: p.unit,
          stock: p.stock,
          available: true,
        }
      });
    }

    created++;
    console.log(`Created ${created}/9: ${f.farm.name} (${f.farm.city}) - ${f.products.length} products`);
  }

  // Add reviews
  const consumer = await prisma.user.findFirst({ where: { role: 'CONSUMER' } });
  const allFarms = await prisma.farm.findMany({ select: { id: true } });

  let reviewCount = 0;
  for (const farm of allFarms) {
    const rating = Math.floor(Math.random() * 2) + 4;
    try {
      await prisma.review.create({
        data: {
          userId: consumer.id,
          farmId: farm.id,
          rating,
          comment: rating === 5 ? 'Odlicna kmetija, priporocam!' : 'Zelo dobri izdelki.',
        }
      });
      reviewCount++;
    } catch (e) { /* skip duplicates */ }
  }
  console.log(`\nAdded ${reviewCount} reviews`);

  const totalFarms = await prisma.farm.count();
  const totalProducts = await prisma.product.count();
  console.log(`\nTotal: ${totalFarms} farms, ${totalProducts} products`);

  process.exit(0);
}

seed().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
