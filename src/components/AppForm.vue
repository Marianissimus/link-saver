<template>
  <div id="container">
  	<form @submit.prevent>
      <div id="formInputs">
        <p>
          <label for="url">Url: &nbsp;</label>
    		  <input type="url" name="url" id="url" v-model.lazy="link.url" size="26" contenteditable="true" :disabled="isValidUrl"
          placeholder="Paste your link here"
          />
          <label for="tag">Tag: &nbsp;</label>
          <select name="tag" id="tag" v-model="userInput.tag">
            <option value="" selected disabled>Choose</option>
            <option v-for="option in tags" v-bind:value="option" :key="option">
              {{ option }}
            </option>
          </select>
        </p>
        <p>
          <label for="notes">Notes: &nbsp;</label>
    		  <textarea rows="4" cols="48" size="48" id="notes" name="notes" v-model="userInput.notes" placeholder="Write some notes" />
    		</p>
      </div>
      <div id="preview" v-if="link.url">
        <link-prevue :url="link.url" ref="prevue" @hook:updated="update">
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
      <div id="options" v-if="isValidUrl" class="card options">
        <label for="showTitle">Title</label>
        <input type="checkbox" name="showTitle" id="showTitle" v-model="show.title">
        <label for="showDescription">Description</label>
        <input type="checkbox" name="showDescription" id="showDescription" v-model="show.description">
        <label for="showImage">Image</label>
        <input type="checkbox" name="showImage" id="showImage" v-model="show.images">
      </div>
      <div v-if="isValidUrl" class="btnRow">
        <button @click.prevent="reset" class="resetBtn">Reset</button>
        <button type="submit" @click.prevent="send" class="submitBtn">Send</button>
      </div>
      <div v-if="requestWasMade && !isValidUrl">
        "Not a valid url"
      </div>
  	</form>
  </div>
</template>

<script>
import Vue from 'vue'
import LinkPrevue from 'link-prevue'
import * as firebase from 'firebase'

export default {
  components: {
    LinkPrevue
  },
  data () {
    return {
      link: this.getEmptyLink(),
      userInput: this.getEmptyInput(),
      requestWasMade: false,
      show: {
        description: true,
        title: true,
        images: true
      },
      tags: ['music', 'vue js', 'javascript'],
      isValidUrl: false,
      response: null // use to restore values in send btn options
    }
  },
  methods: {
    getEmptyLink () {
      return { 
        url: '',
        title: '',
        description: '',
        images: '',
      }
    },
    getEmptyInput () {
      return {
        notes: '',
        tag: '',
      }
    },
    update () {
      this.isValidUrl = this.$refs.prevue.validUrl
      this.response = this.$refs.prevue.response
      this.requestWasMade = true
      delete this.response.url
      for (let el in this.response){
        Vue.set(this.link, el, this.response[el])
      }
    },
    send () {
      let toSend = {}
      // send only values that are shown
      for (let el in this.link){
        if (this.show[el] === true) {
          toSend[el] = this.link[el]
        }
      }
      // send userInput values, if any
      for (let el in this.userInput) {
        if (this.userInput[el]) {
          toSend[el] = this.userInput[el]
        }
      }
      // also add the url
      toSend.url = this.link.url
      console.log('user is: ', this.$user, ' to send is: ', toSend)
      // reset data
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    reset () {
      this.link = this.getEmptyLink()
      this.userInput = this.getEmptyInput()
      this.isValidUrl = false
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
  width: 90vw;
  min-width: 400px;
  max-width: 600px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
}

#formInputs, #preview {
 flex: 1 0 400px;
 flex-direction: column;
 display: flex;
 padding: 1em;
 overflow: hidden;
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
  padding: 1em;
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
  color: green;
}

button {
  padding: 1em;
  border-radius: 1em;
  background-color: #333;
  color: white;
  cursor: pointer
}

.submitBtn {
background-color: green;
}

.resetBtn {
  background-color: #555;
}
</style>
