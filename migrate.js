const _fs = require("fs");
const _path = require("path");

const aliases = {
  "cores": "../../core",
  "constants": "../app/constants",
  "helpers": "../app/helpers",
  "controllers": "../app/controllers",
  "middleware": "../app/middleware",
  "routes": "../app/routes"
};

function scandiir (folder) {
  let res = [];
  let paths = _fs.readdirSync(folder);
  
  for (let path of paths) {
    let resolved = _path.join(folder, path);
    
    if (_fs.lstatSync(resolved).isDirectory()) res.push(...scandiir(resolved));
    else res.push(resolved);
    
  }
  
  return res;
}

function checkfile (file) {
  let content = _fs.readFileSync(file, "utf8");
  
  
  //if (/(@contexts\/Theme)/gm.test(content) /*&& content.split("\n")[0] !== '"use client"'*/) {
//     content = '"use client"\n' + content;
//     console.log(`overwrite file ${ file }`);
//     console.log(`${file} is client component`);
//   }
  // if (/\'(\w+)\//gm.test(content) /*&& content.split("\n")[0] !== '"use client"'*/) {
//     // content = '"use client"\n' + content;
//     // console.log(`overwrite file ${ file }`);
//     console.log(`detected at ${file}`);
//   }
  for (let alias in aliases) {
    let pattern = new RegExp(`${ alias }`, "gm");
    
    if (pattern.test(content)) {
      console.log(`replace alias at file ${ file }`);
      content = content.replace(alias, aliases[alias]);
    }
  }
 _fs.writeFileSync(file, content); 
}

let files = scandiir("./core");

for (let file of files) {
  if (/\.(js|ts(x)?)/.test(file)) checkfile(file);
}