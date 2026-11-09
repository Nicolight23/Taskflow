# IA utilisée : Codex / ChatGPT

<br>

## Prompt 1 : création du prompt optimal 

**Prompt :** A partir du diaporama fourni et la méthode page 23 (rôle, contexte, tâche, contraintes, format et exemples) propose moi le meilleur prompt qui réponde à ce qui est demandé dans la page 27.
Je veux que tu me donnes 5 à 8 user stories pour le projet taskflow.

**Résultat :**
```
Voici un prompt construit avec les six éléments de la page 23. Remplace [ma filière et sa fonctionnalité] avant de l’envoyer à l’IA.
Rôle : Tu es un développeur web qui aide des étudiants de première année à cadrer leur projet.
Contexte : Nous créons en binôme TaskFlow, une petite application web de gestion de tâches. Notre filière est [ma filière et sa fonctionnalité].
Tâche : Propose 5 à 8 user stories couvrant les fonctions essentielles de TaskFlow et notre fonctionnalité de filière.
Contraintes : L’application utilise HTML, CSS et JavaScript, sans framework, serveur ni base de données. Les tâches sont sauvegardées avec localStorage. Rédige des besoins réalisables à notre niveau, sans proposer de code.
Format : Fais une liste numérotée. Chaque story doit suivre la formule « En tant que…, je veux…, afin de… ».
Exemple : « En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de voir ce qu’il me reste à faire. » Termine en indiquant les points à préciser avec nous. 
```

**Gardé :** Rôle : Tu es un développeur web qui aide des étudiants de première année à cadrer leur projet.
Contexte : Nous créons en binôme TaskFlow, une petite application web de gestion de tâches.
Tâche : Propose 5 à 8 user stories couvrant les fonctions essentielles de TaskFlow.
Contraintes : L’application utilise HTML, CSS et JavaScript, sans framework, serveur ni base de données. Les tâches sont sauvegardées avec localStorage. Rédige des besoins réalisables à notre niveau, sans proposer de code.
Format : Fais une liste numérotée. Chaque story doit suivre la formule « En tant que…, je veux…, afin de… ».
Exemple : « En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de voir ce qu’il me reste à faire. » 
Termine en indiquant les points à préciser avec nous.

**Rejeté :** l'en-tête : Voici un prompt construit avec les six éléments de la page 23. Remplace [ma filière et sa fonctionnalité] avant de l’envoyer à l’IA. 
Ainsi que toute mention de la filière.

**Pourquoi :** La réponse ne nous à pas totalement convenu. Dans le prompt, il est toujours question de choisir sa filière ce qui est finalemant inutile. Il a aussi fallu enlever l'en-tête qu'il ne faut pas communiquer dans le prompt suivant.

<br>

## Prompt 2 : envoie du prompt optimal / création des user stories

**Prompt :** Rôle : Tu es un développeur web qui aide des étudiants de première année à cadrer leur projet.
Contexte : Nous créons en binôme TaskFlow, une petite application web de gestion de tâches.
Tâche : Propose 5 à 8 user stories couvrant les fonctions essentielles de TaskFlow.
Contraintes : L’application utilise HTML, CSS et JavaScript, sans framework, serveur ni base de données. Les tâches sont sauvegardées avec localStorage. Rédige des besoins réalisables à notre niveau, sans proposer de code.
Format : Fais une liste numérotée. Chaque story doit suivre la formule « En tant que…, je veux…, afin de… ».
Exemple : « En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de voir ce qu’il me reste à faire. » Termine en indiquant les points à préciser avec nous.  


<br>

**Résultat :** 
```
1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire.
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance.
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de distinguer le travail fait du travail restant.
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin.
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste.
```
<br>

**Nos modifications :**

1. : on ne comprend pas très bien ce que l'ia entend par "propriété". 
2. : tout va bien, ça nous va 
3. : en soit tout va bien mais on doit toujours éclaircir cette notion de "propriété"
4. : tout va bien, ça nous va 
5. : ce n'est pas parfait, on voudrait mettre les tâches complétées dans un compartiment à part (peut-être rajouté un user stori ?)
6. : tout va bien, ça nous va 
7. : tout va bien, ça nous va (c'est une consigne)

<br>

**Nos conclusion :** 

Nous avons choisi de garder tel quel les user stories suivant : <br>
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides. <br>
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire. <br>
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance. <br>
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin. <br>
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste. <br>

Nous avons aussi choisi de demander à l'ia de modifier les user stories 1 et 5, ce qui pourrait amener à la création d'un nouveau user story. 

## Prompt 3 : Affinage des deux prompt que nous n'avions pas encore gardés

**Prompt :**
Il y a 2 points que je veux revoir :
- Premièrement : je ne comprends pas très bien ce que tu entends par "propriété" dans les user stories 1 et 3. 
- Deuxième : pour le user story 5, je voudrais le compléter. Je veux que les tâches complétées soient dans un compartiment à part. Pour ce point, je me pose la question de s'il est nécéssaire de créer un nouveau user story ?

**Résultat :** 
```
Tu veux sans doute dire **« priorité »**, le mot utilisé dans les stories 1 et 3. C’est le degré d’importance d’une tâche : par exemple *haute*, *moyenne* ou *basse*. Dans la story 1, tu choisis cette priorité quand tu ajoutes la tâche ; dans la story 3, tu peux la voir dans la liste.

Pour les tâches terminées, **oui, je créerais une story distincte**. Marquer une tâche comme terminée et la ranger dans un espace séparé sont deux comportements que vous pourrez vérifier séparément. Cela vous fait 8 stories au total.

Voici les deux stories concernées, reformulées :

5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.

Vous pouvez appeler cette section **« Tâches terminées »** dans l’application.
```
<br>

**Gardé :** <br>
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.<br>
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.<br>

**Pourquoi :** on s'est rendu compte qu'on avait compris "priorité" au lieu de "propriété" donc le user story 1 nous va parfaitement finalement. Les nouveaux user stories nous conviennent. 

**Nos conclusion :** Nous avons fini de réaliser les user stories. On doit maintenant réaliser l'architecture. 


## Prompt 4 : Création de l'arborescence 

**Prompt :** Fait moi l'arborescence du projet pour que je puisse la mettre dans mon .md (en sachant qu'il faudra rajouter un index.hmtl et un style.css)

**Résultat :** 
```
taskflow/
├── index.html    # Page de l'application
├── style.css     # Apparence de l'application
├── app.js        # Gestion des tâches et sauvegarde
├── README.md     # Présentation du projet et user stories
└── PROMPTS.md    # Consignes données à l'IA et choix du binôme
```



Prompt : 

A partir des user stories, de la structure de l'application et de l'image fourni, créer les fonctions de bases : créer, afficher,
modifier, supprimer, terminer

<br>

Structure de l'application :

Titre de l'appli

Création d'une tâche avec : 
- le titre de la tâche
- priorité (Pas Urgent, Moyen Urgent, Urgent) dans un menu déroulant
- date d'échéance dans le format jj/mm/aaa
- bouton pour ajouter la tâche 

Filtres pour sélectionner les tâches : "Toutes", "A faire", "Terminer"

Liste des toutes les tâches 


<br>

User Stories : 
1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire. 
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance. 
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin. 
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste. 
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.


## Prompt 5 : création du prompt optimal pour le sprint 1

**Prompt :** 

Je te donne un prompt. Met toi à la place d'un developper DevSecOps senior et affine le moi pour qu'il soit le plus précis, le plus cadré et le plus optimisé pour livrer mon application et répondre au premier sprint du deuxième dispositif (slice 17/21) que j'ai téléchargé "Seance2_Outils_IA_Coder_Avec_l_IA.pdf". Voici le prompt : Prompt : 

A partir des user stories, de la structure de l'application et de l'image fourni, créer les fonctions de bases : créer, afficher,
modifier, supprimer, terminer

Structure de l'application :

Titre de l'appli

Création d'une tâche avec : 
- le titre de la tâche
- priorité (Pas Urgent, Moyen Urgent, Urgent) dans un menu déroulant
- date d'échéance dans le format jj/mm/aaa
- bouton pour ajouter la tâche
Filtres pour sélectionner les tâches : "Toutes", "A faire", "Terminer"

Liste des toutes les tâches 

User Stories : 
1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire.
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance.
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin.
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste.
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.

**Résultat :** 
```
Rôle
Tu es un développeur web senior qui accompagne deux étudiants de première année. Produis un code simple, lisible et que nous pouvons expliquer.

Contexte
Nous développons TaskFlow, une application de gestion de tâches en HTML, CSS et JavaScript natifs. Lis README.md et PROMPTS.md, puis examine les fichiers existants avant de les modifier.

User stories du projet
1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire.
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance.
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin.
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste.
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.

Tâche : sprint 1 uniquement
Implémente les stories 1 à 6 : créer, afficher, modifier, terminer et supprimer des tâches, avec le refus d’un titre vide.

Prévois une interface simple comprenant :
- le titre « TaskFlow » ;
- un formulaire avec le titre de la tâche, une liste de priorités (« Pas urgent », « Moyennement urgent », « Urgent »), une date d’échéance et un bouton « Ajouter » ;
- une liste qui affiche le titre, la priorité, l’échéance et l’état de chaque tâche ;
- les actions nécessaires pour modifier, terminer et supprimer chaque tâche.

Les stories 7 et 8 font partie du projet, mais ne sont pas à implémenter dans ce sprint. La sauvegarde avec localStorage et la mise en forme CSS approfondie sont prévues au sprint 2.

Contraintes techniques
- Utilise uniquement HTML, CSS et JavaScript natifs, sans framework, bibliothèque, serveur ni base de données.
- Sépare la structure dans index.html, la présentation minimale dans style.css et la logique dans app.js.
- Refuse un titre vide ou composé seulement d’espaces, avec un message compréhensible.
- Utilise un champ de date adapté et affiche les échéances au format jj/mm/aaaa.
- Donne un identifiant à chaque tâche pour que les actions portent sur la bonne tâche.
- Affiche les textes saisis par l’utilisateur avec textContent plutôt qu’avec innerHTML.
- N’ajoute pas encore de sauvegarde, de filtres, de section « Tâches terminées » ou de fonctionnalité de filière.
- Conserve les fichiers existants et évite de réécrire inutilement README.md ou PROMPTS.md.

Méthode de travail
1. Indique brièvement les fichiers présents et ce que tu vas modifier.
2. Implémente les fonctions dans cet ordre : créer, afficher, modifier, terminer, supprimer.
3. Explique les principales parties du code avec des mots accessibles à des débutants.
4. Donne des vérifications à faire dans le navigateur, dont un titre composé seulement d’espaces, la modification d’une tâche et la suppression de la bonne tâche.
5. Indique les fichiers modifiés, propose un message de commit pour le sprint 1 et une courte entrée à ajouter dans PROMPTS.md. Ne crée pas le commit à ma place.

Critère de réussite
Nous pouvons ouvrir index.html dans un navigateur, effectuer les cinq actions du sprint 1 sans erreur et expliquer le code conservé.

```

## Prompt 6 : envoie du prompt optimal pour le sprint 1

**Prompt :** Rôle
Tu es un développeur web senior qui accompagne deux étudiants de première année. Produis un code simple, lisible et que nous pouvons expliquer.

Contexte
Nous développons TaskFlow, une application de gestion de tâches en HTML, CSS et JavaScript natifs. Lis README.md et PROMPTS.md, puis examine les fichiers existants avant de les modifier.

User stories du projet
1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire.
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance.
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin.
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste.
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.

Tâche : sprint 1 uniquement
Implémente les stories 1 à 6 : créer, afficher, modifier, terminer et supprimer des tâches, avec le refus d’un titre vide.

Prévois une interface simple comprenant :
- le titre « TaskFlow » ;
- un formulaire avec le titre de la tâche, une liste de priorités (« Pas urgent », « Moyennement urgent », « Urgent »), une date d’échéance et un bouton « Ajouter » ;
- une liste qui affiche le titre, la priorité, l’échéance et l’état de chaque tâche ;
- les actions nécessaires pour modifier, terminer et supprimer chaque tâche.

Les stories 7 et 8 font partie du projet, mais ne sont pas à implémenter dans ce sprint. La sauvegarde avec localStorage et la mise en forme CSS approfondie sont prévues au sprint 2.

Contraintes techniques
- Utilise uniquement HTML, CSS et JavaScript natifs, sans framework, bibliothèque, serveur ni base de données.
- Sépare la structure dans index.html, la présentation minimale dans style.css et la logique dans app.js.
- Refuse un titre vide ou composé seulement d’espaces, avec un message compréhensible.
- Utilise un champ de date adapté et affiche les échéances au format jj/mm/aaaa.
- Donne un identifiant à chaque tâche pour que les actions portent sur la bonne tâche.
- Affiche les textes saisis par l’utilisateur avec textContent plutôt qu’avec innerHTML.
- N’ajoute pas encore de sauvegarde, de filtres, de section « Tâches terminées » ou de fonctionnalité de filière.
- Conserve les fichiers existants et évite de réécrire inutilement README.md ou PROMPTS.md.

Méthode de travail
1. Indique brièvement les fichiers présents et ce que tu vas modifier.
2. Implémente les fonctions dans cet ordre : créer, afficher, modifier, terminer, supprimer.
3. Explique les principales parties du code avec des mots accessibles à des débutants.
4. Donne des vérifications à faire dans le navigateur, dont un titre composé seulement d’espaces, la modification d’une tâche et la suppression de la bonne tâche.
5. Indique les fichiers modifiés, propose un message de commit pour le sprint 1 et une courte entrée à ajouter dans PROMPTS.md. Ne crée pas le commit à ma place.

Critère de réussite
Nous pouvons ouvrir index.html dans un navigateur, effectuer les cinq actions du sprint 1 sans erreur et expliquer le code conservé.

**Résultat :** 
```
J’ai créé le sprint 1 dans le dossier TaskFlow :

- [index.html](<~/Outils IA/Taskflow/index.html>) : formulaire et liste des tâches ;
- [app.js](<~/Outils IA/Taskflow/app.js>) : ajout, affichage, modification, achèvement et suppression ;
- [style.css](<~/Outils IA/Taskflow/style.css>) : présentation minimale.

Le titre vide est refusé, les échéances s’affichent en `jj/mm/aaaa`, et chaque tâche possède un identifiant pour cibler la bonne lors d’une modification ou d’une suppression. Les données restent en mémoire jusqu’au rechargement de la page, conformément au découpage des sprints.

**Vérification :** la syntaxe JavaScript est valide. Je n’ai pas pu faire le test interactif : la politique de sécurité du navigateur a bloqué l’ouverture du fichier local. Ouvre `index.html` dans ton navigateur et essaie d’ajouter deux tâches, d’en modifier une, d’en terminer une, puis de supprimer l’autre.

Je n’ai pas touché à `PROMPTS.md`, qui contenait déjà tes modifications. Message de commit proposé : `Sprint 1 : ajouter les fonctions de base de TaskFlow`.

Le service local `remove-ai-marks` était indisponible ; je ne peux donc pas confirmer un nettoyage des nouveaux fichiers par ce service.
```

## Prompt 7 : envoie du prompt optimal 

**Prompt :** Continue le projet stp avec le sprint 2 uniquement : Implémente les stories 6 à 8: Sauvegarde (localStorage) et mise en forme CSS. 

Description : 
Pour le style.css et app.js maintenant. Je veux que tu t'inspire d'avantage du screen que je t'ai fourni de ce lien : https://app.notion.com/p/407e3ba6992080fb8c93c8d09728e1b3?v=407e3ba69920809aa5a3000cec4c8a63. Enlève la catégorie "en cours". Je veux également que lorsque l'on coche une task elle se barre et s'affiche en dessous des autres, dans l'ordre dans lesquels ont les as cochées et se grise légèrement, de sorte à ce qu'elle se détache des autres et qu'on la remarque vite comme étant terminées. Rajoute aussi une petite icone corbeille qui garde en mémoire ce qu'on a supprimer pour pouvoir récupérer les task qu'on auraient suprimées par erreur. Ensuite, met de vert à orange à rouge les différentes priorités : rouge = urgent, orange = moyen urgent et vert = pas urgent. Corrige également l'erreur qui permet de mettre une task à avant la date en cours et implémente une feature pour permettre de choisir les heures et minutes de la date selectionnée. Egalement, lorsqu'on à selectioner une date, on ne peut pas fermer le calendrier en cliquant sur la ligne de sélection de la date, il faut cliquer à côté. Corrige ces deux erreurs et aggrandi le calendrier de selection de la date. Ensuite, met les filtres (diapo 2 slide 17/21) dans un menu en t'inspirant de ta propre application ChatGPT, avec le slide déroulant sur le coté avec toutes les conversation. Pour le style global de l'application, inspire toi des visuels d'Apple : le style "liquid glass", rends aussi le site "responsive" pour différent supports. Enfin, gère le localStorage : il faut que, lorsque l'on actualise la page, elle garde en mémoire (uniquement localement, pas de base de données) les modifications apportées.



**Résultat :** 
```
Le **sprint 2** est en place dans [Taskflow](<~VS/Outils IA/Taskflow>) :

- [app.js](<~VS/Outils IA/Taskflow/app.js>) sauvegarde les tâches et la corbeille dans `localStorage`. Après actualisation, les ajouts, modifications, tâches cochées et suppressions sont conservés. Une tâche supprimée peut être restaurée.
- [index.html](<~VS/Outils IA/Taskflow/index.html>) propose un menu latéral « Toutes », « À faire », « Terminées » et « Corbeille », sans catégorie « En cours ». Le calendrier intégré permet de choisir une date et une heure ; un clic sur son bouton le referme.
- [style.css](</~VS/Outils IA/Taskflow/style.css>) ajoute une présentation inspirée de la capture Notion et du style verre translucide, adaptée aux petits écrans. Les priorités sont vertes, orange ou rouges. Les tâches cochées sont grisées, barrées et placées après les autres, dans leur ordre d’achèvement.

La validation refuse une échéance passée. **Vérifications effectuées :** syntaxe JavaScript valide, contrôle des espaces dans les fichiers modifiés et trois cas de validation de date réussis. Je n’ai pas pu vérifier l’interface dans un navigateur : sa politique de sécurité a bloqué l’ouverture du fichier local. La page Notion liée n’était pas accessible directement ; je me suis appuyé sur ta capture.

`PROMPTS.md` contenait déjà tes modifications, je l’ai laissé tel quel. Pour le journal du sprint 2, note ce prompt, les fonctions retenues et les changements que vous décidez de garder. Message de commit proposé : `Sprint 2 : sauvegarder les tâches et améliorer l'interface`.

Le service local `remove-ai-marks` était indisponible ; je ne peux pas confirmer son nettoyage des fichiers.

```