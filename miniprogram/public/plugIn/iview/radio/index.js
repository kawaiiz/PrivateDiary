const prefixCls = 'i-radio';

Component({
  externalClasses: ['i-class'],
  relations: {
    '../radio-group/index': {
      type: 'parent'
    }
  },
  properties: {
    value: {
      type: String,
      value: ''
    },
    checked: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    color: {
      type: String,
      value: '#2d8cf0'
    },
    position: {
      type: String,
      value: 'left', //left right
      observer: 'setPosition'
    }
  },
  data: {
    checked: true,
    positionCls: `${prefixCls}-radio-left`,
  },
  attached() {
    this.setPosition();
  },
  methods: {
    changeCurrent(current) {
      this.setData({
        checked: current
      });
      console.log(this.data)
    },
    radioChange() {
      if (this.data.disabled) return;
      let item = {};
      if (this.data.checked) {
        item = {
          current: false,
          value: ''
        }
      } else {
        item = {
          current: true,
          value: this.data.value
        }
      }
      const parent = this.getRelationNodes('../radio-group/index')[0];
      if (parent) {
        parent.emitEvent(item)
      } else {
        this.triggerEvent('change', item);
      }
    },
    setPosition() {
      this.setData({
        positionCls: this.data.position.indexOf('left') !== -1 ? `${prefixCls}-radio-left` : `${prefixCls}-radio-right`,
      });
    }
  }
});