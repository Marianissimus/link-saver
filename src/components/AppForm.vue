<template>
  <div class="container main">
    <form @submit.prevent class="input-form">
      <div>
        <fieldset>
          <label for="url">Url: &nbsp;</label>
          <input type="text" name="url" id="url" v-model.lazy="link.url" contenteditable="true" :disabled="isValidUrl" placeholder="Paste your link here" style="width: 100%"
          />
        </fieldset>
      </div>
      <div>
        <fieldset id="notes">
          <label for="notes">Notes:</label>
          <input type="text" name="notes" v-model="userInput.notes" placeholder="Some personal notes, if any" style ="width: 100%;"/>
        </fieldset>
      </div>
      <div id="tags">
        <fieldset>
          <label for="tag">Tag: &nbsp;</label>
          <select name="tag" id="tag" v-model="userInput.tag">
            <option value="" selected disabled>Choose</option>
            <option v-for="option in tags" v-bind:value="option" :key="option">
              {{ option }}
            </option>
          </select>
        </fieldset>
        <fieldset>
          <label for="newTag">or:</label>
          <input type="text" v-model="newTag">
          <button @click.prevent="addTag" class="smallbtn bk-green" :disabled="!newTag">Add</button>
          <button class="bk-orange smallbtn" style="width: 60px;" @click="showTagsModal = true"><i class="material-icons" style="font-size: 14px; margin-top: 5px">edit</i><br/>Edit Tags</button>
        </fieldset>
      </div>
      <div id="preview" v-if="link.url">
        <link-prevue :url="link.url" ref="prevue" @hook:updated="update">ƒ
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
      <div id="options" v-if="isValidUrl" class="options">
        <span>Save:</span>
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
        <button @click.prevent="reset" class="bk-red submitBtn">
          <span v-if="isEditMode">Cancel</span>
          <span v-else>Reset</span>
        </button>
        <button type="submit" @click.prevent="save" class="bk-green submitBtn">
          <span v-if="isEditMode">Update</span>
          <span v-else>Save</span>
        </button>
      </div>
    </form>
    <div v-if="userResults">
      <h1>Your links</h1>
      <table id="resultsTable" rules="none">
        <tr v-for="item in userResults" :key="item.url">
          <td><img :src="item.images[0]" style="height: 100px; width: 100px; border-radius: 50px; object-fit: cover"></td>
          <td>
            <p v-if="item.tag" style="text-align: right"><span style="font-size: 12px">in: {{ item.tag }}</span></p>
            <p v-if="item.title"><h3 style="text-align: left">{{ item.title }}</h3></p>
            <br/>
            <p style="text-align: left" v-if="item.description">{{ item.description }}</p>
            <br />
            <p style="text-align: right; font-size: 12px" v-if="item.notes">notes: {{ item.notes }}</p>
          </td>
          <td>
            <button class="bk-green smallbtn"><a :href="item.url" target="_blanc"><i class="material-icons" style="font-size: 14px; margin-top: 5px;">open_in_new</i><br/>Open</a></button>
            <button class="bk-orange smallbtn" @click="editItem(item)"><i class="material-icons" style="font-size: 14px; margin-top: 5px;">edit</i><br/>Edit</button>
            <button class="bk-red smallbtn" @click="deleteItem(item)"><i class="material-icons" style="font-size: 14px; margin-top: 5px;">delete</i><br/>Delete</button>
          </td>
        </tr>
      </table>
    </div>
    <DeleteModal v-if="showModal" @close="showModal = false; itemToDelete = null" @confirmDelete="removeItem">
      <template v-slot:header>Are you sure?</template>
    </DeleteModal>

    <TagsModal v-if="showTagsModal" @close="showTagsModal = false" :tags="tags" :user="user" @deleted="getUserData">
      <template v-slot:header>Tag editor</template>
    </TagsModal>


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
import DeleteModal from './DeleteModal'
import TagsModal from './TagsModal'

export default {
  components: {
    LinkPrevue, DeleteModal, TagsModal
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
      showModal: false,
      itemToDelete: null,
      isEditMode: false,
      showTagsModal: false,
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
        this.showModal = true
        this.itemToRemove = item
    },
    removeItem () {
       db.collection('users').doc(this.user).update(
        {'links': firebase.firestore.FieldValue.arrayRemove(this.itemToRemove)}
      ).then(() => {
        this.showModal = false;
        this.getUserData()
      })
    },
    editItem (item) {
      this.itemToRemove = item
      this.isEditMode = true
      this.userInput = {
        tag: item.tag,
        notes: item.notes
      }
      this.link.url = item.url
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
        } else {
          db.collection('users').doc(this.user).set({
            links: [],
            tags: []
          })
        }
      })
    },
    save () {
      if (this.isEditMode) {
        db.collection('users').doc(this.user).update(
        {'links': firebase.firestore.FieldValue.arrayRemove(this.itemToRemove)}
        )
        this.isEditMode = false
      }
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
    deleteTag () {
      console.log('delete in app form')
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
