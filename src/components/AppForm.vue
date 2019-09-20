<template>
  <div id="container">
  	<form>
      <div id="formInputs">
        <p>
          <label for="url">Url:</label>
    		  <input type="url" name="url" id="url" v-model.lazy="link.url" size="50" contenteditable="true"/>
    		</p>
        <p>
          <label for="notes">Notes: &nbsp </label>
    		  <textarea rows="4" cols="48" size="48" id="notes" name="notes" v-model="userInput.notes" />
    		</p>
      </div>
      <div id="preview" v-if="link.url">
        <link-prevue :url="link.url" ref="prevue" @hook:beforeUpdate="update">
          <template slot-scope="props">
            <div class="card">
              <img class="card-img-top" v-if="show.images" :src="props.img" :alt="props.title">
              <div class="card-block">
                <h4 class="card-title" v-if="show.title" v-text="removeDiacritics(props.title)"></h4>
                <p class="card-text" v-if="show.description" v-text="removeDiacritics(props.description)"></p>
              </div>
            </div>
          </template>
        </link-prevue>
      </div>
      <div v-if="isValidUrl" class="card options">
        <label for="showTitle">Title</label>
        <input type="checkbox" name="showTitle" id="showTitle" v-model="show.title" @change="filter('title')">
        <label for="showDescription">Description</label>
        <input type="checkbox" name="showDescription" id="showDescription" v-model="show.description" @change="filter('description')">
        <label for="showImage">Image</label>
        <input type="checkbox" name="showImage" id="showImage" v-model="show.images" @change="filter('images')">
        <div>{{ link }}</div>
        <p>
          <button type="submit" @click.prevent="send">Send</button>
        </p>
      </div>
<!--       <div v-else>
        "Not a valid url"
      </div> -->
  	</form>
  </div>
</template>

<script>
import Vue from 'vue'
import LinkPrevue from 'link-prevue'

export default {
  components: {
    LinkPrevue
  },
  data () {
    return {
      link: {
      	url: '',
        title: '',
        description: '',
        images: '',
      },
      userInput: {
        notes: '',
        tags: '',
      },
      show: {
        description: true,
        title: true,
        images: true
      },
      isValidUrl: false,
      response: null // use to restore values in send btn options
    }
  },
  methods: {
    update () {
      this.isValidUrl = this.$refs.prevue.validUrl
      this.response = this.$refs.prevue.response
      delete this.response.url
      for (let el in this.response){
        this.link[el] = this.response[el]
      }
    },
    filter (ev) {
      this.link = {title: ev}
      // this.link[ev] = this.response[ev] : this.link[ev] = 'fuck you'
    },
    send () {
      console.log(2, this.link)
    },
    removeDiacritics (str) {
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
