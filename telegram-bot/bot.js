const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Динамический список админов (сюда будут добавляться те, кто ввел пароль)
const adminIds = new Set([2040130270]); // Ваш постоянный ID (на всякий случай)

// Коллекция для отслеживания пользователей, которые вводят пароль
const waitingForAdminPassword = new Set();

const ADMIN_PASSWORD = 'admin'; // Секретный пароль для демо на хакатоне

// Команда /start — главный выбор роли
bot.start((ctx) => {
  waitingForAdminPassword.delete(ctx.from.id);
  
  ctx.reply(
    '👋 Добро пожаловать в платформу <b>«Чистый берег»</b>!\n\nКем вы являетесь?',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('👤 Войти как волонтер', 'mode_volunteer')],
        [Markup.button.callback('🛡 Войти как администратор ООПТ', 'mode_admin_prompt')]
      ])
    }
  );
});

// Клик на волонтера
bot.action('mode_volunteer', (ctx) => {
  waitingForAdminPassword.delete(ctx.from.id);
  ctx.editMessageText(
    '👋 Режим волонтера активирован.\n\nВыберите нужное действие:',
    Markup.inlineKeyboard([
      [Markup.button.callback('🌊 Выбрать зону уборки', 'choose_zone')],
      [Markup.button.callback('📌 Моя активная заявка', 'my_status')],
      [Markup.button.callback('📷 Сдать фотоотчет', 'start_report')],
      [Markup.button.callback('🔄 Сменить роль', 'back_start')]
    ])
  ).catch(() => ctx.answerCbQuery());
});

// Запрос пароля администратора
bot.action('mode_admin_prompt', (ctx) => {
  waitingForAdminPassword.add(ctx.from.id);
  ctx.editMessageText(
    '🔐 <b>Авторизация администратора</b>\n\nПожалуйста, введите секретный пароль администратора ответным сообщением в чат:',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔙 Назад', 'back_start')]
      ])
    }
  ).catch(() => ctx.answerCbQuery());
});

// Кнопка возврата в стартое меню
bot.action('back_start', (ctx) => {
  waitingForAdminPassword.delete(ctx.from.id);
  ctx.editMessageText(
    '👋 Добро пожаловать в платформу <b>«Чистый берег»</b>!\n\nКем вы являетесь?',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('👤 Войти как волонтер', 'mode_volunteer')],
        [Markup.button.callback('🛡 Войти как администратор ООПТ', 'mode_admin_prompt')]
      ])
    }
  ).catch(() => ctx.answerCbQuery());
});

// Обработка текстовых сообщений (ввод пароля)
bot.on('text', (ctx) => {
  const userId = ctx.from.id;

  if (waitingForAdminPassword.has(userId)) {
    const typedPassword = ctx.message.text.trim();

    if (typedPassword === ADMIN_PASSWORD) {
      waitingForAdminPassword.delete(userId);
      adminIds.add(userId); // Даем права админа этому телеграму

      ctx.reply(
        '🛡 <b>Панель администратора ООПТ успешно разблокирована!</b>\n\nДобро пожаловать, инспектор.',
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('📋 Заявки волонтеров на модерацию', 'admin_requests')],
            [Markup.button.callback('📊 Статус секторов (Карта)', 'admin_sectors')],
            [Markup.button.callback('📷 Проверить фотоотчеты', 'admin_reports')],
            [Markup.button.callback('🔄 Выйти из аккаунта', 'back_start')]
          ])
        }
      );
    } else {
      ctx.reply('❌ <b>Неверный пароль!</b> Попробуйте еще раз или нажмите /start для отмены.', { parse_mode: 'HTML' });
    }
  } else {
    ctx.reply('Используйте кнопки меню или команду /start для перезапуска.');
  }
});

// --- АДМИН-ПАНЕЛЬ ---
bot.action('admin_requests', (ctx) => {
  ctx.editMessageText(
    '📋 <b>Входящие заявки волонтеров:</b>\n\n• Алексей М. — Черноморский сектор-А\nСтатус: Ожидает подтверждения',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('✅ Подтвердить участие', 'approve_user')],
        [Markup.button.callback('🔙 Назад в меню админа', 'admin_home')]
      ])
    }
  ).catch(() => ctx.answerCbQuery());
});

bot.action('approve_user', (ctx) => {
  ctx.answerCbQuery('Успешно!');
  ctx.editMessageText('✅ Заявка волонтера подтверждена!').catch(() => {});
});

bot.action('admin_sectors', (ctx) => {
  ctx.editMessageText(
    '📊 <b>Мониторинг статусов секторов:</b>\n\n• Черноморский сектор-А: Высокое загрязнение\n• Балтийский сектор-Б: Среднее загрязнение',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('🔙 Назад в меню админа', 'admin_home')]
      ])
    }
  ).catch(() => ctx.answerCbQuery());
});

bot.action('admin_reports', (ctx) => {
  ctx.reply('📷 <b>Полевой фотоотчет:</b>\nСектор: Черноморский сектор-А', { parse_mode: 'HTML' });
  ctx.replyWithPhoto('https://images.unsplash.com/photo-1618477461853-cf6ed80faba5', {
    caption: 'Одобрить уборку и закрыть сектор?',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🟢 Утвердить и закрыть', 'close_sector')]
    ])
  });
});

bot.action('close_sector', (ctx) => {
  ctx.editMessageCaption('✅ Сектор переведен в статус «Ликвидировано»!').catch(() => ctx.answerCbQuery());
});

bot.action('admin_home', (ctx) => {
  ctx.editMessageText(
    '🛡 <b>Панель администратора ООПТ</b>',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📋 Заявки волонтеров на модерацию', 'admin_requests')],
        [Markup.button.callback('📊 Статус секторов (Карта)', 'admin_sectors')],
        [Markup.button.callback('📷 Проверить фотоотчеты', 'admin_reports')],
        [Markup.button.callback('🔄 Выйти из аккаунта', 'back_start')]
      ])
    }
  ).catch(() => ctx.answerCbQuery());
});

// --- МЕНЮ ВОЛОНТЕРА ---
bot.action('choose_zone', (ctx) => {
  ctx.editMessageText(
    '🗺 Выберите сектор для мониторинга:',
    Markup.inlineKeyboard([
      [Markup.button.callback('Черноморский сектор-А', 'zone_black_sea')],
      [Markup.button.callback('🔙 Назад', 'mode_volunteer')]
    ])
  ).catch(() => ctx.answerCbQuery());
});

bot.action('zone_black_sea', (ctx) => {
  ctx.editMessageText(
    '📌 <b>Черноморский сектор-А</b>\n• Загрязнение: Мазутное пятно',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📍 Точка загрязнения', 'loc_pollution')],
        [Markup.button.callback('🏁 Точка сбора', 'loc_meeting')],
        [Markup.button.callback('🔙 К зонам', 'choose_zone')]
      ])
    }
  ).catch(() => ctx.answerCbQuery());
});

bot.action('loc_pollution', (ctx) => {
  ctx.replyWithLocation(44.6053, 37.7753);
});

bot.action('loc_meeting', (ctx) => {
  ctx.replyWithLocation(44.6100, 37.7800);
});

bot.action('my_status', (ctx) => {
  ctx.reply('📌 Ваша заявка: Черноморский сектор-А. Статус: Забронировано.');
});

bot.action('start_report', (ctx) => {
  ctx.reply('📷 Пожалуйста, отправьте фотографию убранного участка.');
});

bot.on('photo', (ctx) => {
  ctx.reply('✅ Спасибо! Фотоотчет принят в систему.');
});

bot.launch();
console.log('🤖 Бот с интерактивным выбором ролей запущен!');