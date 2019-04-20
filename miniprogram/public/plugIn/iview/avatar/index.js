Component({
    externalClasses: ['i-class'],

    properties: {
        // circle || square
        shape: {
            type: String,
            value: 'circle' 
        },
        // small || large || default
        size: {
            type: String,
            value: 'default'
        },
        src: {
            type: String,
            value: ''
        },
        disabled: {
          type: Boolean,
          value: false
        }
    },
    methods: {
      handleTap() {
        if (this.data.disabled) return false;
   
        this.triggerEvent('click');
      }
    }
});
