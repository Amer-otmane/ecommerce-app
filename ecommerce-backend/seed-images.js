const https = require('https');
const fs    = require('fs');
const path  = require('path');
const db    = require('./config/db');

const imgDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imgDir, filename));
    https.get(url, res => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(filename); });
    }).on('error', reject);
  });
}

async function seed() {
  const products = [
    { id: 1,  title: 'iPhone 9',         url: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'  },
    { id: 2,  title: 'iPhone X',         url: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg'  },
    { id: 3,  title: 'Samsung Galaxy S21', url: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg' },
    { id: 4,  title: 'OPPOF19',          url: 'https://cdn.dummyjson.com/product-images/4/thumbnail.jpg'  },
    { id: 5,  title: 'Huawei P30',       url: 'https://cdn.dummyjson.com/product-images/5/thumbnail.jpg'  },
    { id: 6,  title: 'MacBook Pro',      url: 'https://cdn.dummyjson.com/product-images/6/thumbnail.jpg'  },
    { id: 7,  title: 'Samsung Monitor',  url: 'https://cdn.dummyjson.com/product-images/7/thumbnail.jpg'  },
    { id: 8,  title: 'Beats Headphone',  url: 'https://cdn.dummyjson.com/product-images/12/thumbnail.jpg' },
  ];

  for (const p of products) {
    const filename = `${p.id}.jpg`;
    const localUrl = `http://localhost:3000/images/${filename}`;

    console.log(`⬇️  Téléchargement: ${p.title}...`);

    try {
      await downloadImage(p.url, filename);
      await db.query(
        'UPDATE products SET thumbnail = ? WHERE title LIKE ?',
        [localUrl, `%${p.title}%`]
      );
      console.log(`✅ ${p.title} → OK`);
    } catch (err) {
      console.error(`❌ Erreur pour ${p.title}:`, err.message);
    }
  }

  console.log('\n🎉 Terminé ! Rechargez localhost:4200');
  process.exit(0);
}

seed().catch(console.error);