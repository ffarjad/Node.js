'use strict';

// TODO: Write the homework code in this file
'use strict';

const fs = require('fs');

const DEFAULT_ENCODING = 'utf8';
const STORE_FILE_NAME  = 'store.txt';

function readFile() {
  return new Promise(
    resolve => fs.readFile(
      STORE_FILE_NAME,
      DEFAULT_ENCODING,
      (err, data) => resolve(err ? '' : data)
    )
  );
}

function appendFile(...text) {
  return new Promise(
    (resolve, reject) => fs.appendFile(
      STORE_FILE_NAME,
      `${text.join(' ')}\n`,
      (err, data) => err
        ? reject(err)
        : resolve(data)
    )
  );
}

function resetList(){
  fs.unlink(STORE_FILE_NAME, function(err){
    if(err) throw err;
  });
}

function printHelp() {
  console.log(`Usage: node index.js [options]
    HackYourFuture Node.js Week 2 -  To-Do App
    Options:
      list         read all to-dos
      add [to-do]  add to-do
      remove       remove an todo item by its index
      reset        Removes all to-do items from the list
      update       Updates a to-do item with new text
      help         show this help text
      `);
}

function removeItem(){
  const INDEX  = process.argv[3];
  let listText = fs.readFileSync(STORE_FILE_NAME, DEFAULT_ENCODING);
  let listArray = listText.split("\n");

  if(INDEX>=0 && INDEX<listArray.length) {
    listArray.splice(INDEX,1);
    resetList();
    listArray.forEach((item) => {
      fs.appendFileSync(STORE_FILE_NAME, item+'\n')
    });
  }else {
    console.log('error !!! .. you have entered fel index');
  }

}
/* Or we could destructure the array instead
 * const [,, cmd, ...args] = process.argv;
 */
const cmd  = process.argv[2];
const args = process.argv.slice(3);

switch (cmd) {
  case 'list':
    readFile()
      .then(data => console.log(`To-Dos:\n${data}`));
    break;

  case 'add':
    appendFile(...args)
      .then(() => console.log('Wrote to-do to file'))
      .then(() => readFile())
      .then(data => console.log(`\nTo-Dos:\n${data}`))
      .catch(console.error);
    break;

  case 'remove':
    removeItem();
    readFile().then(data => console.log(`To-Dos:\n${data}`));
    break;

  case 'reset':
    resetList();
    break;

  case 'help':
  default:
    printHelp();
    break;
}