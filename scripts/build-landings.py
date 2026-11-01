#!/usr/bin/env python3
"""Builds the product landing pages /qarip/tanystyru/, /tanba/tanystyru/, /dauystap/tanystyru/.
Run from repo root: python3 scripts/build-landings.py"""
import html, json, os

SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
BEACON = '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "4cff9e1227a64f6ea836c3fd64686153"}\'></script>'

NAV = '''      <nav class="site-nav" id="site-nav" aria-label="Негізгі мәзір">
        <a href="/qarip/tanystyru/"{q}>Qarip</a>
        <a href="/tanba/tanystyru/"{t}>Таңба</a>
        <a href="/dauystap/tanystyru/"{d}>DauysTap</a>
        <a href="/blog/">Мақалалар</a>
        <a href="/about/">Жоба туралы</a>
      </nav>'''

ICONS = {
    'search': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    'type': '<path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M9 19h6"/>',
    'check': '<path d="M5 12l4 4 10-10"/>',
    'download': '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    'heart': '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    'layers': '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    'image': '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
    'phone': '<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M11 18h2"/>',
    'mic': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    'speaker': '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/>',
    'video': '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
    'lock': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'sparkle': '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
}


def icon(name):
    return f'<span class="ld-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONS[name]}</svg></span>'


PRODUCTS = {
    'qarip': {
        'path': '/qarip/tanystyru/',
        'app': '/qarip/',
        'name': 'Qarip',
        'title': 'Qarip — қазақ әріптері бар 320+ қаріп каталогы',
        'description': 'Qarip — Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І әріптерін толық көрсететін 320-дан астам қаріп. Өз мәтініңізбен тексеріп, салыстырып, тегін жүктеңіз.',
        'chip': 'Qarip · қаріптер',
        'h1': 'Қазақ әріптері <em>бұзылмайтын</em> қаріптер',
        'lead': 'Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І әріптерін толық көрсететін 320-дан астам қаріп бір каталогта. Өз мәтініңізді жазып, бірден көріңіз — содан кейін ғана жүктеңіз.',
        'cta': 'Каталогты ашу',
        'facts': [('320+', 'қаріп'), ('5', 'санат'), ('9', 'қазақ әрпі тексеріледі'), ('0 ₸', 'тіркеусіз')],
        'visual': '''<div class="ld-browser"><div class="ld-browser-bar"><i></i><i></i><i></i></div><img src="/assets/landing/qarip-desk.webp" width="1400" height="875" alt="Qarip каталогы: іздеу, санаттар және өз мәтінмен қаріп тексеру" fetchpriority="high"/></div>
        <div class="ld-float a">Әә Ғғ Ққ Ңң<small>Толық қолдау</small></div>
        <div class="ld-float b">320+ қаріп<small>Сериф, санс, қолжазба…</small></div>''',
        'problem_title': 'Әдемі қаріп таңдадыңыз — ал «Қ» басқаша шықты',
        'problem_visual': '<p class="ld-broken">Қазақ тілі → <s>?</s>азақ тілі</p>',
        'problem': 'Көп қаріпте қазақ әріптері мүлде салынбаған. Сондықтан тақырыптағы Қ, Ғ, Ң басқа қаріппен шығып, дизайн ала-құла болады не орнында бос төртбұрыш тұрады. Qarip-тегі әр қаріп қазақ әріптеріне тексерілген, ал оны жүктемей тұрып өз мәтініңізбен көре аласыз.',
        'features_title': 'Қаріп іздеуге кететін уақытты қысқартады',
        'features': [
            ('type', 'Өз мәтініңізбен тексеру', 'Сөзіңізді бір рет жазасыз — каталогтағы барлық қаріп сол мәтінмен көрсетіледі. Өлшемін де өзгертуге болады.'),
            ('check', 'Қазақ әліпбиіне тексеру', 'Әр қаріп бетінде тоғыз қазақ әрпі бас және кіші түрде көрсетіледі, жетпейтін таңба бірден байқалады.'),
            ('search', 'Іздеу және санаттар', 'Атауы бойынша іздеу, сондай-ақ санс-сериф, сериф, дисплей, қолжазба және моно санаттары.'),
            ('layers', 'Ұқсас қаріптер', 'Әр қаріптің жанында стилі жақын нұсқалар тұрады — салыстырып, ең жарасатынын таңдайсыз.'),
            ('heart', 'Ұнағандар', 'Ұнаған қаріпті жүрекшемен белгілеңіз — тізім браузеріңізде сақталады.'),
            ('download', 'Жүктеу және Stories', 'Қаріпті компьютерге жүктеңіз не бір батырмамен Таңба Stories редакторында бірден қолданыңыз.'),
        ],
        'steps': [
            ('Мәтініңізді жазыңыз', 'Тақырып, логотип не Story мәтінін каталогтың жоғарғы жолына енгізіңіз.'),
            ('Қаріпті таңдаңыз', 'Санат бойынша сүзіп, ұнағанын ашып, қазақ әріптерін тексеріңіз.'),
            ('Жүктеп алыңыз', 'Файлды орнатыңыз не Stories-те бірден қолданыңыз. Лицензиясын тексеруді ұмытпаңыз.'),
        ],
        'show_title': 'Әр қаріптің өз беті бар',
        'show_text': 'Қаріп бетінде мәтінді еркін өзгертіп, өлшемін жылжытып, қазақ әріптерінің бәрін бір қарағанда көресіз.',
        'show_list': ['Мәтін мен өлшемді өзгерту', 'Қазақ әліпбиін қолдау белгісі', 'Санаты, лицензия туралы ескерту және ұқсас қаріптер', 'Компьютер мен телефонға орнату нұсқаулығы'],
        'show_visual': '<div class="ld-phone"><img src="/assets/landing/qarip-font.webp" width="560" height="1091" alt="Qarip қаріп беті: мәтінді тексеру және қазақ әріптері" loading="lazy"/></div>',
        'extra': '''<section><div class="wrap"><h2>Тексерілетін әріптер</h2><p class="ld-sub">Қаріп қазақша мәтінге жарамды болуы үшін мына тоғыз әріптің бас және кіші түрі болуы керек.</p>
        <div class="ld-letters" aria-label="Қазақ әріптері"><span>Ә</span><span>Ғ</span><span>Қ</span><span>Ң</span><span>Ө</span><span>Ұ</span><span>Ү</span><span>Һ</span><span>І</span></div></div></section>''',
        'who': ['Дизайнерлер', 'SMM мамандары', 'Мұғалімдер мен студенттер', 'Блогерлер', 'Шағын бизнес', 'Баспа мен БАҚ'],
        'faq': [
            ('Qarip тегін бе?', 'Иә. Каталогты қарау, қаріпті өз мәтінмен тексеру және жүктеу тегін, тіркелудің қажеті жоқ.'),
            ('Қаріпті коммерциялық жобаға қолдануға бола ма?', 'Бұл әр қаріптің лицензиясына байланысты. Google Fonts-тағы қаріптер ашық лицензиямен келеді. Басқаларын жарнама, логотип не сатылатын өнімге қолданар алдында құқық иесінің шарттарын міндетті түрде тексеріңіз.'),
            ('Қаріпті қалай орнатамын?', 'Жүктелген .ttf не .otf файлды ашып, «Орнату» батырмасын басыңыз. Толық нұсқаулық «Мақалалар» бөлімінде бар.'),
            ('Instagram-да неге басқаша шығады?', 'Instagram мен TikTok өз қаріптерін қолданады. Қазақша Story үшін мәтінді Таңба Stories редакторында сурет етіп жасаған сенімді.'),
            ('Каталогқа қаріп ұсынуға бола ма?', 'Иә, ekunat00@gmail.com мекенжайына жазыңыз.'),
        ],
        'cta_title': 'Мәтініңізге лайық қаріпті табыңыз',
        'cta_text': '320-дан астам қаріп, бәрі қазақ әріптеріне тексерілген. Тіркеусіз, тегін.',
    },
    'tanba': {
        'path': '/tanba/tanystyru/',
        'app': '/tanba/stories/',
        'name': 'Таңба',
        'title': 'Таңба Stories — қазақша Instagram Story редакторы',
        'description': 'Таңба — қазақ әріптері бұзылмайтын әдемі Instagram Story жасайтын тегін онлайн редактор. Фон, мәтін, қаріп, фото, градиент — дайын 9:16 PNG.',
        'chip': 'Таңба · Stories',
        'h1': 'Қазақша Story-ді <em>2 минутта</em> жасаңыз',
        'lead': 'Фон таңдайсыз, мәтін жазасыз, қазақша қаріп қоясыз — дайын 9:16 сурет Instagram, WhatsApp пен Telegram-да бірдей әдемі көрінеді. Бағдарлама орнатудың қажеті жоқ.',
        'cta': 'Story жасау',
        'facts': [('9:16', 'дайын PNG'), ('320+', 'қазақша қаріп'), ('1 минут', 'алғашқы Story'), ('0 ₸', 'тіркеусіз')],
        'visual': '''<div class="ld-phones"><div class="ld-phone"><img src="/assets/landing/tanba-editor.webp" width="560" height="1091" alt="Таңба Stories редакторы" fetchpriority="high"/></div><div class="ld-phone"><img src="/assets/landing/story-coffee-time.webp" width="360" height="640" alt="Таңбада жасалған Story үлгісі"/></div></div>
        <div class="ld-float a">Қ Ғ Ң Ә<small>Әріптер бұзылмайды</small></div>''',
        'problem_title': 'Instagram-ның қаріптері қазақ әріптерін көрсетпейді',
        'problem_visual': '<p class="ld-broken">Жақсы күн → <s>Ж</s>а<s>?</s>сы күн</p>',
        'problem': 'Story редакторындағы көп қаріпте Қ, Ғ, Ң, Ә жоқ, сондықтан сөздің ортасындағы әріптер басқа қаріппен шығады. Таңба мәтінді қазақ әріптерін толық қолдайтын қаріппен суретке айналдырады — нәтижесі кез келген қосымшада бірдей.',
        'features_title': 'Әдемі Story-ге керектің бәрі бір жерде',
        'features': [
            ('type', 'Қазақша қаріптер', 'Qarip каталогындағы қаріптер мен дайын қаріп жұптары — тақырып пен мәтін бір-біріне жарасады.'),
            ('image', 'Фон, фото, градиент', 'Түс, градиент не өз фотоңызды қойыңыз, үстіне мәтін мен стикерлер қосыңыз.'),
            ('layers', 'Қабаттар', 'Мәтінді, суретті және стикерлерді жылжытып, үлкейтіп, ретін ауыстырасыз.'),
            ('phone', 'Телефонға арналған', 'Редактор саусақпен басқаруға жасалған: ым-ишарамен жылжыту, үлкейту, бұру.'),
            ('download', 'Дайын PNG', 'Нәтижені 9:16 жоғары сапалы сурет етіп жүктеңіз не бірден бөлісіңіз.'),
            ('sparkle', 'Дайын стильдер', 'Бір батырмамен кездейсоқ стиль мен түстер — идея керек кезде көмектеседі.'),
        ],
        'steps': [
            ('Фон таңдаңыз', 'Түс, градиент не өз фотоңыз.'),
            ('Мәтін жазып, қаріп таңдаңыз', 'Қазақ әріптері бар қаріптер мен дайын жұптар.'),
            ('Жүктеңіз', '9:16 PNG-ді Instagram, WhatsApp не Telegram-ға салыңыз.'),
        ],
        'show_title': 'Үлгілерден шабыт алыңыз',
        'show_text': 'Таңбада жасалатын Story-лердің бірнеше мысалы. Әрқайсысындағы мәтінді өзіңізше өзгертіп, жеке стиль жасай аласыз.',
        'show_list': ['Жеке блог пен күнделік', 'Кафе, дүкен және қызмет жарнамасы', 'Құттықтау мен шақыру', 'Дәйексөз және мотивация'],
        'show_visual': '<div class="ld-strip" aria-label="Story үлгілері">' + ''.join(
            f'<img src="/assets/landing/story-{n}.webp" width="360" height="640" alt="Story үлгісі: {a}" loading="lazy"/>'
            for n, a in [('glow', 'Glow'), ('travel-mood', 'саяхат'), ('weekend', 'демалыс'), ('dream-big', 'мотивация'), ('city-girl', 'қала'), ('slow-morning', 'таң'), ('soft-life', 'жайлы өмір')]) + '</div>',
        'extra': '',
        'who': ['Блогерлер', 'SMM мамандары', 'Кафе мен дүкендер', 'Мұғалімдер', 'Іс-шара ұйымдастырушылар', 'Жай ғана әдемі Story ұнататындар'],
        'faq': [
            ('Таңба тегін бе?', 'Иә, редактор толығымен тегін және тіркелуді қажет етпейді.'),
            ('Телефонда жұмыс істей ме?', 'Иә, редактор алдымен телефонға арналып жасалған. Браузерде ашылады, ештеңе орнатпайсыз.'),
            ('Неге Instagram-ның өз редакторы емес?', 'Instagram қаріптерінің бір бөлігінде қазақ әріптері жоқ. Таңбадағы барлық қаріп қазақ әріптерін толық көрсетеді, ал дайын сурет кез келген жерде бірдей көрінеді.'),
            ('Өз фотомды қоса аламын ба?', 'Иә, «Фото» бөлімінен телефондағы суретті таңдаңыз. Сурет құрылғыңызда өңделеді, серверге жүктелмейді.'),
            ('Жасаған Story қандай форматта сақталады?', '9:16 пропорциялы жоғары сапалы PNG сурет ретінде.'),
        ],
        'cta_title': 'Алғашқы қазақша Story-іңізді қазір жасаңыз',
        'cta_text': 'Бір минутта бастайсыз — тіркелу, орнату жоқ.',
    },
    'dauystap': {
        'path': '/dauystap/tanystyru/',
        'app': '/dauystap/',
        'name': 'DauysTap',
        'title': 'DauysTap — қазақша дауыспен жазу, мәтінді дауыстау, видеодан мәтін',
        'description': 'DauysTap — қазақша сөйлеп жазу, мәтінді дауысқа айналдыру және видеодағы сөзді мәтінге аудару. Қазақ, орыс, ағылшын тілдері араласса да түсінеді. Браузерде, тегін.',
        'chip': 'DauysTap · дауыс',
        'h1': 'Сөйлеңіз — <em>мәтін өзі</em> жазылады',
        'lead': 'Қазақша сөйлеп жазу, мәтінді табиғи дауыспен оқыту және видеодағы сөзді мәтінге айналдыру — бір құралда. Қазақ, орыс, ағылшын сөздері араласса да түсінеді.',
        'cta': 'DauysTap-ты ашу',
        'facts': [('3', 'тіл бір мәтінде'), ('7', 'дауыс'), ('200 МБ', 'видеоға дейін'), ('3 рет', 'тіркеусіз күніне')],
        'visual': '''<div class="ld-phones"><div class="ld-phone"><img src="/assets/landing/dt-dictate.webp" width="560" height="922" alt="DauysTap: сөйлеп жазу" fetchpriority="high"/></div><div class="ld-phone"><img src="/assets/landing/dt-voice.webp" width="560" height="922" alt="DauysTap: мәтіннен дауыс"/></div></div>
        ''',
        'problem_title': 'Қазақша мәтінді теру — ұзақ. Дауыстау — қымбат.',
        'problem_visual': '<p class="ld-broken">1 минут сөйлеу ≈ 120 сөз</p>',
        'problem': 'Телефонда қазақша теру баяу, ал пернетақтадағы микрофон аралас сөзді жиі түсінбейді. Видеоға субтитр жасау — сағаттық жұмыс, ал дикторға жазу — шығын. DauysTap осы үш жұмысты браузерде, бірнеше секундта атқарады.',
        'features_title': 'Үш құрал — бір жерде',
        'features': [
            ('mic', 'Сөйлеп жазу', 'Микрофонды басып сөйлей беріңіз — мәтін нақты уақытта экранда пайда болады. Көшіріп, кез келген жерге қойыңыз.'),
            ('speaker', 'Мәтіннен дауыс', 'Мәтінді жазыңыз, дауысты таңдаңыз — бірнеше секундта MP3 файл дайын. Видео, сабақ не хабарландыру үшін.'),
            ('video', 'Видео → мәтін', 'Видео файлды таңдаңыз — ішіндегі сөз мәтінге айналады. Видеоның өзі құрылғыңыздан шықпайды.'),
            ('globe', 'Аралас тіл', 'Қазақша, орысша, ағылшынша сөздер бір сөйлемде араласса да түсінеді — тілді таңдаудың қажеті жоқ.'),
            ('clock', 'Тарих', 'Барлық мәтін «Тарих» бөлімінде сақталады — тек өз браузеріңізде.'),
            ('phone', 'Телефонға орнату', 'DauysTap-ты басты экранға қосып, қосымша сияқты бір басумен ашыңыз.'),
        ],
        'steps': [
            ('Ашыңыз', 'Браузерде aqsuek.kz/dauystap ашыңыз — орнатудың қажеті жоқ.'),
            ('Құралды таңдаңыз', 'Сөйлеп жазу, мәтіннен дауыс не видеодан мәтін.'),
            ('Нәтижені алыңыз', 'Мәтінді көшіріңіз, MP3-ті жүктеңіз не субтитрге қолданыңыз.'),
        ],
        'show_title': 'Кірмей-ақ байқап көріңіз',
        'show_text': 'Күніне 3 рет тіркелусіз қолдана аласыз. Көбірек керек болса, Google аккаунтымен бір рет кіресіз — күн сайын 40 жазу және 50 дауыс тегін.',
        'show_list': ['Тіркеусіз: күніне 3 жазу және 3 дауыс', 'Google арқылы: күніне 40 жазу және 50 дауыс', 'Аудио мен видео серверде сақталмайды', 'Мәтін тарихы тек өз құрылғыңызда'],
        'show_visual': '<div class="ld-phone"><img src="/assets/landing/dt-video.webp" width="560" height="922" alt="DauysTap видеодан мәтін бөлімі" loading="lazy"/></div>',
        'extra': '',
        'who': ['Блогерлер мен видеомейкерлер', 'Журналистер', 'Мұғалімдер мен студенттер', 'Кеңсе қызметкерлері', 'Көру қабілеті әлсіз адамдар', 'Тез жазғысы келетіндер'],
        'faq': [
            ('DauysTap тегін бе?', 'Иә. Тіркелмей күніне 3 рет, ал Google арқылы кірсеңіз күніне 40 жазу және 50 дауыс тегін беріледі.'),
            ('Қазақша жақсы түсіне ме?', 'Иә, ол қазақша сөзді таниды, ал орыс не ағылшын сөздері араласса да мәтінге дұрыс түсіреді. Нәтижені әрдайым қарап шыққан дұрыс.'),
            ('Видеом қайда жіберіледі?', 'Видео файлдың өзі құрылғыңыздан шықпайды: одан тек дыбыс бөлініп, тану үшін өңделеді. Біз аудио мен мәтінді сақтамаймыз.'),
            ('Қандай дауыстар бар?', 'Ер және әйел дауыстарының 7 нұсқасы. Дауыстау қазақ, орыс және ағылшын тілдерінде жұмыс істейді.'),
            ('Телефонда жұмыс істей ме?', 'Иә, браузерде ашылады. Қаласаңыз, басты экранға қосып, қосымша сияқты қолдана аласыз.'),
        ],
        'cta_title': 'Келесі мәтініңізді айтып жазыңыз',
        'cta_text': 'Тіркеусіз байқап көріңіз — микрофонды басу ғана жеткілікті.',
    },
}

OTHERS = {
    'qarip': ('Qarip', 'Қазақ әріптері бар 320+ қаріп каталогы.'),
    'tanba': ('Таңба Stories', 'Қазақша Instagram Story редакторы.'),
    'dauystap': ('DauysTap', 'Сөйлеп жазу, мәтіннен дауыс, видеодан мәтін.'),
}


def build(key):
    p = PRODUCTS[key]
    url = 'https://aqsuek.kz' + p['path']
    nav = NAV.format(q=' aria-current="page"' if key == 'qarip' else '', t=' aria-current="page"' if key == 'tanba' else '', d=' aria-current="page"' if key == 'dauystap' else '')
    facts = ''.join(f'<li><strong>{a}</strong><span>{html.escape(b)}</span></li>' for a, b in p['facts'])
    feats = ''.join(f'<li>{icon(i)}<h3>{html.escape(t)}</h3><p>{html.escape(d)}</p></li>' for i, t, d in p['features'])
    steps = ''.join(f'<li><h3>{html.escape(t)}</h3><p>{html.escape(d)}</p></li>' for t, d in p['steps'])
    show_list = ''.join(f'<li>{html.escape(x)}</li>' for x in p['show_list'])
    who = ''.join(f'<li>{html.escape(x)}</li>' for x in p['who'])
    faq = ''.join(f'<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>' for q, a in p['faq'])
    others = ''.join(
        f'<a href="{PRODUCTS[k]["path"]}"><strong>{html.escape(n)}</strong><span>{html.escape(d)}</span><em>Танысу →</em></a>'
        for k, (n, d) in OTHERS.items() if k != key)
    ld = {
        '@context': 'https://schema.org',
        '@graph': [
            {'@type': 'WebApplication', 'name': p['name'], 'url': 'https://aqsuek.kz' + p['app'], 'description': p['description'],
             'applicationCategory': 'DesignApplication' if key != 'dauystap' else 'MultimediaApplication', 'operatingSystem': 'Web',
             'inLanguage': 'kk', 'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'KZT'},
             'publisher': {'@type': 'Organization', 'name': 'AQSUEK', 'url': 'https://aqsuek.kz/'}},
            {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in p['faq']]},
            {'@type': 'BreadcrumbList', 'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'AQSUEK', 'item': 'https://aqsuek.kz/'},
                {'@type': 'ListItem', 'position': 2, 'name': p['name'], 'item': url}]},
        ],
    }
    t = html.escape(p['title'])
    d = html.escape(p['description'], quote=True)
    og = 'https://aqsuek.kz/dauystap/og.jpg' if key == 'dauystap' else ('https://aqsuek.kz/qarip/assets/og-create.jpg' if key == 'qarip' else 'https://aqsuek.kz/assets/aqsuek/og.jpg')
    out = f'''<!DOCTYPE html>
<html lang="kk">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>{t}</title>
  <meta name="description" content="{d}"/>
  <meta name="robots" content="index,follow,max-image-preview:large"/>
  <link rel="canonical" href="{url}"/>
  <link rel="icon" href="/assets/aqsuek/favicon.svg" type="image/svg+xml"/>
  <meta property="og:type" content="website"/>
  <meta property="og:locale" content="kk_KZ"/>
  <meta property="og:site_name" content="AQSUEK"/>
  <meta property="og:title" content="{t}"/>
  <meta property="og:description" content="{d}"/>
  <meta property="og:url" content="{url}"/>
  <meta property="og:image" content="{og}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:image" content="{og}"/>
  <link rel="stylesheet" href="/home.css?v=aqsuek7"/>
  <link rel="stylesheet" href="/liquid-glass.css?v=lg33"/>
  <link rel="stylesheet" href="/landing.css?v=4"/>
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Негізгі мазмұнға өту</a>
  <div class="lg-blobs" aria-hidden="true"><i class="lg-blob-a"></i><i class="lg-blob-b"></i><i class="lg-blob-c"></i></div>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="AQSUEK — басты бет">AQSUEK</a>
{nav}
      <button type="button" class="nav-toggle" aria-label="Мәзір" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main id="main" class="ld ld-{key}">
    <section class="ld-hero">
      <div class="wrap">
        <div>
          <span class="ld-chip"><b>{p['name'][0]}</b>{html.escape(p['chip'])}</span>
          <h1>{p['h1']}</h1>
          <p class="ld-lead">{html.escape(p['lead'])}</p>
          <div class="ld-actions">
            <a class="btn btn-primary" href="{p['app']}">{html.escape(p['cta'])} <span class="arrow" aria-hidden="true">→</span></a>
            <a class="btn btn-ghost" href="#how">Қалай жұмыс істейді</a>
          </div>
          <ul class="ld-facts">{facts}</ul>
        </div>
        <div class="ld-visual">
        {p['visual']}
        </div>
      </div>
    </section>

    <section class="ld-problem">
      <div class="wrap">
        <div><h2>{html.escape(p['problem_title'])}</h2>{p['problem_visual']}</div>
        <p>{html.escape(p['problem'])}</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <h2>{html.escape(p['features_title'])}</h2>
        <p class="ld-sub">{html.escape(p['name'])} күнделікті жұмысты жеңілдетуге арналған — артық баптаусыз, тіркеусіз.</p>
        <ul class="ld-features">{feats}</ul>
      </div>
    </section>

    <section id="how">
      <div class="wrap">
        <h2>Үш қадам</h2>
        <p class="ld-sub">Бастау үшін нұсқаулық оқудың қажеті жоқ.</p>
        <ol class="ld-steps">{steps}</ol>
      </div>
    </section>

    <section>
      <div class="wrap ld-show{' flip' if key == 'qarip' else ''}">
        <div>
          <h2>{html.escape(p['show_title'])}</h2>
          <p class="ld-sub">{html.escape(p['show_text'])}</p>
          <ul class="ld-list">{show_list}</ul>
        </div>
        <div class="ld-visual">{p['show_visual']}</div>
      </div>
    </section>
{p['extra']}
    <section>
      <div class="wrap">
        <h2>Кімге керек</h2>
        <ul class="ld-who">{who}</ul>
      </div>
    </section>

    <section>
      <div class="wrap">
        <h2>Жиі қойылатын сұрақтар</h2>
        <div class="faq-list">{faq}</div>
      </div>
    </section>

    <section class="ld-cta">
      <div class="wrap">
        <h2>{html.escape(p['cta_title'])}</h2>
        <p>{html.escape(p['cta_text'])}</p>
        <a class="btn btn-primary" href="{p['app']}">{html.escape(p['cta'])} <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </section>

    <section>
      <div class="wrap">
        <h2>AQSUEK-тің басқа құралдары</h2>
        <div class="ld-others">{others}</div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap footer-inner">
      <p class="footer-copy">AQSUEK © 2026 · <a href="/privacy/">Құпиялық</a></p>
      <nav class="footer-links" aria-label="Төменгі мәзір">
        <a href="/qarip/tanystyru/">Qarip</a>
        <a href="/tanba/tanystyru/">Таңба</a>
        <a href="/dauystap/tanystyru/">DauysTap</a>
        <a href="/blog/">Мақалалар</a>
        <a href="/about/">Жоба туралы</a>
      </nav>
    </div>
  </footer>
  <script src="/home.js?v=aqsuek2" defer></script>
  <script src="/liquid-glass.js?v=lg20" defer></script>
{BEACON}
</body>
</html>
'''
    d = os.path.join(SITE, p['path'].strip('/'))
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(out)


if __name__ == '__main__':
    for k in PRODUCTS:
        build(k)
    print('built', len(PRODUCTS), 'landings')
