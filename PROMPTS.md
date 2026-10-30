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


## Prompt 3 :

**Prompt :** 

fait moi l'arborescence du projet pour que je puisse la mettre dans mon .md (en sachant qu'il faudra rajouter un index.hmtl et un style.css)

**Résultat :** 
```
taskflow/
├── index.html    # Page de l'application
├── style.css     # Apparence de l'application
├── app.js        # Gestion des tâches et sauvegarde
├── README.md     # Présentation du projet et user stories
└── PROMPTS.md    # Consignes données à l'IA et choix du binôme
```
