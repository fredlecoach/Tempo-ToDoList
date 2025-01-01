<template>
  <h1>Liste de course <i class="bi bi-cart-fill"></i> </h1>
      <button class="btn btn-secondary mx-1 mb-1" @click="toggleHiddenItems" title="cliquer pour masquer ou afficher les éléments ajoutés">
        {{ hiddenItems ? '🫣 Masquer' : '👁️ Afficher ' }} les produits déjà pris
      </button><br>
      <button class="btn btn-secondary mb-1 mx-1" @click="toggleTri">{{ triCroissant ? '↡ Alphabétique (Z-A)' : '↟ Alphabétique (A-Z)' }}</button>
      <!-- bouton choix multiples -->
      <!-- Liste des recettes pour récupérer les ingrédients -->
      <div class="dropdown mx-1">
        <a class="btn boutonBis dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Récupérer ingrédients
        </a>

        <ul class="dropdown-menu">
          <li v-for="(recipe, id) in recipes" :key="id">
            <div class="d-flex align-items-center">
              <span class="dropdown-item">{{ recipe.name.toUpperCase() }}</span>
              <button class="btn boutonBis btn-sm ms-2" @click="loadCourses(recipe)">Sélectionner</button>
            </div>
          </li>
          <span v-show="!recipes.length" class="text-primary px-2 fw-bold">
            {{ ingredientsList ? 'Aucun ingrédient ajouté' : 'Aucune recette enregistrée' }}
          </span>
        </ul>

      </div>

      

      <!-- formulaire pour ajouter des produits -->
      <form @submit.prevent="addItem" class="my-5">
        <div class="form-group">
          <input 
            type="text" 
            placeholder="ex : spaghetti" 
            v-model="newItem" 
            aria-label="Nouveau produit"
          />
          <button class="btn btn-secondary m-1" type="submit" :disabled="newItem.length === 0">Ajouter</button>
        </div>
      </form>

      <!-- Liste des courses -->
      <ul class="d-flex flex-column">
        <li v-for="(item, id) in filteredCourses" :key="id" class=" mb-2">
          <!-- Colonne des éléments (nom, quantité, case à cocher) -->
          <div class="flex-grow-1">
            <strong :style="{ textDecoration: item.done ? 'line-through' : '', color: item.done ? 'red' : '' }">
              {{ item.name.toUpperCase() }}
            </strong>
            x {{ item.quantity }}
            <input 
              v-model="item.done" 
              type="checkbox" 
              :id="'case' + id"
              @change="sortCourses"
              :aria-checked="item.done"
            />
          </div>
          
          <!-- Colonne des boutons (+, -, Supprimer) -->
          
            <button class="btn bg-success text-light fw-bold mb-1" title="augmenter la quantité" @click="increment(id)"> + </button>
            <button class="btn bg-warning text-light mb-1 fw-bold mx-1" title="diminuer la quantité" @click="decrement(id)"> - </button>
            <button class="btn btn-danger mb-1" title="supprimer" @click="deleteItem(id)">X</button>
          
        </li>

        <span v-show="courses.length === 0" class="text-danger">
          <em>{{ messageListeVide }}</em>
        </span>
      </ul>

      <p class="border col-3 px-1" v-if="restCourses > 0"><i>Nombre d'article{{ restCourses > 1 ? 's' : '' }} à prendre :</i> <span class="text-primary fw-bold">{{ restCourses }}</span> </p>
      <!-- <check name="frédéric" surname="fred" age= 45 /> -->
      <img src="./styles/images/caddie-ecurueil.jpg" alt="caddie de courses" class="w-100 object-fit-cover" />
</template>



<!-- logique script ***************************************************** -->
<script setup>
import { ref, computed, onMounted } from 'vue';
// import check from './Name.vue';
import Recettes from './Recettes.vue';


// Liste des courses, initialement vide
const courses = ref([]);

// Message lorsque la liste est vide
const messageListeVide = "Aucun produit ajouté";

// Gestion de l'ajout d'un produit
const newItem = ref('');

 // charger la liste de produits enregistrées depuis le localStorage
 onMounted( ()=>{
      const storeItems = localStorage.getItem('items');
      if  (storeItems){
        courses.value = JSON.parse(storeItems)
      }
    })

// ajouter un produit
const addItem = () => {
  if (newItem.value.trim() !== '') {
    courses.value.push({ name: newItem.value.trim(), quantity: 1, done: false });

    newItem.value = '';
    sortCourses(); // Tri après ajout

    // sauvegarder dans le localStorage
    localStorage.setItem('items', JSON.stringify(courses.value));
  }
};


// Fonction pour trier les courses en fonction de leur état 'done'
const sortCourses = () => {
  courses.value.sort((a, b) => Number(a.done) - Number(b.done));
  localStorage.setItem('items', JSON.stringify(courses.value))
};

// État pour gérer les éléments masqués
const hiddenItems = ref(true);

// Calcul des éléments visibles selon le masquage
const filteredCourses = computed(() =>
  hiddenItems.value ? courses.value : courses.value.filter(item => !item.done)
);

// Bouton pour altérer le masque des éléments barrés
const toggleHiddenItems = () => {
  hiddenItems.value = !hiddenItems.value;
};

// augmenter quantité d'un produit
const increment = (id) => {
  courses.value[id].quantity++;
  localStorage.setItem('items', JSON.stringify(courses.value))
};

// diminuer la quantité d'un produit
const decrement = (id) => {
  courses.value[id].quantity--;
  if (courses.value[id].quantity === 0) {
    courses.value.splice(id, 1);
    localStorage.setItem('items', JSON.stringify(courses.value))
  }
};

// Supprimer un produit
const deleteItem = (id) => {
  courses.value.splice(id, 1);
  localStorage.setItem('items', JSON.stringify(courses.value))
};

// État pour gérer le tri
const triCroissant = ref(true);

// Fonction pour trier par ordre alphabétique
const triAlphabetique = () => {
  courses.value.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return triCroissant.value ? -1 : 1;
    if (nameA > nameB) return triCroissant.value ? 1 : -1;
    return 0;
  });
};

// Alterner entre tri croissant et décroissant
const toggleTri = () => {
  triCroissant.value = !triCroissant.value;
  triAlphabetique();
};

// reste de courses à faire
const restCourses = computed(
  ()=>{
    return courses.value.filter(c => c.done === false).length
  }
)

// Récupérer les ingrédients d'une recette spécifique et les ajouter à la liste de courses
const loadCourses = (recipe) => {
  if (recipe.ingredients) {
    // Convertir les ingrédients en tableau si nécessaire
    const ingredientsList = typeof recipe.ingredients === 'string'
      ? recipe.ingredients.split(',').map((ing) => ing.trim()) // Si c'est une chaîne, la diviser
      : recipe.ingredients; // Sinon, utiliser directement le tableau

    // Ajouter les ingrédients à la liste des courses
    ingredientsList.forEach((ingredient) => {
      courses.value.push({ name: ingredient, quantity: 1, done: false });
    });

    // Mettre à jour le localStorage
    localStorage.setItem('items', JSON.stringify(courses.value));
  } else {
    console.warn("La recette sélectionnée ne contient pas d'ingrédients.");
  }
};

// Charger les recettes depuis le localStorage
const recipes = ref([]);

onMounted(() => {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes.value = JSON.parse(storedRecipes);
  }
});


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

.boutonBis{
  background-color: #2b4070;
  color: #e9cbb1;
}

.boutonBis:hover{
  background-color: #e9cbb1;
  color: #2b4070;

}

</style>