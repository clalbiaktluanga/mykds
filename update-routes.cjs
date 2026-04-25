const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./app/api').filter(f => f.endsWith('route.js'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('export async function GET') && !content.includes('force-dynamic')) {
    content = "export const dynamic = 'force-dynamic';\n" + content;
    fs.writeFileSync(f, content);
    console.log('Updated: ' + f);
  }
});
