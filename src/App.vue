<template>
  <div class="app-layout">
    <!-- Colonne verte fixe sur la gauche -->
    <div class="sidebar">
      <span class="navbar-brand">
        <img src="./styles/images/logoTempo.png" alt="logo tempo" />
      </span>

      <!-- Bouton menu burger -->
      <button 
        class="btn navbar-toggler burger" 
        type="button" 
        @click="toggleNav"
        aria-label="Toggle navigation"
      >
        <button class="navbar-toggler-icon btn text-dark fw-bold" @click="toggleMenu">{{ menu }}
        </button>
      </button>

      <Transition>
      <!-- Navigation (affichée ou masquée selon l'état) -->
      <nav v-if="afficherNav" class="navbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" active-class="nav-link-active">Liste de courses</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/repas" active-class="nav-link-active">Repas de la semaine</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/recettes" active-class="nav-link-active">Mes recettes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/planning" active-class="nav-link-active">Mon planning</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/admin" active-class="nav-link-active">Tâches administratives</RouterLink>
          </li>
        </ul>
      </nav>
    </Transition>

    </div>

    <!-- Contenu principal -->
    <div class="main-content container">
      <!-- Le contenu de la route sélectionnée sera affiché ici -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// État pour gérer l'affichage de la navigation
const afficherNav = ref(false);

// Fonction pour inverser l'état d'affichage
const toggleNav = () => {
  afficherNav.value = !afficherNav.value;
};

// affichage menu
const menu = ref('=');

// Fonction pour alterner l'état du menu entre '=' et 'X'
const toggleMenu = () => {
  menu.value = menu.value === '=' ? 'X' : '=';
};
</script>

<style scoped>
/* Conteneur principal qui contient la sidebar et le contenu principal */
.app-layout {
  display: flex;
  height: 100vh; /* La hauteur de la fenêtre */
  overflow: hidden; /* Évite tout débordement si le contenu est trop long */
}

/* Colonne verte (sidebar) */
.sidebar {
  width: 35%; /* Largeur fixe de la colonne verte */
  background-color: #083731;
  color: #e9cbb1;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrer le contenu horizontalement */
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optionnel : donne un effet de séparation */
}

/* liens de navigation */
.nav-link {
  text-decoration: none;
  color: #e9cbb1;
  font-weight: bold;
}

.nav-link:hover {
  color: #73d298;
}

/* Classe active personnalisée pour le lien actif */
.nav-link-active {
  color: #f5f5f5 !important;
  background-color: #73d298; /* Optionnel : ajouter un fond pour le lien actif */
  border-radius: 5px;
  text-align: center;
  padding: 10px;
}

/* Logo */
.navbar-brand img {
  max-width: 100%; /* Taille du logo */
  margin-bottom: 20px;
}

/* Bouton menu burger */
.burger {
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px;
}

/* Icône du menu burger */
.navbar-toggler-icon {
  display: block;
  width: 70px;
  height: 40px;
  color: #083731;
  background-color: #e9cbb1;
  margin: 5px 0;
}

.navbar-toggler-icon:hover {
  background-color: #73d298;
}

/* Menu de navigation */
.navbar {
  margin-top: 20px;
  background-color: transparent;
  width: 100%;
}

.nav-item {
  margin: 10px 0;
  list-style: none;
}

/* Contenu principal */
.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

/* Design et gestion du bouton */
.bouton {
  background-color: #083731;
  color: #e9cbb1;
}

.bouton:hover {
  background-color: #73d298;
  color: #083731;
}

/* effet de transition du menu */
.v-enter-from, .v-leave-to{
  opacity: 0;
  transform: translateX(10px);
}

.v-enter-active, .v-leave-active{
  transition: .7s ;
}
</style>
