<template>
  <transition name="modal">
    {{ item }}
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="bk-red smallbtn" @click="$emit('close')">Cancel</button>
              <button class="bk-green smallbtn" @click="$emit('confirmDelete')">OK</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['item']
}
</script>