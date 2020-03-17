<template>
  <div class="container main">
    <form @submit.prevent class="input-form" ref="editor">
      <div>
        <fieldset>
          <label for="url">Url: &nbsp;</label>
          <input type="text" name="url" id="url" v-model="link.url" contenteditable="true" :disabled="isValidUrl" placeholder="Paste your link here" style="width: 100%"
          />
        </fieldset>
      </div>
      <div>
        <div v-if="link.url">
          <fieldset>
            <label for="notes">Notes:</label>
            <input type="text" name="notes" v-model="userInput.notes" placeholder="Some personal notes, if any" style ="width: 100%;"/>
          </fieldset>
        </div>
        <div v-if="link.url" style="margin-left: 13px;">Tags:</div>
        <div v-if="link.url" id="tags" style="margin-top: -10px;">
          <fieldset v-if="tags.length">
            <select v-model="userInput.tag" id="tag" name="tag">
              <option value="" selected disabled>Choose</option>
              <option v-for="option in tags" v-bind:value="option" :key="option">
                {{ option }}
              </option>
            </select>
          </fieldset>
          <span>or</span>
          <fieldset>
            <input type="text" size="10" v-model="newTag">
            <button @click.prevent="addTag" class="smallbtn bk-green" :disabled="!newTag">Add</button>
            <button v-if="tags.length" class="smallbtn bk-red" id="deleteTagsbtn" @click="showTagsModal = true"><i class="material-icons">delete</i> &nbsp;Delete Tags</button>
          </fieldset>
        </div>
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
    <div v-if="userResults.length" class="resultsContainer">
      <div id="resultsOptions">
        <div v-if="tags.length">
          <fieldset style="border: none;">
            <label for="tagFilter"><span style="color: #232323">Show: &nbsp;</span></label>
            <select name="tagFilter" id="tagFilter" @change="filterResults($event.target.value)">
              <option selected value="all">All tags</option>
              <option v-for="option in tags" :key="option">
                {{ option }}
              </option>
              <option value="uncategorized">Uncategorized</option>
            </select>
          </fieldset>
        </div>
        <div>
          <button v-if="tags.length" class="smallbtn" id="deleteTagsbtn" @click="showTagsModal = true" style="color: #D62828; background-color: #F8F8F8"><i class="material-icons">delete</i> &nbsp;Delete Tags</button>
          <button v-if="filteredResults.length" class="smallbtn" id="deleteTagsbtn" @click="saveCsv" style="color: #187015; background-color: #F8F8F8"><i class="material-icons">save</i>&nbsp;Save CSV</button>
        </div>
      </div>
      <div id="results">
       <ul v-if="filteredResults.length">
        <li  v-for="item in filteredResults" :key="item.url">
         <div id="resultsImage" v-if="item.images"><img :src="item.images[0]">
         </div>
         <div v-else><span>No image</span></div>
         <div id="resultsText">
            <p v-if="item.tag" style="text-align: right"><span style="font-size: 12px">in: {{ item.tag }}</span></p>
            <p v-if="item.title"><h4 style="text-align: left">{{ item.title }}</h4></p>
            <br/>
            <p style="text-align: left; font-size: 14px" v-if="item.description">{{ item.description }}</p>
            <br />
            <p style="text-align: right; font-size: 12px" v-if="item.notes">notes: {{ item.notes }}</p>
            <p class="visibleWhenSmall" style="text-align: right;">
              <button class="smallbtn"><a :href="item.url" target="_blanc" style="color: #187015"><i class="material-icons">open_in_new</i><br/>Open</a></button>
              <button class="smallbtn" @click="editItem(item)" style="color: #C46500"><i class="material-icons">edit</i><br/>Edit</button>
              <button class="smallbtn" @click="deleteItem(item)"  style="color: #D62828"><i class="material-icons">delete</i><br/>Delete</button>
            </p>
          </div>
          <div id="resultsButtons">
            <button class="smallbtn"><a :href="item.url" target="_blanc" style="color: #187015"><i class="material-icons">open_in_new</i><br/>Open</a></button>
            <button class="smallbtn" @click="editItem(item)" style="color: #C46500"><i class="material-icons">edit</i><br/>Edit</button>
            <button class="smallbtn" @click="deleteItem(item)"  style="color: #D62828"><i class="material-icons">delete</i><br/>Delete</button>
          </div>
        </li>
       </ul>
         <div v-else>
          No links in here
         </div>
      </div>
    </div>
    <DeleteModal v-if="showModal" @close="showModal = false; itemToDelete = null" @confirmDelete="removeItem">
      <template v-slot:header>Are you sure?</template>
    </DeleteModal>

    <TagsModal v-if="showTagsModal" @close="showTagsModal = false" :tags="tags" :user="user" @deleted="deleteTag">
    </TagsModal>

    <div v-if="isSending">Please wait...</div>
  </div>
</template>

<script>
import Vue from 'vue'
import LinkPrevue from 'link-prevue'
import firebase from 'firebase/app'
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
      tags: [],
      newTag: null,
      isValidUrl: false,
      userResults: [],
      isSending: false,
      showModal: false,
      itemToDelete: null,
      isEditMode: false,
      showTagsModal: false,
      filteredResults: [],
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
    async editItem (item) {
      if (this.isEditMode) {
        await this.reset()
      }
      this.itemToRemove = item
      this.isEditMode = true
      this.userInput = {
        tag: item.tag,
        notes: item.notes
      }
      this.link.url = item.url
      this.$refs['editor'].scrollIntoView()
    },
    deleteTag (tag) {
      let tempResults = this.userResults
      for (let item of tempResults) {
        if (item.tag === tag) {
         delete item.tag
        }
      }
      // delete tags from links on server
      db.collection('users').doc(this.user).update(
        {'links': tempResults }
      )
      // update tags
      let user = this.user
      db.collection('users').doc(user).get().then((snapshot) => {
        if (snapshot.exists) {
          this.tags = snapshot.data().tags
        }
      })
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
          this.filteredResults = snapshot.data().links
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
            this.filteredResults = snapshot.data().links
            this.tags = snapshot.data().tags
            this.isSending = false
          })
        })
      })
      .then(() => {
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
    filterResults (tag) {
      if (tag === 'all') {
        this.filteredResults = this.userResults
      } else if (tag === 'uncategorized') {
        this.filteredResults = this.userResults.filter(el => !el.tag)
      } else {
        this.filteredResults = this.userResults.filter(el => el.tag === tag)
      }
    },
    reset () {
      this.link = this.getEmptyLink()
      this.userInput = this.getEmptyInput()
      this.isValidUrl = false
    },
    saveCsv () {
      let csv = [];
      // header row
      csv.push(
        [
          'title',
          'description',
          'image',
          'tag',
          'notes',
          'url'
        ]
      )

      for (let i=0; i<this.filteredResults.length; i++) {
        csv.push(
          [
            JSON.stringify(this.filteredResults[i].title),
            JSON.stringify(this.filteredResults[i].description),
            JSON.stringify(this.filteredResults[i].images),
            JSON.stringify(this.filteredResults[i].tag),
            JSON.stringify(this.filteredResults[i].notes),
            JSON.stringify(this.filteredResults[i].url)
          ]
        )
      }

    // Download CSV file
      this.downloadCSV(csv.join("\n"), 'linksaver.csv');
    },
    downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;

        // CSV file
        csvFile = new Blob([csv], {type: "text/csv"});

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = filename;

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide download link
        downloadLink.style.display = "none";

        // Add the link to DOM
        document.body.appendChild(downloadLink);

        // Click download link
        downloadLink.click();
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
