/* «О переводе»: значок ⓘ рядом с названием перевода и модальное окно с пояснением.
   Тексты — только здесь. Языки интерфейса: ru, en, hy, de.
   Правила: ничего не выдумываем; сомнительные факты сформулированы осторожно и помечены TODO в комментариях
   (в тексты для читателя пометки не попадают). */
(()=>{
const UI={
 ru:{about:'О переводе',close:'Закрыть',general:'Как читать переводы'},
 en:{about:'About this translation',close:'Close',general:'How to read translations'},
 hy:{about:'Թարգմանության մասին',close:'Փակել',general:'Ինչպես կարդալ թարգմանությունները'},
 de:{about:'Über diese Übersetzung',close:'Schließen',general:'Wie man Übersetzungen liest'}
};
const NAME={cass:'Кассиан',rbo:'РБО',arar:'Նոր Արարատ 2018',nasb:'NASB',elb:'Elberfelder 1905'};
const NAME_L={cass:{en:'Cassian',hy:'Կասիան',de:'Kassian'},rbo:{en:'RBS (Modern Russian)',hy:'ՌԲՕ',de:'RBO (Modernes Russisch)'}};

/* Заголовки блоков внутри окна */
const H={
 ru:{who:'Кто и для кого',src:'С какого оригинала'},
 en:{who:'Who made it, and for whom',src:'Which original it comes from'},
 hy:{who:'Ով և ում համար',src:'Ո՞ր բնագրից'},
 de:{who:'Wer und für wen',src:'Aus welcher Vorlage'}
};

/* Тексты по переводам. Каждый перевод: who — кто/когда/для кого/подход, src — с какого оригинала. */
const TR={
cass:{
 ru:{who:'Перевод епископа Кассиана (Сергея Безобразова, 1892–1965), богослова и знатока Нового Завета, преподавателя Свято-Сергиевского института в Париже. Он трудился над ним много лет; книга вышла в 1970 году, уже после его смерти. Подход близкий к тексту: переводчик старался сохранить слова и мысль оригинала, а не пересказывать их свободно. Для читателя, которому важно понять, что именно сказано в греческом тексте.',
     src:'Критический греческий текст — свод, составленный учёными по множеству рукописей (подробнее ниже).'},
 en:{who:'Translated by Bishop Cassian (Sergei Bezobrazov, 1892–1965), a theologian and New Testament scholar who taught at the St Sergius Institute in Paris. He worked on it for many years; the book was published in 1970, after his death. The approach stays close to the text: the translator tried to keep the words and thought of the original rather than retell them freely. Good for a reader who wants to see what the Greek actually says.',
     src:'A critical edition of the Greek text — a text assembled by scholars from many manuscripts (more below).'},
 hy:{who:'Թարգմանել է Կասիան եպիսկոպոսը (Սերգեյ Բեզոբրազով, 1892–1965)՝ աստվածաբան և Նոր Կտակարանի գիտակ, Փարիզի Սուրբ Սերգիոսի ինստիտուտի դասախոս։ Նա երկար տարիներ աշխատել է դրա վրա, գիրքը լույս է տեսել 1970 թվականին՝ նրա մահից հետո։ Մոտեցումը բնագրին մոտ է. թարգմանիչը ձգտել է պահպանել բնագրի բառերն ու միտքը, ոչ թե ազատ վերապատմել։ Հարմար է նրան, ով ուզում է հասկանալ՝ հունարեն տեքստում ինչ է ասվում։',
     src:'Հունարեն տեքստի քննական հրատարակություն՝ գիտնականների կազմած տեքստ՝ բազմաթիվ ձեռագրերի հիման վրա (ավելի մանրամասն՝ ներքևում)։'},
 de:{who:'Übersetzt von Bischof Kassian (Sergej Bezobrazov, 1892–1965), Theologe und Kenner des Neuen Testaments, Dozent am St.-Sergius-Institut in Paris. Er arbeitete viele Jahre daran; das Buch erschien 1970, nach seinem Tod. Der Ansatz ist textnah: Der Übersetzer wollte Worte und Gedanken des Urtextes bewahren, statt sie frei nachzuerzählen. Gut für Leser, die sehen möchten, was im Griechischen tatsächlich steht.',
     src:'Eine kritische Ausgabe des griechischen Textes – von Fachleuten aus vielen Handschriften erarbeitet (mehr unten).'}
 /* TODO(автор): уточнить издание греческого текста, которым пользовался епископ Кассиан (Nestle?), и год/место первого издания. */
},
rbo:{
 ru:{who:'Современный русский перевод Российского Библейского Общества. Написан живым сегодняшним языком, чтобы Новый Завет был понятен без пояснений и без церковнославянских оборотов. Подход смысловой: переводчики стремятся передать мысль так, как это сказал бы современный человек, поэтому порой он звучит проще и свободнее, чем дословные переводы.',
     src:'Критический греческий текст (подробнее ниже). Это современный перевод с греческого, а не пересказ с другого перевода.'},
 en:{who:'The Modern Russian translation by the Russian Bible Society. It uses everyday present-day Russian, so the New Testament can be understood without explanation or Church Slavonic turns of phrase. The approach is meaning-based: the translators aim to convey the thought the way a modern speaker would say it, so it often sounds simpler and freer than word-for-word translations.',
     src:'A critical edition of the Greek text (more below). It is a modern translation from the Greek, not a retelling of another translation.'},
 hy:{who:'Ռուսաստանի Աստվածաշնչային ընկերության ժամանակակից ռուսերեն թարգմանությունը։ Գրված է այսօրվա կենդանի լեզվով, որպեսզի Նոր Կտակարանը հասկանալի լինի առանց բացատրությունների և եկեղեցասլավոնական դարձվածքների։ Մոտեցումը իմաստային է. թարգմանիչները ձգտում են միտքը փոխանցել այնպես, ինչպես կասեր ժամանակակից մարդը, ուստի այն երբեմն ավելի պարզ ու ազատ է հնչում, քան բառացի թարգմանությունները։',
     src:'Հունարեն տեքստի քննական հրատարակություն (ավելի մանրամասն՝ ներքևում)։ Սա ժամանակակից թարգմանություն է հունարենից, ոչ թե այլ թարգմանության վերապատմում։'},
 de:{who:'Die moderne russische Übersetzung der Russischen Bibelgesellschaft. Sie nutzt die heutige Alltagssprache, damit das Neue Testament ohne Erklärungen und ohne kirchenslawische Wendungen verständlich ist. Der Ansatz ist sinngemäß: Die Übersetzer geben den Gedanken so wieder, wie ein heutiger Mensch ihn sagen würde; deshalb klingt sie oft einfacher und freier als wörtliche Übersetzungen.',
     src:'Eine kritische Ausgabe des griechischen Textes (mehr unten). Es ist eine moderne Übersetzung aus dem Griechischen, keine Nacherzählung einer anderen Übersetzung.'}
 /* TODO(автор): проверить год выхода НЗ в РБО, название серии и точное греческое издание (UBS / Nestle-Aland), добавить при желании. */
},
arar:{
 ru:{who:'Современный восточноармянский перевод Нового Завета (издание 2018 года), в традиционной орфографии. Выбран на сайте как основной армянский текст из-за стремления оставаться близким к оригиналу при понятном для сегодняшнего читателя языке.',
     src:'Перевод с греческого. Какое именно греческое издание лежит в основе, нужно уточнить; в целом современные переводы опираются на критический текст (подробнее ниже).'},
 en:{who:'A modern Eastern Armenian translation of the New Testament (2018 edition), in traditional spelling. It is the main Armenian text on this site because it aims to stay close to the original while using language a present-day reader understands.',
     src:'Translated from the Greek. Which exact Greek edition lies behind it is still to be confirmed; modern translations in general rest on a critical text (more below).'},
 hy:{who:'Նոր Կտակարանի ժամանակակից արևելահայերեն թարգմանություն (2018 թ. հրատարակություն)՝ ավանդական ուղղագրությամբ։ Կայքում ընտրվել է որպես հիմնական հայերեն տեքստ՝ բնագրին մոտ մնալու ձգտման և այսօրվա ընթերցողին հասկանալի լեզվի շնորհիվ։',
     src:'Թարգմանված է հունարենից։ Թե հունարենի որ հրատարակությունն է հիմք ծառայել, դեռ պետք է ճշտել. ընդհանուր առմամբ ժամանակակից թարգմանությունները հենվում են քննական տեքստի վրա (ավելի մանրամասն՝ ներքևում)։'},
 de:{who:'Eine moderne ostarmenische Übersetzung des Neuen Testaments (Ausgabe 2018) in traditioneller Rechtschreibung. Sie ist auf dieser Seite der armenische Haupttext, weil sie nah am Urtext bleiben will und trotzdem eine heutigen Lesern verständliche Sprache nutzt.',
     src:'Aus dem Griechischen übersetzt. Welche griechische Ausgabe genau zugrunde liegt, ist noch zu klären; moderne Übersetzungen beruhen im Allgemeinen auf einem kritischen Text (mehr unten).'}
 /* TODO(автор): ОБЯЗАТЕЛЬНО заполнить: кто переводил/издавал «Նոր Արարատ 2018», на каком греческом издании основан. Пока формулировки намеренно общие. */
},
nasb:{
 ru:{who:'New American Standard Bible — английский перевод американского Фонда Локмана. Новый Завет вышел в 1963 году, вся Библия — в 1971-м; позднее текст не раз уточняли. Это один из самых буквальных английских переводов: он следует словам и порядку мыслей оригинала, даже если английская фраза от этого звучит чуть тяжелее. Для тех, кто хочет изучать текст, а не просто читать.',
     src:'Критический греческий текст в изданиях Нестле-Аланда (подробнее ниже); издание менялось вместе с обновлениями перевода.'},
 en:{who:'The New American Standard Bible, published by the Lockman Foundation in the USA. The New Testament appeared in 1963 and the whole Bible in 1971; the text has been revised several times since. It is one of the most literal English translations: it follows the words and order of thought of the original, even if the English then reads a little heavier. Suited to those who want to study the text, not just read it.',
     src:'The critical Greek text in the Nestle-Aland editions (more below); the edition used changed as the translation was updated.'},
 hy:{who:'New American Standard Bible՝ ամերիկյան Լոքմանի հիմնադրամի անգլերեն թարգմանությունը։ Նոր Կտակարանը լույս է տեսել 1963 թվականին, ամբողջ Աստվածաշունչը՝ 1971-ին. հետագայում տեքստը մի քանի անգամ ճշգրտվել է։ Սա անգլերեն ամենաբառացի թարգմանություններից մեկն է. այն հետևում է բնագրի բառերին ու մտքերի կարգին, թեկուզ անգլերեն նախադասությունն այդ պատճառով մի փոքր ծանր հնչի։ Հարմար է նրանց, ովքեր ուզում են ուսումնասիրել տեքստը, ոչ թե պարզապես կարդալ։',
     src:'Հունարեն քննական տեքստը՝ Նեստլե-Ալանդի հրատարակություններով (ավելի մանրամասն՝ ներքևում). հրատարակությունը փոխվել է թարգմանության թարմացումների հետ։'},
 de:{who:'Die New American Standard Bible, herausgegeben von der Lockman Foundation in den USA. Das Neue Testament erschien 1963, die ganze Bibel 1971; der Text wurde seither mehrfach überarbeitet. Sie gehört zu den wörtlichsten englischen Übersetzungen: Sie folgt den Worten und dem Gedankengang des Urtextes, auch wenn das Englisch dadurch etwas schwerer klingt. Geeignet für alle, die den Text studieren und nicht nur lesen wollen.',
     src:'Der kritische griechische Text in den Nestle-Aland-Ausgaben (mehr unten); die genutzte Ausgabe wechselte mit den Überarbeitungen der Übersetzung.'}
 /* TODO(автор): указать, какая именно редакция NASB (1971 / 1995 / 2020) загружена на сайте, и под неё — какое издание Нестле-Аланда. */
},
elb:{
 ru:{who:'Elberfelder Bibel в редакции 1905 года — немецкий перевод, возникший в среде протестантских христиан-«братьев» (Дарби и его круг); Новый Завет впервые вышел в 1855 году, вся Библия — в 1871-м. Это очень буквальный перевод: переводчики держались слов оригинала, порой в ущерб гладкости. Для тех, кому важна точность формулировок; язык заметно старомоден.',
     src:'Греческий текст конца XIX века — задолго до современных критических изданий Нестле-Аланда и UBS (поэтому в отдельных местах он может отличаться от них; подробнее ниже).'},
 en:{who:'The Elberfelder Bible in its 1905 revision — a German translation that arose among Protestant Christians of the "Brethren" movement (Darby and his circle); the New Testament first appeared in 1855, the whole Bible in 1871. It is a very literal translation: the translators held to the words of the original, sometimes at the cost of smoothness. For readers who value precise wording; the language sounds noticeably old-fashioned.',
     src:'A Greek text of the late 19th century — long before today’s critical editions (Nestle-Aland, UBS), so in some places it may differ from them (more below).'},
 hy:{who:'Elberfelder Bibel-ը 1905 թվականի խմբագրությամբ՝ գերմանական թարգմանություն, որ ծնվել է բողոքական «եղբայրների» քրիստոնյաների միջավայրում (Դարբին և նրա շրջանակը). Նոր Կտակարանը առաջին անգամ լույս է տեսել 1855-ին, ամբողջ Աստվածաշունչը՝ 1871-ին։ Սա շատ բառացի թարգմանություն է. թարգմանիչները հավատարիմ են մնացել բնագրի բառերին՝ երբեմն ի վնաս սահունության։ Հարմար է նրանց, ովքեր կարևորում են ձևակերպումների ճշգրտությունը. լեզուն նկատելիորեն հնաոճ է։',
     src:'XIX դարի վերջի հունարեն տեքստ՝ ժամանակակից քննական հրատարակություններից (Նեստլե-Ալանդ, UBS) շատ առաջ, ուստի առանձին տեղերում կարող է դրանցից տարբերվել (ավելի մանրամասն՝ ներքևում)։'},
 de:{who:'Die Elberfelder Bibel in der Revision von 1905 – eine deutsche Übersetzung, die im Kreis der protestantischen „Brüder“ (Darby und sein Umfeld) entstand; das Neue Testament erschien erstmals 1855, die ganze Bibel 1871. Es ist eine sehr wörtliche Übersetzung: Die Übersetzer hielten sich an die Worte des Urtextes, manchmal auf Kosten der Glätte. Für Leser, denen genaue Formulierungen wichtig sind; die Sprache klingt deutlich altertümlich.',
     src:'Ein griechischer Text des späten 19. Jahrhunderts – lange vor den heutigen kritischen Ausgaben (Nestle-Aland, UBS); an einzelnen Stellen kann er daher von ihnen abweichen (mehr unten).'}
 /* TODO(автор): проверить, на какой именно греческий текст опирается редакция 1905 (Textus Receptus / смешанный). Сейчас сказано осторожно. */
}
};

/* Общий блок: одинаковый для всех переводов */
const GEN={
 ru:[
  ['Что такое «критический текст»','Оригиналы, написанные самими авторами, не сохранились. До нас дошли тысячи рукописей — копий, сделанных вручную в разные века. Они почти совпадают, но в мелочах расходятся. Учёные сопоставляют все эти рукописи и по строгим правилам выбирают наиболее вероятное чтение каждого места. Так получается критическое издание — например, Nestle-Aland (NA) или издание Объединённых библейских обществ (UBS). Это не «чья-то версия», а результат сравнения тысяч свидетельств, с примечаниями о том, где рукописи расходятся. Другое название традиции — Textus Receptus и византийский текст: старые издания, основанные на более поздних рукописях.'],
  ['Что такое разночтения и почему переводы немного отличаются','Разночтение — место, где древние рукописи читаются по-разному (другое слово, порядок слов, иногда лишняя или недостающая фраза). Их немного, и они почти не меняют смысла. Кроме того, переводчики по-разному решают, как передать греческую фразу: ближе к словам (дословно) или ближе к мысли (по смыслу). Поэтому два хороших перевода одного стиха могут звучать по-разному. Это нормально.'],
  ['Как пользоваться сравнением переводов','Включите сравнение в меню чтения и коснитесь номера стиха: под ним откроется второй перевод. Повторное касание скроет его. Если слова разные, посмотрите, о чём они говорят вместе: расхождение часто помогает увидеть оттенки греческого текста.'],
  ['Как читать переводы','Читайте не спеша. Если место показалось непонятным, откройте другой перевод. Дословный перевод показывает, как построена фраза; смысловой помогает понять, что она значит. Хорошо читать оба.']
 ],
 en:[
  ['What a “critical text” is','The originals written by the authors themselves have not survived. What we have are thousands of manuscripts — hand-made copies from different centuries. They agree almost everywhere, but differ in small details. Scholars compare all of these manuscripts and, by strict rules, choose the most likely reading of each place. The result is a critical edition — for example Nestle-Aland (NA) or the United Bible Societies edition (UBS). It is not “somebody’s version” but the outcome of comparing thousands of witnesses, with notes showing where manuscripts differ. The other tradition is called the Textus Receptus and the Byzantine text: older editions based on later manuscripts.'],
  ['What variant readings are, and why translations differ a little','A variant reading is a place where ancient manuscripts read differently (another word, a different word order, sometimes an extra or missing phrase). There are few of them, and they rarely change the meaning. Besides that, translators decide differently how to render a Greek phrase: closer to the words (literal) or closer to the thought (meaning-based). So two good translations of one verse can sound different. That is normal.'],
  ['How to use the comparison of translations','Switch on comparison in the reading menu and tap a verse number: a second translation opens below it. Tap again to hide it. If the wording differs, look at what the two say together: the difference often helps you notice shades of the Greek.'],
  ['How to read translations','Read unhurriedly. If a passage seems unclear, open another translation. A literal translation shows how the sentence is built; a meaning-based one helps to see what it means. It is good to read both.']
 ],
 hy:[
  ['Ի՞նչ է «քննական տեքստը»','Հեղինակների գրած բնագրերը չեն պահպանվել։ Մեզ են հասել հազարավոր ձեռագրեր՝ տարբեր դարերում ձեռքով արված օրինակներ։ Դրանք գրեթե ամենուր համընկնում են, բայց մանրուքներում տարբերվում են։ Գիտնականները համադրում են այդ բոլոր ձեռագրերը և խիստ կանոններով ընտրում են յուրաքանչյուր տեղի ամենահավանական ընթերցումը։ Այսպես ստացվում է քննական հրատարակությունը՝ օրինակ՝ Նեստլե-Ալանդ (NA) կամ Աստվածաշնչային ընկերությունների միացյալ հրատարակությունը (UBS)։ Սա «ինչ-որ մեկի տարբերակը» չէ, այլ հազարավոր վկայությունների համադրման արդյունք՝ ծանոթագրություններով, թե որտեղ են ձեռագրերը տարբերվում։ Մյուս ավանդույթը կոչվում է Textus Receptus և բյուզանդական տեքստ. սրանք հին հրատարակություններ են՝ հիմնված ավելի ուշ ձեռագրերի վրա։'],
  ['Ի՞նչ են տարընթերցումները և ինչու են թարգմանություններն ինչ-որ չափով տարբերվում','Տարընթերցումը այն տեղն է, որտեղ հին ձեռագրերը տարբեր կերպ են ընթերցվում (այլ բառ, բառերի այլ դասավորություն, երբեմն ավելորդ կամ բացակայող նախադասություն)։ Դրանք քիչ են և հազվադեպ են փոխում իմաստը։ Բացի այդ, թարգմանիչները տարբեր կերպ են որոշում՝ ինչպես փոխանցել հունարեն արտահայտությունը՝ բառերին ավելի մոտ (բառացի) թե՞ մտքին ավելի մոտ (իմաստով)։ Այդ պատճառով միևնույն համարի երկու լավ թարգմանություններ կարող են տարբեր հնչել։ Սա նորմալ է։'],
  ['Ինչպես օգտվել թարգմանությունների համեմատումից','Միացրեք համեմատումը ընթերցման ընտրացանկում և հպեք համարին. նրա տակ կբացվի երկրորդ թարգմանությունը։ Կրկին հպեք՝ թաքցնելու համար։ Եթե բառերը տարբեր են, նայեք, թե երկուսը միասին ինչ են ասում. տարբերությունը հաճախ օգնում է նկատել հունարենի երանգները։'],
  ['Ինչպես կարդալ թարգմանությունները','Կարդացեք չշտապելով։ Եթե որևէ տեղ անհասկանալի թվա, բացեք մեկ այլ թարգմանություն։ Բառացի թարգմանությունը ցույց է տալիս, թե ինչպես է կառուցված նախադասությունը, իմաստայինը՝ օգնում է հասկանալ, թե ինչ է նշանակում։ Լավ է կարդալ երկուսն էլ։']
 ],
 de:[
  ['Was ein „kritischer Text“ ist','Die Originale, die die Autoren selbst schrieben, sind nicht erhalten. Wir haben Tausende Handschriften – von Hand gefertigte Abschriften aus verschiedenen Jahrhunderten. Sie stimmen fast überall überein, unterscheiden sich aber in Kleinigkeiten. Fachleute vergleichen alle diese Handschriften und wählen nach strengen Regeln die wahrscheinlichste Lesart jeder Stelle. So entsteht eine kritische Ausgabe – zum Beispiel Nestle-Aland (NA) oder die Ausgabe der Vereinigten Bibelgesellschaften (UBS). Das ist nicht „die Version von irgendwem“, sondern das Ergebnis des Vergleichs Tausender Zeugen, mit Anmerkungen, wo die Handschriften abweichen. Die andere Tradition heißt Textus Receptus und byzantinischer Text: ältere Ausgaben, die auf späteren Handschriften beruhen.'],
  ['Was Lesarten-Unterschiede sind und warum Übersetzungen leicht voneinander abweichen','Ein Lesartenunterschied ist eine Stelle, an der alte Handschriften verschieden lauten (ein anderes Wort, eine andere Wortstellung, manchmal ein zusätzlicher oder fehlender Satz). Es gibt nur wenige, und sie ändern selten den Sinn. Außerdem entscheiden Übersetzer verschieden, wie sie einen griechischen Satz wiedergeben: näher am Wort (wörtlich) oder näher am Gedanken (sinngemäß). Daher können zwei gute Übersetzungen desselben Verses unterschiedlich klingen. Das ist normal.'],
  ['Wie man den Übersetzungsvergleich nutzt','Schalten Sie den Vergleich im Lesemenü ein und tippen Sie auf eine Verszahl: Darunter öffnet sich eine zweite Übersetzung. Nochmaliges Tippen blendet sie aus. Wenn die Wortwahl abweicht, achten Sie darauf, was beide zusammen sagen: Der Unterschied hilft oft, Nuancen des Griechischen zu erkennen.'],
  ['Wie man Übersetzungen liest','Lesen Sie ohne Eile. Wirkt eine Stelle unklar, öffnen Sie eine andere Übersetzung. Eine wörtliche Übersetzung zeigt, wie der Satz gebaut ist; eine sinngemäße hilft zu sehen, was er bedeutet. Es ist gut, beide zu lesen.']
 ]
};

const lang=()=>{const l=document.documentElement.lang;return UI[l]?l:'ru'};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const nm=(k,l)=>(NAME_L[k]&&NAME_L[k][l])||NAME[k]||k;

let ov=null,lastFocus=null;
function close(){if(!ov)return;ov.remove();ov=null;document.documentElement.classList.remove('tri-lock');document.removeEventListener('keydown',onKey,true);if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}}
function onKey(e){if(e.key==='Escape'){e.stopPropagation();close()}}
function open(k){
 const l=lang(),d=(TR[k]||{})[l];if(!d)return;close();lastFocus=document.activeElement;
 const g=GEN[l].map(([t,p])=>`<h4>${esc(t)}</h4><p>${esc(p)}</p>`).join('');
 ov=document.createElement('div');ov.className='tri-ov';
 ov.innerHTML=`<div class="tri-box" role="dialog" aria-modal="true" aria-label="${esc(UI[l].about)}"><button class="tri-x" type="button" aria-label="${esc(UI[l].close)}">×</button><div class="tri-kicker">${esc(UI[l].about)}</div><h3>${esc(nm(k,l))}</h3><h4>${esc(H[l].who)}</h4><p>${esc(d.who)}</p><h4>${esc(H[l].src)}</h4><p>${esc(d.src)}</p><div class="tri-gen"><h3 class="tri-gh">${esc(UI[l].general)}</h3>${g}</div></div>`;
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
})();
