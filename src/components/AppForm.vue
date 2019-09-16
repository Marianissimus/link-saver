<template>
  <div id="container">
  	<form>
      <div id="formInputs">
        <p>
          <label for="url">Url:</label>
    		  <input type="url" name="url" id="url" v-model.lazy="link.url" size="50" @paste="checkValid()" contenteditable="true"/>
    		</p>
        <p>
          <label for="notes">Notes: &nbsp </label>
    		  <textarea rows="4" cols="48" size="48" id="notes" name="notes" v-model="link.notes" />
    		</p>
    		{{ link }} / isValid: {{ isUrlValid }}
      </div>
      <div id="preview" v-if="link.url">
        <link-prevue :url="link.url">
          <template slot-scope="props">
            <div class="card">
              <img class="card-img-top" v-if="show.image" :src="props.img" :alt="props.title">
              <div class="card-block">
                <h4 class="card-title" v-if="show.title" v-text="removeDiacritics(props.title)"></h4>
                <p class="card-text" v-if="show.description" v-text="removeDiacritics(props.description)"></p>
              </div>
            </div>
          </template>
        </link-prevue>
      </div>
      <div v-if="isUrlValid" class="card options">
        <label for="showTitle">Title</label>
        <input type="checkbox" name="showTitle" id="showTitle" v-model="show.title" @change="filter('title')">
        <label for="showDescription">Description</label>
        <input type="checkbox" name="showDescription" id="showDescription" v-model="show.description" @change="filter('description')">
        <label for="showImage">Image</label>
        <input type="checkbox" name="showImage" id="showImage" v-model="show.image" @change="filter('image')">
        <p>
          <button type="submit" @click.prevent="testme()">Send</button>
        </p>
      </div>
<!--       <div v-else>
        "Not a valid url"
      </div> -->
  	</form>
  </div>
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
      show: {
        description: true,
        title: true,
        image: true
      },
      isUrlValid: false
    }
  },
  methods: {
    filter(ev) {
      this.show[ev] === true ? this.link[ev] = 'yup' : delete this.link[ev]
      console.log(this.link)
    },
    async checkValid() {
      let response = await this.$children[0].validUrl
      console.log(response)
    },
    testme() {
      // Object.assign(this.link, this.$children[0].response)
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
      return str
    }
  }
}
</script>

<style scoped>
#container {
  padding: 1em;
  width: 60vw;
  min-width: 400px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  border: 1px dashed grey;
}

#formInputs, #preview {
 flex: 1 0 400px;
 flex-direction: column;
 display: flex;
 padding: 1em;
}

#formInputs p {
  display: flex;
  justify-content: space-between;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed #232323;
}

.card-img-top, .card-block{
  max-width: 300px;
  height: auto;
}

.options {
  flex-direction: row;
  justify-content: space-around;
  background: none;
  border: none;
}

button {
  padding: 1em;
  border-radius: 1em;
  background-color: #333;
  color: white;
}

</style>
