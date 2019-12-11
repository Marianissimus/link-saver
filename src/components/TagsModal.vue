<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <ul>
                <li v-for="tag in tags">
                  <span>{{ tag }}</span>
                  <button class="bk-red smallbtn" @click="deleteItem(tag)"><i class="material-icons" style="font-size: 14px; margin-top: 5px;">delete</i><br/>Delete</button>
                </li>
              </ul>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="bk-green smallbtn" @click="$emit('close')">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import * as firebase from 'firebase'
import { db } from '@/main'

export default {
  props: ['tags', 'user'],
  methods: {
    deleteItem(tag) {
      db.collection('users').doc(this.user).update(
        {'tags': firebase.firestore.FieldValue.arrayRemove(tag)}
      ).then(() => {
        this.$emit('deleted', tag)
      })
    }
  }
}
</script>

<style scoped>
ul {
  padding: 0;
}
li {
  list-style-type: none;
  color: teal;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .3em;
}
li:nth-of-type(odd){
  background: #E0EAFC;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #CFDEF3, #E0EAFC);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #CFDEF3, #E0EAFC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
li:nth-of-type(even){
 background: #D3CCE3;  /* fallback for old browsers */
 background: -webkit-linear-gradient(to right, #E9E4F0, #D3CCE3);  /* Chrome 10-25, Safari 5.1-6 */
 background: linear-gradient(to right, #E9E4F0, #D3CCE3); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

</style>