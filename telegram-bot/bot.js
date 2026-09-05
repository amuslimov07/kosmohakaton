const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// База данных секторов с надежными изображениями
const SECTORS = {
  zone_black_sea: {
    name: 'Черноморский сектор-А',
    pollution: 'Мазутное пятно',
    status: 'Критическое',
    coords: [44.605, 33.522],
    meetingCoords: [44.610, 33.530],
    objectPhoto: 'https://picsum.photos/800/500?random=1',
    mapPhoto: 'https://picsum.photos/800/500?random=2',
    whatHappened: 'Аварийный сброс нефтепродуктов с проходящего судна в штормовых условиях (3 дня назад).',
    ecoDamage: 'Высокое загрязнение прибрежной полосы и акватории (класс опасности II).',
    economicDamage: 'Убытки регионального туризма и рыболовного промысла оцениваются в 14.2 млн руб.',
    faunaImpact: 'Под угрозой популяция прибрежных птиц и черноморских дельфинов (риск гибели из-за интоксикации).',
    isOngoing: 'Да, фиксируется локальное поступление мазута с придонных течений. Открыт экстренный набор волонтеров (выезд 15 сентября).',
    timeWithHuman: '2–3 недели (при участии волонтерских отрядов и спецтехники).'
  },
  zone_baltic: {
    name: 'Балтийская коса-Б',
    pollution: 'Скопление пластика',
    status: 'Умеренное',
    coords: [54.639, 19.976],
    meetingCoords: [54.640, 19.980],
    objectPhoto: 'https://picsum.photos/800/500?random=3',
    mapPhoto: 'https://picsum.photos/800/500?random=4',
    whatHappened: 'Нанос бытовых и промышленных пластиковых отходов штормовыми течениями с судоходных путей.',
    ecoDamage: 'Накопление микропластика в прибрежном грунте, разрушение естественного ландшафта.',
    economicDamage: 'Снижение рекреационной привлекательности пляжной зоны, затраты муниципалитета на вывоз мусора.',
    faunaImpact: 'Риск заглатывания пластиковых элементов чайками, рыбами и местными млекопитающими.',
    isOngoing: 'Периодическое поступление. Запущено планирование генеральной уборки силами волонтерского десанта.',
    timeWithHuman: '3–5 дней активной фазы очистки.'
  },
  zone_arctic: {
    name: 'Арктическая зона-В',
    pollution: 'Спецконтейнер (Исторический)',
    status: 'Опасно',
    coords: [69.021, 33.075],
    meetingCoords: [69.025, 33.080],
    objectPhoto: 'https://picsum.photos/800/500?random=5',
    mapPhoto: 'https://picsum.photos/800/500?random=6',
    whatHappened: 'Обнаружение герметичного, но подвергшегося сильной коррозии промышленного спецконтейнера прошлых лет.',
    ecoDamage: 'Локальное радиационное и токсическое заражение прибрежного грунта.',
    economicDamage: 'Угроза остановки северных портовых проектов и традиционного рыбного промысла.',
    faunaImpact: 'Прямая угроза арктическим экосистемам, птичьим базарам и лежбищам ластоногих.',
    isOngoing: 'Контейнер зафиксирован стационарно со спутника. Волонтеров не допускают, идет подготовка к эвакуации силами специализированного МЧС-отряда.',
    timeWithHuman: 'Немедленная операция силами спецслужб за 48 часов.'
  }
};

const waitingForAdminPassword = new Set();
const userState = new Map();
const volunteerApplications = [];
const ADMIN_PASSWORD = 'admin';

const getMainKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🌊 Выбрать зону уборки', 'choose_zone')],
    [Markup.button.callback('📌 Моя активная заявка', 'my_status')],
    [Markup.button.callback('📷 Сдать фотоотчет', 'start_report')],
    [Markup.button.callback('🛡 Войти как администратор ООПТ', 'admin_entry_prompt')]
  ]);
};

const getAdminKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📋 Заявки волонтеров', 'admin_requests')],
    [Markup.button.callback('📊 Мониторинг секторов', 'admin_sectors')],
    [Markup.button.callback('📷 Проверить фотоотчеты', 'admin_reports')],
    [Markup.button.callback('🔄 В главное меню', 'back_start')]
  ]);
};

// Безопасный ответ на callback, чтобы бот не падал при истечении таймера
const safeAnswer = async (ctx, text = '') => {
  try {
    await ctx.answerCbQuery(text);
  } catch (e) {
    // Игнорируем ошибку просроченного запроса
  }
};

bot.start(async (ctx) => {
  waitingForAdminPassword.delete(ctx.from.id);
  userState.delete(ctx.from.id);
  
  try { await ctx.deleteMessage(); } catch (e) {}
  ctx.reply(
    '🛰 <b>Платформа экологического мониторинга «Чистый берег»</b>\n\n' +
    'Интеграция: СР Дата (ДЗЗ) × Яндекс.Облако × ИИ-Эксперт\n\n' +
    'Добро пожаловать! Выберите необходимый раздел:',
    {
      parse_mode: 'HTML',
      ...getMainKeyboard()
    }
  );
});

bot.action('back_start', async (ctx) => {
  await safeAnswer(ctx);
  waitingForAdminPassword.delete(ctx.from.id);
  userState.delete(ctx.from.id);
  
  try { await ctx.deleteMessage(); } catch (e) {}
  ctx.reply(
    '🛰 <b>Платформа экологического мониторинга «Чистый берег»</b>\n\n' +
    'Интеграция: СР Дата (ДЗЗ) × Яндекс.Облако × ИИ-Эксперт\n\n' +
    'Добро пожаловать! Выберите необходимый раздел:',
    {
      parse_mode: 'HTML',
      ...getMainKeyboard()
    }
  );
});

bot.action('admin_entry_prompt', async (ctx) => {
  await safeAnswer(ctx);
  const userId = ctx.from.id;
  waitingForAdminPassword.add(userId);
  
  ctx.editMessageText(
    '🔐 <b>Авторизация администратора</b>\n\n' +
    'Пожалуйста, введите секретный пароль (кодовое слово) ответным сообщением в чат:',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔙 Назад в меню', 'back_start')]
      ])
    }
  ).catch(() => {});
});

bot.action('choose_zone', async (ctx) => {
  await safeAnswer(ctx);
  try { await ctx.deleteMessage(); } catch (e) {}
  
  try {
    await ctx.replyWithPhoto('https://picsum.photos/800/500?zone=main', {
      caption: '🗺 <b>Доступные сектора мониторинга (ДЗЗ):</b>\nВыберите интересующий участок побережья:',
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🌊 Черноморский сектор-А', 'zone_black_sea')],
        [Markup.button.callback('🏖 Балтийская коса-Б', 'zone_baltic')],
        [Markup.button.callback('❄️ Арктическая зона-В', 'zone_arctic')],
        [Markup.button.callback('🔙 В главное меню', 'back_start')]
      ])
    });
  } catch (err) {
    ctx.reply('🗺 <b>Доступные сектора мониторинга (ДЗЗ):</b>\nВыберите интересующий участок побережья:', {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🌊 Черноморский сектор-А', 'zone_black_sea')],
        [Markup.button.callback('🏖 Балтийская коса-Б', 'zone_baltic')],
        [Markup.button.callback('❄️ Арктическая зона-В', 'zone_arctic')],
        [Markup.button.callback('🔙 В главное меню', 'back_start')]
      ])
    });
  }
});

Object.keys(SECTORS).forEach((zoneKey) => {
  bot.action(zoneKey, async (ctx) => {
    await safeAnswer(ctx);
    const zone = SECTORS[zoneKey];
    userState.set(ctx.from.id, zoneKey);

    try { await ctx.deleteMessage(); } catch (e) {}

    const captionText = 
      `📊 <b>ИИ-Экспертиза сектора: ${zone.name}</b>\n\n` +
      `⚠️ <b>Тип проблемы:</b> ${zone.pollution} (${zone.status})\n\n` +
      `📌 <b>Что произошло:</b>\n<em>${zone.whatHappened}</em>\n\n` +
      `⚠️ <b>Ущерб экологии:</b>\n<em>${zone.ecoDamage}</em>\n\n` +
      `📉 <b>Влияние на экономику:</b>\n<em>${zone.economicDamage}</em>\n\n` +
      `🐾 <b>Угроза животным:</b>\n<em>${zone.faunaImpact}</em>\n\n` +
      `🔄 <b>Статус решения / Ликвидация:</b>\n<em>${zone.isOngoing}</em>\n\n` +
      `⏳ <b>Прогноз очистки:</b> ${zone.timeWithHuman}`;

    const replyMarkup = Markup.inlineKeyboard([
      [Markup.button.callback('🗺 Показать карту ДЗЗ', `map_photo_${zoneKey}`)],
      [Markup.button.callback('📍 Точка загрязнения', 'loc_pollution'), Markup.button.callback('🏁 Точка сбора', 'loc_meeting')],
      [Markup.button.callback('✅ Подать заявку на участие', `apply_${zoneKey}`)],
      [Markup.button.callback('🔙 К списку зон', 'choose_zone')]
    ]);

    try {
      await ctx.replyWithPhoto(zone.objectPhoto, {
        caption: captionText,
        parse_mode: 'HTML',
        ...replyMarkup
      });
    } catch (e) {
      ctx.reply(captionText, {
        parse_mode: 'HTML',
        ...replyMarkup
      });
    }
  });

  bot.action(`map_photo_${zoneKey}`, async (ctx) => {
    await safeAnswer(ctx, 'Загружаю карту...');
    const zone = SECTORS[zoneKey];
    try {
      await ctx.replyWithPhoto(zone.mapPhoto, {
        caption: `🗺 <b>Схема ДЗЗ и расположение:</b> ${zone.name}\nКоординаты: <code>${zone.coords.join(', ')}</code>`,
        parse_mode: 'HTML'
      });
    } catch (e) {
      ctx.reply(`🗺 <b>Схема ДЗЗ и расположение:</b> ${zone.name}\nКоординаты: <code>${zone.coords.join(', ')}</code>`, { parse_mode: 'HTML' });
    }
  });

  bot.action(`apply_${zoneKey}`, async (ctx) => {
    await safeAnswer(ctx, 'Заявка зафиксирована!');
    const zone = SECTORS[zoneKey];
    const userId = ctx.from.id;
    const userName = `${ctx.from.first_name || 'Волонтер'} ${ctx.from.last_name || ''}`.trim();

    const existingIndex = volunteerApplications.findIndex(a => a.userId === userId && a.zoneKey === zoneKey);
    if (existingIndex !== -1) {
      volunteerApplications[existingIndex].status = 'pending';
    } else {
      volunteerApplications.push({
        userId: userId,
        name: userName,
        zoneKey: zoneKey,
        zoneName: zone.name,
        status: 'pending'
      });
    }

    ctx.editMessageCaption(
      `🎉 <b>Вы успешно записаны в волонтерский отряд!</b>\n\n` +
      `Сектор: <b>${zone.name}</b>\n` +
      `Заявка отправлена администратору на подтверждение.`,
      { 
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 К выбору зон', 'choose_zone')]
        ])
      }
    ).catch(() => {});
  });
});

bot.action('loc_pollution', async (ctx) => {
  await safeAnswer(ctx, 'Отправляю координаты...');
  const zoneKey = userState.get(ctx.from.id) || 'zone_black_sea';
  const coords = SECTORS[zoneKey].coords;
  ctx.replyWithLocation(coords[0], coords[1]);
});

bot.action('loc_meeting', async (ctx) => {
  await safeAnswer(ctx, 'Отправляю точку сбора...');
  const zoneKey = userState.get(ctx.from.id) || 'zone_black_sea';
  const coords = SECTORS[zoneKey].meetingCoords;
  ctx.replyWithLocation(coords[0], coords[1]);
});

bot.action('my_status', async (ctx) => {
  await safeAnswer(ctx);
  const userId = ctx.from.id;
  const userApps = volunteerApplications.filter(app => app.userId === userId);
  
  if (userApps.length === 0) {
    return ctx.reply('📌 У вас пока нет активных заявок на уборку. Выберите сектор через меню «Выбрать зону уборки».');
  }
  
  const app = userApps[userApps.length - 1];
  const statusStr = app.status === 'approved' ? '🟢 Подтверждено администратором' : '🟡 Ожидает подтверждения администратора';
  
  ctx.reply(`📌 <b>Ваша активная заявка:</b>\n\nСектор: ${app.zoneName}\nСтатус: ${statusStr}`, { parse_mode: 'HTML' });
});

bot.action('start_report', async (ctx) => {
  await safeAnswer(ctx);
  ctx.reply('📷 Пожалуйста, отправьте в чат <b>фотографию убранного участка</b>, и система передаст ее инспектору ООПТ.', { parse_mode: 'HTML' });
});

bot.on('photo', (ctx) => {
  ctx.reply('✅ <b>Фотоотчет успешно принят и направлен в Яндекс.Облако!</b>\n\nИнспектор проверит снимок и переведет сектор в статус «Ликвидировано». Спасибо за ваш вклад! 🌍',
    { parse_mode: 'HTML' }
  );
});

bot.action('admin_home', async (ctx) => {
  await safeAnswer(ctx);
  try {
    await ctx.editMessageText(
      '🛡 <b>Панель администратора ООПТ</b>\n\nВыберите действие:',
      {
        parse_mode: 'HTML',
        ...getAdminKeyboard()
      }
    );
  } catch (e) {
    try { await ctx.deleteMessage(); } catch (err) {}
    ctx.reply('🛡 <b>Панель администратора ООПТ</b>\n\nВыберите действие:', {
      parse_mode: 'HTML',
      ...getAdminKeyboard()
    });
  }
});

bot.action('admin_requests', async (ctx) => {
  await safeAnswer(ctx);
  const pendingApps = volunteerApplications.filter(app => app.status === 'pending');

  if (pendingApps.length === 0) {
    return ctx.editMessageText(
      '📋 <b>Входящие заявки волонтеров:</b>\n\nНет новых заявок на рассмотрение.',
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 Назад в панель', 'admin_home')]
        ])
      }
    ).catch(() => {});
  }

  const buttons = pendingApps.map((app) => [
    Markup.button.callback(`✅ Подтвердить: ${app.name} (${app.zoneName})`, `approve_${app.userId}_${app.zoneKey}`)
  ]);
  buttons.push([Markup.button.callback('🔙 Назад в панель', 'admin_home')]);

  ctx.editMessageText(
    `📋 <b>Входящие заявки волонтеров (${pendingApps.length}):</b>\nНажмите на заявку для её подтверждения:`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }
  ).catch(() => {});
});

bot.action(/^approve_(\d+)_(.+)$/, async (ctx) => {
  await safeAnswer(ctx, 'Заявка подтверждена!');
  const targetUserId = Number(ctx.match[1]);
  const zoneKey = ctx.match[2];

  const app = volunteerApplications.find(a => a.userId === targetUserId && a.zoneKey === zoneKey);
  if (app) {
    app.status = 'approved';
    try {
      await bot.telegram.sendMessage(
        targetUserId,
        `🟢 <b>Ваша заявка на сектор "${app.zoneName}" подтверждена администратором!</b>\n\nКоординатор свяжется с вами перед выездом.`,
        { parse_mode: 'HTML' }
      );
    } catch (e) {}
  }

  const pendingApps = volunteerApplications.filter(a => a.status === 'pending');
  if (pendingApps.length === 0) {
    return ctx.editMessageText(
      '📋 <b>Входящие заявки волонтеров:</b>\n\nВсе заявки успешно обработаны!',
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔙 Назад в панель', 'admin_home')]
        ])
      }
    ).catch(() => {});
  }

  const buttons = pendingApps.map((a) => [
    Markup.button.callback(`✅ Подтвердить: ${a.name} (${a.zoneName})`, `approve_${a.userId}_${a.zoneKey}`)
  ]);
  buttons.push([Markup.button.callback('🔙 Назад в панель', 'admin_home')]);

  ctx.editMessageText(
    `📋 <b>Входящие заявки волонтеров (${pendingApps.length}):</b>\nНажмите на заявку для её подтверждения:`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }
  ).catch(() => {});
});

bot.action('admin_sectors', async (ctx) => {
  await safeAnswer(ctx);
  ctx.editMessageText(
    '📊 <b>Сводка ДЗЗ-мониторинга по секторам:</b>\n\n' +
    '• Черноморский сектор-А: 🔴 Критическое (Мазут)\n' +
    '• Балтийская коса-Б: 🟡 Умеренное (Пластик)\n' +
    '• Арктическая зона-В: 🔴 Опасно (Спецконтейнер)',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('🔙 Назад в панель', 'admin_home')]])
    }
  ).catch(() => {});
});

bot.action('admin_reports', async (ctx) => {
  await safeAnswer(ctx);
  ctx.reply('📷 <b>Поступил новый фотоотчет волонтера:</b>\nСектор: Черноморский сектор-А', { parse_mode: 'HTML' });
  try {
    await ctx.replyWithPhoto('https://picsum.photos/800/500?report=1', {
      caption: 'Утвердить ликвидацию загрязнения и перевести сектор в статус «Очищено»?',
      ...Markup.inlineKeyboard([[Markup.button.callback('🟢 Утвердить и закрыть сектор', 'close_sector')]])
    });
  } catch (e) {
    ctx.reply('Утвердить ликвидацию загрязнения и перевести сектор в статус «Очищено»?', {
      ...Markup.inlineKeyboard([[Markup.button.callback('🟢 Утвердить и закрыть сектор', 'close_sector')]])
    });
  }
});

bot.action('close_sector', async (ctx) => {
  await safeAnswer(ctx, 'Успешно!');
  ctx.editMessageCaption('✅ Сектор официально переведен в статус <b>«Ликвидировано»</b> на платформе!', { parse_mode: 'HTML' }).catch(() => {});
});

bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const typedPassword = ctx.message.text.trim();

  if (waitingForAdminPassword.has(userId)) {
    if (typedPassword === ADMIN_PASSWORD) {
      waitingForAdminPassword.delete(userId);

      ctx.reply(
        '🛡 <b>Панель администратора успешно разблокирована!</b>\n\nВыберите действие:',
        {
          parse_mode: 'HTML',
          ...getAdminKeyboard()
        }
      );
    } else {
      ctx.reply('❌ <b>Неверный пароль!</b> Попробуйте еще раз или введите /start для отмены.', { parse_mode: 'HTML' });
    }
  } else {
    ctx.reply('Используйте инлайн-кнопки меню или команду /start для перезапуска.');
  }
});

bot.launch().then(() => {
  console.log('🤖 Бот успешно запущен!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));