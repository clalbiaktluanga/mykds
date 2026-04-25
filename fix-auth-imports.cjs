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
  if (content.includes("from 'next-auth'")) {
    content = content.replace(/from 'next-auth'/g, "from 'next-auth/next'");
    fs.writeFileSync(f, content);
    console.log('Updated: ' + f);
  }
});
