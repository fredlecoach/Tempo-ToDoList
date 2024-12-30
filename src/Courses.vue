<template>
  <h1>Liste de course <i class="bi bi-cart-fill"></i> </h1>
      <button class="btn bouton mx-1 mb-1" @click="toggleHiddenItems" title="cliquer pour masquer ou afficher les éléments ajoutés">
        {{ hiddenItems ? '🫣 Masquer' : '👁️ Afficher ' }} les produits déjà pris
      </button>
      <button class="btn bouton mb-1 mx-1" @click="toggleTri">{{ triCroissant ? '↡ Alphabétique (Z-A)' : '↟ Alphabétique (A-Z)' }}</button>
      

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
      <ul>
        <li v-for="(item, id) in filteredCourses" :key="id" class="mb-2">
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
          <button class="btn bg-success text-light fs-5 mx-1" @click="increment(id)"> + </button>
          <button class=" btn bg-warning text-light fs-5" @click="decrement(id)"> - </button>
          <button @click="deleteItem(id)" class="btn btn-danger mx-1">Supprimer</button>
        </li>
        <span v-show="courses.length === 0" class="text-danger"><em>{{ messageListeVide }}</em></span>
      </ul>
      <p class="border col-3 px-1" v-if="restCourses > 0"><i>Nombre d'article{{ restCourses > 1 ? 's' : '' }} à prendre :</i> <span class="text-primary fw-bold">{{ restCourses }}</span> </p>
      <!-- <check name="frédéric" surname="fred" age= 45 /> -->
      <img src="./styles/images/caddie.jpg" alt="caddie de courses" class="w-100 object-fit-cover" />
</template>



<!-- logique script ***************************************************** -->
<script setup>
import { ref, computed } from 'vue';
// import check from './Name.vue';


// Liste des courses, initialement vide
const courses = ref([]);

// Message lorsque la liste est vide
const messageListeVide = "Aucun produit ajouté";

// Gestion de l'ajout d'un produit
const newItem = ref('');

// ajouter un produit
const addItem = () => {
  if (newItem.value.trim() !== '') {
    courses.value.push({ name: newItem.value.trim(), quantity: 1, done: false });
    newItem.value = '';
    sortCourses(); // Tri après ajout
  }
};

// Fonction pour trier les courses en fonction de leur état 'done'
const sortCourses = () => {
  courses.value.sort((a, b) => Number(a.done) - Number(b.done));
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
};

// diminuer la quantité d'un produit
const decrement = (id) => {
  courses.value[id].quantity--;
  if (courses.value[id].quantity === 0) {
    courses.value.splice(id, 1);
  }
};

// Supprimer un produit
const deleteItem = (id) => {
  courses.value.splice(id, 1);
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