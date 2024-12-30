<template>
  <h1 style="margin-bottom: 50px;">Tâches administratives <i class="bi bi-card-list"></i></h1>

  <fieldset>
    <legend class="text-center py-1" style="background-color: #e9ccb1;">Ajouter une tâche</legend>
    <form @submit.prevent="addNewTask">
      <label for="task">Tâche à effectuer</label>
      <input type="text" class="form-control" v-model="newTask.name" />

      <label>Choix de la Date</label>
      <!-- Ajout de l'attribut :min pour empêcher la sélection de dates antérieures -->
      <input 
        type="date" 
        class="form-control" 
        v-model="newTask.date" 
        :min="minDate" 
      />

      <div class="d-flex justify-content-end">
        <button class="btn bouton mt-2">Ajouter la tâche</button>
      </div>
    </form>
  </fieldset>

  <div class="row">
    <!-- Liste des tâches -->
    <ul v-if="taskList.length > 0">
      <li v-for="(task, index) in taskList" :key="index">
        <strong class="text-danger">{{ formatDate(task.date) }}</strong> : 
        <span class="text-success">{{ task.name.toUpperCase() }}</span> 
        <button @click="removeTask(index)" class="btn btn-sm btn-warning ms-2">
          Supprimer
        </button>
      </li>
    </ul>
    <!-- Message quand il n'y a pas de tâches -->
    <p v-else class="text-center text-muted">Aucune tâche pour le moment.</p>
  </div>

  <div>
    <img src="./styles/images/woman-working-office.jpg" alt="bureau et papiers administratifs" class="w-100 object-fit-cover" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';

// Liste des tâches
const taskList = ref([]);
const newTask = ref({
  name: '',
  date: '',
});

// Date minimale : aujourd'hui
const today = new Date();
const minDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD

// Chargement des tâches enregistrées au montage du composant
onMounted(() => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    taskList.value = JSON.parse(storedTasks);
  }
});

// Ajouter une nouvelle tâche
const addNewTask = () => {
  if (newTask.value.name && newTask.value.date) {
    // Ajouter une copie de l'objet pour éviter de modifier l'original
    taskList.value.push({ ...newTask.value });

    // Sauvegarde des tâches dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList.value));

    // Réinitialiser le formulaire
    newTask.value.name = '';
    newTask.value.date = '';
  } else {
    alert("Veuillez remplir tous les champs.");
  }
};

// Supprimer une tâche
const removeTask = (index) => {
  taskList.value.splice(index, 1);

  // Met à jour le localStorage
  localStorage.setItem('tasks', JSON.stringify(taskList.value));
};

// Fonction pour formater les dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
</script>

<style>
.bouton {
  background-color: #083731;
  color: #e9cbb1;
}

.bouton:hover {
  background-color: #73d298;
  color: #083731;
}
</style>