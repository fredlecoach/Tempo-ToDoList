<template>
  <div>
    <h1 class="mb-5">Repas de la semaine <i class="bi bi-apple" style="color: #41BE25;"></i></h1>


    <!-- Formulaire ajout de repas -->
    <fieldset>
      <legend style="background-color: #e9cbb1" class="text-center py-1">Ajouter un repas au jour désiré</legend>
    </fieldset>
    <form @submit.prevent="addMeal">
      <div class="d-flex ">
        <input
          type="text"
          v-model="newMeal.name"
          placeholder="Nom du repas"
          class="form-control w-50"
        />
        <div class="mx-1">
          <label class="mb-1" for="days">Choisissez un jour :</label>
          <select v-model="newMeal.day" id="days" class="form-select">
            <option value="lundiDej" class="text-warning fw-bold">Lundi 🌞</option>
            <option value="lundiSoir" style="color: purple;" class="fw-bold">Lundi 🌒</option>
            <option value="mardiDej" class="text-warning fw-bold">Mardi 🌞</option>
            <option value="mardiSoir" style="color: purple;" class="fw-bold">Mardi 🌒</option>
            <option value="mercrediDej" class="text-warning fw-bold">Mercredi 🌞</option>
            <option value="mercrediSoir" style="color: purple;" class="fw-bold">Mercredi 🌒</option>
            <option value="jeudiDej" class="text-warning fw-bold">Jeudi 🌞</option>
            <option value="jeudiSoir" style="color: purple;" class="fw-bold">Jeudi 🌒</option>
            <option value="vendrediDej" class="text-warning fw-bold">Vendredi 🌞</option>
            <option value="vendrediSoir" style="color: purple;" class="fw-bold">Vendredi 🌒</option>
            <option value="samediDej" class="text-warning fw-bold">Samedi 🌞</option>
            <option value="samediSoir" style="color: purple;" class="fw-bold">Samedi 🌒</option>
            <option value="dimancheDej" class="text-warning fw-bold">Dimanche 🌞</option>
            <option value="dimancheSoir" style="color: purple;" class="fw-bold">Dimanche 🌒</option>
          </select>
        </div>
      </div>
      <button class="btn bouton my-1" :disabled="isButtonDisabled">Ajouter le repas</button>
    </form>

    <!-- Tableau des repas -->
    <div style="margin-top: 50px;">
        <table class="table table-bordered table-striped text-center text-uppercase">
          <thead>
            <tr>
              <th class="bg-secondary text-light">Date</th>
              <th class="bg-warning">Midi <i class="bi bi-sun"></i></th>
              <th style="background-color: purple" class="text-light">Soir <i class="bi bi-moon"></i></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in daysList" :key="day.name">
              <th style="background-color: #e9cbb1">{{ day.label }}</th>
              <td>
                {{ days[day.midi] }}
                <button v-if="days[day.midi]" @click="deleteMeal(day.midi)" class="btn btn-danger fw-bold">x</button>
              </td>
              <td>
                {{ days[day.soir] }}
                <button v-if="days[day.soir]" @click="deleteMeal(day.soir)" class="btn btn-danger fw-bold ">X</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    <img src="./styles/images/dinner.jpg" alt="assiettes et couverts sur une table" class="w-100 object-fit-cover" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Liste des jours et des champs associés
const daysList = [
  { name: 'lundi', label: 'Lundi', midi: 'lundiDej', soir: 'lundiSoir' },
  { name: 'mardi', label: 'Mardi', midi: 'mardiDej', soir: 'mardiSoir' },
  { name: 'mercredi', label: 'Mercredi', midi: 'mercrediDej', soir:'mercrediSoir'},
  { name: 'jeudi', label: 'Jeudi', midi: 'jeudiDej', soir: 'jeudiSoir'},
  { name: 'vendredi', label: 'Vendredi', midi: 'vendrediDej', soir: 'vendrediSoir'},
  { name: 'samedi', label: 'Samedi', midi: 'samediDej', soir: 'samediSoir'},
  { name: 'dimanche', label: 'Dimanche', midi: 'dimancheDej', soir: 'dimancheSoir'}  
];

// Données des repas
const days = ref({
  lundiDej: '',
  lundiSoir: '',
  mardiDej: '',
  mardiSoir: '',
  mercrediDej: '',
  mercrediSoir: '',
  jeudiDej: '',
  jeudiSoir: '',
  vendrediDej: '',
  vendrediSoir: '',
  samediDej: '',
  samediSoir: '',
  dimancheDej: '',
  dimancheSoir: '',

});

// Nouveau repas
const newMeal = ref({ name: '', day: '' });

// faire remonter les données enregistrés
onMounted( ()=>{
  const storeMeal = localStorage.getItem('repas')
  if(storeMeal){
    days.value = JSON.parse(storeMeal)
  }
})

// Ajouter un repas
const addMeal = () => {
  if (!newMeal.value.name.trim() || !newMeal.value.day) return;
  days.value[newMeal.value.day] = newMeal.value.name;
  newMeal.value = { name: '', day: '' };
  localStorage.setItem('repas', JSON.stringify(days.value))
};

// Supprimer un repas
const deleteMeal = (mealKey) => {
  days.value[mealKey] = '';
  localStorage.setItem('repas', JSON.stringify(days.value))
};

// Activer/désactiver le bouton
const isButtonDisabled = computed(() => !newMeal.value.name.trim() || !newMeal.value.day);
</script>


<!-- style **************************** -->
 <style>



</style>