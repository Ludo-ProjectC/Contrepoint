/* ═══════════════════════════════════════════════════════════════════
   formes.js — Module formes
   Chargé dynamiquement par main.js lors du premier accès à l'onglet.
   Toutes les fonctions/variables avec préfixe majuscule (T1, MOD, etc.)
   sont exposées sur window pour rétro-compat avec onclick="..."
   ═══════════════════════════════════════════════════════════════════ */
/* ═══ TAB 7: FORMES ═══ */

// Traductions dynamiques labels/notes sections
const FM_LABEL_TRANS = {
  'S (voix 1)': {en:'S (voice 1)', es:'S (voz 1)'},'R (voix 2)': {en:'A (voice 2)', es:'R (voz 2)'},'S (voix 3)': {en:'S (voice 3)', es:'S (voz 3)'},
  'Divertissement I': {en:'Divertissement I', es:'Divertimento I'},'Divertissement II': {en:'Divertissement II', es:'Divertimento II'},
  'Épisode I': {en:'Episode I', es:'Episodio I'},'Épisode II': {en:'Episode II', es:'Episodio II'},'Épisode III': {en:'Episode III', es:'Episodio III'},
  'Contre-exposition': {en:'Counter-exposition', es:'Contraexposición'},'Strette': {en:'Stretto', es:'Estrecho'},'Strette I': {en:'Stretto I', es:'Estrecho I'},'Strette II': {en:'Stretto II', es:'Estrecho II'},'Strette finale': {en:'Final stretto', es:'Estrecho final'},
  'Pédale de dominante': {en:'Dominant pedal', es:'Pedal de dominante'},'Coda': {en:'Coda', es:'Coda'},
  'S (soprano)': {en:'S (soprano)', es:'S (soprano)'},'R (alto)': {en:'A (alto)', es:'R (alto)'},'S (ténor)': {en:'S (tenor)', es:'S (tenor)'},'R (basse)': {en:'A (bass)', es:'R (bajo)'},
  'S1 (sujet principal)': {en:'S1 (main subject)', es:'S1 (sujeto principal)'},'S2 (second sujet)': {en:'S2 (second subject)', es:'S2 (segundo sujeto)'},'Réunion S1+S2': {en:'S1+S2 combination', es:'Reunión S1+S2'},
  'S rectus': {en:'S rectus', es:'S rectus'},'R rectus': {en:'A rectus', es:'R rectus'},'S inversus': {en:'S inversus', es:'S inversus'},'R inversus': {en:'A inversus', es:'R inversus'},
  'Exposition': {en:'Exposition', es:'Exposición'},'Entrée S ou R': {en:'S or A entry', es:'Entrada S o R'},
  'Sujet exposé': {en:'Subject exposed', es:'Sujeto expuesto'},'Réponse à la dominante': {en:'Answer at dominant', es:'Respuesta en dominante'},'Sujet, contre-sujet à v.1': {en:'Subject, countersubject at v.1', es:'Sujeto, contrasujeto en v.1'},
  'Épisode modulant': {en:'Modulating episode', es:'Episodio modulante'},'Facultative, ton relatif': {en:'Optional, relative key', es:'Facultativa, tono relativo'},'Développements modulants': {en:'Modulating developments', es:'Desarrollos modulantes'},
  'Entrées en chevauchement': {en:'Overlapping entries', es:'Entradas superpuestas'},'Tension harmonique soutenue': {en:'Sustained harmonic tension', es:'Tensión armónica sostenida'},'Conclusion en I': {en:'Conclusion in I', es:'Conclusión en I'},
  'En ton relatif, ordre varié': {en:'In relative key, varied order', es:'En tono relativo, orden variado'},'Première strette, ton de sous-dominante': {en:'First stretto, subdominant key', es:'Primer estrecho, tono subdominante'},'Strette finale, ton principal': {en:'Final stretto, main key', es:'Estrecho final, tono principal'},
  'Premier sujet': {en:'First subject', es:'Primer sujeto'},'Deuxième sujet, contrasté': {en:'Second subject, contrasted', es:'Segundo sujeto, contrastado'},'Les deux sujets combinés': {en:'Both subjects combined', es:'Ambos sujetos combinados'},'S1 et S2 en strette': {en:'S1 and S2 in stretto', es:'S1 y S2 en estrecho'},
  'Sujet dans sa forme originale': {en:'Subject in original form', es:'Sujeto en forma original'},'Sujet renversé (inversion mélodique)': {en:'Inverted subject (melodic inversion)', es:'Sujeto invertido (inversión melódica)'},'Développements avec les deux formes': {en:'Developments with both forms', es:'Desarrollos con ambas formas'},'Rectus et inversus combinés': {en:'Rectus and inversus combined', es:'Rectus e inversus combinados'},
  'S→R→S ou S→R→S→R selon nombre de voix': {en:'S→A→S or S→A→S→A depending on voices', es:'S→R→S o S→R→S→R según voces'},'Modulant vers dominante': {en:'Modulating to dominant', es:'Modulando a dominante'},'Ton relatif': {en:'Relative key', es:'Tono relativo'},'Développements modulants libres': {en:'Free modulating developments', es:'Desarrollos modulantes libres'},
  'Sous-dominante ou autre ton': {en:'Subdominant or other key', es:'Subdominante u otro tono'},'Retour progressif vers I': {en:'Progressive return to I', es:'Retorno progresivo a I'},'Tension finale': {en:'Final tension', es:'Tensión final'},'Affirmation de la tonique': {en:'Affirmation of tonic', es:'Afirmación de tónica'}
};
function FM_tLabel(t){if(currentLang==='fr')return t;const tr=FM_LABEL_TRANS[t];return tr?tr[currentLang]||t:t}

const FM_KEYS_FR=['Do','Do♯/Ré♭','Ré','Ré♯/Mi♭','Mi','Fa','Fa♯/Sol♭','Sol','Sol♯/La♭','La','La♯/Si♭','Si'];
const FM_KEYS_EN=['C','C♯/D♭','D','D♯/E♭','E','F','F♯/G♭','G','G♯/A♭','A','A♯/B♭','B'];
const FM_KEYS_ES=['Do','Do♯/Re♭','Re','Re♯/Mi♭','Mi','Fa','Fa♯/Sol♭','Sol','Sol♯/La♭','La','La♯/Si♭','Si'];
const FM_KEYS_MAP={'Do':'C','Do♯/Ré♭':'C♯/D♭','Ré':'D','Ré♯/Mi♭':'D♯/E♭','Mi':'E','Fa':'F','Fa♯/Sol♭':'F♯/G♭','Sol':'G','Sol♯/La♭':'G♯/A♭','La':'A','La♯/Si♭':'A♯/B♭','Si':'B','Do♯':'C♯','Ré♭':'D♭','Mi♭':'E♭','Fa♯':'F♯','Sol♭':'G♭','La♭':'A♭','Si♭':'B♭','Sol♯':'G♯','La♯':'A♯','Ré♯':'D♯'};
function fmKey(k){return currentLang==='en'?(FM_KEYS_MAP[k]||k):k;}
function fmKeys(){return currentLang==='en'?FM_KEYS_EN:currentLang==='es'?FM_KEYS_ES:FM_KEYS_FR;}
var FM_KEYS=FM_KEYS_FR;
const FM_ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const FM_SECTION_TYPES=[
{id:'theme-p',label:'Thème principal (P)',short:'P',cat:'Thématique',color:'#534AB7'},{id:'theme-s',label:'Thème secondaire (S)',short:'S',cat:'Thématique',color:'#2563EB'},{id:'refrain',label:'Refrain (A)',short:'A',cat:'Thématique',color:'#8B5CF6'},{id:'couplet',label:'Couplet / Digression',short:'B',cat:'Thématique',color:'#3B82F6'},{id:'digression',label:'Digression (Rondo)',short:'Dig.',cat:'Thématique',color:'#0891B2'},{id:'antecedent',label:'Antécédent',short:'Ant.',cat:'Thématique',color:'#534AB7'},{id:'consequent',label:'Conséquent',short:'Cons.',cat:'Thématique',color:'#6D62D6'},{id:'presentation',label:'Présentation',short:'Prés.',cat:'Thématique',color:'#534AB7'},{id:'continuation',label:'Continuation',short:'Cont.',cat:'Thématique',color:'#6D62D6'},{id:'basic-idea',label:'Idée de base',short:'i.b.',cat:'Thématique',color:'#7F77DD'},
{id:'section-a',label:'Section A',short:'A',cat:'Sections',color:'#8B5CF6'},{id:'section-b',label:'Section B',short:'B',cat:'Sections',color:'#3B82F6'},{id:'section-c',label:'Section C',short:'C',cat:'Sections',color:'#0891B2'},{id:'section-d',label:'Section D',short:'D',cat:'Sections',color:'#0D9488'},{id:'section-a-prime',label:"Section A'",short:"A'",cat:'Sections',color:'#7C3AED'},
{id:'transition',label:'Transition (TR)',short:'TR',cat:'Transitoire',color:'#D97706'},{id:'retransition',label:'Retransition (RT)',short:'RT',cat:'Transitoire',color:'#B45309'},{id:'bridge',label:'Pont',short:'Pont',cat:'Transitoire',color:'#F59E0B'},{id:'medial-caesura',label:'Césure médiane (MC)',short:'MC',cat:'Transitoire',color:'#C2410C',isMarker:true},{id:'standing-dom',label:'Repos sur la dominante (S/D)',short:'S/D',cat:'Transitoire',color:'#0891B2',isMarker:true},{id:'caesura-fill',label:'Comblement de césure (CF)',short:'CF',cat:'Transitoire',color:'#7C3AED',isMarker:true},
{id:'development',label:'Développement',short:'Dév.',cat:'Développement',color:'#DC2626'},{id:'false-recap',label:'Fausse réexposition',short:'F.Réex.',cat:'Développement',color:'#EF4444'},{id:'episode',label:'Épisode',short:'Ép.',cat:'Développement',color:'#7C3AED'},
{id:'closing',label:'Section conclusive (C)',short:'C',cat:'Conclusif',color:'#059669'},{id:'codetta',label:'Codetta',short:'Ctta.',cat:'Conclusif',color:'#10B981'},{id:'coda',label:'Coda',short:'Coda',cat:'Conclusif',color:'#047857'},
{id:'introduction',label:'Introduction',short:'Intro',cat:'Encadrement',color:'#6B7280'},{id:'cadenza',label:'Cadenza',short:'Cad.',cat:'Encadrement',color:'#9333EA'},{id:'pedal',label:'Pédale',short:'Péd.',cat:'Encadrement',color:'#78716C'},
{id:'theme-var',label:'Thème',short:'Thème',cat:'Variation',color:'#0891B2'},{id:'variation',label:'Variation',short:'Var.',cat:'Variation',color:'#0891B2'},
{id:'menuet',label:'Menuet',short:'Menuet',cat:'Danse',color:'#534AB7'},{id:'trio',label:'Trio',short:'Trio',cat:'Danse',color:'#2563EB'},{id:'scherzo',label:'Scherzo',short:'Scherzo',cat:'Danse',color:'#534AB7'},{id:'menuet-dc',label:'Menuet D.C.',short:'Men.D.C.',cat:'Danse',color:'#534AB7'},{id:'scherzo-dc',label:'Scherzo D.C.',short:'Sch.D.C.',cat:'Danse',color:'#534AB7'},
{id:'exposition',label:'Exposition',short:'Expo.',cat:'Sonate (groupe)',color:'#534AB7'},{id:'recapitulation',label:'Réexposition',short:'Réex.',cat:'Sonate (groupe)',color:'#534AB7'},{id:'ritornello',label:'Ritournelle',short:'Rit.',cat:'Concerto',color:'#534AB7'},
{id:'aria',label:'Aria',short:'Aria',cat:'Vocal',color:'#E11D48'},{id:'recitatif',label:'Récitatif',short:'Réc.',cat:'Vocal',color:'#9F1239'},{id:'choeur',label:'Chœur',short:'Chœur',cat:'Vocal',color:'#BE123C'},{id:'ensemble-vocal',label:'Ensemble vocal',short:'Ens.',cat:'Vocal',color:'#F43F5E'},{id:'duo-vocal',label:'Duo',short:'Duo',cat:'Vocal',color:'#FB7185'},{id:'choral',label:'Choral',short:'Choral',cat:'Vocal',color:'#881337'},{id:'cavatine',label:'Cavatine',short:'Cavat.',cat:'Vocal',color:'#E11D48'},{id:'cabalette',label:'Cabalette',short:'Cabal.',cat:'Vocal',color:'#F43F5E'},{id:'ouverture',label:'Ouverture',short:'Ouv.',cat:'Vocal',color:'#6B7280'},
{id:'subject',label:'Sujet (S)',short:'S',cat:'Contrepoint',color:'#059669'},{id:'answer',label:'Réponse (R)',short:'R',cat:'Contrepoint',color:'#10B981'},{id:'countersubject',label:'Contre-sujet (CS)',short:'CS',cat:'Contrepoint',color:'#0891B2'},{id:'divertissement',label:'Divertissement',short:'Div.',cat:'Contrepoint',color:'#F59E0B'},{id:'stretto',label:'Strette',short:'Str.',cat:'Contrepoint',color:'#DC2626'},{id:'pedal-dominant',label:'Pédale de dominante',short:'Péd.V',cat:'Contrepoint',color:'#78716C'},{id:'counter-exposition',label:'Contre-exposition',short:'C-Expo',cat:'Contrepoint',color:'#6366F1'}
];
const FM_typeMap={};FM_SECTION_TYPES.forEach(t=>FM_typeMap[t.id]=t);

/* ═══ Dictionnaire orchestral (Catel · Laitz · Berlioz · Adler) ═══ */
const FM_DICT_FR = [
  // ARTICULATIONS & MODES DE JEU
  {abr:'arco', term:'arco', desc:'Avec l\'archet (revient au jeu normal après pizzicato).', inst:'cordes', cat:'mode de jeu'},
  {abr:'pizz.', term:'pizzicato', desc:'Pincé avec le doigt au lieu de l\'archet.', inst:'cordes', cat:'mode de jeu'},
  {abr:'col legno', term:'col legno', desc:'Avec le bois de l\'archet (battuto = frappé, tratto = tiré).', inst:'cordes', cat:'mode de jeu'},
  {abr:'col legno batt.', term:'col legno battuto', desc:'Frappé avec le bois de l\'archet.', inst:'cordes', cat:'mode de jeu'},
  {abr:'col legno tr.', term:'col legno tratto', desc:'Tiré avec le bois de l\'archet (effet glissé).', inst:'cordes', cat:'mode de jeu'},
  {abr:'sul pont.', term:'sul ponticello', desc:'Près du chevalet — son métallique, riche en harmoniques.', inst:'cordes', cat:'mode de jeu'},
  {abr:'sul tasto', term:'sul tasto', desc:'Sur la touche — son doux, voilé, peu d\'harmoniques.', inst:'cordes', cat:'mode de jeu'},
  {abr:'flautando', term:'flautando', desc:'Archet léger près de la touche pour imiter la flûte.', inst:'cordes', cat:'mode de jeu'},
  {abr:'tremolo', term:'tremolo', desc:'Répétition rapide d\'une note (ou alternance de deux notes).', inst:'cordes', cat:'mode de jeu'},
  {abr:'sord.', term:'con sordino', desc:'Avec sourdine (atténuateur fixé sur le chevalet pour cordes, dans le pavillon pour cuivres).', inst:'cordes, cuivres', cat:'mode de jeu'},
  {abr:'senza sord.', term:'senza sordino', desc:'Sans sourdine (retirer la sourdine).', inst:'cordes, cuivres', cat:'mode de jeu'},
  {abr:'spicc.', term:'spiccato', desc:'Coup d\'archet sautillé, archet rebondissant.', inst:'cordes', cat:'mode de jeu'},
  {abr:'détaché', term:'détaché', desc:'Chaque note avec un coup d\'archet séparé, lié.', inst:'cordes', cat:'mode de jeu'},
  {abr:'martelé', term:'martelé', desc:'Coup d\'archet vigoureux, articulé, avec pression.', inst:'cordes', cat:'mode de jeu'},
  {abr:'jeté', term:'ricochet (jeté)', desc:'Archet rebondissant rapide en descendant.', inst:'cordes', cat:'mode de jeu'},
  {abr:'gliss.', term:'glissando', desc:'Glissement continu d\'une note à une autre.', inst:'tous', cat:'mode de jeu'},
  {abr:'port.', term:'portamento', desc:'Glissé expressif vocal ou instrumental, plus subtil que le glissando.', inst:'cordes, voix', cat:'mode de jeu'},
  {abr:'harm.', term:'harmoniques', desc:'Sons partiels obtenus par effleurement de la corde — son cristallin.', inst:'cordes, harpe', cat:'mode de jeu'},
  {abr:'◇', term:'harmonique naturelle', desc:'Notation losange creux : indique une note jouée en harmonique naturelle.', inst:'cordes', cat:'symbole'},
  {abr:'div.', term:'divisi', desc:'Le pupitre se divise (les musiciens jouent des notes différentes).', inst:'cordes', cat:'indication'},
  {abr:'unis.', term:'unisono', desc:'À l\'unisson (annule un divisi précédent).', inst:'cordes', cat:'indication'},
  {abr:'a 2', term:'a due', desc:'Les deux instruments jouent ensemble la même partie.', inst:'vents, cuivres', cat:'indication'},
  {abr:'1.', term:'primo', desc:'Premier instrument seulement (1ʳᵉ flûte, 1ᵉʳ hautbois…).', inst:'vents, cuivres', cat:'indication'},
  {abr:'2.', term:'secondo', desc:'Deuxième instrument seulement.', inst:'vents, cuivres', cat:'indication'},
  
  // ARTICULATIONS COURANTES
  {abr:'stacc.', term:'staccato', desc:'Détaché, court ; noté par un point au-dessus de la note.', inst:'tous', cat:'articulation'},
  {abr:'staccatiss.', term:'staccatissimo', desc:'Très court, sec ; noté par un coin (▾).', inst:'tous', cat:'articulation'},
  {abr:'leg.', term:'legato', desc:'Lié, sans interruption entre les notes.', inst:'tous', cat:'articulation'},
  {abr:'ten.', term:'tenuto', desc:'Tenu, durée pleine ; noté par une barre horizontale.', inst:'tous', cat:'articulation'},
  {abr:'marc.', term:'marcato', desc:'Marqué, accentué ; noté par un chevron (^).', inst:'tous', cat:'articulation'},
  {abr:'sf', term:'sforzando', desc:'Accent soudain et fort sur une note ou un accord.', inst:'tous', cat:'articulation'},
  {abr:'sfz', term:'sforzato', desc:'Variante intensifiée de sforzando.', inst:'tous', cat:'articulation'},
  {abr:'fp', term:'forte-piano', desc:'Attaque forte immédiatement suivie de piano.', inst:'tous', cat:'articulation'},
  {abr:'rfz', term:'rinforzando', desc:'Renforcement progressif (rare ; aussi rinf.).', inst:'tous', cat:'articulation'},
  {abr:'>', term:'accent', desc:'Accent simple ; note plus marquée que les voisines.', inst:'tous', cat:'symbole'},
  {abr:'^', term:'accent fort (marcato)', desc:'Accent fort, plus court que >.', inst:'tous', cat:'symbole'},
  {abr:'·', term:'staccato', desc:'Point au-dessus/dessous : note courte, détachée.', inst:'tous', cat:'symbole'},
  
  // DYNAMIQUES
  {abr:'pp', term:'pianissimo', desc:'Très doux.', inst:'tous', cat:'dynamique'},
  {abr:'p', term:'piano', desc:'Doux.', inst:'tous', cat:'dynamique'},
  {abr:'mp', term:'mezzo-piano', desc:'Modérément doux.', inst:'tous', cat:'dynamique'},
  {abr:'mf', term:'mezzo-forte', desc:'Modérément fort.', inst:'tous', cat:'dynamique'},
  {abr:'f', term:'forte', desc:'Fort.', inst:'tous', cat:'dynamique'},
  {abr:'ff', term:'fortissimo', desc:'Très fort.', inst:'tous', cat:'dynamique'},
  {abr:'fff', term:'fortississimo', desc:'Aussi fort que possible.', inst:'tous', cat:'dynamique'},
  {abr:'ppp', term:'pianississimo', desc:'Aussi doux que possible.', inst:'tous', cat:'dynamique'},
  {abr:'cresc.', term:'crescendo', desc:'En augmentant progressivement le volume.', inst:'tous', cat:'dynamique'},
  {abr:'decresc.', term:'decrescendo', desc:'En diminuant progressivement le volume (= dim.).', inst:'tous', cat:'dynamique'},
  {abr:'dim.', term:'diminuendo', desc:'En diminuant progressivement le volume.', inst:'tous', cat:'dynamique'},
  {abr:'<', term:'crescendo (signe)', desc:'Soufflet d\'augmentation graphique.', inst:'tous', cat:'symbole'},
  {abr:'>', term:'decrescendo (signe)', desc:'Soufflet de diminution graphique.', inst:'tous', cat:'symbole'},
  
  // TEMPO & EXPRESSION
  {abr:'rit.', term:'ritardando', desc:'En ralentissant progressivement.', inst:'tous', cat:'tempo'},
  {abr:'ritard.', term:'ritardando', desc:'En ralentissant progressivement.', inst:'tous', cat:'tempo'},
  {abr:'rall.', term:'rallentando', desc:'En ralentissant (synonyme de rit.).', inst:'tous', cat:'tempo'},
  {abr:'accel.', term:'accelerando', desc:'En accélérant progressivement.', inst:'tous', cat:'tempo'},
  {abr:'a tempo', term:'a tempo', desc:'Reprendre le tempo initial.', inst:'tous', cat:'tempo'},
  {abr:'tempo I', term:'tempo primo', desc:'Premier tempo (revenir au tempo de départ).', inst:'tous', cat:'tempo'},
  {abr:'rub.', term:'rubato', desc:'Tempo libre, expressif (« temps volé »).', inst:'tous', cat:'tempo'},
  {abr:'meno', term:'meno mosso', desc:'Moins animé.', inst:'tous', cat:'tempo'},
  {abr:'più', term:'più mosso', desc:'Plus animé.', inst:'tous', cat:'tempo'},
  {abr:'L\'istesso', term:'L\'istesso tempo', desc:'Le même tempo (malgré un changement de mesure).', inst:'tous', cat:'tempo'},
  {abr:'esp.', term:'espressivo', desc:'Expressif.', inst:'tous', cat:'expression'},
  {abr:'cant.', term:'cantabile', desc:'Chantant.', inst:'tous', cat:'expression'},
  {abr:'dolce', term:'dolce', desc:'Doux, tendre.', inst:'tous', cat:'expression'},
  {abr:'grazioso', term:'grazioso', desc:'Gracieux.', inst:'tous', cat:'expression'},
  {abr:'maestoso', term:'maestoso', desc:'Majestueux.', inst:'tous', cat:'expression'},
  {abr:'agitato', term:'agitato', desc:'Agité, inquiet.', inst:'tous', cat:'expression'},
  {abr:'tranquillo', term:'tranquillo', desc:'Tranquille.', inst:'tous', cat:'expression'},
  {abr:'leggiero', term:'leggiero', desc:'Léger.', inst:'tous', cat:'expression'},
  {abr:'pesante', term:'pesante', desc:'Lourd, pesant.', inst:'tous', cat:'expression'},
  {abr:'morendo', term:'morendo', desc:'En mourant (ralenti et diminué).', inst:'tous', cat:'expression'},
  {abr:'smorz.', term:'smorzando', desc:'En s\'éteignant (proche de morendo).', inst:'tous', cat:'expression'},
  {abr:'calando', term:'calando', desc:'En diminuant (volume + tempo).', inst:'tous', cat:'expression'},
  
  // SYMBOLES STRUCTURELS
  {abr:'𝄐', term:'point d\'orgue (fermata)', desc:'Note ou silence prolongé indéfiniment.', inst:'tous', cat:'symbole'},
  {abr:'𝄑', term:'point d\'orgue carré', desc:'Variante longue du point d\'orgue (Verdi, Mahler).', inst:'tous', cat:'symbole'},
  {abr:'D.C.', term:'Da capo', desc:'Reprendre depuis le début.', inst:'tous', cat:'structure'},
  {abr:'D.S.', term:'Dal segno', desc:'Reprendre depuis le signe (𝄋).', inst:'tous', cat:'structure'},
  {abr:'𝄋', term:'segno', desc:'Signe de reprise (associé à D.S.).', inst:'tous', cat:'symbole'},
  {abr:'𝄌', term:'coda', desc:'Renvoi vers la coda finale.', inst:'tous', cat:'symbole'},
  {abr:'D.C. al fine', term:'Da capo al fine', desc:'Reprendre depuis le début et s\'arrêter à « fine ».', inst:'tous', cat:'structure'},
  {abr:'D.S. al coda', term:'Dal segno al coda', desc:'Reprendre depuis le signe puis sauter à la coda.', inst:'tous', cat:'structure'},
  {abr:'fine', term:'fine', desc:'Fin de la pièce (lieu d\'arrêt après reprise).', inst:'tous', cat:'structure'},
  {abr:'𝄆 𝄇', term:'barres de reprise', desc:'Délimitent une section à répéter.', inst:'tous', cat:'symbole'},
  {abr:'1.|2.', term:'voltas', desc:'Première et deuxième fois (boîtes 1 et 2).', inst:'tous', cat:'structure'},
  {abr:'G.P.', term:'Generalpause', desc:'Silence général de tout l\'orchestre.', inst:'orchestre', cat:'indication'},
  {abr:'lunga', term:'lunga (pausa)', desc:'Pause longue, généralement combinée avec un point d\'orgue.', inst:'tous', cat:'indication'},
  {abr:'8va', term:'ottava alta', desc:'À l\'octave supérieure.', inst:'tous', cat:'symbole'},
  {abr:'8vb', term:'ottava bassa', desc:'À l\'octave inférieure.', inst:'tous', cat:'symbole'},
  {abr:'15ma', term:'quindicesima', desc:'Deux octaves au-dessus.', inst:'tous', cat:'symbole'},
  {abr:'loco', term:'loco', desc:'À sa place (annule un 8va précédent).', inst:'tous', cat:'symbole'},
  {abr:'simile', term:'simile', desc:'Continuer de la même manière (articulation, ornement…).', inst:'tous', cat:'indication'},
  
  // ALTÉRATIONS & CHIFFRAGE (Catel)
  {abr:'♯', term:'dièse', desc:'Hausse la note d\'un demi-ton chromatique.', inst:'tous', cat:'altération'},
  {abr:'♭', term:'bémol', desc:'Abaisse la note d\'un demi-ton chromatique.', inst:'tous', cat:'altération'},
  {abr:'♮', term:'bécarre', desc:'Annule un dièse ou un bémol précédent.', inst:'tous', cat:'altération'},
  {abr:'𝄪', term:'double-dièse', desc:'Hausse la note de deux demi-tons chromatiques.', inst:'tous', cat:'altération'},
  {abr:'𝄫', term:'double-bémol', desc:'Abaisse la note de deux demi-tons chromatiques.', inst:'tous', cat:'altération'},
  {abr:'+', term:'croix (chiffrage)', desc:'Note sensible ou intervalle augmenté (Catel).', inst:'basse continue', cat:'chiffrage'},
  {abr:'⌿', term:'chiffre barré', desc:'Intervalle diminué dans le chiffrage (Catel).', inst:'basse continue', cat:'chiffrage'},
  {abr:'tasto solo', term:'tasto solo', desc:'Pas d\'accord à la main droite, basse seule (Catel).', inst:'basse continue', cat:'chiffrage'},
  
  // CUIVRES & VENTS
  {abr:'+', term:'son bouché', desc:'Cor : son bouché par la main dans le pavillon.', inst:'cor', cat:'mode de jeu'},
  {abr:'o', term:'son ouvert', desc:'Cor : son naturel, ouvert (annule +).', inst:'cor', cat:'mode de jeu'},
  {abr:'cuivré', term:'cuivré', desc:'Son éclatant, métallique (cor, trompette).', inst:'cuivres', cat:'mode de jeu'},
  {abr:'flatterz.', term:'flatterzunge', desc:'Roulement de langue (« frullato »).', inst:'vents, cuivres', cat:'mode de jeu'},
  {abr:'frull.', term:'frullato', desc:'Roulement de langue (équivalent italien de flatterzunge).', inst:'vents, cuivres', cat:'mode de jeu'},
  {abr:'multiph.', term:'multiphoniques', desc:'Production simultanée de plusieurs sons (technique étendue).', inst:'vents', cat:'mode de jeu'},
  {abr:'slap', term:'slap tongue', desc:'Attaque percussive de la langue.', inst:'anches', cat:'mode de jeu'},
  {abr:'b.t.', term:'bell tone', desc:'Son éclatant à pavillon en l\'air.', inst:'cuivres', cat:'mode de jeu'},
  {abr:'pavillon', term:'pavillon en l\'air', desc:'Indication de lever le pavillon (« bells up »).', inst:'cuivres', cat:'indication'},
  
  // PIANO & CLAVIERS
  {abr:'Ped.', term:'pédale (piano)', desc:'Enfoncer la pédale forte (sustain).', inst:'piano', cat:'symbole'},
  {abr:'✱', term:'lever de pédale', desc:'Relâcher la pédale forte.', inst:'piano', cat:'symbole'},
  {abr:'una corda', term:'una corda', desc:'Pédale douce (gauche) — son atténué.', inst:'piano', cat:'mode de jeu'},
  {abr:'tre corde', term:'tre corde', desc:'Annule una corda — son normal.', inst:'piano', cat:'mode de jeu'},
  {abr:'sost.', term:'sostenuto', desc:'Pédale tonale (centrale) — soutient les notes enfoncées.', inst:'piano', cat:'mode de jeu'},
  
  // ORNEMENTS
  {abr:'tr', term:'trille', desc:'Alternance rapide entre la note écrite et celle au-dessus.', inst:'tous', cat:'ornement'},
  {abr:'∾', term:'mordant', desc:'Bref ornement : note principale → voisine inférieure → principale.', inst:'tous', cat:'ornement'},
  {abr:'∽', term:'gruppetto', desc:'Tour : sup → principale → inf → principale.', inst:'tous', cat:'ornement'},
  {abr:'app.', term:'appoggiatura', desc:'Petite note d\'agrément accentuée, prenant la place de la note principale.', inst:'tous', cat:'ornement'},
  {abr:'acc.', term:'acciaccatura', desc:'Petite note d\'agrément très brève, écrasée.', inst:'tous', cat:'ornement'},
  
  // PERCUSSION
  {abr:'l.v.', term:'laissez vibrer', desc:'Laisser la résonance s\'éteindre naturellement.', inst:'percussions, harpe', cat:'indication'},
  {abr:'sec', term:'sec', desc:'Étouffer immédiatement (opposé de l.v.).', inst:'percussions', cat:'indication'},
  {abr:'rim shot', term:'rim shot', desc:'Frappe simultanée sur la peau et le cercle.', inst:'caisse claire', cat:'mode de jeu'},
  {abr:'mailloches', term:'mailloches', desc:'Indication d\'utiliser des mailloches (douces, dures, etc.).', inst:'percussions', cat:'indication'}
];

const FM_DICT_EN = [
  {abr:'arco', term:'arco', desc:'With the bow (returns to normal play after pizzicato).', inst:'strings', cat:'playing technique'},
  {abr:'pizz.', term:'pizzicato', desc:'Plucked with the finger instead of the bow.', inst:'strings', cat:'playing technique'},
  {abr:'col legno', term:'col legno', desc:'With the wood of the bow (battuto = struck, tratto = drawn).', inst:'strings', cat:'playing technique'},
  {abr:'col legno batt.', term:'col legno battuto', desc:'Struck with the wood of the bow.', inst:'strings', cat:'playing technique'},
  {abr:'col legno tr.', term:'col legno tratto', desc:'Drawn with the wood (gliding effect).', inst:'strings', cat:'playing technique'},
  {abr:'sul pont.', term:'sul ponticello', desc:'Near the bridge — metallic, harmonic-rich sound.', inst:'strings', cat:'playing technique'},
  {abr:'sul tasto', term:'sul tasto', desc:'On the fingerboard — soft, veiled sound.', inst:'strings', cat:'playing technique'},
  {abr:'flautando', term:'flautando', desc:'Light bow near fingerboard, flute-like sound.', inst:'strings', cat:'playing technique'},
  {abr:'tremolo', term:'tremolo', desc:'Rapid repetition of a note (or alternation between two).', inst:'strings', cat:'playing technique'},
  {abr:'sord.', term:'con sordino', desc:'With mute (clip on the bridge for strings, in the bell for brass).', inst:'strings, brass', cat:'playing technique'},
  {abr:'senza sord.', term:'senza sordino', desc:'Without mute (remove the mute).', inst:'strings, brass', cat:'playing technique'},
  {abr:'spicc.', term:'spiccato', desc:'Bouncing, off-the-string bow stroke.', inst:'strings', cat:'playing technique'},
  {abr:'détaché', term:'détaché', desc:'Each note with a separate, smooth bow stroke.', inst:'strings', cat:'playing technique'},
  {abr:'martelé', term:'martelé', desc:'Vigorous, articulated, pressed bow stroke.', inst:'strings', cat:'playing technique'},
  {abr:'jeté', term:'ricochet (jeté)', desc:'Rapidly bouncing down-bow.', inst:'strings', cat:'playing technique'},
  {abr:'gliss.', term:'glissando', desc:'Continuous slide between two notes.', inst:'all', cat:'playing technique'},
  {abr:'port.', term:'portamento', desc:'Expressive vocal/instrumental slide, more subtle than glissando.', inst:'strings, voice', cat:'playing technique'},
  {abr:'harm.', term:'harmonics', desc:'Partial tones obtained by lightly touching the string — crystalline sound.', inst:'strings, harp', cat:'playing technique'},
  {abr:'◇', term:'natural harmonic', desc:'Diamond notehead: indicates a natural harmonic.', inst:'strings', cat:'symbol'},
  {abr:'div.', term:'divisi', desc:'Section divides (musicians play different notes).', inst:'strings', cat:'indication'},
  {abr:'unis.', term:'unisono', desc:'In unison (cancels divisi).', inst:'strings', cat:'indication'},
  {abr:'a 2', term:'a due', desc:'Both instruments play the same part together.', inst:'winds, brass', cat:'indication'},
  {abr:'1.', term:'primo', desc:'First instrument only (1st flute, 1st oboe…).', inst:'winds, brass', cat:'indication'},
  {abr:'2.', term:'secondo', desc:'Second instrument only.', inst:'winds, brass', cat:'indication'},
  
  {abr:'stacc.', term:'staccato', desc:'Detached, short; notated by a dot above the note.', inst:'all', cat:'articulation'},
  {abr:'staccatiss.', term:'staccatissimo', desc:'Very short, dry; notated by a wedge (▾).', inst:'all', cat:'articulation'},
  {abr:'leg.', term:'legato', desc:'Smoothly connected, no break between notes.', inst:'all', cat:'articulation'},
  {abr:'ten.', term:'tenuto', desc:'Held, full duration; notated by a horizontal bar.', inst:'all', cat:'articulation'},
  {abr:'marc.', term:'marcato', desc:'Marked, accented; notated by a chevron (^).', inst:'all', cat:'articulation'},
  {abr:'sf', term:'sforzando', desc:'Sudden strong accent on a note or chord.', inst:'all', cat:'articulation'},
  {abr:'sfz', term:'sforzato', desc:'Intensified variant of sforzando.', inst:'all', cat:'articulation'},
  {abr:'fp', term:'forte-piano', desc:'Strong attack immediately followed by piano.', inst:'all', cat:'articulation'},
  {abr:'rfz', term:'rinforzando', desc:'Progressive reinforcement (rare; also rinf.).', inst:'all', cat:'articulation'},
  {abr:'>', term:'accent', desc:'Simple accent; note more emphasized than neighbors.', inst:'all', cat:'symbol'},
  {abr:'^', term:'strong accent (marcato)', desc:'Strong accent, shorter than >.', inst:'all', cat:'symbol'},
  {abr:'·', term:'staccato', desc:'Dot above/below: short, detached note.', inst:'all', cat:'symbol'},
  
  {abr:'pp', term:'pianissimo', desc:'Very soft.', inst:'all', cat:'dynamic'},
  {abr:'p', term:'piano', desc:'Soft.', inst:'all', cat:'dynamic'},
  {abr:'mp', term:'mezzo-piano', desc:'Moderately soft.', inst:'all', cat:'dynamic'},
  {abr:'mf', term:'mezzo-forte', desc:'Moderately loud.', inst:'all', cat:'dynamic'},
  {abr:'f', term:'forte', desc:'Loud.', inst:'all', cat:'dynamic'},
  {abr:'ff', term:'fortissimo', desc:'Very loud.', inst:'all', cat:'dynamic'},
  {abr:'fff', term:'fortississimo', desc:'As loud as possible.', inst:'all', cat:'dynamic'},
  {abr:'ppp', term:'pianississimo', desc:'As soft as possible.', inst:'all', cat:'dynamic'},
  {abr:'cresc.', term:'crescendo', desc:'Gradually getting louder.', inst:'all', cat:'dynamic'},
  {abr:'decresc.', term:'decrescendo', desc:'Gradually getting softer (= dim.).', inst:'all', cat:'dynamic'},
  {abr:'dim.', term:'diminuendo', desc:'Gradually getting softer.', inst:'all', cat:'dynamic'},
  {abr:'<', term:'crescendo (sign)', desc:'Graphical hairpin opening.', inst:'all', cat:'symbol'},
  {abr:'>', term:'decrescendo (sign)', desc:'Graphical hairpin closing.', inst:'all', cat:'symbol'},
  
  {abr:'rit.', term:'ritardando', desc:'Gradually slowing down.', inst:'all', cat:'tempo'},
  {abr:'ritard.', term:'ritardando', desc:'Gradually slowing down.', inst:'all', cat:'tempo'},
  {abr:'rall.', term:'rallentando', desc:'Slowing down (synonym of rit.).', inst:'all', cat:'tempo'},
  {abr:'accel.', term:'accelerando', desc:'Gradually speeding up.', inst:'all', cat:'tempo'},
  {abr:'a tempo', term:'a tempo', desc:'Return to original tempo.', inst:'all', cat:'tempo'},
  {abr:'tempo I', term:'tempo primo', desc:'First tempo (return to opening tempo).', inst:'all', cat:'tempo'},
  {abr:'rub.', term:'rubato', desc:'Free, expressive tempo (« stolen time »).', inst:'all', cat:'tempo'},
  {abr:'meno', term:'meno mosso', desc:'Less animated.', inst:'all', cat:'tempo'},
  {abr:'più', term:'più mosso', desc:'More animated.', inst:'all', cat:'tempo'},
  {abr:'L\'istesso', term:'L\'istesso tempo', desc:'The same tempo (despite a meter change).', inst:'all', cat:'tempo'},
  {abr:'esp.', term:'espressivo', desc:'Expressive.', inst:'all', cat:'expression'},
  {abr:'cant.', term:'cantabile', desc:'Singing, lyrical.', inst:'all', cat:'expression'},
  {abr:'dolce', term:'dolce', desc:'Sweet, tender.', inst:'all', cat:'expression'},
  {abr:'grazioso', term:'grazioso', desc:'Graceful.', inst:'all', cat:'expression'},
  {abr:'maestoso', term:'maestoso', desc:'Majestic.', inst:'all', cat:'expression'},
  {abr:'agitato', term:'agitato', desc:'Agitated, restless.', inst:'all', cat:'expression'},
  {abr:'tranquillo', term:'tranquillo', desc:'Calm.', inst:'all', cat:'expression'},
  {abr:'leggiero', term:'leggiero', desc:'Light.', inst:'all', cat:'expression'},
  {abr:'pesante', term:'pesante', desc:'Heavy, weighty.', inst:'all', cat:'expression'},
  {abr:'morendo', term:'morendo', desc:'Dying away (slowing and softening).', inst:'all', cat:'expression'},
  {abr:'smorz.', term:'smorzando', desc:'Fading away (close to morendo).', inst:'all', cat:'expression'},
  {abr:'calando', term:'calando', desc:'Decreasing (volume + tempo).', inst:'all', cat:'expression'},
  
  {abr:'𝄐', term:'fermata', desc:'Note or rest held indefinitely.', inst:'all', cat:'symbol'},
  {abr:'𝄑', term:'square fermata', desc:'Long variant of fermata (Verdi, Mahler).', inst:'all', cat:'symbol'},
  {abr:'D.C.', term:'Da capo', desc:'Repeat from the beginning.', inst:'all', cat:'structure'},
  {abr:'D.S.', term:'Dal segno', desc:'Repeat from the sign (𝄋).', inst:'all', cat:'structure'},
  {abr:'𝄋', term:'segno', desc:'Repeat sign (associated with D.S.).', inst:'all', cat:'symbol'},
  {abr:'𝄌', term:'coda', desc:'Jump to the final coda.', inst:'all', cat:'symbol'},
  {abr:'D.C. al fine', term:'Da capo al fine', desc:'Repeat from the beginning, stop at « fine ».', inst:'all', cat:'structure'},
  {abr:'D.S. al coda', term:'Dal segno al coda', desc:'Repeat from sign, then jump to coda.', inst:'all', cat:'structure'},
  {abr:'fine', term:'fine', desc:'End of the piece (stop point after repeat).', inst:'all', cat:'structure'},
  {abr:'𝄆 𝄇', term:'repeat barlines', desc:'Mark a section to repeat.', inst:'all', cat:'symbol'},
  {abr:'1.|2.', term:'voltas', desc:'First and second endings (boxes 1 and 2).', inst:'all', cat:'structure'},
  {abr:'G.P.', term:'Generalpause', desc:'Full orchestra rest.', inst:'orchestra', cat:'indication'},
  {abr:'lunga', term:'lunga (pausa)', desc:'Long pause, usually combined with a fermata.', inst:'all', cat:'indication'},
  {abr:'8va', term:'ottava alta', desc:'One octave higher.', inst:'all', cat:'symbol'},
  {abr:'8vb', term:'ottava bassa', desc:'One octave lower.', inst:'all', cat:'symbol'},
  {abr:'15ma', term:'quindicesima', desc:'Two octaves higher.', inst:'all', cat:'symbol'},
  {abr:'loco', term:'loco', desc:'In place (cancels a previous 8va).', inst:'all', cat:'symbol'},
  {abr:'simile', term:'simile', desc:'Continue similarly (articulation, ornament…).', inst:'all', cat:'indication'},
  
  {abr:'♯', term:'sharp', desc:'Raises the note by a chromatic half-step.', inst:'all', cat:'accidental'},
  {abr:'♭', term:'flat', desc:'Lowers the note by a chromatic half-step.', inst:'all', cat:'accidental'},
  {abr:'♮', term:'natural', desc:'Cancels a previous sharp or flat.', inst:'all', cat:'accidental'},
  {abr:'𝄪', term:'double-sharp', desc:'Raises by two chromatic half-steps.', inst:'all', cat:'accidental'},
  {abr:'𝄫', term:'double-flat', desc:'Lowers by two chromatic half-steps.', inst:'all', cat:'accidental'},
  {abr:'+', term:'cross (figured bass)', desc:'Leading tone or augmented interval (Catel).', inst:'figured bass', cat:'figuration'},
  {abr:'⌿', term:'slashed figure', desc:'Diminished interval in figured bass (Catel).', inst:'figured bass', cat:'figuration'},
  {abr:'tasto solo', term:'tasto solo', desc:'No right-hand chord, bass alone (Catel).', inst:'figured bass', cat:'figuration'},
  
  {abr:'+', term:'stopped horn', desc:'Horn: tone stopped by hand in the bell.', inst:'horn', cat:'playing technique'},
  {abr:'o', term:'open tone', desc:'Horn: natural, open tone (cancels +).', inst:'horn', cat:'playing technique'},
  {abr:'cuivré', term:'cuivré (brassy)', desc:'Bright, metallic tone (horn, trumpet).', inst:'brass', cat:'playing technique'},
  {abr:'flatterz.', term:'flatterzunge', desc:'Tongue trill (« frullato »).', inst:'winds, brass', cat:'playing technique'},
  {abr:'frull.', term:'frullato', desc:'Italian term for flatterzunge.', inst:'winds, brass', cat:'playing technique'},
  {abr:'multiph.', term:'multiphonics', desc:'Simultaneous production of multiple pitches (extended technique).', inst:'winds', cat:'playing technique'},
  {abr:'slap', term:'slap tongue', desc:'Percussive tongue attack.', inst:'reeds', cat:'playing technique'},
  {abr:'b.t.', term:'bell tone', desc:'Bright tone with bells up.', inst:'brass', cat:'playing technique'},
  {abr:'pavillon', term:'bells up', desc:'Indication to raise the bells (« pavillon en l\'air »).', inst:'brass', cat:'indication'},
  
  {abr:'Ped.', term:'pedal (piano)', desc:'Press the sustain (right) pedal.', inst:'piano', cat:'symbol'},
  {abr:'✱', term:'release pedal', desc:'Release the sustain pedal.', inst:'piano', cat:'symbol'},
  {abr:'una corda', term:'una corda', desc:'Soft (left) pedal — muted sound.', inst:'piano', cat:'playing technique'},
  {abr:'tre corde', term:'tre corde', desc:'Cancels una corda — normal sound.', inst:'piano', cat:'playing technique'},
  {abr:'sost.', term:'sostenuto', desc:'Sostenuto (middle) pedal — sustains depressed notes.', inst:'piano', cat:'playing technique'},
  
  {abr:'tr', term:'trill', desc:'Rapid alternation between the written note and the one above.', inst:'all', cat:'ornament'},
  {abr:'∾', term:'mordent', desc:'Brief ornament: main → lower neighbor → main.', inst:'all', cat:'ornament'},
  {abr:'∽', term:'turn (gruppetto)', desc:'Turn: upper → main → lower → main.', inst:'all', cat:'ornament'},
  {abr:'app.', term:'appoggiatura', desc:'Accented grace note that takes the place of the main note.', inst:'all', cat:'ornament'},
  {abr:'acc.', term:'acciaccatura', desc:'Very brief, crushed grace note.', inst:'all', cat:'ornament'},
  
  {abr:'l.v.', term:'let vibrate', desc:'Let the resonance fade naturally.', inst:'percussion, harp', cat:'indication'},
  {abr:'sec', term:'sec (dry)', desc:'Damp immediately (opposite of l.v.).', inst:'percussion', cat:'indication'},
  {abr:'rim shot', term:'rim shot', desc:'Simultaneous strike on head and rim.', inst:'snare drum', cat:'playing technique'},
  {abr:'mailloches', term:'mallets', desc:'Indication to use mallets (soft, hard, etc.).', inst:'percussion', cat:'indication'}
];

const FM_DICT_ES = [
  {abr:'arco', term:'arco', desc:'Con el arco (vuelve al modo normal después de pizzicato).', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'pizz.', term:'pizzicato', desc:'Pellizcado con el dedo en lugar del arco.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'col legno', term:'col legno', desc:'Con la madera del arco (battuto = golpeado, tratto = arrastrado).', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'col legno batt.', term:'col legno battuto', desc:'Golpeado con la madera del arco.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'col legno tr.', term:'col legno tratto', desc:'Arrastrado con la madera (efecto deslizado).', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'sul pont.', term:'sul ponticello', desc:'Cerca del puente — sonido metálico, rico en armónicos.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'sul tasto', term:'sul tasto', desc:'Sobre el diapasón — sonido suave, velado.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'flautando', term:'flautando', desc:'Arco ligero cerca del diapasón, sonido aflautado.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'tremolo', term:'tremolo', desc:'Repetición rápida de una nota (o alternancia entre dos).', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'sord.', term:'con sordina', desc:'Con sordina (sobre el puente para cuerdas, en el pabellón para metales).', inst:'cuerdas, metales', cat:'modo de ejecución'},
  {abr:'senza sord.', term:'senza sordino', desc:'Sin sordina (retirar la sordina).', inst:'cuerdas, metales', cat:'modo de ejecución'},
  {abr:'spicc.', term:'spiccato', desc:'Arco saltado, rebotando.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'détaché', term:'détaché', desc:'Cada nota con un arco separado, ligado.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'martelé', term:'martelé', desc:'Arco vigoroso, articulado, con presión.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'jeté', term:'ricochet (jeté)', desc:'Arco rebotando rápidamente hacia abajo.', inst:'cuerdas', cat:'modo de ejecución'},
  {abr:'gliss.', term:'glissando', desc:'Deslizamiento continuo entre dos notas.', inst:'todos', cat:'modo de ejecución'},
  {abr:'port.', term:'portamento', desc:'Deslizamiento expresivo, más sutil que el glissando.', inst:'cuerdas, voz', cat:'modo de ejecución'},
  {abr:'harm.', term:'armónicos', desc:'Sonidos parciales obtenidos rozando la cuerda — sonido cristalino.', inst:'cuerdas, arpa', cat:'modo de ejecución'},
  {abr:'◇', term:'armónico natural', desc:'Cabeza de nota en rombo: indica un armónico natural.', inst:'cuerdas', cat:'símbolo'},
  {abr:'div.', term:'divisi', desc:'El atril se divide (los músicos tocan notas distintas).', inst:'cuerdas', cat:'indicación'},
  {abr:'unis.', term:'unisono', desc:'Al unísono (anula un divisi).', inst:'cuerdas', cat:'indicación'},
  {abr:'a 2', term:'a due', desc:'Los dos instrumentos tocan la misma parte juntos.', inst:'vientos, metales', cat:'indicación'},
  {abr:'1.', term:'primo', desc:'Solo el primer instrumento (1ª flauta, 1º oboe…).', inst:'vientos, metales', cat:'indicación'},
  {abr:'2.', term:'secondo', desc:'Solo el segundo instrumento.', inst:'vientos, metales', cat:'indicación'},
  
  {abr:'stacc.', term:'staccato', desc:'Suelto, corto; notado por un punto encima de la nota.', inst:'todos', cat:'articulación'},
  {abr:'staccatiss.', term:'staccatissimo', desc:'Muy corto, seco; notado por una cuña (▾).', inst:'todos', cat:'articulación'},
  {abr:'leg.', term:'legato', desc:'Ligado, sin interrupción entre las notas.', inst:'todos', cat:'articulación'},
  {abr:'ten.', term:'tenuto', desc:'Sostenido, duración plena; notado por una barra horizontal.', inst:'todos', cat:'articulación'},
  {abr:'marc.', term:'marcato', desc:'Marcado, acentuado; notado por un cheurón (^).', inst:'todos', cat:'articulación'},
  {abr:'sf', term:'sforzando', desc:'Acento fuerte y súbito sobre una nota o acorde.', inst:'todos', cat:'articulación'},
  {abr:'sfz', term:'sforzato', desc:'Variante intensificada de sforzando.', inst:'todos', cat:'articulación'},
  {abr:'fp', term:'forte-piano', desc:'Ataque fuerte seguido inmediatamente de piano.', inst:'todos', cat:'articulación'},
  {abr:'rfz', term:'rinforzando', desc:'Refuerzo progresivo (raro; también rinf.).', inst:'todos', cat:'articulación'},
  {abr:'>', term:'acento', desc:'Acento simple; nota más marcada que las vecinas.', inst:'todos', cat:'símbolo'},
  {abr:'^', term:'acento fuerte (marcato)', desc:'Acento fuerte, más corto que >.', inst:'todos', cat:'símbolo'},
  {abr:'·', term:'staccato', desc:'Punto encima/debajo: nota corta, suelta.', inst:'todos', cat:'símbolo'},
  
  {abr:'pp', term:'pianissimo', desc:'Muy suave.', inst:'todos', cat:'dinámica'},
  {abr:'p', term:'piano', desc:'Suave.', inst:'todos', cat:'dinámica'},
  {abr:'mp', term:'mezzo-piano', desc:'Moderadamente suave.', inst:'todos', cat:'dinámica'},
  {abr:'mf', term:'mezzo-forte', desc:'Moderadamente fuerte.', inst:'todos', cat:'dinámica'},
  {abr:'f', term:'forte', desc:'Fuerte.', inst:'todos', cat:'dinámica'},
  {abr:'ff', term:'fortissimo', desc:'Muy fuerte.', inst:'todos', cat:'dinámica'},
  {abr:'fff', term:'fortississimo', desc:'Tan fuerte como sea posible.', inst:'todos', cat:'dinámica'},
  {abr:'ppp', term:'pianississimo', desc:'Tan suave como sea posible.', inst:'todos', cat:'dinámica'},
  {abr:'cresc.', term:'crescendo', desc:'Aumentando progresivamente el volumen.', inst:'todos', cat:'dinámica'},
  {abr:'decresc.', term:'decrescendo', desc:'Disminuyendo progresivamente el volumen (= dim.).', inst:'todos', cat:'dinámica'},
  {abr:'dim.', term:'diminuendo', desc:'Disminuyendo progresivamente el volumen.', inst:'todos', cat:'dinámica'},
  {abr:'<', term:'crescendo (signo)', desc:'Reguladora gráfica de aumento.', inst:'todos', cat:'símbolo'},
  {abr:'>', term:'decrescendo (signo)', desc:'Reguladora gráfica de disminución.', inst:'todos', cat:'símbolo'},
  
  {abr:'rit.', term:'ritardando', desc:'Ralentizando progresivamente.', inst:'todos', cat:'tempo'},
  {abr:'ritard.', term:'ritardando', desc:'Ralentizando progresivamente.', inst:'todos', cat:'tempo'},
  {abr:'rall.', term:'rallentando', desc:'Ralentizando (sinónimo de rit.).', inst:'todos', cat:'tempo'},
  {abr:'accel.', term:'accelerando', desc:'Acelerando progresivamente.', inst:'todos', cat:'tempo'},
  {abr:'a tempo', term:'a tempo', desc:'Volver al tempo inicial.', inst:'todos', cat:'tempo'},
  {abr:'tempo I', term:'tempo primo', desc:'Primer tempo (volver al tempo de partida).', inst:'todos', cat:'tempo'},
  {abr:'rub.', term:'rubato', desc:'Tempo libre, expresivo (« tiempo robado »).', inst:'todos', cat:'tempo'},
  {abr:'meno', term:'meno mosso', desc:'Menos animado.', inst:'todos', cat:'tempo'},
  {abr:'più', term:'più mosso', desc:'Más animado.', inst:'todos', cat:'tempo'},
  {abr:'L\'istesso', term:'L\'istesso tempo', desc:'El mismo tempo (a pesar de un cambio de compás).', inst:'todos', cat:'tempo'},
  {abr:'esp.', term:'espressivo', desc:'Expresivo.', inst:'todos', cat:'expresión'},
  {abr:'cant.', term:'cantabile', desc:'Cantable.', inst:'todos', cat:'expresión'},
  {abr:'dolce', term:'dolce', desc:'Dulce, tierno.', inst:'todos', cat:'expresión'},
  {abr:'grazioso', term:'grazioso', desc:'Gracioso.', inst:'todos', cat:'expresión'},
  {abr:'maestoso', term:'maestoso', desc:'Majestuoso.', inst:'todos', cat:'expresión'},
  {abr:'agitato', term:'agitato', desc:'Agitado, inquieto.', inst:'todos', cat:'expresión'},
  {abr:'tranquillo', term:'tranquillo', desc:'Tranquilo.', inst:'todos', cat:'expresión'},
  {abr:'leggiero', term:'leggiero', desc:'Ligero.', inst:'todos', cat:'expresión'},
  {abr:'pesante', term:'pesante', desc:'Pesado.', inst:'todos', cat:'expresión'},
  {abr:'morendo', term:'morendo', desc:'Muriendo (ralentizando y disminuyendo).', inst:'todos', cat:'expresión'},
  {abr:'smorz.', term:'smorzando', desc:'Apagándose (cercano a morendo).', inst:'todos', cat:'expresión'},
  {abr:'calando', term:'calando', desc:'Disminuyendo (volumen + tempo).', inst:'todos', cat:'expresión'},
  
  {abr:'𝄐', term:'calderón (fermata)', desc:'Nota o silencio prolongado indefinidamente.', inst:'todos', cat:'símbolo'},
  {abr:'𝄑', term:'calderón cuadrado', desc:'Variante larga del calderón (Verdi, Mahler).', inst:'todos', cat:'símbolo'},
  {abr:'D.C.', term:'Da capo', desc:'Repetir desde el principio.', inst:'todos', cat:'estructura'},
  {abr:'D.S.', term:'Dal segno', desc:'Repetir desde el signo (𝄋).', inst:'todos', cat:'estructura'},
  {abr:'𝄋', term:'segno', desc:'Signo de repetición (asociado a D.S.).', inst:'todos', cat:'símbolo'},
  {abr:'𝄌', term:'coda', desc:'Salto a la coda final.', inst:'todos', cat:'símbolo'},
  {abr:'D.C. al fine', term:'Da capo al fine', desc:'Repetir desde el principio, parar en « fine ».', inst:'todos', cat:'estructura'},
  {abr:'D.S. al coda', term:'Dal segno al coda', desc:'Repetir desde el signo, luego saltar a la coda.', inst:'todos', cat:'estructura'},
  {abr:'fine', term:'fine', desc:'Fin de la pieza (punto de parada tras la repetición).', inst:'todos', cat:'estructura'},
  {abr:'𝄆 𝄇', term:'barras de repetición', desc:'Delimitan una sección a repetir.', inst:'todos', cat:'símbolo'},
  {abr:'1.|2.', term:'voltas', desc:'Casillas de 1ª y 2ª vez.', inst:'todos', cat:'estructura'},
  {abr:'G.P.', term:'Generalpause', desc:'Silencio general de toda la orquesta.', inst:'orquesta', cat:'indicación'},
  {abr:'lunga', term:'lunga (pausa)', desc:'Pausa larga, generalmente con calderón.', inst:'todos', cat:'indicación'},
  {abr:'8va', term:'ottava alta', desc:'Una octava más alta.', inst:'todos', cat:'símbolo'},
  {abr:'8vb', term:'ottava bassa', desc:'Una octava más baja.', inst:'todos', cat:'símbolo'},
  {abr:'15ma', term:'quindicesima', desc:'Dos octavas más alto.', inst:'todos', cat:'símbolo'},
  {abr:'loco', term:'loco', desc:'En su sitio (anula un 8va anterior).', inst:'todos', cat:'símbolo'},
  {abr:'simile', term:'simile', desc:'Continuar de la misma manera (articulación, ornamento…).', inst:'todos', cat:'indicación'},
  
  {abr:'♯', term:'sostenido', desc:'Sube la nota un semitono cromático.', inst:'todos', cat:'alteración'},
  {abr:'♭', term:'bemol', desc:'Baja la nota un semitono cromático.', inst:'todos', cat:'alteración'},
  {abr:'♮', term:'becuadro', desc:'Anula un sostenido o bemol anterior.', inst:'todos', cat:'alteración'},
  {abr:'𝄪', term:'doble sostenido', desc:'Sube la nota dos semitonos cromáticos.', inst:'todos', cat:'alteración'},
  {abr:'𝄫', term:'doble bemol', desc:'Baja la nota dos semitonos cromáticos.', inst:'todos', cat:'alteración'},
  {abr:'+', term:'cruz (cifrado)', desc:'Sensible o intervalo aumentado (Catel).', inst:'bajo continuo', cat:'cifrado'},
  {abr:'⌿', term:'cifra tachada', desc:'Intervalo disminuido en el cifrado (Catel).', inst:'bajo continuo', cat:'cifrado'},
  {abr:'tasto solo', term:'tasto solo', desc:'Sin acordes en la mano derecha, bajo solo (Catel).', inst:'bajo continuo', cat:'cifrado'},
  
  {abr:'+', term:'sonido tapado', desc:'Trompa: sonido tapado por la mano en el pabellón.', inst:'trompa', cat:'modo de ejecución'},
  {abr:'o', term:'sonido abierto', desc:'Trompa: sonido natural, abierto (anula +).', inst:'trompa', cat:'modo de ejecución'},
  {abr:'cuivré', term:'cuivré (acobrado)', desc:'Sonido brillante, metálico (trompa, trompeta).', inst:'metales', cat:'modo de ejecución'},
  {abr:'flatterz.', term:'flatterzunge', desc:'Trino lingual (« frullato »).', inst:'vientos, metales', cat:'modo de ejecución'},
  {abr:'frull.', term:'frullato', desc:'Equivalente italiano de flatterzunge.', inst:'vientos, metales', cat:'modo de ejecución'},
  {abr:'multiph.', term:'multifónicos', desc:'Producción simultánea de varios sonidos (técnica extendida).', inst:'vientos', cat:'modo de ejecución'},
  {abr:'slap', term:'slap tongue', desc:'Ataque percusivo de la lengua.', inst:'lengüetas', cat:'modo de ejecución'},
  {abr:'b.t.', term:'bell tone', desc:'Sonido brillante con pabellón al aire.', inst:'metales', cat:'modo de ejecución'},
  {abr:'pavillon', term:'pabellón al aire', desc:'Indicación de levantar el pabellón.', inst:'metales', cat:'indicación'},
  
  {abr:'Ped.', term:'pedal (piano)', desc:'Pisar el pedal de resonancia (sustain).', inst:'piano', cat:'símbolo'},
  {abr:'✱', term:'soltar pedal', desc:'Soltar el pedal de resonancia.', inst:'piano', cat:'símbolo'},
  {abr:'una corda', term:'una corda', desc:'Pedal sordo (izquierdo) — sonido atenuado.', inst:'piano', cat:'modo de ejecución'},
  {abr:'tre corde', term:'tre corde', desc:'Anula una corda — sonido normal.', inst:'piano', cat:'modo de ejecución'},
  {abr:'sost.', term:'sostenuto', desc:'Pedal tonal (central) — sostiene las notas pulsadas.', inst:'piano', cat:'modo de ejecución'},
  
  {abr:'tr', term:'trino', desc:'Alternancia rápida entre la nota escrita y la superior.', inst:'todos', cat:'ornamento'},
  {abr:'∾', term:'mordente', desc:'Adorno breve: principal → vecina inferior → principal.', inst:'todos', cat:'ornamento'},
  {abr:'∽', term:'grupeto', desc:'Vuelta: superior → principal → inferior → principal.', inst:'todos', cat:'ornamento'},
  {abr:'app.', term:'apoyatura', desc:'Nota de adorno acentuada que toma el lugar de la principal.', inst:'todos', cat:'ornamento'},
  {abr:'acc.', term:'acciaccatura', desc:'Nota de adorno muy breve, aplastada.', inst:'todos', cat:'ornamento'},
  
  {abr:'l.v.', term:'laissez vibrer', desc:'Dejar que la resonancia se apague naturalmente.', inst:'percusión, arpa', cat:'indicación'},
  {abr:'sec', term:'sec (seco)', desc:'Apagar inmediatamente (opuesto de l.v.).', inst:'percusión', cat:'indicación'},
  {abr:'rim shot', term:'rim shot', desc:'Golpe simultáneo en el parche y el aro.', inst:'caja', cat:'modo de ejecución'},
  {abr:'mailloches', term:'mazas/bolillos', desc:'Indicación de usar mazas (blandas, duras, etc.).', inst:'percusión', cat:'indicación'}
];

function FM_getDict(){return currentLang==='en'?FM_DICT_EN:currentLang==='es'?FM_DICT_ES:FM_DICT_FR}
function FM_dictEsc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function FM_dictHL(s,q){if(!q)return FM_dictEsc(s);const e=FM_dictEsc(s),qe=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return e.replace(new RegExp('('+qe+')','gi'),'<mark class="fm-dict-hl">$1</mark>')}
function FM_renderDict(filter){
  const list=document.getElementById('fm_dictList'); if(!list) return;
  const data=FM_getDict();
  const q=(filter||'').trim().toLowerCase();
  const filtered=q?data.filter(d=>d.abr.toLowerCase().includes(q)||d.term.toLowerCase().includes(q)||d.desc.toLowerCase().includes(q)||d.inst.toLowerCase().includes(q)||d.cat.toLowerCase().includes(q)):data.slice();
  // Tri alpha sur abr, insensible à la casse, accents-friendly
  filtered.sort((a,b)=>a.abr.localeCompare(b.abr,currentLang,{sensitivity:'base'}));
  const cnt=document.getElementById('fm_dictCount'); if(cnt)cnt.textContent=filtered.length+'/'+data.length;
  if(filtered.length===0){list.innerHTML='<div class="fm-dict-empty">'+(currentLang==='en'?'No result':currentLang==='es'?'Sin resultados':'Aucun résultat')+'</div>';return}
  list.innerHTML=filtered.map(d=>'<div class="fm-dict-item" role="listitem"><div class="fm-dict-item-head"><span class="fm-dict-abr">'+FM_dictHL(d.abr,q)+'</span><span class="fm-dict-term">'+FM_dictHL(d.term,q)+'</span><span class="fm-dict-cat">'+FM_dictEsc(d.cat)+'</span></div><div class="fm-dict-desc">'+FM_dictHL(d.desc,q)+'</div><div class="fm-dict-inst">'+FM_dictHL(d.inst,q)+'</div></div>').join('');
}
function FM_filterDict(){const inp=document.getElementById('fm_dictSearch');FM_renderDict(inp?inp.value:'')}
function FM_openDict(){
  const ov=document.getElementById('fm_dictOverlay'),pn=document.getElementById('fm_dictPanel');
  if(!ov||!pn)return;
  FM_renderDict('');
  ov.classList.add('open'); pn.classList.add('open'); pn.setAttribute('aria-hidden','false');
  setTimeout(()=>{const inp=document.getElementById('fm_dictSearch'); if(inp){inp.value='';inp.focus()}},300);
  document.addEventListener('keydown',FM_dictKey);
}
function FM_closeDict(){
  const ov=document.getElementById('fm_dictOverlay'),pn=document.getElementById('fm_dictPanel');
  if(!ov||!pn)return;
  ov.classList.remove('open'); pn.classList.remove('open'); pn.setAttribute('aria-hidden','true');
  document.removeEventListener('keydown',FM_dictKey);
}
function FM_dictKey(e){if(e.key==='Escape'){e.preventDefault();FM_closeDict()}}

const FM_CADENCES_FR=[{id:'PAC',label:'CAP — Cadence auth. parfaite'},{id:'IAC',label:'CAI — Cadence auth. imparfaite'},{id:'HC',label:'DC — Demi-cadence'},{id:'plagal',label:'CP — Cadence plagale'},{id:'deceptive',label:'CR — Cadence rompue'},{id:'phrygian',label:'CPh — Cadence phrygienne'},{id:'evaded',label:'CÉ — Cadence évitée'},{id:'elided',label:'Élision'},{id:'none',label:'(aucune)'}];
const FM_CADENCES_EN=[{id:'PAC',label:'PAC — Perfect Authentic Cadence'},{id:'IAC',label:'IAC — Imperfect Authentic Cadence'},{id:'HC',label:'HC — Half Cadence'},{id:'plagal',label:'PC — Plagal Cadence'},{id:'deceptive',label:'DC — Deceptive Cadence'},{id:'phrygian',label:'Phr. — Phrygian Cadence'},{id:'evaded',label:'EC — Evaded Cadence'},{id:'elided',label:'Elision'},{id:'none',label:'(none)'}];
const FM_CADENCES_ES=[{id:'PAC',label:'CAP — Cadencia auténtica perfecta'},{id:'IAC',label:'CAI — Cadencia auténtica imperfecta'},{id:'HC',label:'SC — Semicadencia'},{id:'plagal',label:'CP — Cadencia plagal'},{id:'deceptive',label:'CR — Cadencia rota'},{id:'phrygian',label:'CFr — Cadencia frigia'},{id:'evaded',label:'CE — Cadencia evitada'},{id:'elided',label:'Elisión'},{id:'none',label:'(ninguna)'}];
function FM_getCadences(){return currentLang==='en'?FM_CADENCES_EN:currentLang==='es'?FM_CADENCES_ES:FM_CADENCES_FR;}
const FM_CADENCES=FM_CADENCES_FR;
function FM_cadShort(id){if(!id||id==='none')return '';const fr={PAC:'CAP',IAC:'CAI',HC:'DC',plagal:'CP',deceptive:'CR',phrygian:'CPh',evaded:'CÉ',elided:'Élis.'};const en={PAC:'PAC',IAC:'IAC',HC:'HC',plagal:'PC',deceptive:'DC',phrygian:'Phr.',evaded:'EC',elided:'Elid.'};const es={PAC:'CAP',IAC:'CAI',HC:'SC',plagal:'CP',deceptive:'CR',phrygian:'CFr',evaded:'CE',elided:'Elis.'};return(currentLang==='en'?en:currentLang==='es'?es:fr)[id]||id;}
const FM_DEGREES_MAJ=[{cat:'Diatoniques',items:['I','ii','iii','IV','V','vi','vii°']},{cat:'Septièmes',items:['I⁷','ii⁷','iii⁷','IV⁷','V⁷','vi⁷','viiø⁷']},{cat:'Mixture',items:['♭II','♭III','iv','♭VI','♭VII','♭ii°','ii°','♭iii','vii']},{cat:'Dom. sec.',items:['V/ii','V/iii','V/IV','V/V','V/vi','V⁷/ii','V⁷/iii','V⁷/IV','V⁷/V','V⁷/vi']},{cat:'Spéciaux',items:['N⁶','It⁶','Fr⁶','Ger⁶','V⁺','Cad⁶₄']}];
const FM_DEGREES_MIN=[{cat:'Diatoniques',items:['i','ii°','III','iv','v','VI','VII','vii°']},{cat:'Septièmes',items:['i⁷','iiø⁷','III⁷','iv⁷','V⁷','VI⁷','VII⁷','vii°⁷']},{cat:'Mixture',items:['I','II','ii','iii','IV','♭VI','♭VII','vii']},{cat:'Dom. sec.',items:['V/III','V/iv','V/V','V/VI','V/VII','V⁷/III','V⁷/iv','V⁷/V','V⁷/VI']},{cat:'Spéciaux',items:['N⁶','It⁶','Fr⁶','Ger⁶','V⁺','Cad⁶₄']}];
const FM_DYNAMICS=['ppp','pp','p','mp','mf','f','ff','fff','fp','sfz','cresc.','decresc.'];

const FM_INSTRUMENTS=[
{fam:'Bois',items:[{id:'picc',n:'Piccolo',k:''},{id:'fl',n:'Flûte',k:''},{id:'fl2',n:'Flûte 2',k:''},{id:'ob',n:'Hautbois',k:''},{id:'ob2',n:'Hautbois 2',k:''},{id:'ca',n:'Cor anglais',k:'en Fa'},{id:'clBb',n:'Clarinette',k:'en Si♭'},{id:'clA',n:'Clarinette',k:'en La'},{id:'clEb',n:'Petite clarinette',k:'en Mi♭'},{id:'clB',n:'Clarinette basse',k:'en Si♭'},{id:'bn',n:'Basson',k:''},{id:'bn2',n:'Basson 2',k:''},{id:'cbn',n:'Contrebasson',k:''}]},
{fam:'Cuivres',items:[{id:'hn',n:'Cor',k:'en Fa'},{id:'hn2',n:'Cor 2',k:'en Fa'},{id:'hn3',n:'Cor 3',k:'en Fa'},{id:'hn4',n:'Cor 4',k:'en Fa'},{id:'tpBb',n:'Trompette',k:'en Si♭'},{id:'tpC',n:'Trompette',k:'en Do'},{id:'tp2',n:'Trompette 2',k:'en Si♭'},{id:'tbn',n:'Trombone',k:''},{id:'tbn2',n:'Trombone 2',k:''},{id:'btbn',n:'Trombone basse',k:''},{id:'tba',n:'Tuba',k:''}]},
{fam:'Percussion',items:[{id:'timp',n:'Timbales',k:''},{id:'gc',n:'Grosse caisse',k:''},{id:'cc',n:'Caisse claire',k:''},{id:'cym',n:'Cymbales',k:''},{id:'tri',n:'Triangle',k:''},{id:'xyl',n:'Xylophone',k:''},{id:'glock',n:'Glockenspiel',k:''},{id:'tamb',n:'Tambourin',k:''},{id:'perc',n:'Percussion (autre)',k:''}]},
{fam:'Claviers / Cordes pincées',items:[{id:'harp',n:'Harpe',k:''},{id:'cel',n:'Célesta',k:''},{id:'pno',n:'Piano',k:''},{id:'org',n:'Orgue',k:''}]},
{fam:'Cordes',items:[{id:'vn1',n:'Violon I',k:''},{id:'vn2',n:'Violon II',k:''},{id:'vla',n:'Alto',k:''},{id:'vc',n:'Violoncelle',k:''},{id:'cb',n:'Contrebasse',k:''}]},
{fam:'Voix',items:[{id:'sop',n:'Soprano',k:''},{id:'mez',n:'Mezzo-soprano',k:''},{id:'alt',n:'Alto (voix)',k:''},{id:'ten',n:'Ténor',k:''},{id:'bar',n:'Baryton',k:''},{id:'bas',n:'Basse',k:''},{id:'choeur',n:'Chœur SATB',k:''}]},
{fam:'Solistes',items:[{id:'sol1',n:'Soliste 1',k:''},{id:'sol2',n:'Soliste 2',k:''},{id:'sol3',n:'Soliste 3',k:''}]}
];
const FM_ORCH_PRESETS={
'orch-classique':{n:'Orchestre classique',ids:['fl','ob','ob2','clBb','bn','bn2','hn','hn2','tpBb','tp2','timp','vn1','vn2','vla','vc','cb']},
'orch-romantique':{n:'Orchestre romantique',ids:['picc','fl','fl2','ob','ob2','ca','clBb','clB','bn','bn2','cbn','hn','hn2','hn3','hn4','tpBb','tp2','tbn','tbn2','btbn','tba','timp','gc','cc','cym','tri','harp','vn1','vn2','vla','vc','cb']},
'orch-chambre':{n:'Orchestre de chambre',ids:['fl','ob','clBb','bn','hn','vn1','vn2','vla','vc','cb']},
'quatuor-cordes':{n:'Quatuor à cordes',ids:['vn1','vn2','vla','vc']},
'trio-piano':{n:'Trio avec piano',ids:['pno','vn1','vc']},
'quintette-vent':{n:'Quintette à vent',ids:['fl','ob','clBb','bn','hn']},
'piano-solo':{n:'Piano solo',ids:['pno']},
'choeur-orch':{n:'Chœur + orchestre',ids:['fl','fl2','ob','ob2','clBb','bn','bn2','hn','hn2','tpBb','tp2','tbn','tbn2','timp','choeur','vn1','vn2','vla','vc','cb']},
};

const FM_REPERTOIRE={
'sonata':[
{comp:'Mozart',work:'Symphonie n°40, mvt. I',key:'Sol min.',data:{formId:'sonata',globalKey:'Sol',globalMode:'minor',sections:[FM_sec('theme-p','P','i','HC',20),FM_sec('transition','TR','III','HC',9),FM_sec('theme-s','S','III','PAC',22),FM_sec('closing','C','III','PAC',14),FM_sec('development','Dév.','—','none',60),FM_sec('theme-p','P','i','none',20),FM_sec('transition','TR','i','none',12),FM_sec('theme-s','S','i','PAC',22),FM_sec('closing','C','i','PAC',14)]}},
{comp:'Beethoven',work:'Sonate « Pathétique », mvt. I',key:'Do min.',data:{formId:'sonata-intro',globalKey:'Do',globalMode:'minor',sections:[FM_sec('introduction','Intro (Grave)','i','HC',10,'Accords dramatiques, tempo lent'),FM_sec('theme-p','P (Allegro)','i','HC',12),FM_sec('transition','TR','III','HC',8),FM_sec('theme-s','S','III','PAC',12),FM_sec('closing','C','III','PAC',8),FM_sec('development','Dév.','—','none',24),FM_sec('theme-p','P','i','none',12),FM_sec('transition','TR','i','none',8),FM_sec('theme-s','S','i','PAC',12),FM_sec('closing','C','i','PAC',8),FM_sec('coda','Coda (Grave)','i','PAC',8,'Retour du matériau de l\'intro')]}},
{comp:'Beethoven',work:'Quatuor op.59 n°1 « Razumovsky », mvt. I',key:'Fa M',data:{formId:'sonata',globalKey:'Fa',globalMode:'major',sections:[FM_sec('theme-p','P','I','none',30,'Thème au violoncelle'),FM_sec('transition','TR','V','HC',15),FM_sec('theme-s','S','V','PAC',25),FM_sec('closing','C','V','PAC',10),FM_sec('development','Dév.','—','none',50),FM_sec('theme-p','P','I','none',30),FM_sec('transition','TR','I','none',15),FM_sec('theme-s','S','I','PAC',25),FM_sec('closing','C','I','PAC',10)]}},
{comp:'Beethoven',work:'Trio « Archiduc » op.97, mvt. I',key:'Si♭ M',data:{formId:'sonata',globalKey:'Si♭',globalMode:'major',sections:[FM_sec('theme-p','P','I','none',20,'Piano solo, thème noble'),FM_sec('transition','TR','V','HC',12),FM_sec('theme-s','S','V','PAC',18),FM_sec('closing','C','V','PAC',8),FM_sec('development','Dév.','—','none',40),FM_sec('theme-p','P','I','none',20),FM_sec('transition','TR','I','none',12),FM_sec('theme-s','S','I','PAC',18),FM_sec('closing','C','I','PAC',8)]}},
],
'sonata-intro':[
{comp:'Beethoven',work:'Symphonie n°7, mvt. I',key:'La M',data:{formId:'sonata-intro',globalKey:'La',globalMode:'major',sections:[FM_sec('introduction','Intro (Poco sostenuto)','I','HC',62,'Long intro avec montée progressive'),FM_sec('theme-p','P (Vivace)','I','none',24,'Rythme pointé caractéristique'),FM_sec('transition','TR','V','HC',16),FM_sec('theme-s','S','V','PAC',20),FM_sec('closing','C','V','PAC',8),FM_sec('development','Dév.','—','none',50),FM_sec('theme-p','P','I','none',24),FM_sec('transition','TR','I','none',16),FM_sec('theme-s','S','I','PAC',20),FM_sec('closing','C','I','PAC',8),FM_sec('coda','Coda','I','PAC',30)]}},
{comp:'Brahms',work:'Symphonie n°1, mvt. IV',key:'Do min.→Do M',data:{formId:'sonata-intro',globalKey:'Do',globalMode:'minor',sections:[FM_sec('introduction','Intro (Adagio)','i','none',30,'Cuivres héroïques + Alphorn'),FM_sec('theme-p','P (Allegro)','I','none',20,'Thème héroïque en Do M'),FM_sec('transition','TR','V','HC',12),FM_sec('theme-s','S','V','PAC',16),FM_sec('closing','C','V','PAC',8),FM_sec('development','Dév.','—','none',40),FM_sec('theme-p','P','I','none',20),FM_sec('transition','TR','I','none',12),FM_sec('theme-s','S','I','PAC',16),FM_sec('closing','C','I','PAC',8),FM_sec('coda','Coda','I','PAC',30,'Chorale héroïque')]}}
],
'rondo-5':[
{comp:'Mozart',work:'Concerto pour piano K.467, mvt. II (Andante)',key:'Fa M',data:{formId:'rondo-5',globalKey:'Fa',globalMode:'major',sections:[FM_sec('refrain','A','I','PAC',8,'Mélodie célèbre aux cordes'),FM_sec('couplet','B','V','PAC',8),FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','C','vi','PAC',8),FM_sec('refrain','A','I','PAC',8)]}},
{comp:'Beethoven',work:'Sonate « Pathétique », mvt. II',key:'La♭ M',data:{formId:'rondo-5',globalKey:'La',globalMode:'major',sections:[FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','B','IV','PAC',8),FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','C','i','PAC',8),FM_sec('refrain','A','I','PAC',8)]}}
],
'sonata-rondo':[
{comp:'Beethoven',work:'Sonate « Pathétique », mvt. III',key:'Do min.',data:{formId:'sonata-rondo',globalKey:'Do',globalMode:'minor',sections:[FM_sec('refrain','A','i','PAC',8),FM_sec('transition','TR','III','HC',4),FM_sec('couplet','B','III','PAC',8),FM_sec('retransition','RT','V','HC',4),FM_sec('refrain','A','i','PAC',8),FM_sec('development','C (Dév.)','—','none',12),FM_sec('refrain','A','i','PAC',8),FM_sec('transition','TR','i','none',4),FM_sec('couplet',"B'",'i','PAC',8),FM_sec('refrain','A','i','PAC',8),FM_sec('coda','Coda','i','PAC',6)]}}
],
'theme-var':[
{comp:'Brahms',work:'Symphonie n°4, mvt. IV (Passacaille)',key:'Mi min.',data:{formId:'theme-var',globalKey:'Mi',globalMode:'minor',sections:[FM_sec('theme-var','Thème (Chaconne, 8 mes.)','i','PAC',8,'Tiré de Bach BWV 150'),Object.assign(FM_sec('variation','Var. 1-8','i','PAC',64),{variationNum:1,variationTech:'Variations strictes'}),Object.assign(FM_sec('variation','Var. 12-15 (Flûte)','III','PAC',32),{variationNum:12,variationTech:'Passage en majeur'}),Object.assign(FM_sec('variation','Var. 16-30','i','PAC',120),{variationNum:16,variationTech:'Strette, culmination'}),FM_sec('coda','Coda','i','PAC',16)]}},
{comp:'Mozart',work:'Sonate K.331, mvt. I',key:'La M',data:{formId:'theme-var',globalKey:'La',globalMode:'major',sections:[FM_sec('theme-var','Thème','I','PAC',18),Object.assign(FM_sec('variation','Var. 1','I','PAC',18),{variationNum:1,variationTech:'Ornementation mélodique'}),Object.assign(FM_sec('variation','Var. 2','I','PAC',18),{variationNum:2,variationTech:'Ornementation mélodique'}),Object.assign(FM_sec('variation','Var. 3','i','PAC',18),{variationNum:3,variationTech:'Changement de mode'}),Object.assign(FM_sec('variation','Var. 4','I','PAC',18),{variationNum:4,variationTech:'Variation rythmique'}),Object.assign(FM_sec('variation','Var. 5','I','PAC',18),{variationNum:5,variationTech:'Variation de caractère'}),Object.assign(FM_sec('variation','Var. 6','I','PAC',18),{variationNum:6,variationTech:'Variation rythmique (Allegro)'})]}}
,{comp:'Beethoven',work:'Variations Diabelli, op. 120',key:'Do M',data:{formId:'theme-var',globalKey:'Do',globalMode:'major',sections:[FM_sec('theme-var','Thème (Diabelli)','I','PAC',16,'Valse simple'),Object.assign(FM_sec('variation','Var. 1-10','I','PAC',160),{variationNum:1,variationTech:'Ornementation'}),Object.assign(FM_sec('variation','Var. 11-20','—','PAC',160),{variationNum:11,variationTech:'Explorations harmoniques'}),Object.assign(FM_sec('variation','Var. 21-30','—','PAC',160),{variationNum:21,variationTech:'Changements de mètre'}),Object.assign(FM_sec('variation','Var. 31 (Largo)','i','PAC',16),{variationNum:31,variationTech:'Méditation en mineur'}),Object.assign(FM_sec('variation','Var. 32 (Fugue)','I','PAC',32),{variationNum:32,variationTech:'Double fugue'}),Object.assign(FM_sec('variation','Var. 33 (Menuet)','I','PAC',16),{variationNum:33,variationTech:'Retour au thème'})]}}
,{comp:'Elgar',work:'Variations Enigma, op. 36',key:'Sol min.',data:{formId:'theme-var',globalKey:'Sol',globalMode:'minor',sections:[FM_sec('theme-var','Thème (Enigma)','i','PAC',12),Object.assign(FM_sec('variation','Var. I (C.A.E.)','i','PAC',10),{variationNum:1,variationTech:'Portrait épouse, tendre'}),Object.assign(FM_sec('variation','Var. II (H.D.S-P.)','i','PAC',8),{variationNum:2,variationTech:'Piano énergique'}),Object.assign(FM_sec('variation','Var. III (R.B.T.)','i','PAC',10),{variationNum:3,variationTech:'Bois, voix falsetto'}),Object.assign(FM_sec('variation','Var. IV (W.M.B.)','i','PAC',6),{variationNum:4,variationTech:'Coup porte, brusque'}),Object.assign(FM_sec('variation','Var. V (R.P.A.)','i','PAC',10),{variationNum:5,variationTech:'Sérieux, esprit'}),Object.assign(FM_sec('variation','Var. VI (Ysobel)','i','PAC',9),{variationNum:6,variationTech:'Alto solo, gracieux'}),Object.assign(FM_sec('variation','Var. VII (Troyte)','i','PAC',7),{variationNum:7,variationTech:'Timbales, orageux'}),Object.assign(FM_sec('variation','Var. VIII (W.N.)','I','PAC',10),{variationNum:8,variationTech:'Passage majeur, élégant'}),Object.assign(FM_sec('variation','Var. IX (Nimrod)','♭VI','PAC',16),{variationNum:9,variationTech:'Élégie majestueuse'}),Object.assign(FM_sec('variation','Var. X (Dorabella)','i','PAC',9),{variationNum:10,variationTech:'Intermezzo, danse'}),Object.assign(FM_sec('variation','Var. XI (G.R.S.)','i','PAC',8),{variationNum:11,variationTech:'Portrait chien Dan'}),Object.assign(FM_sec('variation','Var. XII (B.G.N.)','i','PAC',10),{variationNum:12,variationTech:'Solo violoncelle'}),Object.assign(FM_sec('variation','Var. XIII (***)','I','PAC',11),{variationNum:13,variationTech:'Romanza, clarinette Mendelssohn'}),Object.assign(FM_sec('variation','Var. XIV (E.D.U.)','I','PAC',32),{variationNum:14,variationTech:'Finale héroïque, orgue'})]}}
],
'ternary-simple':[
{comp:'Berlioz',work:'La Damnation de Faust — Marche hongroise',key:'La min.',data:{formId:'ternary-simple',globalKey:'La',globalMode:'minor',sections:[FM_sec('section-a','A (marche)','i','PAC',24,'Cuivres et bois'),FM_sec('section-b','B (trio)','I','PAC',20,'Passage en majeur'),FM_sec('section-a-prime',"A'",'I','PAC',24,'Tutti enrichi')]}}
,{comp:'Beethoven',work:'Symphonie n°5, mvt. II (Andante)',key:'La♭ M',data:{formId:'ternary-simple',globalKey:'La♭',globalMode:'major',sections:[FM_sec('section-a','A (Thème)','I','PAC',24,'Altos et violoncelles'),FM_sec('section-b','B (Développement)','IV','none',32,'Clarinettes + variations'),FM_sec('section-a-prime',"A'",'I','PAC',24,'Retour enrichi, trompettes')]}}
,{comp:'Brahms',work:'Symphonie n°3, mvt. III (Poco allegretto)',key:'Do min.',data:{formId:'ternary-simple',globalKey:'Do',globalMode:'minor',sections:[FM_sec('section-a','A (Mélancolique)','i','PAC',16,'Violoncelles solo'),FM_sec('section-b','B (Pastoral)','♭VI','PAC',20,'Cor + bois en La♭'),FM_sec('section-a-prime',"A'",'i','PAC',16,'Retour identique')]}}
,{comp:'Tchaikovsky',work:'Symphonie n°6, mvt. II (Allegro con grazia)',key:'Ré M',data:{formId:'ternary-simple',globalKey:'Ré',globalMode:'major',sections:[FM_sec('section-a','A (Valse)','I','PAC',32,'5/4, thème élégant'),FM_sec('section-b','B (Trio)','♭VII','PAC',24,'Do majeur, plus sombre'),FM_sec('section-a-prime',"A'",'I','PAC',32,'Reprise de la valse')]}}
],
'concerto':[
{comp:'Mozart',work:'Concerto pour piano K.488, mvt. I',key:'La M',data:{formId:'sonata',globalKey:'La',globalMode:'major',sections:[FM_sec('introduction','Ritornello orch.','I','PAC',66,'Exposition orchestrale complète'),FM_sec('theme-p','P (solo)','I','none',16,'Piano entre avec P'),FM_sec('transition','TR (solo)','V','HC',12),FM_sec('theme-s','S (solo)','V','PAC',20),FM_sec('closing','Ritornello','V','PAC',18,'Orchestre conclut expo'),FM_sec('development','Dév.','—','none',50,'Dialogue solo-orch.'),FM_sec('theme-p','P (solo)','I','none',16),FM_sec('transition','TR (solo)','I','none',12),FM_sec('theme-s','S (solo)','I','PAC',20),FM_sec('cadenza','Cadenza','I','none',24,'Improvisation virtuose'),FM_sec('closing','Ritornello final','I','PAC',12)]}}
,{comp:'Beethoven',work:'Concerto pour violon, op. 61, mvt. I',key:'Ré M',data:{formId:'sonata',globalKey:'Ré',globalMode:'major',sections:[FM_sec('introduction','Ritornello orch.','I','PAC',88,'5 coups de timbales'),FM_sec('theme-p','P (solo)','I','none',24,'Violon entre lyrique'),FM_sec('transition','TR (solo)','V','HC',20),FM_sec('theme-s','S (solo)','V','PAC',28),FM_sec('closing','Ritornello','V','PAC',20),FM_sec('development','Dév.','—','none',80,'Modulations lointaines'),FM_sec('theme-p','P (solo)','I','none',24),FM_sec('transition','TR (solo)','I','none',20),FM_sec('theme-s','S (solo)','I','PAC',28),FM_sec('cadenza','Cadenza','I','none',32),FM_sec('coda','Coda','I','PAC',16)]}}
,{comp:'Brahms',work:'Concerto pour piano n°2, mvt. I',key:'Si♭ M',data:{formId:'sonata',globalKey:'Si♭',globalMode:'major',sections:[FM_sec('introduction','Intro (Cor solo)','I','none',8,'Appel pastoral'),FM_sec('theme-p','P (piano entre)','I','none',24,'Dialogue avec orch.'),FM_sec('transition','TR','IV','HC',18),FM_sec('theme-s','S','IV','PAC',26,'Fa majeur'),FM_sec('closing','C','IV','PAC',12),FM_sec('development','Dév.','—','none',90,'Très développé'),FM_sec('theme-p','P','I','none',24),FM_sec('transition','TR','I','none',18),FM_sec('theme-s','S','I','PAC',26),FM_sec('cadenza','Cadenza','I','none',28),FM_sec('coda','Coda','I','PAC',20)]}}
],
'period-parallel':[
{comp:'Mozart',work:'Sonate K.545, mvt. I — Thème',key:'Do M',data:{formId:'period-parallel',globalKey:'Do',globalMode:'major',sections:[FM_sec('antecedent','Ant.','I','HC',4,'Do M → Sol M'),FM_sec('consequent','Cons.','I','PAC',4)]}}
],
};

function FM_sec(type,label,degree,cadence,measures,notes){return{id:FM_uid(),type,label:FM_tLabel(label||FM_typeMap[type]?.short||''),degree:degree||'I',cadence:cadence||'none',tempo:'',character:'',dynamics:'',measures:measures||4,notes:FM_tLabel(notes||''),variationNum:null,variationTech:''}}

const FM_FORMS={
'period-parallel':{name:'Période parallèle',cat:'Petites formes',desc:'Ant. (DC : demi-cadence) → Cons. (CAP : cadence auth. parfaite), ouvertures similaires.',ref:[{l:'Ant.',c:'#534AB7',d:'I→DC'},{l:'Cons.',c:'#6D62D6',d:'I→CAP'}],sections:()=>[FM_sec('antecedent','Ant.','I','HC',4),FM_sec('consequent','Cons.','I','PAC',4)]},
'period-contrasting':{name:'Période contrastante',cat:'Petites formes',desc:'Ant. et cons. avec matériau mélodique différent.',ref:[{l:'Ant.',c:'#534AB7',d:'I→DC'},{l:'Cons.',c:'#6D62D6',d:'I→CAP'}],sections:()=>[FM_sec('antecedent','Ant.','I','HC',4),FM_sec('consequent','Cons.','I','PAC',4)]},
'double-period':{name:'Double période',cat:'Petites formes',desc:'Ant.1→Cons.1 (CAI : cad. auth. imparfaite)→Ant.2→Cons.2 (CAP : cad. auth. parfaite).',ref:[{l:'Ant.1',c:'#534AB7',d:'DC'},{l:'Cons.1',c:'#6D62D6',d:'CAI'},{l:'Ant.2',c:'#534AB7',d:'DC'},{l:'Cons.2',c:'#6D62D6',d:'CAP'}],sections:()=>[FM_sec('antecedent','Ant.1','I','HC',4),FM_sec('consequent','Cons.1','I','IAC',4),FM_sec('antecedent','Ant.2','I','HC',4),FM_sec('consequent','Cons.2','I','PAC',4)]},
'phrase':{name:'Phrase',cat:'Petites formes',desc:'Présentation (i.b.+rép.) → Continuation → cadence.',ref:[{l:'Prés.',c:'#534AB7',d:'i.b.+rép.'},{l:'Cont.',c:'#6D62D6',d:'→cad.'}],sections:()=>[FM_sec('presentation','Prés.','I','none',4,'Idée de base + répétition'),FM_sec('continuation','Cont.','I','PAC',4,'Fragmentation → cadence')]},
'phrase-group':{name:'Groupe de phrases',cat:'Petites formes',desc:'Phrases successives sans relation ant.-cons.',ref:[{l:'Phr.1',c:'#534AB7',d:'I'},{l:'Phr.2',c:'#3B82F6',d:'V'},{l:'Phr.3',c:'#0891B2',d:'I'}],sections:()=>[FM_sec('section-a','Phr.1','I','HC',4),FM_sec('section-b','Phr.2','V','IAC',4),FM_sec('section-a-prime','Phr.3','I','PAC',4)]},
'binary-simple':{name:'Binaire simple',cat:'Petites formes',desc:'‖: A :‖: B :‖',ref:[{l:'‖: A',c:'#8B5CF6',d:'I→V :‖'},{l:'‖: B',c:'#3B82F6',d:'V→I :‖'}],sections:()=>[FM_sec('section-a','A','I','HC',8),FM_sec('section-b','B','V','PAC',8)]},
'binary-rounded':{name:'Binaire arrondie',cat:'Petites formes',desc:"‖: A :‖: B → A' :‖",ref:[{l:'‖: A',c:'#8B5CF6',d:'I→V :‖'},{l:'‖: B',c:'#3B82F6',d:'→dév.'},{l:"A'",c:'#7C3AED',d:'I→CAP :‖'}],sections:()=>[FM_sec('section-a','A','I','HC',8),FM_sec('section-b','B','V','none',4),FM_sec('section-a-prime',"A'",'I','PAC',8)]},
'ternary-simple':{name:'Ternaire simple',cat:'Petites formes',desc:"A–B–A'.",ref:[{l:'A',c:'#8B5CF6',d:'I→CAP'},{l:'B',c:'#3B82F6',d:'V/vi'},{l:"A'",c:'#7C3AED',d:'I→CAP'}],sections:()=>[FM_sec('section-a','A','I','PAC',8),FM_sec('section-b','B','V','HC',8),FM_sec('section-a-prime',"A'",'I','PAC',8)]},
'ternary-composite':{name:'Ternaire composite',cat:'Petites formes',desc:'Chaque section = petite forme interne.',ref:[{l:'A (bin.)',c:'#8B5CF6',d:'I'},{l:'B (bin.)',c:'#3B82F6',d:'IV/V'},{l:'A D.C.',c:'#7C3AED',d:'I'}],sections:()=>[FM_sec('section-a','A','I','PAC',16),FM_sec('section-b','B','IV','PAC',16),FM_sec('section-a-prime','A D.C.','I','PAC',16)]},
'sonata':{name:'Forme sonate',cat:'Grandes formes',desc:'Expo (P–TR–S–C) → Dév. → Réex.',ref:[{l:'P',c:'#534AB7',d:'I'},{l:'TR',c:'#D97706',d:'→V'},{l:'S',c:'#2563EB',d:'V(III)'},{l:'C',c:'#059669',d:'V'},{l:'Dév.',c:'#DC2626',d:'inst.'},{l:'P',c:'#534AB7',d:'I'},{l:'TR',c:'#D97706',d:''},{l:'S',c:'#2563EB',d:'I'},{l:'C',c:'#059669',d:'I'}],sections:()=>[FM_sec('theme-p','P','I','none',12),FM_sec('transition','TR','V','HC',8),FM_sec('theme-s','S','V','PAC',12),FM_sec('closing','C','V','PAC',6),FM_sec('development','Dév.','—','none',20),FM_sec('theme-p','P','I','none',12),FM_sec('transition','TR','I','none',8),FM_sec('theme-s','S','I','PAC',12),FM_sec('closing','C','I','PAC',6)]},
'sonata-intro':{name:'Forme sonate (intro+coda)',cat:'Grandes formes',desc:'Intro lente + Expo + Dév. + Réex. + Coda.',ref:[{l:'Intro',c:'#6B7280',d:'lent'},{l:'P',c:'#534AB7',d:'I'},{l:'TR',c:'#D97706',d:'→V'},{l:'S',c:'#2563EB',d:'V'},{l:'C',c:'#059669',d:'V'},{l:'Dév.',c:'#DC2626',d:'inst.'},{l:'P',c:'#534AB7',d:'I'},{l:'S',c:'#2563EB',d:'I'},{l:'C',c:'#059669',d:'I'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('introduction','Intro','I','none',8),FM_sec('theme-p','P','I','none',12),FM_sec('transition','TR','V','HC',8),FM_sec('theme-s','S','V','PAC',12),FM_sec('closing','C','V','PAC',6),FM_sec('development','Dév.','—','none',20),FM_sec('theme-p','P','I','none',12),FM_sec('transition','TR','I','none',8),FM_sec('theme-s','S','I','PAC',12),FM_sec('closing','C','I','PAC',6),FM_sec('coda','Coda','I','PAC',10)]},
'sonatine':{name:'Sonatine',cat:'Grandes formes',desc:'Expo → Réex. directe (sans dév.).',ref:[{l:'P',c:'#534AB7',d:'I'},{l:'TR',c:'#D97706',d:'→V'},{l:'S',c:'#2563EB',d:'V'},{l:'C',c:'#059669',d:'V'},{l:'RT',c:'#B45309',d:''},{l:'P',c:'#534AB7',d:'I'},{l:'S',c:'#2563EB',d:'I'},{l:'C',c:'#059669',d:'I'}],sections:()=>[FM_sec('theme-p','P','I','none',8),FM_sec('transition','TR','V','HC',6),FM_sec('theme-s','S','V','PAC',8),FM_sec('closing','C','V','PAC',4),FM_sec('retransition','RT','V','HC',4),FM_sec('theme-p','P','I','none',8),FM_sec('transition','TR','I','none',6),FM_sec('theme-s','S','I','PAC',8),FM_sec('closing','C','I','PAC',4)]},
'rondo-5':{name:'Rondo 5 parties (ABACA)',cat:'Grandes formes',desc:'Alternance refrain/couplets.',ref:[{l:'A',c:'#8B5CF6',d:'I'},{l:'B',c:'#3B82F6',d:'V'},{l:'A',c:'#8B5CF6',d:'I'},{l:'C',c:'#0891B2',d:'vi/IV'},{l:'A',c:'#8B5CF6',d:'I'}],sections:()=>[FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','B','V','PAC',8),FM_sec('retransition','RT','V','HC',4),FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','C','vi','PAC',8),FM_sec('retransition','RT','V','HC',4),FM_sec('refrain','A','I','PAC',8)]},
'rondo-7':{name:"Rondo 7 parties (ABACAB'A)",cat:'Grandes formes',desc:"Rondo étendu, B' en I.",ref:[{l:'A',c:'#8B5CF6',d:'I'},{l:'B',c:'#3B82F6',d:'V'},{l:'A',c:'#8B5CF6',d:'I'},{l:'C',c:'#0891B2',d:'vi'},{l:'A',c:'#8B5CF6',d:'I'},{l:"B'",c:'#3B82F6',d:'I'},{l:'A',c:'#8B5CF6',d:'I'}],sections:()=>[FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','B','V','PAC',8),FM_sec('retransition','RT','V','HC',4),FM_sec('refrain','A','I','PAC',8),FM_sec('couplet','C','vi','PAC',8),FM_sec('retransition','RT','V','HC',4),FM_sec('refrain','A','I','PAC',8),FM_sec('couplet',"B'",'I','PAC',8),FM_sec('refrain','A','I','PAC',8)]},
'sonata-rondo':{name:'Sonate-rondo',cat:'Grandes formes',desc:"Hybride : A–B–A–C(dév.)–A–B'(I)–A+Coda.",ref:[{l:'A=P',c:'#8B5CF6',d:'I'},{l:'B=S',c:'#3B82F6',d:'V'},{l:'A',c:'#8B5CF6',d:'I'},{l:'C=Dév.',c:'#DC2626',d:'inst.'},{l:'A',c:'#8B5CF6',d:'I'},{l:"B'",c:'#3B82F6',d:'I'},{l:'A',c:'#8B5CF6',d:'I'}],sections:()=>[FM_sec('refrain','A (P)','I','PAC',8),FM_sec('transition','TR','V','HC',4),FM_sec('couplet','B (S)','V','PAC',8),FM_sec('retransition','RT','V','HC',4),FM_sec('refrain','A','I','PAC',8),FM_sec('development','C (Dév.)','—','none',16),FM_sec('refrain','A','I','PAC',8),FM_sec('transition','TR','I','none',4),FM_sec('couplet',"B' (S)",'I','PAC',8),FM_sec('refrain','A','I','PAC',8),FM_sec('coda','Coda','I','PAC',8)]},
'theme-var':{name:'Thème et variations',cat:'Grandes formes',desc:'Thème + variations numérotées.',ref:[{l:'Thème',c:'#0891B2',d:'I'},{l:'Var.1',c:'#0891B2',d:'I'},{l:'Var.2',c:'#0891B2',d:'i'},{l:'…',c:'#999',d:''},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('theme-var','Thème','I','PAC',8),Object.assign(FM_sec('variation','Var. 1','I','PAC',8),{variationNum:1,variationTech:'Ornementation mélodique'}),Object.assign(FM_sec('variation','Var. 2','i','PAC',8),{variationNum:2,variationTech:'Changement de mode'}),Object.assign(FM_sec('variation','Var. 3','I','PAC',8),{variationNum:3,variationTech:'Variation rythmique'})]},
'minuet-trio':{name:'Menuet et Trio',cat:'Grandes formes',desc:'Menuet→Trio→Menuet D.C.',ref:[{l:'Menuet',c:'#534AB7',d:'I'},{l:'Trio',c:'#2563EB',d:'IV/rel.'},{l:'Men.D.C.',c:'#534AB7',d:'I'}],sections:()=>[FM_sec('menuet','Menuet','I','PAC',16),FM_sec('trio','Trio','IV','PAC',16),FM_sec('menuet-dc','Menuet D.C.','I','PAC',16)]},
'scherzo-trio':{name:'Scherzo et Trio',cat:'Grandes formes',desc:'Scherzo→Trio→Scherzo D.C.',ref:[{l:'Scherzo',c:'#534AB7',d:'I'},{l:'Trio',c:'#2563EB',d:'IV/rel.'},{l:'Sch.D.C.',c:'#534AB7',d:'I'}],sections:()=>[FM_sec('scherzo','Scherzo','I','PAC',16),FM_sec('trio','Trio','IV','PAC',16),FM_sec('scherzo-dc','Scherzo D.C.','I','PAC',16)]},
'through-composed':{name:'Forme continue',cat:'Grandes formes',desc:'Matériau toujours nouveau, pas de reprise.',ref:[{l:'A',c:'#8B5CF6',d:'I'},{l:'B',c:'#3B82F6',d:'V'},{l:'C',c:'#0891B2',d:'vi'},{l:'D',c:'#0D9488',d:'IV'}],sections:()=>[FM_sec('section-a','A','I','HC',8),FM_sec('section-b','B','V','PAC',8),FM_sec('section-c','C','vi','HC',8),FM_sec('section-d','D','I','PAC',8)]},
'concerto-sonata':{name:'Forme concerto',cat:'Grandes formes',desc:'Rit.→Expo solo→Dév.→Réex.→Cadenza→Coda.',ref:[{l:'Rit.',c:'#534AB7',d:'I'},{l:'Expo',c:'#2563EB',d:'I→V'},{l:'Dév.',c:'#DC2626',d:'inst.'},{l:'Réex.',c:'#534AB7',d:'I'},{l:'Cad.',c:'#9333EA',d:''},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('ritornello','Rit. orch.','I','PAC',16),FM_sec('theme-p','P (solo)','I','none',12),FM_sec('transition','TR','V','HC',8),FM_sec('theme-s','S (solo)','V','PAC',12),FM_sec('closing','C','V','PAC',6),FM_sec('development','Dév.','—','none',20),FM_sec('theme-p','P','I','none',12),FM_sec('transition','TR','I','none',8),FM_sec('theme-s','S','I','PAC',12),FM_sec('cadenza','Cadenza','I','none',0),FM_sec('coda','Coda','I','PAC',8)]},
'fugue':{name:'Fugue',cat:'Grandes formes',desc:'Expo→Épisodes→Strettes→Coda.',ref:[{l:'Expo',c:'#534AB7',d:'I→V'},{l:'Ép.1',c:'#7C3AED',d:'mod.'},{l:'Ré-expo',c:'#534AB7',d:'rel.'},{l:'Ép.2',c:'#7C3AED',d:'mod.'},{l:'Strette',c:'#DC2626',d:'I'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('exposition','Exposition','I','none',12),FM_sec('episode','Épisode 1','—','none',8),FM_sec('exposition','Ré-expo','vi','none',8),FM_sec('episode','Épisode 2','—','none',8),FM_sec('development','Strette','I','none',8),FM_sec('coda','Coda','I','PAC',6)]},
'fugue-gedalge-3v':{name:'Fugue d\'école à 3 voix',cat:'Formes contrapuntiques',desc:'S→R→S avec contre-sujet. Dév. modulants. Strette finale.',ref:[{l:'S',c:'#059669',d:'I'},{l:'R',c:'#10B981',d:'V'},{l:'S',c:'#059669',d:'I'},{l:'Div.1',c:'#F59E0B',d:'→V'},{l:'C-Expo',c:'#6366F1',d:'rel.'},{l:'Div.2',c:'#F59E0B',d:'mod.'},{l:'Str.',c:'#DC2626',d:'I'},{l:'Péd.V',c:'#78716C',d:'V'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('subject','S (voix 1)','I','none',4,'Sujet exposé'),FM_sec('answer','R (voix 2)','V','none',4,'Réponse à la dominante'),FM_sec('subject','S (voix 3)','I','none',4,'Sujet, contre-sujet à v.1'),FM_sec('divertissement','Divertissement I','V','HC',6,'Épisode modulant'),FM_sec('counter-exposition','Contre-exposition','vi','none',8,'Facultative, ton relatif'),FM_sec('divertissement','Divertissement II','—','none',8,'Développements modulants'),FM_sec('stretto','Strette','I','none',6,'Entrées en chevauchement'),FM_sec('pedal-dominant','Pédale de dominante','V','HC',4,'Tension harmonique soutenue'),FM_sec('coda','Coda','I','PAC',6,'Conclusion en I')]},
'fugue-gedalge-4v':{name:'Fugue d\'école à 4 voix',cat:'Formes contrapuntiques',desc:'S→R→S→R. Contre-exposition. Strettes multiples.',ref:[{l:'S',c:'#059669',d:'I'},{l:'R',c:'#10B981',d:'V'},{l:'S',c:'#059669',d:'I'},{l:'R',c:'#10B981',d:'V'},{l:'Div.',c:'#F59E0B',d:'mod.'},{l:'C-Expo',c:'#6366F1',d:'rel.'},{l:'Div.',c:'#F59E0B',d:'mod.'},{l:'Str.1',c:'#DC2626',d:'IV'},{l:'Str.2',c:'#DC2626',d:'I'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('subject','S (soprano)','I','none',4),FM_sec('answer','R (alto)','V','none',4),FM_sec('subject','S (ténor)','I','none',4),FM_sec('answer','R (basse)','V','none',4),FM_sec('divertissement','Divertissement I','—','HC',8,'Épisode modulant'),FM_sec('counter-exposition','Contre-exposition','vi','none',12,'En ton relatif, ordre varié'),FM_sec('divertissement','Divertissement II','—','none',10,'Développements modulants'),FM_sec('stretto','Strette I','IV','none',6,'Première strette, ton de sous-dominante'),FM_sec('stretto','Strette II','I','none',8,'Strette finale, ton principal'),FM_sec('coda','Coda','I','PAC',8)]},
'fugue-double':{name:'Fugue double',cat:'Formes contrapuntiques',desc:'Deux sujets distincts S1 et S2. Exposition de chaque sujet, puis réunion.',ref:[{l:'S1',c:'#059669',d:'I'},{l:'R1',c:'#10B981',d:'V'},{l:'Div.',c:'#F59E0B',d:''},{l:'S2',c:'#0891B2',d:'I'},{l:'R2',c:'#06B6D4',d:'V'},{l:'S1+S2',c:'#8B5CF6',d:'I'},{l:'Str.',c:'#DC2626',d:'I'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('subject','S1 (sujet principal)','I','none',4,'Premier sujet'),FM_sec('answer','R1','V','none',4),FM_sec('divertissement','Divertissement I','—','HC',6),FM_sec('countersubject','S2 (second sujet)','I','none',4,'Deuxième sujet, contrasté'),FM_sec('answer','R2','V','none',4),FM_sec('divertissement','Divertissement II','—','none',8),FM_sec('development','Réunion S1+S2','I','none',12,'Les deux sujets combinés'),FM_sec('stretto','Strette finale','I','none',8,'S1 et S2 en strette'),FM_sec('coda','Coda','I','PAC',6)]},
'fugue-renversement':{name:'Fugue par renversement',cat:'Formes contrapuntiques',desc:'Sujet renversé (inversion mélodique). Expo rectus puis inversus.',ref:[{l:'S',c:'#059669',d:'I'},{l:'R',c:'#10B981',d:'V'},{l:'Div.',c:'#F59E0B',d:'mod.'},{l:'S inv.',c:'#7C3AED',d:'I'},{l:'R inv.',c:'#A78BFA',d:'V'},{l:'Str.',c:'#DC2626',d:'I'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('subject','S rectus','I','none',4,'Sujet dans sa forme originale'),FM_sec('answer','R rectus','V','none',4),FM_sec('subject','S rectus','I','none',4),FM_sec('divertissement','Divertissement I','—','HC',8),FM_sec('subject','S inversus','I','none',4,'Sujet renversé (inversion mélodique)'),FM_sec('answer','R inversus','V','none',4),FM_sec('subject','S inversus','I','none',4),FM_sec('divertissement','Divertissement II','—','none',8,'Développements avec les deux formes'),FM_sec('stretto','Strette','I','none',8,'Rectus et inversus combinés'),FM_sec('coda','Coda','I','PAC',6)]},
'fugue-libre':{name:'Fugue libre (style Bach)',cat:'Formes contrapuntiques',desc:'Plan flexible. Épisodes multiples. Liberté formelle.',ref:[{l:'Expo',c:'#534AB7',d:'I→V'},{l:'Ép.1',c:'#F59E0B',d:'mod.'},{l:'Entrée',c:'#059669',d:'rel.'},{l:'Ép.2',c:'#F59E0B',d:'mod.'},{l:'Entrée',c:'#059669',d:'—'},{l:'Ép.3',c:'#F59E0B',d:'mod.'},{l:'Péd.V',c:'#78716C',d:'V'},{l:'Coda',c:'#047857',d:'I'}],sections:()=>[FM_sec('exposition','Exposition','I','none',12,'S→R→S ou S→R→S→R selon nombre de voix'),FM_sec('divertissement','Épisode I','V','HC',8,'Modulant vers dominante'),FM_sec('subject','Entrée S ou R','vi','none',4,'Ton relatif'),FM_sec('divertissement','Épisode II','—','none',10,'Développements modulants libres'),FM_sec('subject','Entrée S ou R','IV','none',4,'Sous-dominante ou autre ton'),FM_sec('divertissement','Épisode III','—','none',10,'Retour progressif vers I'),FM_sec('pedal-dominant','Pédale de dominante','V','HC',6,'Tension finale'),FM_sec('coda','Coda','I','PAC',8,'Affirmation de la tonique')]},
};

const FM_MULTI_FORMS={
'symphonie-classique':{name:'Symphonie classique',cat:'Formes à mouvements multiples',desc:'4 mvts : Allegro (sonate), lent, Menuet et Trio, Finale.',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'sonata',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['sonata'].sections()},
  {id:FM_uid(),name:'Andante',formId:'ternary-simple',key:'Fa',mode:'major',tempo:'Andante',sections:FM_FORMS['ternary-simple'].sections()},
  {id:FM_uid(),name:'Menuet et Trio',formId:'minuet-trio',key:'',mode:'',tempo:'Allegretto',sections:FM_FORMS['minuet-trio'].sections()},
  {id:FM_uid(),name:'Finale',formId:'rondo-7',key:'',mode:'',tempo:'Presto',sections:FM_FORMS['rondo-7'].sections()}]},
'symphonie-romantique':{name:'Symphonie romantique',cat:'Formes à mouvements multiples',desc:'4 mvts : Allegro (sonate+intro), Adagio, Scherzo, Finale.',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'sonata-intro',key:'',mode:'',tempo:'Allegro ma non troppo',sections:FM_FORMS['sonata-intro'].sections()},
  {id:FM_uid(),name:'Adagio',formId:'theme-var',key:'',mode:'',tempo:'Adagio',sections:FM_FORMS['theme-var'].sections()},
  {id:FM_uid(),name:'Scherzo et Trio',formId:'scherzo-trio',key:'',mode:'',tempo:'Allegro vivace',sections:FM_FORMS['scherzo-trio'].sections()},
  {id:FM_uid(),name:'Finale',formId:'sonata-rondo',key:'',mode:'',tempo:'Allegro con fuoco',sections:FM_FORMS['sonata-rondo'].sections()}]},
'concerto':{name:'Concerto (3 mvts)',cat:'Formes à mouvements multiples',desc:'3 mvts : Allegro (concerto), lent, Finale (rondo).',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'concerto-sonata',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['concerto-sonata'].sections()},
  {id:FM_uid(),name:'Andante',formId:'ternary-simple',key:'Fa',mode:'major',tempo:'Andante',sections:FM_FORMS['ternary-simple'].sections()},
  {id:FM_uid(),name:'Finale',formId:'rondo-5',key:'',mode:'',tempo:'Allegro vivace',sections:FM_FORMS['rondo-5'].sections()}]},
'poeme-symphonique':{name:'Poème symphonique',cat:'Formes à mouvements multiples',desc:'1+ parties enchaînées, forme libre. Ajoutez selon le programme.',movements:()=>[
  {id:FM_uid(),name:'Partie I',formId:'sonata',key:'',mode:'',tempo:'',sections:FM_FORMS['sonata'].sections()}]},
'suite':{name:'Suite',cat:'Formes à mouvements multiples',desc:'Succession de danses/mouvements de caractère.',movements:()=>[
  {id:FM_uid(),name:'Prélude',formId:'through-composed',key:'',mode:'',tempo:'',sections:FM_FORMS['through-composed'].sections()},
  {id:FM_uid(),name:'Allemande',formId:'binary-rounded',key:'',mode:'',tempo:'Moderato',sections:FM_FORMS['binary-rounded'].sections()},
  {id:FM_uid(),name:'Courante',formId:'binary-rounded',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['binary-rounded'].sections()},
  {id:FM_uid(),name:'Sarabande',formId:'binary-rounded',key:'',mode:'',tempo:'Lento',sections:FM_FORMS['binary-rounded'].sections()},
  {id:FM_uid(),name:'Gigue',formId:'binary-rounded',key:'',mode:'',tempo:'Vivace',sections:FM_FORMS['binary-rounded'].sections()}]},
'brahms-sym1':{name:'Symphonie (Brahms n°1)',cat:'Formes à mouvements multiples',desc:'4 mvts romantiques : Un poco sostenuto–Allegro, Andante, Un poco allegretto, Adagio–Allegro.',movements:()=>[
  {id:FM_uid(),name:'I. Un poco sostenuto – Allegro',formId:'sonata-intro',key:'Do',mode:'minor',tempo:'Un poco sostenuto – Allegro',sections:[FM_sec('introduction','Intro','i','none',37,'Chromatisme ascendant, timbales'),FM_sec('theme-p','P','i','none',38,'Thème passionné'),FM_sec('transition','TR','III','HC',20),FM_sec('theme-s','S','III','PAC',30),FM_sec('closing','C','III','PAC',10),FM_sec('development','Dév.','—','none',60),FM_sec('theme-p','P','i','none',38),FM_sec('transition','TR','i','none',20),FM_sec('theme-s','S','i','PAC',30),FM_sec('coda','Coda','i','PAC',20)]},
  {id:FM_uid(),name:'II. Andante sostenuto',formId:'ternary-simple',key:'Mi',mode:'major',tempo:'Andante sostenuto',sections:[FM_sec('section-a','A','I','PAC',16),FM_sec('section-b','B','V','HC',16),FM_sec('section-a-prime',"A'",'I','PAC',16,'Violon solo, hautbois')]},
  {id:FM_uid(),name:'III. Un poco allegretto e grazioso',formId:'ternary-composite',key:'La♭',mode:'major',tempo:'Un poco allegretto',sections:[FM_sec('section-a','A (Clarinette)','I','PAC',16),FM_sec('section-b','B','vi','PAC',16),FM_sec('section-a-prime',"A'",'I','PAC',16)]},
  {id:FM_uid(),name:'IV. Adagio – Allegro non troppo',formId:'sonata-intro',key:'Do',mode:'minor',tempo:'Adagio – Allegro',sections:[FM_sec('introduction','Intro (Adagio)','i','none',30,'Alphorn + Chorale de trombones'),FM_sec('theme-p','P (Allegro)','I','none',20,'Thème héroïque en Do majeur'),FM_sec('transition','TR','V','HC',12),FM_sec('theme-s','S','V','PAC',16),FM_sec('closing','C','V','PAC',8),FM_sec('development','Dév.','—','none',40),FM_sec('theme-p','P','I','none',20),FM_sec('transition','TR','I','none',12),FM_sec('theme-s','S','I','PAC',16),FM_sec('closing','C','I','PAC',8),FM_sec('coda','Coda','I','PAC',30,'Retour du chorale')]}]},
'quatuor':{name:'Quatuor à cordes',cat:'Formes à mouvements multiples',desc:'4 mvts : Allegro, lent, Menuet/Scherzo, Finale.',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'sonata',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['sonata'].sections()},
  {id:FM_uid(),name:'Adagio',formId:'ternary-simple',key:'',mode:'',tempo:'Adagio',sections:FM_FORMS['ternary-simple'].sections()},
  {id:FM_uid(),name:'Menuet et Trio',formId:'minuet-trio',key:'',mode:'',tempo:'Allegretto',sections:FM_FORMS['minuet-trio'].sections()},
  {id:FM_uid(),name:'Finale',formId:'sonata-rondo',key:'',mode:'',tempo:'Presto',sections:FM_FORMS['sonata-rondo'].sections()}]},

'cantate':{name:'Cantate',cat:'Formes à mouvements multiples',desc:'Enchaînement de récitatifs, airs, chœurs.',movements:()=>[
  {id:FM_uid(),name:'Ouverture',formId:'through-composed',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['through-composed'].sections()},
  {id:FM_uid(),name:'Récitatif & Air',formId:'ternary-simple',key:'',mode:'',tempo:'',sections:FM_FORMS['ternary-simple'].sections()},
  {id:FM_uid(),name:'Chœur final',formId:'fugue',key:'',mode:'',tempo:'',sections:FM_FORMS['fugue'].sections()}]},
'trio-piano':{name:'Trio avec piano',cat:'Formes à mouvements multiples',desc:'3–4 mvts pour piano, violon, violoncelle.',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'sonata',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['sonata'].sections()},
  {id:FM_uid(),name:'Scherzo',formId:'scherzo-trio',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['scherzo-trio'].sections()},
  {id:FM_uid(),name:'Andante',formId:'theme-var',key:'',mode:'',tempo:'Andante cantabile',sections:FM_FORMS['theme-var'].sections()},
  {id:FM_uid(),name:'Finale',formId:'rondo-7',key:'',mode:'',tempo:'Allegro moderato',sections:FM_FORMS['rondo-7'].sections()}]},
'sonate-solo':{name:'Sonate (solo/duo)',cat:'Formes à mouvements multiples',desc:'3 mvts pour instrument solo ou duo.',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'sonata',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['sonata'].sections()},
  {id:FM_uid(),name:'Andante',formId:'ternary-simple',key:'Fa',mode:'major',tempo:'Andante',sections:FM_FORMS['ternary-simple'].sections()},
  {id:FM_uid(),name:'Finale',formId:'rondo-5',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['rondo-5'].sections()}]},
'symphonie-concertante':{name:'Symphonie concertante',cat:'Formes à mouvements multiples',desc:'2-3 mvts, hybride symphonie/concerto avec plusieurs solistes.',movements:()=>[
  {id:FM_uid(),name:'Allegro',formId:'sonata',key:'',mode:'',tempo:'Allegro',sections:FM_FORMS['sonata'].sections()},
  {id:FM_uid(),name:'Andante',formId:'ternary-simple',key:'',mode:'',tempo:'Andante',sections:FM_FORMS['ternary-simple'].sections()},
  {id:FM_uid(),name:'Finale',formId:'rondo-7',key:'',mode:'',tempo:'Presto',sections:FM_FORMS['rondo-7'].sections()}]},
'requiem':{name:'Requiem',cat:'Formes à mouvements multiples',desc:'Messe des morts : Introitus, Kyrie, Dies Irae, Offertoire, Sanctus, Agnus Dei, Lux Aeterna.',movements:()=>[
  {id:FM_uid(),name:'Introitus (Requiem aeternam)',formId:'through-composed',key:'',mode:'minor',tempo:'Adagio',sections:[FM_sec('choeur','Requiem aeternam','i','PAC',16,'Chœur, ton principal mineur'),FM_sec('section-a','Te decet hymnus','I','PAC',8),FM_sec('choeur','Requiem aeternam','i','PAC',8,'Reprise')]},
  {id:FM_uid(),name:'Kyrie',formId:'ternary-simple',key:'',mode:'minor',tempo:'Andante',sections:[FM_sec('choeur','Kyrie eleison','i','HC',8),FM_sec('choeur','Christe eleison','III','PAC',8),FM_sec('choeur','Kyrie eleison','i','PAC',8)]},
  {id:FM_uid(),name:'Dies Irae (Sequentia)',formId:'through-composed',key:'',mode:'minor',tempo:'Allegro',sections:[FM_sec('choeur','Dies irae','i','none',12,'Terrifiant, puissant'),FM_sec('aria','Tuba mirum','V','PAC',10,'Solo ou quatuor'),FM_sec('choeur','Rex tremendae','i','HC',8),FM_sec('duo-vocal','Recordare','III','PAC',10),FM_sec('aria','Ingemisco','iv','PAC',8),FM_sec('choeur','Confutatis','i','HC',8),FM_sec('choeur','Lacrimosa','i','PAC',12,'Point culminant émotionnel')]},
  {id:FM_uid(),name:'Offertoire (Domine Jesu)',formId:'through-composed',key:'',mode:'minor',tempo:'Andante',sections:[FM_sec('choeur','Domine Jesu Christe','i','HC',10),FM_sec('ensemble-vocal','Hostias','IV','PAC',8),FM_sec('choeur','Quam olim Abrahae','i','PAC',8,'Fugue')]},
  {id:FM_uid(),name:'Sanctus',formId:'ternary-simple',key:'',mode:'major',tempo:'Adagio',sections:[FM_sec('choeur','Sanctus','I','PAC',8,'Majestueux'),FM_sec('choeur','Hosanna','I','PAC',6,'Fugué, vif')]},
  {id:FM_uid(),name:'Agnus Dei',formId:'through-composed',key:'',mode:'minor',tempo:'Adagio',sections:[FM_sec('choeur','Agnus Dei','i','HC',10),FM_sec('choeur','Dona eis requiem','i','PAC',8),FM_sec('choeur','Lux aeterna','I','PAC',10,'Passage en majeur')]},
  {id:FM_uid(),name:'Libera Me',formId:'through-composed',key:'',mode:'minor',tempo:'Moderato',sections:[FM_sec('aria','Libera me','i','HC',8,'Solo soprano ou baryton'),FM_sec('choeur','Dies irae (rappel)','i','none',6),FM_sec('choeur','Libera me','i','PAC',10)]},
  {id:FM_uid(),name:'In Paradisum',formId:'through-composed',key:'',mode:'major',tempo:'Andante',sections:[FM_sec('choeur','In paradisum','I','PAC',10,'Éthéré, lumineux')]}]},
'cantate':{name:'Cantate',cat:'Formes à mouvements multiples',desc:'Œuvre vocale en plusieurs mouvements : chœurs, arias, récitatifs, choral final.',movements:()=>[
  {id:FM_uid(),name:'Chœur d\'ouverture',formId:'through-composed',key:'',mode:'',tempo:'Allegro',sections:[FM_sec('choeur','Chœur','I','PAC',20,'Chœur à 4 voix avec orchestre')]},
  {id:FM_uid(),name:'Récitatif I',formId:'through-composed',key:'',mode:'',tempo:'',sections:[FM_sec('recitatif','Récitatif','I','HC',4,'Secco ou accompagné')]},
  {id:FM_uid(),name:'Aria I',formId:'ternary-simple',key:'',mode:'',tempo:'Andante',sections:[FM_sec('aria','A','I','PAC',8),FM_sec('aria','B','V','HC',8),FM_sec('aria','A (da capo)','I','PAC',8)]},
  {id:FM_uid(),name:'Récitatif II',formId:'through-composed',key:'',mode:'',tempo:'',sections:[FM_sec('recitatif','Récitatif','I','HC',4)]},
  {id:FM_uid(),name:'Aria II / Duo',formId:'ternary-simple',key:'',mode:'',tempo:'',sections:[FM_sec('duo-vocal','A','I','PAC',8),FM_sec('duo-vocal','B','IV','HC',8),FM_sec('duo-vocal','A\'','I','PAC',8)]},
  {id:FM_uid(),name:'Choral final',formId:'through-composed',key:'',mode:'',tempo:'',sections:[FM_sec('choral','Choral','I','PAC',8,'Harmonisation à 4 voix, congrégation')]}]},
'opera':{name:'Opéra',cat:'Formes à mouvements multiples',desc:'Ouverture + Actes. Chaque acte = mouvement avec arias, récitatifs, ensembles, chœurs.',movements:()=>[
  {id:FM_uid(),name:'Ouverture',formId:'sonata',key:'',mode:'',tempo:'Allegro',sections:[FM_sec('ouverture','Ouverture','I','none',12,'Forme sonate ou pot-pourri de thèmes'),FM_sec('transition','Transition vers Acte I','I','HC',4)]},
  {id:FM_uid(),name:'Acte I',formId:'through-composed',key:'',mode:'',tempo:'',sections:[FM_sec('recitatif','Réc. d\'introduction','I','none',4,'Mise en place dramatique'),FM_sec('aria','Air d\'entrée','I','PAC',10,'Présentation du personnage principal'),FM_sec('recitatif','Récitatif','V','HC',4),FM_sec('duo-vocal','Duo','V','PAC',10),FM_sec('recitatif','Récitatif','vi','none',4),FM_sec('choeur','Finale Acte I','I','PAC',12,'Ensemble + chœur')]},
  {id:FM_uid(),name:'Acte II',formId:'through-composed',key:'',mode:'',tempo:'',sections:[FM_sec('recitatif','Récitatif','I','none',4),FM_sec('aria','Aria','iv','PAC',10,'Conflit dramatique'),FM_sec('recitatif','Récitatif','vi','HC',4),FM_sec('ensemble-vocal','Ensemble','V','PAC',10),FM_sec('aria','Aria','I','PAC',10),FM_sec('choeur','Finale Acte II','I','PAC',14,'Point culminant dramatique')]},
  {id:FM_uid(),name:'Acte III',formId:'through-composed',key:'',mode:'',tempo:'',sections:[FM_sec('recitatif','Récitatif','I','none',4),FM_sec('aria','Aria de résolution','I','PAC',10),FM_sec('duo-vocal','Duo final','I','PAC',8),FM_sec('choeur','Chœur final','I','PAC',12,'Dénouement')]}]},
};

// STATE
let FM_state={name:(typeof currentLang!=='undefined'&&currentLang==='en')?'My Work':(typeof currentLang!=='undefined'&&currentLang==='es')?'Mi obra':'Mon œuvre',formId:'sonata',globalKey:'Do',globalMode:'major',isMultiMovement:false,sections:[],movements:[],activeMovementIdx:0,selectedId:null,showRef:false,orchestration:[],orchMode:'global',includeTonalPlanInPDF:false};
let FM_nextVarNum=4,dragSrcIdx=null;
// Undo/Redo
let FM_history=[],FM_historyIdx=-1;
function FM_saveHistory(){const state=JSON.stringify({sections:FM_curSections(),movements:FM_state.movements});if(FM_historyIdx<FM_history.length-1)FM_history=FM_history.slice(0,FM_historyIdx+1);FM_history.push(state);if(FM_history.length>50)FM_history.shift();else FM_historyIdx++;if(FM_historyIdx>=50)FM_historyIdx=49}
function FM_undo(){if(FM_historyIdx<=0)return;FM_historyIdx--;const state=JSON.parse(FM_history[FM_historyIdx]);FM_state.sections=state.sections;FM_state.movements=state.movements;FM_render();FM_showToast('↶ Annulé')}
function FM_redo(){if(FM_historyIdx>=FM_history.length-1)return;FM_historyIdx++;const state=JSON.parse(FM_history[FM_historyIdx]);FM_state.sections=state.sections;FM_state.movements=state.movements;FM_render();FM_showToast('↷ Refait')}
// Templates
function FM_getTemplates(){return JSON.parse(localStorage.getItem('contrepoint-forme-templates')||'[]')}
function FM_putTemplates(t){localStorage.setItem('contrepoint-forme-templates',JSON.stringify(t))}
function FM_saveAsTemplate(){const name=prompt(tx('Nom du template :','Template name:','Nombre de la plantilla:'),FM_state.name+' (template)');if(!name)return;const t=FM_getTemplates();t.push({name,formId:FM_state.formId,sections:FM_curSections(),date:new Date().toISOString()});FM_putTemplates(t);FM_showToast('Template sauvegardé ✓')}
function FM_loadTemplate(idx){const t=FM_getTemplates()[idx];if(!t)return;if(!confirm(tx('Charger ce template ?','Load this template?','¿Cargar esta plantilla?')))return;FM_state.formId=t.formId;FM_state.sections=t.sections;FM_state.isMultiMovement=false;FM_state.movements=[];FM_state.selectedId=null;FM_render();FM_showToast('Template chargé')}
function FM_delTemplate(idx){if(!confirm(tx('Supprimer ce template ?','Delete this template?','¿Eliminar esta plantilla?')))return;const t=FM_getTemplates();t.splice(idx,1);FM_putTemplates(t);FM_showToast('Template supprimé');if(document.getElementById('fm_templatesModal').classList.contains('show'))FM_showTemplates()}
function FM_showTemplates(){const t=FM_getTemplates();let h='';if(t.length===0)h='<div style="padding:20px;text-align:center;color:var(--txt3)">'+(tx('Aucun template enregistré.','No saved templates.','Sin plantillas guardadas.'))+'</div>';else t.forEach((tp,i)=>{h+='<div class="save-item"><div><b>'+FM_esc(tp.name)+'</b><div style="font-size:10px;color:var(--txt3)">'+FM_FORMS[tp.formId]?.name+' · '+(tp.sections?.length||0)+' sections · '+new Date(tp.date).toLocaleDateString()+'</div></div><div><button class="tbtn sm" onclick="FM_loadTemplate('+i+')">'+(tx('Charger','Load','Cargar'))+'</button> <button class="tbtn sm danger" onclick="FM_delTemplate('+i+')">'+(tx('Supprimer','Delete','Eliminar'))+'</button></div></div>'});document.getElementById('fm_templatesContent').innerHTML=h;document.getElementById('fm_templatesModal').classList.add('show')}
// Mode présentation
function FM_togglePresentation(){const p=document.getElementById('panFormes');p.classList.toggle('fm-presentation');if(p.classList.contains('fm-presentation')){FM_showToast('Mode présentation (ESC pour quitter)');document.addEventListener('keydown',FM_exitPresentation)}else document.removeEventListener('keydown',FM_exitPresentation)}
function FM_exitPresentation(e){if(e.key==='Escape'){document.getElementById('panFormes').classList.remove('fm-presentation');document.removeEventListener('keydown',FM_exitPresentation)}}
function FM_uid(){return'S'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function FM_curSections(){if(FM_state.isMultiMovement){const m=FM_state.movements[FM_state.activeMovementIdx];return m?m.sections:[]}return FM_state.sections}
function FM_setCurSections(s){if(FM_state.isMultiMovement)FM_state.movements[FM_state.activeMovementIdx].sections=s;else FM_state.sections=s}
function FM_curFormId(){if(FM_state.isMultiMovement){const m=FM_state.movements[FM_state.activeMovementIdx];return m?m.formId:'sonata'}return FM_state.formId}
function FM_curMode(){if(FM_state.isMultiMovement){const m=FM_state.movements[FM_state.activeMovementIdx];return(m&&m.mode)?m.mode:FM_state.globalMode}return FM_state.globalMode}

function FM_init(){
  const ksel=document.getElementById('fm_globalKey');
  ksel.innerHTML=fmKeys().map(function(k,i){return '<option value="'+FM_KEYS_FR[i]+'">'+k+'</option>'}).join('');
  ksel.value=FM_state.globalKey;ksel.onchange=()=>{FM_state.globalKey=ksel.value;FM_render()};
  document.getElementById('fm_globalMode').onchange=(e)=>{FM_state.globalMode=e.target.value;FM_render()};
  document.getElementById('fm_projName').value=FM_state.name;
  document.getElementById('fm_projName').oninput=(e)=>{FM_state.name=e.target.value};
  FM_changeForm('sonata');
}

function FM_changeForm(formId){
  FM_state.formId=formId;FM_state.selectedId=null;FM_state.activeMovementIdx=0;
  if(FM_MULTI_FORMS[formId]){FM_state.isMultiMovement=true;FM_state.movements=FM_MULTI_FORMS[formId].movements();FM_state.sections=[]}
  else if(FM_FORMS[formId]){FM_state.isMultiMovement=false;FM_state.movements=[];FM_state.sections=FM_FORMS[formId].sections()}
  FM_nextVarNum=FM_curSections().filter(s=>s.type==='variation').length+1;
  FM_render();
}

function FM_render(){FM_renderFormHeader();FM_renderMovementBar();FM_renderTimeline();FM_renderRef();FM_renderDetail();FM_renderAlerts()}

function FM_renderFormHeader(){
  let h='<select class="form-sel" onchange="FM_changeForm(this.value)">';
  const sc=[...new Set(Object.values(FM_FORMS).map(f=>f.cat))];
  sc.forEach(c=>{h+='<optgroup label="'+tFM(c)+'">';Object.entries(FM_FORMS).filter(([,f])=>f.cat===c).forEach(([id,f])=>{h+='<option value="'+id+'"'+(id===FM_state.formId?' selected':'')+'>'+tFM(f.name)+'</option>'});h+='</optgroup>'});
  const mc=[...new Set(Object.values(FM_MULTI_FORMS).map(f=>f.cat))];
  mc.forEach(c=>{h+='<optgroup label="'+tFM(c)+'">';Object.entries(FM_MULTI_FORMS).filter(([,f])=>f.cat===c).forEach(([id,f])=>{h+='<option value="'+id+'"'+(id===FM_state.formId?' selected':'')+'>'+tFM(f.name)+'</option>'});h+='</optgroup>'});
  h+='</select>';
  const fo=FM_FORMS[FM_state.formId]||FM_MULTI_FORMS[FM_state.formId];
  const secs=FM_curSections(),total=secs.reduce((a,s)=>a+(parseInt(s.measures)||0),0);
  let gt='';
  if(FM_state.isMultiMovement){const t=FM_state.movements.reduce((a,m)=>a+m.sections.reduce((b,s)=>b+(parseInt(s.measures)||0),0),0);gt=' <span class="measures-total" style="margin-left:4px;opacity:.6">'+t+(tx(' m. total',' b. total',' c. total'))+'</span>'}
  // Repertoire button - check if examples exist for current form
  const curFid=FM_state.isMultiMovement?FM_curFormId():FM_state.formId;
  const dictBtn='<button class="tbtn fm-dict-trigger" onclick="FM_openDict()" style="flex-shrink:0" title="'+(currentLang==='en'?'Orchestral dictionary':currentLang==='es'?'Diccionario orquestal':'Dictionnaire orchestral')+'"><span data-i18n="fm_dict_btn">📖 '+(currentLang==='en'?'Dictionary':currentLang==='es'?'Diccionario':'Dictionnaire')+'</span></button>';
  const repBtn='<button class="tbtn sm" onclick="FM_showRepertoire()" style="flex-shrink:0" title="Exemples du répertoire">🎼 Exemples</button>';
  document.getElementById('fm_formHeader').innerHTML=h+'<span class="form-desc">'+(fo?tFM(fo.desc):'')+'</span>'+dictBtn+repBtn+(total?'<span class="measures-total">'+total+(tx(' mesures',' bars',' compases'))+'</span>':'')+gt;
}

function FM_renderMovementBar(){
  const bar=document.getElementById('fm_mvtBar');
  if(!FM_state.isMultiMovement){bar.classList.remove('visible');return}
  bar.classList.add('visible');
  let h='';
  FM_state.movements.forEach((m,i)=>{
    const active=i===FM_state.activeMovementIdx?'active':'';
    const mKey=m.key||FM_state.globalKey,mMode=m.mode||FM_state.globalMode;
    const mt=m.sections.reduce((a,s)=>a+(parseInt(s.measures)||0),0);
    const fn=FM_FORMS[m.formId]?.name||m.formId;
    h+='<div class="mvt-card '+active+'" onclick="FM_selectMovement('+i+')"><div class="mvt-num">'+t("fm_mv")+' '+(FM_ROMAN[i]||i+1)+'</div><div class="mvt-name">'+FM_esc(m.name)+'</div><div class="mvt-meta"><span><b>'+fn+'</b></span><span>'+fmKey(mKey)+' '+(mMode==='major'?'M':'m')+'</span>'+(mt?'<span>'+mt+(tx(' m.',' b.',' c.'))+'</span>':'')+(m.tempo?'<span>'+FM_esc(m.tempo)+'</span>':'')+'</div><button class="mvt-del" onclick="event.stopPropagation();FM_delMovement('+i+')" title="'+(tx('Supprimer','Delete','Eliminar'))+'">✕</button></div>';
  });
  h+='<button class="mvt-add" onclick="FM_openAddMvtModal()" title="Ajouter un mouvement">+</button>';
  document.getElementById('fm_mvtRow').innerHTML=h;
}

function FM_sColor(s){return s.customColor||FM_typeMap[s.type]?.color||'#6B7280'}

// ═══ TEMPO BPM MAPPING & DURÉE ═══
const FM_TEMPO_BPM = {
  'Larghissimo': 22, 'Grave': 35, 'Largo': 50, 'Lento': 52, 
  'Larghetto': 63, 'Sostenuto': 63, 'Adagio': 71, 'Adagietto': 74,
  'Andante': 92, 'Andantino': 94, 'Maestoso': 86, 'Comodo': 88,
  'Marcia moderato': 84, 'Tempo di Valse': 90, 'Andante moderato': 102,
  'Tempo di Marcia': 110, 'Tempo di Minuetto': 110, 'Moderato': 114,
  'Allegretto': 116, 'Allegro moderato': 118, 'Allegro': 132,
  'Allegro con brio': 144, 'Allegro con fuoco': 150, 'Allegro vivace': 160,
  'Vivace': 172, 'Vivacissimo': 174, 'Allegrissimo': 174, 'Presto': 184,
  'Prestissimo': 200
};

function FM_getTempoBPM(tempoStr) {
  if (!tempoStr) return 100; // défaut
  // Extrait nombre si présent (ex: "Allegro ♩=132")
  const numMatch = tempoStr.match(/\d+/);
  if (numMatch) return parseInt(numMatch[0]);
  // Sinon cherche dans mapping
  for (let [key, bpm] of Object.entries(FM_TEMPO_BPM)) {
    if (tempoStr.includes(key)) return bpm;
  }
  return 100; // défaut si non reconnu
}

function FM_estimateSectionDuration(section, globalTempo) {
  const measures = parseInt(section.measures) || 0;
  if (measures === 0) return 0;
  
  const tempo = section.tempo || globalTempo || '';
  const bpm = FM_getTempoBPM(tempo);
  
  // Parse time signature (défaut 4/4)
  const ts = section.timeSignature || '4/4';
  const [num, denom] = ts.split('/').map(n => parseInt(n) || 4);
  
  const beatsPerMeasure = num;
  const beatUnitFactor = 4 / denom; // noire=1, blanche=2, croche=0.5
  
  return measures * beatsPerMeasure * beatUnitFactor * (60 / bpm);
}

function FM_formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function FM_renderTimeline(){
  const tl=document.getElementById('fm_timeline'),secs=FM_curSections();let h='';
  const total=secs.reduce((a,s)=>a+(parseInt(s.measures)||1),0);
  const minW=70,maxW=220,baseW=900;
  
  // Calcul durée totale
  const globalTempo = FM_state.isMultiMovement 
    ? (FM_state.movements[FM_state.activeMovementIdx]?.tempo || '')
    : '';
  let totalDuration = 0;
  const durations = secs.map(s => {
    const d = FM_estimateSectionDuration(s, globalTempo);
    totalDuration += d;
    return d;
  });
  
  secs.forEach((s,i)=>{const col=FM_sColor(s),sel=s.id===FM_state.selectedId?'selected':'';
    const tDef=FM_typeMap[s.type];
    if(tDef&&tDef.isMarker){
      // Marqueur ponctuel sans durée (ex. Medial Caesura) — rendu en fine bande verticale
      h+='<div class="tl-block tl-marker '+sel+'" style="color:'+col+';background:repeating-linear-gradient(45deg,'+col+'33 0px,'+col+'33 4px,#fff 4px,#fff 9px)" data-idx="'+i+'" draggable="true" onclick="FM_selectSection(\''+s.id+'\')" ondragstart="FM_dStart(event,'+i+')" ondragover="FM_dOver(event)" ondragenter="FM_dEnter(event,this)" ondragleave="FM_dLeave(event,this)" ondrop="FM_dDrop(event,'+i+')" ondragend="FM_dEnd(event)" title="'+FM_esc(tDef.label)+'"><span class="tl-marker-label">'+FM_esc(tDef.short)+'</span><button class="blk-del" onclick="event.stopPropagation();delSection('+i+')" title="Supprimer">✕</button></div>';
    } else {
      const m=parseInt(s.measures)||1;const w=Math.max(minW,Math.min(maxW,Math.round((m/total)*baseW)));
      h+='<div class="tl-block '+sel+'" style="min-width:'+w+'px;max-width:'+w+'px" data-idx="'+i+'" draggable="true" onclick="FM_selectSection(\''+s.id+'\')" ondragstart="FM_dStart(event,'+i+')" ondragover="FM_dOver(event)" ondragenter="FM_dEnter(event,this)" ondragleave="FM_dLeave(event,this)" ondrop="FM_dDrop(event,'+i+')" ondragend="FM_dEnd(event)"><div class="type-bar" style="background:'+col+'"></div><div class="blk-label">'+FM_esc(s.label)+'</div><div class="blk-degree">'+FM_esc(s.degree)+'</div><div class="blk-info">'+(s.cadence&&s.cadence!=='none'?'<span>'+FM_cadShort(s.cadence)+'</span>':'')+(s.measures?'<span>'+s.measures+(tx(' m.',' b.',' c.'))+'</span>':'')+'</div><button class="blk-del" onclick="event.stopPropagation();delSection('+i+')" title="Supprimer">✕</button></div>';
    }
    if(i<secs.length-1)h+='<div class="tl-arrow">→</div>';
  });
  h+='<button class="tl-add" onclick="FM_openAddModal()" title="Ajouter une section">+</button>';
  
  // Barre de proportions si durée calculable
  if (totalDuration > 0) {
    h += '<div class="fm-proportions-bar">';
    secs.forEach((s, i) => {
      const pct = ((durations[i] / totalDuration) * 100).toFixed(1);
      if (durations[i] > 0) {
        const col = FM_sColor(s);
        h += '<div class="fm-prop-segment" style="width:'+pct+'%;background:'+col+'33;border-left:2px solid '+col+'" title="'+FM_esc(s.label)+' — '+pct+'% ('+FM_formatDuration(durations[i])+')">';
        if (parseFloat(pct) > 6) h += '<span>'+pct+'%</span>';
        h += '</div>';
      }
    });
    h += '</div>';
    h += '<div class="fm-total-duration">⏱ ' + tx('Durée totale estimée','Estimated total duration','Duración total estimada') + ' : <strong>' + FM_formatDuration(totalDuration) + '</strong> <span class="fm-estimation-label">('+tx('estimation','estimate','estimación')+')</span></div>';
  }
  
  tl.innerHTML=h;
  FM_renderTonalPlan();
}

// ═══ PLAN TONAL (RUBAN) ═══
const FM_KEY_POSITIONS = {
  // Positions sur cercle des quintes (0 = Do/La mineur)
  'Do':0,'C':0, 'Sol':1,'G':1, 'Ré':2,'D':2, 'La':3,'A':3, 'Mi':4,'E':4, 'Si':5,'B':5,
  'Fa#':6,'F#':6,'Gb':6,'Solb':6, 'Réb':-5,'Db':-5, 'Lab':-4,'Ab':-4, 
  'Mib':-3,'Eb':-3, 'Sib':-2,'Bb':-2, 'Fa':-1,'F':-1
};

function FM_getKeyPosition(degree, globalKey, globalMode) {
  if (!degree || degree === '—') return null;
  
  // Cas degré romain (I, V, vi, III, etc.)
  const romanMap = {
    'I':0,'i':0, 'II':2,'ii':2, 'III':4,'iii':4, 'IV':5,'iv':5,
    'V':7,'v':7, 'VI':9,'vi':9, 'VII':11,'vii':11,
    'bII':1,'bVI':8,'bVII':10,'#IV':6,'#I':1
  };
  
  const basePos = FM_KEY_POSITIONS[globalKey] || 0;
  
  // Si degré chiffré romain
  if (romanMap[degree] !== undefined) {
    const steps = romanMap[degree];
    return basePos + Math.floor(steps / 12 * 7); // Conversion approximative
  }
  
  // Si tonalité absolue (ex: "Fa", "Lab")
  if (FM_KEY_POSITIONS[degree] !== undefined) {
    return FM_KEY_POSITIONS[degree];
  }
  
  return basePos;
}

function FM_renderTonalPlan() {
  const container = document.getElementById('fm_tonalPlan');
  const secs = FM_curSections();
  
  if (secs.length < 2) {
    container.innerHTML = '';
    return;
  }
  
  const globalKey = FM_state.isMultiMovement 
    ? (FM_state.movements[FM_state.activeMovementIdx]?.key || FM_state.globalKey)
    : FM_state.globalKey;
  const globalMode = FM_curMode();
  
  // Header avec checkbox PDF
  let h = '<div class="tonal-plan-header">';
  h += '<span>' + tx('Plan tonal','Tonal plan','Plan tonal') + '</span>';
  h += '<label style="font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;cursor:pointer;margin-left:auto"><input type="checkbox" ' + (FM_state.includeTonalPlanInPDF ? 'checked' : '') + ' onchange="FM_state.includeTonalPlanInPDF=this.checked;FM_render()" style="margin-right:4px">' + tx('Inclure au PDF','Include in PDF','Incluir en PDF') + '</label>';
  h += '</div>';
  
  h += '<div class="tonal-timeline-v2">';
  
  // Courbe SVG basée sur nombre de mesures
  const maxMeasures = Math.max(...secs.map(s => parseInt(s.measures) || 1));
  h += '<svg class="tonal-curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="';
  secs.forEach((s, i) => {
    const xPct = secs.length === 1 ? 50 : (i / (secs.length - 1)) * 100;
    const measures = parseInt(s.measures) || 1;
    const yPct = 100 - ((measures / maxMeasures) * 70); // 70% max height
    h += (i === 0 ? 'M' : 'L') + xPct + ',' + yPct;
  });
  h += '" fill="none" stroke="var(--accent)" stroke-width="0.5" opacity="0.6"/></svg>';
  
  // Points
  secs.forEach((s, i) => {
    const xPct = secs.length === 1 ? 50 : (i / (secs.length - 1)) * 100;
    const measures = parseInt(s.measures) || 1;
    const yPct = 100 - ((measures / maxMeasures) * 70);
    const col = FM_sColor(s);
    const tonalityName = s.degree || '—';
    const isMajor = s.degree && s.degree === s.degree.toUpperCase();
    
    h += '<div class="tonal-milestone" style="left:' + xPct + '%;top:' + yPct + '%">';
    h += '<div class="tonal-point-v2" style="' + (isMajor ? 'background:'+col : 'border:3px solid '+col+';background:var(--card)') + '"></div>';
    h += '<div class="tonal-label">' + FM_esc(s.label) + '</div>';
    h += '<div class="tonal-tooltip-v2"><strong>' + FM_esc(s.label) + '</strong><br><span class="tonal-key">' + tonalityName + (isMajor ? ' ' + tx('majeur','major','mayor') : ' ' + tx('mineur','minor','menor')) + '</span><br><span style="font-size:9px;color:var(--txt3)">' + measures + ' ' + tx('mes.','bars','comp.') + '</span></div>';
    h += '</div>';
  });
  
  h += '</div>';
  container.innerHTML = h;
}


function FM_renderRef(){
  const rp=document.getElementById('fm_refPanel');if(!FM_state.showRef){rp.classList.remove('visible');return}rp.classList.add('visible');
  const fid=FM_state.isMultiMovement?FM_curFormId():FM_state.formId,form=FM_FORMS[fid];
  if(!form){document.getElementById('fm_refContent').innerHTML='<div style="color:var(--txt3);font-size:11px">'+(tx('Sélectionnez un mouvement.','Select a movement.','Selecciona un movimiento.'))+'</div>';return}
  let h='<div class="ref-tl">';(form.ref||[]).forEach(r=>{h+='<div class="ref-blk" style="background:'+r.c+'">'+r.l+'<span>'+(r.d||'')+'</span></div>'});h+='</div>';
  h+='<div class="ref-info"><h4>'+form.name+'</h4><p>'+form.desc+'</p>';
  if(fid==='sonata'||fid==='sonata-intro')h+="<h4>Plan tonal</h4><p>Maj: S en V → Réex S en I<br>Min: S en III → Réex S en i</p>";
  if(fid.startsWith('rondo')||fid==='sonata-rondo')h+="<h4>Rondo</h4><p>A toujours en I. Couplets dans d'autres tons.</p>";
  if(fid==='theme-var')h+="<h4>Techniques</h4><p>Ornementation, mode, rythme, mètre, registre, caractère, double, basse.</p>";
  h+='</div>';document.getElementById('fm_refContent').innerHTML=h;
}

function FM_renderDetail(){
  const secs=FM_curSections(),s=secs.find(x=>x.id===FM_state.selectedId);
  const empty=document.getElementById('fm_dpEmpty'),card=document.getElementById('fm_dpCard');
  if(!s&&FM_state.isMultiMovement){const m=FM_state.movements[FM_state.activeMovementIdx];if(m){empty.style.display='none';card.style.display='block';FM_renderMvtConfig(card,m);return}}
  if(!s&&!FM_state.isMultiMovement){
    empty.style.display='none';card.style.display='block';
    const orch=FM_state.orchestration||[];
    let h='<h3 style="color:var(--accent)">⚙ '+(tx('Configuration de l\'œuvre','Work Configuration','Configuración de la obra'))+'</h3>';
    h+='<div style="font-size:11px;color:var(--txt3);margin-bottom:12px">'+tx('Cliquez une section dans la timeline pour l\'éditer, ou configurez l\'instrumentation ci-dessous.','Click a section in the timeline to edit it, or configure instrumentation below.','Haz clic en una sección de la línea de tiempo para editarla, o configura la instrumentación abajo.')+'</div>';
    h+='<div class="orch-panel"><h4>🎻 Orchestration <button class="tbtn sm" onclick="FM_showOrchModal()" style="margin-left:auto">'+(tx('Modifier','Edit','Editar'))+'</button></h4>';
    if(orch.length){h+='<div style="font-size:11px;color:var(--txt2);line-height:1.6">'+FM_orchSummary(orch)+'</div>'}
    else{h+='<div style="font-size:11px;color:var(--txt3)">'+(tx('Aucune instrumentation définie. Cliquez « Modifier » ou le bouton 🎻 Orch.','No instrumentation defined. Click "Edit" or the 🎻 Orch. button.','Sin instrumentación definida. Haz clic en «Editar» o en el botón 🎻 Orq.'))+'</div>'}
    h+='</div>';
    card.innerHTML=h;return;
  }
  if(!s){empty.style.display='flex';card.style.display='none';return}
  empty.style.display='none';card.style.display='block';
  const col=FM_sColor(s),isVar=s.type==='variation',mode=FM_curMode(),degs=mode==='major'?FM_DEGREES_MAJ:FM_DEGREES_MIN;
  let h='<h3><span class="type-dot" style="background:'+col+'"></span>'+FM_esc(FM_typeMap[s.type]?.label||s.type)+'</h3>';
  h+='<div class="dp-row"><div class="dp-field"><label>'+(tx('Étiquette','Label','Etiqueta'))+'</label><input type="text" value="'+FM_esc(s.label)+'" oninput="FM_updField(\''+s.id+'\',\'label\',this.value)"></div>';
  h+='<div class="dp-field"><label>'+(tx('Couleur','Color','Color'))+'</label><input type="color" value="'+(s.customColor||col)+'" onchange="FM_updField(\''+s.id+'\',\'customColor\',this.value);FM_render()" style="width:60px;height:32px;border:1px solid var(--border);border-radius:6px;cursor:pointer"></div></div>';
  h+='<div class="dp-row"><div class="dp-field"><label>Type</label><select onchange="FM_updField(\''+s.id+'\',\'type\',this.value);FM_render()">';
  [...new Set(FM_SECTION_TYPES.map(t=>t.cat))].forEach(c=>{h+='<optgroup label="'+tFM(c)+'">';FM_SECTION_TYPES.filter(t=>t.cat===c).forEach(t=>{h+='<option value="'+t.id+'"'+(t.id===s.type?' selected':'')+'>'+tFM(t.label)+'</option>'});h+='</optgroup>'});
  h+='</select></div></div>';
  h+='<div class="dp-row full"><div class="dp-field"><label>'+(tx('Degré tonal','Tonal Degree','Grado tonal'))+' ('+(mode==='major'?(tx('Majeur','Major','Mayor')):(tx('Mineur','Minor','Menor')))+')</label><div class="degree-picker">';
  h+='<input type="text" value="'+FM_esc(s.degree)+'" style="width:50px;font-family:\'JetBrains Mono\',monospace;font-size:12px;padding:3px 6px;border:1.5px solid var(--border);border-radius:6px;text-align:center" oninput="FM_updField(\''+s.id+'\',\'degree\',this.value)" title="Saisie libre">';
  degs.forEach(cat=>{h+='<span class="deg-cat">'+tFM(cat.cat)+'</span>';cat.items.forEach(d=>{h+='<button class="deg-btn '+(s.degree===d?'on':'')+'" onclick="FM_updField(\''+s.id+"','degree','"+d+"');FM_render()\">"+d+'</button>'})});
  h+='</div></div></div>';
  h+='<div class="dp-row"><div class="dp-field"><label>'+(tx('Cadence','Cadence','Cadencia'))+'</label><select onchange="FM_updField(\''+s.id+'\',\'cadence\',this.value)">';
  FM_getCadences().forEach(c=>{h+='<option value="'+c.id+'"'+(c.id===s.cadence?' selected':'')+'>'+c.label+'</option>'});
  h+='</select></div><div class="dp-field"><label>'+(tx('Mesures','Bars','Compases'))+'</label><input type="number" min="0" value="'+(s.measures||0)+'" onchange="FM_updField(\''+s.id+'\',\'measures\',parseInt(this.value)||0);FM_render()"></div></div>';
  h+='<div class="dp-row"><div class="dp-field"><label>Tempo</label><input type="text" value="'+FM_esc(s.tempo)+'" placeholder="Allegro, ♩=120" oninput="FM_updField(\''+s.id+'\',\'tempo\',this.value)"></div>';
  h+='<div class="dp-field"><label>'+(tx('Caractère','Character','Carácter'))+'</label><input type="text" value="'+FM_esc(s.character)+'" placeholder="cantabile, agitato" oninput="FM_updField(\''+s.id+'\',\'character\',this.value)"></div></div>';
  h+='<div class="dp-row"><div class="dp-field"><label>'+(tx('Dynamique','Dynamics','Dinámica'))+'</label><div style="display:flex;flex-wrap:wrap;gap:3px">';
  h+='<input type="text" value="'+FM_esc(s.dynamics)+'" style="width:60px;font-size:12px;font-style:italic;padding:3px 6px;border:1.5px solid var(--border);border-radius:6px" oninput="FM_updField(\''+s.id+'\',\'dynamics\',this.value)">';
  FM_DYNAMICS.forEach(d=>{const on=s.dynamics===d?'background:var(--accent);color:#fff;border-color:var(--accent)':'';h+='<button style="padding:2px 6px;border:1.5px solid var(--border);border-radius:5px;font-size:10px;font-style:italic;cursor:pointer;font-family:inherit;'+on+'" onclick="FM_updField(\''+s.id+"','dynamics','"+d+"');FM_render()\">"+d+'</button>'});
  h+='</div></div></div>';
  if(isVar||s.type==='theme-var'){h+='<div class="var-fields"><h4>🎵 '+(isVar?'Variation':'Thème')+'</h4>';
    if(isVar){h+='<div class="dp-row"><div class="dp-field"><label>N°</label><input type="number" min="1" value="'+(s.variationNum||'')+'" onchange="FM_updField(\''+s.id+'\',\'variationNum\',parseInt(this.value)||null);FM_updateVarLabel(\''+s.id+'\')"></div>';
    h+='<div class="dp-field"><label>'+(tx('Technique','Technique','Técnica'))+'</label><select onchange="FM_updField(\''+s.id+'\',\'variationTech\',this.value)"><option value="">'+(tx('— Choisir —','— Choose —','— Elegir —'))+'</option>';
    (currentLang==='en'?['Melodic ornamentation','Mode change','Rhythmic variation','Meter change','Register/texture variation','Character variation','Double (diminution)','Ground bass variation','Free variation','Other']:currentLang==='es'?['Ornamentación melódica','Cambio de modo','Variación rítmica','Cambio de compás','Variación de registro/textura','Variación de carácter','Doble (disminución)','Variación sobre bajo','Variación libre','Otro']:['Ornementation mélodique','Changement de mode','Variation rythmique','Changement de mètre','Variation de registre/texture','Variation de caractère','Double (diminution)','Variation sur basse','Variation libre','Autre']).forEach(t=>{h+='<option value="'+t+'"'+(s.variationTech===t?' selected':'')+'>'+t+'</option>'});
    h+='</select></div></div>'}h+='</div>'}
  // Nouveaux blocs Tier 2
  h+='<div class="fm-advanced-fields">';
  h+='<details class="fm-collapsible"><summary>🎼 '+(tx('Grille harmonique','Harmonic grid','Rejilla armónica'))+'</summary><div class="fm-grid-editor"><textarea placeholder="'+(tx('Ex: I → V⁶/V → V → I','Ex: I → V⁶/V → V → I','Ej: I → V⁶/V → V → I'))+'" oninput="FM_updField(\''+s.id+'\',\'harmGrid\',this.value)">'+FM_esc(s.harmGrid||'')+'</textarea></div></details>';
  h+='<details class="fm-collapsible"><summary>🎨 '+(tx('Matériau thématique','Thematic material','Material temático'))+'</summary><div class="fm-theme-fields"><div class="dp-row"><div class="dp-field"><label>'+(tx('Étiquette','Label','Etiqueta'))+'</label><input type="text" value="'+FM_esc(s.themeLabel||'')+'" placeholder="'+(tx('Thème A, Motif héroïque','Theme A, Heroic motif','Tema A, Motivo heroico'))+'" oninput="FM_updField(\''+s.id+'\',\'themeLabel\',this.value)"></div></div><div class="dp-row full"><div class="dp-field"><label>'+(tx('Incipit / Description','Incipit / Description','Incipit / Descripción'))+'</label><textarea placeholder="'+(tx('♩. ♪ ♩ ♩ ou description libre','♩. ♪ ♩ ♩ or free description','♩. ♪ ♩ ♩ o descripción libre'))+'" oninput="FM_updField(\''+s.id+'\',\'themeIncipit\',this.value)">'+FM_esc(s.themeIncipit||'')+'</textarea></div></div></div></details>';
  h+='<details class="fm-collapsible"><summary>🎭 '+(tx('Texture / Densité','Texture / Density','Textura / Densidad'))+'</summary><div class="fm-texture-fields"><div class="dp-row"><div class="dp-field"><label>'+(tx('Type de texture','Texture type','Tipo de textura'))+'</label><select onchange="FM_updField(\''+s.id+'\',\'texture\',this.value)"><option value="">'+(tx('— Choisir —','— Choose —','— Elegir —'))+'</option>';
  (currentLang==='en'?['Monophonic','Homophonic','Polyphonic','Fugal','Melody+Acc.','Choral']:currentLang==='es'?['Monofónica','Homofónica','Polifónica','Fugada','Melodía+Acomp.','Coral']:['Monodique','Homophonique','Polyphonique','Fugué','Mélodie+Accomp.','Choral']).forEach(t=>{h+='<option value="'+t+'"'+(s.texture===t?' selected':'')+'>'+t+'</option>'});
  h+='</select></div><div class="dp-field"><label>'+(tx('Densité','Density','Densidad'))+' (1-5)</label><input type="range" min="1" max="5" value="'+(s.density||3)+'" oninput="this.nextElementSibling.textContent=this.value;FM_updField(\''+s.id+'\',\'density\',parseInt(this.value))"><span>'+(s.density||3)+'</span></div></div></div></details>';
  h+='</div>';
  h+='<div class="dp-row full"><div class="dp-field"><label>Notes</label><textarea oninput="FM_updField(\''+s.id+'\',\'notes\',this.value)" placeholder="'+(tx('Notes libres…','Free notes…','Notas libres…'))+'">'+FM_esc(s.notes)+'</textarea></div></div>';
  h+='<div style="display:flex;gap:6px;margin-top:8px"><button class="tbtn sm" onclick="FM_duplicateSection(\''+s.id+'\')">'+(tx('📋 Dupliquer','📋 Duplicate','📋 Duplicar'))+'</button><button class="tbtn sm danger" onclick="FM_delSectionById(\''+s.id+'\')">'+(tx('🗑 Supprimer','🗑 Delete','🗑 Eliminar'))+'</button></div>';
  card.innerHTML=h;
}

function FM_renderMvtConfig(card,m){
  const i=FM_state.activeMovementIdx,mKey=m.key||'',mMode=m.mode||'';
  let h='<h3 style="color:var(--accent)">⚙ '+(tx('Mouvement','Movement','Movimiento'))+' '+(FM_ROMAN[i]||i+1)+' — '+FM_esc(m.name)+'</h3>';
  h+='<div style="font-size:11px;color:var(--txt3);margin-bottom:12px">'+tx('Cliquez une section dans la timeline pour l\'éditer, ou configurez le mouvement ici.','Click a section in the timeline to edit it, or configure the movement here.','Haz clic en una sección de la línea de tiempo para editarla, o configura el movimiento aquí.')+'</div>';
  h+='<div class="dp-row"><div class="dp-field"><label>'+(tx('Nom','Name','Nombre'))+'</label><input type="text" value="'+FM_esc(m.name)+'" oninput="FM_updMvt('+i+',\'name\',this.value)"></div>';
  h+='<div class="dp-field"><label>Tempo</label><input type="text" value="'+FM_esc(m.tempo)+'" placeholder="Allegro" oninput="FM_updMvt('+i+',\'tempo\',this.value)"></div></div>';
  h+='<div class="dp-row"><div class="dp-field"><label>'+(tx('Tonalité (vide=globale)','Key (empty=global)','Tonalidad (vacío=global)'))+'</label><select onchange="FM_updMvt('+i+',\'key\',this.value)"><option value="">— '+(tx('Globale','Global','Global'))+' ('+fmKey(FM_state.globalKey)+') —</option>';
  fmKeys().forEach(function(k,ki){h+='<option value="'+FM_KEYS_FR[ki]+'"'+(mKey===FM_KEYS_FR[ki]?' selected':'')+'>'+k+'</option>'});
  h+='</select></div><div class="dp-field"><label>'+(tx('Mode (vide=global)','Mode (empty=global)','Modo (vacío=global)'))+'</label><select onchange="FM_updMvt('+i+',\'mode\',this.value)"><option value="">'+(tx('— Global —','— Global —','— Global —'))+'</option><option value="major"'+(mMode==='major'?' selected':'')+'>'+(tx('Majeur','Major','Mayor'))+'</option><option value="minor"'+(mMode==='minor'?' selected':'')+'>'+(tx('Mineur','Minor','Menor'))+'</option></select></div></div>';
  h+='<div class="dp-row full"><div class="dp-field"><label>'+(tx('Forme','Form','Forma'))+'</label><select onchange="FM_changeMvtForm(this.value)">';
  Object.entries(FM_FORMS).forEach(([id,f])=>{h+='<option value="'+id+'"'+(id===m.formId?' selected':'')+'>'+tFM(f.name)+'</option>'});
  h+='</select></div></div>';
  // Orchestration summary
  const orch=m.orchestration||[];
  h+='<div class="orch-panel"><h4>🎻 Orchestration <button class="tbtn sm" onclick="FM_showOrchModal()" style="margin-left:auto">'+(tx('Modifier','Edit','Editar'))+'</button></h4>';
  if(orch.length){h+='<div style="font-size:11px;color:var(--txt2);line-height:1.6">'+FM_orchSummary(orch)+'</div>'}
  else{h+='<div style="font-size:11px;color:var(--txt3)">'+(tx('Aucune instrumentation définie. Cliquez « Modifier » ou le bouton 🎻 Orch.','No instrumentation defined. Click "Edit" or the 🎻 Orch. button.','Sin instrumentación definida. Haz clic en «Editar» o en el botón 🎻 Orq.'))+'</div>'}
  h+='</div>';
  card.innerHTML=h;
}

// ACTIONS
function FM_selectSection(id){FM_state.selectedId=id;FM_render()}
function FM_selectMovement(i){FM_state.activeMovementIdx=i;FM_state.selectedId=null;FM_render()}
function FM_updField(id,field,val){const s=FM_curSections().find(x=>x.id===id);if(s){s[field]=val;FM_renderTimeline();FM_renderFormHeader();FM_saveHistory()}}
function FM_updMvt(i,field,val){if(FM_state.movements[i]){FM_state.movements[i][field]=val;FM_render();FM_saveHistory()}}
function FM_updateVarLabel(id){const s=FM_curSections().find(x=>x.id===id);if(s&&s.variationNum)s.label='Var. '+s.variationNum;FM_render();FM_saveHistory()}
function delSection(idx){const secs=FM_curSections();if(secs.length<=1)return;if(secs[idx].id===FM_state.selectedId)FM_state.selectedId=null;secs.splice(idx,1);FM_setCurSections(secs);FM_render();FM_saveHistory()}
function FM_delSectionById(id){const idx=FM_curSections().findIndex(x=>x.id===id);if(idx>=0)delSection(idx)}
function FM_duplicateSection(id){const secs=FM_curSections(),idx=secs.findIndex(x=>x.id===id);if(idx<0)return;const orig=secs[idx],copy=Object.assign({},orig,{id:FM_uid(),label:orig.label+"'",notes:''});if(copy.variationNum){copy.variationNum=FM_nextVarNum++;copy.label='Var. '+copy.variationNum}secs.splice(idx+1,0,copy);FM_setCurSections(secs);FM_state.selectedId=copy.id;FM_render();FM_saveHistory()}
function FM_changeMvtForm(fid){if(!FM_state.isMultiMovement)return;const m=FM_state.movements[FM_state.activeMovementIdx];if(!m)return;const form=FM_FORMS[fid];if(!form)return;m.formId=fid;m.sections=form.sections();FM_state.selectedId=null;FM_render();FM_saveHistory()}
function FM_delMovement(i){if(FM_state.movements.length<=1)return;FM_state.movements.splice(i,1);if(FM_state.activeMovementIdx>=FM_state.movements.length)FM_state.activeMovementIdx=FM_state.movements.length-1;FM_state.selectedId=null;FM_render();FM_saveHistory()}

function FM_openAddMvtModal(){
  let h='<div style="margin-bottom:8px;font-size:12px;color:var(--txt2)">'+(tx('Forme du nouveau mouvement :','Form for the new movement:','Forma del nuevo movimiento:'))+'</div>';
  [...new Set(Object.values(FM_FORMS).map(f=>f.cat))].forEach(c=>{h+='<div class="modal-cat-title">'+tFM(c)+'</div>';Object.entries(FM_FORMS).filter(([,f])=>f.cat===c).forEach(([id,f])=>{h+='<div class="modal-item" onclick="FM_addMovement(\''+id+'\')"><span class="mi-dot" style="background:var(--accent)"></span><span class="mi-label">'+tFM(f.name)+'</span></div>'})});
  document.getElementById('fm_addMvtContent').innerHTML=h;document.getElementById('fm_addMvtModal').classList.add('show');
}
function FM_addMovement(formId){const form=FM_FORMS[formId],num=FM_state.movements.length+1;FM_state.movements.push({id:FM_uid(),name:'Mouvement '+num,formId:formId,key:'',mode:'',tempo:'',sections:form.sections()});FM_state.activeMovementIdx=FM_state.movements.length-1;FM_state.selectedId=null;FM_closeModal('fm_addMvtModal');FM_render()}

function FM_openAddModal(){
  let h='';[...new Set(FM_SECTION_TYPES.map(t=>t.cat))].forEach(c=>{h+='<div class="modal-cat-title">'+tFM(c)+'</div>';FM_SECTION_TYPES.filter(t=>t.cat===c).forEach(t=>{h+='<div class="modal-item" onclick="FM_addSection(\''+t.id+'\')"><span class="mi-dot" style="background:'+t.color+'"></span><span class="mi-label">'+tFM(t.label)+'</span></div>'})});
  document.getElementById('fm_addModalContent').innerHTML=h;document.getElementById('fm_addModal').classList.add('show');
}
function FM_addSection(typeId){const t=FM_typeMap[typeId],s=FM_sec(typeId,t.short,'I','none',4);if(typeId==='variation'){s.variationNum=FM_nextVarNum++;s.label='Var. '+s.variationNum;s.variationTech=''}const secs=FM_curSections();secs.push(s);FM_setCurSections(secs);FM_state.selectedId=s.id;FM_closeModal('fm_addModal');FM_render();setTimeout(()=>document.querySelector('.timeline-scroll').scrollLeft=99999,50)}
function FM_closeModal(id){document.getElementById(id).classList.remove('show')}

// DRAG & DROP
function FM_dStart(e,idx){dragSrcIdx=idx;e.dataTransfer.effectAllowed='move';e.target.classList.add('dragging')}
function FM_dOver(e){e.preventDefault();e.dataTransfer.dropEffect='move'}
function FM_dEnter(e,el){e.preventDefault();if(el.classList.contains('tl-block'))el.classList.add('drag-over')}
function FM_dLeave(e,el){el.classList.remove('drag-over')}
function FM_dDrop(e,idx){e.preventDefault();e.currentTarget.classList.remove('drag-over');if(dragSrcIdx===null||dragSrcIdx===idx)return;const secs=FM_curSections(),item=secs.splice(dragSrcIdx,1)[0];secs.splice(idx,0,item);FM_setCurSections(secs);FM_render()}
function FM_dEnd(e){dragSrcIdx=null;document.querySelectorAll('.tl-block').forEach(b=>b.classList.remove('dragging','drag-over'))}

function FM_toggleRef(){FM_state.showRef=!FM_state.showRef;FM_render()}

// SAVE/LOAD
function FM_getSaves(){try{return JSON.parse(localStorage.getItem('projetc-formes-saves')||'[]')}catch{return[]}}
function FM_putSaves(s){localStorage.setItem('projetc-formes-saves',JSON.stringify(s))}
function FM_saveProject(){const saves=FM_getSaves(),data={name:FM_state.name,formId:FM_state.formId,globalKey:FM_state.globalKey,globalMode:FM_state.globalMode,isMultiMovement:FM_state.isMultiMovement,sections:FM_state.sections,movements:FM_state.movements,orchestration:FM_state.orchestration,orchMode:FM_state.orchMode,date:new Date().toISOString()};const idx=saves.findIndex(s=>s.name===FM_state.name);if(idx>=0)saves[idx]=data;else saves.push(data);FM_putSaves(saves);FM_showToast('Projet sauvegardé ✓')}
function FM_showSaves(){const saves=FM_getSaves();let h='';if(!saves.length)h='<div style="color:var(--txt3);font-size:12px;padding:8px">Aucun projet sauvegardé.</div>';saves.forEach((s,i)=>{const d=new Date(s.date),fn=FM_FORMS[s.formId]?.name||FM_MULTI_FORMS[s.formId]?.name||s.formId;h+='<div class="save-item" onclick="FM_loadProject('+i+')"><span class="si-name">'+FM_esc(s.name)+' <span style="font-size:10px;color:var(--txt3)">('+fn+')</span></span><span class="si-date">'+d.toLocaleDateString('fr-CA')+'</span><button class="si-del" onclick="event.stopPropagation();FM_delSave('+i+')" title="Supprimer">🗑</button></div>'});document.getElementById('fm_savesList').innerHTML=h;document.getElementById('fm_savesModal').classList.add('show')}
function FM_loadProject(idx){const saves=FM_getSaves(),s=saves[idx];if(!s)return;FM_state.name=s.name;FM_state.formId=s.formId;FM_state.globalKey=s.globalKey;FM_state.globalMode=s.globalMode;FM_state.isMultiMovement=!!s.isMultiMovement;FM_state.sections=s.sections||[];FM_state.movements=s.movements||[];FM_state.orchestration=s.orchestration||[];FM_state.orchMode=s.orchMode||'global';FM_state.selectedId=null;FM_state.activeMovementIdx=0;document.getElementById('fm_projName').value=s.name;document.getElementById('fm_globalKey').value=s.globalKey;document.getElementById('fm_globalMode').value=s.globalMode;FM_nextVarNum=FM_curSections().filter(x=>x.type==='variation').length+1;FM_closeModal('fm_savesModal');FM_render();FM_showToast(tx('Projet chargé ✓','Project loaded ✓','Proyecto cargado ✓'))}
function FM_delSave(idx){const saves=FM_getSaves();saves.splice(idx,1);FM_putSaves(saves);FM_showSaves()}

// EXPORT PDF
function FM_exportPDF(){
  const w=window.open('','_blank'),fo=FM_FORMS[FM_state.formId]||FM_MULTI_FORMS[FM_state.formId],fn=fo?fo.name:'';
  let html='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+FM_esc(FM_state.name)+'</title><style>@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap");*{margin:0;padding:0;box-sizing:border-box}body{font-family:"DM Sans",sans-serif;padding:30px;color:#111827}h1{font-size:22px;margin-bottom:4px}h2{font-size:16px;margin:20px 0 6px;color:#534AB7;border-bottom:2px solid #eae8f4;padding-bottom:4px}.sub{font-size:13px;color:#6b7280;margin-bottom:16px}.tl{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}.blk{padding:6px 10px;border-radius:8px;color:#fff;font-size:11px;font-weight:600}.blk span{display:block;font-size:9px;font-weight:400;opacity:.85}table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:16px}th{background:#f4f3f9;padding:6px 8px;text-align:left;font-weight:600;border-bottom:2px solid #e5e7eb;font-size:10px;text-transform:uppercase;color:#6b7280}td{padding:6px 8px;border-bottom:1px solid #f0f0f4;vertical-align:top}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}.mono{font-family:"JetBrains Mono",monospace}@media print{body{padding:15px}table{page-break-inside:auto}tr{page-break-inside:avoid}}</style></head><body>';
  html+='<h1>'+FM_esc(FM_state.name)+'</h1><div class="sub">'+fn+' — '+FM_state.globalKey+' '+(FM_state.globalMode==='major'?t('major'):t('minor'))+'</div>';
  // Plan tonal si activé
  if(FM_state.includeTonalPlanInPDF && FM_state.sections.length > 0){
    html+='<div style="background:#f9f9fb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:16px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#534AB7;margin-bottom:8px">'+t('Plan tonal')+'</div>';
    html+='<div style="position:relative;height:100px">';
    const maxM=Math.max(...FM_state.sections.map(s=>parseInt(s.measures)||1));
    html+='<svg style="position:absolute;width:100%;height:100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="';
    FM_state.sections.forEach((s,i)=>{
      const x=FM_state.sections.length===1?50:(i/(FM_state.sections.length-1))*100;
      const y=100-((parseInt(s.measures)||1)/maxM*70);
      html+=(i===0?'M':'L')+x+','+y;
    });
    html+='" fill="none" stroke="#534AB7" stroke-width="0.5" opacity="0.6"/></svg>';
    FM_state.sections.forEach((s,i)=>{
      const x=FM_state.sections.length===1?50:(i/(FM_state.sections.length-1))*100;
      const y=100-((parseInt(s.measures)||1)/maxM*70);
      const col=FM_sColor(s);
      const isMaj=s.degree&&s.degree===s.degree.toUpperCase();
      html+='<div style="position:absolute;left:'+x+'%;top:'+y+'%;transform:translate(-50%,-50%)"><div style="width:14px;height:14px;border-radius:50%;'+(isMaj?'background:'+col:'border:3px solid '+col+';background:#fff')+'"></div><div style="position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);font-size:9px;color:#6b7280;white-space:nowrap">'+FM_esc(s.label)+'</div></div>';
    });
    html+='</div></div>';
  }
  // Global orchestration for single forms
  if(!FM_state.isMultiMovement&&FM_state.orchestration&&FM_state.orchestration.length){
    html+='<div style="margin-bottom:16px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#534AB7;margin-bottom:4px">Instrumentation</div>'+FM_orchSummaryPDF(FM_state.orchestration)+'</div>';
  }
  function pdfSecs(secs,title,orch){
    if(title)html+='<h2>'+title+'</h2>';
    if(orch&&orch.length)html+='<div style="margin-bottom:8px"><div style="font-size:10px;font-weight:600;text-transform:uppercase;color:#534AB7;margin-bottom:2px">Instrumentation</div>'+FM_orchSummaryPDF(orch)+'</div>';
    html+='<div class="tl">';secs.forEach(s=>{const col=FM_sColor(s);html+='<div class="blk" style="background:'+col+'">'+FM_esc(s.label)+'<span>'+FM_esc(s.degree)+(s.cadence&&s.cadence!=='none'?' · '+FM_cadShort(s.cadence):'')+(s.measures?' · '+s.measures+'m.':'')+'</span></div>'});html+='</div>';
    html+='<table><tr><th></th><th>Section</th><th>Degré</th><th>Cadence</th><th>Mes.</th><th>Tempo</th><th>Caract.</th><th>Dyn.</th><th>Notes</th></tr>';
    secs.forEach(s=>{const col=FM_sColor(s);html+='<tr><td><span class="dot" style="background:'+col+'"></span></td><td><b>'+FM_esc(s.label)+'</b><br><span style="color:#9ca3af;font-size:10px">'+(FM_typeMap[s.type]?.label||'')+'</span></td><td class="mono">'+FM_esc(s.degree)+'</td><td>'+FM_cadShort(s.cadence)+'</td><td>'+(s.measures||'')+'</td><td>'+FM_esc(s.tempo)+'</td><td>'+FM_esc(s.character)+'</td><td style="font-style:italic">'+FM_esc(s.dynamics)+'</td><td>'+FM_esc(s.notes)+(s.variationTech?' <b>['+FM_esc(s.variationTech)+']</b>':'')+'</td></tr>'});
    html+='</table>';
  }
  if(FM_state.isMultiMovement){FM_state.movements.forEach((m,i)=>{const mK=m.key||FM_state.globalKey,mM=m.mode||FM_state.globalMode,mfn=FM_FORMS[m.formId]?.name||'';pdfSecs(m.sections,'Mouvement '+(FM_ROMAN[i]||i+1)+' — '+FM_esc(m.name)+' ('+mfn+', '+mK+' '+(mM==='major'?'M':'m')+(m.tempo?', '+FM_esc(m.tempo):'')+')' ,m.orchestration||[]);  })}else{pdfSecs(FM_state.sections,null)}
  html+='<div style="margin-top:20px;font-size:9px;color:#9ca3af">Généré par Contrepoint — Forme Musicale · '+new Date().toLocaleDateString('fr-CA')+'</div></body></html>';
  w.document.write(html);w.document.close();setTimeout(()=>w.print(),300);
}

function FM_showToast(msg){const t=document.createElement('div');t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#111827;color:#fff;padding:8px 18px;border-radius:8px;font-size:13px;font-family:DM Sans,sans-serif;z-index:200';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),300)},1800)}
function FM_esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

// ALERTS
// ═══ RÈGLES DE COHÉRENCE FORMELLE ═══
const FM_RULES = {
  // Règles pour formes sonate
  'sonata': [
    {check: (secs,mode) => {
      const sThemes = secs.filter(s => s.type === 'theme-s');
      return sThemes.some(s => mode === 'minor' && s.degree === 'V');
    }, t:'tip', msg:{
      fr:'En mode mineur, S est typiquement en III (relatif majeur), pas en V.',
      en:'In minor mode, S is typically in III (relative major), not V.',
      es:'En modo menor, S está normalmente en III (relativo mayor), no en V.'}},
    {check: (secs,mode) => {
      const sThemes = secs.filter(s => s.type === 'theme-s');
      return sThemes.some(s => mode === 'major' && s.degree === 'III');
    }, t:'info', msg:{
      fr:'S en III est typique du mode mineur. En majeur, S va habituellement en V.',
      en:'S in III is typical of minor mode. In major, S usually goes to V.',
      es:'S en III es típico del modo menor. En mayor, S suele ir a V.'}},
    {check: (secs) => {
      const recap = secs.slice(Math.floor(secs.length/2));
      const sInRecap = recap.filter(s => s.type === 'theme-s');
      return sInRecap.some(s => s.degree !== 'I' && s.degree !== 'i');
    }, t:'warn', msg:{
      fr:'Dans la réexposition, S devrait revenir en I (tonique).',
      en:'In the recapitulation, S should return to I (tonic).',
      es:'En la reexposición, S debería volver a I (tónica).'}},
    {check: (secs) => !secs.some(s => s.type === 'development'), t:'warn', msg:{
      fr:'La forme sonate nécessite un développement entre exposition et réexposition.',
      en:'Sonata form requires a development between exposition and recapitulation.',
      es:'La forma sonata requiere un desarrollo entre exposición y reexposición.'}},
    {check: (secs) => !secs.some(s => s.type === 'transition'), t:'tip', msg:{
      fr:'Une transition (TR) entre P et S est attendue dans la forme sonate.',
      en:'A transition (TR) between P and S is expected in sonata form.',
      es:'Se espera una transición (TR) entre P y S en la forma sonata.'}}
  ],
  'sonata-intro': [
    {check: (secs) => secs.length > 0 && secs[0].type !== 'introduction', t:'tip', msg:{
      fr:'Cette forme débute typiquement par une introduction lente.',
      en:'This form typically begins with a slow introduction.',
      es:'Esta forma suele comenzar con una introducción lenta.'}},
    {check: (secs) => !secs.some(s => s.type === 'coda'), t:'tip', msg:{
      fr:'Une coda finale est attendue dans cette forme étendue de sonate.',
      en:'A final coda is expected in this extended sonata form.',
      es:'Se espera una coda final en esta forma extendida de sonata.'}}
  ],
  'sonatine': [
    {check: (secs) => secs.some(s => s.type === 'development'), t:'info', msg:{
      fr:'La sonatine omet généralement le développement (réexposition directe).',
      en:'Sonatina typically omits the development (direct recapitulation).',
      es:'La sonatina suele omitir el desarrollo (reexposición directa).'}}
  ],
  
  // Règles pour rondos
  'rondo-5': [
    {check: (secs) => secs.filter(s => s.type === 'refrain').some(s => s.degree !== 'I' && s.degree !== 'i'), t:'warn', msg:{
      fr:'Le refrain (A) du rondo devrait toujours être en I.',
      en:'The rondo refrain (A) should always be in I.',
      es:'El estribillo del rondó (A) siempre debería estar en I.'}},
    {check: (secs) => secs.filter(s => s.type === 'refrain').length < 3, t:'warn', msg:{
      fr:'Le rondo à 5 parties nécessite au moins 3 retours du refrain (A).',
      en:'5-part rondo requires at least 3 refrain returns (A).',
      es:'El rondó de 5 partes requiere al menos 3 retornos del estribillo (A).'}}
  ],
  'rondo-7': [
    {check: (secs) => secs.filter(s => s.type === 'refrain').some(s => s.degree !== 'I' && s.degree !== 'i'), t:'warn', msg:{
      fr:'Le refrain (A) doit toujours revenir en I.',
      en:'The refrain (A) must always return to I.',
      es:'El estribillo (A) debe volver siempre a I.'}},
    {check: (secs) => {
      const lastB = [...secs].reverse().find(s => s.type === 'couplet' && s.label.includes('B'));
      return lastB && lastB.degree !== 'I' && lastB.degree !== 'i';
    }, t:'tip', msg:{
      fr:"Le dernier B (B') devrait être en I, pas en V.",
      en:"The final B (B') should be in I, not V.",
      es:"El último B (B') debería estar en I, no en V."}}
  ],
  'sonata-rondo': [
    {check: (secs) => !secs.some(s => s.type === 'development'), t:'warn', msg:{
      fr:'Le sonate-rondo nécessite un développement (section C).',
      en:'Sonata-rondo requires a development (section C).',
      es:'El sonata-rondó requiere un desarrollo (sección C).'}}
  ],
  
  // Règles pour thème et variations
  'theme-var': [
    {check: (secs) => secs.filter(s => s.type === 'variation').length < 3, t:'tip', msg:{
      fr:'Un cycle de variations comporte généralement au moins 3 variations.',
      en:'A variation cycle typically includes at least 3 variations.',
      es:'Un ciclo de variaciones suele incluir al menos 3 variaciones.'}},
    {check: (secs) => secs.length > 0 && secs[0].type !== 'theme-var', t:'warn', msg:{
      fr:'La forme débute par le thème, suivi des variations.',
      en:'The form begins with the theme, followed by variations.',
      es:'La forma comienza con el tema, seguido de las variaciones.'}}
  ],
  
  // Règles pour menuet/scherzo
  'minuet-trio': [
    {check: (secs) => {
      const trio = secs.find(s => s.type === 'trio');
      return trio && trio.degree !== 'IV' && trio.degree !== 'V' && trio.degree !== 'vi' && trio.degree !== 'VI';
    }, t:'tip', msg:{
      fr:'Le trio est traditionnellement en IV, V ou relatif.',
      en:'The trio is traditionally in IV, V or relative key.',
      es:'El trío es tradicionalmente en IV, V o relativo.'}},
    {check: (secs) => !secs.some(s => s.type === 'menuet-dc'), t:'info', msg:{
      fr:'Le menuet D.C. (da capo) marque le retour du menuet.',
      en:'Minuet D.C. (da capo) marks the return of the minuet.',
      es:'El minueto D.C. (da capo) marca el retorno del minueto.'}}
  ],
  'scherzo-trio': [
    {check: (secs) => {
      const trio = secs.find(s => s.type === 'trio');
      return trio && trio.degree !== 'IV' && trio.degree !== 'V' && trio.degree !== 'vi' && trio.degree !== 'VI';
    }, t:'tip', msg:{
      fr:'Le trio est généralement en IV, V ou ton relatif.',
      en:'The trio is usually in IV, V or relative key.',
      es:'El trío suele estar en IV, V o tonalidad relativa.'}}
  ],
  
  // ═══ RÈGLES POUR FUGUES ═══
  'fugue-gedalge-3v': [
    {check: (secs) => {
      const hasSubject = secs.some(s => s.type === 'subject');
      const hasAnswer = secs.some(s => s.type === 'answer');
      return !hasSubject || !hasAnswer;
    }, t:'warn', msg:{
      fr:'L\'exposition doit présenter le sujet (S) et la réponse (R).',
      en:'The exposition must present the subject (S) and answer (R).',
      es:'La exposición debe presentar el sujeto (S) y la respuesta (R).'}},
    {check: (secs) => {
      const answer = secs.find(s => s.type === 'answer');
      return answer && answer.degree !== 'V';
    }, t:'warn', msg:{
      fr:'La réponse doit être à la dominante (V).',
      en:'The answer must be at the dominant (V).',
      es:'La respuesta debe estar en la dominante (V).'}},
    {check: (secs) => !secs.some(s => s.type === 'countersubject'), t:'tip', msg:{
      fr:'Un contre-sujet régulier renforce la cohérence.',
      en:'A regular countersubject strengthens coherence.',
      es:'Un contrasujeto regular refuerza la coherencia.'}},
    {check: (secs) => !secs.some(s => s.type === 'stretto'), t:'tip', msg:{
      fr:'Une strette finale renforce la conclusion.',
      en:'A final stretto strengthens the conclusion.',
      es:'Un estrecho final refuerza la conclusión.'}},
    {check: (secs) => !secs.some(s => s.type === 'pedal-dominant'), t:'info', msg:{
      fr:'Une pédale de dominante avant la coda crée une tension efficace.',
      en:'A dominant pedal before the coda creates effective tension.',
      es:'Un pedal de dominante antes de la coda crea tensión efectiva.'}}
  ],
  'fugue-gedalge-4v': [
    {check: (secs) => {
      const subjects = secs.filter(s => s.type === 'subject' || s.type === 'answer');
      return subjects.length < 4;
    }, t:'warn', msg:{
      fr:'L\'exposition à 4 voix présente S→R→S→R.',
      en:'4-voice exposition presents S→A→S→A.',
      es:'La exposición a 4 voces presenta S→R→S→R.'}},
    {check: (secs) => !secs.some(s => s.type === 'counter-exposition'), t:'tip', msg:{
      fr:'Une contre-exposition enrichit la fugue à 4 voix.',
      en:'A counter-exposition enriches the 4-voice fugue.',
      es:'Una contraexposición enriquece la fuga a 4 voces.'}},
    {check: (secs) => secs.filter(s => s.type === 'stretto').length < 2, t:'info', msg:{
      fr:'Les fugues à 4 voix comportent souvent plusieurs strettes.',
      en:'4-voice fugues often feature multiple strettos.',
      es:'Las fugas a 4 voces suelen tener múltiples estrechos.'}}
  ],
  'fugue-double': [
    {check: (secs) => {
      const subjects = secs.filter(s => s.type === 'subject').length;
      const csSubjects = secs.filter(s => s.type === 'countersubject').length;
      return subjects < 2 && csSubjects < 1;
    }, t:'warn', msg:{
      fr:'La fugue double nécessite deux sujets distincts.',
      en:'Double fugue requires two distinct subjects.',
      es:'La fuga doble requiere dos sujetos distintos.'}},
    {check: (secs) => !secs.some(s => s.type === 'development' && (s.label.includes('S1+S2') || s.label.includes('Réunion'))), t:'tip', msg:{
      fr:'La réunion des deux sujets est le point culminant de la fugue double.',
      en:'The combination of both subjects is the climax of the double fugue.',
      es:'La reunión de ambos sujetos es el punto culminante de la fuga doble.'}}
  ],
  'fugue-renversement': [
    {check: (secs) => {
      const hasRectus = secs.some(s => s.label && s.label.includes('rectus'));
      const hasInversus = secs.some(s => s.label && s.label.includes('inversus'));
      return !hasRectus || !hasInversus;
    }, t:'warn', msg:{
      fr:'La fugue par renversement présente le sujet rectus puis inversus.',
      en:'Inversion fugue presents the subject rectus then inversus.',
      es:'La fuga por inversión presenta el sujeto rectus y luego inversus.'}},
    {check: (secs) => !secs.some(s => s.type === 'stretto'), t:'tip', msg:{
      fr:'Combiner rectus et inversus en strette finale est très efficace.',
      en:'Combining rectus and inversus in final stretto is very effective.',
      es:'Combinar rectus e inversus en estrecho final es muy efectivo.'}}
  ],
  'fugue-libre': [
    {check: (secs) => secs.filter(s => s.type === 'divertissement').length < 2, t:'info', msg:{
      fr:'La fugue libre comporte généralement plusieurs épisodes modulants.',
      en:'Free fugue typically includes multiple modulating episodes.',
      es:'La fuga libre suele incluir múltiples episodios modulantes.'}},
    {check: (secs) => !secs.some(s => s.type === 'pedal-dominant'), t:'tip', msg:{
      fr:'Une pédale de dominante avant la conclusion est courante (style Bach).',
      en:'A dominant pedal before the conclusion is common (Bach style).',
      es:'Un pedal de dominante antes de la conclusión es común (estilo Bach).'}}
  ]
};

function FM_renderAlerts(){
  const bar=document.getElementById('fm_alertsBar');const alerts=[];
  const secs=FM_curSections();const mode=FM_curMode();const fid=FM_state.isMultiMovement?FM_curFormId():FM_state.formId;
  
  // Appliquer les règles spécifiques à la forme
  if(FM_RULES[fid]){
    FM_RULES[fid].forEach(rule => {
      if(rule.check(secs, mode)){
        const msg = rule.msg[currentLang] || rule.msg.fr;
        alerts.push({t: rule.t, m: msg});
      }
    });
  }
  
  // Règles générales applicables à toutes les formes
  const noMeas=secs.filter(s=>!s.measures||s.measures===0);
  if(noMeas.length>0&&secs.length>2) alerts.push({t:'info',m:noMeas.length+(tx(' section(s) sans nombre de mesures défini.',' section(s) with no measure count defined.',' sección/secciones sin número de compases definido.'))});
  
  // Vérification cadence finale
  if(secs.length>0){
    const last=secs[secs.length-1];
    if(last.cadence!=='PAC'&&last.cadence!=='plagal') {
      alerts.push({t:'tip',m:tx('La dernière section devrait se terminer par une cadence conclusive (CAP ou plagale).','The last section should end with a conclusive cadence (PAC or plagal).','La última sección debería terminar con una cadencia conclusiva (CAP o plagal).')});
    }
  }

  bar.innerHTML=alerts.slice(0,4).map(a=>'<div class="alert-chip '+a.t+'"><span class="alert-icon">'+(a.t==='warn'?'⚠️':a.t==='tip'?'💡':'ℹ️')+'</span>'+a.m+'</div>').join('');
}

// ORCHESTRATION
function FM_getOrch(){
  if(FM_state.isMultiMovement){const m=FM_state.movements[FM_state.activeMovementIdx];return m?.orchestration||[]}
  return FM_state.orchestration||[];
}
function FM_setOrch(ids){
  if(FM_state.isMultiMovement){const m=FM_state.movements[FM_state.activeMovementIdx];if(m)m.orchestration=ids}
  else FM_state.orchestration=ids;
}
function FM_showOrchModal(){
  const cur=FM_getOrch();
  let h='<div style="margin-bottom:10px"><span style="font-size:11px;color:var(--txt2)">'+(tx('Préréglages :','Presets:','Preajustes:'))+'</span> <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">';
  Object.entries(FM_ORCH_PRESETS).forEach(([id,p])=>{h+='<button class="tbtn sm" onclick="FM_applyOrchPreset(\''+id+'\')">'+tFM(p.n)+'</button>'});
  h+='</div></div>';
  FM_INSTRUMENTS.forEach(fam=>{
    h+='<div class="orch-family"><div class="orch-family-label">'+tFM(fam.fam)+'</div><div class="orch-grid">';
    fam.items.forEach(inst=>{
      const on=cur.includes(inst.id)?'on':'';
      h+='<button class="orch-btn '+on+'" onclick="FM_toggleOrchInst(\''+inst.id+'\')">'+tFM(inst.n)+(inst.k?' <span class="orch-key">('+fmKey(inst.k.replace('en ',''))+')</span>':'')+'</button>';
    });
    h+='</div></div>';
  });
  document.getElementById('fm_orchContent').innerHTML=h;
  document.getElementById('fm_orchModal').classList.add('show');
}
function FM_toggleOrchInst(id){
  const cur=FM_getOrch();const idx=cur.indexOf(id);
  if(idx>=0)cur.splice(idx,1);else cur.push(id);
  FM_setOrch(cur);FM_showOrchModal();FM_render();
}
function FM_applyOrchPreset(presetId){
  const p=FM_ORCH_PRESETS[presetId];if(!p)return;
  FM_setOrch([...p.ids]);FM_showOrchModal();FM_render();
}
function FM_orchSummary(ids){
  if(!ids||!ids.length)return'';
  const allInst={};FM_INSTRUMENTS.forEach(f=>f.items.forEach(i=>{allInst[i.id]=i}));
  return ids.map(id=>{const i=allInst[id];return i?(tFM(i.n)+(i.k?' ('+fmKey(i.k.replace('en ',''))+')':'')):id}).join(', ');
}
function FM_orchSummaryPDF(ids){
  if(!ids||!ids.length)return'';
  const allInst={};FM_INSTRUMENTS.forEach(f=>f.items.forEach(i=>{allInst[i.id]={...i,fam:''}}));
  FM_INSTRUMENTS.forEach(f=>f.items.forEach(i=>{allInst[i.id].fam=f.fam}));
  const grouped={};
  ids.forEach(id=>{const inst=allInst[id];if(!inst)return;if(!grouped[inst.fam])grouped[inst.fam]=[];grouped[inst.fam].push(inst.n+(inst.k?' <i style="color:#9ca3af">('+inst.k+')</i>':''))});
  let h='<table style="width:auto;margin:8px 0 12px;border-collapse:collapse;font-size:11px">';
  Object.entries(grouped).forEach(([fam,items])=>{
    h+='<tr><td style="padding:3px 12px 3px 0;font-weight:600;color:#534AB7;vertical-align:top;white-space:nowrap;border-bottom:1px solid #f0f0f4">'+fam+'</td><td style="padding:3px 0;border-bottom:1px solid #f0f0f4">'+items.join(', ')+'</td></tr>';
  });
  h+='</table>';return h;
}

// FM_REPERTOIRE
function FM_showRepertoire(){
  const fid=FM_state.isMultiMovement?FM_curFormId():FM_state.formId;
  let h='';
  const allRep=Object.entries(FM_REPERTOIRE);
  // Show current form's examples first
  const cur=FM_REPERTOIRE[fid];
  if(cur&&cur.length){
    h+='<div class="modal-cat-title">'+(tx('Exemples pour : ','Examples for: ','Ejemplos para: '))+tFM(FM_FORMS[fid]?.name||fid)+'</div>';
    cur.forEach((r,i)=>{h+='<div class="rep-item" onclick="FM_loadRepertoire(\''+fid+'\','+i+')"><span class="rep-comp">'+r.comp+'</span><span class="rep-work">'+r.work+'</span><span class="rep-key">'+r.key+'</span></div>'});
  }
  // Then show all others
  allRep.forEach(([formId,examples])=>{
    if(formId===fid)return;
    const fn=FM_FORMS[formId]?.name||formId;
    h+='<div class="modal-cat-title">'+tFM(fn)+'</div>';
    examples.forEach((r,i)=>{h+='<div class="rep-item" onclick="FM_loadRepertoire(\''+formId+'\','+i+')"><span class="rep-comp">'+r.comp+'</span><span class="rep-work">'+r.work+'</span><span class="rep-key">'+r.key+'</span></div>'});
  });
  if(!h)h=(tx('<div style="color:var(--txt3);font-size:12px;padding:8px">Aucun exemple disponible pour le moment.</div>','<div style="color:var(--txt3);font-size:12px;padding:8px">No examples available at this time.</div>','<div style="color:var(--txt3);font-size:12px;padding:8px">Por el momento no hay ejemplos disponibles.</div>'));
  document.getElementById('fm_repContent').innerHTML=h;
  document.getElementById('fm_repModal').classList.add('show');
}
function FM_loadRepertoire(formId,idx){
  const examples=FM_REPERTOIRE[formId];if(!examples||!examples[idx])return;
  const r=examples[idx];const d=r.data;
  FM_state.formId=d.formId;FM_state.isMultiMovement=false;FM_state.movements=[];
  FM_state.globalKey=d.globalKey;FM_state.globalMode=d.globalMode;
  FM_state.sections=d.sections.map(s=>Object.assign({},s,{id:FM_uid()}));
  FM_state.name=r.comp+' — '+r.work;FM_state.selectedId=null;
  document.getElementById('fm_projName').value=FM_state.name;
  document.getElementById('fm_globalKey').value=d.globalKey;
  document.getElementById('fm_globalMode').value=d.globalMode;
  FM_closeModal('fm_repModal');FM_render();
  FM_showToast('Exemple chargé : '+r.work);
}

// JSON EXPORT/IMPORT
function FM_exportJSON(){
  const data={name:FM_state.name,formId:FM_state.formId,globalKey:FM_state.globalKey,globalMode:FM_state.globalMode,isMultiMovement:FM_state.isMultiMovement,sections:FM_state.sections,movements:FM_state.movements,orchestration:FM_state.orchestration,orchMode:FM_state.orchMode,version:1};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=(FM_state.name||'projet').replace(/[^a-zA-Z0-9àâéèêëîïôùûüçÀÂÉÈ\s-]/g,'').trim().replace(/\s+/g,'-')+'.json';
  a.click();URL.revokeObjectURL(a.href);
  FM_showToast('JSON exporté ✓');
}
function FM_importJSON(){document.getElementById('fm_jsonFileInput').click()}
function FM_handleJSONImport(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(ev){
    try{
      const d=JSON.parse(ev.target.result);
      FM_state.name=d.name||'Import';FM_state.formId=d.formId||'sonata';FM_state.globalKey=d.globalKey||'Do';FM_state.globalMode=d.globalMode||'major';
      FM_state.isMultiMovement=!!d.isMultiMovement;FM_state.sections=d.sections||[];FM_state.movements=d.movements||[];
      FM_state.orchestration=d.orchestration||[];FM_state.orchMode=d.orchMode||'global';
      FM_state.selectedId=null;FM_state.activeMovementIdx=0;
      document.getElementById('fm_projName').value=FM_state.name;
      document.getElementById('fm_globalKey').value=FM_state.globalKey;
      document.getElementById('fm_globalMode').value=FM_state.globalMode;
      FM_render();FM_showToast('Projet importé ✓');
    }catch(err){FM_showToast('Erreur : fichier JSON invalide')}
  };
  reader.readAsText(file);e.target.value='';
}

try{['fm_addModal','fm_savesModal','fm_addMvtModal','fm_orchModal','fm_repModal'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('click',function(e){if(e.target===this)FM_closeModal(id)})});}catch(e){console.error('FM modal init:',e)}
try{document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){FM_closeModal('fm_addModal');FM_closeModal('fm_savesModal');FM_closeModal('fm_addMvtModal');FM_closeModal('fm_orchModal');FM_closeModal('fm_repModal');FM_closeModal('fm_templatesModal')}
  if(e.key==='Delete'&&FM_state.selectedId&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))FM_delSectionById(FM_state.selectedId);
  if((e.ctrlKey||e.metaKey)&&e.key==='z'&&!e.shiftKey){e.preventDefault();FM_undo()}
  if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.key==='z'&&e.shiftKey))){e.preventDefault();FM_redo()}
});}catch(e){console.error('FM keydown:',e)}
try{FM_init();}catch(e){console.error('FM direct init:',e)}

/* ── Init auto ── */
try{ FM_init(); }catch(e){console.error('FM:',e)}
