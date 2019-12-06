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
        this.$emit('deleted')
      })
    }
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
  color: teal;
}
</style>