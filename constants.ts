import { Level } from './types';

// Пути к вашим локальным файлам в репозитории
// Создайте папку /audio/ в корне и разложите файлы по этим путям
export const AUDIO_ASSETS = {
  music: {
    menu: '/audio/music/menu_theme.mp3',
    game: '/audio/music/game_ambient.mp3',
  },
  sfx: {
    transfer: [
      '/audio/sfx/pour_1.mp3',
      '/audio/sfx/pour_2.mp3',
      '/audio/sfx/pour_3.mp3',
    ],
    sink: [
      '/audio/sfx/sink_1.mp3',
      '/audio/sfx/sink_2.mp3',
      '/audio/sfx/sink_3.mp3',
    ],
    tap: [
      '/audio/sfx/tap_1.mp3',
      '/audio/sfx/tap_2.mp3',
      '/audio/sfx/tap_3.mp3',
    ]
  }
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Простая арифметика",
    description: "У вас есть 500 мл и 300 мл. Получите 200 мл в большом кувшине.",
    hasSinkAndTap: false,
    containers: [
      { id: 'c1', name: 'Большой кувшин', capacity: 500, initialAmount: 500 },
      { id: 'c2', name: 'Малый кувшин', capacity: 300, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'c1', amount: 200 }
    ],
    solutionSteps: [
      { 
        description: "Перелейте из большого в малый до краев.", 
        amounts: { 'c1': 200, 'c2': 300 } 
      }
    ]
  },
  {
    id: 2,
    title: "Кран и Раковина",
    description: "Используйте кран, чтобы получить ровно 400 мл.",
    hasSinkAndTap: true,
    containers: [
      { id: 'c1', name: 'Банка', capacity: 500, initialAmount: 0 },
      { id: 'c2', name: 'Стакан', capacity: 300, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'ANY', amount: 400 }
    ],
    solutionSteps: [
      { description: "Наполните банку (500 мл) из крана.", amounts: { 'c1': 500, 'c2': 0 } },
      { description: "Перелейте из банки в стакан.", amounts: { 'c1': 200, 'c2': 300 } },
      { description: "Вылейте воду из стакана в раковину.", amounts: { 'c1': 200, 'c2': 0 } },
      { description: "Перелейте 200 мл из банки в стакан.", amounts: { 'c1': 0, 'c2': 200 } },
      { description: "Снова наполните банку из крана.", amounts: { 'c1': 500, 'c2': 200 } },
      { description: "Долейте из банки в стакан до полного (нужно 100 мл).", amounts: { 'c1': 400, 'c2': 300 } }
    ]
  },
  {
    id: 3,
    title: "Три сосуда",
    description: "Разделите 800 мл поровну между бидоном и кувшином.",
    hasSinkAndTap: false,
    containers: [
      { id: 'c1', name: 'Бидон', capacity: 800, initialAmount: 800 },
      { id: 'c2', name: 'Кувшин', capacity: 500, initialAmount: 0 },
      { id: 'c3', name: 'Кружка', capacity: 300, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'c1', amount: 400 },
      { containerId: 'c2', amount: 400 }
    ],
    solutionSteps: [
      { description: "Из бидона в кувшин.", amounts: { 'c1': 300, 'c2': 500, 'c3': 0 } },
      { description: "Из кувшина в кружку.", amounts: { 'c1': 300, 'c2': 200, 'c3': 300 } },
      { description: "Из кружки в бидон.", amounts: { 'c1': 600, 'c2': 200, 'c3': 0 } },
      { description: "Из кувшина в кружку.", amounts: { 'c1': 600, 'c2': 0, 'c3': 200 } },
      { description: "Из бидона в кувшин.", amounts: { 'c1': 100, 'c2': 500, 'c3': 200 } },
      { description: "Из кувшина в кружку (до полной).", amounts: { 'c1': 100, 'c2': 400, 'c3': 300 } },
      { description: "Из кружки в бидон.", amounts: { 'c1': 400, 'c2': 400, 'c3': 0 } }
    ]
  },
  {
    id: 4,
    title: "Ведро, бидон и кувшин!",
    description: "Получи 500 мл в любом сосуде.",
    hasSinkAndTap: true,
    containers: [
      { id: 'c1', name: 'Ведро', capacity: 2000, initialAmount: 0 },
      { id: 'c2', name: 'Бидон', capacity: 700, initialAmount: 0 },
      { id: 'c3', name: 'Кастрюля', capacity: 300, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'ANY', amount: 500 }
    ],
    solutionSteps: [
      { description: "Наполняем бидон из крана.", amounts: { 'c1': 0, 'c2': 700, 'c3': 0 } },
      { description: "Из бидона в кастрюлю.", amounts: { 'c1': 0, 'c2': 400, 'c3': 300 } },
      { description: "Из бидона в ведро.", amounts: { 'c1': 400, 'c2': 0, 'c3': 300 } },
      { description: "Снова наполняем бидон из крана.", amounts: { 'c1': 400, 'c2': 700, 'c3': 300 } },
      { description: "Выливаем все из кастрюли в раковину.", amounts: { 'c1': 400, 'c2': 700, 'c3': 0 } },
      { description: "Снова из бидона в кастрюлю.", amounts: { 'c1': 400, 'c2': 400, 'c3': 300 } },
      { description: "Снова выливаем все из кастрюли в раковину.", amounts: { 'c1': 400, 'c2': 400, 'c3': 0 } },
      { description: "Из бидона в кастрюлю", amounts: { 'c1': 400, 'c2': 100, 'c3': 300 } },
      { description: "Из бидона в ведро", amounts: { 'c1': 500, 'c2': 0, 'c3': 300 } }
    ]
  },
  {
    id: 5,
    title: "Поход в баню",
    description: "Две компании собираются в баню. Нужно выделить каждой по 800 мл воды.",
    hasSinkAndTap: false,
    containers: [
      { id: 'c1', name: 'Ведро', capacity: 1600, initialAmount: 1600 },
      { id: 'c2', name: 'Катка', capacity: 1100, initialAmount: 0 },
      { id: 'c3', name: 'Канистра', capacity: 600, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'c1', amount: 800 },
      { containerId: 'c2', amount: 800 }
    ],
    solutionSteps: [
      { description: "Из ведра в канистру.", amounts: { 'c1': 1000, 'c2': 0, 'c3': 600 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 1000, 'c2': 600, 'c3': 0 } },
      { description: "Из ведра в канистру.", amounts: { 'c1': 400, 'c2': 600, 'c3': 600 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 400, 'c2': 1100, 'c3': 100 } },
      { description: "Из катки в ведро.", amounts: { 'c1': 1500, 'c2': 0, 'c3': 100 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 1500, 'c2': 100, 'c3': 0 } },
      { description: "Из ведра в канистру.", amounts: { 'c1': 900, 'c2': 100, 'c3': 600 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 900, 'c2': 700, 'c3': 0 } },
      { description: "Из ведра в канистру.", amounts: { 'c1': 300, 'c2': 700, 'c3': 600 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 300, 'c2': 1100, 'c3': 200 } },
      { description: "Из катки в ведро.", amounts: { 'c1': 1400, 'c2': 0, 'c3': 200 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 1400, 'c2': 200, 'c3': 0 } },
      { description: "Из ведра в канистру.", amounts: { 'c1': 800, 'c2': 200, 'c3': 600 } },
      { description: "Из канистры в катку.", amounts: { 'c1': 800, 'c2': 200, 'c3': 600 } },
    ]
  }
];
