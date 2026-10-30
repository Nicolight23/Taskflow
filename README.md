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