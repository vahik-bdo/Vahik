/* «О переводе»: кнопка рядом с названием перевода и модальное окно с рассказом о нём.
   Для каждого перевода — свой текст на языке его локализации:
     cass, rbo → русская версия; nasb → английская; arar → армянская; elb → немецкая.
   Формат раздела: [заголовок, текст] — абзацы разделены пустой строкой, **жирный** допустим;
   либо [заголовок, [[метка, текст], …]] — хронология.
   Факты проверены по источникам (Православная энциклопедия, Predanie.ru, Bibelgesellschaft, Wikipedia,
   Bible Society in Armenia, dewiki). Что осталось неподтверждённым — помечено TODO в комментариях
   (в текст для читателя пометки не попадают). */
(()=>{
const UI={
 ru:{about:'О переводе',close:'Закрыть'},
 en:{about:'About this translation',close:'Close'},
 hy:{about:'Թարգմանության մասին',close:'Փակել'},
 de:{about:'Über diese Übersetzung',close:'Schließen'}
};
const NAME={cass:'Кассиан',rbo:'РБО',arar:'Նոր Արարատ 2018',nasb:'NASB',elb:'Elberfelder 1905'};
const NAME_L={cass:{en:'Cassian',hy:'Կասիան',de:'Kassian'},rbo:{en:'RBS (Modern Russian)',hy:'ՌԲՕ',de:'RBO (Modernes Russisch)'}};

const TR={

/* ───────────── РУССКИЙ: перевод епископа Кассиана ───────────── */
cass:{ru:[
['Человек, который переводил',
`Сергей Сергеевич Безобразов родился в Петербурге 29 февраля 1892 года — в високосный день, так что настоящий день рождения у него случался раз в четыре года. Он вырос в семье сенатора, окончил гимназию с золотой медалью, затем историко-филологический факультет университета, а с 1917 года преподавал церковную историю. В 1922 году он уехал из России: Латвия, Белград, а с 1925 года — Париж. В 1932-м принял монашество с именем Кассиан, в 1947-м стал епископом Катанским, викарием митрополита Западноевропейских русских приходов. Умер в Париже 4 февраля 1965 года.

Новый Завет был делом всей его жизни. Докторская диссертация 1947 года называется «Водою и Кровию и Духом» — по словам из первого послания Иоанна (1 Ин 5:6), и в ней уже слышен будущий переводчик: внимание к каждому слову греческого текста.`],

['Парижский институт',
`В 1925 году в Париже открылся Свято-Сергиевский православный богословский институт. Его создала русская эмиграция: после революции учить богословию на родине стало почти невозможно, а в изгнании оказалось много учёных, которые не хотели, чтобы русская церковная наука прервалась. Институт возник при митрополите Евлогии.

Здесь преподавали отец Сергий Булгаков, Георгий Флоровский, Антон Карташёв, Василий Зеньковский, позднее — Александр Шмеман и Иоанн Мейендорф. Безобразов был среди основателей, возглавил кафедру Нового Завета, а потом и сам институт. Для переводчика место редкое: под одной крышей греческий язык, молитвенная память Православной Церкви и книги всей европейской библейской науки. Именно при институте собралась комиссия, о которой рассказывает следующий раздел.`],

['Одиннадцать лет работы и семнадцать лет ожидания',
[
 ['Май 1951','Первое заседание комиссии по русскому тексту Нового Завета. Задумывали пересмотр Синодального перевода, но скоро решили сделать новый.'],
 ['1953','Выходит первое напечатанное: Евангелие от Матфея, предварительное издание Библейского общества. Отсюда и отсчёт «одиннадцати лет».'],
 ['1955','Готов черновик всего Нового Завета.'],
 ['Январь 1957','Комиссия утверждает текст.'],
 ['1958 и 1960','Выходят Четвероевангелие и Деяния апостолов.'],
 ['1964','Работа завершена (последний протокол комиссии — осень 1963 года).'],
 ['1965','Умирает епископ Кассиан.'],
 ['1970','Весь Новый Завет выходит единой книгой.']
]],

['Что стоит за этими цифрами',
`От первых напечатанных страниц (1953) до завершения (1964) прошло одиннадцать лет. Ещё шесть лет законченная книга ждала выхода: от первой публикации до полного издания — семнадцать лет, и пять из них уже без переводчика. Если считать от самого первого заседания комиссии, путь был ещё длиннее: тринадцать лет работы и девятнадцать — до книги.

Это была работа не одиночки, а комиссии, но главным переводчиком оставался Кассиан. Комиссия собиралась еженедельно, текст читали вслух и спорили над каждой фразой; писатель Борис Зайцев помогал с литературной правкой. Около полутора лет Кассиан провёл в Испании, где в тишине писал черновик. Полностью книга вышла в 1970 году, а в России её издали лишь на рубеже 1990-х и 2000-х.`],

['Откуда берётся греческий текст',
`Не сохранилось ни одного текста, написанного рукой апостола или евангелиста. У нас есть копии. Греческих рукописей Нового Завета — более пяти тысяч: от обрывков папируса II века до больших пергаментных книг IV века (Синайский и Ватиканский кодексы) и тысяч средневековых списков. К ним добавляются древние переводы — латинский, сирийский, коптский, армянский — и цитаты из Писания у церковных писателей: по ним тоже видно, какой текст читали в их времена и в их городах.

Две рукописи никогда не совпадают слово в слово. Переписчик мог пропустить строку, потому что глаз перескочил на похожее слово; перепутать созвучные слова; «выровнять» одно Евангелие по другому; вставить на полях пояснение, которое следующий переписчик принял за часть текста. Подавляющее большинство разночтений — порядок слов, написание имён, мелкие частицы — на смысл не влияет. Но есть места, где в одних рукописях стоит целая фраза или отрывок, а в других её нет.`],

['Как из тысяч списков получается один текст',
`Учёные не голосуют и не берут просто «самую старую» рукопись. Каждое место взвешивают по двум группам доводов. Внешние: насколько древние свидетели, из каких областей, насколько тщательно переписаны. Внутренние: какое чтение лучше объясняет появление остальных. Переписчики чаще сглаживали трудное, чем усложняли гладкое, и чаще добавляли, чем сокращали, — поэтому более трудное и более краткое чтение нередко оказывается первоначальным.

Так, окончание Евангелия от Марка (16:9–20) и рассказ о женщине, взятой в прелюбодеянии (Ин 7:53–8:11), отсутствуют в древнейших рукописях; в поздних они есть, а рассказ о женщине даже кочует с места на место. Издатели берут такие отрывки в двойные скобки: текст читается, но, скорее всего, не из первоначального.`],

['«Нестле — Аланд»: история одной книги',
`Первое печатное греческое издание Нового Завета подготовил Эразм Роттердамский в 1516 году — быстро, по нескольким поздним средневековым рукописям. Этот печатный текст на века стал «принятым» (Textus Receptus), и по нему переводили многие, в том числе Синодальный перевод. Потом начали находить более древние рукописи, и в XIX веке Лахман, Тишендорф, Весткотт и Хорт стали издавать текст по их свидетельству.

В 1898 году вюртембергский богослов Эберхард Нестле сделал простую и смелую вещь: взял три лучших научных издания (Тишендорфа, Весткотта–Хорта и Уэймута; с 1901 года вместо Уэймута — Бернхарда Вейса) и там, где два совпадали против третьего, принимал чтение двух. Книга получилась дешёвой, удобной и быстро вытеснила Textus Receptus из университетов и церквей. Его сын Эрвин в 1927 году (13-е издание) добавил собственный аппарат — примечания внизу страницы, где указано, какие рукописи читают иначе.

С 1952 года к работе подключился Курт Аланд: он стал сверять чтения с самими рукописями, а не с чужими изданиями. В 1959 году он основал в Мюнстере Институт новозаветных текстологических исследований, где собраны описания и снимки рукописей со всего мира. С 25-го издания (1963) книга называется «Нестле — Аланд». Затем вышли 26-е (1979; его основной текст совпал с изданием для переводчиков от Объединённых библейских обществ, UBS), 27-е (1993) и 28-е (2012).

Это не «чья-то версия», а текст, который можно проверить: наверху страницы — выбранное чтение, внизу — перечень рукописей, которые за него и против.`],

['Что это изменило у Кассиана',
`Комиссия работала по тексту Нестле: сначала по 17-му изданию (1941), потом по 19-му (1949) — тогда имя Аланда на обложке ещё не стояло. Кассиан сознательно отказался от Textus Receptus: русский слог Синодального перевода он ценил и сохранил, но греческую основу взял другую.

Заметить это легко. В Мф 9:13 у Кассиана нет слов «к покаянию», в 1 Ин 5:7–8 нет «трёх свидетельствующих на небе — Отца, Слова и Святого Духа»: остались только три свидетеля — Дух, вода и кровь. Окончание Марка и рассказ из Ин 7:53–8:11 он не выбросил, а сохранил с пометой, что в древнейших рукописях их нет: откройте Мк 16:9, и примечание стоит прямо перед стихом.`],

['Как звучит этот перевод',
`Кассиан держится слов и порядка греческой фразы ближе, чем его предшественники, и при этом бережёт ритм привычного русского Евангелия: устаревшее «сей» чаще заменено на «этот», но, например, «мир сей» остался. Читать его — как смотреть на греческий текст сквозь прозрачное стекло: местами тяжеловато, зато видно, как построена фраза. Начало Евангелия от Иоанна — «В начале было Слово…» — звучит знакомо и при этом точно следует греческому порядку слов.

Перевод принимали не сразу и не все: одним он казался тяжеловесным, другим — слишком смелым в выборе греческого текста. Но и сегодня на нём учатся читать Новый Завет те, кому важно понять, что именно написано по-гречески.`]
]},

/* ───────────── РУССКИЙ: РБО ───────────── */
rbo:{ru:[
['Кто и когда его сделал',
`«Современный русский перевод» — перевод Российского Библейского Общества. Новый Завет в нём впервые вышел полностью в 2001 году под названием «Радостная Весть» (автор новозаветной части — В. Н. Кузнецова), а вся Библия — в 2011-м. Издатели прямо говорят, для кого он предназначен: для миссионерских, учебных и духовно-просветительских целей, то есть для тех, кто открывает Писание впервые или читает его без церковной подготовки.`],

['Принцип: передать смысл',
`Кассиан старается сохранить форму греческой фразы. РБО ставит другую задачу: сказать то же самое так, как сказал бы сегодняшний человек. Сравните начало Евангелия от Иоанна. У Кассиана: «В начале было Слово, и Слово было с Богом». В РБО: «Изначально был Тот, кто является Словом. Он был с Богом».

Греческое слово «логос», которое по-русски давно звучит как «Слово», здесь не оставлено загадкой: переводчик сразу объясняет, что речь о Личности. Выигрыш — текст понятен без подготовки. Цена — часть толкования уже встроена в сам текст, и читатель не видит привычного слова «Слово». То же в Ин 1:14: у Кассиана «Слово стало плотью и обитало среди нас», в РБО «Тот, кто является Словом, стал человеком и жил среди нас».`],

['На слух и на глаз',
`Фразы здесь короче, церковнославянские обороты заменены обычной речью, а в некоторых местах пунктуация подсказывает интонацию — например, Мф 5:3: «Блаженны нищие духом! Царство Небес – для них». У Кассиана то же место: «Блаженны нищие духом, ибо их есть Царство Небесное». Смысл тот же; различие — в голосе.`],

['Зачем он на сайте',
`Это единственный на сайте перевод, где есть и Ветхий Завет — все 39 книг. Он стоит рядом с переводом Кассиана как второй русский голос: тот, кто хочет понять, как устроена греческая фраза, останется с Кассианом; тот, кому нужен простой язык, найдёт его здесь.`]
]},

/* ───────────── ENGLISH: NASB ───────────── */
nasb:{en:[
['A line that runs back to 1611',
`The NASB belongs to one long family tree. The King James Version of 1611 was revised in Britain in 1881–85 as the Revised Version, and American scholars answered with their own edition in 1901: the American Standard Version. It was valued for faithfulness to the original, but its English was already dated.

The Lockman Foundation, a non-profit based in California, took up the task: keep what made the ASV valuable, bring its language up to date, and take account of the texts found after 1901. The translators were scholars from Christian colleges and mainly conservative evangelical churches.`],

['How it was published',
[
 ['1960','The Gospel of John.'],
 ['1962','The four Gospels.'],
 ['1963','The whole New Testament.'],
 ['1968','The Psalms.'],
 ['1971','The complete Bible.'],
 ['1977','A major revision of the text.'],
 ['1995','The NASB Updated Edition: more current English, a newer Greek text.'],
 ['2020','A further revision, using the 28th edition of the Greek text.']
]],

['What “literal” means here',
`The NASB aims at what translators call formal equivalence: keep the structure of the Greek sentence and the same word for the same Greek word wherever English allows. If a sentence is long in Greek, it stays long. Only where a literal rendering would be impossible or misleading does the NASB turn to an English idiom.

You can hear it in John 1:14: “the Word became flesh, and dwelt among us” and “the only begotten from the Father.” Pronouns that refer to God are capitalized (He, His, Your), and old family words like “brethren” remain. The result is not smooth English, but it lets you see the shape of the Greek behind it.`],

['Brackets: where the manuscripts disagree',
`The NASB does not silently decide when ancient manuscripts disagree; it marks the passage with square brackets. You will see them around Mark 16:9–20, John 7:53–8:11, Acts 8:37, and the closing words of the Lord’s Prayer in Matthew 6:13 (“For Yours is the kingdom and the power and the glory forever”). The brackets mean: this passage is old and has been read in churches for a long time, but it is not in the earliest manuscripts.`],

['The Greek text behind it: Nestle-Aland',
`Every edition of the NASB is tied to a particular edition of the Greek New Testament by Nestle and Aland. The 1971 Bible was built on the 23rd edition, the 1995 update on the 26th, and the 2020 edition on the 28th (2012).

That chain of numbers is the story of how a text is kept honest. Eberhard Nestle, a theologian from Württemberg, published the first edition in 1898 by comparing the best scholarly editions of his day. From the 1950s Kurt Aland checked its readings against the manuscripts themselves, and in 1959 founded the Institute for New Testament Textual Research in Münster, where the work continues. A new edition appears when something changes: newly published papyri, better descriptions of old manuscripts, more careful study of the variants. The 28th edition took in papyri numbered 117–127 and altered a handful of readings in the light of the Institute’s large multi-volume Editio Critica Maior. So the text of the New Testament is not frozen: it is refined, and a translation that wants to remain faithful has to be revised along with it.`],

['Who it is for',
`The NASB is a study Bible by temperament. It is best for readers who want to check a word, follow an argument of Paul through a long sentence, or compare the wording of one Gospel with another. If you want ease, other English translations will serve you better; if you want to see what the Greek says, this one is built for that.`]
]},

/* ───────────── ՀԱՅԵՐԵՆ: Նոր Արարատ ───────────── */
arar:{hy:[
['Ի՞նչ է «Նոր Արարատը»',
`«Նոր Արարատ» թարգմանությունը (լրիվ անվանումը՝ «Նոր վերանայված Արարատ Աստվածաշունչ») Հայաստանի Աստվածաշնչային ընկերության 2018 թվականի հրատարակությունն է։ Սա արևելահայերեն ամբողջական Աստվածաշունչ է. Հին Կտակարանը թարգմանված է եբրայերենից՝ 39 գիրք, Նոր Կտակարանը՝ հունարենից։ Տեքստը գրված է ավանդական ուղղագրությամբ։ Այս կայքում ցուցադրվում է Նոր Կտակարանը։`],

['Արարատյան թարգմանության պատմությունը',
`XIX դարում հայերենը երկու գրական լեզվի՝ արևելահայերենի և արևմտահայերենի բաժանվեց, իսկ հինգերորդ դարում թարգմանված գրաբար Աստվածաշունչն արդեն դժվար էր հասկանալի ժողովրդին։ Նոր Կտակարանն առաջին անգամ արևելահայերեն խոսակցական լեզվով լույս տեսավ 1835 թվականին, իսկ 1896-ին արդեն հրատարակված էր ամբողջ Աստվածաշունչը։ Այն կոչվեց «Արարատյան թարգմանություն»՝ Արարատյան բարբառի անունով, և կոչվում է նաև «Շուշիի թարգմանություն»։ Երկար տարիներ արևելահայերն Աստվածաշունչն ընթերցել են հենց այս թարգմանությամբ։`],

['Վերանայումը՝ 2000-ից 2017',
`Լեզուն փոխվում է, իսկ տասնամյակներ շարունակ տպագրվող տեքստում կուտակվում են ճշգրտման կարիք ունեցող տեղեր։ 2000-ից 2017 թվականն ընկած 17 տարիների ընթացքում Աստվածաշնչային ընկերությունը ուշադիր խմբագրեց Արարատյան թարգմանությունը, և 2018-ին այն լույս տեսավ «Նոր Արարատ» անունով՝ թարգմանված անմիջապես բնագրային լեզուներից։

Արևելահայերենի մյուս ժամանակակից թարգմանությունը՝ Էջմիածնինը, պատրաստվել է Մայր Աթոռում 1985–1991 թվականներին՝ Վազգեն Ա Կաթողիկոսի պատվերով, և առաջին անգամ հրատարակվել է 1994-ին։`],

['Հունարեն բնագիրը և Նեստլե-Ալանդը',
`Նոր Կտակարանի հեղինակների ձեռագրերը չեն պահպանվել. մեզ են հասել հազարավոր օրինակներ, որոնք մանրուքներում տարբերվում են իրարից։ Գիտնականները դրանք համադրում և յուրաքանչյուր տեղի համար ընտրում են ամենահավանական ընթերցումը։ Այդպես ստացվում է քննական հրատարակությունը, որի ամենահայտնին Նեստլե-Ալանդն է. 1898-ին այն առաջին անգամ հրատարակել է վյուրտեմբերգցի աստվածաբան Էբերհարդ Նեստլեն, 1952-ից աշխատել է Կուրտ Ալանդը, 1959-ին Մյունսթերում հիմնվել է Նոր Կտակարանի տեքստագիտական ուսումնասիրությունների ինստիտուտը, իսկ վերջին՝ 28-րդ հրատարակությունը լույս է տեսել 2012-ին։ Էջի ներքևում գտնվող ծանոթագրություններում նշվում է, թե որ ձեռագիրը ինչպես է կարդում տվյալ տեղը։

Հայերենն այս պատմության մեջ ոչ միայն ընթերցող է, այլև վկա։ Հայերեն հին թարգմանությունը (V դար) Նոր Կտակարանի ամենահին թարգմանություններից է, և քննական հրատարակությունների ծանոթագրություններում հին թարգմանությունների շարքում վկա է կանչվում նաև հայերենը։ Հայերեն ձեռագրերից հայտնի է 989 թվականի Էջմիածնի Ավետարանը, որն այժմ պահվում է Մատենադարանում. Մարկոսի Ավետարանի 16:9–20 համարների առջև նրա մեջ նշված է «Արիստոն երեց» անունը. գիտնականները այս հետքի մասին խոսում են XIX դարի վերջից։

Եթե բացեք Մարկոս 16:9–20, Հովհաննես 7:53–8:11 կամ Գործք 8:37, հայերեն տեքստում դրանք կգտնեք. քննական հրատարակություններում այս հատվածները կա՛մ փակագծերում են, կա՛մ տեղափոխված են ծանոթագրություն։ Իսկ «Հայր մեր»-ի վերջում Աստծու փառաբանությունը (Մատթ. 6:13) այս թարգմանության մեջ չկա։ Նոր Արարատի Նոր Կտակարանի հունարեն բնագիրը Աստվածաշնչային ընկերությունների միացյալ (UBS) և Գերմանական աստվածաշնչային ընկերության քննական հրատարակությունն է։ UBS-ի հինգերորդ հրատարակության տեքստը համընկնում է Նեստլե-Ալանդի 28-րդ հրատարակության հետ. տարբերությունները միայն բաժանումների, մեծատառերի և կետադրության մեջ են։`]
]},

/* ───────────── DEUTSCH: Elberfelder 1905 ───────────── */
elb:{de:[
['Ein Werk von Laien aus dem Wuppertal',
`Die Elberfelder Bibel trägt den Namen der Stadt, in der der größte Teil der Arbeit geschah: Elberfeld, heute ein Stadtteil von Wuppertal. Hinter ihr stehen Männer aus der Brüderbewegung: John Nelson Darby, ein aus Irland stammender ehemaliger anglikanischer Geistlicher, der Elberfelder Carl Brockhaus und Julius Anton von Poseck. Sie waren keine Universitätstheologen, sondern wollten, dass Gemeinden auch ohne Griechischkenntnisse genau lesen können, was dasteht. Darum ihre Leitlinie: Treue zum Grundtext geht vor sprachlicher Eleganz.`],

['Wie die Ausgabe entstand',
[
 ['1855','Das Neue Testament erscheint im Selbstverlag der Herausgeber.'],
 ['1859','Die Psalmen erscheinen als eigene Ausgabe.'],
 ['1871','Das Alte Testament folgt, zusammen mit einer dritten, durchgesehenen Ausgabe des Neuen. Erstmals liegt die ganze Bibel vor.'],
 ['1905','Die erste Ausgabe in lateinischer Schrift (die sogenannte Perlbibel); danach wird der Text von Auflage zu Auflage weiter korrigiert, bis zum Tod Rudolf Brockhaus’ 1932.'],
 ['ab 1960','Eine neue Kommission beginnt eine gründliche Revision; die revidierte Bibel erscheint 1985, eine weitere Durchsicht 2006.']
]],

['Wörtlich bis in die Fußnoten',
`Was Sie hier lesen, ist die ältere, unrevidierte Fassung. Man merkt es am Klang: „ward Fleisch“, „dieweil“, „auf daß“. Die Übersetzer wollten nichts glätten, was im Griechischen hart steht, und was sich nicht eins zu eins sagen ließ, steht in geschweiften Klammern am Rand. In Johannes 1,14 etwa heißt es „wohnte“, und die Anmerkung ergänzt: „eigentlich zeltete“. Namen erscheinen in griechischer Gestalt: Phares, Zara, Thamar. Bei Apostelgeschichte 8,37 steht statt des Verses der Hinweis, dass er nicht zum ursprünglichen Text gehört, und Markus 16,9–20 sowie Johannes 7,53–8,11 stehen in eckigen Klammern.`],

['Ein früher Bruch mit dem Textus receptus',
`Als 1855 das Neue Testament der Elberfelder erschien, galt in Kirchen und Schulen noch der Textus receptus, jener gedruckte Text, den Erasmus 1516 aus wenigen späten Handschriften zusammengestellt hatte. Die Elberfelder lösten sich früh davon: Im Lauf der Revisionen flossen die großen alten Handschriften wie Sinaiticus und Vaticanus ein. Dieser Bruch liegt 43 Jahre vor Nestles erster Ausgabe.

Eberhard Nestle, Theologe in Württemberg, veröffentlichte 1898 bei der Württembergischen Bibelanstalt in Stuttgart eine billige, handliche Ausgabe des griechischen Textes. Sein Verfahren war einfach: Er verglich drei führende Ausgaben (Tischendorf, Westcott–Hort und Weymouth, ab 1901 Bernhard Weiss statt Weymouth), und wo zwei gegen die dritte standen, folgte er den beiden. Sein Sohn Erwin gab 1927 der 13. Auflage einen eigenen Apparat; seit 1952 arbeitete Kurt Aland mit, der die Lesarten an den Handschriften selbst prüfte, und 1959 gründete er in Münster das Institut für neutestamentliche Textforschung. Die 28. Auflage erschien 2012.

Die heutigen Fassungen der Elberfelder Bibel beruhen auf dem Nestle-Aland-Text. Der Weg dorthin begann also schon in Elberfeld, lange bevor es das Wort „kritische Ausgabe“ im heutigen Sinn gab.`],

['Für wen sie gedacht ist',
`Die Elberfelder 1905 ist eine Bibel für genaue Leser: wer ein Wort nachschlagen, eine Formulierung prüfen oder den Satzbau des Griechischen im Deutschen wiedererkennen will. Wer mühelos und im heutigen Deutsch lesen möchte, ist mit einer modernen Übersetzung besser bedient.`]
]}

};

const lang=()=>{const l=document.documentElement.lang;return UI[l]?l:'ru'};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const rich=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const paras=t=>String(t).split(/\n\n+/).map(p=>`<p>${rich(p)}</p>`).join('');
const nm=(k,l)=>(NAME_L[k]&&NAME_L[k][l])||NAME[k]||k;
function body(sections){
 return sections.map(([h,c])=>`<h4>${esc(h)}</h4>`+(Array.isArray(c)
  ?`<dl class="tri-tl">${c.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${rich(b)}</dd>`).join('')}</dl>`
  :paras(c))).join('');
}

let ov=null,lastFocus=null;
function close(){if(!ov)return;ov.remove();ov=null;document.documentElement.classList.remove('tri-lock');document.removeEventListener('keydown',onKey,true);if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}}
function onKey(e){if(e.key==='Escape'){e.stopPropagation();close()}}
function open(k){
 const l=lang(),t=TR[k];if(!t)return;
 const sec=t[l]||t[Object.keys(t)[0]];if(!sec)return;
 close();lastFocus=document.activeElement;
 ov=document.createElement('div');ov.className='tri-ov';
 ov.innerHTML=`<div class="tri-box" role="dialog" aria-modal="true" aria-label="${esc(UI[l].about)}"><button class="tri-x" type="button" aria-label="${esc(UI[l].close)}">×</button><div class="tri-kicker">${esc(UI[l].about)}</div><h3>${esc(nm(k,l))}</h3>${body(sec)}</div>`;
 ov.addEventListener('click',e=>{if(e.target===ov||e.target.closest('.tri-x'))close()});
 document.body.appendChild(ov);document.documentElement.classList.add('tri-lock');document.addEventListener('keydown',onKey,true);
 const x=ov.querySelector('.tri-x');if(x)x.focus({preventScroll:true});
}
function current(){const b=document.querySelector('#brModes [data-mode].on')||document.querySelector('#brModes [data-mode]');return b?b.dataset.mode:'cass'}
/* делегирование: кнопка ⓘ пересоздаётся при перерисовке тулбара */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#brInfo');if(b){e.preventDefault();open(current())}});
const lab=()=>{const b=document.getElementById('brInfo');if(b){b.setAttribute('aria-label',UI[lang()].about);b.title=UI[lang()].about}};
new MutationObserver(lab).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});document.addEventListener('DOMContentLoaded',lab);setInterval(lab,1500);
window.TrInfo={open,close,label:()=>UI[lang()].about};
/* TODO(автор): 1) греческая основа «Нового Арарата» (UBS / Немецкое библейское общество) указана со слов автора сайта — при желании сверить с изданием;
   2) уточнить редакцию NASB на сайте (1995 или 2020) — в тексте указаны все редакции и привязка к изданиям Нестле-Аланда;
   3) при желании добавить издателя первого издания Кассиана 1970 года. */
})();
