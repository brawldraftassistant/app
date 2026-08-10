import Stripe from "stripe";

const PRICE_ID = "price_1U1lu2AT72E52z06zfj0uoW9";
const SITE_URL = "https://brawldraftassistant.github.io/app/";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

/* ============================================================================
   РУШІЙ РЕКОМЕНДАЦІЙ — перенесено з index.html (раніше рахувалось у браузері,
   тому будь-хто міг прочитати весь код сторінки й порахувати точну відповідь
   самому, без підписки). Тепер уся база бійців і формули підрахунку — тут,
   і клієнт отримує точну відповідь ЛИШЕ якщо сервер підтвердив активний код.
   ============================================================================ */
"use strict";
/* ============ ДАНІ (без змін, скопійовано 1:1 з клієнта) ============ */
const B = [
// S-TIER — rank 1 = найсильніший у своїй ролі
{n:"Surge",     t:"S", rr:1, roles:["antitank"],            maps:["closed","mid"],        beats:["tank","assassin"],                     losesTo:["control"],            ban:3, anyRange:true, note:"практично немає прямої контри; фіксований урон на будь-якій дистанції, не burst", buffie:true, tri:"dps"},
{n:"Brock",     t:"S", rr:2, roles:["control"],             maps:["mid","open"],          beats:["assassin","control"],       losesTo:["tank"],               ban:3, note:"на закритих ситуативний — пікається, але рідко", buffie:true, tri:"lowhp"},
{n:"Max",       t:"S", rr:1, roles:["support","control"],   maps:["mid","open"],          beats:["thrower","assassin"],                  losesTo:["control"],            weakAs:"control", ban:2.5,badModes:["Heist"], note:"найсильніший саппорт; висока швидкість дозволяє тікати від вбивць — контрить їх; у Heist не грається", buffie:true, tri:"lowhp"},
{n:"8-Bit",     t:"S", rr:2, roles:["control","antitank","gemcarry"],  maps:["open","mid"],          beats:["assassin","tank"],          losesTo:["thrower"], softLosesTo:["antitank"], ban:2.5,note:"повільний, тому антитанки трохи його контрять; головна контра — метатель — а того видно лише на ласт піку", buffie:true, tri:"dps"},
{n:"Meg",       t:"S", rr:2, roles:["control","tank"],      maps:["mid"],                 beats:[],                            losesTo:["antitank","thrower"], ban:2, buffie:true, tri:"highhp"},
{n:"Starr Nova",t:"S", rr:2, roles:["assassin"],  maps:["mid","closed"],        beats:["thrower","control"],                   losesTo:["tank","antitank"],    ban:3, note:"свіжі нерфи — перевірити актуальність", tri:"highhp"},
{n:"Bolt",      t:"S", rr:2, roles:["tank","assassin"],     maps:["mid","open"],          beats:["thrower","control"],        losesTo:["tank","antitank"],    ban:2.5, tri:"highhp"},
{n:"Damian",    t:"S", rr:2, roles:["tank"],     maps:["mid","closed"],        beats:["thrower","control"],        losesTo:["tank","antitank"],    ban:3, note:"ламає рольову логіку голою силою", tri:"highhp"},
{n:"Mortis",    t:"S", rr:2, roles:["assassin"],            maps:["mid","closed"],        beats:["thrower","control","assassin"],        losesTo:["tank","antitank"],    ban:3, note:"скіловий — сильний лише при хорошому виконанні", buffie:true, tri:"highhp"},
{n:"Edgar",     t:"S", rr:2, roles:["assassin"],            maps:["mid","closed"],        beats:["thrower","control"],                   losesTo:["tank","antitank"],    ban:3, buffie:true, tri:"highhp"},
{n:"Crow",      t:"S", rr:2, roles:["antitank","control"],  maps:["mid","closed"],        beats:["tank","assassin"],          losesTo:["sniper","control"],   ban:3, anyRange:true, note:"урон слабкий здалеку, але нормальний зблизька; не burst через малий HP — отрута блокує самолікування танка", buffie:true, tri:"dps"},
{n:"Leon",      t:"S", rr:2, roles:["assassin"],            maps:["mid","closed"],        beats:["control","thrower"],                   losesTo:["tank","antitank"],    ban:2.5, buffie:true, tri:"highhp"},
{n:"Colette",   t:"S", rr:2, roles:["dmg","antitank"],      maps:["open","mid"],          beats:["tank"],                                losesTo:["assassin","control"], weakAs:"antitank", ban:2, heist:true, noAntiAssassin:true, note:"урон у % від HP — не контрить вбивць, попри роль антитанка", buffie:true, tri:"dps"},
{n:"Lumi",      t:"S", rr:2, roles:["antitank","control"],  maps:["mid","closed"],        beats:["tank"],                     losesTo:["control","thrower"], softLosesTo:["assassin"],  ban:2, anyRange:true, note:"великий урон, що не падає з дистанцією", tri:"dps"},
{n:"Nori",      t:"S", rr:2, roles:["assassin"],            maps:["mid","open","closed"], beats:["control","thrower","assassin"],        losesTo:["tank","antitank"],    ban:2.5, tri:"dps"},
// A-TIER
{n:"Kenji",     t:"A", rr:4, roles:["assassin"],            maps:["mid","closed"],        beats:["control","thrower"],                   losesTo:["tank","antitank"],    ban:2, tri:"highhp"},
{n:"Kaze",      t:"A", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["control","thrower"],                   losesTo:["tank","antitank"],    ban:1, note:"скіловий — при хорошій грі рівень 1-3", tri:"highhp"},
{n:"Angelo",    t:"A", rr:2, roles:["sniper"],              maps:["open","mid"],          beats:[],                                      losesTo:["tank"],               walksOnWater:true, ban:1.5,note:"є ескейп-гаджет — важче законтрити за інших снайперів", tri:"lowhp"},
{n:"Byron",     t:"A", rr:2, roles:["support"],             maps:["mid","open"],          beats:[],                            losesTo:["assassin","tank"],    ban:2, tri:"lowhp"},
{n:"Meeple",    t:"A", rr:2, roles:["control"],             maps:["closed","mid"],        beats:["antitank","assassin","thrower"],       losesTo:["assassin"],           ban:1.5,note:"ульта стріляє крізь стіни", tri:"lowhp"},
{n:"Colt",      t:"A", rr:4, roles:["dmg","control"],       maps:["open","mid"],          beats:["tank"],                                losesTo:["assassin"],           weakAs:"control", ban:1, buffie:true, tri:"dps"},
{n:"Shade",     t:"A", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["tank","antitank"],    walksOnWater:true, ban:1.5,note:"банять саме на закритих картах, де він сильний", tri:"highhp"},
{n:"Penny",     t:"A", rr:4, roles:["control"],             maps:["mid","open"],          beats:[],                                      losesTo:["tank"],               ban:1, heist:true, note:"ситуативна — проти скупчень, сильна в Heist", tri:"lowhp"},
{n:"Stu",       t:"A", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["tank","antitank"],    ban:1, tri:"highhp"},
{n:"Gene",      t:"A", rr:4, roles:["control","support"],   maps:["mid"],                 beats:[],                                      losesTo:["tank","assassin"],    ban:1, note:"ульта витягує ціль — може перевернути гру", tri:"lowhp"},
{n:"Mina",      t:"A", rr:4, roles:["assassin"],            maps:["closed","mid"], beats:["thrower","control"],                   losesTo:["tank"],               ban:1.5,note:"скіловий персонаж", tri:"highhp"},
{n:"Sirius",    t:"A", rr:2, roles:["thrower","antitank"],             maps:["closed","mid"],        beats:["assassin","tank","antitank","control"],          losesTo:["control"],            burst:true, ban:1.5,note:"клонує ворогів — може скопіювати жирного танка", tri:"dps"},
{n:"Grey",      t:"A", rr:2, roles:["support"],             maps:["closed","mid","open"], beats:["thrower"],                             losesTo:["tank","assassin"],    ban:1, goodModes:["Knockout","Bounty","Gem Grab"], badModes:["Heist"], note:"у Heist тільки з гіперзарядом — два портали дають швидкий вихід до сейфу", tri:"lowhp"},
{n:"Nita",      t:"A", rr:2, roles:["antitank"],            maps:["closed","mid"],        beats:["tank","assassin"],                     losesTo:["control","antitank"], ban:1.5, anyRange:true, note:"сильна через ведмедя й урон, що не падає з дистанцією", buffie:true, tri:"dps"},
{n:"Raffs",     t:"A", rr:2, roles:["support"],             maps:["mid","closed"],        beats:[],                                      losesTo:["assassin"],           ban:1, tri:"lowhp"},
{n:"Charlie",   t:"A", rr:4, roles:["control"],             maps:["mid","open"],          beats:[],                            losesTo:["tank","assassin"],    ban:1, tri:"dps"},
{n:"Griff",     t:"S", rr:2, roles:["antitank","dmg"],            maps:["closed","mid"],        beats:["tank","assassin"],                     losesTo:["control","thrower"],  burst:true, ban:2, buffie:true, note:"зараз у топі мети — потужний burst упритул; бафер приємний бонус, але й сам сильний", tri:"dps"},
{n:"Kit",       t:"A", rr:2, roles:["support","assassin"],  maps:["closed","mid"],        beats:["control","thrower"],                   losesTo:["antitank","tank"],    weakAs:"assassin", ban:1.5,note:"здебільшого саппорт; як вбивця — тільки на закритих. Дає працювати сетапу Darryl+Kit", tri:"highhp"},
{n:"Nadia",     t:"A", rr:2, roles:["sniper"],    maps:["mid","open"],          beats:[],                            losesTo:["assassin"],           ban:2, tri:"lowhp"},
{n:"Otis",      t:"A", rr:4, roles:["antitank","dmg"],            maps:["mid","closed"],        beats:["tank","assassin"],                     losesTo:["control"], weakAs:"antitank", ban:1.5, note:"фіксований урон на дистанції, не burst", tri:"dps"},
{n:"Pierce",    t:"A", rr:2, roles:["sniper","antitank"],   maps:["mid","open"],          beats:["tank"],                     losesTo:["assassin"],           ban:2, tri:"dps"},
{n:"Chester",   t:"A", rr:4, roles:["antitank","dmg"],            maps:["mid","closed"],        beats:["tank"],                                losesTo:["control"],            burst:true, ban:2, tri:"dps"},
{n:"Cordelius", t:"A", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["tank"],               ban:1.5, tri:"dps"},
{n:"Piper",     t:"A", rr:4, roles:["sniper"],              maps:["open"],                beats:[],                                      losesTo:["assassin"],           ban:1.5, tri:"lowhp"},
{n:"Lou",       t:"S", rr:2, roles:["antitank","control"],  maps:["mid","open"],          beats:["tank","assassin"],                     losesTo:["assassin"],           ban:2, goodModes:["Hot Zone"], note:"після баф зараз топовий; особливо сильний у Hot Zone на відкритих картах", tri:"dps"},
{n:"Spike",     t:"A", rr:4, roles:["antitank","control","dmg"],  maps:["mid","closed"],        beats:["tank","assassin"],                     losesTo:["control"],            burst:true, ban:1, buffie:true, tri:"dps"},
{n:"Carl",      t:"A", rr:4, roles:["control"],             maps:["mid","open"],          beats:[],                                      losesTo:["antitank"],           ban:1, tri:"highhp"},
// B-TIER (4 зірки) — продиктовано
{n:"Alli",      t:"B", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["antitank","tank"],    walksOnWater:true, ban:1, note:"чим більше кущів на карті, тим сильніша; контрять також бійці з великим burst-уроном (Shelly, Griff)", tri:"highhp"},
{n:"Belle",     t:"B", rr:4, roles:["sniper"],              maps:["open"],                beats:[],                                      losesTo:["assassin"],           ban:1, note:"снайпер під Knockout/Bounty; вбивці контрять, але на відкриті карти їх не беруть", tri:"lowhp"},
{n:"Gus",       t:"B", rr:4, roles:["support"],             maps:["mid","open"],          beats:["assassin"],                            losesTo:[],                     ban:1, note:"ульта відштовхує — непоганий пік саме проти вбивць", tri:"lowhp"},
{n:"Moe",       t:"B", rr:4, roles:["antitank","control"],  maps:["closed","mid"],        beats:["tank","thrower"],                      losesTo:["control"],            burst:true, ban:1, note:"можливо контрить і вбивць — не підтверджено", tri:"dps"},
{n:"Fang",      t:"B", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["control","thrower"],                   losesTo:["tank","antitank"],    ban:1, note:"іноді грає й на відкритих через ульту; метателів контрить гірше за інших вбивць; непоганий проти скупчених піків у Hot Zone, але є кращі варіанти", tri:"highhp"},
{n:"Nani",      t:"B", rr:4, roles:["sniper","antitank"],              maps:["mid","open"],          beats:["assassin","sniper","tank"],            losesTo:[],                     ban:1, burst:true, note:"дуже велика дальність — перестрілює інших снайперів; burst-урон зблизька — найбільший урон у неї саме впритул, попри мало HP; але часто гірша за Pierce чи Nadia", tri:"lowhp"},
{n:"Lily",      t:"B", rr:4, roles:["assassin"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["antitank","tank"],    ban:1, tri:"highhp"},
{n:"Tara",      t:"B", rr:4, roles:["control"],             maps:["open","mid"],          beats:[],                            losesTo:["assassin"],           ban:1, tri:"dps"},
{n:"Bibi",      t:"B", rr:4, roles:["assassin","tank"],     maps:["closed"],              beats:["thrower","control"],                   losesTo:["antitank"],           ban:1.5, buffie:true, tri:"highhp"},
{n:"Poco",      t:"B", rr:4, roles:["support"],             maps:["closed","mid"],        beats:[],                                      losesTo:["assassin","tank"],    ban:1, note:"пікається зазвичай у парі з танком або двома танками", tri:"lowhp"},
{n:"Ash",       t:"B", rr:4, roles:["tank","antitank"],     maps:["closed"],              beats:["tank"],                     losesTo:["antitank"],           burst:true, ban:1, tri:"highhp"},
{n:"Lola",      t:"B", rr:7, roles:["control","antitank"],  maps:["mid","open"],          beats:["tank"],                                losesTo:["assassin"],           weakAs:"control", ban:1, note:"як антитанк працює тільки на відкритих і середніх картах", tri:"dps"},
{n:"Mandy",     t:"B", rr:7, roles:["sniper"],              maps:["open","mid"],          beats:["sniper"],                              losesTo:["assassin"],           ban:1, note:"велика дальність перестрілює снайперів, але є кращі піки", tri:"lowhp"},
{n:"Emz",       t:"B", rr:4, roles:["control","antitank"],  maps:["closed","mid"],        beats:["tank","assassin"], softLosesTo:["assassin"], weakAs:"antitank", burst:true, ban:2, buffie:true, note:"вбивцям законтрити її важче, ніж інших контролерів", tri:"dps"},
{n:"Finx",      t:"B", rr:4, roles:["control","antitank"],  maps:["mid"],                 beats:["tank"], softLosesTo:["assassin"],       weakAs:"control", ban:1, goodModes:["Hot Zone"], note:"він же Сфінкс; вбивцям законтрити важче — у нього більше урону", tri:"dps"},
{n:"Bea",       t:"B", rr:4, roles:["sniper","antitank"],   maps:["mid","open","closed"], beats:["tank","assassin"], softLosesTo:["assassin"], weakAs:"antitank", ban:1, note:"скіловий персонаж, рідко пікається; контрять тільки вбивці й тільки при розумній грі", tri:"lowhp"},
{n:"Amber",     t:"B", rr:7, roles:["control"],             maps:["open","mid"],          beats:["tank"],                     losesTo:["assassin"],           ban:1, note:"танків контрить тільки на відкритих картах — безкінечне полум'я не дає підійти", tri:"lowhp"},
{n:"Bo",        t:"B", rr:7, roles:["control"],             maps:["mid","open"],          beats:["tank"],                     losesTo:["assassin"],           ban:1, buffie:true, goodModes:["Hot Zone"], note:"по урону проти танків нормально, але від ульти легко ухилитись", tri:"lowhp"},
{n:"Rico",      t:"B", rr:4, roles:["antitank","control"],  maps:["closed","mid"],        beats:["tank"], softLosesTo:["assassin"],       ban:2, anyRange:true, buffie:true, note:"постріли рикошетять від стін — сильний на закритих картах; вбивць теж контрить, але вже не так легко — і вони ж його головна контра", tri:"lowhp"},
// C-TIER (3 зірки) — продиктовано
{n:"Willow",    t:"C", rr:7, roles:["thrower","antitank"],  maps:["closed"],              beats:["tank","assassin","antitank","control"],                     softLosesTo:["assassin"],       weakAs:"antitank", ban:1, earlyOk:true, goodModes:["Brawl Ball"], note:"ситуативна, тільки закриті карти — але там грає добре; можна пікати й не останнім піком, найкраще в Brawl Ball на закритих", tri:"lowhp"},
{n:"Darryl",    t:"C", rr:7, roles:["assassin","tank"],     maps:["closed","mid"],        beats:["control","thrower"],                   losesTo:["antitank"],           weakAs:"tank", ban:1, goodModes:["Knockout"], note:"грається переважно в Knockout і в парі з хілером; контрять потужні антитанки з burst-уроном", tri:"highhp"},
{n:"Janet",     t:"C", rr:7, roles:["gemcarry","sniper"],   maps:["mid","open"],          beats:[],                            losesTo:["tank"], softLosesTo:["assassin"], weakAs:"control", ban:1, goodModes:["Gem Grab"], note:"контрить тих, у кого малий радіус атаки; вбивцям складніше через ескейп-гаджет", tri:"lowhp"},
{n:"Trunk",     t:"C", rr:7, roles:["tank"],                maps:["closed"],              beats:["tank"],                     losesTo:["antitank"],           ban:1, tri:"highhp"},
{n:"Sandy",     t:"C", rr:7, roles:["control"],             maps:["closed","mid"],        beats:["assassin"],                 losesTo:["tank","assassin"],    ban:1, goodModes:["Gem Grab","Brawl Ball"], note:"вбивць непогано контрить гаджетом", tri:"lowhp"},
{n:"Shelly",    t:"C", rr:7, roles:["antitank","dmg"],            maps:["closed","mid"],        beats:["tank","assassin"],                     losesTo:["control","antitank"], burst:true, ban:1, note:"переважно закриті карти; сплеш і дуже великий burst-урон зблизька", buffie:true, tri:"dps"},
{n:"Draco",     t:"C", rr:7, roles:["tank"],                maps:["closed","mid"],        beats:["control"],                  losesTo:["antitank"],           ban:1, tri:"highhp"},
{n:"Frank",     t:"C", rr:7, roles:["tank"],                maps:["closed","mid"],        beats:["control"],                  losesTo:["antitank"],           ban:1, note:"найбільше здоров'я в грі", buffie:true, tri:"highhp"},
{n:"Melodie",   t:"C", rr:4, roles:["dmg","assassin"],      maps:["open","mid"],          beats:["thrower","control"],                   losesTo:["antitank","tank"],    weakAs:"assassin", ban:1, heist:true, note:"як дамагер ранг 3-6, як вбивця 9-12 — вбивцею її майже ніколи не беруть; іноді в Brawl Ball, якщо скіловий", tri:"highhp"},
{n:"Pearl",     t:"C", rr:7, roles:["control"],             maps:["mid","open"],          beats:["assassin"],                            losesTo:["antitank"], softLosesTo:["tank"], ban:1, note:"вбивць контрить ультою; переважно середні карти", tri:"dps"},
{n:"Larry & Lawrie",t:"C",rr:7,roles:["thrower"],           maps:["closed","mid"],        beats:["control","antitank"],                  losesTo:["assassin"],           ban:1, tri:"lowhp"},
{n:"Gale",      t:"C", rr:7, roles:["control","antitank"],  maps:["mid","open"],          beats:["assassin","tank"],                     softLosesTo:["assassin"], losesTo:["sniper"], weakAs:"antitank", ban:1, note:"переважно середні карти; вбивцям законтрити його трохи важко, снайпери — лише на відкритих", tri:"dps"},
{n:"Barley",    t:"C", rr:7, roles:["thrower"],             maps:["closed","mid"],        beats:["control","antitank"],                  losesTo:["assassin"],           ban:1, tri:"lowhp"},
{n:"R-T",       t:"C", rr:7, roles:["sniper","control"],    maps:["open","mid"],          beats:["assassin"],                            losesTo:["control"],            walksOnWaterPartial:true, ban:1, note:"контрить усіх, кому треба підійти впритул; пікається на відкриті й середні карти", tri:"dps"},
{n:"Clancy",    t:"A", rr:7, roles:["antitank"],            maps:["closed","mid"],        beats:["tank","assassin"],                     losesTo:["control"],            burst:true, ban:1.5, note:"зараз сильніший, ніж раніше; жорстко контрить і танків, і вбивць — небезпечний проти Damian/Edgar-подібних складів", tri:"dps"},
{n:"Buster",    t:"C", rr:7, roles:["tank"],                maps:["closed","mid"],        beats:["control"],                  losesTo:["antitank"],           ban:1, note:"пікається переважно із саппортом", tri:"highhp"},
{n:"Juju",      t:"C", rr:7, roles:["thrower"],             maps:["closed","mid"],        beats:["control","antitank"],                  losesTo:["assassin"],           walksOnWater:true, ban:1, goodModes:["Knockout"], note:"грається переважно в Knockout на кущові карти", tri:"lowhp"},
// D-TIER (2 зірки) — продиктовано
{n:"Sprout",    t:"D", rr:4, roles:["thrower"],             maps:["closed","mid"],        beats:["antitank","control"],                  losesTo:["assassin"], weakAs:"thrower", ban:1, tri:"lowhp"},
{n:"Eve",       t:"D", rr:7, roles:["sniper"],              maps:["mid","open"],          beats:[],                                      losesTo:["assassin"], weakAs:"sniper", walksOnWater:true, ban:1, note:"формально контроль, але грає й пікається як снайпер, на тих самих картах", tri:"lowhp"},
{n:"Hank",      t:"D", rr:7, roles:["tank","control"],      maps:["closed"],              beats:["thrower"],                  losesTo:["antitank"], weakAs:"tank", ban:1, tri:"highhp"},
{n:"Doug",      t:"D", rr:7, roles:["tank"],                maps:["closed"],              beats:["control"],                  losesTo:["antitank"], weakAs:"tank", ban:1, note:"грається переважно як саппорт; контролерів контрить тільки на закритих; настільки низько в меті, що майже не гається", tri:"highhp"},
{n:"Berry",     t:"D", rr:7, roles:["thrower","support"],   maps:["closed","mid"],        beats:["antitank","control"],                  losesTo:["assassin"], weakAs:"thrower", ban:1, note:"грається переважно як саппорт", tri:"lowhp"},
{n:"Maisie",    t:"D", rr:4, roles:["antitank"],            maps:["mid","closed"],        beats:["tank","assassin"],                     losesTo:["control"], weakAs:"antitank", ban:1, tri:"dps"},
{n:"Mico",      t:"D", rr:7, roles:["assassin","dmg"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["tank"], weakAs:"assassin", ban:1, goodModes:["Heist"], note:"боїться burst-урону зблизька (Shelly, Griff і подібні); береться переважно в Heist", tri:"highhp"},
{n:"Dynamike",  t:"D", rr:7, roles:["thrower"],             maps:["closed","mid"],        beats:["antitank","control"],                  losesTo:["assassin"], weakAs:"thrower", ban:1, note:"не на кущових картах", tri:"lowhp"},
{n:"Glowy",     t:"D", rr:7, roles:["support"],             maps:["open","mid"],          beats:[],                                      losesTo:["assassin"], weakAs:"control", ban:1, tri:"lowhp"},
{n:"Ollie",     t:"D", rr:7, roles:["tank"],                maps:["closed","mid"],        beats:["control","thrower"],        losesTo:["antitank"], weakAs:"tank", ban:1, note:"стрибає через стіни, тому небезпечний і для метателів", tri:"highhp"},
{n:"Squeak",    t:"D", rr:7, roles:["control"],             maps:["mid","open"],          beats:["antitank"],                            losesTo:["assassin","tank"], weakAs:"control", ban:1, note:"танки контрять його лише на закритих і середніх картах", tri:"lowhp"},
{n:"Ziggy",     t:"D", rr:7, roles:["thrower"],             maps:["closed","mid"],        beats:["antitank","control"],                  losesTo:["assassin"], weakAs:"thrower", ban:1, tri:"lowhp"},
{n:"Buzz",      t:"D", rr:7, roles:["tank","assassin"],     maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["antitank"], weakAs:"tank", ban:1, tri:"highhp"},
// B-TIER, дописані пізніше
{n:"Jae-Yong",  t:"B", rr:4, roles:["support"],             maps:["mid","open"],          beats:[],                                      losesTo:["assassin","tank"], weakAs:"control", ban:1, tri:"lowhp"},
{n:"Bull",      t:"B", rr:4, roles:["tank","dmg","antitank"],                maps:["closed","mid"],        beats:["control","thrower","tank"],            losesTo:["antitank"], weakAs:"tank", burst:true, ban:1, tri:"highhp"},
// F-TIER — продиктовано
{n:"Jessie",    t:"F", rr:7, roles:["control"],             maps:["mid","open"],          beats:["antitank"],                            losesTo:["assassin"], weakAs:"control", ban:1, tri:"lowhp"},
{n:"El Primo",  t:"F", rr:7, roles:["tank"],                maps:["closed"],              beats:["control"],                  losesTo:["antitank"], weakAs:"tank", ban:1, tri:"highhp"},
{n:"Sam",       t:"F", rr:7, roles:["tank"],                maps:["closed","mid"],        beats:["control"],                  losesTo:["antitank"], weakAs:"tank", ban:1, tri:"highhp"},
{n:"Grom",      t:"F", rr:7, roles:["thrower"],             maps:["closed","mid"],        beats:["antitank","control"],                  losesTo:["assassin"], weakAs:"thrower", ban:1, tri:"lowhp"},
{n:"Chuck",     t:"F", rr:7, roles:["dmg"],                 maps:["open","mid"],          beats:[],                                      losesTo:["antitank"], weakAs:"tank", ban:1, goodModes:["Heist"], note:"грається майже тільки в Heist заради урону по сейфу; там і ймовірність бану помітно вища", tri:"highhp"},
{n:"Mr. P",     t:"F", rr:7, roles:["control"],             maps:["closed","mid"],        beats:["antitank"],                            losesTo:["assassin","tank"], weakAs:"control", ban:1, note:"контрить лише ближніх антитанків — до дальніх не дістає; танки контрять його, крім відкритих карт", tri:"lowhp"},
{n:"Jacky",     t:"F", rr:7, roles:["tank"],                maps:["closed"],              beats:["thrower","control"],        losesTo:["antitank","thrower"], weakAs:"tank", ban:1, tri:"highhp"},
{n:"Rosa",      t:"F", rr:7, roles:["tank"],                maps:["closed","mid"],        beats:["control"],                  losesTo:["antitank","thrower"], weakAs:"tank", ban:1, note:"сильніша на кущових картах; метателі контрять її саме на закритих", tri:"highhp"},
{n:"Gigi",      t:"F", rr:7, roles:["assassin"],            maps:["closed","mid"],        beats:["thrower","control"],                   losesTo:["antitank"], weakAs:"assassin", ban:1, tri:"highhp"},
{n:"Pam",       t:"F", rr:4, roles:["support","gemcarry"],             maps:["mid"],                 beats:[],                                      losesTo:["tank"], weakAs:"tank", ban:1, goodModes:["Gem Grab","Hot Zone"], note:"у Gem Grab грає як gem carry", tri:"highhp"},
{n:"Tick",      t:"F", rr:7, roles:["thrower"],             maps:["closed","mid"],        beats:["antitank","control"],                  losesTo:["assassin"], weakAs:"thrower", ban:1, tri:"lowhp"},
{n:"Bonnie",    t:"F", rr:7, roles:["sniper"],              maps:["mid","open"],          beats:[],                                      losesTo:["antitank"], weakAs:"tank", ban:1, tri:"highhp"},
];

/* Винятки: конкретний бравлер проти конкретного. Перебивають рольову логіку.
   m — множник до рольової контри:  1.5 сильніша за звичайну · 1 звичайна · 0.4 послаблена
   0 вимкнена · від'ємне — насправді програє. Додавай сюди все ситуативне. */
const PAIR = [
 ["Meeple","Mortis", 1.5, "гаджет на стан вимикає Мортіса"],
 ["Mortis","Meeple",-0.8, "Міпл станить гаджетом — рольова контра не працює"],
 ["Mortis","Brock",  0.4, "у Брока є ескейп-гаджет — контра слабша, але лишається"],
 ["Brock","Max",     0,   "Макс надто швидка — легко ухиляється від повільних ракет"],
];
const pairOf=(a,b)=>PAIR.find(p=>p[0]===a&&p[1]===b);

// Трикутник контр: High DPS б'є High HP, High HP б'є Low HP (Squishy), Squishy б'є High DPS.
// Спрацьовує тільки якщо рольова логіка (hits/beats/losesTo) вже не дала відповіді на цю пару —
// щоб не задвоювати бонус там, де роль і так усе каже (напр. burst проти tank вже враховано роллю).
// Ці бійці ламають стіни — метальники за ними ховаються, тому проти wallbreaker'а
// метальник практично не грається, незалежно від того, яким піком його берeш.
const WALLBREAKERS = ["Shelly","Bull","El Primo","Brock","Frank","Piper","Bo","Gene","Nani","Pearl","Griff","Colt","Stu","Grey","Moe"];

const TRI_NEXT = {dps:"highhp", highhp:"lowhp", lowhp:"dps"};
const TRI_EXCEPT_HIGHHP = ["Nani","Rico","Willow"]; // low HP, але HP-перевага їх не контрить
const MAPS = {
 "Brawl Ball":[
   ["Center Stage","closed",{bushy:true,poolFirst:["Surge","Starr Nova","Griff","Max","Damian","8-Bit"],poolLast:["Shade","Bolt","Bull","Edgar","Buzz","Mortis"]}],
   ["Pinball Dreams","mid",{poolFirst:["Surge","Starr Nova","Griff","Max","Damian","8-Bit"],poolLast:["Shade","Bolt","Bull","Edgar","Buzz","Mortis"]}],
   ["Sneaky Fields","closed",{bushy:true,poolFirst:["Surge","Starr Nova","Griff","Max","Damian","Crow"],poolLast:["Shade","Bolt","Bull","Edgar","Buzz","Mortis","Alli"]}],
   ["Triple Dribble","closed",{poolFirst:["Surge","Starr Nova","Griff","Max","Damian","8-Bit"],poolLast:["Shade","Bolt","Bull","Edgar","Buzz","Mortis"]}],
 ],
 "Gem Grab"  :[
   ["Crystal Arcade","mid",{bushy:true,poolFirst:["8-Bit","Surge","Starr Nova","Damian","Griff","Gus"],poolLast:["Mortis","Edgar","Shade","Lily","Buzz","Ash"]}],
   ["Double Swoosh","closed",{bushy:true,poolFirst:["8-Bit","Surge","Starr Nova","Damian","Griff","Meg"],poolLast:["Mortis","Edgar","Shade","Lily","Buzz","Ash","Bolt"]}],
   ["Hard Rock Mine","mid",{bushy:true,poolFirst:["8-Bit","Surge","Starr Nova","Damian","Gene","Rico"],poolLast:["Mortis","Edgar","Shade","Lily","Buzz","Ash","Bolt"]}],
   ["Deathcap Trap","mid",{poolFirst:["8-Bit","Surge","Starr Nova","Damian","Gene","Brock"],poolLast:["Mortis","Edgar","Shade","Lily","Buzz","Ash","Bolt"]}],
   ["Gem Fort","mid",{bushy:true,poolFirst:["8-Bit","Surge","Starr Nova","Damian","Gene","Rico"],poolLast:["Mortis","Edgar","Shade","Lily","Buzz","Ash","Bolt"]}],
   ["Undermine","closed",{bushy:true,poolFirst:["8-Bit","Surge","Starr Nova","Damian","Griff","Meg"],poolLast:["Mortis","Edgar","Shade","Lily","Buzz","Ash","Bolt"]}],
 ],
 "Heist"     :[
   ["Bridge Too Far","open",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Griff","Meg","Brock"],poolLast:["Edgar","Alli","Lily","Darryl","Mico","Carl"]}],
   ["Hot Potato","closed",{good:["Brock"],poolFirst:["Surge","Starr Nova","8-Bit","Griff","Meg","Brock"],poolLast:["Cordelius","Bolt","Barley","Edgar","Buzz","Chuck"]}],
   ["Kaboom Canyon","mid",{poolFirst:["Surge","Starr Nova","8-Bit","Griff","Meg","Brock"],poolLast:["Cordelius","Bolt","Darryl","Edgar","Buzz","Chuck"]}],
   ["Safe Zone","open",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Griff","Meg","Brock"],poolLast:["Cordelius","Bolt","Darryl","Edgar","Chuck","Buzz"]}],
 ],
 "Bounty"    :[
   ["Dry Season","open",{poolFirst:["Surge","Starr Nova","Gene","8-Bit","Meg","Nadia"],poolLast:["Nani","Edgar","Kit","Bolt","Mortis","Sprout"]}],
   ["Hideout","open",{poolFirst:["Surge","Starr Nova","8-Bit","Gene","Pearl","Glowy"],poolLast:["Nani","Edgar","Kit","Bolt","Mortis","Sprout"]}],
   ["Layer Cake","closed",{bushy:true,poolFirst:["Surge","Starr Nova","8-Bit","Griff","Meg","Meeple"],poolLast:["Shade","Edgar","Kit","Bolt","Penny","Alli","Mortis"]}],
   ["Shooting Star","open",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Gene","Piper","Max"],poolLast:["Fang","Edgar","Kit","Bolt","Mortis","Sprout"]}],
 ],
 "Knockout"  :[
   ["Belle's Rock","mid",{water:true,noTank:1,poolFirst:["Surge","Starr Nova","Rico","Gene","Max","Brock"],poolLast:["Edgar","Kit","Darryl","Nani","Bolt","Piper"]}],
   ["Flaring Phoenix","closed",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Gene","Max","Brock"],poolLast:["Edgar","Kit","Darryl","Nani","Alli","Piper"]}],
   ["New Horizons","open",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Gene","Max","Brock"],poolLast:["Edgar","Kit","Darryl","Nani","Alli","Piper"]}],
   ["Out in the Open","open",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Gene","Max","Brock"],poolLast:["Edgar","Kit","Darryl","Nani","Alli","Piper","Bolt"]}],
 ],
 "Hot Zone"  :[
   ["Dueling Beetles","mid",{water:true,poolFirst:["Surge","Starr Nova","8-Bit","Max","Meg","Lou"],poolLast:["Cordelius","Bolt","Barley","Edgar","Buzz","Mortis"]}],
   ["Open Business","closed",{good:["Brock"],bad:["Crow","Damian"],poolFirst:["Surge","Starr Nova","8-Bit","Max","Meg","Lou"],poolLast:["Cordelius","Bolt","Barley","Edgar","Buzz","Mortis"]}],
   ["Parallel Plays","mid",{good:["Barley","Sprout","Dynamike","Larry & Lawrie","Ziggy","Grom","Tick","Sirius","Willow"],poolFirst:["Surge","Starr Nova","8-Bit","Meeple","Meg","Lou"],poolLast:["Mortis","Edgar","Bibi","Shade","Cordelius","Ziggy"]}],
   ["Ring of Fire","open",{poolFirst:["Surge","Starr Nova","8-Bit","Meg","Lou","Alli"],poolLast:["Bolt","Sprout","Edgar","Mortis","Cordelius","Bibi"]}],
 ],
};

/* Що просить шаблон режиму на кожному з 6 піків — незалежно від того, чия це черга.
   r = бажані ролі, c = наскільки на цьому піку важать контри (1 = звичайно, 2 = це контр-пік) */
const WANT = {
 "Brawl Ball":[{r:["antitank"],c:1},{r:["antitank","assassin"],c:1.2},{r:["assassin","antitank"],c:1.2},
               {r:["antitank","tank"],c:1.5},{r:[],c:1.5},{r:[],c:2}],
 "Hot Zone"  :[{r:["antitank"],c:1},{r:["antitank","tank"],c:1.2},{r:["tank","antitank"],c:1.2},
               {r:["antitank","tank"],c:1.5},{r:["tank","control"],c:1.5},{r:[],c:2}],
 "Gem Grab"  :[{r:["antitank"],c:1},{r:["antitank"],c:1.2},{r:["gemcarry","control"],c:1},
               {r:[],c:1.8},{r:["gemcarry","control"],c:1.2},{r:[],c:2}],
 "Heist"     :[{r:["antitank","dmg"],c:1},{r:["antitank"],c:1.2},{r:["dmg"],c:1},
               {r:["dmg"],c:1.5},{r:["control"],c:1.3},{r:[],c:2}],
 "Bounty"    :[{r:["sniper","control","antitank"],c:1},{r:[],c:1.8},{r:["sniper","control"],c:1.2},
               {r:[],c:1.8},{r:[],c:1.8},{r:[],c:2}],
 "Knockout"  :[{r:["sniper","control","antitank"],c:1},{r:[],c:1.8},{r:["sniper","control"],c:1.2},
               {r:[],c:1.8},{r:[],c:1.8},{r:[],c:2}],
};

/* ============ СТАН ============ */
/* Формат 1-2-2-1-1-2. Якщо перший пік наш — наші слоти 1,4,5. Якщо ворожий — наші 2,3,6. */

/* ============ ЛОГІКА РЕКОМЕНДАЦІЙ ============ */
/* Антитанк за визначенням б'є і танків, і вбивць — це одне поняття, а не два.
   Тому вбивця не контрить того, хто сам антитанк чи танк. */
function triBeats(a, b){
  if(!a.tri || !b.tri) return false;
  if(TRI_NEXT[a.tri] !== b.tri) return false;
  if(a.tri==="highhp" && TRI_EXCEPT_HIGHHP.includes(b.n)) return false;
  // Явно продиктована слабкість (losesTo) переважує загальний трикутник HP/DPS —
  // інакше загальне правило суперечить конкретному опису бійця. Приклад: Colette —
  // "dps" за трикутником, тому формально мала б бити highhp-бійців (напр. Leon),
  // але її власний опис прямо каже, що вона програє вбивцям (losesTo:["assassin"]).
  // Конкретний виняток має перемагати загальне правило.
  if(a.losesTo && b.roles.some(r=>a.losesTo.includes(r))) return false;
  return true;
}

/* ============ СТАН — тепер параметр ctx, а не глобальні змінні браузера ============
   ctx = { mode, map, picks, bans, weFirst } — усе, що раніше читалось з window напряму */
function makeCtx(mode, mapIdx, picks, bans, weFirst){
  const map = MAPS[mode][mapIdx];
  const OURS = weFirst ? [0,3,4] : [1,2,5];
  const THEIRS = weFirst ? [1,2,5] : [0,3,4];
  return { mode, map, picks, bans, weFirst, OURS, THEIRS };
}

function byName(n){ return B.find(b=>b.n===n) }
function used(ctx){ return ctx.picks.filter(Boolean).concat(ctx.bans) }
function nextSlot(ctx){ for(let i=0;i<6;i++) if(!ctx.picks[i]) return i; return undefined }
const TIER_BASE={S:20, A:9, B:3, C:1, D:0.5, F:0};
function power(b){ return TIER_BASE[b.t] + (b.rr<=2 ? 8 : b.rr<=4 ? 4 : 2) }
function mapFit(b, ctx){ return b.maps.includes(ctx.map[1]); }
function playable(b, ctx){ return mapFit(b, ctx) && !(b.badModes&&b.badModes.includes(ctx.mode)) }

function hits(b, role, ctx){
  if(b.losesTo && b.losesTo.includes(role)) return false;
  if(role==="sniper" && b.roles.includes("sniper")) return false;
  if(b.roles.includes("sniper") && (role==="thrower" || role==="control") && ctx.map[1]==="open") return true;
  if(b.roles.includes("thrower") && role==="sniper" && ctx.map[1]!=="open") return true;
  if(b.beats.includes(role)) return true;
  if(b.roles.includes("antitank") && (role==="tank" || role==="assassin") && !(role==="assassin" && b.noAntiAssassin)) return true;
  if(b.roles.includes("tank") && role==="assassin") return true;
  if(b.burst && role==="assassin") return true;
  if(b.roles.includes("control") && (role==="antitank" || role==="dmg") && ctx.map[1]!=="closed") return true;
  return false;
}
function weakRole(b){
  let r = b.weakAs || b.roles[0];
  if(r==="support")  r = "control";
  if(r==="dmg")      r = "antitank";
  if(r==="gemcarry") r = "control";
  return r;
}
function safeFrom(b, e){
  return e.roles.includes("assassin") &&
         (b.roles.includes("antitank") || b.roles.includes("tank") ||
          weakRole(b)==="antitank" || weakRole(b)==="tank");
}
function edge(a,e,ctx){
  const p = pairOf(a.n,e.n);
  if(p) return p[2];
  return e.roles.some(r=>hits(a,r,ctx)) ? 1 : 0;
}
function counters(a, b, ctx){
  const p = pairOf(a.n,b.n);
  if(p) return p[2] > 0 ? p[2] : 0;
  if(safeFrom(b, a)) return 0;
  return hits(a, weakRole(b), ctx) ? 1 : 0;
}
function threat(cand, slot, oppSide, ctx){
  const left = oppSide.filter(i=>!ctx.picks[i] && i>slot).length;
  if(!left) return null;
  let best=null, bs=0;
  B.filter(b=>!used(ctx).includes(b.n) && b.n!==cand.n && playable(b, ctx)).forEach(e=>{
    const v = counters(e,cand,ctx);
    if(v<=0) return;
    const sc = v*power(e);
    if(sc>bs){ bs=sc; best=e; }
  });
  return best ? {b:best, pen: bs*0.28, left} : null;
}
const THREAT_ROLES = ["thrower","tank","assassin","control"];
function holes(comp, oppSide, slot, ctx){
  const left = oppSide.filter(i=>!ctx.picks[i] && i>=slot).length;
  if(!left) return [];
  return THREAT_ROLES.filter(role=>{
    const canTake = B.some(b=>!used(ctx).includes(b.n) && playable(b, ctx) && b.roles.includes(role));
    if(!canTake) return false;
    return !comp.some(m=>hits(m,role,ctx));
  });
}

/* ============ ГОЛОВНА РЕКОМЕНДАЦІЯ ============
   Причини (why) тепер [id, params, sign] замість перекладеного тексту — переклад робить
   клієнт своєю системою t()/TXT, як і зараз. Це навмисно: сервер не повинен тримати
   переклади на 8 мов, і формат відповіді лишається сумісним з тим, що клієнт уже вміє малювати. */
function recommend(mode, mapIdx, picks, bans, weFirst, forceSlot){
  const ctx = makeCtx(mode, mapIdx, picks, bans, weFirst);
  const slot = forceSlot!==undefined ? forceSlot : nextSlot(ctx);
  if(slot===undefined) return {slot:null,list:[],alts:[],job:[]};
  const ourTurn = ctx.OURS.includes(slot);
  const meSide  = ourTurn?ctx.OURS:ctx.THEIRS, oppSide = ourTurn?ctx.THEIRS:ctx.OURS;
  const pickNo = slot+1;
  const cfg = (WANT[mode]||WANT["Brawl Ball"])[slot];
  const want = cfg.r, cw = cfg.c;
  const enemy = oppSide.map(i=>picks[i]).filter(Boolean).map(byName);
  const mine  = meSide.filter(i=>i!==slot).map(i=>picks[i]).filter(Boolean).map(byName);
  const isFirst = slot===0;
  const gapsNow = holes(mine, oppSide, slot, ctx);
  const foeLeft = oppSide.filter(i=>!picks[i] && i>slot).length;

  const scored = B.filter(b=>!used(ctx).includes(b.n)).map(b=>{
    let m = 1, why=[];
    if(b.t==="S") why.push(["rS",null,0]);
    else if(b.t!=="A") why.push(["rB",{x:b.t},1]);
    if(b.t==="S"&&b.rr<=1) why.push(["rTop",null,0]);

    if(b.badModes && b.badModes.includes(mode)){ m *= 0.15; why.push(["rBadMode",{m:mode},1]); }
    else if(b.goodModes && b.goodModes.includes(mode)){ m *= 1.25; why.push(["rGoodMode",{m:mode},0]); }

    if(mapFit(b, ctx)){ m *= 1.3; why.push(["rMapGood",{t:ctx.map[1]},0]); }
    else { m *= 0.7; why.push(["rMapBad",{t:ctx.map[1]},1]); }

    const mf = ctx.map[2] || {};
    const isFixedDealer = (b.roles[0]==="antitank" || b.roles[0]==="dmg") && !b.burst;
    if(ctx.map[1]==="closed"){
      if(b.burst){ m *= 1.15; why.push(["rStyleBurstClosed",null,0]); }
      else if(isFixedDealer && !b.anyRange && !mf.bushy){ m *= 0.87; why.push(["rStyleFixedClosed",null,1]); }
    } else if(ctx.map[1]==="mid"){
      if(isFixedDealer){ m *= 1.15; why.push(["rStyleFixedMid",null,0]); }
      else if(b.burst){ m *= 0.87; why.push(["rStyleBurstMid",null,1]); }
    }

    enemy.forEach(e=>{
      const p = pairOf(b.n,e.n);
      if(p){
        if(p[2]>0){ m *= 1 + 0.22*cw*p[2]; why.push(["rPair",{n:e.n,x:p[3]},0]); }
        else if(p[2]<0){ m *= 1 + 0.20*p[2]; why.push(["rPair",{n:e.n,x:p[3]},1]); }
        else why.push(["rPair",{n:e.n,x:p[3]},1]);
      } else {
        const hit = hits(b, weakRole(e), ctx) ? weakRole(e) : null;
        if(hit){
          const close = (hit==="tank" || hit==="assassin");
          const CLOSE_K = {closed:[0.60,0.12], mid:[0.46,0.18], open:[0.28,0.26]};
          const assassinVsThrower = b.roles.includes("assassin") && hit==="thrower";
          const k = close ? CLOSE_K[ctx.map[1]][b.burst?0:1] : (assassinVsThrower ? 0.36 : 0.22);
          m *= 1 + k*cw; why.push(["rCounters",{n:e.n,r:hit},0]);
        } else if(triBeats(b,e)){
          m *= 1 + 0.16*cw; why.push(["rTriangle",{n:e.n},0]);
        }
      }
      const back = pairOf(e.n,b.n);
      if(back){ if(back[2]>0){ m *= 1 - 0.20*back[2]; why.push(["rPairBack",{n:e.n,x:back[3]},1]); } }
      else if(safeFrom(b,e)){ /* вбивця не контрить антитанка чи танка */ }
      else if(hits(e, weakRole(b), ctx)){
        m *= 0.78; why.push(["rBy",{n:e.n,r:weakRole(b)},1]);
      }
      else if(b.roles.some(r=>e.beats.includes(r))){ m *= 0.9; }
      else if(b.softLosesTo && e.roles.some(r=>b.softLosesTo.includes(r))){
        m *= 0.9; why.push(["rSoftBy",{n:e.n},1]);
      }
      else if(triBeats(e,b)){
        m *= 0.85; why.push(["rTriangleBy",{n:e.n},1]);
      }
    });

    if(enemy.length>=3 && enemy.every(e=>e.roles.includes("control")) && b.roles.includes("assassin")){
      m *= 1.45; why.push(["rTripleControl",null,0]);
    }
    if(b.roles.includes("thrower") && enemy.some(e=>WALLBREAKERS.includes(e.n))){
      m *= 0.15; why.push(["rWallbreaker",null,1]);
    }
    if(mf.bushy && b.roles.includes("tank")){
      if(enemy.some(e=>WALLBREAKERS.includes(e.n))){
        m *= 0.75; why.push(["rWallbreakerTank",null,1]);
      } else if(foeLeft){
        m *= 0.92; why.push(["rWallbreakerRisk",null,1]);
      }
    }
    if(mf.noTank && b.roles.includes("tank")){ m *= 0.4; why.push(["rNoTank",null,1]); }
    if(mf.bushy && b.roles.includes("assassin")){ m *= 1.35; why.push(["rBushy",null,0]); }
    if(mf.water && b.walksOnWater){ m *= 1.3; why.push(["rWater",null,0]); }
    if(mf.water && b.walksOnWaterPartial){ m *= 1.12; why.push(["rWater",null,0]); }
    if(mf.good && mf.good.includes(b.n)){ m *= 1.6; why.push(["rMapGood",{t:ctx.map[1]},0]); }
    if(mf.bad  && mf.bad.includes(b.n)){  m *= 0.45; why.push(["rMapBad",{t:ctx.map[1]},1]); }

    if(want.length && b.roles.some(r=>want.includes(r))){
      m *= 1.25; why.push(["rWant",{r:b.roles.find(r=>want.includes(r)),m:mode,n:pickNo},0]);
    }

    const closes = gapsNow.filter(r=>hits(b,r,ctx));
    if(closes.length){
      m *= 1 + 0.15*closes.length;
      why.push(["rGap",{x:closes.join(", ")},0]);
    }

    if(foeLeft && !b.earlyOk && b.roles.some(r=>r==="assassin"||r==="thrower")){
      m *= 1 - 0.22*foeLeft;
      if(isFirst) why.push(["rNoFirst",null,1]);
    }
    if(slot>=3 && b.roles.includes("thrower") && !b.earlyOk && enemy.some(e=>e.roles.includes("assassin"))){
      m *= 0.5; why.push(["rNoThrower",null,1]);
    }

    let hurt = 0;
    enemy.forEach(e=>{
      const back = pairOf(e.n,b.n);
      if(back){ if(back[2]>0) hurt++; }
      else if(!safeFrom(b,e) && hits(e, weakRole(b), ctx)) hurt++;
    });
    if(hurt>=2){ m *= 0.35; why.push(["rDouble",null,1]); }

    const th = threat(b, slot, oppSide, ctx);
    if(th){
      m *= 1 - Math.min(0.45, th.pen*0.035);
      if(th.pen>2) why.push(["rThreat",{n:th.b.n},1]);
    }

    mine.forEach(x=>{ if(x.roles[0]===b.roles[0]) m *= 0.93; });
    if(b.heist && mode==="Heist"){ m *= 1.2; why.push(["rHeist",null,0]); }

    const plus = why.filter(w=>!w[2]).slice(0,3);
    const minus = why.filter(w=>w[2]).slice(0,2);
    return {b, s: power(b)*m, why: plus.concat(minus), dbl: hurt>=2};
  });

  scored.sort((x,y)=>y.s-x.s);
  const fitOnly = scored.filter(x=>mapFit(x.b, ctx));
  let pool = fitOnly.length >= 6 ? fitOnly : scored;

  const mapPools = ctx.map[2] || {};
  const poolNames = slot===0 ? mapPools.poolFirst : slot===5 ? mapPools.poolLast : null;
  if(poolNames && poolNames.length){
    const restricted = scored.filter(x=>poolNames.includes(x.b.n));
    if(restricted.length && !restricted.every(x=>x.dbl)) pool = restricted;
  }
  const top = pool.slice(0,3);
  const poolActive = pool !== fitOnly && pool !== scored;

  const job = want.length ? want : (top[0] ? top[0].b.roles : []);
  const alts = poolActive
    ? pool.slice(3).sort((x,y)=>y.s-x.s).slice(0,5)
    : pool.slice(3)
        .filter(x=>x.b.roles.some(r=>job.includes(r)))
        .sort((x,y)=>y.s-x.s)
        .slice(0,5);

  return {slot, list:top, alts, job, pickNo, ourTurn, gaps:gapsNow, all:scored};
}

/* ============ ОЦІНКА ЗАВЕРШЕНОГО ДРАФТУ ============ */
function scoreFinalDetailed(b, slot, oppNames, mode, mapIdx){
  const ctx = { mode, map: MAPS[mode][mapIdx] };
  const foes = oppNames.filter(Boolean).map(byName);
  const cfg = (WANT[mode]||WANT["Brawl Ball"])[slot];
  let m = 1, why=[];
  if(b.t==="S") why.push(["rS",null,0]);
  else if(b.t!=="A") why.push(["rB",{x:b.t},1]);
  if(b.badModes && b.badModes.includes(mode)){ m *= 0.15; why.push(["rBadMode",{m:mode},1]); }
  else if(b.goodModes && b.goodModes.includes(mode)){ m *= 1.25; why.push(["rGoodMode",{m:mode},0]); }
  m *= mapFit(b, ctx) ? 1.3 : 0.7;
  why.push(mapFit(b, ctx) ? ["rMapGood",{t:ctx.map[1]},0] : ["rMapBad",{t:ctx.map[1]},1]);
  const mf = ctx.map[2] || {};
  const isFixedDealer = (b.roles[0]==="antitank" || b.roles[0]==="dmg") && !b.burst;
  if(ctx.map[1]==="closed"){
    if(b.burst){ m *= 1.15; why.push(["rStyleBurstClosed",null,0]); }
    else if(isFixedDealer && !b.anyRange && !mf.bushy){ m *= 0.87; why.push(["rStyleFixedClosed",null,1]); }
  } else if(ctx.map[1]==="mid"){
    if(isFixedDealer){ m *= 1.15; why.push(["rStyleFixedMid",null,0]); }
    else if(b.burst){ m *= 0.87; why.push(["rStyleBurstMid",null,1]); }
  }
  if((cfg.r||[]).length && b.roles.some(r=>cfg.r.includes(r))){
    m *= 1.25; why.push(["rWant",{r:b.roles.find(r=>cfg.r.includes(r)),m:mode,n:slot+1},0]);
  }
  if(mf.noTank && b.roles.includes("tank")){ m *= 0.4; why.push(["rNoTank",null,1]); }
  if(mf.bushy && b.roles.includes("assassin")){ m *= 1.35; why.push(["rBushy",null,0]); }
  if(mf.bushy && b.roles.includes("tank") && foes.some(e=>WALLBREAKERS.includes(e.n))){
    m *= 0.75; why.push(["rWallbreakerTank",null,1]);
  }
  if(mf.good && mf.good.includes(b.n)){ m *= 1.6; why.push(["rMapGood",{t:ctx.map[1]},0]); }
  if(mf.bad  && mf.bad.includes(b.n))  { m *= 0.45; why.push(["rMapBad",{t:ctx.map[1]},1]); }
  let hurt = 0;
  foes.forEach(e=>{
    const p = pairOf(b.n,e.n);
    if(p){
      if(p[2]>0){ m *= 1 + 0.30*p[2]; why.push(["rPair",{n:e.n,x:p[3]},0]); }
      else if(p[2]<0){ m *= 1 + 0.25*p[2]; why.push(["rPair",{n:e.n,x:p[3]},1]); }
    } else {
      const hit = hits(b, weakRole(e), ctx) ? weakRole(e) : null;
      if(hit){
        const close=(hit==="tank"||hit==="assassin");
        const K = {closed:[1.85,1.15], mid:[1.65,1.25], open:[1.40,1.38]};
        const assassinVsThrower = b.roles.includes("assassin") && hit==="thrower";
        m *= close ? K[ctx.map[1]][b.burst?0:1] : (assassinVsThrower ? 1.45 : 1.30);
        why.push(["rCounters",{n:e.n,r:hit},0]);
      }
      else if(triBeats(b,e)){ m *= 1.14; why.push(["rTriangle",{n:e.n},0]); }
    }
    const back = pairOf(e.n,b.n);
    if(back){ if(back[2]>0){ m *= 1 - 0.25*back[2]; hurt++; why.push(["rPairBack",{n:e.n,x:back[3]},1]); } }
    else if(!safeFrom(b,e) && hits(e, weakRole(b), ctx)){ m *= 0.72; hurt++; why.push(["rBy",{n:e.n,r:weakRole(b)},1]); }
    else if(b.softLosesTo && e.roles.some(r=>b.softLosesTo.includes(r))){ m *= 0.9; why.push(["rSoftBy",{n:e.n},1]); }
    else if(triBeats(e,b)){ m *= 0.85; why.push(["rTriangleBy",{n:e.n},1]); }
  });
  if(hurt>=2){ m *= 0.5; why.push(["rDouble",null,1]); }
  if(foes.length>=3 && foes.every(e=>e.roles.includes("control")) && b.roles.includes("assassin")){
    m *= 1.45; why.push(["rTripleControl",null,0]);
  }
  if(b.roles.includes("thrower") && foes.some(e=>WALLBREAKERS.includes(e.n))){ m *= 0.15; why.push(["rWallbreaker",null,1]); }
  const plus = why.filter(w=>!w[2]).slice(0,3);
  const minus = why.filter(w=>w[2]).slice(0,3);
  return {score: power(b)*m, why: plus.concat(minus)};
}
function scoreFinal(b, slot, oppNames, mode, mapIdx){ return scoreFinalDetailed(b, slot, oppNames, mode, mapIdx).score; }

function rate(name, slot, oppNames, takenNames, mode, mapIdx){
  const s = scoreFinal(byName(name), slot, oppNames, mode, mapIdx);
  let best = 0;
  B.filter(b=>b.n===name || !takenNames.includes(b.n)).forEach(b=>{
    const v = scoreFinal(b, slot, oppNames, mode, mapIdx); if(v>best) best = v;
  });
  return Math.max(1, Math.min(100, Math.round(100*s/(best||1))));
}

function draftSummary(mode, mapIdx, picks, bans, weFirst){
  const ctx = makeCtx(mode, mapIdx, picks, bans, weFirst);
  const our = ctx.OURS.map(i=>picks[i]), their = ctx.THEIRS.map(i=>picks[i]);
  const ourS   = ctx.OURS.reduce((a,i)=>a+scoreFinal(byName(picks[i]), i, their, mode, mapIdx), 0);
  const theirS = ctx.THEIRS.reduce((a,i)=>a+scoreFinal(byName(picks[i]), i, our, mode, mapIdx), 0);
  const win = Math.round(100*ourS/((ourS+theirS)||1));
  const rows = [0,1,2,3,4,5].map(i=>{
    const ours = ctx.OURS.includes(i);
    const opp = ours ? their : our;
    const detailed = scoreFinalDetailed(byName(picks[i]), i, opp, mode, mapIdx);
    return {
      slot:i, name:picks[i], ours,
      score: rate(picks[i], i, opp, picks.filter((n,k)=>n && k!==i).concat(bans), mode, mapIdx),
      why: detailed.why
    };
  });
  const oursRows = rows.filter(r=>r.ours && r.name);
  const best = oursRows.length ? oursRows.reduce((a,b)=>b.score>a.score?b:a) : null;
  const worst = oursRows.length ? oursRows.reduce((a,b)=>b.score<a.score?b:a) : null;
  return { win: Math.max(1, Math.min(99, win)), rows, best, worst };
}

/* ============ ПОВНИЙ ШОРТЛИСТ ПО РОЛІ (сліпий режим) ============ */
function bestForRole(role, n, mode, mapIdx, picks, bans){
  const ctx = { mode, map: MAPS[mode][mapIdx], picks, bans };
  const roles = Array.isArray(role) ? role : [role];
  const seen = new Set(), out = [];
  roles.forEach(r=>{
    B.filter(b=>!used(ctx).includes(b.n) && !seen.has(b.n) && b.roles.includes(r) && mapFit(b, ctx)
               && !(b.badModes && b.badModes.includes(mode)))
      .forEach(b=>{
        seen.add(b.n);
        let m = 1;
        if(b.goodModes && b.goodModes.includes(mode)) m *= 1.25;
        if(b.roles[0]===r) m *= 1.15;
        out.push({b, s: power(b)*m});
      });
  });
  out.sort((x,y)=>y.s-x.s);
  return out.slice(0, n||3);
}


/* Приклади бійців ролі для безкоштовного тизера (без підписки) — та сама round-robin
   логіка, що раніше була в index.html (roleExampleIcons), тепер тут, бо клієнт більше
   не має бази бійців взагалі. Імена ролі — не секрет, це просто підказка "хто така
   антитанк роль", а не точна рекомендація. */
function roleExampleNames(roles){
  const pools = roles.map(role=>B.filter(b=>b.roles.includes(role)).map(b=>b.n));
  const seen = new Set(); const names = [];
  let i = 0, progressed = true;
  while(progressed && names.length < 10){
    progressed = false;
    for(const pool of pools){
      if(names.length >= 10) break;
      const n = pool[i];
      if(n && !seen.has(n)){ seen.add(n); names.push(n); progressed = true; }
      else if(n) progressed = true;
    }
    i++;
  }
  return names;
}

/* ============ ПІДКАЗКИ БАНІВ (зараз безкоштовні для всіх, але рахуються тією самою
   захищеною логікою — тому теж переносимо, щоб index.html взагалі не тримав базу) ============ */
function banOrderBase(b){ return power(b) + (b.ban||1)*4; }

const BLIND_ROLES = {
 "Brawl Ball": {any:["antitank","antitank","assassin"]},
 "Hot Zone":   {open:["control","antitank","antitank"], any:["antitank","antitank","tank"]},
 "Gem Grab":   {any:["antitank","antitank",["gemcarry","control"]]},
 "Heist":      {any:["control","antitank","dmg"]},
 "Bounty":     {closed:["control","control","antitank"], any:["sniper","control","antitank"]},
 "Knockout":   {closed:["control","control","antitank"], any:["sniper","control","antitank"]},
};
function teamRoles(mode, mapIdx, picks, bans){
  const map = MAPS[mode][mapIdx];
  const cfg = BLIND_ROLES[mode] || BLIND_ROLES["Brawl Ball"];
  const want = (cfg[map[1]] || cfg.any).slice();
  return want.map((r)=>{
    if(bestForRole(r,1,mode,mapIdx,picks,bans).length) return r;
    for(const alt of want){ if(alt!==r && bestForRole(alt,1,mode,mapIdx,picks,bans).length) return alt; }
    return "antitank";
  });
}
function firstPickRoles(mode){
  const cfg = (WANT[mode]||WANT["Brawl Ball"])[0];
  return (cfg.r && cfg.r.length) ? cfg.r : ["antitank"];
}
function banOrder(mode, mapIdx, picks, bans, weFirst){
  const ctx = makeCtx(mode, mapIdx, picks, bans, weFirst);
  const pool0 = B.filter(b=>!used(ctx).includes(b.n));
  const topPower = Math.max(...pool0.map(power));
  const roles = weFirst ? firstPickRoles(mode) : null;
  const pool = weFirst ? pool0.filter(b=>!b.roles.some(r=>roles.includes(r))) : pool0;

  return pool.map(b=>{
    let s = banOrderBase(b), why=[];
    if(!weFirst){
      if(power(b) >= topPower-2) why.push(["bwMeta",null,0]);
      if(b.t==="S") why.push(["rS",null,0]);
    } else {
      const hit = roles.find(r=>hits(b,r,ctx));
      if(hit){ s *= 1.4; why.push(["bwCounter",{n:hit},0]); }
      else    { s *= 0.8; }
      if(b.t==="S") why.push(["rS",null,0]);
    }
    if(b.badModes && b.badModes.includes(mode)) s *= 0.25;
    else if(b.goodModes && b.goodModes.includes(mode)){ s *= 1.15; why.push(["rGoodMode",{m:mode},0]); }
    if(mapFit(b, ctx)){ s *= 1.1; why.push(["rMapGood",{t:ctx.map[1]},0]); }
    else { s *= 0.25; why.push(["rMapBad",{t:ctx.map[1]},1]); }
    if((b.ban||1) >= 2.5) why.push(["bwOften",null,0]);
    return {b, s, why:why.slice(0,3)};
  }).sort((x,y)=>y.s-x.s);
}


function genCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `RANKED-${part()}-${part()}`;
}

// код тепер зберігає структуру { status, subscriptionId, customerId }, а не просто рядок —
// це потрібно, щоб знайти підписку в Stripe, коли людина захоче її скасувати
async function readCode(env, code) {
  const raw = await env.SUBSCRIPTIONS.get(`code:${code}`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return { status: raw }; } // сумісність зі старими записами (простий рядок)
}
async function writeCode(env, code, data) {
  await env.SUBSCRIPTIONS.put(`code:${code}`, JSON.stringify(data));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-07-29.dahlia" });

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/battlelog")) {
      let tag = (url.searchParams.get("tag") || "").trim().toUpperCase();
      tag = tag.replace(/^#/, "").replace(/O/g, "0");
      if (!tag) return json({ error: "Missing ?tag=" }, 400);
      const wantsBattlelog = url.pathname === "/battlelog";
      const target = `https://bsproxy.royaleapi.dev/v1/players/%23${tag}${wantsBattlelog ? "/battlelog" : ""}`;
      const upstream = await fetch(target, { headers: { Authorization: `Bearer ${env.BS_API_KEY}` } });
      const body = await upstream.text();
      return new Response(body, { status: upstream.status, headers: { "Content-Type": "application/json", ...cors } });
    }

    if (request.method === "POST" && url.pathname === "/create-checkout-session") {
      const code = genCode();
      await writeCode(env, code, { status: "pending" });
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        client_reference_id: code,
        success_url: `${SITE_URL}?sub=success&code=${code}`,
        cancel_url: `${SITE_URL}?sub=cancel`,
      });
      return json({ url: session.url, code });
    }

    if (request.method === "GET" && url.pathname === "/check-code") {
      const code = (url.searchParams.get("code") || "").trim().toUpperCase();
      if (!code) return json({ active: false });
      const rec = await readCode(env, code);
      return json({ active: !!rec && rec.status === "active" });
    }

    // ---- ГОЛОВНЕ: тут тепер рахується сама рекомендація, а не в браузері людини.
    // Клієнт присилає стан драфта, сервер сам перевіряє код підписки і сам вирішує,
    // що саме повернути — точну відповідь чи лише роль. Точна відповідь ніколи
    // не потрапляє в JS сторінки, тому її неможливо дістати, просто прибравши
    // перевірку в консолі браузера чи скопіювавши код сторінки. ----
    if (request.method === "POST" && url.pathname === "/recommend") {
      let data;
      try { data = await request.json(); } catch (e) { return json({ error: "Bad JSON" }, 400); }

      const code = (data.code || "").trim().toUpperCase();
      let active = false;
      if (code) {
        const rec = await readCode(env, code);
        active = !!rec && rec.status === "active";
      }

      const mode = MAPS[data.mode] ? data.mode : "Brawl Ball";
      const mapIdx = Number.isInteger(data.mapIdx) && MAPS[mode][data.mapIdx] ? data.mapIdx : 0;
      const picks = Array.isArray(data.picks) && data.picks.length === 6
        ? data.picks.map(n => (n && B.some(b => b.n === n)) ? n : null)
        : [null, null, null, null, null, null];
      const bans = Array.isArray(data.bans) ? data.bans.filter(n => B.some(b => b.n === n)) : [];
      const weFirst = !!data.weFirst;

      try {
        if (data.type === "final") {
          const ds = draftSummary(mode, mapIdx, picks, bans, weFirst);
          if (active) {
            return json({ active, win: ds.win, rows: ds.rows, best: ds.best, worst: ds.worst });
          }
          // без підписки: той самий win% і ті самі бали 1-100 (це й зараз безкоштовне),
          // просто без пояснень "чому" — саме пояснення й best/worst платні
          return json({ active, win: ds.win, rows: ds.rows.map(r => ({ slot: r.slot, name: r.name, ours: r.ours, score: r.score })) });
        }

        if (data.type === "bestForRole") {
          const role = data.role;
          if (!role) return json({ error: "Missing role" }, 400);
          if (active) {
            const list = bestForRole(role, data.n || 6, mode, mapIdx, picks, bans);
            return json({ active, list: list.map(x => ({ name: x.b.n, score: Math.round(x.s * 100) / 100 })) });
          }
          const roles = Array.isArray(role) ? role : [role];
          return json({ active, roleIcons: roleExampleNames(roles) });
        }

        // підказки банів — безкоштовні для всіх і зараз, підписку тут не перевіряємо,
        // просто рахуємо тією самою захищеною логікою замість тримати базу в браузері
        if (data.type === "bans") {
          const list = banOrder(mode, mapIdx, picks, bans, weFirst);
          return json({ active, list: list.slice(0, 10).map(x => ({ name: x.b.n, score: Math.round(x.s * 100) / 100, why: x.why })) });
        }

        // сліпий режим (усі пікають одночасно, суперника не видно): 3 ролі, які команді
        // варто закрити на цій карті, і по кожній — короткий список кандидатів
        if (data.type === "blind") {
          const roles = teamRoles(mode, mapIdx, picks, bans);
          if (active) {
            const blocks = roles.map(role => ({
              role,
              list: bestForRole(role, 6, mode, mapIdx, picks, bans).map(x => ({ name: x.b.n, score: Math.round(x.s * 100) / 100 })),
            }));
            return json({ active, roles, blocks });
          }
          const flatRoles = roles.flatMap(r => Array.isArray(r) ? r : [r]);
          return json({ active, roles, roleIcons: roleExampleNames(flatRoles) });
        }

        // за замовчуванням — жива рекомендація піку під час драфту
        const forceSlot = Number.isInteger(data.forceSlot) ? data.forceSlot : undefined;
        const rec = recommend(mode, mapIdx, picks, bans, weFirst, forceSlot);
        if (rec.slot === null) return json({ active, slot: null });

        if (active) {
          return json({
            active, slot: rec.slot, pickNo: rec.pickNo, ourTurn: rec.ourTurn, gaps: rec.gaps, job: rec.job,
            list: rec.list.map(x => ({ name: x.b.n, score: Math.round(x.s * 100) / 100, why: x.why })),
            alts: rec.alts.map(x => ({ name: x.b.n, score: Math.round(x.s * 100) / 100, why: x.why })),
          });
        }
        // без підписки: та сама роль (job) і приклади бійців цієї ролі — без точного піку
        return json({
          active, slot: rec.slot, pickNo: rec.pickNo, ourTurn: rec.ourTurn, gaps: rec.gaps, job: rec.job,
          roleIcons: roleExampleNames(rec.job.length ? rec.job : (rec.list[0] ? rec.list[0].b.roles : ["antitank"])),
        });
      } catch (err) {
        return json({ error: "Compute error", detail: err.message }, 500);
      }
    }

    // ---- нове: скасувати повторне списання (людина лишається з доступом до кінця періоду) ----
    if (request.method === "POST" && url.pathname === "/cancel-subscription") {
      let data;
      try { data = await request.json(); } catch (e) { return json({ ok: false, error: "Bad JSON" }, 400); }
      const code = (data.code || "").trim().toUpperCase();
      if (!code) return json({ ok: false, error: "Missing code" }, 400);

      const rec = await readCode(env, code);
      if (!rec || !rec.subscriptionId) {
        return json({ ok: false, error: "Subscription not found for this code" }, 404);
      }

      try {
        // cancel_at_period_end: НЕ видаляє підписку одразу — тільки вимикає автопродовження.
        // Доступ (і status у Stripe) лишається "active" аж до кінця вже оплаченого періоду.
        const sub = await stripe.subscriptions.update(rec.subscriptionId, { cancel_at_period_end: true });
        return json({ ok: true, accessUntil: sub.current_period_end });
      } catch (err) {
        return json({ ok: false, error: err.message }, 400);
      }
    }

    if (request.method === "POST" && url.pathname === "/stripe-webhook") {
      const sig = request.headers.get("stripe-signature");
      const rawBody = await request.text();
      let event;
      try {
        event = await stripe.webhooks.constructEventAsync(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        return new Response(`Webhook error: ${err.message}`, { status: 400 });
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const code = session.client_reference_id;
        if (code) {
          await writeCode(env, code, {
            status: "active",
            subscriptionId: session.subscription || null,
            customerId: session.customer || null,
          });
          if (session.subscription) await env.SUBSCRIPTIONS.put(`sub:${session.subscription}`, code);
        }
      }

      if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
        const sub = event.data.object;
        const code = await env.SUBSCRIPTIONS.get(`sub:${sub.id}`);
        if (code) {
          const rec = (await readCode(env, code)) || {};
          const active = sub.status === "active" || sub.status === "trialing";
          await writeCode(env, code, {
            status: active ? "active" : "inactive",
            subscriptionId: sub.id,
            customerId: sub.customer,
          });
        }
      }

      return json({ received: true });
    }

    return json({ error: "Not found" }, 404);
  },
};
