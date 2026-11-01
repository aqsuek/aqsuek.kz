#!/usr/bin/env python3
"""Builds /blog/ (index + articles) from the ARTICLES list below. Run from repo root: python3 scripts/build-blog.py"""
import html, json, os

SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
BEACON = '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token": "4cff9e1227a64f6ea836c3fd64686153"}\'></script>'

ARTICLES = [
    {
        'slug': 'qazaqsha-qarip-ornatu',
        'date': '2026-11-02',
        'title': 'Қазақша қаріпті компьютер мен телефонға қалай орнатуға болады',
        'seo': 'Қазақша қаріпті қалай орнатамын: компьютер мен телефон',
        'description': 'Windows, Mac, iPhone және Android-қа қазақ әріптерін қолдайтын қаріпті орнату жолы. Қаріп қазақ әріптерін қолдайтынын қалай тексеруге болады.',
        'lead': 'Қаріп таптыңыз, бірақ Қ, Ғ, Ң, Ә әріптері сұрақ белгісі не бос төртбұрыш болып шығады ма? Себебі көп қаріпте қазақ әріптері мүлде жоқ. Төменде қаріпті алдымен қалай тексеру керегін және әр құрылғыға қалай орнатуды түсіндіреміз.',
        'cta': ('/qarip/', 'Qarip-тен қаріп табу'),
        'body': '''
<h2>1. Алдымен қаріп қазақ әріптерін қолдай ма — тексеріңіз</h2>
<p>Қаріпті жүктемей тұрып, оның Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І әріптерін көрсететініне көз жеткізіңіз. Ең оңай жолы — <a href="/qarip/">Qarip каталогында</a> өз мәтініңізді жазып көру: әр қаріп бетінде «Қазақ әліпбиі: толық қолдау» деген белгі бар.</p>
<p>Басқа сайттан алған қаріпті тексеру үшін оны орнатып, мәтін редакторында «Қазақ тілі — ғажап тіл. Ә Ғ Қ Ң Ө Ұ Ү Һ І» деп жазып көріңіз. Бір әріп басқа қаріппен шықса не бос қалса, бұл қаріп қазақшаға толық сай емес.</p>

<h2>2. Windows</h2>
<ol>
  <li>Қаріп файлын (.ttf немесе .otf) жүктеп алыңыз. ZIP болса — алдымен ашыңыз.</li>
  <li>Файлды тінтуірдің оң жағымен басып, <b>«Орнату»</b> (Install) таңдаңыз. Барлық пайдаланушыға керек болса — «Барлық пайдаланушылар үшін орнату».</li>
  <li>Word, Photoshop немесе Figma ашық болса, оларды жауып, қайта ашыңыз — жаңа қаріп тізімде пайда болады.</li>
</ol>

<h2>3. Mac</h2>
<ol>
  <li>Қаріп файлын екі рет басыңыз — «Қаріптер» (Font Book) қосымшасы ашылады.</li>
  <li><b>«Орнату»</b> (Install Font) батырмасын басыңыз.</li>
  <li>Бағдарламаларды қайта ашыңыз.</li>
</ol>

<h2>4. iPhone және iPad</h2>
<p>iOS-та қаріпті жай файлмен орнатуға болмайды: оны App Store-дағы қаріп орнататын қосымша арқылы «профиль» ретінде қосады. Орнатқан соң қаріп Pages, Keynote сияқты қаріп таңдауға болатын қосымшаларда шығады.</p>
<p>Есте сақтаңыз: Instagram, TikTok және WhatsApp өз қаріптерін қолданады — телефонға қаріп орнатсаңыз да, олардың ішіндегі мәтін өзгермейді. Story-ге қазақша қаріп керек болса, мәтінді суретке айналдыру керек — мұны <a href="/tanba/stories/">Tañba</a> жасайды.</p>

<h2>5. Android</h2>
<p>Android-та жүйелік қаріпті ауыстыру телефонның маркасына байланысты (мысалы, Samsung-та «Қаріп стилі» баптауы бар, бірақ тек дүкендегі қаріптерді қабылдайды). Ал CapCut, Canva, PixelLab сияқты қосымшалар өзіңіз жүктеген .ttf файлды тікелей қабылдайды — қаріпті сол қосымшаның «Қаріп қосу» бөлімінен таңдаңыз.</p>

<h2>6. Лицензияны ұмытпаңыз</h2>
<p>Әр қаріптің өз лицензиясы бар. Кейбіреуі тек жеке қолданысқа тегін, ал жарнама, логотип не сатылатын өнімге қолдану үшін рұқсат не лицензия сатып алу керек. Qarip-те әр қаріп бетінде лицензияға қатысты белгі бар — коммерциялық жобаның алдында міндетті түрде тексеріңіз.</p>
''',
    },
    {
        'slug': 'qazaqsha-story',
        'date': '2026-11-02',
        'title': 'Instagram-да қазақша Story қалай жасауға болады: Ә, Ғ, Қ әріптері бұзылмасын',
        'seo': 'Қазақша Instagram Story қалай жасаймын | AQSUEK',
        'description': 'Instagram Stories-те қазақ әріптері неге бұзылады және әдемі қазақша Story-ді 2 минутта қалай жасауға болады. Қадамдық нұсқаулық.',
        'lead': 'Instagram-ның өз қаріптерінің бір бөлігі қазақ әріптерін дұрыс көрсетпейді: Қ, Ғ, Ң әріптері басқа қаріппен шығып, мәтін ала-құла көрінеді. Ең сенімді шешім — мәтінді дайын сурет етіп жасау.',
        'cta': ('/tanba/stories/', 'Tañba-да Story жасау'),
        'body': '''
<h2>Неге қазақ әріптері бұзылады?</h2>
<p>Instagram Story редакторындағы әр қаріпте барлық әріп бола бермейді. Қаріпте Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І жоқ болса, телефон оларды басқа қаріптен алып қояды — сондықтан бір сөздің ішінде әріптер әртүрлі көрінеді. Бұл Instagram-ның қатесі емес, қаріптің өзінде қазақ әріптері салынбаған.</p>

<h2>Шешім: мәтінді сурет етіп жасау</h2>
<p>Мәтінді қазақ әріптерін толық қолдайтын қаріппен суретке түсірсеңіз, ол Instagram-да, WhatsApp статусында, Telegram-да бәрібір бірдей көрінеді.</p>

<h2>Tañba-да 4 қадам</h2>
<ol>
  <li><b>Фон таңдаңыз.</b> Дайын фондардың бірін не телефоныңыздағы фотоны қойыңыз.</li>
  <li><b>Мәтін жазыңыз.</b> Қазақша мәтінді еркін жаза беріңіз.</li>
  <li><b>Қаріп таңдаңыз.</b> Тізімдегі қаріптердің бәрі қазақ әріптеріне тексерілген. Түсін, өлшемін, орнын ауыстырыңыз.</li>
  <li><b>Жүктеңіз.</b> Дайын 9:16 PNG телефонға сақталады — оны Instagram-ға Story ретінде салыңыз.</li>
</ol>

<h2>Әдемі Story-ге 5 кеңес</h2>
<ul>
  <li>Бір Story-де екі қаріптен артық қолданбаңыз: тақырыпқа біреу, мәтінге біреу.</li>
  <li>Мәтінді экранның жоғарғы және төменгі 250 пиксельге жақындатпаңыз — ол жерді Instagram-ның батырмалары жабады.</li>
  <li>Ашық фонға күңгірт мәтін, күңгірт фонға ашық мәтін — оқылуы маңызды.</li>
  <li>Ұзын мәтінді бірнеше Story-ге бөліңіз.</li>
  <li>Логотипіңізді бір бұрышқа шағын етіп қойыңыз.</li>
</ul>

<h2>Мәтінді жазуға уақыт жоқ па?</h2>
<p>Мәтінді <a href="/dauystap/">DauysTap</a>-та айтып жаза салыңыз да, Tañba-ға көшіріңіз. Қазақша, орысша және ағылшынша сөзді таниды.</p>
''',
    },
    {
        'slug': 'dauyspen-jazu',
        'date': '2026-11-02',
        'title': 'Телефонда қазақша дауыспен жазу: мәтінді теру қажет емес',
        'seo': 'Телефонда қазақша дауыспен жазу | AQSUEK',
        'description': 'Қазақша сөйлеп мәтін жазудың жолдары: пернетақтадағы микрофон және DauysTap. Аралас қазақ-орыс сөзін тану, видеодан мәтін шығару, мәтінді дауыспен оқыту.',
        'lead': 'Ұзын хабарламаны, пост мәтінін не жиналыс жазбасын терудің орнына айтып жазуға болады. Бұл мақалада қазақша дауыспен жазудың жолдарын және қайсысы қашан ыңғайлы екенін айтамыз.',
        'cta': ('/dauystap/', 'DauysTap-та сөйлеп жазу'),
        'body': '''
<h2>1. Пернетақтадағы микрофон</h2>
<p>Көп пернетақтада микрофон белгішесі бар: оны басып сөйлесеңіз, мәтін бірден жазылады. Бірақ қазақ тілін қолдауы пернетақта мен телефонға байланысты, ал қазақ, орыс сөзі араласқанда қателер көбейеді. Қысқа хабарлама үшін ыңғайлы.</p>

<h2>2. DauysTap — браузерде, қазақша-орысша аралас сөзге</h2>
<p><a href="/dauystap/">DauysTap</a> — aqsuek.kz-тегі тегін құрал. Оны телефонда да, компьютерде де браузерден ашасыз:</p>
<ul>
  <li><b>Сөйлеп жазу.</b> Микрофонды басып сөйлейсіз — мәтін сөйлеп жатқанда шығады. Қазақша, орысша және ағылшынша, аралас сөйлесеңіз де таниды.</li>
  <li><b>Мәтіннен дауыс.</b> Жазылған мәтінді табиғи дауыспен тыңдап, MP3 етіп жүктеуге болады — Reels не подкастқа дауыс керек болғанда.</li>
  <li><b>Видео → мәтін.</b> Видеоны таңдасаңыз, ішіндегі сөздер мәтінге айналады — субтитр, пост не мақала жазуға ыңғайлы.</li>
  <li><b>Тарих.</b> Барлық мәтін өз браузеріңізде сақталады, іздеп, көшіре аласыз.</li>
</ul>
<p>Бір рет Google арқылы кіресіз. Әр адамға күніне 40 жазу және 50 дауыс тегін беріледі.</p>

<h2>Анық тану үшін 5 кеңес</h2>
<ol>
  <li>Тыныш жерде сөйлеңіз, телефонды аузыңызға 20–30 см жақын ұстаңыз.</li>
  <li>Асықпай, бірқалыпты сөйлеңіз — сөздерді жұтпаңыз.</li>
  <li>Ұзын мәтінді 1–2 минуттық бөліктерге бөліп жазыңыз.</li>
  <li>Есімдер мен терминдерді анық айтыңыз, соңында бір рет оқып шығыңыз.</li>
  <li>Тыныс белгілерін өзі қояды — «нүкте», «үтір» деп айтудың қажеті жоқ.</li>
</ol>

<h2>Деректер қайда кетеді?</h2>
<p>Аудио тек тану үшін жіберіледі де, серверде сақталмайды. Толығырақ — <a href="/privacy/">құпиялық саясатында</a>.</p>
''',
    },
]


ABOUT_BODY = '''      <p class="eyebrow">Жоба туралы</p>
      <h1>AQSUEK — қазақ тілінде контент жасауға арналған құралдар</h1>
      <p class="post-lead">AQSUEK қазақша жазатын, дизайн жасайтын және видео түсіретін адамдарға арналған тегін құралдар жинағы. Мақсатымыз қарапайым: қазақ әріптері кез келген жерде дұрыс шықсын, ал қазақша контент жасау орысша не ағылшынша жасаудан қиын болмасын.</p>
      <div class="post-body">
        <h2>Неге бастадық</h2>
        <p>Көп қаріпте Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І әріптері жоқ. Дизайн құралдарында, Instagram-да, тұсаукесер слайдтарында бұл әріптер басқа қаріппен шығып, мәтін ала-құла көрінеді. Ал қазақша дауыспен жазу мен мәтінді дауыстау құралдары аз әрі көбіне ақылы. AQSUEK осы олқылықтарды жабу үшін жасалды.</p>

        <h2>Құралдар</h2>
        <ul class="about-tools">
          <li><a href="/qarip/"><b>Qarip</b></a> — қазақ әріптерін толық қолдайтын 320+ қаріп каталогы. Өз мәтініңізбен тексеріп, жүктей аласыз.</li>
          <li><a href="/tanba/stories/"><b>Tañba Stories</b></a> — фон, мәтін және қазақша қаріппен дайын 9:16 Story жасайтын редактор.</li>
          <li><a href="/dauystap/"><b>DauysTap</b></a> — сөйлеп жазу, мәтінді дауыстау және видеодағы сөзді мәтінге айналдыру. Қазақша, орысша, ағылшынша.</li>
        </ul>

        <h2>Қағидаларымыз</h2>
        <ul>
          <li><b>Тегін.</b> Негізгі мүмкіндіктер ақысыз. DauysTap-та әр адамға күнделікті лимит бар — қызмет бәріне жетуі үшін.</li>
          <li><b>Браузерде.</b> Ештеңе орнатудың қажеті жоқ, телефонда да, компьютерде де ашылады.</li>
          <li><b>Деректер — сіздікі.</b> Мәтін тарихы өз браузеріңізде сақталады, аудио мен видео серверде қалмайды. Толығырақ — <a href="/privacy/">құпиялық саясаты</a>.</li>
          <li><b>Лицензияға адалдық.</b> Қаріптердің авторлық құқығы иелерінде. Әр қаріп бетінде лицензиясын тексеруге шақырамыз.</li>
        </ul>

        <h2>Байланыс</h2>
        <p>Ұсыныс, қате не серіктестік туралы жазыңыз: <a href="mailto:ekunat00@gmail.com">ekunat00@gmail.com</a>. Каталогқа қосу керек қазақша қаріп білсеңіз — оны да жіберіңіз.</p>
      </div>'''


def page(title, description, canonical, body, extra_head=''):
    t = html.escape(title)
    d = html.escape(description, quote=True)
    return f'''<!DOCTYPE html>
<html lang="kk">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>{t}</title>
  <meta name="description" content="{d}"/>
  <meta name="robots" content="index,follow,max-image-preview:large"/>
  <link rel="canonical" href="{canonical}"/>
  <link rel="icon" href="/assets/aqsuek/favicon.svg" type="image/svg+xml"/>
  <meta property="og:type" content="article"/>
  <meta property="og:locale" content="kk_KZ"/>
  <meta property="og:site_name" content="AQSUEK"/>
  <meta property="og:title" content="{t}"/>
  <meta property="og:description" content="{d}"/>
  <meta property="og:url" content="{canonical}"/>
  <meta property="og:image" content="https://aqsuek.kz/assets/aqsuek/og.jpg"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <link rel="stylesheet" href="/home.css?v=aqsuek6"/>
  <link rel="stylesheet" href="/liquid-glass.css?v=lg33"/>
  <link rel="stylesheet" href="/blog/blog.css?v=2"/>
{extra_head}</head>
<body>
  <div class="lg-blobs" aria-hidden="true"><i class="lg-blob-a"></i><i class="lg-blob-b"></i><i class="lg-blob-c"></i></div>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="AQSUEK — басты бет">AQSUEK</a>
      <nav class="site-nav" id="site-nav" aria-label="Негізгі мәзір">
        <a href="/qarip/">Qarip</a>
        <a href="/tanba/stories/">Stories</a>
        <a href="/tanba/">Tañba</a>
        <a href="/dauystap/">DauysTap</a>
        <a href="/blog/">Мақалалар</a>
        <a href="/about/">Жоба туралы</a>
      </nav>
      <button type="button" class="nav-toggle" aria-label="Мәзір" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <main class="blog">
    <div class="wrap">
{body}
    </div>
  </main>
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <p class="footer-copy">AQSUEK © 2026 · <a href="/privacy/">Құпиялық</a></p>
      <nav class="footer-links" aria-label="Төменгі мәзір">
        <a href="/qarip/">Qarip</a>
        <a href="/tanba/stories/">Stories</a>
        <a href="/tanba/">Tañba</a>
        <a href="/dauystap/">DauysTap</a>
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


def fmt_date(d):
    y, m, day = d.split('-')
    return f'{day}.{m}.{y[2:]}'


def main():
    os.makedirs(os.path.join(SITE, 'blog'), exist_ok=True)
    cards = []
    for a in ARTICLES:
        url = f'https://aqsuek.kz/blog/{a["slug"]}/'
        ld = {
            '@context': 'https://schema.org', '@type': 'Article', 'headline': a['title'], 'description': a['description'],
            'datePublished': a['date'], 'dateModified': a['date'], 'inLanguage': 'kk', 'mainEntityOfPage': url,
            'image': 'https://aqsuek.kz/assets/aqsuek/og.jpg',
            'author': {'@type': 'Organization', 'name': 'AQSUEK', 'url': 'https://aqsuek.kz/'},
            'publisher': {'@type': 'Organization', 'name': 'AQSUEK', 'logo': {'@type': 'ImageObject', 'url': 'https://aqsuek.kz/assets/aqsuek/favicon.svg'}},
        }
        crumbs = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'AQSUEK', 'item': 'https://aqsuek.kz/'},
            {'@type': 'ListItem', 'position': 2, 'name': 'Мақалалар', 'item': 'https://aqsuek.kz/blog/'},
            {'@type': 'ListItem', 'position': 3, 'name': a['title'], 'item': url}]}
        head = f'  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n  <script type="application/ld+json">{json.dumps(crumbs, ensure_ascii=False)}</script>\n'
        others = ''.join(f'<li><a href="/blog/{o["slug"]}/">{html.escape(o["title"])}</a></li>' for o in ARTICLES if o is not a)
        body = f'''      <nav class="crumbs" aria-label="Жол"><a href="/">AQSUEK</a> / <a href="/blog/">Мақалалар</a></nav>
      <article class="post">
        <p class="eyebrow">Нұсқаулық · <time datetime="{a['date']}">{fmt_date(a['date'])}</time></p>
        <h1>{html.escape(a['title'])}</h1>
        <p class="post-lead">{html.escape(a['lead'])}</p>
        <div class="post-body">{a['body']}</div>
        <div class="post-cta"><a class="btn btn-primary" href="{a['cta'][0]}">{html.escape(a['cta'][1])} <span class="arrow" aria-hidden="true">→</span></a></div>
      </article>
      <aside class="post-more"><h2>Тағы оқыңыз</h2><ul>{others}</ul></aside>'''
        d = os.path.join(SITE, 'blog', a['slug'])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page(a.get('seo', a['title'] + ' | AQSUEK'), a['description'], url, body, head))
        cards.append(f'''        <li><a class="post-card" href="/blog/{a["slug"]}/"><time datetime="{a["date"]}">{fmt_date(a["date"])}</time><h2>{html.escape(a["title"])}</h2><p>{html.escape(a["description"])}</p><span class="post-card-more">Оқу →</span></a></li>''')
    body = '''      <p class="eyebrow">Мақалалар</p>
      <h1>Қазақша контент жасау туралы нұсқаулықтар</h1>
      <p class="post-lead">Қаріп орнату, қазақша Story жасау, дауыспен жазу — қысқа әрі түсінікті.</p>
      <ul class="post-list">
''' + '\n'.join(cards) + '\n      </ul>'
    with open(os.path.join(SITE, 'blog', 'index.html'), 'w', encoding='utf-8') as f:
        f.write(page('Мақалалар — қазақша контент жасау туралы | AQSUEK', 'Қазақша қаріп орнату, Instagram-да қазақша Story жасау, телефонда дауыспен жазу туралы нұсқаулықтар.', 'https://aqsuek.kz/blog/', body))
    os.makedirs(os.path.join(SITE, 'about'), exist_ok=True)
    org = {'@context': 'https://schema.org', '@type': 'AboutPage', 'name': 'AQSUEK туралы', 'url': 'https://aqsuek.kz/about/', 'inLanguage': 'kk',
           'mainEntity': {'@type': 'Organization', 'name': 'AQSUEK', 'url': 'https://aqsuek.kz/', 'email': 'ekunat00@gmail.com'}}
    with open(os.path.join(SITE, 'about', 'index.html'), 'w', encoding='utf-8') as f:
        f.write(page('Жоба туралы — AQSUEK', 'AQSUEK — қазақ тілінде контент жасауға арналған тегін құралдар: Qarip, Tañba, DauysTap. Мақсатымыз, қағидаларымыз және байланыс.',
                     'https://aqsuek.kz/about/', ABOUT_BODY, f'  <script type="application/ld+json">{json.dumps(org, ensure_ascii=False)}</script>\n'))
    print('built', len(ARTICLES), 'articles + about')


if __name__ == '__main__':
    main()
