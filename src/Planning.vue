<script>
import { ref, onMounted } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // Nécessaire pour gérer les interactions comme dateClick
import frLocale from '@fullcalendar/core/locales/fr' // Localisation française

export default {
  setup() {
    const events = ref([])
    const newEvent = ref({
      title: '',
      date: '',
      time: ''
    })
    let calendar = null

    const addEventDirectly = (date) => {
      const title = prompt("Entrez le titre de l'événement :") // Boîte de dialogue pour demander le titre
      const time = prompt("Entrez l'heure de l'événement (HH.MM, format 24h) => ex : 14.30") // Boîte de dialogue pour l'heure

      if (title && time) {
        const [hours, minutes] = time.split('.').map(Number) // Extraire les heures et minutes

        // Vérifier si l'heure est valide
        if (
          !isNaN(hours) && !isNaN(minutes) &&
          hours >= 0 && hours < 24 &&
          minutes >= 0 && minutes < 60
        ) {
          const eventDate = new Date(date) // Copier la date sélectionnée
          eventDate.setHours(hours, minutes) // Ajouter les heures et minutes

          const event = {
            title,
            start: eventDate.toISOString(), // Convertit la date complète en format ISO
          }
          events.value.push(event)

          // Ajouter l'événement au calendrier
          if (calendar) {
            calendar.addEvent(event)
          }
        } else {
          alert("L'heure saisie n'est pas valide. Veuillez entrer une heure au format HH:MM.")
        }
      }
    }

    onMounted(() => {
      const calendarEl = document.getElementById('calendar')
      calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin], // Ajout du plugin d'interaction
        initialView: 'dayGridMonth',
        locale: frLocale, // Localisation en français
        events: events.value, // Liste des événements
        dateClick: (info) => {
          addEventDirectly(info.date) // Appelé lors d'un clic sur une case
        },
      })
      calendar.render()
    })

    return {
      events,
    }
  },
}
</script>

<template>
  <div>
    <h1 style="margin-bottom: 50px;">Planning <i class="bi bi-calendar-date"></i></h1>
    <legend style="background-color: #e9cbb1;" class="text-center mb-2">Cliquer sur une date pour ajouter un événement</legend>
    <!-- FullCalendar -->
    <div id="calendar" class="text-uppercase"></div>
  </div>
</template>

<style>
.bouton {
  background-color: #083731;
  color: #e9cbb1;
}

.bouton:hover {
  background-color: #73d298;
  color: #083731;
}

#calendar{
  max-width: 900px;
  margin: 0 auto;
}

</style>
