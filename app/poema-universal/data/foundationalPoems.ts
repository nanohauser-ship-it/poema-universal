export type FoundationalBookPoem = {
  id: string;
  poetName: string;
  country: string;
  title: string;
  poem: string;
  originalLabel: string;
  translation?: string;
  translationLabel?: string;
};

export const FOUNDATIONAL_BOOK_POEMS: FoundationalBookPoem[] = [
  {
    id: "jose-naveiro-01",
    poetName: "José Naveiro",
    country: "Galicia · España",
    title: "El huerto",
    originalLabel: "Original · Español",
    poem: `Muchos años después,
cavé la tierra para hacer un huerto.

A la tercera palada,
la tierra me devolvió
los huesos del perro
que había enterrado con mis manos.

Me quedé inmóvil.

En la curva de sus costillas
aún resonaba un ladrido,
como si la muerte
no hubiera conseguido cerrarlo.

Aparté la tierra con cuidado.
Toqué el polvo que lo rodeaba
y sentí un poco de calor.

Quizá no estaba allí.
Quizá era mi mano
recordando su cuerpo.

Volví a cubrirlo.

Sobre aquel lugar
planté un árbol.

Desde entonces,
cuando el viento mueve sus ramas,
algo corre hacia mí
desde el fondo de la tierra.`,
  },
  {
    id: "asataka-02",
    poetName: "ASATAKA",
    country: "Japón · 日本",
    title: "La luz regresa descalza",
    originalLabel: "Original · 日本語",
    translationLabel: "Traducción · Español",
    poem: `いい意味で死にそうになる景色だね。
そう貴方は言う。
硬い線路の上を浮遊する貴方は
惑星の内部に詩の誕生を告げて
ページとページのあいだで材質をつくり
背表紙に触知する花弁に真実在を眠らせる。
そうして貴方の中扉と景色との創造は
丁度層で止まる空気のような
振動をつづる形で
私のめくれかけた表紙に留まりながら
名を閉じない。
光は光から返ってくる素足の
残像。`,
    translation: `«Es un paisaje que casi podría matarte,
en el mejor de los sentidos».
Eso dices.

Tú, que flotas sobre las vías rígidas,
anuncias en el interior del planeta
el nacimiento de un poema;
creas materia entre una página y otra
y haces dormir la verdadera existencia
en pétalos palpables sobre el lomo.

Así, la creación de tu portadilla
y del paisaje
traza una vibración,
como el aire detenido
en una capa precisa;
permanece sobre mi cubierta
a punto de abrirse,
sin cerrar el nombre.

La luz es la imagen persistente
de unos pies descalzos
que regresan de la luz.`,
  },
  {
    id: "azucena-03",
    poetName: "Azucena",
    country: "México",
    title: "Habitación blanca",
    originalLabel: "Original · Español",
    poem: `Ya no pude seguir.

En algún lugar,
entre el olor del desinfectante
y la luz que nunca se apagaba,
comprendí
que había dejado de soñar.

—Una dosis más.

La frase cayó
como una llave
cerrando otra puerta.

No pregunté.
Había preguntas
que ya nacían cansadas.

¿Cuántas píldoras
hacen falta
para dormir el miedo?

Me prometí comer,
pero la ansiedad
siempre llegaba primero
y ocupaba mi silla.

Las flores del jardín
eran el único lugar
donde el mundo
todavía respiraba despacio.

Me tumbaba entre ellas
para recordar
que aún existía un cielo.

«¿Con quién puedo hablar?»,
pregunté una tarde.

El silencio
fue el primero en responder.

Después llegaron
otros ojos.

Había tantas personas
cargando universos parecidos
que entendí
que el dolor
también aprende
a compartir habitación.

Perdóname,
vida mía.

Tendré que aprender
a fingir un poco,
a esconder
el temblor de las manos,
a vestir de calma
esta tormenta.

Pero si alguien
tiembla frente a mí,

escucharé.

Si alguien
cree que está solo,

me quedaré.

Porque incluso aquí,
donde parecía terminar el mundo,

todavía es posible
cuidarnos.`,
  },
  {
    id: "andres-giraldo-florez-04",
    poetName: "Andrés Giraldo Flórez",
    country: "Colombia",
    title: "El tiempo",
    originalLabel: "Original · Español",
    poem: `Cocinar es muy difícil.

Qué rico descansar…

Pero, si no trabajo,
no descanso.

¿Cuándo tendré tiempo para crear?

¿Cómo se compra el tiempo,
si para comprar tiempo
necesito tiempo?

Espero que, después de todos estos años de esforzarme,
todavía encuentre mi alma.`,
  },
  {
    id: "johan-martinez-05",
    poetName: "Johan Rodríguez Martínez",
    country: "Venezuela",
    title: "Lo que permanece",
    originalLabel: "Original · Español",
    poem: `Solo dos hombres.

Uno llevaba el miedo
como quien protege una lámpara del viento.

El otro
temía que el amor
nunca aprendiera a pronunciar su nombre.

Se encontraron
mucho antes de estrecharse las manos.

Hay almas
que se reconocen
por la manera en que sostienen el silencio.

No hicieron promesas.

Las promesas pertenecen
a quienes creen dominar el tiempo.

Ellos apenas compartieron
la gravedad de una mirada,
el temblor de una respiración,
la certeza inexplicable
de haber llegado demasiado tarde
y, sin embargo,
al lugar correcto.

Después vino la distancia.

Esa habitación inmensa
donde los cuerpos ya no están,
pero la memoria
continúa respirando.

Comprendieron entonces
que hay amores
que no nacieron para poseerse,
sino para enseñar
hasta dónde puede llegar
el corazón humano.

Desde entonces
uno habita la nostalgia.

El otro,
la esperanza.

Y entre ambos
permanece un puente invisible
que ninguna ausencia consigue derribar.

Porque existen fuegos
que no necesitan consumirse
para seguir dando luz.

Y cuando la noche
vuelve a cerrar los ojos del mundo,

todavía hay dos hombres
que se buscan en el mismo sueño,

como si el amor
fuera la única patria
de la que nadie
puede ser exiliado.`,
  },
  {
    id: "marco-indrio-06",
    poetName: "Marco Indrio",
    country: "Italia · Italy",
    title: "Solo dos hombres",
    originalLabel: "Original · Italiano",
    translationLabel: "Traducción · Español",
    poem: `Ci sono amori

che non imparano mai
a dire addio.

Restano
come il mare dopo il tramonto:
oscuri,
immensi,
incapaci di dimenticare la luce.

Eravamo due uomini.

Non due corpi,
ma due domande
in cerca di rifugio
nella stessa notte.

Uno temeva
di aprire le mani.

L'altro
che nemmeno due mani aperte
potessero bastare.

Ci siamo incontrati
nel luogo in cui il linguaggio finisce
e comincia il respiro dell'anima.

Non furono necessarie promesse.

Bastò il tremore
di uno sguardo trattenuto,
il lieve sfiorarsi
di due solitudini
che compresero
di essersi attese
per anni.

Poi arrivò la distanza,

quell'antica artigiana
che trasforma la presenza
in memoria.

E comprendemmo
che esistono abbracci
che continuano ad accadere
molto tempo dopo
che i corpi
si sono separati.

Da allora
cammino accompagnato
da un'assenza
che non pesa:

illumina.

Perché ci sono amori
che non hanno bisogno
di un destino
per essere eterni.

Basta
che siano esistiti
una sola volta

per continuare ad ardere
nel luogo più segreto
del cuore,

come una fiamma
che il tempo contempla,

ma che non riuscirà
mai a spegnere.`,
    translation: `Hay amores

que nunca aprenden
a despedirse.

Permanecen
como el mar después del atardecer:
oscuros,
inmensos,
incapaces de olvidar la luz.

Éramos dos hombres.

No dos cuerpos,
sino dos preguntas
buscando refugio
en la misma noche.

Uno temía abrir las manos.

El otro,
que ni siquiera unas manos abiertas
fueran suficientes.

Nos encontramos
en ese lugar donde el lenguaje termina
y comienza la respiración del alma.

No hicieron falta juramentos.

Bastó el temblor
de una mirada sostenida,
el leve roce
de dos soledades
que comprendieron
que llevaban años
esperándose.

Después llegó la distancia,

esa antigua artesana
que convierte la presencia
en memoria.

Y descubrimos
que existen abrazos
que siguen ocurriendo
mucho después
de que los cuerpos se hayan separado.

Desde entonces
camino acompañado
por una ausencia
que no pesa:

ilumina.

Porque hay amores
que no necesitan un destino
para ser eternos.

Les basta
haber existido una vez

para continuar ardiendo
en el lugar más secreto del corazón,

como una llama
que el tiempo contempla,

pero jamás consigue apagar.`,
  },
  {
    id: "cheik-senegal-07",
    poetName: "Cheik Ndiaye",
    country: "Sénégal · Senegal",
    title: "Je suis arrivé vivant",
    originalLabel: "Original · Français",
    translationLabel: "Traducción · Español",
    poem: `Je suis né là où le soleil
apprend aux enfants
que la vie commence souvent
par le manque.

J'ai perdu ma mère
à quatorze ans.

Ce jour-là,
je suis devenu plus vieux
que mon âge.

J'ai grandi
avec le silence comme compagnon,
le travail comme école,
et l'espérance
comme unique richesse.

Puis un matin,
j'ai regardé l'horizon.

On disait
que derrière la mer
existait un endroit
où un homme pouvait recommencer.

Je suis monté dans une pirogue.

Neuf jours
entre le ciel et l'eau.

Trois jours
sans manger.

Chaque vague
posait la même question :

« Veux-tu vivre ? »

Et chaque battement de mon cœur
répondait :

« Oui. »

Quand la terre est apparue,
je n'ai pas vu l'Europe.

J'ai vu
une nouvelle possibilité.

Je suis arrivé
sur l'île de La Gomera,
non avec des bagages,

mais avec une vie
que je refusais d'abandonner.

Aujourd'hui,
chaque pas que je fais
porte la mémoire
de ceux qui n'ont jamais atteint la rive.

Je marche aussi pour eux.

Parce que survivre
n'est pas seulement respirer.

C'est transformer la douleur
en avenir.`,
    translation: `Nací donde el sol
enseña a los niños
que la vida
muchas veces comienza
con la ausencia.

Perdí a mi madre
a los catorce años.

Aquel día
me hice más viejo
que mi propia edad.

Crecí
con el silencio por compañero,
el trabajo por escuela
y la esperanza
como única riqueza.

Hasta que una mañana
miré el horizonte.

Decían
que al otro lado del mar
existía un lugar
donde un hombre
podía volver a empezar.

Subí a un cayuco.

Nueve días
entre el cielo y el agua.

Tres días
sin comer.

Cada ola
me hacía la misma pregunta:

«¿Quieres vivir?»

Y cada latido de mi corazón
respondía:

«Sí.»

Cuando apareció la tierra,
no vi Europa.

Vi
una nueva posibilidad.

Llegué
a la isla de La Gomera,
no con equipaje,

sino con una vida
que me negaba a abandonar.

Hoy,
cada paso que doy
lleva también la memoria
de quienes nunca alcanzaron la orilla.

Camino también por ellos.

Porque sobrevivir
no es solo seguir respirando.

Es convertir el dolor
en futuro.`,
  },

  {
    id: "malika-ndlovu-09",
    poetName: "Malika Ndlovu",
    country: "Sudáfrica · South Africa",
    title: "Let the Wound Weep",
    originalLabel: "Original · English",
    translationLabel: "Traducción · Español",
    poem: `Let the wound weep
Let the wound weep
Mess with your sleep
Make you forget
To call or eat
Want to curl up
Hide from light
Knot your tongue
Your mind chattering
Scratched record
Through the night
Let it
Letting is never easy
But somehow part
Of the getting better
Getting over
Coming through
Even when you cannot see
Something vital
Is being retrieved
Let the wound weep
For its own coming
Into being
For all the time it took
For you to truly
Look at it
Naked and raw
Swollen and sore
Inflamed
Like never before
Once more
Let the wound weep
Rage, sob and howl
Hear its call
In solitude or crowds
Listen
For when and how
To answer
To play, stay shallow
Dive or sink deep
Let the wound weep
It knows why it exists
What it is here to teach
Not in the past
Or the future
Stay here
Grounded
By its presence
Let the wound weep
Breathe, go slowly
Healing is a dawning
Can feel like losing
Seem like burning
Drowning or dying
Only the wound knows
How many days or ways`,
    translation: `Deja que la herida llore
Deja que la herida llore
Que perturbe tu sueño
Que te haga olvidar
Llamar o comer
Que quieras acurrucarte
Esconderte de la luz
Que te anude la lengua
Tu mente parloteando
Como un disco rayado
Durante toda la noche
Déjala
Dejar nunca es fácil
Pero, de algún modo, forma parte
De empezar a estar mejor
De superarlo
De atravesarlo
Incluso cuando no puedas verlo
Algo vital
Está siendo recuperado
Deja que la herida llore
Por su propia llegada
A la existencia
Por todo el tiempo que hizo falta
Para que de verdad
La miraras
Desnuda y en carne viva
Hinchada y dolorida
Inflamada
Como nunca antes
Una vez más
Deja que la herida llore
Que rabie, solloce y aúlle
Escucha su llamada
En soledad o entre la multitud
Escucha
Cuándo y cómo
Responder
Jugar, quedarte en la superficie
Sumergirte o hundirte hasta el fondo
Deja que la herida llore
Sabe por qué existe
Lo que ha venido a enseñarte
No en el pasado
Ni en el futuro
Quédate aquí
Anclado
Por su presencia
Deja que la herida llore
Respira, ve despacio
Sanar es un amanecer
Puede sentirse como perder
Parecer que ardes
Que te ahogas o mueres
Solo la herida sabe
Cuántos días
O cuántos caminos`,
  },

  {
    id: "sasha-10",
    poetName: "Sasha",
    country: "Rusia · Россия",
    title: "ГАЛА",
    originalLabel: "Original · Русский",
    translationLabel: "Traducción · Español",
    poem: `ГАЛА

Оно уносит древнюю печаль
Оно переродится очень скоро
Меня разбив как трепетный хрусталь
И унесёт с собою Сальвадора

Расплавятся последние часы
Сломаются последние подпорки
И Фрейд свою последнюю мораль
Произнесет стыдливо и негромко

Единорог ждёт час своей любви
Чтоб рядом тонкий стан согнуть в движении
И расплываются как в море корабли
Лиц галлюциногенных выражения

Подпорки сломаны и женщины цветы
Совсем иной порочной чистоты.`,
    translation: `GALA

Se lleva consigo una tristeza antigua.
Muy pronto volverá a nacer,
después de quebrarme como frágil cristal,
y se llevará consigo a Salvador.

Se fundirán los últimos relojes,
se quebrarán los últimos soportes,
y Freud pronunciará su última moral
con pudor, en voz baja.

El unicornio aguarda la hora de su amor
para inclinar, junto a ella, su esbelto talle.
Y, como barcos que se pierden en el mar,
se desdibujan los gestos de rostros alucinógenos.

Los soportes están rotos. Y las mujeres, flores
de una pureza perversa, completamente distinta.`,
  },

  {
    id: "gabriel-11",
    poetName: "Gabriel",
    country: "Brasil · Brazil",
    title: "A Volta",
    originalLabel: "Original · Português",
    translationLabel: "Traducción · Español",
    poem: `Anseio
pela volta do que já não volta,
escrito por mãos quebradas
que nascem do rogo.

Regozijo
só se encontra dentro do incerto.

Ódio…
pelo que se tornou certo demais
e pelo meio que atina
a alma desconcertante.

Maldições e desesperanças,
tudo por voltar
ao que já não volta.

Ardor que já não agoniza,
sem força,
já que não move o inexistente.

O lar que já o foi
agora não se encontra
nem adentro.

Escapar para se perder
em um lugar diferente, porém.

O que se sacrificou para ter
aquilo que terás que sacrificar
para voltar,
onde não se volta mais.

A transformação jazia,
por medo do que um dia fora evolução.

Tornar-te como a filha em O Cavalo de Turim,
que lembrava
que a maior das realizações da potência
poderia tornar
a parte do destino que não se controla
em indiferença.

O ranger dos tão rígidos
reflete, ainda assim,
a dada importância do âmago
pela mudança.

E nesse
se atentará para a cura
das feridas que carregam
a pele imune pela emoção.

Mesmo sabendo então
sobre a força da vitalidade,
como, nesse mesmo momento,
reacendê-la
sem sacrificar
o que se recebeu depois do martírio?

E de que se alimenta
qualquer potência vital,
senão da dor?

Aquela que só através,
e mesmo sendo a causa,
poderia então conseguir,
sem conseguir nada,
alcançar a última esperança da volta.`,
    translation: `Anhelo
el regreso de aquello que ya no regresa,
escrito por manos quebradas
que nacen del ruego.

El gozo
solo se encuentra dentro de lo incierto.

Odio…
por aquello que se volvió demasiado cierto
y por el medio que alcanza
el alma desconcertante.

Maldiciones y desesperanzas,
todo por regresar
a aquello que ya no regresa.

Ardor que ya no agoniza,
sin fuerza,
pues no mueve lo inexistente.

El hogar que un día lo fue
ahora no se encuentra
ni siquiera dentro.

Escapar para perderse,
sin embargo,
en un lugar diferente.

Lo que se sacrificó para tener
aquello que tendrás que sacrificar
para regresar
adonde ya no se regresa.

La transformación yacía
por miedo a lo que un día fue evolución.

Volverte como la hija de El caballo de Turín,
que recordaba
que la mayor realización de la potencia
podría convertir
la parte del destino que no se controla
en indiferencia.

El crujir de los tan rígidos
refleja, aun así,
la importancia concedida por lo más íntimo
al cambio.

Y en ello
se atenderá a la cura
de las heridas que cargan
una piel inmune a la emoción.

Aun sabiendo entonces
de la fuerza de la vitalidad,
¿cómo, en ese mismo instante,
reavivarla
sin sacrificar
lo que se recibió después del martirio?

¿Y de qué se alimenta
toda potencia vital,
sino del dolor?

Aquel que solo atravesándolo,
y aun siendo la causa,
podría entonces conseguir,
sin conseguir nada,
alcanzar la última esperanza del regreso.`,
  },
];

export const FOUNDATIONAL_BOOK_POEMS_BY_POET = new Map(
  FOUNDATIONAL_BOOK_POEMS.map((poem) => [
    poem.poetName,
    poem,
  ]),
);
