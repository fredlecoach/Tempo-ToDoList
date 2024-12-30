<template>
<label>
  <input type="checkbox" />
  {{ name }} 
  {{ surname }} {{ age }} ans
</label>
</template>

<script setup>

const props = defineProps({
  name: String,
  surname: String,
  age : Number

})

console.log(props.label)

</script>