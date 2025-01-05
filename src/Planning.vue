<template>
  <div>
    <h1 style="margin-bottom: 50px;">Mon planning <i class="bi bi-calendar-date text-warning"></i></h1>
    <legend style="background-color: #e9cbb1;" class="text-center mb-2">Cliquer sur une date pour ajouter un événement</legend>

    <!-- FullCalendar -->
    <div id="calendar" class="text-uppercase"></div>

    <!-- Modal pour ajouter ou modifier un événement -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ selectedEvent ? "Modifier l'événement" : "Ajouter un événement" }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">Titre de l'événement :</label>
            <input type="text" id="title" v-model="eventTitle" required />
          </div>
          <div class="form-group">
            <label for="time">Heure de l'événement :</label>
            <input type="time" id="time" v-model="eventTime" required />
          </div>
          <button type="submit" class="btn btn-primary">{{ selectedEvent ? "Modifier" : "Ajouter" }}</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
        </form>
        <!-- Bouton supprimer seulement si un événement est sélectionné -->
        <button v-if="selectedEvent" class="btn btn-danger" @click="handleDelete">Supprimer l'événement</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';

export default {
  setup() {
    const events = ref(JSON.parse(localStorage.getItem('events')) || []);  // Chargement des événements depuis le localStorage
    const showModal = ref(false);
    const eventTitle = ref('');
    const eventTime = ref('');
    const selectedDate = ref(null);
    const selectedEvent = ref(null); // Référence à l'événement sélectionné
    let calendar = null;

    // Fonction pour ouvrir le modal
    const openModal = (date) => {
      if (selectedEvent.value) {
        // Si un événement est sélectionné, on pré-remplit les champs avec ses données
        eventTitle.value = selectedEvent.value.title;
        eventTime.value = new Date(selectedEvent.value.start).toTimeString().slice(0, 5);  // Format 'HH:mm'
      } else {
        // Si aucun événement n'est sélectionné, on laisse les champs vides
        eventTitle.value = '';
        eventTime.value = '';
      }
      
      selectedDate.value = date;
      showModal.value = true;
    };

    // Fonction pour fermer le modal
    const closeModal = () => {
      showModal.value = false;
      eventTitle.value = '';
      eventTime.value = '';
      selectedEvent.value = null;
    };

    // Fonction pour ajouter ou modifier l'événement
    const handleSubmit = () => {
      const [hours, minutes] = eventTime.value.split(':').map(Number);
      if (eventTitle.value && !isNaN(hours) && !isNaN(minutes)) {
        const eventDate = new Date(selectedDate.value);
        eventDate.setHours(hours, minutes);

        const updatedEvent = {
          id: selectedEvent.value ? selectedEvent.value.id : `event-${new Date().getTime()}`, // Si un événement est sélectionné, on garde son id
          title: eventTitle.value,
          start: eventDate.toISOString(),
        };

        // Si un événement est sélectionné, on met à jour l'événement existant
        if (selectedEvent.value) {
          const index = events.value.findIndex(event => event.id === selectedEvent.value.id);
          events.value[index] = updatedEvent;

          // Mettre à jour l'événement dans le calendrier
          const calendarEvent = calendar.getEventById(selectedEvent.value.id);
          if (calendarEvent) {
            calendarEvent.setProp('title', eventTitle.value);
            calendarEvent.setStart(eventDate);
          }
        } else {
          // Sinon, c'est un nouvel événement
          events.value.push(updatedEvent);
          if (calendar) {
            calendar.addEvent(updatedEvent);
          }
        }

        // Sauvegarder les événements dans localStorage
        localStorage.setItem('events', JSON.stringify(events.value));

        closeModal();
      } else {
        alert("L'heure ou le titre de l'événement n'est pas valide.");
      }
    };

    // Fonction pour supprimer l'événement
    const handleDelete = () => {
      if (selectedEvent.value) {
        // Supprimer l'événement de la liste en utilisant son id
        events.value = events.value.filter(event => event.id !== selectedEvent.value.id);

        // Mettre à jour le calendrier
        if (calendar) {
          const calendarEvent = calendar.getEventById(selectedEvent.value.id);
          if (calendarEvent) {
            calendarEvent.remove();
          }
        }

        // Sauvegarder les événements mis à jour dans localStorage
        localStorage.setItem('events', JSON.stringify(events.value));

        closeModal(); // Fermer le modal après la suppression
      }
    };

    // Fonction pour mettre à jour la vue du calendrier selon la taille de l'écran
    const updateCalendarView = () => {
      if (calendar) {
        const newIsSmallScreen = window.innerWidth < 768;
        const newView = newIsSmallScreen ? 'listWeek' : 'dayGridMonth';
        if (calendar.view.type !== newView) {
          calendar.changeView(newView);
        }

        // Recharger les événements depuis le localStorage
        events.value = JSON.parse(localStorage.getItem('events')) || [];
        calendar.removeEventSource(events.value);  // Retirer la source d'événements existante
        calendar.addEventSource(events.value);  // Ajouter la nouvelle source d'événements
        calendar.refetchEvents();  // Forcer le rechargement des événements
      }
    };

    onMounted(() => {
      const calendarEl = document.getElementById('calendar');
      const isSmallScreen = window.innerWidth < 768;

      // Attache l'événement de redimensionnement
      window.addEventListener('resize', updateCalendarView);

      calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin, listPlugin],
        initialView: isSmallScreen ? 'listWeek' : 'dayGridMonth',
        locale: frLocale,
        events: events.value,
        dateClick: (info) => {
          openModal(info.date);  // Ouvrir le modal quand on clique sur une date
        },
        eventClick: (info) => {
          selectedEvent.value = info.event;  // Référence à l'événement cliqué pour le modifier
          openModal(info.event.start);  // Ouvrir le modal avec la date de l'événement
        }
      });

      calendar.render();
    });

    onUnmounted(() => {
      // Nettoyer l'événement de redimensionnement
      window.removeEventListener('resize', updateCalendarView);
    });

    return {
      events,
      showModal,
      eventTitle,
      eventTime,
      openModal,
      closeModal,
      handleSubmit,
      handleDelete,
      selectedEvent,
    };
  },
};
</script>

<style>
/* Styles pour le Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal-content {
  background: rgb(74, 195, 163);
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

@media (max-width: 768px) {
  .modal-content {
    width: 80%;  /* Le modal occupe 80% de la largeur sur les petits écrans */
    max-width: 400px;
  }
}

.fc-toolbar-chunk{
  display: none;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
}

input {
  padding: 8px;
  margin-top: 5px;
  font-size: 1em;
  border-radius: 5px;
}

button {
  padding: 10px;
  margin: 0 5px;
  font-size: 1.2em;
}

button.btn-secondary {
  background-color: #ccc;
  border: none;  
  color: #0c100f;
  margin-bottom: 5px;
}

button.btn-primary {
  background-color: #4b5499;
  color: white;
  border: none;
  margin-bottom: 5px;
}

button.btn-primary:hover {
  background-color: #8db6ef;
  color: #000000;
}
</style>
