#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PRODUCTS_FILE = path.join(__dirname, '..', 'products.json');
let products = [];
try {
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  products = JSON.parse(data);
} catch (e) {
  console.error('Не удалось загрузить список товаров.');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function main() {
  console.log('=== Маркетплейс CLI ===');
  while (true) {
    console.log('\n1. Показать все товары');
    console.log('2. Поиск по названию');
    console.log('3. Выход');
    const choice = await prompt('Выберите действие: ');
    switch (choice.trim()) {
      case '1':
        console.log('\nТовары:');
        products.forEach((p, i) => {
          console.log(`${i + 1}. ${p.name} - ${p.price}₽`);
        });
        break;
      case '2':
        const term = await prompt('Введите название: ');
        const results = products.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()));
        if (results.length === 0) {
          console.log('Ничего не найдено.');
        } else {
          console.log('\nРезультаты поиска:');
          results.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} - ${p.price}₽`);
          });
        }
        break;
      case '3':
        console.log('До свидания!');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Неверный выбор.');
    }
  }
}

main();
