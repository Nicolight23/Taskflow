# IA utilisée : Codex / ChatGPT

## Prompt 1 : création du prompt optimal 

**Prompt :** A partir du diaporama fourni et la méthode page 23 (rôle, contexte, tâche, contraintes, format et exemples) propose moi le meilleur prompt qui réponde à ce qui est demandé dans la page 27.
Je veux que tu me donnes 5 à 8 user stories pour le projet taskflow.

> **Résultat :** Voici un prompt construit avec les six éléments de la page 23. Remplace [ma filière et sa fonctionnalité] avant de l’envoyer à l’IA.
Rôle : Tu es un développeur web qui aide des étudiants de première année à cadrer leur projet.
Contexte : Nous créons en binôme TaskFlow, une petite application web de gestion de tâches. Notre filière est [ma filière et sa fonctionnalité].
Tâche : Propose 5 à 8 user stories couvrant les fonctions essentielles de TaskFlow et notre fonctionnalité de filière.
Contraintes : L’application utilise HTML, CSS et JavaScript, sans framework, serveur ni base de données. Les tâches sont sauvegardées avec localStorage. Rédige des besoins réalisables à notre niveau, sans proposer de code.
Format : Fais une liste numérotée. Chaque story doit suivre la formule « En tant que…, je veux…, afin de… ».
Exemple : « En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de voir ce qu’il me reste à faire. » Termine en indiquant les points à préciser avec nous.

**Gardé :**

**Rejeté :**

**Pourquoi :** La réponse ne nous à pas totalement convenu. Dans le prompt, il est toujours question de choisir sa filière ce qui est finalemant inutile.


## Prompt 2 : envoie du prompt optimal 

**Prompt :** Rôle : Tu es un développeur web qui aide des étudiants de première année à cadrer leur projet.
Contexte : Nous créons en binôme TaskFlow, une petite application web de gestion de tâches.
Tâche : Propose 5 à 8 user stories couvrant les fonctions essentielles de TaskFlow et notre fonctionnalité de filière.
Contraintes : L’application utilise HTML, CSS et JavaScript, sans framework, serveur ni base de données. Les tâches sont sauvegardées avec localStorage. Rédige des besoins réalisables à notre niveau, sans proposer de code.
Format : Fais une liste numérotée. Chaque story doit suivre la formule « En tant que…, je veux…, afin de… ».
Exemple : « En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de voir ce qu’il me reste à faire. » Termine en indiquant les points à préciser avec nous.

> **Résultat :** 
>1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
>2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
>3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire.
>4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance.
>5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de distinguer le travail fait du travail restant.
>6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin.
>7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste.

>**Point à préciser avec vous :** le prompt demande une story pour votre fonctionnalité de filière, mais ne dit pas laquelle vous avez choisie. Je ne peux donc pas la formuler précisément. Les sept stories ci-dessus couvrent les fonctions essentielles ; il reste une place pour ajouter celle de votre filière tout en respectant la limite de huit.


**Gardé :**

**Rejeté :**

**Pourquoi :** 

