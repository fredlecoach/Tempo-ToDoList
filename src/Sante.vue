<template>
  <h1 style="margin-bottom: 50px;">Mes astuces santé <i class="bi bi-chat-left-heart-fill text-success"></i></h1>

  <legend style="background-color: #e9ccb1;" class="text-center py-1">Ajouter vos astuces</legend>
  <div class="row row-cols-1 row-cols-md-2">
    <fieldset class="col">
    
    <form @submit.prevent="addAstuce">
      <div class="form-group">
        <label for="astuce">Nom de l'astuce</label>
        <input
          type="text"
          id="astuce"
          class="form-control"
          v-model="newAstuce.name"
          aria-label="Nom de l'astuce"
          required
        />
        <label for="preparation">Préparation</label>
        <input
          type="text"
          id="preparation"
          class="form-control"
          v-model="newAstuce.preparation"
          aria-label="Préparation de l'astuce"
          required
        />
        <label for="effects">Effets escomptés</label>
        <input
          type="text"
          id="effects"
          class="form-control"
          v-model="newAstuce.effects"
          aria-label="Effets escomptés de l'astuce"
          required
        />
        <button
          type="submit"
          class="btn bouton mt-1"
          :disabled="!newAstuce.name || !newAstuce.preparation || !newAstuce.effects"
        >
          Ajouter
        </button>
      </div>
    </form>
    </fieldset>
    <!-- image -->
     <div class="col">
      <img src="./styles/images/potions.jpg" alt="fioles de potions curatives" class="w-100 object-fit-cover"/>
     </div>
  </div>
  

  <p v-if="astucesList.length === 0" class="text-muted">{{ astucesVide }}</p>

  <hr class="my-5">

  <div class=" row row-cols-1 row-cols-md-2 g-2">
    <article class="card shadow-sm p-3 mb-4 bg-light rounded " v-for="(astuce, index) in astucesList" :key="index">
      <div class="card-body">
        <h3 class="card-title fw-bold" style="color: purple">{{ astuce.name.toUpperCase() }} <i class="bi bi-magic"></i></h3>
        <p class="card-text">
          <span class="fw-bold text-primary">Préparation :</span> <br />
          {{ astuce.preparation }}
        </p>
        <p class="card-text">
          <span class="fw-bold text-success">Effets :</span> <br />
          {{ astuce.effects }}
        </p>
        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-danger fw-bold" @click="deleteAstuce(index)">Supprimer</button>
        </div>
      </div>
    </article>
  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';

const astucesList = ref([]);
const astucesVide = "Aucune astuce ajoutée";
const newAstuce = ref({
  name: "",
  preparation: "",
  effects: "",
});

// Charger les astuces depuis localStorage
onMounted(() => {
  const storeAstuces = localStorage.getItem('astuce');
  if (storeAstuces) {
    astucesList.value = JSON.parse(storeAstuces);
  }
});

// Ajouter une astuce
const addAstuce = () => {
  if (newAstuce.value.name.trim() && newAstuce.value.preparation.trim() && newAstuce.value.effects.trim()) {
    astucesList.value.push({
      name: newAstuce.value.name.trim(),
      preparation: newAstuce.value.preparation.trim(),
      effects: newAstuce.value.effects.trim()
    });
    // Réinitialiser le formulaire
    newAstuce.value = { name: "", preparation: "", effects: "" };
    // Sauvegarder dans localStorage
    localStorage.setItem('astuce', JSON.stringify(astucesList.value));
  }
};

// Supprimer une astuce
const deleteAstuce = (index) => {
  astucesList.value.splice(index, 1);
  localStorage.setItem('astuce', JSON.stringify(astucesList.value));
};
</script>


<!-- style ************** -->
<style scoped>
.card {
  border: 1px solid #dee2e6;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.4rem;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 10px;
}

.card-text span {
  color: #495057;
}

.btn {
  transition: background-color 0.2s, border-color 0.2s;
}

.btn:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}
</style>