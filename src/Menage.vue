<template>
  <h1>Mes astuces ménage <i class="bi bi-stars text-secondary"></i></h1>

  <!-- Formulaire de recherche -->
  <form @submit.prevent="filterTips">
    <label for="search">Rechercher une de mes astuces</label>
    <input
      type="search"
      class="form-control w-50"
      v-model="searchQueryTips"
      placeholder="Entrer le nom de l'astuce"
    />
  </form>

  <!-- Liste des résultats -->
  <div v-if="filteredTips.length === 0 && searchQueryTips.trim()" class="mt-2">
    <p class="text-danger">Aucune astuce trouvée pour "{{ searchQueryTips }}"</p>
  </div>

  <!-- Formulaire pour ajouter ou modifier une astuce -->
  <fieldset>
    <legend class="text-center py-1 mt-5" style="background-color: #e9ccb1;">{{ isEditing ? "Modifier l'astuce" : "Ajouter une astuce" }}</legend>
    <div class="row row-cols-1 row-cols-md-2">
      <div class="col">
        <form @submit.prevent="isEditing ? updateTips() : addTips()">
          <div class="form-group">
            <label for="titre">Titre du tips</label>
            <input
              id="titre"
              type="text"
              class="form-control"
              v-model="newTips.titre"
            />
            <label for="produits">Produits à utiliser</label>
            <input
              id="produits"
              type="text"
              class="form-control"
              v-model="newTips.produits"
            />
            <label for="produits">Préparation</label>
            <input
              id="preparation"
              type="text"
              class="form-control"
              v-model="newTips.preparation"
            />
            <label for="objectifs">Objectifs</label>
            <input
              id="objectifs"
              type="text"
              class="form-control"
              v-model="newTips.objectifs"
            />
            <button
              type="submit"
              class="btn bouton mt-2"
              :disabled="!newTips.titre || !newTips.objectifs || !newTips.produits"
            >
              {{ isEditing ? "Sauvegarder les modifications" : "Ajouter" }}
            </button>
            <button
              type="button"
              v-if="isEditing"
              class="btn btn-secondary mt-2"
              @click="cancelEdit"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
      <div class="col">
        <img
          src="./styles/images/menage.jpg"
          alt="produits ménager"
          class="w-100"
        />
      </div>
    </div>
  </fieldset>

  <hr class="my-5" />

  <!-- Afficher tous les tips filtrés -->
  <div v-if="filteredTips.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
    <div class="col" v-for="(tip, index) in filteredTips" :key="index">
      <div class="card h-100">
        <div class="card-body">
          <h3 class="card-title" style="color: goldenrod;">{{ tip.titre.toUpperCase() }}</h3>
          <p class="card-text"><span class="text-primary fw-bold">Produits :</span><br>{{ tip.produits }}</p>
          <p class="card-text"><span style="color: purple;" class="fw-bold">Préparation :</span><br>{{ tip.preparation }}</p>
          <p class="card-text"><span class="fw-bold text-success">Objectifs :</span><br>{{ tip.objectifs }}</p>
          <button class="btn btn-warning" @click="editTips(index)">Modifier</button>
          <button class="btn btn-danger" @click="deleteTips(index)">Supprimer</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Message si aucune astuce n'est ajoutée ou trouvée -->
  <div v-else class="mt-3">{{ listEmpty }}</div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue';

// Déclaration des variables réactives
const tipsList = ref([]);
const searchQueryTips = ref("");
const listEmpty = "Aucune astuce ajoutée";
const newTips = ref({
  titre: "",
  produits: "",
  preparation: "",
  objectifs: "",
});
const isEditing = ref(false); // Indique si on est en mode édition
const editIndex = ref(null); // Stocke l'indice du tips à modifier

// Liste filtrée (réactive)
const filteredTips = computed(() => {
  if (!searchQueryTips.value.trim()) {
    return tipsList.value; // Affiche toutes les astuces si le champ est vide
  }
  return tipsList.value.filter((tip) =>
    tip.titre.toLowerCase().includes(searchQueryTips.value.toLowerCase())
  );
});

// Charger les astuces depuis le localStorage au montage du composant
onMounted(() => {
  const storedTips = localStorage.getItem("tip");
  if (storedTips) {
    tipsList.value = JSON.parse(storedTips);
  }
});

// Ajouter une nouvelle astuce
const addTips = () => {
  if (
    newTips.value.titre.trim() &&
    newTips.value.produits.trim() &&
    newTips.value.objectifs.trim() &&
    newTips.value.preparation.trim()
  ) {
    tipsList.value.push({
      titre: newTips.value.titre,
      produits: newTips.value.produits,
      preparation: newTips.value.preparation,
      objectifs: newTips.value.objectifs,
    });

    // Réinitialiser le formulaire
    resetForm();

    // Sauvegarder les astuces dans le localStorage
    localStorage.setItem("tip", JSON.stringify(tipsList.value));
  }
};

// Activer le mode édition
const editTips = (index) => {
  const tipToEdit = tipsList.value[index];
  newTips.value = { ...tipToEdit }; // Charger les données dans le formulaire
  isEditing.value = true;
  editIndex.value = index; // Stocker l'indice du tips
};

// Sauvegarder les modifications
const updateTips = () => {
  if (editIndex.value !== null) {
    tipsList.value[editIndex.value] = { ...newTips.value };

    // Réinitialiser le formulaire
    resetForm();

    // Sauvegarder les modifications dans le localStorage
    localStorage.setItem("tip", JSON.stringify(tipsList.value));
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  newTips.value = { titre: "", produits: "", objectifs: "", preparation: "" };
  isEditing.value = false;
  editIndex.value = null;
};

// Annuler l'édition
const cancelEdit = () => {
  resetForm();
};

// Supprimer une astuce
const deleteTips = (index) => {
  tipsList.value.splice(index, 1);
  localStorage.setItem("tip", JSON.stringify(tipsList.value));
};

// Fonction déclenchée à la soumission du formulaire (pas strictement nécessaire avec computed)
const filterTips = () => {
  // La liste filtrée est calculée automatiquement.
};
</script>
