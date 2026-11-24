const path = require('path');
const fs = require('fs');

let mongoose, User, Commande, Store;

try {
  mongoose = require('mongoose');
} catch (e) {
  try {
    mongoose = require(path.join(__dirname, '../backend/node_modules/mongoose'));
  } catch (err) {
    console.error("Mongoose could not be resolved directly. Please run via Docker: docker exec uh_gina_backend node demoData/seed.js");
  }
}

try {
  User = require(path.join(__dirname, '../backend/model/userModel'));
  Commande = require(path.join(__dirname, '../backend/model/commandeModel'));
  Store = require(path.join(__dirname, '../backend/model/storeModel'));
} catch (e) {
  User = require('/app/model/userModel');
  Commande = require('/app/model/commandeModel');
  Store = require('/app/model/storeModel');
}

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27018/uh_gina';

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${mongoUrl}...`);
    await mongoose.connect(mongoUrl, {});
    console.log('MongoDB connected successfully for seeding.');

    // 1. Load data files
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
    const storesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'stores.json'), 'utf8'));
    const commandesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'commandes.json'), 'utf8'));

    // 2. Clear existing collections
    console.log('Clearing existing users, stores, and commandes...');
    await Commande.deleteMany({});
    await Store.deleteMany({});
    await User.deleteMany({});

    // 3. Insert users (using User.create so pre-save password hash hook executes)
    console.log('Seeding users...');
    const createdUsers = [];
    for (const u of usersData) {
      const newUser = await User.create({
        name: u.name,
        phoneNumber: u.phoneNumber,
        adress: u.adress,
        password: u.password,
        role: u.role
      });
      createdUsers.push(newUser);
      console.log(` -> Created ${u.role}: ${u.name} (${u.phoneNumber})`);
    }

    // Map users by phoneNumber for easy reference
    const userMap = new Map();
    createdUsers.forEach(u => userMap.set(Number(u.phoneNumber), u));
    const adminUser = createdUsers.find(u => u.role === 'admin');

    // 4. Insert stores
    console.log('Seeding stores...');
    const createdStores = [];
    for (const s of storesData) {
      const newStore = await Store.create({
        name: s.name,
        category: s.category,
        phone: s.phone,
        address: s.address,
        description: s.description,
        image: s.image || '',
        totalPaidToStore: 0,
        items: s.items || []
      });
      createdStores.push(newStore);
      console.log(` -> Created Store: ${newStore.name} (${newStore.items.length} items)`);
    }

    const storeMap = new Map();
    createdStores.forEach(s => storeMap.set(s.name, s));

    // 5. Insert commandes
    console.log('Seeding commandes...');
    for (const c of commandesData) {
      const client = userMap.get(Number(c.clientPhone));
      const livreur = c.livreurPhone ? userMap.get(Number(c.livreurPhone)) : null;

      if (!client) {
        console.warn(`Client with phone ${c.clientPhone} not found, skipping commande.`);
        continue;
      }

      const matchedStore = storeMap.get(c.storeName);

      await Commande.create({
        user: client._id,
        clientName: client.name,
        phone: String(c.phone),
        adress: c.adress,
        store: matchedStore ? matchedStore._id : null,
        storeName: c.storeName || (matchedStore ? matchedStore.name : 'طلب حر'),
        items: c.items || [],
        prixItems: c.prixItems || 0,
        fraisLivraison: c.fraisLivraison || 0,
        prixTotal: c.prixTotal || (c.prixItems || 0) + (c.fraisLivraison || 0),
        description: c.description,
        etat: c.etat,
        livreur: livreur ? livreur._id : null,
        livreurName: livreur ? livreur.name : null,
        pickedUpAt: c.pickedUpAt ? new Date(c.pickedUpAt) : null,
        payeAuMagasinParLivreur: Boolean(c.payeAuMagasinParLivreur),
        datePaiementMagasin: c.datePaiementMagasin ? new Date(c.datePaiementMagasin) : null,
        annulerPar: c.cancelledByAdmin && adminUser ? adminUser._id : null
      });

      console.log(` -> Created Commande [${c.etat}] for ${client.name} - ${c.description.slice(0, 30)}...`);
    }

    console.log('\n========================================');
    console.log(' Demo Data Seeded Successfully! 🎉');
    console.log('========================================');
    console.log('Stores created: ' + createdStores.length);
    console.log('Credentials to test:');
    console.log('1. Admin:   Phone: 29146431 | Password: password123');
    console.log('2. Livreur: Phone: 22123456 | Password: password123');
    console.log('3. Client:  Phone: 98112233 | Password: password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding demo data:', err);
    process.exit(1);
  }
}

seed();
