// Fix TypeScript implicit any errors in map callbacks
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Fix .map((img, index) => with typed params
  content = content.replace(
    /\.map\(\(img,\s*index\)/g,
    '.map((img: string, index: number)'
  );
  content = content.replace(
    /\.map\(\(img,\s*idx\)/g,
    '.map((img: string, idx: number)'
  );
  content = content.replace(
    /\.map\(\(item,\s*index\)/g,
    '.map((item: any, index: number)'
  );
  content = content.replace(
    /\.map\(\(item,\s*\w+\)/g,
    '.map((item: any, $&.split(',')[1].trim())'
  );
  content = content.replace(
    /\.map\(\(faq,\s*index\)/g,
    '.map((faq: any, index: number)'
  );
  content = content.replace(
    /\.map\(\(cert,\s*index\)/g,
    '.map((cert: any, index: number)'
  );
  content = content.replace(
    /featuredProducts\.map\(\(product\)/g,
    'featuredProducts.map((product: any)'
  );
  content = content.replace(
    /\.map\(\(rev\)/g,
    '.map((rev: any)'
  );
  content = content.replace(
    /\.map\(\(star\)/g,
    '.map((star: number)'
  );
  content = content.replace(
    /\.map\(\(_,\s*i\)/g,
    '.map((_: number, i: number)'
  );
  content = content.replace(
    /\.map\(\(product\)/g,
    '.map((product: any)'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes: ${filePath}`);
  }
}

const files = [
  'src/app/blogdetail/page.tsx',
  'src/app/viewblog/page.tsx',
  'src/app/contactus/page.tsx',
  'src/app/faqs/page.tsx',
  'src/app/page.tsx',
  'src/app/productdetail/page.tsx',
];

files.forEach(f => fixFile(f));
console.log('Done.');
