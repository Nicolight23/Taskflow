# Taskflow

## User stories

```
1. En tant qu’utilisateur, je veux ajouter une tâche avec un titre, une priorité et une échéance afin de planifier mon travail.
2. En tant qu’utilisateur, je veux que l’application refuse une tâche sans titre afin d’éviter les entrées vides.
3. En tant qu’utilisateur, je veux voir mes tâches avec leur priorité et leur échéance afin de savoir ce que j’ai à faire. 
4. En tant qu’utilisateur, je veux modifier une tâche afin de corriger son titre, sa priorité ou son échéance. 
5. En tant qu’utilisateur, je veux marquer une tâche comme terminée afin de signaler que je l’ai faite.
6. En tant qu’utilisateur, je veux supprimer une tâche afin de retirer de ma liste ce dont je n’ai plus besoin. 
7. En tant qu’utilisateur, je veux retrouver mes tâches après avoir fermé le navigateur afin de conserver ma liste. 
8. En tant qu’utilisateur, je veux retrouver les tâches terminées dans une section à part afin de voir plus clairement celles qu’il me reste à faire.
```

## Architecture

```
.taskflow/
├── index.html    
├── style.css     
├── app.js        
├── README.md     
└── PROMPTS.md    
```

## Modèle de données


{
 "id": 1,
 "titre": "Réviser le CSS",
 "description": "Flexbox",
 "priorite": "haute",
 "echeance": "2026-11-15",
 "statut": "a_faire"
}

## Sprint 3 - Connexion locale

Au premier lancement, créez un pseudonyme et un mot de passe. Le pseudonyme accepte les lettres, chiffres et caractères spéciaux. Le mot de passe doit contenir 8 à 64 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial. La jauge indique « faible » pour 0 à 2 critères cochés, « moyen » pour 3 ou 4 et « fort » pour 5. Elle vérifie ces critères, mais ne garantit pas que le mot de passe soit difficile à deviner.

Les tâches sont chiffrées sur cet appareil. Le mot de passe ou le code de récupération permet de déverrouiller la clé de chiffrement. Les anciennes tâches locales sont reprises lors de la création du compte. Après trois connexions ratées, l'accès est bloqué pendant 5 minutes ; chaque nouvel échec après l'attente double la durée (10, 20, 40 minutes, etc.). Une connexion réussie remet le compteur à zéro.

À la création du compte, un code de récupération est affiché une seule fois. Les comptes créés avant cette fonction reçoivent un code lors de leur prochaine connexion réussie. Conservez-le ailleurs que dans TaskFlow : le bouton « Mot de passe oublié ? » permet de choisir un nouveau mot de passe avec ce code. Après une récupération, l'ancien code est remplacé par un nouveau.

Il n'y a ni serveur, ni synchronisation. Si le mot de passe et le code de récupération sont perdus, les tâches chiffrées ne peuvent pas être relues. Le blocage des tentatives est enregistré localement et peut être contourné par quelqu'un qui contrôle le navigateur ; ce n'est donc pas une authentification adaptée à un service en ligne ou à des données sensibles.
