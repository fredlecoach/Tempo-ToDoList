<template>
  <div>
    <h1>Mes recettes <img src="./styles/images/cloche.png" alt="cloche" width="50px" /> </h1>

    <!-- Formulaire de recherche -->
    <form class="mb-5" action="" @submit.prevent="searchRecipe">
      <label class="mb-1">Rechercher une recette <i class="bi bi-search fs-4"></i></label>
      <input type="search" v-model="searchQuery" placeholder="entrer le nom de la recette" class="form-control w-50 " />
    </form>

    <!-- Liste des résultats -->
    <div v-if="filteredRecipes.length === 0 && searchQuery.trim()" class="mt-2">
      <p class="text-danger">Aucune recette trouvée pour "{{ searchQuery }}"</p>
    </div>

    <p v-if="errorMessage" class="text-danger fw-bold">{{ errorMessage }}</p>

    <!-- Formulaire d'ajout de recettes -->
    <fieldset class="mb-5">
      <legend style="background-color: #e9cbb1" class="text-center py-1">Ajouter une recette</legend>

      <form action="" @submit.prevent="addRecipe">
        <label>Illustration de la recette</label>
        <input
          ref="fileInput"
          class="form-control"
          type="file"
          @change="handleImageUpload"
          accept="image/*"
        />

        <label>Nom de la recette</label>
        <input class="form-control" type="text" v-model="newRecipe.name" />

        <label>Ingrédients</label>
        <input class="form-control" type="text" v-model="newRecipe.ingredients" />

        <label>Étape (une ligne à la fois)</label>
        <div class="d-flex">
          <input
            class="form-control me-2"
            type="text"
            v-model="currentStep"
            placeholder="Écrire une étape"
          />
          <button
            class="btn btn-success"
            type="button"
            @click="addStep"
            :disabled="currentStep.trim().length === 0"
          >
            Ajouter étape
          </button>
        </div>

        <ul>
          <li class="my-1" v-for="(step, index) in newRecipe.steps" :key="index">
            {{ index + 1 }}. {{ step }}
            <button
              type="button"
              class="btn btn-sm btn-danger ms-2"
              @click="removeStep(index)"
            >
              Supprimer
            </button>
          </li>
        </ul>

        <button
          class="my-2 btn bouton"
          :disabled="newRecipe.name.length === 0 || !newRecipe.illustration"
        >
          Ajouter une recette
        </button>
      </form>

    </fieldset>

    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div class="col" v-for="(recipe, id) in filteredRecipes" :key="id">
        <div class="card">
          <img
            :src="recipe.illustration"
            :alt="recipe.name"
            class="card-img-top object-fit-cover"
            style="height: 500px;"
          />
          <div class="card-body">
            <h4 class="card-title text-success text-center border mb-2">{{ recipe.name.toUpperCase() }}</h4>
            <p class="card-text">
              <span class="text-primary fw-bold mb-2 fs-5">Ingrédients :</span><br />
              {{ recipe.ingredients }}
            </p>
            <p>
              <span class="text-warning fw-bold mb-2 fs-5">Étapes :</span><br />
            </p>
              <ol>
                <li class="pb-1" v-for="(step, index) in recipe.steps" :key="index">
                  {{ capitalizeFirstWord(step) }}
                </li>
              </ol>
            
            <div class="d-flex justify-content-center">
              <button @click="deleteRecipe(id)" class="btn btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Liste des recettes
const recipes = ref([]);

// Modèle pour une nouvelle recette
const newRecipe = ref({
  illustration: '',
  name: '',
  ingredients: '',
  steps: [], // Liste des étapes
});

// État pour une étape en cours d'ajout
const currentStep = ref('');

// Référence pour le champ de fichier
const fileInput = ref(null);

// Message d'erreur
const errorMessage = ref('');

// Charger les recettes depuis le LocalStorage au démarrage
onMounted(() => {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes.value = JSON.parse(storedRecipes);
  }
});

// Gérer le téléchargement d'une image
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newRecipe.value.illustration = e.target.result; // Convertir en URL base64
    };
    reader.readAsDataURL(file);
  }
};

// Ajouter une étape
const addStep = () => {
  if (currentStep.value.trim()) {
    newRecipe.value.steps.push(currentStep.value.trim());
    currentStep.value = ''; // Réinitialiser l'entrée
  }
};

// Supprimer une étape
const removeStep = (index) => {
  newRecipe.value.steps.splice(index, 1);
};

// Ajouter une nouvelle recette
const addRecipe = () => {
  if (
    !newRecipe.value.name.trim() ||
    !newRecipe.value.ingredients.trim() ||
    newRecipe.value.steps.length === 0 ||
    !newRecipe.value.illustration
  ) {
    errorMessage.value =
      "Veuillez remplir tous les champs et ajouter au moins une étape avant d'ajouter une recette !";
    return;
  }
  errorMessage.value = ''; // Réinitialiser le message d'erreur si tout est correct
  recipes.value.push({ ...newRecipe.value });

  // Sauvegarder les recettes dans le LocalStorage
  localStorage.setItem('recipes', JSON.stringify(recipes.value));

  newRecipe.value = { name: '', ingredients: '', steps: [], illustration: '' };

  // Réinitialiser le champ de fichier
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Supprimer une recette
const deleteRecipe = (id) => {
  recipes.value.splice(id, 1);

  // Mettre à jour le LocalStorage après suppression
  localStorage.setItem('recipes', JSON.stringify(recipes.value));
};

// Chercher une recette existante
const searchQuery = ref('');
const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) {
    return recipes.value; // Si aucun terme n'est entré, retourner toutes les recettes
  }
  return recipes.value.filter((recipe) =>
    recipe.name.toUpperCase().includes(searchQuery.value.toUpperCase())
  );
});

// Méthode pour capitaliser le premier mot d'une phrase
const capitalizeFirstWord = (text) => {
  if (!text) return text;
  const words = text.split(' ');
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1); // Met la première lettre en majuscule
  return words.join(' '); // Rejoint les mots pour reformer la phrase
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