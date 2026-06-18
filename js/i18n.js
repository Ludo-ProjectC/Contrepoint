/* ═══ I18N — Détection de langue à 3 niveaux ═══
   Priorité : 1) URL ?lang=  >  2) localStorage  >  3) navigator.languages
   Langues supportées : fr, en, es. Fallback final : en. */
var currentLang = (function(){
  var SUPPORTED = ['fr','en','es'];
  /* 1) Paramètre URL — utile pour partages, hreflang, sitemap */
  try {
    var urlLang = new URLSearchParams(location.search).get('lang');
    if(urlLang){
      urlLang = urlLang.toLowerCase().slice(0,2);
      if(SUPPORTED.indexOf(urlLang) !== -1) return urlLang;
    }
  } catch(e){}
  /* 2) Choix précédent de l'utilisateur (localStorage) */
  try {
    var saved = localStorage.getItem('pc_lang');
    if(saved && SUPPORTED.indexOf(saved) !== -1) return saved;
  } catch(e){}
  /* 3) Préférences navigateur — on parcourt la liste complète, pas seulement la première */
  var langs = navigator.languages || [navigator.language || 'en'];
  for(var i = 0; i < langs.length; i++){
    var code = (langs[i] || '').toLowerCase().slice(0,2);
    if(SUPPORTED.indexOf(code) !== -1) return code;
  }
  /* Fallback : anglais (audience la plus large) */
  return 'en';
})();
/* Met à jour <html lang> immédiatement (avant que setLang soit défini) */
try { document.documentElement.lang = currentLang; } catch(e){}
/* Met à jour le sélecteur de langue dès que possible (au cas où setLang ne s'exécute pas
   à cause d'une erreur ailleurs dans l'init). */
document.addEventListener('DOMContentLoaded', function(){
  try {
    var lbl = document.getElementById('langLabel');
    if(lbl) lbl.textContent = currentLang==='fr'?'FR':currentLang==='es'?'ES':'EN';
    document.querySelectorAll('.lang-opt').forEach(function(o){
      o.classList.toggle('active', o.dataset.lang === currentLang);
    });
  } catch(e){}
});

var I18N={
'tab.home':{fr:'Accueil',en:'Home',es:'Inicio'},
'tab.0':{fr:'Transposeur',en:'Transposer',es:'Transpositor'},'tab.1':{fr:'Intervalles',en:'Intervals',es:'Intervalos'},
'tab.2':{fr:'Harmonie',en:'Harmony',es:'Armonía'},'tab.3':{fr:'Accords',en:'Chords',es:'Acordes'},
'tab.4':{fr:'Modes',en:'Modes',es:'Modos'},'tab.5':{fr:'Cadences',en:'Cadences',es:'Cadencias'},
'tab.6':{fr:'Métronome',en:'Metronome',es:'Metrónomo'},'tab.7':{fr:'Rythme',en:'Rhythm',es:'Ritmo'},
'tab.8':{fr:'Formes',en:'Forms',es:'Formas'},'tab.9':{fr:'Modulation',en:'Modulation',es:'Modulación'},
'tab.10':{fr:'Séquences',en:'Sequences',es:'Secuencias'},'tab.11':{fr:'Analyseur',en:'Analyzer',es:'Analizador'},
'home.badge':{fr:'Outils de théorie musicale interactifs',en:'Interactive Music Theory Tools',es:'Herramientas interactivas de teoría musical'},
'home.title':{fr:'De votre première idée jusqu\'à la dernière <em>mesure</em>.',en:'From your first idea to the final <em>measure</em>.',es:'De tu primera idea hasta el último <em>compás</em>.'},
'home.sub':{fr:'Esquissez vos motifs, explorez les harmonies, structurez vos formes — la théorie au service de votre imagination.',en:'Sketch your motifs, explore harmonies, structure your forms — theory at the service of your imagination.',es:'Esboza tus motivos, explora las armonías, estructura tus formas — la teoría al servicio de tu imaginación.'},
'home.cta_free':{fr:'Commencer gratuitement',en:'Start for free',es:'Empezar gratis'},
'home.cta_premium':{fr:'Débloquer le mode compositeur',en:'Unlock Composer Mode',es:'Desbloquear el modo compositor'},
'tab.composer_mode':{fr:'Mode compositeur — Cliquez pour débloquer',en:'Composer Mode — Click to unlock',es:'Modo compositor — Haz clic para desbloquear'},
'home.cta_donate':{fr:'☕ Soutenir le projet',en:'☕ Support the project',es:'☕ Apoyar el proyecto'},
'home.cta_share':{fr:'Partager',en:'Share',es:'Compartir'},
'home.share_short':{fr:'Partager :',en:'Share:',es:'Compartir:'},

/* ═══ FAQ — 10 questions trilingues (synchronisées avec le FAQPage JSON-LD) ═══ */
'faq.label':{fr:'FAQ',en:'FAQ',es:'FAQ'},
'faq.footer_link':{fr:'Questions fréquentes',en:'FAQ',es:'Preguntas frecuentes'},
'faq.title':{fr:'Questions fréquentes',en:'Frequently Asked Questions',es:'Preguntas frecuentes'},
'faq.sub':{fr:'Tout ce que vous devez savoir avant de commencer.',en:'Everything you need to know before getting started.',es:'Todo lo que necesitas saber antes de empezar.'},

'faq.group.general':{fr:'Général',en:'General',es:'General'},
'faq.group.transposeur':{fr:'Transposeur & Intervalles',en:'Transposer & Intervals',es:'Transpositor e Intervalos'},
'faq.group.harmonie':{fr:'Harmonie & Accords',en:'Harmony & Chords',es:'Armonía y Acordes'},
'faq.group.cadences':{fr:'Cadences & Modes',en:'Cadences & Modes',es:'Cadencias y Modos'},
'faq.group.satb':{fr:'Analyseur SATB & Conduite des voix',en:'SATB Analyzer & Voice Leading',es:'Analizador SATB y Conducción de voces'},
'faq.group.modulation':{fr:'Modulation & Séquences harmoniques',en:'Modulation & Harmonic Sequences',es:'Modulación y Secuencias armónicas'},
'faq.group.formes':{fr:'Formes musicales & Composition',en:'Musical Forms & Composition',es:'Formas musicales y Composición'},
'faq.group.pratique':{fr:'Technique & Pratique',en:'Technique & Practice',es:'Técnica y Práctica'},

'faq.q1':{fr:'Qu\'est-ce que Contrepoint ?',en:'What is Contrepoint?',es:'¿Qué es Contrepoint?'},
'faq.a1':{fr:'Contrepoint est une application web professionnelle d\'outils interactifs de théorie musicale, destinée aux étudiants en conservatoire, aux compositeurs, aux chefs d\'orchestre et aux musiciens autodidactes. Elle propose 12 outils couvrant la transposition, l\'analyse harmonique, les cadences, les accords, les gammes, le métronome, la modulation, les séquences harmoniques et l\'analyse SATB. L\'interface est entièrement trilingue : français, anglais et espagnol.',en:'Contrepoint is a professional web application offering interactive music theory tools for conservatory students, composers, conductors, and self-taught musicians. It includes 12 tools covering transposition, harmonic analysis, cadences, chords, scales, metronome, modulation, harmonic sequences, and SATB analysis. The interface is fully trilingual: French, English, and Spanish.',es:'Contrepoint es una aplicación web profesional de herramientas interactivas de teoría musical, diseñada para estudiantes de conservatorio, compositores, directores de orquesta y músicos autodidactas. Ofrece 12 herramientas que cubren transposición, análisis armónico, cadencias, acordes, escalas, metrónomo, modulación, secuencias armónicas y análisis SATB. La interfaz es completamente trilingüe: francés, inglés y español.'},

'faq.q2':{fr:'Contrepoint est-il gratuit ?',en:'Is Contrepoint free?',es:'¿Es gratuito Contrepoint?'},
'faq.a2':{fr:'Oui, 8 outils sont entièrement gratuits et sans inscription : Transposeur, Intervalles, Harmonie, Accords, Gammes & Modes, Cadences, Métronome et Rythme. Pour 4 outils avancés (Formes musicales, Modulation, Séquences harmoniques, Analyseur SATB), un achat unique du Mode compositeur donne un accès à vie sans abonnement.',en:'Yes, 8 tools are completely free with no sign-up required: Transposer, Intervals, Harmony, Chords, Scales & Modes, Cadences, Metronome, and Rhythm. For 4 advanced tools (Musical Forms, Modulation, Harmonic Sequences, SATB Analyzer), a one-time purchase of the Composer Mode grants lifetime access with no subscription.',es:'Sí, 8 herramientas son completamente gratuitas y no requieren registro: Transpositor, Intervalos, Armonía, Acordes, Escalas y Modos, Cadencias, Metrónomo y Ritmo. Para 4 herramientas avanzadas (Formas musicales, Modulación, Secuencias armónicas, Analizador SATB), una compra única del Modo compositor otorga acceso de por vida sin suscripción.'},

'faq.q3':{fr:'L\'achat est-il unique ou un abonnement ?',en:'Is the purchase a one-time fee or a subscription?',es:'¿El pago es único o por suscripción?'},
'faq.a3':{fr:'C\'est un achat unique avec accès à vie, sans abonnement. Toutes les mises à jour futures sont incluses. Une garantie satisfait ou remboursé de 30 jours est offerte conformément à la Loi sur la protection du consommateur du Québec.',en:'It is a one-time purchase with lifetime access — no subscription, no recurring fees. All future updates are included. A 30-day satisfaction guarantee is offered in accordance with Quebec consumer protection law.',es:'Es un pago único con acceso de por vida, sin suscripción ni cargos recurrentes. Todas las actualizaciones futuras están incluidas. Se ofrece garantía de satisfacción de 30 días conforme a la Ley de protección al consumidor de Quebec.'},

'faq.q4':{fr:'Sur quels appareils Contrepoint fonctionne-t-il ?',en:'On which devices does Contrepoint work?',es:'¿En qué dispositivos funciona Contrepoint?'},
'faq.a4':{fr:'Contrepoint est une application web qui fonctionne directement dans le navigateur, sans installation, sur ordinateur (Chrome, Firefox, Safari, Edge), tablette et mobile. La synthèse audio nécessite la prise en charge de l\'API Web Audio, disponible sur tous les navigateurs modernes.',en:'Contrepoint is a web application that runs directly in the browser with no installation, on desktop (Chrome, Firefox, Safari, Edge), tablet, and mobile. Audio synthesis requires Web Audio API support, available in all modern browsers.',es:'Contrepoint es una aplicación web que funciona directamente en el navegador sin instalación, en ordenador (Chrome, Firefox, Safari, Edge), tableta y móvil. La síntesis de audio requiere compatibilidad con la Web Audio API, disponible en todos los navegadores modernos.'},

'faq.q5':{fr:'Quels instruments transpositeurs sont supportés ?',en:'Which transposing instruments are supported?',es:'¿Qué instrumentos transpositores están disponibles?'},
'faq.a5':{fr:'Le Transposeur prend en charge plus de 40 instruments transpositeurs : Piccolo (Ré♭), Flûte alto (Sol), Cor anglais (Fa), Clarinettes (Si♭ et La), Clarinette basse, Saxophones soprano, alto, ténor et baryton, Cors d\'harmonie (Ré, Mi♭, Mi, Fa, La, Si♭), Trompettes (Ré, Mi♭, Fa, Si♭), Cornet à pistons, Saxhorns, Euphonium, Tuba et bien d\'autres. Idéal pour l\'orchestration et l\'arrangement.',en:'The Transposer supports over 40 transposing instruments: Piccolo (D♭), Alto Flute (G), English Horn (F), Clarinets (B♭ and A), Bass Clarinet, Soprano, Alto, Tenor, and Baritone Saxophones, French Horns (D, E♭, E, F, A, B♭), Trumpets (D, E♭, F, B♭), Cornet, Saxhorns, Euphonium, Tuba, and many more. Essential for orchestration and arranging.',es:'El Transpositor soporta más de 40 instrumentos transpositores: Piccolo (Re♭), Flauta alto (Sol), Corno inglés (Fa), Clarinetes (Si♭ y La), Clarinete bajo, Saxofones soprano, alto, tenor y barítono, Trompas (Re, Mi♭, Mi, Fa, La, Si♭), Trompetas (Re, Mi♭, Fa, Si♭), Corneta, Saxcornas, Euphonium, Tuba y muchos más. Esencial para la orquestación y los arreglos.'},

'faq.q6':{fr:'Comment calculer un intervalle mélodique ou harmonique avec Contrepoint ?',en:'How do I calculate a melodic or harmonic interval in Contrepoint?',es:'¿Cómo calculo un intervalo melódico o armónico con Contrepoint?'},
'faq.a6':{fr:'Le module Intervalles calcule les 24 intervalles standard (unisson, seconde mineure/majeure, tierce mineure/majeure, quarte juste, quarte augmentée, quinte diminuée, quinte juste, sixte, septième, octave…) en version ascendante et descendante. Il affiche le nom, le nombre de demi-tons, la qualité consonante ou dissonante, et joue l\'intervalle avec la synthèse audio.',en:'The Intervals module calculates all 24 standard intervals (unison, minor/major second, minor/major third, perfect fourth, augmented fourth, diminished fifth, perfect fifth, minor/major sixth, minor/major seventh, octave…) ascending and descending. It displays the name, semitone count, consonance or dissonance quality, and plays the interval with audio synthesis.',es:'El módulo Intervalos calcula los 24 intervalos estándar (unísono, segunda menor/mayor, tercera menor/mayor, cuarta justa, cuarta aumentada, quinta disminuida, quinta justa, sexta, séptima, octava…) en versión ascendente y descendente. Muestra el nombre, el número de semitonos, la calidad consonante o disonante, y reproduce el intervalo con síntesis de audio.'},

'faq.q7':{fr:'Comment analyser une grille harmonique avec le module Harmonie ?',en:'How do I analyze a chord progression with the Harmony module?',es:'¿Cómo analizo una progresión armónica con el módulo Armonía?'},
'faq.a7':{fr:'Le module Harmonie identifie les degrés en chiffrage romain (I, ii, iii, IV, V, vi, vii°) avec les inversions (⁶, ⁶₄, ⁶₅, ⁴₃, ⁴₂) dans les 24 tonalités majeures et mineures. Il suit les conventions des conservatoires francophones et anglo-saxons. Entrez une suite d\'accords pour visualiser la progression harmonique et détecter les fonctions tonales (tonique, sous-dominante, dominante).',en:'The Harmony module identifies scale degrees in Roman numeral notation (I, ii, iii, IV, V, vi, vii°) with inversions (⁶, ⁶₄, ⁶₅, ⁴₃, ⁴₂) across all 24 major and minor keys. It follows the conventions of both French and English-language conservatories. Enter a chord progression to visualize the harmonic functions (tonic, subdominant, dominant) and identify modulations.',es:'El módulo Armonía identifica los grados en cifrado romano (I, ii, iii, IV, V, vi, vii°) con inversiones (⁶, ⁶₄, ⁶₅, ⁴₃, ⁴₂) en las 24 tonalidades mayores y menores. Sigue las convenciones de los conservatorios francófonos y anglosajones. Introduce una progresión de acordes para visualizar las funciones armónicas (tónica, subdominante, dominante) e identificar modulaciones.'},

'faq.q8':{fr:'Quels types d\'accords le dictionnaire couvre-t-il ?',en:'What types of chords does the chord dictionary cover?',es:'¿Qué tipos de acordes cubre el diccionario?'},
'faq.a8':{fr:'Le module Accords répertorie plus de 32 types d\'accords répartis en 7 catégories : triades majeures, mineures, augmentées et diminuées ; accords de septième (majeure, dominante, mineure, demi-diminuée, diminuée) ; accords de neuvième, onzième et treizième ; accords avec sixte ajoutée, sus2, sus4 et accords altérés. Chaque accord est joué en synthèse audio et affiché avec ses intervalles constitutifs.',en:'The Chords module catalogs over 32 chord types across 7 categories: major, minor, augmented, and diminished triads; seventh chords (major 7, dominant 7, minor 7, half-diminished, fully diminished); ninth, eleventh, and thirteenth chords; added sixth chords, sus2, sus4, and altered chords. Each chord is played with audio synthesis and displayed with its constituent intervals.',es:'El módulo Acordes cataloga más de 32 tipos de acordes en 7 categorías: tríadas mayor, menor, aumentada y disminuida; acordes de séptima (mayor, dominante, menor, semidisminuida, disminuida); acordes de novena, oncena y trecena; acordes con sexta añadida, sus2, sus4 y acordes alterados. Cada acorde se reproduce con síntesis de audio y se muestra con sus intervalos constitutivos.'},

'faq.q9':{fr:'Comment explorer les gammes et modes dans Contrepoint ?',en:'How do I explore scales and modes in Contrepoint?',es:'¿Cómo explorar las escalas y modos en Contrepoint?'},
'faq.a9':{fr:'Le module Modes catalogue plus de 80 gammes et modes : modes grecs (dorien, phrygien, lydien, mixolydien, aeolien, locrien), gammes pentatoniques majeures et mineures, gammes blues, gammes par tons, gammes octotoniques (diminuées), gammes jazz et modes à transpositions limitées de Messiaen. Chaque gamme affiche ses degrés, ses intervalles et ses usages stylistiques pour la composition et l\'improvisation.',en:'The Modes module catalogs over 80 scales and modes: Greek modes (Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian), major and minor pentatonic scales, blues scales, whole-tone scales, octatonic (diminished) scales, jazz scales, and Messiaen\'s modes of limited transposition. Each scale displays its degrees, intervals, and stylistic uses for composition and improvisation.',es:'El módulo Modos cataloga más de 80 escalas y modos: modos griegos (dórico, frigio, lidio, mixolidio, eólico, locrio), escalas pentatónicas mayor y menor, escalas de blues, escalas por tonos, escalas octatónicas (disminuidas), escalas de jazz y modos de transposición limitada de Messiaen. Cada escala muestra sus grados, sus intervalos y sus usos estilísticos para la composición y la improvisación.'},

'faq.q10':{fr:'Quelles cadences harmoniques sont disponibles dans Contrepoint ?',en:'What harmonic cadences are available in Contrepoint?',es:'¿Qué cadencias armónicas están disponibles en Contrepoint?'},
'faq.a10':{fr:'Le module Cadences propose 22 cadences illustrées sur grand portée SATB : cadence authentique parfaite (CAP / PAC), cadence authentique imparfaite (CAI / IAC), demi-cadence (DC / HC), cadence plagale (CP / PC), cadence rompue (CR), cadence phrygienne (CPh / Phr.), cadence évitée (CÉ / EC) et leurs variantes. Chaque cadence est nommée en français, anglais et espagnol.',en:'The Cadences module offers 22 illustrated SATB cadences on grand staff: perfect authentic cadence (PAC), imperfect authentic cadence (IAC), half cadence (HC), plagal cadence (PC), deceptive cadence (DC), Phrygian cadence (Phr.), evaded cadence (EC), and their variants. Every cadence is labeled in French, English, and Spanish.',es:'El módulo Cadencias ofrece 22 cadencias ilustradas sobre pentagramas SATB: cadencia auténtica perfecta (CAP), cadencia auténtica imperfecta (CAI), semicadencia (SC), cadencia plagal (CP), cadencia rota (CR), cadencia frigia (CFr), cadencia evitada (CE) y sus variantes. Cada cadencia está etiquetada en francés, inglés y español.'},

'faq.q11':{fr:'Quelle est la différence entre une cadence authentique parfaite et une cadence authentique imparfaite ?',en:'What is the difference between a perfect and an imperfect authentic cadence?',es:'¿Cuál es la diferencia entre una cadencia auténtica perfecta e imperfecta?'},
'faq.a11':{fr:'La cadence authentique parfaite (CAP) exige que les deux accords V–I soient en position fondamentale et que la soprano arrive sur le premier degré. La cadence authentique imparfaite (CAI) est une progression V–I dans laquelle l\'une de ces conditions n\'est pas remplie : accord en inversion, ou soprano n\'atteignant pas la tonique. La CAP crée une conclusion forte et définitive ; la CAI laisse une légère ouverture.',en:'A perfect authentic cadence (PAC) requires both V and I chords to be in root position, with the soprano arriving on scale degree 1. An imperfect authentic cadence (IAC) is a V–I progression where at least one of these conditions is not met: either the chord is inverted, or the soprano does not land on the tonic. The PAC creates a strong, conclusive ending; the IAC leaves a slight sense of continuation.',es:'La cadencia auténtica perfecta (CAP) exige que los acordes V e I estén en estado fundamental y que la soprano llegue al primer grado. La cadencia auténtica imperfecta (CAI) es una progresión V–I en la que al menos una de estas condiciones no se cumple: el acorde está invertido o la soprano no alcanza la tónica. La CAP crea un final fuerte y definitivo; la CAI deja una ligera sensación de continuación.'},

'faq.q12':{fr:'Comment utiliser les modes grecs pour la composition contemporaine ?',en:'How can Greek modes be used for contemporary composition?',es:'¿Cómo utilizar los modos griegos en la composición contemporánea?'},
'faq.a12':{fr:'Les modes grecs offrent des couleurs harmoniques distinctes pour la composition : le dorien (mineur avec sixte majeure) est utilisé dans le jazz et la folk ; le lydien (majeur avec quarte augmentée) crée un sentiment d\'élévation ou de mystère ; le mixolydien (majeur avec septième mineure) est courant dans la musique pop, rock et celtique ; le phrygien (mineur avec seconde mineure) évoque une couleur espagnole ou orientale. Contrepoint permet d\'explorer chaque mode avec sa gamme, ses intervalles et ses accords caractéristiques.',en:'The Greek modes each offer distinctive harmonic colors: Dorian (minor with a raised 6th) is widely used in jazz and folk music; Lydian (major with a raised 4th) evokes elevation and mystery; Mixolydian (major with a flatted 7th) underpins pop, rock, and Celtic music; Phrygian (minor with a flatted 2nd) carries a Spanish or Middle-Eastern quality. Contrepoint lets you explore every mode with its scale, intervals, and characteristic chords.',es:'Los modos griegos ofrecen colores armónicos distintivos: el dórico (menor con sexta mayor) se usa ampliamente en jazz y folk; el lidio (mayor con cuarta aumentada) evoca elevación y misterio; el mixolidio (mayor con séptima menor) caracteriza la música pop, rock y celta; el frigio (menor con segunda menor) tiene una cualidad española u oriental. Contrepoint permite explorar cada modo con su escala, sus intervalos y sus acordes característicos.'},

'faq.q13':{fr:'Quelles fautes d\'harmonie l\'Analyseur SATB détecte-t-il automatiquement ?',en:'What voice leading errors does the SATB Analyzer detect automatically?',es:'¿Qué errores de armonía detecta automáticamente el Analizador SATB?'},
'faq.a13':{fr:'L\'Analyseur SATB détecte : quintes parallèles (deux voix se déplaçant en quintes consécutives), octaves parallèles, octaves directes (approche par mouvement similaire vers une octave), quintes directes entre soprano et basse, croisement de voix (une voix franchit le registre d\'une autre), espacement supérieur à l\'octave entre voix adjacentes supérieures, doublure de la sensible, résolution incorrecte de la sensible (le 7e degré doit monter à l\'octave) et fausse relation de triton.',en:'The SATB Analyzer detects: parallel fifths (two voices moving in consecutive fifths), parallel octaves, direct (hidden) octaves (approaching an octave by similar motion), direct fifths between soprano and bass, voice crossing (a voice crossing into another voice\'s register), spacing greater than an octave between adjacent upper voices, doubling of the leading tone, incorrect resolution of the leading tone (the 7th degree must rise to the octave), and false relation of the tritone.',es:'El Analizador SATB detecta: quintas paralelas (dos voces moviéndose en quintas consecutivas), octavas paralelas, octavas directas (aproximación a una octava por movimiento similar), quintas directas entre soprano y bajo, cruce de voces (una voz cruza el registro de otra), espaciado mayor de una octava entre voces superiores adyacentes, duplicación de la sensible, resolución incorrecta de la sensible (el 7° grado debe subir a la octava) y falsa relación de tritono.'},

'faq.q14':{fr:'Comment saisir une progression harmonique dans l\'Analyseur SATB ?',en:'How do I enter a harmonic progression into the SATB Analyzer?',es:'¿Cómo introduzco una progresión armónica en el Analizador SATB?'},
'faq.a14':{fr:'Deux méthodes sont disponibles : (1) saisie par chiffrage romain — entrez une suite comme I–V–vi–IV dans n\'importe laquelle des 24 tonalités majeures ou mineures, et l\'analyseur génère automatiquement les voix SATB en respectant les règles de conduite des voix ; (2) saisie manuelle par drag & drop des notes sur la portée à quatre voix. L\'analyse se met à jour en temps réel avec les fautes surlignées et expliquées.',en:'Two input methods are available: (1) Roman numeral entry — type a progression such as I–V–vi–IV in any of the 24 major or minor keys and the analyzer automatically generates SATB voicings following voice leading rules; (2) manual note entry by dragging notes onto the four-voice staff. The analysis updates in real time with errors highlighted and explained.',es:'Hay dos métodos de entrada: (1) cifrado romano — escribe una progresión como I–V–vi–IV en cualquiera de las 24 tonalidades mayores o menores y el analizador genera automáticamente las voces SATB respetando las reglas de conducción de voces; (2) entrada manual arrastrando las notas sobre el pentagrama de cuatro voces. El análisis se actualiza en tiempo real con los errores resaltados y explicados.'},

'faq.q15':{fr:'Qu\'est-ce que la conduite des voix et pourquoi est-elle importante pour les compositeurs ?',en:'What is voice leading and why does it matter for composers?',es:'¿Qué es la conducción de voces y por qué es importante para los compositores?'},
'faq.a15':{fr:'La conduite des voix (voice leading) est l\'art de déplacer chaque voix d\'un accord à l\'autre de façon fluide, logique et musicalement convaincante. Les règles classiques — éviter les parallélismes de quintes et d\'octaves, résoudre correctement les dissonances, limiter les grands sauts — existent pour assurer la clarté et l\'indépendance de chaque ligne mélodique. Une bonne conduite des voix est fondamentale en écriture chorale (SATB), en orchestration, et dans les styles allant de la Renaissance au jazz.',en:'Voice leading is the craft of moving each voice from one chord to the next smoothly, logically, and musically. Classical rules — avoiding parallel fifths and octaves, resolving dissonances correctly, limiting large leaps — exist to ensure clarity and independence of each melodic line. Good voice leading is foundational in choral writing (SATB), orchestration, and styles ranging from the Renaissance to jazz.',es:'La conducción de voces es el arte de mover cada voz de un acorde al siguiente de forma fluida, lógica y musicalmente convincente. Las reglas clásicas — evitar paralelismos de quintas y octavas, resolver correctamente las disonancias, limitar los grandes saltos — garantizan la claridad e independencia de cada línea melódica. Una buena conducción de voces es fundamental en la escritura coral (SATB), la orquestación y los estilos que van del Renacimiento al jazz.'},

'faq.q16':{fr:'L\'Analyseur supporte-t-il d\'autres configurations vocales que SATB ?',en:'Does the Analyzer support voice configurations other than SATB?',es:'¿El Analizador soporta configuraciones vocales distintas de SATB?'},
'faq.a16':{fr:'Oui. En plus du quatuor classique SATB (Soprano, Alto, Ténor, Basse), l\'Analyseur propose les configurations SAB (trio mixte), SAT (voix supérieures à trois), et TTB (ténor-ténor-basse, utile pour les ensembles masculins). Le sélecteur de mode vocal T3 permet de choisir la configuration adaptée à votre ensemble avant l\'analyse.',en:'Yes. In addition to the classic SATB quartet (Soprano, Alto, Tenor, Bass), the Analyzer offers SAB (mixed trio), SAT (upper voices in three parts), and TTB (tenor–tenor–bass, useful for male ensembles). The T3 voice mode selector lets you choose the configuration that matches your ensemble before analyzing.',es:'Sí. Además del cuarteto clásico SATB (Soprano, Contralto, Tenor, Bajo), el Analizador ofrece las configuraciones SAB (trío mixto), SAT (voces superiores a tres) y TTB (tenor–tenor–bajo, útil para conjuntos masculinos). El selector de modo vocal T3 permite elegir la configuración adaptada al conjunto antes del análisis.'},

'faq.q17':{fr:'Quelles techniques de modulation sont disponibles dans Contrepoint ?',en:'What modulation techniques are available in Contrepoint?',es:'¿Qué técnicas de modulación están disponibles en Contrepoint?'},
'faq.a17':{fr:'Le module Modulation couvre 11 techniques : modulation par accord pivot (le plus courant en harmonie tonale classique), dominante secondaire (V/V, V/IV…), modulation chromatique, modulation enharmonique (Ger⁺⁶ réinterprété comme V⁷, par exemple), accord napolitain (II♭), modulation par médiante, modulation directe (sans accord pivot), modulation par pédale de basse, et d\'autres procédés harmoniques avancés utilisés de Haydn à Schoenberg.',en:'The Modulation module covers 11 techniques: pivot chord modulation (the most common in classical tonal harmony), secondary dominant (V/V, V/IV…), chromatic modulation, enharmonic modulation (e.g., Ger⁺⁶ reinterpreted as V⁷), Neapolitan chord (♭II), mediant modulation, direct modulation (no pivot chord), pedal point modulation, and other advanced harmonic procedures used from Haydn to Schoenberg.',es:'El módulo Modulación cubre 11 técnicas: modulación por acorde pivote (la más común en armonía tonal clásica), dominante secundaria (V/V, V/IV…), modulación cromática, modulación enarmónica (Ger⁺⁶ reinterpretado como V⁷), acorde napolitano (II♭), modulación mediante, modulación directa (sin acorde pivote), modulación por pedal de bajo y otros procedimientos armónicos avanzados empleados de Haydn a Schoenberg.'},

'faq.q18':{fr:'Comment fonctionne la modulation par accord pivot ?',en:'How does pivot chord modulation work?',es:'¿Cómo funciona la modulación por acorde pivote?'},
'faq.a18':{fr:'La modulation par accord pivot (ou \'common chord modulation\') utilise un accord qui appartient simultanément aux deux tonalités. Par exemple, le ré mineur (ii en do majeur) peut être réinterprété comme le vi en fa majeur. Le module Modulation de Contrepoint identifie automatiquement les accords pivots possibles entre deux tonalités choisies et génère une progression harmonique complète illustrant la transition.',en:'Pivot chord modulation (also called common chord modulation) uses a chord that belongs simultaneously to two keys. For example, D minor (ii in C major) can be reinterpreted as vi in F major. Contrepoint\'s Modulation module automatically identifies all possible pivot chords between two chosen keys and generates a complete harmonic progression illustrating the transition.',es:'La modulación por acorde pivote utiliza un acorde que pertenece simultáneamente a dos tonalidades. Por ejemplo, re menor (ii en do mayor) puede reinterpretarse como vi en fa mayor. El módulo Modulación de Contrepoint identifica automáticamente todos los acordes pivote posibles entre dos tonalidades elegidas y genera una progresión armónica completa que ilustra la transición.'},

'faq.q19':{fr:'Quelles séquences harmoniques classiques sont disponibles ?',en:'What classical harmonic sequences are available?',es:'¿Qué secuencias armónicas clásicas están disponibles?'},
'faq.a19':{fr:'Le générateur propose 51 séquences harmoniques : la Romanesca (I–V–vi–III), la séquence de Pachelbel (I–V–vi–iii–IV–I–IV–V), le Monte (progression ascendante par secondes), le Fonte (alternance majeur–mineur descendant), l\'Omnibus (séquence chromatique ascendante avec pédales), la séquence par quintes descendantes (I–IV–vii°–iii–vi–ii–V–I), et bien d\'autres. Chaque séquence est jouée en audio et exportable en chiffrage romain.',en:'The generator provides 51 harmonic sequences: the Romanesca (I–V–vi–III), the Pachelbel sequence (I–V–vi–iii–IV–I–IV–V), the Monte (ascending sequence by seconds), the Fonte (descending major–minor alternation), the Omnibus (ascending chromatic sequence with pedals), the descending fifths sequence (I–IV–vii°–iii–vi–ii–V–I), and many more. Each sequence is played with audio and can be exported in Roman numeral notation.',es:'El generador proporciona 51 secuencias armónicas: la Romanesca (I–V–vi–III), la secuencia de Pachelbel (I–V–vi–iii–IV–I–IV–V), el Monte (secuencia ascendente por segundas), el Fonte (alternancia descendente mayor–menor), el Omnibus (secuencia cromática ascendente con pedales), la secuencia de quintas descendentes (I–IV–vii°–iii–vi–ii–V–I), y muchas más. Cada secuencia se reproduce en audio y puede exportarse en cifrado romano.'},

'faq.q20':{fr:'Comment utiliser les séquences harmoniques pour composer ?',en:'How can harmonic sequences be used for composing?',es:'¿Cómo usar las secuencias armónicas para componer?'},
'faq.a20':{fr:'Les séquences harmoniques sont des structures répétitives qui forment l\'ossature de nombreuses pièces baroques, classiques, romantiques et contemporaines. Dans Contrepoint, choisissez une tonalité, sélectionnez une séquence, et le générateur produit la progression complète avec les accords en chiffrage romain, les options de voix SATB, et la lecture audio. Vous pouvez les utiliser comme point de départ pour une composition, un arrangement ou un exercice d\'harmonie.',en:'Harmonic sequences are repetitive structures that form the backbone of countless Baroque, Classical, Romantic, and contemporary works. In Contrepoint, choose a key, select a sequence, and the generator produces the full progression with Roman numeral chords, SATB voicing options, and audio playback. Use them as a starting point for a composition, arrangement, or harmony exercise.',es:'Las secuencias armónicas son estructuras repetitivas que forman la columna vertebral de innumerables obras barrocas, clásicas, románticas y contemporáneas. En Contrepoint, elige una tonalidad, selecciona una secuencia y el generador produce la progresión completa con acordes en cifrado romano, opciones de voces SATB y reproducción de audio. Úsalas como punto de partida para una composición, un arreglo o un ejercicio de armonía.'},

'faq.q21':{fr:'Quelles formes musicales sont disponibles dans le constructeur ?',en:'What musical forms are available in the form builder?',es:'¿Qué formas musicales ofrece el constructor?'},
'faq.a21':{fr:'Le module Formes musicales propose 21 formes de référence : forme sonate (exposition–développement–réexposition), rondo (A–B–A–C–A), rondo sonate, forme lied binaire (A–B) et ternaire (A–B–A), da capo aria, fugue (sujet–réponse–strette–coda), suite baroque, passacaille et chaconne, thème et variations, forme arch (A–B–C–B–A), structures modales et formes libres contemporaines.',en:'The Musical Forms module offers 21 reference forms: sonata form (exposition–development–recapitulation), rondo (A–B–A–C–A), sonata rondo, binary lied (A–B), ternary lied (A–B–A), da capo aria, fugue (subject–answer–stretto–coda), Baroque suite, passacaglia and chaconne, theme and variations, arch form (A–B–C–B–A), modal structures, and contemporary open forms.',es:'El módulo Formas musicales ofrece 21 formas de referencia: forma sonata (exposición–desarrollo–recapitulación), rondó (A–B–A–C–A), rondó sonata, forma lied binaria (A–B) y ternaria (A–B–A), aria da capo, fuga (sujeto–respuesta–stretto–coda), suite barroca, passacaglia y chacona, tema con variaciones, forma arco (A–B–C–B–A), estructuras modales y formas libres contemporáneas.'},

'faq.q22':{fr:'Comment utiliser le module Formes pour analyser une œuvre musicale ?',en:'How do I use the Forms module to analyze a musical work?',es:'¿Cómo uso el módulo Formas para analizar una obra musical?'},
'faq.a22':{fr:'Sélectionnez la forme correspondant à l\'œuvre analysée, puis renseignez les sections avec les tonalités, les thèmes et les numéros de mesures. Le module génère un schéma visuel de la structure avec les relations tonales entre les sections. Idéal pour préparer une analyse au conservatoire, rédiger un programme de concert ou structurer votre propre composition.',en:'Select the form that matches the work being analyzed, then fill in each section with its key, theme, and measure numbers. The module generates a visual diagram of the structure with tonal relationships between sections. Ideal for preparing a conservatory analysis, writing concert program notes, or structuring your own composition.',es:'Selecciona la forma correspondiente a la obra analizada, luego completa cada sección con la tonalidad, el tema y los números de compás. El módulo genera un diagrama visual de la estructura con las relaciones tonales entre secciones. Ideal para preparar un análisis de conservatorio, redactar notas de programa de concierto o estructurar tu propia composición.'},

'faq.q23':{fr:'Les outils sont-ils utilisables sans connexion Internet ?',en:'Can the tools be used without an Internet connection?',es:'¿Se pueden usar las herramientas sin conexión a Internet?'},
'faq.a23':{fr:'Une fois la page chargée, l\'application fonctionne entièrement hors ligne : tous les calculs (transposition, analyse harmonique, génération SATB, synthèse audio piano) s\'exécutent dans le navigateur sans serveur. Une connexion est requise uniquement pour le premier chargement et pour l\'activation du Mode compositeur. Contrepoint est une Progressive Web App (PWA) installable sur mobile et desktop.',en:'Once the page has loaded, the application runs entirely offline: all calculations (transposition, harmonic analysis, SATB generation, piano audio synthesis) execute in the browser with no server required. An Internet connection is only needed for the initial load and to activate Composer Mode. Contrepoint is a Progressive Web App (PWA) installable on both mobile and desktop.',es:'Una vez cargada la página, la aplicación funciona completamente sin conexión: todos los cálculos (transposición, análisis armónico, generación SATB, síntesis de audio de piano) se ejecutan en el navegador sin servidor. Solo se requiere conexión para la carga inicial y para activar el Modo compositor. Contrepoint es una Progressive Web App (PWA) instalable en móvil y escritorio.'},

'faq.q24':{fr:'Mes données et compositions sont-elles privées ?',en:'Is my data and compositions private?',es:'¿Son privados mis datos y composiciones?'},
'faq.a24':{fr:'Oui. Toutes les données (compositions dans le module Formes, préférences, état des outils) sont stockées localement dans votre navigateur via localStorage. Aucune donnée n\'est envoyée à un serveur. Aucun traceur publicitaire n\'est utilisé. Contrepoint est conforme au RGPD et à la Loi 25 du Québec.',en:'Yes. All data (compositions in the Forms module, preferences, tool state) is stored locally in your browser via localStorage. No data is sent to a server. No advertising trackers are used. Contrepoint is compliant with GDPR and Quebec\'s Law 25.',es:'Sí. Todos los datos (composiciones en el módulo Formas, preferencias, estado de las herramientas) se almacenan localmente en tu navegador mediante localStorage. No se envía ningún dato a un servidor. No se utilizan rastreadores publicitarios. Contrepoint cumple con el RGPD y la Ley 25 de Quebec.'},

'faq.q25':{fr:'Contrepoint est-il adapté aux étudiants en conservatoire ?',en:'Is Contrepoint suitable for conservatory students?',es:'¿Es Contrepoint adecuado para estudiantes de conservatorio?'},
'faq.a25':{fr:'Absolument. Contrepoint est conçu pour suivre les curricula des conservatoires francophones et anglo-saxons : chiffrage romain standard avec inversions, nomenclature des cadences conforme aux manuels de référence (Aldwell–Schachter, Dubois, Koechlin), analyse SATB selon les règles du contrepoint strict, et couverture de toutes les techniques de modulation au programme de l\'harmonie supérieure. L\'interface trilingue permet de travailler en français, en anglais ou en espagnol.',en:'Absolutely. Contrepoint is designed to follow the curricula of both French-language and English-language conservatories: standard Roman numeral notation with inversions, cadence nomenclature aligned with reference textbooks (Aldwell–Schachter, Aldwell–Cadwallader, Koechlin, Dubois), SATB analysis following strict counterpoint rules, and full coverage of all modulation techniques taught in advanced harmony courses. The trilingual interface allows work in French, English, or Spanish.',es:'Absolutamente. Contrepoint está diseñado para seguir los planes de estudio de los conservatorios francófonos y anglosajones: cifrado romano estándar con inversiones, nomenclatura de cadencias conforme a los manuales de referencia (Aldwell–Schachter, Koechlin, Dubois), análisis SATB según las reglas del contrapunto estricto y cobertura completa de todas las técnicas de modulación del programa de armonía superior. La interfaz trilingüe permite trabajar en francés, inglés o español.'},

'faq.aria_toggle':{fr:'Afficher/masquer la réponse',en:'Show/hide the answer',es:'Mostrar/ocultar la respuesta'},
'footer.share_lbl':{fr:'Partager :',en:'Share:',es:'Compartir:'},
'share.title':{fr:'Partager Contrepoint',en:'Share Contrepoint',es:'Compartir Contrepoint'},
'share.sub':{fr:'Aidez d\'autres musiciens à découvrir ces outils gratuits de théorie musicale.',en:'Help other musicians discover these free music theory tools.',es:'Ayuda a otros músicos a descubrir estas herramientas gratuitas de teoría musical.'},
'share.copy_btn':{fr:'Copier',en:'Copy',es:'Copiar'},
'share.copy_lbl':{fr:'Copier',en:'Copy',es:'Copiar'},
'share.copied':{fr:'Lien copié !',en:'Link copied!',es:'¡Enlace copiado!'},
'share.text':{fr:'Contrepoint — Outils interactifs de théorie musicale pour musiciens, étudiants, compositeurs et chefs d\'orchestre. Transposeur, harmonie, cadences, modulation, analyse SATB et plus.',en:'Contrepoint — Interactive music theory tools for musicians, students, composers and conductors. Transposer, harmony, cadences, modulation, SATB analyzer and more.',es:'Contrepoint — Herramientas interactivas de teoría musical para músicos, estudiantes, compositores y directores. Transpositor, armonía, cadencias, modulación, analizador SATB y más.'},
'home.free_label':{fr:'ACCÈS LIBRE',en:'FREE ACCESS',es:'ACCESO GRATUITO'},
'home.free_title':{fr:'8 outils essentiels pour la théorie musicale — 100% gratuits',en:'8 essential music theory tools — 100% free',es:'8 herramientas esenciales de teoría musical — 100% gratis'},
'home.prem_label':{fr:'MODE COMPOSITEUR',en:'COMPOSER MODE',es:'MODO COMPOSITOR'},
'home.prem_title':{fr:'Outils avancés pour la composition, la modulation et l\'analyse harmonique',en:'Advanced tools for composition, modulation & harmonic analysis',es:'Herramientas avanzadas para la composición, modulación y análisis armónico'},
'home.prem_sub':{fr:'Quatre modules professionnels pour composer, moduler, analyser et structurer vos œuvres — du conservatoire à la salle de concert. Pensé pour les étudiants, professeurs et compositeurs exigeants.',en:'Four professional modules to compose, modulate, analyze and structure your works — from the conservatory to the concert hall. Designed for demanding students, teachers and composers.',es:'Cuatro módulos profesionales para componer, modular, analizar y estructurar vuestras obras — del conservatorio a la sala de conciertos. Diseñado para estudiantes, profesores y compositores exigentes.'},
/* (anciennes clés home.prem_title et home.prem_sub remplacées plus haut) */
/* === Composer Mode (cm.*) === */
'cm.stat_1':{fr:'21 formes musicales référencées',en:'21 reference musical forms',es:'21 formas musicales referenciadas'},
'cm.stat_2':{fr:'51 séquences harmoniques',en:'51 harmonic sequences',es:'51 secuencias armónicas'},
'cm.stat_3':{fr:'11 techniques de modulation',en:'11 modulation techniques',es:'11 técnicas de modulación'},
'cm.stat_4':{fr:'Vérification SATB automatique',en:'Automatic SATB checking',es:'Verificación SATB automática'},
'cm.tag_forme':{fr:'Architecture & structure',en:'Architecture & structure',es:'Arquitectura y estructura'},
'cm.tag_mod':{fr:'Tonalités & pivots',en:'Keys & pivots',es:'Tonalidades y pivotes'},
'cm.tag_seq':{fr:'Marches & modèles',en:'Patterns & models',es:'Marchas y modelos'},
'cm.tag_anal':{fr:'Voix SATB & règles',en:'SATB voices & rules',es:'Voces SATB y reglas'},
'cm.b_forme_1':{fr:'21 formes de référence (sonate, rondo, fugue, suite…)',en:'21 reference forms (sonata, rondo, fugue, suite…)',es:'21 formas de referencia (sonata, rondó, fuga, suite…)'},
'cm.b_forme_2':{fr:'40+ types de sections, drag & drop intuitif',en:'40+ section types, intuitive drag & drop',es:'40+ tipos de secciones, drag & drop intuitivo'},
'cm.b_forme_3':{fr:'Export PDF prêt pour le conservatoire',en:'Conservatory-ready PDF export',es:'Exportación PDF lista para el conservatorio'},
'cm.b_mod_1':{fr:'11 techniques (pivot, Ger⁺⁶, napolitain, double mod…)',en:'11 techniques (pivot, Ger⁺⁶, Neapolitan, double mod…)',es:'11 técnicas (pivote, Ger⁺⁶, napolitano, mod. doble…)'},
'cm.b_mod_2':{fr:'Visualisation sur le cercle des quintes',en:'Circle of fifths visualization',es:'Visualización en el círculo de quintas'},
'cm.b_mod_3':{fr:'Audio piano réaliste à 4 voix',en:'Realistic 4-voice piano audio',es:'Audio de piano realista a 4 voces'},
'cm.b_seq_1':{fr:'8 catégories : quintes, tierces, secondes, sixtes…',en:'8 categories: fifths, thirds, seconds, sixths…',es:'8 categorías: quintas, terceras, segundas, sextas…'},
'cm.b_seq_2':{fr:'Édition SATB drag & drop sur portée',en:'SATB drag & drop editing on staff',es:'Edición SATB drag & drop en pentagrama'},
'cm.b_seq_3':{fr:'Modèles répertoriés (Pachelbel, Omnibus, Ponte…)',en:'Catalogued models (Pachelbel, Omnibus, Ponte…)',es:'Modelos catalogados (Pachelbel, Omnibus, Ponte…)'},
'cm.b_anal_1':{fr:'Quintes/octaves parallèles & directes détectées',en:'Parallel & direct fifths/octaves detected',es:'Quintas/octavas paralelas y directas detectadas'},
'cm.b_anal_2':{fr:'Croisement, doublures, résolution de la sensible',en:'Voice crossing, doubling, leading-tone resolution',es:'Cruzamiento, duplicaciones, resolución de la sensible'},
'cm.b_anal_3':{fr:'Saisie par chiffrage romain ou drag & drop',en:'Roman numeral input or drag & drop',es:'Entrada por cifrado romano o drag & drop'},
'cm.cta_tagline':{fr:'<strong>Achat unique</strong> · Accès à vie · Mises à jour incluses',en:'<strong>One-time purchase</strong> · Lifetime access · Updates included',es:'<strong>Compra única</strong> · Acceso de por vida · Actualizaciones incluidas'},
'cm.cta_note':{fr:'Pas d\'abonnement · Annulation impossible (rien à annuler) · 30 jours satisfait ou remboursé',en:'No subscription · No cancellation needed · 30-day money-back guarantee',es:'Sin suscripción · Sin necesidad de cancelar · 30 días de garantía de devolución'},
'home.price_text':{fr:'Achat unique — Accès à vie — Pas d\'abonnement',en:'One-time purchase — Lifetime access — No subscription',es:'Compra única — Acceso de por vida — Sin suscripción'},
'home.cta_unlock':{fr:'Débloquer le mode compositeur',en:'Unlock Composer Mode',es:'Desbloquear el modo compositor'},
'home.rights':{fr:'Tous droits réservés.',en:'All rights reserved.',es:'Todos los derechos reservados.'},
'home.cgv_link':{fr:'Mentions légales et conditions de vente',en:'Legal Notices & Terms',es:'Aviso legal y condiciones de venta'},
'home.contact_link':{fr:'Nous contacter',en:'Contact Us',es:'Contactar'},

/* ═══ CGV / Mentions légales Modal ═══ */
'cgv.title':{fr:'Mentions légales et conditions de vente',en:'Legal Notices & Terms of Sale',es:'Aviso legal y condiciones de venta'},
'cgv.h_editor':{fr:'Éditeur',en:'Publisher',es:'Editor'},
'cgv.editor':{fr:'Contrepoint est un projet indépendant développé au Québec, Canada. Contact : via le formulaire de contact disponible sur ce site.',en:'Contrepoint is an independent project developed in Quebec, Canada. Contact: via the contact form on this site.',es:'Contrepoint es un proyecto independiente desarrollado en Quebec, Canadá. Contacto: mediante el formulario de contacto disponible en este sitio.'},
'cgv.h_host':{fr:'Hébergement',en:'Hosting',es:'Alojamiento'},
'cgv.host':{fr:'Le site est hébergé sur Netlify (Netlify Inc., 44 Montgomery St, Suite 300, San Francisco, CA 94104, USA).',en:'The site is hosted on Netlify (Netlify Inc., 44 Montgomery St, Suite 300, San Francisco, CA 94104, USA).',es:'El sitio está alojado en Netlify (Netlify Inc., 44 Montgomery St, Suite 300, San Francisco, CA 94104, USA).'},
'cgv.h_ip':{fr:'Propriété intellectuelle',en:'Intellectual Property',es:'Propiedad intelectual'},
'cgv.ip':{fr:'L\'ensemble du contenu de ce site (textes, interface, code, design) est protégé par le droit d\'auteur. Toute reproduction sans autorisation est interdite.',en:'All content on this site (texts, interface, code, design) is protected by copyright. Any reproduction without authorization is prohibited.',es:'Todo el contenido de este sitio (textos, interfaz, código, diseño) está protegido por derechos de autor. Queda prohibida cualquier reproducción sin autorización.'},
'cgv.h_sale':{fr:'Conditions de vente — Mode compositeur',en:'Terms of Sale — Composer Mode',es:'Condiciones de venta — Modo compositor'},
'cgv.sale_1':{fr:'Le Mode compositeur est vendu sous forme d\'achat unique donnant un accès à vie, sans abonnement. Le prix est affiché au moment de l\'achat sur la page de paiement LemonSqueezy.',en:'Composer Mode is sold as a one-time purchase granting lifetime access, with no subscription. The price is displayed at the time of purchase on the LemonSqueezy payment page.',es:'El Modo compositor se vende como una compra única que otorga acceso de por vida, sin suscripción. El precio se muestra en el momento de la compra en la página de pago de LemonSqueezy.'},
'cgv.sale_2':{fr:'Conformément à la Loi sur la protection du consommateur du Québec (LPC), une garantie de remboursement de 30 jours est offerte si vous n\'êtes pas satisfait. Pour toute demande, utilisez le formulaire de contact en précisant votre numéro de commande.',en:'In accordance with the Quebec Consumer Protection Act (CPA), a 30-day money-back guarantee is offered if you are not satisfied. For any request, use the contact form and include your order number.',es:'De conformidad con la Ley de protección al consumidor de Quebec (LPC), se ofrece una garantía de devolución de 30 días si no está satisfecho. Para cualquier solicitud, utilice el formulario de contacto indicando su número de pedido.'},
'cgv.sale_3':{fr:'Les paiements sont traités par LemonSqueezy (A Stripe Company). Contrepoint ne stocke aucune donnée de carte bancaire.',en:'Payments are processed by LemonSqueezy (A Stripe Company). Contrepoint does not store any payment card data.',es:'Los pagos son procesados por LemonSqueezy (A Stripe Company). Contrepoint no almacena ningún dato de tarjeta bancaria.'},
'cgv.h_privacy':{fr:'Données personnelles & confidentialité',en:'Personal Data & Privacy',es:'Datos personales y privacidad'},
'cgv.privacy':{fr:'Aucune donnée personnelle n\'est collectée lors de l\'utilisation des outils gratuits. Toutes les préférences et compositions sont stockées localement dans votre navigateur (localStorage). Conforme au RGPD et à la Loi 25 du Québec.',en:'No personal data is collected when using the free tools. All preferences and compositions are stored locally in your browser (localStorage). GDPR and Quebec Law 25 compliant.',es:'No se recogen datos personales al usar las herramientas gratuitas. Todas las preferencias y composiciones se almacenan localmente en su navegador (localStorage). Conforme con el RGPD y la Ley 25 de Quebec.'},
'cgv.privacy_2':{fr:'En cas d\'achat, votre adresse courriel est transmise à LemonSqueezy uniquement pour la livraison de la clé de licence et les communications liées à votre commande.',en:'In the event of a purchase, your email address is transmitted to LemonSqueezy solely for delivery of the license key and order-related communications.',es:'En caso de compra, su dirección de correo electrónico se transmite a LemonSqueezy únicamente para la entrega de la clave de licencia y las comunicaciones relacionadas con su pedido.'},
'cgv.h_cookies':{fr:'Cookies & analytique',en:'Cookies & Analytics',es:'Cookies y analítica'},
'cgv.cookies':{fr:'Ce site utilise Google Analytics (gtag.js) pour mesurer l\'audience de façon anonyme. Aucun cookie publicitaire ou tracker tiers n\'est utilisé.',en:'This site uses Google Analytics (gtag.js) to measure audience anonymously. No advertising cookie or third-party tracker is used.',es:'Este sitio utiliza Google Analytics (gtag.js) para medir la audiencia de forma anónima. No se utiliza ninguna cookie publicitaria ni rastreador de terceros.'},
'cgv.h_law':{fr:'Droit applicable',en:'Governing Law',es:'Legislación aplicable'},
'cgv.law':{fr:'Ces conditions sont régies par les lois en vigueur au Québec, Canada.',en:'These terms are governed by the laws in force in Quebec, Canada.',es:'Estas condiciones se rigen por las leyes vigentes en Quebec, Canadá.'},
'home.beta_tag':{fr:'Bêta publique',en:'Public beta',es:'Beta pública'},
'home.beta_msg':{fr:'— l\'appli s\'améliore chaque semaine. Trouvé un bug ou une suggestion\u00a0?',en:'— the app improves every week. Found a bug or have a suggestion?',es:'— la app mejora cada semana. ¿Habéis encontrado un bug o tenéis alguna sugerencia?'},
'home.beta_link':{fr:'Nous écrire',en:'Contact us',es:'Escríbenos'},
'home.video_label':{fr:'Découvrir',en:'Discover',es:'Descubrir'},
'home.stat_tools':{fr:'Outils',en:'Tools',es:'Herramientas'},
'home.stat_cad':{fr:'Cadences',en:'Cadences',es:'Cadencias'},
'home.stat_scales':{fr:'Gammes',en:'Scales',es:'Escalas'},
'home.stat_seq':{fr:'Séquences',en:'Sequences',es:'Secuencias'},
'home.video_title':{fr:'Voir Contrepoint en action',en:'See Contrepoint in action',es:'Mira Contrepoint en acción'},
'home.video_sub':{fr:'Une présentation rapide des outils et de l\'expérience musicale interactive.',en:'A quick overview of the tools and the interactive musical experience.',es:'Una presentación rápida de las herramientas y de la experiencia musical interactiva.'},
'home.don_title':{fr:'Vous trouvez Contrepoint utile ?',en:'Do you find Contrepoint useful?',es:'¿Os resulta útil Contrepoint?'},
'home.don_desc':{fr:'Ce projet est développé avec passion par un musicien indépendant. Si ces outils vous aident dans votre pratique ou vos études, un petit don permet de financer les mises à jour, les nouvelles fonctionnalités et de garder les outils de base gratuits pour tous.',en:'This project is built with passion by an independent musician. If these tools help with your practice or studies, a small donation helps fund updates, new features, and keeps the core tools free for everyone.',es:'Este proyecto está desarrollado con pasión por un músico independiente. Si estas herramientas os ayudan en vuestra práctica o en vuestros estudios, una pequeña donación permite financiar las actualizaciones, las nuevas funcionalidades y mantener gratuitas las herramientas básicas para todos.'},
'home.don_btn':{fr:'☕ Offrir un café',en:'☕ Buy a coffee',es:'☕ Invitar a un café'},
'home.don_footer':{fr:'☕ Faire un don',en:'☕ Make a donation',es:'☕ Hacer una donación'},
'home.c_transpo':{fr:'Transposeur d\'instruments',en:'Instrument Transposer',es:'Transpositor de instrumentos'},
'home.c_transpo_d':{fr:'Transposez instantanément entre note écrite et note réelle pour plus de 40 instruments (clarinette, cor, saxophone, trompette…). Visualisez la tessiture de chaque instrument sur une portée interactive avec code couleur.',en:'Instantly transpose between written and concert pitch for 40+ instruments (clarinet, horn, saxophone, trumpet…). Visualize each instrument\'s range on an interactive staff with color-coded feedback.',es:'Transponed al instante entre nota escrita y nota real para más de 40 instrumentos (clarinete, trompa, saxofón, trompeta…). Visualizad la tesitura de cada instrumento en un pentagrama interactivo con código de colores.'},
'home.c_inter':{fr:'Calculateur d\'intervalles',en:'Interval Calculator',es:'Calculadora de intervalos'},
'home.c_inter_d':{fr:'Identifiez et calculez tous les intervalles musicaux — ascendants, descendants, simples et composés. Clavier interactif de deux octaves avec grille complète des intervalles et écoute audio.',en:'Identify and calculate every musical interval — ascending, descending, simple and compound. Two-octave interactive keyboard with full interval grid and audio playback.',es:'Identificad y calculad todos los intervalos musicales — ascendentes, descendentes, simples y compuestos. Teclado interactivo de dos octavas con cuadrícula completa de intervalos y reproducción de audio.'},
'home.c_harm':{fr:'Analyse harmonique',en:'Harmonic Analysis',es:'Análisis armónico'},
'home.c_harm_d':{fr:'Explorez l\'harmonie tonale dans toutes les tonalités : triades diatoniques, accords de septième, mixture modale, dominantes secondaires, sixtes augmentées (It6, Fr6, Ger6) et accord napolitain. Écoute et visualisation sur clavier.',en:'Explore tonal harmony in every key: diatonic triads, seventh chords, modal mixture, secondary dominants, augmented sixths (It6, Fr6, Ger6), and Neapolitan chord. Audio playback and keyboard visualization.',es:'Explorad la armonía tonal en todas las tonalidades: tríadas diatónicas, acordes de séptima, mixtura modal, dominantes secundarias, sextas aumentadas (It6, Fr6, Ger6) y acorde napolitano. Audio y visualización en teclado.'},
'home.c_cad':{fr:'Cadences',en:'Cadences',es:'Cadencias'},
'home.c_cad_d':{fr:'Référence complète de toutes les cadences tonales : parfaite (CAP), imparfaite (CAI), demi-cadence (DC), plagale (CP), rompue (CR), phrygienne (CPh) et cadence évitée (CÉ). Progressions d\'accords avec chiffrage, écoute audio et résolutions types dans les modes majeur et mineur.',en:'Complete reference of all tonal cadences: perfect authentic (PAC), imperfect authentic (IAC), half cadence (HC), plagal (PC), deceptive (DC), Phrygian, and evaded cadence (EC). Chord progressions with Roman numeral analysis, audio playback, and standard resolutions in major and minor modes.',es:'Referencia completa de todas las cadencias tonales: auténtica perfecta (CAP), auténtica imperfecta (CAI), semicadencia (SC), plagal (CP), rota (CR), frigia (CFr) y cadencia evitada (CE). Progresiones de acordes con cifrado, audio y resoluciones tipo en los modos mayor y menor.'},
'home.c_chords':{fr:'Dictionnaire d\'accords',en:'Chord Dictionary',es:'Diccionario de acordes'},
'home.c_chords_d':{fr:'Encyclopédie complète des accords : majeurs, mineurs, diminués, augmentés, 7èmes, 9èmes, sus, add, et bien plus. Chaque accord avec écoute, arpège, visualisation clavier et formule d\'intervalles.',en:'Complete chord encyclopedia: major, minor, diminished, augmented, 7ths, 9ths, sus, add, and more. Every chord with audio playback, arpeggio, keyboard visualization, and interval formula.',es:'Enciclopedia completa de acordes: mayores, menores, disminuidos, aumentados, séptimas, novenas, sus, add y muchos más. Cada acorde con audio, arpegio, visualización en teclado y fórmula de intervalos.'},
'home.c_modes':{fr:'Gammes et modes',en:'Modes',es:'Escalas y modos'},
'home.c_modes_d':{fr:'Parcourez toutes les gammes et modes : majeur, mineur (naturel, harmonique, mélodique), modes grecs, gammes pentatoniques, blues, diminuée, par tons, et plus. Avec formule, écoute ascendante/descendante et clavier interactif.',en:'Browse every scale and mode: major, minor (natural, harmonic, melodic), Greek modes, pentatonic, blues, diminished, whole-tone, and more. With formula, ascending/descending playback, and interactive keyboard.',es:'Recorred todas las escalas y modos: mayor, menor (natural, armónica, melódica), modos griegos, escalas pentatónicas, blues, disminuida, hexáfona y más. Con fórmula, escucha ascendente/descendente y teclado interactivo.'},
'home.c_metro':{fr:'Métronome professionnel',en:'Professional Metronome',es:'Metrónomo profesional'},
'home.c_metro_d':{fr:'Métronome haute précision avec tap tempo, accents configurables par temps, subdivisions (croches, triolets, doubles), indicateur visuel de battement et contrôle de tempo au BPM près.',en:'High-precision metronome with tap tempo, configurable beat accents, subdivisions (eighths, triplets, sixteenths), visual beat indicator, and fine-grained BPM tempo control.',es:'Metrónomo de alta precisión con tap tempo, acentos configurables por pulso, subdivisiones (corcheas, tresillos, semicorcheas), indicador visual del pulso y control fino del tempo en BPM.'},
'home.c_rhythm':{fr:'Figures rythmiques',en:'Rhythmic Figures',es:'Figuras rítmicas'},
'home.c_rhythm_d':{fr:'Apprenez et visualisez les figures rythmiques : rondes, blanches, noires, croches, doubles, triples, pointées, liaisons. Mesures simples et composées avec écoute audio.',en:'Learn and visualize rhythmic figures: whole, half, quarter, eighth, sixteenth notes, dotted rhythms, ties. Simple and compound time signatures with audio playback.',es:'Aprended y visualizad las figuras rítmicas: redondas, blancas, negras, corcheas, semicorcheas, fusas, puntillos y ligaduras. Compases simples y compuestos con audio.'},
'home.c_forme':{fr:'Créateur de formes musicales',en:'Musical Form Builder',es:'Constructor de formas musicales'},
'home.c_forme_d':{fr:'Construisez l\'architecture de vos compositions : forme sonate, rondo, ABA, couplet-refrain, forme libre. Définissez les mouvements, sections, tonalités, tempos et cadences. Visualisez la timeline complète et exportez en PDF.',en:'Build the architecture of your compositions: sonata form, rondo, ABA, verse-chorus, free form. Define movements, sections, keys, tempos, and cadences. Visualize the full timeline and export to PDF.',es:'Construid la arquitectura de vuestras composiciones: forma sonata, rondó, ABA, copla-estribillo, forma libre. Definid los movimientos, secciones, tonalidades, tempos y cadencias. Visualizad la línea de tiempo completa y exportad a PDF.'},
'home.c_mod':{fr:'Outil de modulation',en:'Modulation Tool',es:'Herramienta de modulación'},
'home.c_mod_d':{fr:'Trouvez comment moduler entre n\'importe quelles tonalités. Accords pivots avec double analyse, modulation diatonique, chromatique, par dominante secondaire, enharmonique. Visualisation sur le cercle des quintes.',en:'Find how to modulate between any keys. Pivot chords with dual analysis, diatonic, chromatic, secondary dominant, and enharmonic modulation. Circle of fifths visualization.',es:'Encuentra cómo modular entre cualesquiera tonalidades. Acordes pivote con doble análisis, modulación diatónica, cromática, por dominante secundaria, enarmónica. Visualización en el círculo de quintas.'},
'home.c_seq':{fr:'Générateur de séquences',en:'Sequence Generator',es:'Generador de secuencias'},
'home.c_seq_d':{fr:'Générez et écoutez des séquences harmoniques : marches de quintes, tierces, secondes, Pachelbel, Romanesca, Monte, Fonte, séquences de cadences, séquences chromatiques (Omnibus, échange de voix) et plus de 35 modèles.',en:'Generate and listen to harmonic sequences: circle of fifths, thirds, seconds, Pachelbel, Romanesca, Monte, Fonte, cadential sequences, chromatic sequences (Omnibus, voice exchange), and 35+ models.',es:'Generad y escuchad secuencias armónicas: marchas de quintas, terceras, segundas, Pachelbel, Romanesca, Monte, Fonte, secuencias cadenciales, secuencias cromáticas (Omnibus, intercambio de voces) y más de 35 modelos.'},
'home.c_anal':{fr:'Analyseur et vérificateur harmonique',en:'Harmonic Analyzer & Voice Leading Checker',es:'Analizador y verificador armónico'},
'home.c_anal_d':{fr:'Composez à 4 voix (SATB) sur une portée interactive avec drag & drop. Vérification automatique des règles de conduite des voix : quintes/octaves parallèles, croisement, résolution de la sensible, doublures. Export PDF et MIDI.',en:'Compose in 4 voices (SATB) on an interactive drag & drop staff. Automatic voice leading rule checking: parallel fifths/octaves, voice crossing, leading tone resolution, doubling rules. PDF and MIDI export.',es:'Componed a 4 voces (SATB) en un pentagrama interactivo con drag & drop. Verificación automática de las reglas de conducción de las voces: quintas/octavas paralelas, cruzamiento, resolución de la sensible, duplicaciones. Exportación a PDF y MIDI.'},
logo:{fr:'Contrepoint',en:'Contrepoint',es:'Contrepoint'},
lbl_written_note:{fr:'Note écrite sur la partition',en:'Written note on the score',es:'Nota escrita en el pentagrama'},
lbl_concert_note:{fr:'Note réelle (son entendu)',en:'Concert pitch (sounding note)',es:'Nota real (sonido oído)'},
lbl_clef_ref:{fr:'Référence des notes',en:'Note Reference',es:'Referencia de las notas'},
lbl_middle_c:{fr:'Do central',en:'Middle C',es:'Do central'},
h_instr:{fr:'Sélectionnez un instrument pour voir la transposition',en:'Select an instrument to see the transposition',es:'Selecciona un instrumento para ver la transposición'},
lbl_written:{fr:'Note écrite',en:'Written Note',es:'Nota escrita'},
lbl_concert:{fr:'Note réelle (concert)',en:'Concert Pitch',es:'Nota real (concertina)'},
lbl_octave:{fr:'octave',en:'octave',es:'octava'},
lbl_range:{fr:'TESSITURE',en:'RANGE',es:'TESITURA'},
rng_in:{fr:'Dans la tessiture',en:'In range',es:'Dentro de la tesitura'},
rng_out:{fr:'Hors tessiture',en:'Out of range',es:'Fuera de la tesitura'},
rng_lim:{fr:'Zone limite',en:'Borderline',es:'Zona límite'},
h_none:{fr:'Aucun résultat',en:'No results',es:'Ningún resultado'},
h_sym:{fr:'Sélectionner un symbole ci-dessous',en:'Select a symbol below',es:'Selecciona un símbolo abajo'},
h_sym_err:{fr:'Symbole non reconnu',en:'Symbol not recognized',es:'Símbolo no reconocido'},
h_scale:{fr:'Sélectionnez une gamme pour voir le détail',en:'Select a scale to see details',es:'Selecciona una escala para ver el detalle'},
h_chord:{fr:'Sélectionner un accord ci-dessous',en:'Select a chord below',es:'Selecciona un acorde abajo'},
ks0:{fr:'Aucune altération',en:'No accidentals',es:'Sin alteraciones'},
ks_s:{fr:'dièse',en:'sharp',es:'sostenido'},ks_ss:{fr:'dièses',en:'sharps',es:'sostenidos'},
ks_f:{fr:'bémol',en:'flat',es:'bemol'},ks_ff:{fr:'bémols',en:'flats',es:'bemoles'},
major:{fr:'majeur',en:'major',es:'mayor'},minor:{fr:'mineur',en:'minor',es:'menor'},
Major:{fr:'Majeur',en:'Major',es:'Mayor'},Minor:{fr:'Mineur',en:'Minor',es:'Menor'},
c_dt:{fr:'Triades diatoniques',en:'Diatonic Triads',es:'Tríadas diatónicas'},
c_7:{fr:'Accords de septième',en:'Seventh Chords',es:'Acordes de séptima'},
c_mix:{fr:'Mixture modale',en:'Modal Mixture',es:'Mixtura modal'},
c_sec:{fr:'Dominantes secondaires',en:'Secondary Dominants',es:'Dominantes secundarias'},
c_a6:{fr:'Sixtes augmentées',en:'Augmented Sixths',es:'Sextas aumentadas'},
c_alt:{fr:'Altération',en:'Alteration',es:'Alteración'},c_alts:{fr:'Altérations',en:'Alterations',es:'Alteraciones'},
t_sym:{fr:'Symbole',en:'Symbol',es:'Símbolo'},
cl_a:{fr:"Clé d'alto",en:'Alto Clef'},cl_t:{fr:'Clé de ténor',en:'Tenor Clef',es:'Clave de do en 4ª'},
cl_as:{fr:'Ut 3ᵉ ligne · Do central = 3ᵉ ligne',en:'C 3rd line · Middle C = 3rd line',es:'Do en 3ª línea · Do central = 3ª línea'},
cl_ts:{fr:'Ut 4ᵉ ligne · Do central = 4ᵉ ligne',en:'C 4th line · Middle C = 4th line',es:'Do en 4ª línea · Do central = 4ª línea'},
fg:{fr:'Doigté piano',en:'Piano Fingering',es:'Digitación de piano'},
fg_bl:{fr:'Accord plaqué',en:'Block Chord',es:'Acorde bloque'},
fg_m1:{fr:'Méthode 1 — standard',en:'Method 1 — standard',es:'Método 1 — estándar'},
iv_s:{fr:'Note de départ',en:'Starting note',es:'Nota inicial'},iv_i:{fr:'Intervalle',en:'Interval',es:'Intervalo'},iv_r:{fr:'Renversement',en:'Inversion',es:'Inversión'},
iv_oor:{fr:'Hors de la plage disponible',en:'Out of available range',es:'Fuera del rango disponible'},
iv_inv_oct:{fr:'à l\'octave (8ve)',en:'at the octave (8ve)',es:'a la octava (8va)'},
iv_inv_12:{fr:'à la douzième (12e)',en:'at the twelfth (12th)',es:'a la duodécima (12ª)'},
iv_inv_15:{fr:'à la quinzième (15e)',en:'at the fifteenth (15th)',es:'a la decimoquinta (15ª)'},
btn_listen:{fr:'Écouter',en:'Listen',es:'Escuchar'},btn_chord:{fr:'Accord',en:'Chord',es:'Acorde'},btn_arp:{fr:'Arpège',en:'Arpeggio',es:'Arpegio'},
btn_asc:{fr:'Ascendant',en:'Ascending',es:'Ascendente'},btn_desc:{fr:'Descendant',en:'Descending',es:'Descendente'},
btn_regular:{fr:'Régulier',en:'Regular',es:'Regular'},
str:{fr:'Fort',en:'Strong',es:'Fuerte'},med:{fr:'Semi-fort',en:'Medium',es:'Semi-fuerte'},wk:{fr:'Faible',en:'Weak',es:'Débil'},
med_s:{fr:'Semi-f.',en:'Med.',es:'S-fte.'},
fm_mv:{fr:'Mouvement',en:'Movement',es:'Movimiento'},
m_tri:{fr:'Triades',en:'Triads',es:'Tríadas'},m_sev:{fr:'Septièmes',en:'Sevenths',es:'Séptimas'},m_mix:{fr:'Mixture',en:'Mixture',es:'Mixtura'},
// ── Extended UI labels ──
lbl_dir:{fr:'Direction',en:'Direction',es:'Dirección'},
lbl_instr:{fr:'Instrument',en:'Instrument',es:'Instrumento'},lbl_clef:{fr:'Clef',en:'Clef',es:'Clave'},
lbl_acc:{fr:'Accidentels :',en:'Accidentals:',es:'Alteraciones:'},
lbl_oct:{fr:'Octave :',en:'Octave:',es:'Octava:'},
btn_w2c:{fr:'Note écrite → Réelle',en:'Written → Concert',es:'Nota escrita → Real'},
btn_c2w:{fr:'Note réelle → Écrite',en:'Concert → Written',es:'Nota real → Escrita'},
btn_sharps:{fr:'Dièses ♯',en:'Sharps ♯',es:'Sostenidos ♯'},btn_flats:{fr:'Bémols ♭',en:'Flats ♭',es:'Bemoles ♭'},
btn_sharps2:{fr:'♯ Dièses',en:'♯ Sharps',es:'♯ Sostenidos'},btn_flats2:{fr:'♭ Bémols',en:'♭ Flats',es:'♭ Bemoles'},
h_key:{fr:'Cliquez sur une touche pour sélectionner la note',en:'Click a key to select a note',es:'Haced clic en una tecla para seleccionar la nota'},
h_note:{fr:'Sélectionnez une note sur le clavier',en:'Select a note on the keyboard',es:'Selecciona una nota en el teclado'},
t_start:{fr:'Note de départ',en:'Starting Note',es:'Nota inicial'},
t_iv:{fr:'Intervalle',en:'Interval',es:'Intervalo'},t_dir:{fr:'Direction',en:'Direction',es:'Dirección'},
t_key:{fr:'Tonalité',en:'Key',es:'Tonalidad'},t_note:{fr:'Note',en:'Note',es:'Nota'},
t_sm:{fr:'Gamme / Mode',en:'Scale / Mode',es:'Escala / Modo'},
lbl_key:{fr:'Clé',en:'Key',es:'Clave'},
// ── Metronome ──
t_meter:{fr:'Métrique & Accents',en:'Meter & Accents',es:'Métrica y acentos'},
t_nv:{fr:'Valeur de note',en:'Note Value',es:'Valor de nota'},t_sub:{fr:'Subdivision',en:'Subdivision',es:'Subdivisión'},
t_poly:{fr:'Polyrythmie',en:'Polyrhythm',es:'Polirritmia'},t_snd:{fr:'Son',en:'Sound',es:'Sonido'},
lbl_poly_en:{fr:'Activer la 2e couche',en:'Enable 2nd layer',es:'Activar la 2ª capa'},
lbl_grp:{fr:'Groupement',en:'Grouping',es:'Agrupación'},
lbl_no_res:{fr:'Aucun résultat',en:'No results',es:'Ningún resultado'},
lbl_mes:{fr:'Mesure',en:'Bar',es:'Compás'},lbl_swing:{fr:'Swing',en:'Swing',es:'Swing'},
la:{fr:'COUCHE PRINCIPALE',en:'MAIN LAYER',es:'CAPA PRINCIPAL'},
lb:{fr:'COUCHE B (POLYRYTHMIE)',en:'LAYER B (POLYRHYTHM)',es:'CAPA B (POLIRRITMIA)'},
lsub:{fr:'SUBDIVISIONS',en:'SUBDIVISIONS',es:'SUBDIVISIONES'},
lbl_timbre:{fr:'Timbre',en:'Timbre',es:'Timbre'},lbl_vol:{fr:'Volume',en:'Volume',es:'Volumen'},lbl_pan:{fr:'Pan',en:'Pan',es:'Panorama'},
// ── Rhythm ──
btn_ts:{fr:'Indication de mesure',en:'Time Signature',es:'Indicación de compás'},
btn_bd:{fr:'Division du temps',en:'Beat Division',es:'División del pulso'},
btn_simple:{fr:'Simple',en:'Simple',es:'Simple'},btn_compound:{fr:'Composée',en:'Compound',es:'Compuesto'},
t_ts:{fr:'Indication de mesure',en:'Time Signature',es:'Indicación de compás'},
t_hier:{fr:'Hiérarchie rythmique',en:'Rhythmic Hierarchy',es:'Jerarquía rítmica'},
h_hier:{fr:'— cliquez sur un niveau pour l\'isoler',en:'— click a level to isolate it',es:'— haced clic en un nivel para aislarlo'},
h_hier2:{fr:'Cliquez sur un niveau pour le mettre en évidence — recliquez pour tout afficher',en:'Click a level to highlight — click again to show all',es:'Haced clic en un nivel para resaltarlo — volved a hacer clic para mostrar todo'},
t_mvis:{fr:'Visualisation du mètre',en:'Meter Visualization',es:'Visualización del compás'},
t_fig:{fr:'Figure de note',en:'Note Figure',es:'Figura de nota'},
t_eq:{fr:'Équivalences notes et silences',en:'Note and Rest Equivalences',es:'Equivalencias de notas y silencios'},
t_tup:{fr:'Divisions irrégulières (n-olets)',en:'Irregular Divisions (Tuplets)',es:'Divisiones irregulares (grupos)'},
'rythme.togglePolyrhythm':{fr:'⚡ Polyrythmie',en:'⚡ Polyrhythm',es:'⚡ Polirritmo'},
'rythme.syncStatus':{fr:'Synchronisation:',en:'Synchronization:',es:'Sincronización:'},
'rythme.meters':{fr:'Mètres:',en:'Meters:',es:'Metros:'},
'rythme.measures':{fr:'Mesures:',en:'Measures:',es:'Compases:'},
'rythme.bpm':{fr:'Tempo (BPM):',en:'Tempo (BPM):',es:'Tempo (BPM):'},
'rythme.measure':{fr:'Mesure',en:'Measure',es:'Compás'},
'rythme.legendDown':{fr:'Downbeat (Temps 1)',en:'Downbeat (Beat 1)',es:'Tiempo fuerte (Pulso 1)'},
'rythme.legendBeat':{fr:'Temps',en:'Beat',es:'Pulso'},
'rythme.beat':{fr:'Temps',en:'Beat',es:'Pulso'},
'rythme.custom':{fr:'Personnalisé',en:'Custom',es:'Personalizado'},
'rythme.clickTitle':{fr:'Métronome visuel',en:'Visual Metronome',es:'Metrónomo visual'},
'rythme.clickPlay':{fr:'Jouer',en:'Play',es:'Iniciar'},
'rythme.clickStop':{fr:'Stop',en:'Stop',es:'Stop'},
'rythme.clickBpm':{fr:'BPM',en:'BPM',es:'BPM'},
// ── Forms ──
fm_wn:{fr:'Nom de l\'œuvre…',en:'Work title…',es:'Título de la obra…'},
fm_key:{fr:'Tonalité',en:'Key',es:'Tonalidad'},
fm_ref:{fr:'📐 Réf.',en:'📐 Ref.',es:'📐 Ref.'},fm_orch:{fr:'🎻 Orch.',en:'🎻 Orch.',es:'🎻 Orq.'},
fm_pdf:{fr:'📄 PDF',en:'📄 PDF',es:'📄 PDF'},fm_rep:{fr:'🎼 Répertoire',en:'🎼 Repertoire',es:'🎼 Repertorio'},
fm_subsec_title:{fr:'🎵 Sous-sections',en:'🎵 Sub-sections',es:'🎵 Subsecciones'},
fm_subsec_add:{fr:'+ Ajouter une sous-section',en:'+ Add sub-section',es:'+ Agregar subsección'},
fm_subsec_name:{fr:'Nom',en:'Name',es:'Nombre'},
fm_subsec_instruments:{fr:'Instruments',en:'Instruments',es:'Instrumentos'},
fm_subsec_harmony:{fr:'Accord / Tonalité',en:'Chord / Key',es:'Acorde / Tonalidad'},
fm_subsec_measures:{fr:'Mes.',en:'Bars',es:'Comp.'},
fm_subsec_limit:{fr:'Maximum 8 sous-sections par bloc.',en:'Maximum 8 sub-sections per block.',es:'Máximo 8 subsecciones por bloque.'},
fm_subsec_total:{fr:'Total sous-sections',en:'Sub-sections total',es:'Total subsecciones'},
fm_subsec_instr_ph:{fr:'Choisir instruments…',en:'Choose instruments…',es:'Elegir instrumentos…'},
fm_subsec_harm_ph:{fr:'Ex: Cm, F7, I→V→I…',en:'Ex: Cm, F7, I→V→I…',es:'Ej: Cm, F7, I→V→I…'},
'gdrive.btn':{fr:'☁️ Drive',en:'☁️ Drive',es:'☁️ Drive'},
'gdrive.saving':{fr:'⏳ Connexion…',en:'⏳ Connecting…',es:'⏳ Conectando…'},
'gdrive.ok':{fr:'✅ Sauvegardé !',en:'✅ Saved!',es:'✅ ¡Guardado!'},
'gdrive.err':{fr:'❌ Erreur Drive',en:'❌ Drive Error',es:'❌ Error Drive'},
'gdrive.hint':{fr:'Sauvegarde JSON dans votre Google Drive (dossier Contrepoint)',en:'Saves JSON to your Google Drive (Contrepoint folder)',es:'Guarda JSON en tu Google Drive (carpeta Contrepoint)'},
fm_dict_btn:{fr:'📖 Dictionnaire',en:'📖 Dictionary',es:'📖 Diccionario'},
fm_dict_title:{fr:'📖 Dictionnaire orchestral',en:'📖 Orchestral Dictionary',es:'📖 Diccionario orquestal'},
fm_dict_ph:{fr:'Rechercher (abr., terme, instrument…)',en:'Search (abbr., term, instrument…)',es:'Buscar (abr., término, instrumento…)'},
fm_dict_sources:{fr:'D\'après Catel · Laitz · Berlioz · Adler',en:'After Catel · Laitz · Berlioz · Adler',es:'Según Catel · Laitz · Berlioz · Adler'},
fm_mvt:{fr:'Mouvements',en:'Movements',es:'Movimientos'},
fm_rf:{fr:'Forme de référence',en:'Reference Form',es:'Forma de referencia'},
fm_as:{fr:'Ajouter une section',en:'Add a Section',es:'Añadir una sección'},
fm_sp:{fr:'Projets sauvegardés',en:'Saved Projects',es:'Proyectos guardados'},
fm_am:{fr:'Ajouter un mouvement',en:'Add a Movement',es:'Añadir un movimiento'},
fm_oi:{fr:'🎻 Orchestration / Instrumentation',en:'🎻 Orchestration / Instrumentation',es:'🎻 Orquestación / Instrumentación'},
fm_re:{fr:'🎼 Exemples du répertoire',en:'🎼 Repertoire Examples',es:'🎼 Ejemplos del repertorio'},
fm_ls:{fr:'Sauvegarde locale (navigateur).',en:'Local storage (browser).',es:'Almacenamiento local (navegador).'},
fm_lm:{fr:'Charger un plan formel d\'une œuvre connue comme modèle de référence.',en:'Load a formal plan from a known work as a reference model.',es:'Cargad un plan formal de una obra conocida como modelo de referencia.'},
h_section:{fr:'Sélectionner une section dans la timeline pour voir ses détails',en:'Select a section in the timeline to see its details',es:'Selecciona una sección en la línea de tiempo para ver sus detalles'},
// ── Modulation ──
t_keys:{fr:'Tonalités',en:'Keys',es:'Tonalidades'},
lbl_from:{fr:'Départ',en:'From',es:'Origen'},lbl_to:{fr:'Arrivée',en:'To',es:'Destino'},
t_dia:{fr:'Accords diatoniques',en:'Diatonic Chords',es:'Acordes diatónicos'},
t_piv:{fr:'Accords pivots',en:'Pivot Chords',es:'Acordes pivote'},
t_tech:{fr:'Techniques de modulation',en:'Modulation Techniques',es:'Técnicas de modulación'},
t_chain:{fr:'Chaîne de modulations',en:'Modulation Chain',es:'Cadena de modulaciones'},
t_lib:{fr:'Bibliothèque du répertoire',en:'Repertoire Library',es:'Biblioteca del repertorio'},
t_prog:{fr:'Progression modulatoire',en:'Modulatory Progression',es:'Progresión modulatoria'},
m_dep:{fr:'Départ',en:'Departure',es:'Origen'},m_arr:{fr:'Arrivée',en:'Arrival',es:'Destino'},
// ── Analyseur ──
t_score:{fr:'Partition',en:'Score',es:'Partitura'},
t_errors:{fr:'Analyse — Erreurs',en:'Analysis — Errors',es:'Análisis — Errores'},
t_input:{fr:'Saisie — Accord',en:'Input — Chord',es:'Entrada — Acorde'},
ah_kl:{fr:'Tonalité :',en:'Key:',es:'Tonalidad:'},ah_ml:{fr:'Mesure :',en:'Bar:',es:'Compás:'},
ah_cl:{fr:'Accord :',en:'Chord:',es:'Acorde:'},ah_il:{fr:'Chiffrage :',en:'Inversion:',es:'Cifrado:'},
ah_rp:{fr:'État fondamental',en:'Root Position',es:'Estado fundamental'},
t_voices:{fr:'Voix (saisie manuelle)',en:'Voices (manual input)',es:'Voces (entrada manual)'},
t_analysis:{fr:'Analyse',en:'Analysis',es:'Análisis'},ah_p:{fr:'problème(s)',en:'issue(s)',es:'problema(s)'},
ah_s:{fr:'Soprano',en:'Soprano',es:'Soprano'},ah_a:{fr:'Alto',en:'Alto',es:'Alto'},
ah_t:{fr:'Ténor',en:'Tenor',es:'Tenor'},ah_b:{fr:'Basse',en:'Bass',es:'Bajo'},ah_e:{fr:'Erreur',en:'Error',es:'Error'},
ah_tp:{fr:'Tempo:',en:'Tempo:',es:'Tempo:'},ah_ch:{fr:'accords',en:'chords',es:'acordes'},
h_drag:{fr:'↕ Glissez les notes verticalement sur la portée pour changer la tessiture',en:'↕ Drag notes vertically on the staff to change voicing',es:'↕ Arrastrad las notas verticalmente en el pentagrama para cambiar la tesitura'},
h_2chords:{fr:'Ajoutez au moins 2 accords pour lancer l\'analyse',en:'Add at least 2 chords to start the analysis',es:'Añadid al menos 2 acordes para iniciar el análisis'},
btn_add:{fr:'Ajouter',en:'Add',es:'Añadir'},btn_edit:{fr:'Modifier',en:'Edit',es:'Editar'},
btn_del:{fr:'Effacer',en:'Delete',es:'Borrar'},btn_clear:{fr:'Tout effacer',en:'Clear All',es:'Borrar todo'},
btn_play_all:{fr:'▶ Écouter tout',en:'▶ Play All',es:'▶ Escuchar todo'},
btn_play_sel:{fr:'▶ Accord',en:'▶ Chord',es:'▶ Acorde'},
t_rules:{fr:'Règles vérifiées',en:'Rule Check',es:'Reglas verificadas'},
t_theory:{fr:'Théorie — Conduite des voix',en:'Theory — Voice Leading',es:'Teoría — Conducción de las voces'},
r_p5:{fr:'Quintes parallèles',en:'Parallel Fifths',es:'Quintas paralelas'},r_p8:{fr:'Octaves parallèles',en:'Parallel Octaves',es:'Octavas paralelas'},
r_p1:{fr:'Unissons parallèles',en:'Parallel Unisons',es:'Unísonos paralelos'},r_d5:{fr:'Quintes directes (S-B)',en:'Direct Fifths (S-B)',es:'Quintas directas (S-B)'},
r_d8:{fr:'Octaves directes',en:'Direct Octaves',es:'Octavas directas'},r_cx:{fr:'Croisement de voix',en:'Voice Crossing',es:'Cruzamiento de voces'},
r_sp:{fr:'Espacement excessif (> 8ve)',en:'Excessive Spacing (> 8ve)',es:'Espaciado excesivo (> 8ª)'},
r_lr:{fr:'Résolution de la sensible',en:'Leading Tone Resolution',es:'Resolución de la sensible'},
r_ld:{fr:'Doublure de la sensible',en:'Leading Tone Doubling',es:'Duplicación de la sensible'},
r_cm:{fr:'Mouvement contraire',en:'Contrary Motion',es:'Movimiento contrario'},
/* T1 — Dissonance resolutions */
r_d7:{fr:'7e non résolue',en:'Unresolved 7th',es:'7ª sin resolver'},
r_d9:{fr:'9e non résolue',en:'Unresolved 9th',es:'9ª sin resolver'},
r_aug:{fr:'Accord augmenté — résolution',en:'Augmented chord — resolution',es:'Acorde aumentado — resolución'},
tip_d7:{fr:'La 7e de dominante (V7) doit descendre par degré conjoint vers la 3e de l\'accord suivant.',en:'The dominant 7th (V7) should resolve downward by step to the 3rd of the next chord.',es:'La 7ª de dominante (V7) debe resolver descendiendo por grado conjunto hacia la 3ª del acorde siguiente.'},
tip_d9:{fr:'La 9e doit descendre par degré conjoint vers l\'octave ou la tonique.',en:'The 9th should resolve downward by step to the octave or tonic.',es:'La 9ª debe resolver descendiendo por grado conjunto hacia la octava o tónica.'},
tip_aug:{fr:'La 5e augmentée doit résoudre chromatiquement (½ ton).',en:'The augmented 5th should resolve chromatically (semitone).',es:'La 5ª aumentada debe resolver cromáticamente (½ tono).'},
/* T2 — Hidden 5ths/8ths */
r_h5:{fr:'Quinte cachée',en:'Hidden Fifth',es:'Quinta oculta'},
r_h8:{fr:'Octave cachée',en:'Hidden Octave',es:'Octava oculta'},
/* T3 — Voice mode selector */
ah_vmode:{fr:'Mode voix :',en:'Voice mode:',es:'Modo voces:'},
ah_vm_satb:{fr:'SATB (4 voix)',en:'SATB (4 voices)',es:'SATB (4 voces)'},
ah_vm_sab:{fr:'SAB (3 voix)',en:'SAB (3 voices)',es:'SAB (3 voces)'},
ah_vm_sat:{fr:'SAT (3 voix)',en:'SAT (3 voices)',es:'SAT (3 voces)'},
ah_vm_ttb:{fr:'TTB (3 voix)',en:'TTB (3 voices)',es:'TTB (3 voces)'},
ah_mode_title:{fr:"Mode d'analyse — choisir la section orchestrale",en:'Analysis mode — choose orchestral section',es:'Modo de análisis — elegir sección orquestal'},
ah_mode_satb:{fr:'🎼 SATB (Chœur)',en:'🎼 SATB (Choir)',es:'🎼 SATB (Coro)'},
ah_mode_vents:{fr:'🌬️ Vents',en:'🌬️ Winds',es:'🌬️ Vientos'},
ah_mode_cuivres:{fr:'🎺 Cuivres',en:'🎺 Brass',es:'🎺 Metales'},
ah_mode_cordes:{fr:'🎻 Cordes',en:'🎻 Strings',es:'🎻 Cuerdas'},
ah_mode_tutti:{fr:'🎭 Tutti orchestral',en:'🎭 Orchestral Tutti',es:'🎭 Tutti orquestal'},
ah_mode_hint:{fr:'💡 Chaque mode applique les règles de conduite des voix de base, plus les règles spécifiques à la section (d\'après le Traité d\'orchestration de Berlioz).',en:'💡 Each mode applies the basic voice-leading rules, plus rules specific to the section (from Berlioz\'s Treatise on Instrumentation).',es:'💡 Cada modo aplica las reglas básicas de conducción de voces, más las reglas específicas de la sección (según el Tratado de orquestación de Berlioz).'},
ah_ph_roadmap:{fr:'📋 Feuille de route :',en:'📋 Roadmap:',es:'📋 Hoja de ruta:'},
ah_ph_note:{fr:'En attendant, utilisez le mode <strong>SATB</strong> qui est pleinement fonctionnel.',en:'Meanwhile, use the <strong>SATB</strong> mode which is fully functional.',es:'Mientras tanto, utiliza el modo <strong>SATB</strong> que está totalmente operativo.'},
ah_ph_back:{fr:'← Retour au mode SATB',en:'← Back to SATB mode',es:'← Volver al modo SATB'},
vts_cfg_title:{fr:'Configuration des pupitres',en:'Desk configuration',es:'Configuración de atriles'},
vts_cfg_hint:{fr:"💡 Sélectionnez le nombre d'instruments par famille (0 à 3). L'auxiliaire remplace le 3<sup>e</sup> instrument du pupitre.",en:'💡 Select the number of instruments per family (0 to 3). The auxiliary replaces the 3<sup>rd</sup> instrument of the desk.',es:'💡 Selecciona el número de instrumentos por familia (0 a 3). El auxiliar reemplaza al 3<sup>er</sup> instrumento del atril.'},
vts_count:{fr:'Nombre :',en:'Count:',es:'Cantidad:'},
vts_fam_flutes:{fr:'🎼 Flûtes',en:'🎼 Flutes',es:'🎼 Flautas'},
vts_fam_oboes:{fr:'🎼 Hautbois',en:'🎼 Oboes',es:'🎼 Oboes'},
vts_fam_clarinets:{fr:'🎼 Clarinettes',en:'🎼 Clarinets',es:'🎼 Clarinetes'},
vts_fam_bassoons:{fr:'🎼 Bassons',en:'🎼 Bassoons',es:'🎼 Fagotes'},
vts_aux_picc:{fr:'Fl.3 → Piccolo',en:'Fl.3 → Piccolo',es:'Fl.3 → Flautín'},
vts_aux_ca:{fr:'Hb.3 → Cor anglais',en:'Ob.3 → English Horn',es:'Ob.3 → Corno inglés'},
vts_aux_clb:{fr:'Cl.3 → Cl. basse',en:'Cl.3 → Bass Clarinet',es:'Cl.3 → Cl. bajo'},
vts_aux_cbn:{fr:'Bn.3 → Contrebasson',en:'Bn.3 → Contrabassoon',es:'Fag.3 → Contrafagot'},
vts_input_title:{fr:'Saisie — Accord vents',en:'Input — Wind chord',es:'Entrada — Acorde de vientos'},
vts_mode:{fr:'Mode :',en:'Mode:',es:'Modo:'},
vts_mode_single:{fr:'Accord isolé',en:'Single chord',es:'Acorde aislado'},
vts_mode_progression:{fr:'Progression',en:'Progression',es:'Progresión'},
vts_hint:{fr:"💡 Saisissez la note <strong>écrite</strong> (ex : <code>C4</code>, <code>Bb5</code>, <code>F#3</code>). Pour les instruments transpositeurs, la note sonore réelle s'affiche à côté.",en:'💡 Enter the <strong>written</strong> pitch (e.g. <code>C4</code>, <code>Bb5</code>, <code>F#3</code>). For transposing instruments, the actual sounding pitch is displayed next to it.',es:'💡 Introduce la nota <strong>escrita</strong> (ej.: <code>C4</code>, <code>Bb5</code>, <code>F#3</code>). Para los instrumentos transpositores, la nota sonora real aparece al lado.'},
vts_btn_add:{fr:'+ Ajouter accord',en:'+ Add chord',es:'+ Añadir acorde'},
vts_btn_update:{fr:'↻ MAJ accord',en:'↻ Update chord',es:'↻ Actualizar'},
vts_btn_remove:{fr:'− Retirer',en:'− Remove',es:'− Quitar'},
vts_btn_clear:{fr:'⌫ Tout effacer',en:'⌫ Clear all',es:'⌫ Borrar todo'},
vts_theory_title:{fr:"Théorie — Écriture pour les bois",en:'Theory — Writing for woodwinds',es:'Teoría — Escritura para maderas'},
fm_examples_title:{fr:'🎵 Exemples du répertoire',en:'🎵 Repertoire Examples',es:'🎵 Ejemplos del repertorio'},
fm_examples_sonate:{fr:'Sonate classique',en:'Classical Sonata',es:'Sonata clásica'},
fm_examples_rondo:{fr:'Rondo',en:'Rondo',es:'Rondo'},
fm_examples_valse:{fr:'Valse',en:'Waltz',es:'Vals'},
fm_examples_fugue:{fr:'Fugue',en:'Fugue',es:'Fuga'},
fm_examples_prelude:{fr:'Prélude',en:'Prelude',es:'Preludio'},
fm_examples_ballet:{fr:'Ballet',en:'Ballet',es:'Ballet'},
ph_scale:{fr:'Rechercher une gamme...',en:'Search a scale...',es:'Buscar una escala...'},
ph_search:{fr:'Rechercher...',en:'Search...',es:'Buscar...'},
ph_tempo:{fr:'Rechercher un tempo...',en:'Search a tempo...',es:'Buscar un tempo...'},
tm_notes:{fr:'Notes',en:'Notes',es:'Notas'},
tm_siv:{fr:'Intervalles successifs',en:'Successive Intervals',es:'Intervalos sucesivos'},
tm_staff:{fr:'Portée',en:'Staff',es:'Pentagrama'},
tm_kb:{fr:'Clavier',en:'Keyboard',es:'Teclado'},
tm_listen:{fr:'Écouter',en:'Listen',es:'Escuchar'},
tm_both:{fr:'Les deux',en:'Both',es:'Ambos'},
tm_nf:{fr:'notes · Formule :',en:'notes · Formula:',es:'notas · Fórmula:'},
fg_rh:{fr:'Main droite (MD)',en:'Right Hand (RH)',es:'Mano derecha (MD)'},
fg_lh:{fr:'Main gauche (MG)',en:'Left Hand (LH)',es:'Mano izquierda (MI)'},
fg_4th:{fr:'4e doigt — repère de position',en:'4th finger — position marker',es:'4º dedo — referencia de posición'},
fg_m2:{fr:'Méthode 2 — avec 4e doigt',en:'Method 2 — with 4th finger',es:'Método 2 — con 4º dedo'},

// ── BRS_ Cuivres ────────────────────────────────────────────────────
brs_config_title:{fr:'🎺 Configuration — Pupitre de cuivres',en:'🎺 Configuration — Brass Section',es:'🎺 Configuración — Sección de Metales'},
brs_cfg_title:{fr:'🎺 Configuration — Pupitres de cuivres',en:'🎺 Configuration — Brass Section',es:'🎺 Configuración — Sección de Metales'},
brs_input_title:{fr:'Saisie — Accord cuivres',en:'Input — Brass chord',es:'Entrada — Acorde de metales'},
brs_cfg_hint:{fr:"💡 Configurez l'effectif par famille. L'auxiliaire remplace/complète le dernier pupitre.",en:"💡 Set the count per family. The auxiliary replaces/adds to the last desk.",es:"💡 Configure el número por familia. El auxiliar reemplaza/completa el último atril."},
brs_hint:{fr:"💡 Saisissez la note <strong>écrite</strong> (ex : <code>C4</code>). Pour cors et trompettes, la note sonore réelle s'affiche à côté.",en:"💡 Enter the <strong>written</strong> note (e.g. <code>C4</code>). For horns and trumpets, the sounding pitch is shown alongside.",es:"💡 Introduce la nota <strong>escrita</strong> (p.ej. <code>C4</code>). Para trompas y trompetas se muestra la nota sonante."},
brs_count:{fr:'Nombre',en:'Count',es:'Cantidad'},
brs_key:{fr:'Tonalité :',en:'Key:',es:'Tonalidad:'},
brs_mode_chord:{fr:'Accord seul',en:'Single Chord',es:'Acorde solo'},
brs_mode_prog:{fr:'Progression',en:'Progression',es:'Progresión'},
brs_no_inst:{fr:'Aucun instrument sélectionné',en:'No instrument selected',es:'Ningún instrumento seleccionado'},
brs_notes_title:{fr:'Notes (écriture)',en:'Notes (written pitch)',es:'Notas (escritura)'},
brs_errors_title:{fr:'Analyse',en:'Analysis',es:'Análisis'},
brs_progression_title:{fr:"Progression d'accords",en:'Chord Progression',es:'Progresión de acordes'},
brs_theory_title:{fr:'Théorie — Écriture pour cuivres',en:'Theory — Brass Writing',es:'Teoría — Escritura para metales'},
brs_add_chord:{fr:'+ Accord',en:'+ Chord',es:'+ Acorde'},
brs_update_chord:{fr:'Mettre à jour',en:'Update',es:'Actualizar'},
brs_remove_chord:{fr:'Supprimer',en:'Remove',es:'Eliminar'},
brs_clear_all:{fr:'Tout effacer',en:'Clear All',es:'Borrar todo'},
brs_export_pdf:{fr:'📄 Export PDF',en:'📄 Export PDF',es:'📄 Exportar PDF'},
brs_reg_grave:{fr:'Grave',en:'Low',es:'Grave'},
brs_reg_medium:{fr:'Médium',en:'Medium',es:'Medio'},
brs_reg_high:{fr:'Aigu',en:'High',es:'Agudo'},
brs_reg_extreme:{fr:'Extrême',en:'Extreme',es:'Extremo'},
brs_range_out:{fr:'Hors tessiture',en:'Out of range',es:'Fuera de tesitura'},
brs_range_extreme:{fr:'Registre extrême (fatigue)',en:'Extreme register (fatigue)',es:'Registro extremo (fatiga)'},
brs_horn_cross:{fr:'Croisement de cors',en:'Horn crossing',es:'Cruce de trompas'},
brs_octave_gap:{fr:"Trou d'octave entre pupitres",en:'Octave gap between desks',es:'Hueco de octava entre atriles'},
brs_lt_doubled:{fr:'Sensible doublée',en:'Doubled leading tone',es:'Sensible duplicada'},
brs_p5:{fr:'Quintes parallèles',en:'Parallel fifths',es:'Quintas paralelas'},
brs_p8:{fr:'Octaves parallèles',en:'Parallel octaves',es:'Octavas paralelas'},
brs_tuba_high:{fr:'Tuba : note trop haute',en:'Tuba: note too high',es:'Tuba: nota demasiado alta'},
brs_trb_gliss:{fr:'Glissando probable (trombone)',en:'Probable glissando (trombone)',es:'Glissando probable (trombón)'},
brs_no_errors:{fr:'Aucune erreur détectée',en:'No errors detected',es:'Sin errores detectados'},
brs_th_ranges:{fr:'Tessitures',en:'Ranges',es:'Tesituras'},
brs_th_transpo:{fr:'Transpositions',en:'Transpositions',es:'Transposiciones'},
brs_th_dynamic:{fr:'Dynamique & fatigue',en:'Dynamics & Fatigue',es:'Dinámica y fatiga'},
brs_th_blends:{fr:'Mélanges recommandés',en:'Recommended Blends',es:'Mezclas recomendadas'},
brs_th_errors:{fr:'Erreurs courantes',en:'Common Errors',es:'Errores comunes'},
brs_pdf_title:{fr:'Analyse Cuivres — Contrepoint',en:'Brass Analysis — Contrepoint',es:'Análisis de Metales — Contrepoint'},
brs_pdf_voices:{fr:'Voix & instruments',en:'Voices & Instruments',es:'Voces e instrumentos'},
brs_pdf_instrument:{fr:'Instrument',en:'Instrument',es:'Instrumento'},
brs_pdf_written:{fr:'Note écrite',en:'Written Note',es:'Nota escrita'},
brs_pdf_sounding:{fr:'Note sonnante',en:'Sounding Note',es:'Nota sonante'},
brs_pdf_register:{fr:'Registre',en:'Register',es:'Registro'},

/* ── MODULE CORDES ── */
str_input_title:{fr:'Saisie — Cordes',en:'Input — Strings',es:'Entrada — Cuerdas'},
str_hint:{fr:'💡 Saisissez la note sonnante (ex : <code>C4</code>, <code>Bb3</code>). Cordes non transpositrices.',en:'💡 Enter the sounding note (e.g. <code>C4</code>, <code>Bb3</code>). Strings are non-transposing.',es:'💡 Introduce la nota sonante (p.ej. <code>C4</code>, <code>Bb3</code>). Las cuerdas no son transpositoras.'},
str_theory_title:{fr:'Théorie — Écriture pour cordes',en:'Theory — String Writing',es:'Teoría — Escritura para cuerdas'},
str_errors_title:{fr:'Analyse — Erreurs',en:'Analysis — Errors',es:'Análisis — Errores'},
str_pdf_title:{fr:'Analyse Cordes — Contrepoint',en:'Strings Analysis — Contrepoint',es:'Análisis de Cuerdas — Contrepoint'},
str_range_out:{fr:'Hors tessiture',en:'Out of range',es:'Fuera de tesitura'},
str_range_extreme:{fr:'Registre extrême',en:'Extreme register',es:'Registro extremo'},
str_cross:{fr:'Croisement de pupitres',en:'Voice crossing',es:'Cruce de pupitres'},
str_octave_gap:{fr:"Trou d'octave",en:'Octave gap',es:'Hueco de octava'},
str_lt_doubled:{fr:'Sensible doublée',en:'Doubled leading tone',es:'Sensible duplicada'},
str_p5:{fr:'Quintes parallèles',en:'Parallel fifths',es:'Quintas paralelas'},
str_p8:{fr:'Octaves parallèles',en:'Parallel octaves',es:'Octavas paralelas'},
str_cb_high:{fr:'Contrebasse : note élevée',en:'Double bass: high note',es:'Contrabajo: nota elevada'},
str_unison:{fr:'Unisson entre pupitres',en:'Unison between desks',es:'Unísono entre atriles'},
str_no_errors:{fr:'Aucune erreur détectée',en:'No errors detected',es:'Sin errores detectados'},
str_th_ranges:{fr:'1. Tessitures',en:'1. Ranges',es:'1. Tesituras'},
str_th_inst:{fr:'Instrument',en:'Instrument',es:'Instrumento'},
str_th_range_lbl:{fr:'Tessiture',en:'Range',es:'Tesitura'},
str_th_clef:{fr:'Clé',en:'Clef',es:'Clave'},
str_th_notes:{fr:'Registres',en:'Registers',es:'Registros'},
str_th_techniques:{fr:'2. Techniques de jeu',en:'2. Playing Techniques',es:'2. Técnicas de ejecución'},
str_th_doublestop:{fr:'3. Doubles-cordes & accords',en:'3. Double-stops & chords',es:'3. Dobles cuerdas y acordes'},
str_th_balance:{fr:'4. Équilibre timbral',en:'4. Timbral Balance',es:'4. Equilibrio tímbrico'},
str_th_errors:{fr:'5. Erreurs courantes',en:'5. Common Mistakes',es:'5. Errores comunes'},
str_clef_tenor:{fr:'Clef de ténor',en:'Tenor clef',es:'Clave de do en 4ª'},
str_clef_alto:{fr:"Clef d'alto",en:'Alto clef',es:'Clave de do en 3ª'},
str_clef_treble:{fr:'Clef de sol',en:'Treble clef',es:'Clave de sol'},
tut_pdf_title:{fr:'Contrepoint — Tutti orchestral',en:'Contrepoint — Orchestral Tutti',es:'Contrepoint — Tutti orquestal'},
tut_pdf_moments:{fr:'moment(s)',en:'moment(s)',es:'momento(s)'},
tut_pdf_staves:{fr:'portée(s)',en:'staff (staves)',es:'pentagrama(s)'},
tut_sketch_label:{fr:'Nom du sketch',en:'Sketch name',es:'Nombre del sketch'},
tut_sketch_placeholder:{fr:'Mon esquisse orchestrale…',en:'My orchestral sketch…',es:'Mi boceto orquestal…'},

};

var INSTR_I18N={
'Piccolo (en Ré♭)':'Piccolo (in D♭)','Flûte alto (en Sol)':'Alto Flute (in G)',
"Hautbois d'amour (en La)":'Oboe d\'amore (in A)','Cor anglais (en Fa)':'English Horn (in F)',
'Petite clarinette en Ré':'Piccolo Clarinet in D','Petite clarinette en Mi♭':'Piccolo Clarinet in E♭',
'Clarinette en Si♭':'Clarinet in B♭','Clarinette en La':'Clarinet in A',
'Clarinette basse Si♭ (clé de sol)':'Bass Clarinet B♭ (treble clef)',
'Clarinette basse Si♭ (clé de fa)':'Bass Clarinet B♭ (bass clef)',
'Saxophone soprano (Si♭)':'Soprano Sax (B♭)','Saxophone alto (Mi♭)':'Alto Sax (E♭)',
'Saxophone ténor (Si♭)':'Tenor Sax (B♭)','Saxophone baryton (Mi♭)':'Baritone Sax (E♭)',
'Cor en Ré':'Horn in D','Cor en Mi♭':'Horn in E♭','Cor en Mi':'Horn in E',
'Cor en Fa':'Horn in F','Cor en La':'Horn in A','Cor en Si♭':'Horn in B♭',
'Petite trompette en Ré':'Piccolo Trumpet in D','Trompette en Mi♭':'Trumpet in E♭',
'Trompette en Fa':'Trumpet in F','Trompette en Si♭':'Trumpet in B♭',
'Cornet à pistons (Si♭)':'Cornet (B♭)','Trombone à pistons (Si♭)':'Valve Trombone (B♭)',
'Saxhorn basse (Si♭)':'Bass Saxhorn (B♭)','Euphonium Si♭ (clé de sol)':'Euphonium B♭ (treble clef)',
'Saxhorn contrebasse (Mi♭)':'Contrabass Saxhorn (E♭)','Tuba en Fa':'Tuba in F',
'Saxhorn contrebasse (Si♭)':'Contrabass Saxhorn (B♭)'
};

var IV_I18N={
'9e mineure ascendante':'ascending minor 9th','4e juste descendante':'descending perfect 4th',
'3e mineure descendante':'descending minor 3rd','5e juste descendante':'descending perfect 5th',
'2e majeure ascendante':'ascending major 2nd','3e mineure ascendante':'ascending minor 3rd',
'2e majeure descendante':'descending major 2nd','9e majeure descendante':'descending major 9th',
'6e majeure descendante':'descending major 6th','13e majeure descendante':'descending major 13th',
'7e mineure descendante':'descending minor 7th','6e mineure descendante':'descending minor 6th',
'4e juste ascendante':'ascending perfect 4th','12e juste descendante':'descending perfect 12th'
};


// ── Spanish parallel tables ──
var INSTR_I18N_ES={
'Piccolo (en Ré♭)':'Flautín (en Re♭)','Flûte alto (en Sol)':'Flauta alto (en Sol)',
"Hautbois d'amour (en La)":'Oboe de amor (en La)','Cor anglais (en Fa)':'Corno inglés (en Fa)',
'Petite clarinette en Ré':'Requinto en Re','Petite clarinette en Mi♭':'Requinto en Mi♭',
'Clarinette en Si♭':'Clarinete en Si♭','Clarinette en La':'Clarinete en La',
'Clarinette basse Si♭ (clé de sol)':'Clarinete bajo Si♭ (clave de sol)',
'Clarinette basse Si♭ (clé de fa)':'Clarinete bajo Si♭ (clave de fa)',
'Saxophone soprano (Si♭)':'Saxofón soprano (Si♭)','Saxophone alto (Mi♭)':'Saxofón alto (Mi♭)',
'Saxophone ténor (Si♭)':'Saxofón tenor (Si♭)','Saxophone baryton (Mi♭)':'Saxofón barítono (Mi♭)',
'Cor en Ré':'Trompa en Re','Cor en Mi♭':'Trompa en Mi♭','Cor en Mi':'Trompa en Mi',
'Cor en Fa':'Trompa en Fa','Cor en La':'Trompa en La','Cor en Si♭':'Trompa en Si♭',
'Petite trompette en Ré':'Trompeta piccolo en Re','Trompette en Mi♭':'Trompeta en Mi♭',
'Trompette en Fa':'Trompeta en Fa','Trompette en Si♭':'Trompeta en Si♭',
'Cornet à pistons (Si♭)':'Corneta de pistones (Si♭)','Trombone à pistons (Si♭)':'Trombón de pistones (Si♭)',
'Saxhorn basse (Si♭)':'Bombardino (Si♭)','Euphonium Si♭ (clé de sol)':'Eufonio Si♭ (clave de sol)',
'Saxhorn contrebasse (Mi♭)':'Saxhorn contrabajo (Mi♭)','Tuba en Fa':'Tuba en Fa',
'Saxhorn contrebasse (Si♭)':'Saxhorn contrabajo (Si♭)'
};

var IV_I18N_ES={
'9e mineure ascendante':'9ª menor ascendente','4e juste descendante':'4ª justa descendente',
'3e mineure descendante':'3ª menor descendente','5e juste descendante':'5ª justa descendente',
'2e majeure ascendante':'2ª mayor ascendente','3e mineure ascendante':'3ª menor ascendente',
'2e majeure descendante':'2ª mayor descendente','9e majeure descendante':'9ª mayor descendente',
'6e majeure descendante':'6ª mayor descendente','13e majeure descendante':'13ª mayor descendente',
'7e mineure descendante':'7ª menor descendente','6e mineure descendante':'6ª menor descendente',
'4e juste ascendante':'4ª justa ascendente','12e juste descendante':'12ª justa descendente'
};

function t(k){var e=I18N[k];if(!e)return k;return e[currentLang]||e.fr||k;}
function tI(n){
  if(currentLang==='en') return INSTR_I18N[n]||n;
  if(currentLang==='es') return INSTR_I18N_ES[n]||n;
  return n;
}
function tIv(d){
  if(currentLang==='en') return IV_I18N[d]||d;
  if(currentLang==='es') return IV_I18N_ES[d]||d;
  return d;
}
function tIC(c){
  if(currentLang==='en') return c==='Bois'?'Woodwinds':c==='Cuivres'?'Brass':c;
  if(currentLang==='es') return c==='Bois'?'Madera':c==='Cuivres'?'Metal':c;
  return c;
}

// Inline trilingual helper: tx(fr, en, es) — falls back to fr if es missing
function tx(fr, en, es){
  if(currentLang==='en') return en;
  if(currentLang==='es') return (es!==undefined?es:fr);
  return fr;
}

function toggleLangDD(){
  var dd=document.getElementById('langDD');
  var btn=document.getElementById('langBtn');
  dd.classList.toggle('open');
  if(btn) btn.setAttribute('aria-expanded', dd.classList.contains('open')?'true':'false');
}
function setLang(lang){
  currentLang=lang;
  document.documentElement.lang=lang;
  /* Sauvegarder le choix pour les prochaines visites */
  try { localStorage.setItem('pc_lang', lang); } catch(e){}
  /* langFlag removed */
  document.getElementById('langLabel').textContent=lang==='fr'?'FR':lang==='es'?'ES':'EN';
  document.querySelectorAll('.lang-opt').forEach(function(o){o.classList.toggle('active',o.dataset.lang===lang);});
  var dd=document.getElementById('langDD');if(dd)dd.classList.remove('open');
  var logo=document.getElementById('logoText');if(logo)logo.textContent=t('logo');
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v=I18N[el.getAttribute('data-i18n')];
    if(v)el.textContent=v[lang]||v.fr;
  });
  // Update i18n innerHTML (for content with <strong>, <em>, etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){
    var v=I18N[el.getAttribute('data-i18n-html')];
    if(v)el.innerHTML=v[lang]||v.fr;
  });
  // Toggle theory sections
  document.querySelectorAll('.theory-fr').forEach(function(el){el.style.display=lang==='fr'?'':'none';});
  document.querySelectorAll('.theory-en').forEach(function(el){el.style.display=lang==='en'?'':'none';});
  document.querySelectorAll('[data-ph]').forEach(function(el){
    var v=I18N[el.getAttribute('data-ph')];
    if(v)el.placeholder=v[lang]||v.fr;
  });
  // Update tooltip attributes
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    var v=I18N[el.getAttribute('data-i18n-title')];
    if(v)el.setAttribute('title', v[lang]||v.fr);
  });
  try{T1.langUpdate()}catch(e){}
  try{T2.init()}catch(e){}
  try{T3.langUpdate()}catch(e){}
  try{TA.init()}catch(e){}
  try{TM.init()}catch(e){}
  try{M.init()}catch(e){}
  try{TR.init()}catch(e){}
  try{DIV.init()}catch(e){}
  try{
    /* Translate keys + default work name */
    var ksel=document.getElementById('fm_globalKey');
    if(ksel){var cur=ksel.value;ksel.innerHTML=fmKeys().map(function(k,i){return'<option value="'+FM_KEYS_FR[i]+'">'+k+'</option>'}).join('');ksel.value=cur;}
    var pn=document.getElementById('fm_projName');
    if(pn&&(pn.value==='Mon œuvre'||pn.value==='My Work'||pn.value==='Mi obra'))pn.value=lang==='en'?'My Work':lang==='es'?'Mi obra':'Mon œuvre';
    FM_render();
    /* Translate Forms UI labels */
    if(currentLang==='en'){
      document.querySelectorAll('#panFormes h3, #panFormes .card-title, #panFormes .fm-toolbar label').forEach(function(el){
        var t=FM_I18N[el.textContent.trim()];if(t)el.textContent=t;
      });
    } else if(currentLang==='es'){
      document.querySelectorAll('#panFormes h3, #panFormes .card-title, #panFormes .fm-toolbar label').forEach(function(el){
        var t=FM_I18N_ES[el.textContent.trim()];if(t)el.textContent=t;
      });
    }
  }catch(e){}
  try{popSel();MOD_R()}catch(e){}
  try{SEQ_render()}catch(e){}
  try{AH_buildKeySelector();AH_buildChordTypeSelector();AH_updateInversionOptions();AH_buildInputs();AH_analyze();AH_render();}catch(e){}
}
document.addEventListener('click',function(e){
  var s=document.getElementById('langSel');
  if(s&&!s.contains(e.target))document.getElementById('langDD').classList.remove('open');
});


// ── Modulation technique names ──
var MOD_NM_I18N={
'Accord pivot':'Pivot Chord','Dom. secondaire':'Secondary Dom.',
'Napolitain (♭II)':'Neapolitan (♭II)','Chromatique':'Chromatic',
'Ger⁺⁶ enharmonique':'Ger⁺⁶ Enharmonic','7ᵉ dim. enharmonique':'dim7 Enharmonic',
'Directe':'Direct','Chaîne de dominantes':'Chain of Dominants',
'Cadence rompue':'Deceptive Cadence'
};
var MOD_NM_I18N_ES={
'Accord pivot':'Acorde pivote','Dom. secondaire':'Dom. secundaria',
'Napolitain (♭II)':'Napolitano (♭II)','Chromatique':'Cromático',
'Ger⁺⁶ enharmonique':'Ger⁺⁶ enarmónico','7ᵉ dim. enharmonique':'7ª dim. enarmónica',
'Directe':'Directa','Chaîne de dominantes':'Cadena de dominantes',
'Cadence rompue':'Cadencia rota'
};
var MOD_DESC_I18N={
'Préparé par ii → V⁷ pour une cadence douce.':'Prepared with ii → V⁷ for a smooth cadence.',
"V⁷ de l'arrivée introduite. Adoucie par ii → V⁷.":'V⁷ of target key introduced. Smoothed with ii → V⁷.',
'♭II → ii → V⁷ → I. Approche par demi-ton adoucie.':'♭II → ii → V⁷ → I. Chromatic approach smoothed.',
"Altération chromatique d'une voix":'Chromatic alteration of a voice',
'Changement abrupt après cadence':'Abrupt change after cadence',
};
var MOD_DESC_I18N_ES={
'Préparé par ii → V⁷ pour une cadence douce.':'Preparado con ii → V⁷ para una cadencia suave.',
"V⁷ de l'arrivée introduite. Adoucie par ii → V⁷.":'V⁷ de la tonalidad de llegada introducida. Suavizada con ii → V⁷.',
'♭II → ii → V⁷ → I. Approche par demi-ton adoucie.':'♭II → ii → V⁷ → I. Aproximación cromática suavizada.',
"Altération chromatique d'une voix":'Alteración cromática de una voz',
'Changement abrupt après cadence':'Cambio abrupto tras la cadencia',
};
function tMod(nm){
  if(currentLang==='en') return MOD_NM_I18N[nm]||nm;
  if(currentLang==='es') return MOD_NM_I18N_ES[nm]||nm;
  return nm;
}

// ── Sequence translations ──
/* skip */
var SEQ_CAT_I18N={
'Quintes':'Fifths','Tierces':'Thirds','Secondes':'Seconds',
'Sixtes':'Sixths','Composées':'Compound','Cadences':'Cadences',
'Chromatiques':'Chromatic','Dom. secondaires':'Applied Chords'
};
var SEQ_CAT_I18N_ES={
'Quintes':'Quintas','Tierces':'Terceras','Secondes':'Segundas',
'Sixtes':'Sextas','Composées':'Compuestas','Cadences':'Cadencias',
'Chromatiques':'Cromáticas','Dom. secondaires':'Dom. secundarias'
};
var SEQ_NM_I18N={
'Quintes descendantes (triades)':'Descending Fifths (triads)',
'Quintes descendantes (septièmes)':'Descending Fifths (sevenths)',
'Quintes ascendantes (triades)':'Ascending Fifths (triads)',
'Quintes ascendantes (septièmes)':'Ascending Fifths (sevenths)',
'Quintes desc. (7èmes alternées)':'Desc. Fifths (alternating 7ths)',
'Tierces descendantes':'Descending Thirds',
'Tierces descendantes (septièmes)':'Descending Thirds (sevenths)',
'Tierces ascendantes':'Ascending Thirds',
'Secondes descendantes':'Descending Seconds',
'Secondes descendantes (septièmes)':'Descending Seconds (sevenths)',
'Secondes ascendantes':'Ascending Seconds',
'Secondes ascendantes (septièmes)':'Ascending Seconds (sevenths)',
'5–6 ascendante':'5–6 Ascending','5–6 descendante':'5–6 Descending',
'6/3 parallèles descendantes':'Parallel 6/3 Descending',
'6/3 parallèles ascendantes':'Parallel 6/3 Ascending',
'↓5 ↑4 (descend 5te, monte 4te)':'↓5 ↑4 (down 5th, up 4th)',
'↓3 ↑4 (descend 3ce, monte 4te)':'↓3 ↑4 (down 3rd, up 4th)',
'↓4 ↑2 (descend 4te, monte 2de)':'↓4 ↑2 (down 4th, up 2nd)',
'Pachelbel (I–V–vi–iii–IV–I–IV–V)':'Pachelbel (I–V–vi–iii–IV–I–IV–V)',
'Romanesca (I–V–vi–iii–IV–I–ii–V)':'Romanesca (I–V–vi–iii–IV–I–ii–V)',
'Monte (IV–V–vi / ♭VI–♭VII–i)':'Monte (IV–V–vi / ♭VI–♭VII–i)',
'Fonte (ii–V–I en séquence)':'Fonte (ii–V–I in sequence)',
'Évitées par quintes (V7)':'Avoided by fifths (V7)',
'Évitées par quintes (dim7)':'Avoided by fifths (dim7)',
'Interrompues tierce desc.':'Interrupted desc. thirds',
'Interrompues tierce asc.':'Interrupted asc. thirds',
'Interrompues quarte desc.':'Interrupted desc. fourths',
'Rompues (V7→vi en chaîne)':'Deceptive (V7→vi chain)',
'Chaîne de 7ᵉˢ diminuées':'Diminished 7th chain',
'7ᵉˢ diminuées ascendantes':'Ascending diminished 7ths',
'Omnibus':'Omnibus',
'Omnibus inversé':'Inverted Omnibus',
'Échange chromatique de voix':'Chromatic voice exchange',
'Monte chromatique':'Chromatic Monte',
'Fonte chromatique':'Chromatic Fonte',
'Ponte (pédale)':'Ponte (pedal)',
'Par triton (substitution)':'Tritone substitution',
'D2 (−5/+4) + ⁶₃ — Quintes desc. avec renversements':'D2 (−5/+4) + ⁶₃ — Desc. Fifths with inversions',
'D2 (−5/+4) + 7 interlocking — 7èmes imbriquées':'D2 (−5/+4) + 7 interlocking',
'D2 (−5/+4) + ⁶₅ — 7èmes en renversement':'D2 (−5/+4) + ⁶₅ — Sevenths in inversion',
'D2 (−5/+4) + ⁴₂ — Septièmes second renversement':'D2 (−5/+4) + ⁴₂ — Sevenths 2nd inversion',
'D3 (−4/+2) + ⁶₃ — Tierces desc. avec renversements':'D3 (−4/+2) + ⁶₃ — Desc. Thirds with inversions',
'A2 (−3/+4) — Secondes asc. (↓3 ↑4)':'A2 (−3/+4) — Asc. Seconds (↓3 ↑4)',
'D2 (−5/+4) — Dom. sec. (triades)':'D2 (−5/+4) — Applied (triads)',
'D2 (−5/+4) — Dom. sec. (7èmes alternées)':'D2 (−5/+4) — Applied (alternating 7ths)',
'D2 (−5/+4) — Dom. sec. (7èmes imbriquées)':'D2 (−5/+4) — Applied (interlocking 7ths)',
'D3 (+3/−5) — Dom. sec. (triades)':'D3 (+3/−5) — Applied (triads)',
'D3 (+3/−5) — Dom. sec. (⁶₅)':'D3 (+3/−5) — Applied (⁶₅)',
'A2 (−3/+4) — Dom. sec. (5-6 ascendante)':'A2 (−3/+4) — Applied (ascending 5-6)',
'A2 (−3/+4) — Dom. sec. (7èmes)':'A2 (−3/+4) — Applied (7ths)',
'Corelli (chaîne 7-3 baroque)':'Corelli (Baroque 7-3 chain)',
'Vivaldi (ritournelle concerto)':'Vivaldi (concerto ritornello)',
'Vivaldi (séquence 7èmes concertante)':'Vivaldi (concerto 7ths sequence)',
'Haydn (cadence classique I–vi–IV–ii–V–I)':'Haydn (Classical cadence I–vi–IV–ii–V–I)',
'Mozart (galant I–IV–V/V–V–I)':'Mozart (galant I–IV–V/V–V–I)',
'Mozart (I–V6–I6–IV–V–I)':'Mozart (I–V6–I6–IV–V–I)',
'Schubert (relations de tierce I–♭VI–IV–I)':'Schubert (third relations I–♭VI–IV–I)',
'Schubert (chaîne médiantique)':'Schubert (mediant chain)',
'Brahms (plagale étendue iv–♭VII–I)':'Brahms (extended plagal iv–♭VII–I)',
'Brahms (cycle chromatique de tierces)':'Brahms (chromatic third cycle)',
};
var SEQ_DESC_I18N={
'La séquence la plus fondamentale. Basse descend par quinte, monte par quarte.':'The most fundamental sequence. Bass descends by fifth, rises by fourth.',
'Chaîne de septièmes descendant par quinte. Résolution 7→3 systématique.':'Chain of sevenths descending by fifth. Systematic 7→3 resolution.',
'Mouvement de basse par quinte ascendante. Moins fréquent.':'Bass motion by ascending fifth. Less common.',
'Chaîne de septièmes montant par quinte.':'Chain of sevenths ascending by fifth.',
'Basse descend par tierce. Effet de glissement harmonique doux.':'Bass descends by third. Smooth harmonic gliding effect.',
'Tierces descendantes avec accords de septième.':'Descending thirds with seventh chords.',
'Basse monte par tierce. Crée un effet d\'expansion harmonique.':'Bass rises by third. Creates a harmonic expansion effect.',
'Basse descend par degré conjoint. Effet de lamento / basse chromatique.':'Bass descends by step. Lamento / chromatic bass effect.',
'Basse descendante par degré conjoint avec septièmes.':'Stepwise descending bass with sevenths.',
'Basse monte par degré conjoint. Règle de l\'octave ascendante.':'Bass rises by step. Ascending rule of the octave.',
'Monte par degré conjoint avec septièmes.':'Stepwise ascending motion with sevenths.',
'Basse conjointe ascendante, alternance 5/3 et 6/3. Évite les quintes parallèles.':'Ascending stepwise bass, alternating 5/3 and 6/3. Avoids parallel fifths.',
'Basse conjointe descendante, alternance 5/3 et 6/3.':'Descending stepwise bass, alternating 5/3 and 6/3.',
'Fauxbourdon : accords de sixte parallèles descendant par degré conjoint. Sixtes parallèles entre voix extrêmes.':'Fauxbourdon: parallel sixth chords descending by step. Parallel sixths between outer voices.',
'Accords de sixte parallèles montant par degré conjoint.':'Parallel sixth chords ascending by step.',
'Alternance quinte descendante / quarte ascendante. Très utilisée par Bach.':'Alternating descending fifth / ascending fourth. Widely used by Bach.',
'Alternance tierce descendante / quarte ascendante.':'Alternating descending third / ascending fourth.',
'Alternance quarte descendante / seconde ascendante.':'Alternating descending fourth / ascending second.',
'Le canon de Pachelbel. Basse descendante emblématique.':'The Pachelbel Canon. Iconic descending bass.',
'Variante Renaissance de la basse descendante.':'Renaissance variant of the descending bass.',
'Mouvement ascendant par seconde. Patron de séquence Renaissance-Baroque.':'Ascending motion by second. Renaissance-Baroque sequence pattern.',
'Séquence descendante ii–V–I transposée à chaque degré.':'Descending ii–V–I sequence transposed at each degree.',
'Chaîne de septièmes de dominante descendant par quinte. Chaque V7 ne résout pas mais devient la dominante du ton suivant.':'Chain of dominant sevenths descending by fifth. Each V7 does not resolve but becomes the dominant of the next key.',
'Même mouvement par quintes descendantes, mais avec des septièmes diminuées. Toutes les parties descendent par demi-ton.':'Same descending fifth motion, but with diminished sevenths. All voices descend by semitone.',
'Suite de V7 dont chaque fondamentale descend d\'une tierce. Produit un cycle de 4 tonalités.':'Chain of V7 chords with each root descending by third. Produces a cycle of 4 keys.',
'Suite de V7 dont chaque fondamentale monte d\'une tierce.':'Chain of V7 chords with each root ascending by third.',
'Suite de V7 dont chaque fondamentale descend d\'une quarte.':'Chain of V7 chords with each root descending by fourth.',
'Chaîne de cadences rompues : chaque V7 résout sur le degré supérieur (vi) au lieu de la tonique attendue.':'Chain of deceptive cadences: each V7 resolves up to vi instead of the expected tonic.',
'Chaîne de 7ᵉˢ diminuées chromatiques. Toutes les voix descendent par demi-ton.':'Chain of chromatic diminished 7ths. All voices descend by semitone.',
'Chaîne de 7ᵉˢ diminuées ascendantes. Toutes les voix montent par demi-ton.':'Chain of ascending diminished 7ths. All voices rise by semitone.',
'Mouvement chromatique contraire : basse ↓ (do–si–si♭–la–la♭–sol) / soprano ↑ (mi–fa–fa♯–sol–sol♯–la). Voix intérieures tenues (do, sol). Alternance I–V⁴₃–I⁶–V⁴₂–I⁶… .':'Contrary chromatic motion: bass ↓ (C–B–B♭–A–A♭–G) / soprano ↑ (E–F–F♯–G–G♯–A). Inner voices held (C, G). Alternation I–V⁴₃–I⁶–V⁴₂–I⁶…',
'Omnibus inversé : basse ↑ chromatique (sol–sol♯–la–la♯–si–do) / soprano ↓ chromatique (mi–mi♭–ré–ré♭–do). Même principe de mouvement contraire, direction inversée.':'Inverted Omnibus: chromatic bass ↑ (G–G♯–A–A♯–B–C) / chromatic soprano ↓ (E–E♭–D–D♭–C). Same contrary motion principle, reversed direction.',
'Deux voix échangent leurs notes par mouvement chromatique contraire. Basse monte chromatiquement (do→do♯→ré→ré♯→mi) pendant que le soprano descend (mi→mi♭→ré→ré♭→do). L\'accord change de couleur sans changer de fonction.':'Two voices exchange their notes through contrary chromatic motion. Bass rises chromatically (C→C♯→D→D♯→E) while soprano descends (E→E♭→D→D♭→C). The chord changes color without changing function.',
'Monte par demi-ton au lieu de ton entier. Intensification chromatique.':'Monte by semitone instead of whole tone. Chromatic intensification.',
'Fonte par demi-ton. Chaque cycle ii–V–I descend d\'un demi-ton.':'Fonte by semitone. Each ii–V–I cycle descends by a semitone.',
'Pédale de dominante comme pont stable entre deux zones tonales.':'Dominant pedal as a stable bridge between two tonal areas.',
'Chaîne de dominantes par substitution tritonique. Chaque V7 est remplacé par le V7 situé un triton plus loin. Basse descend par demi-ton.':'Chain of dominants by tritone substitution. Each V7 is replaced by the V7 a tritone away. Bass descends by semitone.',
'Séquence de quintes descendantes alternant position fondamentale et premier renversement (Laitz Ex. 17.18A).':'Descending fifths alternating root position and first inversion (Laitz Ex. 17.18A).',
'Toutes les septièmes sont présentes simultanément : chaque accord résout sa septième pendant qu\'une nouvelle septième apparaît (Laitz Ex. 17.18E interlocking).':'All sevenths present simultaneously: each chord resolves its seventh while a new seventh appears (Laitz Ex. 17.18E interlocking).',
'Quintes descendantes avec septièmes en alternance 5/3 et 6/5. La basse descend par degré conjoint (Laitz Ex. 17.18E).':'Descending fifths with sevenths alternating 5/3 and 6/5. Bass descends by step (Laitz Ex. 17.18E).',
'Quintes descendantes avec septièmes alternant 4/2 et 6/5. Basse progresse par degré conjoint alterné (Laitz p. 342).':'Descending fifths with sevenths alternating 4/2 and 6/5. Bass progresses by alternating steps (Laitz p. 342).',
'Tierces descendantes alternant position fondamentale et premier renversement. Mouvement de basse plus conjoint (Laitz Ex. 17.18B).':'Descending thirds alternating root position and first inversion. Smoother bass motion (Laitz Ex. 17.18B).',
'Basse alterne tierce descendante et quarte ascendante. Résultat net : montée par seconde. Séquence « 5-6 » en position fondamentale (Laitz Ex. 17.18D).':'Bass alternates descending third and ascending fourth. Net result: ascending by second. "5-6" sequence in root position (Laitz Ex. 17.18D).',
'Séquence par quintes descendantes avec dominantes secondaires : chaque accord diatonique est précédé de son V. Le chromatisme crée un mouvement de sensibles résolvantes à travers le cercle des quintes (Laitz Ex. 18.20).':'Descending fifths with applied dominants: each diatonic chord is preceded by its V. Chromaticism creates a chain of resolving leading tones through the circle of fifths (Laitz Ex. 18.20).',
'Quintes descendantes avec V7 secondaires alternant avec septièmes diatoniques. Résolution 7→3 entre chaque paire V7→cible (Laitz Ex. 18.20B).':'Descending fifths with applied V7s alternating with diatonic sevenths. Resolution 7→3 between each V7→target pair (Laitz Ex. 18.20B).',
'Toutes les septièmes dominantes imbriquées : V7/IV→V7/vii°→V7/iii→V7/vi→V7/ii→V7/V→V7→I. Chaque V7 résout directement dans le V7 du degré suivant (Laitz Ex. 18.20B interlocking).':'All interlocking dominant sevenths: V7/IV→V7/vii°→V7/iii→V7/vi→V7/ii→V7/V→V7→I. Each V7 resolves directly into the V7 of the next degree (Laitz Ex. 18.20B interlocking).',
'Tierces descendantes avec dominantes secondaires : basse monte par tierce vers un V, puis descend par quinte vers la résolution. Crée un chromatisme ascendant dans la basse (Laitz Ex. 18.22-23).':'Descending thirds with applied dominants: bass rises by third to a V, then descends by fifth to the resolution. Creates ascending chromaticism in the bass (Laitz Ex. 18.22-23).',
'Tierces descendantes avec V⁶₅ secondaires en renversement. Basse descend chromatiquement par demi-ton entre chaque paire V⁶₅→cible (Laitz Ex. 18.23).':'Descending thirds with applied V⁶₅ in inversion. Bass descends chromatically by semitone between each V⁶₅→target pair (Laitz Ex. 18.23).',
'Séquence 5-6 ascendante avec dominantes secondaires : la basse monte chromatiquement d\'un demi-ton pour former un V⁶ qui résout sur le degré suivant en montant (Laitz Ex. 18.24-25). Puissant mouvement chromatique ascendant.':'Ascending 5-6 with applied dominants: the bass rises chromatically by semitone to form an applied V⁶ resolving upward to the next degree (Laitz Ex. 18.24-25). Powerful ascending chromatic motion.',
'Variante avec V7 secondaires en position fondamentale. Chaque V7 résout en montant par quarte (Laitz Ex. 18.25).':'Variant with applied V7s in root position. Each V7 resolves upward by fourth (Laitz Ex. 18.25).',
'Comme la séquence par quintes avec septièmes, mais en alternant 7ᵉ de dominante et 7ᵉ mineure (résolution 7→3 / liaison 3→7).':'Like the fifths sequence with sevenths, but alternating dominant 7th and minor 7th (resolution 7→3 / link 3→7).',
'Altération chromatique d\'une voix':'Chromatic alteration of a voice',
'Changement abrupt après cadence':'Abrupt change after cadence',
'Suite de V⁷ descendant par quintes. Adoucie par IV et ii de préparation.':'Chain of V⁷ descending by fifths. Softened by IV and ii preparation.',
'Suspension 7-3 typique de Corelli : chaque accord prépare et résout la septième de l\'accord suivant. Mouvement de basse par quintes descendantes avec suspensions caractéristiques du style des sonates en trio.':'Corellian 7-3 suspension: each chord prepares and resolves the seventh of the next chord. Bass motion by descending fifths with suspensions typical of trio sonata style.',
'Patron de ritournelle vivaldien : I–V–vi–iii–IV–I–IV–V–I avec énergie rythmique. Base de nombreux concertos baroques.':'Vivaldian ritornello pattern: I–V–vi–iii–IV–I–IV–V–I with rhythmic energy. Basis of many Baroque concertos.',
'Chaîne de septièmes diatoniques style concerto vivaldien. Énergie motorique baroque tardive avec mouvement de basse par quintes.':'Chain of diatonic sevenths in Vivaldian concerto style. Late-Baroque motoric energy with bass motion by fifths.',
'Cadence classique haydnienne par tierces descendantes puis cadence parfaite. Modèle d\'équilibre du style classique viennois.':'Haydnesque Classical cadence by descending thirds then perfect cadence. Model of balance from the Viennese Classical style.',
'Cadence galante mozartienne avec dominante de dominante. Élégance et clarté du style classique. La V/V intensifie la cadence.':'Mozartian galant cadence with dominant of dominant. Elegance and clarity of the Classical style. V/V intensifies the cadence.',
'Patron mozartien avec basses d\'Alberti implicites : alternance de renversements pour fluidité mélodique de la basse. Très utilisé dans les sonates K. 545 et K. 331.':'Mozartian pattern with implicit Alberti basses: alternating inversions for melodic bass fluidity. Widely used in K. 545 and K. 331 sonatas.',
'Modulation par relation de tierce chromatique typique de Schubert. La basse descend par tierce majeure (I→♭VI) créant un effet de coloration romantique.':'Modulation by chromatic third relation typical of Schubert. Bass descends by major third (I→♭VI) creating a Romantic coloring effect.',
'Chaîne de relations médiantiques : I–III–♭VI–i. Voyage tonal par tierces caractéristique du lied schubertien.':'Chain of mediant relations: I–III–♭VI–i. Tonal journey by thirds characteristic of the Schubertian lied.',
'Cadence plagale étendue brahmsienne avec emprunt modal au mineur. Couleur sombre et nostalgique typique du romantisme tardif.':'Brahmsian extended plagal cadence with modal borrowing from minor. Dark, nostalgic color typical of late Romanticism.',
'Cycle de tierces majeures équidistantes (I–♭VI–III–I), divisant l\'octave en trois. Procédé wagnero-brahmsien de transition tonale.':'Cycle of equidistant major thirds (I–♭VI–III–I), dividing the octave in three. Wagnerian-Brahmsian device of tonal transition.',
};
var SEQ_NM_I18N_ES={
'Quintes descendantes (triades)':'Quintas descendentes (tríadas)',
'Quintes descendantes (septièmes)':'Quintas descendentes (séptimas)',
'Quintes ascendantes (triades)':'Quintas ascendentes (tríadas)',
'Quintes ascendantes (septièmes)':'Quintas ascendentes (séptimas)',
'Quintes desc. (7èmes alternées)':'Quintas desc. (7ªˢ alternadas)',
'Tierces descendantes':'Terceras descendentes',
'Tierces descendantes (septièmes)':'Terceras descendentes (séptimas)',
'Tierces ascendantes':'Terceras ascendentes',
'Secondes descendantes':'Segundas descendentes',
'Secondes descendantes (septièmes)':'Segundas descendentes (séptimas)',
'Secondes ascendantes':'Segundas ascendentes',
'Secondes ascendantes (septièmes)':'Segundas ascendentes (séptimas)',
'5–6 ascendante':'5–6 ascendente',
'5–6 descendante':'5–6 descendente',
'6/3 parallèles descendantes':'6/3 paralelas descendentes',
'6/3 parallèles ascendantes':'6/3 paralelas ascendentes',
'↓5 ↑4 (descend 5te, monte 4te)':'↓5 ↑4 (baja 5ª, sube 4ª)',
'↓3 ↑4 (descend 3ce, monte 4te)':'↓3 ↑4 (baja 3ª, sube 4ª)',
'↓4 ↑2 (descend 4te, monte 2de)':'↓4 ↑2 (baja 4ª, sube 2ª)',
'Pachelbel (I–V–vi–iii–IV–I–IV–V)':'Pachelbel (I–V–vi–iii–IV–I–IV–V)',
'Romanesca (I–V–vi–iii–IV–I–ii–V)':'Romanesca (I–V–vi–iii–IV–I–ii–V)',
'Monte (IV–V–vi / ♭VI–♭VII–i)':'Monte (IV–V–vi / ♭VI–♭VII–i)',
'Fonte (ii–V–I en séquence)':'Fonte (ii–V–I en secuencia)',
'Évitées par quintes (V7)':'Evitadas por quintas (V7)',
'Évitées par quintes (dim7)':'Evitadas por quintas (dim7)',
'Interrompues tierce desc.':'Interrumpidas tercera desc.',
'Interrompues tierce asc.':'Interrumpidas tercera asc.',
'Interrompues quarte desc.':'Interrumpidas cuarta desc.',
'Rompues (V7→vi en chaîne)':'Rotas (V7→vi en cadena)',
'Chaîne de 7ᵉˢ diminuées':'Cadena de 7ªˢ disminuidas',
'7ᵉˢ diminuées ascendantes':'7ªˢ disminuidas ascendentes',
'Omnibus':'Omnibus',
'Omnibus inversé':'Omnibus invertido',
'Échange chromatique de voix':'Intercambio cromático de voces',
'Monte chromatique':'Monte cromático',
'Fonte chromatique':'Fonte cromático',
'Ponte (pédale)':'Ponte (pedal)',
'Par triton (substitution)':'Por tritono (sustitución)',
'D2 (−5/+4) + ⁶₃ — Quintes desc. avec renversements':'D2 (−5/+4) + ⁶₃ — Quintas desc. con inversiones',
'D2 (−5/+4) + 7 interlocking — 7èmes imbriquées':'D2 (−5/+4) + 7 imbricadas — 7ªˢ imbricadas',
'D2 (−5/+4) + ⁶₅ — 7èmes en renversement':'D2 (−5/+4) + ⁶₅ — 7ªˢ en inversión',
'D2 (−5/+4) + ⁴₂ — Septièmes second renversement':'D2 (−5/+4) + ⁴₂ — Séptimas segunda inversión',
'D3 (−4/+2) + ⁶₃ — Tierces desc. avec renversements':'D3 (−4/+2) + ⁶₃ — Terceras desc. con inversiones',
'A2 (−3/+4) — Secondes asc. (↓3 ↑4)':'A2 (−3/+4) — Segundas asc. (↓3 ↑4)',
'D2 (−5/+4) — Dom. sec. (triades)':'D2 (−5/+4) — Dom. sec. (tríadas)',
'D2 (−5/+4) — Dom. sec. (7èmes alternées)':'D2 (−5/+4) — Dom. sec. (7ªˢ alternadas)',
'D2 (−5/+4) — Dom. sec. (7èmes imbriquées)':'D2 (−5/+4) — Dom. sec. (7ªˢ imbricadas)',
'D3 (+3/−5) — Dom. sec. (triades)':'D3 (+3/−5) — Dom. sec. (tríadas)',
'D3 (+3/−5) — Dom. sec. (⁶₅)':'D3 (+3/−5) — Dom. sec. (⁶₅)',
'A2 (−3/+4) — Dom. sec. (5-6 ascendante)':'A2 (−3/+4) — Dom. sec. (5-6 ascendente)',
'A2 (−3/+4) — Dom. sec. (7èmes)':'A2 (−3/+4) — Dom. sec. (7ªˢ)',
'Corelli (chaîne 7-3 baroque)':'Corelli (cadena 7-3 barroca)',
'Vivaldi (ritournelle concerto)':'Vivaldi (ritornello de concierto)',
'Vivaldi (séquence 7èmes concertante)':'Vivaldi (secuencia 7ªˢ concertante)',
'Haydn (cadence classique I–vi–IV–ii–V–I)':'Haydn (cadencia clásica I–vi–IV–ii–V–I)',
'Mozart (galant I–IV–V/V–V–I)':'Mozart (galante I–IV–V/V–V–I)',
'Mozart (I–V6–I6–IV–V–I)':'Mozart (I–V6–I6–IV–V–I)',
'Schubert (relations de tierce I–♭VI–IV–I)':'Schubert (relaciones de tercera I–♭VI–IV–I)',
'Schubert (chaîne médiantique)':'Schubert (cadena mediante)',
'Brahms (plagale étendue iv–♭VII–I)':'Brahms (plagal extendida iv–♭VII–I)',
'Brahms (cycle chromatique de tierces)':'Brahms (ciclo cromático de terceras)',
};
var SEQ_DESC_I18N_ES={
'La séquence la plus fondamentale. Basse descend par quinte, monte par quarte.':'La secuencia más fundamental. El bajo desciende por quinta, sube por cuarta.',
'Chaîne de septièmes descendant par quinte. Résolution 7→3 systématique.':'Cadena de séptimas descendiendo por quinta. Resolución 7→3 sistemática.',
'Mouvement de basse par quinte ascendante. Moins fréquent.':'Movimiento del bajo por quinta ascendente. Menos frecuente.',
'Chaîne de septièmes montant par quinte.':'Cadena de séptimas subiendo por quinta.',
'Basse descend par tierce. Effet de glissement harmonique doux.':'El bajo desciende por tercera. Efecto de deslizamiento armónico suave.',
'Tierces descendantes avec accords de septième.':'Terceras descendentes con acordes de séptima.',
'Basse monte par tierce. Crée un effet d\'expansion harmonique.':'El bajo sube por tercera. Crea un efecto de expansión armónica.',
'Basse descend par degré conjoint. Effet de lamento / basse chromatique.':'El bajo desciende por grado conjunto. Efecto de lamento / bajo cromático.',
'Basse descendante par degré conjoint avec septièmes.':'Bajo descendente por grado conjunto con séptimas.',
'Basse monte par degré conjoint. Règle de l\'octave ascendante.':'El bajo sube por grado conjunto. Regla de la octava ascendente.',
'Monte par degré conjoint avec septièmes.':'Movimiento ascendente por grado conjunto con séptimas.',
'Basse conjointe ascendante, alternance 5/3 et 6/3. Évite les quintes parallèles.':'Bajo conjunto ascendente, alternando 5/3 y 6/3. Evita las quintas paralelas.',
'Basse conjointe descendante, alternance 5/3 et 6/3.':'Bajo conjunto descendente, alternando 5/3 y 6/3.',
'Fauxbourdon : accords de sixte parallèles descendant par degré conjoint. Sixtes parallèles entre voix extrêmes.':'Fauxbourdon: acordes de sexta paralelos descendiendo por grado conjunto. Sextas paralelas entre voces extremas.',
'Accords de sixte parallèles montant par degré conjoint.':'Acordes de sexta paralelos subiendo por grado conjunto.',
'Alternance quinte descendante / quarte ascendante. Très utilisée par Bach.':'Alternancia quinta descendente / cuarta ascendente. Muy utilizada por Bach.',
'Alternance tierce descendante / quarte ascendante.':'Alternancia tercera descendente / cuarta ascendente.',
'Alternance quarte descendante / seconde ascendante.':'Alternancia cuarta descendente / segunda ascendente.',
'Le canon de Pachelbel. Basse descendante emblématique.':'El canon de Pachelbel. Bajo descendente emblemático.',
'Variante Renaissance de la basse descendante.':'Variante renacentista del bajo descendente.',
'Mouvement ascendant par seconde. Patron de séquence Renaissance-Baroque.':'Movimiento ascendente por segunda. Patrón de secuencia renacentista-barroca.',
'Séquence descendante ii–V–I transposée à chaque degré.':'Secuencia descendente ii–V–I transportada en cada grado.',
'Chaîne de septièmes de dominante descendant par quinte. Chaque V7 ne résout pas mais devient la dominante du ton suivant.':'Cadena de séptimas de dominante descendiendo por quinta. Cada V7 no resuelve sino que se convierte en la dominante de la siguiente tonalidad.',
'Même mouvement par quintes descendantes, mais avec des septièmes diminuées. Toutes les parties descendent par demi-ton.':'Mismo movimiento por quintas descendentes, pero con séptimas disminuidas. Todas las voces descienden por semitono.',
'Suite de V7 dont chaque fondamentale descend d\'une tierce. Produit un cycle de 4 tonalités.':'Cadena de V7 cuya fundamental desciende una tercera. Produce un ciclo de 4 tonalidades.',
'Suite de V7 dont chaque fondamentale monte d\'une tierce.':'Cadena de V7 cuya fundamental sube una tercera.',
'Suite de V7 dont chaque fondamentale descend d\'une quarte.':'Cadena de V7 cuya fundamental desciende una cuarta.',
'Chaîne de cadences rompues : chaque V7 résout sur le degré supérieur (vi) au lieu de la tonique attendue.':'Cadena de cadencias rotas: cada V7 resuelve en el grado superior (vi) en lugar de la tónica esperada.',
'Chaîne de 7ᵉˢ diminuées chromatiques. Toutes les voix descendent par demi-ton.':'Cadena de 7ªˢ disminuidas cromáticas. Todas las voces descienden por semitono.',
'Chaîne de 7ᵉˢ diminuées ascendantes. Toutes les voix montent par demi-ton.':'Cadena de 7ªˢ disminuidas ascendentes. Todas las voces suben por semitono.',
'Mouvement chromatique contraire : basse ↓ (do–si–si♭–la–la♭–sol) / soprano ↑ (mi–fa–fa♯–sol–sol♯–la). Voix intérieures tenues (do, sol). Alternance I–V⁴₃–I⁶–V⁴₂–I⁶… .':'Movimiento cromático contrario: bajo ↓ (do–si–si♭–la–la♭–sol) / soprano ↑ (mi–fa–fa♯–sol–sol♯–la). Voces interiores mantenidas (do, sol). Alternancia I–V⁴₃–I⁶–V⁴₂–I⁶…',
'Omnibus inversé : basse ↑ chromatique (sol–sol♯–la–la♯–si–do) / soprano ↓ chromatique (mi–mi♭–ré–ré♭–do). Même principe de mouvement contraire, direction inversée.':'Omnibus invertido: bajo ↑ cromático (sol–sol♯–la–la♯–si–do) / soprano ↓ cromático (mi–mi♭–re–re♭–do). Mismo principio de movimiento contrario, dirección invertida.',
'Deux voix échangent leurs notes par mouvement chromatique contraire. Basse monte chromatiquement (do→do♯→ré→ré♯→mi) pendant que le soprano descend (mi→mi♭→ré→ré♭→do). L\'accord change de couleur sans changer de fonction.':'Dos voces intercambian sus notas mediante movimiento cromático contrario. El bajo sube cromáticamente (do→do♯→re→re♯→mi) mientras el soprano desciende (mi→mi♭→re→re♭→do). El acorde cambia de color sin cambiar de función.',
'Monte par demi-ton au lieu de ton entier. Intensification chromatique.':'Monte por semitono en lugar de tono entero. Intensificación cromática.',
'Fonte par demi-ton. Chaque cycle ii–V–I descend d\'un demi-ton.':'Fonte por semitono. Cada ciclo ii–V–I desciende un semitono.',
'Pédale de dominante comme pont stable entre deux zones tonales.':'Pedal de dominante como puente estable entre dos zonas tonales.',
'Chaîne de dominantes par substitution tritonique. Chaque V7 est remplacé par le V7 situé un triton plus loin. Basse descend par demi-ton.':'Cadena de dominantes por sustitución tritonal. Cada V7 se sustituye por el V7 situado a un tritono de distancia. El bajo desciende por semitono.',
'Séquence de quintes descendantes alternant position fondamentale et premier renversement (Laitz Ex. 17.18A).':'Secuencia de quintas descendentes alternando estado fundamental y primera inversión.',
'Toutes les septièmes sont présentes simultanément : chaque accord résout sa septième pendant qu\'une nouvelle septième apparaît (Laitz Ex. 17.18E interlocking).':'Todas las séptimas están presentes simultáneamente: cada acorde resuelve su séptima mientras aparece una nueva séptima.',
'Quintes descendantes avec septièmes en alternance 5/3 et 6/5. La basse descend par degré conjoint (Laitz Ex. 17.18E).':'Quintas descendentes con séptimas alternando 5/3 y 6/5. El bajo desciende por grado conjunto.',
'Quintes descendantes avec septièmes alternant 4/2 et 6/5. Basse progresse par degré conjoint alterné (Laitz p. 342).':'Quintas descendentes con séptimas alternando 4/2 y 6/5. El bajo progresa por grados conjuntos alternados.',
'Tierces descendantes alternant position fondamentale et premier renversement. Mouvement de basse plus conjoint (Laitz Ex. 17.18B).':'Terceras descendentes alternando estado fundamental y primera inversión. Movimiento del bajo más conjunto.',
'Basse alterne tierce descendante et quarte ascendante. Résultat net : montée par seconde. Séquence « 5-6 » en position fondamentale (Laitz Ex. 17.18D).':'El bajo alterna tercera descendente y cuarta ascendente. Resultado neto: subida por segunda. Secuencia «5-6» en estado fundamental.',
'Séquence par quintes descendantes avec dominantes secondaires : chaque accord diatonique est précédé de son V. Le chromatisme crée un mouvement de sensibles résolvantes à travers le cercle des quintes (Laitz Ex. 18.20).':'Secuencia por quintas descendentes con dominantes secundarias: cada acorde diatónico va precedido de su V. El cromatismo crea un movimiento de sensibles resolutivas a través del círculo de quintas.',
'Quintes descendantes avec V7 secondaires alternant avec septièmes diatoniques. Résolution 7→3 entre chaque paire V7→cible (Laitz Ex. 18.20B).':'Quintas descendentes con V7 secundarios alternando con séptimas diatónicas. Resolución 7→3 entre cada par V7→destino.',
'Toutes les septièmes dominantes imbriquées : V7/IV→V7/vii°→V7/iii→V7/vi→V7/ii→V7/V→V7→I. Chaque V7 résout directement dans le V7 du degré suivant (Laitz Ex. 18.20B interlocking).':'Todas las séptimas de dominante imbricadas: V7/IV→V7/vii°→V7/iii→V7/vi→V7/ii→V7/V→V7→I. Cada V7 resuelve directamente en el V7 del grado siguiente.',
'Tierces descendantes avec dominantes secondaires : basse monte par tierce vers un V, puis descend par quinte vers la résolution. Crée un chromatisme ascendant dans la basse (Laitz Ex. 18.22-23).':'Terceras descendentes con dominantes secundarias: el bajo sube por tercera hacia un V, luego desciende por quinta hacia la resolución. Crea cromatismo ascendente en el bajo.',
'Tierces descendantes avec V⁶₅ secondaires en renversement. Basse descend chromatiquement par demi-ton entre chaque paire V⁶₅→cible (Laitz Ex. 18.23).':'Terceras descendentes con V⁶₅ secundarios en inversión. El bajo desciende cromáticamente por semitono entre cada par V⁶₅→destino.',
'Séquence 5-6 ascendante avec dominantes secondaires : la basse monte chromatiquement d\'un demi-ton pour former un V⁶ qui résout sur le degré suivant en montant (Laitz Ex. 18.24-25). Puissant mouvement chromatique ascendant.':'Secuencia 5-6 ascendente con dominantes secundarias: el bajo sube cromáticamente un semitono para formar un V⁶ que resuelve en el grado siguiente subiendo. Potente movimiento cromático ascendente.',
'Variante avec V7 secondaires en position fondamentale. Chaque V7 résout en montant par quarte (Laitz Ex. 18.25).':'Variante con V7 secundarios en estado fundamental. Cada V7 resuelve subiendo por cuarta.',
'Comme la séquence par quintes avec septièmes, mais en alternant 7ᵉ de dominante et 7ᵉ mineure (résolution 7→3 / liaison 3→7).':'Como la secuencia por quintas con séptimas, pero alternando 7ª de dominante y 7ª menor (resolución 7→3 / enlace 3→7).',
'Altération chromatique d\'une voix':'Alteración cromática de una voz',
'Changement abrupt après cadence':'Cambio abrupto tras la cadencia',
'Suite de V⁷ descendant par quintes. Adoucie par IV et ii de préparation.':'Cadena de V⁷ descendiendo por quintas. Suavizada por IV y ii de preparación.',
'Suspension 7-3 typique de Corelli : chaque accord prépare et résout la septième de l\'accord suivant. Mouvement de basse par quintes descendantes avec suspensions caractéristiques du style des sonates en trio.':'Suspensión 7-3 típica de Corelli: cada acorde prepara y resuelve la séptima del siguiente. Movimiento del bajo por quintas descendentes con suspensiones características del estilo de las sonatas en trío.',
'Patron de ritournelle vivaldien : I–V–vi–iii–IV–I–IV–V–I avec énergie rythmique. Base de nombreux concertos baroques.':'Patrón de ritornello vivaldiano: I–V–vi–iii–IV–I–IV–V–I con energía rítmica. Base de numerosos conciertos barrocos.',
'Chaîne de septièmes diatoniques style concerto vivaldien. Énergie motorique baroque tardive avec mouvement de basse par quintes.':'Cadena de séptimas diatónicas estilo concierto vivaldiano. Energía motórica del barroco tardío con movimiento del bajo por quintas.',
'Cadence classique haydnienne par tierces descendantes puis cadence parfaite. Modèle d\'équilibre du style classique viennois.':'Cadencia clásica haydniana por terceras descendentes seguida de cadencia perfecta. Modelo de equilibrio del estilo clásico vienés.',
'Cadence galante mozartienne avec dominante de dominante. Élégance et clarté du style classique. La V/V intensifie la cadence.':'Cadencia galante mozartiana con dominante de dominante. Elegancia y claridad del estilo clásico. La V/V intensifica la cadencia.',
'Patron mozartien avec basses d\'Alberti implicites : alternance de renversements pour fluidité mélodique de la basse. Très utilisé dans les sonates K. 545 et K. 331.':'Patrón mozartiano con bajos de Alberti implícitos: alternancia de inversiones para fluidez melódica del bajo. Muy usado en las sonatas K. 545 y K. 331.',
'Modulation par relation de tierce chromatique typique de Schubert. La basse descend par tierce majeure (I→♭VI) créant un effet de coloration romantique.':'Modulación por relación de tercera cromática típica de Schubert. El bajo desciende por tercera mayor (I→♭VI) creando un efecto de coloración romántica.',
'Chaîne de relations médiantiques : I–III–♭VI–i. Voyage tonal par tierces caractéristique du lied schubertien.':'Cadena de relaciones mediantes: I–III–♭VI–i. Viaje tonal por terceras característico del lied schubertiano.',
'Cadence plagale étendue brahmsienne avec emprunt modal au mineur. Couleur sombre et nostalgique typique du romantisme tardif.':'Cadencia plagal extendida brahmsiana con préstamo modal del menor. Color oscuro y nostálgico típico del romanticismo tardío.',
'Cycle de tierces majeures équidistantes (I–♭VI–III–I), divisant l\'octave en trois. Procédé wagnero-brahmsien de transition tonale.':'Ciclo de terceras mayores equidistantes (I–♭VI–III–I), dividiendo la octava en tres. Procedimiento wagneriano-brahmsiano de transición tonal.',
};
function tSeqCat(c){
  if(currentLang==='en') return SEQ_CAT_I18N[c]||c;
  if(currentLang==='es') return SEQ_CAT_I18N_ES[c]||c;
  return c;
}
function tSeqNm(n){
  if(currentLang==='en') return SEQ_NM_I18N[n]||n;
  if(currentLang==='es') return SEQ_NM_I18N_ES[n]||n;
  return n;
}
function tSeqDesc(d){
  if(currentLang==='en') return SEQ_DESC_I18N[d]||d;
  if(currentLang==='es') return SEQ_DESC_I18N_ES[d]||d;
  return d;
}

// ── Forms Majeur/Mineur for selects ──
var FM_MODE_I18N={Majeur:{fr:'Majeur',en:'Major',es:'Mayor'},Mineur:{fr:'Mineur',en:'Minor',es:'Menor'}};



/* ═══ GLOBAL PIANO SYNTHESIS — Realistic piano model ═══ */
var _pianoCtx=null, _pianoRev=null, _pianoComp=null, _pianoDry=null, _pianoWet=null, _pianoMaster=null;

function _getPianoCtx(){
  if(!_pianoCtx) _pianoCtx=new(window.AudioContext||window.webkitAudioContext)();
  if(_pianoCtx.state==='suspended') _pianoCtx.resume();
  return _pianoCtx;
}

function _mkPianoReverb(ctx){
  /* Piano body + small room resonance */
  var len=Math.floor(ctx.sampleRate*1.0), buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(var ch=0;ch<2;ch++){
    var d=buf.getChannelData(ch);
    for(var i=0;i<len;i++){
      var t=i/ctx.sampleRate;
      /* Early reflections: piano lid + room walls (8-40ms) */
      var early=0;
      if(t>0.008 && t<0.04){
        early=(Math.random()*2-1)*0.22*Math.exp(-(t-0.008)/0.012);
      }
      /* Late reflections: room diffusion */
      var late=(t>0.04)?(Math.random()*2-1)*Math.exp(-t/0.25)*0.12:0;
      /* Stereo spread */
      var spread=(ch===0)?Math.sin(t*800):Math.cos(t*800);
      d[i]=(early+late)*(1+spread*0.08);
    }
  }
  var c=ctx.createConvolver(); c.buffer=buf; return c;
}

function _getPianoChain(){
  var ctx=_getPianoCtx();
  if(!_pianoMaster){
    _pianoMaster=ctx.createGain(); _pianoMaster.gain.value=0.65;
    _pianoComp=ctx.createDynamicsCompressor();
    _pianoComp.threshold.value=-24; _pianoComp.ratio.value=2.5;
    _pianoComp.attack.value=0.008; _pianoComp.release.value=0.3;
    _pianoComp.knee.value=15;
    _pianoMaster.connect(_pianoComp); _pianoComp.connect(ctx.destination);
    _pianoRev=_mkPianoReverb(ctx);
    _pianoWet=ctx.createGain(); _pianoWet.gain.value=0.18;
    _pianoRev.connect(_pianoWet); _pianoWet.connect(_pianoMaster);
    _pianoDry=ctx.createGain(); _pianoDry.gain.value=0.82;
    _pianoDry.connect(_pianoMaster);
  }
  return {ctx:ctx, dry:_pianoDry, wet:_pianoRev, master:_pianoMaster};
}

function pianoNote(freq, startTime, duration, ctx, dryNode, wetNode, velocity){
  var vel = velocity || 0.28;
  var st = startTime;
  var dur = duration;
  
  /* ── Physics constants ── */
  /* Inharmonicity: higher notes are more inharmonic */
  var B = 0.0003 * Math.pow(freq/261, 1.4);
  function pH(n){ return freq * n * Math.sqrt(1 + B*n*n); }
  
  /* Brightness: higher velocity = brighter attack */
  var brightness = 0.6 + vel * 1.4;
  
  var noteGain = ctx.createGain();
  
  /* ═══ TRIPLE STRING SIMULATION ═══
     Real pianos have 2-3 strings per note, slightly detuned.
     This creates the characteristic "singing" quality. */
  var numStrings = freq < 250 ? 2 : 3;
  var stringDetune = freq < 250 ? [-0.8, 0.8] : [-1.0, 0, 1.0];
  
  for(var s=0; s<numStrings; s++){
    var stringGain = ctx.createGain();
    var sAmp = vel * (0.22 / numStrings);
    
    /* ── Two-stage decay (key piano characteristic) ──
       Stage 1: Fast initial decay (hammer leaves string) ~50-100ms
       Stage 2: Slow sustained decay (string vibrates freely) */
    var stage1 = 0.08 + Math.random()*0.02;
    var stage2 = dur + 1.0 + (261/freq)*0.5;
    stage2 = Math.min(stage2, 4.0);
    
    stringGain.gain.setValueAtTime(sAmp, st);
    stringGain.gain.exponentialRampToValueAtTime(sAmp * 0.45, st + stage1);
    stringGain.gain.exponentialRampToValueAtTime(sAmp * 0.18, st + stage2 * 0.4);
    stringGain.gain.exponentialRampToValueAtTime(0.001, st + stage2);
    
    /* Fundamental */
    var oF = ctx.createOscillator();
    oF.type = 'sine';
    oF.frequency.value = pH(1);
    oF.detune.value = stringDetune[s];
    /* Slight pitch bend on attack (string stretching) */
    oF.frequency.setValueAtTime(pH(1) * 1.002, st);
    oF.frequency.exponentialRampToValueAtTime(pH(1), st + 0.025);
    
    var gF = ctx.createGain();
    gF.gain.value = 1.0;
    oF.connect(gF); gF.connect(stringGain);
    oF.start(st); oF.stop(st + stage2 + 0.1);
    
    /* Harmonics per string — piano spectral envelope
       2nd harmonic is often as strong as fundamental in real pianos */
    var partials = [
      {n:2, a:0.85},  {n:3, a:0.45},  {n:4, a:0.30},
      {n:5, a:0.15},  {n:6, a:0.08},  {n:7, a:0.05},
      {n:8, a:0.03},  {n:9, a:0.015}, {n:10, a:0.008}
    ];
    
    partials.forEach(function(p){
      var f = pH(p.n);
      if(f > 17000) return;
      var o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.detune.value = stringDetune[s] * (1 + p.n * 0.1);
      var g = ctx.createGain();
      /* Higher harmonics decay faster (string damping) */
      var hDecay = stage2 * (0.15 + 0.85 / (1 + p.n * 0.3));
      var hAmp = p.a * brightness;
      g.gain.setValueAtTime(hAmp, st);
      g.gain.exponentialRampToValueAtTime(hAmp * 0.2, st + stage1 * 1.5);
      g.gain.exponentialRampToValueAtTime(0.001, st + hDecay);
      o.connect(g); g.connect(stringGain);
      o.start(st); o.stop(st + hDecay + 0.05);
    });
    
    stringGain.connect(noteGain);
  }
  
  /* ═══ HAMMER ATTACK ═══
     Complex transient: felt hammer hitting steel string creates
     a broadband burst that defines the "piano" character */
  var hammerLen = Math.floor(ctx.sampleRate * 0.018);
  var hammerBuf = ctx.createBuffer(1, hammerLen, ctx.sampleRate);
  var hd = hammerBuf.getChannelData(0);
  /* Shape: fast rise, exponential decay with some ringing */
  for(var i=0; i<hammerLen; i++){
    var t = i / ctx.sampleRate;
    var rise = Math.min(t / 0.001, 1.0);
    var decay = Math.exp(-t / 0.004);
    /* Mix noise with tuned resonance */
    var noise = (Math.random()*2-1);
    var ring = Math.sin(2 * Math.PI * freq * 3.7 * t);
    hd[i] = rise * decay * (noise * 0.7 + ring * 0.3) * 0.08;
  }
  var hammerSrc = ctx.createBufferSource();
  hammerSrc.buffer = hammerBuf;
  /* Bandpass shaped to the note's register */
  var hBP = ctx.createBiquadFilter();
  hBP.type = 'bandpass';
  hBP.frequency.value = Math.min(freq * 4, 8000);
  hBP.Q.value = 0.4;
  var hGain = ctx.createGain();
  hGain.gain.value = vel * brightness * 0.12;
  hammerSrc.connect(hBP); hBP.connect(hGain); hGain.connect(noteGain);
  hammerSrc.start(st);
  
  /* ═══ SOUNDBOARD RESONANCE ═══
     The soundboard colors the sound with formant-like resonances */
  var sbFilter = ctx.createBiquadFilter();
  sbFilter.type = 'peaking';
  sbFilter.frequency.value = 420; /* Typical soundboard resonance */
  sbFilter.Q.value = 2.0;
  sbFilter.gain.value = 3;
  
  /* ═══ TONE SHAPING ═══ */
  var lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  /* Bright on attack, mellows over time */
  var lpStart = Math.min(freq * brightness * 8, 16000);
  var lpEnd = Math.max(freq * 2, 400);
  lp.frequency.setValueAtTime(lpStart, st);
  lp.frequency.exponentialRampToValueAtTime(lpStart * 0.6, st + 0.05);
  lp.frequency.exponentialRampToValueAtTime(lpEnd, st + dur + 1.0);
  lp.Q.value = 0.4;
  
  /* Gentle high shelf to warm it up */
  var hs = ctx.createBiquadFilter();
  hs.type = 'highshelf';
  hs.frequency.value = 5000;
  hs.gain.value = -2.5;
  
  /* ═══ NOTE ENVELOPE ═══ */
  var env = noteGain.gain;
  env.setValueAtTime(0, st);
  env.linearRampToValueAtTime(1.0, st + 0.003);      /* 3ms attack */
  env.exponentialRampToValueAtTime(0.55, st + 0.05);  /* Hammer release */
  env.exponentialRampToValueAtTime(0.38, st + 0.25);  /* Sustain plateau */
  env.exponentialRampToValueAtTime(0.20, st + dur * 0.65);
  env.setTargetAtTime(0.001, st + dur + 0.15, 0.22);
  
  /* Connect: note → soundboard → lowpass → highshelf → output */
  noteGain.connect(sbFilter); sbFilter.connect(lp); lp.connect(hs);
  hs.connect(dryNode); hs.connect(wetNode);
}

/* ── Helper: MIDI to frequency ── */
function pianoM2F(midi){ return 440 * Math.pow(2, (midi-69)/12); }


// ── Forms translations ──
var FM_I18N = {
  // Form names
  'Période parallèle':'Parallel Period','Période contrastante':'Contrasting Period',
  'Double période':'Double Period','Phrase':'Phrase','Groupe de phrases':'Phrase Group',
  'Binaire simple':'Simple Binary','Binaire arrondie':'Rounded Binary',
  'Ternaire simple':'Simple Ternary','Ternaire composite':'Composite Ternary',
  'Forme sonate':'Sonata Form','Forme sonate (intro+coda)':'Sonata Form (intro+coda)',
  'Sonatine':'Sonatina','Rondo 5 parties (ABACA)':'Rondo 5-part (ABACA)',
  "Rondo 7 parties (ABACAB'A)":"Rondo 7-part (ABACAB'A)",
  'Sonate-rondo':'Sonata-Rondo','Thème et variations':'Theme and Variations',
  'Menuet et Trio':'Minuet and Trio','Scherzo et Trio':'Scherzo and Trio',
  'Forme continue':'Through-Composed','Forme concerto':'Concerto Form','Fugue':'Fugue',
  // Categories
  'Petites formes':'Small Forms','Grandes formes':'Large Forms',
  'Formes à mouvements multiples':'Multi-Movement Forms',
  // Multi-movement
  'Symphonie classique':'Classical Symphony','Symphonie romantique':'Romantic Symphony',
  'Concerto (3 mvts)':'Concerto (3 mvts)','Poème symphonique':'Symphonic Poem',
  'Suite':'Suite','Quatuor à cordes':'String Quartet',
  "Symphonie (Brahms n°1)":"Symphony (Brahms No.1)",
  // Section types
  'Antécédent':'Antecedent','Conséquent':'Consequent','Présentation':'Presentation',
  'Continuation':'Continuation','Thème principal':'Primary Theme','Thème secondaire':'Secondary Theme',
  'Transition':'Transition','Clôture':'Closing','Introduction':'Introduction',
  'Coda':'Coda','Retransition':'Retransition','Développement':'Development',
  'Fausse réexposition':'False Recapitulation','Épisode':'Episode',
  'Refrain':'Refrain','Couplet / Digression':'Episode / Digression','Digression (Rondo)':'Digression (Rondo)','Cadenza':'Cadenza','Variation':'Variation',
  'Menuet':'Minuet','Trio':'Trio','Scherzo':'Scherzo','Menuet D.C.':'Minuet D.C.',
  'Scherzo D.C.':'Scherzo D.C.','Exposition':'Exposition','Réexposition':'Recapitulation',
  'Ritournelle':'Ritornello','Thème-Variation':'Theme-Variation',
  // Section type categories
  'Thématique':'Thematic','Structurel':'Structural','Développement':'Development',
  'Rondo':'Rondo','Danse':'Dance','Sonate (groupe)':'Sonata (group)','Concerto':'Concerto',
  'Variation':'Variation','Contrepoint':'Counterpoint',
  // Descriptions
  'Ant. (DC : demi-cadence) → Cons. (CAP : cadence auth. parfaite), ouvertures similaires.':'Ant. (HC: half cadence) → Cons. (PAC: perfect auth. cadence), similar openings.',
  'Ant. et cons. avec matériau mélodique différent.':'Ant. and cons. with different melodic material.',
  'Présentation (i.b.+rép.) → Continuation → cadence.':'Presentation (b.i.+rep.) → Continuation → cadence.',
  'Phrases successives sans relation ant.-cons.':'Successive phrases without ant.-cons. relationship.',
  'Expo (P–TR–S–C) → Dév. → Réex.':'Expo (P–TR–S–C) → Dev. → Recap.',
  'Intro lente + Expo + Dév. + Réex. + Coda.':'Slow intro + Expo + Dev. + Recap. + Coda.',
  'Expo → Réex. directe (sans dév.).':'Expo → Direct recap. (no dev.).',
  'Alternance refrain/couplets.':'Refrain/episode alternation.',
  "Rondo étendu, B' en I.":"Extended rondo, B' in I.",
  "Hybride : A–B–A–C(dév.)–A–B'(I)–A+Coda.":"Hybrid: A–B–A–C(dev.)–A–B'(I)–A+Coda.",
  'Thème + variations numérotées.':'Theme + numbered variations.',
  'Menuet→Trio→Menuet D.C.':'Minuet→Trio→Minuet D.C.',
  'Scherzo→Trio→Scherzo D.C.':'Scherzo→Trio→Scherzo D.C.',
  'Matériau toujours nouveau, pas de reprise.':'Always new material, no return.',
  'Chaque section = petite forme interne.':'Each section = small internal form.',
  'Rit.→Expo solo→Dév.→Réex.→Cadenza→Coda.':'Rit.→Solo expo→Dev.→Recap.→Cadenza→Coda.',
  'Expo→Épisodes→Strettes→Coda.':'Expo→Episodes→Stretto→Coda.',
  // UI
  'Mouvements':'Movements','Mouvement':'Movement','Tonalité':'Key',
  'Forme de référence':'Reference Form','Ajouter une section':'Add a Section',
  'Projets sauvegardés':'Saved Projects','Ajouter un mouvement':'Add a Movement',
  'Sauvegarde locale (navigateur).':'Local storage (browser).',
  'Sélectionner une section dans la timeline pour voir ses détails':'Select a section in the timeline to see its details',
  'Supprimer':'Delete',
  // Dynamic labels
  'majeur':'major','mineur':'minor','Majeur':'Major','Mineur':'Minor',
  'Diatoniques':'Diatonic','Septièmes':'Sevenths','Dom. sec.':'Sec. dom.','Spéciaux':'Special',
  'Mesures':'Measures','Cadence':'Cadence','Notes':'Notes','Caractère':'Character',
  'Dynamique':'Dynamics','Tempo':'Tempo',
  // Section type labels
  'Antécédent':'Antecedent','Conséquent':'Consequent','Thème principal':'Primary Theme',
  'Thème secondaire':'Secondary Theme','Transition':'Transition','Clôture':'Closing',
  'Introduction':'Introduction','Coda':'Coda','Retransition':'Retransition',
  'Développement':'Development','Fausse réexposition':'False Recap.',
  'Épisode':'Episode','Refrain':'Refrain','Couplet / Digression':'Episode / Digression',
  'Cadenza':'Cadenza','Variation':'Variation','Thème-Variation':'Theme-Variation',
  'Menuet':'Minuet','Trio':'Trio','Scherzo':'Scherzo',
  'Menuet D.C.':'Minuet D.C.','Scherzo D.C.':'Scherzo D.C.',
  'Exposition':'Exposition','Réexposition':'Recapitulation','Ritournelle':'Ritornello',
  'Présentation':'Presentation','Continuation':'Continuation',
  // Section type categories
  'Thématique':'Thematic','Structurel':'Structural','Rondo':'Rondo',
  'Danse':'Dance','Sonate (groupe)':'Sonata (group)','Concerto':'Concerto',
  'Contrepoint':'Counterpoint',
  // Detail panel labels
  'Degré tonal':'Tonal Degree','Mesures':'Bars','Notes':'Notes',
  'Caractère':'Character','Dynamique':'Dynamics','Tempo':'Tempo',
  'mesures':'bars','m.':'b.',
  // Repertoire modal
  "Charger un plan formel d'une œuvre connue comme modèle de référence.":"Load a formal plan from a known work as a reference model.",
  // Add-section modal
  'Ajouter une section':'Add a Section',
  // Cantata/Trio/Quartet
  'Cantate':'Cantata','Trio avec piano':'Piano Trio',
  'Sonate (solo/duo)':'Sonata (solo/duo)',
  'Poème symphonique':'Symphonic Poem',
  // Orchestration families
  'Bois':'Woodwinds','Cuivres':'Brass','Percussion':'Percussion',
  'Claviers / Cordes pincées':'Keyboards / Plucked Strings','Cordes':'Strings',
  'Voix':'Voices','Solistes':'Soloists',
  // Orchestration instruments
  'Flûte':'Flute','Flûte 2':'Flute 2','Hautbois':'Oboe','Hautbois 2':'Oboe 2',
  'Cor anglais':'English Horn','Clarinette':'Clarinet','Petite clarinette':'Piccolo Clarinet',
  'Clarinette basse':'Bass Clarinet','Basson':'Bassoon','Basson 2':'Bassoon 2',
  'Contrebasson':'Contrabassoon','Cor':'Horn','Cor 2':'Horn 2','Cor 3':'Horn 3','Cor 4':'Horn 4',
  'Trompette':'Trumpet','Trompette 2':'Trumpet 2','Trombone':'Trombone','Trombone 2':'Trombone 2',
  'Trombone basse':'Bass Trombone','Tuba':'Tuba',
  'Timbales':'Timpani','Grosse caisse':'Bass Drum','Caisse claire':'Snare Drum',
  'Cymbales':'Cymbals','Triangle':'Triangle','Xylophone':'Xylophone',
  'Glockenspiel':'Glockenspiel','Tambourin':'Tambourine','Percussion (autre)':'Percussion (other)',
  'Harpe':'Harp','Célesta':'Celesta','Piano':'Piano','Orgue':'Organ',
  'Violon I':'Violin I','Violon II':'Violin II','Alto':'Viola',
  'Violoncelle':'Cello','Contrebasse':'Double Bass',
  'Soprano':'Soprano','Mezzo-soprano':'Mezzo-soprano','Alto (voix)':'Alto (voice)',
  'Ténor':'Tenor','Baryton':'Baritone','Basse':'Bass','Chœur SATB':'SATB Choir',
  'Soliste 1':'Soloist 1','Soliste 2':'Soloist 2','Soliste 3':'Soloist 3',
  // Orchestration presets
  'Orchestre classique':'Classical Orchestra','Orchestre romantique':'Romantic Orchestra',
  'Orchestre de chambre':'Chamber Orchestra','Quatuor à cordes':'String Quartet',
  'Quintette à vent':'Wind Quintet','Trio avec piano':'Piano Trio',
  'Chorale':'Chorale','Chœur + orchestre':'Choir + Orchestra',
  // Cadences
  'CAP — Cadence auth. parfaite':'PAC — Perfect Auth. Cadence',
  'CAI — Cadence auth. imparfaite':'IAC — Imperfect Auth. Cadence',
  'DC — Demi-cadence':'HC — Half Cadence',
  'CP — Cadence plagale':'PC — Plagal Cadence',
  'CR — Cadence rompue':'DC — Deceptive Cadence',
  'CPh — Cadence phrygienne':'PhC — Phrygian Cadence',
  'CÉ — Cadence évitée':'EC — Evaded Cadence',
  'Élision':'Elision','(aucune)':'(none)',
  // Section type labels
  'Thème principal (P)':'Primary Theme (P)','Thème secondaire (S)':'Secondary Theme (S)',
  'Refrain (A)':'Refrain (A)','Couplet / Digression':'Episode / Digression','Digression (Rondo)':'Digression (Rondo)','Antécédent':'Antecedent',
  'Conséquent':'Consequent','Présentation':'Presentation','Continuation':'Continuation',
  'Idée de base':'Basic Idea','Section A':'Section A','Section B':'Section B',
  'Section C':'Section C','Section D':'Section D',"Section A'":"Section A'",
  'Transition (TR)':'Transition (TR)','Retransition (RT)':'Retransition (RT)',
  'Pont':'Bridge','Césure médiane (MC)':'Medial Caesura (MC)','Repos sur la dominante (S/D)':'Standing on the Dominant (S/D)','Comblement de césure (CF)':'Caesura-fill (CF)','Développement':'Development','Fausse réexposition':'False Recap.',
  'Épisode':'Episode','Section conclusive (C)':'Closing Section (C)',
  'Codetta':'Codetta','Introduction':'Introduction','Pédale':'Pedal',
  'Thème':'Theme','Réexposition':'Recapitulation','Ritournelle':'Ritornello',
  'Aria':'Aria','Récitatif':'Recitative','Chœur':'Chorus','Ensemble vocal':'Vocal Ensemble',
  'Duo':'Duo','Choral':'Chorale','Cavatine':'Cavatina','Cabalette':'Cabaletta',
  'Ouverture':'Overture',
  // Counterpoint types
  'Sujet (S)':'Subject (S)','Réponse (R)':'Answer (R)','Contre-sujet (CS)':'Countersubject (CS)',
  'Divertissement':'Divertissement','Strette':'Stretto','Pédale de dominante':'Dominant Pedal',
  'Contre-exposition':'Counter-Exposition',
  // Fugue forms
  'Fugue d\'école à 3 voix':'School Fugue in 3 Voices',
  'Fugue d\'école à 4 voix':'School Fugue in 4 Voices',
  'Fugue double':'Double Fugue',
  'Fugue par renversement':'Inversion Fugue',
  'Fugue libre (style Bach)':'Free Fugue (Bach Style)',
  'Formes contrapuntiques':'Contrapuntal Forms',
  // Fugue descriptions
  'S→R→S avec contre-sujet. Dév. modulants. Strette finale.':'S→A→S with countersubject. Modulating dev. Final stretto.',
  'S→R→S→R. Contre-exposition. Strettes multiples.':'S→A→S→A. Counter-exposition. Multiple strettos.',
  'Deux sujets distincts S1 et S2. Exposition de chaque sujet, puis réunion.':'Two distinct subjects S1 and S2. Exposition of each, then combination.',
  'Sujet renversé (inversion mélodique). Expo rectus puis inversus.':'Inverted subject (melodic inversion). Rectus then inversus expo.',
  'Plan flexible. Épisodes multiples. Liberté formelle.':'Flexible plan. Multiple episodes. Formal freedom.',
  // Section type categories
  'Thématique':'Thematic','Sections':'Sections','Transitoire':'Transitional',
  'Conclusif':'Conclusive','Encadrement':'Framing','Vocal':'Vocal','Contrepoint':'Counterpoint',

};

var FM_I18N_ES = {
  // Form names
  'Période parallèle':'Período paralelo','Période contrastante':'Período contrastante',
  'Double période':'Período doble','Phrase':'Frase','Groupe de phrases':'Grupo de frases',
  'Binaire simple':'Binaria simple','Binaire arrondie':'Binaria redondeada',
  'Ternaire simple':'Ternaria simple','Ternaire composite':'Ternaria compuesta',
  'Forme sonate':'Forma sonata','Forme sonate (intro+coda)':'Forma sonata (intro+coda)',
  'Sonatine':'Sonatina','Rondo 5 parties (ABACA)':'Rondó 5 partes (ABACA)',
  "Rondo 7 parties (ABACAB'A)":"Rondo 7-part (ABACAB'A)",
  'Sonate-rondo':'Sonata-rondó','Thème et variations':'Tema y variaciones',
  'Menuet et Trio':'Minueto y Trío','Scherzo et Trio':'Scherzo y Trío',
  'Forme continue':'Forma continua','Forme concerto':'Forma concierto','Fugue':'Fuga',
  // Categories
  'Petites formes':'Formas pequeñas','Grandes formes':'Formas grandes',
  'Formes à mouvements multiples':'Formas de varios movimientos',
  // Multi-movement
  'Symphonie classique':'Sinfonía clásica','Symphonie romantique':'Sinfonía romántica',
  'Concerto (3 mvts)':'Concierto (3 mvts)','Poème symphonique':'Poema sinfónico',
  'Suite':'Suite','Quatuor à cordes':'Cuarteto de cuerda',
  "Symphonie (Brahms n°1)":"Symphony (Brahms No.1)",
  // Section types
  'Antécédent':'Antecedente','Conséquent':'Consecuente','Présentation':'Presentación',
  'Continuation':'Continuación','Thème principal':'Tema principal','Thème secondaire':'Tema secundario',
  'Transition':'Transición','Clôture':'Clausura','Introduction':'Introducción',
  'Coda':'Coda','Retransition':'Retransición','Développement':'Desarrollo',
  'Fausse réexposition':'Falsa reexposición','Épisode':'Episodio',
  'Refrain':'Estribillo','Couplet / Digression':'Episodio / Digresión','Digression (Rondo)':'Digresión (Rondó)','Cadenza':'Cadenza','Variation':'Variación',
  'Menuet':'Minueto','Trio':'Trío','Scherzo':'Scherzo','Menuet D.C.':'Minueto D.C.',
  'Scherzo D.C.':'Scherzo D.C.','Exposition':'Exposición','Réexposition':'Reexposición',
  'Ritournelle':'Ritornello','Thème-Variation':'Tema-Variación',
  // Section type categories
  'Thématique':'Temática','Structurel':'Estructural','Développement':'Desarrollo',
  'Rondo':'Rondó','Danse':'Danza','Sonate (groupe)':'Sonata (grupo)','Concerto':'Concierto',
  'Variation':'Variación','Contrepoint':'Contrapunto',
  // Descriptions
  'Ant. (DC : demi-cadence) → Cons. (CAP : cadence auth. parfaite), ouvertures similaires.':'Ant. (SC: semicadencia) → Cons. (CAP: cadencia auténtica perfecta), aperturas similares.',
  'Ant. et cons. avec matériau mélodique différent.':'Ant. y cons. con material melódico distinto.',
  'Présentation (i.b.+rép.) → Continuation → cadence.':'Presentación (i.b.+rep.) → Continuación → cadencia.',
  'Phrases successives sans relation ant.-cons.':'Frases sucesivas sin relación ant.-cons.',
  'Expo (P–TR–S–C) → Dév. → Réex.':'Expo (P–TR–S–C) → Des. → Reex.',
  'Intro lente + Expo + Dév. + Réex. + Coda.':'Intro lenta + Expo + Des. + Reex. + Coda.',
  'Expo → Réex. directe (sans dév.).':'Expo → Reex. directa (sin des.).',
  'Alternance refrain/couplets.':'Alternancia estribillo/coplas.',
  "Rondo étendu, B' en I.":"Extended rondo, B' in I.",
  "Hybride : A–B–A–C(dév.)–A–B'(I)–A+Coda.":"Hybrid: A–B–A–C(dev.)–A–B'(I)–A+Coda.",
  'Thème + variations numérotées.':'Tema + variaciones numeradas.',
  'Menuet→Trio→Menuet D.C.':'Minueto→Trío→Minueto D.C.',
  'Scherzo→Trio→Scherzo D.C.':'Scherzo→Trío→Scherzo D.C.',
  'Matériau toujours nouveau, pas de reprise.':'Material siempre nuevo, sin repetición.',
  'Chaque section = petite forme interne.':'Cada sección = forma pequeña interna.',
  'Rit.→Expo solo→Dév.→Réex.→Cadenza→Coda.':'Rit.→Expo solo→Des.→Reex.→Cadenza→Coda.',
  'Expo→Épisodes→Strettes→Coda.':'Expo→Episodios→Strettos→Coda.',
  // UI
  'Mouvements':'Movimientos','Mouvement':'Movimiento','Tonalité':'Tonalidad',
  'Forme de référence':'Forma de referencia','Ajouter une section':'Añadir una sección',
  'Projets sauvegardés':'Proyectos guardados','Ajouter un mouvement':'Añadir un movimiento',
  'Sauvegarde locale (navigateur).':'Almacenamiento local (navegador).',
  'Sélectionner une section dans la timeline pour voir ses détails':'Selecciona una sección en la línea de tiempo para ver sus detalles',
  'Supprimer':'Eliminar',
  // Dynamic labels
  'majeur':'mayor','mineur':'menor','Majeur':'Mayor','Mineur':'Menor',
  'Diatoniques':'Diatónicos','Septièmes':'Séptimas','Dom. sec.':'Dom. sec.','Spéciaux':'Especiales',
  'Mesures':'Compases','Cadence':'Cadencia','Notes':'Notas','Caractère':'Carácter',
  'Dynamique':'Dinámica','Tempo':'Tempo',
  // Section type labels
  'Antécédent':'Antecedente','Conséquent':'Consecuente','Thème principal':'Tema principal',
  'Thème secondaire':'Tema secundario','Transition':'Transición','Clôture':'Clausura',
  'Introduction':'Introducción','Coda':'Coda','Retransition':'Retransición',
  'Développement':'Desarrollo','Fausse réexposition':'Falsa reexposición',
  'Épisode':'Episodio','Refrain':'Estribillo','Couplet / Digression':'Episodio / Digresión',
  'Cadenza':'Cadenza','Variation':'Variación','Thème-Variation':'Tema-Variación',
  'Menuet':'Minueto','Trio':'Trío','Scherzo':'Scherzo',
  'Menuet D.C.':'Minueto D.C.','Scherzo D.C.':'Scherzo D.C.',
  'Exposition':'Exposición','Réexposition':'Reexposición','Ritournelle':'Ritornello',
  'Présentation':'Presentación','Continuation':'Continuación',
  // Section type categories
  'Thématique':'Temática','Structurel':'Estructural','Rondo':'Rondó',
  'Danse':'Danza','Sonate (groupe)':'Sonata (grupo)','Concerto':'Concierto',
  'Contrepoint':'Contrapunto',
  // Detail panel labels
  'Degré tonal':'Grado tonal','Mesures':'Compases','Notes':'Notas',
  'Caractère':'Carácter','Dynamique':'Dinámica','Tempo':'Tempo',
  'mesures':'compases','m.':'c.',
  // Repertoire modal
  "Charger un plan formel d'une œuvre connue comme modèle de référence.":"Load a formal plan from a known work as a reference model.",
  // Add-section modal
  'Ajouter une section':'Añadir una sección',
  // Cantata/Trio/Quartet
  'Cantate':'Cantata','Trio avec piano':'Trío con piano',
  'Sonate (solo/duo)':'Sonata (solo/dúo)',
  'Poème symphonique':'Poema sinfónico',
  // Orchestration families
  'Bois':'Madera','Cuivres':'Metal','Percussion':'Percusión',
  'Claviers / Cordes pincées':'Teclados / Cuerdas pulsadas','Cordes':'Cuerdas',
  'Voix':'Voces','Solistes':'Solistas',
  // Orchestration instruments
  'Flûte':'Flauta','Flûte 2':'Flauta 2','Hautbois':'Oboe','Hautbois 2':'Oboe 2',
  'Cor anglais':'Corno inglés','Clarinette':'Clarinete','Petite clarinette':'Requinto',
  'Clarinette basse':'Clarinete bajo','Basson':'Fagot','Basson 2':'Fagot 2',
  'Contrebasson':'Contrafagot','Cor':'Trompa','Cor 2':'Trompa 2','Cor 3':'Trompa 3','Cor 4':'Trompa 4',
  'Trompette':'Trompeta','Trompette 2':'Trompeta 2','Trombone':'Trombón','Trombone 2':'Trombón 2',
  'Trombone basse':'Trombón bajo','Tuba':'Tuba',
  'Timbales':'Timbales','Grosse caisse':'Bombo','Caisse claire':'Caja',
  'Cymbales':'Platillos','Triangle':'Triángulo','Xylophone':'Xilófono',
  'Glockenspiel':'Glockenspiel','Tambourin':'Pandereta','Percussion (autre)':'Percusión (otra)',
  'Harpe':'Arpa','Célesta':'Celesta','Piano':'Piano','Orgue':'Órgano',
  'Violon I':'Violín I','Violon II':'Violín II','Alto':'Viola',
  'Violoncelle':'Violonchelo','Contrebasse':'Contrabajo',
  'Soprano':'Soprano','Mezzo-soprano':'Mezzosoprano','Alto (voix)':'Contralto (voz)',
  'Ténor':'Tenor','Baryton':'Barítono','Basse':'Bajo','Chœur SATB':'Coro SATB',
  'Soliste 1':'Solista 1','Soliste 2':'Solista 2','Soliste 3':'Solista 3',
  // Orchestration presets
  'Orchestre classique':'Orquesta clásica','Orchestre romantique':'Orquesta romántica',
  'Orchestre de chambre':'Orquesta de cámara','Quatuor à cordes':'Cuarteto de cuerda',
  'Quintette à vent':'Quinteto de viento','Trio avec piano':'Trío con piano',
  'Chorale':'Coro','Chœur + orchestre':'Coro + orquesta',
  // Cadences
  'CAP — Cadence auth. parfaite':'CAP — Cadencia auténtica perfecta',
  'CAI — Cadence auth. imparfaite':'CAI — Cadencia auténtica imperfecta',
  'DC — Demi-cadence':'SC — Semicadencia',
  'CP — Cadence plagale':'CP — Cadencia plagal',
  'CR — Cadence rompue':'CR — Cadencia rota',
  'CPh — Cadence phrygienne':'CFr — Cadencia frigia',
  'CÉ — Cadence évitée':'CE — Cadencia evitada',
  'Élision':'Elisión','(aucune)':'(ninguna)',
  // Section type labels
  'Thème principal (P)':'Tema principal (P)','Thème secondaire (S)':'Tema secundario (S)',
  'Refrain (A)':'Estribillo (A)','Couplet / Digression':'Episodio / Digresión','Digression (Rondo)':'Digresión (Rondó)','Antécédent':'Antecedente',
  'Conséquent':'Consecuente','Présentation':'Presentación','Continuation':'Continuación',
  'Idée de base':'Idea básica','Section A':'Sección A','Section B':'Sección B',
  'Section C':'Sección C','Section D':'Sección D',"Section A'":"Section A'",
  'Transition (TR)':'Transición (TR)','Retransition (RT)':'Retransición (RT)',
  'Pont':'Puente','Césure médiane (MC)':'Cesura medial (MC)','Repos sur la dominante (S/D)':'Reposo sobre la dominante (S/D)','Comblement de césure (CF)':'Relleno de cesura (CF)','Développement':'Desarrollo','Fausse réexposition':'Falsa reexposición',
  'Épisode':'Episodio','Section conclusive (C)':'Sección conclusiva (C)',
  'Codetta':'Codeta','Introduction':'Introducción','Pédale':'Pedal',
  'Thème':'Tema','Réexposition':'Reexposición','Ritournelle':'Ritornello',
  'Aria':'Aria','Récitatif':'Recitativo','Chœur':'Coro','Ensemble vocal':'Conjunto vocal',
  'Duo':'Dúo','Choral':'Coral','Cavatine':'Cavatina','Cabalette':'Cabaletta',
  'Ouverture':'Obertura',
  // Counterpoint types
  'Sujet (S)':'Sujeto (S)','Réponse (R)':'Respuesta (R)','Contre-sujet (CS)':'Contrasujeto (CS)',
  'Divertissement':'Divertimento','Strette':'Estrecho','Pédale de dominante':'Pedal de dominante',
  'Contre-exposition':'Contraexposición',
  // Fugue forms
  'Fugue d\'école à 3 voix':'Fuga escolar a 3 voces',
  'Fugue d\'école à 4 voix':'Fuga escolar a 4 voces',
  'Fugue double':'Fuga doble',
  'Fugue par renversement':'Fuga por inversión',
  'Fugue libre (style Bach)':'Fuga libre (estilo Bach)',
  'Formes contrapuntiques':'Formas contrapuntísticas',
  // Fugue descriptions
  'S→R→S avec contre-sujet. Dév. modulants. Strette finale.':'S→R→S con contrasujeto. Desar. modulantes. Estrecho final.',
  'S→R→S→R. Contre-exposition. Strettes multiples.':'S→R→S→R. Contraexposición. Estrechos múltiples.',
  'Deux sujets distincts S1 et S2. Exposition de chaque sujet, puis réunion.':'Dos sujetos distintos S1 y S2. Exposición de cada uno, luego reunión.',
  'Sujet renversé (inversion mélodique). Expo rectus puis inversus.':'Sujeto invertido (inversión melódica). Expo rectus luego inversus.',
  'Plan flexible. Épisodes multiples. Liberté formelle.':'Plan flexible. Episodios múltiples. Libertad formal.',
  // Section type categories
  'Thématique':'Temática','Sections':'Secciones','Transitoire':'Transitorio',
  'Conclusif':'Conclusivo','Encadrement':'Marco','Vocal':'Vocal','Contrepoint':'Contrapunto',

};
function tFM(s){
  if(currentLang==='en') return FM_I18N[s]||s;
  if(currentLang==='es') return FM_I18N_ES[s]||FM_I18N[s]||s;
  return s;
}


/* ═══════════════════════════════════════════════════════════════════
   PATCH refacto modulaire — applyI18n() léger pour réinjection HTML
   Appelé par main.js après chaque chargement de module.
   N'appelle AUCUN render() de module : juste re-traduit les attributs.
   ═══════════════════════════════════════════════════════════════════ */
window.applyI18n = function(lang){
  lang = lang || currentLang;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var v = I18N[el.getAttribute('data-i18n')];
    if(v) el.textContent = v[lang] || v.fr;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){
    var v = I18N[el.getAttribute('data-i18n-html')];
    if(v) el.innerHTML = v[lang] || v.fr;
  });
  document.querySelectorAll('[data-ph]').forEach(function(el){
    var v = I18N[el.getAttribute('data-ph')];
    if(v) el.placeholder = v[lang] || v.fr;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    var v = I18N[el.getAttribute('data-i18n-title')];
    if(v) el.setAttribute('title', v[lang] || v.fr);
  });
};

/* Expose les fonctions globales pour les onclick="..." */
window.setLang = setLang;
window.toggleLangDD = toggleLangDD;
window.t = t;
window.I18N = I18N;
