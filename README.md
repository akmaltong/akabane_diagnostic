# Akabane Diagnostic

Система диагностики Акабане для специалиста и пациента.

## Структура

```text
akabane_diagnostic/
├─ index.html              # входная страница
├─ doctor/
│  └─ index.html           # кабинет специалиста
├─ patient/
│  └─ index.html           # кабинет пациента
└─ shared/
   ├─ config.example.js    # пример подключения Supabase
   └─ supabase-schema.sql  # структура базы данных
```

## Архитектура

- **GitHub Pages** — хостинг интерфейсов.
- **doctor/** — твоя рабочая CRM: пациенты, диагностика, история, отчёты, чат.
- **patient/** — личный кабинет пациента: результаты, протокол, рекомендации, сообщения.
- **Supabase** — общая база данных и realtime-чат.

## Публикация через GitHub Pages

В настройках репозитория:

1. Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main`
4. Folder: `/root`
5. Save

После публикации будут доступны:

```text
https://akmaltong.github.io/akabane_diagnostic/
https://akmaltong.github.io/akabane_diagnostic/doctor/
https://akmaltong.github.io/akabane_diagnostic/patient/
```

## Следующий шаг

1. Создать проект Supabase.
2. Выполнить SQL из `shared/supabase-schema.sql`.
3. Создать `shared/config.js` на основе `shared/config.example.js`.
4. Подключить текущий HTML-приложение специалиста в `doctor/index.html`.
