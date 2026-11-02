#!/usr/bin/env python3
"""Puts the shared header, tab bar, footer and stylesheet links (scripts/aq_chrome.py)
on the hand-written pages, and rebuilds /ru/ from the Kazakh home page.

Run from repo root: python3 scripts/sync-chrome.py
Generated pages (blog, landings, font pages) get the same chrome from their own builders.
"""
import os
import re

import aq_chrome as chrome

SITE = os.path.join(os.path.dirname(__file__), "..", "site")
HOME_FONTS = "&family=Lora:ital,wght@0,500;1,500&family=Comfortaa:wght@600&family=Yeseva+One"

# path: (lang, active tab, backdrop glyphs, extra Google font families, language-switch target)
PAGES = {
    "index.html": ("kk", "home", "ҚӘҰ", HOME_FONTS, "/ru/"),
    "about/index.html": ("kk", "about", "АҺІ", "", ""),
    "qarip/index.html": ("kk", "qarip", "ҒҢӨ", "", ""),
    "privacy/index.html": ("kk", "", "ӘҚІ", "", ""),
    "dauystap/index.html": ("kk", "dauystap", "ДҮҰ", "", ""),
    "404.html": ("kk", "", "ӘҒҚ", "", ""),
}

OLD_HEAD = [
    r'\s*<link rel="stylesheet" href="/(?:home|liquid-glass|landing)\.css[^"]*"\s*/?>',
    r'\s*<link rel="stylesheet" href="/blog/blog\.css[^"]*"\s*/?>',
    r'\s*<link rel="stylesheet" href="/aq/glass\.css[^"]*"\s*/?>',
    r'\s*<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?family=Geologica[^"]*"\s*/?>',
    r'\s*<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"[^>]*>',
    r'\s*<meta name="theme-color"[^>]*>',
]
OLD_BODY = [
    r'\s*<div class="lg-blobs"[^>]*>.*?</div>',
    r'\s*<div class="backdrop" aria-hidden="true">.*?\n</div>',
    r'\s*<a class="skip[^"]*"[^>]*>[^<]*</a>',
    r'\s*<header class="(?:site-header|top)">.*?</header>',
    r'\s*<footer[^>]*>.*?</footer>',
    r'\s*<nav class="tabbar[^"]*"[^>]*>.*?</nav>',
    r'\s*<script src="/(?:home|liquid-glass)\.js[^"]*"[^>]*></script>',
    r'\s*<script src="/aq/glass\.js[^"]*"></script>',
    r'\s*<script defer src="https://static\.cloudflareinsights\.com/beacon\.min\.js"[^>]*></script>',
]


def resync(html, lang, active, glyphs, fonts, lang_href):
    for pat in OLD_HEAD:
        html = re.sub(pat, "", html, flags=re.S)
    html = html.replace("</head>", chrome.head_assets(fonts) + "</head>", 1)
    head, body = html.split("<body", 1)
    for pat in OLD_BODY:
        body = re.sub(pat, "", body, flags=re.S)
    body_tag, rest = body.split(">", 1)
    rest = "\n" + chrome.backdrop(glyphs) + chrome.header(lang, active, lang_href) + rest.lstrip("\n")
    # glass.js goes right after the chrome so page scripts below can use window.AQ
    rest = rest.replace("</main>", "</main>\n" + chrome.footer(lang) + chrome.tabbar(lang, active) + chrome.scripts(), 1)
    return head + "<body" + body_tag + ">" + re.sub(r"\n{3,}", "\n\n", rest)


# Kazakh home → Russian home. Only visible copy changes; markup and script stay shared.
RU = [
    ('<html lang="kk">', '<html lang="ru">'),
    ("Қазақ әріптері бұзылмай шығатын құралдар", "Инструменты, в которых казахские буквы не ломаются"),
    ("Қазақша қаріп табыңыз, Story жасаңыз, сөйлеп жазыңыз. Тегін, браузерде, ештеңе орнатпай.",
     "Найдите казахский шрифт, сделайте Story, пишите голосом. Бесплатно, в браузере, без установки."),
    (">Құралдарды көру<", ">Смотреть инструменты<"), (">Сөйлеп жазып көру<", ">Попробовать голосовой ввод<"),
    ('aria-label="Қазақ тіліне тән әріптер"', 'aria-label="Буквы казахского алфавита"'),
    ('aria-label="Қаріпті өз мәтініңізбен тексеру"', 'aria-label="Проверка шрифта на своём тексте"'),
    (">Мәтініңізді жазыңыз<", ">Ваш текст<"), (">Өлшем<", ">Размер<"),
    ("Сары сызық — қазақ тіліне тән әріптер. Белгі әр қаріпте сол жерде тексеріледі.",
     "Жёлтая черта отмечает казахские буквы. Отметка «9/9» проверяется прямо в браузере."),
    (">Барлық қаріпті көру<", ">Все шрифты<"),
    ("<h2>Үш құрал</h2>", "<h2>Три инструмента</h2>"),
    ("Әрқайсысы бір жұмысты істейді. Тіркелу қажет емес, телефонда да ашылады.",
     "Каждый делает одно дело. Регистрация не нужна, работает и на телефоне."),
    ("Қазақ әріптерін толық қолдайтын қаріптер каталогы.", "Каталог шрифтов с полной поддержкой казахских букв."),
    ("<li>300-ден астам қаріп, 5 санат</li><li>Өз мәтініңізбен тексеру</li><li>Лицензиясы көрсетілген</li>",
     "<li>Более 300 шрифтов, 5 категорий</li><li>Проверка на своём тексте</li><li>Указана лицензия</li>"),
    (">Каталогты ашу<", ">Открыть каталог<"), (">Қалай жұмыс істейді<", ">Как это работает<"),
    ("Бүгін — сіздің күніңіз", "Бүгін — сіздің күніңіз"),
    ("Қазақша мәтінді Instagram Story-ге екі жолмен қоясыз.", "Два способа поставить казахский текст в Instagram Story."),
    ("<li>Story жасау: фон, мәтін, 9:16 PNG</li><li>Мәтінді мөлдір PNG етіп көшіру</li><li>Instagram-да «Қою» арқылы қою</li>",
     "<li>Story целиком: фон, текст, PNG 9:16</li><li>Текст как прозрачный PNG в буфер</li><li>В Instagram: «Вставить»</li>"),
    (">Таңбаны ашу<", ">Открыть Таңба<"), ('<span class="tag">Жаңа</span>', '<span class="tag">Новое</span>'),
    ("Сөйлеңіз, мәтін өзі жазылады. Мәтінді дауыспен тыңдай аласыз.", "Говорите, и текст пишется сам. Текст можно прослушать голосом."),
    ("<li>Қазақша, орысша, ағылшынша</li><li>Мәтіннен дауыс, MP3</li><li>Видеодағы сөзді мәтінге айналдыру</li>",
     "<li>Казахский, русский, английский</li><li>Озвучка текста, MP3</li><li>Расшифровка речи из видео</li>"),
    (">Сөйлеп көру<", ">Попробовать<"),
    ("<h2>Неге AQSUEK</h2>", "<h2>Почему AQSUEK</h2>"),
    ("<h3>Әріптер дұрыс шығады</h3><p>Әр қаріп тоғыз қазақ әрпіне тексерілген. Сұрақ белгісі мен бос төртбұрыш болмайды.</p>",
     "<h3>Буквы на месте</h3><p>Каждый шрифт проверен на девять казахских букв. Никаких вопросов и пустых квадратов.</p>"),
    ("<h3>Тегін</h3><p>Тіркелусіз ашылады. DauysTap-ты күніне 3 рет тіркелмей байқауға болады, Google арқылы кірсеңіз 40 жазу мен 50 дауыс.</p>",
     "<h3>Бесплатно</h3><p>Открывается без регистрации. DauysTap можно попробовать 3 раза в день, а со входом через Google: 40 записей и 50 озвучек.</p>"),
    ("<h3>Деректер сізде қалады</h3><p>Мәтін тарихы өз браузеріңізде сақталады. Аудио мен видео серверде қалмайды. <a href=\"/privacy/\">Құпиялық саясаты</a></p>",
     "<h3>Данные остаются у вас</h3><p>История текстов хранится в вашем браузере. Аудио и видео не остаются на сервере. <a href=\"/privacy/\">Конфиденциальность</a></p>"),
    ("<blockquote>Қазақша контент орысша не ағылшынша контенттен қиын болмауы керек.</blockquote>",
     "<blockquote>Делать контент на казахском должно быть не сложнее, чем на русском или английском.</blockquote>"),
    ("<p>Дизайн құралдарында Қ, Ғ, Ң, І, Ә, Ө, Ү, Ұ әріптері басқа қаріппен шығып, мәтін ала-құла көрінетінінен шаршадым. Сондықтан өзім қолданғым келетін құралдарды жасап жүрмін: қаріптен бастап дауысқа дейін.</p>",
     "<p>Надоело, что в дизайн-программах Қ, Ғ, Ң, І, Ә, Ө, Ү, Ұ выходят другим шрифтом и текст выглядит пёстрым. Поэтому я делаю инструменты, которыми хочу пользоваться каждый день: от шрифтов до голоса.</p>"),
    ('<p class="sig">AQSUEK авторы</p>', '<p class="sig">Автор AQSUEK</p>'),
    ("<h2>Жиі қойылатын сұрақтар</h2>", "<h2>Частые вопросы</h2>"),
    ("<summary>AQSUEK құралдары ақылы ма?</summary><p>Жоқ, негізгі мүмкіндіктер тегін. DauysTap-та қызмет бәріне жетуі үшін күнделікті лимит бар.</p>",
     "<summary>Инструменты AQSUEK платные?</summary><p>Нет, основные возможности бесплатны. В DauysTap есть дневной лимит, чтобы сервиса хватало всем.</p>"),
    ("<summary>Қаріптерді коммерциялық жобаға қолдануға бола ма?</summary><p>Бұл әр қаріптің лицензиясына байланысты. Қаріп бетінде лицензия белгісі тұр, қолданар алдында тексеріңіз.</p>",
     "<summary>Можно ли использовать шрифты в коммерческих проектах?</summary><p>Зависит от лицензии шрифта. Она указана на странице шрифта, проверьте её перед использованием.</p>"),
    ("<summary>Бағдарлама орнату керек пе?</summary><p>Жоқ. Барлық құрал браузерде, телефонда да, компьютерде де ашылады.</p>",
     "<summary>Нужно что-то устанавливать?</summary><p>Нет. Все инструменты работают в браузере, на телефоне и на компьютере.</p>"),
    ("<summary>DauysTap қазақша сөзді тани ма?</summary><p>Иә. Қазақша, орысша және ағылшынша сөйлеуді таниды, тілдер араласса да түсінеді.</p>",
     "<summary>DauysTap понимает казахскую речь?</summary><p>Да. Распознаёт казахский, русский и английский, даже если языки смешаны.</p>"),
    ("<summary>Менің аудиом мен мәтінім сақтала ма?</summary><p>Мәтін тарихы тек өз браузеріңізде сақталады. Аудио мен видео өңделген соң серверде қалмайды.</p>",
     "<summary>Сохраняются ли мои аудио и текст?</summary><p>История текстов хранится только в вашем браузере. Аудио и видео не остаются на сервере после обработки.</p>"),
    ("<h2>Не жаңа</h2>", "<h2>Что нового</h2>"),
    ("<span>Сайттың жаңа дизайны: шыны беттер және қараңғы режим.</span>", "<span>Новый дизайн сайта: стеклянные панели и тёмная тема.</span>"),
    ("<span>DauysTap: сөйлеп жазу, мәтіннен дауыс, видеодан мәтін. Тіркелмей байқап көріңіз.</span>",
     "<span>DauysTap: голосовой ввод, озвучка и расшифровка видео. Попробуйте без регистрации.</span>"),
    ("<span>Qarip: 23 жаңа қаріп, барлығы 320.</span>", "<span>Qarip: 23 новых шрифта, всего 320.</span>"),
    ("<span>Таңба: телефондағы редактор мен жүктеу жаңартылды.</span>", "<span>Таңба: обновлены мобильный редактор и скачивание.</span>"),
    ("<span>Таңба Beta: Stories редакторы мен қаріп каталогы.</span>", "<span>Таңба Beta: редактор Stories и каталог шрифтов.</span>"),
    ('{n:"Comfortaa",c:"Дөңгелек"', '{n:"Comfortaa",c:"Округлый"'),
]


def build_ru_home():
    kk = open(os.path.join(SITE, "index.html"), encoding="utf-8").read()
    ru_old = open(os.path.join(SITE, "ru", "index.html"), encoding="utf-8").read()
    ru_head = re.search(r"<head>.*?</head>", ru_old, re.S).group(0)
    ru_head = ru_head.replace("320+ шрифтов", "300+ шрифтов").replace("из 320+ шрифтов", "из 300+ шрифтов")
    out = re.sub(r"<head>.*?</head>", lambda _: ru_head, kk, count=1, flags=re.S)
    # keep the Kazakh page's inline styles/fonts out of the RU head: the shared chrome adds them below
    for a, b in RU:
        if a in out:
            out = out.replace(a, b)
    out = resync(out, "ru", "home", "ҚӘҰ", HOME_FONTS, "/")
    open(os.path.join(SITE, "ru", "index.html"), "w", encoding="utf-8").write(out)
    left = re.findall(r">[^<>]*[ӘәҒғҚқҢңӨөҰұҮүҺһ][^<>]*<", re.search(r"<main.*?</main>", out, re.S).group(0))
    print("ru home built; Kazakh text left in <main>:", len(left))


def main():
    for rel, (lang, active, glyphs, fonts, lang_href) in PAGES.items():
        path = os.path.join(SITE, rel)
        html = open(path, encoding="utf-8").read()
        open(path, "w", encoding="utf-8").write(resync(html, lang, active, glyphs, fonts, lang_href))
        print("synced", rel)
    build_ru_home()


if __name__ == "__main__":
    main()
