<template>
	<form>
    <p>
      <label for="url">Url:</label>
		  <input type="url" name="url" id="url" v-model="link.url" size="50"/>
		</p>
    <p>
      <label for="notes">Notes:</label>
		  <textarea rows="4" cols="50" size="50" id="notes" name="notes" v-model="link.notes" />
		</p>
    <p>
		  <button type="submit">Send</button>
    </p>
		{{ link }}
	</form>
</template>

<script>
export default {
  data () {
    return {
      link: {
      	url: '',
      	notes: '',
      	tags: ''
      }
    }
  }
}
</script>

<style scoped>
label {
  display: inline-block;
  width: 100px;
  text-align: left;
}

input, textarea {
  width: 200px;
  vertical-align: top;
}
</style>
