# Procédures à respecter pour « Importer dans les locaux de l’UMR SAS des échantillons de sols prélevés hors de Bretagne »


Version 2 du 15 avril 2026

validée par P. Prigent, inspecteur phytosanitaire du SRAL

## 1.1. Introduction

Par un règlement de la Commission Européenne en date du 28 novembre 2019 (règlement
UE 2019/2072), la région Bretagne est reconnue comme une zone ^[1]protégé 

(ZP) vis-à-vis du
virus de la rhizomanie : c’est la seule région de France à avoir ce statut de zone protégée^1 et
la réception en Bretagne d’échantillons de sol prélevés en dehors de la région, est soumis à
des obligations réglementaires spécifiques que l’UMR SAS se doit de respecter.

Le statut de zone protégée implique que la mise en circulation de sol vers la Bretagne
nécessite un _passeport phytosanitaire zone protégée_ (PPZP) attestant de la conformité à la
réglementation : il faut ainsi pouvoir prouver que la parcelle naturelle ou cultivée qui est
échantillonnée n’a pas connu une culture de betterave, plante hôte du virus, depuis au moins
15 ans.

Cette fiche synthétique a pour objectif de récapituler l’ensemble des procédures qu’il faut
respecter pour pouvoir importer dans les locaux de l’UMR SAS situés en Bretagne des
échantillons de sol prélevés dans une zone non protégée située en France ou dans un pays
de la communauté européenne.

## I. Les questions à se poser

Tout agent de l’UMR envisageant d’importer des échantillons de sol prélevés hors de Bretagne,
doit dès le départ du projet répondre aux questions du logigramme de la figure 1 et détaillées
ci-dessous :

## Question 1 : où l’échantillon de sol est-il prélevé?

Trois cas de figure se présentent :

1. Si l’échantillon est prélevé en Bretagne, le passeport phytosanitaire n’est pas requis,
    mais l’échantillon doit être référencé dans la base d’échantillons de l’UMR SAS pour
    en assurer la traçabilité ;
2. Si l’échantillon est prélevé dans d’autres régions françaises ou dans des zones non
    protégées d’un pays de la Communauté Européenne, il doit provenir d’une parcelle
    autorisée à recevoir un passeport phytosanitaire et être marqué par une étiquette
    conforme de ce passeport ;
3. Si l’échantillon provient d’un pays hors Communauté Européenne, il ne peut être
    réceptionné dans les locaux de l’UMR SAS.

^[1]: Quatre autres régions européennes ont ce statut de zone protégée contre la rhizomanie : l’Irlande, Les Açores
(Portugal), la Finlande et l’Irlande du Nord (Royaume-Uni). Des échantillons qui proviendraient directement de
ces zones protégées n’auraient pas besoin de passeport phytosanitaires.


_Figure 1 : Logigramme pour la réception d’échantillons de sols dans les locaux de l’UMR SAS en Bretagne_

#### Question 2 : Est-ce qu’il y a présence de betteraves dans le passé cultural

#### de la parcelle échantillonnée au cours des 15 dernières années?

Pour qu’une parcelle située hors Bretagne puisse recevoir un passeport phytosanitaire, il faut
documenter le fait que cette parcelle n’a pas reçu de betteraves sucrières ou fourragères au
cours des 15 dernières années.

Dès la première phase du projet, il est donc indispensable d’établir l’historique cultural de la
parcelle au cours des 15 dernières années. Les étapes pour le faire sont les suivantes :

1. Obtenir les coordonnées géographiques (longitude et latitude exprimées en WGS 84
    décimal) d’un point situé au centre de la parcelle d’intérêt ;
2. Dans le cas d’une parcelle cultivée : interroger le Référentiel Graphique Parcellaire
    (RPG) sur les 15 dernières années et compléter les informations en interrogeant
    l’exploitant de la parcelle.

```
L’API RPG disponible sur le serveur GEOSAS de l’UMR^2 permet d’interroger le
Référentiel Parcellaire Graphique et d’identifier un groupe de cultures par îlot de
parcelles pour les années avant 2015 et une culture par parcelle après 2015. Les
cultures des deux dernières années ne sont par contre pas renseignées du fait des délais
de mise en ligne des informations.
```
(^2) Accessible dans la rubrique « Portails thématiques » : https://geosas.fr/rhizomanie. Vous pouvez aussi
directement utiliser l’outil _Trace_ développé par M. Adam (Cf. § page 4)


```
Plusieurs situations peuvent se rencontrer :
```
```
a) Une culture de betterave est présente après 2015 : en l’état, la parcelle ne
peut recevoir de passeport phytosanitaire et aucun échantillon de sol
provenant de cette parcelle ne peut être réceptionné en Bretagne : se rendre
alors à la question 3 du logigramme.
b) Il n’y a pas de betteraves après 2015 et aucun groupe de cultures pouvant
inclure des betteraves n’est identifié avant 2015 : il faut alors interroger
l’exploitant de la parcelle sur les cultures en place pour les années récentes
non renseignées dans le RPG, pour qu’il certifie de l’absence de betteraves
également sur ces années-là.
c) Il n’y a pas de betteraves après 2015, mais un groupe de cultures pouvant
inclure des betteraves est identifié avant 2015 : il faut alors interroger
l’exploitant de la parcelle sur les cultures en place pour les années avant 2015
et les années récentes non renseignées dans le RPG, pour qu’il certifie de
l’absence de betteraves au cours des 15 dernières années.
```
3. Dans le cas d’une parcelle non cultivée : interroger une couche donnant l’occupation
    du sol, par exemple sur le site cartes.gouv.fr pour une parcelle située en France

#### Question 3 : Est-ce qu’un test de rhizomanie a été effectué sur la

#### parcelle et ce test est-il négatif?

Philippe Prigent, inspecteur phytosanitaire du Service Régional de l’Alimentation (SRAL) de la
DRAAF-Bretagne^3 , a confirmé le 3 mars 2026 la possibilité de réaliser un test homologué de
rhizomanie, pour permettre si le résultat est négatif, l’attribution d’un passeport phytosanitaire
sur une parcelle avec un passé de betteraves.

Les conditions devant être vérifiées par "constatation officielle", les prélèvements et analyses
doivent être réalisés par une autorité compétente (ou son délégataire) ou par l'opérateur
professionnel autorisé à délivrer les passeports phytosanitaires (ce qui correspond à un
opérateur professionnel "sous supervision de l'autorité compétente"). Le SRAL a autorisé
l’UMR SAS à délivrer des passeports phytosanitaires et à ce titre nous autorise également à
effectuer nous-mêmes les prélèvements de sol permettant de faire ce test. Pour cela :

- Le prélèvement doit respecter les consignes d’échantillonnage 4 délivrées par
    l’ANSES pour prélever des échantillons permettant de faire un test biologique
    permettant la détection du virus de la rhizomanie (Beet necrotic yellow vein virus,
    BNYVV).
- Les échantillons doivent être transmis au laboratoire Eurofins^5 , seul laboratoire agréé
    en France pour réaliser le test de détection du virus BNYVV selon la méthode
    ANSES/LSV/MA061^6

Aucun passeport phytosanitaire ne peut être délivré sans confirmation d’un résultat négatif
du test biologique et les échantillons de sol de la parcelle d’intérêt ne peuvent donc entrer en
Bretagne avant réception des résultats transmis par le laboratoire Eurofins.

(^3) Il s’agit du correspondant du SRAL pour l’UMR SAS sur ces questions (philippe.prigent@agriculture.gouv.fr ; 02
99 28 21 32)
(^4) Le protocole de l’ANSES est accessible à l’adresse :
https://www.anses.fr/system/files/ANSES_LSV_MA061_V1.pdf
(^5) Eurofins, Laboratoire de Pathologie Végétale, 81 rue Bernard Palissy 62750 Loos e-en-Gohélie. Contact :
Christophe Wattier, responsable Qualité et R&D, Christopher.Wattier@ftfr.eurofins.com, 03 32 42 62 15
(^6) En février 2026, le prix d’un test facturé par Eurofins est de 293 euros HT par échantillon, à quoi il faut ajouter
le coût du transport.


## II. La création d’un passeport phytosanitaire

Le Service Régional de l’Alimentation de la DRAAF Bretagne a attribué à l’UMR SAS le
numéro d’immatriculation BR13551 lui permettant d’éditer des passeports phytosanitaires pour
des parcelles autorisées.

Pour cela, l’UMR s’engage à respecter cinq conditions :

1. Le passeport phytosanitaire n’est attribué qu’à une parcelle sans passé de betteraves
    au cours des 15 dernières années ou avec la preuve d’un test négatif de rhizomanie.
2. La traçabilité de tout échantillon de sol doit être intégrale depuis son lieu de
    prélèvement jusqu’à sa destruction finale, en passant par toutes les étapes d’analyses
    et d’archivages des échantillons. Au cours de ce cycle de vie, l’étiquette du passeport
    phytosanitaire doit être apposée sur tous les contenants d’un échantillon prélevé hors
    de Bretagne, y compris d’éventuels aliquotes.
3. Un inspecteur du Service Régional de l’Alimentation (SRAL) fait une inspection
    phytosanitaire annuelle pour s’assurer de la traçabilité des échantillons et du respect
    des procédures.
4. L’UMR transmet au SRAL, en chaque début d’année, une déclaration indiquant le
    nombre de parcelles hors Bretagne qu’elle envisage d’échantillonner et transmet
    également en fin d’année un bilan d’activité.
5. Tout échantillon de sol muni d’un passeport phytosanitaire doit être détruit à travers
    une filière spécialisée de traitement des déchets.

### 1.1. Comment créer une étiquette de passeport

### phytosanitaire?

Quand les conditions permettant de délivrer un passeport phytosanitaire sont remplies, la
création d’un passeport par parcelle peut se faire à travers l’outil développé par Mario Adam
de l’UMR SAS.^7

Cet outil a été développé en premier lieu pour assurer la traçabilité de tout échantillon de sol
entrant dans les locaux de l’UMR SAS et ce, quelle que soit son origine géographique : cela
se traduit par la création d’une étiquette d’identification de chaque échantillon (Figure 2a) où
figure un numéro unique d’échantillon permettant son identification tout au long de son
parcours d’analyse en lien avec les bases de données qui le caractérisent. Cette traçabilité
inclue la phase de stockage de l’échantillon avant sa destruction finale, dans un lieu qui devra
être clairement identifié (et le cas échéant actualisé dans la base) pour permettre à l’inspecteur
de retrouver un échantillon lors de son contrôle annuel.

Cet outil permet également dans le cas d’échantillons de sol prélevés hors de Bretagne de
créer, si les conditions sont réunies, de créer un passeport phytosanitaire par parcelle qui se
matérialise par l’impression d’une seconde étiquette (Figure 2b) répondant aux exigences
réglementaires et devant être accolée sur tous les contenants de cet échantillon au cours de
son cycle d’analyse. Plusieurs échantillons prélevés dans une même parcelle auront donc la
même étiquette de passeport phytosanitaire.

(^7) L’outil Trace développé par M. Adam est accessible via l’intranet de l’UMR : l’essentiel de l’intranet =>
traçabilité des échantillons


##### A B

_Figure 2 - Exemple des deux étiquettes fournies pour un échantillon de sol prélevé hors de Bretagne : (A)
Etiquette d’identification de l’échantillon ; (B) Etiquette du passeport phytosanitaire de la parcelle d’origine de
l’échantillon._

### 1.2. La destruction d’un échantillon prélevé hors de Bretagne

Tout échantillon de sol prélevé hors de Bretagne doit être identifié par son étiquette de
passeport phytosanitaire tout au long de son cycle de vie au sein de l’UMR SAS, depuis son
prélèvement initial jusqu’à sa destruction finale, en passant par toutes les étapes
intermédiaires d’analyse et de stockage. Lors de l’inspection annuelle, l’inspecteur du SRAL
pourra sélectionner un échantillon quelconque et vérifier sa bonne traçabilité, notamment ses
lieux et dates de prélèvement, tout en vérifiant que les conditions de délivrance d’un passeport
phytosanitaire étaient bien remplies.

La destruction finale d’un échantillon sous passeport phytosanitaire doit nécessairement se
faire via un circuit agréé de destruction, en mobilisant les contrats d’évacuation de l’INRAE ou
de l’Institut Agro :

- via l’INRAE : marché du centre INRAE avec Séché Healthcare pour les « Déchets d'activités
de soins à risque infectieux et assimilés » (DASRI)^8
- via l’Institut Agro : en contactant le responsable du service Santé, Sécurité au Travail^9

(^8) Contact : Anne Lemoine, Conseillère Prévention de Centre Adjointe, voir :
https://rennes.intranet.inrae.fr/appui-a-la-recherche/prevention/environnement/dechets/filieres-dechets/dasri
(^9) Contact : Eric Mortreau, Responsable Service Santé Sécurité au Travail, eric.mortreau@institut-agro.fr


