import { Level } from './types';

// =====================================================================
// ИНСТРУКЦИЯ ПО СПРАЙТАМ (SPRITES INSTRUCTION):
// 1. Поместите ваши изображения тар в папку public/assets/ (или аналогичную).
// 2. В поле spriteUrl укажите путь, например: '/assets/jug_500.png'.
// 3. Если spriteUrl не указан (undefined), игра отрисует стандартную CSS-заглушку.
//
// ИНСТРУКЦИЯ ДЛЯ КРАНА И РАКОВИНЫ:
// 1. Поместите изображение крана (tap) и раковины (sink) в папку public/assets/.
// 2. В объекте уровня (Level) добавьте поля:
//    tapSpriteUrl: '/assets/tap.png'
//    sinkSpriteUrl: '/assets/sink.png'
// 3. Если эти поля не указаны, будут использоваться стандартные CSS-блоки.
// =====================================================================

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Начало пути",
    description: "Получите ровно 400 мл в любой таре.",
    hasSinkAndTap: false, // Нет крана, только переливание
    containers: [
      { id: 'c1', name: 'Большой кувшин', capacity: 500, initialAmount: 500, spriteUrl: undefined },
      { id: 'c2', name: 'Малый кувшин', capacity: 300, initialAmount: 0, spriteUrl: undefined },
    ],
    targets: [
      { containerId: 'ANY', amount: 400 } // 'ANY' means any container can hold the target amount
    ]
  },
  {
    id: 2,
    title: "Кран и Раковина",
    description: "Используйте кран, чтобы получить 400 мл, имея тары 500 мл и 300 мл.",
    hasSinkAndTap: true, // Есть кран и слив
    tapSpriteUrl: undefined, // Замените на '/assets/tap.png'
    sinkSpriteUrl: undefined, // Замените на '/assets/sink.png'
    containers: [
      { id: 'c1', name: 'Банка', capacity: 500, initialAmount: 0 },
      { id: 'c2', name: 'Стакан', capacity: 300, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'ANY', amount: 400 }
    ]
  },
  {
    id: 3,
    title: "Сложный баланс",
    description: "Разделите 800 мл поровну (по 400 мл) между большой и средней тарой.",
    hasSinkAndTap: false,
    containers: [
      { id: 'c1', name: 'Бидон', capacity: 800, initialAmount: 800 },
      { id: 'c2', name: 'Кувшин', capacity: 500, initialAmount: 0 },
      { id: 'c3', name: 'Кружка', capacity: 300, initialAmount: 0 },
    ],
    targets: [
      { containerId: 'c1', amount: 400 },
      { containerId: 'c2', amount: 400 }
    ]
  }
];