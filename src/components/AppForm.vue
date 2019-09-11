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
		{{ link }}
    <div id="preview" v-if="link.url">
      <link-prevue :url="link.url">
        <template slot-scope="props">
          <div class="card">
            <img class="card-img-top" v-if="showImage" :src="props.img" :alt="props.title">
            <div class="card-block">
              <h4 class="card-title" v-if="showTitle" v-text="removeDiacritics(props.title)"></h4>
              <p class="card-text" v-if="showDescription" v-text="removeDiacritics(props.description)"></p>
            </div>
          </div>
        </template>
      </link-prevue>
    </div>
    <div v-if="link.url" class="card">
      <label for="showTitle">Title</label>
      <input type="checkbox" name="showTitle" id="showTitle" v-model="showTitle">
      <label for="showDescription">Description</label>
      <input type="checkbox" name="showDescription" id="showDescription" v-model="showDescription">
      <label for="showImage">Image</label>
      <input type="checkbox" name="showImage" id="showImage" v-model="showImage">
    </div>
    <p>
      <button @click.prevent="testme">Send</button>
    </p>
	</form>
</template>

<script>
import LinkPrevue from 'link-prevue'

export default {
  components: {
    LinkPrevue
  },
  data () {
    return {
      link: {
      	url: '',
      	notes: '',
      	tags: ''
      },
      showDescription: true,
      showTitle: true,
      showImage: true
    }
  },
  methods: {
    testme() {
      Object.assign(this.link, this.$children[0].response)
      console.log(this.link)
    },
    removeDiacritics(str){
      let map = {
        'a': 'ă|â|ă',
        'i': 'î',
        's': 'ș|ș',
        't': 'ț',
      }
      str = str.toLowerCase()
      for (var pattern in map) {
          str = str.replace(new RegExp(map[pattern], 'g'), pattern);
      }
      console.log(str)
      return str
    }
  }
}
</script>

<style scoped>
form {
  width: 350px;
  margin: 0 auto;
}
#preview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1em;
}

.card {
  padding: 1em;
  flex: 1 0 350px;
  border: 1px solid #434343;
  background: #ECE9E6;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #FFFFFF, #ECE9E6);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #FFFFFF, #ECE9E6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  display: flex;
}

.card-img-top, .card-block{
  width: 300px;
  height: auto;
}

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
