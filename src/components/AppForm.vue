<template>
  <div id="container">
    <form @submit.prevent class="input-form">
      <div>
        <fieldset>
          <label for="url">Url: &nbsp;</label>
          <input type="text" name="url" id="url" v-model.lazy="link.url" contenteditable="true" :disabled="isValidUrl" placeholder="Paste your link here" style="width: 100%"
          />
        </fieldset>
      </div>
      <div id="tagsAndNotes">
        <fieldset id="tags">
          <label for="tag">Tag: &nbsp;</label>
          <select name="tag" id="tag" v-model="userInput.tag">
            <option value="" selected disabled>Choose</option>
            <option v-for="option in tags" v-bind:value="option" :key="option">
              {{ option }}
            </option>
          </select>
          <label for="newTag">or:</label>
          <input type="text" v-model="newTag">
          <button @click.prevent="addTag" class="smallbtn" :disabled="!newTag">Add</button>
        </fieldset>
        <fieldset id="notes">
          <label for="notes">Notes:</label>
          <input type="text" name="notes" v-model="userInput.notes" placeholder="Write some notes" style ="width: 100px;"/>
        </fieldset>
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
        Save:
        <fieldset>
          <label for="showTitle">Title</label>
          <input type="checkbox" name="showTitle" id="showTitle" v-model="show.title">
        </fieldset>
        <fieldset>
          <label for="showDescription">Description</label>
          <input type="checkbox" name="showDescription" id="showDescription" v-model="show.description">
        </fieldset>
        <fieldset>
          <label for="showImage">Image</label>
          <input type="checkbox" name="showImage" id="showImage" v-model="show.images">
        </fieldset>
      </div>
      <div v-if="isValidUrl" class="btnRow">
        <button @click.prevent="reset" class="resetBtn">Reset</button>
        <button type="submit" @click.prevent="send" class="submitBtn">Send</button>
      </div>
      <div v-if="requestWasMade && !isValidUrl">
        "Not a valid url"
      </div>
    </form>
    <div id="resultsTable" v-if="userResults">
      <h1>Your links</h1>
      <table>
        <tr v-for="item in userResults" :key="item.url">
          <td><img :src="item.images[0]" style="height: 100px; width: 100px; border-radius: 50px; object-fit: cover"></td>
          <td>
            <p><h3 style="text-align: left">{{ item.title }}</h3></p>
            <br/>
            <p style="text-align: left">{{ item.description }}</p>
          </td>
          <td><button class="bk-red" @click="deleteItem(item)">X</button></td>
        </tr>
      </table>
    </div>
    <div v-if="isSending">Please wait...</div>
    <!-- <div v-if="!isSending && !userResults" style="color: red">Add some links</div> -->
  </div>
</template>

<script>
import Vue from 'vue'
import LinkPrevue from 'link-prevue'
import * as firebase from 'firebase'
import { db } from '@/main'
import { store, mutations } from "../store"

export default {
  components: {
    LinkPrevue
  },
  mounted() {
    this.getUserData()
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
      tags: null,
      newTag: null,
      isValidUrl: false,
      userResults: null,
      isSending: false,
      response: null // use to restore values in send btn options
    }
  },
  computed: {
   user () {
    return store.user
   },
   isLoggedIn () {
    return store.isLoggedIn
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
    deleteItem (item) {
       db.collection('users').doc(this.user).update(
        {'links': firebase.firestore.FieldValue.arrayRemove(item)}
      )
      this.getUserData()
    },
    getUserData () {
        let user = this.user

        // this is for page reload, mostly for testing purposes
        if (!this.user) user = localStorage.getItem('user')
        mutations.setUser(user)
        // end of work-around

        db.collection('users').doc(user).get().then((snapshot) => {
        if (snapshot.exists) {
          this.userResults = snapshot.data().links
          this.tags = snapshot.data().tags
          console.log(6, this.userResults)
        } else {
          db.collection('users').doc(this.user).set({
            links: [],
            tags: []
          })
        }
      })
    },
    send () {
      this.isSending = true

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

      toSend.url = this.link.url    // also add the url
      let user = this.user
      db.collection('users').doc(user).get().then(doc => {
        db.collection('users').doc(user).update({
          links: firebase.firestore.FieldValue.arrayUnion(toSend)
        })
        .then(() => {
          db.collection('users').doc(user).get().then((snapshot) => {
            this.userResults = snapshot.data().links
            this.isSending = false
          })
        })
      }).then(() => {
        Object.assign(this.$data, this.$options.data.apply(this))
        }
      )
    },
    addTag () {
      if (!this.newTag) return false
      let user = this.user
      db.collection('users').doc(user).get().then(doc => {
        db.collection('users').doc(user).update({
          tags: firebase.firestore.FieldValue.arrayUnion(this.newTag)
        })
        .then(() => { 
          db.collection('users').doc(user).get().then((snapshot) => {
            this.tags = snapshot.data().tags
          })
        })
        .then(() => {
          this.userInput.tag = this.newTag
        })
        .then(() => {
          this.newTag = null
        })
      })
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
