<template>
  <v-app>
    <v-app-bar
    app
    color="#A1A7C4"
    elevation="0"
    >
    </v-app-bar>

    <v-main class="wrapper">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style scoped>
.wrapper{
  background: #F5F6FA;
}
</style>
